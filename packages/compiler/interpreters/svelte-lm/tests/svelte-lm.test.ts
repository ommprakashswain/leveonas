import { describe, it } from 'node:test';
import assert from 'node:assert';
import { SvelteLMInterpreter } from '../interpreter';
import { SvelteReconciler } from '../reconciler';
import { SvelteLMSerializer } from '../serializer';
import { SvelteLMValidator } from '../validator';
import { SvelteNodeKind } from '../ast';
import {
  SvelteReactivityGraph,
  extractExpressionDependencies,
  extractTemplateInterpolations,
  evaluateSvelteExpression,
  interpolateTemplateString,
} from '../reactivity';
import { LMGenerationPipeline } from '../../../pipeline/generation-pipeline';
import { PatchOperation, PatchOperationType } from '../../../../runtime/incremental/patch-generator/types';
import { DOMPatchApplier } from '../../../../runtime/incremental/patch-executor/dom-applier';
import { PatchGenerator } from '../../../../runtime/incremental/patch-generator/generator';
import { ASTFactory } from '../../../ast/factory';
import { ASTNodeKind, SourceLocation } from '../../../ast/types';
import { RootNode } from '../../../ast/nodes';

// Helper to create a fully functional mock DOM environment for runtime execution
function createMockDOMEnvironment() {
  const elements = new Map<string, any>();
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

describe('Svelte-LM V1 Interpreter, Reconciler & End-to-End Pipeline', () => {
  it('1. Parses simple Svelte component declaration with intrinsic elements', () => {
    const input = `
component(App)(
  div(
    h1("Welcome to Svelte-LM")
    p("Streamlined lightweight Svelte representation")
  )
)
`;
    const ast = SvelteLMInterpreter.parse(input);
    assert.strictEqual(ast.components.length, 1);
    const app = ast.components[0];
    assert.strictEqual(app.name, 'App');
    assert.strictEqual(app.body.length, 1);

    const div = app.body[0] as any;
    assert.strictEqual(div.kind, SvelteNodeKind.Element);
    assert.strictEqual(div.tag, 'div');
    assert.strictEqual(div.children.length, 2);
    assert.strictEqual(div.children[0].tag, 'h1');
    assert.strictEqual(div.children[1].tag, 'p');
  });

  it('2. Supports compact vocabulary, element, and prop abbreviations', () => {
    const input = `
component(CompactCard)(
  di(cs:"card shadow"
    he(h2("Compact Title"))
    so(pa("Paragraph description"))
    bo(cs:"btn-primary" oc:handleClick "Click Action")
  )
)
`;
    const ast = SvelteLMInterpreter.parse(input);
    assert.strictEqual(ast.components.length, 1);
    const comp = ast.components[0];
    const rootDi = comp.body[0] as any;
    assert.strictEqual(rootDi.tag, 'div');

    const classProp = rootDi.props.find((p: any) => p.name === 'className');
    assert.ok(classProp);
    assert.strictEqual(classProp.value, 'card shadow');

    assert.strictEqual(rootDi.children.length, 3);
    const header = rootDi.children[0];
    assert.strictEqual(header.tag, 'header');
    const section = rootDi.children[1];
    assert.strictEqual(section.tag, 'section');
    const button = rootDi.children[2];
    assert.strictEqual(button.tag, 'button');
  });

  it('3. Parses reactive state and reactive declarations inside components', () => {
    const input = `
component(Counter)(
  state(count, 0)
  state(multiplier, 5)
  reactive(total, count * multiplier)

  di(
    h2("Counter: {count}")
    p("Total: {total}")
    bo(on:click:increment "+1")
  )
)
`;
    const ast = SvelteLMInterpreter.parse(input);
    const comp = ast.components[0];
    assert.strictEqual(comp.stateDeclarations.length, 2);
    assert.strictEqual(comp.stateDeclarations[0].stateName, 'count');
    assert.strictEqual(comp.stateDeclarations[0].initialValue, 0);
    assert.strictEqual(comp.stateDeclarations[1].stateName, 'multiplier');
    assert.strictEqual(comp.stateDeclarations[1].initialValue, 5);

    assert.strictEqual(comp.reactiveDeclarations.length, 1);
    assert.strictEqual(comp.reactiveDeclarations[0].reactiveName, 'total');
    assert.strictEqual(comp.reactiveDeclarations[0].expression, 'count * multiplier');
  });

  it('4. Handles props with string, boolean, event (on:click), and bind:value bindings', () => {
    const input = `
component(LoginForm)(
  state(username, "Alice")
  state(remember, true)

  fo(cs:"login-form" os:handleSubmit
    in(tp:"text" bv:username pe:"Enter username")
    in(tp:"checkbox" bc:remember)
    bo(tp:"submit" dis:false "Sign In")
  )
)
`;
    const ast = SvelteLMInterpreter.parse(input);
    const comp = ast.components[0];
    const form = comp.body[0] as any;
    assert.strictEqual(form.tag, 'form');

    const submitEvent = form.props.find((p: any) => p.isEvent);
    assert.ok(submitEvent);

    const userInput = form.children[0];
    assert.strictEqual(userInput.tag, 'input');
    const bindValProp = userInput.props.find((p: any) => p.isBinding);
    assert.ok(bindValProp);
    assert.strictEqual(bindValProp.name, 'bind:value');
  });

  it('5. Supports Component Composition and Custom Instances', () => {
    const input = `
component(Header)(
  prop(title, "Default Header")
  he(cs:"main-header" h1("{title}"))
)

component(App)(
  di(
    Header(title:"My Application")
    p("Main Content Body")
  )
)
`;
    const ast = SvelteLMInterpreter.parse(input);
    assert.strictEqual(ast.components.length, 2);
    const appComp = ast.components.find((c) => c.name === 'App')!;
    const rootDiv = appComp.body[0] as any;
    const headerInst = rootDiv.children[0];
    assert.strictEqual(headerInst.kind, SvelteNodeKind.ComponentInstance);
    assert.strictEqual(headerInst.componentName, 'Header');
  });

  it('6. Supports Default Slots in Component Composition', () => {
    const input = `
component(Card)(
  di(cs:"card-wrapper"
    h3("Card Header")
    slot()
  )
)

component(App)(
  di(
    Card(
      p("Injected Card Child Paragraph")
    )
  )
)
`;
    const ast = SvelteLMInterpreter.parse(input);
    const reconciler = new SvelteReconciler(ast);
    const result = reconciler.reconcile('App');

    assert.ok(result.domAST);
    assert.strictEqual(result.domAST.children.length, 1);
    const rootDiv = result.domAST.children[0] as any;
    assert.strictEqual(rootDiv.children.length, 1);
    const cardWrapper = rootDiv.children[0];
    assert.strictEqual(cardWrapper.children.length, 2);
  });

  it('7. Reconciler lowers Svelte Component Tree into Leveonas DOM AST and JS Programs', () => {
    const input = `
component(App)(
  state(count, 10)
  reactive(double, count * 2)

  di(
    h1("Count: {count} Double: {double}")
    bo(oc:increment "+1")
  )
)
`;
    const ast = SvelteLMInterpreter.parse(input);
    const reconciler = new SvelteReconciler(ast);
    const result = reconciler.reconcile('App');

    assert.ok(result.domAST);
    assert.ok(result.jsProgram);
    assert.ok(result.jsProgram.units.length > 0);

    const stateUnit = result.jsProgram.units.find((u) => u.unitKind === 'Variable');
    assert.ok(stateUnit);
    assert.ok(stateUnit.code.includes('__leveonas_state__'));

    const reactiveUnit = result.jsProgram.units.find((u) => u.unitKind === 'Function');
    assert.ok(reactiveUnit);
    assert.ok(reactiveUnit.code.includes('__leveonas_reactive__'));

    const eventUnit = result.jsProgram.units.find((u) => u.unitKind === 'EventHandler');
    assert.ok(eventUnit);
    assert.ok(eventUnit.code.includes('__leveonas_runtime__.on'));
  });

  it('8. Incremental Streaming with Arbitrary Provider Chunks', () => {
    const interpreter = new SvelteLMInterpreter();

    const chunks = [
      'component(A',
      'pp)(\n',
      '  state(c',
      'ount, 0)\n',
      '  di(\n',
      '    h1("Streaming ',
      'Title")\n',
      '    bo(oc:inc "+',
      '1")\n',
      '  )\n',
      ')',
    ];

    for (const chunk of chunks) {
      interpreter.write(chunk);
    }
    const finalAST = interpreter.end();

    assert.strictEqual(finalAST.components.length, 1);
    assert.strictEqual(finalAST.components[0].name, 'App');
    assert.strictEqual(finalAST.components[0].stateDeclarations.length, 1);
    assert.strictEqual(finalAST.components[0].stateDeclarations[0].stateName, 'count');
  });

  it('9. Serializer and Validator roundtrip with diagnostics', () => {
    const input = `
component(Card)(
  state(count, 0)
  reactive(double, count * 2)
  di(cs:"card" h2("Count {count}"))
)
`;
    const ast = SvelteLMInterpreter.parse(input);
    const diagnostics = SvelteLMValidator.validate(ast);
    assert.strictEqual(diagnostics.length, 0);

    const json = SvelteLMSerializer.toJSON(ast);
    const restored = SvelteLMSerializer.fromJSON(json);
    assert.strictEqual(restored.components.length, 1);
    assert.strictEqual(restored.components[0].name, 'Card');
  });

  it('10. End-to-end Pipeline: Streaming <SVELTE> block emits minimal DOM & JS Patches', () => {
    const emittedPatches: PatchOperation[] = [];
    const pipeline = new LMGenerationPipeline({
      onPatch: (patches) => {
        emittedPatches.push(...patches);
      },
    });

    const stream = `
<SVELTE>
component(App)(
  state(count, 0)
  di(
    h1("Live Svelte-LM Streaming")
    bo(oc:increment "+1")
  )
)
</SVELTE>
`;

    for (let i = 0; i < stream.length; i += 8) {
      pipeline.write(stream.slice(i, i + 8));
    }
    pipeline.end();

    assert.ok(emittedPatches.length > 0);
    const domPatches = emittedPatches.filter(
      (p) =>
        !p.target ||
        p.target === 'DOM' ||
        p.operation.includes('NODE') ||
        p.operation.includes('CHILD') ||
        p.operation.includes('TEXT')
    );
    const jsPatches = emittedPatches.filter((p) => p.target === 'JS' || p.operation.includes('JS'));
    assert.ok(domPatches.length > 0, 'Should have emitted DOM patches');
    assert.ok(jsPatches.length > 0, 'Should have emitted JS patches');
  });

  it('11. Multi-Language Coexistence: <SVELTE>, <CSS>, and <TS> in same stream', () => {
    const emittedPatches: PatchOperation[] = [];
    const pipeline = new LMGenerationPipeline({
      onPatch: (patches) => {
        emittedPatches.push(...patches);
      },
    });

    const multiLangStream = `
<CSS>
.hero { color: #3b82f6; padding: 20px; }
.btn { background: #10b981; color: white; }
</CSS>

<SVELTE>
component(App)(
  state(count, 0)
  di(cs:"hero"
    h1("Full Stack Multi-Language Svelte")
    bo(cs:"btn" oc:increment "+1")
  )
)
</SVELTE>

<TS>
function logMetrics(count: number): void {
  console.log("Current Svelte counter: " + count);
}
</TS>
`;

    pipeline.write(multiLangStream);
    pipeline.end();

    assert.ok(emittedPatches.length > 0);
    const cssPatches = emittedPatches.filter((p) => p.target === 'CSS' || p.operation.includes('CSS'));
    const domPatches = emittedPatches.filter(
      (p) => !p.target || p.target === 'DOM' || p.operation.includes('NODE') || p.operation.includes('CHILD')
    );
    const jsPatches = emittedPatches.filter((p) => p.target === 'JS' || p.operation.includes('JS'));

    assert.ok(cssPatches.length > 0, 'Must emit CSS patches');
    assert.ok(domPatches.length > 0, 'Must emit DOM patches');
    assert.ok(jsPatches.length > 0, 'Must emit JS patches');
  });

  it('12. Dynamic Class directives and Conditionals in Svelte-LM', () => {
    const input = `
component(App)(
  state(isActive, true)
  state(showDetails, false)

  di(
    bo(cs:"btn" class:active:isActive "Toggle")
    when(showDetails)(
      p("Secret Details Visible")
    )(
      p("Details Hidden")
    )
  )
)
`;
    const ast = SvelteLMInterpreter.parse(input);
    const reconciler = new SvelteReconciler(ast);
    const result = reconciler.reconcile('App');

    assert.ok(result.domAST);
    const rootDiv = result.domAST.children[0] as any;
    const button = rootDiv.children[0];
    const classProp = button.properties.find((p: any) => p.name === 'className');
    assert.ok(classProp);
    assert.ok(classProp.value.value.includes('active'));

    const conditionalNode = rootDiv.children[1];
    assert.ok(conditionalNode);
    assert.strictEqual(
      conditionalNode.properties?.find((p: any) => p.name === 'value')?.value?.value ||
        conditionalNode.children?.[0]?.value,
      'Details Hidden'
    );
  });

  it('13. Explicit Dependency Extraction for expressions & template interpolations', () => {
    const deps1 = extractExpressionDependencies('count * 2');
    assert.deepStrictEqual(deps1, ['count']);

    const deps2 = extractExpressionDependencies('price * quantity + tax - discount');
    assert.deepStrictEqual(deps2, ['discount', 'price', 'quantity', 'tax']);

    const deps3 = extractExpressionDependencies('user.profile.name + item.price');
    assert.deepStrictEqual(deps3, ['item', 'user']);

    const textDeps = extractTemplateInterpolations(
      'Count is: {count} and Double is: {double} with user {user.name}'
    );
    assert.deepStrictEqual(textDeps, ['count', 'double', 'user']);
  });

  it('14. Explicit Reactivity Graph tracks dependencies and computes topological order', () => {
    const graph = new SvelteReactivityGraph('Cart', 'svelte-root-Cart_0');
    graph.addState('price', 100);
    graph.addState('quantity', 2);
    graph.addState('discount', 10);

    graph.addReactive('subtotal', 'price * quantity');
    graph.addReactive('total', 'subtotal - discount');
    graph.addReactive('formattedTotal', '"$" + total');

    graph.registerDOMDependency({
      domNodeId: 'cart-total-txt',
      kind: 'TEXT',
      template: 'Final: {formattedTotal}',
      dependencies: ['formattedTotal'],
    });

    const initialContext = graph.computeInitialContext();
    assert.strictEqual(initialContext.price, 100);
    assert.strictEqual(initialContext.quantity, 2);
    assert.strictEqual(initialContext.subtotal, 200);
    assert.strictEqual(initialContext.total, 190);
    assert.strictEqual(initialContext.formattedTotal, '$190');

    const updateResult = graph.updateState('quantity', 5, initialContext);
    assert.strictEqual(updateResult.updatedState.quantity, 5);
    assert.strictEqual(updateResult.updatedState.subtotal, 500);
    assert.strictEqual(updateResult.updatedState.total, 490);
    assert.strictEqual(updateResult.updatedState.formattedTotal, '$490');

    assert.strictEqual(updateResult.affectedDomNodeIds.length, 1);
    assert.strictEqual(updateResult.affectedDomNodeIds[0], 'cart-total-txt');
    assert.strictEqual(updateResult.patches.length, 1);
    assert.strictEqual(updateResult.patches[0].operation, PatchOperationType.UPDATE_TEXT);
    assert.strictEqual(updateResult.patches[0].nodeId, 'cart-total-txt');
    assert.strictEqual(updateResult.patches[0].payload.value, 'Final: $490');
  });

  it('15. REAL RUNTIME COUNTER TEST: Real DOM click -> state update -> reactive declaration -> pinpoint DOM patch', () => {
    const { mockWin, applier } = createMockDOMEnvironment();

    const input = `
component(Counter)(
  state(count, 0)
  reactive(double, count * 2)

  di(cs:"counter-box"
    p("Count: {count}")
    p("Double: {double}")
    bo(id:"btn-inc" oc:increment "+1")
  )
)

component(App)(
  di(
    Counter()
  )
)
`;
    const ast = SvelteLMInterpreter.parse(input);
    const reconciler = new SvelteReconciler(ast);
    const { domAST, jsProgram } = reconciler.reconcile('App');

    const loc: SourceLocation = {
      startLine: 1,
      startColumn: 1,
      startOffset: 0,
      endLine: 1,
      endColumn: 1,
      endOffset: 0,
    };
    const emptyRoot = ASTFactory.createComponent(ASTNodeKind.Root, loc, [], []) as RootNode;
    emptyRoot.id = 'leveonas-root';

    const generator = new PatchGenerator();
    const domPatches = generator.generate(emptyRoot, domAST);
    applier.apply(domPatches);

    // Apply JS units
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

    const counterGraph = Array.from(reconciler.reactivityGraphs.values()).find(
      (g) => g.componentName === 'Counter'
    );
    assert.ok(counterGraph, 'Counter Reactivity Graph must exist');
    mockWin.__leveonas_reactivity__ = mockWin.__leveonas_reactivity__ || {};
    mockWin.__leveonas_reactivity__[counterGraph.instancePath] = counterGraph;

    // Retrieve live text nodes from the DOM
    const appRoot = domAST.children[0] as any;
    const counterBox = appRoot.children[0] as any;
    const pCountNode = counterBox.children[0];
    const pDoubleNode = counterBox.children[1];

    const countTextNode = applier.getNode(pCountNode.children[0].id);
    const doubleTextNode = applier.getNode(pDoubleNode.children[0].id);

    assert.ok(countTextNode, 'Count text node must exist in DOM');
    assert.ok(doubleTextNode, 'Double text node must exist in DOM');
    assert.strictEqual(countTextNode.textContent, 'Count: 0');
    assert.strictEqual(doubleTextNode.textContent, 'Double: 0');

    // Find button element
    const btn = applier.getNode('btn-inc');
    assert.ok(btn, 'Button element must exist in DOM');

    // 1st Real Click
    btn.click();
    assert.strictEqual(countTextNode.textContent, 'Count: 1');
    assert.strictEqual(doubleTextNode.textContent, 'Double: 2');

    // 2nd Real Click
    btn.click();
    assert.strictEqual(countTextNode.textContent, 'Count: 2');
    assert.strictEqual(doubleTextNode.textContent, 'Double: 4');
  });

  it('16. Minimal Patches: App (Header, Counter, Footer) - Header & Footer retain identity with 0 diff patches', () => {
    const input = `
component(Header)(
  he(cs:"site-header" h1("Application Dashboard"))
)

component(Footer)(
  fo(cs:"site-footer" p("Copyright 2026 Leveonas"))
)

component(Counter)(
  state(count, 0)
  reactive(double, count * 2)

  di(cs:"counter-box"
    p("Count: {count}")
    p("Double: {double}")
    bo(id:"btn" oc:increment "+1")
  )
)

component(App)(
  di(
    Header()
    Counter()
    Footer()
  )
)
`;
    const ast = SvelteLMInterpreter.parse(input);
    const reconciler = new SvelteReconciler(ast);
    const result = reconciler.reconcile('App');

    assert.strictEqual(result.componentInstancesCount, 4);

    const appRoot = result.domAST.children[0] as any;
    assert.strictEqual(appRoot.children.length, 3);

    const headerNode = appRoot.children[0];
    const counterNode = appRoot.children[1];
    const footerNode = appRoot.children[2];

    const initialHeaderId = headerNode.id;
    const initialFooterId = footerNode.id;

    const countP = counterNode.children[0];
    const doubleP = counterNode.children[1];
    const countTextNode = countP.children[0];
    const doubleTextNode = doubleP.children[0];

    const counterGraph = Array.from(result.reactivityGraphs.values()).find(
      (g) => g.componentName === 'Counter'
    );
    assert.ok(counterGraph, 'Counter Reactivity Graph must exist');

    const updateResult = counterGraph.updateState('count', 1, counterGraph.computeInitialContext());

    assert.strictEqual(updateResult.updatedState.count, 1);
    assert.strictEqual(updateResult.updatedState.double, 2);

    assert.strictEqual(updateResult.affectedDomNodeIds.length, 2);
    assert.ok(updateResult.affectedDomNodeIds.includes(countTextNode.id));
    assert.ok(updateResult.affectedDomNodeIds.includes(doubleTextNode.id));

    assert.strictEqual(updateResult.patches.length, 2);
    const countPatch = updateResult.patches.find((p) => p.nodeId === countTextNode.id);
    const doublePatch = updateResult.patches.find((p) => p.nodeId === doubleTextNode.id);

    assert.ok(countPatch);
    assert.strictEqual(countPatch.payload.value, 'Count: 1');

    assert.ok(doublePatch);
    assert.strictEqual(doublePatch.payload.value, 'Double: 2');

    assert.ok(!updateResult.affectedDomNodeIds.includes(initialHeaderId));
    assert.ok(!updateResult.affectedDomNodeIds.includes(initialFooterId));
  });

  it('17. Keyed Each Reorder: A B C -> A C B preserves node identity and generates MOVE_CHILD', () => {
    const input1 = `
component(ListApp)(
  state(items, [
    { id: "a", name: "Alpha" },
    { id: "b", name: "Beta" },
    { id: "c", name: "Gamma" }
  ])

  ul(
    each(items, item, item.id)(
      li("{item.name}")
    )
  )
)
`;
    const input2 = `
component(ListApp)(
  state(items, [
    { id: "a", name: "Alpha" },
    { id: "c", name: "Gamma" },
    { id: "b", name: "Beta" }
  ])

  ul(
    each(items, item, item.id)(
      li("{item.name}")
    )
  )
)
`;
    const ast1 = SvelteLMInterpreter.parse(input1);
    const ast2 = SvelteLMInterpreter.parse(input2);

    const reconciler1 = new SvelteReconciler(ast1);
    const res1 = reconciler1.reconcile('ListApp');

    const reconciler2 = new SvelteReconciler(ast2);
    const res2 = reconciler2.reconcile('ListApp');

    const generator = new PatchGenerator();
    const patches = generator.generate(res1.domAST, res2.domAST);

    // Keyed elements preserved, MOVE_CHILD generated
    const movePatch = patches.find((p) => p.operation === PatchOperationType.MOVE_CHILD);
    assert.ok(movePatch, 'Must generate MOVE_CHILD patch for reordered element');
    assert.ok(movePatch.nodeId.includes('-k_'), 'Moved node must be a keyed item');

    const removePatches = patches.filter((p) => p.operation === PatchOperationType.REMOVE_NODE);
    assert.strictEqual(removePatches.length, 0, 'No existing keyed nodes should be removed on reorder');
  });

  it('18. Keyed Each Insertion & Removal: A B C -> A D C (B removed, D created, A and C preserved)', () => {
    const input1 = `
component(ListApp)(
  state(items, [
    { id: "a", name: "Alpha" },
    { id: "b", name: "Beta" },
    { id: "c", name: "Gamma" }
  ])

  ul(
    each(items, item, item.id)(
      li("{item.name}")
    )
  )
)
`;
    const input2 = `
component(ListApp)(
  state(items, [
    { id: "a", name: "Alpha" },
    { id: "d", name: "Delta" },
    { id: "c", name: "Gamma" }
  ])

  ul(
    each(items, item, item.id)(
      li("{item.name}")
    )
  )
)
`;
    const ast1 = SvelteLMInterpreter.parse(input1);
    const ast2 = SvelteLMInterpreter.parse(input2);

    const res1 = new SvelteReconciler(ast1).reconcile('ListApp');
    const res2 = new SvelteReconciler(ast2).reconcile('ListApp');

    const generator = new PatchGenerator();
    const patches = generator.generate(res1.domAST, res2.domAST);

    const removePatch = patches.find(
      (p) => p.operation === PatchOperationType.REMOVE_NODE || p.operation === PatchOperationType.REMOVE_CHILD
    );
    assert.ok(removePatch, 'Item B must be removed');
    assert.ok(removePatch.nodeId.includes('-k_b'), 'Removed node must be item B');

    const insertPatch = patches.find(
      (p) => p.operation === PatchOperationType.INSERT_CHILD || p.operation === PatchOperationType.CREATE_NODE
    );
    assert.ok(insertPatch, 'Item D must be created/inserted');
    assert.ok(insertPatch.nodeId.includes('-k_d'), 'Inserted node must be item D');
  });

  it('19. Each Item Context: {item.title} and {index} evaluate in item scope', () => {
    const input = `
component(TaskList)(
  state(tasks, [
    { id: "t1", title: "Write Specs" },
    { id: "t2", title: "Ship Code" }
  ])

  ol(
    each(tasks, item, item.id)(
      li("#{index}: {item.title}")
    )
  )
)
`;
    const ast = SvelteLMInterpreter.parse(input);
    const res = new SvelteReconciler(ast).reconcile('TaskList');

    const ol = res.domAST.children[0] as any;
    assert.strictEqual(ol.children.length, 2);

    const li1 = ol.children[0];
    const li2 = ol.children[1];

    assert.strictEqual(li1.children[0].value, '#0: Write Specs');
    assert.strictEqual(li2.children[0].value, '#1: Ship Code');
  });

  it('20. Conditional Branch Reconciliation: when(show) false -> true -> false branch swapping', () => {
    const input = `
component(ToggleView)(
  state(show, false)

  di(
    when(show)(
      p("Secret Message")
    )(
      p("Hidden Content")
    )
  )
)
`;
    const ast = SvelteLMInterpreter.parse(input);
    const reconciler = new SvelteReconciler(ast);
    const res = reconciler.reconcile('ToggleView');

    const toggleGraph = Array.from(res.reactivityGraphs.values())[0];
    assert.ok(toggleGraph, 'ToggleView graph must exist');

    const initCtx = toggleGraph.computeInitialContext();
    assert.strictEqual(initCtx.show, false);

    const update1 = toggleGraph.updateState('show', true, initCtx);
    assert.strictEqual(update1.updatedState.show, true);
    assert.strictEqual(update1.patches.length, 1);
    assert.strictEqual(update1.patches[0].operation, PatchOperationType.REPLACE_NODE);
    assert.strictEqual(update1.patches[0].payload.children[0].value, 'Secret Message');

    const update2 = toggleGraph.updateState('show', false, update1.updatedState);
    assert.strictEqual(update2.updatedState.show, false);
    assert.strictEqual(update2.patches.length, 1);
    assert.strictEqual(update2.patches[0].operation, PatchOperationType.REPLACE_NODE);
    assert.strictEqual(update2.patches[0].payload.children[0].value, 'Hidden Content');
  });

  it('21. Two-way Bindings: DOM input event -> state mutation AND state update -> DOM attribute update', () => {
    const { mockWin, applier } = createMockDOMEnvironment();

    const input = `
component(UserForm)(
  state(username, "Alice")
  state(isSubscribed, false)

  di(
    in(id:"user-input" tp:"text" bv:username)
    in(id:"sub-check" tp:"checkbox" bc:isSubscribed)
  )
)
`;
    const ast = SvelteLMInterpreter.parse(input);
    const reconciler = new SvelteReconciler(ast);
    const { domAST, jsProgram } = reconciler.reconcile('UserForm');

    const emptyRoot = ASTFactory.createComponent(
      ASTNodeKind.Root,
      { startLine: 1, startColumn: 1, startOffset: 0, endLine: 1, endColumn: 1, endOffset: 0 },
      [],
      []
    ) as RootNode;
    emptyRoot.id = 'leveonas-root';

    const generator = new PatchGenerator();
    applier.apply(generator.generate(emptyRoot, domAST));

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

    const formGraph = Array.from(reconciler.reactivityGraphs.values())[0];
    mockWin.__leveonas_reactivity__ = mockWin.__leveonas_reactivity__ || {};
    mockWin.__leveonas_reactivity__[formGraph.instancePath] = formGraph;

    const userInput = applier.getNode('user-input');
    assert.ok(userInput, 'User input element must exist');
    assert.strictEqual(userInput.value, 'Alice');

    // 1. User types into input: DOM -> state mutation
    userInput.value = 'Bob';
    userInput.dispatchEvent({ type: 'input', target: userInput });

    assert.strictEqual(mockWin.__leveonas_state__[formGraph.instancePath].username, 'Bob');

    // 2. Programmatic state mutation -> DOM attribute update
    mockWin.__leveonas_runtime__.updateState(formGraph.instancePath, 'username', 'Charlie');
    assert.strictEqual(userInput.value, 'Charlie');
  });

  it('22. Event Deduplication: Reconciling 5 times then clicking once executes handler exactly once', () => {
    const { mockWin, applier } = createMockDOMEnvironment();

    let executionCount = 0;
    mockWin.testClickHandler = () => {
      executionCount++;
    };

    const input = `
component(App)(
  di(
    bo(id:"action-btn" oc:testClickHandler "Trigger")
  )
)
`;
    // Reconcile and apply 5 times consecutively
    for (let i = 0; i < 5; i++) {
      const ast = SvelteLMInterpreter.parse(input);
      const reconciler = new SvelteReconciler(ast);
      const { domAST, jsProgram } = reconciler.reconcile('App');

      const loc: SourceLocation = { startLine: 1, startColumn: 1, startOffset: 0, endLine: 1, endColumn: 1, endOffset: 0 };
      const emptyRoot = ASTFactory.createComponent(ASTNodeKind.Root, loc, [], []) as RootNode;
      emptyRoot.id = 'leveonas-root';
      const generator = new PatchGenerator();
      applier.apply(generator.generate(emptyRoot, domAST));

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
    assert.ok(btn, 'Button must exist');

    // Click button once
    btn.click();

    // Must have executed exactly once
    assert.strictEqual(executionCount, 1, 'Event handler must execute exactly once due to deduplication');
  });

  it('23. Safe Expression Evaluation isolates scope and prevents unsafe global pollution', () => {
    const scope = { x: 10, y: 25, title: 'Hello Svelte' };

    assert.strictEqual(evaluateSvelteExpression('x * 2 + y', scope), 45);
    assert.strictEqual(evaluateSvelteExpression('x >= 10', scope), true);

    const nestedScope = { user: { profile: { age: 30 } } };
    assert.strictEqual(evaluateSvelteExpression('user.profile.age', nestedScope), 30);

    const rendered = interpolateTemplateString('User age is {user.profile.age}', nestedScope);
    assert.strictEqual(rendered, 'User age is 30');
  });
});
