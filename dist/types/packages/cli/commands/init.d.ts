/**
 * Leveonas Project Initializer Command
 *
 * Scaffolds a minimal, working Leveonas project:
 * - leveonas.config.json
 * - app.lm
 * - README.md
 */
export interface InitCommandOptions {
    directory?: string;
    template?: 'html' | 'react' | 'vue' | 'svelte' | 'angular';
    force?: boolean;
    quiet?: boolean;
}
export interface InitResult {
    success: boolean;
    filesCreated: string[];
    error?: string;
}
export declare const STARTER_TEMPLATES: Record<string, {
    config: object;
    lm: string;
    readme: string;
}>;
export declare function runInitCommand(options?: InitCommandOptions): InitResult;
