import { PatchOperation } from '../incremental/patch-generator/types';
export declare class PatchScheduler {
    private onFlush;
    private batchIntervalMs;
    private queue;
    private timer;
    constructor(onFlush: (patches: PatchOperation[]) => void, batchIntervalMs?: number);
    enqueue(patch: PatchOperation): void;
    enqueueImmediate(patch: PatchOperation): void;
    flush(): void;
    destroy(): void;
}
