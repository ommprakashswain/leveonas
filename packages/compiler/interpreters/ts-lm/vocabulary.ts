/**
 * Canonical TS-LM Vocabulary and Keyword/Type Mapping
 *
 * Implements token-efficient TypeScript representations while preserving
 * standard syntax transparency and deterministic expansion.
 */

export const TS_TYPE_ABBREVIATIONS: Record<string, string> = {
  num: 'number',
  str: 'string',
  bool: 'boolean',
  obj: 'object',
  sym: 'symbol',
  arr: 'Array',
  unk: 'unknown',
  undef: 'undefined',
};

export const TS_KEYWORD_ABBREVIATIONS: Record<string, string> = {
  iface: 'interface',
  tp: 'type',
  fn: 'function',
  func: 'function',
  cls: 'class',
  imp: 'import',
  exp: 'export',
};

export const TS_DOM_ABBREVIATIONS: Record<string, string> = {
  qs: 'document.querySelector',
  qsa: 'document.querySelectorAll',
  gid: 'document.getElementById',
  st: 'setTimeout',
  si: 'setInterval',
  on: '__leveonas_runtime__.on',
  setText: '__leveonas_runtime__.setText',
  setHTML: '__leveonas_runtime__.setHTML',
  addClass: '__leveonas_runtime__.addClass',
  removeClass: '__leveonas_runtime__.removeClass',
  toggleClass: '__leveonas_runtime__.toggleClass',
};

export const KNOWN_DOM_EVENTS = new Set([
  'click',
  'dblclick',
  'mousedown',
  'mouseup',
  'mousemove',
  'mouseenter',
  'mouseleave',
  'keydown',
  'keyup',
  'keypress',
  'input',
  'change',
  'submit',
  'focus',
  'blur',
  'reset',
  'scroll',
  'resize',
  'touchstart',
  'touchend',
  'touchmove',
]);

/**
 * Expands shorthand type abbreviations (e.g. `num` -> `number`, `str` -> `string`).
 */
export function expandTSTypeAbbreviation(typeStr: string): string {
  if (!typeStr) return typeStr;
  let expanded = typeStr;

  for (const [abbr, full] of Object.entries(TS_TYPE_ABBREVIATIONS)) {
    const regex = new RegExp(`\\b${abbr}\\b`, 'g');
    expanded = expanded.replace(regex, full);
  }

  return expanded;
}

/**
 * Expands TS-LM abbreviations (keywords, types, DOM helpers) in code while
 * avoiding replacement inside string literals or identifiers.
 */
export function decodeTSLM(code: string): string {
  if (!code) return '';

  // Replace leading keywords at declaration boundaries
  let result = code;

  // Keyword expansions
  result = result.replace(/\biface\s+/g, 'interface ');
  result = result.replace(/\btp\s+([A-Za-z_$])/g, 'type $1');
  result = result.replace(/\b(?:fn|func)\s+/g, 'function ');
  result = result.replace(/\bcls\s+/g, 'class ');
  result = result.replace(/\bimp\s+/g, 'import ');
  result = result.replace(/\bexp\s+/g, 'export ');

  // Type expansions in type positions (: num, : str, <num>, Array<num>, num[], etc.)
  result = result.replace(/(:\s*|\b(?:Array|Promise|Record|Map|Set)<\s*|\b(?:type|interface)\s+[A-Za-z_$][A-Za-z0-9_$]*\s*=\s*)([A-Za-z0-9_$\s|<>&[\],]+)/g, (match, prefix, typeBody) => {
    let expandedBody = typeBody;
    for (const [abbr, full] of Object.entries(TS_TYPE_ABBREVIATIONS)) {
      expandedBody = expandedBody.replace(new RegExp(`\\b${abbr}\\b`, 'g'), full);
    }
    return `${prefix}${expandedBody}`;
  });

  return result;
}

/**
 * Check whether an event name is a supported DOM event.
 */
export function isValidDOMEvent(eventName: string): boolean {
  const clean = eventName.toLowerCase().replace(/^on/, '');
  return KNOWN_DOM_EVENTS.has(clean);
}
