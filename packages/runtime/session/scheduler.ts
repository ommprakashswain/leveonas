import { PatchOperation } from '../incremental/patch-generator/types';

export class PatchScheduler {
  private queue: PatchOperation[] = [];
  private timer: any = null;

  constructor(
    private onFlush: (patches: PatchOperation[]) => void,
    private batchIntervalMs: number = 16
  ) {}

  enqueue(patch: PatchOperation) {
    this.queue.push(patch);
    if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.batchIntervalMs);
    }
  }

  enqueueImmediate(patch: PatchOperation) {
    this.queue.push(patch);
    this.flush();
  }

  flush() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    
    if (this.queue.length > 0) {
      const patchesToFlush = [...this.queue];
      this.queue = [];
      this.onFlush(patchesToFlush);
    }
  }

  destroy() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.queue = [];
  }
}
