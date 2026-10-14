export declare class StreamBuilderError extends Error {
    code: string;
    constructor(code: string, message: string);
}
export declare class BufferOverflowError extends StreamBuilderError {
    constructor();
}
