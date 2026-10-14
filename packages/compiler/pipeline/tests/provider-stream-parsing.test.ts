import { describe, test } from 'node:test';
import assert from 'node:assert';
import {
  streamProviderChunks,
  parseAndValidateProviderEvent,
  ProviderStreamError,
  isProviderStreamError,
  formatProviderName,
  getProviderAdapter,
  OpenAIAdapter,
  GrokAdapter,
  AnthropicAdapter,
  GeminiAdapter,
} from '../../../../app/api/generate/providers';

function createMockResponse(chunks: string[]): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });
  return new Response(stream);
}

describe('Provider Stream Parsing & Normalization', () => {
  // =========================================================================
  // 1. Valid provider SSE event
  // =========================================================================
  test('1. parses a valid provider SSE event', async () => {
    const response = createMockResponse([
      'data: {"choices":[{"delta":{"content":"Hello world"}}]}\n\n',
    ]);
    const gathered: string[] = [];

    for await (const chunk of streamProviderChunks('openai', response)) {
      gathered.push(chunk);
    }

    assert.deepStrictEqual(gathered, ['Hello world']);
  });

  // =========================================================================
  // 2. Multiple valid events
  // =========================================================================
  test('2. parses multiple sequential valid events in stream', async () => {
    const response = createMockResponse([
      'data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n',
      'data: {"choices":[{"delta":{"content":" beautiful"}}]}\n\n',
      'data: {"choices":[{"delta":{"content":" world"}}]}\n\n',
    ]);
    const gathered: string[] = [];

    for await (const chunk of streamProviderChunks('openai', response)) {
      gathered.push(chunk);
    }

    assert.deepStrictEqual(gathered, ['Hello', ' beautiful', ' world']);
    assert.strictEqual(gathered.join(''), 'Hello beautiful world');
  });

  // =========================================================================
  // 3. Chunk split in the middle of a JSON message
  // =========================================================================
  test('3. correctly buffers and resolves chunk split in the middle of a JSON message', async () => {
    // Exactly from requirements:
    // chunk 1: data: {"choices":[{"delta":{"content":"Hel
    // chunk 2: lo"}}]}
    const response = createMockResponse([
      'data: {"choices":[{"delta":{"content":"Hel',
      'lo"}}]}\n\n',
    ]);
    const gathered: string[] = [];

    for await (const chunk of streamProviderChunks('openai', response)) {
      gathered.push(chunk);
    }

    assert.deepStrictEqual(gathered, ['Hello']);
  });

  // =========================================================================
  // 4. [DONE] signal
  // =========================================================================
  test('4. terminates stream normally upon encountering [DONE]', async () => {
    const response = createMockResponse([
      'data: {"choices":[{"delta":{"content":"First chunk"}}]}\n\n',
      'data: [DONE]\n\n',
      'data: {"choices":[{"delta":{"content":"Should never be reached"}}]}\n\n',
    ]);
    const gathered: string[] = [];

    for await (const chunk of streamProviderChunks('openai', response)) {
      gathered.push(chunk);
    }

    assert.deepStrictEqual(gathered, ['First chunk']);
  });

  // =========================================================================
  // 5. Provider error event
  // =========================================================================
  test('5a. throws normalized ProviderStreamError on OpenAI error event payload', async () => {
    const response = createMockResponse([
      'data: {"error":{"message":"Rate limit exceeded","type":"rate_limit_error","code":429}}\n\n',
    ]);

    let caughtError: any = null;
    try {
      for await (const _ of streamProviderChunks('openai', response)) {
        // should throw
      }
    } catch (err: any) {
      caughtError = err;
    }

    assert.ok(caughtError, 'Expected an error to be thrown');
    assert.ok(isProviderStreamError(caughtError), 'Must be ProviderStreamError');
    assert.strictEqual(caughtError.provider, 'openai');
    assert.strictEqual(caughtError.stage, 'stream');
    assert.ok(
      caughtError.reason.includes('OpenAI provider returned an error'),
      `Reason should mention provider error: ${caughtError.reason}`
    );
    assert.strictEqual(caughtError.details, 'Rate limit exceeded');
  });

  test('5b. throws normalized ProviderStreamError on Anthropic error event payload', async () => {
    const response = createMockResponse([
      'data: {"type":"error","error":{"type":"overloaded_error","message":"Anthropic API overloaded"}}\n\n',
    ]);

    let caughtError: any = null;
    try {
      for await (const _ of streamProviderChunks('anthropic', response)) {
        // should throw
      }
    } catch (err: any) {
      caughtError = err;
    }

    assert.ok(caughtError, 'Expected an error to be thrown');
    assert.ok(isProviderStreamError(caughtError), 'Must be ProviderStreamError');
    assert.strictEqual(caughtError.provider, 'anthropic');
    assert.strictEqual(caughtError.stage, 'stream');
    assert.strictEqual(caughtError.details, 'Anthropic API overloaded');
  });

  test('5c. throws normalized ProviderStreamError on Gemini blocked content', async () => {
    const response = createMockResponse([
      'data: {"promptFeedback":{"blockReason":"SAFETY"}}\n\n',
    ]);

    let caughtError: any = null;
    try {
      for await (const _ of streamProviderChunks('gemini', response)) {
        // should throw
      }
    } catch (err: any) {
      caughtError = err;
    }

    assert.ok(caughtError, 'Expected an error to be thrown');
    assert.ok(isProviderStreamError(caughtError), 'Must be ProviderStreamError');
    assert.strictEqual(caughtError.provider, 'gemini');
    assert.strictEqual(caughtError.stage, 'stream');
    assert.strictEqual(caughtError.details, 'SAFETY');
  });

  // =========================================================================
  // 6. Malformed complete JSON event (Must throw)
  // =========================================================================
  test('6. throws ProviderStreamError on malformed complete JSON event (does not swallow)', async () => {
    // Complete line ending in newline, but with invalid JSON syntax
    const response = createMockResponse([
      'data: {"choices":[{"delta":{"content":"Hello" broken JSON syntax}}\n\n',
    ]);

    let caughtError: any = null;
    try {
      for await (const _ of streamProviderChunks('openai', response)) {
        // should throw
      }
    } catch (err: any) {
      caughtError = err;
    }

    assert.ok(caughtError, 'Expected an error to be thrown for malformed complete JSON');
    assert.ok(isProviderStreamError(caughtError), 'Must be ProviderStreamError');
    assert.strictEqual(caughtError.provider, 'openai');
    assert.strictEqual(caughtError.stage, 'stream');
    assert.strictEqual(caughtError.reason, 'OpenAI stream parsing failed');
    assert.ok(
      caughtError.message.includes('OpenAI stream parsing failed'),
      `Message should identify stream parsing failure: ${caughtError.message}`
    );
    assert.ok(caughtError.details, 'Should have details of the parse error');
  });

  // =========================================================================
  // 7. Empty valid event (Must not throw)
  // =========================================================================
  test('7a. ignores empty valid OpenAI event without throwing', async () => {
    const response = createMockResponse([
      'data: {"choices":[{"delta":{}}]}\n\n',
      'data: {"choices":[{"delta":{"content":"Hi"}}]}\n\n',
      'data: {"choices":[{"delta":{},"finish_reason":"stop"}]}\n\n',
    ]);
    const gathered: string[] = [];

    for await (const chunk of streamProviderChunks('openai', response)) {
      gathered.push(chunk);
    }

    assert.deepStrictEqual(gathered, ['Hi']);
  });

  test('7b. ignores valid Anthropic metadata and ping events without throwing', async () => {
    const response = createMockResponse([
      'event: message_start\n',
      'data: {"type":"message_start","message":{"id":"msg_1"}}\n\n',
      'event: content_block_start\n',
      'data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}\n\n',
      'event: ping\n',
      'data: {"type":"ping"}\n\n',
      'event: content_block_delta\n',
      'data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Working!"}}\n\n',
      'event: content_block_stop\n',
      'data: {"type":"content_block_stop","index":0}\n\n',
      'event: message_delta\n',
      'data: {"type":"message_delta","delta":{"stop_reason":"end_turn"}}\n\n',
      'event: message_stop\n',
      'data: {"type":"message_stop"}\n\n',
    ]);
    const gathered: string[] = [];

    for await (const chunk of streamProviderChunks('anthropic', response)) {
      gathered.push(chunk);
    }

    assert.deepStrictEqual(gathered, ['Working!']);
  });

  test('7c. ignores empty Gemini candidate events without throwing', async () => {
    const response = createMockResponse([
      'data: {"candidates":[{"finishReason":"STOP"}]}\n\n',
      'data: {"candidates":[{"content":{"parts":[{"text":"Gemini message"}]}}]}\n\n',
    ]);
    const gathered: string[] = [];

    for await (const chunk of streamProviderChunks('gemini', response)) {
      gathered.push(chunk);
    }

    assert.deepStrictEqual(gathered, ['Gemini message']);
  });

  // =========================================================================
  // 8. Abort during stream (Must terminate cleanly)
  // =========================================================================
  test('8a. terminates cleanly when AbortSignal is already aborted', async () => {
    const controller = new AbortController();
    controller.abort();

    const response = createMockResponse([
      'data: {"choices":[{"delta":{"content":"Chunk 1"}}]}\n\n',
    ]);

    const gathered: string[] = [];
    for await (const chunk of streamProviderChunks('openai', response, controller.signal)) {
      gathered.push(chunk);
    }

    assert.deepStrictEqual(gathered, []);
  });

  test('8b. terminates cleanly when AbortSignal is aborted mid-stream', async () => {
    const controller = new AbortController();
    const response = createMockResponse([
      'data: {"choices":[{"delta":{"content":"Chunk 1"}}]}\n\n',
      'data: {"choices":[{"delta":{"content":"Chunk 2"}}]}\n\n',
      'data: {"choices":[{"delta":{"content":"Chunk 3"}}]}\n\n',
    ]);

    const gathered: string[] = [];
    for await (const chunk of streamProviderChunks('openai', response, controller.signal)) {
      gathered.push(chunk);
      if (gathered.length === 1) {
        controller.abort();
      }
    }

    assert.deepStrictEqual(gathered, ['Chunk 1']);
  });

  // =========================================================================
  // 9. All four providers use their adapters correctly
  // =========================================================================
  describe('9. All four providers use their adapters correctly', () => {
    test('OpenAI extracts delta correctly', async () => {
      const response = createMockResponse([
        'data: {"choices":[{"delta":{"content":"OpenAI chunk 1"}}]}\n\n',
        'data: {"choices":[{"delta":{"content":"OpenAI chunk 2"}}]}\n\n',
      ]);
      const gathered: string[] = [];
      for await (const chunk of streamProviderChunks('openai', response)) {
        gathered.push(chunk);
      }
      assert.deepStrictEqual(gathered, ['OpenAI chunk 1', 'OpenAI chunk 2']);
    });

    test('Grok extracts delta correctly', async () => {
      const response = createMockResponse([
        'data: {"choices":[{"delta":{"content":"Grok chunk 1"}}]}\n\n',
        'data: {"choices":[{"delta":{"content":"Grok chunk 2"}}]}\n\n',
      ]);
      const gathered: string[] = [];
      for await (const chunk of streamProviderChunks('grok', response)) {
        gathered.push(chunk);
      }
      assert.deepStrictEqual(gathered, ['Grok chunk 1', 'Grok chunk 2']);
    });

    test('Anthropic extracts delta correctly', async () => {
      const response = createMockResponse([
        'data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Claude chunk 1"}}\n\n',
        'data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Claude chunk 2"}}\n\n',
      ]);
      const gathered: string[] = [];
      for await (const chunk of streamProviderChunks('anthropic', response)) {
        gathered.push(chunk);
      }
      assert.deepStrictEqual(gathered, ['Claude chunk 1', 'Claude chunk 2']);
    });

    test('Gemini extracts delta correctly', async () => {
      const response = createMockResponse([
        'data: {"candidates":[{"content":{"parts":[{"text":"Gemini chunk 1"}]}}]}\n\n',
        'data: {"candidates":[{"content":{"parts":[{"text":"Gemini chunk 2"}]}}]}\n\n',
      ]);
      const gathered: string[] = [];
      for await (const chunk of streamProviderChunks('gemini', response)) {
        gathered.push(chunk);
      }
      assert.deepStrictEqual(gathered, ['Gemini chunk 1', 'Gemini chunk 2']);
    });
  });

  // =========================================================================
  // Additional edge-case & Error shape validation
  // =========================================================================
  describe('ProviderStreamError and validation edge cases', () => {
    test('rejects non-object parsed JSON payload (e.g. primitives)', () => {
      assert.throws(
        () => parseAndValidateProviderEvent('openai', OpenAIAdapter, '12345'),
        (err: any) => {
          return (
            err instanceof ProviderStreamError &&
            err.provider === 'openai' &&
            err.stage === 'stream' &&
            err.reason === 'OpenAI provider returned an invalid streaming event'
          );
        }
      );

      assert.throws(
        () => parseAndValidateProviderEvent('gemini', GeminiAdapter, '"plain text"'),
        (err: any) => {
          return (
            err instanceof ProviderStreamError &&
            err.provider === 'gemini' &&
            err.stage === 'stream' &&
            err.reason === 'Gemini provider returned an invalid streaming event'
          );
        }
      );
    });

    test('ProviderStreamError serializes cleanly with toJSON()', () => {
      const err = new ProviderStreamError('gemini', 'Gemini stream parsing failed', 'SyntaxError');
      const json = err.toJSON();
      assert.strictEqual(json.provider, 'gemini');
      assert.strictEqual(json.stage, 'stream');
      assert.strictEqual(json.reason, 'Gemini stream parsing failed');
      assert.strictEqual(json.details, 'SyntaxError');
    });

    test('throws on missing response body', async () => {
      const emptyResponse = new Response(null);
      await assert.rejects(
        async () => {
          for await (const _ of streamProviderChunks('openai', emptyResponse)) {
            // should not reach
          }
        },
        (err: any) => {
          return (
            err instanceof ProviderStreamError &&
            err.provider === 'openai' &&
            err.stage === 'stream'
          );
        }
      );
    });
  });
});
