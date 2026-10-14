import { SessionConfig, SessionMetrics } from './types';
import { StateMachine } from './state';
import { PatchScheduler } from './scheduler';
import { HeartbeatManager } from './heartbeat';
import { CleanupManager } from './cleanup';
import { StreamController } from './stream';
import { SessionEventType, SessionEvent } from './events';
import { PatchOperation } from '../incremental/patch-generator/types';
import { SessionTimeoutError } from './errors';

export class StreamingSession {
  private stateMachine = new StateMachine();
  private scheduler: PatchScheduler;
  private heartbeat: HeartbeatManager;
  private cleanup = new CleanupManager();
  private metrics: SessionMetrics;
  private streamController: StreamController | null = null;
  private timeoutTimer: any = null;

  public onEvent?: (event: SessionEvent) => void;

  constructor(public config: SessionConfig) {
    const now = Date.now();
    this.metrics = {
      startTime: now,
      lastActiveTime: now,
      patchesSent: 0,
      bytesSent: 0
    };

    this.scheduler = new PatchScheduler(
      (patches) => this.flushPatches(patches),
      config.batchIntervalMs || 16
    );

    this.heartbeat = new HeartbeatManager(
      () => this.emitHeartbeat(),
      config.heartbeatIntervalMs || 15000
    );

    this.cleanup.addTask(() => this.scheduler.destroy());
    this.cleanup.addTask(() => this.heartbeat.stop());
    this.cleanup.addTask(() => this.clearTimeout());

    this.emitEvent(SessionEventType.CREATED);
  }

  public attachStream(controller: StreamController) {
    this.streamController = controller;
    const currentState = this.stateMachine.getState();
    if (currentState === 'CREATED') {
      this.stateMachine.transition('INITIALIZING');
    }
    
    controller.onDisconnect(() => this.handleDisconnect());
    
    if (this.stateMachine.getState() !== 'STREAMING') {
      this.stateMachine.transition('STREAMING');
    }
    this.heartbeat.start();
    this.resetTimeout();
    this.emitEvent(SessionEventType.STARTED);
  }

  public enqueuePatch(patch: PatchOperation, immediate = false) {
    if (this.stateMachine.getState() !== 'STREAMING' && this.stateMachine.getState() !== 'PAUSED') {
      return;
    }
    
    this.resetTimeout();
    
    if (immediate) {
      this.scheduler.enqueueImmediate(patch);
    } else {
      this.scheduler.enqueue(patch);
    }
    
    this.emitEvent(SessionEventType.PATCH_QUEUED, { patch });
  }

  private flushPatches(patches: PatchOperation[]) {
    if (!this.streamController || this.stateMachine.isTerminal()) return;
    
    try {
      this.streamController.sendPatch(patches);
      this.metrics.patchesSent += patches.length;
      this.metrics.lastActiveTime = Date.now();
      
      for (const patch of patches) {
        this.emitEvent(SessionEventType.PATCH_SENT, { patch });
      }
    } catch (err) {
      this.fail(err);
    }
  }

  private emitHeartbeat() {
    if (!this.streamController || this.stateMachine.isTerminal()) return;
    try {
      this.streamController.sendHeartbeat();
      this.emitEvent(SessionEventType.HEARTBEAT);
    } catch (err) {
      this.handleDisconnect();
    }
  }

  public pause() {
    if (this.stateMachine.getState() === 'STREAMING') {
      this.stateMachine.transition('PAUSED');
      this.heartbeat.stop();
    }
  }

  public resume() {
    if (this.stateMachine.getState() === 'PAUSED') {
      this.stateMachine.transition('STREAMING');
      this.heartbeat.start();
      this.resetTimeout();
    }
  }

  public complete(usage?: any) {
    if (this.stateMachine.isTerminal()) return;
    
    this.scheduler.flush();
    this.stateMachine.transition('COMPLETED');
    if (this.streamController) {
      this.streamController.sendComplete(usage);
    }
    this.cleanup.cleanup();
    this.emitEvent(SessionEventType.COMPLETED, { usage });
  }

  public cancel() {
    if (this.stateMachine.isTerminal()) return;
    
    this.stateMachine.transition('CANCELLED');
    if (this.streamController) {
      this.streamController.sendError({ code: 'cancelled', message: 'Session cancelled' });
    }
    this.cleanup.cleanup();
    this.emitEvent(SessionEventType.CANCELLED);
  }

  public destroy() {
    if (!this.stateMachine.isTerminal()) {
      this.cancel();
    }
    this.cleanup.cleanup();
  }

  public schedulePatch(patch: PatchOperation, immediate = false) {
    this.enqueuePatch(patch, immediate);
  }

  public fail(error: any) {
    if (this.stateMachine.isTerminal()) return;
    
    this.stateMachine.transition('FAILED');
    if (this.streamController) {
      this.streamController.sendError(error);
    }
    this.cleanup.cleanup();
    this.emitEvent(SessionEventType.ERROR, { error });
  }

  private handleDisconnect() {
    this.pause();
    // Start disconnect timeout
    // If client reconnects, they attach a new stream and we resume
  }

  private resetTimeout() {
    this.clearTimeout();
    if (this.config.timeoutMs && !this.stateMachine.isTerminal()) {
      this.timeoutTimer = setTimeout(() => this.handleTimeout(), this.config.timeoutMs);
    }
  }

  private clearTimeout() {
    if (this.timeoutTimer) {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;
    }
  }

  private handleTimeout() {
    this.fail(new SessionTimeoutError(this.config.id));
    this.emitEvent(SessionEventType.EXPIRED);
  }

  private emitEvent(type: SessionEventType, payload?: any) {
    if (this.onEvent) {
      this.onEvent({
        type,
        sessionId: this.config.id,
        timestamp: Date.now(),
        payload
      });
    }
  }

  public getId() { return this.config.id; }
  public getState() { return this.stateMachine.getState(); }
  public getMetrics() { return this.metrics; }
}
