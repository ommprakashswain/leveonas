import { PatchOperation, PatchOperationType, normalizePatchOperationType } from '../patch-generator/types';
import { ExecutionContext } from './types';
import { HandlerRegistry } from './registry';
import { PatchExecutorError } from './errors';
import * as Handlers from './handlers';

export class OperationDispatcher {
  private registry = new HandlerRegistry();

  constructor() {
    this.registry.register(PatchOperationType.CREATE_NODE, Handlers.handleInsertNode);
    this.registry.register(PatchOperationType.INSERT_CHILD, Handlers.handleInsertNode);
    this.registry.register(PatchOperationType.REMOVE_CHILD, Handlers.handleRemoveNode);
    this.registry.register(PatchOperationType.REMOVE_NODE, Handlers.handleRemoveNode);
    this.registry.register(PatchOperationType.MOVE_CHILD, Handlers.handleMoveNode);
    this.registry.register(PatchOperationType.REPLACE_NODE, Handlers.handleReplaceNode);
    this.registry.register(PatchOperationType.UPDATE_TEXT, Handlers.handleUpdateText);
    this.registry.register(PatchOperationType.SET_ATTRIBUTE, Handlers.handleUpdateProperty);
    this.registry.register(PatchOperationType.REMOVE_ATTRIBUTE, Handlers.handleRemoveProperty);
    this.registry.register(PatchOperationType.REPLACE_CHILDREN, Handlers.handleReplaceChildren);
    this.registry.register(PatchOperationType.NO_OP, Handlers.handleNoOp);
  }

  dispatch(operation: PatchOperation, context: ExecutionContext) {
    const canonicalType = normalizePatchOperationType(operation.operation);
    const handler = this.registry.get(canonicalType);
    if (!handler) {
      throw new PatchExecutorError(`No handler registered for operation type: ${operation.operation}`);
    }
    handler(operation, context);
  }
}
