export declare const delay: (ms: number) => Promise<unknown>;
export declare function mergeHeaders(base: Record<string, string>, custom?: Record<string, string>): Record<string, string>;
export declare function logDebug(debug: boolean, message: string, ...args: any[]): void;
