/**
 * Leveonas CLI: `leveonas compile`
 *
 * Compiles LM files to AST, Common UI IR, Runtime IR, or Incremental Patches.
 */
export interface CompileOptions {
    file: string;
    target?: 'ast' | 'ui-ir' | 'runtime-ir' | 'patch';
    json?: boolean;
    output?: string;
}
export declare function runCompileCommand(options: CompileOptions): {
    success: boolean;
    data: unknown;
};
