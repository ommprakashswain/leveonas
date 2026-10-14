import { DOMPatchApplier } from '../runtime/incremental/patch-executor/dom-applier';
import { PatchSerializer } from '../runtime/incremental/patch-generator/serializer';
import { PatchOperation } from '../runtime/incremental/patch-generator/types';
import { validatePatches, isPatchBatchValid, PatchValidationError } from '../runtime/incremental/patch-generator/validator';
import { getLeveonasApiUrl, getLeveonasRuntimeScriptUrl, getLeveonasOrigin } from '../common/origin';
import { ClientTelemetryTracker, getUtf8ByteLength } from '../telemetry/client-tracker';
import { ClientTelemetry, ServerTelemetrySummary } from '../telemetry/types';

export interface EngineConfig {
  apiKey?: string;
  userLlmKey?: string;
  apiUrl?: string;
  baseUrl?: string;
  origin?: string;
}

export interface GenerateOptions {
  container: string | HTMLElement;
  prompt: string;
  provider: string;
  model: string;
  maxTokens?: number;
  emitDebugText?: boolean;
  telemetry?: boolean;
  onTelemetry?: (telemetry: ClientTelemetry) => void;
  onServerTelemetry?: (telemetry: ServerTelemetrySummary) => void;
  onChunk?: (chunk: string) => void;
  onPatch?: (patches: PatchOperation[]) => void;
  onComplete?: () => void;
  onError?: (error: string) => void;
  onQuotaExceeded?: () => void;
  fallbackMode?: boolean;
}

export class Engine {
  public static readonly DEFAULT_SANDBOX = 'allow-scripts';
  public apiKey: string;
  public userLlmKey: string;
  public apiUrl: string;
  public runtimeScriptUrl: string;
  public expectedOrigin: string;
  private controller: AbortController | null = null;
  private activeMessageListener: ((event: MessageEvent) => void) | null = null;

  constructor(config: EngineConfig = {}) {
    this.apiKey = config.apiKey || '';
    this.userLlmKey = config.userLlmKey || '';
    const customOrigin = config.baseUrl || config.origin;
    this.apiUrl = config.apiUrl
      ? getLeveonasApiUrl(config.apiUrl, customOrigin)
      : getLeveonasApiUrl('/api/generate', customOrigin);
    this.runtimeScriptUrl = getLeveonasRuntimeScriptUrl(customOrigin);
    this.expectedOrigin = getLeveonasOrigin(customOrigin);
  }

  public generate(options: GenerateOptions): void {
    const {
      container,
      prompt,
      provider,
      model,
      maxTokens,
      emitDebugText,
      onChunk,
      onPatch,
      onComplete,
      onError,
      onQuotaExceeded,
      fallbackMode,
    } = options;

    const containerEl =
      typeof container === 'string'
        ? document.getElementById(container) || document.querySelector(container)
        : container;

    if (!containerEl) {
      const msg = `Leveonas: Container ${container} not found.`;
      console.error(msg);
      onError?.(msg);
      return;
    }

    // Clean up previous active listener if any
    this.cleanupListener();

    const clientTracker = (options.telemetry || options.onTelemetry)
      ? new ClientTelemetryTracker()
      : null;

    containerEl.innerHTML = '';
    (containerEl as HTMLElement).style.position = 'relative';

    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.display = 'block';
    iframe.style.minHeight = '400px';

    // Keep minimal required sandbox: allow-scripts for execution without allow-same-origin.
    // The iframe uses sandbox="allow-scripts" without allow-same-origin, therefore its document has an opaque origin.
    // Security validation therefore relies primarily on:
    // event.source === window.parent
    // rather than assuming event.origin equals the host page origin.
    // Do not treat "*" as trusted by itself.
    iframe.sandbox = Engine.DEFAULT_SANDBOX;

    // Derive targetOrigin for iframe-to-parent postMessage
    let parentOrigin = '*';
    try {
      if (typeof window !== 'undefined' && window.location && window.location.origin && window.location.origin !== 'null') {
        parentOrigin = window.location.origin;
      }
    } catch {
      parentOrigin = '*';
    }

    // Explicitly resolve runtime URL to canonical origin
    const runtimeUrl = this.runtimeScriptUrl;
    const iframeScript = Engine.buildIframeSrcdoc(runtimeUrl, parentOrigin);

    iframe.srcdoc = iframeScript;
    containerEl.appendChild(iframe);

    const handleMessage = (event: MessageEvent) => {
      // Validate event source is the created iframe
      if (event.source !== iframe.contentWindow) return;
      if (!event.data || typeof event.data !== 'object') return;

      if (event.data.type === 'leveonas:resize') {
        if (typeof event.data.height === 'number' && Number.isFinite(event.data.height)) {
          iframe.style.height = event.data.height + 'px';
        }
        if (typeof event.data.applyDuration === 'number') {
          clientTracker?.recordPatchApplied(event.data.applyDuration);
        }
      } else if (event.data.type === 'leveonas:error') {
        onError?.(typeof event.data.error === 'string' ? event.data.error : 'Iframe patch error');
      }
    };

    this.activeMessageListener = handleMessage;
    window.addEventListener('message', handleMessage);

    this._stream(
      iframe,
      prompt,
      provider,
      model,
      maxTokens,
      emitDebugText,
      options.telemetry,
      clientTracker,
      onChunk,
      onPatch,
      options.onServerTelemetry,
      () => {
        if (clientTracker && options.onTelemetry) {
          options.onTelemetry(clientTracker.getTelemetry());
        }
        onComplete?.();
      },
      onError,
      onQuotaExceeded,
      fallbackMode
    );
  }

  public static buildIframeSrcdoc(runtimeUrl: string, parentOrigin: string): string {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="${runtimeUrl}"></script>
  <style id="leveonas-css"></style>
  <style>
    html, body { margin: 0; padding: 0; width: 100%; height: 100%; }
    #leveonas-root { width: 100%; min-height: 100%; }
  </style>
</head>
<body>
  <div id="leveonas-root" data-ast-id="leveonas-root"></div>
  <script>
    (function() {
      var applier = null;
      var rootEl = document.getElementById('leveonas-root');
      var parentOrigin = ${JSON.stringify(parentOrigin)};

      function getRuntime() {
        return window.LeveonasRuntime || null;
      }

      function initApplier() {
        if (!applier) {
          var runtime = getRuntime();
          if (runtime && runtime.DOMPatchApplier) {
            applier = new runtime.DOMPatchApplier(rootEl, document);
            applier.registerNode('leveonas-root', rootEl);
          }
        }
        return applier;
      }

      function postToParent(msg) {
        try {
          window.parent.postMessage(msg, parentOrigin);
        } catch (e) {
          window.parent.postMessage(msg, '*');
        }
      }

      window.addEventListener('message', function(event) {
        // The iframe uses sandbox="allow-scripts" without allow-same-origin, therefore its document has an opaque origin.
        // Security validation therefore relies primarily on:
        // event.source === window.parent
        // rather than assuming event.origin equals the host page origin.
        // Do not treat "*" as trusted by itself.
        if (event.source !== window.parent) return;
        if (!event.data || typeof event.data !== 'object') return;

        var type = event.data.type;
        // Only accept recognized Leveonas message types
        if (type !== 'leveonas:patch' && type !== 'leveonas:update' && type !== 'leveonas:reset') {
          return;
        }

        if (type === 'leveonas:reset') {
          try {
            var app = initApplier();
            if (app && app.cleanupJS) {
              app.cleanupJS();
            }
          } catch (e) {
            // ignore
          }
          return;
        }

        if (type === 'leveonas:patch') {
          try {
            var runtimeApplier = initApplier();
            if (!runtimeApplier) {
              throw new Error('DOMPatchApplier runtime is not initialized in iframe');
            }

            var patches = event.data.patches;
            var runtime = getRuntime();
            if (typeof patches === 'string' && runtime && runtime.PatchSerializer) {
              patches = runtime.PatchSerializer.fromJSON(patches);
            }

            // Validate patch structure before applying
            if (runtime && runtime.validatePatches) {
              patches = runtime.validatePatches(patches);
            } else if (!Array.isArray(patches)) {
              throw new Error('Invalid patch payload: expected an array');
            }

            var tStart = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
            runtimeApplier.apply(patches);
            var applyDuration = ((typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now()) - tStart;

            var h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, 400);
            postToParent({ type: 'leveonas:resize', height: h, applyDuration: applyDuration });
          } catch (err) {
            postToParent({
              type: 'leveonas:error',
              error: err.message || String(err)
            });
          }
        } else if (type === 'leveonas:update' && event.data.mode === 'fallback') {
          try {
            document.body.innerHTML = event.data.html;
            var h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, 400);
            postToParent({ type: 'leveonas:resize', height: h });
          } catch (err) {
            postToParent({
              type: 'leveonas:error',
              error: err.message || String(err)
            });
          }
        }
      });
    })();
  </script>
</body>
</html>`;
  }

  public abort(): void {
    if (this.controller) {
      this.controller.abort();
      this.controller = null;
    }
    this.cleanupListener();
  }

  private cleanupListener(): void {
    if (this.activeMessageListener) {
      window.removeEventListener('message', this.activeMessageListener);
      this.activeMessageListener = null;
    }
  }

  private async _stream(
    iframe: HTMLIFrameElement,
    prompt: string,
    provider: string,
    model: string,
    maxTokens?: number,
    emitDebugText?: boolean,
    telemetry?: boolean,
    clientTracker?: ClientTelemetryTracker | null,
    onChunk?: (chunk: string) => void,
    onPatch?: (patches: PatchOperation[]) => void,
    onServerTelemetry?: (telemetry: ServerTelemetrySummary) => void,
    onComplete?: () => void,
    onError?: (error: string) => void,
    onQuotaExceeded?: () => void,
    fallbackMode?: boolean
  ): Promise<void> {
    this.controller = new AbortController();
    const signal = this.controller.signal;
    clientTracker?.recordFetchStart();

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-leveonas-key': this.apiKey,
          'x-user-llm-key': this.userLlmKey,
        },
        body: JSON.stringify({
          prompt,
          provider,
          model,
          maxTokens,
          emitDebugText,
          telemetry,
        }),
        signal,
      });

      // Section 17: Quota Fallback System
      if (response.status === 402) {
        const errData = await response.json().catch(() => ({}));
        if (errData.error === 'QUOTA_EXCEEDED' && onQuotaExceeded) {
          onQuotaExceeded();
          return;
        }
      }

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        throw new Error(`API Error: ${response.status} ${errText}`);
      }

      if (!response.body) {
        throw new Error('No response body received from generation endpoint');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let lineBuffer = '';

      while (true) {
        if (signal.aborted) {
          await reader.cancel().catch(() => {});
          break;
        }

        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        lineBuffer += chunk;
        const lines = lineBuffer.split('\n');
        lineBuffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const dataStr = trimmed.slice(5).trim();
          if (dataStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(dataStr);

            // Primary streaming path: SSE patch events (Section 6 & 10)
            if (parsed.patch) {
              let patches: PatchOperation[] = parsed.patch;
              if (typeof patches === 'string') {
                patches = PatchSerializer.fromJSON(patches);
              }

              // Validate patches before passing to consumer or iframe
              try {
                patches = validatePatches(patches);
              } catch (valErr: any) {
                console.warn('Malformed patch received:', valErr.message);
                onError?.(`Malformed patch rejected: ${valErr.message}`);
                continue;
              }

              const payloadByteLength = getUtf8ByteLength(dataStr);
              clientTracker?.recordPatchBatch(patches, payloadByteLength);
              onPatch?.(patches);
              if (iframe.contentWindow) {
                iframe.contentWindow.postMessage({ type: 'leveonas:patch', patches }, '*');
              }
            }

            // Server telemetry stream (dev only)
            if (parsed.telemetry) {
              if (clientTracker) {
                if (parsed.telemetry.runId) {
                  clientTracker.setRunId(parsed.telemetry.runId);
                }
                if (typeof parsed.telemetry.serverRequestStartTimestamp === 'number') {
                  clientTracker.setServerTiming(
                    parsed.telemetry.serverRequestStartTimestamp,
                    parsed.telemetry.serverTimeToFirstPatchMs ?? parsed.telemetry.timeToFirstPatchMs ?? null
                  );
                }
              }
              onServerTelemetry?.(parsed.telemetry);
            }

            // Raw LM debugging stream (dev only, Section 19)
            if (parsed.text) {
              onChunk?.(parsed.text);
              if (fallbackMode && iframe.contentWindow) {
                iframe.contentWindow.postMessage(
                  { type: 'leveonas:update', html: parsed.text, mode: 'fallback' },
                  '*'
                );
              }
            }

            if (parsed.error) {
              onError?.(parsed.error);
            }
          } catch (e) {
            // Partial JSON parse error, ignore
          }
        }
      }

      if (!signal.aborted) {
        onComplete?.();
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        // Normal user cancellation (Section 15)
      } else {
        onError?.(error.message || String(error));
      }
    } finally {
      this.controller = null;
    }
  }
}

// Attach to window for public CDN usage
if (typeof window !== 'undefined') {
  (window as any).Leveonas = (window as any).Leveonas || {};
  (window as any).Leveonas.Engine = Engine;
  (window as any).LeveonasRuntime = {
    DOMPatchApplier,
    PatchSerializer,
    validatePatches,
    isPatchBatchValid,
    PatchValidationError,
  };
}
