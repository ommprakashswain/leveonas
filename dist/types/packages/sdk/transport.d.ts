import { LeveonasConfig } from './config';
export declare class Transport {
    private config;
    constructor(config: LeveonasConfig);
    request<T>(endpoint: string, options?: RequestInit, retries?: number): Promise<T>;
    requestStream(endpoint: string, options?: RequestInit, retries?: number): Promise<Response>;
    private handleError;
}
