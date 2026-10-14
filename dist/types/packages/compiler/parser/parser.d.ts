import { LexicalToken } from '../lexer';
import { Diagnostic } from './diagnostics';
import { ComponentNode } from './nodes';
export declare class Parser {
    private tokens;
    private current;
    private diagnostics;
    constructor(tokens: LexicalToken[]);
    getDiagnostics(): Diagnostic[];
    parse(): ComponentNode[];
    private isAtEnd;
    private peek;
    private previous;
    private advance;
    private check;
    private match;
    private consume;
    private reportError;
    private parseComponent;
    private parseProperty;
}
