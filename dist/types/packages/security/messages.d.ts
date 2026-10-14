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
export type LeveonasMessageType = 'leveonas:init' | 'leveonas:ready' | 'leveonas:patch' | 'leveonas:event' | 'leveonas:resize' | 'leveonas:reset' | 'leveonas:error' | 'leveonas:heartbeat' | 'leveonas:abort';
export declare const VALID_MESSAGE_TYPES: Set<string>;
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
export declare function isMessageSourceValid(eventSource: MessageEventSource | null, expectedSource: MessageEventSource | null | Window): boolean;
/**
 * Validates and parses an incoming postMessage data payload.
 */
export declare function validateIncomingMessage<T = unknown>(data: unknown, options?: {
    maxBytes?: number;
    allowedTypes?: Set<string>;
    requireSessionId?: boolean;
}): MessageValidationResult<T>;
