import {
  UIIRComponentDeclarationNode,
  UIIRDerivedDeclarationNode,
  UIIRNode,
  UIIRNodeKind,
  UIIRProgramNode,
} from './types';

export interface UIIRDiagnostic {
  severity: 'error' | 'warning' | 'info';
  message: string;
  componentName?: string;
  nodeId?: string;
}

export class UIIRValidator {
  static validate(program: UIIRProgramNode): UIIRDiagnostic[] {
    const diagnostics: UIIRDiagnostic[] = [];

    if (!program.components || program.components.length === 0) {
      diagnostics.push({
        severity: 'error',
        message: 'Program contains no component declarations',
      });
      return diagnostics;
    }

    const componentNames = new Set<string>();
    for (const comp of program.components) {
      if (componentNames.has(comp.name)) {
        diagnostics.push({
          severity: 'error',
          message: `Duplicate component name: ${comp.name}`,
          componentName: comp.name,
        });
      }
      componentNames.add(comp.name);
      this.validateComponent(comp, diagnostics);
    }

    if (!componentNames.has(program.rootComponent)) {
      diagnostics.push({
        severity: 'error',
        message: `Root component '${program.rootComponent}' is not declared in program components`,
      });
    }

    return diagnostics;
  }

  private static validateComponent(comp: UIIRComponentDeclarationNode, diagnostics: UIIRDiagnostic[]): void {
    const stateNames = new Set<string>(comp.stateDeclarations.map((s) => s.stateName));
    const derivedNames = new Set<string>(comp.derivedDeclarations.map((d) => d.derivedName));

    // Check for collisions between state and derived names
    for (const name of stateNames) {
      if (derivedNames.has(name)) {
        diagnostics.push({
          severity: 'error',
          message: `Identifier '${name}' declared as both state and derived in component '${comp.name}'`,
          componentName: comp.name,
        });
      }
    }

    // Check for circular dependencies in derived declarations
    const derivedMap = new Map<string, UIIRDerivedDeclarationNode>();
    for (const d of comp.derivedDeclarations) {
      derivedMap.set(d.derivedName, d);
    }

    const visiting = new Set<string>();
    const visited = new Set<string>();

    const checkCycles = (name: string, path: string[]): boolean => {
      if (visiting.has(name)) {
        diagnostics.push({
          severity: 'error',
          message: `Circular dependency detected in derived values: ${path.join(' -> ')} -> ${name}`,
          componentName: comp.name,
        });
        return true;
      }
      if (visited.has(name)) return false;

      visiting.add(name);
      const node = derivedMap.get(name);
      if (node) {
        for (const dep of node.dependencies) {
          if (derivedMap.has(dep)) {
            checkCycles(dep, [...path, name]);
          }
        }
      }
      visiting.delete(name);
      visited.add(name);
      return false;
    };

    for (const name of derivedMap.keys()) {
      checkCycles(name, []);
    }

    // Validate body nodes
    for (const child of comp.body) {
      this.validateNode(child, comp.name, diagnostics);
    }
  }

  private static validateNode(node: UIIRNode, componentName: string, diagnostics: UIIRDiagnostic[]): void {
    if (!node || !node.kind) {
      diagnostics.push({
        severity: 'error',
        message: `Invalid node encountered in component '${componentName}'`,
        componentName,
      });
      return;
    }

    switch (node.kind) {
      case UIIRNodeKind.Element: {
        for (const c of node.children) {
          this.validateNode(c, componentName, diagnostics);
        }
        break;
      }
      case UIIRNodeKind.Fragment: {
        for (const c of node.children) {
          this.validateNode(c, componentName, diagnostics);
        }
        break;
      }
      case UIIRNodeKind.Conditional: {
        this.validateNode(node.thenBranch, componentName, diagnostics);
        if (node.elseBranch) {
          this.validateNode(node.elseBranch, componentName, diagnostics);
        }
        break;
      }
      case UIIRNodeKind.List: {
        this.validateNode(node.body, componentName, diagnostics);
        break;
      }
      default:
        break;
    }
  }
}
