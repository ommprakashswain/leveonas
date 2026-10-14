import { ASTNodeKind } from '../../ast/types';

export const SVELTE_ELEMENT_ABBREVIATIONS: Record<string, string> = {
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

export const SVELTE_PROP_ABBREVIATIONS: Record<string, string> = {
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
  // Svelte bindings
  bv: 'bind:value',
  bc: 'bind:checked',
  bindValue: 'bind:value',
  bindChecked: 'bind:checked',
  // Svelte events
  oc: 'on:click',
  og: 'on:change',
  os: 'on:submit',
  oi: 'on:input',
  okd: 'on:keydown',
  oku: 'on:keyup',
  omd: 'on:mousedown',
  omu: 'on:mouseup',
  ome: 'on:mouseenter',
  oml: 'on:mouseleave',
  of: 'on:focus',
  ob: 'on:blur',
};

export const KNOWN_SVELTE_EVENTS = new Set([
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
  // Svelte on: event syntax
  'on:click',
  'on:input',
  'on:change',
  'on:submit',
  'on:keydown',
  'on:keyup',
  'on:keypress',
  'on:mousedown',
  'on:mouseup',
  'on:mousemove',
  'on:mouseenter',
  'on:mouseleave',
  'on:focus',
  'on:blur',
  // CamelCase aliases
  'onClick',
  'onInput',
  'onChange',
  'onSubmit',
  'onKeyDown',
  'onKeyUp',
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

export function resolveSvelteElementTag(identifier: string): string {
  if (SVELTE_ELEMENT_ABBREVIATIONS[identifier]) {
    return SVELTE_ELEMENT_ABBREVIATIONS[identifier];
  }
  return identifier;
}

export function isIntrinsicTag(name: string): boolean {
  if (SVELTE_ELEMENT_ABBREVIATIONS[name]) return true;
  return /^[a-z][a-z0-9_-]*$/.test(name);
}

export function isCustomComponentName(name: string): boolean {
  return /^[A-Z][a-zA-Z0-9_$]*$/.test(name);
}

export function resolveSveltePropName(propName: string): string {
  if (SVELTE_PROP_ABBREVIATIONS[propName]) {
    return SVELTE_PROP_ABBREVIATIONS[propName];
  }
  if (propName.startsWith('on:') || propName.startsWith('bind:')) {
    return propName;
  }
  return propName;
}

export function isSvelteEventProp(propName: string): boolean {
  if (propName.startsWith('on:') || propName.startsWith('@')) return true;
  const resolved = resolveSveltePropName(propName);
  return KNOWN_SVELTE_EVENTS.has(resolved) || /^on[A-Z]/.test(resolved) || resolved.startsWith('on:');
}

export function getDOMEventNameFromSvelteEvent(svelteEventName: string): string {
  let clean = svelteEventName.replace(/^(?:on:|@)/, '');
  if (SVELTE_PROP_ABBREVIATIONS[clean]) {
    clean = SVELTE_PROP_ABBREVIATIONS[clean].replace(/^on:/, '');
  }
  if (/^on[A-Z]/.test(clean)) {
    clean = clean.replace(/^on/, '');
  }
  return clean.toLowerCase();
}

export function isSvelteBindingProp(propName: string): boolean {
  const resolved = resolveSveltePropName(propName);
  return resolved.startsWith('bind:') || propName.startsWith('bind:') || propName === 'bv' || propName === 'bc';
}

export function getBindingPropertyName(propName: string): 'value' | 'checked' | 'group' {
  const resolved = resolveSveltePropName(propName);
  if (resolved === 'bind:checked' || propName === 'bc' || propName === 'bindChecked') return 'checked';
  if (resolved === 'bind:group') return 'group';
  return 'value';
}
