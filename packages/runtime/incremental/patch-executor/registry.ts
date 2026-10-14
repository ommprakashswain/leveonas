import { PatchOperationType } from '../patch-generator/types';
import { OperationHandler } from './types';
import { PatchExecutorError } from './errors';

export class HandlerRegistry {
  private handlers = new Map<PatchOperationType, OperationHandler>();

  register(type: PatchOperationType, handler: OperationHandler) {
    this.handlers.set(type, handler);
  }

  get(type: PatchOperationType): OperationHandler | undefined {
    return this.handlers.get(type);
  }
}
