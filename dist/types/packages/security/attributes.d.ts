/**
 * Leveonas Attribute Security & Normalization
 *
 * Prevents DOM-based XSS, inline handler execution, and unauthorized navigation
 * through HTML attribute inspection and sanitization.
 */
/**
 * Attributes that expect URL values and require strict scheme validation.
 */
export declare const URL_ATTRIBUTES: Set<string>;
/**
 * Disallowed or high-risk attributes that can escape runtime boundaries.
 */
export declare const FORBIDDEN_ATTRIBUTES: Set<string>;
/**
 * Normalizes an attribute name: converts to lower case and strips non-alphanumeric chars.
 */
export declare function normalizeAttributeName(name: string): string;
/**
 * Validates whether an attribute name and value are safe to apply to a DOM element.
 */
export declare function isAttributeSafe(name: string, value: unknown): boolean;
/**
 * Sanitizes a dictionary of attributes, removing all unsafe keys and neutralizing unsafe values.
 */
export declare function sanitizeAttributes(attrs: Record<string, unknown>): Record<string, string>;
