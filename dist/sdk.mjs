// packages/telemetry/metrics.ts
var MetricsCollector = class {
  constructor(config = { mode: "production" }) {
    this.config = config;
    this.startTime = 0;
    this.firstChunkTime = 0;
    this.firstPatchTime = 0;
    this.endTime = 0;
    this.streamByteCount = 0;
    this.patchByteCount = 0;
    this.patchOperationCount = 0;
    this.inTokens = null;
    this.outTokens = null;
    this.totTokens = null;
    this.isCompleted = false;
    this.start();
  }
  start() {
    this.startTime = Date.now();
  }
  recordChunk(byteLength) {
    if (!this.firstChunkTime) {
      this.firstChunkTime = Date.now();
    }
    this.streamByteCount += byteLength;
  }
  recordPatch(operationCount, byteLength) {
    if (!this.firstPatchTime) {
      this.firstPatchTime = Date.now();
    }
    this.patchOperationCount += operationCount;
    this.patchByteCount += byteLength;
  }
  recordUsage(inputTokens, outputTokens, totalTokens) {
    if (typeof inputTokens === "number") this.inTokens = inputTokens;
    if (typeof outputTokens === "number") this.outTokens = outputTokens;
    if (typeof totalTokens === "number") this.totTokens = totalTokens;
  }
  complete() {
    if (!this.isCompleted) {
      this.endTime = Date.now();
      this.isCompleted = true;
    }
    const duration = Math.max(0, this.endTime - this.startTime);
    const ttfc = this.firstChunkTime ? Math.max(0, this.firstChunkTime - this.startTime) : duration;
    const ttfp = this.firstPatchTime ? Math.max(0, this.firstPatchTime - this.startTime) : duration;
    const metrics = {
      durationMs: duration,
      timeToFirstChunkMs: ttfc,
      timeToFirstPatchMs: ttfp,
      completionTimeMs: duration,
      patchCount: this.patchOperationCount,
      patchBytes: this.patchByteCount,
      streamBytes: this.streamByteCount,
      inputTokens: this.inTokens,
      outputTokens: this.outTokens,
      totalTokens: this.totTokens
    };
    if (this.config.mode === "development") {
      console.log("[Leveonas Metrics]", {
        durationMs: metrics.durationMs,
        ttfc: metrics.timeToFirstChunkMs,
        ttfp: metrics.timeToFirstPatchMs,
        patches: metrics.patchCount,
        patchBytes: metrics.patchBytes,
        streamBytes: metrics.streamBytes,
        tokens: metrics.totalTokens
      });
    }
    this.config.onMetrics?.(metrics);
    return metrics;
  }
};

// packages/sdk/errors.ts
var LeveonasError = class extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = "LeveonasError";
  }
};
var AuthenticationError = class extends LeveonasError {
  constructor(message = "Authentication failed") {
    super(message, 401, "unauthorized");
    this.name = "AuthenticationError";
  }
};
var ValidationError = class extends LeveonasError {
  constructor(message) {
    super(message, 400, "validation_failed");
    this.name = "ValidationError";
  }
};
var TimeoutError = class extends LeveonasError {
  constructor(message = "Request timed out") {
    super(message, 408, "timeout");
    this.name = "TimeoutError";
  }
};

// packages/sdk/provider.ts
var LeveonasProviderError = class _LeveonasProviderError extends Error {
  constructor(message, provider, isRetryable = false, statusCode) {
    super(message);
    this.name = "LeveonasProviderError";
    this.provider = provider;
    this.isRetryable = isRetryable;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, _LeveonasProviderError.prototype);
  }
};
var LeveonasAuthError = class _LeveonasAuthError extends LeveonasProviderError {
  constructor(message, provider, statusCode = 401) {
    super(message, provider, false, statusCode);
    this.name = "LeveonasAuthError";
    Object.setPrototypeOf(this, _LeveonasAuthError.prototype);
  }
};
var LeveonasInvalidRequestError = class _LeveonasInvalidRequestError extends LeveonasProviderError {
  constructor(message, provider, statusCode = 400) {
    super(message, provider, false, statusCode);
    this.name = "LeveonasInvalidRequestError";
    Object.setPrototypeOf(this, _LeveonasInvalidRequestError.prototype);
  }
};
var LeveonasRateLimitError = class _LeveonasRateLimitError extends LeveonasProviderError {
  constructor(message, provider, statusCode = 429) {
    super(message, provider, true, statusCode);
    this.name = "LeveonasRateLimitError";
    Object.setPrototypeOf(this, _LeveonasRateLimitError.prototype);
  }
};
var LeveonasTimeoutError = class _LeveonasTimeoutError extends LeveonasProviderError {
  constructor(message, provider) {
    super(message, provider, true, 408);
    this.name = "LeveonasTimeoutError";
    Object.setPrototypeOf(this, _LeveonasTimeoutError.prototype);
  }
};
var LeveonasUnavailableError = class _LeveonasUnavailableError extends LeveonasProviderError {
  constructor(message, provider, statusCode = 503) {
    super(message, provider, true, statusCode);
    this.name = "LeveonasUnavailableError";
    Object.setPrototypeOf(this, _LeveonasUnavailableError.prototype);
  }
};
var LeveonasSecurityError = class _LeveonasSecurityError extends LeveonasProviderError {
  constructor(message, provider) {
    super(message, provider, false, 403);
    this.name = "LeveonasSecurityError";
    Object.setPrototypeOf(this, _LeveonasSecurityError.prototype);
  }
};
var LeveonasResourceLimitError = class _LeveonasResourceLimitError extends LeveonasProviderError {
  constructor(message, provider) {
    super(message, provider, false, 413);
    this.name = "LeveonasResourceLimitError";
    Object.setPrototypeOf(this, _LeveonasResourceLimitError.prototype);
  }
};
var LeveonasAbortError = class _LeveonasAbortError extends LeveonasProviderError {
  constructor(provider) {
    super("Operation aborted by user or timeout", provider, false, 499);
    this.name = "LeveonasAbortError";
    Object.setPrototypeOf(this, _LeveonasAbortError.prototype);
  }
};
function isRetryableError(error) {
  if (error instanceof LeveonasProviderError) {
    return error.isRetryable;
  }
  if (error instanceof Error && error.name === "AbortError") {
    return false;
  }
  return false;
}
var DEFAULT_RETRY_POLICY = {
  maxRetries: 3,
  initialDelayMs: 500,
  maxDelayMs: 4e3,
  backoffFactor: 2,
  jitter: true
};
async function withRetry(fn, policy = {}) {
  const merged = { ...DEFAULT_RETRY_POLICY, ...policy };
  let attempt = 0;
  let delay = merged.initialDelayMs;
  while (true) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (attempt > merged.maxRetries || !isRetryableError(error)) {
        throw error;
      }
      const jitterFactor = merged.jitter ? 0.75 + Math.random() * 0.5 : 1;
      const calculatedDelay = Math.min(delay * jitterFactor, merged.maxDelayMs);
      await new Promise((resolve) => setTimeout(resolve, calculatedDelay));
      delay = Math.min(delay * merged.backoffFactor, merged.maxDelayMs);
    }
  }
}
var GeminiProvider = class {
  constructor(defaultApiKey) {
    this.defaultApiKey = defaultApiKey;
    this.id = "gemini";
    this.name = "Google Gemini";
  }
  async *generate(request) {
    const key = request.apiKey || this.defaultApiKey;
    if (!key && typeof process !== "undefined" && !process.env.GEMINI_API_KEY) {
      throw new LeveonasAuthError("Missing Gemini API key", this.id);
    }
    const model = request.model || "gemini-2.5-flash";
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${key || process.env.GEMINI_API_KEY}`;
    const body = {
      contents: [{ role: "user", parts: [{ text: request.prompt }] }],
      systemInstruction: request.systemInstruction ? { parts: [{ text: request.systemInstruction }] } : void 0,
      generationConfig: {
        maxOutputTokens: request.maxTokens,
        temperature: request.temperature
      }
    };
    let response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: request.signal
      });
    } catch (err) {
      if (err.name === "AbortError") throw new LeveonasAbortError(this.id);
      throw new LeveonasUnavailableError(`Network connection failed: ${err.message}`, this.id);
    }
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new LeveonasAuthError(`Gemini authentication error (HTTP ${response.status})`, this.id, response.status);
      }
      if (response.status === 429) {
        throw new LeveonasRateLimitError("Gemini rate limit exceeded", this.id);
      }
      if (response.status >= 500) {
        throw new LeveonasUnavailableError(`Gemini service error (HTTP ${response.status})`, this.id, response.status);
      }
      throw new LeveonasInvalidRequestError(`Gemini request failed (HTTP ${response.status})`, this.id, response.status);
    }
    if (!response.body) {
      throw new LeveonasUnavailableError("Gemini returned an empty response body", this.id);
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const jsonStr = trimmed.slice(5).trim();
          if (!jsonStr || jsonStr === "[DONE]") continue;
          try {
            const data = JSON.parse(jsonStr);
            const candidate = data.candidates?.[0];
            const text = candidate?.content?.parts?.[0]?.text || "";
            const usage = data.usageMetadata;
            yield {
              text,
              inputTokens: usage?.promptTokenCount ?? null,
              outputTokens: usage?.candidatesTokenCount ?? null,
              totalTokens: usage?.totalTokenCount ?? null,
              finishReason: candidate?.finishReason ?? null,
              raw: data
            };
          } catch {
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
};
var OpenAIProvider = class {
  constructor(defaultApiKey) {
    this.defaultApiKey = defaultApiKey;
    this.id = "openai";
    this.name = "OpenAI";
  }
  async *generate(request) {
    const key = request.apiKey || this.defaultApiKey;
    if (!key && typeof process !== "undefined" && !process.env.OPENAI_API_KEY) {
      throw new LeveonasAuthError("Missing OpenAI API key", this.id);
    }
    const model = request.model || "gpt-4o-mini";
    const endpoint = "https://api.openai.com/v1/chat/completions";
    const messages = [];
    if (request.systemInstruction) {
      messages.push({ role: "system", content: request.systemInstruction });
    }
    messages.push({ role: "user", content: request.prompt });
    const body = {
      model,
      stream: true,
      stream_options: { include_usage: true },
      messages,
      max_tokens: request.maxTokens,
      temperature: request.temperature
    };
    let response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key || process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify(body),
        signal: request.signal
      });
    } catch (err) {
      if (err.name === "AbortError") throw new LeveonasAbortError(this.id);
      throw new LeveonasUnavailableError(`Network connection failed: ${err.message}`, this.id);
    }
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new LeveonasAuthError(`OpenAI authentication error (HTTP ${response.status})`, this.id, response.status);
      }
      if (response.status === 429) {
        throw new LeveonasRateLimitError("OpenAI rate limit exceeded", this.id);
      }
      if (response.status >= 500) {
        throw new LeveonasUnavailableError(`OpenAI service error (HTTP ${response.status})`, this.id, response.status);
      }
      throw new LeveonasInvalidRequestError(`OpenAI request failed (HTTP ${response.status})`, this.id, response.status);
    }
    if (!response.body) {
      throw new LeveonasUnavailableError("OpenAI returned an empty response body", this.id);
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const jsonStr = trimmed.slice(5).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const data = JSON.parse(jsonStr);
            const text = data.choices?.[0]?.delta?.content || "";
            const usage = data.usage;
            yield {
              text,
              inputTokens: usage?.prompt_tokens ?? null,
              outputTokens: usage?.completion_tokens ?? null,
              totalTokens: usage?.total_tokens ?? null,
              finishReason: data.choices?.[0]?.finish_reason ?? null,
              raw: data
            };
          } catch {
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
};
var GrokProvider = class {
  constructor(defaultApiKey) {
    this.defaultApiKey = defaultApiKey;
    this.id = "grok";
    this.name = "xAI Grok";
  }
  async *generate(request) {
    const key = request.apiKey || this.defaultApiKey;
    if (!key && typeof process !== "undefined" && !process.env.XAI_API_KEY) {
      throw new LeveonasAuthError("Missing xAI/Grok API key", this.id);
    }
    const model = request.model || "grok-2-latest";
    const endpoint = "https://api.x.ai/v1/chat/completions";
    const messages = [];
    if (request.systemInstruction) {
      messages.push({ role: "system", content: request.systemInstruction });
    }
    messages.push({ role: "user", content: request.prompt });
    const body = {
      model,
      stream: true,
      messages,
      max_tokens: request.maxTokens,
      temperature: request.temperature
    };
    let response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key || process.env.XAI_API_KEY}`
        },
        body: JSON.stringify(body),
        signal: request.signal
      });
    } catch (err) {
      if (err.name === "AbortError") throw new LeveonasAbortError(this.id);
      throw new LeveonasUnavailableError(`Network connection failed: ${err.message}`, this.id);
    }
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new LeveonasAuthError(`Grok authentication error (HTTP ${response.status})`, this.id, response.status);
      }
      if (response.status === 429) {
        throw new LeveonasRateLimitError("Grok rate limit exceeded", this.id);
      }
      if (response.status >= 500) {
        throw new LeveonasUnavailableError(`Grok service error (HTTP ${response.status})`, this.id, response.status);
      }
      throw new LeveonasInvalidRequestError(`Grok request failed (HTTP ${response.status})`, this.id, response.status);
    }
    if (!response.body) {
      throw new LeveonasUnavailableError("Grok returned an empty response body", this.id);
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const jsonStr = trimmed.slice(5).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const data = JSON.parse(jsonStr);
            const text = data.choices?.[0]?.delta?.content || "";
            const usage = data.usage;
            yield {
              text,
              inputTokens: usage?.prompt_tokens ?? null,
              outputTokens: usage?.completion_tokens ?? null,
              totalTokens: usage?.total_tokens ?? null,
              finishReason: data.choices?.[0]?.finish_reason ?? null,
              raw: data
            };
          } catch {
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
};

// packages/sdk/session.ts
var LeveonasSession = class {
  constructor(config = {}) {
    this.config = config;
    this.activeController = null;
    this.lastMetrics = null;
    this.isDestroyed = false;
  }
  /**
   * Generates UI from prompt or request.
   * Returns an AsyncIterable of StreamingEvents that also resolves to a RenderResponse when awaited.
   */
  generate(promptOrRequest) {
    this.assertNotDestroyed();
    const request = typeof promptOrRequest === "string" ? {
      prompt: promptOrRequest,
      provider: this.config.provider,
      model: this.config.model,
      telemetry: this.config.telemetry
    } : {
      provider: this.config.provider,
      model: this.config.model,
      telemetry: this.config.telemetry,
      ...promptOrRequest
    };
    this.activeController = new AbortController();
    const signal = this.activeController.signal;
    const fetchFn = this.config.fetchFn || (typeof fetch !== "undefined" ? fetch : void 0);
    if (!fetchFn) {
      throw new LeveonasError("No fetch implementation available in the current environment");
    }
    const endpoint = this.config.endpoint || "/api/generate";
    const metricsCollector = new MetricsCollector({
      mode: this.config.telemetry ? "development" : "production"
    });
    const eventQueue = [];
    let resolveNext = null;
    let streamDone = false;
    let streamError = null;
    let accumulatedText = "";
    let accumulatedPatches = [];
    const pushEvent = (event) => {
      eventQueue.push(event);
      if (resolveNext) {
        resolveNext();
        resolveNext = null;
      }
    };
    const startStream = async () => {
      try {
        pushEvent({ type: "generation:start", timestamp: Date.now() });
        const headers = {
          "Content-Type": "application/json"
        };
        if (this.config.apiKey) {
          headers["x-leveonas-key"] = this.config.apiKey;
          headers["Authorization"] = `Bearer ${this.config.apiKey}`;
        }
        await withRetry(
          async () => {
            const res = await fetchFn(endpoint, {
              method: "POST",
              headers,
              body: JSON.stringify(request),
              signal
            });
            if (!res.ok) {
              const errText = await res.text().catch(() => res.statusText);
              throw new LeveonasError(`Request failed with status ${res.status}: ${errText}`);
            }
            if (!res.body) {
              throw new LeveonasError("Response body is missing");
            }
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const chunkBytes = value.byteLength;
              metricsCollector.recordChunk(chunkBytes);
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n");
              buffer = lines.pop() || "";
              for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed.startsWith("data:")) continue;
                const dataStr = trimmed.slice(5).trim();
                if (!dataStr || dataStr === "[DONE]") continue;
                try {
                  const parsed = JSON.parse(dataStr);
                  if (parsed.text) {
                    accumulatedText += parsed.text;
                    pushEvent({
                      type: "generation:chunk",
                      text: accumulatedText,
                      delta: parsed.text,
                      timestamp: Date.now()
                    });
                  }
                  if (parsed.patch) {
                    accumulatedPatches.push(parsed.patch);
                    const patchOps = Array.isArray(parsed.patch) ? parsed.patch.length : 1;
                    metricsCollector.recordPatch(patchOps, dataStr.length);
                    pushEvent({
                      type: "generation:patch",
                      patch: parsed.patch,
                      timestamp: Date.now()
                    });
                  }
                  if (parsed.diagnostic) {
                    pushEvent({
                      type: "generation:diagnostic",
                      diagnostic: parsed.diagnostic,
                      timestamp: Date.now()
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
                } catch (err) {
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
          type: "generation:complete",
          metrics,
          timestamp: Date.now()
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          streamError = err;
          pushEvent({
            type: "generation:error",
            error: err,
            timestamp: Date.now()
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
    const asyncIterable = {
      [Symbol.asyncIterator]() {
        return {
          async next() {
            while (eventQueue.length === 0) {
              if (streamDone) {
                if (streamError) throw streamError;
                return { done: true, value: void 0 };
              }
              await new Promise((resolve) => {
                resolveNext = resolve;
              });
            }
            return { done: false, value: eventQueue.shift() };
          }
        };
      }
    };
    const combined = Object.assign(
      (async () => {
        await streamPromise;
        if (streamError) throw streamError;
        return {
          html: accumulatedText,
          ast: accumulatedPatches,
          metrics: this.lastMetrics || void 0
        };
      })(),
      asyncIterable
    );
    return combined;
  }
  /**
   * Stream UI generation using explicit callbacks.
   */
  async stream(requestOrPrompt, callbacks = {}) {
    this.assertNotDestroyed();
    callbacks.onStart?.();
    try {
      const generator = this.generate(requestOrPrompt);
      for await (const event of generator) {
        switch (event.type) {
          case "generation:chunk":
            callbacks.onChunk?.(event.delta);
            break;
          case "generation:patch":
            callbacks.onPatch?.(event.patch);
            break;
          case "generation:diagnostic":
            callbacks.onDiagnostic?.(event.diagnostic);
            break;
          case "generation:complete":
            callbacks.onComplete?.(event.metrics);
            break;
          case "generation:error":
            callbacks.onError?.(event.error);
            break;
        }
      }
      return this.lastMetrics;
    } catch (err) {
      callbacks.onError?.(err);
      throw err;
    }
  }
  /**
   * Abort active generation.
   */
  abort() {
    if (this.activeController) {
      this.activeController.abort();
      this.activeController = null;
    }
  }
  /**
   * Cancel alias for abort.
   */
  cancel() {
    this.abort();
  }
  /**
   * Synchronous render alias.
   */
  async render(request) {
    return this.generate(request);
  }
  /**
   * Compile helper.
   */
  async compile(request) {
    const res = await this.generate(typeof request === "string" ? request : request.source);
    return {
      html: res.html,
      ast: res.ast,
      success: true,
      diagnostics: []
    };
  }
  /**
   * Validate helper.
   */
  async validate(request) {
    return {
      valid: true,
      diagnostics: []
    };
  }
  /**
   * Retrieve the metrics from the most recent generation run.
   */
  getMetrics() {
    return this.lastMetrics;
  }
  /**
   * Destroy the session and cleanup resources.
   */
  destroy() {
    this.abort();
    this.isDestroyed = true;
    this.lastMetrics = null;
  }
  assertNotDestroyed() {
    if (this.isDestroyed) {
      throw new LeveonasError("Cannot operate on a destroyed LeveonasSession");
    }
  }
};
function createSession(config) {
  return new LeveonasSession(config);
}

// packages/common/origin.ts
var PRODUCTION_LEVEONAS_ORIGIN = "https://leveonas.ainot.site";
function getLeveonasOrigin(customOrigin) {
  if (customOrigin && typeof customOrigin === "string" && customOrigin.trim()) {
    return customOrigin.trim().replace(/\/+$/, "");
  }
  if (typeof window !== "undefined") {
    const win = window;
    if (win.LEVEONAS_ORIGIN && typeof win.LEVEONAS_ORIGIN === "string") {
      return win.LEVEONAS_ORIGIN.trim().replace(/\/+$/, "");
    }
    if (win.LEVEONAS_BASE_URL && typeof win.LEVEONAS_BASE_URL === "string") {
      return win.LEVEONAS_BASE_URL.trim().replace(/\/+$/, "");
    }
    if (win.location && win.location.origin) {
      const hostname = win.location.hostname;
      if (hostname === "localhost" || hostname === "127.0.0.1") {
        return win.location.origin.replace(/\/+$/, "");
      }
    }
  }
  if (typeof process !== "undefined" && process.env) {
    const envOrigin = process.env.NEXT_PUBLIC_LEVEONAS_ORIGIN || process.env.LEVEONAS_ORIGIN || process.env.NEXT_PUBLIC_LEVEONAS_BASE_URL;
    if (envOrigin && typeof envOrigin === "string" && envOrigin.trim()) {
      return envOrigin.trim().replace(/\/+$/, "");
    }
  }
  return PRODUCTION_LEVEONAS_ORIGIN;
}

// packages/sdk/config.ts
var DEFAULT_CONFIG = {
  baseUrl: PRODUCTION_LEVEONAS_ORIGIN,
  timeout: 3e4,
  retries: 3,
  debug: false
};
export {
  AuthenticationError,
  DEFAULT_CONFIG,
  DEFAULT_RETRY_POLICY,
  GeminiProvider,
  GrokProvider,
  LeveonasSession as Leveonas,
  LeveonasAbortError,
  LeveonasAuthError,
  LeveonasSession as LeveonasClient,
  LeveonasError,
  LeveonasInvalidRequestError,
  LeveonasProviderError,
  LeveonasRateLimitError,
  LeveonasResourceLimitError,
  LeveonasSecurityError,
  LeveonasSession,
  LeveonasTimeoutError,
  LeveonasUnavailableError,
  OpenAIProvider,
  PRODUCTION_LEVEONAS_ORIGIN,
  TimeoutError,
  ValidationError,
  createSession,
  getLeveonasOrigin,
  isRetryableError,
  withRetry
};
