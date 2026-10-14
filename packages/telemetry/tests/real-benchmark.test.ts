import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  createRealBenchmarkExecutor,
  runABBenchmark,
  isBenchmarkAllowed,
  NORMAL_SYSTEM_INSTRUCTION,
  BASELINE_SYSTEM_INSTRUCTION,
  BenchmarkRunExecutorInput,
} from '@/packages/telemetry';

function createMockSSEResponse(
  chunks: string[],
  options: { status?: number; statusText?: string } = {}
): Response {
  const status = options.status ?? 200;
  const statusText = options.statusText ?? 'OK';
  if (status !== 200) {
    return new Response('Mock provider error details', { status, statusText });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    status: 200,
    headers: { 'Content-Type': 'text/event-stream' },
  });
}

describe('Real Benchmark Executor (Scientifically Rigorous & Real Streaming)', () => {
  // Test 1: NORMAL uses real provider adapter abstraction
  it('1. NORMAL uses real provider adapter abstraction', async () => {
    let capturedUrl = '';
    let capturedHeaders: any = {};
    let capturedBody: any = {};

    const fetchFn: typeof fetch = async (url, init) => {
      capturedUrl = String(url);
      capturedHeaders = init?.headers;
      capturedBody = JSON.parse(String(init?.body));
      return createMockSSEResponse([
        'data: {"choices":[{"delta":{"content":"<h1>Hello NORMAL</h1>"}}]}\n\n',
        'data: [DONE]\n\n',
      ]);
    };

    const executor = createRealBenchmarkExecutor({
      userLlmKey: 'test-key-openai',
      fetchFn,
    });

    const metrics = await executor({
      mode: 'NORMAL',
      provider: 'openai',
      model: 'gpt-4o-mini',
      prompt: 'Build a landing page',
      systemInstruction: NORMAL_SYSTEM_INSTRUCTION,
      runId: 'normal-run-1',
      iteration: 1,
    });

    assert.equal(capturedUrl, 'https://api.openai.com/v1/chat/completions');
    assert.equal(capturedHeaders['Authorization'], 'Bearer test-key-openai');
    assert.equal(capturedBody.model, 'gpt-4o-mini');
    assert.equal(capturedBody.messages[0].content, NORMAL_SYSTEM_INSTRUCTION);
    assert.equal(capturedBody.messages[1].content, 'Build a landing page');

    assert.equal(metrics.mode, 'NORMAL');
    assert.equal(metrics.outputCharacters, '<h1>Hello NORMAL</h1>'.length);
    assert.equal(metrics.timeToFirstPatch, null);
    assert.equal(metrics.timeToFirstBrowserRender, null);
    assert.ok(metrics.normalGeneratedBytes! > 0);
  });

  // Test 2: LEVEONAS uses real provider adapter abstraction
  it('2. LEVEONAS uses real provider adapter abstraction', async () => {
    let capturedUrl = '';
    let capturedHeaders: any = {};
    let capturedBody: any = {};

    const fetchFn: typeof fetch = async (url, init) => {
      capturedUrl = String(url);
      capturedHeaders = init?.headers;
      capturedBody = JSON.parse(String(init?.body));
      return createMockSSEResponse([
        'data: {"candidates":[{"content":{"parts":[{"text":"<HTML>\\nh1(id(title) Hello LEVEONAS)\\n</HTML>"}]}}]}\n\n',
      ]);
    };

    const executor = createRealBenchmarkExecutor({
      userLlmKey: 'test-key-gemini',
      fetchFn,
    });

    const metrics = await executor({
      mode: 'LEVEONAS',
      provider: 'gemini',
      model: 'gemini-2.5-flash',
      prompt: 'Build a landing page',
      systemInstruction: BASELINE_SYSTEM_INSTRUCTION,
      runId: 'leveonas-run-1',
      iteration: 1,
    });

    assert.ok(capturedUrl.includes('generativelanguage.googleapis.com'));
    assert.equal(capturedHeaders['x-goog-api-key'], 'test-key-gemini');
    assert.equal(capturedBody.contents[0].parts[0].text, 'Build a landing page');

    assert.equal(metrics.mode, 'LEVEONAS');
    assert.ok(metrics.leveonasLMBytes! > 0);
    assert.ok(metrics.patchSSEBytes! > 0);
    assert.notEqual(metrics.timeToFirstPatch, null);
    assert.equal(metrics.timeToFirstBrowserRender, null);
  });

  // Test 3: same prompt passed to both runs
  it('3. same prompt received by both NORMAL and LEVEONAS', async () => {
    const receivedPrompts: string[] = [];

    const fetchFn: typeof fetch = async (_url, init) => {
      const body = JSON.parse(String(init?.body));
      const prompt = body.messages ? body.messages[1].content : body.contents[0].parts[0].text;
      receivedPrompts.push(prompt);
      return createMockSSEResponse([
        'data: {"choices":[{"delta":{"content":"(h1 \\"Hi\\")"}}]}\n\n',
        'data: [DONE]\n\n',
      ]);
    };

    const executor = createRealBenchmarkExecutor({
      userLlmKey: 'dummy-key',
      fetchFn,
    });

    await runABBenchmark({
      provider: 'openai',
      model: 'gpt-4o-mini',
      prompt: 'Identical scientific test prompt',
      iterations: 1,
      executor,
    });

    assert.equal(receivedPrompts.length, 2);
    assert.equal(receivedPrompts[0], 'Identical scientific test prompt');
    assert.equal(receivedPrompts[1], 'Identical scientific test prompt');
  });

  // Test 4: same model passed to both runs
  it('4. same model used for both NORMAL and LEVEONAS', async () => {
    const receivedModels: string[] = [];

    const fetchFn: typeof fetch = async (_url, init) => {
      const body = JSON.parse(String(init?.body));
      receivedModels.push(body.model);
      return createMockSSEResponse([
        'data: {"choices":[{"delta":{"content":"(h1 \\"Hi\\")"}}]}\n\n',
        'data: [DONE]\n\n',
      ]);
    };

    const executor = createRealBenchmarkExecutor({
      userLlmKey: 'dummy-key',
      fetchFn,
    });

    await runABBenchmark({
      provider: 'openai',
      model: 'gpt-4o-mini-2024-07-18',
      iterations: 1,
      executor,
    });

    assert.equal(receivedModels.length, 2);
    assert.equal(receivedModels[0], 'gpt-4o-mini-2024-07-18');
    assert.equal(receivedModels[1], 'gpt-4o-mini-2024-07-18');
  });

  // Test 5: same generation settings passed to both runs
  it('5. same generation settings passed identically', async () => {
    const capturedConfigs: any[] = [];

    const fetchFn: typeof fetch = async (_url, init) => {
      const body = JSON.parse(String(init?.body));
      capturedConfigs.push({
        max_tokens: body.max_tokens,
        temperature: body.temperature,
        seed: body.seed,
      });
      return createMockSSEResponse([
        'data: {"choices":[{"delta":{"content":"(h1 \\"Hi\\")"}}]}\n\n',
        'data: [DONE]\n\n',
      ]);
    };

    const executor = createRealBenchmarkExecutor({
      userLlmKey: 'dummy-key',
      fetchFn,
    });

    await runABBenchmark({
      provider: 'openai',
      model: 'gpt-4o-mini',
      maxTokens: 2048,
      temperature: 0.3,
      seed: 42,
      iterations: 1,
      executor,
    });

    assert.equal(capturedConfigs.length, 2);
    assert.deepEqual(capturedConfigs[0], {
      max_tokens: 2048,
      temperature: 0.3,
      seed: 42,
    });
    assert.deepEqual(capturedConfigs[1], {
      max_tokens: 2048,
      temperature: 0.3,
      seed: 42,
    });
  });

  // Test 6: different system instructions
  it('6. different system instructions (NORMAL vs BASELINE)', async () => {
    const capturedInstructions: string[] = [];

    const fetchFn: typeof fetch = async (_url, init) => {
      const body = JSON.parse(String(init?.body));
      capturedInstructions.push(body.messages[0].content);
      return createMockSSEResponse([
        'data: {"choices":[{"delta":{"content":"(h1 \\"Hi\\")"}}]}\n\n',
        'data: [DONE]\n\n',
      ]);
    };

    const executor = createRealBenchmarkExecutor({
      userLlmKey: 'dummy-key',
      fetchFn,
    });

    await runABBenchmark({
      provider: 'openai',
      model: 'gpt-4o-mini',
      iterations: 1,
      executor,
    });

    assert.equal(capturedInstructions.length, 2);
    assert.ok(capturedInstructions.includes(NORMAL_SYSTEM_INSTRUCTION));
    assert.ok(capturedInstructions.includes(BASELINE_SYSTEM_INSTRUCTION));
    assert.notEqual(capturedInstructions[0], capturedInstructions[1]);
  });

  // Test 7: real chunks are fed incrementally
  it('7. real chunks are fed incrementally', async () => {
    const fetchFn: typeof fetch = async () => {
      return createMockSSEResponse([
        'data: {"candidates":[{"content":{"parts":[{"text":"<HTML>\\nh1("}]}}]}\n\n',
        'data: {"candidates":[{"content":{"parts":[{"text":"id(title) "}]}}]}\n\n',
        'data: {"candidates":[{"content":{"parts":[{"text":"Streaming Success)\\n</HTML>"}]}}]}\n\n',
      ]);
    };

    const executor = createRealBenchmarkExecutor({
      userLlmKey: 'dummy-key',
      fetchFn,
    });

    const metrics = await executor({
      mode: 'LEVEONAS',
      provider: 'gemini',
      model: 'gemini-2.5-flash',
      prompt: 'test',
      systemInstruction: BASELINE_SYSTEM_INSTRUCTION,
      runId: 'inc-run-1',
      iteration: 1,
    });

    assert.equal(metrics.outputCharacters, '<HTML>\nh1(id(title) Streaming Success)\n</HTML>'.length);
    assert.ok(metrics.patchSSEBytes! > 0);
  });

  // Test 8: provider usage is preserved
  it('8. provider usage is preserved accurately from stream', async () => {
    const fetchFn: typeof fetch = async () => {
      return createMockSSEResponse([
        'data: {"choices":[{"delta":{"content":"<h1>Title</h1>"}}]}\n\n',
        'data: {"choices":[],"usage":{"prompt_tokens":142,"completion_tokens":28,"total_tokens":170}}\n\n',
        'data: [DONE]\n\n',
      ]);
    };

    const executor = createRealBenchmarkExecutor({
      userLlmKey: 'dummy-key',
      fetchFn,
    });

    const metrics = await executor({
      mode: 'NORMAL',
      provider: 'openai',
      model: 'gpt-4o-mini',
      prompt: 'test',
      systemInstruction: NORMAL_SYSTEM_INSTRUCTION,
      runId: 'usage-run-1',
      iteration: 1,
    });

    assert.equal(metrics.inputTokens, 142);
    assert.equal(metrics.outputTokens, 28);
    assert.equal(metrics.totalTokens, 170);
  });

  // Test 9: missing usage remains null
  it('9. missing usage remains null without fallback', async () => {
    const fetchFn: typeof fetch = async () => {
      return createMockSSEResponse([
        'data: {"choices":[{"delta":{"content":"<h1>No Usage Here</h1>"}}]}\n\n',
        'data: [DONE]\n\n',
      ]);
    };

    const executor = createRealBenchmarkExecutor({
      userLlmKey: 'dummy-key',
      fetchFn,
    });

    const metrics = await executor({
      mode: 'NORMAL',
      provider: 'openai',
      model: 'gpt-4o-mini',
      prompt: 'test',
      systemInstruction: NORMAL_SYSTEM_INSTRUCTION,
      runId: 'no-usage-run',
      iteration: 1,
    });

    assert.equal(metrics.inputTokens, null);
    assert.equal(metrics.outputTokens, null);
    assert.equal(metrics.totalTokens, null);
  });

  // Test 10: no token estimation from characters
  it('10. no token estimation even for large character outputs', async () => {
    const longContent = 'A'.repeat(8000);
    const fetchFn: typeof fetch = async () => {
      return createMockSSEResponse([
        `data: {"choices":[{"delta":{"content":"${longContent}"}}]}\n\n`,
        'data: [DONE]\n\n',
      ]);
    };

    const executor = createRealBenchmarkExecutor({
      userLlmKey: 'dummy-key',
      fetchFn,
    });

    const metrics = await executor({
      mode: 'NORMAL',
      provider: 'openai',
      model: 'gpt-4o-mini',
      prompt: 'test',
      systemInstruction: NORMAL_SYSTEM_INSTRUCTION,
      runId: 'large-char-run',
      iteration: 1,
    });

    assert.equal(metrics.outputCharacters, 8000);
    // Crucial: absolutely no /4 or length estimation!
    assert.equal(metrics.inputTokens, null);
    assert.equal(metrics.outputTokens, null);
    assert.equal(metrics.totalTokens, null);
  });

  // Test 11: real LM output bytes are measured
  it('11. real LM output bytes are measured byte-for-byte in UTF-8', async () => {
    const lmText = '(p "Multibyte UTF-8 characters: 🚀 🌟 ⚡")';
    const expectedBytes = Buffer.byteLength(lmText, 'utf8');

    const fetchFn: typeof fetch = async () => {
      return createMockSSEResponse([
        `data: ${JSON.stringify({ choices: [{ delta: { content: lmText } }] })}\n\n`,
        'data: [DONE]\n\n',
      ]);
    };

    const executor = createRealBenchmarkExecutor({
      userLlmKey: 'dummy-key',
      fetchFn,
    });

    const metrics = await executor({
      mode: 'LEVEONAS',
      provider: 'openai',
      model: 'gpt-4o-mini',
      prompt: 'test',
      systemInstruction: BASELINE_SYSTEM_INSTRUCTION,
      runId: 'utf8-run',
      iteration: 1,
    });

    assert.equal(metrics.outputBytes, expectedBytes);
    assert.equal(metrics.leveonasLMBytes, expectedBytes);
  });

  // Test 12: real patch bytes are measured
  it('12. real patch bytes are measured from exact patch SSE payload', async () => {
    const lmText = '<HTML>\nh1(id(heading) Test Heading)\n</HTML>';
    const fetchFn: typeof fetch = async () => {
      return createMockSSEResponse([
        `data: ${JSON.stringify({ choices: [{ delta: { content: lmText } }] })}\n\n`,
        'data: [DONE]\n\n',
      ]);
    };

    const executor = createRealBenchmarkExecutor({
      userLlmKey: 'dummy-key',
      fetchFn,
    });

    const metrics = await executor({
      mode: 'LEVEONAS',
      provider: 'openai',
      model: 'gpt-4o-mini',
      prompt: 'test',
      systemInstruction: BASELINE_SYSTEM_INSTRUCTION,
      runId: 'patch-bytes-run',
      iteration: 1,
    });

    assert.ok(metrics.patchSSEBytes! > 0);
    assert.ok(metrics.totalSSEBytes! > metrics.patchSSEBytes!);
    assert.equal(metrics.leveonasNetworkBytes, metrics.patchSSEBytes);
  });

  // Test 13: no fabricated network bytes
  it('13. no fabricated network bytes (NORMAL includes exact SSE frame overhead)', async () => {
    const rawChunk = '<div>Content</div>';
    const fetchFn: typeof fetch = async () => {
      return createMockSSEResponse([
        `data: {"choices":[{"delta":{"content":"${rawChunk}"}}]}\n\n`,
        'data: [DONE]\n\n',
      ]);
    };

    const executor = createRealBenchmarkExecutor({
      userLlmKey: 'dummy-key',
      fetchFn,
    });

    const metrics = await executor({
      mode: 'NORMAL',
      provider: 'openai',
      model: 'gpt-4o-mini',
      prompt: 'test',
      systemInstruction: NORMAL_SYSTEM_INSTRUCTION,
      runId: 'net-bytes-run',
      iteration: 1,
    });

    const expectedChunkSSE = `data: ${JSON.stringify({ text: rawChunk })}\n\n`;
    const expectedDoneSSE = 'data: [DONE]\n\n';
    const expectedNetworkBytes =
      Buffer.byteLength(expectedChunkSSE, 'utf8') + Buffer.byteLength(expectedDoneSSE, 'utf8');

    assert.equal(metrics.networkBytes, expectedNetworkBytes);
    assert.notEqual(metrics.networkBytes, metrics.outputBytes);
  });

  // Test 14: no fabricated browser render timing
  it('14. no fabricated browser render timing (server cannot fabricate browser render time)', async () => {
    const fetchFn: typeof fetch = async () => {
      return createMockSSEResponse([
        'data: {"choices":[{"delta":{"content":"(h1 \\"Hi\\")"}}]}\n\n',
        'data: [DONE]\n\n',
      ]);
    };

    const executor = createRealBenchmarkExecutor({
      userLlmKey: 'dummy-key',
      fetchFn,
    });

    const normal = await executor({
      mode: 'NORMAL',
      provider: 'openai',
      model: 'gpt-4o-mini',
      prompt: 'test',
      systemInstruction: NORMAL_SYSTEM_INSTRUCTION,
      runId: 'r1',
      iteration: 1,
    });

    const leveonas = await executor({
      mode: 'LEVEONAS',
      provider: 'openai',
      model: 'gpt-4o-mini',
      prompt: 'test',
      systemInstruction: BASELINE_SYSTEM_INSTRUCTION,
      runId: 'r2',
      iteration: 1,
    });

    assert.equal(normal.timeToFirstBrowserRender, null);
    assert.equal(leveonas.timeToFirstBrowserRender, null);
  });

  // Test 15: unique runIds
  it('15. unique runIds generated for each execution', async () => {
    const seenRunIds = new Set<string>();

    const fetchFn: typeof fetch = async () => {
      return createMockSSEResponse([
        'data: {"choices":[{"delta":{"content":"(h1 \\"Hi\\")"}}]}\n\n',
        'data: [DONE]\n\n',
      ]);
    };

    const executor = createRealBenchmarkExecutor({
      userLlmKey: 'dummy-key',
      fetchFn,
    });

    const recordingExecutor = async (input: BenchmarkRunExecutorInput) => {
      seenRunIds.add(input.runId);
      return executor(input);
    };

    await runABBenchmark({
      provider: 'openai',
      model: 'gpt-4o-mini',
      iterations: 3,
      executor: recordingExecutor,
    });

    // 3 iterations * 2 modes = 6 unique runIds
    assert.equal(seenRunIds.size, 6);
  });

  // Test 16: abort works
  it('16. abort terminates execution and throws AbortError', async () => {
    const controller = new AbortController();

    const fetchFn: typeof fetch = async (_url, init) => {
      init?.signal?.addEventListener('abort', () => {});
      controller.abort();
      return createMockSSEResponse([
        'data: {"choices":[{"delta":{"content":"chunk"}}]}\n\n',
      ]);
    };

    const executor = createRealBenchmarkExecutor({
      userLlmKey: 'dummy-key',
      fetchFn,
      signal: controller.signal,
    });

    await assert.rejects(
      async () => {
        await executor({
          mode: 'NORMAL',
          provider: 'openai',
          model: 'gpt-4o-mini',
          prompt: 'test',
          systemInstruction: NORMAL_SYSTEM_INSTRUCTION,
          runId: 'abort-run',
          iteration: 1,
        });
      },
      { name: 'AbortError' }
    );
  });

  // Test 17: provider failure is reported
  it('17. provider failure is reported without manufactured metrics', async () => {
    const fetchFn: typeof fetch = async () => {
      return createMockSSEResponse([], { status: 503, statusText: 'Service Unavailable' });
    };

    const executor = createRealBenchmarkExecutor({
      userLlmKey: 'dummy-key',
      fetchFn,
    });

    await assert.rejects(
      async () => {
        await executor({
          mode: 'NORMAL',
          provider: 'openai',
          model: 'gpt-4o-mini',
          prompt: 'test',
          systemInstruction: NORMAL_SYSTEM_INSTRUCTION,
          runId: 'fail-run',
          iteration: 1,
        });
      },
      (err: any) => {
        assert.equal(err.status, 503);
        assert.ok(err.message.includes('503'));
        return true;
      }
    );
  });

  // Test 18: malformed LM output is not silently repaired
  it('18. malformed LM output is not silently repaired', async () => {
    const malformedLM = 'div( class("unclosed attribute without closing';
    const fetchFn: typeof fetch = async () => {
      return createMockSSEResponse([
        `data: ${JSON.stringify({ choices: [{ delta: { content: malformedLM } }] })}\n\n`,
        'data: [DONE]\n\n',
      ]);
    };

    const executor = createRealBenchmarkExecutor({
      userLlmKey: 'dummy-key',
      fetchFn,
    });

    await assert.rejects(
      async () => {
        await executor({
          mode: 'LEVEONAS',
          provider: 'openai',
          model: 'gpt-4o-mini',
          prompt: 'test',
          systemInstruction: BASELINE_SYSTEM_INSTRUCTION,
          runId: 'malformed-run',
          iteration: 1,
        });
      },
      (err: any) => {
        assert.ok(err instanceof Error);
        return true;
      }
    );
  });

  // Test 19: production benchmark remains disabled
  it('19. production benchmark remains disabled', () => {
    assert.equal(isBenchmarkAllowed('production'), false);
  });

  // Test 20: live route never uses mock executor
  it('20. live route in app/api/benchmark/route.ts never imports or uses mock executors', () => {
    const routeFilePath = path.resolve(process.cwd(), 'app/api/benchmark/route.ts');
    const content = fs.readFileSync(routeFilePath, 'utf8');

    assert.ok(
      !content.includes('createMockBenchmarkExecutor'),
      'app/api/benchmark/route.ts must NOT contain createMockBenchmarkExecutor'
    );
    assert.ok(
      !content.includes('createPipelineBenchmarkExecutor'),
      'app/api/benchmark/route.ts must NOT contain createPipelineBenchmarkExecutor'
    );
    assert.ok(
      content.includes('createRealBenchmarkExecutor'),
      'app/api/benchmark/route.ts must use createRealBenchmarkExecutor'
    );
  });
});
