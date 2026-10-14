export declare enum DiagnosticSeverity {
    Error = "Error",
    Warning = "Warning",
    Info = "Info"
}
export declare enum DiagnosticCode {
    UnknownKeyword = "UnknownKeyword",
    UnknownProperty = "UnknownProperty",
    UnexpectedIdentifier = "UnexpectedIdentifier",
    ReservedKeywordMisuse = "ReservedKeywordMisuse",
    DuplicateProperty = "DuplicateProperty",
    UnknownEnum = "UnknownEnum"
}
export interface Diagnostic {
    code: DiagnosticCode;
    message: string;
    severity: DiagnosticSeverity;
    line: number;
    column: number;
    offset: number;
}
export declare function createDiagnostic(code: DiagnosticCode, message: string, severity: DiagnosticSeverity, line: number, column: number, offset: number): Diagnostic;
