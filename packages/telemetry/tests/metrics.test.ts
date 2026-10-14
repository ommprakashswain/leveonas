import test from 'node:test';
import assert from 'node:assert/strict';
import {
  runABBenchmark,
  createMockBenchmarkExecutor,
  aggregateModeStatistics,
} from '../benchmark';
import { BenchmarkRunMetrics } from '../types';

test('1. Accurately distinguishes modelOutputBytes, applicationSSEBytes, and patchBytes', async () => {
  const normalText = '<!DOCTYPE html><html><body><h1>Hello World</h1></body></html>';
  const leveonasLM = '<HTML>\ndi(h1(Hello World))\n</HTML>';

  const executor = createMockBenchmarkExecutor({
    normalOutputText: normalText,
    leveonasOutputLM: leveonasLM,
    patchSSEBytes: 85,
  });

  const result = await runABBenchmark({
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    iterations: 1,
    executor,
    randomFn: () => 0.1,
  });

  const normalRun = result.normal.runs[0];
  const leveonasRun = result.leveonas.runs[0];

  assert.equal(normalRun.modelOutputBytes, Buffer.byteLength(normalText, 'utf8'));
  assert.equal(normalRun.applicationSSEBytes, Buffer.byteLength(normalText, 'utf8'));
  assert.equal(normalRun.providerTransportBytes, null);

  assert.equal(leveonasRun.modelOutputBytes, Buffer.byteLength(leveonasLM, 'utf8'));
  assert.equal(leveonasRun.applicationSSEBytes, 85);
  assert.equal(leveonasRun.providerTransportBytes, null);
});

test('2. Preserves null tokens when provider does not report usage', async () => {
  const executor = createMockBenchmarkExecutor({
    providerTokens: {
      normal: { inputTokens: null, outputTokens: null, totalTokens: null },
      leveonas: { inputTokens: null, outputTokens: null, totalTokens: null },
    },
  });

  const result = await runABBenchmark({
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    iterations: 2,
    executor,
    randomFn: () => 0.1,
  });

  assert.equal(result.normal.inputTokens.mean, null);
  assert.equal(result.normal.outputTokens.mean, null);
  assert.equal(result.normal.totalTokens.mean, null);

  assert.equal(result.leveonas.inputTokens.mean, null);
  assert.equal(result.leveonas.outputTokens.mean, null);
  assert.equal(result.leveonas.totalTokens.mean, null);

  assert.equal(result.comparison.outputTokenReduction, null);
  assert.equal(result.comparison.totalTokenReduction, null);
});

test('3. Strictly excludes failed and aborted runs from descriptive statistics', () => {
  const baseRun: BenchmarkRunMetrics = {
    runId: 'run-1',
    iteration: 1,
    mode: 'LEVEONAS',
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    status: 'success',
    promptCharacters: 100,
    systemPromptCharacters: 200,
    systemPromptBytes: 200,
    inputTokens: 50,
    outputTokens: 100,
    totalTokens: 150,
    outputCharacters: 200,
    outputCodeUnits: 200,
    modelOutputBytes: 200,
    applicationSSEBytes: 250,
    providerTransportBytes: null,
    outputBytes: 200,
    networkBytes: 250,
    timeToFirstProviderChunk: 100,
    timeToFirstContent: 150,
    timeToFirstPatch: 180,
    timeToFirstBrowserRender: 200,
    timeToCompletion: 500,
    generationSettings: { maxTokens: 1000 },
  };

  const failedRun: BenchmarkRunMetrics = {
    ...baseRun,
    runId: 'run-2',
    iteration: 2,
    status: 'failed',
    outputTokens: 999999, // Should NOT contaminate mean
    modelOutputBytes: 999999,
  };

  const abortedRun: BenchmarkRunMetrics = {
    ...baseRun,
    runId: 'run-3',
    iteration: 3,
    status: 'aborted',
    outputTokens: 999999, // Should NOT contaminate mean
  };

  const stats = aggregateModeStatistics([baseRun, failedRun, abortedRun], 200, 200, 100);

  assert.equal(stats.totalRunsCount, 3);
  assert.equal(stats.successfulRunsCount, 1);
  assert.equal(stats.outputTokens.mean, 100);
  assert.equal(stats.outputTokens.count, 1);
  assert.equal(stats.modelOutputBytes.mean, 200);
});
