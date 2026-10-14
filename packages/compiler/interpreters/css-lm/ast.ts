import { SourceLocation } from '../../ast/types';

export enum CSSNodeKind {
  StyleSheet = 'CSSStyleSheet',
  Rule = 'CSSRule',
  Declaration = 'CSSDeclaration',
  MediaRule = 'CSSMediaRule',
  KeyframesRule = 'CSSKeyframesRule',
  KeyframeBlock = 'CSSKeyframeBlock',
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
  keyframeSelector: string; // e.g. '0%', 'from', '100%', 'to'
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

export type CSSASTNode =
  | CSSStyleSheetNode
  | CSSRuleNode
  | CSSDeclarationNode
  | CSSMediaRuleNode
  | CSSKeyframesRuleNode
  | CSSKeyframeBlockNode;

/**
 * Deterministic ID Generator for CSS AST nodes.
 * Guarantees stable IDs across re-parses and updates without random seeds.
 */
export function getCSSRuleId(selector: string, parentId?: string): string {
  const normSel = selector.trim().replace(/\s+/g, ' ');
  return parentId ? `css-rule:${parentId}::${normSel}` : `css-rule:${normSel}`;
}

export function getCSSDeclarationId(ruleId: string, property: string): string {
  const normProp = property.trim().toLowerCase();
  return `css-decl:${ruleId}::${normProp}`;
}

export function getCSSMediaRuleId(query: string): string {
  const normQuery = query.trim().replace(/\s+/g, ' ');
  return `css-media:${normQuery}`;
}

export function getCSSKeyframesId(name: string): string {
  const normName = name.trim();
  return `css-kf:${normName}`;
}

export function getCSSKeyframeBlockId(keyframesId: string, selector: string): string {
  const normSel = selector.trim().replace(/\s+/g, ' ');
  return `css-kfb:${keyframesId}::${normSel}`;
}
