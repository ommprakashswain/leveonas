import { PatchOperation } from '../patch-generator/types';
import { PatchExecutor } from './executor';

export class BatchExecutor {
  constructor(private executor: PatchExecutor) {}

  executeBatch(batches: PatchOperation[][]) {
    for (const batch of batches) {
      this.executor.execute(batch);
    }
  }
}
