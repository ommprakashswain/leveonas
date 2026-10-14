import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { ASTFactory } from '../../../../compiler/ast/factory';
import { ASTNodeKind } from '../../../../compiler/ast/types';
import { PatchGenerator } from '../generator';
import { PatchOperationType } from '../types';

describe('Patch Generator', () => {
  const emptyLoc = ASTFactory.createSourceLocation(0, 0, 0, 0, 0, 0);

  test('should generate no operations for identical ASTs', () => {
    const ast1: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc);
    const ast2: any = ASTFactory.clone(ast1); // Same id, properties, children

    const generator = new PatchGenerator();
    const ops = generator.generate(ast1, ast2);

    assert.strictEqual(ops.length, 0);
  });

  test('should detect property updates', () => {
    const ast1: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc);
    ast1.properties = [ASTFactory.createProperty('label', ASTFactory.createLiteral('Click', 'Click', emptyLoc), emptyLoc)];

    const ast2: any = ASTFactory.clone(ast1);
    ast2.properties[0].value!.value = 'Submit';

    const generator = new PatchGenerator();
    const ops = generator.generate(ast1, ast2);

    assert.strictEqual(ops.length, 1);
    assert.strictEqual(ops[0].operation, PatchOperationType.SET_ATTRIBUTE);
    assert.strictEqual(ops[0].payload.name, 'label');
    assert.strictEqual(ops[0].payload.value, 'Submit');
  });

  test('should detect added property', () => {
    const ast1: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc);
    const ast2: any = ASTFactory.clone(ast1);
    ast2.properties = [ASTFactory.createProperty('disabled', ASTFactory.createLiteral(true, 'true', emptyLoc), emptyLoc)];

    const generator = new PatchGenerator();
    const ops = generator.generate(ast1, ast2);

    assert.strictEqual(ops.length, 1);
    assert.strictEqual(ops[0].operation, PatchOperationType.SET_ATTRIBUTE);
    assert.strictEqual(ops[0].payload.name, 'disabled');
    assert.strictEqual(ops[0].payload.value, true);
  });

  test('should detect removed property', () => {
    const ast1: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc);
    ast1.properties = [ASTFactory.createProperty('disabled', ASTFactory.createLiteral(true, 'true', emptyLoc), emptyLoc)];
    
    const ast2: any = ASTFactory.clone(ast1);
    ast2.properties = []; // Removed

    const generator = new PatchGenerator();
    const ops = generator.generate(ast1, ast2);

    assert.strictEqual(ops.length, 1);
    assert.strictEqual(ops[0].operation, PatchOperationType.REMOVE_ATTRIBUTE);
    assert.strictEqual(ops[0].payload.name, 'disabled');
  });

  test('should detect text update', () => {
    const textNode1: any = ASTFactory.createLiteral('Hello', 'Hello', emptyLoc);
    const textNode2 = ASTFactory.clone(textNode1);
    textNode2.value = 'World';

    const generator = new PatchGenerator();
    const ops = generator.generate(textNode1, textNode2);

    assert.strictEqual(ops.length, 1);
    assert.strictEqual(ops[0].operation, PatchOperationType.UPDATE_TEXT);
    assert.strictEqual(ops[0].payload.text, 'World');
  });

  test('should detect node insertion', () => {
    const ast1: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc);
    const ast2: any = ASTFactory.clone(ast1);
    
    const newChild: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc);
    ast2.children = [newChild];

    const generator = new PatchGenerator();
    const ops = generator.generate(ast1, ast2);

    assert.strictEqual(ops.length, 1);
    assert.strictEqual(ops[0].operation, PatchOperationType.INSERT_CHILD);
    assert.strictEqual(ops[0].payload.kind, ASTNodeKind.Button);
  });

  test('should not mutate oldAst or newAst during diff generation', () => {
    const child1: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc);
    child1.id = 'btn-old-id';
    const oldAst: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc, [], [child1]);
    oldAst.id = 'page-old-id';

    const child2: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc);
    child2.id = 'btn-new-id';
    const newAst: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc, [], [child2]);
    newAst.id = 'page-new-id';

    const oldIdBefore = oldAst.id;
    const oldChildIdBefore = child1.id;
    const newIdBefore = newAst.id;
    const newChildIdBefore = child2.id;

    const generator = new PatchGenerator();
    const ops = generator.generate(oldAst, newAst);

    assert.strictEqual(oldAst.id, oldIdBefore, 'oldAst.id must remain unchanged');
    assert.strictEqual(child1.id, oldChildIdBefore, 'oldAst child id must remain unchanged');
    assert.strictEqual(newAst.id, newIdBefore, 'newAst.id must remain unchanged');
    assert.strictEqual(child2.id, newChildIdBefore, 'newAst child id must remain unchanged');
  });

  test('should detect node removal cleanly with REMOVE_CHILD', () => {
    const child: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc);
    const ast1: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc, [], [child]);
    const ast2: any = ASTFactory.clone(ast1);
    ast2.children = [];

    const generator = new PatchGenerator();
    const ops = generator.generate(ast1, ast2);

    assert.strictEqual(ops.length, 1);
    assert.strictEqual(ops[0].operation, PatchOperationType.REMOVE_CHILD);
    assert.strictEqual(ops[0].nodeId, child.id);
  });

  test('should replace node if kind changes', () => {
    const ast1: any = ASTFactory.createComponent(ASTNodeKind.Section, emptyLoc);
    const ast2: any = ASTFactory.createComponent(ASTNodeKind.Container, emptyLoc);
    ast2.id = ast1.id; // Force same ID to test kind change

    const generator = new PatchGenerator();
    const ops = generator.generate(ast1, ast2);

    assert.strictEqual(ops.length, 1);
    assert.strictEqual(ops[0].operation, PatchOperationType.REPLACE_NODE);
    assert.strictEqual(ops[0].payload.kind, ASTNodeKind.Container);
  });

  test('should detect node movement', () => {
    const child1: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc);
    const child2: any = ASTFactory.createComponent(ASTNodeKind.Text, emptyLoc);
    const ast1: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc, [], [child1, child2]);
    const ast2: any = ASTFactory.clone(ast1);
    
    // Swap children
    ast2.children = [ast1.children[1], ast1.children[0]];

    const generator = new PatchGenerator();
    const ops = generator.generate(ast1, ast2);

    assert.ok(ops.some(op => op.operation === PatchOperationType.MOVE_CHILD));
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

    const ast2: any = ASTFactory.clone(root);
    // Find leaf and update
    let current2 = ast2;
    while (current2.children && current2.children.length > 0 && current2.children[0].kind !== ASTNodeKind.Literal) {
      current2 = current2.children[0] as typeof current2;
    }
    if (current2.children && current2.children[0].kind === ASTNodeKind.Literal) {
      (current2.children[0] as any).value = 'updated';
    }

    const generator = new PatchGenerator();
    const ops = generator.generate(root, ast2);
    
    assert.strictEqual(ops.length, 1);
    assert.strictEqual(ops[0].operation, PatchOperationType.UPDATE_TEXT);
    assert.strictEqual(ops[0].payload.text, 'updated');
  });

  test('should handle large trees', () => {
    const root1: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc);
    for (let i = 0; i < 100; i++) {
      const child: any = ASTFactory.createComponent(ASTNodeKind.Container, emptyLoc);
      child.properties = [ASTFactory.createProperty('index', ASTFactory.createLiteral(i, String(i), emptyLoc), emptyLoc)];
      root1.children.push(child);
    }
    
    // Create a new AST manually preserving IDs to test keyed diffing properly
    const root2 = { ...root1, children: [...root1.children] } as any;
    // Remove 50th child
    root2.children.splice(50, 1);
    
    // Add a new child at the end
    const newChild: any = ASTFactory.createComponent(ASTNodeKind.Container, emptyLoc);
    root2.children.push(newChild);

    const generator = new PatchGenerator();
    const ops = generator.generate(root1, root2);

    assert.ok(ops.length >= 2, 'Should at least have a removal and an insertion');
    assert.ok(ops.some(op => op.operation === PatchOperationType.REMOVE_NODE || op.operation === PatchOperationType.REMOVE_CHILD));
    assert.ok(ops.some(op => op.operation === PatchOperationType.INSERT_NODE || op.operation === PatchOperationType.INSERT_CHILD));
  });

  test('should generate operations in deterministic dependency order', () => {
    // ast1: Page with 3 buttons and an attribute
    const btn0: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc);
    btn0.properties = [ASTFactory.createProperty('title', ASTFactory.createLiteral('Old Title', 'Old Title', emptyLoc), emptyLoc)];
    const btn1: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc);
    btn1.id = 'btn-1';
    const btn2: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc);
    btn2.id = 'btn-2';
    btn2.properties = [ASTFactory.createProperty('title', ASTFactory.createLiteral('Delete', 'Delete', emptyLoc), emptyLoc)];

    const ast1: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc, [], [btn0, btn1, btn2]);
    ast1.properties = [
      ASTFactory.createProperty('class', ASTFactory.createLiteral('active', 'active', emptyLoc), emptyLoc),
      ASTFactory.createProperty('obsolete', ASTFactory.createLiteral('true', 'true', emptyLoc), emptyLoc)
    ];

    // ast2: Remove obsolete, change class, update btn0 title, remove btn2, insert new btn3 at index 1
    const btn0Updated: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc);
    btn0Updated.id = btn0.id;
    btn0Updated.properties = [ASTFactory.createProperty('title', ASTFactory.createLiteral('New Title', 'New Title', emptyLoc), emptyLoc)];

    const btn3New: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc);
    btn3New.id = 'btn-3';
    btn3New.properties = [ASTFactory.createProperty('title', ASTFactory.createLiteral('Add', 'Add', emptyLoc), emptyLoc)];

    const btn1InAst2: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc);
    btn1InAst2.id = btn1.id;

    const ast2: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc, [], [btn0Updated, btn3New, btn1InAst2]);
    ast2.id = ast1.id;
    ast2.properties = [
      ASTFactory.createProperty('class', ASTFactory.createLiteral('super-active', 'super-active', emptyLoc), emptyLoc)
    ];

    const generator = new PatchGenerator();
    const ops = generator.generate(ast1, ast2);

    // Verify ordering: REMOVE_ATTRIBUTE comes before SET_ATTRIBUTE comes before REMOVE_CHILD comes before INSERT_CHILD
    const opTypes = ops.map(o => o.operation);
    const removeAttrIdx = opTypes.indexOf(PatchOperationType.REMOVE_ATTRIBUTE);
    const setAttrIdx = opTypes.indexOf(PatchOperationType.SET_ATTRIBUTE);
    const removeChildIdx = opTypes.indexOf(PatchOperationType.REMOVE_CHILD);
    const insertChildIdx = opTypes.indexOf(PatchOperationType.INSERT_CHILD);

    assert.ok(removeAttrIdx !== -1, 'Must have REMOVE_ATTRIBUTE');
    assert.ok(setAttrIdx !== -1, 'Must have SET_ATTRIBUTE');
    assert.ok(removeChildIdx !== -1, 'Must have REMOVE_CHILD');
    assert.ok(insertChildIdx !== -1, 'Must have INSERT_CHILD');

    assert.ok(removeAttrIdx < setAttrIdx, 'REMOVE_ATTRIBUTE must precede SET_ATTRIBUTE');
    assert.ok(setAttrIdx < removeChildIdx, 'SET_ATTRIBUTE must precede REMOVE_CHILD');
    assert.ok(removeChildIdx < insertChildIdx, 'REMOVE_CHILD must precede INSERT_CHILD');
  });
});
