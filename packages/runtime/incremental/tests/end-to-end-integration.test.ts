import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { HTMLLMInterpreter } from '../../../compiler/interpreters/html-lm';
import { PatchGenerator } from '../patch-generator/generator';
import { PatchOperationType } from '../patch-generator/types';
import { PatchExecutor } from '../patch-executor/executor';
import { DOMPatchApplier } from '../patch-executor/dom-applier';
import { HtmlRenderer } from '../../../compiler/renderers/html';

// Lightweight in-memory DOM mock for standalone node testing
class MockDOMNode {
  public nodeType: number;
  public nodeName: string;
  public nodeValue: string | null = null;
  public textContent: string = '';
  public attributes: Map<string, string> = new Map();
  public childNodes: MockDOMNode[] = [];
  public parentNode: MockDOMNode | null = null;

  constructor(nodeType: number, nodeName: string, text?: string) {
    this.nodeType = nodeType;
    this.nodeName = nodeName;
    if (text !== undefined) {
      this.nodeValue = text;
      this.textContent = text;
    }
  }

  setAttribute(name: string, value: string) {
    this.attributes.set(name, value);
  }

  getAttribute(name: string): string | undefined {
    return this.attributes.get(name);
  }

  removeAttribute(name: string) {
    this.attributes.delete(name);
  }

  appendChild(child: MockDOMNode): MockDOMNode {
    child.parentNode = this;
    this.childNodes.push(child);
    return child;
  }

  insertBefore(newChild: MockDOMNode, refChild: MockDOMNode): MockDOMNode {
    const idx = this.childNodes.indexOf(refChild);
    newChild.parentNode = this;
    if (idx !== -1) {
      this.childNodes.splice(idx, 0, newChild);
    } else {
      this.childNodes.push(newChild);
    }
    return newChild;
  }

  removeChild(child: MockDOMNode): MockDOMNode {
    const idx = this.childNodes.indexOf(child);
    if (idx !== -1) {
      this.childNodes.splice(idx, 1);
      child.parentNode = null;
    }
    return child;
  }

  replaceChild(newChild: MockDOMNode, oldChild: MockDOMNode): MockDOMNode {
    const idx = this.childNodes.indexOf(oldChild);
    if (idx !== -1) {
      this.childNodes[idx] = newChild;
      newChild.parentNode = this;
      oldChild.parentNode = null;
    }
    return newChild;
  }

  toHTML(): string {
    if (this.nodeType === 3) {
      return this.nodeValue || this.textContent || '';
    }
    const tag = this.nodeName.toLowerCase();
    const attrs = Array.from(this.attributes.entries())
      .filter(([k]) => k !== 'data-ast-id')
      .map(([k, v]) => ` ${k}="${v}"`)
      .join('');
    const childrenHTML = this.childNodes.map(c => c.toHTML()).join('');
    return `<${tag}${attrs}>${childrenHTML}</${tag}>`;
  }
}

class MockDOMDocument {
  createElement(tag: string): MockDOMNode {
    return new MockDOMNode(1, tag.toUpperCase());
  }

  createTextNode(text: string): MockDOMNode {
    return new MockDOMNode(3, '#text', text);
  }
}

describe('End-to-End LM Stream -> Interpreter -> AST -> Diff -> Patch -> DOM Applier', () => {
  const generator = new PatchGenerator();
  const mockDoc = new MockDOMDocument();

  test('Full User Story: Initial Page -> Update Text -> Insert Button -> Verify DOM integrity', () => {
    // 1. Initial LM Stream
    const initialLM = `di(cs(page)
  na(cs(nav)
    a(hr(#home) Home)
    a(hr(#docs) Docs)
  )
  so(cs(hero)
    h1(Leveonas)
    p(Streaming frontend generation)
    bo(cs(primary) Get Started)
  )
)`;

    const ast1 = HTMLLMInterpreter.parse(initialLM);
    assert.strictEqual(ast1.children.length, 1);

    // Mount initial DOM
    const applier = new DOMPatchApplier(undefined, mockDoc);
    const initialDOM = applier.createDOMNode(ast1.children[0]);
    applier.setContainer(initialDOM);

    // Verify initial DOM rendered correctly
    assert.ok(initialDOM.toHTML().includes('Streaming frontend generation'));
    assert.ok(initialDOM.toHTML().includes('Get Started'));

    // 2. Stream modification: Change paragraph text
    const modifiedLM1 = `di(cs(page)
  na(cs(nav)
    a(hr(#home) Home)
    a(hr(#docs) Docs)
  )
  so(cs(hero)
    h1(Leveonas)
    p(Generate frontends at streaming speed)
    bo(cs(primary) Get Started)
  )
)`;

    const ast2 = HTMLLMInterpreter.parse(modifiedLM1);
    const patches1 = generator.generate(ast1, ast2);

    // Verify patches1 contains UPDATE_TEXT
    assert.strictEqual(patches1.length, 1, 'Should produce exactly 1 patch');
    assert.strictEqual(patches1[0].operation, PatchOperationType.UPDATE_TEXT);
    assert.strictEqual(patches1[0].payload.text, 'Generate frontends at streaming speed');

    // Apply patch to in-memory AST
    const astExecutor = new PatchExecutor(ast1);
    astExecutor.execute(patches1);

    // Apply patch to browser DOM
    applier.apply(patches1);

    // Verify DOM now contains updated text without full recreation
    assert.ok(initialDOM.toHTML().includes('Generate frontends at streaming speed'));
    assert.ok(!initialDOM.toHTML().includes('Streaming frontend generation'));

    // 3. Stream modification: Add secondary Documentation button
    const modifiedLM2 = `di(cs(page)
  na(cs(nav)
    a(hr(#home) Home)
    a(hr(#docs) Docs)
  )
  so(cs(hero)
    h1(Leveonas)
    p(Generate frontends at streaming speed)
    bo(cs(primary) Get Started)
    bo(cs(secondary) Documentation)
  )
)`;

    const ast3 = HTMLLMInterpreter.parse(modifiedLM2);
    const patches2 = generator.generate(ast1, ast3);

    // Verify patches2 contains INSERT_CHILD
    assert.strictEqual(patches2.length, 1, 'Should produce exactly 1 insertion patch');
    assert.ok(
      patches2[0].operation === PatchOperationType.INSERT_CHILD ||
      patches2[0].operation === PatchOperationType.INSERT_NODE
    );
    assert.strictEqual(patches2[0].index, 3);

    // Apply patch to in-memory AST
    astExecutor.execute(patches2);

    // Apply patch to DOM
    applier.apply(patches2);

    // Verify DOM now contains the secondary button
    const finalHTML = initialDOM.toHTML();
    assert.ok(finalHTML.includes('Documentation'));
    assert.ok(finalHTML.includes('class="secondary"'));
    assert.ok(finalHTML.includes('Get Started'));
    assert.ok(finalHTML.includes('Generate frontends at streaming speed'));

    // Verify the incrementally patched DOM matches fresh rendering from scratch
    const scratchAST = HTMLLMInterpreter.parse(modifiedLM2);
    const scratchDOM = applier.createDOMNode(scratchAST.children[0]);
    assert.strictEqual(finalHTML, scratchDOM.toHTML());
  });

  test('Multi-Step Stream Mutations: Removals, Attribute Changes, Reordering, and Registry Cleanliness', () => {
    // Initial state: Card with title, subtitle, 3 list items, and a footer
    const lm0 = `di(cs(card) id(user-card)
  h2(User Profile)
  p(cs(status active) Online)
  ul(
    li(Item 1)
    li(Item 2)
    li(Item 3)
  )
  di(cs(footer)
    bo(cs(btn-save) Save)
    bo(cs(btn-cancel) Cancel)
  )
)`;

    const ast0 = HTMLLMInterpreter.parse(lm0);
    const applier = new DOMPatchApplier(undefined, mockDoc);
    const dom0 = applier.createDOMNode(ast0.children[0]);
    applier.setContainer(dom0);

    const astExecutor = new PatchExecutor(ast0);

    // Initial assertions
    assert.ok(dom0.toHTML().includes('User Profile'));
    assert.ok(dom0.toHTML().includes('Item 2'));
    assert.ok(dom0.toHTML().includes('class="status active"'));

    // Step 1: Remove "Item 2", update status text & class to "Offline"
    const lm1 = `di(cs(card) id(user-card)
  h2(User Profile)
  p(cs(status offline) Offline)
  ul(
    li(Item 1)
    li(Item 3)
  )
  di(cs(footer)
    bo(cs(btn-save) Save)
    bo(cs(btn-cancel) Cancel)
  )
)`;

    const ast1 = HTMLLMInterpreter.parse(lm1);
    const patches1 = generator.generate(ast0, ast1);

    astExecutor.execute(patches1);
    applier.apply(patches1);

    const html1 = dom0.toHTML();
    assert.ok(html1.includes('Offline'));
    assert.ok(html1.includes('class="status offline"'));
    assert.ok(!html1.includes('Item 2'));
    assert.ok(html1.includes('Item 1'));
    assert.ok(html1.includes('Item 3'));

    // Step 2: Swap footer buttons and remove id attribute from container
    const lm2 = `di(cs(card)
  h2(User Profile)
  p(cs(status offline) Offline)
  ul(
    li(Item 1)
    li(Item 3)
  )
  di(cs(footer)
    bo(cs(btn-cancel) Cancel)
    bo(cs(btn-save) Save)
  )
)`;

    const ast2 = HTMLLMInterpreter.parse(lm2);
    const patches2 = generator.generate(ast0, ast2);

    astExecutor.execute(patches2);
    applier.apply(patches2);

    const html2 = dom0.toHTML();
    assert.ok(!html2.includes('id="user-card"'));
    const scratchAST2 = HTMLLMInterpreter.parse(lm2);
    const scratchDOM2 = applier.createDOMNode(scratchAST2.children[0]);
    assert.strictEqual(html2, scratchDOM2.toHTML());
  });
});
