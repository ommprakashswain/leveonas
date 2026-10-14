/**
 * Leveonas Find References Provider
 *
 * Discovers all occurrences of a symbol across the document:
 * - Components (declaration, instantiation)
 * - State variables (declaration, reactive expressions, event handlers, bindings, interpolations)
 * - Computed/derived values
 * - Props
 */
import { Location, Position } from './types';
export declare class LeveonasReferencesProvider {
    /**
     * Find all reference locations for the symbol under cursor.
     */
    static findReferences(documentText: string, position: Position, uri?: string, includeDeclaration?: boolean): Location[];
    private static getWordAtOffset;
}
