/**
 * Leveonas — Production Public Package Entry Point
 *
 * Provides stable high-level APIs for compiler, runtime, SDK, LSP, and CLI.
 */
import { LeveonasDiagnosticEngine, DiagnosticOptions } from './lsp/diagnostics';
import { LeveonasFormatter, FormatterOptions } from './lsp/formatter';
import { LeveonasInspector, safeStringify, sanitizeForInspection } from './lsp/inspect';
import { LeveonasLanguageService } from './lsp/server';
import { DocumentInspection, LSPDiagnostic, EmbeddedBlockType } from './lsp/types';
import { UIIRProgramNode } from './compiler/ui-ir/types';
import { LEVEONAS_VERSION, VERSION } from './version';
export { VERSION, LEVEONAS_VERSION };
export { LeveonasLanguageService };
export { LeveonasInspector, safeStringify, sanitizeForInspection };
export { LeveonasFormatter };
export { LeveonasDiagnosticEngine };
export type { DocumentInspection, LSPDiagnostic, EmbeddedBlockType };
export * from './security';
export interface CompileOptions {
    framework?: 'html' | 'react' | 'vue' | 'svelte' | 'angular' | 'auto';
    target?: 'all' | 'ui-ir' | 'dom' | 'patches';
    allowIncomplete?: boolean;
}
export interface CompileResult {
    success: boolean;
    detectedFramework: string;
    ast: unknown;
    frameworkAST: unknown;
    uiIR: UIIRProgramNode | null;
    runtimeIR: unknown;
    domAST: unknown;
    patchOperations: Array<{
        op: string;
        targetId?: string;
        payload?: unknown;
        bytes: number;
    }>;
    diagnostics: LSPDiagnostic[];
    error?: string | null;
}
/**
 * Public Compile API: Compiles LM source code into AST, Common UI IR, Runtime IR, and Patches.
 */
export declare function compile(source: string, options?: CompileOptions): CompileResult;
/**
 * Public Parse API: Parses LM source into typed AST.
 */
export declare function parse(source: string, options?: {
    framework?: string;
}): unknown;
/**
 * Public Lowering API: Lowers framework AST or LM code into Common UI IR.
 */
export declare function lower(astOrSource: any, framework?: string): UIIRProgramNode;
/**
 * Public Inspect API: Generates multi-stage AST, Reactivity Graph, and DOM inspection.
 */
export declare function inspect(source: string): DocumentInspection;
/**
 * Public Format API: Deterministically formats LM code into canonical S-expression style.
 */
export declare function format(source: string, options?: FormatterOptions): string;
/**
 * Public Diagnose API: Validates LM code and returns rich compiler diagnostics.
 */
export declare function diagnose(source: string, options?: DiagnosticOptions): LSPDiagnostic[];
export * from './runtime';
export * from './sdk';
export * from './cli';
export * from './common/config';
export * from './telemetry/metrics';
