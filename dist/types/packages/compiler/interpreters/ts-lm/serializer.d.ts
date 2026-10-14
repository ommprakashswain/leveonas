import { TSProgramNode } from './ast';
export declare class TSLMSerializer {
    /**
     * Converts a TSProgramNode to a compact JSON string representation.
     */
    static toJSON(program: TSProgramNode): string;
    /**
     * Parses a JSON string back into a TSProgramNode.
     */
    static fromJSON(json: string): TSProgramNode;
    /**
     * Formats a TSProgramNode into a human-readable debug summary.
     */
    static toDebugString(program: TSProgramNode): string;
}
