import { PatchOperation } from './types';
export interface CompactPatchOperation {
    op: string;
    n: string;
    p?: string;
    i?: number;
    d?: any;
    t?: number;
}
export declare class PatchSerializer {
    static serialize(operations: PatchOperation[]): string;
    static deserialize(json: string): PatchOperation[];
    static toJSON(operations: PatchOperation[]): string;
    /**
     * Deterministic logical JSON representation that excludes transport timestamps
     * and normalizes operation types for deterministic testing and snapshotting.
     */
    static toLogicalJSON(operations: PatchOperation[]): string;
    static fromJSON(json: string): PatchOperation[];
    static toCompactJSON(operations: PatchOperation[]): string;
}
