/**
 * Leveonas Document Symbols Provider
 *
 * Generates structured document outline:
 * - Components (SymbolKind.Class)
 * - State variables (SymbolKind.Variable)
 * - Computed / Derived values (SymbolKind.Property)
 * - Props (SymbolKind.Field)
 * - Events (SymbolKind.Event)
 * - Structural Elements (SymbolKind.Struct)
 */

import { BlockExtractor } from './block-extractor';
import { DocumentSymbol, Range, SymbolKind } from './types';
import { KNOWN_ELEMENT_ABBREVIATIONS } from '../compiler/interpreters/html-lm/vocabulary';

export class LeveonasSymbolsProvider {
  /**
   * Extract hierarchical document symbols from an LM document.
   */
  public static getDocumentSymbols(documentText: string): DocumentSymbol[] {
    const symbols: DocumentSymbol[] = [];
    const blocks = BlockExtractor.extractBlocks(documentText);

    for (const block of blocks) {
      const blockSymbols = LeveonasSymbolsProvider.extractBlockSymbols(block, documentText);
      symbols.push(...blockSymbols);
    }

    return symbols;
  }

  private static extractBlockSymbols(
    block: { content: string; contentRange: Range },
    fullDoc: string
  ): DocumentSymbol[] {
    const symbols: DocumentSymbol[] = [];
    const content = block.content;
    const baseOffset = block.contentRange.start.offset ?? BlockExtractor.positionToOffset(fullDoc, block.contentRange.start);

    // 1. Extract Components
    const compRegex = /\bcomponent\s*\(\s*([A-Za-z0-9_$]+)\s*\)(?:\s*\(\s*props\s*\(([^)]*)\)\))?|\(component:([A-Za-z0-9_$]+)(?:\s+\(props:\s*([^)]*)\))?/g;
    let compMatch: RegExpExecArray | null;

    while ((compMatch = compRegex.exec(content)) !== null) {
      const name = compMatch[1] || compMatch[3];
      const propsStr = compMatch[2] || compMatch[4] || '';
      const matchOffset = baseOffset + compMatch.index;
      const startPos = BlockExtractor.offsetToPosition(fullDoc, matchOffset);
      const endPos = BlockExtractor.offsetToPosition(fullDoc, matchOffset + compMatch[0].length);

      const compSymbol: DocumentSymbol = {
        name,
        detail: propsStr ? `props: (${propsStr})` : 'component',
        kind: SymbolKind.Class,
        range: { start: startPos, end: endPos },
        selectionRange: { start: startPos, end: endPos },
        children: [],
      };

      // Add prop children if defined
      if (propsStr) {
        const props = propsStr.split(',').map((s) => s.trim()).filter(Boolean);
        for (const p of props) {
          compSymbol.children?.push({
            name: p,
            detail: 'prop',
            kind: SymbolKind.Field,
            range: { start: startPos, end: endPos },
            selectionRange: { start: startPos, end: endPos },
          });
        }
      }

      symbols.push(compSymbol);
    }

    // 2. Extract State Declarations
    const stateRegex = /\b(?:state|ref|signal|useState)\s*\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*,\s*([^)]+)\)|\((?:state|ref|signal):([a-zA-Z_$][a-zA-Z0-9_$]*)\s+([^)]+)\)/g;
    let stateMatch: RegExpExecArray | null;

    while ((stateMatch = stateRegex.exec(content)) !== null) {
      const name = stateMatch[1] || stateMatch[3];
      const initial = (stateMatch[2] || stateMatch[4] || '').trim();
      const matchOffset = baseOffset + stateMatch.index;
      const startPos = BlockExtractor.offsetToPosition(fullDoc, matchOffset);
      const endPos = BlockExtractor.offsetToPosition(fullDoc, matchOffset + stateMatch[0].length);

      symbols.push({
        name,
        detail: `initial: ${initial}`,
        kind: SymbolKind.Variable,
        range: { start: startPos, end: endPos },
        selectionRange: { start: startPos, end: endPos },
      });
    }

    // 3. Extract Computed / Reactive Declarations
    const derivedRegex = /\b(?:reactive|computed|\$derived)\s*\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*,\s*([^)]+)\)|\((?:reactive|computed|derived):([a-zA-Z_$][a-zA-Z0-9_$]*)\s+([^)]+)\)/g;
    let derivedMatch: RegExpExecArray | null;

    while ((derivedMatch = derivedRegex.exec(content)) !== null) {
      const name = derivedMatch[1] || derivedMatch[3];
      const expr = (derivedMatch[2] || derivedMatch[4] || '').trim();
      const matchOffset = baseOffset + derivedMatch.index;
      const startPos = BlockExtractor.offsetToPosition(fullDoc, matchOffset);
      const endPos = BlockExtractor.offsetToPosition(fullDoc, matchOffset + derivedMatch[0].length);

      symbols.push({
        name,
        detail: `expr: ${expr}`,
        kind: SymbolKind.Property,
        range: { start: startPos, end: endPos },
        selectionRange: { start: startPos, end: endPos },
      });
    }

    // 4. Extract Top-Level Elements & Containers
    const elemRegex = /\(\s*([a-zA-Z0-9_$]+)(?:\s+cs:"([^"]*)")?(?:\s+id:"([^"]*)")?/g;
    let elemMatch: RegExpExecArray | null;

    while ((elemMatch = elemRegex.exec(content)) !== null) {
      const tag = elemMatch[1];
      const cs = elemMatch[2];
      const id = elemMatch[3];
      const isKnown = tag in KNOWN_ELEMENT_ABBREVIATIONS;

      if (isKnown || ['Card', 'Navbar', 'Footer', 'Header', 'Sidebar'].includes(tag)) {
        const matchOffset = baseOffset + elemMatch.index;
        const startPos = BlockExtractor.offsetToPosition(fullDoc, matchOffset);
        const endPos = BlockExtractor.offsetToPosition(fullDoc, matchOffset + elemMatch[0].length);

        symbols.push({
          name: `<${KNOWN_ELEMENT_ABBREVIATIONS[tag] ?? tag}>`,
          detail: id ? `#${id}` : cs ? `.${cs}` : '',
          kind: SymbolKind.Struct,
          range: { start: startPos, end: endPos },
          selectionRange: { start: startPos, end: endPos },
        });
      }
    }

    return symbols;
  }
}
