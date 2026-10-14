import test from 'node:test';
import assert from 'node:assert';
import { HTMLLMInterpreter } from '../interpreter';
import { resolveAttributeName, KNOWN_ATTRIBUTE_ABBREVIATIONS } from '../vocabulary';
import { ASTNodeKind } from '../../../ast/types';
import { ComponentNode, GenericComponentNode, LiteralNode, PropertyNode } from '../../../ast/nodes';
import { HtmlRenderer } from '../../../renderers/html/renderer';

test('HTML-LM Interpreter: Basic Elements', () => {
  const ast = HTMLLMInterpreter.parse('di()');
  assert.strictEqual(ast.kind, ASTNodeKind.Root);
  assert.strictEqual(ast.children.length, 1);
  const divNode = ast.children[0] as ComponentNode;
  assert.strictEqual(divNode.kind, ASTNodeKind.Container);
  assert.strictEqual(divNode.children.length, 0);
  assert.strictEqual(divNode.properties.length, 0);
});

test('HTML-LM Interpreter: Elements with Text', () => {
  const ast = HTMLLMInterpreter.parse('h1(Leveonas)');
  assert.strictEqual(ast.children.length, 1);
  const h1Node = ast.children[0] as GenericComponentNode;
  assert.strictEqual(h1Node.kind, ASTNodeKind.GenericComponent);
  assert.strictEqual(h1Node.name, 'h1');
  assert.strictEqual(h1Node.children.length, 1);
  const textNode = h1Node.children[0] as LiteralNode;
  assert.strictEqual(textNode.kind, ASTNodeKind.Literal);
  assert.strictEqual(textNode.value, 'Leveonas');
});

test('HTML-LM Interpreter: Attributes and Abbreviations', () => {
  const ast = HTMLLMInterpreter.parse('bo(cs(primary) id(start) tp(button) Get Started)');
  assert.strictEqual(ast.children.length, 1);
  const btn = ast.children[0] as ComponentNode;
  assert.strictEqual(btn.kind, ASTNodeKind.Button);
  
  // Properties: class, id, type
  const propMap = new Map(btn.properties.map(p => [p.name, p.value?.value]));
  assert.strictEqual(propMap.get('class'), 'primary');
  assert.strictEqual(propMap.get('id'), 'start');
  assert.strictEqual(propMap.get('type'), 'button');

  // Text child
  assert.strictEqual(btn.children.length, 1);
  assert.strictEqual((btn.children[0] as LiteralNode).value, 'Get Started');
});

test('HTML-LM Interpreter: Boolean Attributes', () => {
  const ast = HTMLLMInterpreter.parse('iu(disabled())');
  assert.strictEqual(ast.children.length, 1);
  const input = ast.children[0] as ComponentNode;
  assert.strictEqual(input.kind, ASTNodeKind.Input);
  assert.strictEqual(input.properties.length, 1);
  assert.strictEqual(input.properties[0].name, 'disabled');
  assert.strictEqual(input.properties[0].value?.value, true);
});

test('HTML-LM Interpreter: Quoted Attribute Values', () => {
  const ast = HTMLLMInterpreter.parse('di(cs("hero flex items-center") pe(\'Search...\'))');
  const div = ast.children[0] as ComponentNode;
  const propMap = new Map(div.properties.map(p => [p.name, p.value?.value]));
  assert.strictEqual(propMap.get('class'), 'hero flex items-center');
  assert.strictEqual(propMap.get('placeholder'), 'Search...');
});

test('HTML-LM Interpreter: Custom Component Identifiers', () => {
  const ast = HTMLLMInterpreter.parse('UserCard(nm(Alex) Full Stack Engineer)');
  assert.strictEqual(ast.children.length, 1);
  const card = ast.children[0] as GenericComponentNode;
  assert.strictEqual(card.kind, ASTNodeKind.GenericComponent);
  assert.strictEqual(card.name, 'UserCard');
  assert.strictEqual(card.properties[0].name, 'name');
  assert.strictEqual(card.properties[0].value?.value, 'Alex');
  assert.strictEqual((card.children[0] as LiteralNode).value, 'Full Stack Engineer');
});

test('HTML-LM Interpreter: Unicode, Punctuation, and Emojis', () => {
  const p1 = HTMLLMInterpreter.parse('p(Hello, world!)');
  assert.strictEqual(((p1.children[0] as ComponentNode).children[0] as LiteralNode).value, 'Hello, world!');

  const p2 = HTMLLMInterpreter.parse('p(India 🇮🇳)');
  assert.strictEqual(((p2.children[0] as ComponentNode).children[0] as LiteralNode).value, 'India 🇮🇳');

  const p3 = HTMLLMInterpreter.parse('p(100% faster)');
  assert.strictEqual(((p3.children[0] as ComponentNode).children[0] as LiteralNode).value, '100% faster');
});

test('HTML-LM Interpreter: Complex Nested Hierarchy', () => {
  const source = `
di(cs(hero)
  h1(Leveonas)
  p(Build faster with LM)
  bo(cs(primary) Get Started)
)
  `;

  const ast = HTMLLMInterpreter.parse(source);
  assert.strictEqual(ast.children.length, 1);

  const heroDiv = ast.children[0] as ComponentNode;
  assert.strictEqual(heroDiv.kind, ASTNodeKind.Container);
  assert.strictEqual(heroDiv.properties[0].name, 'class');
  assert.strictEqual(heroDiv.properties[0].value?.value, 'hero');

  assert.strictEqual(heroDiv.children.length, 3);

  const h1 = heroDiv.children[0] as GenericComponentNode;
  assert.strictEqual(h1.kind, ASTNodeKind.GenericComponent);
  assert.strictEqual(h1.name, 'h1');
  assert.strictEqual((h1.children[0] as LiteralNode).value, 'Leveonas');

  const p = heroDiv.children[1] as ComponentNode;
  assert.strictEqual(p.kind, ASTNodeKind.Text);
  assert.strictEqual((p.children[0] as LiteralNode).value, 'Build faster with LM');

  const btn = heroDiv.children[2] as ComponentNode;
  assert.strictEqual(btn.kind, ASTNodeKind.Button);
  assert.strictEqual(btn.properties[0].name, 'class');
  assert.strictEqual(btn.properties[0].value?.value, 'primary');
  assert.strictEqual((btn.children[0] as LiteralNode).value, 'Get Started');
});

test('HTML-LM Interpreter: HTML Renderer Integration', () => {
  const source = `
di(cs(hero)
  h1(Leveonas)
  p(Build faster)
)
  `;

  const ast = HTMLLMInterpreter.parse(source);
  const renderer = new HtmlRenderer({ minify: true });
  const html = renderer.render(ast);

  assert.strictEqual(html, '<div class="hero"><h1>Leveonas</h1><p>Build faster</p></div>');
});

test('HTML-LM Interpreter: Streaming chunk invariance (1-char chunks)', () => {
  const source = `di(cs(hero) h1(Leveonas) p(Build faster with LM) bo(cs(primary) Get Started))`;

  const fullAst = HTMLLMInterpreter.parse(source);
  const fullHtml = new HtmlRenderer({ minify: true }).render(fullAst);

  const streamingInterpreter = new HTMLLMInterpreter();
  for (let i = 0; i < source.length; i++) {
    streamingInterpreter.write(source[i]);
  }
  const streamAst = streamingInterpreter.end();
  const streamHtml = new HtmlRenderer({ minify: true }).render(streamAst);

  assert.strictEqual(streamHtml, fullHtml);
});

test('HTML-LM Interpreter: Streaming chunk invariance (Random chunk sizes 1-20)', () => {
  const source = `
di(cs(container)
  na(cs(navbar)
    a(hr(/) Home)
    a(hr(/docs) Documentation)
  )
  so(cs(hero)
    h1(Next Generation Compiler)
    p(Streaming LM interpretation with 100% fidelity 🚀)
    bo(cs(cta) id(btn-start) Start Building)
  )
)
  `;

  const fullAst = HTMLLMInterpreter.parse(source);
  const fullHtml = new HtmlRenderer({ minify: true }).render(fullAst);

  for (let trial = 0; trial < 20; trial++) {
    const streamingInterpreter = new HTMLLMInterpreter();
    let offset = 0;
    while (offset < source.length) {
      const chunkSize = Math.floor(Math.random() * 20) + 1;
      const chunk = source.slice(offset, offset + chunkSize);
      streamingInterpreter.write(chunk);
      offset += chunkSize;
    }
    const streamAst = streamingInterpreter.end();
    const streamHtml = new HtmlRenderer({ minify: true }).render(streamAst);

    assert.strictEqual(streamHtml, fullHtml, `Trial ${trial} failed to match full HTML output`);
  }
});

test('HTML-LM Interpreter: Incomplete stream A (unclosed elements)', () => {
  const source = `di(\n  h1(Leveonas`;
  const interpreter = new HTMLLMInterpreter();
  interpreter.write(source);
  const ast = interpreter.end();
  const diags = interpreter.getDiagnostics();

  // Partial AST is preserved
  assert.strictEqual(ast.children.length, 1);
  const div = ast.children[0] as ComponentNode;
  assert.strictEqual(div.kind, ASTNodeKind.Container);
  assert.strictEqual(div.children.length, 1);
  const h1 = div.children[0] as GenericComponentNode;
  assert.strictEqual(h1.kind, ASTNodeKind.GenericComponent);
  assert.strictEqual(h1.name, 'h1');
  assert.strictEqual((h1.children[0] as LiteralNode).value, 'Leveonas');

  // Diagnostics
  assert(diags.length > 0);
  assert(diags.some(d => d.message.includes('UNCLOSED_ELEMENT') && d.severity === 'error'));
});

test('HTML-LM Interpreter: Incomplete stream B (unclosed attribute)', () => {
  const source = `di(cs(hero`;
  const interpreter = new HTMLLMInterpreter();
  interpreter.write(source);
  const ast = interpreter.end();
  const diags = interpreter.getDiagnostics();

  // Partial AST is preserved
  assert.strictEqual(ast.children.length, 1);
  const div = ast.children[0] as ComponentNode;
  assert.strictEqual(div.kind, ASTNodeKind.Container);
  assert.strictEqual(div.properties.length, 1);
  assert.strictEqual(div.properties[0].name, 'class');
  assert.strictEqual(div.properties[0].value?.value, 'hero');

  // Diagnostics
  assert(diags.some(d => d.message.includes('UNCLOSED_ATTRIBUTE') && d.severity === 'error'));
});

test('HTML-LM Interpreter: Incomplete stream C (unresolved outer elements)', () => {
  const source = `di(\n  so(\n    h1(Hello)`;
  const interpreter = new HTMLLMInterpreter();
  interpreter.write(source);
  const ast = interpreter.end();
  const diags = interpreter.getDiagnostics();

  // Partial AST is preserved
  assert.strictEqual(ast.children.length, 1);
  const div = ast.children[0] as ComponentNode;
  assert.strictEqual(div.children.length, 1);
  const section = div.children[0] as ComponentNode;
  assert.strictEqual(section.children.length, 1);
  const h1 = section.children[0] as GenericComponentNode;
  assert.strictEqual((h1.children[0] as LiteralNode).value, 'Hello');

  // Diagnostics report unresolved outer elements (div and section)
  const unclosed = diags.filter(d => d.message.includes('UNCLOSED_ELEMENT'));
  assert.strictEqual(unclosed.length, 2);
  assert(unclosed.some(d => d.message.includes('div')));
  assert(unclosed.some(d => d.message.includes('section')));
});

test('HTML-LM Interpreter: Complete valid stream D (zero diagnostics)', () => {
  const source = `di(cs(hero) h1(Hello))`;
  const interpreter = new HTMLLMInterpreter();
  interpreter.write(source);
  const ast = interpreter.end();
  const diags = interpreter.getDiagnostics();

  assert.strictEqual(ast.children.length, 1);
  assert.strictEqual(diags.length, 0);
});

test('HTML-LM Interpreter: Streaming multi-chunk completion E (zero diagnostics on final result)', () => {
  const interpreter = new HTMLLMInterpreter();
  interpreter.write('di(\n  h1(Lev');
  interpreter.write('eonas)\n');
  interpreter.write(')');
  const ast = interpreter.end();
  const diags = interpreter.getDiagnostics();

  assert.strictEqual(diags.length, 0);
  assert.strictEqual(ast.children.length, 1);
  const div = ast.children[0] as ComponentNode;
  assert.strictEqual(div.children.length, 1);
  const h1 = div.children[0] as GenericComponentNode;
  assert.strictEqual((h1.children[0] as LiteralNode).value, 'Leveonas');
});

test('HTML-LM Interpreter: Canonical Abbreviations cs/cm/oc/og and rejection of ce/oe', () => {
  const source = `bo(cs(btn) cm(btn-class) oc(handleClick) og(handleChange))`;
  const ast = HTMLLMInterpreter.parse(source);
  const btn = ast.children[0] as ComponentNode;
  const propMap = new Map(btn.properties.map(p => [p.name, p.value?.value]));

  assert.strictEqual(propMap.get('class'), 'btn');
  assert.strictEqual(propMap.get('className'), 'btn-class');
  assert.strictEqual(propMap.get('onClick'), 'handleClick');
  assert.strictEqual(propMap.get('onChange'), 'handleChange');

  // Verify ce and oe are NOT mapped to class/className or onChange in vocabulary
  assert.notStrictEqual(resolveAttributeName('ce'), 'className');
  assert.notStrictEqual(resolveAttributeName('ce'), 'class');
  assert.notStrictEqual(resolveAttributeName('oe'), 'onChange');
  assert.strictEqual(KNOWN_ATTRIBUTE_ABBREVIATIONS['ce'], undefined);
  assert.strictEqual(KNOWN_ATTRIBUTE_ABBREVIATIONS['oe'], undefined);
});
