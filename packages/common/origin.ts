/**
 * Canonical origin and endpoint configuration for Leveonas.
 *
 * Official deployment origin: https://leveonas.ainot.site/
 */

export const PRODUCTION_LEVEONAS_ORIGIN = 'https://leveonas.ainot.site';

export interface OriginConfig {
  baseUrl?: string;
  apiUrl?: string;
  origin?: string;
}

/**
 * Returns the resolved canonical base origin for Leveonas services.
 * Priority:
 * 1. Explicit override passed as argument
 * 2. window.LEVEONAS_ORIGIN or window.LEVEONAS_BASE_URL (if in browser)
 * 3. process.env.NEXT_PUBLIC_LEVEONAS_ORIGIN or process.env.LEVEONAS_ORIGIN
 * 4. Localhost / local development detection (if running locally on 127.0.0.1 or localhost)
 * 5. Production fallback: https://leveonas.ainot.site
 */
export function getLeveonasOrigin(customOrigin?: string): string {
  if (customOrigin && typeof customOrigin === 'string' && customOrigin.trim()) {
    return customOrigin.trim().replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined') {
    const win = window as any;
    if (win.LEVEONAS_ORIGIN && typeof win.LEVEONAS_ORIGIN === 'string') {
      return win.LEVEONAS_ORIGIN.trim().replace(/\/+$/, '');
    }
    if (win.LEVEONAS_BASE_URL && typeof win.LEVEONAS_BASE_URL === 'string') {
      return win.LEVEONAS_BASE_URL.trim().replace(/\/+$/, '');
    }
    // Support local development when host app is on localhost or 127.0.0.1
    if (win.location && win.location.origin) {
      const hostname = win.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return win.location.origin.replace(/\/+$/, '');
      }
    }
  }

  if (typeof process !== 'undefined' && process.env) {
    const envOrigin =
      process.env.NEXT_PUBLIC_LEVEONAS_ORIGIN ||
      process.env.LEVEONAS_ORIGIN ||
      process.env.NEXT_PUBLIC_LEVEONAS_BASE_URL;
    if (envOrigin && typeof envOrigin === 'string' && envOrigin.trim()) {
      return envOrigin.trim().replace(/\/+$/, '');
    }
  }

  // Official production default
  return PRODUCTION_LEVEONAS_ORIGIN;
}

/**
 * Resolves the full URL for the Leveonas generation API endpoint.
 * Default path: /api/generate
 */
export function getLeveonasApiUrl(endpoint: string = '/api/generate', customOrigin?: string): string {
  if (/^https?:\/\//i.test(endpoint)) {
    return endpoint;
  }
  const origin = getLeveonasOrigin(customOrigin);
  const cleanPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${origin}${cleanPath}`;
}

/**
 * Resolves the full URL for the iframe runtime bundle script.
 * Default: https://leveonas.ainot.site/leveonas-runtime.js
 */
export function getLeveonasRuntimeScriptUrl(customOrigin?: string): string {
  const origin = getLeveonasOrigin(customOrigin);
  return `${origin}/leveonas-runtime.js`;
}

/**
 * Resolves the full URL for the client SDK bundle script.
 * Default: https://leveonas.ainot.site/leveonas.js
 */
export function getLeveonasClientScriptUrl(customOrigin?: string): string {
  const origin = getLeveonasOrigin(customOrigin);
  return `${origin}/leveonas.js`;
}
