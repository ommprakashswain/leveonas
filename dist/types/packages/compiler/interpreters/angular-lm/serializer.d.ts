import { AngularProgramNode } from './ast';
export declare class AngularLMSerializer {
    static toJSON(program: AngularProgramNode): string;
    static fromJSON(json: string): AngularProgramNode;
}
