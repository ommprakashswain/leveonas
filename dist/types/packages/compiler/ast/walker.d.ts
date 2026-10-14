import { ASTNode } from './nodes';
import { ASTVisitor } from './visitor';
export declare class ASTWalker {
    static walk(node: ASTNode, visitor: ASTVisitor): void;
}
