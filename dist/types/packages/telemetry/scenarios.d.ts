/**
 * Leveonas Phase 3 Benchmark Scenarios & Framework Configurations
 *
 * Defines 5 representative frontend application scenarios benchmarked across 5 frameworks:
 * - HTML
 * - React
 * - Vue
 * - Svelte
 * - Angular
 */
export type BenchmarkFramework = 'html' | 'react' | 'vue' | 'svelte' | 'angular';
export type BenchmarkScenarioId = 'scenario_a' | 'scenario_b' | 'scenario_c' | 'scenario_d' | 'scenario_e';
export interface BenchmarkScenarioDefinition {
    id: BenchmarkScenarioId;
    name: string;
    category: string;
    description: string;
    expectedFunctionality: string[];
    prompts: Record<BenchmarkFramework, string>;
    defaultPrompt: string;
}
export declare const BENCHMARK_SCENARIOS: Record<BenchmarkScenarioId, BenchmarkScenarioDefinition>;
/**
 * Returns framework-specific normal system instructions.
 */
export declare function getNormalSystemInstruction(framework: BenchmarkFramework): string;
/**
 * Returns framework-specific Leveonas LM system instructions.
 */
export declare function getLeveonasSystemInstruction(framework: BenchmarkFramework): string;
