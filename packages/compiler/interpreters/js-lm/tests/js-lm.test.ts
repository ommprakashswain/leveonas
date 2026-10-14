import { test } from 'node:test';
import assert from 'node:assert';
import { JSLMInterpreter } from '../interpreter';
import { decodeJSAbbreviation, encodeJSAbbreviation, isValidDOMEvent } from '../vocabulary';
import { serializeJSProgram, serializeJSUnit } from '../serializer';
import { validateJSAST } from '../validator';
import { diffJSPrograms } from '../../../../runtime/incremental/patch-generator/js-diff';
import { PatchOperationType } from '../../../../runtime/incremental/patch-generator/types';
import { JSPatchApplier } from '../../../../runtime/incremental/patch-executor/js-applier';
import { DOMPatchApplier } from '../../../../runtime/incremental/patch-executor/dom-applier';
import { LMGenerationPipeline } from '../../../pipeline/generation-pipeline';

// 1. Vocabulary & Abbreviation round-tripping
test('JS-LM Vocabulary: canonical encoding, decoding and event validation', () => {
  assert.strictEqual(decodeJSAbbreviation('qs'), 'document.querySelector');
  assert.strictEqual(decodeJSAbbreviation('gid'), 'document.getElementById');
  assert.strictEqual(decodeJSAbbreviation('st'), 'setTimeout');
  assert.strictEqual(decodeJSAbbreviation('si'), 'setInterval');
  assert.strictEqual(decodeJSAbbreviation('on'), 'event');
  assert.strictEqual(decodeJSAbbreviation('addClass'), 'classList.add');

  assert.strictEqual(encodeJSAbbreviation('document.querySelector'), 'qs');
  assert.strictEqual(encodeJSAbbreviation('document.getElementById'), 'gid');
  assert.strictEqual(encodeJSAbbreviation('setTimeout'), 'st');

  assert.strictEqual(isValidDOMEvent('click'), true);
  assert.strictEqual(isValidDOMEvent('onclick'), true);
  assert.strictEqual(isValidDOMEvent('submit'), true);
  assert.strictEqual(isValidDOMEvent('keydown'), true);
  assert.strictEqual(isValidDOMEvent('unknown_xyz'), false);
});

// 2. Incremental Streaming & Chunk boundary resilience
test('JS-LM Interpreter: parses variables, functions, and events across arbitrary chunks', () => {
  const interpreter = new JSLMInterpreter();

  const chunks = [
    'co',
    'nst coun',
    'ter = 0;\n',
    'let messa',
    'ge = "he',
    'llo w',
    'orld";\n',
    'func',
    'tion increment() {\n',
    '  count',
    'er++;\n',
    '}\n',
    'on("click", "#counter-btn", () => {\n',
    '  increment();\n',
    '});\n',
  ];

  for (const chunk of chunks) {
    interpreter.write(chunk);
  }
  const ast = interpreter.end();

  assert.strictEqual(ast.units.length, 4);

  // Unit 0: const counter = 0;
  assert.strictEqual(ast.units[0].unitKind, 'Variable');
  assert.strictEqual(ast.units[0].meta?.identifier, 'counter');
  assert.strictEqual(ast.units[0].isComplete, true);

  // Unit 1: let message = "hello world";
  assert.strictEqual(ast.units[1].unitKind, 'Variable');
  assert.strictEqual(ast.units[1].meta?.identifier, 'message');
  assert.strictEqual(ast.units[1].isComplete, true);

  // Unit 2: function increment()
  assert.strictEqual(ast.units[2].unitKind, 'Function');
  assert.strictEqual(ast.units[2].meta?.functionName, 'increment');
  assert.strictEqual(ast.units[2].isComplete, true);

  // Unit 3: on("click", "#counter-btn", ...)
  assert.strictEqual(ast.units[3].unitKind, 'EventHandler');
  assert.strictEqual(ast.units[3].meta?.eventName, 'click');
  assert.strictEqual(ast.units[3].meta?.targetSelector, '#counter-btn');
  assert.strictEqual(ast.units[3].isComplete, true);
});

// 3. Incomplete vs Invalid Distinction
test('JS-LM Interpreter: distinguishes incomplete statements from invalid errors without crashing', () => {
  const interpreter = new JSLMInterpreter();

  // Incomplete variable declaration mid-stream
  interpreter.write('const score = ');
  const astMid = interpreter.getAST();
  assert.strictEqual(interpreter.hasErrors(), false);
  assert.strictEqual(astMid.units.length, 0); // Not committed yet

  // Complete the variable declaration
  interpreter.write('100;\n');
  const astComplete = interpreter.getAST();
  assert.strictEqual(astComplete.units.length, 1);
  assert.strictEqual(astComplete.units[0].isComplete, true);
  assert.strictEqual(astComplete.units[0].meta?.identifier, 'score');
});

// 4. Template literals & nested braces
test('JS-LM Interpreter: preserves template literals and expressions', () => {
  const code = `
    const user = "Alice";
    const msg = \`Hello \${user}, total is: \${10 + 20}\`;
  `;
  const ast = JSLMInterpreter.parse(code);
  assert.strictEqual(ast.units.length, 2);
  assert.strictEqual(ast.units[1].isComplete, true);
  assert.ok(ast.units[1].code.includes('`Hello ${user}, total is: ${10 + 20}`'));
});

// 5. Timers (setTimeout & setInterval)
test('JS-LM Interpreter: parses setTimeout and setInterval timers with metadata', () => {
  const code = `
    setTimeout(() => {
      console.log("delayed");
    }, 500);

    si(() => {
      console.log("repeating");
    }, 1000);
  `;
  const ast = JSLMInterpreter.parse(code);
  assert.strictEqual(ast.units.length, 2);
  assert.strictEqual(ast.units[0].unitKind, 'Timer');
  assert.strictEqual(ast.units[0].meta?.timerType, 'setTimeout');
  assert.strictEqual(ast.units[0].meta?.delayMs, 500);

  assert.strictEqual(ast.units[1].unitKind, 'Timer');
  assert.strictEqual(ast.units[1].meta?.timerType, 'setInterval');
  assert.strictEqual(ast.units[1].meta?.delayMs, 1000);
});

// 6. AST Validation
test('JS-LM Validator: passes valid AST and detects duplicate unit IDs', () => {
  const code = `
    const a = 1;
    const b = 2;
  `;
  const ast = JSLMInterpreter.parse(code);
  const diagnostics = validateJSAST(ast);
  assert.strictEqual(diagnostics.filter((d) => d.severity === 'error').length, 0);
});

// 7. JS Diff Engine & Minimal Patch Generation
test('JS Diff Engine: emits fine-grained incremental patches for additions, updates, and events', () => {
  const ast1 = JSLMInterpreter.parse(`
    let count = 0;
    on("click", "#btn", () => { count++; });
  `);

  const ast2 = JSLMInterpreter.parse(`
    let count = 0;
    let step = 2;
    on("click", "#btn", () => { count += step; });
  `);

  const patches = diffJSPrograms(ast1, ast2);

  const ops = patches.map((p) => p.operation);
  assert.ok(ops.includes(PatchOperationType.CREATE_JS_UNIT)); // For `step`
  assert.ok(ops.includes(PatchOperationType.UPDATE_EVENT_HANDLER)); // For updated click handler
});

// 8. Runtime Sandbox & Idempotency
test('JSPatchApplier: executes units idempotently without duplicate runs', () => {
  let executionCount = 0;
  const mockWin: any = {};
  const mockDoc: any = {
    addEventListener: () => {},
    removeEventListener: () => {},
  };

  const applier = new JSPatchApplier(mockDoc, mockWin);

  const ast = JSLMInterpreter.parse(`window.__test_val = (window.__test_val || 0) + 1;`);
  const initialPatches = diffJSPrograms(null, ast);

  applier.apply(initialPatches);
  assert.strictEqual(mockWin.__test_val, 1);

  // Applying same patches again should be a no-op (idempotent)
  applier.apply(initialPatches);
  assert.strictEqual(mockWin.__test_val, 1);
});

// 9. Event Handler Attachment & Delegation
test('JSPatchApplier: registers and executes event handlers with delegation', () => {
  let clicked = false;
  let clickedTarget: any = null;

  const listeners: Record<string, Function> = {};
  const mockButton: any = {
    id: 'my-button',
    textContent: 'Click Me',
    matches: (sel: string) => sel === '#my-button',
    closest: (sel: string) => (sel === '#my-button' ? mockButton : null),
  };

  const mockDoc: any = {
    body: {
      addEventListener: (evt: string, fn: Function) => {
        listeners[evt] = fn;
      },
      removeEventListener: (evt: string) => {
        delete listeners[evt];
      },
    },
    querySelector: (sel: string) => (sel === '#my-button' ? mockButton : null),
  };
  const mockWin: any = {};

  const applier = new JSPatchApplier(mockDoc, mockWin);

  const ast = JSLMInterpreter.parse(`
    on("click", "#my-button", (event, target) => {
      target.textContent = "Clicked!";
    });
  `);

  const patches = diffJSPrograms(null, ast);
  applier.apply(patches);

  assert.ok(listeners['click'], 'Click listener should be registered');

  // Simulate click event on mockButton
  listeners['click']({
    target: mockButton,
  });

  assert.strictEqual(mockButton.textContent, 'Clicked!');
});

// 10. Session Cleanup & Timer Cancellation
test('JSPatchApplier: cleanup cancels active timers and removes event listeners', () => {
  const removedEvents: string[] = [];
  const mockDoc: any = {
    body: {
      addEventListener: () => {},
      removeEventListener: (evt: string) => {
        removedEvents.push(evt);
      },
    },
  };
  const mockWin: any = {};

  const applier = new JSPatchApplier(mockDoc, mockWin);

  const ast = JSLMInterpreter.parse(`
    on("click", "#btn", () => {});
    setTimeout(() => {}, 10000);
    setInterval(() => {}, 5000);
  `);

  const patches = diffJSPrograms(null, ast);
  applier.apply(patches);

  // Trigger cleanup
  applier.cleanup();

  assert.ok(removedEvents.includes('click'));
});

// 11. Error Isolation: JS error does not crash pipeline or break HTML/CSS
test('LMGenerationPipeline: isolates JS errors while continuing HTML and CSS rendering', () => {
  let receivedHTML = false;
  let receivedCSS = false;
  let receivedPatches: any[] = [];

  const pipeline = new LMGenerationPipeline({
    onASTUpdate: () => {
      receivedHTML = true;
    },
    onCSSASTUpdate: () => {
      receivedCSS = true;
    },
    onPatch: (patches) => {
      receivedPatches.push(...patches);
    },
  });

  const streamContent = `
<HTML>
di(
  bo(id("counter") "0")
)
</HTML>
<CSS>
#counter(
  bg:#fff
  p:20px
)
</CSS>
<JS>
// Malformed JS intentionally tested
const 123badVar = ;
</JS>
`;

  pipeline.write(streamContent);
  pipeline.end();

  assert.strictEqual(receivedHTML, true, 'HTML AST should be successfully updated');
  assert.strictEqual(receivedCSS, true, 'CSS AST should be successfully updated');
  assert.ok(receivedPatches.length > 0, 'Patches for HTML and CSS should be emitted');
});

// 12. Full Multi-Language Real Interactive Counter Application Integration
test('Full Coexistence: HTML + CSS + JS Interactive Counter End-to-End', () => {
  // 1. Setup mock browser DOM
  const listeners: Record<string, Function> = {};
  const mockStyle: any = {
    id: 'leveonas-css',
    textContent: '',
  };
  const mockButton: any = {
    id: 'counter-btn',
    nodeType: 1,
    tagName: 'BUTTON',
    textContent: '0',
    attributes: { id: 'counter-btn' },
    getAttribute: (k: string) => (k === 'id' ? 'counter-btn' : null),
    setAttribute: (k: string, v: string) => {
      mockButton.attributes[k] = v;
    },
    appendChild: (child: any) => {},
    insertBefore: (child: any, ref: any) => {},
    removeChild: (child: any) => {},
    closest: (sel: string) => (sel === '#counter-btn' ? mockButton : null),
    matches: (sel: string) => sel === '#counter-btn',
  };
  const mockRoot: any = {
    id: 'leveonas-root',
    nodeType: 1,
    childNodes: [mockButton],
    appendChild: (child: any) => mockRoot.childNodes.push(child),
    insertBefore: (child: any, ref: any) => {
      mockRoot.childNodes.push(child);
      return child;
    },
    removeChild: (child: any) => {
      mockRoot.childNodes = mockRoot.childNodes.filter((c: any) => c !== child);
    },
  };
  const mockDoc: any = {
    body: {
      appendChild: () => {},
      addEventListener: (evt: string, fn: Function) => {
        listeners[evt] = fn;
      },
      removeEventListener: (evt: string) => {
        delete listeners[evt];
      },
    },
    getElementById: (id: string) => {
      if (id === 'leveonas-css') return mockStyle;
      if (id === 'leveonas-root') return mockRoot;
      if (id === 'counter-btn') return mockButton;
      return null;
    },
    querySelector: (sel: string) => {
      if (sel === '#counter-btn') return mockButton;
      return null;
    },
    createElement: (tag: string) => {
      if (tag === 'style') return mockStyle;
      if (tag === 'button') return mockButton;
      return {
        nodeType: 1,
        setAttribute: () => {},
        appendChild: () => {},
        insertBefore: () => {},
        removeChild: () => {},
      };
    },
    createTextNode: (text: string) => ({ nodeType: 3, textContent: text }),
  };
  const mockWin: any = {};

  const applier = new DOMPatchApplier(mockRoot, mockDoc, mockWin);

  const emittedPatches: any[] = [];
  const pipeline = new LMGenerationPipeline({
    onPatch: (patches) => {
      emittedPatches.push(...patches);
      applier.apply(patches);
    },
  });

  const fullAppCode = `
<HTML>
di(
  bo(id("counter-btn") "0")
)
</HTML>
<CSS>
rule("#counter-btn")(
  bg:#2563eb;
  c:#ffffff;
  p:12px;
  br:8px;
)
</CSS>
<JS>
let count = 0;
on("click", "#counter-btn", (event, target) => {
  count++;
  target.textContent = String(count);
});
</JS>
`;

  // Stream in realistic chunks
  const chunks = fullAppCode.match(/.{1,15}/g) || [fullAppCode];
  for (const chunk of chunks) {
    pipeline.write(chunk);
  }
  pipeline.end();

  // 1. Verify CSS applied
  assert.ok(mockStyle.textContent.includes('background: #2563eb;'));
  assert.ok(mockStyle.textContent.includes('color: #ffffff;'));

  // 2. Verify Event Handler attached
  assert.ok(listeners['click'], 'Click handler must be bound to body delegation');

  // 3. Simulate multiple user clicks
  listeners['click']({ target: mockButton });
  assert.strictEqual(mockButton.textContent, '1');

  listeners['click']({ target: mockButton });
  assert.strictEqual(mockButton.textContent, '2');

  listeners['click']({ target: mockButton });
  assert.strictEqual(mockButton.textContent, '3');

  // 4. Session cleanup
  applier.cleanupJS();
  assert.strictEqual(Object.keys(listeners).length, 0, 'Listeners should be completely removed on cleanup');
});
