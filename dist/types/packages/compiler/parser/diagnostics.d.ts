export declare enum DiagnosticSeverity {
    Error = "Error",
    Warning = "Warning",
    Info = "Info"
}
export declare enum DiagnosticCode {
    MissingClosingBrace = "MissingClosingBrace",
    MissingClosingBracket = "MissingClosingBracket",
    UnexpectedToken = "UnexpectedToken",
    UnknownProperty = "UnknownProperty",
    InvalidNesting = "InvalidNesting",
    UnexpectedEOF = "UnexpectedEOF",
    DuplicateProperty = "DuplicateProperty",
    MissingPropertyValue = "MissingPropertyValue"
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
