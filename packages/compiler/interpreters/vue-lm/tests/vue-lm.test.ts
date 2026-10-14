import { describe, it } from 'node:test';
import assert from 'node:assert';
import { VueLMInterpreter } from '../interpreter';
import { VueReconciler } from '../reconciler';
import { VueNodeKind } from '../ast';
import { VueLMValidator } from '../validator';
import { VueLMSerializer } from '../serializer';
import { ComponentNode } from '../../../ast/nodes';
import { LMGenerationPipeline } from '../../../pipeline/generation-pipeline';

describe('Vue-LM V1 Interpreter, Reconciler & End-to-End Pipeline', () => {
  it('1. Parses simple Vue component declaration with intrinsic elements', () => {
    const input = `
component(App)(
  di(id:"root" className:"main-app"
    h1("Welcome to Vue-LM")
    p("Ultra-compact declarative UI")
  )
)
`;
    const program = VueLMInterpreter.parse(input);
    assert.strictEqual(program.components.length, 1);
    const comp = program.components[0];
    assert.strictEqual(comp.name, 'App');
    assert.strictEqual(comp.body.length, 1);

    const rootDiv = comp.body[0];
    assert.strictEqual(rootDiv.kind, VueNodeKind.Element);
    if (rootDiv.kind === VueNodeKind.Element) {
      assert.strictEqual(rootDiv.tag, 'div');
      assert.strictEqual(rootDiv.children.length, 2);
    }
  });

  it('2. Supports compact vocabulary, element, and prop abbreviations', () => {
    const input = `
component(Toolbar)(
  so(cs:"toolbar flex gap-2"
    bo(tp:"button" dis:false "Save")
    bo(tp:"button" dis:true "Delete")
    an(hr:"/help" "Help")
  )
)
`;
    const program = VueLMInterpreter.parse(input);
    const comp = program.components[0];
    const section = comp.body[0];
    assert.strictEqual(section.kind, VueNodeKind.Element);
    if (section.kind === VueNodeKind.Element) {
      assert.strictEqual(section.tag, 'section');
      assert.strictEqual(section.children.length, 3);
      assert.strictEqual(section.children[0].kind, VueNodeKind.Element);
      assert.strictEqual((section.children[0] as any).tag, 'button');
    }
  });

  it('3. Parses reactive state and computed declarations inside components', () => {
    const input = `
component(Counter)(
  state(count, 0)
  state(step, 2)
  computed(double, count * 2)
  computed(nextVal, count + step)

  di(
    h1("Count: {count}")
    h2("Double: {double}")
  )
)
`;
    const program = VueLMInterpreter.parse(input);
    assert.strictEqual(program.components.length, 1);
    const comp = program.components[0];
    assert.strictEqual(comp.stateDeclarations.length, 2);
    assert.strictEqual(comp.stateDeclarations[0].name, 'count');
    assert.strictEqual(comp.stateDeclarations[0].initialValue, 0);
    assert.strictEqual(comp.stateDeclarations[1].name, 'step');
    assert.strictEqual(comp.stateDeclarations[1].initialValue, 2);

    assert.strictEqual(comp.computedDeclarations.length, 2);
    assert.strictEqual(comp.computedDeclarations[0].name, 'double');
    assert.strictEqual(comp.computedDeclarations[0].expression, 'count * 2');
    assert.strictEqual(comp.computedDeclarations[1].name, 'nextVal');
    assert.strictEqual(comp.computedDeclarations[1].expression, 'count + step');
  });

  it('4. Handles props with string, boolean, event, and v-model bindings', () => {
    const input = `
component(LoginForm)(
  state(username, "")
  fo(id:"login-form" className:"p-4 flex flex-col" @submit:handleSubmit
    in(id:"user-input" type:"text" model:username placeholder:"Username")
    bo(type:"submit" disabled:false "Log In")
  )
)
`;
    const program = VueLMInterpreter.parse(input);
    const comp = program.components[0];
    const form = comp.body[0];
    assert.strictEqual(form.kind, VueNodeKind.Element);
    if (form.kind === VueNodeKind.Element) {
      assert.strictEqual(form.tag, 'form');
      assert.strictEqual(form.props.length, 3);

      const submitProp = form.props.find((p) => p.name === 'submit' || p.name === 'onSubmit');
      assert.ok(submitProp);
      assert.strictEqual(submitProp?.isEvent, true);

      const inputElem = form.children[0];
      assert.strictEqual(inputElem.kind, VueNodeKind.Element);
      if (inputElem.kind === VueNodeKind.Element) {
        assert.strictEqual(inputElem.tag, 'input');
        assert.strictEqual(inputElem.modelBinding, 'username');
      }
    }
  });

  it('5. Supports Component Composition and Custom Instances', () => {
    const input = `
component(Card)(
  di(className:"card-box"
    h3("Card Title")
    p("Card Content")
  )
)

component(App)(
  di(className:"app-container"
    Card()
    Card()
  )
)
`;
    const program = VueLMInterpreter.parse(input);
    assert.strictEqual(program.components.length, 2);
    const appComp = program.components.find((c) => c.name === 'App');
    assert.ok(appComp);
    const appDiv = appComp!.body[0];
    if (appDiv.kind === VueNodeKind.Element) {
      assert.strictEqual(appDiv.children.length, 2);
      assert.strictEqual(appDiv.children[0].kind, VueNodeKind.ComponentInstance);
      assert.strictEqual(appDiv.children[1].kind, VueNodeKind.ComponentInstance);
    }
  });

  it('6. Supports Default Slots in Component Composition', () => {
    const input = `
component(Modal)(
  di(className:"modal-backdrop"
    di(className:"modal-dialog"
      slot()
    )
  )
)

component(App)(
  Modal(
    h2("Modal Title")
    p("Modal message body")
  )
)
`;
    const program = VueLMInterpreter.parse(input);
    const reconciler = new VueReconciler(program);
    const { domAST } = reconciler.reconcile('App');

    assert.ok(domAST);
    assert.strictEqual(domAST.children.length, 1); // modal-backdrop
    const backdrop = domAST.children[0] as ComponentNode;
    const dialog = backdrop.children[0] as ComponentNode;
    // Slot replaced by passed h2 and p
    assert.strictEqual(dialog.children.length, 2);
  });

  it('7. Reconciler lowers Vue Component Tree into Leveonas DOM AST and JS Programs', () => {
    const input = `
component(Button)(
  bo(className:"btn" @click:handleClick "Click Me")
)

component(App)(
  state(clicked, false)
  di(id:"root"
    h1("My Vue App")
    Button()
  )
)
`;
    const program = VueLMInterpreter.parse(input);
    const reconciler = new VueReconciler(program);
    const { domAST, jsProgram } = reconciler.reconcile();

    assert.ok(domAST);
    assert.ok(jsProgram);
    assert.strictEqual(domAST.children.length, 1); // #root div

    const rootDiv = domAST.children[0] as ComponentNode;
    const idProp = rootDiv.properties.find((p) => p.name === 'id');
    assert.strictEqual(idProp?.value?.value, 'root');
    // Button expanded inside rootDiv
    assert.strictEqual(rootDiv.children.length, 2); // h1 and button

    // Check JS Program has state declaration and event handlers
    assert.ok(jsProgram.units.length >= 1);
  });

  it('8. Incremental Streaming with Arbitrary Provider Chunks', () => {
    const chunks = [
      'comp',
      'onent(App)(\n',
      '  state(c',
      'ount, 0)\n',
      '  di(id:"con',
      'tainer"\n',
      '    h1("Vue ',
      'Stream")\n',
      '  )\n',
      ')',
    ];

    const interpreter = new VueLMInterpreter();
    for (const chunk of chunks) {
      interpreter.write(chunk);
    }
    const program = interpreter.end();

    assert.strictEqual(program.components.length, 1);
    assert.strictEqual(program.components[0].name, 'App');
    assert.strictEqual(program.components[0].stateDeclarations.length, 1);
    assert.strictEqual(program.components[0].stateDeclarations[0].name, 'count');

    const container = program.components[0].body[0];
    assert.strictEqual(container.kind, VueNodeKind.Element);
    if (container.kind === VueNodeKind.Element) {
      assert.strictEqual(container.props.find((p) => p.name === 'id')?.value, 'container');
    }
  });

  it('9. Serializer and Validator roundtrip with diagnostics', () => {
    const input = `
component(App)(
  state(theme, "dark")
  di(id:"app"
    h1("Vue Serializer")
  )
)
`;
    const program = VueLMInterpreter.parse(input);
    const diagnostics = VueLMValidator.validate(program);
    assert.strictEqual(diagnostics.length, 0);

    const json = VueLMSerializer.toJSON(program);
    const deserialized = VueLMSerializer.fromJSON(json);
    assert.strictEqual(deserialized.components.length, 1);
    assert.strictEqual(deserialized.components[0].name, 'App');
  });

  it('10. End-to-end Pipeline: Streaming <VUE> block emits minimal DOM & JS Patches', () => {
    const emittedPatches: any[] = [];
    const pipeline = new LMGenerationPipeline({
      onPatch: (patches) => {
        emittedPatches.push(...patches);
      },
    });

    const streamText = `
<VUE>
component(Counter)(
  state(count, 0)
  computed(double, count * 2)
  di(id:"counter-box" className:"p-4 border"
    h2("Counter: {count}")
    h3("Double: {double}")
    bo(id:"inc-btn" @click:increment "+1")
  )
)

component(App)(
  di(id:"app-root"
    Counter()
  )
)
</VUE>
`;

    pipeline.write(streamText);
    pipeline.end();

    assert.ok(emittedPatches.length > 0);
    const domPatches = emittedPatches.filter(
      (p) =>
        p.operation.includes('NODE') ||
        p.operation.includes('CHILD') ||
        p.operation.includes('TEXT') ||
        p.operation.includes('ATTRIBUTE')
    );
    const jsPatches = emittedPatches.filter(
      (p) => p.operation.includes('JS') || p.operation.includes('EVENT')
    );
    assert.ok(domPatches.length > 0, 'Should have emitted DOM patches');
    assert.ok(jsPatches.length > 0, 'Should have emitted JS patches');
  });

  it('11. Multi-Language Coexistence: <VUE>, <CSS>, and <TS> in same stream', () => {
    const emittedPatches: any[] = [];
    const pipeline = new LMGenerationPipeline({
      onPatch: (patches) => {
        emittedPatches.push(...patches);
      },
    });

    const multiStream = `
<CSS>
#app-root(
  bg:#111;
  c:#fff;
)
</CSS>

<TS>
interface UserState {
  name: string;
  role: string;
}
const defaultUser: UserState = { name: "VueUser", role: "Admin" };
</TS>

<VUE>
component(App)(
  di(id:"app-root"
    h1("Vue with CSS & TS")
    p("Role: Admin")
  )
)
</VUE>
`;

    pipeline.write(multiStream);
    pipeline.end();

    assert.ok(emittedPatches.length > 0);
    const cssPatches = emittedPatches.filter((p) => p.operation.includes('CSS'));
    const domPatches = emittedPatches.filter(
      (p) =>
        p.operation.includes('NODE') ||
        p.operation.includes('CHILD') ||
        p.operation.includes('TEXT') ||
        p.operation.includes('ATTRIBUTE')
    );
    const jsPatches = emittedPatches.filter(
      (p) => p.operation.includes('JS') || p.operation.includes('EVENT')
    );

    assert.ok(cssPatches.length > 0, 'Should have emitted CSS patches');
    assert.ok(domPatches.length > 0, 'Should have emitted DOM patches');
    assert.ok(jsPatches.length > 0, 'Should have emitted JS patches');
  });

  it('12. Real End-to-End Test: Header, Counter, and Footer subtree isolation', () => {
    const initialInput = `
component(Header)(
  he(id:"header"
    h1("Header Title")
  )
)

component(Counter)(
  state(count, 0)
  computed(double, count * 2)
  di(id:"counter"
    p("Count: {count}")
    p("Double: {double}")
    bo(id:"inc-btn" @click:increment "+1")
  )
)

component(Footer)(
  fe(id:"footer"
    p("Footer Text")
  )
)

component(App)(
  di(id:"app-container"
    Header()
    Counter()
    Footer()
  )
)
`;
    const program1 = VueLMInterpreter.parse(initialInput);
    const reconciler1 = new VueReconciler(program1);
    const { domAST: dom1 } = reconciler1.reconcile();

    const rootDiv1 = dom1.children[0] as ComponentNode;
    assert.strictEqual(rootDiv1.children.length, 3);
    const headerNode1 = rootDiv1.children[0] as ComponentNode;
    const counterNode1 = rootDiv1.children[1] as ComponentNode;
    const footerNode1 = rootDiv1.children[2] as ComponentNode;

    // Simulate state update count: 1
    const updatedInput = `
component(Header)(
  he(id:"header"
    h1("Header Title")
  )
)

component(Counter)(
  state(count, 1)
  computed(double, count * 2)
  di(id:"counter"
    p("Count: {count}")
    p("Double: {double}")
    bo(id:"inc-btn" @click:increment "+1")
  )
)

component(Footer)(
  fe(id:"footer"
    p("Footer Text")
  )
)

component(App)(
  di(id:"app-container"
    Header()
    Counter()
    Footer()
  )
)
`;
    const program2 = VueLMInterpreter.parse(updatedInput);
    const reconciler2 = new VueReconciler(program2);
    const { domAST: dom2 } = reconciler2.reconcile();

    const rootDiv2 = dom2.children[0] as ComponentNode;
    const headerNode2 = rootDiv2.children[0] as ComponentNode;
    const counterNode2 = rootDiv2.children[1] as ComponentNode;
    const footerNode2 = rootDiv2.children[2] as ComponentNode;

    // Header and Footer IDs and structures are preserved
    assert.strictEqual(headerNode1.id, headerNode2.id);
    assert.strictEqual(footerNode1.id, footerNode2.id);
    // Counter updated text interpolated
    const countText2 = counterNode2.children[0] as ComponentNode;
    assert.strictEqual(countText2.children[0].kind, 'Literal');
    assert.strictEqual((countText2.children[0] as any).value, 'Count: 1');
  });
});
