/**
 * Leveonas CLI: `leveonas inspect`
 *
 * Inspects components, state, derived values, dependencies, events, lists, keys, and DOM nodes.
 */
export interface InspectOptions {
    file: string;
    json?: boolean;
}
export declare function runInspectCommand(options: InspectOptions): {
    success: boolean;
    data: unknown;
};
