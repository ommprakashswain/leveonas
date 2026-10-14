/**
 * Canonical CSS-LM v1 Property Abbreviations Dictionary
 *
 * Implements deterministic bidirectional property encoding and decoding.
 * Properties not in this dictionary remain uncompressed or map 1:1.
 */

export const CSS_PROPERTY_ABBREVIATIONS: Record<string, string> = {
  // Background
  bg: 'background',
  bgc: 'background-color',
  bgi: 'background-image',
  bgp: 'background-position',
  bgr: 'background-repeat',
  bgs: 'background-size',
  bga: 'background-attachment',
  bgcl: 'background-clip',
  bgor: 'background-origin',

  // Typography & Text
  c: 'color',
  fs: 'font-size',
  fw: 'font-weight',
  ff: 'font-family',
  fst: 'font-style',
  fv: 'font-variant',
  lh: 'line-height',
  ta: 'text-align',
  td: 'text-decoration',
  tdc: 'text-decoration-color',
  tdl: 'text-decoration-line',
  tds: 'text-decoration-style',
  tt: 'text-transform',
  ti: 'text-indent',
  to: 'text-overflow',
  ts: 'transition',
  tsh: 'text-shadow',
  ls: 'letter-spacing',
  ws: 'white-space',
  wb: 'word-break',
  ww: 'word-wrap',
  va: 'vertical-align',

  // Spacing & Box Model
  p: 'padding',
  pt: 'padding-top',
  pr: 'padding-right',
  pb: 'padding-bottom',
  pl: 'padding-left',
  px: 'padding-inline',
  py: 'padding-block',

  m: 'margin',
  mt: 'margin-top',
  mr: 'margin-right',
  mb: 'margin-bottom',
  ml: 'margin-left',
  mx: 'margin-inline',
  my: 'margin-block',

  w: 'width',
  h: 'height',
  minw: 'min-width',
  maxw: 'max-width',
  minh: 'min-height',
  maxh: 'max-height',
  bxz: 'box-sizing',
  bxs: 'box-shadow',

  // Display & Layout
  d: 'display',
  pos: 'position',
  t: 'top',
  r: 'right',
  b: 'bottom',
  l: 'left',
  z: 'z-index',
  zi: 'z-index',
  fl: 'float',
  cl: 'clear',
  ov: 'overflow',
  ovx: 'overflow-x',
  ovy: 'overflow-y',
  vis: 'visibility',
  op: 'opacity',

  // Flexbox
  fx: 'flex',
  fg: 'flex-grow',
  fsr: 'flex-shrink',
  fb: 'flex-basis',
  fd: 'flex-direction',
  fwr: 'flex-wrap',
  jc: 'justify-content',
  ji: 'justify-items',
  js: 'justify-self',
  ai: 'align-items',
  ac: 'align-content',
  as: 'align-self',
  ord: 'order',
  g: 'gap',
  rg: 'row-gap',
  cg: 'column-gap',

  // Grid
  gtc: 'grid-template-columns',
  gtr: 'grid-template-rows',
  gta: 'grid-template-areas',
  ga: 'grid-area',
  gc: 'grid-column',
  gcs: 'grid-column-start',
  gce: 'grid-column-end',
  gr: 'grid-row',
  grs: 'grid-row-start',
  gre: 'grid-row-end',
  gac: 'grid-auto-columns',
  gar: 'grid-auto-rows',
  gaf: 'grid-auto-flow',

  // Borders
  bd: 'border',
  br: 'border-radius',
  bc: 'border-color',
  bw: 'border-width',
  bs: 'border-style',
  bdt: 'border-top',
  bdr: 'border-right',
  bdb: 'border-bottom',
  bdl: 'border-left',
  bdtc: 'border-top-color',
  bdrc: 'border-right-color',
  bdbc: 'border-bottom-color',
  bdlc: 'border-left-color',
  bdtw: 'border-top-width',
  bdrw: 'border-right-width',
  bdbw: 'border-bottom-width',
  bdlw: 'border-left-width',
  bdts: 'border-top-style',
  bdrs: 'border-right-style',
  bdbs: 'border-bottom-style',
  bdls: 'border-left-style',
  brtl: 'border-top-left-radius',
  brtr: 'border-top-right-radius',
  brbr: 'border-bottom-right-radius',
  brbl: 'border-bottom-left-radius',
  ol: 'outline',
  olc: 'outline-color',
  olw: 'outline-width',
  ols: 'outline-style',
  olo: 'outline-offset',

  // Transform & Animation
  tr: 'transform',
  tro: 'transform-origin',
  trs: 'transform-style',
  an: 'animation',
  and: 'animation-duration',
  anm: 'animation-name',
  ant: 'animation-timing-function',
  andel: 'animation-delay',
  anic: 'animation-iteration-count',
  andir: 'animation-direction',
  anfm: 'animation-fill-mode',
  anps: 'animation-play-state',
  tsd: 'transition-duration',
  tsp: 'transition-property',
  tst: 'transition-timing-function',
  tsdel: 'transition-delay',

  // UI & Interaction
  cur: 'cursor',
  pe: 'pointer-events',
  us: 'user-select',
  rsz: 'resize',
  app: 'appearance',
  ct: 'content',
  filt: 'filter',
  bdf: 'backdrop-filter',
  acc: 'accent-color',
  cbr: 'caret-color',
};

// Inverted map for encoding (canonical CSS property -> shortest abbreviation)
export const CANONICAL_TO_LM_CSS_PROPERTY: Record<string, string> = {};
for (const [abbr, prop] of Object.entries(CSS_PROPERTY_ABBREVIATIONS)) {
  // If property not yet mapped, or if abbr is shorter than existing, map it
  if (!CANONICAL_TO_LM_CSS_PROPERTY[prop] || abbr.length < CANONICAL_TO_LM_CSS_PROPERTY[prop].length) {
    CANONICAL_TO_LM_CSS_PROPERTY[prop] = abbr;
  }
}

/**
 * Encodes a standard CSS property name into its canonical CSS-LM abbreviation.
 * If no abbreviation exists or if the property is a custom CSS variable (--*),
 * returns the original property string.
 */
export function encodeCSSProperty(property: string): string {
  const normalized = property.trim().toLowerCase();
  if (normalized.startsWith('--')) {
    return property.trim();
  }
  return CANONICAL_TO_LM_CSS_PROPERTY[normalized] || property.trim();
}

/**
 * Decodes a CSS-LM abbreviation or property identifier into standard canonical CSS property name.
 * If the identifier is not in the abbreviation dictionary, returns the normalized property string.
 */
export function decodeCSSProperty(lmProperty: string): string {
  const trimmed = lmProperty.trim();
  if (trimmed.startsWith('--')) {
    return trimmed;
  }
  const lower = trimmed.toLowerCase();
  return CSS_PROPERTY_ABBREVIATIONS[lower] || trimmed;
}
