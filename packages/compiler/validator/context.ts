import { ASTNode } from '../ast/nodes';
import { DiagnosticBag } from './diagnostics';
import { DiagnosticSeverity } from './types';
import { SourceLocation } from '../ast/types';

export class ValidationContext {
  public diagnostics = new DiagnosticBag();
  
  constructor(public rootNode: ASTNode) {}

  reportError(code: string, message: string, loc: SourceLocation, fix?: string) {
    this.diagnostics.add(code, DiagnosticSeverity.Error, message, loc, fix);
  }

  reportWarning(code: string, message: string, loc: SourceLocation, fix?: string) {
    this.diagnostics.add(code, DiagnosticSeverity.Warning, message, loc, fix);
  }

  reportInfo(code: string, message: string, loc: SourceLocation, fix?: string) {
    this.diagnostics.add(code, DiagnosticSeverity.Info, message, loc, fix);
  }
}
