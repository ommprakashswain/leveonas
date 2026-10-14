import { ASTNodeKind } from '../../ast/types';

export const KNOWN_ELEMENT_ABBREVIATIONS: Record<string, string> = {
  di: 'div',
  bo: 'button',
  so: 'section',
  al: 'article',
  ad: 'aside',
  he: 'header',
  fe: 'footer',
  na: 'nav',
  mi: 'main',
  sa: 'span',
  iu: 'input',
  le: 'label',
  tl: 'table',
  cu: 'canvas',
  fr: 'form',
  pa: 'p',
};

export const KNOWN_ATTRIBUTE_ABBREVIATIONS: Record<string, string> = {
  cs: 'class',
  cm: 'className',
  hr: 'href',
  id: 'id',
  sr: 'src',
  tp: 'type',
  pe: 'placeholder',
  nm: 'name',
  vu: 'value',
  oc: 'onClick',
  og: 'onChange',
};

export const KNOWN_HTML_TAGS = new Set([
  'div', 'button', 'section', 'article', 'aside', 'header', 'footer', 'nav', 'main',
  'span', 'input', 'label', 'table', 'canvas', 'form', 'p', 'a', 'img',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'select', 'option', 'textarea',
  'b', 'i', 'u', 's', 'strong', 'em', 'small', 'mark', 'del', 'ins', 'sub', 'sup',
  'code', 'pre', 'kbd', 'samp', 'var',
  'blockquote', 'q', 'cite', 'abbr', 'address', 'time',
  'figure', 'figcaption', 'picture', 'source', 'audio', 'video', 'track', 'iframe',
  'caption', 'colgroup', 'col', 'tbody', 'thead', 'tfoot', 'tr', 'td', 'th',
  'fieldset', 'legend', 'datalist', 'optgroup', 'output', 'progress', 'meter',
  'details', 'summary', 'dialog', 'menu',
  'svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'text', 'g',
  'hr', 'br', 'wbr'
]);

export const KNOWN_HTML_ATTRIBUTES = new Set([
  'class', 'className', 'href', 'id', 'src', 'type', 'placeholder', 'name', 'value',
  'title', 'alt', 'role', 'disabled', 'hidden', 'checked', 'required', 'readonly',
  'autofocus', 'autoplay', 'controls', 'loop', 'muted', 'selected', 'multiple',
  'action', 'method', 'for', 'htmlFor', 'target', 'rel', 'width', 'height', 'style',
  'min', 'max', 'step', 'pattern', 'accept', 'autocomplete', 'rows', 'cols', 'wrap',
  'tabindex', 'contenteditable', 'spellcheck', 'draggable', 'lang', 'dir', 'key', 'ref',
  'onClick', 'onChange', 'onSubmit', 'onInput', 'onKeyDown', 'onKeyUp',
]);

export const TAG_TO_AST_KIND: Record<string, ASTNodeKind> = {
  div: ASTNodeKind.Container,
  button: ASTNodeKind.Button,
  section: ASTNodeKind.Section,
  article: ASTNodeKind.Card,
  main: ASTNodeKind.Page,
  input: ASTNodeKind.Input,
  form: ASTNodeKind.Form,
  img: ASTNodeKind.Image,
  p: ASTNodeKind.Text,
};

/**
 * Resolve an element identifier to its canonical HTML tag or custom component name.
 */
export function resolveElementTag(identifier: string): string {
  if (KNOWN_ELEMENT_ABBREVIATIONS[identifier]) {
    return KNOWN_ELEMENT_ABBREVIATIONS[identifier];
  }
  return identifier;
}

export function isKnownElementAbbreviation(abbr: string): boolean {
  return abbr in KNOWN_ELEMENT_ABBREVIATIONS;
}

export function isKnownAttributeAbbreviation(abbr: string): boolean {
  return abbr in KNOWN_ATTRIBUTE_ABBREVIATIONS;
}

export function expandElementAbbreviation(abbr: string): string {
  return KNOWN_ELEMENT_ABBREVIATIONS[abbr] ?? abbr;
}

export function expandAttributeAbbreviation(abbr: string): string {
  return KNOWN_ATTRIBUTE_ABBREVIATIONS[abbr] ?? abbr;
}

/**
 * Resolve an attribute identifier to its canonical attribute name.
 */
export function resolveAttributeName(identifier: string): string {
  if (KNOWN_ATTRIBUTE_ABBREVIATIONS[identifier]) {
    return KNOWN_ATTRIBUTE_ABBREVIATIONS[identifier];
  }
  return identifier;
}

/**
 * Determine whether a command identifier inside an element represents an attribute.
 */
export function isAttributeCommand(identifier: string): boolean {
  if (KNOWN_ATTRIBUTE_ABBREVIATIONS[identifier]) {
    return true;
  }
  if (KNOWN_HTML_ATTRIBUTES.has(identifier)) {
    return true;
  }
  if (identifier.startsWith('data-') || identifier.startsWith('aria-') || identifier.startsWith('on')) {
    return true;
  }
  return false;
}

/**
 * Determine ASTNodeKind and custom name for a canonical tag name.
 */
export function getASTKindForTag(canonicalTag: string): { kind: ASTNodeKind; customName?: string } {
  const kind = TAG_TO_AST_KIND[canonicalTag];
  if (kind) {
    return { kind };
  }
  return { kind: ASTNodeKind.GenericComponent, customName: canonicalTag };
}
