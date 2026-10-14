/**
 * Leveonas CLI: `leveonas benchmark`
 *
 * Runs reproducible developer benchmarks between Normal code generation and Leveonas LM streaming.
 * Supports JSON, CSV output, and optional real-browser DOM latency measurements.
 */
import { BenchmarkFramework, BenchmarkScenarioId } from '../../telemetry/scenarios';
export interface BenchmarkCliOptions {
    provider?: string;
    model?: string;
    framework?: BenchmarkFramework;
    scenario?: BenchmarkScenarioId;
    iterations?: number;
    json?: boolean;
    csv?: boolean;
    browser?: boolean;
}
export declare function runBenchmarkCommand(options: BenchmarkCliOptions): Promise<{
    success: boolean;
    data: unknown;
}>;
