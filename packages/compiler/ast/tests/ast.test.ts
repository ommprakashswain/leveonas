import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { ASTBuilder } from '../builder';
import { ASTNodeKind } from '../types';
import { ASTPrinter } from '../printer';
import { ASTWalker } from '../walker';
import { ASTFactory } from '../factory';

describe('AST', () => {
  test('should build and traverse AST', () => {
    const builder = new ASTBuilder();
    builder.enterComponent(ASTNodeKind.Page)
      .addProperty('theme', 'dark')
      .enterComponent(ASTNodeKind.Section)
        .addProperty('pad', 'lg')
        .enterComponent(ASTNodeKind.Button)
          .addProperty('primary', true)
        .exitComponent()
      .exitComponent()
    .exitComponent();

    const root = builder.getRoot();
    
    assert.strictEqual(root.children.length, 1);
    assert.strictEqual(root.children[0].kind, ASTNodeKind.Page);
    
    let buttonCount = 0;
    ASTWalker.walk(root, {
      visitButton(node) {
        buttonCount++;
        assert.strictEqual(node.properties.length, 1);
        assert.strictEqual(node.properties[0].name, 'primary');
      }
    });
    
    assert.strictEqual(buttonCount, 1);
  });
  
  test('should clone AST nodes', () => {
    const builder = new ASTBuilder();
    builder.enterComponent(ASTNodeKind.Container).addProperty('width', 'full').exitComponent();
    
    const root = builder.getRoot();
    const cloned = ASTFactory.clone(root);
    
    assert.notStrictEqual(root.id, cloned.id);
    assert.strictEqual(root.children.length, cloned.children.length);
    assert.notStrictEqual(root.children[0].id, cloned.children[0].id);
    
    const serializedRoot = ASTPrinter.serialize(root);
    const serializedCloned = ASTPrinter.serialize(cloned);
    assert.ok(serializedCloned.includes('Container'));
  });
});
