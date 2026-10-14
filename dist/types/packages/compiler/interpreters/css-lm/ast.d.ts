import { SourceLocation } from '../../ast/types';
export declare enum CSSNodeKind {
    StyleSheet = "CSSStyleSheet",
    Rule = "CSSRule",
    Declaration = "CSSDeclaration",
    MediaRule = "CSSMediaRule",
    KeyframesRule = "CSSKeyframesRule",
    KeyframeBlock = "CSSKeyframeBlock"
}
export interface CSSBaseNode {
    id: string;
    kind: CSSNodeKind;
    sourceLocation?: SourceLocation;
}
export interface CSSDeclarationNode extends CSSBaseNode {
    kind: CSSNodeKind.Declaration;
    property: string;
    value: string;
    important: boolean;
}
export interface CSSRuleNode extends CSSBaseNode {
    kind: CSSNodeKind.Rule;
    selector: string;
    declarations: CSSDeclarationNode[];
    parentRuleId?: string;
}
export interface CSSKeyframeBlockNode extends CSSBaseNode {
    kind: CSSNodeKind.KeyframeBlock;
    keyframeSelector: string;
    declarations: CSSDeclarationNode[];
}
export interface CSSKeyframesRuleNode extends CSSBaseNode {
    kind: CSSNodeKind.KeyframesRule;
    name: string;
    keyframes: CSSKeyframeBlockNode[];
}
export interface CSSMediaRuleNode extends CSSBaseNode {
    kind: CSSNodeKind.MediaRule;
    query: string;
    rules: CSSRuleNode[];
}
export type CSSRuleItem = CSSRuleNode | CSSMediaRuleNode | CSSKeyframesRuleNode;
export interface CSSStyleSheetNode extends CSSBaseNode {
    kind: CSSNodeKind.StyleSheet;
    rules: CSSRuleItem[];
}
export type CSSASTNode = CSSStyleSheetNode | CSSRuleNode | CSSDeclarationNode | CSSMediaRuleNode | CSSKeyframesRuleNode | CSSKeyframeBlockNode;
/**
 * Deterministic ID Generator for CSS AST nodes.
 * Guarantees stable IDs across re-parses and updates without random seeds.
 */
export declare function getCSSRuleId(selector: string, parentId?: string): string;
export declare function getCSSDeclarationId(ruleId: string, property: string): string;
export declare function getCSSMediaRuleId(query: string): string;
export declare function getCSSKeyframesId(name: string): string;
export declare function getCSSKeyframeBlockId(keyframesId: string, selector: string): string;
