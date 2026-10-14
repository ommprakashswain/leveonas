import { AngularProgramNode } from './ast';

export class AngularLMSerializer {
  static toJSON(program: AngularProgramNode): string {
    return JSON.stringify(program, null, 2);
  }

  static fromJSON(json: string): AngularProgramNode {
    return JSON.parse(json) as AngularProgramNode;
  }
}
