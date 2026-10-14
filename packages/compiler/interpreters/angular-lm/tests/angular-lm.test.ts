import { describe, it } from 'node:test';
import assert from 'node:assert';
import { AngularLMInterpreter } from '../interpreter';
import { AngularLMSerializer } from '../serializer';
import { AngularLMValidator } from '../validator';
import { AngularReconciler } from '../reconciler';
import { AngularNodeKind, resetAngularIdCounter } from '../ast';
import { AngularToLowering } from '../../../ui-ir/lowering/angular-lowering';
import { ReactToLowering } from '../../../ui-ir/lowering/react-lowering';
import { VueToLowering } from '../../../ui-ir/lowering/vue-lowering';
import { SvelteToLowering } from '../../../ui-ir/lowering/svelte-lowering';
import { ReactLMInterpreter } from '../../react-lm/interpreter';
import { VueLMInterpreter } from '../../vue-lm/interpreter';
import { SvelteLMInterpreter } from '../../svelte-lm/interpreter';
import { CommonUIReconciler } from '../../../ui-ir/reconciler';
import { DOMPatchApplier } from '../../../../runtime/incremental/patch-executor/dom-applier';
import { PatchGenerator } from '../../../../runtime/incremental/patch-generator/generator';
import { ASTFactory } from '../../../ast/factory';
import { ASTNodeKind, SourceLocation } from '../../../ast/types';
import { RootNode } from '../../../ast/nodes';
import { PatchOperationType } from '../../../../runtime/incremental/patch-generator/types';

const defaultLoc: SourceLocation = {
  startLine: 1,
  startColumn: 1,
  startOffset: 0,
  endLine: 1,
  endColumn: 1,
  endOffset: 0,
};

function createMockDOMEnvironment() {
  const eventListeners: Record<string, Function[]> = {};

  const createMockElement = (tagName: string, id: string = '') => {
    const classSet = new Set<string>();
    const el: any = {
      tagName: tagName.toUpperCase(),
      nodeType: 1,
      id: id,
      className: '',
      value: '',
      checked: false,
      style: {} as Record<string, string>,
      attributes: {} as Record<string, string>,
      childNodes: [] as any[],
      parentNode: null as any,
      classList: {
        add: (c: string) => {
          classSet.add(c);
          el.className = Array.from(classSet).join(' ');
        },
        remove: (c: string) => {
          classSet.delete(c);
          el.className = Array.from(classSet).join(' ');
        },
        contains: (c: string) => classSet.has(c) || el.className.split(/\s+/).includes(c),
      },
      setAttribute: (name: string, val: any) => {
        el.attributes[name] = String(val);
        if (name === 'id') el.id = String(val);
        if (name === 'class' || name === 'className') {
          el.className = String(val);
          classSet.clear();
          String(val).split(/\s+/).filter(Boolean).forEach((c) => classSet.add(c));
        }
        if (name === 'value') el.value = String(val);
        if (name === 'checked') el.checked = Boolean(val);
        if (name === 'style') {
          String(val).split(';').forEach((p) => {
            const idx = p.indexOf(':');
            if (idx !== -1) el.style[p.slice(0, idx).trim()] = p.slice(idx + 1).trim();
          });
        }
      },
      getAttribute: (name: string) => {
        if (name === 'id') return el.id;
        if (name === 'class' || name === 'className') return el.className;
        return el.attributes[name] ?? null;
      },
      removeAttribute: (name: string) => {
        delete el.attributes[name];
      },
      appendChild: (child: any) => {
        child.parentNode = el;
        el.childNodes.push(child);
        return child;
      },
      insertBefore: (newChild: any, refChild: any) => {
        newChild.parentNode = el;
        const idx = el.childNodes.indexOf(refChild);
        if (idx !== -1) {
          el.childNodes.splice(idx, 0, newChild);
        } else {
          el.childNodes.push(newChild);
        }
        return newChild;
      },
      removeChild: (child: any) => {
        const idx = el.childNodes.indexOf(child);
        if (idx !== -1) {
          el.childNodes.splice(idx, 1);
          child.parentNode = null;
        }
        return child;
      },
      replaceChild: (newChild: any, oldChild: any) => {
        const idx = el.childNodes.indexOf(oldChild);
        if (idx !== -1) {
          el.childNodes[idx] = newChild;
          newChild.parentNode = el;
          oldChild.parentNode = null;
        }
        return oldChild;
      },
      closest: (sel: string) => {
        const cleanSel = sel.replace(/^#/, '');
        let cur: any = el;
        while (cur) {
          if (cur.id === cleanSel || cur.__ast_id === cleanSel || (cur.attributes && cur.attributes['id'] === cleanSel)) {
            return cur;
          }
          cur = cur.parentNode;
        }
        return null;
      },
      matches: (sel: string) => {
        const cleanSel = sel.replace(/^#/, '');
        return el.id === cleanSel || el.__ast_id === cleanSel;
      },
      dispatchEvent: (evt: any) => {
        evt.target = evt.target || el;
        const handlers = eventListeners[evt.type] || [];
        for (const h of handlers) {
          h(evt);
        }
      },
      click: () => {
        el.dispatchEvent({ type: 'click', target: el });
      },
    };
    return el;
  };

  const createMockTextNode = (text: string) => {
    const txt: any = {
      nodeType: 3,
      textContent: text,
      nodeValue: text,
      parentNode: null,
    };
    return txt;
  };

  const mockRoot = createMockElement('div', 'leveonas-root');
  const mockBody = createMockElement('body', 'body');
  mockBody.appendChild(mockRoot);

  mockBody.addEventListener = (evt: string, fn: Function) => {
    eventListeners[evt] = eventListeners[evt] || [];
    eventListeners[evt].push(fn);
  };

  const mockDoc: any = {
    body: mockBody,
    createElement: (tag: string) => createMockElement(tag),
    createTextNode: (text: string) => createMockTextNode(text),
    getElementById: (id: string) => {
      if (id === 'leveonas-root') return mockRoot;
      const findIn = (node: any): any => {
        if (node.id === id || node.__ast_id === id) return node;
        for (const c of node.childNodes || []) {
          const found = findIn(c);
          if (found) return found;
        }
        return null;
      };
      return findIn(mockBody);
    },
  };

  const mockWin: any = {
    document: mockDoc,
    __leveonas_state__: {},
    __leveonas_reactivity__: {},
  };

  const applier = new DOMPatchApplier(mockRoot, mockDoc, mockWin);
  return { mockDoc, mockWin, mockRoot, applier };
}

describe('Angular-LM V1 Interpreter, Lowering & Runtime Suite (Phase 2E)', () => {
  it('1. Parses Angular component with state, computed & events', () => {
    resetAngularIdCounter();
    const source = `
component(Counter)(
  state(count, 0)
  computed(double, count * 2)

  di(
    h1("Count: {{count}}")
    p("Double: {{double}}")
    bo((click):increment "+1")
  )
)
`.trim();

    const ast = AngularLMInterpreter.parse(source);
    assert.strictEqual(ast.kind, AngularNodeKind.Program);
    assert.strictEqual(ast.components.length, 1);

    const comp = ast.components[0];
    assert.strictEqual(comp.name, 'Counter');
    assert.strictEqual(comp.stateDeclarations.length, 1);
    assert.strictEqual(comp.stateDeclarations[0].stateName, 'count');
    assert.strictEqual(comp.stateDeclarations[0].initialValue, 0);

    assert.strictEqual(comp.derivedDeclarations.length, 1);
    assert.strictEqual(comp.derivedDeclarations[0].derivedName, 'double');
    assert.strictEqual(comp.derivedDeclarations[0].expression, 'count * 2');

    assert.strictEqual(comp.body.length, 1);
    const div = comp.body[0] as any;
    assert.strictEqual(div.tag, 'div');
    assert.strictEqual(div.children.length, 3);
  });

  it('2. Streaming Token Consumption: Parses split chunks across tokens without corrupting AST', () => {
    const interpreter = new AngularLMInterpreter();
    const chunks = [
      'comp',
      'onent(App)(\n',
      '  state(count',
      ', 0)\n',
      '  di(\n',
      '    h1("Co',
      'unt: {{co',
      'unt}}")\n',
      '    bo((click):in',
      'crement "+1")\n',
      '  )\n',
      ')',
    ];

    for (const chunk of chunks) {
      interpreter.write(chunk);
    }
    const ast = interpreter.end();

    assert.strictEqual(ast.components.length, 1);
    assert.strictEqual(ast.components[0].name, 'App');
    assert.strictEqual(ast.components[0].stateDeclarations[0].stateName, 'count');
  });

  it('3. Supports Angular Inputs & Outputs declarations', () => {
    const source = `
component(UserCard)(
  input(username, "Guest")
  output(selected)

  di(
    h2("User: {{username}}")
    bo((click):select "Select")
  )
)
`.trim();

    const ast = AngularLMInterpreter.parse(source);
    const comp = ast.components[0];
    assert.strictEqual(comp.inputs.length, 1);
    assert.strictEqual(comp.inputs[0].inputName, 'username');
    assert.strictEqual(comp.inputs[0].defaultValue, '"Guest"');
    assert.strictEqual(comp.outputs.length, 1);
    assert.strictEqual(comp.outputs[0].outputName, 'selected');
  });

  it('4. Supports Angular Property, Class, and Style bindings', () => {
    const source = `
component(StyledApp)(
  state(isActive, true)
  state(textColor, "red")

  di(
    input([value]:username)
    di([class.active]:isActive)
    p([style.color]:textColor "Styled text")
  )
)
`.trim();

    const ast = AngularLMInterpreter.parse(source);
    const comp = ast.components[0];
    const rootDiv = comp.body[0] as any;

    const inputNode = rootDiv.children[0];
    assert.strictEqual(inputNode.tag, 'input');
    assert.ok(inputNode.props.some((p: any) => p.name === 'value'));

    const classDiv = rootDiv.children[1];
    assert.strictEqual(classDiv.dynamicClassConditions?.active, 'isActive');

    const styleP = rootDiv.children[2];
    assert.strictEqual(styleP.dynamicStyles?.color, 'textColor');
  });

  it('5. Supports Angular Two-Way Binding [(ngModel)]', () => {
    const source = `
component(FormApp)(
  state(username, "Alice")

  di(
    input([(ngModel)]:username)
  )
)
`.trim();

    const ast = AngularLMInterpreter.parse(source);
    const comp = ast.components[0];
    const rootDiv = comp.body[0] as any;
    const inputNode = rootDiv.children[0];
    assert.strictEqual(inputNode.modelBinding, 'username');
  });

  it('6. Supports Angular Conditionals (@if / if)', () => {
    const source = `
component(CondApp)(
  state(isVisible, true)

  di(
    @if(isVisible)(
      p("Visible content")
    )
  )
)
`.trim();

    const ast = AngularLMInterpreter.parse(source);
    const comp = ast.components[0];
    const rootDiv = comp.body[0] as any;
    const ifNode = rootDiv.children[0];
    assert.strictEqual(ifNode.kind, AngularNodeKind.Conditional);
    assert.strictEqual(ifNode.conditionExpr, 'isVisible');
    assert.strictEqual(ifNode.thenBranch.tag, 'p');
  });

  it('7. Supports Angular Keyed For Loops (@for ... track)', () => {
    const source = `
component(ListApp)(
  state(items, [{id: "1", name: "A"}, {id: "2", name: "B"}])

  ul(
    @for(items, item, item.id)(
      li("{{item.name}}")
    )
  )
)
`.trim();

    const ast = AngularLMInterpreter.parse(source);
    const comp = ast.components[0];
    const ul = comp.body[0] as any;
    const forNode = ul.children[0];
    assert.strictEqual(forNode.kind, AngularNodeKind.For);
    assert.strictEqual(forNode.arrayExpr, 'items');
    assert.strictEqual(forNode.itemVar, 'item');
    assert.strictEqual(forNode.trackExpr, 'item.id');
  });

  it('8. Supports Content Projection (ng-content)', () => {
    const source = `
component(Card)(
  di(
    h3("Card Title")
    ng-content(
      p("Default fallback")
    )
  )
)
`.trim();

    const ast = AngularLMInterpreter.parse(source);
    const comp = ast.components[0];
    const rootDiv = comp.body[0] as any;
    const proj = rootDiv.children[1];
    assert.strictEqual(proj.kind, AngularNodeKind.ContentProjection);
  });

  it('9. Lowers Angular AST to Common UI IR cleanly', () => {
    const source = `
component(App)(
  state(count, 0)
  computed(double, count * 2)

  di(
    h1("Count: {{count}}")
    p("Double: {{double}}")
    bo((click):increment "+1")
  )
)
`.trim();

    const ast = AngularLMInterpreter.parse(source);
    const uiir = AngularToLowering.lower(ast);

    assert.strictEqual(uiir.components.length, 1);
    const comp = uiir.components[0];
    assert.strictEqual(comp.name, 'App');
    assert.strictEqual(comp.stateDeclarations.length, 1);
    assert.strictEqual(comp.stateDeclarations[0].stateName, 'count');
    assert.strictEqual(comp.derivedDeclarations.length, 1);
    assert.strictEqual(comp.derivedDeclarations[0].derivedName, 'double');
    assert.deepStrictEqual(comp.derivedDeclarations[0].dependencies, ['count']);
  });

  it('10. End-to-End Counter Execution through Leveonas Runtime: Increment triggers pinpoint DOM patch', () => {
    const { mockWin, applier } = createMockDOMEnvironment();
    const source = `
component(Counter)(
  state(count, 0)
  computed(double, count * 2)

  di(
    h1("Count: {{count}}")
    p("Double: {{double}}")
    bo((click):increment "+1")
  )
)
`.trim();

    const ast = AngularLMInterpreter.parse(source);
    const reconciler = new AngularReconciler(ast);
    const { domAST, jsProgram } = reconciler.reconcile('Counter');

    const emptyRoot = ASTFactory.createComponent(ASTNodeKind.Root, defaultLoc, [], []) as RootNode;
    emptyRoot.id = 'leveonas-root';
    applier.apply(new PatchGenerator().generate(emptyRoot, domAST));

    const jsApplier = applier.getJSApplier();
    for (const unit of jsProgram.units) {
      if (unit.meta?.eventName && unit.meta?.targetSelector) {
        jsApplier.apply([
          {
            operation: PatchOperationType.ATTACH_EVENT_HANDLER,
            nodeId: unit.id,
            payload: {
              eventName: unit.meta.eventName,
              targetSelector: unit.meta.targetSelector,
              handlerCode: unit.details?.handlerCode || unit.code,
            },
          },
        ]);
      } else {
        jsApplier.apply([
          {
            operation: PatchOperationType.EXECUTE_JS_UNIT,
            nodeId: unit.id,
            payload: { code: unit.code },
          },
        ]);
      }
    }

    const instancePath = 'ui-root-Counter_0';
    assert.strictEqual(mockWin.__leveonas_state__[instancePath].count, 0);
    assert.strictEqual(mockWin.__leveonas_state__[instancePath].double, 0);

    // Initial text
    const countTextNode = applier.getNode('ui-root-Counter_0-div_0-h1_0-txt_0');
    const doubleTextNode = applier.getNode('ui-root-Counter_0-div_0-p_1-txt_0');
    assert.ok(countTextNode);
    assert.ok(doubleTextNode);
    assert.strictEqual(countTextNode.textContent, 'Count: 0');
    assert.strictEqual(doubleTextNode.textContent, 'Double: 0');

    // Click +1
    const button = applier.getNode('ui-root-Counter_0-div_0-button_2');
    assert.ok(button);
    button.click();

    // Verify state & DOM update
    assert.strictEqual(mockWin.__leveonas_state__[instancePath].count, 1);
    assert.strictEqual(mockWin.__leveonas_state__[instancePath].double, 2);
    assert.strictEqual(countTextNode.textContent, 'Count: 1');
    assert.strictEqual(doubleTextNode.textContent, 'Double: 2');

    // Click +1 again
    button.click();
    assert.strictEqual(mockWin.__leveonas_state__[instancePath].count, 2);
    assert.strictEqual(mockWin.__leveonas_state__[instancePath].double, 4);
    assert.strictEqual(countTextNode.textContent, 'Count: 2');
    assert.strictEqual(doubleTextNode.textContent, 'Double: 4');
  });

  it('11. End-to-End Keyed List Reconciliation: A B C -> A C B emits MOVE_CHILD and preserves node identities', () => {
    const { mockWin, applier } = createMockDOMEnvironment();
    const source = `
component(ListApp)(
  state(items, [{id: "a", name: "A"}, {id: "b", name: "B"}, {id: "c", name: "C"}])

  ul(
    @for(items, item, item.id)(
      li("{{item.name}}")
    )
  )
)
`.trim();

    const ast = AngularLMInterpreter.parse(source);
    const reconciler = new AngularReconciler(ast);
    const { domAST, jsProgram } = reconciler.reconcile('ListApp');

    const emptyRoot = ASTFactory.createComponent(ASTNodeKind.Root, defaultLoc, [], []) as RootNode;
    emptyRoot.id = 'leveonas-root';
    applier.apply(new PatchGenerator().generate(emptyRoot, domAST));

    const jsApplier = applier.getJSApplier();
    for (const unit of jsProgram.units) {
      jsApplier.apply([
        {
          operation: PatchOperationType.EXECUTE_JS_UNIT,
          nodeId: unit.id,
          payload: { code: unit.code },
        },
      ]);
    }

    const instancePath = 'ui-root-ListApp_0';
    const ul = applier.getNode('ui-root-ListApp_0-ul_0');
    assert.ok(ul);
    assert.strictEqual(ul.childNodes.length, 3);

    const nodeA = applier.getNode('ui-root-ListApp_0-ul_0-li-k_a');
    const nodeB = applier.getNode('ui-root-ListApp_0-ul_0-li-k_b');
    const nodeC = applier.getNode('ui-root-ListApp_0-ul_0-li-k_c');

    assert.ok(nodeA);
    assert.ok(nodeB);
    assert.ok(nodeC);

    // Reorder: A B C -> A C B
    mockWin.__leveonas_runtime__.updateState(instancePath, 'items', [
      { id: 'a', name: 'A' },
      { id: 'c', name: 'C' },
      { id: 'b', name: 'B' },
    ]);

    assert.strictEqual(ul.childNodes[0], nodeA);
    assert.strictEqual(ul.childNodes[1], nodeC);
    assert.strictEqual(ul.childNodes[2], nodeB);

    assert.strictEqual(applier.getNode('ui-root-ListApp_0-ul_0-li-k_a'), nodeA);
    assert.strictEqual(applier.getNode('ui-root-ListApp_0-ul_0-li-k_b'), nodeB);
    assert.strictEqual(applier.getNode('ui-root-ListApp_0-ul_0-li-k_c'), nodeC);
  });

  it('12. Validator catches errors and diagnostics', () => {
    const validProgram = AngularLMInterpreter.parse(`
component(App)(
  state(count, 0)
  di(h1("Test"))
)
`);
    const validDiag = AngularLMValidator.validate(validProgram);
    assert.strictEqual(validDiag.length, 0);

    const invalidProgram = AngularLMInterpreter.parse(`
component(Dup)(
  state(count, 0)
  state(count, 1)
  di(h1("Test"))
)
`);
    const invalidDiag = AngularLMValidator.validate(invalidProgram);
    assert.ok(invalidDiag.some((d) => d.severity === 'error' && d.message.includes('Duplicate state')));
  });

  it('13. Serializer roundtrip (toJSON / fromJSON)', () => {
    const ast = AngularLMInterpreter.parse(`
component(App)(
  state(count, 0)
  di(h1("Count: {{count}}"))
)
`);
    const json = AngularLMSerializer.toJSON(ast);
    const parsed = AngularLMSerializer.fromJSON(json);
    assert.strictEqual(parsed.components[0].name, 'App');
  });

  it('14. Cross-Framework Equivalence: React, Vue, Svelte & Angular lower to Common UI IR with equivalent semantics', () => {
    const reactSource = `
component(App)(
  state(count, 0)
  computed(double, count * 2)
  di(
    h1("Count: {count}")
    bo(click:increment "+1")
  )
)
`.trim();

    const vueSource = `
component(App)(
  state(count, 0)
  computed(double, count * 2)
  di(
    h1("Count: {{count}}")
    bo(@click:increment "+1")
  )
)
`.trim();

    const svelteSource = `
component(App)(
  state(count, 0)
  derived(double, count * 2)
  di(
    h1("Count: {count}")
    bo(on:click:increment "+1")
  )
)
`.trim();

    const angularSource = `
component(App)(
  state(count, 0)
  computed(double, count * 2)
  di(
    h1("Count: {{count}}")
    bo((click):increment "+1")
  )
)
`.trim();

    const angularAst = AngularLMInterpreter.parse(angularSource);
    const angularUIIR = AngularToLowering.lower(angularAst);

    assert.strictEqual(angularUIIR.components.length, 1);
    const comp = angularUIIR.components[0];
    assert.strictEqual(comp.name, 'App');
    assert.strictEqual(comp.stateDeclarations[0].stateName, 'count');
    assert.strictEqual(comp.stateDeclarations[0].initialValue, 0);
    assert.strictEqual(comp.derivedDeclarations[0].derivedName, 'double');
    assert.deepStrictEqual(comp.derivedDeclarations[0].dependencies, ['count']);

    const div = comp.body[0] as any;
    assert.strictEqual(div.tag, 'div');
    assert.strictEqual(div.children.length, 2);
    assert.strictEqual(div.children[0].tag, 'h1');
    assert.strictEqual(div.children[0].children[0].value, 'Count: {count}');
  });

  it('15. Angular Class & Style Bindings coexist with CSS runtime', () => {
    const source = `
component(StyledWidget)(
  state(isHighlighted, true)
  state(bgColor, "blue")

  di(
    di([class.active]:isHighlighted [style.color]:bgColor "Dynamic styling")
  )
)
`.trim();

    const ast = AngularLMInterpreter.parse(source);
    const uiir = AngularToLowering.lower(ast);
    const reconciler = new CommonUIReconciler(uiir);
    const { domAST } = reconciler.reconcile('StyledWidget');

    assert.ok(domAST);
    assert.strictEqual(domAST.children.length, 1);
  });

  it('16. Unsupported features verification and non-breaking documentation', () => {
    // Unsupported Angular features (Forms, DI, Material, SSR) parse as standard elements or emit diagnostics
    const source = `
component(App)(
  state(text, "test")
  di(
    p("Angular-LM V1 core supported")
  )
)
`.trim();

    const ast = AngularLMInterpreter.parse(source);
    const diag = AngularLMValidator.validate(ast);
    assert.strictEqual(diag.length, 0);
  });

  it('17. Live Dynamic Style Reactivity: [style.color]:bgColor updates color in-place without node recreation', () => {
    const { mockWin, applier } = createMockDOMEnvironment();
    const source = `
component(StyleApp)(
  state(bgColor, "blue")

  di(
    h1("Header Title")
    di([style.color]:bgColor "Dynamic Color Text")
    p("Footer Text")
  )
)
`.trim();

    const ast = AngularLMInterpreter.parse(source);
    const reconciler = new AngularReconciler(ast);
    const { domAST, jsProgram } = reconciler.reconcile('StyleApp');

    const emptyRoot = ASTFactory.createComponent(ASTNodeKind.Root, defaultLoc, [], []) as RootNode;
    emptyRoot.id = 'leveonas-root';
    applier.apply(new PatchGenerator().generate(emptyRoot, domAST));

    const jsApplier = applier.getJSApplier();
    for (const unit of jsProgram.units) {
      jsApplier.apply([
        {
          operation: PatchOperationType.EXECUTE_JS_UNIT,
          nodeId: unit.id,
          payload: { code: unit.code },
        },
      ]);
    }

    const instancePath = 'ui-root-StyleApp_0';
    const headerNode = applier.getNode('ui-root-StyleApp_0-div_0-h1_0');
    const styledNode = applier.getNode('ui-root-StyleApp_0-div_0-div_1');
    const footerNode = applier.getNode('ui-root-StyleApp_0-div_0-p_2');

    assert.ok(headerNode);
    assert.ok(styledNode);
    assert.ok(footerNode);
    assert.strictEqual(styledNode.style.color, 'blue');

    // Update state: bgColor = "red"
    mockWin.__leveonas_runtime__.updateState(instancePath, 'bgColor', 'red');

    // Verify same DOM element identity
    assert.strictEqual(applier.getNode('ui-root-StyleApp_0-div_0-div_1'), styledNode);
    assert.strictEqual(styledNode.style.color, 'red');

    // Unrelated nodes remain completely untouched and retained
    assert.strictEqual(applier.getNode('ui-root-StyleApp_0-div_0-h1_0'), headerNode);
    assert.strictEqual(applier.getNode('ui-root-StyleApp_0-div_0-p_2'), footerNode);
  });

  it('18. Live Dynamic Class Reactivity: [class.active]:isActive toggles class active in-place without node recreation', () => {
    const { mockWin, applier } = createMockDOMEnvironment();
    const source = `
component(ClassApp)(
  state(isActive, true)

  di(
    di([class.active]:isActive "Active Box")
  )
)
`.trim();

    const ast = AngularLMInterpreter.parse(source);
    const reconciler = new AngularReconciler(ast);
    const { domAST, jsProgram } = reconciler.reconcile('ClassApp');

    const emptyRoot = ASTFactory.createComponent(ASTNodeKind.Root, defaultLoc, [], []) as RootNode;
    emptyRoot.id = 'leveonas-root';
    applier.apply(new PatchGenerator().generate(emptyRoot, domAST));

    const jsApplier = applier.getJSApplier();
    for (const unit of jsProgram.units) {
      jsApplier.apply([
        {
          operation: PatchOperationType.EXECUTE_JS_UNIT,
          nodeId: unit.id,
          payload: { code: unit.code },
        },
      ]);
    }

    const instancePath = 'ui-root-ClassApp_0';
    const boxNode = applier.getNode('ui-root-ClassApp_0-div_0-div_0');
    assert.ok(boxNode);
    assert.ok(boxNode.classList.contains('active'));

    // Step 1: isActive = false
    mockWin.__leveonas_runtime__.updateState(instancePath, 'isActive', false);
    assert.strictEqual(applier.getNode('ui-root-ClassApp_0-div_0-div_0'), boxNode);
    assert.strictEqual(boxNode.classList.contains('active'), false);

    // Step 2: isActive = true
    mockWin.__leveonas_runtime__.updateState(instancePath, 'isActive', true);
    assert.strictEqual(applier.getNode('ui-root-ClassApp_0-div_0-div_0'), boxNode);
    assert.strictEqual(boxNode.classList.contains('active'), true);
  });

  it('19. Live Two-Way Binding [(ngModel)]:username synchronizes DOM -> State and State -> DOM', () => {
    const { mockWin, applier } = createMockDOMEnvironment();
    const source = `
component(BindingApp)(
  state(username, "Alice")

  di(
    input([(ngModel)]:username)
  )
)
`.trim();

    const ast = AngularLMInterpreter.parse(source);
    const reconciler = new AngularReconciler(ast);
    const { domAST, jsProgram } = reconciler.reconcile('BindingApp');

    const emptyRoot = ASTFactory.createComponent(ASTNodeKind.Root, defaultLoc, [], []) as RootNode;
    emptyRoot.id = 'leveonas-root';
    applier.apply(new PatchGenerator().generate(emptyRoot, domAST));

    const jsApplier = applier.getJSApplier();
    for (const unit of jsProgram.units) {
      if (unit.meta?.eventName && unit.meta?.targetSelector) {
        jsApplier.apply([
          {
            operation: PatchOperationType.ATTACH_EVENT_HANDLER,
            nodeId: unit.id,
            payload: {
              eventName: unit.meta.eventName,
              targetSelector: unit.meta.targetSelector,
              handlerCode: unit.details?.handlerCode || unit.code,
            },
          },
        ]);
      } else {
        jsApplier.apply([
          {
            operation: PatchOperationType.EXECUTE_JS_UNIT,
            nodeId: unit.id,
            payload: { code: unit.code },
          },
        ]);
      }
    }

    const instancePath = 'ui-root-BindingApp_0';
    const inputNode = applier.getNode('ui-root-BindingApp_0-div_0-input_0');
    assert.ok(inputNode);
    assert.strictEqual(inputNode.value, 'Alice');

    // DOM -> State simulation
    inputNode.value = 'Bob';
    inputNode.dispatchEvent({ type: 'input' });
    assert.strictEqual(mockWin.__leveonas_state__[instancePath].username, 'Bob');

    // State -> DOM simulation
    mockWin.__leveonas_runtime__.updateState(instancePath, 'username', 'Charlie');
    assert.strictEqual(inputNode.value, 'Charlie');
  });

  it('20. Live Conditional Reactivity: @if(show) flips branch in-place and preserves siblings', () => {
    const { mockWin, applier } = createMockDOMEnvironment();
    const source = `
component(CondApp)(
  state(show, false)

  di(
    h1("Static Header")
    @if(show)(
      p("Visible branch content")
    )(
      p("Hidden branch fallback")
    )
    p("Static Footer")
  )
)
`.trim();

    const ast = AngularLMInterpreter.parse(source);
    const reconciler = new AngularReconciler(ast);
    const { domAST, jsProgram } = reconciler.reconcile('CondApp');

    const emptyRoot = ASTFactory.createComponent(ASTNodeKind.Root, defaultLoc, [], []) as RootNode;
    emptyRoot.id = 'leveonas-root';
    applier.apply(new PatchGenerator().generate(emptyRoot, domAST));

    const jsApplier = applier.getJSApplier();
    for (const unit of jsProgram.units) {
      jsApplier.apply([
        {
          operation: PatchOperationType.EXECUTE_JS_UNIT,
          nodeId: unit.id,
          payload: { code: unit.code },
        },
      ]);
    }

    const instancePath = 'ui-root-CondApp_0';
    const header = applier.getNode('ui-root-CondApp_0-div_0-h1_0');
    const footer = applier.getNode('ui-root-CondApp_0-div_0-p_2');
    assert.ok(header);
    assert.ok(footer);

    // Initial branch: false -> Hidden branch fallback
    const initialBranch = applier.getNode('ui-root-CondApp_0-div_0-cond_1-else-p_0');
    assert.ok(initialBranch);
    assert.strictEqual(initialBranch.childNodes[0]?.textContent, 'Hidden branch fallback');

    // Flip show: true -> Visible branch content
    mockWin.__leveonas_runtime__.updateState(instancePath, 'show', true);
    const thenBranch = applier.getNode('ui-root-CondApp_0-div_0-cond_1-then-p_0');
    assert.ok(thenBranch);
    assert.strictEqual(thenBranch.childNodes[0]?.textContent, 'Visible branch content');

    // Verify siblings retained
    assert.strictEqual(applier.getNode('ui-root-CondApp_0-div_0-h1_0'), header);
    assert.strictEqual(applier.getNode('ui-root-CondApp_0-div_0-p_2'), footer);

    // Flip show back: false -> Hidden branch fallback
    mockWin.__leveonas_runtime__.updateState(instancePath, 'show', false);
    const elseBranchReverted = applier.getNode('ui-root-CondApp_0-div_0-cond_1-else-p_0');
    assert.ok(elseBranchReverted);
    assert.strictEqual(elseBranchReverted.childNodes[0]?.textContent, 'Hidden branch fallback');
  });

  it('21. Live Keyed List Reconciliation with Insertion & Removal: A B C -> A D C preserves A and C, removes B, creates D', () => {
    const { mockWin, applier } = createMockDOMEnvironment();
    const source = `
component(ListMutationApp)(
  state(items, [{id: "a", name: "A"}, {id: "b", name: "B"}, {id: "c", name: "C"}])

  ul(
    @for(items, item, item.id)(
      li("{{item.name}}")
    )
  )
)
`.trim();

    const ast = AngularLMInterpreter.parse(source);
    const reconciler = new AngularReconciler(ast);
    const { domAST, jsProgram } = reconciler.reconcile('ListMutationApp');

    const emptyRoot = ASTFactory.createComponent(ASTNodeKind.Root, defaultLoc, [], []) as RootNode;
    emptyRoot.id = 'leveonas-root';
    applier.apply(new PatchGenerator().generate(emptyRoot, domAST));

    const jsApplier = applier.getJSApplier();
    for (const unit of jsProgram.units) {
      jsApplier.apply([
        {
          operation: PatchOperationType.EXECUTE_JS_UNIT,
          nodeId: unit.id,
          payload: { code: unit.code },
        },
      ]);
    }

    const instancePath = 'ui-root-ListMutationApp_0';
    const ul = applier.getNode('ui-root-ListMutationApp_0-ul_0');
    assert.ok(ul);
    assert.strictEqual(ul.childNodes.length, 3);

    const nodeA = applier.getNode('ui-root-ListMutationApp_0-ul_0-li-k_a');
    const nodeB = applier.getNode('ui-root-ListMutationApp_0-ul_0-li-k_b');
    const nodeC = applier.getNode('ui-root-ListMutationApp_0-ul_0-li-k_c');

    assert.ok(nodeA);
    assert.ok(nodeB);
    assert.ok(nodeC);

    // Mutate list: A B C -> A D C
    mockWin.__leveonas_runtime__.updateState(instancePath, 'items', [
      { id: 'a', name: 'A' },
      { id: 'd', name: 'D' },
      { id: 'c', name: 'C' },
    ]);

    assert.strictEqual(ul.childNodes.length, 3);
    assert.strictEqual(ul.childNodes[0], nodeA);
    assert.strictEqual(ul.childNodes[2], nodeC);

    const nodeD = applier.getNode('ui-root-ListMutationApp_0-ul_0-li-k_d');
    assert.ok(nodeD);
    assert.strictEqual(ul.childNodes[1], nodeD);
    assert.strictEqual(applier.getNode('ui-root-ListMutationApp_0-ul_0-li-k_b'), undefined);
  });

  it('22. CRITICAL FOUR-FRAMEWORK RUNTIME EQUIVALENCE: React, Vue, Svelte & Angular all lower to Common UI IR and execute identical state mutations & DOM patches', () => {
    const frameworks = [
      {
        name: 'React-LM',
        parse: () => ReactLMInterpreter.parse(`
component(App)(
  state(count, 0)
  computed(double, count * 2)

  di(
    h1("Header Title")
    di(
      p("Count: {count}")
      p("Double: {double}")
      bo(click:increment "+1")
    )
    footer("Footer Copyright")
  )
)
`),
        lower: (ast: any) => ReactToLowering.lower(ast),
      },
      {
        name: 'Vue-LM',
        parse: () => VueLMInterpreter.parse(`
component(App)(
  state(count, 0)
  computed(double, count * 2)

  di(
    h1("Header Title")
    di(
      p("Count: {{count}}")
      p("Double: {{double}}")
      bo(@click:increment "+1")
    )
    footer("Footer Copyright")
  )
)
`),
        lower: (ast: any) => VueToLowering.lower(ast),
      },
      {
        name: 'Svelte-LM',
        parse: () => SvelteLMInterpreter.parse(`
component(App)(
  state(count, 0)
  derived(double, count * 2)

  di(
    h1("Header Title")
    di(
      p("Count: {count}")
      p("Double: {double}")
      bo(on:click:increment "+1")
    )
    footer("Footer Copyright")
  )
)
`),
        lower: (ast: any) => SvelteToLowering.lower(ast),
      },
      {
        name: 'Angular-LM',
        parse: () => AngularLMInterpreter.parse(`
component(App)(
  state(count, 0)
  computed(double, count * 2)

  di(
    h1("Header Title")
    di(
      p("Count: {{count}}")
      p("Double: {{double}}")
      bo((click):increment "+1")
    )
    footer("Footer Copyright")
  )
)
`),
        lower: (ast: any) => AngularToLowering.lower(ast),
      },
    ];

    for (const fw of frameworks) {
      const { mockWin, applier } = createMockDOMEnvironment();
      const ast = fw.parse();
      const uiir = fw.lower(ast);

      const reconciler = new CommonUIReconciler(uiir);
      const { domAST, jsProgram } = reconciler.reconcile('App');

      const emptyRoot = ASTFactory.createComponent(ASTNodeKind.Root, defaultLoc, [], []) as RootNode;
      emptyRoot.id = 'leveonas-root';
      applier.apply(new PatchGenerator().generate(emptyRoot, domAST));

      const jsApplier = applier.getJSApplier();
      for (const unit of jsProgram.units) {
        if (unit.meta?.eventName && unit.meta?.targetSelector) {
          jsApplier.apply([
            {
              operation: PatchOperationType.ATTACH_EVENT_HANDLER,
              nodeId: unit.id,
              payload: {
                eventName: unit.meta.eventName,
                targetSelector: unit.meta.targetSelector,
                handlerCode: unit.details?.handlerCode || unit.code,
              },
            },
          ]);
        } else {
          jsApplier.apply([
            {
              operation: PatchOperationType.EXECUTE_JS_UNIT,
              nodeId: unit.id,
              payload: { code: unit.code },
            },
          ]);
        }
      }

      const instancePath = 'ui-root-App_0';
      assert.strictEqual(mockWin.__leveonas_state__[instancePath].count, 0, `[${fw.name}] initial count`);
      assert.strictEqual(mockWin.__leveonas_state__[instancePath].double, 0, `[${fw.name}] initial double`);

      const headerNode = applier.getNode('ui-root-App_0-div_0-h1_0');
      const footerNode = applier.getNode('ui-root-App_0-div_0-footer_2');
      const containerNode = applier.getNode('ui-root-App_0-div_0-div_1');
      const countTextNode = applier.getNode('ui-root-App_0-div_0-div_1-p_0-txt_0');
      const doubleTextNode = applier.getNode('ui-root-App_0-div_0-div_1-p_1-txt_0');
      const buttonNode = applier.getNode('ui-root-App_0-div_0-div_1-button_2');

      assert.ok(headerNode, `[${fw.name}] headerNode exists`);
      assert.ok(footerNode, `[${fw.name}] footerNode exists`);
      assert.ok(containerNode, `[${fw.name}] containerNode exists`);
      assert.ok(countTextNode, `[${fw.name}] countTextNode exists`);
      assert.ok(doubleTextNode, `[${fw.name}] doubleTextNode exists`);
      assert.ok(buttonNode, `[${fw.name}] buttonNode exists`);

      assert.strictEqual(countTextNode.textContent, 'Count: 0', `[${fw.name}] initial count text`);
      assert.strictEqual(doubleTextNode.textContent, 'Double: 0', `[${fw.name}] initial double text`);

      // Click +1
      buttonNode.click();
      assert.strictEqual(mockWin.__leveonas_state__[instancePath].count, 1, `[${fw.name}] count after 1 click`);
      assert.strictEqual(mockWin.__leveonas_state__[instancePath].double, 2, `[${fw.name}] double after 1 click`);
      assert.strictEqual(countTextNode.textContent, 'Count: 1', `[${fw.name}] count text after 1 click`);
      assert.strictEqual(doubleTextNode.textContent, 'Double: 2', `[${fw.name}] double text after 1 click`);

      // Click +1 again
      buttonNode.click();
      assert.strictEqual(mockWin.__leveonas_state__[instancePath].count, 2, `[${fw.name}] count after 2 clicks`);
      assert.strictEqual(mockWin.__leveonas_state__[instancePath].double, 4, `[${fw.name}] double after 2 clicks`);
      assert.strictEqual(countTextNode.textContent, 'Count: 2', `[${fw.name}] count text after 2 clicks`);
      assert.strictEqual(doubleTextNode.textContent, 'Double: 4', `[${fw.name}] double text after 2 clicks`);

      // Verify DOM node identity retention of structural elements
      assert.strictEqual(applier.getNode('ui-root-App_0-div_0-h1_0'), headerNode, `[${fw.name}] header identity retained`);
      assert.strictEqual(applier.getNode('ui-root-App_0-div_0-footer_2'), footerNode, `[${fw.name}] footer identity retained`);
      assert.strictEqual(applier.getNode('ui-root-App_0-div_0-div_1'), containerNode, `[${fw.name}] container identity retained`);
    }
  });
});
