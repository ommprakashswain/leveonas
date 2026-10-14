import { TSProgramNode, TSUnitNode } from './ast';

export class TSLMSerializer {
  /**
   * Converts a TSProgramNode to a compact JSON string representation.
   */
  public static toJSON(program: TSProgramNode): string {
    return JSON.stringify(program);
  }

  /**
   * Parses a JSON string back into a TSProgramNode.
   */
  public static fromJSON(json: string): TSProgramNode {
    return JSON.parse(json);
  }

  /**
   * Formats a TSProgramNode into a human-readable debug summary.
   */
  public static toDebugString(program: TSProgramNode): string {
    const lines: string[] = [`TSProgram (${program.units.length} units):`];

    for (let i = 0; i < program.units.length; i++) {
      const u = program.units[i];
      const status = u.isComplete ? 'COMPLETE' : 'INCOMPLETE';
      lines.push(
        `  [${i}] ${u.classification} ${u.unitKind} (${u.id}) [${status}]`
      );
      lines.push(`      TS: ${u.code.replace(/\n/g, ' ')}`);
      if (u.loweredCode) {
        lines.push(`      JS: ${u.loweredCode.replace(/\n/g, ' ')}`);
      }
    }

    return lines.join('\n');
  }
}
