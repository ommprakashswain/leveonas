import { PatchOperation } from '../patch-generator/types';
import { PatchExecutor } from './executor';
export declare class BatchExecutor {
    private executor;
    constructor(executor: PatchExecutor);
    executeBatch(batches: PatchOperation[][]): void;
}
