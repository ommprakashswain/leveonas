import { PRODUCTION_LEVEONAS_ORIGIN, getLeveonasOrigin } from '../common/origin';
export interface LeveonasConfig {
    /**
     * The API key for authenticating with Leveonas API.
     * Optional for local operations or public endpoints.
     */
    apiKey?: string;
    /**
     * The base URL for the Leveonas API.
     * @default "https://leveonas.ainot.site"
     */
    baseUrl?: string;
    /**
     * The timeout for API requests in milliseconds.
     * @default 30000
     */
    timeout?: number;
    /**
     * The number of automatic retries for failed requests.
     * @default 3
     */
    retries?: number;
    /**
     * Additional headers to send with each request.
     */
    headers?: Record<string, string>;
    /**
     * Enable debug logging.
     * @default false
     */
    debug?: boolean;
}
export declare const DEFAULT_CONFIG: {
    baseUrl: string;
    timeout: number;
    retries: number;
    debug: boolean;
};
export { PRODUCTION_LEVEONAS_ORIGIN, getLeveonasOrigin };
