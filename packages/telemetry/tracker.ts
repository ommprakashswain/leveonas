import { PatchOperation, PatchOperationType, normalizePatchOperationType } from '../runtime/incremental/patch-generator/types';
import { RootNode } from '../compiler/ast/nodes';
import { PatchSerializer } from '../runtime/incremental/patch-generator/serializer';
import { PatchMinimalityAnalyzer } from './minimality';
import {
  GenerationTelemetry,
  NormalizedTokenUsage,
  ServerTelemetrySummary,
  TimingDurations,
  TimingTimestamps,
  TokenMetrics,
  LMMetrics,
  PatchMetrics,
  SSEMetrics,
} from './types';

/**
 * Generate a cryptographically random, non-sensitive unique runId for telemetry correlation.
 * Contains NO prompt text, NO user IDs, and NO API keys.
 */
export function generateTelemetryRunId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  try {
    const { randomUUID } = require('crypto');
    return randomUUID();
  } catch {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}

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
export class GenerationTelemetryTracker {
  private runId: string;
  private provider: string;
  private model: string;
  private promptLength: number;
  private systemInstructionLength: number;
  private systemInstructionBytes: number;

  private timestamps: TimingTimestamps;
  private rawLMText: string = '';
  private rawLMByteCount: number = 0;
  private numberOfLMChunks: number = 0;
  private numberOfLMChunksReceived: number = 0;

  private patchBatchCount: number = 0;
  private patchOperationCount: number = 0;
  private patchBytes: number = 0;
  private canonicalPatchBytes: number = 0;
  private operationCounts: Record<string, number> = {
    CREATE_NODE: 0,
    REMOVE_NODE: 0,
    REPLACE_NODE: 0,
    UPDATE_TEXT: 0,
    SET_ATTRIBUTE: 0,
    REMOVE_ATTRIBUTE: 0,
    INSERT_CHILD: 0,
    REMOVE_CHILD: 0,
    MOVE_CHILD: 0,
    REPLACE_CHILDREN: 0,
  };

  private totalSSEBytes: number = 0;
  private patchSSEBytes: number = 0;
  private debugTextSSEBytes: number = 0;
  private telemetrySSEBytes: number = 0;

  private tokenUsage: NormalizedTokenUsage | null = null;
  private minimalityAnalyzer: PatchMinimalityAnalyzer;

  // TypeScript Telemetry Metrics
  private tsLmOutputBytes: number = 0;
  private loweredJsBytes: number = 0;
  private typeOnlyUnitCount: number = 0;
  private runtimeUnitCount: number = 0;
  private tsParseLatency: number = 0;
  private tsLoweringLatency: number = 0;
  private firstTSUnitTimestamp: number | null = null;
  private firstLoweredJSUnitTimestamp: number | null = null;

  // React Telemetry Metrics
  private reactLmOutputBytes: number = 0;
  private equivalentJsxBytes: number = 0;
  private componentCount: number = 0;
  private reconciliationLatencyMs: number = 0;
  private firstComponentTimestamp: number | null = null;
  private firstDOMPatchTimestamp: number | null = null;

  constructor(options: TrackerInitOptions) {
    this.runId = options.runId || generateTelemetryRunId();
    this.provider = options.provider;
    this.model = options.model;
    this.promptLength = options.promptLength;
    this.systemInstructionLength = options.systemInstruction.length;
    this.systemInstructionBytes = Buffer.byteLength(options.systemInstruction, 'utf8');

    const start = options.requestStartTime || Date.now();
    this.timestamps = {
      requestStart: start,
      serverRequestStartTimestamp: start,
      firstProviderChunk: null,
      firstLMChunk: null,
      firstValidAST: null,
      firstPatch: null,
      finalPatch: null,
      completion: null,
    };

    this.minimalityAnalyzer = new PatchMinimalityAnalyzer();
  }

  public getRunId(): string {
    return this.runId;
  }

  /**
   * Record arrival of a chunk from the provider stream.
   */
  public recordProviderChunk(chunk: string): void {
    const now = Date.now();
    if (this.timestamps.firstProviderChunk === null) {
      this.timestamps.firstProviderChunk = now;
    }
    if (this.timestamps.firstLMChunk === null) {
      this.timestamps.firstLMChunk = now;
    }

    this.numberOfLMChunksReceived++;
    this.numberOfLMChunks++;
    // Measure exactly what the model emitted without modifying whitespace, comments, or syntax
    this.rawLMText += chunk;
    this.rawLMByteCount += Buffer.byteLength(chunk, 'utf8');
  }

  /**
   * Record an AST update event.
   */
  public recordASTUpdate(ast: RootNode): void {
    const now = Date.now();
    if (this.timestamps.firstValidAST === null) {
      this.timestamps.firstValidAST = now;
    }
    this.minimalityAnalyzer.recordASTUpdate();
  }

  /**
   * Record a TS AST update event.
   */
  public recordTSUpdate(tsAst: any, parseLatencyMs: number = 0, loweringLatencyMs: number = 0): void {
    const now = Date.now();
    if (this.firstTSUnitTimestamp === null && tsAst.units && tsAst.units.length > 0) {
      this.firstTSUnitTimestamp = now;
    }

    this.tsParseLatency += parseLatencyMs;
    this.tsLoweringLatency += loweringLatencyMs;

    let typeOnlyCount = 0;
    let runtimeCount = 0;
    let tsBytes = 0;
    let jsBytes = 0;

    if (tsAst.units && Array.isArray(tsAst.units)) {
      for (const unit of tsAst.units) {
        tsBytes += Buffer.byteLength(unit.rawCode || unit.code || '', 'utf8');
        if (unit.classification === 'TYPE_ONLY') {
          typeOnlyCount++;
        } else {
          runtimeCount++;
          if (unit.loweredCode) {
            jsBytes += Buffer.byteLength(unit.loweredCode, 'utf8');
            if (this.firstLoweredJSUnitTimestamp === null) {
              this.firstLoweredJSUnitTimestamp = now;
            }
          }
        }
      }
    }

    this.typeOnlyUnitCount = typeOnlyCount;
    this.runtimeUnitCount = runtimeCount;
    this.tsLmOutputBytes = tsBytes;
    this.loweredJsBytes = jsBytes;
  }

  /**
   * Record a React AST update event.
   */
  public recordReactUpdate(reactAst: any, reconLatencyMs: number = 0): void {
    const now = Date.now();
    if (this.firstComponentTimestamp === null && reactAst.components && reactAst.components.length > 0) {
      this.firstComponentTimestamp = now;
    }

    this.reconciliationLatencyMs += reconLatencyMs;

    let totalBytes = 0;
    let compCount = 0;
    if (reactAst.components && Array.isArray(reactAst.components)) {
      compCount = reactAst.components.length;
      for (const comp of reactAst.components) {
        totalBytes += Buffer.byteLength(comp.rawCode || comp.name || '', 'utf8');
      }
    }

    this.componentCount = compCount;
    this.reactLmOutputBytes = totalBytes;
    // Estimated JSX representation size without LM compression
    this.equivalentJsxBytes = Math.round(totalBytes * 1.6);
  }

  /**
   * Record an emitted patch batch.
   */
  public recordPatchBatch(patches: PatchOperation[]): void {
    const now = Date.now();
    if (this.timestamps.firstPatch === null) {
      this.timestamps.firstPatch = now;
    }
    this.timestamps.finalPatch = now;

    this.patchBatchCount++;
    this.patchOperationCount += patches.length;

    // Calculate patch payload byte size
    const serialized = PatchSerializer.toJSON(patches);
    const canonicalBytes = Buffer.byteLength(serialized, 'utf8');
    this.canonicalPatchBytes += canonicalBytes;
    this.patchBytes += canonicalBytes;

    // Count individual operation types
    for (const op of patches) {
      const rawOp = op.operation || (op as any).type;
      const canonicalType = normalizePatchOperationType(rawOp);
      const key = String(canonicalType);
      this.operationCounts[key] = (this.operationCounts[key] || 0) + 1;
    }

    this.minimalityAnalyzer.inspectPatchBatch(patches);
  }

  /**
   * Record raw SSE bytes emitted across the wire.
   */
  public recordSSEPayload(
    type: 'patch' | 'text' | 'telemetry' | 'done' | 'error',
    payloadString: string
  ): void {
    const byteLength = Buffer.byteLength(payloadString, 'utf8');
    this.totalSSEBytes += byteLength;

    if (type === 'patch') {
      this.patchSSEBytes += byteLength;
    } else if (type === 'text') {
      this.debugTextSSEBytes += byteLength;
    } else if (type === 'telemetry') {
      this.telemetrySSEBytes += byteLength;
    }
  }

  /**
   * Record normalized provider token usage.
   */
  public recordProviderUsage(usage: NormalizedTokenUsage | null): void {
    if (usage) {
      this.tokenUsage = usage;
    }
  }

  /**
   * Mark the generation stream as complete.
   */
  public complete(completionTime?: number): void {
    if (this.timestamps.completion === null) {
      this.timestamps.completion = completionTime || Date.now();
    }
  }

  /**
   * Calculate milestone durations relative to request start.
   */
  public getDurations(): TimingDurations {
    const start = this.timestamps.requestStart;
    const calc = (ts: number | null) => (ts !== null ? Math.max(0, ts - start) : null);
    const durationToFirstPatchMs = calc(this.timestamps.firstPatch);

    return {
      durationToFirstLMChunkMs: calc(this.timestamps.firstLMChunk),
      durationToFirstASTMs: calc(this.timestamps.firstValidAST),
      durationToFirstPatchMs,
      serverTimeToFirstPatchMs: durationToFirstPatchMs,
      durationToFirstBrowserRenderMs: null, // Populated by client telemetry
      durationToFinalPatchMs: calc(this.timestamps.finalPatch),
      durationToCompletionMs: calc(this.timestamps.completion),
    };
  }

  /**
   * Build complete GenerationTelemetry object.
   */
  public getTelemetry(): GenerationTelemetry {
    const durations = this.getDurations();
    const tokenCountsAvailable =
      this.tokenUsage !== null &&
      this.tokenUsage.inputTokens !== null &&
      this.tokenUsage.outputTokens !== null;

    const rawLMCharacterCount = Array.from(this.rawLMText).length;
    const rawLMCodeUnitCount = this.rawLMText.length;

    const tokens: TokenMetrics = {
      usage: this.tokenUsage,
      promptCharacters: this.promptLength,
      systemPromptCharacters: this.systemInstructionLength,
      systemPromptBytes: this.systemInstructionBytes,
      inputCharacters: this.promptLength + this.systemInstructionLength,
      outputCharacters: rawLMCharacterCount,
      outputCodeUnits: rawLMCodeUnitCount,
      tokenCountsAvailable,
    };

    const lm: LMMetrics = {
      rawLMCharacterCount,
      rawLMCodeUnitCount,
      rawLMByteCount: this.rawLMByteCount,
      numberOfLMChunks: this.numberOfLMChunks,
      numberOfLMChunksReceived: this.numberOfLMChunksReceived,
    };

    const patches: PatchMetrics = {
      patchBatchCount: this.patchBatchCount,
      patchOperationCount: this.patchOperationCount,
      patchBytes: this.patchBytes,
      canonicalPatchBytes: this.canonicalPatchBytes,
      operations: { ...this.operationCounts },
    };

    const sse: SSEMetrics = {
      totalSSEBytes: this.totalSSEBytes,
      patchSSEBytes: this.patchSSEBytes,
      debugTextSSEBytes: this.debugTextSSEBytes,
      telemetrySSEBytes: this.telemetrySSEBytes,
    };

    const start = this.timestamps.requestStart;
    const firstTSUnitLatency = this.firstTSUnitTimestamp !== null ? Math.max(0, this.firstTSUnitTimestamp - start) : undefined;
    const firstLoweredJSUnitLatency = this.firstLoweredJSUnitTimestamp !== null ? Math.max(0, this.firstLoweredJSUnitTimestamp - start) : undefined;
    const firstExecutionLatency = durations.durationToFirstPatchMs !== null ? durations.durationToFirstPatchMs : undefined;

    const firstComponentLatencyMs = this.firstComponentTimestamp !== null ? Math.max(0, this.firstComponentTimestamp - start) : undefined;
    const firstDOMPatchLatencyMs = durations.durationToFirstPatchMs !== null ? durations.durationToFirstPatchMs : undefined;

    const tsMetrics = {
      tsLmOutputBytes: this.tsLmOutputBytes,
      loweredJsBytes: this.loweredJsBytes,
      typeOnlyUnitCount: this.typeOnlyUnitCount,
      runtimeUnitCount: this.runtimeUnitCount,
      tsParseLatency: this.tsParseLatency,
      tsLoweringLatency: this.tsLoweringLatency,
      firstTSUnitLatency,
      firstLoweredJSUnitLatency,
      firstExecutionLatency,
    };

    const reactMetrics = {
      reactLmOutputBytes: this.reactLmOutputBytes,
      equivalentJsxBytes: this.equivalentJsxBytes,
      componentCount: this.componentCount,
      domPatchBytes: this.patchBytes,
      reconciliationLatencyMs: this.reconciliationLatencyMs,
      firstComponentLatencyMs,
      firstDOMPatchLatencyMs,
      completionLatencyMs: durations.durationToCompletionMs !== null ? durations.durationToCompletionMs : undefined,
    };

    return {
      runId: this.runId,
      provider: this.provider,
      model: this.model,
      timestamps: { ...this.timestamps },
      durations,
      tokens,
      lm,
      patches,
      sse,
      minimality: this.minimalityAnalyzer.getReport(),
      ts: tsMetrics,
      react: reactMetrics,
    };
  }

  /**
   * Build compact server summary for development logging or SSE emission.
   */
  public toServerSummary(): ServerTelemetrySummary {
    const durations = this.getDurations();
    const start = this.timestamps.requestStart;
    const firstTSUnitLatency = this.firstTSUnitTimestamp !== null ? Math.max(0, this.firstTSUnitTimestamp - start) : undefined;
    const firstLoweredJSUnitLatency = this.firstLoweredJSUnitTimestamp !== null ? Math.max(0, this.firstLoweredJSUnitTimestamp - start) : undefined;
    const firstExecutionLatency = durations.durationToFirstPatchMs !== null ? durations.durationToFirstPatchMs : undefined;

    const firstComponentLatencyMs = this.firstComponentTimestamp !== null ? Math.max(0, this.firstComponentTimestamp - start) : undefined;
    const firstDOMPatchLatencyMs = durations.durationToFirstPatchMs !== null ? durations.durationToFirstPatchMs : undefined;

    return {
      runId: this.runId,
      provider: this.provider,
      model: this.model,
      serverRequestStartTimestamp: this.timestamps.requestStart,
      serverTimeToFirstPatchMs: durations.serverTimeToFirstPatchMs,
      timeToFirstPatchMs: durations.durationToFirstPatchMs,
      timeToCompletionMs: durations.durationToCompletionMs,
      patchBatchCount: this.patchBatchCount,
      patchOperationCount: this.patchOperationCount,
      patchBytes: this.patchBytes,
      canonicalPatchBytes: this.canonicalPatchBytes,
      totalSSEBytes: this.totalSSEBytes,
      tokenUsage: this.tokenUsage,
      tsMetrics: {
        tsLmOutputBytes: this.tsLmOutputBytes,
        loweredJsBytes: this.loweredJsBytes,
        typeOnlyUnitCount: this.typeOnlyUnitCount,
        runtimeUnitCount: this.runtimeUnitCount,
        tsParseLatency: this.tsParseLatency,
        tsLoweringLatency: this.tsLoweringLatency,
        firstTSUnitLatency,
        firstLoweredJSUnitLatency,
        firstExecutionLatency,
      },
      reactMetrics: {
        reactLmOutputBytes: this.reactLmOutputBytes,
        equivalentJsxBytes: this.equivalentJsxBytes,
        componentCount: this.componentCount,
        domPatchBytes: this.patchBytes,
        reconciliationLatencyMs: this.reconciliationLatencyMs,
        firstComponentLatencyMs,
        firstDOMPatchLatencyMs,
        completionLatencyMs: durations.durationToCompletionMs !== null ? durations.durationToCompletionMs : undefined,
      },
    };
  }
}
