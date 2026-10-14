import {
  CSSStyleSheetNode,
  CSSRuleNode,
  CSSDeclarationNode,
  CSSMediaRuleNode,
  CSSKeyframesRuleNode,
  CSSKeyframeBlockNode,
  CSSRuleItem,
} from './ast';

export interface CSSSerializerOptions {
  minify?: boolean;
  indent?: string;
}

/**
 * Serializes a single CSS declaration node to standard CSS string.
 */
export function serializeCSSDeclaration(
  decl: CSSDeclarationNode,
  options: CSSSerializerOptions = {}
): string {
  const importantStr = decl.important ? ' !important' : '';
  const sep = options.minify ? ':' : ': ';
  return `${decl.property}${sep}${decl.value}${importantStr};`;
}

/**
 * Serializes a single CSS rule node to standard CSS string.
 */
export function serializeCSSRule(
  rule: CSSRuleNode,
  options: CSSSerializerOptions = {},
  indentLevel: number = 0
): string {
  const minify = !!options.minify;
  const indent = minify ? '' : (options.indent || '  ').repeat(indentLevel);
  const innerIndent = minify ? '' : (options.indent || '  ').repeat(indentLevel + 1);
  const newline = minify ? '' : '\n';
  const space = minify ? '' : ' ';

  const decls = rule.declarations
    .map((d) => `${innerIndent}${serializeCSSDeclaration(d, options)}`)
    .join(newline);

  if (minify) {
    return `${rule.selector}{${decls}}`;
  }

  if (rule.declarations.length === 0) {
    return `${indent}${rule.selector} {}`;
  }

  return `${indent}${rule.selector}${space}{${newline}${decls}${newline}${indent}}`;
}

/**
 * Serializes a keyframe step block.
 */
export function serializeCSSKeyframeBlock(
  block: CSSKeyframeBlockNode,
  options: CSSSerializerOptions = {},
  indentLevel: number = 1
): string {
  const minify = !!options.minify;
  const indent = minify ? '' : (options.indent || '  ').repeat(indentLevel);
  const innerIndent = minify ? '' : (options.indent || '  ').repeat(indentLevel + 1);
  const newline = minify ? '' : '\n';
  const space = minify ? '' : ' ';

  const decls = block.declarations
    .map((d) => `${innerIndent}${serializeCSSDeclaration(d, options)}`)
    .join(newline);

  if (minify) {
    return `${block.keyframeSelector}{${decls}}`;
  }

  return `${indent}${block.keyframeSelector}${space}{${newline}${decls}${newline}${indent}}`;
}

/**
 * Serializes a @keyframes rule node.
 */
export function serializeCSSKeyframesRule(
  kf: CSSKeyframesRuleNode,
  options: CSSSerializerOptions = {},
  indentLevel: number = 0
): string {
  const minify = !!options.minify;
  const indent = minify ? '' : (options.indent || '  ').repeat(indentLevel);
  const newline = minify ? '' : '\n';
  const space = minify ? '' : ' ';

  const blocks = kf.keyframes
    .map((b) => serializeCSSKeyframeBlock(b, options, indentLevel + 1))
    .join(newline);

  if (minify) {
    return `@keyframes ${kf.name}{${blocks}}`;
  }

  return `${indent}@keyframes ${kf.name}${space}{${newline}${blocks}${newline}${indent}}`;
}

/**
 * Serializes a @media rule node.
 */
export function serializeCSSMediaRule(
  media: CSSMediaRuleNode,
  options: CSSSerializerOptions = {},
  indentLevel: number = 0
): string {
  const minify = !!options.minify;
  const indent = minify ? '' : (options.indent || '  ').repeat(indentLevel);
  const newline = minify ? '' : '\n';
  const space = minify ? '' : ' ';

  const formattedQuery = (media.query.includes(':') && !media.query.startsWith('(') && !media.query.includes('screen') && !media.query.includes('print') && !media.query.includes('only') && !media.query.includes('and'))
    ? `(${media.query})`
    : media.query;

  const innerRules = media.rules
    .map((r) => serializeCSSRule(r, options, indentLevel + 1))
    .join(newline + (minify ? '' : '\n'));

  if (minify) {
    return `@media ${formattedQuery}{${innerRules}}`;
  }

  return `${indent}@media ${formattedQuery}${space}{${newline}${innerRules}${newline}${indent}}`;
}

/**
 * Serializes an entire CSSStyleSheetNode to standard CSS.
 */
export function serializeCSSStyleSheet(
  sheet: CSSStyleSheetNode,
  options: CSSSerializerOptions = {}
): string {
  const minify = !!options.minify;
  const separator = minify ? '' : '\n\n';

  const serializedRules = sheet.rules.map((item: CSSRuleItem) => {
    switch (item.kind) {
      case 'CSSRule':
        return serializeCSSRule(item as CSSRuleNode, options);
      case 'CSSMediaRule':
        return serializeCSSMediaRule(item as CSSMediaRuleNode, options);
      case 'CSSKeyframesRule':
        return serializeCSSKeyframesRule(item as CSSKeyframesRuleNode, options);
      default:
        return '';
    }
  }).filter(Boolean);

  return serializedRules.join(separator);
}
