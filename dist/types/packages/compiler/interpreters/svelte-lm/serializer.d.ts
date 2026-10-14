import { SvelteProgramNode } from './ast';
export declare class SvelteLMSerializer {
    static toJSON(program: SvelteProgramNode): string;
    static fromJSON(jsonStr: string): SvelteProgramNode;
    static toCompactLM(program: SvelteProgramNode): string;
    private static serializeUINode;
}
