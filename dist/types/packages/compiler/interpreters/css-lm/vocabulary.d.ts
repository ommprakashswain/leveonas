/**
 * Canonical CSS-LM v1 Property Abbreviations Dictionary
 *
 * Implements deterministic bidirectional property encoding and decoding.
 * Properties not in this dictionary remain uncompressed or map 1:1.
 */
export declare const CSS_PROPERTY_ABBREVIATIONS: Record<string, string>;
export declare const CANONICAL_TO_LM_CSS_PROPERTY: Record<string, string>;
/**
 * Encodes a standard CSS property name into its canonical CSS-LM abbreviation.
 * If no abbreviation exists or if the property is a custom CSS variable (--*),
 * returns the original property string.
 */
export declare function encodeCSSProperty(property: string): string;
/**
 * Decodes a CSS-LM abbreviation or property identifier into standard canonical CSS property name.
 * If the identifier is not in the abbreviation dictionary, returns the normalized property string.
 */
export declare function decodeCSSProperty(lmProperty: string): string;
