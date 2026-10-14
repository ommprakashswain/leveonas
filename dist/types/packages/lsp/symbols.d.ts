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
import { DocumentSymbol } from './types';
export declare class LeveonasSymbolsProvider {
    /**
     * Extract hierarchical document symbols from an LM document.
     */
    static getDocumentSymbols(documentText: string): DocumentSymbol[];
    private static extractBlockSymbols;
}
