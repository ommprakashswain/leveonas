import {
  PatchOperation,
  PatchOperationType,
  normalizePatchOperationType,
} from './types';
import { isAttributeSafe } from '../../../security/attributes';
import { DEFAULT_SECURITY_LIMITS, LeveonasSecurityLimits } from '../../../security/limits';

const VALID_OPERATION_TYPES = new Set<string>(Object.values(PatchOperationType));

export class PatchValidationError extends Error {
  constructor(message: string) {
    super(`[PatchValidation] ${message}`);
    this.name = 'PatchValidationError';
  }
}

/**
 * Validates whether an attribute name and value are safe from arbitrary script execution.
 */
export function isAttributePayloadSafe(name: string, value: unknown): boolean {
  return isAttributeSafe(name, value);
}

/**
 * Validates a single patch operation shape, limits, and security constraints.
 */
export function validatePatchOperation(
  op: unknown,
  index: number,
  limits: LeveonasSecurityLimits = DEFAULT_SECURITY_LIMITS
): PatchOperation {
  if (!op || typeof op !== 'object' || Array.isArray(op)) {
    throw new PatchValidationError(`Operation at index ${index} must be an object`);
  }

  // Prototype pollution prevention
  if (
    Object.prototype.hasOwnProperty.call(op, '__proto__') ||
    Object.prototype.hasOwnProperty.call(op, 'constructor') ||
    Object.prototype.hasOwnProperty.call(op, 'prototype')
  ) {
    throw new PatchValidationError(
      `Operation at index ${index} rejected due to prototype pollution payload`
    );
  }

  const rawOp = op as Record<string, any>;

  if (typeof rawOp.operation !== 'string' || !rawOp.operation.trim()) {
    throw new PatchValidationError(`Operation at index ${index} has missing or non-string 'operation' property`);
  }

  const normalizedType = normalizePatchOperationType(rawOp.operation);
  if (!VALID_OPERATION_TYPES.has(normalizedType)) {
    throw new PatchValidationError(
      `Operation at index ${index} has unknown operation type: '${rawOp.operation}'`
    );
  }

  if (typeof rawOp.nodeId !== 'string' || !rawOp.nodeId.trim()) {
    throw new PatchValidationError(
      `Operation [${index}] (${normalizedType}) requires a non-empty string 'nodeId'`
    );
  }

  if (rawOp.nodeId.length > 256 || /[\u0000-\u001F\u007F-\u009F]/.test(rawOp.nodeId)) {
    throw new PatchValidationError(
      `Operation [${index}] (${normalizedType}) contains invalid nodeId format`
    );
  }

  // parentId validation
  if (rawOp.parentId !== undefined && rawOp.parentId !== null) {
    if (typeof rawOp.parentId !== 'string') {
      throw new PatchValidationError(
        `Operation [${index}] (${normalizedType}) 'parentId' must be a string if present`
      );
    }
  }

  // index validation
  if (rawOp.index !== undefined && rawOp.index !== null) {
    if (
      typeof rawOp.index !== 'number' ||
      !Number.isInteger(rawOp.index) ||
      rawOp.index < 0
    ) {
      throw new PatchValidationError(
        `Operation [${index}] (${normalizedType}) 'index' must be a non-negative integer if present`
      );
    }
  }

  // Specific operation payload checks
  switch (normalizedType) {
    case PatchOperationType.UPDATE_TEXT: {
      const textVal = rawOp.payload?.text ?? rawOp.payload;
      if (
        textVal !== undefined &&
        typeof textVal !== 'string' &&
        typeof textVal !== 'number' &&
        typeof textVal !== 'boolean'
      ) {
        throw new PatchValidationError(
          `Operation [${index}] (UPDATE_TEXT) payload must specify valid text content`
        );
      }
      if (typeof textVal === 'string' && textVal.length > limits.maxTextLength) {
        throw new PatchValidationError(
          `Operation [${index}] (UPDATE_TEXT) text length (${textVal.length}) exceeds limit (${limits.maxTextLength})`
        );
      }
      break;
    }

    case PatchOperationType.SET_ATTRIBUTE: {
      const payload = rawOp.payload;
      if (!payload || typeof payload !== 'object') {
        throw new PatchValidationError(
          `Operation [${index}] (SET_ATTRIBUTE) requires a payload object with name and value`
        );
      }
      if (typeof payload.name !== 'string' || !payload.name.trim()) {
        throw new PatchValidationError(
          `Operation [${index}] (SET_ATTRIBUTE) payload requires non-empty string 'name'`
        );
      }
      const valStr = String(payload.value ?? '');
      if (valStr.length > limits.maxAttributeLength) {
        throw new PatchValidationError(
          `Operation [${index}] (SET_ATTRIBUTE) attribute length (${valStr.length}) exceeds limit (${limits.maxAttributeLength})`
        );
      }
      if (!isAttributePayloadSafe(payload.name, payload.value)) {
        throw new PatchValidationError(
          `Operation [${index}] (SET_ATTRIBUTE) contains rejected unsafe attribute '${payload.name}'`
        );
      }
      break;
    }

    case PatchOperationType.REMOVE_ATTRIBUTE: {
      const payload = rawOp.payload;
      const attrName = typeof payload === 'string' ? payload : payload?.name;
      if (typeof attrName !== 'string' || !attrName.trim()) {
        throw new PatchValidationError(
          `Operation [${index}] (REMOVE_ATTRIBUTE) requires non-empty string attribute name`
        );
      }
      break;
    }

    case PatchOperationType.CREATE_NODE: {
      const node = rawOp.payload?.node ?? rawOp.payload;
      if (!node || typeof node !== 'object') {
        throw new PatchValidationError(
          `Operation [${index}] (CREATE_NODE) requires payload.node object`
        );
      }
      if (typeof node.id !== 'string' || !node.id.trim()) {
        throw new PatchValidationError(
          `Operation [${index}] (CREATE_NODE) node requires valid string 'id'`
        );
      }
      if (typeof node.kind !== 'string' || !node.kind.trim()) {
        throw new PatchValidationError(
          `Operation [${index}] (CREATE_NODE) node requires valid string 'kind'`
        );
      }
      break;
    }

    case PatchOperationType.REPLACE_CHILDREN: {
      const children = rawOp.payload?.children;
      if (!Array.isArray(children)) {
        throw new PatchValidationError(
          `Operation [${index}] (REPLACE_CHILDREN) requires payload.children array`
        );
      }
      break;
    }

    case PatchOperationType.MOVE_CHILD: {
      if (
        rawOp.index === undefined ||
        rawOp.index === null ||
        typeof rawOp.index !== 'number' ||
        !Number.isInteger(rawOp.index) ||
        rawOp.index < 0
      ) {
        throw new PatchValidationError(
          `Operation [${index}] (MOVE_CHILD) requires a valid non-negative integer 'index'`
        );
      }
      break;
    }

    case PatchOperationType.SET_CSS_STYLESHEET: {
      if (!rawOp.payload || typeof rawOp.payload.cssText !== 'string') {
        throw new PatchValidationError(
          `Operation [${index}] (SET_CSS_STYLESHEET) requires payload.cssText string`
        );
      }
      break;
    }

    case PatchOperationType.CREATE_CSS_RULE:
    case PatchOperationType.UPDATE_CSS_RULE: {
      if (!rawOp.payload || typeof rawOp.payload.selector !== 'string' || !rawOp.payload.selector.trim()) {
        throw new PatchValidationError(
          `Operation [${index}] (${normalizedType}) requires non-empty string payload.selector`
        );
      }
      break;
    }

    case PatchOperationType.ADD_CSS_DECLARATION:
    case PatchOperationType.UPDATE_CSS_DECLARATION: {
      if (!rawOp.payload || typeof rawOp.payload.property !== 'string' || !rawOp.payload.property.trim()) {
        throw new PatchValidationError(
          `Operation [${index}] (${normalizedType}) requires non-empty string payload.property`
        );
      }
      if (rawOp.payload.value === undefined || rawOp.payload.value === null) {
        throw new PatchValidationError(
          `Operation [${index}] (${normalizedType}) requires payload.value`
        );
      }
      break;
    }

    case PatchOperationType.REMOVE_CSS_DECLARATION: {
      if (!rawOp.payload || typeof rawOp.payload.property !== 'string' || !rawOp.payload.property.trim()) {
        throw new PatchValidationError(
          `Operation [${index}] (REMOVE_CSS_DECLARATION) requires non-empty string payload.property`
        );
      }
      break;
    }

    case PatchOperationType.UPDATE_CSS_SELECTOR: {
      if (!rawOp.payload || typeof rawOp.payload.newSelector !== 'string' || !rawOp.payload.newSelector.trim()) {
        throw new PatchValidationError(
          `Operation [${index}] (UPDATE_CSS_SELECTOR) requires payload.newSelector`
        );
      }
      break;
    }

    case PatchOperationType.ADD_CSS_KEYFRAME:
    case PatchOperationType.UPDATE_CSS_KEYFRAME: {
      if (
        !rawOp.payload ||
        typeof rawOp.payload.keyframesName !== 'string' ||
        typeof rawOp.payload.keyframeSelector !== 'string' ||
        !rawOp.payload.keyframesName.trim() ||
        !rawOp.payload.keyframeSelector.trim()
      ) {
        throw new PatchValidationError(
          `Operation [${index}] (${normalizedType}) requires keyframesName and keyframeSelector`
        );
      }
      break;
    }

    // JS Patch Operations Validation
    case PatchOperationType.CREATE_JS_UNIT:
    case PatchOperationType.UPDATE_JS_UNIT: {
      if (!rawOp.payload || typeof rawOp.payload.code !== 'string') {
        throw new PatchValidationError(
          `Operation [${index}] (${normalizedType}) requires payload.code string`
        );
      }
      break;
    }

    case PatchOperationType.ATTACH_EVENT_HANDLER:
    case PatchOperationType.UPDATE_EVENT_HANDLER: {
      if (
        !rawOp.payload ||
        typeof rawOp.payload.eventName !== 'string' ||
        typeof rawOp.payload.targetSelector !== 'string' ||
        typeof rawOp.payload.handlerCode !== 'string'
      ) {
        throw new PatchValidationError(
          `Operation [${index}] (${normalizedType}) requires eventName, targetSelector, and handlerCode in payload`
        );
      }
      break;
    }

    case PatchOperationType.REMOVE_EVENT_HANDLER: {
      if (
        !rawOp.payload ||
        typeof rawOp.payload.eventName !== 'string' ||
        typeof rawOp.payload.targetSelector !== 'string'
      ) {
        throw new PatchValidationError(
          `Operation [${index}] (REMOVE_EVENT_HANDLER) requires eventName and targetSelector in payload`
        );
      }
      break;
    }

    case PatchOperationType.EXECUTE_JS_UNIT: {
      if (!rawOp.payload || typeof rawOp.payload.code !== 'string') {
        throw new PatchValidationError(
          `Operation [${index}] (EXECUTE_JS_UNIT) requires payload.code string`
        );
      }
      break;
    }

    case PatchOperationType.REMOVE_JS_UNIT:
    case PatchOperationType.CLEANUP_JS_SESSION:
      break;
  }

  return {
    operation: normalizedType,
    nodeId: rawOp.nodeId,
    parentId: rawOp.parentId,
    index: rawOp.index,
    payload: rawOp.payload,
    timestamp: typeof rawOp.timestamp === 'number' ? rawOp.timestamp : undefined,
  };
}

/**
 * Validates a full batch of patch operations.
 * Throws PatchValidationError if the batch or any operation within is malformed or exceeds limits.
 */
export function validatePatches(
  patches: unknown,
  limits: LeveonasSecurityLimits = DEFAULT_SECURITY_LIMITS
): PatchOperation[] {
  if (!Array.isArray(patches)) {
    throw new PatchValidationError('Patches must be an array');
  }

  if (patches.length > limits.maxPatchBatchSize) {
    throw new PatchValidationError(
      `Patch batch size (${patches.length}) exceeds maximum limit (${limits.maxPatchBatchSize})`
    );
  }

  const validated: PatchOperation[] = [];
  for (let i = 0; i < patches.length; i++) {
    validated.push(validatePatchOperation(patches[i], i, limits));
  }
  return validated;
}

/**
 * Non-throwing safe validation check for incoming patch batches.
 */
export function isPatchBatchValid(patches: unknown): patches is PatchOperation[] {
  try {
    validatePatches(patches);
    return true;
  } catch {
    return false;
  }
}
