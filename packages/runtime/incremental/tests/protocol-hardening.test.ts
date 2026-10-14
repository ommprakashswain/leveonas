import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { ASTFactory } from '../../../compiler/ast/factory';
import { ASTNodeKind } from '../../../compiler/ast/types';
import { ComponentNode, LiteralNode, ASTNode } from '../../../compiler/ast/nodes';
import { PatchGenerator } from '../patch-generator/generator';
import { PatchSerializer } from '../patch-generator/serializer';
import {
  PatchOperation,
  PatchOperationType,
} from '../patch-generator/types';
import {
  createOperation,
  insertChild,
  removeChild,
  removeNode,
  moveChild,
  replaceNode,
  updateText,
  setAttribute,
  removeAttribute,
  attachTransportTimestamp,
} from '../patch-generator/operations';
import { PatchExecutor } from '../patch-executor/executor';
import { DOMPatchApplier } from '../patch-executor/dom-applier';
import { PatchExecutorError } from '../patch-executor/errors';
import { HtmlRenderer } from '../../../compiler/renderers/html/renderer';

// Comprehensive Mock DOM implementation
class MockDOMNode {
  public nodeType: number;
  public nodeName: string;
  public nodeValue: string | null = null;
  private _textContent: string = '';
  public attributes: Map<string, string> = new Map();
  public childNodes: MockDOMNode[] = [];
  public parentNode: MockDOMNode | null = null;
  public __ast_id?: string;
  [key: string]: any;

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
      return this.nodeValue ?? this._textContent ?? '';
    }
    if (this.childNodes.length === 0) {
      return this._textContent ?? '';
    }
    return this.childNodes.map(c => c.textContent).join('');
  }

  set textContent(val: string) {
    this._textContent = val;
    if (this.nodeType === 3) {
      this.nodeValue = val;
    }
  }

  get className(): string {
    return this.attributes.get('class') || '';
  }

  set className(val: string) {
    if (val) {
      this.attributes.set('class', val);
    } else {
      this.attributes.delete('class');
    }
  }

  setAttribute(name: string, value: string) {
    this.attributes.set(name, String(value));
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
    if (match) {
      const targetId = match[1];
      if (this.getAttribute('data-ast-id') === targetId || this.__ast_id === targetId) return this;
      for (const child of this.childNodes) {
        if (child.querySelector) {
          const found = child.querySelector(selector);
          if (found) return found;
        }
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

function cleanAstForComparison(node: any, includeIds: boolean = true): any {
  if (!node) return node;
  const cleaned: any = {
    kind: node.kind,
  };
  if (includeIds && node.id !== undefined) cleaned.id = node.id;
  if (node.name !== undefined) cleaned.name = node.name;
  if (node.value !== undefined) cleaned.value = node.value;
  if (node.raw !== undefined) cleaned.raw = node.raw;
  if (node.properties) {
    cleaned.properties = node.properties.map((p: any) => ({
      name: p.name,
      value: typeof p.value === 'object' && p.value !== null && 'value' in p.value ? p.value.value : p.value,
    }));
  }
  if (node.children) {
    cleaned.children = node.children.map((c: any) => cleanAstForComparison(c, includeIds));
  }
  return cleaned;
}

function cloneAST(node: any, parent: any = null): any {
  if (!node) return node;
  const copy: any = {
    ...node,
    parent,
    metadata: { ...node.metadata },
  };
  if (node.properties) {
    copy.properties = node.properties.map((p: any) => {
      const propCopy = { ...p, parent: copy, metadata: { ...p.metadata } };
      if (p.value) {
        propCopy.value = { ...p.value, parent: propCopy, metadata: { ...p.value.metadata } };
      }
      return propCopy;
    });
  }
  if (node.children) {
    copy.children = node.children.map((c: any) => cloneAST(c, copy));
  }
  return copy;
}

describe('Final Patch Protocol Hardening Pass', () => {
  // =========================================================================
  // 1 & 2. NEVER SILENTLY IGNORE INVALID PATCHES & ERROR DETAILS
  // =========================================================================
  describe('1 & 2. Strict Error Handling & Diagnostics', () => {
    test('SET_ATTRIBUTE: missing node throws PatchExecutorError with nodeId', () => {
      const mockDoc = new MockDOMDocument();
      const applier = new DOMPatchApplier(undefined, mockDoc);
      const patch = setAttribute('missing-node-id', 'class', 'active');

      assert.throws(
        () => applier.apply([patch]),
        (err: any) => {
          assert.ok(err instanceof PatchExecutorError);
          assert.ok(err.message.includes('missing-node-id'));
          assert.ok(err.message.includes('SET_ATTRIBUTE'));
          return true;
        }
      );
    });

    test('REMOVE_ATTRIBUTE: missing node throws PatchExecutorError with nodeId', () => {
      const mockDoc = new MockDOMDocument();
      const applier = new DOMPatchApplier(undefined, mockDoc);
      const patch = removeAttribute('non-existent-node', 'disabled');

      assert.throws(
        () => applier.apply([patch]),
        (err: any) => {
          assert.ok(err instanceof PatchExecutorError);
          assert.ok(err.message.includes('non-existent-node'));
          assert.ok(err.message.includes('REMOVE_ATTRIBUTE'));
          return true;
        }
      );
    });

    test('UPDATE_TEXT: missing node throws PatchExecutorError', () => {
      const mockDoc = new MockDOMDocument();
      const applier = new DOMPatchApplier(undefined, mockDoc);
      const patch = updateText('non-existent-literal', 'Hello');

      assert.throws(
        () => applier.apply([patch]),
        (err: any) => {
          assert.ok(err instanceof PatchExecutorError);
          assert.ok(err.message.includes('non-existent-literal'));
          assert.ok(err.message.includes('UPDATE_TEXT'));
          return true;
        }
      );
    });

    test('UPDATE_TEXT: targeting an Element throws PatchExecutorError (does not modify textContent)', () => {
      const mockDoc = new MockDOMDocument();
      const applier = new DOMPatchApplier(undefined, mockDoc);
      const btn = mockDoc.createElement('BUTTON');
      btn.setAttribute('data-ast-id', 'elem-btn');
      btn.textContent = 'Original Text';
      applier.registerNode('elem-btn', btn);

      const patch = updateText('elem-btn', 'Hacked Text');

      assert.throws(
        () => applier.apply([patch]),
        (err: any) => {
          assert.ok(err instanceof PatchExecutorError);
          assert.ok(err.message.includes('Element'));
          return true;
        }
      );
      assert.strictEqual(btn.textContent, 'Original Text', 'Element textContent must NOT be modified');
    });

    test('INSERT_CHILD: missing parent throws PatchExecutorError with parentId and nodeId', () => {
      const mockDoc = new MockDOMDocument();
      const applier = new DOMPatchApplier(undefined, mockDoc);
      const patch = insertChild('child-1', 'missing-parent', 0, { id: 'child-1', kind: 'Button' });

      assert.throws(
        () => applier.apply([patch]),
        (err: any) => {
          assert.ok(err instanceof PatchExecutorError);
          assert.ok(err.message.includes('missing-parent'));
          assert.ok(err.message.includes('INSERT_CHILD'));
          return true;
        }
      );
    });

    test('INSERT_CHILD: invalid index throws PatchExecutorError', () => {
      const mockDoc = new MockDOMDocument();
      const parent = mockDoc.createElement('DIV');
      parent.setAttribute('data-ast-id', 'parent-div');
      const applier = new DOMPatchApplier(undefined, mockDoc);
      applier.registerNode('parent-div', parent);

      const patch = insertChild('child-1', 'parent-div', 99, { id: 'child-1', kind: 'Button' });

      assert.throws(
        () => applier.apply([patch]),
        (err: any) => {
          assert.ok(err instanceof PatchExecutorError);
          assert.ok(err.message.includes('invalid index 99'));
          return true;
        }
      );
    });

    test('CREATE_NODE: missing parent when parentId is explicitly supplied throws PatchExecutorError', () => {
      const mockDoc = new MockDOMDocument();
      const applier = new DOMPatchApplier(undefined, mockDoc);
      const patch = createOperation(PatchOperationType.CREATE_NODE, 'new-node', 'non-existent-parent', 0, {
        id: 'new-node',
        kind: 'Div',
      });

      assert.throws(
        () => applier.apply([patch]),
        (err: any) => {
          assert.ok(err instanceof PatchExecutorError);
          assert.ok(err.message.includes('non-existent-parent'));
          assert.ok(err.message.includes('CREATE_NODE'));
          return true;
        }
      );
    });

    test('REMOVE_CHILD: missing target AND unusable parent/index throws PatchExecutorError', () => {
      const mockDoc = new MockDOMDocument();
      const applier = new DOMPatchApplier(undefined, mockDoc);
      const patch = removeChild('missing-target', 'missing-parent', 0);

      assert.throws(
        () => applier.apply([patch]),
        (err: any) => {
          assert.ok(err instanceof PatchExecutorError);
          assert.ok(err.message.includes('REMOVE_CHILD'));
          return true;
        }
      );
    });

    test('REMOVE_NODE: missing target throws PatchExecutorError with nodeId', () => {
      const mockDoc = new MockDOMDocument();
      const applier = new DOMPatchApplier(undefined, mockDoc);
      const patch = removeNode('missing-node-to-remove');

      assert.throws(
        () => applier.apply([patch]),
        (err: any) => {
          assert.ok(err instanceof PatchExecutorError);
          assert.ok(err.message.includes('missing-node-to-remove'));
          assert.ok(err.message.includes('REMOVE_NODE'));
          return true;
        }
      );
    });

    test('MOVE_CHILD: missing target throws PatchExecutorError with nodeId', () => {
      const mockDoc = new MockDOMDocument();
      const applier = new DOMPatchApplier(undefined, mockDoc);
      const patch = moveChild('missing-child', 'parent-1', 0);

      assert.throws(
        () => applier.apply([patch]),
        (err: any) => {
          assert.ok(err instanceof PatchExecutorError);
          assert.ok(err.message.includes('missing-child'));
          assert.ok(err.message.includes('MOVE_CHILD'));
          return true;
        }
      );
    });

    test('MOVE_CHILD: missing parent throws PatchExecutorError', () => {
      const mockDoc = new MockDOMDocument();
      const applier = new DOMPatchApplier(undefined, mockDoc);
      const child = mockDoc.createElement('SPAN');
      child.setAttribute('data-ast-id', 'child-span');
      applier.registerNode('child-span', child);

      const patch = moveChild('child-span', 'missing-parent', 0);

      assert.throws(
        () => applier.apply([patch]),
        (err: any) => {
          assert.ok(err instanceof PatchExecutorError);
          assert.ok(err.message.includes('missing-parent'));
          return true;
        }
      );
    });

    test('MOVE_CHILD: invalid index throws PatchExecutorError with remaining children count', () => {
      const mockDoc = new MockDOMDocument();
      const parent = mockDoc.createElement('DIV');
      parent.setAttribute('data-ast-id', 'parent-box');
      const c1 = mockDoc.createElement('SPAN');
      c1.setAttribute('data-ast-id', 'c1');
      const c2 = mockDoc.createElement('SPAN');
      c2.setAttribute('data-ast-id', 'c2');
      parent.appendChild(c1);
      parent.appendChild(c2);

      const applier = new DOMPatchApplier(parent, mockDoc);
      applier.registerNode('parent-box', parent);
      applier.registerNode('c1', c1);
      applier.registerNode('c2', c2);

      // c1 is removed, 1 child remaining (c2). Valid indices after removal are [0, 1].
      // Index 5 is out of bounds.
      const patch = moveChild('c1', 'parent-box', 5);

      assert.throws(
        () => applier.apply([patch]),
        (err: any) => {
          assert.ok(err instanceof PatchExecutorError);
          assert.ok(err.message.includes('invalid index 5'));
          return true;
        }
      );
    });

    test('REPLACE_NODE: missing target throws PatchExecutorError with nodeId', () => {
      const mockDoc = new MockDOMDocument();
      const applier = new DOMPatchApplier(undefined, mockDoc);
      const patch = replaceNode('missing-target', 'parent-1', 0, { id: 'replacement', kind: 'Div' });

      assert.throws(
        () => applier.apply([patch]),
        (err: any) => {
          assert.ok(err instanceof PatchExecutorError);
          assert.ok(err.message.includes('missing-target'));
          assert.ok(err.message.includes('REPLACE_NODE'));
          return true;
        }
      );
    });
  });

  // =========================================================================
  // 3 & 4. MOVE_CHILD SEMANTICS & MOVEMENT TEST SUITE
  // =========================================================================
  describe('3 & 4. MOVE_CHILD Semantics & Permutations', () => {
    function buildListAST(ids: string[]): ComponentNode {
      const page: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc);
      page.id = 'page-root';
      page.children = ids.map(id => {
        const item: any = ASTFactory.createComponent(ASTNodeKind.Container, emptyLoc);
        item.id = id;
        item.properties = [
          ASTFactory.createProperty('key', ASTFactory.createLiteral(id, id, emptyLoc), emptyLoc),
        ];
        return item;
      });
      return page;
    }

    function buildListDOM(ids: string[], mockDoc: MockDOMDocument): { parent: MockDOMNode; nodeMap: Map<string, MockDOMNode> } {
      const parent = mockDoc.createElement('DIV');
      parent.setAttribute('data-ast-id', 'page-root');
      const nodeMap = new Map<string, MockDOMNode>();
      nodeMap.set('page-root', parent);

      for (const id of ids) {
        const item = mockDoc.createElement('DIV');
        item.setAttribute('data-ast-id', id);
        parent.appendChild(item);
        nodeMap.set(id, item);
      }
      return { parent, nodeMap };
    }

    function runPermutationTest(fromIds: string[], toIds: string[]) {
      const oldAst = buildListAST(fromIds);
      const newAst = buildListAST(toIds);

      const generator = new PatchGenerator();
      const patches = generator.generate(oldAst, newAst);

      // Verify all emitted patches are valid operations
      for (const p of patches) {
        assert.ok(
          p.operation === PatchOperationType.MOVE_CHILD,
          `Expected MOVE_CHILD but got ${p.operation} for transition [${fromIds}] -> [${toIds}]`
        );
      }

      // 1. Test AST Executor
      const astClone = cloneAST(oldAst);
      const executor = new PatchExecutor(astClone);
      executor.execute(patches);
      const actualASTIds = (executor.getRoot() as ComponentNode).children.map(c => c.id);
      assert.deepStrictEqual(actualASTIds, toIds, `AST children mismatch for transition [${fromIds}] -> [${toIds}]`);

      // 2. Test DOM Applier
      const mockDoc = new MockDOMDocument();
      const { parent, nodeMap } = buildListDOM(fromIds, mockDoc);
      const applier = new DOMPatchApplier(parent, mockDoc);
      for (const [id, el] of nodeMap) {
        applier.registerNode(id, el);
      }

      applier.apply(patches);
      const actualDOMIds = parent.childNodes.map(c => c.getAttribute('data-ast-id'));
      assert.deepStrictEqual(actualDOMIds, toIds, `DOM children mismatch for transition [${fromIds}] -> [${toIds}]`);
    }

    test('Case 1: A B → B A', () => {
      runPermutationTest(['A', 'B'], ['B', 'A']);
    });

    test('Case 2: A B C → C A B', () => {
      runPermutationTest(['A', 'B', 'C'], ['C', 'A', 'B']);
    });

    test('Case 3: A B C → B C A', () => {
      runPermutationTest(['A', 'B', 'C'], ['B', 'C', 'A']);
    });

    test('Case 4: A B C → A C B', () => {
      runPermutationTest(['A', 'B', 'C'], ['A', 'C', 'B']);
    });

    test('Case 5: A B C D → D B A C', () => {
      runPermutationTest(['A', 'B', 'C', 'D'], ['D', 'B', 'A', 'C']);
    });

    test('Case 6: A B C D → B D A C', () => {
      runPermutationTest(['A', 'B', 'C', 'D'], ['B', 'D', 'A', 'C']);
    });

    test('Case 7: A B C D → A D C B', () => {
      runPermutationTest(['A', 'B', 'C', 'D'], ['A', 'D', 'C', 'B']);
    });
  });

  // =========================================================================
  // 5. REPLACEMENT SUBTREE REGISTRY
  // =========================================================================
  describe('5. Replacement Subtree Registry', () => {
    test('REPLACE_NODE unregisters old descendants and registers new descendants', () => {
      const mockDoc = new MockDOMDocument();
      const pageEl = mockDoc.createElement('DIV');
      pageEl.setAttribute('data-ast-id', 'old-page');

      const btnEl = mockDoc.createElement('BUTTON');
      btnEl.setAttribute('data-ast-id', 'old-button');

      const spanEl = mockDoc.createElement('SPAN');
      spanEl.setAttribute('data-ast-id', 'old-span');

      const textEl = mockDoc.createTextNode('Old Text');
      textEl.__ast_id = 'old-text';

      spanEl.appendChild(textEl);
      btnEl.appendChild(spanEl);
      pageEl.appendChild(btnEl);

      const applier = new DOMPatchApplier(pageEl, mockDoc);
      applier.registerNode('old-page', pageEl);
      applier.registerNode('old-button', btnEl);
      applier.registerNode('old-span', spanEl);
      applier.registerNode('old-text', textEl);

      assert.ok(applier.getNode('old-button'));
      assert.ok(applier.getNode('old-span'));
      assert.ok(applier.getNode('old-text'));

      // New replacement payload: Section(new-section) -> Div(new-div) -> Literal(new-text)
      const replacementPayload = {
        id: 'new-section',
        kind: 'GenericComponent',
        name: 'section',
        children: [
          {
            id: 'new-div',
            kind: 'GenericComponent',
            name: 'div',
            children: [
              {
                id: 'new-text',
                kind: 'Literal',
                value: 'New Text',
              },
            ],
          },
        ],
      };

      const patch = replaceNode('old-button', 'old-page', 0, replacementPayload);
      applier.apply([patch]);

      // Old IDs MUST be removed from registry
      assert.strictEqual(applier.getNode('old-button'), undefined, 'old-button must be unregistered');
      assert.strictEqual(applier.getNode('old-span'), undefined, 'old-span must be unregistered');
      assert.strictEqual(applier.getNode('old-text'), undefined, 'old-text must be unregistered');

      // New IDs MUST be registered and resolvable through getNode()
      const newSection = applier.getNode('new-section');
      const newDiv = applier.getNode('new-div');
      const newText = applier.getNode('new-text');

      assert.ok(newSection, 'new-section must be resolved');
      assert.ok(newDiv, 'new-div must be resolved');
      assert.ok(newText, 'new-text must be resolved');

      assert.strictEqual(newSection.nodeName, 'SECTION');
      assert.strictEqual(newDiv.nodeName, 'DIV');
      assert.strictEqual(newText.nodeType, 3);
      assert.strictEqual(newText.nodeValue, 'New Text');
    });
  });

  // =========================================================================
  // 6. INSERTED SUBTREE REGISTRY
  // =========================================================================
  describe('6. Inserted Subtree Registry', () => {
    test('INSERT_CHILD automatically registers new subtree descendants in nodeMap', () => {
      const mockDoc = new MockDOMDocument();
      const pageEl = mockDoc.createElement('DIV');
      pageEl.setAttribute('data-ast-id', 'old-page');

      const applier = new DOMPatchApplier(pageEl, mockDoc);
      applier.registerNode('old-page', pageEl);

      const insertedPayload = {
        id: 'new-section',
        kind: 'GenericComponent',
        name: 'section',
        children: [
          {
            id: 'new-button',
            kind: ASTNodeKind.Button,
            children: [
              {
                id: 'new-text',
                kind: ASTNodeKind.Literal,
                value: 'Click Me',
              },
            ],
          },
        ],
      };

      const patch = insertChild('new-section', 'old-page', 0, insertedPayload);
      applier.apply([patch]);

      // All descendants must resolve through getNode() without separate registration
      const newSection = applier.getNode('new-section');
      const newButton = applier.getNode('new-button');
      const newText = applier.getNode('new-text');

      assert.ok(newSection, 'new-section must be resolved');
      assert.ok(newButton, 'new-button must be resolved');
      assert.ok(newText, 'new-text must be resolved');

      assert.strictEqual(newSection.nodeName, 'SECTION');
      assert.strictEqual(newButton.nodeName, 'BUTTON');
      assert.strictEqual(newText.nodeType, 3);
      assert.strictEqual(newText.nodeValue, 'Click Me');
    });
  });

  // =========================================================================
  // 7. REMOVED SUBTREE REGISTRY
  // =========================================================================
  describe('7. Removed Subtree Registry', () => {
    test('Removing a parent unregisters the parent and all descendants from registry', () => {
      const mockDoc = new MockDOMDocument();
      const pageEl = mockDoc.createElement('DIV');
      pageEl.setAttribute('data-ast-id', 'old-page');

      const sectionEl = mockDoc.createElement('SECTION');
      sectionEl.setAttribute('data-ast-id', 'old-section');

      const btnEl = mockDoc.createElement('BUTTON');
      btnEl.setAttribute('data-ast-id', 'old-button');

      const textEl = mockDoc.createTextNode('Old Text');
      textEl.__ast_id = 'old-text';

      btnEl.appendChild(textEl);
      sectionEl.appendChild(btnEl);
      pageEl.appendChild(sectionEl);

      const applier = new DOMPatchApplier(pageEl, mockDoc);
      applier.registerNode('old-page', pageEl);
      applier.registerNode('old-section', sectionEl);
      applier.registerNode('old-button', btnEl);
      applier.registerNode('old-text', textEl);

      assert.ok(applier.getNode('old-section'));
      assert.ok(applier.getNode('old-button'));
      assert.ok(applier.getNode('old-text'));

      const patch = removeChild('old-section', 'old-page', 0);
      applier.apply([patch]);

      assert.strictEqual(applier.getNode('old-section'), undefined, 'getNode(old-section) must be undefined');
      assert.strictEqual(applier.getNode('old-button'), undefined, 'getNode(old-button) must be undefined');
      assert.strictEqual(applier.getNode('old-text'), undefined, 'getNode(old-text) must be undefined');
    });
  });

  // =========================================================================
  // 8. UPDATE_TEXT SAFETY
  // =========================================================================
  describe('8. UPDATE_TEXT Safety Verification', () => {
    test('UPDATE_TEXT targets Text node, preserves siblings, and rejects Element target', () => {
      const mockDoc = new MockDOMDocument();
      const p = mockDoc.createElement('P');
      p.setAttribute('data-ast-id', 'p-1');

      const lit = mockDoc.createTextNode('Initial Text');
      lit.__ast_id = 'lit-1';

      const icon = mockDoc.createElement('SPAN');
      icon.setAttribute('data-ast-id', 'icon-1');
      icon.textContent = '★';

      p.appendChild(lit);
      p.appendChild(icon);

      const applier = new DOMPatchApplier(p, mockDoc);
      applier.registerNode('p-1', p);
      applier.registerNode('lit-1', lit);
      applier.registerNode('icon-1', icon);

      // Valid text update
      const validPatch = updateText('lit-1', 'Updated Text');
      applier.apply([validPatch]);

      assert.strictEqual(lit.nodeValue, 'Updated Text');
      assert.strictEqual(icon.textContent, '★', 'Sibling span must remain untouched');
      assert.strictEqual(p.childNodes.length, 2, 'P must retain exactly 2 children');

      // Invalid update targeting P element
      const invalidPatch = updateText('p-1', 'Should Fail');
      assert.throws(
        () => applier.apply([invalidPatch]),
        (err: any) => {
          assert.ok(err instanceof PatchExecutorError);
          assert.ok(err.message.includes('Element'));
          return true;
        }
      );
      // Verify children untouched
      assert.strictEqual(p.childNodes.length, 2);
      assert.strictEqual(p.childNodes[0], lit);
      assert.strictEqual(p.childNodes[1], icon);
    });
  });

  // =========================================================================
  // 9. PATCH ATOMICITY (SEQUENTIAL FAIL-FAST)
  // =========================================================================
  describe('9. Patch Atomicity & Fail-Fast', () => {
    test('Multi-operation patch sequence fails fast at first failing op and reports diagnostics', () => {
      const mockDoc = new MockDOMDocument();
      const root = mockDoc.createElement('DIV');
      root.setAttribute('data-ast-id', 'root-1');

      const node1 = mockDoc.createElement('SPAN');
      node1.setAttribute('data-ast-id', 'span-1');
      root.appendChild(node1);

      const applier = new DOMPatchApplier(root, mockDoc);
      applier.registerNode('root-1', root);
      applier.registerNode('span-1', node1);

      const sequence = [
        setAttribute('span-1', 'class', 'step-1-applied'),
        setAttribute('missing-node-404', 'class', 'should-fail'),
        setAttribute('span-1', 'class', 'step-3-never-reached'),
      ];

      assert.throws(
        () => applier.apply(sequence),
        (err: any) => {
          assert.ok(err instanceof PatchExecutorError);
          assert.ok(err.message.includes('missing-node-404'));
          return true;
        }
      );

      // Step 1 was applied before failure
      assert.strictEqual(node1.getAttribute('class'), 'step-1-applied');
      // Step 3 was NEVER applied
      assert.notStrictEqual(node1.getAttribute('class'), 'step-3-never-reached');
    });
  });

  // =========================================================================
  // 10. SERIALIZATION & TRANSPORT TIMESTAMPS
  // =========================================================================
  describe('10. Serialization & Transport Timestamps', () => {
    test('All canonical PatchOperations survive JSON round-trip without losing fields', () => {
      const ops: PatchOperation[] = [
        createOperation(PatchOperationType.CREATE_NODE, 'n-1', 'p-1', 0, { kind: 'Div' }),
        insertChild('n-2', 'p-1', 1, { kind: 'Span' }),
        removeChild('n-3', 'p-1', 2),
        removeNode('n-4'),
        moveChild('n-5', 'p-1', 3, 0),
        replaceNode('n-6', 'p-1', 4, { kind: 'Button' }),
        updateText('n-7', 'hello world'),
        setAttribute('n-8', 'title', 'tooltip'),
        removeAttribute('n-9', 'title'),
      ];

      const serialized = PatchSerializer.serialize(ops);
      const deserialized = PatchSerializer.deserialize(serialized);

      assert.strictEqual(deserialized.length, ops.length);
      for (let i = 0; i < ops.length; i++) {
        assert.strictEqual(deserialized[i].operation, ops[i].operation);
        assert.strictEqual(deserialized[i].nodeId, ops[i].nodeId);
        assert.strictEqual(deserialized[i].parentId, ops[i].parentId);
        assert.strictEqual(deserialized[i].index, ops[i].index);
        assert.deepStrictEqual(deserialized[i].payload, ops[i].payload);
      }
    });

    test('Transport timestamps do not alter patch logical structure', () => {
      const op = updateText('t-1', 'test content');
      const opWithTimestamp = attachTransportTimestamp(op, 1700000000000);

      assert.strictEqual(opWithTimestamp.timestamp, 1700000000000);
      assert.strictEqual(opWithTimestamp.operation, op.operation);
      assert.strictEqual(opWithTimestamp.nodeId, op.nodeId);
      assert.deepStrictEqual(opWithTimestamp.payload, op.payload);
    });
  });

  // =========================================================================
  // 11. SECURITY
  // =========================================================================
  describe('11. Security Constraints', () => {
    test('Blocks inline event handlers, javascript: URLs, and neutralizes script tags', () => {
      const mockDoc = new MockDOMDocument();
      const applier = new DOMPatchApplier(undefined, mockDoc);

      // Script tag neutralization
      const scriptDom = applier.createDOMNode({
        id: 'script-tag',
        kind: 'GenericComponent',
        name: 'script',
        properties: [{ name: 'src', value: 'https://evil.com/payload.js' }],
      });
      assert.strictEqual(scriptDom.nodeName, 'TEMPLATE', 'Script tag must be converted to TEMPLATE');

      // Inline event handlers and javascript: URLs blocked
      const anchorDom = applier.createDOMNode({
        id: 'anchor-tag',
        kind: 'GenericComponent',
        name: 'a',
        properties: [
          { name: 'onclick', value: 'alert(1)' },
          { name: 'onerror', value: 'alert(2)' },
          { name: 'onload', value: 'alert(3)' },
          { name: 'href', value: 'javascript:alert(4)' },
          { name: 'class', value: 'safe-link' },
        ],
      });

      assert.strictEqual(anchorDom.getAttribute('onclick'), undefined);
      assert.strictEqual(anchorDom.getAttribute('onerror'), undefined);
      assert.strictEqual(anchorDom.getAttribute('onload'), undefined);
      assert.strictEqual(anchorDom.getAttribute('href'), undefined);
      assert.strictEqual(anchorDom.getAttribute('class'), 'safe-link');
    });
  });

  // =========================================================================
  // 12. FINAL ROUND-TRIP TEST
  // =========================================================================
  describe('12. Final Round-Trip Integration Test', () => {
    test('Comprehensive multi-level AST A -> Patch -> AST B with DOM equivalence', () => {
      // AST A:
      // Page (page-1)
      //  ├── Nav (nav-1)
      //  │    ├── Home (home-btn)
      //  │    └── Docs (docs-btn)
      //  └── Hero (hero-1)
      //       ├── H1 (h1-1) -> Literal(h1-text-old: "Welcome")
      //       ├── Paragraph (p-1) -> Literal(p-text-old: "Description")
      //       └── Button (btn-1, class: "btn-primary")
      const homeBtn: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc, [], [], 'Home');
      homeBtn.id = 'home-btn';
      const docsBtn: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc, [], [], 'Docs');
      docsBtn.id = 'docs-btn';

      const nav: any = ASTFactory.createComponent(ASTNodeKind.Container, emptyLoc, [], [homeBtn, docsBtn], 'nav');
      nav.id = 'nav-1';

      const h1TextOld: any = ASTFactory.createLiteral('Welcome', 'Welcome', emptyLoc);
      h1TextOld.id = 'h1-text-old';
      const h1: any = ASTFactory.createComponent(ASTNodeKind.Heading, emptyLoc, [], [h1TextOld]);
      h1.id = 'h1-1';
      h1TextOld.parent = h1;

      const pTextOld: any = ASTFactory.createLiteral('Description', 'Description', emptyLoc);
      pTextOld.id = 'p-text-old';
      const p: any = ASTFactory.createComponent(ASTNodeKind.Paragraph, emptyLoc, [], [pTextOld]);
      p.id = 'p-1';
      pTextOld.parent = p;

      const heroBtn: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc);
      heroBtn.id = 'btn-1';
      heroBtn.properties = [
        ASTFactory.createProperty('class', ASTFactory.createLiteral('btn-primary', 'btn-primary', emptyLoc), emptyLoc),
      ];

      const hero: any = ASTFactory.createComponent(ASTNodeKind.Container, emptyLoc, [], [h1, p, heroBtn], 'section');
      hero.id = 'hero-1';
      h1.parent = hero;
      p.parent = hero;
      heroBtn.parent = hero;

      const astA: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc, [], [nav, hero]);
      astA.id = 'page-1';
      nav.parent = astA;
      hero.parent = astA;

      // AST B:
      // Page (page-1)
      //  ├── Hero (hero-1)
      //  │    ├── H1 (h1-1) -> Literal(h1-text-new: "Welcome to Next Gen")
      //  │    ├── Paragraph (p-1) -> Literal(p-text-new: "New Description")
      //  │    └── Button (btn-1, class: "btn-accent")
      //  ├── Nav (nav-1)
      //  │    └── Home (home-btn)
      //  └── Footer (footer-new)
      const homeBtnB: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc, [], [], 'Home');
      homeBtnB.id = 'home-btn';
      const navB: any = ASTFactory.createComponent(ASTNodeKind.Container, emptyLoc, [], [homeBtnB], 'nav');
      navB.id = 'nav-1';
      homeBtnB.parent = navB;

      const h1TextNew: any = ASTFactory.createLiteral('Welcome to Next Gen', 'Welcome to Next Gen', emptyLoc);
      h1TextNew.id = 'h1-text-new';
      const h1B: any = ASTFactory.createComponent(ASTNodeKind.Heading, emptyLoc, [], [h1TextNew]);
      h1B.id = 'h1-1';
      h1TextNew.parent = h1B;

      const pTextNew: any = ASTFactory.createLiteral('New Description', 'New Description', emptyLoc);
      pTextNew.id = 'p-text-new';
      const pB: any = ASTFactory.createComponent(ASTNodeKind.Paragraph, emptyLoc, [], [pTextNew]);
      pB.id = 'p-1';
      pTextNew.parent = pB;

      const heroBtnB: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc);
      heroBtnB.id = 'btn-1';
      heroBtnB.properties = [
        ASTFactory.createProperty('class', ASTFactory.createLiteral('btn-accent', 'btn-accent', emptyLoc), emptyLoc),
      ];

      const heroB: any = ASTFactory.createComponent(ASTNodeKind.Container, emptyLoc, [], [h1B, pB, heroBtnB], 'section');
      heroB.id = 'hero-1';
      h1B.parent = heroB;
      pB.parent = heroB;
      heroBtnB.parent = heroB;

      const footerB: any = ASTFactory.createComponent(ASTNodeKind.Container, emptyLoc, [], [], 'footer');
      footerB.id = 'footer-new';

      const astB: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc, [], [heroB, navB, footerB]);
      astB.id = 'page-1';
      heroB.parent = astB;
      navB.parent = astB;
      footerB.parent = astB;

      // 1. Generate patches
      const generator = new PatchGenerator();
      const rawPatches = generator.generate(astA, astB);

      // 2. Serialize patches
      const json = PatchSerializer.serialize(rawPatches);

      // 3. Deserialize patches
      const patches = PatchSerializer.deserialize(json);

      // 4. Execute against AST A
      const astAClone = cloneAST(astA);
      const executor = new PatchExecutor(astAClone);
      executor.execute(patches);

      // Verify AST result matches AST B structure
      const astResult = executor.getRoot();
      assert.deepStrictEqual(cleanAstForComparison(astResult, false), cleanAstForComparison(astB, false));

      // Verify HTML renderer equivalence between patched AST result and target AST B
      const renderer = new HtmlRenderer();
      assert.strictEqual(renderer.render(astResult), renderer.render(astB));

      // 5. Execute against DOM A
      const mockDoc = new MockDOMDocument();
      const applier = new DOMPatchApplier(undefined, mockDoc);
      // Materialize initial DOM A using createDOMNode
      const domRoot = applier.createDOMNode(astA);
      applier.setContainer(domRoot);

      applier.apply(patches);

      // Verify DOM structure reflects AST B:
      // Hero comes before Nav
      assert.strictEqual(domRoot.childNodes.length, 3);
      assert.strictEqual(domRoot.childNodes[0].getAttribute('data-ast-id'), 'hero-1');
      assert.strictEqual(domRoot.childNodes[1].getAttribute('data-ast-id'), 'nav-1');
      assert.strictEqual(domRoot.childNodes[2].getAttribute('data-ast-id'), 'footer-new');

      // Verify text updated
      const h1Dom = applier.getNode('h1-1');
      assert.strictEqual(h1Dom.childNodes[0].nodeValue, 'Welcome to Next Gen');
      const pDom = applier.getNode('p-1');
      assert.strictEqual(pDom.childNodes[0].nodeValue, 'New Description');

      // Verify button class updated
      const btnDom = applier.getNode('btn-1');
      assert.strictEqual(btnDom.getAttribute('class'), 'btn-accent');

      // Verify Docs removed from Nav
      const navDom = applier.getNode('nav-1');
      assert.strictEqual(navDom.childNodes.length, 1);
      assert.strictEqual(navDom.childNodes[0].getAttribute('data-ast-id'), 'home-btn');
      assert.strictEqual(applier.getNode('docs-btn'), undefined, 'Docs button must be unregistered');

      // Verify new Footer registered
      assert.ok(applier.getNode('footer-new'), 'footer-new must be registered');
    });
  });

  // =========================================================================
  // 13. DETERMINISM
  // =========================================================================
  describe('13. Determinism Verification (100x)', () => {
    test('Running generator 100 times on identical AST transition produces identical serialized patches', () => {
      const ast1: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc);
      ast1.id = 'p-det';
      const c1: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc);
      c1.id = 'b-1';
      c1.properties = [ASTFactory.createProperty('class', ASTFactory.createLiteral('btn', 'btn', emptyLoc), emptyLoc)];
      const c2: any = ASTFactory.createComponent(ASTNodeKind.Container, emptyLoc);
      c2.id = 'c-2';
      ast1.children = [c1, c2];

      const ast2: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc);
      ast2.id = 'p-det';
      const c1New: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc);
      c1New.id = 'b-1';
      c1New.properties = [ASTFactory.createProperty('class', ASTFactory.createLiteral('btn-active', 'btn-active', emptyLoc), emptyLoc)];
      const c3New: any = ASTFactory.createComponent(ASTNodeKind.Text, emptyLoc);
      c3New.id = 't-3';
      ast2.children = [c2, c1New, c3New];

      const generator = new PatchGenerator();
      const firstRunJSON = PatchSerializer.serialize(generator.generate(ast1, ast2));

      for (let i = 0; i < 100; i++) {
        const currentJSON = PatchSerializer.serialize(generator.generate(ast1, ast2));
        assert.strictEqual(
          currentJSON,
          firstRunJSON,
          `Run #${i} produced different serialized patches than baseline run`
        );
      }
    });
  });

  // =========================================================================
  // 14. PERFORMANCE (1,000+ SIBLINGS)
  // =========================================================================
  describe('14. Performance Hardening (1,000+ Siblings)', () => {
    test('Generates and executes patches on 1,000 siblings within performance threshold', () => {
      const itemsOld: any[] = [];
      for (let i = 0; i < 1000; i++) {
        const item: any = ASTFactory.createComponent(ASTNodeKind.Container, emptyLoc);
        item.id = `item-${i}`;
        itemsOld.push(item);
      }
      const pageOld: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc, [], itemsOld);
      pageOld.id = 'large-page';

      // Move index 0 to index 999
      const item0 = itemsOld[0];
      const itemsNew = [...itemsOld.slice(1), item0];
      const pageNew: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc, [], itemsNew);
      pageNew.id = 'large-page';

      const generator = new PatchGenerator();
      const startGen = performance.now();
      const patches = generator.generate(pageOld, pageNew);
      const elapsedGen = performance.now() - startGen;

      assert.strictEqual(patches.length, 1, 'Should generate exactly 1 MOVE_CHILD op');
      assert.strictEqual(patches[0].operation, PatchOperationType.MOVE_CHILD);
      assert.ok(elapsedGen < 50, `Patch generation took ${elapsedGen.toFixed(2)}ms (expected < 50ms)`);

      // Execution benchmark
      const clone = cloneAST(pageOld);
      const executor = new PatchExecutor(clone);
      const startExec = performance.now();
      executor.execute(patches);
      const elapsedExec = performance.now() - startExec;

      assert.ok(elapsedExec < 20, `Patch execution took ${elapsedExec.toFixed(2)}ms (expected < 20ms)`);
      assert.strictEqual((clone.children as any[])[999].id, item0.id);
    });
  });
});
