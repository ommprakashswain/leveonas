import { BenchmarkRunExecutor } from './benchmark';
export interface RealBenchmarkExecutorOptions {
    userLlmKey?: string | null;
    fetchFn?: typeof fetch;
    signal?: AbortSignal;
}
/**
 * Creates a real, provider-backed benchmark run executor.
 *
 * Executes real requests against the specified provider adapter (Gemini, Grok, OpenAI, etc.).
 *
 * NORMAL Mode:
 * - Emits standard frontend code using NORMAL_SYSTEM_INSTRUCTION
 * - Collects raw model output without running the HTML-LM compiler
 * - Captures authoritative provider usage, real network SSE payload bytes, and exact timings
 *
 * LEVEONAS Mode:
 * - Emits Leveonas Markup using BASELINE_SYSTEM_INSTRUCTION
 * - Incrementally feeds incoming provider chunks to LMGenerationPipeline
 * - Produces real AST, real diffs, real patches, and serializes patch SSE events
 * - Measures exact UTF-8 patch SSE payload bytes and exact timings
 *
 * Constraints:
 * - Strictly NO mock token estimation: missing usage remains null
 * - Strictly NO fabricated browser render timing: server timeToFirstBrowserRender is null
 * - Strictly NO fabricated network bytes: measured from exact SSE payloads
 * - Strictly NO output alteration: raw emitted model text is preserved byte-for-byte
 * - Zero credentials or sensitive data in returned metrics
 */
export declare function createRealBenchmarkExecutor(options?: RealBenchmarkExecutorOptions): BenchmarkRunExecutor;
