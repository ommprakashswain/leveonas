"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/security/index.ts
var index_exports = {};
__export(index_exports, {
  DEFAULT_SECURITY_LIMITS: () => DEFAULT_SECURITY_LIMITS,
  FORBIDDEN_ATTRIBUTES: () => FORBIDDEN_ATTRIBUTES,
  LeveonasSecurityAuditor: () => LeveonasSecurityAuditor,
  URL_ATTRIBUTES: () => URL_ATTRIBUTES,
  VALID_MESSAGE_TYPES: () => VALID_MESSAGE_TYPES,
  censorPaths: () => censorPaths,
  censorSecrets: () => censorSecrets,
  getSecurityLimits: () => getSecurityLimits,
  isAttributeSafe: () => isAttributeSafe,
  isDangerousProtocol: () => isDangerousProtocol,
  isMessageSourceValid: () => isMessageSourceValid,
  isValidUrl: () => isValidUrl,
  normalizeAttributeName: () => normalizeAttributeName,
  normalizeUrlString: () => normalizeUrlString,
  sanitizeAttributes: () => sanitizeAttributes,
  sanitizeCssText: () => sanitizeCssText,
  sanitizeErrorMessage: () => sanitizeErrorMessage,
  sanitizeUrl: () => sanitizeUrl,
  validateIncomingMessage: () => validateIncomingMessage,
  validatePatchBatchSecurity: () => validatePatchBatchSecurity,
  validatePatchOperationSecurity: () => validatePatchOperationSecurity
});
module.exports = __toCommonJS(index_exports);

// packages/security/limits.ts
var DEFAULT_SECURITY_LIMITS = Object.freeze({
  maxPatchBatchSize: 500,
  maxPatchCount: 5e3,
  maxNodeCount: 1e4,
  maxTreeDepth: 64,
  maxAttributeLength: 4096,
  maxTextLength: 65536,
  maxMessageBytes: 1048576,
  // 1 MB
  maxStreamBytes: 5242880,
  // 5 MB
  maxGenerationDurationMs: 6e4,
  // 60s
  maxSessionDurationMs: 3e5,
  // 5 min
  maxPromptLength: 32768,
  // 32k chars
  maxTokensCeiling: 8192
});
function getSecurityLimits(overrides) {
  const env = typeof process !== "undefined" ? process.env || {} : {};
  const parseEnvInt = (key, fallback) => {
    const val = env[key];
    if (val && !isNaN(Number(val))) {
      const parsed = parseInt(val, 10);
      if (parsed > 0) return parsed;
    }
    return fallback;
  };
  return {
    maxPatchBatchSize: overrides?.maxPatchBatchSize ?? parseEnvInt("LEVEONAS_MAX_PATCH_BATCH_SIZE", DEFAULT_SECURITY_LIMITS.maxPatchBatchSize),
    maxPatchCount: overrides?.maxPatchCount ?? parseEnvInt("LEVEONAS_MAX_PATCH_COUNT", DEFAULT_SECURITY_LIMITS.maxPatchCount),
    maxNodeCount: overrides?.maxNodeCount ?? parseEnvInt("LEVEONAS_MAX_NODE_COUNT", DEFAULT_SECURITY_LIMITS.maxNodeCount),
    maxTreeDepth: overrides?.maxTreeDepth ?? parseEnvInt("LEVEONAS_MAX_TREE_DEPTH", DEFAULT_SECURITY_LIMITS.maxTreeDepth),
    maxAttributeLength: overrides?.maxAttributeLength ?? parseEnvInt("LEVEONAS_MAX_ATTRIBUTE_LENGTH", DEFAULT_SECURITY_LIMITS.maxAttributeLength),
    maxTextLength: overrides?.maxTextLength ?? parseEnvInt("LEVEONAS_MAX_TEXT_LENGTH", DEFAULT_SECURITY_LIMITS.maxTextLength),
    maxMessageBytes: overrides?.maxMessageBytes ?? parseEnvInt("LEVEONAS_MAX_MESSAGE_BYTES", DEFAULT_SECURITY_LIMITS.maxMessageBytes),
    maxStreamBytes: overrides?.maxStreamBytes ?? parseEnvInt("LEVEONAS_MAX_STREAM_BYTES", DEFAULT_SECURITY_LIMITS.maxStreamBytes),
    maxGenerationDurationMs: overrides?.maxGenerationDurationMs ?? parseEnvInt("LEVEONAS_MAX_GENERATION_DURATION_MS", DEFAULT_SECURITY_LIMITS.maxGenerationDurationMs),
    maxSessionDurationMs: overrides?.maxSessionDurationMs ?? parseEnvInt("LEVEONAS_MAX_SESSION_DURATION_MS", DEFAULT_SECURITY_LIMITS.maxSessionDurationMs),
    maxPromptLength: overrides?.maxPromptLength ?? parseEnvInt("LEVEONAS_MAX_PROMPT_LENGTH", DEFAULT_SECURITY_LIMITS.maxPromptLength),
    maxTokensCeiling: overrides?.maxTokensCeiling ?? parseEnvInt("LEVEONAS_MAX_TOKENS_CEILING", DEFAULT_SECURITY_LIMITS.maxTokensCeiling)
  };
}

// packages/security/urls.ts
var DEFAULT_ALLOWED_PROTOCOLS = ["http:", "https:", "mailto:", "tel:"];
function normalizeUrlString(url) {
  if (typeof url !== "string") return "";
  let normalized = url.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
  normalized = normalized.replace(/&#x([0-9a-fA-F]+);?/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16))).replace(/&#([0-9]+);?/g, (_, dec) => String.fromCharCode(parseInt(dec, 10))).replace(/&colon;/gi, ":").replace(/&tab;/gi, "").replace(/&newline;/gi, "");
  return normalized.trim();
}
function isDangerousProtocol(url) {
  const clean = normalizeUrlString(url).toLowerCase();
  const compact = clean.replace(/\s+/g, "");
  if (compact.startsWith("javascript:")) return true;
  if (compact.startsWith("vbscript:")) return true;
  if (compact.startsWith("file:")) return true;
  if (compact.startsWith("about:")) return true;
  return false;
}
function isValidUrl(url, options = {}) {
  if (typeof url !== "string") return false;
  const clean = normalizeUrlString(url);
  if (!clean) return true;
  if (isDangerousProtocol(clean)) {
    return false;
  }
  const compact = clean.replace(/\s+/g, "").toLowerCase();
  if (compact.startsWith("data:")) {
    if (options.allowDataImages) {
      return /^data:image\/(png|jpe?g|gif|webp|svg\+xml);base64,[A-Za-z0-9+/=]+$/i.test(clean);
    }
    return false;
  }
  if (clean.startsWith("/") || clean.startsWith("./") || clean.startsWith("../") || clean.startsWith("#") || clean.startsWith("?")) {
    return options.allowRelative !== false;
  }
  const allowed = options.allowedProtocols || DEFAULT_ALLOWED_PROTOCOLS;
  try {
    const parsed = new URL(clean, "https://leveonas.local");
    return allowed.includes(parsed.protocol.toLowerCase());
  } catch {
    const match = clean.match(/^([a-zA-Z0-9+.-]+):/);
    if (!match) {
      return options.allowRelative !== false;
    }
    const scheme = `${match[1].toLowerCase()}:`;
    return allowed.includes(scheme);
  }
}
function sanitizeUrl(url, fallback = "", options = {}) {
  if (isValidUrl(url, options)) {
    return url;
  }
  return fallback;
}
function sanitizeCssText(css) {
  if (typeof css !== "string") return "";
  let sanitized = css;
  sanitized = sanitized.replace(/expression\s*\([^)]*\)/gi, "none");
  sanitized = sanitized.replace(/behavior\s*:[^;}]*/gi, "");
  sanitized = sanitized.replace(/-moz-binding\s*:[^;}]*/gi, "");
  sanitized = sanitized.replace(/url\s*\(\s*(['"]?)(.*?)\1\s*\)/gi, (fullMatch, quote, rawUrl) => {
    const normalized = normalizeUrlString(rawUrl);
    if (isDangerousProtocol(normalized)) {
      return `url(${quote}about:blank${quote})`;
    }
    return fullMatch;
  });
  return sanitized;
}

// packages/security/attributes.ts
var URL_ATTRIBUTES = /* @__PURE__ */ new Set([
  "href",
  "src",
  "action",
  "formaction",
  "poster",
  "data",
  "codebase",
  "cite",
  "background"
]);
var FORBIDDEN_ATTRIBUTES = /* @__PURE__ */ new Set([
  "srcdoc",
  "manifest",
  "formaction"
]);
function normalizeAttributeName(name) {
  if (typeof name !== "string") return "";
  return name.replace(/[\u0000-\u001F\u007F-\u009F\s]/g, "").toLowerCase().trim();
}
function isAttributeSafe(name, value) {
  if (typeof name !== "string") return false;
  const lowerName = normalizeAttributeName(name);
  if (!lowerName) return false;
  if (lowerName.startsWith("on")) {
    return false;
  }
  if (FORBIDDEN_ATTRIBUTES.has(lowerName)) {
    return false;
  }
  const strVal = String(value ?? "");
  if (URL_ATTRIBUTES.has(lowerName)) {
    if (!isValidUrl(strVal, { allowDataImages: lowerName === "src" || lowerName === "poster" })) {
      return false;
    }
  }
  if (lowerName === "style" || lowerName.startsWith("style.")) {
    const sanitized = sanitizeCssText(strVal);
    if (/javascript:|expression|behavior|-moz-binding/i.test(strVal)) {
      return false;
    }
  }
  return true;
}
function sanitizeAttributes(attrs) {
  const result = {};
  if (!attrs || typeof attrs !== "object") return result;
  for (const [key, value] of Object.entries(attrs)) {
    if (isAttributeSafe(key, value)) {
      const strVal = String(value ?? "");
      if (key.toLowerCase() === "style") {
        result[key] = sanitizeCssText(strVal);
      } else {
        result[key] = strVal;
      }
    }
  }
  return result;
}

// packages/security/messages.ts
var VALID_MESSAGE_TYPES = /* @__PURE__ */ new Set([
  "leveonas:init",
  "leveonas:ready",
  "leveonas:patch",
  "leveonas:event",
  "leveonas:resize",
  "leveonas:reset",
  "leveonas:error",
  "leveonas:heartbeat",
  "leveonas:abort"
]);
function isMessageSourceValid(eventSource, expectedSource) {
  if (!eventSource || !expectedSource) return false;
  return eventSource === expectedSource;
}
function validateIncomingMessage(data, options = {}) {
  if (!data || typeof data !== "object") {
    return { isValid: false, error: "Message data must be a non-null object" };
  }
  if (Object.prototype.hasOwnProperty.call(data, "__proto__") || Object.prototype.hasOwnProperty.call(data, "constructor") || Object.prototype.hasOwnProperty.call(data, "prototype")) {
    return { isValid: false, error: "Prototype pollution vector detected in message envelope" };
  }
  const msg = data;
  if (typeof msg.type !== "string" || !msg.type.trim()) {
    return { isValid: false, error: "Missing or invalid message type" };
  }
  const allowedTypes = options.allowedTypes || VALID_MESSAGE_TYPES;
  if (!allowedTypes.has(msg.type)) {
    return { isValid: false, error: `Unrecognized message type: ${msg.type}` };
  }
  const maxBytes = options.maxBytes ?? DEFAULT_SECURITY_LIMITS.maxMessageBytes;
  let estimatedSize = 0;
  try {
    const serialized = JSON.stringify(data);
    estimatedSize = typeof Buffer !== "undefined" ? Buffer.byteLength(serialized, "utf-8") : serialized.length;
  } catch {
    return { isValid: false, error: "Message payload cannot be safely serialized" };
  }
  if (estimatedSize > maxBytes) {
    return {
      isValid: false,
      error: `Message size (${estimatedSize} bytes) exceeds limit (${maxBytes} bytes)`
    };
  }
  if (options.requireSessionId && (!msg.sessionId || typeof msg.sessionId !== "string")) {
    return { isValid: false, error: "Message requires a valid sessionId" };
  }
  return {
    isValid: true,
    message: data
  };
}

// packages/security/sanitizer.ts
var SENSITIVE_PATH_PATTERNS = [
  /\/app\/applet\/[^\s:'"]+/g,
  /\/root\/[^\s:'"]+/g,
  /\/home\/[^\s:'"]+/g,
  /[A-Z]:\\[^\s:'"]+/g,
  /\/var\/[^\s:'"]+/g,
  /\/tmp\/[^\s:'"]+/g
];
function censorSecrets(text) {
  if (typeof text !== "string") return "";
  let sanitized = text;
  sanitized = sanitized.replace(/AIza[0-9A-Za-z-_]{16,}/g, "[REDACTED_SECRET]");
  sanitized = sanitized.replace(/sk-[a-zA-Z0-9_-]{16,}/g, "[REDACTED_SECRET]");
  sanitized = sanitized.replace(/Bearer\s+[a-zA-Z0-9._~+/-]+=*/gi, "Bearer [REDACTED_SECRET]");
  sanitized = sanitized.replace(
    /(?:x-leveonas-key|x-user-llm-key|api[-_]?key|secret|password|token)\s*[:=]\s*["']?([a-zA-Z0-9-_]+)["']?/gi,
    (match, capturedKey) => {
      if (capturedKey) {
        return match.replace(capturedKey, "[REDACTED_SECRET]");
      }
      return match;
    }
  );
  return sanitized;
}
function censorPaths(text) {
  if (typeof text !== "string") return "";
  let sanitized = text;
  for (const pattern of SENSITIVE_PATH_PATTERNS) {
    sanitized = sanitized.replace(pattern, "[INTERNAL_PATH]");
  }
  return sanitized;
}
function sanitizeErrorMessage(err, isProduction = process.env.NODE_ENV === "production") {
  if (!err) {
    return { code: "UNKNOWN_ERROR", message: "An unknown error occurred" };
  }
  let rawMessage = "";
  let errorCode = "INTERNAL_ERROR";
  if (typeof err === "string") {
    rawMessage = err;
  } else if (err instanceof Error) {
    rawMessage = err.message;
    if (err.name && err.name !== "Error") {
      errorCode = err.name.toUpperCase();
    }
  } else if (typeof err === "object") {
    const obj = err;
    rawMessage = String(obj.message || obj.error || JSON.stringify(err));
    if (typeof obj.code === "string") {
      errorCode = obj.code;
    }
  }
  if (rawMessage.includes("quota") || rawMessage.includes("QUOTA_EXCEEDED")) {
    return { code: "QUOTA_EXCEEDED", message: "API generation quota exceeded" };
  }
  if (rawMessage.includes("API key") || rawMessage.includes("401") || rawMessage.includes("unauthorized")) {
    return { code: "UNAUTHORIZED", message: "Invalid or missing API credentials" };
  }
  if (rawMessage.includes("rate limit") || rawMessage.includes("429")) {
    return { code: "RATE_LIMITED", message: "Too many requests; please try again shortly" };
  }
  if (rawMessage.includes("timeout") || rawMessage.includes("ETIMEDOUT") || rawMessage.includes("DEADLINE_EXCEEDED")) {
    return { code: "STREAM_TIMEOUT", message: "Stream generation timed out" };
  }
  if (rawMessage.includes("limit exceeded") || rawMessage.includes("LIMIT_EXCEEDED")) {
    return { code: "LIMIT_EXCEEDED", message: "Resource limit exceeded" };
  }
  const cleanMessage = censorPaths(censorSecrets(rawMessage));
  if (isProduction) {
    if (cleanMessage.includes("node_modules") || cleanMessage.includes("at ") || cleanMessage.includes("ENOENT")) {
      return { code: errorCode, message: "An unexpected processing error occurred" };
    }
    return { code: errorCode, message: cleanMessage };
  }
  return {
    code: errorCode,
    message: cleanMessage
  };
}

// packages/security/patches.ts
function validatePatchOperationSecurity(patch, limits = DEFAULT_SECURITY_LIMITS, currentDepth = 0) {
  if (!patch || typeof patch !== "object") {
    return { isValid: false, error: "Patch operation must be a non-null object" };
  }
  if (Object.prototype.hasOwnProperty.call(patch, "__proto__") || Object.prototype.hasOwnProperty.call(patch, "constructor") || Object.prototype.hasOwnProperty.call(patch, "prototype")) {
    return { isValid: false, error: "Prototype pollution vector detected in patch payload" };
  }
  const p = patch;
  if (typeof p.type !== "string" || !p.type.trim()) {
    return { isValid: false, error: 'Patch missing required "type" field' };
  }
  const validateId = (id, fieldName) => {
    if (id === void 0 || id === null) return null;
    if (typeof id !== "string") return `${fieldName} must be a string`;
    if (id.length > 256) return `${fieldName} exceeds maximum length (256 chars)`;
    if (/[\u0000-\u001F\u007F-\u009F]/.test(id)) return `${fieldName} contains forbidden control characters`;
    return null;
  };
  const idErr = validateId(p.nodeId, "nodeId") || validateId(p.parentId, "parentId") || validateId(p.targetId, "targetId");
  if (idErr) {
    return { isValid: false, error: idErr };
  }
  if (p.text !== void 0 && p.text !== null) {
    if (typeof p.text !== "string") {
      return { isValid: false, error: "Patch text must be a string" };
    }
    if (p.text.length > limits.maxTextLength) {
      return {
        isValid: false,
        error: `Text length (${p.text.length}) exceeds maximum limit (${limits.maxTextLength})`
      };
    }
  }
  if (p.name !== void 0 && p.value !== void 0) {
    if (typeof p.name !== "string") {
      return { isValid: false, error: "Attribute name must be a string" };
    }
    const valStr = String(p.value ?? "");
    if (valStr.length > limits.maxAttributeLength) {
      return {
        isValid: false,
        error: `Attribute value length (${valStr.length}) exceeds maximum limit (${limits.maxAttributeLength})`
      };
    }
    if (!isAttributeSafe(p.name, p.value)) {
      return {
        isValid: false,
        error: `Unsafe attribute detected: "${p.name}" with value "${valStr.slice(0, 50)}"`
      };
    }
  }
  if (p.node && typeof p.node === "object") {
    if (currentDepth > limits.maxTreeDepth) {
      return {
        isValid: false,
        error: `Node nesting depth exceeds maximum allowed depth (${limits.maxTreeDepth})`
      };
    }
    if (p.node.attributes && typeof p.node.attributes === "object") {
      for (const [attrName, attrVal] of Object.entries(p.node.attributes)) {
        if (!isAttributeSafe(attrName, attrVal)) {
          return {
            isValid: false,
            error: `Unsafe attribute "${attrName}" in node ${p.node.id || "unnamed"}`
          };
        }
      }
    }
    if (Array.isArray(p.node.children)) {
      for (const child of p.node.children) {
        const childRes = validatePatchOperationSecurity(
          { type: "CREATE_NODE", node: child },
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
function validatePatchBatchSecurity(patches, limits = DEFAULT_SECURITY_LIMITS) {
  if (!Array.isArray(patches)) {
    return { isValid: false, error: "Patch batch must be an array" };
  }
  if (patches.length > limits.maxPatchBatchSize) {
    return {
      isValid: false,
      error: `Patch batch size (${patches.length}) exceeds maximum limit (${limits.maxPatchBatchSize})`
    };
  }
  for (let i = 0; i < patches.length; i++) {
    const res = validatePatchOperationSecurity(patches[i], limits);
    if (!res.isValid) {
      return {
        isValid: false,
        error: `Patch at index ${i} failed security validation: ${res.error}`
      };
    }
  }
  return { isValid: true };
}

// packages/security/audit.ts
var LeveonasSecurityAuditor = class {
  /**
   * Audits raw LM source code or HTML markup for dangerous patterns.
   */
  static auditSource(content, filename = "inline.lm") {
    const issues = [];
    let totalChecks = 0;
    totalChecks++;
    const urlMatches = content.matchAll(/(?:href|hr|src|sr|action|poster)\s*[:=]\s*["']([^"']+)["']/gi);
    for (const match of urlMatches) {
      const url = match[1];
      if (isDangerousProtocol(url)) {
        issues.push({
          severity: "CRITICAL",
          category: "INJECTION",
          code: "SEC_DANGEROUS_URL_PROTOCOL",
          message: `Dangerous protocol detected in URL: "${url.slice(0, 40)}"`,
          location: `${filename}`,
          recommendation: "Use HTTP, HTTPS, or relative URLs. Avoid javascript: or vbscript: URLs."
        });
      }
    }
    totalChecks++;
    const eventMatches = content.matchAll(/\b(?:on[a-zA-Z]+|oc|og|oe)\s*[:=]\s*["']([^"']+)["']/gi);
    for (const match of eventMatches) {
      const rawHandler = match[0].split(/[:=]/)[0].trim();
      const handlerCode = match[1];
      if (rawHandler.toLowerCase().startsWith("on") || /eval\s*\(|new\s+Function|document\.cookie/i.test(handlerCode)) {
        issues.push({
          severity: "HIGH",
          category: "INJECTION",
          code: "SEC_INLINE_EVENT_HANDLER",
          message: `Suspicious or inline event handler detected: "${rawHandler}"`,
          location: `${filename}`,
          recommendation: "Use canonical Leveonas event bindings instead of inline on* handlers or eval()."
        });
      }
    }
    totalChecks++;
    const apiKeyMatches = content.matchAll(/(?:AIza[0-9A-Za-z-_]{35}|sk-[a-zA-Z0-9]{20,})/g);
    for (const match of apiKeyMatches) {
      issues.push({
        severity: "CRITICAL",
        category: "CREDENTIAL_EXPOSURE",
        code: "SEC_HARDCODED_API_KEY",
        message: "Hardcoded API key detected in source code",
        location: `${filename}`,
        recommendation: "Pass API credentials via secure server proxy or environment variables."
      });
    }
    totalChecks++;
    if (/expression\s*\(|behavior\s*:|-moz-binding\s*:/i.test(content)) {
      issues.push({
        severity: "HIGH",
        category: "INJECTION",
        code: "SEC_DANGEROUS_CSS_DIRECTIVE",
        message: "Potentially dangerous CSS directive (expression/behavior/-moz-binding) detected",
        location: `${filename}`,
        recommendation: "Remove proprietary CSS execution directives."
      });
    }
    const penalty = issues.filter((i) => i.severity === "CRITICAL").length * 40 + issues.filter((i) => i.severity === "HIGH").length * 20 + issues.filter((i) => i.severity === "MEDIUM").length * 10 + issues.filter((i) => i.severity === "LOW").length * 5;
    const score = Math.max(0, 100 - penalty);
    return {
      passed: issues.filter((i) => i.severity === "CRITICAL" || i.severity === "HIGH").length === 0,
      score,
      totalChecks,
      issueCounts: {
        CRITICAL: issues.filter((i) => i.severity === "CRITICAL").length,
        HIGH: issues.filter((i) => i.severity === "HIGH").length,
        MEDIUM: issues.filter((i) => i.severity === "MEDIUM").length,
        LOW: issues.filter((i) => i.severity === "LOW").length
      },
      issues
    };
  }
  /**
   * Audits iframe sandbox permissions to ensure least privilege.
   */
  static auditIframeSandbox(sandboxAttr) {
    const issues = [];
    if (!sandboxAttr) {
      issues.push({
        severity: "CRITICAL",
        category: "ISOLATION",
        code: "SEC_IFRAME_UNSANDBOXED",
        message: "Iframe missing sandbox attribute entirely",
        recommendation: 'Set sandbox="allow-scripts" without allow-same-origin.'
      });
    } else {
      const tokens = sandboxAttr.toLowerCase().split(/\s+/).filter(Boolean);
      if (tokens.includes("allow-same-origin")) {
        issues.push({
          severity: "CRITICAL",
          category: "ISOLATION",
          code: "SEC_DANGEROUS_SANDBOX_TOKEN",
          message: 'sandbox="allow-same-origin" grants iframe full access to parent origin cookies and storage',
          recommendation: 'Remove "allow-same-origin" to maintain an opaque sandboxed origin.'
        });
      }
      if (tokens.includes("allow-top-navigation") || tokens.includes("allow-top-navigation-by-user-activation")) {
        issues.push({
          severity: "HIGH",
          category: "ISOLATION",
          code: "SEC_TOP_NAVIGATION_ENABLED",
          message: "Iframe is allowed to navigate the parent window",
          recommendation: "Remove top-navigation permissions unless explicitly required."
        });
      }
      if (tokens.includes("allow-modals") || tokens.includes("allow-popups")) {
        issues.push({
          severity: "MEDIUM",
          category: "ISOLATION",
          code: "SEC_POPUP_PERMISSIONS_ENABLED",
          message: "Iframe is permitted to spawn popups or modal alerts",
          recommendation: "Disable popups/modals unless demonstrated requirement exists."
        });
      }
    }
    const penalty = issues.filter((i) => i.severity === "CRITICAL").length * 50 + issues.filter((i) => i.severity === "HIGH").length * 25 + issues.filter((i) => i.severity === "MEDIUM").length * 10;
    return {
      passed: issues.filter((i) => i.severity === "CRITICAL").length === 0,
      score: Math.max(0, 100 - penalty),
      totalChecks: 4,
      issueCounts: {
        CRITICAL: issues.filter((i) => i.severity === "CRITICAL").length,
        HIGH: issues.filter((i) => i.severity === "HIGH").length,
        MEDIUM: issues.filter((i) => i.severity === "MEDIUM").length,
        LOW: 0
      },
      issues
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DEFAULT_SECURITY_LIMITS,
  FORBIDDEN_ATTRIBUTES,
  LeveonasSecurityAuditor,
  URL_ATTRIBUTES,
  VALID_MESSAGE_TYPES,
  censorPaths,
  censorSecrets,
  getSecurityLimits,
  isAttributeSafe,
  isDangerousProtocol,
  isMessageSourceValid,
  isValidUrl,
  normalizeAttributeName,
  normalizeUrlString,
  sanitizeAttributes,
  sanitizeCssText,
  sanitizeErrorMessage,
  sanitizeUrl,
  validateIncomingMessage,
  validatePatchBatchSecurity,
  validatePatchOperationSecurity
});
