import { PatchOperation, PatchOperationType, normalizePatchOperationType } from './types';

export interface CompactPatchOperation {
  op: string;
  n: string;
  p?: string;
  i?: number;
  d?: any;
  t?: number;
}

export class PatchSerializer {
  static serialize(operations: PatchOperation[]): string {
    return this.toJSON(operations);
  }

  static deserialize(json: string): PatchOperation[] {
    return this.fromJSON(json);
  }

  static toJSON(operations: PatchOperation[]): string {
    return JSON.stringify(operations);
  }

  /**
   * Deterministic logical JSON representation that excludes transport timestamps
   * and normalizes operation types for deterministic testing and snapshotting.
   */
  static toLogicalJSON(operations: PatchOperation[]): string {
    const logical = operations.map(op => {
      const copy: Record<string, any> = {
        operation: normalizePatchOperationType(op.operation),
        nodeId: op.nodeId,
      };
      if (op.parentId !== undefined) copy.parentId = op.parentId;
      if (op.index !== undefined) copy.index = op.index;
      if (op.payload !== undefined) copy.payload = op.payload;
      return copy;
    });
    return JSON.stringify(logical);
  }

  static fromJSON(json: string): PatchOperation[] {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) {
      throw new Error('Invalid patch JSON: expected array of operations');
    }
    return parsed.map((item: any) => {
      // Handle compact representation
      if (item.op !== undefined && item.n !== undefined) {
        const op: PatchOperation = {
          operation: normalizePatchOperationType(item.op),
          nodeId: item.n,
        };
        if (item.p !== undefined) op.parentId = item.p;
        if (item.i !== undefined) op.index = item.i;
        if (item.d !== undefined) op.payload = item.d;
        if (item.t !== undefined) op.timestamp = item.t;
        return op;
      }
      return {
        ...item,
        operation: normalizePatchOperationType(item.operation),
      } as PatchOperation;
    });
  }

  static toCompactJSON(operations: PatchOperation[]): string {
    const compact: CompactPatchOperation[] = operations.map(op => {
      const c: CompactPatchOperation = {
        op: normalizePatchOperationType(op.operation),
        n: op.nodeId,
      };
      if (op.parentId !== undefined) c.p = op.parentId;
      if (op.index !== undefined) c.i = op.index;
      if (op.payload !== undefined) c.d = op.payload;
      if (op.timestamp !== undefined) c.t = op.timestamp;
      return c;
    });
    return JSON.stringify(compact);
  }
}

