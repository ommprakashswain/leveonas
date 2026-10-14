/**
 * JavaScript-LM Canonical Vocabulary & Helper Abbreviation Map
 *
 * Provides deterministic compression and expansion for common JS/DOM interaction primitives.
 */
export declare const JS_KEYWORD_ABBREVIATIONS: Record<string, string>;
export declare const JS_DOM_ABBREVIATIONS: Record<string, string>;
export declare const SUPPORTED_EVENTS: Set<string>;
/**
 * Decode a JS-LM DOM/utility abbreviation to standard identifier or helper name.
 */
export declare function decodeJSAbbreviation(abbr: string): string;
/**
 * Encode a standard JS helper name to its canonical JS-LM abbreviation.
 */
export declare function encodeJSAbbreviation(fullName: string): string;
/**
 * Check whether an event name is a supported standard DOM event.
 */
export declare function isValidDOMEvent(eventName: string): boolean;
