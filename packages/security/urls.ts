/**
 * Leveonas Centralized URL Security & Protocol Sanitization
 *
 * Enforces strict protocol validation and prevents script injection via:
 * - javascript:
 * - vbscript:
 * - data: (unless explicitly allowed as a safe image)
 * - obfuscation with whitespace, control characters, or entity encodings
 */

export interface UrlValidationOptions {
  allowDataImages?: boolean;
  allowRelative?: boolean;
  allowedProtocols?: string[];
}

const DEFAULT_ALLOWED_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'];

/**
 * Strips ASCII control characters and internal whitespace that attackers use to bypass protocol checks.
 * (e.g., `java\0script:`, `java\tscript:`, `java\n\rscript:`, `&#x6A;avascript:`)
 */
export function normalizeUrlString(url: string): string {
  if (typeof url !== 'string') return '';
  // Strip control chars (\x00-\x1F, \x7F-\x9F)
  let normalized = url.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
  // Decode common HTML character references if present (e.g. &#x6A; -> j, &colon; -> :)
  normalized = normalized
    .replace(/&#x([0-9a-fA-F]+);?/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#([0-9]+);?/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&colon;/gi, ':')
    .replace(/&tab;/gi, '')
    .replace(/&newline;/gi, '');

  return normalized.trim();
}

/**
 * Checks if a URL string uses a dangerous protocol or obfuscated script scheme.
 */
export function isDangerousProtocol(url: string): boolean {
  const clean = normalizeUrlString(url).toLowerCase();
  // Strip all internal whitespace before testing protocol
  const compact = clean.replace(/\s+/g, '');

  if (compact.startsWith('javascript:')) return true;
  if (compact.startsWith('vbscript:')) return true;
  if (compact.startsWith('file:')) return true;
  if (compact.startsWith('about:')) return true;

  return false;
}

/**
 * Validates a URL against allowed protocols and security constraints.
 */
export function isValidUrl(url: string, options: UrlValidationOptions = {}): boolean {
  if (typeof url !== 'string') return false;
  const clean = normalizeUrlString(url);
  if (!clean) return true; // Empty URLs are safe (e.g. href="")

  if (isDangerousProtocol(clean)) {
    return false;
  }

  const compact = clean.replace(/\s+/g, '').toLowerCase();

  // Handle data: URLs
  if (compact.startsWith('data:')) {
    if (options.allowDataImages) {
      // Only permit safe image MIME types
      return /^data:image\/(png|jpe?g|gif|webp|svg\+xml);base64,[A-Za-z0-9+/=]+$/i.test(clean);
    }
    return false;
  }

  // Relative URLs, hash anchors, and query strings
  if (clean.startsWith('/') || clean.startsWith('./') || clean.startsWith('../') || clean.startsWith('#') || clean.startsWith('?')) {
    return options.allowRelative !== false;
  }

  // Absolute protocol parsing
  const allowed = options.allowedProtocols || DEFAULT_ALLOWED_PROTOCOLS;
  try {
    const parsed = new URL(clean, 'https://leveonas.local');
    return allowed.includes(parsed.protocol.toLowerCase());
  } catch {
    // If URL constructor fails on a relative or unknown string, test against scheme pattern
    const match = clean.match(/^([a-zA-Z0-9+.-]+):/);
    if (!match) {
      return options.allowRelative !== false;
    }
    const scheme = `${match[1].toLowerCase()}:`;
    return allowed.includes(scheme);
  }
}

/**
 * Sanitizes a URL, returning a safe fallback (default: 'about:blank' or empty string) if invalid.
 */
export function sanitizeUrl(url: string, fallback: string = '', options: UrlValidationOptions = {}): string {
  if (isValidUrl(url, options)) {
    return url;
  }
  return fallback;
}

/**
 * Sanitizes CSS property strings against dangerous url(), expression(), -moz-binding, and behavior values.
 */
export function sanitizeCssText(css: string): string {
  if (typeof css !== 'string') return '';
  let sanitized = css;

  // Remove IE expressions
  sanitized = sanitized.replace(/expression\s*\([^)]*\)/gi, 'none');
  // Remove behavior/HTC bindings
  sanitized = sanitized.replace(/behavior\s*:[^;}]*/gi, '');
  // Remove -moz-binding
  sanitized = sanitized.replace(/-moz-binding\s*:[^;}]*/gi, '');

  // Sanitize url(...) tokens
  sanitized = sanitized.replace(/url\s*\(\s*(['"]?)(.*?)\1\s*\)/gi, (fullMatch, quote, rawUrl) => {
    const normalized = normalizeUrlString(rawUrl);
    if (isDangerousProtocol(normalized)) {
      return `url(${quote}about:blank${quote})`;
    }
    return fullMatch;
  });

  return sanitized;
}
