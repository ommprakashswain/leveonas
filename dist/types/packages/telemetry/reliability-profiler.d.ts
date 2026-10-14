import { BenchmarkFramework } from './scenarios';
export interface RecoveryScenarioResult {
    scenarioName: string;
    partialChunk: string;
    continuationChunk: string;
    recoveredSuccessfully: boolean;
    diagnosticsDuringPartial: string[];
    finalPatchEmitted: boolean;
}
export interface ReliabilityReport {
    framework: BenchmarkFramework;
    totalRuns: number;
    validGenerationCount: number;
    compileSuccessCount: number;
    runtimeSuccessCount: number;
    syntaxErrorRate: number;
    incompleteGenerationRate: number;
    compileErrorRate: number;
    runtimeErrorRate: number;
    streamingRecoveryResults: RecoveryScenarioResult[];
}
export declare class LeveonasReliabilityProfiler {
    /**
     * Tests parser & compiler recovery across partial streaming scenarios.
     */
    static testStreamingRecovery(framework?: BenchmarkFramework): RecoveryScenarioResult[];
    /**
     * Evaluates overall framework reliability report.
     */
    static evaluateReliability(framework: BenchmarkFramework, outputs: {
        text: string;
        isComplete: boolean;
    }[]): ReliabilityReport;
}
