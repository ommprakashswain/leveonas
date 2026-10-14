import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { PatchSerializer } from '../serializer';
import { insertNode, updateText } from '../operations';
import { PatchOperationType } from '../types';

describe('Patch Serializer', () => {
  test('should serialize and deserialize operations', () => {
    const ops = [
      insertNode('node1', 'parent1', 0, { kind: 'Button' }),
      updateText('node2', 'New Text')
    ];

    const json = PatchSerializer.toJSON(ops);
    const parsed = PatchSerializer.fromJSON(json);

    assert.strictEqual(parsed.length, 2);
    assert.strictEqual(parsed[0].operation, PatchOperationType.INSERT_CHILD);
    assert.strictEqual(parsed[0].nodeId, 'node1');
    assert.strictEqual(parsed[0].payload.kind, 'Button');

    assert.strictEqual(parsed[1].operation, PatchOperationType.UPDATE_TEXT);
    assert.strictEqual(parsed[1].nodeId, 'node2');
    assert.strictEqual(parsed[1].payload.text, 'New Text');
  });
});
