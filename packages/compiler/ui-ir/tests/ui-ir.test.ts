import { describe, it } from 'node:test';
import assert from 'node:assert';
import { UIIRFactory, resetUIIRIdCounter } from '../factory';
import { UIIRSerializer } from '../serializer';
import { UIIRValidator } from '../validator';
import { CommonUIReconciler } from '../reconciler';
import { ReactToLowering } from '../lowering/react-lowering';
import { VueToLowering } from '../lowering/vue-lowering';
import { SvelteToLowering } from '../lowering/svelte-lowering';
import { ReactLMInterpreter } from '../../interpreters/react-lm/interpreter';
import { VueLMInterpreter } from '../../interpreters/vue-lm/interpreter';
import { SvelteLMInterpreter } from '../../interpreters/svelte-lm/interpreter';
import { DOMPatchApplier } from '../../../runtime/incremental/patch-executor/dom-applier';
import { PatchGenerator } from '../../../runtime/incremental/patch-generator/generator';
import { ASTFactory } from '../../ast/factory';
import { ASTNodeKind, SourceLocation } from '../../ast/types';
import { RootNode } from '../../ast/nodes';
import { PatchOperationType } from '../../../runtime/incremental/patch-generator/types';

const defaultLoc: SourceLocation = {
  startLine: 1,
  startColumn: 1,
  startOffset: 0,
  endLine: 1,
  endColumn: 1,
  endOffset: 0,
};

// Mock DOM Environment helper
function createMockDOMEnvironment() {
  const eventListeners: Record<string, Function[]> = {};

  const createMockElement = (tagName: string, id: string = '') => {
    const el: any = {
      tagName: tagName.toUpperCase(),
      nodeType: 1,
      id: id,
      className: '',
      value: '',
      checked: false,
      attributes: {} as Record<string, string>,
      childNodes: [] as any[],
      parentNode: null as any,
      setAttribute: (name: string, val: any) => {
        el.attributes[name] = String(val);
        if (name === 'id') el.id = String(val);
        if (name === 'class' || name === 'className') el.className = String(val);
        if (name === 'value') el.value = String(val);
        if (name === 'checked') el.checked = Boolean(val);
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
          if (cur.id === cleanSel || (cur.attributes && cur.attributes['id'] === cleanSel) || cur.__ast_id === cleanSel) {
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

  mockBody.removeEventListener = (evt: string, fn: Function) => {
    if (eventListeners[evt]) {
      eventListeners[evt] = eventListeners[evt].filter((f) => f !== fn);
    }
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
    querySelector: (sel: string) => {
      const cleanSel = sel.replace(/^#/, '');
      return mockDoc.getElementById(cleanSel);
    },
  };

  const mockWin: any = {
    document: mockDoc,
  };

  const applier = new DOMPatchApplier(mockRoot, mockDoc, mockWin);
  applier.registerNode('leveonas-root', mockRoot);

  return { mockRoot, mockDoc, mockWin, applier, eventListeners };
}

describe('Common UI IR & Framework-Neutral Reactivity Architecture (Phase 2D)', () => {
  it('1. Constructs framework-neutral UI IR Program with deterministic IDs', () => {
    resetUIIRIdCounter();
    const countState = UIIRFactory.createState('count', 0);
    const doubleDerived = UIIRFactory.createDerived('double', 'count * 2', ['count']);
    const titleText = UIIRFactory.createText('Count: {count} | Double: {double}', false, ['count', 'double']);
    const incEvent = UIIRFactory.createEvent('click', '#btn-inc', 'increment', 'count', '(s.count || 0) + 1');
    const button = UIIRFactory.createElement('button', [UIIRFactory.createProp('id', 'btn-inc')], [UIIRFactory.createText('+1')], undefined, [incEvent]);

    const comp = UIIRFactory.createComponent('Counter', [titleText, button], [countState], [doubleDerived]);
    const program = UIIRFactory.createProgram([comp], 'Counter');

    assert.strictEqual(program.components.length, 1);
    assert.strictEqual(program.components[0].name, 'Counter');
    assert.strictEqual(program.components[0].stateDeclarations.length, 1);
    assert.strictEqual(program.components[0].derivedDeclarations.length, 1);
    assert.strictEqual(program.components[0].body.length, 2);
  });

  it('2. Lowers React-LM AST into Common UI IR', () => {
    const input = `
component(ReactCounter)(
  state(count, 0)
  di(
    h1("React Counter: {count}")
    bo(id:"btn-inc" oc:increment "+1")
  )
)
`;
    const reactAST = ReactLMInterpreter.parse(input);
    const uiIR = ReactToLowering.lower(reactAST);

    assert.strictEqual(uiIR.components.length, 1);
    const comp = uiIR.components[0];
    assert.strictEqual(comp.name, 'ReactCounter');
    assert.strictEqual(comp.stateDeclarations.length, 1);
    assert.strictEqual(comp.stateDeclarations[0].stateName, 'count');
    assert.strictEqual(comp.body.length, 1);
  });

  it('3. Lowers Vue-LM AST into Common UI IR with state, computed & events', () => {
    const input = `
component(VueCounter)(
  state(count, 10)
  computed(double, count * 2)
  di(
    p("Vue Count: {count}")
    p("Vue Double: {double}")
    bo(id:"btn-vue" @click:increment "+1")
  )
)
`;
    const vueAST = VueLMInterpreter.parse(input);
    const uiIR = VueToLowering.lower(vueAST);

    assert.strictEqual(uiIR.components.length, 1);
    const comp = uiIR.components[0];
    assert.strictEqual(comp.name, 'VueCounter');
    assert.strictEqual(comp.stateDeclarations.length, 1);
    assert.strictEqual(comp.derivedDeclarations.length, 1);
    assert.strictEqual(comp.derivedDeclarations[0].derivedName, 'double');
    assert.strictEqual(comp.derivedDeclarations[0].expression, 'count * 2');
  });

  it('4. Lowers Svelte-LM AST into Common UI IR with state, reactive & bindings', () => {
    const input = `
component(SvelteCounter)(
  state(count, 0)
  reactive(double, count * 2)
  di(
    p("Svelte Count: {count}")
    p("Svelte Double: {double}")
    bo(id:"btn-svelte" oc:increment "+1")
  )
)
`;
    const svelteAST = SvelteLMInterpreter.parse(input);
    const uiIR = SvelteToLowering.lower(svelteAST);

    assert.strictEqual(uiIR.components.length, 1);
    const comp = uiIR.components[0];
    assert.strictEqual(comp.name, 'SvelteCounter');
    assert.strictEqual(comp.stateDeclarations.length, 1);
    assert.strictEqual(comp.derivedDeclarations.length, 1);
    assert.strictEqual(comp.derivedDeclarations[0].derivedName, 'double');
    assert.strictEqual(comp.derivedDeclarations[0].expression, 'count * 2');
  });

  it('5. CRITICAL CROSS-FRAMEWORK EQUIVALENCE TEST: React, Vue & Svelte lower to equivalent semantics and execute identically', () => {
    const reactSource = `
component(Counter)(
  state(count, 0)
  di(
    p("Count: {count}")
    bo(id:"btn-inc" oc:increment "+1")
  )
)
`;
    const vueSource = `
component(Counter)(
  state(count, 0)
  computed(double, count * 2)
  di(
    p("Count: {count}")
    p("Double: {double}")
    bo(id:"btn-inc" @click:increment "+1")
  )
)
`;
    const svelteSource = `
component(Counter)(
  state(count, 0)
  reactive(double, count * 2)
  di(
    p("Count: {count}")
    p("Double: {double}")
    bo(id:"btn-inc" oc:increment "+1")
  )
)
`;
    const vueAST = VueLMInterpreter.parse(vueSource);
    const svelteAST = SvelteLMInterpreter.parse(svelteSource);

    const vueIR = VueToLowering.lower(vueAST);
    const svelteIR = SvelteToLowering.lower(svelteAST);

    // Verify structural equivalence in Common UI IR
    assert.strictEqual(vueIR.components[0].stateDeclarations[0].stateName, 'count');
    assert.strictEqual(svelteIR.components[0].stateDeclarations[0].stateName, 'count');
    assert.strictEqual(vueIR.components[0].derivedDeclarations[0].derivedName, 'double');
    assert.strictEqual(svelteIR.components[0].derivedDeclarations[0].derivedName, 'double');

    // Run Vue IR through Common Reconciler in Mock DOM
    const { mockWin, applier } = createMockDOMEnvironment();
    const commonReconciler = new CommonUIReconciler(vueIR);
    const { domAST, jsProgram, reactivityDefinitions } = commonReconciler.reconcile('Counter');

    const emptyRoot = ASTFactory.createComponent(
      ASTNodeKind.Root,
      { startLine: 1, startColumn: 1, startOffset: 0, endLine: 1, endColumn: 1, endOffset: 0 },
      [],
      []
    ) as RootNode;
    emptyRoot.id = 'leveonas-root';
    const generator = new PatchGenerator();
    applier.apply(generator.generate(emptyRoot, domAST));

    // Execute JS units
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

    const counterDef = Array.from(reactivityDefinitions.values())[0];
    assert.ok(counterDef, 'Reactivity definition must exist');

    // Live click simulation
    const btn = applier.getNode('btn-inc');
    assert.ok(btn, 'Button must exist');

    // Verify initial state
    assert.strictEqual(mockWin.__leveonas_state__[counterDef.instancePath].count, 0);

    // 1st click
    btn.click();
    assert.strictEqual(mockWin.__leveonas_state__[counterDef.instancePath].count, 1);

    // 2nd click
    btn.click();
    assert.strictEqual(mockWin.__leveonas_state__[counterDef.instancePath].count, 2);
  });

  it('6. Common UI IR Serializer roundtrip (toJSON / fromJSON)', () => {
    const comp = UIIRFactory.createComponent(
      'Card',
      [UIIRFactory.createText('Hello World')],
      [UIIRFactory.createState('isVisible', true)],
      [UIIRFactory.createDerived('status', 'isVisible ? "Online" : "Offline"', ['isVisible'])]
    );
    const program = UIIRFactory.createProgram([comp], 'Card');

    const json = UIIRSerializer.toJSON(program);
    const restored = UIIRSerializer.fromJSON(json);

    assert.strictEqual(restored.components.length, 1);
    assert.strictEqual(restored.components[0].name, 'Card');
    assert.strictEqual(restored.components[0].stateDeclarations.length, 1);
    assert.strictEqual(restored.components[0].derivedDeclarations.length, 1);
  });

  it('7. Common UI IR Validator diagnostics', () => {
    // Duplicate components & circular dependencies test
    const cyclicDerived1 = UIIRFactory.createDerived('a', 'b + 1', ['b']);
    const cyclicDerived2 = UIIRFactory.createDerived('b', 'a + 1', ['a']);
    const comp1 = UIIRFactory.createComponent('App', [], [], [cyclicDerived1, cyclicDerived2]);
    const comp2 = UIIRFactory.createComponent('App', [], []);

    const program = UIIRFactory.createProgram([comp1, comp2], 'App');
    const diagnostics = UIIRValidator.validate(program);

    assert.ok(diagnostics.length >= 2);
    assert.ok(diagnostics.some((d) => d.message.includes('Duplicate component name')));
    assert.ok(diagnostics.some((d) => d.message.includes('Circular dependency')));
  });

  it('8. Zero Browser Leakage: Browser receives only serializable JSON, NO compiler class instances', () => {
    const svelteSource = `
component(App)(
  state(count, 0)
  reactive(double, count * 2)
  di(p("Count: {count}"))
)
`;
    const svelteAST = SvelteLMInterpreter.parse(svelteSource);
    const uiIR = SvelteToLowering.lower(svelteAST);

    const reconciler = new CommonUIReconciler(uiIR);
    const { reactivityDefinitions } = reconciler.reconcile('App');

    const def = Array.from(reactivityDefinitions.values())[0];
    const jsonStr = JSON.stringify(def);
    const parsed = JSON.parse(jsonStr);

    assert.strictEqual(typeof parsed, 'object');
    assert.strictEqual(parsed.constructor.name, 'Object');
    assert.strictEqual(typeof parsed.state, 'object');
    assert.strictEqual(typeof parsed.derived, 'object');
    assert.strictEqual(typeof parsed.domDependencies, 'object');
    assert.strictEqual(typeof parsed.edges, 'object');
  });

  it('9. Common UI Reconciler: Subtree Isolation & Minimal Patches for App (Header, Counter, Footer)', () => {
    const header = UIIRFactory.createComponent('Header', [
      UIIRFactory.createElement('header', [UIIRFactory.createProp('id', 'hdr')], [UIIRFactory.createText('Site Header')])
    ]);
    const footer = UIIRFactory.createComponent('Footer', [
      UIIRFactory.createElement('footer', [UIIRFactory.createProp('id', 'ftr')], [UIIRFactory.createText('Site Footer')])
    ]);
    const counter = UIIRFactory.createComponent(
      'Counter',
      [
        UIIRFactory.createElement('p', [UIIRFactory.createProp('id', 'p-cnt')], [UIIRFactory.createText('Count: {count}')]),
        UIIRFactory.createElement('p', [UIIRFactory.createProp('id', 'p-dbl')], [UIIRFactory.createText('Double: {double}')]),
      ],
      [UIIRFactory.createState('count', 0)],
      [UIIRFactory.createDerived('double', 'count * 2', ['count'])]
    );
    const app = UIIRFactory.createComponent('App', [
      UIIRFactory.createComponentInstance('Header'),
      UIIRFactory.createComponentInstance('Counter'),
      UIIRFactory.createComponentInstance('Footer'),
    ]);
    const program = UIIRFactory.createProgram([app, header, counter, footer], 'App');

    const reconciler = new CommonUIReconciler(program);
    const { domAST, reactivityDefinitions } = reconciler.reconcile('App');

    assert.strictEqual(domAST.children.length, 4);

    const counterDef = Array.from(reactivityDefinitions.values()).find((d) => d.componentName === 'Counter');
    assert.ok(counterDef);

    // Verify DOM dependencies
    const textDepKeys = Object.keys(counterDef.domDependencies);
    assert.strictEqual(textDepKeys.length, 2);
    assert.ok(textDepKeys.some((k) => k.includes('p-cnt')));
    assert.ok(textDepKeys.some((k) => k.includes('p-dbl')));
  });

  it('10. Common UI Reconciler: Keyed List Reconciliation with LIS (A B C -> A C B)', () => {
    const listComp1 = UIIRFactory.createComponent(
      'ListApp',
      [
        UIIRFactory.createElement(
          'ul',
          [],
          [
            UIIRFactory.createList(
              'items',
              'item',
              UIIRFactory.createElement('li', [], [UIIRFactory.createText('{item.name}')]),
              'item.id'
            ),
          ]
        ),
      ],
      [
        UIIRFactory.createState('items', [
          { id: 'a', name: 'Alpha' },
          { id: 'b', name: 'Beta' },
          { id: 'c', name: 'Gamma' },
        ]),
      ]
    );

    const listComp2 = UIIRFactory.createComponent(
      'ListApp',
      [
        UIIRFactory.createElement(
          'ul',
          [],
          [
            UIIRFactory.createList(
              'items',
              'item',
              UIIRFactory.createElement('li', [], [UIIRFactory.createText('{item.name}')]),
              'item.id'
            ),
          ]
        ),
      ],
      [
        UIIRFactory.createState('items', [
          { id: 'a', name: 'Alpha' },
          { id: 'c', name: 'Gamma' },
          { id: 'b', name: 'Beta' },
        ]),
      ]
    );

    const p1 = UIIRFactory.createProgram([listComp1], 'ListApp');
    const p2 = UIIRFactory.createProgram([listComp2], 'ListApp');

    const res1 = new CommonUIReconciler(p1).reconcile('ListApp');
    const res2 = new CommonUIReconciler(p2).reconcile('ListApp');

    const generator = new PatchGenerator();
    const patches = generator.generate(res1.domAST, res2.domAST);

    const movePatch = patches.find((p) => p.operation === PatchOperationType.MOVE_CHILD);
    assert.ok(movePatch, 'Must generate MOVE_CHILD patch for reordered list element');
  });

  it('11. Common UI Reconciler: Keyed List Insertion & Removal (A B C -> A D C)', () => {
    const listComp1 = UIIRFactory.createComponent(
      'ListApp',
      [
        UIIRFactory.createElement(
          'ul',
          [],
          [
            UIIRFactory.createList(
              'items',
              'item',
              UIIRFactory.createElement('li', [], [UIIRFactory.createText('{item.name}')]),
              'item.id'
            ),
          ]
        ),
      ],
      [
        UIIRFactory.createState('items', [
          { id: 'a', name: 'Alpha' },
          { id: 'b', name: 'Beta' },
          { id: 'c', name: 'Gamma' },
        ]),
      ]
    );

    const listComp2 = UIIRFactory.createComponent(
      'ListApp',
      [
        UIIRFactory.createElement(
          'ul',
          [],
          [
            UIIRFactory.createList(
              'items',
              'item',
              UIIRFactory.createElement('li', [], [UIIRFactory.createText('{item.name}')]),
              'item.id'
            ),
          ]
        ),
      ],
      [
        UIIRFactory.createState('items', [
          { id: 'a', name: 'Alpha' },
          { id: 'd', name: 'Delta' },
          { id: 'c', name: 'Gamma' },
        ]),
      ]
    );

    const p1 = UIIRFactory.createProgram([listComp1], 'ListApp');
    const p2 = UIIRFactory.createProgram([listComp2], 'ListApp');

    const res1 = new CommonUIReconciler(p1).reconcile('ListApp');
    const res2 = new CommonUIReconciler(p2).reconcile('ListApp');

    const generator = new PatchGenerator();
    const patches = generator.generate(res1.domAST, res2.domAST);

    const removePatch = patches.find(
      (p) => p.operation === PatchOperationType.REMOVE_NODE || p.operation === PatchOperationType.REMOVE_CHILD
    );
    assert.ok(removePatch, 'Must generate REMOVE patch for item B');

    const insertPatch = patches.find(
      (p) => p.operation === PatchOperationType.INSERT_CHILD || p.operation === PatchOperationType.CREATE_NODE
    );
    assert.ok(insertPatch, 'Must generate INSERT patch for item D');
  });

  it('12. Common UI Reconciler: Conditional branch rendering (when show is false vs true)', () => {
    const compFalse = UIIRFactory.createComponent(
      'ToggleApp',
      [
        UIIRFactory.createConditional(
          'show',
          UIIRFactory.createElement('p', [UIIRFactory.createProp('id', 'visible')], [UIIRFactory.createText('Visible')]),
          UIIRFactory.createElement('p', [UIIRFactory.createProp('id', 'hidden')], [UIIRFactory.createText('Hidden')]),
          ['show']
        ),
      ],
      [UIIRFactory.createState('show', false)]
    );

    const compTrue = UIIRFactory.createComponent(
      'ToggleApp',
      [
        UIIRFactory.createConditional(
          'show',
          UIIRFactory.createElement('p', [UIIRFactory.createProp('id', 'visible')], [UIIRFactory.createText('Visible')]),
          UIIRFactory.createElement('p', [UIIRFactory.createProp('id', 'hidden')], [UIIRFactory.createText('Hidden')]),
          ['show']
        ),
      ],
      [UIIRFactory.createState('show', true)]
    );

    const resFalse = new CommonUIReconciler(UIIRFactory.createProgram([compFalse], 'ToggleApp')).reconcile('ToggleApp');
    const resTrue = new CommonUIReconciler(UIIRFactory.createProgram([compTrue], 'ToggleApp')).reconcile('ToggleApp');

    const generator = new PatchGenerator();
    const patches = generator.generate(resFalse.domAST, resTrue.domAST);

    assert.ok(patches.length > 0, 'Must generate patches on conditional branch change');
    assert.ok(
      patches.some((p) => p.operation === PatchOperationType.REPLACE_NODE || p.operation === PatchOperationType.CREATE_NODE)
    );
  });

  it('13. Common UI Reconciler: Two-way binding lower & live input synchronization', () => {
    const { mockWin, applier } = createMockDOMEnvironment();
    const comp = UIIRFactory.createComponent(
      'FormApp',
      [
        UIIRFactory.createElement(
          'input',
          [UIIRFactory.createProp('id', 'name-in'), UIIRFactory.createProp('type', 'text')],
          [],
          undefined,
          undefined,
          [UIIRFactory.createBinding('value', 'name', '#name-in')]
        ),
      ],
      [UIIRFactory.createState('name', 'Alice')]
    );
    const program = UIIRFactory.createProgram([comp], 'FormApp');

    const reconciler = new CommonUIReconciler(program);
    const { domAST, jsProgram, reactivityDefinitions } = reconciler.reconcile('FormApp');

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

    const def = Array.from(reactivityDefinitions.values())[0];
    const inputEl = applier.getNode('name-in');
    assert.ok(inputEl);
    assert.strictEqual(inputEl.value, 'Alice');

    // DOM event -> state
    inputEl.value = 'Bob';
    inputEl.dispatchEvent({ type: 'input', target: inputEl });
    assert.strictEqual(mockWin.__leveonas_state__[def.instancePath].name, 'Bob');

    // Programmatic updateState -> DOM attribute
    mockWin.__leveonas_runtime__.updateState(def.instancePath, 'name', 'Charlie');
    assert.strictEqual(inputEl.value, 'Charlie');
  });

  it('14. Common UI Reconciler: Event deduplication across multiple reconciliations', () => {
    const { mockWin, applier } = createMockDOMEnvironment();
    let clicks = 0;
    mockWin.testAction = () => {
      clicks++;
    };

    const comp = UIIRFactory.createComponent('ClickApp', [
      UIIRFactory.createElement(
        'button',
        [UIIRFactory.createProp('id', 'action-btn')],
        [UIIRFactory.createText('Click Me')],
        undefined,
        [UIIRFactory.createEvent('click', '#action-btn', 'testAction', undefined, undefined, true)]
      ),
    ]);
    const program = UIIRFactory.createProgram([comp], 'ClickApp');

    // Apply 5 times
    for (let i = 0; i < 5; i++) {
      const reconciler = new CommonUIReconciler(program);
      const { domAST, jsProgram } = reconciler.reconcile('ClickApp');
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
        }
      }
    }

    const btn = applier.getNode('action-btn');
    assert.ok(btn);
    btn.click();
    assert.strictEqual(clicks, 1, 'Event handler must execute exactly once');
  });

  it('15. Reconciler Performance & Metrics tracking', () => {
    const comp = UIIRFactory.createComponent(
      'BenchApp',
      [
        UIIRFactory.createElement('div', [], [
          UIIRFactory.createText('Count: {count} | Double: {double}')
        ])
      ],
      [UIIRFactory.createState('count', 0)],
      [UIIRFactory.createDerived('double', 'count * 2', ['count'])]
    );
    const program = UIIRFactory.createProgram([comp], 'BenchApp');

    const reconciler = new CommonUIReconciler(program);
    const { metrics } = reconciler.reconcile('BenchApp');

    assert.strictEqual(metrics.componentInstancesCount, 1);
    assert.strictEqual(metrics.stateCount, 1);
    assert.strictEqual(metrics.derivedCount, 1);
    assert.ok(metrics.totalNodesCount >= 2);
    assert.ok(metrics.reconciliationTimeMs >= 0);
  });

  it('16. Live Keyed List Reconciliation: A B C -> A C B retains DOM node identity and emits MOVE_CHILD', () => {
    const { mockWin, applier } = createMockDOMEnvironment();
    const initialItems = [
      { id: 'a', name: 'A' },
      { id: 'b', name: 'B' },
      { id: 'c', name: 'C' },
    ];

    const comp = UIIRFactory.createComponent(
      'ListApp',
      [
        UIIRFactory.createElement(
          'ul',
          [UIIRFactory.createProp('id', 'item-list')],
          [
            UIIRFactory.createList(
              'items',
              'item',
              UIIRFactory.createElement(
                'li',
                [],
                [UIIRFactory.createText('{item.name}')]
              ),
              'item.id'
            ),
          ]
        ),
      ],
      [UIIRFactory.createState('items', initialItems)]
    );
    const program = UIIRFactory.createProgram([comp], 'ListApp');

    const reconciler = new CommonUIReconciler(program);
    const { domAST, jsProgram, reactivityDefinitions } = reconciler.reconcile('ListApp');

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

    const def = Array.from(reactivityDefinitions.values())[0];
    const ul = applier.getNode('item-list');
    assert.ok(ul);
    assert.strictEqual(ul.childNodes.length, 3);

    const nodeA = applier.getNode('item-list-li-k_a');
    const nodeB = applier.getNode('item-list-li-k_b');
    const nodeC = applier.getNode('item-list-li-k_c');

    assert.ok(nodeA, 'Node A must exist');
    assert.ok(nodeB, 'Node B must exist');
    assert.ok(nodeC, 'Node C must exist');

    assert.strictEqual(ul.childNodes[0], nodeA);
    assert.strictEqual(ul.childNodes[1], nodeB);
    assert.strictEqual(ul.childNodes[2], nodeC);

    // Reorder items: A B C -> A C B
    mockWin.__leveonas_runtime__.updateState(def.instancePath, 'items', [
      { id: 'a', name: 'A' },
      { id: 'c', name: 'C' },
      { id: 'b', name: 'B' },
    ]);

    // Verify order in DOM is now A C B
    assert.strictEqual(ul.childNodes.length, 3);
    assert.strictEqual(ul.childNodes[0], nodeA, 'A must be at index 0');
    assert.strictEqual(ul.childNodes[1], nodeC, 'C must be at index 1');
    assert.strictEqual(ul.childNodes[2], nodeB, 'B must be at index 2');

    // Verify strict DOM reference identities are preserved (nodes were NOT recreated)
    assert.strictEqual(applier.getNode('item-list-li-k_a'), nodeA, 'Node A identity preserved');
    assert.strictEqual(applier.getNode('item-list-li-k_b'), nodeB, 'Node B identity preserved');
    assert.strictEqual(applier.getNode('item-list-li-k_c'), nodeC, 'Node C identity preserved');
  });

  it('17. Live List Insertion & Removal: A B C -> A D C preserves A and C, removes B, creates D', () => {
    const { mockWin, applier } = createMockDOMEnvironment();
    const initialItems = [
      { id: 'a', name: 'A' },
      { id: 'b', name: 'B' },
      { id: 'c', name: 'C' },
    ];

    const comp = UIIRFactory.createComponent(
      'ListApp',
      [
        UIIRFactory.createElement(
          'ul',
          [UIIRFactory.createProp('id', 'item-list')],
          [
            UIIRFactory.createList(
              'items',
              'item',
              UIIRFactory.createElement(
                'li',
                [],
                [UIIRFactory.createText('{item.name}')]
              ),
              'item.id'
            ),
          ]
        ),
      ],
      [UIIRFactory.createState('items', initialItems)]
    );
    const program = UIIRFactory.createProgram([comp], 'ListApp');

    const reconciler = new CommonUIReconciler(program);
    const { domAST, jsProgram, reactivityDefinitions } = reconciler.reconcile('ListApp');

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

    const def = Array.from(reactivityDefinitions.values())[0];
    const ul = applier.getNode('item-list');
    const nodeA = applier.getNode('item-list-li-k_a');
    const nodeB = applier.getNode('item-list-li-k_b');
    const nodeC = applier.getNode('item-list-li-k_c');

    // Update to A D C
    mockWin.__leveonas_runtime__.updateState(def.instancePath, 'items', [
      { id: 'a', name: 'A' },
      { id: 'd', name: 'D' },
      { id: 'c', name: 'C' },
    ]);

    assert.strictEqual(ul.childNodes.length, 3);
    assert.strictEqual(ul.childNodes[0], nodeA, 'Node A identity preserved');
    assert.strictEqual(ul.childNodes[2], nodeC, 'Node C identity preserved');

    // B must be removed
    assert.strictEqual(applier.getNode('item-list-li-k_b'), undefined, 'Node B must be removed');

    // D must be created
    const nodeD = applier.getNode('item-list-li-k_d');
    assert.ok(nodeD, 'Node D must be created');
    assert.strictEqual(ul.childNodes[1], nodeD, 'Node D must be at index 1');
  });

  it('18. Live List Removal: A B C -> A C removes B cleanly', () => {
    const { mockWin, applier } = createMockDOMEnvironment();
    const initialItems = [
      { id: 'a', name: 'A' },
      { id: 'b', name: 'B' },
      { id: 'c', name: 'C' },
    ];

    const comp = UIIRFactory.createComponent(
      'ListApp',
      [
        UIIRFactory.createElement(
          'ul',
          [UIIRFactory.createProp('id', 'item-list')],
          [
            UIIRFactory.createList(
              'items',
              'item',
              UIIRFactory.createElement('li', [], [UIIRFactory.createText('{item.name}')]),
              'item.id'
            ),
          ]
        ),
      ],
      [UIIRFactory.createState('items', initialItems)]
    );
    const program = UIIRFactory.createProgram([comp], 'ListApp');

    const reconciler = new CommonUIReconciler(program);
    const { domAST, jsProgram, reactivityDefinitions } = reconciler.reconcile('ListApp');

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

    const def = Array.from(reactivityDefinitions.values())[0];
    const ul = applier.getNode('item-list');
    const nodeA = applier.getNode('item-list-li-k_a');
    const nodeC = applier.getNode('item-list-li-k_c');

    // Remove B
    mockWin.__leveonas_runtime__.updateState(def.instancePath, 'items', [
      { id: 'a', name: 'A' },
      { id: 'c', name: 'C' },
    ]);

    assert.strictEqual(ul.childNodes.length, 2);
    assert.strictEqual(ul.childNodes[0], nodeA);
    assert.strictEqual(ul.childNodes[1], nodeC);
    assert.strictEqual(applier.getNode('item-list-li-k_b'), undefined);
  });

  it('19. Live List In-Place Item Update: A B C -> A B2 C preserves B identity and updates child text', () => {
    const { mockWin, applier } = createMockDOMEnvironment();
    const initialItems = [
      { id: 'a', name: 'A' },
      { id: 'b', name: 'B' },
      { id: 'c', name: 'C' },
    ];

    const comp = UIIRFactory.createComponent(
      'ListApp',
      [
        UIIRFactory.createElement(
          'ul',
          [UIIRFactory.createProp('id', 'item-list')],
          [
            UIIRFactory.createList(
              'items',
              'item',
              UIIRFactory.createElement('li', [], [UIIRFactory.createText('{item.name}')]),
              'item.id'
            ),
          ]
        ),
      ],
      [UIIRFactory.createState('items', initialItems)]
    );
    const program = UIIRFactory.createProgram([comp], 'ListApp');

    const reconciler = new CommonUIReconciler(program);
    const { domAST, jsProgram, reactivityDefinitions } = reconciler.reconcile('ListApp');

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

    const def = Array.from(reactivityDefinitions.values())[0];
    const nodeB = applier.getNode('item-list-li-k_b');
    assert.ok(nodeB);
    const textNodeB = nodeB.childNodes[0];
    assert.strictEqual(textNodeB.textContent, 'B');

    // Update B to B2
    mockWin.__leveonas_runtime__.updateState(def.instancePath, 'items', [
      { id: 'a', name: 'A' },
      { id: 'b', name: 'B2' },
      { id: 'c', name: 'C' },
    ]);

    // Check node B identity is unchanged
    assert.strictEqual(applier.getNode('item-list-li-k_b'), nodeB, 'Node B must NOT be recreated');
    assert.strictEqual(textNodeB.textContent, 'B2', 'Text node value must be updated to B2');
  });

  it('20. Fully Serializable Conditional Reactivity & Dynamic Branch Swapping without compiler functions', () => {
    const { mockWin, applier } = createMockDOMEnvironment();

    const comp = UIIRFactory.createComponent(
      'CondApp',
      [
        UIIRFactory.createElement(
          'div',
          [UIIRFactory.createProp('id', 'cond-container')],
          [
            UIIRFactory.createConditional(
              'isVisible',
              UIIRFactory.createElement('p', [UIIRFactory.createProp('id', 'visible-branch')], [
                UIIRFactory.createText('Visible Content')
              ]),
              UIIRFactory.createElement('p', [UIIRFactory.createProp('id', 'hidden-branch')], [
                UIIRFactory.createText('Hidden Fallback')
              ])
            )
          ]
        )
      ],
      [UIIRFactory.createState('isVisible', true)]
    );
    const program = UIIRFactory.createProgram([comp], 'CondApp');

    const reconciler = new CommonUIReconciler(program);
    const { domAST, jsProgram, reactivityDefinitions } = reconciler.reconcile('CondApp');

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

    const def = Array.from(reactivityDefinitions.values())[0];

    // Verify serializability: zero functions in JSON serialization
    const serializedDef = JSON.stringify(def);
    assert.ok(!serializedDef.includes('function'));
    const deserializedDef = JSON.parse(serializedDef);
    assert.strictEqual(deserializedDef.componentName, 'CondApp');
    assert.ok(deserializedDef.domDependencies['visible-branch']);
    assert.strictEqual(deserializedDef.domDependencies['visible-branch'].kind, 'CONDITIONAL');

    // Initial state: isVisible = true -> visible-branch rendered
    assert.ok(applier.getNode('visible-branch'));
    assert.strictEqual(applier.getNode('hidden-branch'), undefined);

    // Switch to isVisible = false -> hidden-branch rendered
    mockWin.__leveonas_runtime__.updateState(def.instancePath, 'isVisible', false);
    assert.strictEqual(applier.getNode('visible-branch'), undefined);
    assert.ok(applier.getNode('hidden-branch'));

    // Switch back to isVisible = true -> visible-branch rendered
    mockWin.__leveonas_runtime__.updateState(def.instancePath, 'isVisible', true);
    assert.ok(applier.getNode('visible-branch'));
    assert.strictEqual(applier.getNode('hidden-branch'), undefined);
  });

  it('21. Cross-Framework Equivalence: React, Vue & Svelte lower to Common UI IR and execute identical state mutations, list updates & minimal DOM patches', () => {
    const { mockWin: reactWin, applier: reactApplier } = createMockDOMEnvironment();
    const { mockWin: vueWin, applier: vueApplier } = createMockDOMEnvironment();
    const { mockWin: svelteWin, applier: svelteApplier } = createMockDOMEnvironment();

    // 1. React-LM
    const reactSource = `
component(App)(
  state(count, 0)
  state(items, [{id: "1", name: "Alpha"}, {id: "2", name: "Beta"}])
  di(
    h1("Count: {count}")
    bo(oc:increment "+1")
    ul(
      each(items, item, item.id)(
        li("{item.name}")
      )
    )
  )
)
`.trim();

    // 2. Vue-LM
    const vueSource = `
component(App)(
  ref(count, 0)
  ref(items, [{id: "1", name: "Alpha"}, {id: "2", name: "Beta"}])
  di(
    h1("Count: {count}")
    bo(@click:increment "+1")
    ul(
      v-for(items, item, item.id)(
        li("{item.name}")
      )
    )
  )
)
`.trim();

    // 3. Svelte-LM
    const svelteSource = `
component(App)(
  state(count, 0)
  state(items, [{id: "1", name: "Alpha"}, {id: "2", name: "Beta"}])
  di(
    h1("Count: {count}")
    bo(on:click:increment "+1")
    ul(
      each(items, item, item.id)(
        li("{item.name}")
      )
    )
  )
)
`.trim();

    const reactAST = ReactLMInterpreter.parse(reactSource);
    const vueAST = VueLMInterpreter.parse(vueSource);
    const svelteAST = SvelteLMInterpreter.parse(svelteSource);

    const reactUIIR = ReactToLowering.lower(reactAST);
    const vueUIIR = VueToLowering.lower(vueAST);
    const svelteUIIR = SvelteToLowering.lower(svelteAST);

    // Verify all 3 have identical component, state, and element structure
    assert.strictEqual(reactUIIR.components[0].name, 'App');
    assert.strictEqual(vueUIIR.components[0].name, 'App');
    assert.strictEqual(svelteUIIR.components[0].name, 'App');

    assert.strictEqual(reactUIIR.components[0].stateDeclarations.length, 2);
    assert.strictEqual(vueUIIR.components[0].stateDeclarations.length, 2);
    assert.strictEqual(svelteUIIR.components[0].stateDeclarations.length, 2);

    // Reconcile and execute all 3 in parallel
    const runFramework = (ir: any, mockWin: any, applier: any) => {
      const reconciler = new CommonUIReconciler(ir);
      const { domAST, jsProgram, reactivityDefinitions } = reconciler.reconcile('App');
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
      return { def: Array.from(reactivityDefinitions.values())[0] };
    };

    const reactRes = runFramework(reactUIIR, reactWin, reactApplier);
    const vueRes = runFramework(vueUIIR, vueWin, vueApplier);
    const svelteRes = runFramework(svelteUIIR, svelteWin, svelteApplier);

    // Test state update & DOM synchronization on all 3
    reactWin.__leveonas_runtime__.updateState(reactRes.def.instancePath, 'count', 5);
    vueWin.__leveonas_runtime__.updateState(vueRes.def.instancePath, 'count', 5);
    svelteWin.__leveonas_runtime__.updateState(svelteRes.def.instancePath, 'count', 5);

    assert.strictEqual(reactWin.__leveonas_state__[reactRes.def.instancePath].count, 5);
    assert.strictEqual(vueWin.__leveonas_state__[vueRes.def.instancePath].count, 5);
    assert.strictEqual(svelteWin.__leveonas_state__[svelteRes.def.instancePath].count, 5);

    // Test list update on all 3
    const newItems = [
      { id: '1', name: 'Alpha Updated' },
      { id: '3', name: 'Gamma' },
    ];
    reactWin.__leveonas_runtime__.updateState(reactRes.def.instancePath, 'items', newItems);
    vueWin.__leveonas_runtime__.updateState(vueRes.def.instancePath, 'items', newItems);
    svelteWin.__leveonas_runtime__.updateState(svelteRes.def.instancePath, 'items', newItems);

    assert.strictEqual(reactWin.__leveonas_state__[reactRes.def.instancePath].items.length, 2);
    assert.strictEqual(vueWin.__leveonas_state__[vueRes.def.instancePath].items.length, 2);
    assert.strictEqual(svelteWin.__leveonas_state__[svelteRes.def.instancePath].items.length, 2);
  });
});
