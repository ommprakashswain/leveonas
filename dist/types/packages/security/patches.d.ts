/**
 * Leveonas Hardened Patch Protocol Validator
 *
 * Validates streaming patch operations against:
 * - Prototype pollution payloads
 * - Unknown or malformed operation types
 * - Pathological nesting depth and oversized text/attributes
 * - Batch and cumulative count limits
 * - Script injection and unsafe URLs in attributes/text
 */
import { LeveonasSecurityLimits } from './limits';
export interface PatchSecurityValidationResult {
    isValid: boolean;
    error?: string;
    violations?: string[];
}
/**
 * Validates a single patch operation object for security compliance.
 */
export declare function validatePatchOperationSecurity(patch: unknown, limits?: LeveonasSecurityLimits, currentDepth?: number): PatchSecurityValidationResult;
/**
 * Validates an entire batch of patch operations.
 */
export declare function validatePatchBatchSecurity(patches: unknown[], limits?: LeveonasSecurityLimits): PatchSecurityValidationResult;
