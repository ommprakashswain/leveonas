/**
 * Leveonas Language Service
 *
 * Unified Language Server implementation reusing the existing compiler,
 * AST, Common UI IR, and Reconciler.
 */

import { BlockExtractor } from './block-extractor';
import { LeveonasCompletionProvider } from './completion';
import { LeveonasDefinitionProvider } from './definition';
import { DiagnosticOptions, LeveonasDiagnosticEngine } from './diagnostics';
import { LeveonasFormatter } from './formatter';
import { LeveonasHoverProvider } from './hover';
import { LeveonasInspector } from './inspect';
import { LeveonasReferencesProvider } from './references';
import { LeveonasSymbolsProvider } from './symbols';
import {
  CompletionItem,
  DocumentInspection,
  DocumentSymbol,
  FormattingOptions,
  Hover,
  Location,
  LSPDiagnostic,
  Position,
} from './types';

export class LeveonasLanguageService {
  /**
   * Compute full compiler & parser diagnostics for a document.
   */
  public getDiagnostics(documentText: string, options?: DiagnosticOptions): LSPDiagnostic[] {
    return LeveonasDiagnosticEngine.diagnose(documentText, options);
  }

  /**
   * Provide hover information for symbol at cursor.
   */
  public getHover(documentText: string, position: Position): Hover | null {
    return LeveonasHoverProvider.getHover(documentText, position);
  }

  /**
   * Provide autocompletions at cursor position.
   */
  public getCompletions(documentText: string, position: Position): CompletionItem[] {
    return LeveonasCompletionProvider.getCompletions(documentText, position);
  }

  /**
   * Jump to definition of symbol at cursor.
   */
  public getDefinition(
    documentText: string,
    position: Position,
    uri?: string
  ): Location | null {
    return LeveonasDefinitionProvider.getDefinition(documentText, position, uri);
  }

  /**
   * Find all references of symbol across document.
   */
  public findReferences(
    documentText: string,
    position: Position,
    uri?: string,
    includeDeclaration: boolean = true
  ): Location[] {
    return LeveonasReferencesProvider.findReferences(
      documentText,
      position,
      uri,
      includeDeclaration
    );
  }

  /**
   * Extract document outline and symbols.
   */
  public getDocumentSymbols(documentText: string): DocumentSymbol[] {
    return LeveonasSymbolsProvider.getDocumentSymbols(documentText);
  }

  /**
   * Format document to canonical LM syntax deterministically.
   */
  public formatDocument(documentText: string, options?: FormattingOptions): string {
    return LeveonasFormatter.format(documentText, options);
  }

  /**
   * Full AST, IR, Reactivity Graph, and Patch inspection for developer tooling.
   */
  public inspectDocument(documentText: string): DocumentInspection {
    return LeveonasInspector.inspect(documentText);
  }

  /**
   * Extract embedded framework blocks.
   */
  public extractBlocks(documentText: string) {
    return BlockExtractor.extractBlocks(documentText);
  }
}
