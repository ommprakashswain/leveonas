/**
 * Leveonas Go-To-Definition Provider
 *
 * Resolves source declaration locations for:
 * - Component instances -> Component declaration (component(Name) or (component:Name))
 * - State variable references -> State declaration (state(var, initial) or (state:var initial))
 * - Computed/reactive references -> Computed declaration (computed(var, expr) or reactive(var, expr))
 * - Prop references -> Props declaration (props(p1, p2))
 */
import { Location, Position } from './types';
export declare class LeveonasDefinitionProvider {
    /**
     * Resolve definition location for the symbol under cursor.
     */
    static getDefinition(documentText: string, position: Position, uri?: string): Location | null;
    private static getWordAtOffset;
}
