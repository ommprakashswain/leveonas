import { VueProgramNode } from './ast';
export declare class VueLMSerializer {
    static toJSON(program: VueProgramNode): string;
    static fromJSON(jsonStr: string): VueProgramNode;
    static toCompactLM(program: VueProgramNode): string;
    private static serializeUINode;
}
