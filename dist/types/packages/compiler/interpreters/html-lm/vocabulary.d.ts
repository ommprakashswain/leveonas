import { ASTNodeKind } from '../../ast/types';
export declare const KNOWN_ELEMENT_ABBREVIATIONS: Record<string, string>;
export declare const KNOWN_ATTRIBUTE_ABBREVIATIONS: Record<string, string>;
export declare const KNOWN_HTML_TAGS: Set<string>;
export declare const KNOWN_HTML_ATTRIBUTES: Set<string>;
export declare const TAG_TO_AST_KIND: Record<string, ASTNodeKind>;
/**
 * Resolve an element identifier to its canonical HTML tag or custom component name.
 */
export declare function resolveElementTag(identifier: string): string;
export declare function isKnownElementAbbreviation(abbr: string): boolean;
export declare function isKnownAttributeAbbreviation(abbr: string): boolean;
export declare function expandElementAbbreviation(abbr: string): string;
export declare function expandAttributeAbbreviation(abbr: string): string;
/**
 * Resolve an attribute identifier to its canonical attribute name.
 */
export declare function resolveAttributeName(identifier: string): string;
/**
 * Determine whether a command identifier inside an element represents an attribute.
 */
export declare function isAttributeCommand(identifier: string): boolean;
/**
 * Determine ASTNodeKind and custom name for a canonical tag name.
 */
export declare function getASTKindForTag(canonicalTag: string): {
    kind: ASTNodeKind;
    customName?: string;
};
