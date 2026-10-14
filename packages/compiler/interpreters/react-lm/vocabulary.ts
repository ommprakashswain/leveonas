/**
 * Canonical React-LM Vocabulary, Keyword, Element, and Prop Mappings
 *
 * Implements token-efficient React/JSX representations while maintaining
 * deterministic reconciliation and lowering to Leveonas DOM & JS infrastructure.
 */

import { ASTNodeKind } from '../../ast/types';

export const REACT_ELEMENT_ABBREVIATIONS: Record<string, string> = {
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
  in: 'input',
  iu: 'input',
  le: 'label',
  tl: 'table',
  cu: 'canvas',
  fo: 'form',
  fr: 'form',
  im: 'img',
  pa: 'p',
  an: 'a',
  li: 'li',
  ul: 'ul',
  ol: 'ol',
};

export const REACT_PROP_ABBREVIATIONS: Record<string, string> = {
  cs: 'className',
  cm: 'className',
  id: 'id',
  hr: 'href',
  sr: 'src',
  tp: 'type',
  pe: 'placeholder',
  nm: 'name',
  vu: 'value',
  dis: 'disabled',
  ky: 'key',
  oc: 'onClick',
  og: 'onChange',
  os: 'onSubmit',
  oi: 'onInput',
  okd: 'onKeyDown',
  oku: 'onKeyUp',
  omd: 'onMouseDown',
  omu: 'onMouseUp',
  ome: 'onMouseEnter',
  oml: 'onMouseLeave',
  of: 'onFocus',
  ob: 'onBlur',
};

export const KNOWN_REACT_EVENTS = new Set([
  'onClick',
  'onChange',
  'onSubmit',
  'onInput',
  'onKeyDown',
  'onKeyUp',
  'onKeyPress',
  'onMouseDown',
  'onMouseUp',
  'onMouseMove',
  'onMouseEnter',
  'onMouseLeave',
  'onFocus',
  'onBlur',
  'onScroll',
  'onReset',
  'onTouchStart',
  'onTouchEnd',
  'onTouchMove',
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
  span: ASTNodeKind.Text,
  h1: ASTNodeKind.Text,
  h2: ASTNodeKind.Text,
  h3: ASTNodeKind.Text,
  h4: ASTNodeKind.Text,
  h5: ASTNodeKind.Text,
  h6: ASTNodeKind.Text,
  header: ASTNodeKind.Container,
  footer: ASTNodeKind.Container,
  nav: ASTNodeKind.Container,
  aside: ASTNodeKind.Container,
  ul: ASTNodeKind.Container,
  ol: ASTNodeKind.Container,
  li: ASTNodeKind.Container,
};

export function resolveReactElementTag(identifier: string): string {
  if (REACT_ELEMENT_ABBREVIATIONS[identifier]) {
    return REACT_ELEMENT_ABBREVIATIONS[identifier];
  }
  return identifier;
}

export function isIntrinsicTag(name: string): boolean {
  if (REACT_ELEMENT_ABBREVIATIONS[name]) return true;
  // Intrinsic HTML tags start with lowercase, Custom React Components start with uppercase
  return /^[a-z][a-z0-9_-]*$/.test(name);
}

export function isCustomComponentName(name: string): boolean {
  return /^[A-Z][a-zA-Z0-9_$]*$/.test(name);
}

export function resolveReactPropName(propName: string): string {
  if (REACT_PROP_ABBREVIATIONS[propName]) {
    return REACT_PROP_ABBREVIATIONS[propName];
  }
  return propName;
}

export function isReactEventProp(propName: string): boolean {
  const resolved = resolveReactPropName(propName);
  return KNOWN_REACT_EVENTS.has(resolved) || /^on[A-Z]/.test(resolved);
}

export function getDOMEventNameFromReactEvent(reactEventName: string): string {
  const resolved = resolveReactPropName(reactEventName);
  return resolved.replace(/^on/, '').toLowerCase();
}
