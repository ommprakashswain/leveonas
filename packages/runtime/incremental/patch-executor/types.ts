import { PatchOperation } from '../patch-generator/types';
import { ASTNode } from '../../../compiler/ast/nodes';

export interface ExecutionContext {
  getNode(id: string): ASTNode | undefined;
  setNode(id: string, node: ASTNode): void;
  deleteNode(id: string): void;
  isRemoved(id: string): boolean;
  markRemoved(id: string): void;
  root: ASTNode;
}

export type OperationHandler = (
  operation: PatchOperation,
  context: ExecutionContext
) => void;
