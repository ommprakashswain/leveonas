import { ValidationContext } from './context';
export declare enum DiagnosticSeverity {
    Error = "Error",
    Warning = "Warning",
    Info = "Info"
}
export interface Diagnostic {
    code: string;
    severity: DiagnosticSeverity;
    message: string;
    sourceLocation: {
        startLine: number;
        startColumn: number;
        startOffset: number;
        endLine: number;
        endColumn: number;
        endOffset: number;
    };
    suggestedFix?: string;
}
export interface ValidationRule {
    name: string;
    validate(context: ValidationContext): void;
}
