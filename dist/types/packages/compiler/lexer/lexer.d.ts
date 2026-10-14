import { Token } from '../tokenizer';
import { Diagnostic } from './diagnostics';
export declare enum LexicalTokenType {
    Component = "Component",
    Property = "Property",
    Enum = "Enum",
    Identifier = "Identifier",// Unrecognized/custom identifier
    StringLiteral = "StringLiteral",
    NumberLiteral = "NumberLiteral",
    BooleanLiteral = "BooleanLiteral",
    Punctuation = "Punctuation",// braces, brackets, colon, comma, etc.
    EOF = "EOF"
}
export interface LexicalToken {
    type: LexicalTokenType;
    value: string;
    originalToken: Token;
    line: number;
    column: number;
    offset: number;
}
export declare class Lexer {
    private tokens;
    private current;
    private diagnostics;
    private currentProperties;
    private insideBrackets;
    constructor(tokens: Token[]);
    getDiagnostics(): Diagnostic[];
    lex(): LexicalToken[];
    private isAtEnd;
    private advance;
    private peek;
    private nextLexicalToken;
    private makeLexicalToken;
    private reportDiagnostic;
}
