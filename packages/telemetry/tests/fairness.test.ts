import test from 'node:test';
import assert from 'node:assert/strict';
import {
  runABBenchmark,
  createMockBenchmarkExecutor,
  BenchmarkRunExecutorInput,
} from '../benchmark';
import { BenchmarkMode } from '../types';

test('1. Randomizes execution order per iteration using injected deterministic RNG', async () => {
  // Mock RNG sequence: [0.1 (NORMAL first), 0.8 (LEVEONAS first), 0.2 (NORMAL first), 0.9 (LEVEONAS first)]
  const values = [0.1, 0.8, 0.2, 0.9];
  let idx = 0;
  const deterministicRng = () => {
    const val = values[idx % values.length];
    idx++;
    return val;
  };

  const executedOrder: BenchmarkMode[] = [];
  const executor = async (input: BenchmarkRunExecutorInput) => {
    executedOrder.push(input.mode);
    const mock = createMockBenchmarkExecutor();
    return mock(input);
  };

  const result = await runABBenchmark({
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    iterations: 4,
    executor,
    randomFn: deterministicRng,
  });

  assert.equal(result.iterations, 4);
  assert.deepEqual(result.executionOrders[0], ['NORMAL', 'LEVEONAS']);
  assert.deepEqual(result.executionOrders[1], ['LEVEONAS', 'NORMAL']);
  assert.deepEqual(result.executionOrders[2], ['NORMAL', 'LEVEONAS']);
  assert.deepEqual(result.executionOrders[3], ['LEVEONAS', 'NORMAL']);

  // Check actual execution sequence
  assert.deepEqual(executedOrder, [
    'NORMAL',
    'LEVEONAS',
    'LEVEONAS',
    'NORMAL',
    'NORMAL',
    'LEVEONAS',
    'LEVEONAS',
    'NORMAL',
  ]);

  // Check iterationsList
  assert.ok(result.iterationsList);
  assert.equal(result.iterationsList.length, 4);
  assert.deepEqual(result.iterationsList[0].executionOrder, ['NORMAL', 'LEVEONAS']);
  assert.deepEqual(result.iterationsList[1].executionOrder, ['LEVEONAS', 'NORMAL']);
});

test('2. Ensures identical prompt, provider, model, and generation settings across both arms', async () => {
  const capturedInputs: BenchmarkRunExecutorInput[] = [];

  const executor = async (input: BenchmarkRunExecutorInput) => {
    capturedInputs.push(input);
    const mock = createMockBenchmarkExecutor();
    return mock(input);
  };

  await runABBenchmark({
    provider: 'openai',
    model: 'gpt-4o',
    prompt: 'Build a dashboard with navigation and real-time metrics',
    iterations: 2,
    maxTokens: 2048,
    temperature: 0.2,
    seed: 42,
    executor,
    randomFn: () => 0.1, // always NORMAL first
  });

  assert.equal(capturedInputs.length, 4);

  // Iteration 1
  const normal1 = capturedInputs.find((i) => i.iteration === 1 && i.mode === 'NORMAL')!;
  const leveonas1 = capturedInputs.find((i) => i.iteration === 1 && i.mode === 'LEVEONAS')!;

  assert.equal(normal1.provider, leveonas1.provider);
  assert.equal(normal1.model, leveonas1.model);
  assert.equal(normal1.prompt, leveonas1.prompt);
  assert.equal(normal1.generationSettings.maxTokens, leveonas1.generationSettings.maxTokens);
  assert.equal(normal1.generationSettings.temperature, leveonas1.generationSettings.temperature);
  assert.equal(normal1.generationSettings.seed, leveonas1.generationSettings.seed);

  // Only systemInstruction should differ
  assert.notEqual(normal1.systemInstruction, leveonas1.systemInstruction);
  assert.notEqual(normal1.runId, leveonas1.runId);
});
