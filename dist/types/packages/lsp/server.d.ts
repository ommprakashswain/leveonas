/**
 * Leveonas Language Service
 *
 * Unified Language Server implementation reusing the existing compiler,
 * AST, Common UI IR, and Reconciler.
 */
import { DiagnosticOptions } from './diagnostics';
import { CompletionItem, DocumentInspection, DocumentSymbol, FormattingOptions, Hover, Location, LSPDiagnostic, Position } from './types';
export declare class LeveonasLanguageService {
    /**
     * Compute full compiler & parser diagnostics for a document.
     */
    getDiagnostics(documentText: string, options?: DiagnosticOptions): LSPDiagnostic[];
    /**
     * Provide hover information for symbol at cursor.
     */
    getHover(documentText: string, position: Position): Hover | null;
    /**
     * Provide autocompletions at cursor position.
     */
    getCompletions(documentText: string, position: Position): CompletionItem[];
    /**
     * Jump to definition of symbol at cursor.
     */
    getDefinition(documentText: string, position: Position, uri?: string): Location | null;
    /**
     * Find all references of symbol across document.
     */
    findReferences(documentText: string, position: Position, uri?: string, includeDeclaration?: boolean): Location[];
    /**
     * Extract document outline and symbols.
     */
    getDocumentSymbols(documentText: string): DocumentSymbol[];
    /**
     * Format document to canonical LM syntax deterministically.
     */
    formatDocument(documentText: string, options?: FormattingOptions): string;
    /**
     * Full AST, IR, Reactivity Graph, and Patch inspection for developer tooling.
     */
    inspectDocument(documentText: string): DocumentInspection;
    /**
     * Extract embedded framework blocks.
     */
    extractBlocks(documentText: string): import("./types").EmbeddedBlock[];
}
