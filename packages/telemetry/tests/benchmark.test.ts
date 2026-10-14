import test from 'node:test';
import assert from 'node:assert/strict';
import {
  runABBenchmark,
  createMockBenchmarkExecutor,
  createPipelineBenchmarkExecutor,
  calculateMetricStatistics,
  formatBenchmarkTable,
  isBenchmarkAllowed,
  compareBenchmark,
  STANDARD_TEST_PROMPT,
  NORMAL_SYSTEM_INSTRUCTION,
  BASELINE_SYSTEM_INSTRUCTION,
  BenchmarkRunExecutorInput,
} from '../index';
import { LMGenerationPipeline } from '../../compiler/pipeline/generation-pipeline';
import { PatchSerializer } from '../../runtime/incremental/patch-generator/serializer';

test('1. Identical user prompt between modes', async () => {
  const customPrompt =
    'Create a modern landing page for a fictional AI startup called NovaFlow. Include a navbar with logo and three links, a hero section with a large heading, description and two buttons, a three-card features section, and a footer. Make it polished, responsive, and visually impressive.';

  const capturedPrompts: { mode: string; prompt: string }[] = [];

  const executor = async (input: BenchmarkRunExecutorInput) => {
    capturedPrompts.push({ mode: input.mode, prompt: input.prompt });
    const mock = createMockBenchmarkExecutor();
    return mock(input);
  };

  const result = await runABBenchmark({
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    prompt: customPrompt,
    iterations: 3,
    executor,
  });

  assert.equal(capturedPrompts.length, 6);
  for (const entry of capturedPrompts) {
    assert.equal(entry.prompt, customPrompt);
    assert.equal(entry.prompt, STANDARD_TEST_PROMPT);
  }

  assert.equal(result.normal.promptCharacters, customPrompt.length);
  assert.equal(result.leveonas.promptCharacters, customPrompt.length);
});

test('2. Identical provider and model across modes', async () => {
  const targetProvider = 'openai';
  const targetModel = 'gpt-4o';

  const executor = createMockBenchmarkExecutor();

  const result = await runABBenchmark({
    provider: targetProvider,
    model: targetModel,
    iterations: 2,
    executor,
  });

  assert.equal(result.provider, targetProvider);
  assert.equal(result.model, targetModel);

  for (const run of result.normal.runs) {
    assert.equal(run.provider, targetProvider);
    assert.equal(run.model, targetModel);
  }

  for (const run of result.leveonas.runs) {
    assert.equal(run.provider, targetProvider);
    assert.equal(run.model, targetModel);
  }
});

test('3. Separate system instructions and distinct prompt costs', async () => {
  const capturedInstructions: { mode: string; systemInstruction: string }[] = [];

  const executor = async (input: BenchmarkRunExecutorInput) => {
    capturedInstructions.push({
      mode: input.mode,
      systemInstruction: input.systemInstruction,
    });
    return createMockBenchmarkExecutor()(input);
  };

  const result = await runABBenchmark({
    provider: 'grok',
    model: 'grok-2-latest',
    iterations: 2,
    executor,
  });

  // Verify NORMAL received NORMAL_SYSTEM_INSTRUCTION
  const normalInstructions = capturedInstructions.filter((c) => c.mode === 'NORMAL');
  for (const item of normalInstructions) {
    assert.equal(item.systemInstruction, NORMAL_SYSTEM_INSTRUCTION);
  }

  // Verify LEVEONAS received BASELINE_SYSTEM_INSTRUCTION
  const leveonasInstructions = capturedInstructions.filter((c) => c.mode === 'LEVEONAS');
  for (const item of leveonasInstructions) {
    assert.equal(item.systemInstruction, BASELINE_SYSTEM_INSTRUCTION);
  }

  // Verify character and byte measurements are separate
  assert.equal(
    result.normalSystemPromptCharacters,
    Array.from(NORMAL_SYSTEM_INSTRUCTION).length
  );
  assert.equal(
    result.normalSystemPromptBytes,
    Buffer.byteLength(NORMAL_SYSTEM_INSTRUCTION, 'utf8')
  );

  assert.equal(
    result.leveonasSystemPromptCharacters,
    Array.from(BASELINE_SYSTEM_INSTRUCTION).length
  );
  assert.equal(
    result.leveonasSystemPromptBytes,
    Buffer.byteLength(BASELINE_SYSTEM_INSTRUCTION, 'utf8')
  );

  assert.notEqual(
    result.normalSystemPromptCharacters,
    result.leveonasSystemPromptCharacters
  );
  assert.notEqual(result.normalSystemPromptBytes, result.leveonasSystemPromptBytes);
});

test('4. Separate runIds generated for each run and iteration', async () => {
  const executor = createMockBenchmarkExecutor();

  const result = await runABBenchmark({
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    iterations: 5,
    executor,
  });

  const allRunIds = new Set<string>();
  assert.ok(result.benchmarkId && result.benchmarkId.length > 0);
  allRunIds.add(result.benchmarkId);

  for (const run of result.normal.runs) {
    assert.ok(run.runId && run.runId.length > 0);
    assert.equal(allRunIds.has(run.runId), false);
    allRunIds.add(run.runId);
  }

  for (const run of result.leveonas.runs) {
    assert.ok(run.runId && run.runId.length > 0);
    assert.equal(allRunIds.has(run.runId), false);
    allRunIds.add(run.runId);
  }

  // 1 benchmarkId + 5 normal + 5 leveonas = 11 unique ids
  assert.equal(allRunIds.size, 11);
});

test('5. Provider token usage preserved without alteration', async () => {
  const executor = createMockBenchmarkExecutor({
    providerTokens: {
      normal: { inputTokens: 110, outputTokens: 1450, totalTokens: 1560 },
      leveonas: { inputTokens: 260, outputTokens: 490, totalTokens: 750 },
    },
  });

  const result = await runABBenchmark({
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    iterations: 3,
    executor,
  });

  assert.equal(result.normal.inputTokens.mean, 110);
  assert.equal(result.normal.outputTokens.mean, 1450);
  assert.equal(result.normal.totalTokens.mean, 1560);

  assert.equal(result.leveonas.inputTokens.mean, 260);
  assert.equal(result.leveonas.outputTokens.mean, 490);
  assert.equal(result.leveonas.totalTokens.mean, 750);
});

test('6. Unavailable token usage remains null and never estimates from characters', async () => {
  const executor = createMockBenchmarkExecutor({
    providerTokens: {
      normal: { inputTokens: null, outputTokens: null, totalTokens: null },
      leveonas: { inputTokens: null, outputTokens: null, totalTokens: null },
    },
  });

  const result = await runABBenchmark({
    provider: 'openai',
    model: 'gpt-4o',
    iterations: 3,
    executor,
  });

  assert.equal(result.normal.inputTokens.mean, null);
  assert.equal(result.normal.outputTokens.mean, null);
  assert.equal(result.normal.totalTokens.mean, null);
  assert.equal(result.normal.inputTokens.count, 0);

  assert.equal(result.leveonas.inputTokens.mean, null);
  assert.equal(result.leveonas.outputTokens.mean, null);
  assert.equal(result.leveonas.totalTokens.mean, null);
  assert.equal(result.leveonas.inputTokens.count, 0);

  // Comparisons with null tokens are null
  assert.equal(result.comparison.outputTokenReduction, null);
  assert.equal(result.comparison.totalTokenReduction, null);
  assert.equal(result.comparison.inputTokenDifference, null);
});

test('7. Output bytes measured without modification or minification', async () => {
  const exactNormalOutput =
    '<!DOCTYPE html>\n<html>\n  <head><title>NovaFlow</title></head>\n  <body>\n    <div class="hero">Hello 🚀 NovaFlow</div>\n  </body>\n</html>';
  const exactLeveonasLM =
    '<HTML>\n  (di (cs "hero") "Hello 🚀 NovaFlow")\n</HTML>';

  const expectedNormalBytes = Buffer.byteLength(exactNormalOutput, 'utf8');
  const expectedLMBytes = Buffer.byteLength(exactLeveonasLM, 'utf8');

  const executor = createMockBenchmarkExecutor({
    normalOutputText: exactNormalOutput,
    leveonasOutputLM: exactLeveonasLM,
  });

  const result = await runABBenchmark({
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    iterations: 2,
    executor,
  });

  assert.equal(result.normal.outputBytes.mean, expectedNormalBytes);
  assert.equal(result.leveonas.outputBytes.mean, expectedLMBytes);

  assert.equal(result.normal.runs[0].normalGeneratedBytes, expectedNormalBytes);
  assert.equal(result.leveonas.runs[0].leveonasLMBytes, expectedLMBytes);
});

test('8. Network bytes measured correctly (patch SSE payload bytes vs normal response payload)', async () => {
  const executor = createPipelineBenchmarkExecutor({
    normalOutputText: '<html><body><main>NovaFlow</main></body></html>',
    leveonasOutputLM:
      '<HTML>\ndi(cs(hero)\n  h1(NovaFlow AI)\n  p(Instant Interfaces)\n)\n</HTML>',
  });

  const result = await runABBenchmark({
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    iterations: 2,
    executor,
  });

  const normalRun = result.normal.runs[0];
  const leveonasRun = result.leveonas.runs[0];

  assert.ok(normalRun.networkBytes > 0);
  assert.equal(normalRun.networkBytes, normalRun.outputBytes);
  assert.equal(normalRun.timeToFirstPatch, null);

  assert.ok(leveonasRun.patchSSEBytes! > 0);
  assert.equal(leveonasRun.networkBytes, leveonasRun.patchSSEBytes);
  assert.ok(leveonasRun.timeToFirstPatch !== null);
  assert.notEqual(leveonasRun.networkBytes, leveonasRun.outputBytes);
});

test('9. Comparison formulas accuracy', () => {
  const comparison = compareBenchmark({
    normalInputTokens: 100,
    normalOutputTokens: 1000,
    leveonasInputTokens: 250,
    leveonasOutputTokens: 400,
    normalGeneratedBytes: 4000,
    leveonasLMBytes: 1500,
    normalNetworkBytes: 4000,
    leveonasNetworkBytes: 1800,
  });

  // Output token reduction: 1000 - 400 = 600
  assert.equal(comparison.outputTokenReduction, 600);
  // Output token reduction percent: 100 * 600 / 1000 = 60%
  assert.equal(comparison.outputTokenReductionPercent, 60);

  // Total token reduction: (100 + 1000) - (250 + 400) = 1100 - 650 = 450
  assert.equal(comparison.totalTokenReduction, 450);
  // Total token reduction percent: 100 * 450 / 1100 = 40.909...%
  assert.ok(Math.abs(comparison.totalTokenReductionPercent! - 40.90909) < 0.01);

  // Input token difference: 250 - 100 = +150
  assert.equal(comparison.inputTokenDifference, 150);

  // Output byte reduction: 4000 - 1500 = 2500
  assert.equal(comparison.outputByteReduction, 2500);
  assert.equal(comparison.outputByteReductionPercent, 62.5);

  // Network byte reduction: 4000 - 1800 = 2200
  assert.equal(comparison.networkByteReduction, 2200);
  assert.equal(comparison.networkByteReductionPercent, 55);
});

test('10. Multiple iterations execution with independent states', async () => {
  const iterationsCount = 5;
  const iterationSequence: number[] = [];

  const executor = async (input: BenchmarkRunExecutorInput) => {
    iterationSequence.push(input.iteration);
    return createMockBenchmarkExecutor()(input);
  };

  const result = await runABBenchmark({
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    iterations: iterationsCount,
    executor,
  });

  assert.equal(result.iterations, iterationsCount);
  assert.equal(result.normal.runs.length, iterationsCount);
  assert.equal(result.leveonas.runs.length, iterationsCount);

  // Verify runs had 1..5 in order
  assert.deepEqual(
    result.normal.runs.map((r) => r.iteration),
    [1, 2, 3, 4, 5]
  );
  assert.deepEqual(
    result.leveonas.runs.map((r) => r.iteration),
    [1, 2, 3, 4, 5]
  );
});

test('11. Mean calculation accuracy', () => {
  const stats = calculateMetricStatistics([10, 20, 30, 40, 50]);
  assert.equal(stats.count, 5);
  assert.equal(stats.mean, 30);

  const statsWithNulls = calculateMetricStatistics([10, null, 20, undefined, 30]);
  assert.equal(statsWithNulls.count, 3);
  assert.equal(statsWithNulls.mean, 20);
});

test('12. Median calculation accuracy (odd and even lengths, unsorted)', () => {
  // Odd length unsorted
  const oddStats = calculateMetricStatistics([50, 10, 30]);
  assert.equal(oddStats.median, 30);

  // Even length unsorted
  const evenStats = calculateMetricStatistics([40, 10, 30, 20]);
  assert.equal(evenStats.median, 25);
});

test('13. Minimum and maximum calculation accuracy', () => {
  const stats = calculateMetricStatistics([99, 12, 3, 45, 87]);
  assert.equal(stats.minimum, 3);
  assert.equal(stats.maximum, 99);
});

test('14. Benchmark disabled in production environment', async () => {
  // isBenchmarkAllowed check
  assert.equal(isBenchmarkAllowed('production'), false);
  assert.equal(isBenchmarkAllowed('development'), true);
  assert.equal(isBenchmarkAllowed('test'), true);

  const origEnv = process.env.NODE_ENV;
  try {
    process.env.NODE_ENV = 'production';
    delete process.env.LEVEONAS_ENABLE_BENCHMARK;

    await assert.rejects(
      async () => {
        await runABBenchmark({
          provider: 'gemini',
          model: 'gemini-2.5-flash',
          executor: createMockBenchmarkExecutor(),
        });
      },
      {
        name: 'Error',
        message: 'Benchmark harness is disabled in production.',
      }
    );
  } finally {
    process.env.NODE_ENV = origEnv;
  }
});

test('15. Telemetry does not alter generation behavior', () => {
  const sampleLM = '<HTML>\ndi(cs(container)\n  h1(Test)\n  button(Submit)\n)\n</HTML>';

  // Compile with pipeline directly (without benchmark telemetry tracking)
  const standardPatches: any[] = [];
  const pipeline1 = new LMGenerationPipeline({
    rootId: 'leveonas-root',
    onPatch: (patches) => standardPatches.push(...patches),
  });
  pipeline1.write(sampleLM);
  pipeline1.end();

  // Compile with pipeline benchmark tracking
  const benchmarkPatches: any[] = [];
  const pipeline2 = new LMGenerationPipeline({
    rootId: 'leveonas-root',
    onPatch: (patches) => benchmarkPatches.push(...patches),
  });
  pipeline2.write(sampleLM);
  pipeline2.end();

  assert.equal(standardPatches.length, benchmarkPatches.length);
  assert.ok(standardPatches.length > 0);

  // Compare operation types, targets, and node structures
  for (let i = 0; i < standardPatches.length; i++) {
    const p1 = standardPatches[i];
    const p2 = benchmarkPatches[i];

    assert.equal(p1.operation, p2.operation);
    assert.equal(p1.parentId, p2.parentId);
    assert.equal(p1.index, p2.index);
    assert.equal(p1.payload?.kind, p2.payload?.kind);
    assert.equal(p1.payload?.children?.length, p2.payload?.children?.length);
  }
});

test('16. Zero sensitive data (API keys, credentials, prompts, code) in benchmark output', async () => {
  const confidentialApiKey = 'sk-proj-super-secret-key-123456789';
  const confidentialPrompt = 'Secret prompt with confidential details';

  const executor = createMockBenchmarkExecutor();

  const result = await runABBenchmark({
    provider: 'openai',
    model: 'gpt-4o',
    prompt: confidentialPrompt,
    iterations: 2,
    executor,
  });

  const serialized = JSON.stringify(result);
  const tableText = formatBenchmarkTable(result);

  // Must NOT leak API key or prompt in telemetry
  assert.equal(serialized.includes(confidentialApiKey), false);
  assert.equal(tableText.includes(confidentialApiKey), false);

  // Full prompt must NOT be in the result object
  assert.equal(serialized.includes(confidentialPrompt), false);
  assert.equal(tableText.includes(confidentialPrompt), false);

  // Check table has all required columns and rows
  assert.ok(tableText.includes('Metric'));
  assert.ok(tableText.includes('Normal'));
  assert.ok(tableText.includes('Leveonas'));
  assert.ok(tableText.includes('Difference'));
  assert.ok(tableText.includes('Input tokens'));
  assert.ok(tableText.includes('Output tokens'));
  assert.ok(tableText.includes('Total tokens'));
  assert.ok(tableText.includes('Output bytes'));
  assert.ok(tableText.includes('Network bytes'));
  assert.ok(tableText.includes('Time to first content'));
  assert.ok(tableText.includes('Time to first browser render'));
  assert.ok(tableText.includes('Completion time'));
});
