import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { Scanner } from '../scanner';
import { TokenType } from '../types';

describe('LM Tokenizer', () => {
  test('should tokenize a simple element', () => {
    const source = `Button[primary] "Click me"`;
    const scanner = new Scanner(source);
    const tokens = scanner.tokenize();

    assert.strictEqual(tokens.length, 6);
    assert.strictEqual(tokens[0].type, TokenType.Identifier);
    assert.strictEqual(tokens[0].value, 'Button');
    assert.strictEqual(tokens[1].type, TokenType.BracketOpen);
    assert.strictEqual(tokens[2].type, TokenType.Identifier);
    assert.strictEqual(tokens[2].value, 'primary');
    assert.strictEqual(tokens[3].type, TokenType.BracketClose);
    assert.strictEqual(tokens[4].type, TokenType.String);
    assert.strictEqual(tokens[4].value, 'Click me');
    assert.strictEqual(tokens[5].type, TokenType.EOF);
  });

  test('should ignore whitespace and comments', () => {
    const source = `
      // This is a comment
      Button { /* Block comment */ }
    `;
    const scanner = new Scanner(source);
    const tokens = scanner.tokenize();

    assert.strictEqual(tokens.length, 4);
    assert.strictEqual(tokens[0].type, TokenType.Identifier);
    assert.strictEqual(tokens[0].value, 'Button');
    assert.strictEqual(tokens[1].type, TokenType.BraceOpen);
    assert.strictEqual(tokens[2].type, TokenType.BraceClose);
    assert.strictEqual(tokens[3].type, TokenType.EOF);
  });

  test('should tokenize numbers and booleans', () => {
    const source = `value: -12.34 true false`;
    const scanner = new Scanner(source);
    const tokens = scanner.tokenize();

    assert.strictEqual(tokens[0].type, TokenType.Identifier);
    assert.strictEqual(tokens[1].type, TokenType.Colon);
    assert.strictEqual(tokens[2].type, TokenType.Number);
    assert.strictEqual(tokens[2].value, '-12.34');
    assert.strictEqual(tokens[3].type, TokenType.Boolean);
    assert.strictEqual(tokens[3].value, 'true');
    assert.strictEqual(tokens[4].type, TokenType.Boolean);
    assert.strictEqual(tokens[4].value, 'false');
  });

  test('should throw error on invalid syntax', () => {
    const source = `Card @`;
    const scanner = new Scanner(source);
    
    assert.throws(() => {
      scanner.tokenize();
    }, /Unexpected character: '@'/);
  });
});
