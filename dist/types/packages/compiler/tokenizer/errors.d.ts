export declare class TokenizerError extends Error {
    line: number;
    column: number;
    offset: number;
    constructor(message: string, line: number, column: number, offset: number);
}
