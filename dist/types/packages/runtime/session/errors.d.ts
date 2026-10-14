export declare class SessionError extends Error {
    code: string;
    constructor(code: string, message: string);
}
export declare class SessionNotFoundError extends SessionError {
    constructor(sessionId: string);
}
export declare class SessionStateError extends SessionError {
    constructor(message: string);
}
export declare class SessionTimeoutError extends SessionError {
    constructor(sessionId: string);
}
