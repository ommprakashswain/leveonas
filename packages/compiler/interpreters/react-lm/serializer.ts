import { ReactProgramNode } from './ast';

export class ReactLMSerializer {
  public static toJSON(program: ReactProgramNode): string {
    return JSON.stringify(program);
  }

  public static fromJSON(json: string): ReactProgramNode {
    return JSON.parse(json);
  }

  public static toDebugString(program: ReactProgramNode): string {
    const lines: string[] = [`ReactProgram (${program.components.length} components):`];
    for (const comp of program.components) {
      lines.push(`  Component ${comp.name} (${comp.id}):`);
      if (comp.stateDeclarations.length > 0) {
        lines.push(
          `    States: ${comp.stateDeclarations.map((s) => `${s.stateName}=${JSON.stringify(s.initialValue)}`).join(', ')}`
        );
      }
      lines.push(`    Body elements: ${comp.body.length}`);
    }
    return lines.join('\n');
  }
}
