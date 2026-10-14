/**
 * Leveonas Streaming-Aware Diagnostic Engine
 *
 * Exposes comprehensive compiler diagnostics for LM documents:
 * - Differentiates INCOMPLETE (streaming / typing in progress) from INVALID (fatal syntax error)
 * - Validates element abbreviations and canonical HTML tags
 * - Validates attribute abbreviations and canonical properties
 * - Validates state declarations, reactivity graphs, and computed dependencies
 * - Validates event bindings, list keys, and duplicate IDs
 * - Validates cross-framework feature compliance
 */
import { EmbeddedBlock, LSPDiagnostic } from './types';
export interface DiagnosticOptions {
    streaming?: boolean;
    validateReactivity?: boolean;
    validateProperties?: boolean;
}
export declare class LeveonasDiagnosticEngine {
    /**
     * Run full diagnostics on an LM document or embedded framework blocks.
     */
    static diagnose(documentText: string, options?: DiagnosticOptions): LSPDiagnostic[];
    /**
     * Diagnose a single embedded or top-level block.
     */
    static diagnoseBlock(block: EmbeddedBlock, fullDoc: string, options?: DiagnosticOptions): LSPDiagnostic[];
}
