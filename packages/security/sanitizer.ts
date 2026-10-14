/**
 * Leveonas Error & Secret Sanitizer
 *
 * Prevents sensitive API keys, filesystem paths, provider responses,
 * and stack traces from leaking to clients or browser runtime.
 */

export interface SanitizedError {
  code: string;
  message: string;
  safeDetails?: Record<string, unknown>;
}

// Patterns that identify secrets and credentials
const SENSITIVE_KEY_PATTERNS = [
  /AIza[0-9A-Za-z-_]{16,}/g, // Google / Gemini API Keys
  /sk-[a-zA-Z0-9_-]{16,}/g, // OpenAI / Anthropic / general API keys
  /Bearer\s+[a-zA-Z0-9._~+/-]+=*/gi, // Bearer Tokens
  /(?:x-leveonas-key|x-user-llm-key|api[-_]?key|secret|password|token)\s*[:=]\s*["']?([a-zA-Z0-9-_]+)["']?/gi,
];

// Patterns that identify internal server filesystem paths
const SENSITIVE_PATH_PATTERNS = [
  /\/app\/applet\/[^\s:'"]+/g,
  /\/root\/[^\s:'"]+/g,
  /\/home\/[^\s:'"]+/g,
  /[A-Z]:\\[^\s:'"]+/g,
  /\/var\/[^\s:'"]+/g,
  /\/tmp\/[^\s:'"]+/g,
];

/**
 * Redacts any detected secrets or API tokens from a given text string.
 */
export function censorSecrets(text: string): string {
  if (typeof text !== 'string') return '';
  let sanitized = text;

  // Replace specific API key patterns
  sanitized = sanitized.replace(/AIza[0-9A-Za-z-_]{16,}/g, '[REDACTED_SECRET]');
  sanitized = sanitized.replace(/sk-[a-zA-Z0-9_-]{16,}/g, '[REDACTED_SECRET]');
  sanitized = sanitized.replace(/Bearer\s+[a-zA-Z0-9._~+/-]+=*/gi, 'Bearer [REDACTED_SECRET]');
  sanitized = sanitized.replace(
    /(?:x-leveonas-key|x-user-llm-key|api[-_]?key|secret|password|token)\s*[:=]\s*["']?([a-zA-Z0-9-_]+)["']?/gi,
    (match, capturedKey) => {
      if (capturedKey) {
        return match.replace(capturedKey, '[REDACTED_SECRET]');
      }
      return match;
    }
  );

  return sanitized;
}

/**
 * Strips internal server filesystem paths from text.
 */
export function censorPaths(text: string): string {
  if (typeof text !== 'string') return '';
  let sanitized = text;

  for (const pattern of SENSITIVE_PATH_PATTERNS) {
    sanitized = sanitized.replace(pattern, '[INTERNAL_PATH]');
  }

  return sanitized;
}

/**
 * Normalizes and sanitizes an error into a safe client response.
 */
export function sanitizeErrorMessage(
  err: unknown,
  isProduction: boolean = process.env.NODE_ENV === 'production'
): SanitizedError {
  if (!err) {
    return { code: 'UNKNOWN_ERROR', message: 'An unknown error occurred' };
  }

  let rawMessage = '';
  let errorCode = 'INTERNAL_ERROR';

  if (typeof err === 'string') {
    rawMessage = err;
  } else if (err instanceof Error) {
    rawMessage = err.message;
    if (err.name && err.name !== 'Error') {
      errorCode = err.name.toUpperCase();
    }
  } else if (typeof err === 'object') {
    const obj = err as Record<string, unknown>;
    rawMessage = String(obj.message || obj.error || JSON.stringify(err));
    if (typeof obj.code === 'string') {
      errorCode = obj.code;
    }
  }

  // Detect common error types
  if (rawMessage.includes('quota') || rawMessage.includes('QUOTA_EXCEEDED')) {
    return { code: 'QUOTA_EXCEEDED', message: 'API generation quota exceeded' };
  }
  if (rawMessage.includes('API key') || rawMessage.includes('401') || rawMessage.includes('unauthorized')) {
    return { code: 'UNAUTHORIZED', message: 'Invalid or missing API credentials' };
  }
  if (rawMessage.includes('rate limit') || rawMessage.includes('429')) {
    return { code: 'RATE_LIMITED', message: 'Too many requests; please try again shortly' };
  }
  if (rawMessage.includes('timeout') || rawMessage.includes('ETIMEDOUT') || rawMessage.includes('DEADLINE_EXCEEDED')) {
    return { code: 'STREAM_TIMEOUT', message: 'Stream generation timed out' };
  }
  if (rawMessage.includes('limit exceeded') || rawMessage.includes('LIMIT_EXCEEDED')) {
    return { code: 'LIMIT_EXCEEDED', message: 'Resource limit exceeded' };
  }

  // In production, always redact paths, secrets, and internal details
  const cleanMessage = censorPaths(censorSecrets(rawMessage));

  if (isProduction) {
    // If the error contains stack traces or internal errors, return a safe message
    if (cleanMessage.includes('node_modules') || cleanMessage.includes('at ') || cleanMessage.includes('ENOENT')) {
      return { code: errorCode, message: 'An unexpected processing error occurred' };
    }
    return { code: errorCode, message: cleanMessage };
  }

  return {
    code: errorCode,
    message: cleanMessage,
  };
}
