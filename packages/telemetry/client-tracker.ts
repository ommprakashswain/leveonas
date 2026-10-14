import { PatchOperation } from '../runtime/incremental/patch-generator/types';
import { ClientTelemetry } from './types';

/**
 * Calculates UTF-8 byte length across browser and Node.js environments.
 */
export function getUtf8ByteLength(str: string): number {
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(str).length;
  }
  if (typeof Buffer !== 'undefined') {
    return Buffer.byteLength(str, 'utf8');
  }
  return unescape(encodeURIComponent(str)).length;
}

/**
 * ClientTelemetryTracker
 * Tracks client-side performance and metrics in the browser SDK without exposing raw code.
 */
export class ClientTelemetryTracker {
  private runId: string | null = null;
  private fetchStartTimestamp: number | null = null;
  private firstPatchReceivedTimestamp: number | null = null;
  private firstPatchAppliedTimestamp: number | null = null;
  private finalPatchReceivedTimestamp: number | null = null;
  private patchBatchCount: number = 0;
  private patchOperationCount: number = 0;
  private receivedPatchPayloadBytes: number = 0;
  private domApplyDurationMs: number = 0;
  private serverRequestStartTimestamp: number | null = null;
  private serverTimeToFirstPatchMs: number | null = null;

  constructor(initialRunId?: string) {
    if (initialRunId) {
      this.runId = initialRunId;
    }
  }

  public setRunId(runId: string): void {
    if (runId) {
      this.runId = runId;
    }
  }

  public getRunId(): string | null {
    return this.runId;
  }

  /**
   * Record the client-side fetch start time.
   */
  public recordFetchStart(timestamp?: number): void {
    this.fetchStartTimestamp = timestamp ?? Date.now();
  }

  /**
   * Record server timing received over the telemetry stream.
   */
  public setServerTiming(serverRequestStartTimestamp: number, serverTimeToFirstPatchMs: number | null): void {
    this.serverRequestStartTimestamp = serverRequestStartTimestamp;
    this.serverTimeToFirstPatchMs = serverTimeToFirstPatchMs;
  }

  /**
   * Record arrival of a patch batch in the browser SDK.
   * Uses actual UTF-8 encoded received patch payload byte length where available.
   */
  public recordPatchBatch(patches: PatchOperation[], payloadByteLength?: number): void {
    const now = Date.now();
    if (this.firstPatchReceivedTimestamp === null) {
      this.firstPatchReceivedTimestamp = now;
    }
    this.finalPatchReceivedTimestamp = now;

    this.patchBatchCount++;
    this.patchOperationCount += patches.length;

    const byteLen =
      typeof payloadByteLength === 'number'
        ? payloadByteLength
        : getUtf8ByteLength(JSON.stringify(patches));

    this.receivedPatchPayloadBytes += byteLen;
  }

  /**
   * Record that a patch batch has been applied to the iframe DOM.
   */
  public recordPatchApplied(durationMs: number): void {
    const now = Date.now();
    if (this.firstPatchAppliedTimestamp === null) {
      this.firstPatchAppliedTimestamp = now;
    }
    this.domApplyDurationMs += durationMs;
  }

  /**
   * Build the client telemetry snapshot.
   */
  public getTelemetry(): ClientTelemetry {
    // Relative browser duration: first patch received -> first patch applied to DOM
    const firstRenderDurationMs =
      this.firstPatchReceivedTimestamp !== null && this.firstPatchAppliedTimestamp !== null
        ? Math.max(0, this.firstPatchAppliedTimestamp - this.firstPatchReceivedTimestamp)
        : null;

    // True end-to-end browser duration: request initiation (fetch start) -> first DOM patch applied
    const clientTimeFromFetchStartToFirstPatchAppliedMs =
      this.fetchStartTimestamp !== null && this.firstPatchAppliedTimestamp !== null
        ? Math.max(0, this.firstPatchAppliedTimestamp - this.fetchStartTimestamp)
        : null;

    return {
      runId: this.runId,
      fetchStartTimestamp: this.fetchStartTimestamp,
      firstPatchReceivedTimestamp: this.firstPatchReceivedTimestamp,
      firstPatchAppliedTimestamp: this.firstPatchAppliedTimestamp,
      firstRenderDurationMs,
      clientTimeFromFetchStartToFirstPatchAppliedMs,
      serverRequestStartTimestamp: this.serverRequestStartTimestamp,
      serverTimeToFirstPatchMs: this.serverTimeToFirstPatchMs,
      patchBatchCount: this.patchBatchCount,
      patchOperationCount: this.patchOperationCount,
      receivedPatchPayloadBytes: this.receivedPatchPayloadBytes,
      patchBytes: this.receivedPatchPayloadBytes,
      finalPatchReceivedTimestamp: this.finalPatchReceivedTimestamp,
      domApplyDurationMs: this.domApplyDurationMs,
    };
  }
}
