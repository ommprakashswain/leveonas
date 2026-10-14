/**
 * Leveonas Centralized URL Security & Protocol Sanitization
 *
 * Enforces strict protocol validation and prevents script injection via:
 * - javascript:
 * - vbscript:
 * - data: (unless explicitly allowed as a safe image)
 * - obfuscation with whitespace, control characters, or entity encodings
 */
export interface UrlValidationOptions {
    allowDataImages?: boolean;
    allowRelative?: boolean;
    allowedProtocols?: string[];
}
/**
 * Strips ASCII control characters and internal whitespace that attackers use to bypass protocol checks.
 * (e.g., `java\0script:`, `java\tscript:`, `java\n\rscript:`, `&#x6A;avascript:`)
 */
export declare function normalizeUrlString(url: string): string;
/**
 * Checks if a URL string uses a dangerous protocol or obfuscated script scheme.
 */
export declare function isDangerousProtocol(url: string): boolean;
/**
 * Validates a URL against allowed protocols and security constraints.
 */
export declare function isValidUrl(url: string, options?: UrlValidationOptions): boolean;
/**
 * Sanitizes a URL, returning a safe fallback (default: 'about:blank' or empty string) if invalid.
 */
export declare function sanitizeUrl(url: string, fallback?: string, options?: UrlValidationOptions): string;
/**
 * Sanitizes CSS property strings against dangerous url(), expression(), -moz-binding, and behavior values.
 */
export declare function sanitizeCssText(css: string): string;
