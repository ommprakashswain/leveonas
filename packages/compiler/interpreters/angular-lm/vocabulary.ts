export const ANGULAR_ELEMENT_ABBREVIATIONS: Record<string, string> = {
  di: 'div',
  bo: 'button',
  bu: 'button',
  pa: 'p',
  p: 'p',
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
  an: 'a',
  li: 'li',
  ul: 'ul',
  ol: 'ol',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
};

export const ANGULAR_PROP_ABBREVIATIONS: Record<string, string> = {
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
};

export const KNOWN_ANGULAR_EVENTS = new Set([
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
]);

export function resolveAngularElementTag(name: string): { tag: string; isIntrinsic: boolean } {
  const lower = name.toLowerCase();
  if (ANGULAR_ELEMENT_ABBREVIATIONS[lower]) {
    return { tag: ANGULAR_ELEMENT_ABBREVIATIONS[lower], isIntrinsic: true };
  }
  if (isIntrinsicTag(lower)) {
    return { tag: lower, isIntrinsic: true };
  }
  return { tag: name, isIntrinsic: false };
}

export function isIntrinsicTag(tag: string): boolean {
  const intrinsicTags = new Set([
    'div', 'span', 'p', 'a', 'button', 'input', 'textarea', 'select', 'option',
    'form', 'label', 'fieldset', 'legend', 'header', 'footer', 'nav', 'main',
    'section', 'article', 'aside', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'thead', 'tbody', 'tfoot',
    'img', 'svg', 'canvas', 'video', 'audio', 'iframe', 'hr', 'br', 'pre', 'code',
    'b', 'strong', 'i', 'em', 'small', 'ng-content',
  ]);
  return intrinsicTags.has(tag.toLowerCase());
}

export function isCustomComponentName(name: string): boolean {
  if (!name || name.length === 0) return false;
  const first = name.charAt(0);
  return first >= 'A' && first <= 'Z';
}

export function extractAngularInterpolations(text: string): string[] {
  const deps: string[] = [];
  // Match both {{expr}} and {expr}
  const doubleMatches = text.match(/\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$.]*)\s*\}\}/g);
  if (doubleMatches) {
    for (const m of doubleMatches) {
      const dep = m.replace(/\{\{\s*/, '').replace(/\s*\}\}/, '').trim();
      if (dep && !deps.includes(dep)) deps.push(dep);
    }
  }
  const singleMatches = text.match(/\{([a-zA-Z_$][a-zA-Z0-9_$.]*)\}/g);
  if (singleMatches) {
    for (const m of singleMatches) {
      const dep = m.replace(/^\{/, '').replace(/\}$/, '').trim();
      if (dep && !deps.includes(dep)) deps.push(dep);
    }
  }
  return deps;
}

export function normalizeAngularInterpolation(text: string): string {
  // Convert {{var}} into {var} for uniform Common UI IR template processing
  return text.replace(/\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$.]*)\s*\}\}/g, '{$1}');
}
