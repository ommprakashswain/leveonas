/**
 * Canonical TS-LM Vocabulary and Keyword/Type Mapping
 *
 * Implements token-efficient TypeScript representations while preserving
 * standard syntax transparency and deterministic expansion.
 */
export declare const TS_TYPE_ABBREVIATIONS: Record<string, string>;
export declare const TS_KEYWORD_ABBREVIATIONS: Record<string, string>;
export declare const TS_DOM_ABBREVIATIONS: Record<string, string>;
export declare const KNOWN_DOM_EVENTS: Set<string>;
/**
 * Expands shorthand type abbreviations (e.g. `num` -> `number`, `str` -> `string`).
 */
export declare function expandTSTypeAbbreviation(typeStr: string): string;
/**
 * Expands TS-LM abbreviations (keywords, types, DOM helpers) in code while
 * avoiding replacement inside string literals or identifiers.
 */
export declare function decodeTSLM(code: string): string;
/**
 * Check whether an event name is a supported DOM event.
 */
export declare function isValidDOMEvent(eventName: string): boolean;
