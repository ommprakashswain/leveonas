import { PatchOperation, PatchOperationType } from './types';

const OPERATION_ORDER_PRIORITY: Record<string, number> = {
  [PatchOperationType.REMOVE_ATTRIBUTE]: 1,
  [PatchOperationType.SET_ATTRIBUTE]: 2,
  [PatchOperationType.UPDATE_TEXT]: 3,
  [PatchOperationType.REMOVE_CHILD]: 4,
  [PatchOperationType.REMOVE_NODE]: 4,
  [PatchOperationType.CREATE_NODE]: 5,
  [PatchOperationType.INSERT_CHILD]: 6,
  [PatchOperationType.MOVE_CHILD]: 7,
  [PatchOperationType.REPLACE_NODE]: 8,
  [PatchOperationType.REPLACE_CHILDREN]: 9,
  [PatchOperationType.NO_OP]: 99,
};

export class Patch {
  private operations: PatchOperation[] = [];

  add(operation: PatchOperation) {
    if (operation.operation !== PatchOperationType.NO_OP) {
      this.operations.push(operation);
    }
  }

  getOperations(sortDeterministic: boolean = true): PatchOperation[] {
    if (!sortDeterministic) {
      return [...this.operations];
    }
    return [...this.operations].sort((a, b) => {
      const prioA = OPERATION_ORDER_PRIORITY[a.operation] ?? 50;
      const prioB = OPERATION_ORDER_PRIORITY[b.operation] ?? 50;
      return prioA - prioB;
    });
  }

  isEmpty(): boolean {
    return this.operations.length === 0;
  }

  clear() {
    this.operations = [];
  }
}

