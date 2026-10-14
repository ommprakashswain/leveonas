import { Diagnostic, DiagnosticSeverity } from './types';
import { SourceLocation } from '../ast/types';

export class DiagnosticBag {
  private diagnostics: Diagnostic[] = [];

  add(
    code: string,
    severity: DiagnosticSeverity,
    message: string,
    sourceLocation: SourceLocation,
    suggestedFix?: string
  ): void {
    this.diagnostics.push({
      code,
      severity,
      message,
      sourceLocation,
      suggestedFix
    });
  }

  getDiagnostics(): Diagnostic[] {
    return this.diagnostics;
  }

  hasErrors(): boolean {
    return this.diagnostics.some(d => d.severity === DiagnosticSeverity.Error);
  }
}
