import { CSSStyleSheetNode } from './ast';
import { CSSLMDiagnostic } from './types';
export interface CSSValidationReport {
    isValid: boolean;
    isIncomplete: boolean;
    diagnostics: CSSLMDiagnostic[];
    totalRules: number;
    totalDeclarations: number;
}
/**
 * Validates a CSS AST or parser state.
 * Distinguishes:
 * - INCOMPLETE STREAM: valid partial state while LLM is generating.
 * - INVALID CSS-LM: syntax errors, unclosed invalid constructs, illegal characters.
 */
export declare function validateCSSAST(sheet: CSSStyleSheetNode): CSSValidationReport;
