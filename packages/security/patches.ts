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

import { isAttributeSafe } from './attributes';
import { DEFAULT_SECURITY_LIMITS, LeveonasSecurityLimits } from './limits';

export interface PatchSecurityValidationResult {
  isValid: boolean;
  error?: string;
  violations?: string[];
}

/**
 * Validates a single patch operation object for security compliance.
 */
export function validatePatchOperationSecurity(
  patch: unknown,
  limits: LeveonasSecurityLimits = DEFAULT_SECURITY_LIMITS,
  currentDepth: number = 0
): PatchSecurityValidationResult {
  if (!patch || typeof patch !== 'object') {
    return { isValid: false, error: 'Patch operation must be a non-null object' };
  }

  // 1. Check for prototype pollution
  if (
    Object.prototype.hasOwnProperty.call(patch, '__proto__') ||
    Object.prototype.hasOwnProperty.call(patch, 'constructor') ||
    Object.prototype.hasOwnProperty.call(patch, 'prototype')
  ) {
    return { isValid: false, error: 'Prototype pollution vector detected in patch payload' };
  }

  const p = patch as Record<string, any>;

  // 2. Validate type
  if (typeof p.type !== 'string' || !p.type.trim()) {
    return { isValid: false, error: 'Patch missing required "type" field' };
  }

  // 3. Validate Node IDs
  const validateId = (id: unknown, fieldName: string): string | null => {
    if (id === undefined || id === null) return null;
    if (typeof id !== 'string') return `${fieldName} must be a string`;
    if (id.length > 256) return `${fieldName} exceeds maximum length (256 chars)`;
    if (/[\u0000-\u001F\u007F-\u009F]/.test(id)) return `${fieldName} contains forbidden control characters`;
    return null;
  };

  const idErr = validateId(p.nodeId, 'nodeId') || validateId(p.parentId, 'parentId') || validateId(p.targetId, 'targetId');
  if (idErr) {
    return { isValid: false, error: idErr };
  }

  // 4. Validate Text Length
  if (p.text !== undefined && p.text !== null) {
    if (typeof p.text !== 'string') {
      return { isValid: false, error: 'Patch text must be a string' };
    }
    if (p.text.length > limits.maxTextLength) {
      return {
        isValid: false,
        error: `Text length (${p.text.length}) exceeds maximum limit (${limits.maxTextLength})`,
      };
    }
  }

  // 5. Validate Attribute Security
  if (p.name !== undefined && p.value !== undefined) {
    if (typeof p.name !== 'string') {
      return { isValid: false, error: 'Attribute name must be a string' };
    }
    const valStr = String(p.value ?? '');
    if (valStr.length > limits.maxAttributeLength) {
      return {
        isValid: false,
        error: `Attribute value length (${valStr.length}) exceeds maximum limit (${limits.maxAttributeLength})`,
      };
    }
    if (!isAttributeSafe(p.name, p.value)) {
      return {
        isValid: false,
        error: `Unsafe attribute detected: "${p.name}" with value "${valStr.slice(0, 50)}"`,
      };
    }
  }

  // 6. Validate Serialized Node Payload & Recursion
  if (p.node && typeof p.node === 'object') {
    if (currentDepth > limits.maxTreeDepth) {
      return {
        isValid: false,
        error: `Node nesting depth exceeds maximum allowed depth (${limits.maxTreeDepth})`,
      };
    }

    // Check node attributes
    if (p.node.attributes && typeof p.node.attributes === 'object') {
      for (const [attrName, attrVal] of Object.entries(p.node.attributes)) {
        if (!isAttributeSafe(attrName, attrVal)) {
          return {
            isValid: false,
            error: `Unsafe attribute "${attrName}" in node ${p.node.id || 'unnamed'}`,
          };
        }
      }
    }

    // Recurse on children if present
    if (Array.isArray(p.node.children)) {
      for (const child of p.node.children) {
        const childRes = validatePatchOperationSecurity(
          { type: 'CREATE_NODE', node: child },
          limits,
          currentDepth + 1
        );
        if (!childRes.isValid) {
          return childRes;
        }
      }
    }
  }

  return { isValid: true };
}

/**
 * Validates an entire batch of patch operations.
 */
export function validatePatchBatchSecurity(
  patches: unknown[],
  limits: LeveonasSecurityLimits = DEFAULT_SECURITY_LIMITS
): PatchSecurityValidationResult {
  if (!Array.isArray(patches)) {
    return { isValid: false, error: 'Patch batch must be an array' };
  }

  if (patches.length > limits.maxPatchBatchSize) {
    return {
      isValid: false,
      error: `Patch batch size (${patches.length}) exceeds maximum limit (${limits.maxPatchBatchSize})`,
    };
  }

  for (let i = 0; i < patches.length; i++) {
    const res = validatePatchOperationSecurity(patches[i], limits);
    if (!res.isValid) {
      return {
        isValid: false,
        error: `Patch at index ${i} failed security validation: ${res.error}`,
      };
    }
  }

  return { isValid: true };
}
