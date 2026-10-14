import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { HTMLLMInterpreter } from '../../../compiler/interpreters/html-lm';
import { ASTFactory } from '../../../compiler/ast/factory';
import { ASTNodeKind } from '../../../compiler/ast/types';
import { ComponentNode, LiteralNode } from '../../../compiler/ast/nodes';
import { PatchGenerator } from '../patch-generator/generator';
import { PatchOperationType } from '../patch-generator/types';
import { PatchExecutor } from '../patch-executor/executor';
import { DOMPatchApplier } from '../patch-executor/dom-applier';
import { PatchExecutorError } from '../patch-executor/errors';

// Lightweight Mock DOM for headless node testing
class MockDOMNode {
  public nodeType: number;
  public nodeName: string;
  public nodeValue: string | null = null;
  private _textContent: string = '';
  public attributes: Map<string, string> = new Map();
  public childNodes: MockDOMNode[] = [];
  public parentNode: MockDOMNode | null = null;

  constructor(nodeType: number, nodeName: string, text?: string) {
    this.nodeType = nodeType;
    this.nodeName = nodeName;
    if (text !== undefined) {
      this.nodeValue = text;
      this._textContent = text;
    }
  }

  get textContent(): string {
    if (this.nodeType === 3) {
      return this.nodeValue || this._textContent || '';
    }
    return this.childNodes.map(c => c.textContent).join('');
  }

  set textContent(val: string) {
    this._textContent = val;
    if (this.nodeType === 3) {
      this.nodeValue = val;
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

const emptyLoc = ASTFactory.createSourceLocation(0, 0, 0, 0, 0, 0);

describe('UPDATE_TEXT Targeting and DOM Safety', () => {
  const generator = new PatchGenerator();
  const mockDoc = new MockDOMDocument();

  // Helper to construct manual component trees
  function makeComponent(
    id: string,
    kind: ASTNodeKind,
    text?: string,
    properties: any[] = [],
    children: any[] = []
  ): ComponentNode {
    const comp: any = ASTFactory.createComponent(kind, emptyLoc, properties, children);
    comp.id = id;
    if (text !== undefined) {
      const lit = ASTFactory.createLiteral(text, text, emptyLoc);
      lit.id = `${id}-text`;
      lit.parent = comp;
      comp.children = [lit];
    }
    for (const c of comp.children) {
      c.parent = comp;
    }
    return comp;
  }

  test('TEST 1 — BASIC: Exactly one UPDATE_TEXT targeting old paragraph Literal ID', () => {
    const oldLM = 'di(p(Build faster))';
    const newLM = 'di(p(Build much faster))';

    const oldAst = HTMLLMInterpreter.parse(oldLM);
    const newAst = HTMLLMInterpreter.parse(newLM);

    // Identify old paragraph and literal IDs
    const div = oldAst.children[0] as ComponentNode;
    const p = div.children[0] as ComponentNode;
    const oldLit = p.children[0] as LiteralNode;

    assert.ok(oldLit, 'Old Literal node must exist');
    assert.strictEqual(oldLit.value, 'Build faster');

    const patches = generator.generate(oldAst, newAst);

    assert.strictEqual(patches.length, 1, 'Must emit exactly one patch');
    assert.strictEqual(patches[0].operation, PatchOperationType.UPDATE_TEXT);
    assert.strictEqual(patches[0].nodeId, oldLit.id, 'Target MUST be the old paragraph Literal ID');
    assert.notStrictEqual(patches[0].nodeId, p.id, 'Target MUST NOT be the paragraph element ID');
    assert.strictEqual(patches[0].payload.text, 'Build much faster');
  });

  test('TEST 2 — MULTIPLE SIBLINGS: UPDATE_TEXT targets paragraph Literal, siblings unchanged', () => {
    const oldLM = 'di(h1(Leveonas) p(Build faster) bo(Get Started))';
    const newLM = 'di(h1(Leveonas) p(Build much faster) bo(Get Started))';

    const oldAst = HTMLLMInterpreter.parse(oldLM);
    const newAst = HTMLLMInterpreter.parse(newLM);

    const div = oldAst.children[0] as ComponentNode;
    const h1 = div.children[0] as ComponentNode;
    const p = div.children[1] as ComponentNode;
    const btn = div.children[2] as ComponentNode;
    const oldLit = p.children[0] as LiteralNode;

    const patches = generator.generate(oldAst, newAst);

    assert.strictEqual(patches.length, 1, 'Must emit exactly one patch');
    assert.strictEqual(patches[0].operation, PatchOperationType.UPDATE_TEXT);
    assert.strictEqual(patches[0].nodeId, oldLit.id, 'Target MUST be the paragraph Literal node ID');
    assert.notStrictEqual(patches[0].nodeId, p.id, 'Target must not be the parent p ID');
    assert.notStrictEqual(patches[0].nodeId, h1.id, 'Target must not be h1');
    assert.notStrictEqual(patches[0].nodeId, btn.id, 'Target must not be button');
    assert.strictEqual(patches[0].payload.text, 'Build much faster');
  });

  test('TEST 3 — DIFFERENT AST IDS: Targets old-text, NOT old-p, new-text, or old-page', () => {
    // Old AST
    const oldLit = ASTFactory.createLiteral('Hello', 'Hello', emptyLoc);
    oldLit.id = 'old-text';
    const oldP: any = ASTFactory.createComponent(ASTNodeKind.Paragraph, emptyLoc, [], [oldLit]);
    oldP.id = 'old-p';
    oldLit.parent = oldP;
    const oldPage: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc, [], [oldP]);
    oldPage.id = 'old-page';
    oldP.parent = oldPage;

    // New AST with completely different IDs
    const newLit = ASTFactory.createLiteral('Hello World', 'Hello World', emptyLoc);
    newLit.id = 'new-text';
    const newP: any = ASTFactory.createComponent(ASTNodeKind.Paragraph, emptyLoc, [], [newLit]);
    newP.id = 'new-p';
    newLit.parent = newP;
    const newPage: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc, [], [newP]);
    newPage.id = 'new-page';
    newP.parent = newPage;

    const patches = generator.generate(oldPage, newPage);

    assert.strictEqual(patches.length, 1, 'Must emit exactly 1 patch');
    assert.strictEqual(patches[0].operation, PatchOperationType.UPDATE_TEXT);
    assert.strictEqual(patches[0].nodeId, 'old-text', 'Target MUST be old-text');
    assert.notStrictEqual(patches[0].nodeId, 'old-p', 'Must NOT target old-p');
    assert.notStrictEqual(patches[0].nodeId, 'new-text', 'Must NOT target new-text');
    assert.notStrictEqual(patches[0].nodeId, 'old-page', 'Must NOT target old-page');
    assert.notStrictEqual(patches[0].nodeId, 'new-p', 'Must NOT target new-p');
    assert.strictEqual(patches[0].payload.text, 'Hello World');
  });

  test('TEST 4 — MULTIPLE TEXT NODES: Only the modified Literal receives UPDATE_TEXT', () => {
    const oldLM = 'di(p(sp(Hello) sp(World)))';
    const newLM = 'di(p(sp(Hello) sp(Leveonas)))';

    const oldAst = HTMLLMInterpreter.parse(oldLM);
    const newAst = HTMLLMInterpreter.parse(newLM);

    const div = oldAst.children[0] as ComponentNode;
    const p = div.children[0] as ComponentNode;
    const span1 = p.children[0] as ComponentNode;
    const span2 = p.children[1] as ComponentNode;
    const lit1 = span1.children[0] as LiteralNode;
    const lit2 = span2.children[0] as LiteralNode;

    const patches = generator.generate(oldAst, newAst);

    assert.strictEqual(patches.length, 1, 'Must emit exactly 1 patch');
    assert.strictEqual(patches[0].operation, PatchOperationType.UPDATE_TEXT);
    assert.strictEqual(patches[0].nodeId, lit2.id, 'Target MUST be the second Literal node');
    assert.notStrictEqual(patches[0].nodeId, lit1.id, 'First text node must remain untouched');
    assert.strictEqual(patches[0].payload.text, 'Leveonas');
  });

  test('TEST 5 — DOM PROTECTION: Child structure and siblings preserved during text update', () => {
    const oldLM = 'di(h1(Leveonas) p(Build faster) bo(Get Started))';
    const newLM = 'di(h1(Leveonas) p(Build much faster) bo(Get Started))';

    const oldAst = HTMLLMInterpreter.parse(oldLM);
    const newAst = HTMLLMInterpreter.parse(newLM);

    const applier = new DOMPatchApplier(undefined, mockDoc);
    const liveDOM = applier.createDOMNode(oldAst.children[0]);
    applier.setContainer(liveDOM);

    // Initial DOM verification
    assert.strictEqual(liveDOM.childNodes.length, 3, 'Parent div must have exactly 3 children');
    const h1Node = liveDOM.childNodes[0];
    const pNode = liveDOM.childNodes[1];
    const btnNode = liveDOM.childNodes[2];

    assert.strictEqual(h1Node.nodeName, 'H1');
    assert.strictEqual(pNode.nodeName, 'P');
    assert.strictEqual(btnNode.nodeName, 'BUTTON');
    assert.strictEqual(h1Node.textContent, 'Leveonas');
    assert.strictEqual(pNode.textContent, 'Build faster');
    assert.strictEqual(btnNode.textContent, 'Get Started');

    // Generate and apply patch
    const patches = generator.generate(oldAst, newAst);
    assert.strictEqual(patches.length, 1);
    assert.strictEqual(patches[0].operation, PatchOperationType.UPDATE_TEXT);

    applier.apply(patches);

    // Verify DOM after patch
    assert.strictEqual(liveDOM.childNodes.length, 3, 'Parent div child count unchanged');
    assert.strictEqual(liveDOM.childNodes[0], h1Node, 'h1 instance must be the exact same DOM node');
    assert.strictEqual(liveDOM.childNodes[1], pNode, 'p instance must be the exact same DOM node');
    assert.strictEqual(liveDOM.childNodes[2], btnNode, 'button instance must be the exact same DOM node');

    assert.strictEqual(h1Node.textContent, 'Leveonas', 'h1 text must be unchanged');
    assert.strictEqual(pNode.textContent, 'Build much faster', 'p text must be updated');
    assert.strictEqual(btnNode.textContent, 'Get Started', 'button text must be unchanged');

    // Child structure of pNode
    assert.strictEqual(pNode.childNodes.length, 1, 'pNode must still have exactly 1 text node child');
    assert.strictEqual(pNode.childNodes[0].nodeType, 3, 'Child must be a Text node');
    assert.strictEqual(pNode.childNodes[0].nodeValue, 'Build much faster');
  });

  test('TEST 6 — INVALID TARGET: UPDATE_TEXT targeting an Element must throw and NOT modify textContent', () => {
    const applier = new DOMPatchApplier(undefined, mockDoc);
    const elem = mockDoc.createElement('DIV');
    elem.setAttribute('data-ast-id', 'elem-target');
    const childText = mockDoc.createTextNode('Original Child Text');
    elem.appendChild(childText);
    applier.setContainer(elem);

    const invalidPatch = {
      operation: PatchOperationType.UPDATE_TEXT,
      nodeId: 'elem-target',
      payload: { text: 'Dangerous Overwrite' },
    };

    assert.throws(
      () => {
        applier.apply([invalidPatch]);
      },
      (err: any) => {
        assert.ok(err instanceof PatchExecutorError || err.name === 'PatchExecutorError');
        assert.ok(err.message.includes('Invalid UPDATE_TEXT target'));
        return true;
      },
      'Must reject UPDATE_TEXT targeting an Element'
    );

    // Ensure DOM was NOT modified
    assert.strictEqual(elem.textContent, 'Original Child Text', 'element.textContent must NOT be modified');
    assert.strictEqual(elem.childNodes.length, 1, 'Children must not be cleared or replaced');
    assert.strictEqual(childText.nodeValue, 'Original Child Text', 'Existing text node value must be unchanged');
  });

  test('TEST 7 — INSERTED TEXT: New literal must generate INSERT_CHILD, NOT UPDATE_TEXT', () => {
    const oldLM = 'di(p())';
    const newLM = 'di(p(Hello))';

    const oldAst = HTMLLMInterpreter.parse(oldLM);
    const newAst = HTMLLMInterpreter.parse(newLM);

    const patches = generator.generate(oldAst, newAst);

    // Verify none of the patches are UPDATE_TEXT
    const updateTextPatches = patches.filter(p => p.operation === PatchOperationType.UPDATE_TEXT);
    assert.strictEqual(updateTextPatches.length, 0, 'Must NOT generate UPDATE_TEXT when text is inserted');

    // Must generate insertion
    const insertPatches = patches.filter(
      p => p.operation === PatchOperationType.INSERT_CHILD || p.operation === PatchOperationType.INSERT_NODE
    );
    assert.ok(insertPatches.length > 0, 'Must generate insertion patch for the new text child');
  });

  test('TEST 8 — REMOVED TEXT: Removed literal must generate REMOVE_CHILD, NOT set textContent to ""', () => {
    const oldLM = 'di(p(Hello))';
    const newLM = 'di(p())';

    const oldAst = HTMLLMInterpreter.parse(oldLM);
    const newAst = HTMLLMInterpreter.parse(newLM);

    const div = oldAst.children[0] as ComponentNode;
    const p = div.children[0] as ComponentNode;
    const lit = p.children[0] as LiteralNode;

    const patches = generator.generate(oldAst, newAst);

    // Verify none of the patches are UPDATE_TEXT
    const updateTextPatches = patches.filter(p => p.operation === PatchOperationType.UPDATE_TEXT);
    assert.strictEqual(updateTextPatches.length, 0, 'Must NOT generate UPDATE_TEXT when text is removed');

    // Must generate REMOVE_CHILD
    const removePatches = patches.filter(p => p.operation === PatchOperationType.REMOVE_CHILD);
    assert.strictEqual(removePatches.length, 1, 'Must generate exactly 1 REMOVE_CHILD patch');
    assert.strictEqual(removePatches[0].nodeId, lit.id, 'Target of removal must be the Literal node');

    // Verify with DOM applier
    const applier = new DOMPatchApplier(undefined, mockDoc);
    const liveDOM = applier.createDOMNode(div);
    applier.setContainer(liveDOM);

    const pElem = liveDOM.childNodes[0];
    assert.strictEqual(pElem.childNodes.length, 1);

    applier.apply(patches);

    // After removal, childNodes of p should be 0, not textContent = ""
    assert.strictEqual(pElem.childNodes.length, 0, 'Text node must be removed from DOM, not replaced with empty string');
  });

  test('AST IMMUTABILITY: diff generation does not mutate oldAst or newAst', () => {
    const oldLM = 'di(h1(Leveonas) p(Build faster))';
    const newLM = 'di(h1(Leveonas) p(Build much faster))';

    const oldAst = HTMLLMInterpreter.parse(oldLM);
    const newAst = HTMLLMInterpreter.parse(newLM);

    const oldP = (oldAst.children[0] as ComponentNode).children[1] as ComponentNode;
    const oldLit = oldP.children[0] as LiteralNode;
    const newP = (newAst.children[0] as ComponentNode).children[1] as ComponentNode;
    const newLit = newP.children[0] as LiteralNode;

    const oldAstId = oldAst.id;
    const oldPId = oldP.id;
    const oldLitId = oldLit.id;
    const oldLitValue = oldLit.value;

    const newAstId = newAst.id;
    const newPId = newP.id;
    const newLitId = newLit.id;
    const newLitValue = newLit.value;

    const patches = generator.generate(oldAst, newAst);
    assert.ok(patches.length > 0);

    // Verify complete immutability
    assert.strictEqual(oldAst.id, oldAstId);
    assert.strictEqual(oldP.id, oldPId);
    assert.strictEqual(oldLit.id, oldLitId);
    assert.strictEqual(oldLit.value, oldLitValue);

    assert.strictEqual(newAst.id, newAstId);
    assert.strictEqual(newP.id, newPId);
    assert.strictEqual(newLit.id, newLitId);
    assert.strictEqual(newLit.value, newLitValue);
  });
});
