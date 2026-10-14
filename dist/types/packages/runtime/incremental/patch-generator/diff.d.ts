import { ASTNode } from '../../../compiler/ast/nodes';
import { Patch } from './patch';
import { SerializedNode } from './types';
export declare function serializeASTNode(node: ASTNode): SerializedNode;
export declare class DiffEngine {
    private patch;
    private newToOldIdMap;
    private oldToNewIdMap;
    constructor(patch: Patch);
    /**
     * Resolves the live ID (the ID known to the live DOM / existing AST) for a given node or node ID.
     * - Matched existing node → Old/Live node ID
     * - Genuinely new node → New node ID
     */
    resolveLiveId(nodeOrId: ASTNode | string): string;
    /**
     * Centralized ID resolution helper:
     * Matched existing node → Old ID
     * New node → New ID
     */
    getPatchTargetId(oldNode?: ASTNode | null, newNode?: ASTNode | null): string;
    diff(oldNode: ASTNode, newNode: ASTNode, indexInParent?: number, liveParentId?: string): void;
    private diffProperties;
    private diffChildren;
}
