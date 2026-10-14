import { ReactComponentDeclarationNode, ReactProgramNode } from './ast';
import { ReactLMDiagnostic } from './types';

export interface ReactValidationResult {
  isValid: boolean;
  isIncomplete: boolean;
  diagnostics: ReactLMDiagnostic[];
}

export function validateReactProgram(program: ReactProgramNode, isFinal: boolean = false): ReactValidationResult {
  const diagnostics: ReactLMDiagnostic[] = [];

  if (program.components.length === 0) {
    if (isFinal) {
      diagnostics.push({
        message: 'React program contains no component declarations.',
        severity: 'warning',
        code: 'REACT_EMPTY_PROGRAM',
        sourceLocation: {
          startLine: 1,
          startColumn: 1,
          startOffset: 0,
          endLine: 1,
          endColumn: 1,
          endOffset: 0,
        },
      });
    }
  }

  // Check component name uniqueness
  const seenNames = new Set<string>();
  for (const comp of program.components) {
    if (seenNames.has(comp.name)) {
      diagnostics.push({
        message: `Duplicate component declaration '${comp.name}'.`,
        severity: 'error',
        code: 'REACT_DUPLICATE_COMPONENT',
        sourceLocation: comp.sourceLocation || {
          startLine: 1,
          startColumn: 1,
          startOffset: 0,
          endLine: 1,
          endColumn: 1,
          endOffset: 0,
        },
      });
    }
    seenNames.add(comp.name);
  }

  const hasFatalErrors = diagnostics.some((d) => d.severity === 'error');

  return {
    isValid: !hasFatalErrors,
    isIncomplete: false,
    diagnostics,
  };
}

export class ReactLMValidator {
  public static validate(program: ReactProgramNode, isFinal: boolean = false): ReactValidationResult {
    return validateReactProgram(program, isFinal);
  }
}
