import { UIIRProgramNode } from './types';

/**
 * Common UI IR Serializer / Deserializer
 */
export class UIIRSerializer {
  static toJSON(program: UIIRProgramNode): string {
    return JSON.stringify(program, null, 2);
  }

  static fromJSON(jsonStr: string): UIIRProgramNode {
    return JSON.parse(jsonStr) as UIIRProgramNode;
  }

  static toSummaryString(program: UIIRProgramNode): string {
    const lines: string[] = [
      `UIIR Program: root=${program.rootComponent}, components=${program.components.length}`,
    ];
    for (const comp of program.components) {
      lines.push(`  Component: ${comp.name}`);
      lines.push(`    State: ${comp.stateDeclarations.map((s) => s.stateName).join(', ') || 'none'}`);
      lines.push(
        `    Derived: ${comp.derivedDeclarations.map((d) => `${d.derivedName}:(${d.expression})`).join(', ') || 'none'}`
      );
      lines.push(`    Body nodes: ${comp.body.length}`);
    }
    return lines.join('\n');
  }
}
