import { TSProgramNode, TSUnitNode } from './ast';
import { TSLMDiagnostic } from './types';

// Optional dynamic reference to typescript compiler
let tsCompiler: any = null;
try {
  tsCompiler = require('typescript');
} catch {
  // TypeScript not available in minimal runtime
}

export interface TSValidationResult {
  isValid: boolean;
  isIncomplete: boolean;
  diagnostics: TSLMDiagnostic[];
}

/**
 * Validates TypeScript code syntax.
 * Distinguishes INCOMPLETE streaming state from genuine INVALID syntax.
 */
export function validateTSCode(code: string, isFinal: boolean = false): TSValidationResult {
  const trimmed = code.trim();
  if (!trimmed) {
    return { isValid: true, isIncomplete: false, diagnostics: [] };
  }

  if (tsCompiler && typeof tsCompiler.createSourceFile === 'function') {
    const sourceFile = tsCompiler.createSourceFile(
      'stream.ts',
      trimmed,
      tsCompiler.ScriptTarget?.Latest ?? 99,
      true,
      tsCompiler.ScriptKind?.TS ?? 3
    );

    const parseDiagnostics = (sourceFile as any).parseDiagnostics || [];
    const diagnostics: TSLMDiagnostic[] = [];

    let isIncomplete = false;

    for (const diag of parseDiagnostics) {
      // Check if error is due to unexpected EOF or incomplete expression
      const message = tsCompiler.flattenDiagnosticMessageText
        ? tsCompiler.flattenDiagnosticMessageText(diag.messageText, '\n')
        : String(diag.messageText);
      const isEofRelated =
        message.includes('expected') ||
        message.includes('Unterminated') ||
        message.includes('Unexpected end of text') ||
        diag.code === 1005 || // '{' or '}' or ';' expected
        diag.code === 1109 || // Expression expected
        diag.code === 1128; // Declaration or statement expected

      if (!isFinal && isEofRelated) {
        isIncomplete = true;
        continue;
      }

      const { line, character } = sourceFile.getLineAndCharacterOfPosition(diag.start || 0);

      diagnostics.push({
        message,
        severity: diag.category === (tsCompiler.DiagnosticCategory?.Error ?? 1) ? 'error' : 'warning',
        code: `TS${diag.code}`,
        sourceLocation: {
          startLine: line + 1,
          startColumn: character + 1,
          startOffset: diag.start || 0,
          endLine: line + 1,
          endColumn: character + (diag.length || 1) + 1,
          endOffset: (diag.start || 0) + (diag.length || 1),
        },
      });
    }

    const hasFatalErrors = diagnostics.some((d) => d.severity === 'error');

    return {
      isValid: !hasFatalErrors,
      isIncomplete,
      diagnostics,
    };
  }

  // Fallback heuristic validation when typescript package is not present
  const openBraces = (trimmed.match(/\{/g) || []).length;
  const closeBraces = (trimmed.match(/\}/g) || []).length;
  const openParens = (trimmed.match(/\(/g) || []).length;
  const closeParens = (trimmed.match(/\)/g) || []).length;

  const isIncomplete = openBraces > closeBraces || openParens > closeParens;
  return {
    isValid: true,
    isIncomplete: !isFinal && isIncomplete,
    diagnostics: [],
  };
}

/**
 * Validates a TSProgramNode.
 */
export function validateTSProgram(program: TSProgramNode, isFinal: boolean = false): TSValidationResult {
  const allDiagnostics: TSLMDiagnostic[] = [];
  let isIncomplete = false;

  for (const unit of program.units) {
    const res = validateTSCode(unit.code, isFinal && unit.isComplete);
    if (res.isIncomplete) {
      isIncomplete = true;
    }
    allDiagnostics.push(...res.diagnostics);
  }

  return {
    isValid: !allDiagnostics.some((d) => d.severity === 'error'),
    isIncomplete,
    diagnostics: allDiagnostics,
  };
}
