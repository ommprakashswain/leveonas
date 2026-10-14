export declare enum PipelineDiagnosticSeverity {
    Error = "Error",
    Warning = "Warning",
    Info = "Info"
}
export interface PipelineSourceLocation {
    startLine: number;
    startColumn: number;
    startOffset: number;
    endLine?: number;
    endColumn?: number;
    endOffset?: number;
}
export interface PipelineDiagnostic {
    stage: string;
    code: string;
    message: string;
    severity: PipelineDiagnosticSeverity;
    location?: PipelineSourceLocation;
}
