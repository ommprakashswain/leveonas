import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { ASTFactory } from '../../../../compiler/ast/factory';
import { ASTNodeKind } from '../../../../compiler/ast/types';
import { PatchGenerator } from '../generator';
import { PatchOperationType } from '../types';

describe('Patch Generator - Performance Benchmark (1,000+ Siblings)', () => {
  const emptyLoc = ASTFactory.createSourceLocation(0, 0, 0, 0, 0, 0);

  function create1000List(): { root: any; items: any[] } {
    const root: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc);
    root.id = 'bench-root';
    const items: any[] = [];
    for (let i = 0; i < 1000; i++) {
      const item: any = ASTFactory.createComponent(ASTNodeKind.Container, emptyLoc);
      item.id = `item-${i}`;
      item.properties = [ASTFactory.createProperty('key', ASTFactory.createLiteral(`k-${i}`, `k-${i}`, emptyLoc), emptyLoc)];
      items.push(item);
    }
    root.children = [...items];
    return { root, items };
  }

  test('Benchmark: Insert at beginning of 1,000 siblings', () => {
    const { root: oldAst, items } = create1000List();
    const newAst: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc);
    newAst.id = 'bench-root';

    const newItem: any = ASTFactory.createComponent(ASTNodeKind.Container, emptyLoc);
    newItem.id = 'item-new-start';
    newItem.properties = [ASTFactory.createProperty('key', ASTFactory.createLiteral('k-new-start', 'k-new-start', emptyLoc), emptyLoc)];

    newAst.children = [newItem, ...items];

    const generator = new PatchGenerator();
    const start = performance.now();
    const ops = generator.generate(oldAst, newAst);
    const elapsed = performance.now() - start;

    console.log(`[Benchmark] Insert at beginning: ${elapsed.toFixed(2)}ms (${ops.length} ops)`);
    assert.ok(elapsed < 50, `Diff took ${elapsed}ms, expected sub-50ms`);
    assert.strictEqual(ops.length, 1, 'Should generate exactly 1 INSERT_CHILD op');
    assert.strictEqual(ops[0].operation, PatchOperationType.INSERT_CHILD);
    assert.strictEqual(ops[0].index, 0);
  });

  test('Benchmark: Insert in middle of 1,000 siblings', () => {
    const { root: oldAst, items } = create1000List();
    const newAst: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc);
    newAst.id = 'bench-root';

    const newItem: any = ASTFactory.createComponent(ASTNodeKind.Container, emptyLoc);
    newItem.id = 'item-new-middle';
    newItem.properties = [ASTFactory.createProperty('key', ASTFactory.createLiteral('k-new-middle', 'k-new-middle', emptyLoc), emptyLoc)];

    const half = items.length / 2;
    newAst.children = [...items.slice(0, half), newItem, ...items.slice(half)];

    const generator = new PatchGenerator();
    const start = performance.now();
    const ops = generator.generate(oldAst, newAst);
    const elapsed = performance.now() - start;

    console.log(`[Benchmark] Insert in middle: ${elapsed.toFixed(2)}ms (${ops.length} ops)`);
    assert.ok(elapsed < 50, `Diff took ${elapsed}ms, expected sub-50ms`);
    assert.strictEqual(ops.length, 1, 'Should generate exactly 1 INSERT_CHILD op');
    assert.strictEqual(ops[0].operation, PatchOperationType.INSERT_CHILD);
    assert.strictEqual(ops[0].index, half);
  });

  test('Benchmark: Insert at end of 1,000 siblings', () => {
    const { root: oldAst, items } = create1000List();
    const newAst: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc);
    newAst.id = 'bench-root';

    const newItem: any = ASTFactory.createComponent(ASTNodeKind.Container, emptyLoc);
    newItem.id = 'item-new-end';
    newItem.properties = [ASTFactory.createProperty('key', ASTFactory.createLiteral('k-new-end', 'k-new-end', emptyLoc), emptyLoc)];

    newAst.children = [...items, newItem];

    const generator = new PatchGenerator();
    const start = performance.now();
    const ops = generator.generate(oldAst, newAst);
    const elapsed = performance.now() - start;

    console.log(`[Benchmark] Insert at end: ${elapsed.toFixed(2)}ms (${ops.length} ops)`);
    assert.ok(elapsed < 50, `Diff took ${elapsed}ms, expected sub-50ms`);
    assert.strictEqual(ops.length, 1, 'Should generate exactly 1 INSERT_CHILD op');
    assert.strictEqual(ops[0].operation, PatchOperationType.INSERT_CHILD);
    assert.strictEqual(ops[0].index, 1000);
  });

  test('Benchmark: Move item from index 0 to 999', () => {
    const { root: oldAst, items } = create1000List();
    const newAst: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc);
    newAst.id = 'bench-root';

    const item0 = items[0];
    newAst.children = [...items.slice(1), item0];

    const generator = new PatchGenerator();
    const start = performance.now();
    const ops = generator.generate(oldAst, newAst);
    const elapsed = performance.now() - start;

    console.log(`[Benchmark] Move index 0 to 999: ${elapsed.toFixed(2)}ms (${ops.length} ops)`);
    assert.ok(elapsed < 50, `Diff took ${elapsed}ms, expected sub-50ms`);
    assert.strictEqual(ops.length, 1, 'Should generate exactly 1 MOVE_CHILD op');
    assert.strictEqual(ops[0].operation, PatchOperationType.MOVE_CHILD);
    assert.strictEqual(ops[0].nodeId, item0.id);
  });

  test('Benchmark: Delete 10 random items in 1,000 siblings', () => {
    const { root: oldAst, items } = create1000List();
    const newAst: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc);
    newAst.id = 'bench-root';

    const deleteIndices = new Set([12, 85, 143, 299, 450, 521, 680, 744, 899, 955]);
    newAst.children = items.filter((_, idx) => !deleteIndices.has(idx));

    const generator = new PatchGenerator();
    const start = performance.now();
    const ops = generator.generate(oldAst, newAst);
    const elapsed = performance.now() - start;

    console.log(`[Benchmark] Delete 10 items: ${elapsed.toFixed(2)}ms (${ops.length} ops)`);
    assert.ok(elapsed < 50, `Diff took ${elapsed}ms, expected sub-50ms`);
    assert.strictEqual(ops.length, 10, 'Should generate exactly 10 REMOVE_CHILD ops');
    assert.ok(ops.every(op => op.operation === PatchOperationType.REMOVE_CHILD));
  });

  test('Benchmark: Reverse 1,000 siblings', () => {
    const { root: oldAst, items } = create1000List();
    const newAst: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc);
    newAst.id = 'bench-root';
    newAst.children = [...items].reverse();

    const generator = new PatchGenerator();
    const start = performance.now();
    const ops = generator.generate(oldAst, newAst);
    const elapsed = performance.now() - start;

    console.log(`[Benchmark] Reverse list: ${elapsed.toFixed(2)}ms (${ops.length} ops)`);
    assert.ok(elapsed < 100, `Diff took ${elapsed}ms, expected sub-100ms for full list reversal`);
    assert.ok(ops.every(op => op.operation === PatchOperationType.MOVE_CHILD));
  });
});
