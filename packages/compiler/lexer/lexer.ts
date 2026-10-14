import { Token, TokenType } from '../tokenizer';
import { isComponent } from './keywords';
import { isProperty } from './properties';
import { isEnum } from './enums';
import { Diagnostic, DiagnosticCode, DiagnosticSeverity, createDiagnostic } from './diagnostics';

export enum LexicalTokenType {
  Component = 'Component',
  Property = 'Property',
  Enum = 'Enum',
  Identifier = 'Identifier', // Unrecognized/custom identifier
  StringLiteral = 'StringLiteral',
  NumberLiteral = 'NumberLiteral',
  BooleanLiteral = 'BooleanLiteral',
  Punctuation = 'Punctuation', // braces, brackets, colon, comma, etc.
  EOF = 'EOF',
}

export interface LexicalToken {
  type: LexicalTokenType;
  value: string;
  originalToken: Token;
  line: number;
  column: number;
  offset: number;
}

export class Lexer {
  private tokens: Token[];
  private current = 0;
  private diagnostics: Diagnostic[] = [];
  
  // Track properties per component (simple heuristic: clear when seeing a Component or BraceOpen)
  // This is a bit parser-like, but to detect DuplicateProperty we need *some* context,
  // or we can just emit it when we see a property if we track a stack.
  // Wait, the prompt says "Generate diagnostics for ... Duplicate property"
  // Let's track properties within a bracket/brace if possible, or just emit a warning?
  // Let's do a simple state machine to track properties within brackets `[]`.
  private currentProperties = new Set<string>();
  private insideBrackets = false;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  public getDiagnostics(): Diagnostic[] {
    return this.diagnostics;
  }

  public lex(): LexicalToken[] {
    const lexicalTokens: LexicalToken[] = [];
    
    while (!this.isAtEnd()) {
      lexicalTokens.push(this.nextLexicalToken());
    }
    
    lexicalTokens.push({
      type: LexicalTokenType.EOF,
      value: '',
      originalToken: this.tokens[this.current],
      line: this.tokens[this.current]?.line || 0,
      column: this.tokens[this.current]?.column || 0,
      offset: this.tokens[this.current]?.offset || 0,
    });
    
    return lexicalTokens;
  }

  private isAtEnd(): boolean {
    return this.current >= this.tokens.length || this.tokens[this.current].type === TokenType.EOF;
  }

  private advance(): Token {
    return this.tokens[this.current++];
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private nextLexicalToken(): LexicalToken {
    const token = this.advance();

    if (token.type === TokenType.String) {
      return this.makeLexicalToken(LexicalTokenType.StringLiteral, token);
    }

    if (token.type === TokenType.Number) {
      return this.makeLexicalToken(LexicalTokenType.NumberLiteral, token);
    }

    if (token.type === TokenType.Boolean) {
      return this.makeLexicalToken(LexicalTokenType.BooleanLiteral, token);
    }

    if (
      token.type === TokenType.BraceOpen ||
      token.type === TokenType.BraceClose ||
      token.type === TokenType.BracketOpen ||
      token.type === TokenType.BracketClose ||
      token.type === TokenType.ParenOpen ||
      token.type === TokenType.ParenClose ||
      token.type === TokenType.Colon ||
      token.type === TokenType.Comma ||
      token.type === TokenType.Dot
    ) {
      if (token.type === TokenType.BracketOpen) {
        this.insideBrackets = true;
        this.currentProperties.clear();
      } else if (token.type === TokenType.BracketClose) {
        this.insideBrackets = false;
        this.currentProperties.clear();
      }
      return this.makeLexicalToken(LexicalTokenType.Punctuation, token);
    }

    if (token.type === TokenType.Identifier) {
      const value = token.value;
      
      // Let's classify the identifier
      if (isComponent(value)) {
        return this.makeLexicalToken(LexicalTokenType.Component, token);
      }
      
      if (isProperty(value)) {
        if (this.currentProperties.has(value)) {
          this.reportDiagnostic(DiagnosticCode.DuplicateProperty, `Duplicate property '${value}'`, DiagnosticSeverity.Warning, token);
        } else {
          this.currentProperties.add(value);
        }
        return this.makeLexicalToken(LexicalTokenType.Property, token);
      }
      
      if (isEnum(value)) {
        return this.makeLexicalToken(LexicalTokenType.Enum, token);
      }
      
      // If it starts with an uppercase letter, maybe report unknown component?
      // Or if it's inside brackets, maybe unknown property/enum?
      if (this.insideBrackets) {
        // Inside brackets, it's usually a property or enum.
        this.reportDiagnostic(DiagnosticCode.UnknownProperty, `Unknown property or enum '${value}'`, DiagnosticSeverity.Warning, token);
      } else if (value.length > 0 && value[0] === value[0].toUpperCase()) {
        this.reportDiagnostic(DiagnosticCode.UnknownKeyword, `Unknown component '${value}'`, DiagnosticSeverity.Warning, token);
      } else {
        this.reportDiagnostic(DiagnosticCode.UnexpectedIdentifier, `Unexpected identifier '${value}'`, DiagnosticSeverity.Warning, token);
      }

      return this.makeLexicalToken(LexicalTokenType.Identifier, token);
    }
    
    // Fallback for keyword tokens
    if (token.type === TokenType.Keyword) {
       return this.makeLexicalToken(LexicalTokenType.Identifier, token);
    }

    return this.makeLexicalToken(LexicalTokenType.Identifier, token);
  }

  private makeLexicalToken(type: LexicalTokenType, token: Token): LexicalToken {
    return {
      type,
      value: token.value,
      originalToken: token,
      line: token.line,
      column: token.column,
      offset: token.offset,
    };
  }

  private reportDiagnostic(code: DiagnosticCode, message: string, severity: DiagnosticSeverity, token: Token) {
    this.diagnostics.push(
      createDiagnostic(code, message, severity, token.line, token.column, token.offset)
    );
  }
}
