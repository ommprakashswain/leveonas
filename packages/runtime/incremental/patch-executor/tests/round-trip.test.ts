import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { ASTFactory } from '../../../../compiler/ast/factory';
import { ASTNodeKind } from '../../../../compiler/ast/types';
import { ComponentNode, LiteralNode } from '../../../../compiler/ast/nodes';
import { PatchGenerator } from '../../patch-generator/generator';
import { PatchSerializer } from '../../patch-generator/serializer';
import { PatchExecutor } from '../executor';
import { DOMPatchApplier } from '../dom-applier';

describe('Patch Protocol - Round-Trip Integration and Purity', () => {
  const emptyLoc = ASTFactory.createSourceLocation(0, 0, 0, 0, 0, 0);

  function cleanAstForComparison(node: any): any {
    if (!node) return node;
    const cleaned: any = {
      kind: node.kind,
      id: node.id,
    };
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
      cleaned.children = node.children.map(cleanAstForComparison);
    }
    return cleaned;
  }

  function cloneASTWithIds(node: any, parent: any = null): any {
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
      copy.children = node.children.map((c: any) => cloneASTWithIds(c, copy));
    }
    return copy;
  }

  test('Patch Purity: should not mutate oldAST or newAST during diffing', () => {
    const child1: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc);
    child1.id = 'pure-btn-1';
    child1.properties = [ASTFactory.createProperty('label', ASTFactory.createLiteral('Save', 'Save', emptyLoc), emptyLoc)];

    const child2: any = ASTFactory.createComponent(ASTNodeKind.Text, emptyLoc);
    child2.id = 'pure-txt-2';

    const oldAst: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc, [], [child1, child2]);
    oldAst.id = 'pure-page';

    const child1Updated: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc);
    child1Updated.id = 'pure-btn-1';
    child1Updated.properties = [ASTFactory.createProperty('label', ASTFactory.createLiteral('Saving...', 'Saving...', emptyLoc), emptyLoc)];

    const child3New: any = ASTFactory.createComponent(ASTNodeKind.Input, emptyLoc);
    child3New.id = 'pure-input-3';

    const newAst: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc, [], [child3New, child1Updated]);
    newAst.id = 'pure-page';

    const oldSnapshotBefore = cleanAstForComparison(oldAst);
    const newSnapshotBefore = cleanAstForComparison(newAst);

    const generator = new PatchGenerator();
    const ops = generator.generate(oldAst, newAst);

    assert.ok(ops.length > 0, 'Should generate patches');

    // Assert absolute deep equality of ASTs before and after diffing
    assert.deepStrictEqual(cleanAstForComparison(oldAst), oldSnapshotBefore, 'oldAST must be completely unmutated');
    assert.deepStrictEqual(cleanAstForComparison(newAst), newSnapshotBefore, 'newAST must be completely unmutated');
  });

  test('Determinism: generator produces byte-for-byte identical JSON across multiple runs', () => {
    const btn1: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc);
    btn1.id = 'det-1';
    btn1.properties = [ASTFactory.createProperty('class', ASTFactory.createLiteral('btn-primary', 'btn-primary', emptyLoc), emptyLoc)];

    const btn2: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc);
    btn2.id = 'det-2';

    const oldAst: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc, [], [btn1, btn2]);
    oldAst.id = 'page-det';

    const btn1Up: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc);
    btn1Up.id = 'det-1';
    btn1Up.properties = [ASTFactory.createProperty('class', ASTFactory.createLiteral('btn-secondary', 'btn-secondary', emptyLoc), emptyLoc)];

    const btn3New: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc);
    btn3New.id = 'det-3';

    const newAst: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc, [], [btn2, btn3New, btn1Up]);
    newAst.id = 'page-det';

    const gen = new PatchGenerator();
    const ops1 = gen.generate(oldAst, newAst);
    const json1 = PatchSerializer.toJSON(ops1);

    for (let i = 0; i < 5; i++) {
      const opsN = gen.generate(oldAst, newAst);
      const jsonN = PatchSerializer.toJSON(opsN);
      assert.strictEqual(jsonN, json1, `Run ${i + 1} must produce byte-for-byte identical JSON patch`);
    }
  });

  test('Round-trip integration: AST_A -> DiffEngine -> JSON -> Deserializer -> PatchExecutor -> AST_B', () => {
    // 1. Build complex AST_A
    const btn1: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc);
    btn1.id = 'rt-btn-1';
    btn1.properties = [
      ASTFactory.createProperty('type', ASTFactory.createLiteral('submit', 'submit', emptyLoc), emptyLoc),
      ASTFactory.createProperty('disabled', ASTFactory.createLiteral(false, 'false', emptyLoc), emptyLoc),
    ];

    const label1 = ASTFactory.createLiteral('Submit Old', 'Submit Old', emptyLoc);
    label1.id = 'rt-label-1';
    btn1.children = [label1];

    const itemA: any = ASTFactory.createComponent(ASTNodeKind.Container, emptyLoc);
    itemA.id = 'item-a';
    const itemB: any = ASTFactory.createComponent(ASTNodeKind.Container, emptyLoc);
    itemB.id = 'item-b';
    const itemC: any = ASTFactory.createComponent(ASTNodeKind.Container, emptyLoc);
    itemC.id = 'item-c';

    const astA: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc, [], [btn1, itemA, itemB, itemC]);
    astA.id = 'rt-page';
    astA.properties = [
      ASTFactory.createProperty('theme', ASTFactory.createLiteral('light', 'light', emptyLoc), emptyLoc),
      ASTFactory.createProperty('obsolete-attr', ASTFactory.createLiteral('remove-me', 'remove-me', emptyLoc), emptyLoc),
    ];

    // 2. Build target AST_B:
    // - obsolete-attr removed, theme changed to 'dark', new title added
    // - btn1 updated (label updated to 'Submit New', disabled changed to true)
    // - itemB removed
    // - itemC moved to beginning
    // - new itemD inserted at end
    const btn1Target: any = ASTFactory.createComponent(ASTNodeKind.Button, emptyLoc);
    btn1Target.id = 'rt-btn-1';
    btn1Target.properties = [
      ASTFactory.createProperty('type', ASTFactory.createLiteral('submit', 'submit', emptyLoc), emptyLoc),
      ASTFactory.createProperty('disabled', ASTFactory.createLiteral(true, 'true', emptyLoc), emptyLoc),
    ];
    const label1Target = ASTFactory.createLiteral('Submit New', 'Submit New', emptyLoc);
    label1Target.id = 'rt-label-1';
    btn1Target.children = [label1Target];

    const itemCTarget: any = ASTFactory.createComponent(ASTNodeKind.Container, emptyLoc);
    itemCTarget.id = 'item-c';

    const itemATarget: any = ASTFactory.createComponent(ASTNodeKind.Container, emptyLoc);
    itemATarget.id = 'item-a';

    const itemDTarget: any = ASTFactory.createComponent(ASTNodeKind.Container, emptyLoc);
    itemDTarget.id = 'item-d';

    const astB: any = ASTFactory.createComponent(ASTNodeKind.Page, emptyLoc, [], [itemCTarget, btn1Target, itemATarget, itemDTarget]);
    astB.id = 'rt-page';
    astB.properties = [
      ASTFactory.createProperty('theme', ASTFactory.createLiteral('dark', 'dark', emptyLoc), emptyLoc),
      ASTFactory.createProperty('title', ASTFactory.createLiteral('Dashboard', 'Dashboard', emptyLoc), emptyLoc),
    ];

    // 3. Generate patches
    const generator = new PatchGenerator();
    const ops = generator.generate(astA, astB);
    assert.ok(ops.length > 0, 'Should generate patches');

    // 4. Serialize to JSON and deserialize back
    const json = PatchSerializer.toJSON(ops);
    assert.strictEqual(typeof json, 'string');
    const deserializedOps = PatchSerializer.fromJSON(json);
    assert.strictEqual(deserializedOps.length, ops.length);

    // 5. Deep clone AST_A preserving exact IDs to simulate executor starting state
    const astAClone = cloneASTWithIds(astA);
    const executor = new PatchExecutor(astAClone);
    executor.execute(deserializedOps);

    // 6. Assert AST_A_result structurally equals AST_B
    const cleanResult = cleanAstForComparison(astAClone);
    const cleanExpected = cleanAstForComparison(astB);

    assert.deepStrictEqual(cleanResult, cleanExpected, 'Executor result must match target AST_B exactly');
    assert.strictEqual(astAClone.children.length, 4);
    assert.strictEqual(astAClone.children[0].id, 'item-c');
    assert.strictEqual(astAClone.children[1].id, 'rt-btn-1');
    assert.strictEqual(astAClone.children[2].id, 'item-a');
    assert.strictEqual(astAClone.children[3].id, 'item-d');

    // Verify context registry correctness
    // @ts-ignore
    assert.strictEqual(executor.context.getNode('item-b'), undefined, 'Removed item-b must be unregistered');
    // @ts-ignore
    assert.ok(executor.context.getNode('item-d'), 'New item-d must be registered');
    // @ts-ignore
    assert.strictEqual(executor.context.isRemoved('item-b'), true, 'item-b must be marked as removed in context');
  });

  test('DOM Safety in DOMPatchApplier: prevents script execution and blocks inline event handlers', () => {
    // Mock minimal DOM environment for testing
    const createdElements: any[] = [];
    const mockDoc = {
      createElement(tag: string) {
        const el: any = {
          tagName: tag.toUpperCase(),
          attributes: {} as Record<string, string>,
          childNodes: [] as any[],
          setAttribute(name: string, val: string) {
            this.attributes[name] = val;
          },
          removeAttribute(name: string) {
            delete this.attributes[name];
          },
          appendChild(child: any) {
            this.childNodes.push(child);
            child.parentNode = this;
          },
          removeChild(child: any) {
            const idx = this.childNodes.indexOf(child);
            if (idx !== -1) this.childNodes.splice(idx, 1);
            child.parentNode = null;
          },
          parentNode: null as any,
        };
        createdElements.push(el);
        return el;
      },
      createTextNode(text: string) {
        return {
          nodeType: 3,
          nodeValue: text,
          parentNode: null as any,
        };
      },
    };

    const applier = new DOMPatchApplier(undefined, mockDoc);

    // 1. Test script tag neutralization
    const scriptNode = applier.createDOMNode({
      kind: 'GenericComponent',
      name: 'script',
      id: 'evil-script',
      properties: [{ name: 'src', value: 'http://malicious.com/evil.js' }],
    });
    assert.strictEqual(scriptNode.tagName, 'TEMPLATE', 'Script tag must be neutralized to TEMPLATE');

    // 2. Test event handler attribute blocking
    const btnNode = applier.createDOMNode({
      kind: ASTNodeKind.Button,
      id: 'safe-btn',
      properties: [
        { name: 'onclick', value: 'alert("xss")' },
        { name: 'href', value: 'javascript:alert(1)' },
        { name: 'class', value: 'btn' },
      ],
    });
    assert.strictEqual(btnNode.attributes['onclick'], undefined, 'onclick must be blocked');
    assert.strictEqual(btnNode.attributes['href'], undefined, 'javascript: href must be blocked');
    assert.strictEqual(btnNode.attributes['class'], 'btn', 'Safe class attribute must be set');

    // 3. Test boolean attributes
    const inputNode = applier.createDOMNode({
      kind: ASTNodeKind.Input,
      id: 'safe-input',
      properties: [
        { name: 'disabled', value: true },
      ],
    });
    assert.strictEqual(inputNode.disabled, true, 'disabled property must be true');
    assert.strictEqual(inputNode.attributes['disabled'], '', 'disabled attribute must be empty string');
  });
});
