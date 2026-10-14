import { JSProgramNode, JSUnitNode, JSNodeKind } from './ast';
import { JSLMDiagnostic } from './types';

/**
 * Structural validation of JS-LM AST before execution or diffing.
 */
export function validateJSAST(program: JSProgramNode): JSLMDiagnostic[] {
  const diagnostics: JSLMDiagnostic[] = [];

  if (!program || program.kind !== JSNodeKind.Program) {
    diagnostics.push({
      message: 'Invalid AST: Root must be a JSProgramNode',
      severity: 'error',
      code: 'INVALID_ROOT',
      sourceLocation: program?.sourceLocation || {
        startLine: 1,
        startColumn: 1,
        startOffset: 0,
        endLine: 1,
        endColumn: 1,
        endOffset: 0,
      },
    });
    return diagnostics;
  }

  const seenIds = new Set<string>();

  for (let i = 0; i < program.units.length; i++) {
    const unit = program.units[i];
    if (!unit.id) {
      diagnostics.push({
        message: `JSUnit at index ${i} is missing a deterministic ID`,
        severity: 'error',
        code: 'MISSING_UNIT_ID',
        sourceLocation: unit.sourceLocation || program.sourceLocation || {
          startLine: 1,
          startColumn: 1,
          startOffset: 0,
          endLine: 1,
          endColumn: 1,
          endOffset: 0,
        },
      });
    } else if (seenIds.has(unit.id)) {
      diagnostics.push({
        message: `Duplicate JSUnit ID detected: ${unit.id}`,
        severity: 'warning',
        code: 'DUPLICATE_UNIT_ID',
        sourceLocation: unit.sourceLocation || program.sourceLocation || {
          startLine: 1,
          startColumn: 1,
          startOffset: 0,
          endLine: 1,
          endColumn: 1,
          endOffset: 0,
        },
      });
    } else {
      seenIds.add(unit.id);
    }
  }

  return diagnostics;
}
