import { CompilationOptions } from './options';
import { PipelineDiagnostic, PipelineDiagnosticSeverity } from './diagnostics';
import { ExecutionStatistics } from './result';

export class PipelineContext {
  public readonly diagnostics: PipelineDiagnostic[] = [];
  public readonly statistics: ExecutionStatistics = {
    scannerTime: 0,
    tokenizerTime: 0,
    lexerTime: 0,
    parserTime: 0,
    validatorTime: 0,
    rendererTime: 0,
    patchGeneratorTime: 0,
    totalTime: 0
  };
  
  constructor(public readonly options: CompilationOptions) {}
  
  public reportDiagnostic(diagnostic: PipelineDiagnostic) {
    if (this.options.collectDiagnostics !== false) {
      this.diagnostics.push(diagnostic);
    }
  }
  
  public hasErrors(): boolean {
    return this.diagnostics.some(d => d.severity === PipelineDiagnosticSeverity.Error);
  }

  public getWarnings(): PipelineDiagnostic[] {
    return this.diagnostics.filter(d => d.severity === PipelineDiagnosticSeverity.Warning);
  }
}
