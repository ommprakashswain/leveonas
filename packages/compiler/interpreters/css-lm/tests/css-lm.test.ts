import test from 'node:test';
import assert from 'node:assert';
import { CSSLMInterpreter } from '../interpreter';
import { encodeCSSProperty, decodeCSSProperty, CSS_PROPERTY_ABBREVIATIONS } from '../vocabulary';
import { serializeCSSStyleSheet, serializeCSSRule } from '../serializer';
import { validateCSSAST } from '../validator';
import { diffCSSStyleSheets } from '../../../../runtime/incremental/patch-generator/css-diff';
import { PatchOperationType } from '../../../../runtime/incremental/patch-generator/types';
import { CSSPatchApplier } from '../../../../runtime/incremental/patch-executor/css-applier';
import { DOMPatchApplier } from '../../../../runtime/incremental/patch-executor/dom-applier';
import { LMGenerationPipeline } from '../../../pipeline/generation-pipeline';

// 1. Vocabulary & Abbreviations Round-Trip
test('CSS-LM Vocabulary: canonical encoding, decoding and round-tripping', () => {
  // Common property abbreviations
  assert.strictEqual(decodeCSSProperty('bg'), 'background');
  assert.strictEqual(decodeCSSProperty('bgc'), 'background-color');
  assert.strictEqual(decodeCSSProperty('c'), 'color');
  assert.strictEqual(decodeCSSProperty('p'), 'padding');
  assert.strictEqual(decodeCSSProperty('m'), 'margin');
  assert.strictEqual(decodeCSSProperty('br'), 'border-radius');
  assert.strictEqual(decodeCSSProperty('w'), 'width');
  assert.strictEqual(decodeCSSProperty('h'), 'height');
  assert.strictEqual(decodeCSSProperty('d'), 'display');
  assert.strictEqual(decodeCSSProperty('pos'), 'position');
  assert.strictEqual(decodeCSSProperty('op'), 'opacity');
  assert.strictEqual(decodeCSSProperty('tr'), 'transform');
  assert.strictEqual(decodeCSSProperty('ts'), 'transition');
  assert.strictEqual(decodeCSSProperty('an'), 'animation');

  // Round-trip encoding -> decoding
  for (const [abbr, prop] of Object.entries(CSS_PROPERTY_ABBREVIATIONS)) {
    assert.strictEqual(decodeCSSProperty(abbr), prop);
  }

  // Custom CSS variables remain intact
  assert.strictEqual(encodeCSSProperty('--primary-color'), '--primary-color');
  assert.strictEqual(decodeCSSProperty('--primary-color'), '--primary-color');

  // Standard properties not in dictionary remain unchanged
  assert.strictEqual(decodeCSSProperty('container-type'), 'container-type');
});

// 2. Basic Rule & Declaration Parsing
test('CSS-LM Interpreter: parses basic selectors and declarations', () => {
  const code = `
    rule(".card")(
      bg:#ffffff
      p:20px
      br:12px
      c:#111827
    )
  `;
  const ast = CSSLMInterpreter.parse(code);
  assert.strictEqual(ast.rules.length, 1);
  const rule: any = ast.rules[0];
  assert.strictEqual(rule.kind, 'CSSRule');
  assert.strictEqual(rule.selector, '.card');
  assert.strictEqual(rule.declarations.length, 4);

  const declMap = new Map(rule.declarations.map((d: any) => [d.property, d.value]));
  assert.strictEqual(declMap.get('background'), '#ffffff');
  assert.strictEqual(declMap.get('padding'), '20px');
  assert.strictEqual(declMap.get('border-radius'), '12px');
  assert.strictEqual(declMap.get('color'), '#111827');
});

// 3. Direct Selector syntax (.card(...)) and parenthesized declarations
test('CSS-LM Interpreter: parses direct selector syntax and paren declarations', () => {
  const code = `
    .btn-primary(
      bg(#6366f1)
      c(#ffffff)
      p(8px 16px)
      br(6px)
      d(inline-flex)
      ai(center)
      jc(center)
    )
  `;
  const ast = CSSLMInterpreter.parse(code);
  assert.strictEqual(ast.rules.length, 1);
  const rule: any = ast.rules[0];
  assert.strictEqual(rule.selector, '.btn-primary');
  assert.strictEqual(rule.declarations.length, 7);

  const declMap = new Map(rule.declarations.map((d: any) => [d.property, d.value]));
  assert.strictEqual(declMap.get('background'), '#6366f1');
  assert.strictEqual(declMap.get('color'), '#ffffff');
  assert.strictEqual(declMap.get('padding'), '8px 16px');
  assert.strictEqual(declMap.get('display'), 'inline-flex');
  assert.strictEqual(declMap.get('align-items'), 'center');
  assert.strictEqual(declMap.get('justify-content'), 'center');
});

// 4. Multiple Selectors, Pseudo-classes, Pseudo-elements
test('CSS-LM Interpreter: parses multiple selectors, pseudo-classes, pseudo-elements', () => {
  const code = `
    h1, h2, .title(
      fw:700
      lh:1.2
      ls:-0.02em
    )

    .card:hover(
      bg:#f9fafb
      bxs:0 10px 15px -3px rgba(0,0,0,0.1)
    )

    .button::after(
      ct:""
      d:block
      w:100%
      h:2px
    )
  `;
  const ast = CSSLMInterpreter.parse(code);
  assert.strictEqual(ast.rules.length, 3);
  assert.strictEqual((ast.rules[0] as any).selector, 'h1, h2, .title');
  assert.strictEqual((ast.rules[1] as any).selector, '.card:hover');
  assert.strictEqual((ast.rules[2] as any).selector, '.button::after');
});

// 5. CSS Variables and :root block
test('CSS-LM Interpreter: parses CSS variables and :root definitions', () => {
  const code = `
    :root(
      --brand:#4f46e5
      --brand-light:#818cf8
      --surface:#ffffff
      --text:#0f172a
    )

    .badge(
      bg:var(--brand-light)
      c:var(--brand)
    )
  `;
  const ast = CSSLMInterpreter.parse(code);
  assert.strictEqual(ast.rules.length, 2);

  const rootRule: any = ast.rules[0];
  assert.strictEqual(rootRule.selector, ':root');
  assert.strictEqual(rootRule.declarations.length, 4);
  assert.strictEqual(rootRule.declarations[0].property, '--brand');
  assert.strictEqual(rootRule.declarations[0].value, '#4f46e5');

  const badgeRule: any = ast.rules[1];
  assert.strictEqual(badgeRule.declarations[0].value, 'var(--brand-light)');
});

// 6. !important Modifier
test('CSS-LM Interpreter: handles !important modifier on declarations', () => {
  const code = `
    .override(
      c:#ff0000 !important
      bg:#000000!important
      d:none
    )
  `;
  const ast = CSSLMInterpreter.parse(code);
  const rule: any = ast.rules[0];
  assert.strictEqual(rule.declarations[0].important, true);
  assert.strictEqual(rule.declarations[0].value, '#ff0000');
  assert.strictEqual(rule.declarations[1].important, true);
  assert.strictEqual(rule.declarations[1].value, '#000000');
  assert.strictEqual(rule.declarations[2].important, false);
});

// 7. Functions with nested parentheses (calc, rgb, clamp, linear-gradient)
test('CSS-LM Interpreter: preserves nested parens in functions', () => {
  const code = `
    .hero(
      w:calc(100% - 40px)
      h:clamp(300px, 50vh, 600px)
      bg:linear-gradient(135deg, rgba(79, 70, 229, 0.9), rgba(129, 140, 248, 0.8))
    )
  `;
  const ast = CSSLMInterpreter.parse(code);
  const rule: any = ast.rules[0];
  const declMap = new Map(rule.declarations.map((d: any) => [d.property, d.value]));

  assert.strictEqual(declMap.get('width'), 'calc(100% - 40px)');
  assert.strictEqual(declMap.get('height'), 'clamp(300px, 50vh, 600px)');
  assert.strictEqual(
    declMap.get('background'),
    'linear-gradient(135deg, rgba(79, 70, 229, 0.9), rgba(129, 140, 248, 0.8))'
  );
});

// 8. Media Queries
test('CSS-LM Interpreter: parses media queries', () => {
  const code = `
    @media (max-width: 768px)(
      .container(
        p:12px
        w:100%
      )
      .sidebar(
        d:none
      )
    )
  `;
  const ast = CSSLMInterpreter.parse(code);
  assert.strictEqual(ast.rules.length, 1);
  const media: any = ast.rules[0];
  assert.strictEqual(media.kind, 'CSSMediaRule');
  assert.strictEqual(media.query, 'max-width: 768px');
  assert.strictEqual(media.rules.length, 2);
  assert.strictEqual(media.rules[0].selector, '.container');
  assert.strictEqual(media.rules[1].selector, '.sidebar');
});

// 9. Keyframes
test('CSS-LM Interpreter: parses @keyframes animations', () => {
  const code = `
    @keyframes fadeIn(
      from(
        op:0
        tr:translateY(10px)
      )
      to(
        op:1
        tr:translateY(0)
      )
    )
  `;
  const ast = CSSLMInterpreter.parse(code);
  assert.strictEqual(ast.rules.length, 1);
  const kf: any = ast.rules[0];
  assert.strictEqual(kf.kind, 'CSSKeyframesRule');
  assert.strictEqual(kf.name, 'fadeIn');
  assert.strictEqual(kf.keyframes.length, 2);
  assert.strictEqual(kf.keyframes[0].keyframeSelector, 'from');
  assert.strictEqual(kf.keyframes[0].declarations[0].property, 'opacity');
  assert.strictEqual(kf.keyframes[0].declarations[0].value, '0');
  assert.strictEqual(kf.keyframes[1].keyframeSelector, 'to');
  assert.strictEqual(kf.keyframes[1].declarations[0].value, '1');
});

// 10. Incremental Streaming across arbitrary chunks
test('CSS-LM Interpreter: parses across arbitrary stream chunks', () => {
  const chunks = [
    'rule',
    '(".',
    'hero-b',
    'ox")',
    '(',
    '\n  b',
    'g:#1',
    'e293',
    'b\n  ',
    'p:32',
    'px\n',
    '  br',
    ':16px',
    '\n)',
  ];

  const interpreter = new CSSLMInterpreter();
  for (const chunk of chunks) {
    interpreter.write(chunk);
  }
  const ast = interpreter.end();

  assert.strictEqual(ast.rules.length, 1);
  const rule: any = ast.rules[0];
  assert.strictEqual(rule.selector, '.hero-box');
  assert.strictEqual(rule.declarations.length, 3);
  assert.strictEqual(rule.declarations[0].property, 'background');
  assert.strictEqual(rule.declarations[0].value, '#1e293b');
  assert.strictEqual(rule.declarations[1].property, 'padding');
  assert.strictEqual(rule.declarations[1].value, '32px');
  assert.strictEqual(rule.declarations[2].property, 'border-radius');
  assert.strictEqual(rule.declarations[2].value, '16px');
});

// 11. Deterministic CSS Serialization
test('CSS-LM Serializer: generates clean standard CSS', () => {
  const code = `
    .card(
      bg:#ffffff
      p:20px
      br:8px
    )

    @media (max-width: 600px)(
      .card(
        p:10px
      )
    )
  `;
  const ast = CSSLMInterpreter.parse(code);
  const css = serializeCSSStyleSheet(ast);

  assert.ok(css.includes('.card {\n  background: #ffffff;\n  padding: 20px;\n  border-radius: 8px;\n}'));
  assert.ok(css.includes('@media (max-width: 600px) {'));
  assert.ok(css.includes('padding: 10px;'));
});

// 12. CSS Diff Engine & Minimal Patch Generation
test('CSS Diff Engine: emits fine-grained incremental patches', () => {
  const ast1 = CSSLMInterpreter.parse(`
    .card(
      bg:#ffffff
      p:20px
    )
  `);

  const ast2 = CSSLMInterpreter.parse(`
    .card(
      bg:#000000
      p:20px
      br:12px
    )
    .title(
      fs:24px
    )
  `);

  const patches = diffCSSStyleSheets(ast1, ast2);

  // Expect: 1 declaration update (bg changed), 1 declaration add (br added), 1 rule create (.title added)
  const types = patches.map((p) => p.operation);
  assert.ok(types.includes(PatchOperationType.UPDATE_CSS_DECLARATION));
  assert.ok(types.includes(PatchOperationType.ADD_CSS_DECLARATION));
  assert.ok(types.includes(PatchOperationType.CREATE_CSS_RULE));
});

// 13. CSSPatchApplier integration with DOMPatchApplier
test('DOMPatchApplier: applies CSS patches to style element', () => {
  // Mock simple DOM document
  const mockStyle: any = {
    id: 'leveonas-css',
    textContent: '',
  };
  const mockHead: any = {
    appendChild: (el: any) => {},
  };
  const mockDoc: any = {
    getElementById: (id: string) => (id === 'leveonas-css' ? mockStyle : null),
    createElement: (tag: string) => (tag === 'style' ? mockStyle : {}),
    head: mockHead,
    body: {},
  };

  const applier = new DOMPatchApplier(null, mockDoc);

  const ast1 = CSSLMInterpreter.parse(`.box(\n  bg:#fff\n  p:10px\n)`);
  const initialPatches = diffCSSStyleSheets(null, ast1);
  applier.apply(initialPatches);

  assert.ok(mockStyle.textContent.includes('.box'));
  assert.ok(mockStyle.textContent.includes('background: #fff;'));
  assert.ok(mockStyle.textContent.includes('padding: 10px;'));

  // Update declaration
  const ast2 = CSSLMInterpreter.parse(`.box(\n  bg:#000\n  p:10px\n)`);
  const updatePatches = diffCSSStyleSheets(ast1, ast2);
  applier.apply(updatePatches);

  assert.ok(mockStyle.textContent.includes('background: #000;'));
});

// 14. Full Pipeline streaming with HTML and CSS blocks
test('LMGenerationPipeline: streams both HTML and CSS blocks and computes patches', () => {
  const patchesReceived: any[] = [];
  const pipeline = new LMGenerationPipeline({
    onPatch: (patches) => {
      patchesReceived.push(...patches);
    },
  });

  const streamChunks = [
    '<HT',
    'ML>\n',
    'di(cs(container)\n',
    '  h1(Hello Leveonas)\n',
    ')\n',
    '</HTML>\n',
    '<CS',
    'S>\n',
    '.container(\n',
    '  bg:#111\n',
    '  p:24px\n',
    ')\n',
    'h1(\n',
    '  c:#fff\n',
    '  fs:32px\n',
    ')\n',
    '</CSS>',
  ];

  for (const chunk of streamChunks) {
    pipeline.write(chunk);
  }
  pipeline.end();

  assert.ok(patchesReceived.length > 0);

  // Check that both DOM nodes and CSS rules were produced in the patch stream
  const ops = patchesReceived.map((p) => p.operation);
  assert.ok(ops.includes(PatchOperationType.CREATE_NODE) || ops.includes(PatchOperationType.INSERT_CHILD));
  assert.ok(ops.includes(PatchOperationType.CREATE_CSS_RULE));

  const cssAST = pipeline.getCurrentCSSAST();
  assert.strictEqual(cssAST.rules.length, 2);
  assert.strictEqual((cssAST.rules[0] as any).selector, '.container');
  assert.strictEqual((cssAST.rules[1] as any).selector, 'h1');
});
