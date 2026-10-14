import {
  AngularComponentDeclarationNode,
  AngularNodeKind,
  AngularProgramNode,
  AngularUINode,
} from './ast';
import { AngularLMDiagnostic } from './types';

export class AngularLMValidator {
  static validate(program: AngularProgramNode): AngularLMDiagnostic[] {
    const diagnostics: AngularLMDiagnostic[] = [];

    if (!program || program.kind !== AngularNodeKind.Program) {
      diagnostics.push({
        severity: 'error',
        message: 'Invalid AST: Root must be an AngularProgramNode',
      });
      return diagnostics;
    }

    if (!program.components || program.components.length === 0) {
      diagnostics.push({
        severity: 'warning',
        message: 'Angular program contains no component declarations',
      });
    }

    const componentNames = new Set<string>();
    for (const comp of program.components) {
      if (componentNames.has(comp.name)) {
        diagnostics.push({
          severity: 'error',
          message: `Duplicate component declaration: "${comp.name}"`,
          sourceLocation: comp.sourceLocation,
        });
      }
      componentNames.add(comp.name);
      this.validateComponent(comp, diagnostics);
    }

    return diagnostics;
  }

  private static validateComponent(
    comp: AngularComponentDeclarationNode,
    diagnostics: AngularLMDiagnostic[]
  ): void {
    const stateNames = new Set<string>();
    for (const s of comp.stateDeclarations) {
      if (stateNames.has(s.stateName)) {
        diagnostics.push({
          severity: 'error',
          message: `Duplicate state declaration "${s.stateName}" in component "${comp.name}"`,
          sourceLocation: s.sourceLocation,
        });
      }
      stateNames.add(s.stateName);
    }

    const derivedNames = new Set<string>();
    for (const d of comp.derivedDeclarations) {
      if (derivedNames.has(d.derivedName)) {
        diagnostics.push({
          severity: 'error',
          message: `Duplicate computed declaration "${d.derivedName}" in component "${comp.name}"`,
          sourceLocation: d.sourceLocation,
        });
      }
      derivedNames.add(d.derivedName);
    }

    const validateNode = (node: AngularUINode) => {
      if (!node) return;
      if (node.kind === AngularNodeKind.For) {
        if (!node.arrayExpr) {
          diagnostics.push({
            severity: 'error',
            message: `Angular @for missing array expression in component "${comp.name}"`,
            sourceLocation: node.sourceLocation,
          });
        }
      }
    };

    for (const child of comp.body) {
      validateNode(child);
    }
  }
}
