import { PatchOperation } from '../patch-generator/types';
import { ASTNode, ComponentNode } from '../../../compiler/ast/nodes';
import { ExecutionContext } from './types';
import { OperationDispatcher } from './dispatcher';
import { PatchExecutorError } from './errors';

export class PatchExecutor {
  private dispatcher = new OperationDispatcher();
  private context: ExecutionContext;
  private nodeMap = new Map<string, ASTNode>();
  private removedNodeIds = new Set<string>();

  constructor(public root: ASTNode) {
    this.context = {
      getNode: (id) => this.nodeMap.get(id),
      setNode: (id, node) => {
        this.nodeMap.set(id, node);
        this.removedNodeIds.delete(id);
      },
      deleteNode: (id) => {
        this.nodeMap.delete(id);
        this.removedNodeIds.add(id);
      },
      isRemoved: (id) => this.removedNodeIds.has(id),
      markRemoved: (id) => this.removedNodeIds.add(id),
      root
    };
    this.buildIndex(root);
  }

  private buildIndex(node: ASTNode) {
    this.context.setNode(node.id, node);
    if ((node as ComponentNode).children) {
      (node as ComponentNode).children.forEach(c => this.buildIndex(c));
    }
  }

  /**
   * Executes a sequence of patch operations with sequential fail-fast atomicity.
   * If any operation fails, throws immediately, reporting which operation failed,
   * without silently continuing.
   */
  execute(operations: PatchOperation[]) {
    for (let i = 0; i < operations.length; i++) {
      const op = operations[i];
      try {
        this.dispatcher.dispatch(op, this.context);
      } catch (e) {
        if (e instanceof PatchExecutorError) {
          throw e;
        }
        throw new PatchExecutorError(
          `Execution failed at operation [${i}] ${op.operation} on node ${op.nodeId}: ${(e as Error).message}`
        );
      }
    }
  }

  getRoot(): ASTNode {
    return this.context.root;
  }
}
