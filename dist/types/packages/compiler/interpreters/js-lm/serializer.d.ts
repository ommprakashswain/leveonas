import { JSProgramNode, JSUnitNode } from './ast';
export interface JSSerializerOptions {
    wrapInIIFE?: boolean;
    indent?: string;
}
/**
 * Serializes a single JSUnitNode to clean standard executable JavaScript.
 */
export declare function serializeJSUnit(unit: JSUnitNode): string;
/**
 * Serializes an entire JSProgramNode to standard executable JavaScript.
 */
export declare function serializeJSProgram(program: JSProgramNode, options?: JSSerializerOptions): string;
