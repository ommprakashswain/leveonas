import { Token } from './types';
export declare class Scanner {
    private source;
    private offset;
    private line;
    private column;
    constructor(source: string);
    tokenize(): Token[];
    nextToken(): Token;
    private skipWhitespaceAndComments;
    private readString;
    private readIdentifierOrKeyword;
    private readNumber;
    private advance;
    private peek;
    private peekNext;
    private isAtEnd;
    private advanceAndMakeToken;
    private makeToken;
}
