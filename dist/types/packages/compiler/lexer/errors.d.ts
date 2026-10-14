import { Diagnostic } from './diagnostics';
export declare class LexerError extends Error {
    diagnostics: Diagnostic[];
    constructor(message: string, diagnostics?: Diagnostic[]);
}
