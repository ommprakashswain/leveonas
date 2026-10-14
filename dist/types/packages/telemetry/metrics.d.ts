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
export declare class MetricsCollector {
    private config;
    private startTime;
    private firstChunkTime;
    private firstPatchTime;
    private endTime;
    private streamByteCount;
    private patchByteCount;
    private patchOperationCount;
    private inTokens;
    private outTokens;
    private totTokens;
    private isCompleted;
    constructor(config?: ObservabilityConfig);
    start(): void;
    recordChunk(byteLength: number): void;
    recordPatch(operationCount: number, byteLength: number): void;
    recordUsage(inputTokens?: number | null, outputTokens?: number | null, totalTokens?: number | null): void;
    complete(): GenerationMetrics;
}
