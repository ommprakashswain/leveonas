import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { StreamProcessor } from '../stream';

describe('StreamProcessor', () => {
  it('should process chunks', async () => {
    const processor = new StreamProcessor();
    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode('data: {"text": "Hello"}\n\n'));
        controller.enqueue(encoder.encode('data: {"text": " World"}\n\n'));
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      }
    });

    const response = new Response(stream) as any;
    
    let text = '';
    await processor.process(response, {
      onChunk: (chunk) => { text += chunk; }
    });

    assert.strictEqual(text, 'Hello World');
  });
});
