import { BenchmarkFramework, BenchmarkScenarioId } from './scenarios';
import { BenchmarkMode, BenchmarkGenerationSettings, BenchmarkRunMetrics, MetricStatistics, BenchmarkModeStatistics, BenchmarkResult } from './types';
/**
 * Validates if running the benchmark harness is allowed.
 * Strictly development-only: disabled by default in production.
 */
export declare function isBenchmarkAllowed(nodeEnv?: string | undefined): boolean;
/**
 * Calculates descriptive statistics (mean, median, min, max) for numeric measurements.
 * Does not calculate averages when insufficient non-null measurements exist.
 */
export declare function calculateMetricStatistics(values: (number | null | undefined)[]): MetricStatistics;
export interface BenchmarkRunExecutorInput {
    mode: BenchmarkMode;
    provider: string;
    model: string;
    prompt: string;
    systemInstruction: string;
    runId: string;
    iteration: number;
    generationSettings: BenchmarkGenerationSettings;
}
export type BenchmarkRunExecutor = (input: BenchmarkRunExecutorInput) => Promise<BenchmarkRunMetrics>;
export interface BenchmarkOptions {
    provider: string;
    model: string;
    prompt?: string;
    framework?: BenchmarkFramework;
    scenario?: BenchmarkScenarioId;
    iterations?: number;
    maxTokens?: number;
    temperature?: number;
    seed?: number;
    executor?: BenchmarkRunExecutor;
    randomFn?: () => number;
}
/**
 * Aggregates all run metrics for a benchmark mode into mode statistics.
 * Strictly excludes failed or aborted runs from all descriptive statistics.
 */
export declare function aggregateModeStatistics(runs: BenchmarkRunMetrics[], systemPromptCharacters: number, systemPromptBytes: number, promptCharacters: number): BenchmarkModeStatistics;
/**
 * Formats benchmark results into a clean human-readable table.
 * Displays: Metric | Normal | Leveonas | Difference
 */
export declare function formatBenchmarkTable(result: BenchmarkResult): string;
/**
 * A/B Benchmark Harness.
 *
 * Runs NORMAL code generation vs LEVEONAS LM generation across N iterations
 * using the exact same provider, model, user prompt, and generation settings.
 *
 * Guaranteed constraints:
 * - Order Randomization: per iteration, randomly chooses [NORMAL, LEVEONAS] or [LEVEONAS, NORMAL]
 * - Deterministic Testing: accepts optional randomFn to control execution order without nondeterminism
 * - Same user prompt & generation settings across both arms
 * - Same provider and model
 * - Distinct system instructions (NORMAL_SYSTEM_INSTRUCTION vs BASELINE_SYSTEM_INSTRUCTION)
 * - Unique runId per execution
 * - Authoritative provider-reported tokens (null if unavailable, never estimated)
 * - Raw emitted byte counts (modelOutputBytes) measured without modification
 * - Reconstructed application SSE payload bytes (applicationSSEBytes) measured separately
 * - Canonical patch bytes measured separately
 * - Preserves fairness: identical temperature/seed/maxTokens
 * - Development-only: disabled in production
 */
export declare function runABBenchmark(options: BenchmarkOptions): Promise<BenchmarkResult>;
/**
 * Creates a mock benchmark executor for deterministic testing and simulation.
 */
export declare function createMockBenchmarkExecutor(options?: {
    normalOutputText?: string;
    leveonasOutputLM?: string;
    providerTokens?: {
        normal?: {
            inputTokens: number | null;
            outputTokens: number | null;
            totalTokens: number | null;
        };
        leveonas?: {
            inputTokens: number | null;
            outputTokens: number | null;
            totalTokens: number | null;
        };
    };
    timings?: {
        timeToFirstProviderChunk?: number;
        timeToFirstContent?: number;
        timeToFirstPatch?: number;
        timeToFirstBrowserRender?: number;
        timeToCompletion?: number;
    };
    patchSSEBytes?: number;
}): BenchmarkRunExecutor;
/**
 * Creates an executor that processes LM text through the real LMGenerationPipeline
 * to calculate exact real patch SSE byte counts and model bytes.
 */
export declare function createPipelineBenchmarkExecutor(options?: {
    normalOutputText?: string;
    leveonasOutputLM?: string;
    providerTokens?: {
        normal?: {
            inputTokens: number | null;
            outputTokens: number | null;
            totalTokens: number | null;
        };
        leveonas?: {
            inputTokens: number | null;
            outputTokens: number | null;
            totalTokens: number | null;
        };
    };
}): BenchmarkRunExecutor;
