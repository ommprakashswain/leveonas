import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ReactLMInterpreter } from '../interpreter';
import { ReactReconciler } from '../reconciler';
import { ReactLMSerializer } from '../serializer';
import { ReactLMValidator } from '../validator';
import { ReactNodeKind } from '../ast';
import { ComponentNode } from '../../../ast/nodes';
import { LMGenerationPipeline } from '../../../pipeline/generation-pipeline';

describe('React-LM V1 Interpreter & Reconciler', () => {
  it('1. Parses simple component declaration with intrinsic elements', () => {
    const input = `
component(App)(
  di(
    h1("Welcome to Leveonas")
    p("Streamable React-LM engine")
  )
)
`;
    const program = ReactLMInterpreter.parse(input);
    assert.strictEqual(program.components.length, 1);
    assert.strictEqual(program.components[0].name, 'App');
    assert.strictEqual(program.components[0].body.length, 1);

    const rootElement = program.components[0].body[0];
    assert.strictEqual(rootElement.kind, ReactNodeKind.Element);
    if (rootElement.kind === ReactNodeKind.Element) {
      assert.strictEqual(rootElement.tag, 'div');
      assert.strictEqual(rootElement.children.length, 2);
    }
  });

  it('2. Supports compact vocabulary and tag abbreviations', () => {
    const input = `
component(HeaderNav)(
  he(
    nav(
      a(href:"/home" "Home")
      a(href:"/about" "About")
      bo(onClick:handleToggle "Menu")
    )
  )
)
`;
    const program = ReactLMInterpreter.parse(input);
    assert.strictEqual(program.components.length, 1);
    const root = program.components[0].body[0];
    assert.strictEqual(root.kind, ReactNodeKind.Element);
    if (root.kind === ReactNodeKind.Element) {
      assert.strictEqual(root.tag, 'header');
      assert.strictEqual(root.children.length, 1);
      const nav = root.children[0];
      if (nav.kind === ReactNodeKind.Element) {
        assert.strictEqual(nav.tag, 'nav');
        assert.strictEqual(nav.children.length, 3);
      }
    }
  });

  it('3. Parses state declarations inside components', () => {
    const input = `
component(Counter)(
  state(count, 0)
  state(isOpen, false)
  di(
    h2("Counter: {count}")
    bo(onClick:handleIncrement "+1")
  )
)
`;
    const program = ReactLMInterpreter.parse(input);
    assert.strictEqual(program.components.length, 1);
    const comp = program.components[0];
    assert.strictEqual(comp.stateDeclarations.length, 2);
    assert.strictEqual(comp.stateDeclarations[0].name, 'count');
    assert.strictEqual(comp.stateDeclarations[0].initialValue, 0);
    assert.strictEqual(comp.stateDeclarations[1].name, 'isOpen');
    assert.strictEqual(comp.stateDeclarations[1].initialValue, false);
  });

  it('4. Handles props with string, boolean, and event values', () => {
    const input = `
component(InputForm)(
  fo(id:"main-form" className:"flex gap-2" onSubmit:handleSubmit
    in(type:"text" placeholder:"Enter name" disabled:false)
    bo(type:"submit" disabled:true "Submit")
  )
)
`;
    const program = ReactLMInterpreter.parse(input);
    const comp = program.components[0];
    const form = comp.body[0];
    assert.strictEqual(form.kind, ReactNodeKind.Element);
    if (form.kind === ReactNodeKind.Element) {
      assert.strictEqual(form.tag, 'form');
      assert.strictEqual(form.props.length, 3);
      const idProp = form.props.find((p) => p.name === 'id');
      const classProp = form.props.find((p) => p.name === 'className');
      const submitProp = form.props.find((p) => p.name === 'onSubmit');
      assert.strictEqual(idProp?.value, 'main-form');
      assert.strictEqual(classProp?.value, 'flex gap-2');
      assert.strictEqual(submitProp?.value, 'handleSubmit');
      assert.strictEqual(submitProp?.isEvent, true);
    }
  });

  it('5. Supports Component Composition and Custom Instances', () => {
    const input = `
component(Card)(
  di(className:"card"
    h3("Card Title")
    p("Card Content")
  )
)

component(App)(
  di(className:"app"
    Card()
    Card()
  )
)
`;
    const program = ReactLMInterpreter.parse(input);
    assert.strictEqual(program.components.length, 2);
    const appComp = program.components.find((c) => c.name === 'App');
    assert.ok(appComp);
    const appDiv = appComp!.body[0];
    if (appDiv.kind === ReactNodeKind.Element) {
      assert.strictEqual(appDiv.children.length, 2);
      assert.strictEqual(appDiv.children[0].kind, ReactNodeKind.ComponentInstance);
      assert.strictEqual(appDiv.children[1].kind, ReactNodeKind.ComponentInstance);
    }
  });

  it('6. Reconciler lowers Component Tree into Leveonas DOM AST and JS Programs', () => {
    const input = `
component(Button)(
  bo(className:"btn" onClick:handleClick "Click Me")
)

component(App)(
  state(clicked, false)
  di(id:"root"
    h1("My React App")
    Button()
  )
)
`;
    const program = ReactLMInterpreter.parse(input);
    const reconciler = new ReactReconciler(program);
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

  it('7. Incremental Streaming with Arbitrary Provider Chunks', () => {
    const chunks = [
      'comp',
      'onent(App)(\n',
      '  state(c',
      'ount, 0)\n',
      '  di(id:"con',
      'tainer"\n',
      '    h1("Str',
      'eam',
      'ing React")\n',
      '    bo(onClick:handleInc "+1")\n',
      '  )\n',
      ')',
    ];

    const interpreter = new ReactLMInterpreter();
    for (const chunk of chunks) {
      interpreter.write(chunk);
    }
    const program = interpreter.end();

    assert.strictEqual(program.components.length, 1);
    assert.strictEqual(program.components[0].name, 'App');
    assert.strictEqual(program.components[0].stateDeclarations.length, 1);
    assert.strictEqual(program.components[0].stateDeclarations[0].name, 'count');
    const rootEl = program.components[0].body[0];
    if (rootEl.kind === ReactNodeKind.Element) {
      assert.strictEqual(rootEl.props.find((p) => p.name === 'id')?.value, 'container');
    }
  });

  it('8. Serializer and Validator roundtrip', () => {
    const input = `
component(App)(
  di(h1("Test Valid"))
)
`;
    const program = ReactLMInterpreter.parse(input);
    const validation = ReactLMValidator.validate(program);
    assert.strictEqual(validation.isValid, true);

    const json = ReactLMSerializer.toJSON(program);
    const deserialized = ReactLMSerializer.fromJSON(json);
    assert.strictEqual(deserialized.components.length, 1);
    assert.strictEqual(deserialized.components[0].name, 'App');
  });

  it('9. End-to-end Pipeline: Streaming <REACT> block emits minimal DOM & JS Patches', () => {
    const emittedPatches: any[] = [];
    const pipeline = new LMGenerationPipeline({
      onPatch: (patches) => {
        emittedPatches.push(...patches);
      },
    });

    const streamText = `
<REACT>
component(Counter)(
  state(count, 0)
  di(id:"counter-box" className:"p-4 border"
    h2("Counter: {count}")
    bo(id:"inc-btn" onClick:increment "+1")
  )
)

component(App)(
  di(id:"app-root"
    Counter()
  )
)
</REACT>
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

  it('10. Multi-Language Coexistence: <REACT>, <CSS>, and <TS> in same stream', () => {
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
  score: number;
}
const defaultUser: UserState = { name: "Player1", score: 100 };
</TS>

<REACT>
component(App)(
  di(id:"app-root"
    h1("React with CSS & TS")
    p("Score: 100")
  )
)
</REACT>
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
    assert.ok(jsPatches.length > 0, 'Should have emitted JS patches from lowered TS & React');
  });
});
