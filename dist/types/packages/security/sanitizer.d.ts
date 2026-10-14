/**
 * Leveonas Error & Secret Sanitizer
 *
 * Prevents sensitive API keys, filesystem paths, provider responses,
 * and stack traces from leaking to clients or browser runtime.
 */
export interface SanitizedError {
    code: string;
    message: string;
    safeDetails?: Record<string, unknown>;
}
/**
 * Redacts any detected secrets or API tokens from a given text string.
 */
export declare function censorSecrets(text: string): string;
/**
 * Strips internal server filesystem paths from text.
 */
export declare function censorPaths(text: string): string;
/**
 * Normalizes and sanitizes an error into a safe client response.
 */
export declare function sanitizeErrorMessage(err: unknown, isProduction?: boolean): SanitizedError;
