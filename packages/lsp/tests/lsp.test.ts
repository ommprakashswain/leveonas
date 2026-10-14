import { describe, it } from 'node:test';
import assert from 'node:assert';
import { LeveonasLanguageService } from '../server';
import { LeveonasDiagnosticEngine } from '../diagnostics';
import { LeveonasHoverProvider } from '../hover';
import { LeveonasCompletionProvider } from '../completion';
import { LeveonasDefinitionProvider } from '../definition';
import { LeveonasReferencesProvider } from '../references';
import { LeveonasSymbolsProvider } from '../symbols';
import { LeveonasFormatter } from '../formatter';
import { LeveonasInspector } from '../inspect';
import { BlockExtractor } from '../block-extractor';
import { DiagnosticSeverity, SymbolKind } from '../types';

describe('Leveonas Phase 4: Language Server & Developer Tooling Suite', () => {
  const lsp = new LeveonasLanguageService();

  // =========================================================================
  // 1. Block Extraction & Document Detection
  // =========================================================================
  it('1. Correctly extracts embedded framework blocks and coordinates', () => {
    const doc = `
<HTML>
(di cs:"container" (h1 "Hello World"))
</HTML>
<REACT>
(component:Card (props: title) (di (h2 "{title}")))
</REACT>
<SVELTE>
(state:count 0)
(reactive:double count * 2)
</SVELTE>
`.trim();

    const blocks = BlockExtractor.extractBlocks(doc);
    assert.strictEqual(blocks.length, 3);
    assert.strictEqual(blocks[0].type, 'html');
    assert.strictEqual(blocks[1].type, 'react');
    assert.strictEqual(blocks[2].type, 'svelte');
  });

  // =========================================================================
  // 2. Lexer & Parser Diagnostics: Incomplete vs Invalid
  // =========================================================================
  it('2. Distinguishes INCOMPLETE streaming input from fatal INVALID errors', () => {
    // Incomplete stream: unclosed parentheses at EOF
    const incompleteCode = `(di cs:"main" (h1 "Hello"`;
    const incompDiags = lsp.getDiagnostics(incompleteCode, { streaming: true });

    assert.ok(incompDiags.length > 0);
    const hasIncompleteFlag = incompDiags.some((d) => d.isIncomplete === true);
    assert.strictEqual(hasIncompleteFlag, true, 'Unclosed parens at EOF should be marked as isIncomplete');
    // None should be fatal Error severity when streaming
    const hasFatalError = incompDiags.some((d) => d.severity === DiagnosticSeverity.Error && !d.isIncomplete);
    assert.strictEqual(hasFatalError, false, 'Incomplete stream should not produce non-recoverable Error');

    // Invalid code: mismatched bracket/brace
    const invalidCode = `(di cs:"main" ] (h1 "Hello"))`;
    const invDiags = lsp.getDiagnostics(invalidCode);
    const hasMismatch = invDiags.some((d) => d.code === 'UnexpectedClosingDelimiter' || d.code === 'MismatchedDelimiter');
    assert.strictEqual(hasMismatch, true, 'Mismatched delimiter must be flagged as syntax error');
  });

  it('3. Detects duplicate DOM IDs and unknown elements', () => {
    const duplicateIdCode = `
(di id:"hero-section"
  (h1 "Hero")
  (di id:"hero-section" "Duplicate")
)
`;
    const diags = lsp.getDiagnostics(duplicateIdCode);
    const dupDiag = diags.find((d) => d.code === 'DuplicateId');
    assert.ok(dupDiag, 'Should flag duplicate DOM ID');
  });

  it('4. Validates reactive dependencies in computed declarations', () => {
    const badReactiveCode = `
(state:count 0)
(computed:total count + unknownVariable * 2)
`;
    const diags = lsp.getDiagnostics(badReactiveCode);
    const unresDiag = diags.find((d) => d.code === 'UnresolvedReactiveDependency');
    assert.ok(unresDiag, 'Should flag undeclared variable in computed expression');
  });

  // =========================================================================
  // 3. Hover Information
  // =========================================================================
  it('5. Provides hover documentation for element abbreviations', () => {
    const code = `(di cs:"hero" (bo "Click Me"))`;
    // Hover on 'di' at col 1
    const hoverDi = lsp.getHover(code, { line: 0, character: 1 });
    assert.ok(hoverDi, 'Hover on di should return doc');
    assert.ok(hoverDi.contents.value.includes('div'));

    // Hover on 'bo' at col 15
    const hoverBo = lsp.getHover(code, { line: 0, character: 15 });
    assert.ok(hoverBo, 'Hover on bo should return doc');
    assert.ok(hoverBo.contents.value.includes('button'));
  });

  it('6. Provides hover documentation for attribute abbreviations and state', () => {
    const code = `(state:count 10)\n(di cs:"card" id:"main-card")`;
    // Hover on 'cs'
    const hoverCs = lsp.getHover(code, { line: 1, character: 4 });
    assert.ok(hoverCs, 'Hover on cs should return doc');
    assert.ok(hoverCs.contents.value.includes('class') || hoverCs.contents.value.includes('className'));

    // Hover on state 'count'
    const hoverCount = lsp.getHover(code, { line: 0, character: 7 });
    assert.ok(hoverCount, 'Hover on count should return state doc');
    assert.ok(hoverCount.contents.value.includes('state') || hoverCount.contents.value.includes('count'));
  });

  // =========================================================================
  // 4. Autocompletion
  // =========================================================================
  it('7. Suggests element abbreviations, components, and attributes', () => {
    const code = `(di `;
    const completions = lsp.getCompletions(code, { line: 0, character: 4 });

    assert.ok(completions.length > 0);
    const hasClassAttr = completions.some((c) => c.label === 'cs:' || c.label === 'class:');
    assert.strictEqual(hasClassAttr, true, 'Should suggest class/cs attribute inside element');

    // Test inside open parenthesis
    const openParenCode = `(`;
    const tagCompletions = lsp.getCompletions(openParenCode, { line: 0, character: 1 });
    const hasDi = tagCompletions.some((c) => c.label === 'di');
    const hasButton = tagCompletions.some((c) => c.label === 'bo' || c.label === 'Button');
    assert.strictEqual(hasDi, true, 'Should suggest di abbreviation');
    assert.strictEqual(hasButton, true, 'Should suggest button');
  });

  // =========================================================================
  // 5. Go-to-Definition & Find References
  // =========================================================================
  it('8. Navigates from component instance and state reference to definition', () => {
    const code = `
(component:Card
  (props: title)
  (state:count 0)
  (reactive:double count * 2)
  (di (h1 "{title}") (pa "{count}"))
)
`;
    // Find definition of Card
    const defCard = lsp.getDefinition(code, { line: 1, character: 12 });
    assert.ok(defCard, 'Definition of Card should be found');

    // Find definition of count
    const defCount = lsp.getDefinition(code, { line: 4, character: 20 });
    assert.ok(defCount, 'Definition of count should be found');
  });

  it('9. Finds all references to a state variable across document', () => {
    const code = `
(state:count 0)
(reactive:double count * 2)
(bo oc:"count++" "{count}")
`;
    const refs = lsp.findReferences(code, { line: 1, character: 7 });
    assert.ok(refs.length >= 3, `Expected at least 3 references to count, found ${refs.length}`);
  });

  // =========================================================================
  // 6. Document Symbols & Outline
  // =========================================================================
  it('10. Extracts structured document symbols hierarchy', () => {
    const code = `
(component:Counter
  (props: title, step)
  (state:count 0)
  (reactive:double count * 2)
  (di cs:"card" (h1 "{title}"))
)
`;
    const symbols = lsp.getDocumentSymbols(code);
    assert.ok(symbols.length > 0);

    const counterSym = symbols.find((s) => s.name === 'Counter');
    assert.ok(counterSym, 'Counter component symbol should exist');
    assert.strictEqual(counterSym.kind, SymbolKind.Class);

    const countSym = symbols.find((s) => s.name === 'count');
    assert.ok(countSym, 'count state symbol should exist');
    assert.strictEqual(countSym.kind, SymbolKind.Variable);

    const doubleSym = symbols.find((s) => s.name === 'double');
    assert.ok(doubleSym, 'double reactive symbol should exist');
    assert.strictEqual(doubleSym.kind, SymbolKind.Property);
  });

  // =========================================================================
  // 7. Deterministic Formatter
  // =========================================================================
  it('11. Deterministically formats LM documents with strict idempotency', () => {
    const unformatted = `(di  cs:"container" (h1   "Title" )(bo  oc:"handleClick()"  "Click" ) )`;
    const formatted1 = lsp.formatDocument(unformatted, { tabSize: 2 });
    const formatted2 = lsp.formatDocument(formatted1, { tabSize: 2 });

    assert.ok(formatted1.length > 0);
    assert.strictEqual(formatted1, formatted2, 'Formatting must be strictly idempotent (format(format(x)) === format(x))');
    assert.ok(formatted1.includes('(di cs:"container"'));
  });

  // =========================================================================
  // 8. Multi-Layer AST & Reactivity Inspector
  // =========================================================================
  it('12. Inspects full pipeline from AST to Common UI IR and Patches', () => {
    const svelteCode = `
<SVELTE>
component(App)(
  state(count, 0)
  reactive(double, count * 2)
  di(cs:"p-4"
    h1("Count is {count}")
    bo(click:increment "+1")
  )
)
</SVELTE>
`;
    const inspection = lsp.inspectDocument(svelteCode);

    assert.strictEqual(inspection.detectedFramework, 'svelte');
    assert.strictEqual(inspection.streamStatus, 'VALID');
    assert.ok(inspection.uiIR !== null, 'Common UI IR should be generated');
    assert.ok(inspection.runtimeIR !== null, 'Runtime IR should be generated');
    assert.ok(inspection.patchOperations.length > 0, 'Incremental patches should be generated');
    assert.strictEqual(inspection.nodeCount.stateVariables, 1);
    assert.strictEqual(inspection.nodeCount.computedValues, 1);

    // Verify Reactivity Graph nodes
    assert.ok(inspection.reactivityGraph.nodes.length >= 2);
    const hasStateNode = inspection.reactivityGraph.nodes.some((n) => n.kind === 'state' && n.name === 'count');
    assert.strictEqual(hasStateNode, true, 'Reactivity graph should contain state node');
  });
});
