import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { Engine } from '../engine';
import { resolveEmitDebugText } from '../../../app/api/generate/config';
import { streamProviderChunks, ProviderStreamError } from '../../../app/api/generate/providers';
import { DOMPatchApplier } from '../../runtime/incremental/patch-executor/dom-applier';
import { PatchSerializer } from '../../runtime/incremental/patch-generator/serializer';
import { PatchOperationType, PatchOperation } from '../../runtime/incremental/patch-generator/types';
import { LMGenerationPipeline } from '../../compiler/pipeline/generation-pipeline';

// Minimal in-memory Mock DOM for headless testing
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

describe('Pre-Live Cleanup & Runtime Validation', () => {
  // Test 1: Tailwind CDN is not included in default iframe HTML
  test('1. Tailwind CDN is not included in default iframe HTML', () => {
    const srcdoc = Engine.buildIframeSrcdoc('/leveonas-runtime.js', 'https://example.com');
    assert.strictEqual(
      srcdoc.includes('cdn.tailwindcss.com'),
      false,
      'srcdoc must not load cdn.tailwindcss.com'
    );
    assert.strictEqual(
      srcdoc.includes('tailwindcss'),
      false,
      'srcdoc must not have external Tailwind CDN script'
    );
    assert.ok(
      srcdoc.includes('<script src="/leveonas-runtime.js"></script>'),
      'srcdoc must load Leveonas runtime script'
    );
    assert.ok(
      srcdoc.includes('<div id="leveonas-root" data-ast-id="leveonas-root"></div>'),
      'srcdoc must contain empty #leveonas-root mount point'
    );

    // Also verify bundled public/leveonas.js does not contain cdn.tailwindcss.com
    const publicBundle = fs.readFileSync(path.resolve(process.cwd(), 'public/leveonas.js'), 'utf-8');
    assert.strictEqual(
      publicBundle.includes('cdn.tailwindcss.com'),
      false,
      'public/leveonas.js bundle must not contain cdn.tailwindcss.com'
    );
  });

  // Test 2: sandbox remains allow-scripts without allow-same-origin
  test('2. Sandbox remains allow-scripts without allow-same-origin and documents opaque origin', () => {
    assert.strictEqual(
      Engine.DEFAULT_SANDBOX,
      'allow-scripts',
      'Engine DEFAULT_SANDBOX must be strictly allow-scripts'
    );
    assert.strictEqual(
      Engine.DEFAULT_SANDBOX.includes('allow-same-origin'),
      false,
      'Sandbox must NOT include allow-same-origin'
    );

    // Verify engine source documents opaque origin behavior
    const engineSource = fs.readFileSync(path.resolve(process.cwd(), 'packages/client/engine.ts'), 'utf-8');
    assert.ok(
      engineSource.includes('opaque origin'),
      'engine.ts must document opaque origin behavior'
    );
    assert.ok(
      engineSource.includes('event.source === window.parent'),
      'engine.ts must validate event.source === window.parent'
    );
  });

  // Test 3: emitDebugText defaults to false
  test('3. emitDebugText defaults to false in production and when omitted', () => {
    // Production: omitted defaults to false
    assert.strictEqual(
      resolveEmitDebugText(undefined, undefined, 'production'),
      false,
      'Omitted emitDebugText in production must be false'
    );

    // Production: even if LEVEONAS_EMIT_DEBUG_TEXT is "true", production defaults to false unless explicitly passed in body
    assert.strictEqual(
      resolveEmitDebugText(undefined, 'true', 'production'),
      false,
      'Production must default to false unless explicitly requested in body'
    );

    // Explicit false remains false
    assert.strictEqual(
      resolveEmitDebugText(false, 'true', 'production'),
      false,
      'Explicit false in body must be false'
    );

    // Explicit true in body enables it
    assert.strictEqual(
      resolveEmitDebugText(true, undefined, 'production'),
      true,
      'Explicit true in body enables debug text'
    );

    // Development without explicit setting defaults to false
    assert.strictEqual(
      resolveEmitDebugText(undefined, undefined, 'development'),
      false,
      'Omitted emitDebugText in dev defaults to false'
    );

    // Development with env flag enables it
    assert.strictEqual(
      resolveEmitDebugText(undefined, 'true', 'development'),
      true,
      'Env flag enables debug text in development'
    );
  });

  // Test 4: Patch events render without text events
  test('4. Patch events render completely without text events (patch-only rendering)', () => {
    const doc = new MockDOMDocument();
    const rootEl = doc.createElement('DIV');
    rootEl.setAttribute('id', 'leveonas-root');
    rootEl.setAttribute('data-ast-id', 'leveonas-root');

    const applier = new DOMPatchApplier(rootEl as any, doc as any);
    applier.registerNode('leveonas-root', rootEl as any);

    // Apply batch of patches without ANY text events using LMGenerationPipeline
    const pipeline = new LMGenerationPipeline({
      rootId: 'leveonas-root',
      onPatch: (patches) => {
        applier.apply(patches);
      },
      // Intentionally omitting onText to verify zero dependency on text events
    });

    pipeline.write('<HTML>\ndi(cs(card)\n  h1(Leveonas Live App)\n  p(Rendered strictly via AST patch stream.)\n)\n</HTML>');
    pipeline.end();

    // Verify DOM structure was created purely by patches
    const html = rootEl.toHTML();
    assert.ok(html.includes('<div class="card">'));
    assert.ok(html.includes('<h1>Leveonas Live App</h1>'));
    assert.ok(html.includes('<p>Rendered strictly via AST patch stream.</p>'));
  });

  // Test 5: Text events are optional debugging only and do not affect DOM in normal mode
  test('5. Text events are optional debugging only and do not drive normal DOM rendering', () => {
    let debugChunks: string[] = [];
    const onChunk = (chunk: string) => {
      debugChunks.push(chunk);
    };

    // Simulate pipeline producing text and patches
    let patchesReceived: PatchOperation[][] = [];
    const pipeline = new LMGenerationPipeline({
      rootId: 'leveonas-root',
      onPatch: (patches) => {
        patchesReceived.push(patches);
      },
      onText: (text) => {
        onChunk(text);
      },
    });

    pipeline.write('<HTML>(di(h1 "Heading"))');
    pipeline.end();

    assert.ok(patchesReceived.length > 0, 'Patches must be emitted');
    assert.ok(debugChunks.length > 0, 'Debug text emitted to onChunk callback');

    // DOMPatchApplier operates exclusively on patchesReceived, completely ignoring debugChunks
    const doc = new MockDOMDocument();
    const rootEl = doc.createElement('DIV');
    rootEl.setAttribute('id', 'leveonas-root');
    const applier = new DOMPatchApplier(rootEl as any, doc as any);
    applier.registerNode('leveonas-root', rootEl as any);

    for (const batch of patchesReceived) {
      applier.apply(batch);
    }

    assert.ok(rootEl.toHTML().includes('Heading'));
  });

  // Test 6: Verify first render starting from empty <div id="leveonas-root">
  test('6. First valid patch batch constructs initial HTML-LM tree from empty root', () => {
    const doc = new MockDOMDocument();
    const rootEl = doc.createElement('DIV');
    rootEl.setAttribute('id', 'leveonas-root');
    rootEl.setAttribute('data-ast-id', 'leveonas-root');
    assert.strictEqual(rootEl.childNodes.length, 0, 'Root must start empty');

    const applier = new DOMPatchApplier(rootEl as any, doc as any);
    applier.registerNode('leveonas-root', rootEl as any);

    let batchCount = 0;
    const pipeline = new LMGenerationPipeline({
      rootId: 'leveonas-root',
      onPatch: (patches) => {
        batchCount++;
        applier.apply(patches);
      },
    });

    // Write only the initial opening elements (not a complete document)
    pipeline.write('<HTML>\nmi(\n  bo(Click Me)\n');

    assert.ok(batchCount >= 1, 'At least one patch batch must be emitted on initial chunk');
    assert.strictEqual(rootEl.childNodes.length, 1);
    assert.ok(rootEl.toHTML().includes('<button>Click Me</button>'));
  });

  // Test 7: Verify abort flow: cancellation stops pipeline without reporting AbortError as failure
  test('7. Pipeline abort cancels stream cleanly without reporting AbortError as failure', () => {
    let errorReported: string | null = null;
    let patchesAfterAbort = 0;

    const pipeline = new LMGenerationPipeline({
      rootId: 'leveonas-root',
      onPatch: () => {
        patchesAfterAbort++;
      },
      onError: (err) => {
        errorReported = err.message;
      },
    });

    pipeline.write('<HTML>(di(p "Part 1"');
    // Abort pipeline mid-stream
    pipeline.abort();

    const countAtAbort = patchesAfterAbort;
    // Further writes after abort should not crash or emit
    pipeline.write(' "Part 2"))');
    pipeline.end();

    assert.strictEqual(errorReported, null, 'Normal abort must not trigger onError');
    assert.strictEqual(patchesAfterAbort, countAtAbort, 'No patches emitted after abort');
  });

  // Test 8: Provider parsing: malformed complete JSON produces ProviderStreamError
  test('8. Malformed complete provider JSON line produces ProviderStreamError', async () => {
    const encoder = new TextEncoder();
    const malformedBody = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode('data: {"choices": [{"delta": {broken json here\n\n'));
        controller.close();
      },
    });

    const mockResponse = new Response(malformedBody);

    await assert.rejects(
      async () => {
        for await (const _ of streamProviderChunks('openai', mockResponse)) {
          // should throw
        }
      },
      (err: any) => {
        assert.ok(err instanceof ProviderStreamError);
        assert.strictEqual(err.provider, 'openai');
        assert.strictEqual(err.stage, 'stream');
        assert.ok(err.reason.includes('stream parsing failed'));
        assert.ok(err.details && err.details.length > 0);
        return true;
      }
    );
  });

  // Test 9: Provider parsing: partial JSON split across chunks is buffered and handled correctly
  test('9. Partial JSON split across multiple chunks is correctly buffered until complete line', async () => {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        // First chunk has beginning of line
        controller.enqueue(encoder.encode('data: {"choices":[{"delta":{"content":"Hello'));
        // Second chunk has remainder and terminating newlines
        controller.enqueue(encoder.encode(' World"}}]}\n\n'));
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    const mockResponse = new Response(stream);
    const deltas: string[] = [];

    for await (const chunk of streamProviderChunks('openai', mockResponse)) {
      deltas.push(chunk);
    }

    assert.deepStrictEqual(deltas, ['Hello World']);
  });
});
