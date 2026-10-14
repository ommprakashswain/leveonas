import { Token, TokenType } from './types';
import { createToken } from './token';
import { TokenizerError } from './errors';
import { isWhitespace, isAlpha, isDigit, isAlphaNumeric } from './utils';
import { isBoolean, isKeyword } from './keywords';

export class Scanner {
  private source: string;
  private offset: number = 0;
  private line: number = 1;
  private column: number = 1;

  constructor(source: string) {
    this.source = source;
  }

  public tokenize(): Token[] {
    const tokens: Token[] = [];
    let token = this.nextToken();
    while (token.type !== TokenType.EOF) {
      tokens.push(token);
      token = this.nextToken();
    }
    tokens.push(token); // Push EOF
    return tokens;
  }

  public nextToken(): Token {
    this.skipWhitespaceAndComments();

    if (this.isAtEnd()) {
      return this.makeToken(TokenType.EOF, '');
    }

    const char = this.peek();

    switch (char) {
      case '{': return this.advanceAndMakeToken(TokenType.BraceOpen);
      case '}': return this.advanceAndMakeToken(TokenType.BraceClose);
      case '[': return this.advanceAndMakeToken(TokenType.BracketOpen);
      case ']': return this.advanceAndMakeToken(TokenType.BracketClose);
      case '(': return this.advanceAndMakeToken(TokenType.ParenOpen);
      case ')': return this.advanceAndMakeToken(TokenType.ParenClose);
      case ':': return this.advanceAndMakeToken(TokenType.Colon);
      case ',': return this.advanceAndMakeToken(TokenType.Comma);
      case '.': return this.advanceAndMakeToken(TokenType.Dot);
      case '"': return this.readString();
    }

    if (isAlpha(char)) {
      return this.readIdentifierOrKeyword();
    }

    if (isDigit(char) || (char === '-' && isDigit(this.peekNext()))) {
      return this.readNumber();
    }

    throw new TokenizerError(`Unexpected character: '${char}'`, this.line, this.column, this.offset);
  }

  private skipWhitespaceAndComments(): void {
    while (!this.isAtEnd()) {
      const char = this.peek();
      if (isWhitespace(char)) {
        this.advance();
      } else if (char === '/' && this.peekNext() === '/') {
        // Line comment
        while (!this.isAtEnd() && this.peek() !== '\n') {
          this.advance();
        }
      } else if (char === '/' && this.peekNext() === '*') {
        // Block comment
        this.advance(); // consume '/'
        this.advance(); // consume '*'
        while (!this.isAtEnd()) {
          if (this.peek() === '*' && this.peekNext() === '/') {
            this.advance(); // consume '*'
            this.advance(); // consume '/'
            break;
          }
          this.advance();
        }
      } else {
        break;
      }
    }
  }

  private readString(): Token {
    const startLine = this.line;
    const startCol = this.column;
    const startOffset = this.offset;

    this.advance(); // consume '"'
    let value = '';

    while (!this.isAtEnd() && this.peek() !== '"') {
      // Handle escape characters if necessary
      if (this.peek() === '\\') {
        this.advance(); // consume '\\'
        if (!this.isAtEnd()) {
          value += this.advance();
        }
      } else {
        value += this.advance();
      }
    }

    if (this.isAtEnd()) {
      throw new TokenizerError('Unterminated string', startLine, startCol, startOffset);
    }

    this.advance(); // consume closing '"'

    return createToken(TokenType.String, value, startLine, startCol, startOffset);
  }

  private readIdentifierOrKeyword(): Token {
    const startLine = this.line;
    const startCol = this.column;
    const startOffset = this.offset;
    
    let value = '';
    // Allow dashes and dots in identifiers for custom elements and traits
    while (!this.isAtEnd() && (isAlphaNumeric(this.peek()) || this.peek() === '-')) {
      value += this.advance();
    }

    let type = TokenType.Identifier;
    if (isBoolean(value)) {
      type = TokenType.Boolean;
    } else if (isKeyword(value)) {
      type = TokenType.Keyword;
    }

    return createToken(type, value, startLine, startCol, startOffset);
  }

  private readNumber(): Token {
    const startLine = this.line;
    const startCol = this.column;
    const startOffset = this.offset;
    
    let value = '';
    
    if (this.peek() === '-') {
      value += this.advance();
    }

    while (!this.isAtEnd() && isDigit(this.peek())) {
      value += this.advance();
    }

    if (this.peek() === '.' && isDigit(this.peekNext())) {
      value += this.advance(); // consume '.'
      while (!this.isAtEnd() && isDigit(this.peek())) {
        value += this.advance();
      }
    }

    return createToken(TokenType.Number, value, startLine, startCol, startOffset);
  }

  private advance(): string {
    const char = this.source[this.offset];
    this.offset++;
    if (char === '\n') {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    return char;
  }

  private peek(): string {
    if (this.isAtEnd()) return '\0';
    return this.source[this.offset];
  }

  private peekNext(): string {
    if (this.offset + 1 >= this.source.length) return '\0';
    return this.source[this.offset + 1];
  }

  private isAtEnd(): boolean {
    return this.offset >= this.source.length;
  }

  private advanceAndMakeToken(type: TokenType): Token {
    const startLine = this.line;
    const startCol = this.column;
    const startOffset = this.offset;
    const char = this.advance();
    return createToken(type, char, startLine, startCol, startOffset);
  }

  private makeToken(type: TokenType, value: string): Token {
    return createToken(type, value, this.line, this.column, this.offset);
  }
}
