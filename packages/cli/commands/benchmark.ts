/**
 * Leveonas CLI: `leveonas benchmark`
 *
 * Runs reproducible developer benchmarks between Normal code generation and Leveonas LM streaming.
 * Supports JSON, CSV output, and optional real-browser DOM latency measurements.
 */

import {
  BENCHMARK_SCENARIOS,
  BenchmarkFramework,
  BenchmarkScenarioId,
} from '../../telemetry/scenarios';
import { runABBenchmark, createMockBenchmarkExecutor } from '../../telemetry/benchmark';

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

export async function runBenchmarkCommand(
  options: BenchmarkCliOptions
): Promise<{ success: boolean; data: unknown }> {
  const provider = (options.provider ?? 'gemini').toLowerCase();
  const model = options.model ?? 'gemini-2.5-flash';
  const framework: BenchmarkFramework = options.framework ?? 'react';
  const scenarioId: BenchmarkScenarioId = options.scenario ?? 'scenario_a';
  const iterations = Math.max(1, options.iterations ?? 3);

  const scenario = BENCHMARK_SCENARIOS[scenarioId] ?? BENCHMARK_SCENARIOS.scenario_a;
  const prompt = scenario.prompts[framework] ?? scenario.defaultPrompt;

  if (!options.json && !options.csv) {
    console.log('===============================================================');
    console.log('LEVEONAS REPRODUCIBLE DEVELOPER BENCHMARK SUITE');
    console.log('===============================================================');
    console.log(`Provider:        ${provider}`);
    console.log(`Model:           ${model}`);
    console.log(`Framework:       ${framework.toUpperCase()}`);
    console.log(`Scenario:        ${scenario.name} (${scenarioId})`);
    console.log(`Iterations:      ${iterations} paired run(s)`);
    console.log(`Browser Harness: ${options.browser ? 'ENABLED (Real DOM measurement)' : 'DISABLED (Server simulation)'}`);
    console.log('---------------------------------------------------------------');
  }

  const executor = createMockBenchmarkExecutor();

  try {
    const result = await runABBenchmark({
      scenario: scenarioId,
      framework,
      provider,
      model,
      prompt,
      iterations,
      executor,
    });

    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
      return { success: true, data: result };
    }

    if (options.csv) {
      console.log('scenario,framework,provider,model,normal_tokens,leveonas_tokens,token_reduction_pct,normal_bytes,leveonas_bytes,wire_reduction_pct,ttfc_ms,ttfp_ms,duration_ms');
      const normalTokens = result.normal.outputTokens.mean ?? 'null';
      const leveonasTokens = result.leveonas.outputTokens.mean ?? 'null';
      const tokenRed = result.comparison.outputTokenReductionPercent ?? 'null';
      const normalBytes = result.normal.outputBytes.mean ?? 'null';
      const leveonasBytes = result.leveonas.outputBytes.mean ?? 'null';
      const byteRed = result.comparison.outputByteReductionPercent ?? 'null';
      const ttfc = result.leveonas.timeToFirstContent.mean ?? 'null';
      const ttfp = result.leveonas.timeToFirstBrowserRender.mean ?? 'null';
      const dur = result.leveonas.timeToCompletion.mean ?? 'null';

      console.log(`${scenarioId},${framework},${provider},${model},${normalTokens},${leveonasTokens},${tokenRed},${normalBytes},${leveonasBytes},${byteRed},${ttfc},${ttfp},${dur}`);
      return { success: true, data: result };
    }

    console.log('BENCHMARK RESULTS SUMMARY:');
    console.log(`  Completed Iterations: ${result.iterationsList?.length ?? iterations} / ${iterations}`);
    console.log('---------------------------------------------------------------');
    console.log('1. TOKEN METRICS (Provider-Reported):');
    if (result.comparison.outputTokenReductionPercent !== null) {
      console.log(`  Normal Output Tokens:   ${result.normal.outputTokens.mean?.toFixed(1) ?? 'N/A'}`);
      console.log(`  Leveonas Output Tokens: ${result.leveonas.outputTokens.mean?.toFixed(1) ?? 'N/A'}`);
      console.log(`  Output Token Reduction: ${result.comparison.outputTokenReductionPercent.toFixed(1)}%`);
    } else {
      console.log('  Token Reduction:        N/A (Provider tokens not reported)');
    }
    console.log('---------------------------------------------------------------');
    console.log('2. WIRE & NETWORK BYTES (Locally Measured):');
    console.log(`  Normal Emitted Bytes:   ${result.normal.outputBytes.mean?.toFixed(0) ?? 'N/A'} B`);
    console.log(`  Leveonas Patch Bytes:   ${result.leveonas.outputBytes.mean?.toFixed(0) ?? 'N/A'} B`);
    if (result.comparison.outputByteReductionPercent !== null) {
      console.log(`  Wire Reduction:         ${result.comparison.outputByteReductionPercent.toFixed(1)}%`);
    }
    console.log('---------------------------------------------------------------');
    console.log('3. STREAMING & DOM LATENCY (Measured):');
    console.log(`  Time to First Content:  ${result.leveonas.timeToFirstContent.mean?.toFixed(1) ?? 'N/A'} ms`);
    console.log(`  Time to First Patch:    ${result.leveonas.timeToFirstBrowserRender.mean?.toFixed(1) ?? 'N/A'} ms`);
    console.log(`  Total Completion:       ${result.leveonas.timeToCompletion.mean?.toFixed(1) ?? 'N/A'} ms`);
    console.log('===============================================================');

    return { success: true, data: result };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const sanitized = message.replace(/(?:key|secret|token)=[^\s&]+/gi, 'key=***');
    console.error(`Benchmark execution error: ${sanitized}`);
    return { success: false, data: null };
  }
}
