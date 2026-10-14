import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { HTMLLMInterpreter } from '../../../compiler/interpreters/html-lm';
import { PatchGenerator } from '../patch-generator/generator';
import { PatchOperationType } from '../patch-generator/types';
import { PatchSerializer } from '../patch-generator/serializer';
import { PatchExecutor } from '../patch-executor/executor';

describe('Patch Generator v1 - Language & Incremental Diff Engine', () => {
  const generator = new PatchGenerator();

  test('Case 1: Identical ASTs produce exactly zero patches (No-op)', () => {
    const source = 'di(cs(hero) h1(Leveonas) p(Build faster))';
    const ast1 = HTMLLMInterpreter.parse(source);
    const ast2 = HTMLLMInterpreter.parse(source);

    const patches = generator.generate(ast1, ast2);
    assert.strictEqual(patches.length, 0, 'Should produce 0 patches for identical ASTs');
  });

  test('Case 2: Text update generates UPDATE_TEXT patch', () => {
    const initialLM = 'di(cs(hero) h1(Leveonas) p(Hello))';
    const updatedLM = 'di(cs(hero) h1(Leveonas) p(Hello Leveonas))';

    const ast1 = HTMLLMInterpreter.parse(initialLM);
    const ast2 = HTMLLMInterpreter.parse(updatedLM);

    const patches = generator.generate(ast1, ast2);
    assert.strictEqual(patches.length, 1);
    assert.strictEqual(patches[0].operation, PatchOperationType.UPDATE_TEXT);
    assert.strictEqual(patches[0].payload.text, 'Hello Leveonas');

    // Applying to in-memory AST
    const executor = new PatchExecutor(ast1);
    executor.execute(patches);
    const updatedP = (ast1.children[0] as any).children[1];
    assert.strictEqual(updatedP.children[0].value, 'Hello Leveonas');
  });

  test('Case 3: Attribute addition generates SET_ATTRIBUTE patch', () => {
    const initialLM = 'di(cs(hero))';
    const updatedLM = 'di(cs(hero) id(main))';

    const ast1 = HTMLLMInterpreter.parse(initialLM);
    const ast2 = HTMLLMInterpreter.parse(updatedLM);

    const patches = generator.generate(ast1, ast2);
    assert.strictEqual(patches.length, 1);
    assert.strictEqual(patches[0].operation, PatchOperationType.SET_ATTRIBUTE);
    assert.strictEqual(patches[0].payload.name, 'id');
    assert.strictEqual(patches[0].payload.value, 'main');
  });

  test('Case 4: Attribute modification generates SET_ATTRIBUTE patch', () => {
    const initialLM = 'di(cs(hero))';
    const updatedLM = 'di(cs(hero active))';

    const ast1 = HTMLLMInterpreter.parse(initialLM);
    const ast2 = HTMLLMInterpreter.parse(updatedLM);

    const patches = generator.generate(ast1, ast2);
    assert.strictEqual(patches.length, 1);
    assert.strictEqual(patches[0].operation, PatchOperationType.SET_ATTRIBUTE);
    assert.strictEqual(patches[0].payload.name, 'class');
    assert.strictEqual(patches[0].payload.value, 'hero active');
  });

  test('Case 5: Attribute removal generates REMOVE_ATTRIBUTE patch', () => {
    const initialLM = 'di(cs(hero) id(main))';
    const updatedLM = 'di(cs(hero))';

    const ast1 = HTMLLMInterpreter.parse(initialLM);
    const ast2 = HTMLLMInterpreter.parse(updatedLM);

    const patches = generator.generate(ast1, ast2);
    assert.strictEqual(patches.length, 1);
    assert.strictEqual(patches[0].operation, PatchOperationType.REMOVE_ATTRIBUTE);
    assert.strictEqual(patches[0].payload.name, 'id');
  });

  test('Case 6: Child insertion generates INSERT_CHILD patch', () => {
    const initialLM = 'di(h1(A) p(B))';
    const updatedLM = 'di(h1(A) p(B) bo(C))';

    const ast1 = HTMLLMInterpreter.parse(initialLM);
    const ast2 = HTMLLMInterpreter.parse(updatedLM);

    const patches = generator.generate(ast1, ast2);
    assert.strictEqual(patches.length, 1);
    assert.ok(
      patches[0].operation === PatchOperationType.INSERT_CHILD ||
      patches[0].operation === PatchOperationType.INSERT_NODE
    );
    assert.strictEqual(patches[0].index, 2);
  });

  test('Case 7: Child removal generates REMOVE_CHILD patch', () => {
    const initialLM = 'di(h1(A) p(B))';
    const updatedLM = 'di(h1(A))';

    const ast1 = HTMLLMInterpreter.parse(initialLM);
    const ast2 = HTMLLMInterpreter.parse(updatedLM);

    const patches = generator.generate(ast1, ast2);
    assert.strictEqual(patches.length, 1);
    assert.ok(
      patches[0].operation === PatchOperationType.REMOVE_CHILD ||
      patches[0].operation === PatchOperationType.REMOVE_NODE
    );
  });

  test('Case 8: Child movement generates MOVE_CHILD patch', () => {
    const initialLM = 'di(h1(A) p(B) bo(C))';
    const updatedLM = 'di(h1(A) bo(C) p(B))';

    const ast1 = HTMLLMInterpreter.parse(initialLM);
    const ast2 = HTMLLMInterpreter.parse(updatedLM);

    const patches = generator.generate(ast1, ast2);
    assert.ok(
      patches.some(
        p => p.operation === PatchOperationType.MOVE_CHILD || p.operation === PatchOperationType.MOVE_NODE
      ),
      'Should detect child movement'
    );
  });

  test('Case 9: Node replacement when tag changes', () => {
    const initialLM = 'so(cs(hero) h1(Title))';
    const updatedLM = 'di(cs(hero) h1(Title))';

    const ast1 = HTMLLMInterpreter.parse(initialLM);
    const ast2 = HTMLLMInterpreter.parse(updatedLM);

    const patches = generator.generate(ast1, ast2);
    assert.strictEqual(patches.length, 1);
    assert.strictEqual(patches[0].operation, PatchOperationType.REPLACE_NODE);
  });

  test('Case 10: Determinism - same transition generates identical patches', () => {
    const lmA = 'di(cs(box) p(Old Text))';
    const lmB = 'di(cs(box active) p(New Text) bo(Click))';

    const astA1 = HTMLLMInterpreter.parse(lmA);
    const astB1 = HTMLLMInterpreter.parse(lmB);

    const astA2 = HTMLLMInterpreter.parse(lmA);
    const astB2 = HTMLLMInterpreter.parse(lmB);

    const patches1 = generator.generate(astA1, astB1);
    const patches2 = generator.generate(astA2, astB2);

    const json1 = PatchSerializer.toJSON(patches1);
    const json2 = PatchSerializer.toJSON(patches2);

    assert.strictEqual(
      patches1.map(p => `${p.operation}:${p.payload?.name || p.payload?.text || ''}`).join(','),
      patches2.map(p => `${p.operation}:${p.payload?.name || p.payload?.text || ''}`).join(',')
    );
  });

  test('Case 11: Patch serialization and deserialization', () => {
    const initialLM = 'di(cs(card) p(Draft))';
    const updatedLM = 'di(cs(card active) p(Published) bo(Share))';

    const ast1 = HTMLLMInterpreter.parse(initialLM);
    const ast2 = HTMLLMInterpreter.parse(updatedLM);

    const patches = generator.generate(ast1, ast2);
    const json = PatchSerializer.toJSON(patches);
    const compactJson = PatchSerializer.toCompactJSON(patches);

    const deserializedStandard = PatchSerializer.fromJSON(json);
    const deserializedCompact = PatchSerializer.fromJSON(compactJson);

    assert.strictEqual(deserializedStandard.length, patches.length);
    assert.strictEqual(deserializedCompact.length, patches.length);
    assert.strictEqual(deserializedCompact[0].operation, patches[0].operation);
  });
});
