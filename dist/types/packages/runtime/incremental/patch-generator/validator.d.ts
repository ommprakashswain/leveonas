import { PatchOperation } from './types';
import { LeveonasSecurityLimits } from '../../../security/limits';
export declare class PatchValidationError extends Error {
    constructor(message: string);
}
/**
 * Validates whether an attribute name and value are safe from arbitrary script execution.
 */
export declare function isAttributePayloadSafe(name: string, value: unknown): boolean;
/**
 * Validates a single patch operation shape, limits, and security constraints.
 */
export declare function validatePatchOperation(op: unknown, index: number, limits?: LeveonasSecurityLimits): PatchOperation;
/**
 * Validates a full batch of patch operations.
 * Throws PatchValidationError if the batch or any operation within is malformed or exceeds limits.
 */
export declare function validatePatches(patches: unknown, limits?: LeveonasSecurityLimits): PatchOperation[];
/**
 * Non-throwing safe validation check for incoming patch batches.
 */
export declare function isPatchBatchValid(patches: unknown): patches is PatchOperation[];
