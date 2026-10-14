/**
 * Canonical Leveonas Markup (LM) Abbreviation Dictionary & Utility
 *
 * LM abbreviation is applied only to identifiers that are explicitly part
 * of the LM compression vocabulary (known elements, attributes, framework syntax).
 *
 * For any identifier not in the canonical vocabulary, the original identifier
 * is returned unchanged to preserve semantic meaning in application code.
 */
export declare const CANONICAL_ELEMENT_MAPPINGS: Record<string, string>;
export declare const CANONICAL_ATTRIBUTE_MAPPINGS: Record<string, string>;
export declare const CANONICAL_FRAMEWORK_MAPPINGS: Record<string, string>;
/**
 * Abbreviate an element, attribute, or framework identifier if it belongs to the
 * canonical LM compression vocabulary.
 *
 * Returns the original identifier unchanged if not in the canonical vocabulary.
 */
export declare function abbreviate(identifier: string): string;
