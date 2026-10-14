/**
 * Canonical Leveonas Markup (LM) Abbreviation Dictionary & Utility
 *
 * LM abbreviation is applied only to identifiers that are explicitly part
 * of the LM compression vocabulary (known elements, attributes, framework syntax).
 *
 * For any identifier not in the canonical vocabulary, the original identifier
 * is returned unchanged to preserve semantic meaning in application code.
 */

export const CANONICAL_ELEMENT_MAPPINGS: Record<string, string> = {
  div: 'di',
  button: 'bo',
  section: 'so',
  article: 'al',
  aside: 'ad',
  header: 'he',
  footer: 'fe',
  nav: 'na',
  main: 'mi',
  span: 'sa',
  input: 'iu',
  label: 'le',
  table: 'tl',
  canvas: 'cu',
  form: 'fr',
};

export const CANONICAL_ATTRIBUTE_MAPPINGS: Record<string, string> = {
  class: 'cs',
  href: 'hr',
  id: 'id',
  src: 'sr',
  type: 'tp',
  placeholder: 'pe',
  name: 'nm',
  value: 'vu',
};

export const CANONICAL_FRAMEWORK_MAPPINGS: Record<string, string> = {
  onClick: 'oc',
  onChange: 'og',
  className: 'cm',
};

const ALL_CANONICAL_MAPPINGS: Record<string, string> = {
  ...CANONICAL_ELEMENT_MAPPINGS,
  ...CANONICAL_ATTRIBUTE_MAPPINGS,
  ...CANONICAL_FRAMEWORK_MAPPINGS,
};

/**
 * Abbreviate an element, attribute, or framework identifier if it belongs to the
 * canonical LM compression vocabulary.
 *
 * Returns the original identifier unchanged if not in the canonical vocabulary.
 */
export function abbreviate(identifier: string): string {
  if (!identifier) return '';
  if (identifier.length <= 2) return identifier;
  if (/^h[1-6]$/i.test(identifier)) return identifier;

  if (ALL_CANONICAL_MAPPINGS[identifier]) {
    return ALL_CANONICAL_MAPPINGS[identifier];
  }

  return identifier;
}

