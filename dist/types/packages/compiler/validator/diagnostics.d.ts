import { Diagnostic, DiagnosticSeverity } from './types';
import { SourceLocation } from '../ast/types';
export declare class DiagnosticBag {
    private diagnostics;
    add(code: string, severity: DiagnosticSeverity, message: string, sourceLocation: SourceLocation, suggestedFix?: string): void;
    getDiagnostics(): Diagnostic[];
    hasErrors(): boolean;
}
