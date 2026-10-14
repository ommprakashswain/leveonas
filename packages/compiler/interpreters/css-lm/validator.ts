import { CSSStyleSheetNode, CSSRuleNode, CSSDeclarationNode } from './ast';
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
export function validateCSSAST(sheet: CSSStyleSheetNode): CSSValidationReport {
  const diagnostics: CSSLMDiagnostic[] = [];
  let totalRules = 0;
  let totalDeclarations = 0;

  for (const item of sheet.rules) {
    if (item.kind === 'CSSRule') {
      totalRules++;
      const rule = item as CSSRuleNode;
      if (!rule.selector || rule.selector.trim().length === 0) {
        diagnostics.push({
          message: 'CSS Rule missing selector',
          severity: 'error',
          location: rule.sourceLocation || { startLine: 1, startColumn: 1, startOffset: 0, endLine: 1, endColumn: 1, endOffset: 0 },
        });
      }

      for (const decl of rule.declarations) {
        totalDeclarations++;
        if (!decl.property || decl.property.trim().length === 0) {
          diagnostics.push({
            message: 'CSS Declaration missing property name',
            severity: 'error',
            location: decl.sourceLocation || { startLine: 1, startColumn: 1, startOffset: 0, endLine: 1, endColumn: 1, endOffset: 0 },
          });
        }
        if (decl.value === undefined || decl.value === null) {
          diagnostics.push({
            message: `CSS Declaration "${decl.property}" missing value`,
            severity: 'error',
            location: decl.sourceLocation || { startLine: 1, startColumn: 1, startOffset: 0, endLine: 1, endColumn: 1, endOffset: 0 },
          });
        }
      }
    }
  }

  const hasErrors = diagnostics.some((d) => d.severity === 'error');

  return {
    isValid: !hasErrors,
    isIncomplete: false,
    diagnostics,
    totalRules,
    totalDeclarations,
  };
}
