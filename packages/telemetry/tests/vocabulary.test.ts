import test from 'node:test';
import assert from 'node:assert/strict';
import {
  KNOWN_ELEMENT_ABBREVIATIONS,
  KNOWN_ATTRIBUTE_ABBREVIATIONS,
  isKnownElementAbbreviation,
  isKnownAttributeAbbreviation,
  expandElementAbbreviation,
  expandAttributeAbbreviation,
} from '../../compiler/interpreters/html-lm/vocabulary';
import { BASELINE_SYSTEM_INSTRUCTION } from '../fixtures';

test('1. Element abbreviations match canonical LM v1 specification', () => {
  const expectedElements: Record<string, string> = {
    di: 'div',
    bo: 'button',
    so: 'section',
    al: 'article',
    ad: 'aside',
    he: 'header',
    fe: 'footer',
    na: 'nav',
    mi: 'main',
    sa: 'span',
    iu: 'input',
    le: 'label',
    tl: 'table',
    cu: 'canvas',
    fr: 'form',
  };

  for (const [abbr, fullName] of Object.entries(expectedElements)) {
    assert.equal(KNOWN_ELEMENT_ABBREVIATIONS[abbr], fullName, `Element ${abbr} should map to ${fullName}`);
    assert.equal(isKnownElementAbbreviation(abbr), true);
    assert.equal(expandElementAbbreviation(abbr), fullName);
  }
});

test('2. Attribute abbreviations match canonical LM v1 specification', () => {
  const expectedAttributes: Record<string, string> = {
    cs: 'class',
    hr: 'href',
    id: 'id',
    sr: 'src',
    tp: 'type',
    pe: 'placeholder',
    nm: 'name',
    vu: 'value',
    oc: 'onClick',
    og: 'onChange',
    cm: 'className',
  };

  for (const [abbr, fullName] of Object.entries(expectedAttributes)) {
    assert.equal(KNOWN_ATTRIBUTE_ABBREVIATIONS[abbr], fullName, `Attribute ${abbr} should map to ${fullName}`);
    assert.equal(isKnownAttributeAbbreviation(abbr), true);
    assert.equal(expandAttributeAbbreviation(abbr), fullName);
  }
});

test('3. BASELINE_SYSTEM_INSTRUCTION mentions canonical abbreviations only', () => {
  assert.ok(BASELINE_SYSTEM_INSTRUCTION.includes('div->di'));
  assert.ok(BASELINE_SYSTEM_INSTRUCTION.includes('button->bo'));
  assert.ok(BASELINE_SYSTEM_INSTRUCTION.includes('section->so'));
  assert.ok(BASELINE_SYSTEM_INSTRUCTION.includes('class->cs'));
  assert.ok(BASELINE_SYSTEM_INSTRUCTION.includes('className->cm'));
  assert.ok(BASELINE_SYSTEM_INSTRUCTION.includes('onClick->oc'));
  assert.ok(BASELINE_SYSTEM_INSTRUCTION.includes('onChange->og'));
});
