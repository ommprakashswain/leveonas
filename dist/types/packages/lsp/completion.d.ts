/**
 * Leveonas Autocompletion Provider
 *
 * Provides context-aware completions for:
 * - LM element abbreviations (di, bo, so, iu, etc.)
 * - Semantic UI component names (Card, Navbar, Stat, etc.)
 * - Attribute abbreviations (cs:, id:, hr:, oc:, etc.)
 * - Standard HTML attributes & event handlers
 * - In-scope state variables & computed values
 * - Declared user components
 */
import { CompletionItem, Position } from './types';
export declare class LeveonasCompletionProvider {
    /**
     * Compute completion items at a specific document position.
     */
    static getCompletions(documentText: string, position: Position): CompletionItem[];
    private static extractStateVariables;
    private static extractComputedVariables;
    private static extractDeclaredComponents;
}
