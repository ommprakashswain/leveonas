import { Diagnostic } from './diagnostics';
export declare class ParserError extends Error {
    diagnostics: Diagnostic[];
    constructor(message: string, diagnostics?: Diagnostic[]);
}
