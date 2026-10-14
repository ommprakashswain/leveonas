import { VueLMDiagnostic } from './types';
import { VueNodeKind, VueProgramNode } from './ast';

export class VueLMValidator {
  public static validate(program: VueProgramNode): VueLMDiagnostic[] {
    const diagnostics: VueLMDiagnostic[] = [];

    if (!program.components || program.components.length === 0) {
      diagnostics.push({
        code: 'VUE_EMPTY_PROGRAM',
        message: 'Vue-LM program contains no component declarations',
        severity: 'warning',
        sourceLocation: program.sourceLocation || {
          startLine: 1,
          startColumn: 1,
          startOffset: 0,
          endLine: 1,
          endColumn: 1,
          endOffset: 0,
        },
        suggestion: 'Declare at least one component, e.g. component(App)(...)',
      });
      return diagnostics;
    }

    const seenComponents = new Set<string>();

    for (const comp of program.components) {
      if (seenComponents.has(comp.name)) {
        diagnostics.push({
          code: 'VUE_DUPLICATE_COMPONENT',
          message: `Duplicate component declaration '${comp.name}'`,
          severity: 'error',
          sourceLocation: comp.sourceLocation || {
            startLine: 1,
            startColumn: 1,
            startOffset: 0,
            endLine: 1,
            endColumn: 1,
            endOffset: 0,
          },
          suggestion: `Rename one of the '${comp.name}' component declarations`,
        });
      }
      seenComponents.add(comp.name);

      // Check state and computed name collisions
      const seenState = new Set<string>();
      for (const s of comp.stateDeclarations) {
        if (seenState.has(s.stateName)) {
          diagnostics.push({
            code: 'VUE_DUPLICATE_STATE',
            message: `Duplicate reactive state '${s.stateName}' in component '${comp.name}'`,
            severity: 'error',
            sourceLocation: s.sourceLocation || comp.sourceLocation || {
              startLine: 1,
              startColumn: 1,
              startOffset: 0,
              endLine: 1,
              endColumn: 1,
              endOffset: 0,
            },
          });
        }
        seenState.add(s.stateName);
      }

      for (const c of comp.computedDeclarations) {
        if (seenState.has(c.computedName)) {
          diagnostics.push({
            code: 'VUE_STATE_COMPUTED_COLLISION',
            message: `Computed value '${c.computedName}' collides with state in component '${comp.name}'`,
            severity: 'error',
            sourceLocation: c.sourceLocation || comp.sourceLocation || {
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
    }

    return diagnostics;
  }
}
