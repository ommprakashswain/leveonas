/**
 * Leveonas Normalized Provider Interface & Retry Policies
 *
 * Provides a provider-agnostic streaming abstraction for LLMs (Gemini, OpenAI, Grok, etc.)
 * with normalized chunks, authoritative usage tracking, and safe exponential-backoff retries.
 */

export interface ProviderRequest {
  prompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemInstruction?: string;
  signal?: AbortSignal;
  apiKey?: string;
}

export interface ProviderChunk {
  text: string;
  inputTokens?: number | null;
  outputTokens?: number | null;
  totalTokens?: number | null;
  finishReason?: string | null;
  raw?: unknown;
}

export interface LeveonasProvider {
  readonly id: string;
  readonly name: string;
  generate(request: ProviderRequest): AsyncIterable<ProviderChunk>;
}

// ----------------------------------------------------
// Error Hierarchy & Classification
// ----------------------------------------------------

export class LeveonasProviderError extends Error {
  public readonly provider: string;
  public readonly statusCode?: number;
  public readonly isRetryable: boolean;

  constructor(message: string, provider: string, isRetryable = false, statusCode?: number) {
    super(message);
    this.name = 'LeveonasProviderError';
    this.provider = provider;
    this.isRetryable = isRetryable;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, LeveonasProviderError.prototype);
  }
}

export class LeveonasAuthError extends LeveonasProviderError {
  constructor(message: string, provider: string, statusCode = 401) {
    super(message, provider, false, statusCode);
    this.name = 'LeveonasAuthError';
    Object.setPrototypeOf(this, LeveonasAuthError.prototype);
  }
}

export class LeveonasInvalidRequestError extends LeveonasProviderError {
  constructor(message: string, provider: string, statusCode = 400) {
    super(message, provider, false, statusCode);
    this.name = 'LeveonasInvalidRequestError';
    Object.setPrototypeOf(this, LeveonasInvalidRequestError.prototype);
  }
}

export class LeveonasRateLimitError extends LeveonasProviderError {
  constructor(message: string, provider: string, statusCode = 429) {
    super(message, provider, true, statusCode);
    this.name = 'LeveonasRateLimitError';
    Object.setPrototypeOf(this, LeveonasRateLimitError.prototype);
  }
}

export class LeveonasTimeoutError extends LeveonasProviderError {
  constructor(message: string, provider: string) {
    super(message, provider, true, 408);
    this.name = 'LeveonasTimeoutError';
    Object.setPrototypeOf(this, LeveonasTimeoutError.prototype);
  }
}

export class LeveonasUnavailableError extends LeveonasProviderError {
  constructor(message: string, provider: string, statusCode = 503) {
    super(message, provider, true, statusCode);
    this.name = 'LeveonasUnavailableError';
    Object.setPrototypeOf(this, LeveonasUnavailableError.prototype);
  }
}

export class LeveonasSecurityError extends LeveonasProviderError {
  constructor(message: string, provider: string) {
    super(message, provider, false, 403);
    this.name = 'LeveonasSecurityError';
    Object.setPrototypeOf(this, LeveonasSecurityError.prototype);
  }
}

export class LeveonasResourceLimitError extends LeveonasProviderError {
  constructor(message: string, provider: string) {
    super(message, provider, false, 413);
    this.name = 'LeveonasResourceLimitError';
    Object.setPrototypeOf(this, LeveonasResourceLimitError.prototype);
  }
}

export class LeveonasAbortError extends LeveonasProviderError {
  constructor(provider: string) {
    super('Operation aborted by user or timeout', provider, false, 499);
    this.name = 'LeveonasAbortError';
    Object.setPrototypeOf(this, LeveonasAbortError.prototype);
  }
}

/**
 * Checks whether an error is safe to retry.
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof LeveonasProviderError) {
    return error.isRetryable;
  }
  if (error instanceof Error && error.name === 'AbortError') {
    return false;
  }
  return false;
}

// ----------------------------------------------------
// Retry Policy & Backoff Engine
// ----------------------------------------------------

export interface RetryPolicy {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffFactor: number;
  jitter: boolean;
}

export const DEFAULT_RETRY_POLICY: RetryPolicy = {
  maxRetries: 3,
  initialDelayMs: 500,
  maxDelayMs: 4000,
  backoffFactor: 2,
  jitter: true,
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  policy: Partial<RetryPolicy> = {}
): Promise<T> {
  const merged: RetryPolicy = { ...DEFAULT_RETRY_POLICY, ...policy };
  let attempt = 0;
  let delay = merged.initialDelayMs;

  while (true) {
    try {
      return await fn();
    } catch (error: unknown) {
      attempt++;
      if (attempt > merged.maxRetries || !isRetryableError(error)) {
        throw error;
      }

      // Compute exponential backoff with optional jitter
      const jitterFactor = merged.jitter ? 0.75 + Math.random() * 0.5 : 1;
      const calculatedDelay = Math.min(delay * jitterFactor, merged.maxDelayMs);
      
      await new Promise((resolve) => setTimeout(resolve, calculatedDelay));
      delay = Math.min(delay * merged.backoffFactor, merged.maxDelayMs);
    }
  }
}

// ----------------------------------------------------
// Normalized Provider Implementations
// ----------------------------------------------------

export class GeminiProvider implements LeveonasProvider {
  public readonly id = 'gemini';
  public readonly name = 'Google Gemini';

  constructor(private defaultApiKey?: string) {}

  async *generate(request: ProviderRequest): AsyncIterable<ProviderChunk> {
    const key = request.apiKey || this.defaultApiKey;
    if (!key && typeof process !== 'undefined' && !process.env.GEMINI_API_KEY) {
      throw new LeveonasAuthError('Missing Gemini API key', this.id);
    }

    const model = request.model || 'gemini-2.5-flash';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${key || process.env.GEMINI_API_KEY}`;

    const body = {
      contents: [{ role: 'user', parts: [{ text: request.prompt }] }],
      systemInstruction: request.systemInstruction ? { parts: [{ text: request.systemInstruction }] } : undefined,
      generationConfig: {
        maxOutputTokens: request.maxTokens,
        temperature: request.temperature,
      },
    };

    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: request.signal,
      });
    } catch (err: any) {
      if (err.name === 'AbortError') throw new LeveonasAbortError(this.id);
      throw new LeveonasUnavailableError(`Network connection failed: ${err.message}`, this.id);
    }

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new LeveonasAuthError(`Gemini authentication error (HTTP ${response.status})`, this.id, response.status);
      }
      if (response.status === 429) {
        throw new LeveonasRateLimitError('Gemini rate limit exceeded', this.id);
      }
      if (response.status >= 500) {
        throw new LeveonasUnavailableError(`Gemini service error (HTTP ${response.status})`, this.id, response.status);
      }
      throw new LeveonasInvalidRequestError(`Gemini request failed (HTTP ${response.status})`, this.id, response.status);
    }

    if (!response.body) {
      throw new LeveonasUnavailableError('Gemini returned an empty response body', this.id);
    }

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
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const jsonStr = trimmed.slice(5).trim();
          if (!jsonStr || jsonStr === '[DONE]') continue;

          try {
            const data = JSON.parse(jsonStr);
            const candidate = data.candidates?.[0];
            const text = candidate?.content?.parts?.[0]?.text || '';
            const usage = data.usageMetadata;

            yield {
              text,
              inputTokens: usage?.promptTokenCount ?? null,
              outputTokens: usage?.candidatesTokenCount ?? null,
              totalTokens: usage?.totalTokenCount ?? null,
              finishReason: candidate?.finishReason ?? null,
              raw: data,
            };
          } catch {
            // Ignore malformed intermediate chunks
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}

export class OpenAIProvider implements LeveonasProvider {
  public readonly id = 'openai';
  public readonly name = 'OpenAI';

  constructor(private defaultApiKey?: string) {}

  async *generate(request: ProviderRequest): AsyncIterable<ProviderChunk> {
    const key = request.apiKey || this.defaultApiKey;
    if (!key && typeof process !== 'undefined' && !process.env.OPENAI_API_KEY) {
      throw new LeveonasAuthError('Missing OpenAI API key', this.id);
    }

    const model = request.model || 'gpt-4o-mini';
    const endpoint = 'https://api.openai.com/v1/chat/completions';

    const messages = [];
    if (request.systemInstruction) {
      messages.push({ role: 'system', content: request.systemInstruction });
    }
    messages.push({ role: 'user', content: request.prompt });

    const body = {
      model,
      stream: true,
      stream_options: { include_usage: true },
      messages,
      max_tokens: request.maxTokens,
      temperature: request.temperature,
    };

    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key || process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify(body),
        signal: request.signal,
      });
    } catch (err: any) {
      if (err.name === 'AbortError') throw new LeveonasAbortError(this.id);
      throw new LeveonasUnavailableError(`Network connection failed: ${err.message}`, this.id);
    }

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new LeveonasAuthError(`OpenAI authentication error (HTTP ${response.status})`, this.id, response.status);
      }
      if (response.status === 429) {
        throw new LeveonasRateLimitError('OpenAI rate limit exceeded', this.id);
      }
      if (response.status >= 500) {
        throw new LeveonasUnavailableError(`OpenAI service error (HTTP ${response.status})`, this.id, response.status);
      }
      throw new LeveonasInvalidRequestError(`OpenAI request failed (HTTP ${response.status})`, this.id, response.status);
    }

    if (!response.body) {
      throw new LeveonasUnavailableError('OpenAI returned an empty response body', this.id);
    }

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
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const jsonStr = trimmed.slice(5).trim();
          if (jsonStr === '[DONE]') continue;

          try {
            const data = JSON.parse(jsonStr);
            const text = data.choices?.[0]?.delta?.content || '';
            const usage = data.usage;

            yield {
              text,
              inputTokens: usage?.prompt_tokens ?? null,
              outputTokens: usage?.completion_tokens ?? null,
              totalTokens: usage?.total_tokens ?? null,
              finishReason: data.choices?.[0]?.finish_reason ?? null,
              raw: data,
            };
          } catch {
            // Ignore malformed intermediate chunks
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}

export class GrokProvider implements LeveonasProvider {
  public readonly id = 'grok';
  public readonly name = 'xAI Grok';

  constructor(private defaultApiKey?: string) {}

  async *generate(request: ProviderRequest): AsyncIterable<ProviderChunk> {
    const key = request.apiKey || this.defaultApiKey;
    if (!key && typeof process !== 'undefined' && !process.env.XAI_API_KEY) {
      throw new LeveonasAuthError('Missing xAI/Grok API key', this.id);
    }

    const model = request.model || 'grok-2-latest';
    const endpoint = 'https://api.x.ai/v1/chat/completions';

    const messages = [];
    if (request.systemInstruction) {
      messages.push({ role: 'system', content: request.systemInstruction });
    }
    messages.push({ role: 'user', content: request.prompt });

    const body = {
      model,
      stream: true,
      messages,
      max_tokens: request.maxTokens,
      temperature: request.temperature,
    };

    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key || process.env.XAI_API_KEY}`,
        },
        body: JSON.stringify(body),
        signal: request.signal,
      });
    } catch (err: any) {
      if (err.name === 'AbortError') throw new LeveonasAbortError(this.id);
      throw new LeveonasUnavailableError(`Network connection failed: ${err.message}`, this.id);
    }

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new LeveonasAuthError(`Grok authentication error (HTTP ${response.status})`, this.id, response.status);
      }
      if (response.status === 429) {
        throw new LeveonasRateLimitError('Grok rate limit exceeded', this.id);
      }
      if (response.status >= 500) {
        throw new LeveonasUnavailableError(`Grok service error (HTTP ${response.status})`, this.id, response.status);
      }
      throw new LeveonasInvalidRequestError(`Grok request failed (HTTP ${response.status})`, this.id, response.status);
    }

    if (!response.body) {
      throw new LeveonasUnavailableError('Grok returned an empty response body', this.id);
    }

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
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const jsonStr = trimmed.slice(5).trim();
          if (jsonStr === '[DONE]') continue;

          try {
            const data = JSON.parse(jsonStr);
            const text = data.choices?.[0]?.delta?.content || '';
            const usage = data.usage;

            yield {
              text,
              inputTokens: usage?.prompt_tokens ?? null,
              outputTokens: usage?.completion_tokens ?? null,
              totalTokens: usage?.total_tokens ?? null,
              finishReason: data.choices?.[0]?.finish_reason ?? null,
              raw: data,
            };
          } catch {
            // Ignore malformed intermediate chunks
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}
