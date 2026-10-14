/**
 * Leveonas Hover Information Provider
 *
 * Provides rich markdown documentation on hover for:
 * - LM element abbreviations (di -> div, bo -> button, etc.)
 * - Attribute abbreviations (cs -> class, hr -> href, oc -> onClick, etc.)
 * - Framework reactivity primitives (state, computed, reactive, signal, props)
 * - Declared component signatures and parameters
 */
import { Hover, Position } from './types';
export declare class LeveonasHoverProvider {
    /**
     * Get hover documentation for the token under cursor.
     */
    static getHover(documentText: string, position: Position): Hover | null;
    private static extractTokenAtOffset;
    private static findCustomSymbolHover;
}
