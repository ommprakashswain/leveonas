import { Diagnostic } from './types';
export declare class ValidationError extends Error {
    diagnostics: Diagnostic[];
    constructor(diagnostics: Diagnostic[]);
}
