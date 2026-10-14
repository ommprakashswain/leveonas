/**
 * Leveonas Attribute Security & Normalization
 *
 * Prevents DOM-based XSS, inline handler execution, and unauthorized navigation
 * through HTML attribute inspection and sanitization.
 */

import { isValidUrl, sanitizeCssText } from './urls';

/**
 * Attributes that expect URL values and require strict scheme validation.
 */
export const URL_ATTRIBUTES = new Set([
  'href',
  'src',
  'action',
  'formaction',
  'poster',
  'data',
  'codebase',
  'cite',
  'background',
]);

/**
 * Disallowed or high-risk attributes that can escape runtime boundaries.
 */
export const FORBIDDEN_ATTRIBUTES = new Set([
  'srcdoc',
  'manifest',
  'formaction',
]);

/**
 * Normalizes an attribute name: converts to lower case and strips non-alphanumeric chars.
 */
export function normalizeAttributeName(name: string): string {
  if (typeof name !== 'string') return '';
  return name.replace(/[\u0000-\u001F\u007F-\u009F\s]/g, '').toLowerCase().trim();
}

/**
 * Validates whether an attribute name and value are safe to apply to a DOM element.
 */
export function isAttributeSafe(name: string, value: unknown): boolean {
  if (typeof name !== 'string') return false;
  const lowerName = normalizeAttributeName(name);

  if (!lowerName) return false;

  // 1. Block all inline event handlers (e.g. onclick, onload, onerror, onmouseover, ONCLICK, on\0load)
  if (lowerName.startsWith('on')) {
    return false;
  }

  // 2. Block forbidden attributes
  if (FORBIDDEN_ATTRIBUTES.has(lowerName)) {
    return false;
  }

  const strVal = String(value ?? '');

  // 3. Validate URL attributes against dangerous protocols
  if (URL_ATTRIBUTES.has(lowerName)) {
    if (!isValidUrl(strVal, { allowDataImages: lowerName === 'src' || lowerName === 'poster' })) {
      return false;
    }
  }

  // 4. Validate style attributes/properties against CSS injection
  if (lowerName === 'style' || lowerName.startsWith('style.')) {
    const sanitized = sanitizeCssText(strVal);
    // If the sanitized version stripped dangerous url/expression/behavior tokens, check if modified dangerously
    if (/javascript:|expression|behavior|-moz-binding/i.test(strVal)) {
      return false;
    }
  }

  return true;
}

/**
 * Sanitizes a dictionary of attributes, removing all unsafe keys and neutralizing unsafe values.
 */
export function sanitizeAttributes(attrs: Record<string, unknown>): Record<string, string> {
  const result: Record<string, string> = {};
  if (!attrs || typeof attrs !== 'object') return result;

  for (const [key, value] of Object.entries(attrs)) {
    if (isAttributeSafe(key, value)) {
      const strVal = String(value ?? '');
      if (key.toLowerCase() === 'style') {
        result[key] = sanitizeCssText(strVal);
      } else {
        result[key] = strVal;
      }
    }
  }

  return result;
}
