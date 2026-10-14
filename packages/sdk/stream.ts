import { StreamCallbacks } from './types';
import { LeveonasError } from './errors';

export class StreamProcessor {
  private activeRequest: AbortController | null = null;

  async process(response: Response, callbacks: StreamCallbacks) {
    if (!response.body) {
      callbacks.onError?.(new LeveonasError('No response body from stream'));
      return;
    }

    callbacks.onStart?.();

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine.startsWith('data:')) continue;
          
          const dataStr = trimmedLine.slice(5).trim();
          if (dataStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.text) {
              callbacks.onChunk?.(parsed.text);
            }
            if (parsed.patch) {
              callbacks.onPatch?.(parsed.patch);
            }
            if (parsed.error) {
              callbacks.onError?.(new LeveonasError(parsed.error));
            }
          } catch (e) {
            // Ignore partial lines or parse errors
          }
        }
      }
      callbacks.onComplete?.();
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        callbacks.onError?.(err);
      }
    } finally {
      reader.releaseLock();
    }
  }

  cancel() {
    if (this.activeRequest) {
      this.activeRequest.abort();
      this.activeRequest = null;
    }
  }
}
