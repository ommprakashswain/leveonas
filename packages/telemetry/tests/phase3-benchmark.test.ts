import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  BENCHMARK_SCENARIOS,
  BenchmarkFramework,
  BenchmarkScenarioId,
  getNormalSystemInstruction,
  getLeveonasSystemInstruction,
} from '../scenarios';
import { LMCompressionAnalyzer } from '../compression-analyzer';
import { LeveonasIRProfiler } from '../ir-profiler';
import { LeveonasReliabilityProfiler } from '../reliability-profiler';
import { BenchmarkExporter } from '../exporter';
import {
  runABBenchmark,
  createMockBenchmarkExecutor,
  createPipelineBenchmarkExecutor,
  calculateMetricStatistics,
} from '../benchmark';
import { compareTokens, compareSizes, compareBenchmark } from '../comparison';

describe('Leveonas Phase 3: Cross-Framework Performance, Token, IR & Streaming Optimization Suite', () => {
  // =========================================================================
  // 1. Scenarios and Framework Configurations
  // =========================================================================
  it('1. Defines 5 standard benchmark scenarios across all 5 frameworks', () => {
    const scenarioIds: BenchmarkScenarioId[] = [
      'scenario_a',
      'scenario_b',
      'scenario_c',
      'scenario_d',
      'scenario_e',
    ];
    const frameworks: BenchmarkFramework[] = ['html', 'react', 'vue', 'svelte', 'angular'];

    for (const scId of scenarioIds) {
      const sc = BENCHMARK_SCENARIOS[scId];
      assert.ok(sc, `Scenario ${scId} must exist`);
      assert.ok(sc.name && sc.name.length > 0);
      assert.ok(sc.expectedFunctionality.length >= 3);
      assert.ok(sc.defaultPrompt.length > 20);

      for (const fw of frameworks) {
        assert.ok(sc.prompts[fw], `Scenario ${scId} must have prompt for ${fw}`);
        assert.ok(sc.prompts[fw].length > 20);
      }
    }
  });

  it('2. Framework system instructions are distinct and specialized', () => {
    const frameworks: BenchmarkFramework[] = ['html', 'react', 'vue', 'svelte', 'angular'];
    for (const fw of frameworks) {
      const normal = getNormalSystemInstruction(fw);
      const lm = getLeveonasSystemInstruction(fw);

      assert.ok(normal.length > 50, `${fw} normal instruction exists`);
      assert.ok(lm.length > 50, `${fw} LM instruction exists`);
      assert.notStrictEqual(normal, lm, `${fw} normal and LM instructions must differ`);
    }
  });

  // =========================================================================
  // 2. Token Compression Breakdown Analyzer
  // =========================================================================
  it('3. LMCompressionAnalyzer accurately deconstructs syntax savings factors', () => {
    const normalHtml = `
<div class="card-container" id="main-card">
  <header class="card-header">
    <h1 class="card-title">NovaFlow AI</h1>
  </header>
  <section class="card-body">
    <p class="description">Instant dynamic web generation</p>
    <button class="btn btn-primary" onClick="handleClick()">Get Started</button>
  </section>
  <footer class="card-footer">
    <span class="copyright">&copy; 2026</span>
  </footer>
</div>
`.trim();

    const leveonasLM = `
<HTML>
(di cs:"card-container" id:"main-card"
  (he cs:"card-header"
    (h1 cs:"card-title" "NovaFlow AI")
  )
  (so cs:"card-body"
    (pa cs:"description" "Instant dynamic web generation")
    (bo cs:"btn btn-primary" oc:"handleClick()" "Get Started")
  )
  (fe cs:"card-footer"
    (sa cs:"copyright" "© 2026")
  )
)
</HTML>
`.trim();

    const analysis = LMCompressionAnalyzer.analyze(normalHtml, leveonasLM);

    assert.ok(analysis.totalSavings.normalTotalBytes > analysis.totalSavings.leveonasTotalBytes);
    assert.ok(analysis.totalSavings.savingsPercent > 0);
    assert.ok(analysis.closingTagSavings.savedChars > 0, 'Must identify closing tag savings');
    assert.ok(analysis.tagSavings.savedChars > 0, 'Must identify tag abbreviation savings');
    assert.ok(analysis.attributeSavings.savedChars > 0, 'Must identify attribute abbreviation savings');
    assert.ok(analysis.dominantFactors.length > 0);
  });

  // =========================================================================
  // 3. Compiler Stage Latency & IR Sizing Profiler
  // =========================================================================
  it('4. LeveonasIRProfiler profiles compiler stage timings and IR sizes for React-LM', () => {
    const reactSource = `
component(App)(
  state(count, 0)
  computed(double, count * 2)

  di(
    h1("Count: {count}")
    p("Double: {double}")
    bo(click:increment "+1")
  )
)
`.trim();

    const profile = LeveonasIRProfiler.profile(reactSource, 'react');

    assert.strictEqual(profile.compileSuccess, true);
    assert.strictEqual(profile.error, null);
    assert.ok(profile.timings.totalCompilerTimeMs >= 0);
    assert.ok(profile.sizes.lmBytes > 0);
    assert.ok(profile.sizes.commonUIIRBytes > 0);
    assert.ok(profile.sizes.domASTBytes > 0);
    assert.ok(profile.sizes.patchBytes > 0);
    assert.ok(profile.patchBreakdown.TOTAL > 0);
    assert.ok(profile.patchBreakdown.INSERT_CHILD > 0 || profile.patchBreakdown.CREATE_NODE > 0);
  });

  it('5. LeveonasIRProfiler profiles compiler stage timings and IR sizes for Angular-LM', () => {
    const angularSource = `
component(App)(
  state(bgColor, "blue")
  state(isActive, true)

  di(
    h1([style.color]:bgColor "Angular App")
    bo([class.active]:isActive (click):toggle "Toggle")
  )
)
`.trim();

    const profile = LeveonasIRProfiler.profile(angularSource, 'angular');

    assert.strictEqual(profile.compileSuccess, true);
    assert.ok(profile.sizes.lmBytes > 0);
    assert.ok(profile.sizes.patchBytes > 0);
    assert.ok(profile.patchBreakdown.TOTAL > 0);
  });

  // =========================================================================
  // 4. Reliability & Streaming Error Recovery Profiling
  // =========================================================================
  it('6. LeveonasReliabilityProfiler tests and verifies recovery across partial stream scenarios', () => {
    const results = LeveonasReliabilityProfiler.testStreamingRecovery('react');
    assert.strictEqual(results.length, 5);

    for (const res of results) {
      assert.strictEqual(res.recoveredSuccessfully, true, `Scenario "${res.scenarioName}" must recover`);
      assert.strictEqual(res.finalPatchEmitted, true, `Scenario "${res.scenarioName}" must emit final patch`);
    }
  });

  it('7. LeveonasReliabilityProfiler produces comprehensive reliability report', () => {
    const outputs = [
      { text: 'component(App)(state(count, 0) di(h1("Test")))', isComplete: true },
      { text: 'component(App)(state(count, 0) di(h1("Test 2")))', isComplete: true },
    ];
    const report = LeveonasReliabilityProfiler.evaluateReliability('react', outputs);

    assert.strictEqual(report.totalRuns, 2);
    assert.strictEqual(report.validGenerationCount, 2);
    assert.strictEqual(report.compileSuccessCount, 2);
    assert.strictEqual(report.syntaxErrorRate, 0);
    assert.strictEqual(report.compileErrorRate, 0);
  });

  // =========================================================================
  // 5. Exporter (JSON & CSV)
  // =========================================================================
  it('8. BenchmarkExporter produces valid JSON and RFC 4180 CSV exports', async () => {
    const executor = createMockBenchmarkExecutor({
      providerTokens: {
        normal: { inputTokens: 100, outputTokens: 800, totalTokens: 900 },
        leveonas: { inputTokens: 140, outputTokens: 320, totalTokens: 460 },
      },
    });

    const result = await runABBenchmark({
      provider: 'gemini',
      model: 'gemini-2.5-flash',
      framework: 'react',
      scenario: 'scenario_a',
      iterations: 3,
      executor,
      randomFn: () => 0.2, // deterministic order: ['NORMAL', 'LEVEONAS']
    });

    const jsonStr = BenchmarkExporter.toJSON(result);
    const parsed = JSON.parse(jsonStr);
    assert.strictEqual(parsed.benchmarkId, result.benchmarkId);
    assert.strictEqual(parsed.framework, 'react');
    assert.strictEqual(parsed.scenario, 'scenario_a');

    const csvStr = BenchmarkExporter.toCSV(result);
    assert.ok(csvStr.includes('# Leveonas Phase 3 Benchmark Export'));
    assert.ok(csvStr.includes('Input Tokens'));
    assert.ok(csvStr.includes('Output Tokens'));
    assert.ok(csvStr.includes('Total Tokens'));
    assert.ok(csvStr.includes('NORMAL'));
    assert.ok(csvStr.includes('LEVEONAS'));
  });

  // =========================================================================
  // 6. Token Economics & Null Token Handling
  // =========================================================================
  it('9. Token metrics calculations never estimate missing tokens from characters', () => {
    const res = compareTokens({
      normalInputTokens: 120,
      normalOutputTokens: 1000,
      leveonasInputTokens: 160,
      leveonasOutputTokens: 400,
    });

    assert.strictEqual(res.outputTokenReduction, 600);
    assert.strictEqual(res.outputTokenReductionPercent, 60);
    assert.strictEqual(res.totalTokenReduction, 560);
    assert.strictEqual(res.inputTokenDifference, 40); // Tracked separately, NOT savings

    // When tokens are null
    const stats = calculateMetricStatistics([null, null]);
    assert.strictEqual(stats.mean, null);
    assert.strictEqual(stats.median, null);
    assert.strictEqual(stats.count, 0);
  });

  // =========================================================================
  // 7. Cross-Framework Scenario Execution Simulation
  // =========================================================================
  it('10. Executes all 5 scenarios across HTML, React, Vue, Svelte & Angular', async () => {
    const frameworks: BenchmarkFramework[] = ['html', 'react', 'vue', 'svelte', 'angular'];
    const scenarios: BenchmarkScenarioId[] = ['scenario_a', 'scenario_b', 'scenario_c', 'scenario_d', 'scenario_e'];

    for (const fw of frameworks) {
      for (const sc of scenarios) {
        const executor = createMockBenchmarkExecutor({
          providerTokens: {
            normal: { inputTokens: 100, outputTokens: 900, totalTokens: 1000 },
            leveonas: { inputTokens: 130, outputTokens: 350, totalTokens: 480 },
          },
        });

        const result = await runABBenchmark({
          provider: 'gemini',
          model: 'gemini-2.5-flash',
          framework: fw,
          scenario: sc,
          iterations: 1,
          executor,
        });

        assert.ok(result);
        assert.strictEqual(result.framework, fw);
        assert.strictEqual(result.scenario, sc);
        assert.ok(result.comparison.outputTokenReduction! > 0);
      }
    }
  });
});
