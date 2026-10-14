import { SvelteLMDiagnostic } from './types';
import { SvelteNodeKind, SvelteProgramNode } from './ast';

export class SvelteLMValidator {
  public static validate(program: SvelteProgramNode): SvelteLMDiagnostic[] {
    const diagnostics: SvelteLMDiagnostic[] = [];

    if (!program.components || program.components.length === 0) {
      diagnostics.push({
        code: 'SVELTE_EMPTY_PROGRAM',
        message: 'Svelte-LM program contains no component declarations',
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
          code: 'SVELTE_DUPLICATE_COMPONENT',
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

      // Check state and reactive declaration name collisions
      const seenState = new Set<string>();
      for (const s of comp.stateDeclarations) {
        if (seenState.has(s.stateName)) {
          diagnostics.push({
            code: 'SVELTE_DUPLICATE_STATE',
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

      for (const r of comp.reactiveDeclarations) {
        if (seenState.has(r.reactiveName)) {
          diagnostics.push({
            code: 'SVELTE_STATE_REACTIVE_COLLISION',
            message: `Reactive declaration '${r.reactiveName}' collides with state variable in component '${comp.name}'`,
            severity: 'error',
            sourceLocation: r.sourceLocation || comp.sourceLocation || {
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
