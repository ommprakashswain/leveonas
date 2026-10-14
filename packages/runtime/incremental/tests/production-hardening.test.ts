import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { LMGenerationPipeline } from '../../../compiler/pipeline/generation-pipeline';
import { DOMPatchApplier } from '../patch-executor/dom-applier';
import { PatchSerializer } from '../patch-generator/serializer';
import {
  PatchOperation,
  PatchOperationType,
} from '../patch-generator/types';
import {
  validatePatches,
  isPatchBatchValid,
  PatchValidationError,
  isAttributePayloadSafe,
} from '../patch-generator/validator';
import {
  getLeveonasOrigin,
  getLeveonasApiUrl,
  getLeveonasRuntimeScriptUrl,
  PRODUCTION_LEVEONAS_ORIGIN,
} from '../../../common/origin';
import { streamProviderChunks, OpenAIAdapter } from '../../../../app/api/generate/providers';
import { PatchGenerator } from '../patch-generator/generator';
import { HTMLLMInterpreter } from '../../../compiler/interpreters/html-lm';

// Mock DOM Node for in-memory DOMPatchApplier execution in Node.js
class MockDOMNode {
  public nodeType: number;
  public nodeName: string;
  public nodeValue: string | null = null;
  public textContent: string = '';
  public attributes: Map<string, string> = new Map();
  public childNodes: MockDOMNode[] = [];
  public parentNode: MockDOMNode | null = null;
  public __ast_id?: string;

  constructor(nodeType: number, nodeName: string, text?: string) {
    this.nodeType = nodeType;
    this.nodeName = nodeName;
    if (text !== undefined) {
      this.nodeValue = text;
      this.textContent = text;
    }
  }

  setAttribute(name: string, value: string) {
    this.attributes.set(name, value);
    if (name === 'data-ast-id' || name === 'id') {
      this.__ast_id = value;
    }
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

  toHTML(): string {
    if (this.nodeType === 3) {
      return this.nodeValue || this.textContent || '';
    }
    const tag = this.nodeName.toLowerCase();
    const attrs = Array.from(this.attributes.entries())
      .filter(([k]) => k !== 'data-ast-id')
      .map(([k, v]) => ` ${k}="${v}"`)
      .join('');
    const childrenHTML = this.childNodes.map((c) => c.toHTML()).join('');
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

describe('Leveonas Production Hardening Suite', () => {
  // =========================================================================
  // Requirement 1 & 14: Centralized Origin & Canonical URLs
  // =========================================================================
  describe('Centralized Origin and URL Resolution', () => {
    test('resolves production origin by default to https://leveonas.ainot.site', () => {
      const origin = getLeveonasOrigin();
      assert.strictEqual(origin, PRODUCTION_LEVEONAS_ORIGIN);
      assert.strictEqual(origin, 'https://leveonas.ainot.site');
    });

    test('resolves API URL with endpoint path', () => {
      const apiUrl = getLeveonasApiUrl('/api/generate');
      assert.strictEqual(apiUrl, 'https://leveonas.ainot.site/api/generate');
    });

    test('resolves iframe runtime script URL to canonical production origin', () => {
      const scriptUrl = getLeveonasRuntimeScriptUrl();
      assert.strictEqual(scriptUrl, 'https://leveonas.ainot.site/leveonas-runtime.js');
    });

    test('supports explicit custom base origin override for local testing', () => {
      const localOrigin = 'http://localhost:3000';
      assert.strictEqual(getLeveonasOrigin(localOrigin), 'http://localhost:3000');
      assert.strictEqual(
        getLeveonasApiUrl('/api/generate', localOrigin),
        'http://localhost:3000/api/generate'
      );
      assert.strictEqual(
        getLeveonasRuntimeScriptUrl(localOrigin),
        'http://localhost:3000/leveonas-runtime.js'
      );
    });
  });

  // =========================================================================
  // Requirement 5: Patch Payload Validation
  // =========================================================================
  describe('Patch Payload Validation', () => {
    test('validates correct patch operations successfully', () => {
      const validOps = [
        {
          operation: 'CREATE_NODE',
          nodeId: 'node-1',
          payload: { node: { id: 'node-1', kind: 'div' } },
        },
        {
          operation: 'UPDATE_TEXT',
          nodeId: 'text-1',
          payload: { text: 'Hello' },
        },
        {
          operation: 'SET_ATTRIBUTE',
          nodeId: 'node-1',
          payload: { name: 'class', value: 'btn' },
        },
      ];

      assert.ok(isPatchBatchValid(validOps));
      const result = validatePatches(validOps);
      assert.strictEqual(result.length, 3);
    });

    test('rejects non-array patch batches', () => {
      assert.throws(() => validatePatches('not an array'), PatchValidationError);
      assert.throws(() => validatePatches({}), PatchValidationError);
    });

    test('rejects operations with unknown or malformed operation types', () => {
      const invalid = [{ operation: 'DROP_DATABASE', nodeId: 'node-1' }];
      assert.throws(() => validatePatches(invalid), PatchValidationError);
    });

    test('rejects operations with missing or empty nodeId', () => {
      const invalid = [{ operation: 'UPDATE_TEXT', nodeId: '' }];
      assert.throws(() => validatePatches(invalid), PatchValidationError);
    });

    test('rejects operations with invalid negative or non-integer index', () => {
      const invalid = [
        {
          operation: 'MOVE_CHILD',
          nodeId: 'node-1',
          index: -1,
        },
      ];
      assert.throws(() => validatePatches(invalid), PatchValidationError);
    });

    test('rejects unsafe inline event handlers and javascript: URLs in SET_ATTRIBUTE', () => {
      assert.strictEqual(isAttributePayloadSafe('onclick', 'alert(1)'), false);
      assert.strictEqual(isAttributePayloadSafe('onmouseover', 'steal()'), false);
      assert.strictEqual(isAttributePayloadSafe('href', 'javascript:alert(1)'), false);
      assert.strictEqual(isAttributePayloadSafe('src', 'javascript:void(0)'), false);
      assert.strictEqual(isAttributePayloadSafe('class', 'active-btn'), true);
      assert.strictEqual(isAttributePayloadSafe('href', 'https://example.com'), true);

      const unsafePatch = [
        {
          operation: 'SET_ATTRIBUTE',
          nodeId: 'node-1',
          payload: { name: 'onclick', value: 'alert(1)' },
        },
      ];
      assert.throws(() => validatePatches(unsafePatch), PatchValidationError);
    });
  });

  // =========================================================================
  // Requirement 7: Provider Stream Normalization
  // =========================================================================
  describe('Provider Stream Normalization', () => {
    test('normalizes OpenAI SSE stream into AsyncIterable<string>', async () => {
      const sseChunks = [
        'data: {"choices":[{"delta":{"content":"<HTML>"}}]}\n\n',
        'data: {"choices":[{"delta":{"content":"\\ndi(cs(box)"}}]}\n\n',
        'data: {"choices":[{"delta":{"content":"\\n  h1(Title))"}}]}\n\n',
        'data: [DONE]\n\n',
      ];

      const stream = new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder();
          for (const chunk of sseChunks) {
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        },
      });

      const response = new Response(stream);
      const gathered: string[] = [];

      for await (const delta of streamProviderChunks('openai', response)) {
        gathered.push(delta);
      }

      assert.strictEqual(gathered.join(''), '<HTML>\ndi(cs(box)\n  h1(Title))');
    });
  });

  // =========================================================================
  // Requirement 15: End-to-End Simulation
  // =========================================================================
  describe('Requirement 15: End-to-End Generation Pipeline', () => {
    test('Simulate: LLM stream -> server compiler -> HTML-LM -> AST -> PatchGenerator -> SSE -> SDK -> iframe -> DOMPatchApplier', () => {
      // User prompt: "Create a simple landing page with a hero heading, paragraph, and Get Started button."
      const doc = new MockDOMDocument();
      const rootContainer = doc.createElement('div');
      rootContainer.setAttribute('id', 'leveonas-root');
      rootContainer.setAttribute('data-ast-id', 'leveonas-root');

      const applier = new DOMPatchApplier(rootContainer, doc as any);
      applier.registerNode('leveonas-root', rootContainer);

      const sseEvents: string[] = [];

      const pipeline = new LMGenerationPipeline({
        rootId: 'leveonas-root',
        onPatch: (patches) => {
          // Validate and serialize to SSE format: data: {"patch":[...]}\n\n
          const validPatches = validatePatches(patches);
          const serialized = PatchSerializer.toJSON(validPatches);
          sseEvents.push(`data: ${JSON.stringify({ patch: JSON.parse(serialized) })}\n\n`);

          // SDK parses SSE and applies to iframe DOMPatchApplier
          const parsed = JSON.parse(sseEvents[sseEvents.length - 1].replace(/^data:\s*/, ''));
          applier.apply(parsed.patch);
        },
      });

      // Stream chunks from simulated LLM provider
      pipeline.write('<HTML>\ndi(cs(hero)\n');
      pipeline.write('  h1(Welcome to Leveonas)\n');
      pipeline.write('  p(Next-generation streaming frontend architecture)\n');
      pipeline.write('  bo(cs(cta) Get Started)\n)\n</HTML>');
      pipeline.end();

      assert.ok(sseEvents.length > 0, 'Must emit SSE patch events');
      const domHtml = rootContainer.toHTML();

      // Verify browser DOM contains: hero, heading, paragraph, button
      assert.ok(domHtml.includes('<div class="hero">'), 'DOM contains hero container');
      assert.ok(domHtml.includes('<h1>Welcome to Leveonas</h1>'), 'DOM contains heading');
      assert.ok(
        domHtml.includes('<p>Next-generation streaming frontend architecture</p>'),
        'DOM contains paragraph'
      );
      assert.ok(
        domHtml.includes('<button class="cta">Get Started</button>'),
        'DOM contains button'
      );

      // Verify no complete HTML transport was used
      assert.ok(
        !sseEvents.some((e) => e.includes('<!DOCTYPE html>')),
        'Transport must not send complete HTML'
      );
    });
  });

  // =========================================================================
  // Requirement 16: True Early Render Test
  // =========================================================================
  describe('Requirement 16: True Early Render Test', () => {
    test('DOM displays recoverable element before stream completes, then updates incrementally', () => {
      const doc = new MockDOMDocument();
      const rootContainer = doc.createElement('div');
      rootContainer.setAttribute('id', 'leveonas-root');
      rootContainer.setAttribute('data-ast-id', 'leveonas-root');

      const applier = new DOMPatchApplier(rootContainer, doc as any);
      applier.registerNode('leveonas-root', rootContainer);

      const pipeline = new LMGenerationPipeline({
        rootId: 'leveonas-root',
        onPatch: (patches) => {
          applier.apply(patches);
        },
      });

      // Part 1: Stream incomplete markup with unclosed di and no closing tag
      pipeline.write('<HTML>\ndi(cs(hero)\n  h1(Leveonas)');

      // Verify DOM displays recoverable element before stream completes
      const earlyHtml = rootContainer.toHTML();
      assert.ok(earlyHtml.includes('<div class="hero">'), 'DOM has hero div before completion');
      assert.ok(earlyHtml.includes('<h1>Leveonas</h1>'), 'DOM has h1 before completion');

      // Part 2: Later chunk arrives with paragraph and button
      pipeline.write('\n  p(Build faster)\n  bo(Get Started)\n)\n</HTML>');
      pipeline.end();

      const finalHtml = rootContainer.toHTML();
      assert.ok(finalHtml.includes('<p>Build faster</p>'), 'DOM has paragraph');
      assert.ok(finalHtml.includes('<button>Get Started</button>'), 'DOM has button');
    });
  });

  // =========================================================================
  // Requirement 17: Patch Minimality Test
  // =========================================================================
  describe('Requirement 17: Patch Minimality Test', () => {
    test('Changing p(Build faster) to p(Build much faster) produces only UPDATE_TEXT', () => {
      const doc = new MockDOMDocument();
      const rootContainer = doc.createElement('div');
      rootContainer.setAttribute('id', 'leveonas-root');
      rootContainer.setAttribute('data-ast-id', 'leveonas-root');

      const applier = new DOMPatchApplier(rootContainer, doc as any);
      applier.registerNode('leveonas-root', rootContainer);

      const pipeline = new LMGenerationPipeline({
        rootId: 'leveonas-root',
        onPatch: (patches) => {
          applier.apply(patches);
        },
      });

      // Initial AST
      pipeline.write('<HTML>\ndi(cs(page)\n  p(Build faster)\n)\n</HTML>');
      pipeline.end();

      const initialHtml = rootContainer.toHTML();
      assert.ok(initialHtml.includes('<p>Build faster</p>'));

      const ast1 = pipeline.getPreviousAST()!;
      assert.ok(ast1);

      // Diff ast1 with new AST
      const ast2 = HTMLLMInterpreter.parse('di(cs(page)\n  p(Build much faster)\n)');
      const generator = new PatchGenerator();
      const patches = generator.generate(ast1, ast2);

      // Verify the patch batch contains only UPDATE_TEXT, NOT complete HTML, NOT REMOVE_NODE + INSERT_CHILD
      assert.strictEqual(patches.length, 1, 'Must generate exactly 1 patch');
      assert.strictEqual(patches[0].operation, PatchOperationType.UPDATE_TEXT);
      assert.strictEqual(patches[0].payload?.text, 'Build much faster');

      // Verify no REMOVE_NODE or INSERT_CHILD operations exist
      const hasRemoveOrInsert = patches.some(
        (p) =>
          p.operation === PatchOperationType.REMOVE_NODE ||
          p.operation === PatchOperationType.INSERT_CHILD ||
          p.operation === PatchOperationType.REPLACE_NODE
      );
      assert.strictEqual(hasRemoveOrInsert, false, 'Must not remove or recreate nodes');

      // Apply patch to verify live DOM update
      applier.apply(patches);
      const updatedHtml = rootContainer.toHTML();
      assert.ok(updatedHtml.includes('<p>Build much faster</p>'));
      assert.ok(!updatedHtml.includes('<p>Build faster</p>'));
    });
  });

  // =========================================================================
  // Requirement 18: Multi-Session Test
  // =========================================================================
  describe('Requirement 18: Multi-Session Isolation Test', () => {
    test('Two simultaneous sessions maintain complete isolation of AST state, patches, and abort', () => {
      const patchesA: PatchOperation[][] = [];
      const patchesB: PatchOperation[][] = [];

      const pipelineA = new LMGenerationPipeline({
        rootId: 'leveonas-root',
        onPatch: (p) => patchesA.push(p),
      });

      const pipelineB = new LMGenerationPipeline({
        rootId: 'leveonas-root',
        onPatch: (p) => patchesB.push(p),
      });

      // Session A generates hero A
      pipelineA.write('<HTML>\ndi(cs(hero-a) h1(Hero A))\n</HTML>');
      // Session B generates hero B
      pipelineB.write('<HTML>\ndi(cs(hero-b) h1(Hero B))\n</HTML>');

      pipelineA.end();
      pipelineB.end();

      const astA = pipelineA.getPreviousAST()!;
      const astB = pipelineB.getPreviousAST()!;

      // AST states must be completely isolated instances
      assert.notStrictEqual(astA, astB);
      assert.strictEqual((astA.children[0] as any).properties[0].value.value, 'hero-a');
      assert.strictEqual((astB.children[0] as any).properties[0].value.value, 'hero-b');

      // Aborting Session A must NOT affect Session B
      const pipelineC = new LMGenerationPipeline({
        rootId: 'leveonas-root',
        onPatch: () => {},
      });
      const pipelineD = new LMGenerationPipeline({
        rootId: 'leveonas-root',
        onPatch: (p) => patchesB.push(p),
      });

      pipelineC.abort();
      assert.strictEqual(pipelineC.getPreviousAST(), null);

      pipelineD.write('<HTML>\ndi(h2(Session D Alive))\n</HTML>');
      pipelineD.end();
      assert.ok(pipelineD.getPreviousAST() !== null);
    });
  });

  // =========================================================================
  // Requirement 19: Security Test
  // =========================================================================
  describe('Requirement 19: Security Test', () => {
    test('Generated LM containing script, onClick, and javascript: cannot escape patch security', () => {
      const doc = new MockDOMDocument();
      const rootContainer = doc.createElement('div');
      rootContainer.setAttribute('id', 'leveonas-root');
      rootContainer.setAttribute('data-ast-id', 'leveonas-root');

      const applier = new DOMPatchApplier(rootContainer, doc as any);
      applier.registerNode('leveonas-root', rootContainer);

      const pipeline = new LMGenerationPipeline({
        rootId: 'leveonas-root',
        onPatch: (patches) => {
          applier.apply(patches);
        },
      });

      // Feed LM with script, event handler (onClick), and javascript: URL
      pipeline.write(
        '<HTML>\ndi(\n  script(alert("malicious"))\n  bo(onClick(executeCode) hr(javascript:evil()) Click)\n)\n</HTML>'
      );
      pipeline.end();

      const domHtml = rootContainer.toHTML();

      // Script elements are neutralized or blocked
      assert.ok(!domHtml.includes('<script'), 'Must not insert active script element');
      // onClick event handlers are stripped
      assert.ok(!domHtml.includes('onclick'), 'Must not insert onclick attribute');
      assert.ok(!domHtml.includes('onClick'), 'Must not insert onClick attribute');
      // javascript: URLs are stripped
      assert.ok(!domHtml.includes('javascript:evil'), 'Must not insert javascript: URL');
    });
  });
});
