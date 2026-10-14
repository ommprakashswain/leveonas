import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { ASTFactory } from '../../../../compiler/ast/factory';
import { ASTNodeKind } from '../../../../compiler/ast/types';
import { ComponentNode, LiteralNode, PropertyNode } from '../../../../compiler/ast/nodes';
import { PatchExecutor } from '../executor';
import { PatchOperationType } from '../../patch-generator/types';

describe('Patch Executor', () => {
  const emptyLoc = ASTFactory.createSourceLocation(0, 0, 0, 0, 0, 0);

  test('should insert node', () => {
    const root: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc);
    const executor = new PatchExecutor(root);

    const newNode: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc);

    executor.execute([
      {
        operation: PatchOperationType.INSERT_CHILD,
        nodeId: newNode.id,
        parentId: root.id,
        index: 0,
        payload: newNode,
        timestamp: Date.now()
      }
    ]);

    assert.strictEqual(root.children.length, 1);
    assert.strictEqual(root.children[0].id, newNode.id);
    // @ts-ignore
    assert.strictEqual(executor.context.getNode(newNode.id), newNode);
  });

  test('should remove node', () => {
    const child: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc);
    const root: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc, [], [child]);
    
    const executor = new PatchExecutor(root);

    executor.execute([
      {
        operation: PatchOperationType.REMOVE_CHILD,
        nodeId: child.id,
        parentId: root.id,
        timestamp: Date.now()
      }
    ]);

    assert.strictEqual(root.children.length, 0);
    // @ts-ignore
    assert.strictEqual(executor.context.getNode(child.id), undefined);
  });

  test('should move node', () => {
    const child1: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc);
    const child2: any = ASTFactory.createComponent(ASTNodeKind.Text, emptyLoc);
    const root: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc, [], [child1, child2]);
    
    const executor = new PatchExecutor(root);

    executor.execute([
      {
        operation: PatchOperationType.MOVE_CHILD,
        nodeId: child1.id,
        parentId: root.id,
        index: 1,
        timestamp: Date.now()
      }
    ]);

    assert.strictEqual(root.children[0].id, child2.id);
    assert.strictEqual(root.children[1].id, child1.id);
  });

  test('should replace node', () => {
    const child1: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc);
    const root: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc, [], [child1]);
    
    const child2: any = ASTFactory.createComponent(ASTNodeKind.Text, emptyLoc);

    const executor = new PatchExecutor(root);

    executor.execute([
      {
        operation: PatchOperationType.REPLACE_NODE,
        nodeId: child1.id,
        parentId: root.id,
        index: 0,
        payload: child2,
        timestamp: Date.now()
      }
    ]);

    assert.strictEqual(root.children[0].id, child2.id);
    // @ts-ignore
    assert.strictEqual(executor.context.getNode(child1.id), undefined);
    // @ts-ignore
    assert.strictEqual(executor.context.getNode(child2.id), child2);
  });

  test('should update text', () => {
    const textNode = ASTFactory.createLiteral('Hello', 'Hello', emptyLoc);
    const root: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc, [], [textNode]);
    
    const executor = new PatchExecutor(root);

    executor.execute([
      {
        operation: PatchOperationType.UPDATE_TEXT,
        nodeId: textNode.id,
        payload: { text: 'World' },
        timestamp: Date.now()
      }
    ]);

    assert.strictEqual((root.children[0] as LiteralNode).value, 'World');
    assert.strictEqual((root.children[0] as LiteralNode).raw, 'World');
  });

  test('should update and add property', () => {
    const root: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc);
    root.properties = [ASTFactory.createProperty('label', ASTFactory.createLiteral('Click', 'Click', emptyLoc), emptyLoc)];

    const executor = new PatchExecutor(root);

    executor.execute([
      {
        operation: PatchOperationType.SET_ATTRIBUTE,
        nodeId: root.id,
        payload: { name: 'label', value: 'Submit' },
        timestamp: Date.now()
      },
      {
        operation: PatchOperationType.SET_ATTRIBUTE,
        nodeId: root.id,
        payload: { name: 'disabled', value: true },
        timestamp: Date.now()
      }
    ]);

    assert.strictEqual(root.properties[0].value!.value, 'Submit');
    assert.strictEqual(root.properties[1].name, 'disabled');
    assert.strictEqual(root.properties[1].value!.value, true);
  });

  test('should remove property', () => {
    const root: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc);
    root.properties = [ASTFactory.createProperty('label', ASTFactory.createLiteral('Click', 'Click', emptyLoc), emptyLoc)];

    const executor = new PatchExecutor(root);

    executor.execute([
      {
        operation: PatchOperationType.REMOVE_ATTRIBUTE,
        nodeId: root.id,
        payload: { name: 'label' },
        timestamp: Date.now()
      }
    ]);

    assert.strictEqual(root.properties.length, 0);
  });

  test('should replace children', () => {
    const child1: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc);
    const root: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc, [], [child1]);
    
    const newChild1: any = ASTFactory.createComponent(ASTNodeKind.Text, emptyLoc);
    const newChild2: any = ASTFactory.createComponent(ASTNodeKind.Input, emptyLoc);

    const executor = new PatchExecutor(root);

    executor.execute([
      {
        operation: PatchOperationType.REPLACE_CHILDREN,
        nodeId: root.id,
        payload: [newChild1, newChild2],
        timestamp: Date.now()
      }
    ]);

    assert.strictEqual(root.children.length, 2);
    assert.strictEqual(root.children[0].id, newChild1.id);
    assert.strictEqual(root.children[1].id, newChild2.id);
    
    // @ts-ignore
    assert.strictEqual(executor.context.getNode(child1.id), undefined);
    // @ts-ignore
    assert.strictEqual(executor.context.getNode(newChild1.id), newChild1);
  });
  
  test('should handle deep nesting', () => {
    let current: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc);
    const root = current;
    for (let i = 0; i < 50; i++) {
      const child: any = ASTFactory.createComponent(ASTNodeKind.Container, emptyLoc);
      current.children = [child];
      current = child;
    }
    const leaf: any = ASTFactory.createLiteral('deep', 'deep', emptyLoc);
    current.children = [leaf];

    const executor = new PatchExecutor(root);

    executor.execute([
      {
        operation: PatchOperationType.UPDATE_TEXT,
        nodeId: leaf.id,
        payload: { text: 'updated' },
        timestamp: Date.now()
      }
    ]);

    assert.strictEqual(leaf.value, 'updated');
  });

  test('should handle large trees', () => {
    const root: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc);
    for (let i = 0; i < 1000; i++) {
      const child: any = ASTFactory.createComponent(ASTNodeKind.Container, emptyLoc);
      root.children.push(child);
    }
    
    const executor = new PatchExecutor(root);

    const newChild: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc);

    executor.execute([
      {
        operation: PatchOperationType.INSERT_CHILD,
        nodeId: newChild.id,
        parentId: root.id,
        index: 500,
        payload: newChild,
        timestamp: Date.now()
      }
    ]);

    assert.strictEqual(root.children.length, 1001);
    assert.strictEqual(root.children[500].id, newChild.id);
  });

  test('should fail gracefully on invalid operation and stop execution', () => {
    const root: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc);
    const executor = new PatchExecutor(root);

    assert.throws(() => {
      executor.execute([
        {
          operation: PatchOperationType.UPDATE_TEXT,
          nodeId: 'non-existent-id',
          payload: { text: 'World' },
          timestamp: Date.now()
        }
      ]);
    }, /PatchExecutorError.*not found/);
  });

  test('should fail on invalid insertion index out of bounds', () => {
    const root: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc);
    const executor = new PatchExecutor(root);
    const newChild: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc);

    assert.throws(() => {
      executor.execute([
        {
          operation: PatchOperationType.INSERT_CHILD,
          nodeId: newChild.id,
          parentId: root.id,
          index: 99, // Out of bounds for empty children list
          payload: newChild,
          timestamp: Date.now()
        }
      ]);
    }, /PatchExecutorError.*Invalid child index/);
  });

  test('should fail on missing parent node for child removal', () => {
    const root: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc);
    const executor = new PatchExecutor(root);

    assert.throws(() => {
      executor.execute([
        {
          operation: PatchOperationType.REMOVE_CHILD,
          nodeId: 'non-existent-child',
          parentId: 'non-existent-parent',
          timestamp: Date.now()
        }
      ]);
    }, /PatchExecutorError.*not found/);
  });

  test('should recursively register inserted nested subtrees and unregister on removal', () => {
    const root: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc);
    const executor = new PatchExecutor(root);

    // Create container with deeply nested child
    const nestedChild: any = ASTFactory.createLiteral('Inner Text', 'Inner Text', emptyLoc);
    const container: any = ASTFactory.createComponent(ASTNodeKind.Container, emptyLoc, [], [nestedChild]);

    executor.execute([
      {
        operation: PatchOperationType.INSERT_CHILD,
        nodeId: container.id,
        parentId: root.id,
        index: 0,
        payload: container,
        timestamp: Date.now()
      }
    ]);

    // Verify container and deeply nested child are registered in context
    // @ts-ignore
    assert.ok(executor.context.getNode(container.id));
    // @ts-ignore
    assert.ok(executor.context.getNode(nestedChild.id));

    // Now remove container
    executor.execute([
      {
        operation: PatchOperationType.REMOVE_CHILD,
        nodeId: container.id,
        parentId: root.id,
        timestamp: Date.now()
      }
    ]);

    // Verify both container and nested child are unregistered
    // @ts-ignore
    assert.strictEqual(executor.context.getNode(container.id), undefined);
    // @ts-ignore
    assert.strictEqual(executor.context.getNode(nestedChild.id), undefined);
  });
});
