import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { Scanner, Token, TokenType } from '../../tokenizer';
import { Lexer, LexicalTokenType } from '../lexer';
import { DiagnosticCode, DiagnosticSeverity } from '../diagnostics';

describe('Lexer', () => {
  test('should lex components, properties, and enums', () => {
    const source = `Button[primary, size: md] "Click me"`;
    const scanner = new Scanner(source);
    const tokens = scanner.tokenize();
    const lexer = new Lexer(tokens);
    const lexicalTokens = lexer.lex();

    assert.strictEqual(lexicalTokens[0].type, LexicalTokenType.Component);
    assert.strictEqual(lexicalTokens[0].value, 'Button');
    
    assert.strictEqual(lexicalTokens[1].type, LexicalTokenType.Punctuation);
    assert.strictEqual(lexicalTokens[1].value, '[');
    
    assert.strictEqual(lexicalTokens[2].type, LexicalTokenType.Enum);
    assert.strictEqual(lexicalTokens[2].value, 'primary');
    
    assert.strictEqual(lexicalTokens[3].type, LexicalTokenType.Punctuation);
    assert.strictEqual(lexicalTokens[3].value, ',');
    
    assert.strictEqual(lexicalTokens[4].type, LexicalTokenType.Property);
    assert.strictEqual(lexicalTokens[4].value, 'size');
    
    assert.strictEqual(lexicalTokens[5].type, LexicalTokenType.Punctuation);
    assert.strictEqual(lexicalTokens[5].value, ':');
    
    assert.strictEqual(lexicalTokens[6].type, LexicalTokenType.Enum);
    assert.strictEqual(lexicalTokens[6].value, 'md');
    
    assert.strictEqual(lexicalTokens[7].type, LexicalTokenType.Punctuation);
    assert.strictEqual(lexicalTokens[7].value, ']');
    
    assert.strictEqual(lexicalTokens[8].type, LexicalTokenType.StringLiteral);
    assert.strictEqual(lexicalTokens[8].value, 'Click me');
    
    assert.strictEqual(lexicalTokens[9].type, LexicalTokenType.EOF);
    
    assert.strictEqual(lexer.getDiagnostics().length, 0);
  });

  test('should report unknown components', () => {
    const source = `UnknownComponent []`;
    const scanner = new Scanner(source);
    const tokens = scanner.tokenize();
    const lexer = new Lexer(tokens);
    lexer.lex();

    const diags = lexer.getDiagnostics();
    assert.strictEqual(diags.length, 1);
    assert.strictEqual(diags[0].code, DiagnosticCode.UnknownKeyword);
    assert.strictEqual(diags[0].message, "Unknown component 'UnknownComponent'");
  });

  test('should report unknown properties in brackets', () => {
    const source = `Button[unknownProp]`;
    const scanner = new Scanner(source);
    const tokens = scanner.tokenize();
    const lexer = new Lexer(tokens);
    lexer.lex();

    const diags = lexer.getDiagnostics();
    assert.strictEqual(diags.length, 1);
    assert.strictEqual(diags[0].code, DiagnosticCode.UnknownProperty);
    assert.strictEqual(diags[0].message, "Unknown property or enum 'unknownProp'");
  });

  test('should report duplicate properties', () => {
    const source = `Button[size: md, size: lg]`;
    const scanner = new Scanner(source);
    const tokens = scanner.tokenize();
    const lexer = new Lexer(tokens);
    lexer.lex();

    const diags = lexer.getDiagnostics();
    assert.strictEqual(diags.length, 1);
    assert.strictEqual(diags[0].code, DiagnosticCode.DuplicateProperty);
    assert.strictEqual(diags[0].message, "Duplicate property 'size'");
  });
});
