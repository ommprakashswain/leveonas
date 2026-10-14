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
export declare class LeveonasProviderError extends Error {
    readonly provider: string;
    readonly statusCode?: number;
    readonly isRetryable: boolean;
    constructor(message: string, provider: string, isRetryable?: boolean, statusCode?: number);
}
export declare class LeveonasAuthError extends LeveonasProviderError {
    constructor(message: string, provider: string, statusCode?: number);
}
export declare class LeveonasInvalidRequestError extends LeveonasProviderError {
    constructor(message: string, provider: string, statusCode?: number);
}
export declare class LeveonasRateLimitError extends LeveonasProviderError {
    constructor(message: string, provider: string, statusCode?: number);
}
export declare class LeveonasTimeoutError extends LeveonasProviderError {
    constructor(message: string, provider: string);
}
export declare class LeveonasUnavailableError extends LeveonasProviderError {
    constructor(message: string, provider: string, statusCode?: number);
}
export declare class LeveonasSecurityError extends LeveonasProviderError {
    constructor(message: string, provider: string);
}
export declare class LeveonasResourceLimitError extends LeveonasProviderError {
    constructor(message: string, provider: string);
}
export declare class LeveonasAbortError extends LeveonasProviderError {
    constructor(provider: string);
}
/**
 * Checks whether an error is safe to retry.
 */
export declare function isRetryableError(error: unknown): boolean;
export interface RetryPolicy {
    maxRetries: number;
    initialDelayMs: number;
    maxDelayMs: number;
    backoffFactor: number;
    jitter: boolean;
}
export declare const DEFAULT_RETRY_POLICY: RetryPolicy;
export declare function withRetry<T>(fn: () => Promise<T>, policy?: Partial<RetryPolicy>): Promise<T>;
export declare class GeminiProvider implements LeveonasProvider {
    private defaultApiKey?;
    readonly id = "gemini";
    readonly name = "Google Gemini";
    constructor(defaultApiKey?: string | undefined);
    generate(request: ProviderRequest): AsyncIterable<ProviderChunk>;
}
export declare class OpenAIProvider implements LeveonasProvider {
    private defaultApiKey?;
    readonly id = "openai";
    readonly name = "OpenAI";
    constructor(defaultApiKey?: string | undefined);
    generate(request: ProviderRequest): AsyncIterable<ProviderChunk>;
}
export declare class GrokProvider implements LeveonasProvider {
    private defaultApiKey?;
    readonly id = "grok";
    readonly name = "xAI Grok";
    constructor(defaultApiKey?: string | undefined);
    generate(request: ProviderRequest): AsyncIterable<ProviderChunk>;
}
