import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { ASTFactory } from '../../../compiler/ast/factory';
import { ASTNodeKind } from '../../../compiler/ast/types';
import { ComponentNode, LiteralNode } from '../../../compiler/ast/nodes';
import { PatchGenerator } from '../patch-generator/generator';
import { DiffEngine } from '../patch-generator/diff';
import { Patch } from '../patch-generator/patch';
import { PatchOperationType } from '../patch-generator/types';
import { PatchExecutor } from '../patch-executor/executor';
import { DOMPatchApplier } from '../patch-executor/dom-applier';

// Lightweight Mock DOM for headless runtime testing
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

  querySelector(selector: string): MockDOMNode | null {
    const match = selector.match(/\[data-ast-id="([^"]+)"\]/);
    if (!match) return null;
    const targetId = match[1];
    if (this.getAttribute('data-ast-id') === targetId) return this;
    for (const child of this.childNodes) {
      if (child.querySelector) {
        const found = child.querySelector(selector);
        if (found) return found;
      }
    }
    return null;
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

describe('Old / New AST Node ID Reconciliation & DOM Consistency', () => {
  const generator = new PatchGenerator();
  const mockDoc = new MockDOMDocument();

  // Helper to construct a component with explicit id and optional text child
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

  test('Centralized ID Resolution Helper', () => {
    const patch = new Patch();
    const engine = new DiffEngine(patch);

    const oldParent = makeComponent('old-page-1', ASTNodeKind.Page);
    const oldBtn = makeComponent('old-btn-1', ASTNodeKind.Button, 'Click Me');
    oldParent.children = [oldBtn];
    oldBtn.parent = oldParent;

    const newParent = makeComponent('new-page-2', ASTNodeKind.Page);
    const newBtn = makeComponent('new-btn-2', ASTNodeKind.Button, 'Click Me');
    newParent.children = [newBtn];
    newBtn.parent = newParent;

    engine.diff(oldParent, newParent);

    // Verify resolveLiveId correctly maps newNode.id to oldNode.id
    assert.strictEqual(engine.resolveLiveId('new-page-2'), 'old-page-1');
    assert.strictEqual(engine.resolveLiveId('new-btn-2'), 'old-btn-1');
    // Genuinely new node stays as its own ID
    assert.strictEqual(engine.resolveLiveId('truly-new-999'), 'truly-new-999');

    // Verify getPatchTargetId
    assert.strictEqual(engine.getPatchTargetId(oldBtn, newBtn), 'old-btn-1');
    assert.strictEqual(engine.getPatchTargetId(null, newBtn), 'old-btn-1');
    assert.strictEqual(engine.getPatchTargetId(null, { id: 'unmatched-new' } as any), 'unmatched-new');
  });

  test('Test 1: Text update with old AST IDs != new AST IDs', () => {
    // Old AST: button id="old-btn-100" with text "Save Draft"
    const oldBtn = makeComponent('old-btn-100', ASTNodeKind.Button, 'Save Draft');
    const oldRoot = makeComponent('old-root-1', ASTNodeKind.Page, undefined, [], [oldBtn]);

    // New AST: button id="new-btn-200" with text "Publish Now"
    const newBtn = makeComponent('new-btn-200', ASTNodeKind.Button, 'Publish Now');
    const newRoot = makeComponent('new-root-2', ASTNodeKind.Page, undefined, [], [newBtn]);

    const patches = generator.generate(oldRoot, newRoot);

    // Must emit exactly 1 UPDATE_TEXT patch targeting OLD button literal ID
    assert.strictEqual(patches.length, 1);
    assert.strictEqual(patches[0].operation, PatchOperationType.UPDATE_TEXT);
    assert.strictEqual(patches[0].nodeId, 'old-btn-100-text', 'Patch target ID MUST be the old/live literal node ID');
    assert.strictEqual(patches[0].payload.text, 'Publish Now');

    // Apply to DOM and verify live DOM consistency
    const applier = new DOMPatchApplier(undefined, mockDoc);
    const dom = applier.createDOMNode(oldRoot);
    applier.setContainer(dom);

    assert.ok(dom.toHTML().includes('Save Draft'));
    assert.ok(dom.toHTML().includes('data-ast-id="old-btn-100"'));

    applier.apply(patches);

    assert.ok(dom.toHTML().includes('Publish Now'), 'DOM text must be updated');
    assert.ok(!dom.toHTML().includes('Save Draft'));
    assert.ok(dom.toHTML().includes('data-ast-id="old-btn-100"'), 'DOM retains old-btn-100 identity');

    // Verify DOM registry can still retrieve the button by old-btn-100
    const retrieved = applier.getNode('old-btn-100');
    assert.ok(retrieved !== undefined, 'Registry must find node by live ID');
    assert.strictEqual(retrieved.textContent, 'Publish Now');
  });

  test('Test 2: Movement with old AST IDs != new AST IDs', () => {
    // Old AST: List with [ItemA (old-A), ItemB (old-B)]
    const itemAOld = makeComponent('old-A', ASTNodeKind.Container, 'Alpha');
    const itemBOld = makeComponent('old-B', ASTNodeKind.Container, 'Beta');
    const oldList = makeComponent('old-list-1', ASTNodeKind.Container, undefined, [], [itemAOld, itemBOld]);

    // New AST: List with [ItemB (new-B), ItemA (new-A)]
    const itemBNew = makeComponent('new-B', ASTNodeKind.Container, 'Beta');
    const itemANew = makeComponent('new-A', ASTNodeKind.Container, 'Alpha');
    const newList = makeComponent('new-list-2', ASTNodeKind.Container, undefined, [], [itemBNew, itemANew]);

    const patches = generator.generate(oldList, newList);

    // Verify MOVE_CHILD emitted using old IDs
    const movePatch = patches.find(p => p.operation === PatchOperationType.MOVE_CHILD);
    assert.ok(movePatch !== undefined, 'Must generate MOVE_CHILD');
    assert.strictEqual(movePatch.parentId, 'old-list-1', 'Parent ID must be old/live ID');
    assert.ok(
      movePatch.nodeId === 'old-A' || movePatch.nodeId === 'old-B',
      `Move target nodeId MUST be old/live child ID (was: ${movePatch.nodeId})`
    );

    // Apply to DOM and verify reordering
    const applier = new DOMPatchApplier(undefined, mockDoc);
    const dom = applier.createDOMNode(oldList);
    applier.setContainer(dom);

    const initialHTML = dom.toHTML();
    assert.ok(initialHTML.indexOf('Alpha') < initialHTML.indexOf('Beta'));

    applier.apply(patches);

    const reorderedHTML = dom.toHTML();
    assert.ok(reorderedHTML.indexOf('Beta') < reorderedHTML.indexOf('Alpha'), 'Order must be swapped');
    assert.ok(reorderedHTML.includes('data-ast-id="old-A"'));
    assert.ok(reorderedHTML.includes('data-ast-id="old-B"'));
  });

  test('Test 3: Attribute change with old AST IDs != new AST IDs', () => {
    const propOld = [ASTFactory.createProperty('class', ASTFactory.createLiteral('btn-secondary', 'btn-secondary', emptyLoc), emptyLoc)];
    const oldBtn = makeComponent('old-btn-prop', ASTNodeKind.Button, 'Click', propOld);
    const oldRoot = makeComponent('old-root-3', ASTNodeKind.Page, undefined, [], [oldBtn]);

    const propNew = [
      ASTFactory.createProperty('class', ASTFactory.createLiteral('btn-primary', 'btn-primary', emptyLoc), emptyLoc),
      ASTFactory.createProperty('disabled', ASTFactory.createLiteral(true, 'true', emptyLoc), emptyLoc)
    ];
    const newBtn = makeComponent('new-btn-prop', ASTNodeKind.Button, 'Click', propNew);
    const newRoot = makeComponent('new-root-4', ASTNodeKind.Page, undefined, [], [newBtn]);

    const patches = generator.generate(oldRoot, newRoot);

    // Verify all attribute operations target the old node ID
    for (const patch of patches) {
      if (patch.operation === PatchOperationType.SET_ATTRIBUTE || patch.operation === PatchOperationType.REMOVE_ATTRIBUTE) {
        assert.strictEqual(patch.nodeId, 'old-btn-prop', 'SET_ATTRIBUTE target must be old/live node ID');
      }
    }

    // Apply to DOM
    const applier = new DOMPatchApplier(undefined, mockDoc);
    const dom = applier.createDOMNode(oldRoot);
    applier.setContainer(dom);

    applier.apply(patches);

    const updatedHTML = dom.toHTML();
    assert.ok(updatedHTML.includes('class="btn-primary"'));
    assert.ok(updatedHTML.includes('disabled'));
    assert.ok(dom.querySelector('[data-ast-id="old-btn-prop"]')?.attributes.has('disabled'));
    assert.ok(updatedHTML.includes('data-ast-id="old-btn-prop"'));
  });

  test('Test 4: Insertion with old AST IDs != new AST IDs', () => {
    const item1Old = makeComponent('old-item-1', ASTNodeKind.Container, 'First');
    const oldContainer = makeComponent('old-cont-1', ASTNodeKind.Container, undefined, [], [item1Old]);

    const item1New = makeComponent('new-item-1', ASTNodeKind.Container, 'First');
    const item2New = makeComponent('genuinely-new-item-2', ASTNodeKind.Container, 'Second');
    const newContainer = makeComponent('new-cont-2', ASTNodeKind.Container, undefined, [], [item1New, item2New]);

    const patches = generator.generate(oldContainer, newContainer);

    // Verify INSERT_CHILD targets the old parent ID, but uses the NEW child's ID
    const insertOp = patches.find(p => p.operation === PatchOperationType.INSERT_CHILD);
    assert.ok(insertOp !== undefined, 'Must emit INSERT_CHILD');
    assert.strictEqual(insertOp.parentId, 'old-cont-1', 'Parent ID must be old/live parent ID');
    assert.strictEqual(insertOp.nodeId, 'genuinely-new-item-2', 'New node ID must be new ID');
    assert.strictEqual(insertOp.index, 1);

    // Apply to DOM
    const applier = new DOMPatchApplier(undefined, mockDoc);
    const dom = applier.createDOMNode(oldContainer);
    applier.setContainer(dom);

    applier.apply(patches);

    const finalHTML = dom.toHTML();
    assert.ok(finalHTML.includes('First'));
    assert.ok(finalHTML.includes('Second'));
    assert.ok(finalHTML.includes('data-ast-id="genuinely-new-item-2"'));
    assert.ok(applier.getNode('genuinely-new-item-2') !== undefined, 'New node must be registered in DOM applier');
  });

  test('Test 5: Removal with old AST IDs != new AST IDs', () => {
    const item1Old = makeComponent('old-rem-1', ASTNodeKind.Container, 'Keep');
    const item2Old = makeComponent('old-rem-2', ASTNodeKind.Container, 'Delete Me');
    const oldContainer = makeComponent('old-parent-rem', ASTNodeKind.Container, undefined, [], [item1Old, item2Old]);

    const item1New = makeComponent('new-rem-1', ASTNodeKind.Container, 'Keep');
    const newContainer = makeComponent('new-parent-rem', ASTNodeKind.Container, undefined, [], [item1New]);

    const patches = generator.generate(oldContainer, newContainer);

    // Verify REMOVE_CHILD uses old parent and old child IDs
    const removeOp = patches.find(p => p.operation === PatchOperationType.REMOVE_CHILD);
    assert.ok(removeOp !== undefined, 'Must emit REMOVE_CHILD');
    assert.strictEqual(removeOp.parentId, 'old-parent-rem', 'Parent ID must be old/live parent ID');
    assert.strictEqual(removeOp.nodeId, 'old-rem-2', 'Removed node ID must be the old/live ID');
    assert.strictEqual(removeOp.index, 1);

    // Apply to DOM
    const applier = new DOMPatchApplier(undefined, mockDoc);
    const dom = applier.createDOMNode(oldContainer);
    applier.setContainer(dom);

    assert.ok(applier.getNode('old-rem-2') !== undefined);

    applier.apply(patches);

    const finalHTML = dom.toHTML();
    assert.ok(finalHTML.includes('Keep'));
    assert.ok(!finalHTML.includes('Delete Me'));
    assert.strictEqual(applier.getNode('old-rem-2'), undefined, 'Removed node must be pruned from DOM registry');
  });

  test('Test 6: Replacement with old AST IDs != new AST IDs', () => {
    // Old: Page with Button (old-btn)
    const oldBtn = makeComponent('old-btn-rep', ASTNodeKind.Button, 'Submit');
    const oldRoot = makeComponent('old-root-rep', ASTNodeKind.Page, undefined, [], [oldBtn]);

    // New: Page with Container (new-cont) instead of Button (different tag kind)
    const newBox = makeComponent('new-box-rep', ASTNodeKind.Container, 'Loading...');
    const newRoot = makeComponent('new-root-rep', ASTNodeKind.Page, undefined, [], [newBox]);

    const patches = generator.generate(oldRoot, newRoot);

    const replaceOp = patches.find(p => p.operation === PatchOperationType.REPLACE_NODE);
    assert.ok(replaceOp !== undefined, 'Must emit REPLACE_NODE');
    assert.strictEqual(replaceOp.nodeId, 'old-btn-rep', 'Replace target must be old/live node ID');
    assert.strictEqual(replaceOp.parentId, 'old-root-rep', 'Replace parent must be old/live parent ID');
    assert.strictEqual(replaceOp.payload.id, 'new-box-rep', 'Payload must contain the new serialized node with new ID');

    // Apply to DOM
    const applier = new DOMPatchApplier(undefined, mockDoc);
    const dom = applier.createDOMNode(oldRoot);
    applier.setContainer(dom);

    assert.ok(applier.getNode('old-btn-rep') !== undefined);

    applier.apply(patches);

    const finalHTML = dom.toHTML();
    assert.ok(finalHTML.includes('Loading...'));
    assert.ok(!finalHTML.includes('Submit'));
    assert.ok(finalHTML.includes('data-ast-id="new-box-rep"'));
    assert.strictEqual(applier.getNode('old-btn-rep'), undefined, 'Old node removed from registry');
    assert.ok(applier.getNode('new-box-rep') !== undefined, 'New node added to registry');
  });

  test('Test 7: Nested insertion with old AST IDs != new AST IDs', () => {
    // Old AST: Page (old-root) -> Section (old-sec) -> Card (old-card) -> [Title (old-title)]
    const oldTitle = makeComponent('old-title', ASTNodeKind.Heading, 'Dashboard');
    const oldCard = makeComponent('old-card', ASTNodeKind.Container, undefined, [], [oldTitle]);
    const oldSec = makeComponent('old-sec', ASTNodeKind.Section, undefined, [], [oldCard]);
    const oldRoot = makeComponent('old-root', ASTNodeKind.Page, undefined, [], [oldSec]);

    // New AST: completely different IDs for existing nodes, plus a brand new Action Button inside Card
    const newTitle = makeComponent('new-title', ASTNodeKind.Heading, 'Dashboard');
    const newBtn = makeComponent('brand-new-btn', ASTNodeKind.Button, 'Refresh');
    const newCard = makeComponent('new-card', ASTNodeKind.Container, undefined, [], [newTitle, newBtn]);
    const newSec = makeComponent('new-sec', ASTNodeKind.Section, undefined, [], [newCard]);
    const newRoot = makeComponent('new-root', ASTNodeKind.Page, undefined, [], [newSec]);

    const patches = generator.generate(oldRoot, newRoot);

    // Verify INSERT_CHILD uses oldCard's live ID as parentId, and brand-new-btn as nodeId
    const insertOp = patches.find(p => p.operation === PatchOperationType.INSERT_CHILD);
    assert.ok(insertOp !== undefined, 'Must emit nested INSERT_CHILD');
    assert.strictEqual(insertOp.parentId, 'old-card', 'Nested parent ID must be resolved to old/live ID');
    assert.strictEqual(insertOp.nodeId, 'brand-new-btn', 'New child ID must be brand-new-btn');
    assert.strictEqual(insertOp.index, 1);

    // Apply to DOM
    const applier = new DOMPatchApplier(undefined, mockDoc);
    const dom = applier.createDOMNode(oldRoot);
    applier.setContainer(dom);

    applier.apply(patches);

    const finalHTML = dom.toHTML();
    assert.ok(finalHTML.includes('Dashboard'));
    assert.ok(finalHTML.includes('Refresh'));
    assert.ok(finalHTML.includes('data-ast-id="old-card"'));
    assert.ok(finalHTML.includes('data-ast-id="brand-new-btn"'));
    assert.ok(applier.getNode('brand-new-btn') !== undefined, 'Nested new node must be found in registry');
  });

  test('Full Pipeline End-to-End: Generator -> Patch -> PatchExecutor -> DOMPatchApplier with differing IDs', () => {
    // Stage 1: Initial tree
    const btn1 = makeComponent('init-btn-1', ASTNodeKind.Button, 'Initial Btn 1');
    const btn2 = makeComponent('init-btn-2', ASTNodeKind.Button, 'Initial Btn 2');
    const panel = makeComponent('init-panel', ASTNodeKind.Container, undefined, [], [btn1, btn2]);
    const initialAST = makeComponent('init-root', ASTNodeKind.Page, undefined, [], [panel]);

    const applier = new DOMPatchApplier(undefined, mockDoc);
    const liveDOM = applier.createDOMNode(initialAST);
    applier.setContainer(liveDOM);

    const inMemoryExecutor = new PatchExecutor(initialAST);

    // Stage 2: Updated tree with totally fresh IDs, updating text on btn1, inserting btn3, and preserving btn2
    const freshBtn1 = makeComponent('fresh-btn-1', ASTNodeKind.Button, 'Updated Btn 1');
    const freshBtn3 = makeComponent('fresh-btn-3-inserted', ASTNodeKind.Button, 'Inserted Btn 3');
    const freshBtn2 = makeComponent('fresh-btn-2', ASTNodeKind.Button, 'Initial Btn 2');
    const freshPanel = makeComponent('fresh-panel', ASTNodeKind.Container, undefined, [], [freshBtn1, freshBtn3, freshBtn2]);
    const updatedAST = makeComponent('fresh-root', ASTNodeKind.Page, undefined, [], [freshPanel]);

    const patches = generator.generate(initialAST, updatedAST);

    // Apply to in-memory AST
    inMemoryExecutor.execute(patches);

    // Apply to live DOM
    applier.apply(patches);

    const domHTML = liveDOM.toHTML();
    assert.ok(domHTML.includes('Updated Btn 1'));
    assert.ok(domHTML.includes('Inserted Btn 3'));
    assert.ok(domHTML.includes('Initial Btn 2'));
    assert.ok(domHTML.includes('data-ast-id="init-btn-1"'), 'Preserves live ID for matched btn 1');
    assert.ok(domHTML.includes('data-ast-id="init-btn-2"'), 'Preserves live ID for matched btn 2');
    assert.ok(domHTML.includes('data-ast-id="fresh-btn-3-inserted"'), 'Uses new ID for inserted btn 3');

    // Verify all registry nodes exist and match
    assert.ok(applier.getNode('init-btn-1') !== undefined);
    assert.ok(applier.getNode('init-btn-2') !== undefined);
    assert.ok(applier.getNode('fresh-btn-3-inserted') !== undefined);
  });
});
