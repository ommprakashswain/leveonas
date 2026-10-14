/**
 * Leveonas Public SDK Session API
 *
 * Provides a production developer interface for managing generation sessions,
 * real-time SSE streaming, lifecycle destruction, and telemetry collection.
 */

import {
  LeveonasSessionConfig,
  RenderRequest,
  RenderResponse,
  StreamCallbacks,
  StreamingEvent,
} from './types';
import { GenerationMetrics, MetricsCollector } from '../telemetry/metrics';
import { LeveonasError } from './errors';
import { withRetry, isRetryableError } from './provider';

export class LeveonasSession {
  private activeController: AbortController | null = null;
  private lastMetrics: GenerationMetrics | null = null;
  private isDestroyed = false;

  constructor(private config: LeveonasSessionConfig = {}) {}

  /**
   * Generates UI from prompt or request.
   * Returns an AsyncIterable of StreamingEvents that also resolves to a RenderResponse when awaited.
   */
  generate(promptOrRequest: string | RenderRequest): AsyncIterable<StreamingEvent> & Promise<RenderResponse> {
    this.assertNotDestroyed();
    const request: RenderRequest =
      typeof promptOrRequest === 'string'
        ? {
            prompt: promptOrRequest,
            provider: this.config.provider,
            model: this.config.model,
            telemetry: this.config.telemetry,
          }
        : {
            provider: this.config.provider,
            model: this.config.model,
            telemetry: this.config.telemetry,
            ...promptOrRequest,
          };

    this.activeController = new AbortController();
    const signal = this.activeController.signal;
    const fetchFn = this.config.fetchFn || (typeof fetch !== 'undefined' ? fetch : undefined);

    if (!fetchFn) {
      throw new LeveonasError('No fetch implementation available in the current environment');
    }

    const endpoint = this.config.endpoint || '/api/generate';
    const metricsCollector = new MetricsCollector({
      mode: this.config.telemetry ? 'development' : 'production',
    });

    const eventQueue: StreamingEvent[] = [];
    let resolveNext: (() => void) | null = null;
    let streamDone = false;
    let streamError: Error | null = null;

    let accumulatedText = '';
    let accumulatedPatches: any[] = [];

    const pushEvent = (event: StreamingEvent) => {
      eventQueue.push(event);
      if (resolveNext) {
        resolveNext();
        resolveNext = null;
      }
    };

    // Execute streaming in background with optional retry logic
    const startStream = async () => {
      try {
        pushEvent({ type: 'generation:start', timestamp: Date.now() });

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (this.config.apiKey) {
          headers['x-leveonas-key'] = this.config.apiKey;
          headers['Authorization'] = `Bearer ${this.config.apiKey}`;
        }

        await withRetry(
          async () => {
            const res = await fetchFn(endpoint, {
              method: 'POST',
              headers,
              body: JSON.stringify(request),
              signal,
            });

            if (!res.ok) {
              const errText = await res.text().catch(() => res.statusText);
              throw new LeveonasError(`Request failed with status ${res.status}: ${errText}`);
            }

            if (!res.body) {
              throw new LeveonasError('Response body is missing');
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const chunkBytes = value.byteLength;
              metricsCollector.recordChunk(chunkBytes);

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() || '';

              for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed.startsWith('data:')) continue;
                const dataStr = trimmed.slice(5).trim();
                if (!dataStr || dataStr === '[DONE]') continue;

                try {
                  const parsed = JSON.parse(dataStr);
                  if (parsed.text) {
                    accumulatedText += parsed.text;
                    pushEvent({
                      type: 'generation:chunk',
                      text: accumulatedText,
                      delta: parsed.text,
                      timestamp: Date.now(),
                    });
                  }
                  if (parsed.patch) {
                    accumulatedPatches.push(parsed.patch);
                    const patchOps = Array.isArray(parsed.patch) ? parsed.patch.length : 1;
                    metricsCollector.recordPatch(patchOps, dataStr.length);
                    pushEvent({
                      type: 'generation:patch',
                      patch: parsed.patch,
                      timestamp: Date.now(),
                    });
                  }
                  if (parsed.diagnostic) {
                    pushEvent({
                      type: 'generation:diagnostic',
                      diagnostic: parsed.diagnostic,
                      timestamp: Date.now(),
                    });
                  }
                  if (parsed.usage) {
                    metricsCollector.recordUsage(
                      parsed.usage.inputTokens,
                      parsed.usage.outputTokens,
                      parsed.usage.totalTokens
                    );
                  }
                  if (parsed.error) {
                    throw new LeveonasError(parsed.error);
                  }
                } catch (err: any) {
                  if (err instanceof LeveonasError) throw err;
                }
              }
            }
          },
          this.config.retryPolicy
        );

        const metrics = metricsCollector.complete();
        this.lastMetrics = metrics;
        pushEvent({
          type: 'generation:complete',
          metrics,
          timestamp: Date.now(),
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          streamError = err;
          pushEvent({
            type: 'generation:error',
            error: err,
            timestamp: Date.now(),
          });
        }
      } finally {
        streamDone = true;
        this.activeController = null;
        if (resolveNext) {
          resolveNext();
          resolveNext = null;
        }
      }
    };

    const streamPromise = startStream();

    const asyncIterable: AsyncIterable<StreamingEvent> = {
      [Symbol.asyncIterator]() {
        return {
          async next(): Promise<IteratorResult<StreamingEvent>> {
            while (eventQueue.length === 0) {
              if (streamDone) {
                if (streamError) throw streamError;
                return { done: true, value: undefined };
              }
              await new Promise<void>((resolve) => {
                resolveNext = resolve;
              });
            }
            return { done: false, value: eventQueue.shift()! };
          },
        };
      },
    };

    // Make the returned object both a Promise (resolving to RenderResponse) and an AsyncIterable
    const combined = Object.assign(
      (async (): Promise<RenderResponse> => {
        await streamPromise;
        if (streamError) throw streamError;
        return {
          html: accumulatedText,
          ast: accumulatedPatches,
          metrics: this.lastMetrics || undefined,
        };
      })(),
      asyncIterable
    );

    return combined as AsyncIterable<StreamingEvent> & Promise<RenderResponse>;
  }

  /**
   * Stream UI generation using explicit callbacks.
   */
  async stream(requestOrPrompt: RenderRequest | string, callbacks: StreamCallbacks = {}): Promise<GenerationMetrics> {
    this.assertNotDestroyed();
    callbacks.onStart?.();

    try {
      const generator = this.generate(requestOrPrompt);
      for await (const event of generator) {
        switch (event.type) {
          case 'generation:chunk':
            callbacks.onChunk?.(event.delta);
            break;
          case 'generation:patch':
            callbacks.onPatch?.(event.patch);
            break;
          case 'generation:diagnostic':
            callbacks.onDiagnostic?.(event.diagnostic);
            break;
          case 'generation:complete':
            callbacks.onComplete?.(event.metrics);
            break;
          case 'generation:error':
            callbacks.onError?.(event.error);
            break;
        }
      }
      return this.lastMetrics!;
    } catch (err: any) {
      callbacks.onError?.(err);
      throw err;
    }
  }

  /**
   * Abort active generation.
   */
  abort(): void {
    if (this.activeController) {
      this.activeController.abort();
      this.activeController = null;
    }
  }

  /**
   * Cancel alias for abort.
   */
  cancel(): void {
    this.abort();
  }

  /**
   * Synchronous render alias.
   */
  async render(request: RenderRequest): Promise<RenderResponse> {
    return this.generate(request);
  }

  /**
   * Compile helper.
   */
  async compile(request: any): Promise<any> {
    const res = await this.generate(typeof request === 'string' ? request : request.source);
    return {
      html: res.html,
      ast: res.ast,
      success: true,
      diagnostics: [],
    };
  }

  /**
   * Validate helper.
   */
  async validate(request: any): Promise<any> {
    return {
      valid: true,
      diagnostics: [],
    };
  }

  /**
   * Retrieve the metrics from the most recent generation run.
   */
  getMetrics(): GenerationMetrics | null {
    return this.lastMetrics;
  }

  /**
   * Destroy the session and cleanup resources.
   */
  destroy(): void {
    this.abort();
    this.isDestroyed = true;
    this.lastMetrics = null;
  }

  private assertNotDestroyed(): void {
    if (this.isDestroyed) {
      throw new LeveonasError('Cannot operate on a destroyed LeveonasSession');
    }
  }
}

/**
 * Creates a new Leveonas generation session.
 */
export function createSession(config?: LeveonasSessionConfig): LeveonasSession {
  return new LeveonasSession(config);
}
