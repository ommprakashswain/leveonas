/**
 * JavaScript-LM Canonical Vocabulary & Helper Abbreviation Map
 *
 * Provides deterministic compression and expansion for common JS/DOM interaction primitives.
 */

export const JS_KEYWORD_ABBREVIATIONS: Record<string, string> = {
  c: 'const',
  l: 'let',
  v: 'var',
  fn: 'function',
  ret: 'return',
  evt: 'event',
  cel: 'document.createElement',
};

export const JS_DOM_ABBREVIATIONS: Record<string, string> = {
  // Selectors
  qs: 'document.querySelector',
  qsa: 'document.querySelectorAll',
  gid: 'document.getElementById',

  // Event Listeners
  on: 'event',
  evt: 'event',
  off: 'removeEventListener',

  // Timers
  st: 'setTimeout',
  si: 'setInterval',
  ct: 'clearTimeout',
  ci: 'clearInterval',

  // DOM Mutations
  setText: 'setText',
  setHTML: 'setHTML',
  setAttr: 'setAttribute',
  removeAttr: 'removeAttribute',
  addClass: 'classList.add',
  removeClass: 'classList.remove',
  toggleClass: 'classList.toggle',
  append: 'appendChild',
  remove: 'remove',
  createEl: 'document.createElement',
  cel: 'document.createElement',
};

export const SUPPORTED_EVENTS = new Set([
  'click',
  'dblclick',
  'input',
  'change',
  'submit',
  'reset',
  'focus',
  'blur',
  'keydown',
  'keyup',
  'keypress',
  'mouseenter',
  'mouseleave',
  'mouseover',
  'mouseout',
  'mousedown',
  'mouseup',
  'mousemove',
  'touchstart',
  'touchend',
  'touchmove',
  'scroll',
  'resize',
  'load',
  'unload',
]);

/**
 * Decode a JS-LM DOM/utility abbreviation to standard identifier or helper name.
 */
export function decodeJSAbbreviation(abbr: string): string {
  const trimmed = abbr.trim();
  if (JS_DOM_ABBREVIATIONS[trimmed]) return JS_DOM_ABBREVIATIONS[trimmed];
  if (JS_KEYWORD_ABBREVIATIONS[trimmed]) return JS_KEYWORD_ABBREVIATIONS[trimmed];
  return trimmed;
}

/**
 * Encode a standard JS helper name to its canonical JS-LM abbreviation.
 */
export function encodeJSAbbreviation(fullName: string): string {
  const trimmed = fullName.trim();
  for (const [abbr, name] of Object.entries(JS_DOM_ABBREVIATIONS)) {
    if (name === trimmed) return abbr;
  }
  for (const [abbr, name] of Object.entries(JS_KEYWORD_ABBREVIATIONS)) {
    if (name === trimmed) return abbr;
  }
  return trimmed;
}

/**
 * Check whether an event name is a supported standard DOM event.
 */
export function isValidDOMEvent(eventName: string): boolean {
  return SUPPORTED_EVENTS.has(eventName.toLowerCase().replace(/^on/, ''));
}
