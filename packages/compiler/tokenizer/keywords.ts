export const KEYWORDS = new Set([
  'true',
  'false',
  'null',
]);

export function isKeyword(value: string): boolean {
  return KEYWORDS.has(value);
}

export function isBoolean(value: string): boolean {
  return value === 'true' || value === 'false';
}
