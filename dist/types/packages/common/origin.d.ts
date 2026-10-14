/**
 * Canonical origin and endpoint configuration for Leveonas.
 *
 * Official deployment origin: https://leveonas.ainot.site/
 */
export declare const PRODUCTION_LEVEONAS_ORIGIN = "https://leveonas.ainot.site";
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
export declare function getLeveonasOrigin(customOrigin?: string): string;
/**
 * Resolves the full URL for the Leveonas generation API endpoint.
 * Default path: /api/generate
 */
export declare function getLeveonasApiUrl(endpoint?: string, customOrigin?: string): string;
/**
 * Resolves the full URL for the iframe runtime bundle script.
 * Default: https://leveonas.ainot.site/leveonas-runtime.js
 */
export declare function getLeveonasRuntimeScriptUrl(customOrigin?: string): string;
/**
 * Resolves the full URL for the client SDK bundle script.
 * Default: https://leveonas.ainot.site/leveonas.js
 */
export declare function getLeveonasClientScriptUrl(customOrigin?: string): string;
