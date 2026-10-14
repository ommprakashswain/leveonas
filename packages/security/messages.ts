/**
 * Leveonas Centralized PostMessage Security & Envelope Validation
 *
 * Provides bidirectional validation for communication across the host parent
 * and the sandboxed iframe.
 *
 * Key Security Design:
 * - The sandboxed iframe uses `sandbox="allow-scripts"` WITHOUT `allow-same-origin`.
 * - Therefore, the iframe has an opaque ('null') origin.
 * - Checking `event.origin === "*"` does NOT provide authentication.
 * - True isolation and authentication relies on directional source checking:
 *     - Host Parent: `event.source === expectedIframe.contentWindow`
 *     - Iframe: `event.source === window.parent`
 */

import { DEFAULT_SECURITY_LIMITS } from './limits';

export type LeveonasMessageType =
  | 'leveonas:init'
  | 'leveonas:ready'
  | 'leveonas:patch'
  | 'leveonas:event'
  | 'leveonas:resize'
  | 'leveonas:reset'
  | 'leveonas:error'
  | 'leveonas:heartbeat'
  | 'leveonas:abort';

export const VALID_MESSAGE_TYPES = new Set<string>([
  'leveonas:init',
  'leveonas:ready',
  'leveonas:patch',
  'leveonas:event',
  'leveonas:resize',
  'leveonas:reset',
  'leveonas:error',
  'leveonas:heartbeat',
  'leveonas:abort',
]);

export interface LeveonasMessageEnvelope<T = unknown> {
  type: LeveonasMessageType | string;
  payload?: T;
  sessionId?: string;
  timestamp?: number;
  [key: string]: unknown;
}

export interface MessageValidationResult<T = unknown> {
  isValid: boolean;
  message?: LeveonasMessageEnvelope<T>;
  error?: string;
}

/**
 * Validates whether an incoming postMessage event originated from the trusted source window.
 */
export function isMessageSourceValid(
  eventSource: MessageEventSource | null,
  expectedSource: MessageEventSource | null | Window
): boolean {
  if (!eventSource || !expectedSource) return false;
  return eventSource === expectedSource;
}

/**
 * Validates and parses an incoming postMessage data payload.
 */
export function validateIncomingMessage<T = unknown>(
  data: unknown,
  options: {
    maxBytes?: number;
    allowedTypes?: Set<string>;
    requireSessionId?: boolean;
  } = {}
): MessageValidationResult<T> {
  if (!data || typeof data !== 'object') {
    return { isValid: false, error: 'Message data must be a non-null object' };
  }

  // Prevent prototype pollution attacks in message envelope
  if (
    Object.prototype.hasOwnProperty.call(data, '__proto__') ||
    Object.prototype.hasOwnProperty.call(data, 'constructor') ||
    Object.prototype.hasOwnProperty.call(data, 'prototype')
  ) {
    return { isValid: false, error: 'Prototype pollution vector detected in message envelope' };
  }

  const msg = data as Record<string, unknown>;

  // Check type property
  if (typeof msg.type !== 'string' || !msg.type.trim()) {
    return { isValid: false, error: 'Missing or invalid message type' };
  }

  const allowedTypes = options.allowedTypes || VALID_MESSAGE_TYPES;
  if (!allowedTypes.has(msg.type)) {
    return { isValid: false, error: `Unrecognized message type: ${msg.type}` };
  }

  // Check size limit if serialized
  const maxBytes = options.maxBytes ?? DEFAULT_SECURITY_LIMITS.maxMessageBytes;
  let estimatedSize = 0;
  try {
    const serialized = JSON.stringify(data);
    estimatedSize = typeof Buffer !== 'undefined' ? Buffer.byteLength(serialized, 'utf-8') : serialized.length;
  } catch {
    return { isValid: false, error: 'Message payload cannot be safely serialized' };
  }

  if (estimatedSize > maxBytes) {
    return {
      isValid: false,
      error: `Message size (${estimatedSize} bytes) exceeds limit (${maxBytes} bytes)`,
    };
  }

  if (options.requireSessionId && (!msg.sessionId || typeof msg.sessionId !== 'string')) {
    return { isValid: false, error: 'Message requires a valid sessionId' };
  }

  return {
    isValid: true,
    message: data as LeveonasMessageEnvelope<T>,
  };
}
