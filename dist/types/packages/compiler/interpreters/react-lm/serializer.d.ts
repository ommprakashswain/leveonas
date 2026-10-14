import { ReactProgramNode } from './ast';
export declare class ReactLMSerializer {
    static toJSON(program: ReactProgramNode): string;
    static fromJSON(json: string): ReactProgramNode;
    static toDebugString(program: ReactProgramNode): string;
}
