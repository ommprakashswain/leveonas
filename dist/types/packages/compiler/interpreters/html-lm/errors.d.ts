import { SourceLocation } from '../../ast/types';
export declare class HTMLLMError extends Error {
    location?: SourceLocation;
    constructor(message: string, location?: SourceLocation);
}
