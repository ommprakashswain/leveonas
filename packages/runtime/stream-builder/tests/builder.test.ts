import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { StreamBuilder } from '../builder';
import { BuilderEventType } from '../events';

describe('StreamBuilder', () => {
  it('should buffer chunks and recover syntax', () => {
    const builder = new StreamBuilder();
    const fragments: string[] = [];
    
    builder.onEvent = (e) => {
      if (e.type === BuilderEventType.FRAGMENT_READY) {
        fragments.push(e.payload.fragment.recovered);
      }
    };

    builder.push('Page {');
    assert.strictEqual(fragments[0], 'Page {}');
    
    builder.push(' Section { Text { "Hello');
    assert.strictEqual(fragments[1], 'Page { Section { Text { "Hello"}}}');
    
    builder.push(' World" } } }');
    assert.strictEqual(fragments[2], 'Page { Section { Text { "Hello World" } } }');
  });

  it('should complete', () => {
    const builder = new StreamBuilder();
    let completed = false;
    builder.onEvent = (e) => {
      if (e.type === BuilderEventType.STREAM_COMPLETED) {
        completed = true;
      }
    };
    builder.complete();
    assert.strictEqual(completed, true);
  });
});
