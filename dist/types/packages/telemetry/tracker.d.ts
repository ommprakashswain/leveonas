import { PatchOperation } from '../runtime/incremental/patch-generator/types';
import { RootNode } from '../compiler/ast/nodes';
import { GenerationTelemetry, NormalizedTokenUsage, ServerTelemetrySummary, TimingDurations } from './types';
/**
 * Generate a cryptographically random, non-sensitive unique runId for telemetry correlation.
 * Contains NO prompt text, NO user IDs, and NO API keys.
 */
export declare function generateTelemetryRunId(): string;
export interface TrackerInitOptions {
    runId?: string;
    provider: string;
    model: string;
    promptLength: number;
    systemInstruction: string;
    requestStartTime?: number;
}
/**
 * GenerationTelemetryTracker
 * Collects timing, token, LM, patch, SSE, and minimality metrics during a generation stream.
 *
 * Security & Privacy:
 * - Does NOT store user prompts or provider credentials.
 * - Does NOT store API keys.
 * - Collects only lengths, counts, byte sizes, and timestamps.
 */
export declare class GenerationTelemetryTracker {
    private runId;
    private provider;
    private model;
    private promptLength;
    private systemInstructionLength;
    private systemInstructionBytes;
    private timestamps;
    private rawLMText;
    private rawLMByteCount;
    private numberOfLMChunks;
    private numberOfLMChunksReceived;
    private patchBatchCount;
    private patchOperationCount;
    private patchBytes;
    private canonicalPatchBytes;
    private operationCounts;
    private totalSSEBytes;
    private patchSSEBytes;
    private debugTextSSEBytes;
    private telemetrySSEBytes;
    private tokenUsage;
    private minimalityAnalyzer;
    private tsLmOutputBytes;
    private loweredJsBytes;
    private typeOnlyUnitCount;
    private runtimeUnitCount;
    private tsParseLatency;
    private tsLoweringLatency;
    private firstTSUnitTimestamp;
    private firstLoweredJSUnitTimestamp;
    private reactLmOutputBytes;
    private equivalentJsxBytes;
    private componentCount;
    private reconciliationLatencyMs;
    private firstComponentTimestamp;
    private firstDOMPatchTimestamp;
    constructor(options: TrackerInitOptions);
    getRunId(): string;
    /**
     * Record arrival of a chunk from the provider stream.
     */
    recordProviderChunk(chunk: string): void;
    /**
     * Record an AST update event.
     */
    recordASTUpdate(ast: RootNode): void;
    /**
     * Record a TS AST update event.
     */
    recordTSUpdate(tsAst: any, parseLatencyMs?: number, loweringLatencyMs?: number): void;
    /**
     * Record a React AST update event.
     */
    recordReactUpdate(reactAst: any, reconLatencyMs?: number): void;
    /**
     * Record an emitted patch batch.
     */
    recordPatchBatch(patches: PatchOperation[]): void;
    /**
     * Record raw SSE bytes emitted across the wire.
     */
    recordSSEPayload(type: 'patch' | 'text' | 'telemetry' | 'done' | 'error', payloadString: string): void;
    /**
     * Record normalized provider token usage.
     */
    recordProviderUsage(usage: NormalizedTokenUsage | null): void;
    /**
     * Mark the generation stream as complete.
     */
    complete(completionTime?: number): void;
    /**
     * Calculate milestone durations relative to request start.
     */
    getDurations(): TimingDurations;
    /**
     * Build complete GenerationTelemetry object.
     */
    getTelemetry(): GenerationTelemetry;
    /**
     * Build compact server summary for development logging or SSE emission.
     */
    toServerSummary(): ServerTelemetrySummary;
}
