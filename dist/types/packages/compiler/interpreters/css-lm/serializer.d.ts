import { CSSStyleSheetNode, CSSRuleNode, CSSDeclarationNode, CSSMediaRuleNode, CSSKeyframesRuleNode, CSSKeyframeBlockNode } from './ast';
export interface CSSSerializerOptions {
    minify?: boolean;
    indent?: string;
}
/**
 * Serializes a single CSS declaration node to standard CSS string.
 */
export declare function serializeCSSDeclaration(decl: CSSDeclarationNode, options?: CSSSerializerOptions): string;
/**
 * Serializes a single CSS rule node to standard CSS string.
 */
export declare function serializeCSSRule(rule: CSSRuleNode, options?: CSSSerializerOptions, indentLevel?: number): string;
/**
 * Serializes a keyframe step block.
 */
export declare function serializeCSSKeyframeBlock(block: CSSKeyframeBlockNode, options?: CSSSerializerOptions, indentLevel?: number): string;
/**
 * Serializes a @keyframes rule node.
 */
export declare function serializeCSSKeyframesRule(kf: CSSKeyframesRuleNode, options?: CSSSerializerOptions, indentLevel?: number): string;
/**
 * Serializes a @media rule node.
 */
export declare function serializeCSSMediaRule(media: CSSMediaRuleNode, options?: CSSSerializerOptions, indentLevel?: number): string;
/**
 * Serializes an entire CSSStyleSheetNode to standard CSS.
 */
export declare function serializeCSSStyleSheet(sheet: CSSStyleSheetNode, options?: CSSSerializerOptions): string;
