import { StreamBuilderConfig, Fragment } from './types';
import { StreamBuffer } from './buffer';
import { SyntaxTracker } from './state';
import { CheckpointManager } from './checkpoint';
import { IncrementalManager } from './incremental';
import { BuilderEventType, BuilderEvent } from './events';

export class StreamBuilder {
  private buffer: StreamBuffer;
  private tracker: SyntaxTracker;
  private checkpoints: CheckpointManager;
  private incremental: IncrementalManager;
  
  public onEvent?: (event: BuilderEvent) => void;

  constructor(private config: StreamBuilderConfig = {}) {
    this.buffer = new StreamBuffer(config.maxBufferSize);
    this.tracker = new SyntaxTracker();
    this.checkpoints = new CheckpointManager();
    this.incremental = new IncrementalManager(this.checkpoints);
  }

  private emitEvent(type: BuilderEventType, payload?: any) {
    if (this.onEvent) {
      this.onEvent({
        type,
        timestamp: Date.now(),
        payload
      });
    }
  }

  push(chunk: string) {
    this.emitEvent(BuilderEventType.CHUNK_RECEIVED, { chunk });
    this.buffer.append(chunk);
    this.tracker.feed(chunk);
    
    this.emitEvent(BuilderEventType.RECOVER_ATTEMPT);
    
    try {
      const recovered = this.incremental.createFragment(this.buffer.get(), this.tracker);
      this.emitEvent(BuilderEventType.RECOVER_SUCCEEDED, { recovered });
      
      const fragment: Fragment = {
        raw: this.buffer.get(),
        recovered,
        isComplete: this.tracker.braceDepth === 0 && this.tracker.state === 'NORMAL',
        braceDepth: this.tracker.braceDepth
      };
      
      this.emitEvent(BuilderEventType.FRAGMENT_READY, { fragment });
    } catch (e) {
      this.emitEvent(BuilderEventType.RECOVER_FAILED, { error: e });
    }
  }

  complete() {
    this.emitEvent(BuilderEventType.STREAM_COMPLETED);
  }
  
  getBuffer(): string {
    return this.buffer.get();
  }
}
