import { UIIRProgramNode } from './types';
/**
 * Common UI IR Serializer / Deserializer
 */
export declare class UIIRSerializer {
    static toJSON(program: UIIRProgramNode): string;
    static fromJSON(jsonStr: string): UIIRProgramNode;
    static toSummaryString(program: UIIRProgramNode): string;
}
