import { NormalizedTokenUsage } from '@/packages/telemetry/types';
export interface ProviderRequestConfig {
    fetchUrl: string;
    fetchOptions: RequestInit;
}
export interface ProviderAdapter {
    buildRequest(model: string, prompt: string, userLlmKey: string, systemInstruction: string, maxTokens?: number, temperature?: number, seed?: number): ProviderRequestConfig;
    extractDelta(parsedJson: any): string;
}
export declare function formatProviderName(provider: string): string;
export declare class ProviderStreamError extends Error {
    readonly provider: string;
    readonly stage: "stream";
    readonly reason: string;
    readonly details?: string;
    constructor(provider: string, reason: string, details?: string);
    toJSON(): {
        provider: string;
        stage: "stream";
        reason: string;
        details: string | undefined;
        message: string;
    };
}
export declare function isProviderStreamError(err: unknown): err is ProviderStreamError;
export declare const OpenAIAdapter: ProviderAdapter;
export declare const GrokAdapter: ProviderAdapter;
export declare const AnthropicAdapter: ProviderAdapter;
export declare const GeminiAdapter: ProviderAdapter;
export declare const PROVIDER_ADAPTERS: Record<string, ProviderAdapter>;
export declare function getProviderAdapter(provider: string): ProviderAdapter;
export declare function buildProviderRequest(provider: string, model: string, prompt: string, userLlmKey: string, systemInstruction: string, maxTokens?: number, temperature?: number, seed?: number): ProviderRequestConfig;
/**
 * Resolves a server-side provider API key from the incoming header or server environment variables.
 * Never leaks or accepts keys from benchmark request/response bodies.
 */
export declare function resolveProviderApiKey(provider: string, headerKey?: string | null): string | null;
/**
 * Sanitizes an error message or string by stripping credentials, Bearer tokens, and URL keys.
 */
export declare function sanitizeErrorMessage(message: string, keysToMask?: (string | null | undefined)[]): string;
export declare function extractTextDelta(provider: string, parsed: any): string;
/**
 * Validates and extracts text delta from a framed SSE data string.
 * Distinguishes:
 * 1. Termination sentinel ([DONE]) -> returns null
 * 2. Malformed JSON in complete event -> throws ProviderStreamError
 * 3. Non-object payload -> throws ProviderStreamError
 * 4. Provider error payload (parsed.error or parsed.type === 'error') -> throws ProviderStreamError
 * 5. Blocked content -> throws ProviderStreamError
 * 6. Valid event -> extracts delta; returns empty string as null
 */
export declare function parseAndValidateProviderEvent(provider: string, adapter: ProviderAdapter, dataStr: string): string | null;
/**
 * Normalizes provider token usage information from parsed event payloads.
 * Supports OpenAI, Grok, Gemini, and Anthropic formats.
 * Returns null if token usage is unavailable (never estimates tokens from characters).
 */
export declare function extractProviderUsage(provider: string, parsed: any): NormalizedTokenUsage | null;
/**
 * Normalizes a provider's streaming response into an AsyncIterable<string> of text chunks.
 * Handles SSE framing, line buffering, JSON validation, provider error handling, and cancellation cleanly.
 *
 * Line buffering guarantees incomplete lines remain buffered until a newline arrives.
 * Once a complete SSE line is extracted, JSON parse failures and provider error payloads throw immediately.
 */
export declare function streamProviderChunks(provider: string, response: Response, signal?: AbortSignal, onUsage?: (usage: NormalizedTokenUsage) => void): AsyncGenerator<string, void, unknown>;
