/**
 * Normalized token usage from provider responses.
 * Never estimates tokens from characters. If unavailable, token counts are null.
 */
export interface NormalizedTokenUsage {
    inputTokens: number | null;
    outputTokens: number | null;
    totalTokens: number | null;
    source: 'provider' | 'unavailable';
}
/**
 * Token and character metrics for a generation request.
 * Note: promptCharacters, systemPromptCharacters, and systemPromptBytes measure
 * characters and UTF-8 bytes, NOT input tokens. Provider-reported inputTokens remains authoritative.
 */
export interface TokenMetrics {
    usage: NormalizedTokenUsage | null;
    promptCharacters: number;
    systemPromptCharacters: number;
    systemPromptBytes: number;
    inputCharacters: number;
    outputCharacters: number;
    outputCodeUnits: number;
    tokenCountsAvailable: boolean;
}
/**
 * Raw LM stream metrics.
 * Distinguishes between Unicode character count (code points), UTF-16 code units, and UTF-8 byte count.
 * Measures exactly what the model emitted without modification, trimming, or compression.
 */
export interface LMMetrics {
    /**
     * Unicode character (scalar code point) count: Array.from(rawLMText).length.
     * Accurately counts distinct Unicode characters (e.g. multi-byte emojis like "🇮🇳").
     */
    rawLMCharacterCount: number;
    /**
     * UTF-16 code-unit count: rawLMText.length.
     * JavaScript string length semantics.
     */
    rawLMCodeUnitCount: number;
    /**
     * UTF-8 encoded byte count of the raw LM output: Buffer.byteLength(rawLMText, 'utf8').
     */
    rawLMByteCount: number;
    numberOfLMChunks: number;
    numberOfLMChunksReceived: number;
}
/**
 * Patch operation counts and byte size.
 */
export interface PatchMetrics {
    patchBatchCount: number;
    patchOperationCount: number;
    /**
     * UTF-8 byte size of canonical PatchSerializer output.
     */
    patchBytes: number;
    /**
     * Canonical serialized patch size (UTF-8 byte length of PatchSerializer.toJSON(patches)).
     */
    canonicalPatchBytes: number;
    operations: Record<string, number>;
}
/**
 * Actual SSE payload bytes transmitted across the wire (excluding HTTP headers).
 */
export interface SSEMetrics {
    totalSSEBytes: number;
    patchSSEBytes: number;
    debugTextSSEBytes: number;
    telemetrySSEBytes?: number;
}
/**
 * Timestamp milestones (milliseconds since epoch).
 */
export interface TimingTimestamps {
    requestStart: number;
    serverRequestStartTimestamp: number;
    firstProviderChunk: number | null;
    firstLMChunk: number | null;
    firstValidAST: number | null;
    firstPatch: number | null;
    firstBrowserPatch?: number | null;
    firstBrowserRender?: number | null;
    finalPatch: number | null;
    completion: number | null;
}
/**
 * Measured duration milestones (in milliseconds relative to request start).
 */
export interface TimingDurations {
    durationToFirstLMChunkMs: number | null;
    durationToFirstASTMs: number | null;
    durationToFirstPatchMs: number | null;
    /**
     * Elapsed time from server request start to first emitted patch batch on server.
     */
    serverTimeToFirstPatchMs: number | null;
    durationToFirstBrowserRenderMs: number | null;
    durationToFinalPatchMs: number | null;
    durationToCompletionMs: number | null;
}
/**
 * Issue detected where a patch operation was not represented minimally.
 */
export interface MinimalityIssue {
    type: string;
    nodeId?: string;
    description: string;
    details?: any;
}
/**
 * Patch minimality report comparing patch operations against AST updates.
 */
export interface PatchMinimality {
    patchOperationsPerAstUpdate: number;
    astUpdateCount: number;
    patchOperationCount: number;
    minimalityIssues: MinimalityIssue[];
    isMinimal: boolean;
}
export interface TSTelemetryMetrics {
    tsLmOutputBytes: number;
    loweredJsBytes: number;
    typeOnlyUnitCount: number;
    runtimeUnitCount: number;
    tsParseLatency: number;
    tsLoweringLatency: number;
    firstTSUnitLatency?: number;
    firstLoweredJSUnitLatency?: number;
    firstExecutionLatency?: number;
}
export interface ReactTelemetryMetrics {
    reactLmOutputBytes: number;
    equivalentJsxBytes: number;
    componentCount: number;
    domPatchBytes: number;
    reconciliationLatencyMs: number;
    firstComponentLatencyMs?: number;
    firstDOMPatchLatencyMs?: number;
    completionLatencyMs?: number;
}
export interface VueTelemetryMetrics {
    vueLmOutputBytes: number;
    componentCount: number;
    reactiveStateCount: number;
    computedCount: number;
    domPatchCount: number;
    domPatchBytes: number;
    firstVueComponentLatency?: number;
    firstDOMPatchLatency?: number;
    firstInteractionLatency?: number;
    completionLatency?: number;
}
/**
 * Complete generation telemetry object.
 * Strictly development-only. Contains NO API keys, NO credentials, and NO prompts.
 */
export interface GenerationTelemetry {
    runId: string;
    provider: string;
    model: string;
    timestamps: TimingTimestamps;
    durations: TimingDurations;
    tokens: TokenMetrics;
    lm: LMMetrics;
    patches: PatchMetrics;
    sse: SSEMetrics;
    minimality: PatchMinimality;
    ts?: TSTelemetryMetrics;
    react?: ReactTelemetryMetrics;
    vue?: VueTelemetryMetrics;
}
/**
 * Compact server-side telemetry summary exposed in development mode.
 */
export interface ServerTelemetrySummary {
    runId: string;
    provider: string;
    model: string;
    serverRequestStartTimestamp: number;
    serverTimeToFirstPatchMs: number | null;
    timeToFirstPatchMs: number | null;
    timeToCompletionMs: number | null;
    patchBatchCount: number;
    patchOperationCount: number;
    patchBytes: number;
    canonicalPatchBytes: number;
    totalSSEBytes?: number;
    tokenUsage?: NormalizedTokenUsage | null;
    tsMetrics?: TSTelemetryMetrics;
    reactMetrics?: ReactTelemetryMetrics;
}
/**
 * Client-side telemetry recorded by the browser runtime/SDK.
 */
export interface ClientTelemetry {
    runId: string | null;
    fetchStartTimestamp: number | null;
    firstPatchReceivedTimestamp: number | null;
    firstPatchAppliedTimestamp: number | null;
    firstRenderDurationMs: number | null;
    /**
     * Measured end-to-end browser time: fetch start -> first patch applied to DOM.
     * Uses client clock exclusively to avoid cross-machine clock skew.
     */
    clientTimeFromFetchStartToFirstPatchAppliedMs: number | null;
    serverRequestStartTimestamp?: number | null;
    serverTimeToFirstPatchMs?: number | null;
    patchBatchCount: number;
    patchOperationCount: number;
    /**
     * Actual UTF-8 encoded received patch payload byte length.
     */
    receivedPatchPayloadBytes: number;
    /**
     * Backwards compatible alias for receivedPatchPayloadBytes.
     */
    patchBytes: number;
    finalPatchReceivedTimestamp: number | null;
    domApplyDurationMs: number;
}
/**
 * Input for comparing normal frontend generation vs Leveonas LM token economics.
 */
export interface TokenComparisonInput {
    normalInputTokens: number;
    normalOutputTokens: number;
    leveonasInputTokens: number;
    leveonasOutputTokens: number;
}
/**
 * Output results from token comparison.
 */
export interface TokenComparisonResult {
    normalInputTokens: number;
    normalOutputTokens: number;
    leveonasInputTokens: number;
    leveonasOutputTokens: number;
    outputTokenReduction: number;
    outputTokenReductionPercent: number;
    totalTokenReduction: number;
    totalTokenReductionPercent: number;
    inputTokenDifference: number;
    isOutputReduced: boolean;
    isTotalReduced: boolean;
}
/**
 * Input for comparing output sizes: token economics vs model output size vs network transport size.
 */
export interface SizeComparisonInput {
    normalGeneratedBytes: number;
    leveonasLMBytes: number;
    leveonasPatchBytes: number;
}
/**
 * Results from size comparison.
 */
export interface SizeComparisonResult {
    normalGeneratedBytes: number;
    leveonasLMBytes: number;
    leveonasPatchBytes: number;
    lmByteReduction: number;
    lmByteReductionPercent: number;
    patchByteReduction: number;
    patchByteReductionPercent: number;
}
/**
 * Benchmark modes for A/B comparison.
 */
export type BenchmarkMode = 'NORMAL' | 'LEVEONAS';
/**
 * Recorded generation settings for benchmark fairness.
 */
export interface BenchmarkGenerationSettings {
    maxTokens?: number;
    temperature?: number;
    seed?: number;
}
export type BenchmarkRunStatus = 'success' | 'failed' | 'aborted';
export type LMOutputClassification = 'VALID_LM' | 'INVALID_LM' | 'PARSER_ERROR' | 'ABORTED' | 'PROVIDER_ERROR';
export interface LMComplianceDetails {
    hasBlockDelimiters: boolean;
    hasParenthesisStructure: boolean;
    abbreviationCount: number;
    lmConstructCount: number;
    rawHTMLTagCount: number;
    rawHTMLClosingTagCount: number;
    hasMarkdownFences: boolean;
}
export interface LMSyntacticComplianceReport {
    isCompliant: boolean;
    score: number;
    reason: string;
    details: LMComplianceDetails;
}
export interface LMParserValidationReport {
    succeeded: boolean;
    astProduced: boolean;
    patchCount: number;
    patchOperationCount: number;
    diagnostics: string[];
}
export interface LMComplianceReport {
    classification: LMOutputClassification;
    syntactic: LMSyntacticComplianceReport;
    parser: LMParserValidationReport;
    isLMCompliant: boolean;
    score: number;
    reason: string;
    details?: LMComplianceDetails;
}
/**
 * Individual benchmark run metrics.
 * Strictly development-only. Contains NO API keys, NO credentials, NO prompts, and NO raw source code.
 */
export interface BenchmarkRunMetrics {
    runId: string;
    iteration: number;
    mode: BenchmarkMode;
    provider: string;
    model: string;
    status?: BenchmarkRunStatus;
    classification?: LMOutputClassification;
    error?: string | null;
    lmCompliance?: LMComplianceReport | null;
    promptCharacters: number;
    systemPromptCharacters: number;
    systemPromptBytes: number;
    inputTokens: number | null;
    outputTokens: number | null;
    totalTokens: number | null;
    outputCharacters: number;
    outputCodeUnits: number;
    modelOutputBytes: number;
    applicationSSEBytes: number;
    providerTransportBytes: number | null;
    patchBytes?: number;
    canonicalPatchBytes?: number;
    patchSSEBytes?: number;
    outputBytes: number;
    normalGeneratedBytes?: number;
    leveonasLMBytes?: number;
    networkBytes: number;
    normalNetworkBytes?: number;
    leveonasNetworkBytes?: number;
    lmStreamBytes?: number;
    totalSSEBytes?: number;
    patchBatchCount?: number;
    patchOperationCount?: number;
    timeToFirstProviderChunk: number | null;
    timeToFirstContent: number | null;
    timeToFirstGeneratedContent?: number | null;
    timeToFirstLMChunk?: number | null;
    timeToFirstPatch: number | null;
    timeToFirstBrowserRender: number | null;
    timeToCompletion: number | null;
    generationSettings: BenchmarkGenerationSettings;
    framework?: string;
    scenario?: string;
    firstInteractionReady?: boolean;
    firstInteractionLatencyMs?: number | null;
    jsLMBytes?: number;
    canonicalJSBytes?: number;
    jsPatchBytes?: number;
    firstJSUnitLatencyMs?: number;
    firstJSExecutionLatencyMs?: number;
    normalJSOutputTokens?: number;
    leveonasJSOutputTokens?: number;
}
/**
 * Descriptive statistics for a numeric metric across multiple benchmark runs.
 */
export interface MetricStatistics {
    mean: number | null;
    median: number | null;
    minimum: number | null;
    maximum: number | null;
    count: number;
}
/**
 * Aggregated statistics for one benchmark mode across all iterations.
 */
export interface BenchmarkModeStatistics {
    successfulRunsCount: number;
    totalRunsCount: number;
    validLMRunsCount?: number;
    invalidLMRunsCount?: number;
    parserErrorRunsCount?: number;
    abortedRunsCount?: number;
    providerErrorRunsCount?: number;
    inputTokens: MetricStatistics;
    outputTokens: MetricStatistics;
    totalTokens: MetricStatistics;
    modelOutputBytes: MetricStatistics;
    applicationSSEBytes: MetricStatistics;
    providerTransportBytes: MetricStatistics;
    outputBytes: MetricStatistics;
    networkBytes: MetricStatistics;
    patchBatchCount?: MetricStatistics;
    patchOperationCount?: MetricStatistics;
    patchBytes?: MetricStatistics;
    canonicalPatchBytes?: MetricStatistics;
    patchSSEBytes?: MetricStatistics;
    timeToFirstContent: MetricStatistics;
    timeToFirstLMChunk?: MetricStatistics;
    timeToFirstPatch?: MetricStatistics;
    timeToFirstBrowserRender: MetricStatistics;
    timeToCompletion: MetricStatistics;
    jsLMBytes?: MetricStatistics;
    canonicalJSBytes?: MetricStatistics;
    jsPatchBytes?: MetricStatistics;
    firstJSUnitLatencyMs?: MetricStatistics;
    firstJSExecutionLatencyMs?: MetricStatistics;
    normalJSOutputTokens?: MetricStatistics;
    leveonasJSOutputTokens?: MetricStatistics;
    lmComplianceRate?: number | null;
    systemPromptCharacters: number;
    systemPromptBytes: number;
    promptCharacters: number;
    runs: BenchmarkRunMetrics[];
}
/**
 * Direct A/B comparison result adhering to benchmark formulas.
 */
export interface BenchmarkComparison {
    outputTokenReduction: number | null;
    outputTokenReductionPercent: number | null;
    totalTokenReduction: number | null;
    totalTokenReductionPercent: number | null;
    inputTokenDifference: number | null;
    modelOutputByteReduction: number | null;
    modelOutputByteReductionPercent: number | null;
    applicationSSEByteReduction: number | null;
    applicationSSEByteReductionPercent: number | null;
    outputByteReduction: number | null;
    outputByteReductionPercent: number | null;
    networkByteReduction: number | null;
    networkByteReductionPercent: number | null;
}
export interface BenchmarkIteration {
    iteration: number;
    executionOrder: BenchmarkMode[];
    normal: BenchmarkRunMetrics;
    leveonas: BenchmarkRunMetrics;
}
/**
 * Machine-readable A/B benchmark report.
 */
export interface BenchmarkResult {
    benchmarkId: string;
    provider: string;
    model: string;
    framework?: string;
    scenario?: string;
    iterations: number;
    executionOrders: BenchmarkMode[][];
    iterationsList?: BenchmarkIteration[];
    generationSettings: BenchmarkGenerationSettings;
    normalSystemPromptCharacters: number;
    normalSystemPromptBytes: number;
    leveonasSystemPromptCharacters: number;
    leveonasSystemPromptBytes: number;
    normal: BenchmarkModeStatistics;
    leveonas: BenchmarkModeStatistics;
    comparison: BenchmarkComparison;
    compilerProfiling?: any;
    compressionBreakdown?: any;
}
