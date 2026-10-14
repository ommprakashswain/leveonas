import { CompilationOptions } from './options';
import { CompilationResult } from './result';
export declare class CompilerPipeline {
    private defaultOptions;
    private previousAst;
    constructor(defaultOptions?: CompilationOptions);
    compile(source: string, options?: CompilationOptions): CompilationResult;
    private createResult;
}
