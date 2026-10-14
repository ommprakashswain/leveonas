import { PatchOperation } from '../patch-generator/types';
import { ASTNode } from '../../../compiler/ast/nodes';
export declare class PatchExecutor {
    root: ASTNode;
    private dispatcher;
    private context;
    private nodeMap;
    private removedNodeIds;
    constructor(root: ASTNode);
    private buildIndex;
    /**
     * Executes a sequence of patch operations with sequential fail-fast atomicity.
     * If any operation fails, throws immediately, reporting which operation failed,
     * without silently continuing.
     */
    execute(operations: PatchOperation[]): void;
    getRoot(): ASTNode;
}
