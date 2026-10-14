import { ASTNode } from './nodes';
export declare class ASTPrinter {
    static print(node: ASTNode, indentLevel?: number): string;
    static serialize(node: ASTNode): string;
}
