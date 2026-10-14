import { PatchOperation } from './types';
export declare class Patch {
    private operations;
    add(operation: PatchOperation): void;
    getOperations(sortDeterministic?: boolean): PatchOperation[];
    isEmpty(): boolean;
    clear(): void;
}
