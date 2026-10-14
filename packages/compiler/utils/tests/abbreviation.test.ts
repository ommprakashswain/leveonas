import { describe, test } from 'node:test';
import assert from 'node:assert';
import {
  abbreviate,
  CANONICAL_ELEMENT_MAPPINGS,
  CANONICAL_ATTRIBUTE_MAPPINGS,
  CANONICAL_FRAMEWORK_MAPPINGS,
} from '../abbreviation';

describe('LM Canonical Abbreviation Function', () => {
  test('should correctly abbreviate standard HTML elements', () => {
    assert.strictEqual(abbreviate('div'), 'di');
    assert.strictEqual(abbreviate('button'), 'bo');
    assert.strictEqual(abbreviate('section'), 'so');
    assert.strictEqual(abbreviate('article'), 'al');
    assert.strictEqual(abbreviate('aside'), 'ad');
    assert.strictEqual(abbreviate('header'), 'he');
    assert.strictEqual(abbreviate('footer'), 'fe');
    assert.strictEqual(abbreviate('nav'), 'na');
    assert.strictEqual(abbreviate('main'), 'mi');
    assert.strictEqual(abbreviate('span'), 'sa');
    assert.strictEqual(abbreviate('input'), 'iu');
    assert.strictEqual(abbreviate('label'), 'le');
    assert.strictEqual(abbreviate('table'), 'tl');
    assert.strictEqual(abbreviate('canvas'), 'cu');
    assert.strictEqual(abbreviate('form'), 'fr');
  });

  test('should correctly abbreviate standard HTML attributes', () => {
    assert.strictEqual(abbreviate('class'), 'cs');
    assert.strictEqual(abbreviate('href'), 'hr');
    assert.strictEqual(abbreviate('id'), 'id');
    assert.strictEqual(abbreviate('src'), 'sr');
    assert.strictEqual(abbreviate('type'), 'tp');
    assert.strictEqual(abbreviate('placeholder'), 'pe');
    assert.strictEqual(abbreviate('name'), 'nm');
    assert.strictEqual(abbreviate('value'), 'vu');
  });

  test('should correctly abbreviate framework/JS identifiers', () => {
    assert.strictEqual(abbreviate('onClick'), 'oc');
    assert.strictEqual(abbreviate('onChange'), 'og');
    assert.strictEqual(abbreviate('className'), 'cm');
  });

  test('should verify canonical abbreviations and reject incorrect legacy abbreviations', () => {
    assert.strictEqual(abbreviate('class'), 'cs');
    assert.strictEqual(abbreviate('className'), 'cm');
    assert.strictEqual(abbreviate('onClick'), 'oc');
    assert.strictEqual(abbreviate('onChange'), 'og');

    // Verify ce is NOT treated as abbreviation for className
    assert.notStrictEqual(abbreviate('className'), 'ce');
    // Verify oe is NOT treated as abbreviation for onChange
    assert.notStrictEqual(abbreviate('onChange'), 'oe');
  });

  test('should leave heading tags h1-h6 unchanged', () => {
    assert.strictEqual(abbreviate('h1'), 'h1');
    assert.strictEqual(abbreviate('h2'), 'h2');
    assert.strictEqual(abbreviate('h3'), 'h3');
    assert.strictEqual(abbreviate('h4'), 'h4');
    assert.strictEqual(abbreviate('h5'), 'h5');
    assert.strictEqual(abbreviate('h6'), 'h6');
  });

  test('should leave 1-2 character tags unchanged', () => {
    assert.strictEqual(abbreviate('a'), 'a');
    assert.strictEqual(abbreviate('p'), 'p');
    assert.strictEqual(abbreviate('b'), 'b');
    assert.strictEqual(abbreviate('i'), 'i');
    assert.strictEqual(abbreviate('id'), 'id');
  });

  test('should handle empty or edge strings gracefully', () => {
    assert.strictEqual(abbreviate(''), '');
  });

  test('dictionary maps match abbreviate() result deterministically', () => {
    for (const [key, expected] of Object.entries(CANONICAL_ELEMENT_MAPPINGS)) {
      assert.strictEqual(abbreviate(key), expected, `Mismatch for element: ${key}`);
    }

    for (const [key, expected] of Object.entries(CANONICAL_ATTRIBUTE_MAPPINGS)) {
      assert.strictEqual(abbreviate(key), expected, `Mismatch for attribute: ${key}`);
    }

    for (const [key, expected] of Object.entries(CANONICAL_FRAMEWORK_MAPPINGS)) {
      assert.strictEqual(abbreviate(key), expected, `Mismatch for framework prop: ${key}`);
    }
  });

  test('should leave unknown identifiers unchanged to preserve application/framework semantics', () => {
    assert.strictEqual(abbreviate('useAuthenticationState'), 'useAuthenticationState');
    assert.strictEqual(abbreviate('handleSubmit'), 'handleSubmit');
    assert.strictEqual(abbreviate('myCustomComponent'), 'myCustomComponent');
    assert.strictEqual(abbreviate('UserCard'), 'UserCard');
    assert.strictEqual(abbreviate('someRandomAttribute'), 'someRandomAttribute');
    assert.strictEqual(abbreviate('customElement'), 'customElement');
    assert.strictEqual(abbreviate('useState'), 'useState');
    assert.strictEqual(abbreviate('useEffect'), 'useEffect');
  });

  test('should never produce old arbitrary abbreviations', () => {
    // Assert against legacy incorrect abbreviations
    assert.notStrictEqual(abbreviate('nav'), 'nv');
    assert.notStrictEqual(abbreviate('span'), 'sp');
    assert.notStrictEqual(abbreviate('input'), 'it');
    assert.notStrictEqual(abbreviate('href'), 'hf');
    assert.notStrictEqual(abbreviate('src'), 'sc');
    assert.notStrictEqual(abbreviate('onClick'), 'ok');
    assert.notStrictEqual(abbreviate('main'), 'mn');
    assert.notStrictEqual(abbreviate('form'), 'fm');
    assert.notStrictEqual(abbreviate('canvas'), 'ca');
    assert.notStrictEqual(abbreviate('value'), 've');
  });
});
