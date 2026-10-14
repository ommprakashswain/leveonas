export declare class LeveonasError extends Error {
    statusCode?: number | undefined;
    code?: string | undefined;
    constructor(message: string, statusCode?: number | undefined, code?: string | undefined);
}
export declare class AuthenticationError extends LeveonasError {
    constructor(message?: string);
}
export declare class ValidationError extends LeveonasError {
    constructor(message: string);
}
export declare class TimeoutError extends LeveonasError {
    constructor(message?: string);
}
