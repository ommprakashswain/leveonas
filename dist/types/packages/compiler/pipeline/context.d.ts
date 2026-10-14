import { CompilationOptions } from './options';
import { PipelineDiagnostic } from './diagnostics';
import { ExecutionStatistics } from './result';
export declare class PipelineContext {
    readonly options: CompilationOptions;
    readonly diagnostics: PipelineDiagnostic[];
    readonly statistics: ExecutionStatistics;
    constructor(options: CompilationOptions);
    reportDiagnostic(diagnostic: PipelineDiagnostic): void;
    hasErrors(): boolean;
    getWarnings(): PipelineDiagnostic[];
}
