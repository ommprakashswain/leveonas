/**
 * Leveonas Stable Public Metrics & Observability API
 *
 * Provides normalized, zero-fabrication metrics accounting for generation durations,
 * network streaming bytes, DOM patch counts, and provider token usage.
 */

export interface GenerationMetrics {
  durationMs: number;
  timeToFirstChunkMs: number;
  timeToFirstPatchMs: number;
  completionTimeMs?: number;
  patchCount: number;
  patchBytes: number;
  streamBytes: number;
  inputTokens: number | null;
  outputTokens: number | null;
  totalTokens: number | null;
}

export interface ObservabilityConfig {
  mode: 'development' | 'production' | 'disabled';
  logErrors?: boolean;
  onMetrics?: (metrics: GenerationMetrics) => void;
}

export class MetricsCollector {
  private startTime: number = 0;
  private firstChunkTime: number = 0;
  private firstPatchTime: number = 0;
  private endTime: number = 0;
  private streamByteCount: number = 0;
  private patchByteCount: number = 0;
  private patchOperationCount: number = 0;
  private inTokens: number | null = null;
  private outTokens: number | null = null;
  private totTokens: number | null = null;
  private isCompleted = false;

  constructor(private config: ObservabilityConfig = { mode: 'production' }) {
    this.start();
  }

  public start(): void {
    this.startTime = Date.now();
  }

  public recordChunk(byteLength: number): void {
    if (!this.firstChunkTime) {
      this.firstChunkTime = Date.now();
    }
    this.streamByteCount += byteLength;
  }

  public recordPatch(operationCount: number, byteLength: number): void {
    if (!this.firstPatchTime) {
      this.firstPatchTime = Date.now();
    }
    this.patchOperationCount += operationCount;
    this.patchByteCount += byteLength;
  }

  public recordUsage(inputTokens?: number | null, outputTokens?: number | null, totalTokens?: number | null): void {
    if (typeof inputTokens === 'number') this.inTokens = inputTokens;
    if (typeof outputTokens === 'number') this.outTokens = outputTokens;
    if (typeof totalTokens === 'number') this.totTokens = totalTokens;
  }

  public complete(): GenerationMetrics {
    if (!this.isCompleted) {
      this.endTime = Date.now();
      this.isCompleted = true;
    }

    const duration = Math.max(0, this.endTime - this.startTime);
    const ttfc = this.firstChunkTime ? Math.max(0, this.firstChunkTime - this.startTime) : duration;
    const ttfp = this.firstPatchTime ? Math.max(0, this.firstPatchTime - this.startTime) : duration;

    const metrics: GenerationMetrics = {
      durationMs: duration,
      timeToFirstChunkMs: ttfc,
      timeToFirstPatchMs: ttfp,
      completionTimeMs: duration,
      patchCount: this.patchOperationCount,
      patchBytes: this.patchByteCount,
      streamBytes: this.streamByteCount,
      inputTokens: this.inTokens,
      outputTokens: this.outTokens,
      totalTokens: this.totTokens,
    };

    if (this.config.mode === 'development') {
      console.log('[Leveonas Metrics]', {
        durationMs: metrics.durationMs,
        ttfc: metrics.timeToFirstChunkMs,
        ttfp: metrics.timeToFirstPatchMs,
        patches: metrics.patchCount,
        patchBytes: metrics.patchBytes,
        streamBytes: metrics.streamBytes,
        tokens: metrics.totalTokens,
      });
    }

    this.config.onMetrics?.(metrics);
    return metrics;
  }
}
