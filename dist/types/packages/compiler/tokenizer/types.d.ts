export declare enum TokenType {
    Identifier = "Identifier",
    String = "String",
    Number = "Number",
    Boolean = "Boolean",
    BraceOpen = "BraceOpen",
    BraceClose = "BraceClose",
    BracketOpen = "BracketOpen",
    BracketClose = "BracketClose",
    ParenOpen = "ParenOpen",
    ParenClose = "ParenClose",
    Colon = "Colon",
    Comma = "Comma",
    Dot = "Dot",
    Keyword = "Keyword",
    EOF = "EOF"
}
export interface Token {
    type: TokenType;
    value: string;
    line: number;
    column: number;
    offset: number;
}
