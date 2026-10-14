import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { Scanner } from '../../scanner';
import { Scanner as TokenizerScanner } from '../../tokenizer';
import { Lexer } from '../../lexer';
import { Parser } from '../parser';
import { ASTNodeType } from '../nodes';

describe('Parser', () => {
  test('should parse a basic component', () => {
    const source = `Button[primary] "Click me"`;
    const scanner = new TokenizerScanner(source);
    const tokens = scanner.tokenize();
    const lexer = new Lexer(tokens);
    const lexicalTokens = lexer.lex();
    const parser = new Parser(lexicalTokens);
    const ast = parser.parse();

    assert.strictEqual(ast.length, 1);
    assert.strictEqual(ast[0].type, ASTNodeType.Button);
    assert.strictEqual(ast[0].properties.length, 1);
    assert.strictEqual(ast[0].properties[0].name, 'primary');
    assert.strictEqual(ast[0].properties[0].value?.value, true);
    assert.strictEqual(ast[0].children.length, 1);
    assert.strictEqual(ast[0].children[0].type, ASTNodeType.Text);
  });

  test('should parse nested children', () => {
    const source = `
      Page {
        Section[pad: xl] {
          HeroTitle "Hello World"
        }
      }
    `;
    const scanner = new TokenizerScanner(source);
    const tokens = scanner.tokenize();
    const lexer = new Lexer(tokens);
    const lexicalTokens = lexer.lex();
    const parser = new Parser(lexicalTokens);
    const ast = parser.parse();

    assert.strictEqual(ast.length, 1);
    assert.strictEqual(ast[0].type, ASTNodeType.Page);
    assert.strictEqual(ast[0].children.length, 1);
    
    const section = ast[0].children[0] as any;
    assert.strictEqual(section.type, ASTNodeType.Section);
    assert.strictEqual(section.properties[0].name, 'pad');
    assert.strictEqual(section.properties[0].value?.value, 'xl');

    assert.strictEqual(section.children.length, 1);
    const hero = section.children[0];
    assert.strictEqual(hero.type, ASTNodeType.Hero);
  });

  test('should recover from missing closing bracket', () => {
    const source = `Button[primary "Click"`;
    const scanner = new TokenizerScanner(source);
    const tokens = scanner.tokenize();
    const lexer = new Lexer(tokens);
    const lexicalTokens = lexer.lex();
    const parser = new Parser(lexicalTokens);
    const ast = parser.parse();
    
    // It should parse Button and primary, then complain about missing ']'
    // Then it should parse "Click" as children Text.
    assert.strictEqual(ast.length, 1);
    assert.strictEqual(ast[0].type, ASTNodeType.Button);
    assert.strictEqual(ast[0].children.length, 1);
    
    const diags = parser.getDiagnostics();
    assert.strictEqual(diags.length > 0, true);
  });
});
