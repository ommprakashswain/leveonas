import { test } from 'node:test';
import assert from 'node:assert';
import { TSLMInterpreter } from '../interpreter';
import {
  decodeTSLM,
  expandTSTypeAbbreviation,
  isValidDOMEvent,
  TS_KEYWORD_ABBREVIATIONS,
  TS_TYPE_ABBREVIATIONS,
} from '../vocabulary';
import { lowerTSToJS, lowerTSUnit, convertTSProgramToJSProgram, convertTSToJSUnit } from '../lowering';
import { validateTSCode, validateTSProgram } from '../validator';
import { TSLMSerializer } from '../serializer';
import { diffJSPrograms } from '../../../../runtime/incremental/patch-generator/js-diff';
import { PatchOperationType } from '../../../../runtime/incremental/patch-generator/types';
import { JSPatchApplier } from '../../../../runtime/incremental/patch-executor/js-applier';
import { DOMPatchApplier } from '../../../../runtime/incremental/patch-executor/dom-applier';
import { LMGenerationPipeline } from '../../../pipeline/generation-pipeline';

// 1. TS-LM Vocabulary
test('1. TS-LM Vocabulary: type abbreviations, keyword expansions, and event validation', () => {
  assert.strictEqual(expandTSTypeAbbreviation('num'), 'number');
  assert.strictEqual(expandTSTypeAbbreviation('str'), 'string');
  assert.strictEqual(expandTSTypeAbbreviation('bool'), 'boolean');
  assert.strictEqual(expandTSTypeAbbreviation('arr'), 'Array');
  assert.strictEqual(expandTSTypeAbbreviation('unk'), 'unknown');
  assert.strictEqual(expandTSTypeAbbreviation('undef'), 'undefined');

  // Decode TS-LM keywords and types
  const decodedIface = decodeTSLM('iface User { name: str; age: num; }');
  assert.strictEqual(decodedIface, 'interface User { name: string; age: number; }');

  const decodedType = decodeTSLM('tp ID = str | num;');
  assert.strictEqual(decodedType, 'type ID = string | number;');

  const decodedFn = decodeTSLM('fn add(a: num, b: num): num { return a + b; }');
  assert.strictEqual(decodedFn, 'function add(a: number, b: number): number { return a + b; }');

  const decodedClass = decodeTSLM('cls Counter { count: num = 0; }');
  assert.strictEqual(decodedClass, 'class Counter { count: number = 0; }');

  assert.strictEqual(isValidDOMEvent('click'), true);
  assert.strictEqual(isValidDOMEvent('input'), true);
  assert.strictEqual(isValidDOMEvent('keydown'), true);
  assert.strictEqual(isValidDOMEvent('unknown_evt'), false);
});

// 2. Arbitrary chunk boundaries
test('2. Streaming Resilience: survives arbitrary provider chunk boundaries', () => {
  const interpreter = new TSLMInterpreter();

  const chunks = [
    '<TS>\n',
    'con',
    'st count:',
    'num =',
    ' 0;\n',
    'if',
    'ace State {\n',
    '  val',
    'ue: num;\n',
    '}\n',
    'f',
    'unc increment(x: num): num {\n',
    '  ret',
    'urn x + 1;\n',
    '}\n',
    '</TS>',
  ];

  for (const chunk of chunks) {
    interpreter.write(chunk);
  }
  const ast = interpreter.end();

  assert.strictEqual(ast.units.length, 3);
  assert.strictEqual(ast.units[0].unitKind, 'Variable');
  assert.strictEqual(ast.units[0].meta?.identifier, 'count');
  assert.strictEqual(ast.units[0].isComplete, true);

  assert.strictEqual(ast.units[1].unitKind, 'Interface');
  assert.strictEqual(ast.units[1].meta?.interfaceName, 'State');
  assert.strictEqual(ast.units[1].classification, 'TYPE_ONLY');
  assert.strictEqual(ast.units[1].isComplete, true);

  assert.strictEqual(ast.units[2].unitKind, 'Function');
  assert.strictEqual(ast.units[2].meta?.functionName, 'increment');
  assert.strictEqual(ast.units[2].classification, 'RUNTIME');
  assert.strictEqual(ast.units[2].isComplete, true);
});

// 3. Type annotations
test('3. Type annotations: parsed accurately and preserved in TS AST', () => {
  const code = 'const count: number = 42;';
  const ast = TSLMInterpreter.parse(code);

  assert.strictEqual(ast.units.length, 1);
  assert.strictEqual(ast.units[0].unitKind, 'Variable');
  assert.strictEqual(ast.units[0].meta?.identifier, 'count');
  assert.strictEqual(ast.units[0].details?.kind, 'TSVariableDeclaration');
  assert.strictEqual((ast.units[0].details as any).typeAnnotation, 'number');
});

// 4. Interfaces
test('4. Interfaces: parsed and marked as TYPE_ONLY', () => {
  const code = `
    interface UserProfile {
      id: string;
      age: number;
      isActive: boolean;
    }
  `;
  const ast = TSLMInterpreter.parse(code);

  assert.strictEqual(ast.units.length, 1);
  assert.strictEqual(ast.units[0].unitKind, 'Interface');
  assert.strictEqual(ast.units[0].classification, 'TYPE_ONLY');
  assert.strictEqual(ast.units[0].meta?.interfaceName, 'UserProfile');
  assert.strictEqual(ast.units[0].loweredCode, '');
});

// 5. Type aliases
test('5. Type aliases: parsed and marked as TYPE_ONLY', () => {
  const code = 'type StringOrNumber = string | number;';
  const ast = TSLMInterpreter.parse(code);

  assert.strictEqual(ast.units.length, 1);
  assert.strictEqual(ast.units[0].unitKind, 'TypeAlias');
  assert.strictEqual(ast.units[0].classification, 'TYPE_ONLY');
  assert.strictEqual(ast.units[0].meta?.typeName, 'StringOrNumber');
  assert.strictEqual(ast.units[0].loweredCode, '');
});

// 6. Function types
test('6. Function types: parameter types and return types parsed and stripped in lowering', () => {
  const code = 'function multiply(a: number, b: number): number { return a * b; }';
  const ast = TSLMInterpreter.parse(code);

  assert.strictEqual(ast.units.length, 1);
  assert.strictEqual(ast.units[0].unitKind, 'Function');
  assert.strictEqual(ast.units[0].meta?.functionName, 'multiply');
  assert.strictEqual(ast.units[0].classification, 'RUNTIME');

  const { loweredCode } = lowerTSUnit(ast.units[0]);
  assert.ok(!loweredCode.includes(': number'));
  assert.ok(loweredCode.includes('function multiply(a, b)'));
});

// 7. Generics
test('7. Generics: parsed at TS AST level and stripped in JS lowering', () => {
  const code = 'function first<T>(items: T[]): T { return items[0]; }';
  const ast = TSLMInterpreter.parse(code);

  assert.strictEqual(ast.units.length, 1);
  assert.strictEqual(ast.units[0].unitKind, 'Function');
  assert.strictEqual(ast.units[0].meta?.functionName, 'first');

  const { loweredCode } = lowerTSUnit(ast.units[0]);
  assert.ok(!loweredCode.includes('<T>'));
  assert.ok(!loweredCode.includes(': T'));
  assert.ok(loweredCode.includes('function first(items)'));
});

// 8. Union types & Literal types
test('8. Union types & Literal types: parsed and cleanly lowered', () => {
  const code = `let status: 'idle' | 'loading' | 'success' = 'idle';`;
  const ast = TSLMInterpreter.parse(code);

  assert.strictEqual(ast.units.length, 1);
  assert.strictEqual(ast.units[0].unitKind, 'Variable');

  const { loweredCode } = lowerTSUnit(ast.units[0]);
  assert.strictEqual(loweredCode.replace(/;$/, ''), `let status = 'idle'`);
});

// 9. Arrays & Object types
test('9. Arrays & Object types: parsed with type annotations', () => {
  const code = `
    const nums: number[] = [1, 2, 3];
    const user: { id: string; name: string } = { id: "u1", name: "Alice" };
  `;
  const ast = TSLMInterpreter.parse(code);

  assert.strictEqual(ast.units.length, 2);
  const lowered0 = lowerTSUnit(ast.units[0]).loweredCode;
  const lowered1 = lowerTSUnit(ast.units[1]).loweredCode;

  assert.strictEqual(lowered0.replace(/;$/, ''), 'const nums = [1, 2, 3]');
  assert.ok(lowered1.includes('const user = { id: "u1", name: "Alice" }'));
});

// 10. Optional properties & parameters
test('10. Optional properties and parameters: parsed accurately', () => {
  const code = `
    interface Config {
      timeout?: number;
      retries?: number;
    }
    function fetchData(url: string, retries?: number): void {
      console.log(url, retries);
    }
  `;
  const ast = TSLMInterpreter.parse(code);

  assert.strictEqual(ast.units.length, 2);
  assert.strictEqual(ast.units[0].classification, 'TYPE_ONLY');
  assert.strictEqual(ast.units[1].classification, 'RUNTIME');

  const loweredFn = lowerTSUnit(ast.units[1]).loweredCode;
  assert.ok(loweredFn.includes('function fetchData(url, retries)'));
});

// 11. Classes
test('11. Classes: lowers typed class to standard JavaScript class', () => {
  const code = `
    class Counter {
      count: number = 0;
      increment(): void {
        this.count++;
      }
    }
  `;
  const ast = TSLMInterpreter.parse(code);

  assert.strictEqual(ast.units.length, 1);
  assert.strictEqual(ast.units[0].unitKind, 'Class');
  assert.strictEqual(ast.units[0].classification, 'RUNTIME');

  const { loweredCode } = lowerTSUnit(ast.units[0]);
  assert.ok(loweredCode.includes('class Counter'));
  assert.ok(loweredCode.includes('count = 0'));
  assert.ok(loweredCode.includes('increment()'));
});

// 12. Enums
test('12. Enums: deterministic lowering into valid JavaScript', () => {
  const code = `
    enum Status {
      Idle,
      Loading,
      Done
    }
  `;
  const ast = TSLMInterpreter.parse(code);

  assert.strictEqual(ast.units.length, 1);
  assert.strictEqual(ast.units[0].unitKind, 'Enum');
  assert.strictEqual(ast.units[0].classification, 'RUNTIME');

  const { loweredCode } = lowerTSUnit(ast.units[0]);
  assert.ok(loweredCode.includes('Status'));
  assert.ok(loweredCode.includes('Status["Idle"] = 0') || loweredCode.includes('Status.Idle'));
});

// 13. Imports & Type-only imports
test('13. Imports: type-only imports erased, runtime external module imports warned', () => {
  const code = `
    import type { User } from './types';
    import { customLib } from 'https://external.com/lib.js';
  `;
  const interpreter = new TSLMInterpreter();
  interpreter.write(code);
  const ast = interpreter.end();

  assert.strictEqual(ast.units.length, 2);
  assert.strictEqual(ast.units[0].classification, 'TYPE_ONLY');
  assert.strictEqual(ast.units[0].loweredCode, '');

  assert.strictEqual(ast.units[1].classification, 'RUNTIME');
  const diagnostics = interpreter.getDiagnostics();
  assert.ok(diagnostics.some((d) => d.code === 'TS_IMPORT_SANDBOX'));
});

// 14. Exports
test('14. Exports: type-only exports erased, runtime exports lowered', () => {
  const code = `
    export type UserID = string;
    export const DEFAULT_TIMEOUT: number = 5000;
  `;
  const ast = TSLMInterpreter.parse(code);

  assert.strictEqual(ast.units.length, 2);
  assert.strictEqual(ast.units[0].classification, 'TYPE_ONLY');
  assert.strictEqual(ast.units[1].classification, 'RUNTIME');

  const lowered1 = lowerTSUnit(ast.units[1]).loweredCode;
  assert.ok(lowered1.includes('DEFAULT_TIMEOUT'));
  assert.ok(!lowered1.includes(': number'));
});

// 15. Type-only erasure from runtime output
test('15. Type-only erasure: interface and type aliases generate NO JS runtime patches', () => {
  const ast = TSLMInterpreter.parse(`
    interface State {
      count: number;
    }
    type Action = { type: string };
  `);

  const jsProg = convertTSProgramToJSProgram(ast);
  assert.strictEqual(jsProg.units.length, 0);

  const patches = diffJSPrograms(null, jsProg);
  assert.strictEqual(patches.length, 0);
});

// 16. TS -> JS Lowering & Determinism
test('16. TS -> JS Lowering: produces exact deterministic JavaScript output', () => {
  const tsCode = `
    const initial: number = 10;
    function add(a: number, b: number): number {
      return a + b;
    }
  `;

  const run1 = lowerTSToJS(tsCode);
  const run2 = lowerTSToJS(tsCode);

  assert.strictEqual(run1, run2);
  assert.ok(!run1.includes(': number'));
});

// 17. Incremental unit detection
test('17. Incremental unit detection: detects incomplete units vs completed units', () => {
  const interpreter = new TSLMInterpreter();

  interpreter.write('const x: number = ');
  const ast1 = interpreter.getAST();
  assert.strictEqual(ast1.units.length, 0); // Not committed yet

  interpreter.write('10;\n');
  const ast2 = interpreter.getAST();
  assert.strictEqual(ast2.units.length, 1);
  assert.strictEqual(ast2.units[0].isComplete, true);
});

// 18. Coexistence: HTML + CSS + JS + TS in single generation
test('18. Coexistence: HTML + CSS + JS + TS all coexist seamlessly', () => {
  let receivedHTML = false;
  let receivedCSS = false;
  let receivedJS = false;
  let receivedTS = false;
  const emittedPatches: any[] = [];

  const pipeline = new LMGenerationPipeline({
    onASTUpdate: () => {
      receivedHTML = true;
    },
    onCSSASTUpdate: () => {
      receivedCSS = true;
    },
    onJSASTUpdate: () => {
      receivedJS = true;
    },
    onTSASTUpdate: () => {
      receivedTS = true;
    },
    onPatch: (patches) => {
      emittedPatches.push(...patches);
    },
  });

  const fullProgram = `
<HTML>
di(
  bo(id("counter-btn") "0")
)
</HTML>
<CSS>
#counter-btn(
  bg:#2563eb
  c:#ffffff
  p:12px
)
</CSS>
<TS>
interface CounterState {
  count: number;
}
const state: CounterState = {
  count: 0
};
on("click", "#counter-btn", (event, target) => {
  state.count++;
  target.textContent = String(state.count);
});
</TS>
`;

  pipeline.write(fullProgram);
  pipeline.end();

  assert.strictEqual(receivedHTML, true, 'HTML should update');
  assert.strictEqual(receivedCSS, true, 'CSS should update');
  assert.strictEqual(receivedTS, true, 'TS should update');
  assert.strictEqual(receivedJS, true, 'JS should update from lowered TS');
  assert.ok(emittedPatches.length > 0, 'Patches must be emitted');
});

// 19. Error isolation
test('19. Error Isolation: invalid TypeScript does not crash HTML or CSS', () => {
  let receivedHTML = false;
  let receivedCSS = false;
  const emittedPatches: any[] = [];

  const pipeline = new LMGenerationPipeline({
    onASTUpdate: () => {
      receivedHTML = true;
    },
    onCSSASTUpdate: () => {
      receivedCSS = true;
    },
    onPatch: (patches) => {
      emittedPatches.push(...patches);
    },
  });

  const streamWithTSError = `
<HTML>
di(
  h1("Welcome")
)
</HTML>
<CSS>
h1(c:#ff0000)
</CSS>
<TS>
const 123InvalidSyntax = ;;;
</TS>
`;

  pipeline.write(streamWithTSError);
  pipeline.end();

  assert.strictEqual(receivedHTML, true);
  assert.strictEqual(receivedCSS, true);
  assert.ok(emittedPatches.length > 0);
});

// 20. Abort
test('20. Abort: cleanly terminates pipeline and releases resources', () => {
  const pipeline = new LMGenerationPipeline();
  pipeline.write('<HTML>di("test")</HTML>');
  pipeline.abort();

  assert.strictEqual(pipeline.getPreviousAST(), null);
});

// 21. Duplicate execution prevention & Idempotency
test('21. Duplicate execution prevention: repeated TS execution patches are idempotent in JSPatchApplier', () => {
  const mockWin: any = {};
  const mockDoc: any = {
    addEventListener: () => {},
    removeEventListener: () => {},
  };

  const applier = new JSPatchApplier(mockDoc, mockWin);

  const tsAst = TSLMInterpreter.parse(`
    let counter: number = 0;
    counter += 5;
  `);

  const jsProg = convertTSProgramToJSProgram(tsAst);
  const patches = diffJSPrograms(null, jsProg);

  applier.apply(patches);
  assert.strictEqual(mockWin.counter, 5);

  // Re-applying identical patches should NOT re-increment counter
  applier.apply(patches);
  assert.strictEqual(mockWin.counter, 5);
});

// 22. Real End-to-End Test (Counter Application with HTML + CSS + TS)
test('22. Real End-to-End Test: Typed Counter Application in Browser DOM Sandbox', () => {
  const listeners: Record<string, Function> = {};
  const mockStyle: any = { id: 'leveonas-css', textContent: '' };
  const mockButton: any = {
    id: 'counter',
    nodeType: 1,
    tagName: 'BUTTON',
    textContent: '0',
    attributes: { id: 'counter' },
    getAttribute: (k: string) => (k === 'id' ? 'counter' : null),
    setAttribute: (k: string, v: string) => {
      mockButton.attributes[k] = v;
    },
    appendChild: () => {},
    insertBefore: () => {},
    removeChild: () => {},
    closest: (sel: string) => (sel === '#counter' ? mockButton : null),
    matches: (sel: string) => sel === '#counter',
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
      if (id === 'counter') return mockButton;
      return null;
    },
    querySelector: (sel: string) => (sel === '#counter' ? mockButton : null),
    createElement: (tag: string) => (tag === 'style' ? mockStyle : mockButton),
    createTextNode: (text: string) => ({ nodeType: 3, textContent: text }),
  };
  const mockWin: any = {};

  const applier = new DOMPatchApplier(mockRoot, mockDoc, mockWin);

  const pipeline = new LMGenerationPipeline({
    onPatch: (patches) => {
      applier.apply(patches);
    },
  });

  const fullProgram = `
<HTML>
di(
  bo(id("counter") "0")
)
</HTML>
<CSS>
#counter(
  bg:#4f46e5;
  c:#ffffff;
  p:10px 20px;
  br:6px;
)
</CSS>
<TS>
interface CounterState {
  value: number;
}

const state: CounterState = {
  value: 0
};

on("click", "#counter", (event, target) => {
  state.value++;
  target.textContent = String(state.value);
});
</TS>
`;

  pipeline.write(fullProgram);
  pipeline.end();

  // 1. Verify CSS was applied
  assert.ok(mockStyle.textContent.includes('background: #4f46e5;'));

  // 2. Verify click listener registered on body delegation
  assert.ok(listeners['click'], 'Click listener must be registered');

  // 3. Trigger multiple clicks
  listeners['click']({ target: mockButton });
  assert.strictEqual(mockButton.textContent, '1');

  listeners['click']({ target: mockButton });
  assert.strictEqual(mockButton.textContent, '2');

  listeners['click']({ target: mockButton });
  assert.strictEqual(mockButton.textContent, '3');

  // 4. Verify cleanup removes listeners
  applier.cleanupJS();
  assert.strictEqual(Object.keys(listeners).length, 0);
});

// 23. Serializer & Debug string formatting
test('23. TSLMSerializer: serialization to JSON and debug summary string', () => {
  const ast = TSLMInterpreter.parse(`
    interface Config { debug: boolean; }
    const port: number = 8080;
  `);

  const json = TSLMSerializer.toJSON(ast);
  const deserialized = TSLMSerializer.fromJSON(json);
  assert.strictEqual(deserialized.units.length, 2);

  const debugStr = TSLMSerializer.toDebugString(ast);
  assert.ok(debugStr.includes('TSProgram'));
  assert.ok(debugStr.includes('TYPE_ONLY Interface'));
  assert.ok(debugStr.includes('RUNTIME Variable'));
});
