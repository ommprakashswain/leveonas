import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { LMGenerationPipeline } from '../generation-pipeline';
import { DOMPatchApplier } from '../../../runtime/incremental/patch-executor/dom-applier';
import { PatchSerializer } from '../../../runtime/incremental/patch-generator/serializer';
import { PatchOperationType, PatchOperation } from '../../../runtime/incremental/patch-generator/types';
import { ASTNodeKind } from '../../ast/types';

// In-memory mock DOM node for unit testing DOMPatchApplier in Node test runner
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

describe('LMGenerationPipeline Production Streaming Integration', () => {
  test('Section 20: End-to-End Streaming Test across multiple chunks', () => {
    const doc = new MockDOMDocument();
    const rootContainer = doc.createElement('div');
    rootContainer.setAttribute('id', 'leveonas-root');
    rootContainer.setAttribute('data-ast-id', 'leveonas-root');

    const applier = new DOMPatchApplier(rootContainer, doc as any);
    applier.registerNode('leveonas-root', rootContainer);

    const emittedBatches: PatchOperation[][] = [];
    const emittedText: string[] = [];

    const pipeline = new LMGenerationPipeline({
      rootId: 'leveonas-root',
      onPatch: (patches) => {
        emittedBatches.push(patches);
        // Serialize and deserialize to verify transport fidelity (Section 5)
        const serialized = PatchSerializer.toJSON(patches);
        const deserialized = PatchSerializer.fromJSON(serialized);
        applier.apply(deserialized);
      },
      onText: (text) => {
        emittedText.push(text);
      },
    });

    // Chunk 1: Block start and initial open container
    pipeline.write('<HTML>\ndi(cs(page)\n  so(cs(hero)\n');
    // Chunk 2: h1 title
    pipeline.write('    h1(Leveonas)\n');
    // Chunk 3: paragraph description
    pipeline.write('    p(Streaming frontend generation)\n');
    // Chunk 4: primary button and closing tags
    pipeline.write('    bo(cs(primary) Get Started)\n  )\n)\n</HTML>');
    pipeline.end();

    assert.ok(emittedBatches.length > 0, 'Must emit at least one patch batch');
    assert.strictEqual(emittedText.length, 4, 'Must receive all 4 raw text chunks for debugging');

    const domHtml = rootContainer.toHTML();
    assert.ok(domHtml.includes('<div class="page">'), 'DOM must contain page container');
    assert.ok(domHtml.includes('<section class="hero">'), 'DOM must contain hero section');
    assert.ok(domHtml.includes('<h1>Leveonas</h1>'), 'DOM must contain Leveonas title');
    assert.ok(domHtml.includes('<p>Streaming frontend generation</p>'), 'DOM must contain description');
    assert.ok(domHtml.includes('<button class="primary">Get Started</button>'), 'DOM must contain CTA button');
  });

  test('Section 21: True Streaming Test (DOM updates BEFORE stream completes)', () => {
    const doc = new MockDOMDocument();
    const rootContainer = doc.createElement('div');
    rootContainer.setAttribute('id', 'leveonas-root');
    rootContainer.setAttribute('data-ast-id', 'leveonas-root');

    const applier = new DOMPatchApplier(rootContainer, doc as any);
    applier.registerNode('leveonas-root', rootContainer);

    let patchCountAfterChunk1 = 0;

    const pipeline = new LMGenerationPipeline({
      rootId: 'leveonas-root',
      onPatch: (patches) => {
        applier.apply(patches);
      },
    });

    // Send Chunk 1: Has closed h1(Leveonas), but di is unclosed and </HTML> has NOT arrived
    pipeline.write('<HTML>\ndi(cs(page)\n  h1(Leveonas)');
    patchCountAfterChunk1 = rootContainer.childNodes.length;

    // Verify: DOM has updated BEFORE the complete LM document has arrived
    assert.ok(patchCountAfterChunk1 > 0, 'DOM must change BEFORE the stream completes');
    const midStreamHTML = rootContainer.toHTML();
    assert.ok(midStreamHTML.includes('<div class="page">'), 'DOM must already contain recoverable div');
    assert.ok(midStreamHTML.includes('<h1>Leveonas</h1>'), 'DOM must already contain recoverable h1');

    // Send Chunk 2: Extends with paragraph
    pipeline.write('\n  p(Fast frontend)');
    const extendedHTML = rootContainer.toHTML();
    assert.ok(extendedHTML.includes('<p>Fast frontend</p>'), 'DOM must incrementally update with new child');

    // Send Chunk 3: Closes document
    pipeline.write('\n)\n</HTML>');
    pipeline.end();

    const finalHTML = rootContainer.toHTML();
    assert.ok(finalHTML.includes('<div class="page"><h1>Leveonas</h1><p>Fast frontend</p></div>'), 'Final DOM matches structure');
  });

  test('Section 22: Patch Minimality Test (UPDATE_TEXT targeting existing Literal node)', () => {
    const doc = new MockDOMDocument();
    const rootContainer = doc.createElement('div');
    rootContainer.setAttribute('id', 'leveonas-root');
    rootContainer.setAttribute('data-ast-id', 'leveonas-root');

    const applier = new DOMPatchApplier(rootContainer, doc as any);
    applier.registerNode('leveonas-root', rootContainer);

    const emittedBatches: PatchOperation[][] = [];

    const pipeline = new LMGenerationPipeline({
      rootId: 'leveonas-root',
      onPatch: (patches) => {
        emittedBatches.push(patches);
        applier.apply(patches);
      },
    });

    // Initial state
    pipeline.write('<HTML>\ndi(cs(page)\n  p(Build faster)\n)\n</HTML>');
    pipeline.end();

    assert.strictEqual(emittedBatches.length, 1);
    const initialDOM = rootContainer.toHTML();
    assert.ok(initialDOM.includes('<p>Build faster</p>'));

    // Later state: Update text from "Build faster" to "Build much faster"
    // The previous committed AST from pipeline is used as the base
    const ast1 = pipeline.getPreviousAST()!;

    // Now diff ast1 with ast2 using PatchGenerator directly:
    const { HTMLLMInterpreter } = require('../../../compiler/interpreters/html-lm');
    const { PatchGenerator } = require('../../../runtime/incremental/patch-generator/generator');
    const generator = new PatchGenerator();

    const ast2 = HTMLLMInterpreter.parse('di(cs(page)\n  p(Build much faster)\n)');
    const updatePatches: PatchOperation[] = generator.generate(ast1, ast2);

    // Assert minimality: Exactly 1 operation, must be UPDATE_TEXT
    assert.strictEqual(updatePatches.length, 1, 'Must generate exactly 1 patch');
    assert.strictEqual(updatePatches[0].operation, PatchOperationType.UPDATE_TEXT, 'Must be UPDATE_TEXT');
    assert.strictEqual(updatePatches[0].payload?.text, 'Build much faster');

    // Apply minimal patch to the live DOM
    applier.apply(updatePatches);
    const updatedDOM = rootContainer.toHTML();
    assert.ok(updatedDOM.includes('<p>Build much faster</p>'), 'DOM has updated text without node replacement');
    assert.ok(!updatedDOM.includes('<p>Build faster</p>'), 'Old text removed');
  });

  test('Section 1 & 8: Safely skips non-HTML blocks (<CSS>, <JS>, <REACT>) without crashing', () => {
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

    // Feed CSS block followed by HTML block followed by JS block
    pipeline.write('<CSS>\n.hero { color: red; }\n</CSS>\n');
    pipeline.write('<HTML>\ndi(cs(box)\n  h2(Safe Title)\n)\n</HTML>\n');
    pipeline.write('<JS>\nconsole.log("no execution");\n</JS>');
    pipeline.end();

    const html = rootContainer.toHTML();
    assert.ok(html.includes('<div class="box"><h2>Safe Title</h2></div>'), 'Only HTML-LM must be executed');
    assert.ok(!html.includes('.hero'), 'CSS block must not leak into DOM');
    assert.ok(!html.includes('console.log'), 'JS block must not leak into DOM');
  });

  test('Section 16: Session Isolation (Two concurrent generations do not share AST state)', () => {
    const emittedA: PatchOperation[][] = [];
    const emittedB: PatchOperation[][] = [];

    const pipelineA = new LMGenerationPipeline({
      rootId: 'leveonas-root',
      onPatch: (p) => emittedA.push(p),
    });

    const pipelineB = new LMGenerationPipeline({
      rootId: 'leveonas-root',
      onPatch: (p) => emittedB.push(p),
    });

    pipelineA.write('<HTML>\ndi(cs(session-a) h1(Alpha))\n</HTML>');
    pipelineB.write('<HTML>\ndi(cs(session-b) h1(Beta))\n</HTML>');

    pipelineA.end();
    pipelineB.end();

    const astA = pipelineA.getPreviousAST()!;
    const astB = pipelineB.getPreviousAST()!;

    assert.notStrictEqual(astA, astB, 'AST roots must be distinct instances');
    const compA = astA.children[0] as any;
    const compB = astB.children[0] as any;

    assert.strictEqual(compA.properties[0].value.value, 'session-a');
    assert.strictEqual(compB.properties[0].value.value, 'session-b');
  });

  test('Section 15: Abort cleanly stops emission and releases AST state', () => {
    let patchesEmitted = 0;
    const pipeline = new LMGenerationPipeline({
      rootId: 'leveonas-root',
      onPatch: () => {
        patchesEmitted++;
      },
    });

    pipeline.write('<HTML>\ndi(cs(page) h1(Hello))');
    assert.ok(patchesEmitted > 0, 'Should emit before abort');

    pipeline.abort();
    const countAfterAbort = patchesEmitted;

    // Writes after abort must not emit
    pipeline.write('\np(Ignored content)\n</HTML>');
    pipeline.end();

    assert.strictEqual(patchesEmitted, countAfterAbort, 'Must not emit patches after abort');
    assert.strictEqual(pipeline.getPreviousAST(), null, 'AST state released');
  });
});
