import { ASTNodeKind } from '../../ast/types';

export const VUE_ELEMENT_ABBREVIATIONS: Record<string, string> = {
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

export const VUE_PROP_ABBREVIATIONS: Record<string, string> = {
  cs: 'className',
  cm: 'className',
  class: 'className',
  id: 'id',
  hr: 'href',
  sr: 'src',
  tp: 'type',
  pe: 'placeholder',
  nm: 'name',
  vu: 'value',
  dis: 'disabled',
  ky: 'key',
  key: 'key',
  vm: 'v-model',
  bindModel: 'v-model',
  model: 'v-model',
  show: 'v-show',
  vShow: 'v-show',
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

export const KNOWN_VUE_EVENTS = new Set([
  'click',
  'input',
  'change',
  'submit',
  'keydown',
  'keyup',
  'keypress',
  'mousedown',
  'mouseup',
  'mousemove',
  'mouseenter',
  'mouseleave',
  'focus',
  'blur',
  'scroll',
  'reset',
  'touchstart',
  'touchend',
  'touchmove',
  // React/JSX style camelCase aliases
  'onClick',
  'onInput',
  'onChange',
  'onSubmit',
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

export function resolveVueElementTag(identifier: string): string {
  if (VUE_ELEMENT_ABBREVIATIONS[identifier]) {
    return VUE_ELEMENT_ABBREVIATIONS[identifier];
  }
  return identifier;
}

export function isIntrinsicTag(name: string): boolean {
  if (VUE_ELEMENT_ABBREVIATIONS[name]) return true;
  return /^[a-z][a-z0-9_-]*$/.test(name);
}

export function isCustomComponentName(name: string): boolean {
  return /^[A-Z][a-zA-Z0-9_$]*$/.test(name);
}

export function resolveVuePropName(propName: string): string {
  if (VUE_PROP_ABBREVIATIONS[propName]) {
    return VUE_PROP_ABBREVIATIONS[propName];
  }
  if (propName.startsWith('@')) {
    return propName.slice(1);
  }
  if (propName.startsWith(':') || propName.startsWith('v-bind:')) {
    return propName.replace(/^(?::|v-bind:)/, '');
  }
  return propName;
}

export function isVueEventProp(propName: string): boolean {
  if (propName.startsWith('@') || propName.startsWith('v-on:')) return true;
  const resolved = resolveVuePropName(propName);
  return KNOWN_VUE_EVENTS.has(resolved) || /^on[A-Z]/.test(resolved);
}

export function getDOMEventNameFromVueEvent(vueEventName: string): string {
  let clean = vueEventName.replace(/^(?:@|v-on:)/, '');
  if (VUE_PROP_ABBREVIATIONS[clean]) {
    clean = VUE_PROP_ABBREVIATIONS[clean];
  }
  if (/^on[A-Z]/.test(clean)) {
    clean = clean.replace(/^on/, '');
  }
  return clean.toLowerCase();
}

export function isVueModelProp(propName: string): boolean {
  const resolved = resolveVuePropName(propName);
  return resolved === 'v-model' || propName === 'v-model' || propName === 'bindModel' || propName === 'model' || propName === 'vm';
}

export function isVueShowProp(propName: string): boolean {
  const resolved = resolveVuePropName(propName);
  return resolved === 'v-show' || propName === 'v-show' || propName === 'vShow' || propName === 'show';
}
