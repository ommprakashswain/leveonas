"use strict";
(() => {
  // packages/runtime/incremental/patch-generator/types.ts
  var PatchOperationType = /* @__PURE__ */ ((PatchOperationType3) => {
    PatchOperationType3["CREATE_NODE"] = "CREATE_NODE";
    PatchOperationType3["REMOVE_NODE"] = "REMOVE_NODE";
    PatchOperationType3["REPLACE_NODE"] = "REPLACE_NODE";
    PatchOperationType3["UPDATE_TEXT"] = "UPDATE_TEXT";
    PatchOperationType3["SET_ATTRIBUTE"] = "SET_ATTRIBUTE";
    PatchOperationType3["REMOVE_ATTRIBUTE"] = "REMOVE_ATTRIBUTE";
    PatchOperationType3["INSERT_CHILD"] = "INSERT_CHILD";
    PatchOperationType3["REMOVE_CHILD"] = "REMOVE_CHILD";
    PatchOperationType3["MOVE_CHILD"] = "MOVE_CHILD";
    PatchOperationType3["REPLACE_CHILDREN"] = "REPLACE_CHILDREN";
    PatchOperationType3["NO_OP"] = "NO_OP";
    PatchOperationType3["SET_CSS_STYLESHEET"] = "SET_CSS_STYLESHEET";
    PatchOperationType3["CREATE_CSS_RULE"] = "CREATE_CSS_RULE";
    PatchOperationType3["REMOVE_CSS_RULE"] = "REMOVE_CSS_RULE";
    PatchOperationType3["UPDATE_CSS_RULE"] = "UPDATE_CSS_RULE";
    PatchOperationType3["ADD_CSS_DECLARATION"] = "ADD_CSS_DECLARATION";
    PatchOperationType3["UPDATE_CSS_DECLARATION"] = "UPDATE_CSS_DECLARATION";
    PatchOperationType3["REMOVE_CSS_DECLARATION"] = "REMOVE_CSS_DECLARATION";
    PatchOperationType3["UPDATE_CSS_SELECTOR"] = "UPDATE_CSS_SELECTOR";
    PatchOperationType3["ADD_CSS_KEYFRAME"] = "ADD_CSS_KEYFRAME";
    PatchOperationType3["REMOVE_CSS_KEYFRAME"] = "REMOVE_CSS_KEYFRAME";
    PatchOperationType3["UPDATE_CSS_KEYFRAME"] = "UPDATE_CSS_KEYFRAME";
    PatchOperationType3["CREATE_JS_UNIT"] = "CREATE_JS_UNIT";
    PatchOperationType3["UPDATE_JS_UNIT"] = "UPDATE_JS_UNIT";
    PatchOperationType3["REMOVE_JS_UNIT"] = "REMOVE_JS_UNIT";
    PatchOperationType3["ATTACH_EVENT_HANDLER"] = "ATTACH_EVENT_HANDLER";
    PatchOperationType3["UPDATE_EVENT_HANDLER"] = "UPDATE_EVENT_HANDLER";
    PatchOperationType3["REMOVE_EVENT_HANDLER"] = "REMOVE_EVENT_HANDLER";
    PatchOperationType3["EXECUTE_JS_UNIT"] = "EXECUTE_JS_UNIT";
    PatchOperationType3["CLEANUP_JS_SESSION"] = "CLEANUP_JS_SESSION";
    return PatchOperationType3;
  })(PatchOperationType || {});
  var LegacyPatchOperationAliases = {
    INSERT_NODE: "INSERT_CHILD" /* INSERT_CHILD */,
    MOVE_NODE: "MOVE_CHILD" /* MOVE_CHILD */,
    UPDATE_PROPERTY: "SET_ATTRIBUTE" /* SET_ATTRIBUTE */,
    ADD_PROPERTY: "SET_ATTRIBUTE" /* SET_ATTRIBUTE */,
    REMOVE_PROPERTY: "REMOVE_ATTRIBUTE" /* REMOVE_ATTRIBUTE */
  };
  function normalizePatchOperationType(op) {
    if (typeof op === "string" && op in LegacyPatchOperationAliases) {
      return LegacyPatchOperationAliases[op];
    }
    return op;
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

  // packages/runtime/incremental/patch-generator/validator.ts
  var VALID_OPERATION_TYPES = new Set(Object.values(PatchOperationType));
  var PatchValidationError = class extends Error {
    constructor(message) {
      super(`[PatchValidation] ${message}`);
      this.name = "PatchValidationError";
    }
  };
  function isAttributePayloadSafe(name, value) {
    return isAttributeSafe(name, value);
  }
  function validatePatchOperation(op, index, limits = DEFAULT_SECURITY_LIMITS) {
    if (!op || typeof op !== "object" || Array.isArray(op)) {
      throw new PatchValidationError(`Operation at index ${index} must be an object`);
    }
    if (Object.prototype.hasOwnProperty.call(op, "__proto__") || Object.prototype.hasOwnProperty.call(op, "constructor") || Object.prototype.hasOwnProperty.call(op, "prototype")) {
      throw new PatchValidationError(
        `Operation at index ${index} rejected due to prototype pollution payload`
      );
    }
    const rawOp = op;
    if (typeof rawOp.operation !== "string" || !rawOp.operation.trim()) {
      throw new PatchValidationError(`Operation at index ${index} has missing or non-string 'operation' property`);
    }
    const normalizedType = normalizePatchOperationType(rawOp.operation);
    if (!VALID_OPERATION_TYPES.has(normalizedType)) {
      throw new PatchValidationError(
        `Operation at index ${index} has unknown operation type: '${rawOp.operation}'`
      );
    }
    if (typeof rawOp.nodeId !== "string" || !rawOp.nodeId.trim()) {
      throw new PatchValidationError(
        `Operation [${index}] (${normalizedType}) requires a non-empty string 'nodeId'`
      );
    }
    if (rawOp.nodeId.length > 256 || /[\u0000-\u001F\u007F-\u009F]/.test(rawOp.nodeId)) {
      throw new PatchValidationError(
        `Operation [${index}] (${normalizedType}) contains invalid nodeId format`
      );
    }
    if (rawOp.parentId !== void 0 && rawOp.parentId !== null) {
      if (typeof rawOp.parentId !== "string") {
        throw new PatchValidationError(
          `Operation [${index}] (${normalizedType}) 'parentId' must be a string if present`
        );
      }
    }
    if (rawOp.index !== void 0 && rawOp.index !== null) {
      if (typeof rawOp.index !== "number" || !Number.isInteger(rawOp.index) || rawOp.index < 0) {
        throw new PatchValidationError(
          `Operation [${index}] (${normalizedType}) 'index' must be a non-negative integer if present`
        );
      }
    }
    switch (normalizedType) {
      case "UPDATE_TEXT" /* UPDATE_TEXT */: {
        const textVal = rawOp.payload?.text ?? rawOp.payload;
        if (textVal !== void 0 && typeof textVal !== "string" && typeof textVal !== "number" && typeof textVal !== "boolean") {
          throw new PatchValidationError(
            `Operation [${index}] (UPDATE_TEXT) payload must specify valid text content`
          );
        }
        if (typeof textVal === "string" && textVal.length > limits.maxTextLength) {
          throw new PatchValidationError(
            `Operation [${index}] (UPDATE_TEXT) text length (${textVal.length}) exceeds limit (${limits.maxTextLength})`
          );
        }
        break;
      }
      case "SET_ATTRIBUTE" /* SET_ATTRIBUTE */: {
        const payload = rawOp.payload;
        if (!payload || typeof payload !== "object") {
          throw new PatchValidationError(
            `Operation [${index}] (SET_ATTRIBUTE) requires a payload object with name and value`
          );
        }
        if (typeof payload.name !== "string" || !payload.name.trim()) {
          throw new PatchValidationError(
            `Operation [${index}] (SET_ATTRIBUTE) payload requires non-empty string 'name'`
          );
        }
        const valStr = String(payload.value ?? "");
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
      case "REMOVE_ATTRIBUTE" /* REMOVE_ATTRIBUTE */: {
        const payload = rawOp.payload;
        const attrName = typeof payload === "string" ? payload : payload?.name;
        if (typeof attrName !== "string" || !attrName.trim()) {
          throw new PatchValidationError(
            `Operation [${index}] (REMOVE_ATTRIBUTE) requires non-empty string attribute name`
          );
        }
        break;
      }
      case "CREATE_NODE" /* CREATE_NODE */: {
        const node = rawOp.payload?.node ?? rawOp.payload;
        if (!node || typeof node !== "object") {
          throw new PatchValidationError(
            `Operation [${index}] (CREATE_NODE) requires payload.node object`
          );
        }
        if (typeof node.id !== "string" || !node.id.trim()) {
          throw new PatchValidationError(
            `Operation [${index}] (CREATE_NODE) node requires valid string 'id'`
          );
        }
        if (typeof node.kind !== "string" || !node.kind.trim()) {
          throw new PatchValidationError(
            `Operation [${index}] (CREATE_NODE) node requires valid string 'kind'`
          );
        }
        break;
      }
      case "REPLACE_CHILDREN" /* REPLACE_CHILDREN */: {
        const children = rawOp.payload?.children;
        if (!Array.isArray(children)) {
          throw new PatchValidationError(
            `Operation [${index}] (REPLACE_CHILDREN) requires payload.children array`
          );
        }
        break;
      }
      case "MOVE_CHILD" /* MOVE_CHILD */: {
        if (rawOp.index === void 0 || rawOp.index === null || typeof rawOp.index !== "number" || !Number.isInteger(rawOp.index) || rawOp.index < 0) {
          throw new PatchValidationError(
            `Operation [${index}] (MOVE_CHILD) requires a valid non-negative integer 'index'`
          );
        }
        break;
      }
      case "SET_CSS_STYLESHEET" /* SET_CSS_STYLESHEET */: {
        if (!rawOp.payload || typeof rawOp.payload.cssText !== "string") {
          throw new PatchValidationError(
            `Operation [${index}] (SET_CSS_STYLESHEET) requires payload.cssText string`
          );
        }
        break;
      }
      case "CREATE_CSS_RULE" /* CREATE_CSS_RULE */:
      case "UPDATE_CSS_RULE" /* UPDATE_CSS_RULE */: {
        if (!rawOp.payload || typeof rawOp.payload.selector !== "string" || !rawOp.payload.selector.trim()) {
          throw new PatchValidationError(
            `Operation [${index}] (${normalizedType}) requires non-empty string payload.selector`
          );
        }
        break;
      }
      case "ADD_CSS_DECLARATION" /* ADD_CSS_DECLARATION */:
      case "UPDATE_CSS_DECLARATION" /* UPDATE_CSS_DECLARATION */: {
        if (!rawOp.payload || typeof rawOp.payload.property !== "string" || !rawOp.payload.property.trim()) {
          throw new PatchValidationError(
            `Operation [${index}] (${normalizedType}) requires non-empty string payload.property`
          );
        }
        if (rawOp.payload.value === void 0 || rawOp.payload.value === null) {
          throw new PatchValidationError(
            `Operation [${index}] (${normalizedType}) requires payload.value`
          );
        }
        break;
      }
      case "REMOVE_CSS_DECLARATION" /* REMOVE_CSS_DECLARATION */: {
        if (!rawOp.payload || typeof rawOp.payload.property !== "string" || !rawOp.payload.property.trim()) {
          throw new PatchValidationError(
            `Operation [${index}] (REMOVE_CSS_DECLARATION) requires non-empty string payload.property`
          );
        }
        break;
      }
      case "UPDATE_CSS_SELECTOR" /* UPDATE_CSS_SELECTOR */: {
        if (!rawOp.payload || typeof rawOp.payload.newSelector !== "string" || !rawOp.payload.newSelector.trim()) {
          throw new PatchValidationError(
            `Operation [${index}] (UPDATE_CSS_SELECTOR) requires payload.newSelector`
          );
        }
        break;
      }
      case "ADD_CSS_KEYFRAME" /* ADD_CSS_KEYFRAME */:
      case "UPDATE_CSS_KEYFRAME" /* UPDATE_CSS_KEYFRAME */: {
        if (!rawOp.payload || typeof rawOp.payload.keyframesName !== "string" || typeof rawOp.payload.keyframeSelector !== "string" || !rawOp.payload.keyframesName.trim() || !rawOp.payload.keyframeSelector.trim()) {
          throw new PatchValidationError(
            `Operation [${index}] (${normalizedType}) requires keyframesName and keyframeSelector`
          );
        }
        break;
      }
      // JS Patch Operations Validation
      case "CREATE_JS_UNIT" /* CREATE_JS_UNIT */:
      case "UPDATE_JS_UNIT" /* UPDATE_JS_UNIT */: {
        if (!rawOp.payload || typeof rawOp.payload.code !== "string") {
          throw new PatchValidationError(
            `Operation [${index}] (${normalizedType}) requires payload.code string`
          );
        }
        break;
      }
      case "ATTACH_EVENT_HANDLER" /* ATTACH_EVENT_HANDLER */:
      case "UPDATE_EVENT_HANDLER" /* UPDATE_EVENT_HANDLER */: {
        if (!rawOp.payload || typeof rawOp.payload.eventName !== "string" || typeof rawOp.payload.targetSelector !== "string" || typeof rawOp.payload.handlerCode !== "string") {
          throw new PatchValidationError(
            `Operation [${index}] (${normalizedType}) requires eventName, targetSelector, and handlerCode in payload`
          );
        }
        break;
      }
      case "REMOVE_EVENT_HANDLER" /* REMOVE_EVENT_HANDLER */: {
        if (!rawOp.payload || typeof rawOp.payload.eventName !== "string" || typeof rawOp.payload.targetSelector !== "string") {
          throw new PatchValidationError(
            `Operation [${index}] (REMOVE_EVENT_HANDLER) requires eventName and targetSelector in payload`
          );
        }
        break;
      }
      case "EXECUTE_JS_UNIT" /* EXECUTE_JS_UNIT */: {
        if (!rawOp.payload || typeof rawOp.payload.code !== "string") {
          throw new PatchValidationError(
            `Operation [${index}] (EXECUTE_JS_UNIT) requires payload.code string`
          );
        }
        break;
      }
      case "REMOVE_JS_UNIT" /* REMOVE_JS_UNIT */:
      case "CLEANUP_JS_SESSION" /* CLEANUP_JS_SESSION */:
        break;
    }
    return {
      operation: normalizedType,
      nodeId: rawOp.nodeId,
      parentId: rawOp.parentId,
      index: rawOp.index,
      payload: rawOp.payload,
      timestamp: typeof rawOp.timestamp === "number" ? rawOp.timestamp : void 0
    };
  }
  function validatePatches(patches, limits = DEFAULT_SECURITY_LIMITS) {
    if (!Array.isArray(patches)) {
      throw new PatchValidationError("Patches must be an array");
    }
    if (patches.length > limits.maxPatchBatchSize) {
      throw new PatchValidationError(
        `Patch batch size (${patches.length}) exceeds maximum limit (${limits.maxPatchBatchSize})`
      );
    }
    const validated = [];
    for (let i = 0; i < patches.length; i++) {
      validated.push(validatePatchOperation(patches[i], i, limits));
    }
    return validated;
  }
  function isPatchBatchValid(patches) {
    try {
      validatePatches(patches);
      return true;
    } catch {
      return false;
    }
  }

  // packages/compiler/renderers/html/element-map.ts
  var ElementMap = {
    ["Page" /* Page */]: "main",
    ["Section" /* Section */]: "section",
    ["Container" /* Container */]: "div",
    ["Hero" /* Hero */]: "section",
    ["Button" /* Button */]: "button",
    ["Input" /* Input */]: "input",
    ["Text" /* Text */]: "p",
    ["Image" /* Image */]: "img",
    ["Form" /* Form */]: "form",
    ["Grid" /* Grid */]: "div",
    ["Card" /* Card */]: "article",
    "Navbar": "nav",
    "Footer": "footer",
    "Heading": "h2",
    // Generic fallback
    "List": "ul",
    "ListItem": "li"
  };

  // packages/runtime/incremental/patch-executor/errors.ts
  var PatchExecutorError = class extends Error {
    constructor(message) {
      super(`PatchExecutorError: ${message}`);
      this.name = "PatchExecutorError";
    }
  };

  // packages/runtime/incremental/patch-executor/css-applier.ts
  var CSSPatchApplier = class {
    constructor(doc) {
      this.styleEl = null;
      this.rulesMap = /* @__PURE__ */ new Map();
      this.keyframesMap = /* @__PURE__ */ new Map();
      this.doc = doc || (typeof document !== "undefined" ? document : null);
      if (this.doc) {
        this.ensureStyleElement();
      }
    }
    ensureStyleElement() {
      if (!this.doc) return null;
      if (this.styleEl) return this.styleEl;
      let el = this.doc.getElementById ? this.doc.getElementById("leveonas-css") : null;
      if (!el && this.doc.createElement) {
        el = this.doc.createElement("style");
        if (el) {
          el.id = "leveonas-css";
          el.type = "text/css";
          const target = this.doc.head || this.doc.body || this.doc.documentElement;
          if (target && target.appendChild) {
            target.appendChild(el);
          }
        }
      }
      this.styleEl = el;
      return el;
    }
    apply(patches) {
      if (!this.doc) return;
      this.ensureStyleElement();
      let needsSync = false;
      for (const patch of patches) {
        const op = normalizePatchOperationType(patch.operation);
        switch (op) {
          case "SET_CSS_STYLESHEET" /* SET_CSS_STYLESHEET */: {
            const cssText = patch.payload?.cssText || "";
            if (this.styleEl) {
              this.styleEl.textContent = cssText;
            }
            break;
          }
          case "CREATE_CSS_RULE" /* CREATE_CSS_RULE */: {
            const ruleId = patch.nodeId;
            const selector = patch.payload?.selector || "";
            const decls = /* @__PURE__ */ new Map();
            for (const d of patch.payload?.declarations || []) {
              decls.set(d.property.toLowerCase(), { value: d.value, important: !!d.important });
            }
            this.rulesMap.set(ruleId, {
              selector,
              declarations: decls,
              mediaQuery: patch.payload?.mediaQuery
            });
            needsSync = true;
            break;
          }
          case "REMOVE_CSS_RULE" /* REMOVE_CSS_RULE */: {
            const ruleId = patch.nodeId;
            this.rulesMap.delete(ruleId);
            needsSync = true;
            break;
          }
          case "UPDATE_CSS_RULE" /* UPDATE_CSS_RULE */: {
            const ruleId = patch.nodeId;
            const existing = this.rulesMap.get(ruleId);
            if (existing) {
              existing.selector = patch.payload?.selector || existing.selector;
              existing.declarations.clear();
              for (const d of patch.payload?.declarations || []) {
                existing.declarations.set(d.property.toLowerCase(), { value: d.value, important: !!d.important });
              }
              existing.mediaQuery = patch.payload?.mediaQuery || existing.mediaQuery;
            }
            needsSync = true;
            break;
          }
          case "ADD_CSS_DECLARATION" /* ADD_CSS_DECLARATION */:
          case "UPDATE_CSS_DECLARATION" /* UPDATE_CSS_DECLARATION */: {
            const ruleId = patch.nodeId;
            const rule = this.rulesMap.get(ruleId);
            if (rule && patch.payload?.property) {
              rule.declarations.set(patch.payload.property.toLowerCase(), {
                value: patch.payload.value,
                important: !!patch.payload.important
              });
              needsSync = true;
            }
            break;
          }
          case "REMOVE_CSS_DECLARATION" /* REMOVE_CSS_DECLARATION */: {
            const ruleId = patch.nodeId;
            const rule = this.rulesMap.get(ruleId);
            if (rule && patch.payload?.property) {
              rule.declarations.delete(patch.payload.property.toLowerCase());
              needsSync = true;
            }
            break;
          }
          case "UPDATE_CSS_SELECTOR" /* UPDATE_CSS_SELECTOR */: {
            const ruleId = patch.nodeId;
            const rule = this.rulesMap.get(ruleId);
            if (rule && patch.payload?.newSelector) {
              rule.selector = patch.payload.newSelector;
              needsSync = true;
            }
            break;
          }
          case "ADD_CSS_KEYFRAME" /* ADD_CSS_KEYFRAME */:
          case "UPDATE_CSS_KEYFRAME" /* UPDATE_CSS_KEYFRAME */: {
            const kfName = patch.payload?.keyframesName;
            const stepSel = patch.payload?.keyframeSelector;
            if (kfName && stepSel) {
              let kf = this.keyframesMap.get(kfName);
              if (!kf) {
                kf = /* @__PURE__ */ new Map();
                this.keyframesMap.set(kfName, kf);
              }
              kf.set(stepSel, patch.payload.declarations || []);
              needsSync = true;
            }
            break;
          }
          case "REMOVE_CSS_KEYFRAME" /* REMOVE_CSS_KEYFRAME */: {
            const kfName = patch.payload?.keyframesName;
            const stepSel = patch.payload?.keyframeSelector;
            if (kfName && stepSel) {
              const kf = this.keyframesMap.get(kfName);
              if (kf) {
                kf.delete(stepSel);
                if (kf.size === 0) {
                  this.keyframesMap.delete(kfName);
                }
              }
              needsSync = true;
            }
            break;
          }
        }
      }
      if (needsSync) {
        this.syncToStyleElement();
      }
    }
    syncToStyleElement() {
      if (!this.styleEl) return;
      const lines = [];
      const standardRules = [];
      const mediaGroups = /* @__PURE__ */ new Map();
      for (const rule of this.rulesMap.values()) {
        const declStrs = [];
        for (const [prop, d] of rule.declarations.entries()) {
          const imp = d.important ? " !important" : "";
          declStrs.push(`  ${prop}: ${d.value}${imp};`);
        }
        const declBlock = declStrs.join("\n");
        if (rule.mediaQuery) {
          let group = mediaGroups.get(rule.mediaQuery);
          if (!group) {
            group = [];
            mediaGroups.set(rule.mediaQuery, group);
          }
          group.push({ selector: rule.selector, decls: declBlock });
        } else {
          standardRules.push({ selector: rule.selector, decls: declBlock });
        }
      }
      for (const r of standardRules) {
        lines.push(`${r.selector} {
${r.decls}
}`);
      }
      for (const [name, steps] of this.keyframesMap.entries()) {
        const stepLines = [];
        for (const [sel, decls] of steps.entries()) {
          const dLines = decls.map((d) => `    ${d.property}: ${d.value}${d.important ? " !important" : ""};`).join("\n");
          stepLines.push(`  ${sel} {
${dLines}
  }`);
        }
        lines.push(`@keyframes ${name} {
${stepLines.join("\n")}
}`);
      }
      for (const [query, rules] of mediaGroups.entries()) {
        const ruleLines = rules.map((r) => `  ${r.selector} {
${r.decls.split("\n").map((l) => "  " + l).join("\n")}
  }`).join("\n\n");
        lines.push(`@media ${query} {
${ruleLines}
}`);
      }
      this.styleEl.textContent = lines.join("\n\n");
    }
    getCSS() {
      return this.styleEl?.textContent || "";
    }
    reset() {
      this.rulesMap.clear();
      this.keyframesMap.clear();
      if (this.styleEl) {
        this.styleEl.textContent = "";
      }
    }
  };

  // packages/runtime/incremental/patch-executor/js-applier.ts
  var JSPatchApplier = class {
    constructor(doc, win, onError, domApplier) {
      this.executedUnitCodes = /* @__PURE__ */ new Map();
      this.eventHandlerRegistry = /* @__PURE__ */ new Map();
      this.activeTimers = /* @__PURE__ */ new Set();
      this.sharedScope = {};
      this.doc = doc || (typeof document !== "undefined" ? document : null);
      this.win = win || (typeof window !== "undefined" ? window : null);
      this.onError = onError;
      this.domApplier = domApplier;
      this.setupRuntimeScope();
    }
    setDOMApplier(domApplier) {
      this.domApplier = domApplier;
    }
    setupRuntimeScope() {
      if (!this.win) return;
      const self = this;
      this.win.__leveonas_runtime__ = {
        qs: (selector) => self.doc?.querySelector(selector),
        qsa: (selector) => self.doc?.querySelectorAll(selector),
        gid: (id) => self.doc?.getElementById(id),
        on: (eventName, selector, fn) => {
          return self.registerEventHandler(`inline-evt-${eventName}-${selector}`, eventName, selector, fn);
        },
        applyPatches: (patches) => {
          if (self.domApplier && typeof self.domApplier.apply === "function") {
            self.domApplier.apply(patches);
          }
        },
        updateState: (instancePath, stateName, newValue) => {
          if (!self.win) return;
          self.win.__leveonas_state__ = self.win.__leveonas_state__ || {};
          self.win.__leveonas_state__[instancePath] = self.win.__leveonas_state__[instancePath] || {};
          self.win.__leveonas_state__[instancePath][stateName] = newValue;
          const reactivityDef = self.win.__leveonas_reactivity__?.[instancePath];
          if (reactivityDef) {
            if (typeof reactivityDef.updateState === "function") {
              const res = reactivityDef.updateState(stateName, newValue, self.win.__leveonas_state__[instancePath]);
              if (res && res.patches && res.patches.length > 0) {
                if (self.domApplier && typeof self.domApplier.apply === "function") {
                  self.domApplier.apply(res.patches);
                }
              }
            } else if (reactivityDef.domDependencies) {
              const state = self.win.__leveonas_state__[instancePath];
              const changedVars = [stateName];
              const evalExpr = (expr, ctx) => {
                if (!expr || typeof expr !== "string") return void 0;
                const trimmed = expr.trim();
                if (trimmed === "true") return true;
                if (trimmed === "false") return false;
                if (trimmed === "null") return null;
                if (trimmed === "undefined") return void 0;
                if (!isNaN(Number(trimmed)) && trimmed !== "") return Number(trimmed);
                if (trimmed.startsWith('"') && trimmed.endsWith('"') || trimmed.startsWith("'") && trimmed.endsWith("'")) {
                  return trimmed.slice(1, -1);
                }
                if (trimmed in ctx) return ctx[trimmed];
                if (/^[a-zA-Z_$][a-zA-Z0-9_$]*(?:\.[a-zA-Z_$][a-zA-Z0-9_$]*)+$/.test(trimmed)) {
                  const parts = trimmed.split(".");
                  let cur = ctx;
                  for (const p of parts) {
                    if (cur == null) return void 0;
                    cur = cur[p];
                  }
                  return cur;
                }
                try {
                  const keys = Object.keys(ctx);
                  const values = Object.values(ctx);
                  const fn = new Function(...keys, `return (${trimmed});`);
                  return fn(...values);
                } catch {
                  return null;
                }
              };
              const interpolate = (tpl, ctx) => {
                if (!tpl) return "";
                return tpl.replace(/\{\s*([a-zA-Z_$][a-zA-Z0-9_$.]*)\s*\}/g, (_, key) => {
                  const val = evalExpr(key, ctx);
                  return val !== void 0 && val !== null ? String(val) : "";
                });
              };
              const renderUIIRToAST = (node, parentPath, compInstancePath, index, context, keyOverride) => {
                if (!node) return null;
                switch (node.kind) {
                  case "UIText": {
                    const keySuffix = keyOverride ? `-k_${keyOverride}` : "";
                    const textId = `${parentPath}-txt_${index}${keySuffix}`;
                    const renderedText = interpolate(node.value, context);
                    return {
                      id: textId,
                      kind: "Literal",
                      value: renderedText,
                      raw: JSON.stringify(renderedText)
                    };
                  }
                  case "UIElement": {
                    const canonicalTag = (node.tag || "div").toLowerCase();
                    const explicitIdProp = (node.props || []).find((p) => p.name === "id");
                    const keySuffix = keyOverride ? `-k_${keyOverride}` : "";
                    const elemId = explicitIdProp ? String(explicitIdProp.value) : keyOverride ? `${parentPath}-${canonicalTag}${keySuffix}` : `${parentPath}-${canonicalTag}_${index}`;
                    const properties = [];
                    let hasExplicitId = false;
                    if (keyOverride) {
                      properties.push({
                        name: "key",
                        value: { id: `${elemId}-prop_key`, kind: "Literal", value: keyOverride, raw: JSON.stringify(keyOverride) }
                      });
                    }
                    for (const prop of node.props || []) {
                      if (prop.name === "id") hasExplicitId = true;
                      let pVal = prop.value;
                      if (typeof pVal === "string" && pVal.includes("{")) {
                        pVal = interpolate(pVal, context);
                      }
                      properties.push({
                        name: prop.name,
                        value: { id: `${elemId}-prop_${prop.name}`, kind: "Literal", value: pVal, raw: JSON.stringify(pVal) }
                      });
                    }
                    if (!hasExplicitId) {
                      properties.unshift({
                        name: "id",
                        value: { id: `${elemId}-prop_id`, kind: "Literal", value: elemId, raw: JSON.stringify(elemId) }
                      });
                    }
                    const children = [];
                    for (let i = 0; i < (node.children || []).length; i++) {
                      const childAST = renderUIIRToAST(node.children[i], elemId, compInstancePath, i, context);
                      if (childAST) children.push(childAST);
                    }
                    return {
                      id: elemId,
                      kind: "GenericComponent",
                      name: canonicalTag,
                      properties,
                      children
                    };
                  }
                  case "UIFragment": {
                    const children = [];
                    for (let i = 0; i < (node.children || []).length; i++) {
                      const childAST = renderUIIRToAST(node.children[i], `${parentPath}-frag_${index}`, compInstancePath, i, context);
                      if (childAST) children.push(childAST);
                    }
                    return children[0] || null;
                  }
                  case "UIConditional": {
                    let isTruthy = false;
                    try {
                      isTruthy = Boolean(evalExpr(node.conditionExpr, context));
                    } catch {
                      isTruthy = true;
                    }
                    const activeBranch = isTruthy ? node.thenBranch : node.elseBranch;
                    if (!activeBranch) return null;
                    return renderUIIRToAST(activeBranch, `${parentPath}-cond_${index}-${isTruthy ? "then" : "else"}`, compInstancePath, 0, context);
                  }
                  default:
                    return null;
                }
              };
              const derivedMap = reactivityDef.derived || {};
              const queue = [stateName];
              const affectedDerived = /* @__PURE__ */ new Set();
              while (queue.length > 0) {
                const cur = queue.shift();
                const dependents = reactivityDef.edges?.varToDerived?.[cur] || [];
                for (const dep of dependents) {
                  if (!affectedDerived.has(dep)) {
                    affectedDerived.add(dep);
                    queue.push(dep);
                  }
                }
              }
              for (const dName of affectedDerived) {
                const dInfo = derivedMap[dName];
                if (dInfo && dInfo.expression) {
                  const newVal = evalExpr(dInfo.expression, state);
                  state[dName] = newVal;
                  changedVars.push(dName);
                }
              }
              const affectedDomIds = /* @__PURE__ */ new Set();
              for (const v of changedVars) {
                const domIds = reactivityDef.edges?.varToDOM?.[v] || [];
                for (const domId of domIds) {
                  affectedDomIds.add(domId);
                }
              }
              const patches = [];
              for (const domId of affectedDomIds) {
                const dep = reactivityDef.domDependencies[domId];
                if (!dep) continue;
                switch (dep.kind) {
                  case "TEXT": {
                    const val = interpolate(dep.template || "", state);
                    patches.push({
                      operation: "UPDATE_TEXT" /* UPDATE_TEXT */,
                      nodeId: domId,
                      payload: { value: val, text: val }
                    });
                    break;
                  }
                  case "PROPERTY": {
                    if (dep.propName) {
                      const val = evalExpr(dep.expression || "", state);
                      patches.push({
                        operation: "SET_ATTRIBUTE" /* SET_ATTRIBUTE */,
                        nodeId: domId,
                        payload: { name: dep.propName, value: val }
                      });
                    }
                    break;
                  }
                  case "CLASS": {
                    if (dep.className && dep.expression) {
                      const active = Boolean(evalExpr(dep.expression, state));
                      patches.push({
                        operation: "SET_ATTRIBUTE" /* SET_ATTRIBUTE */,
                        nodeId: domId,
                        payload: { name: "class", className: dep.className, active }
                      });
                    }
                    break;
                  }
                  case "STYLE": {
                    const styleProp = dep.styleProp || dep.propName;
                    if (styleProp && dep.expression) {
                      const val = evalExpr(dep.expression, state);
                      patches.push({
                        operation: "SET_ATTRIBUTE" /* SET_ATTRIBUTE */,
                        nodeId: domId,
                        payload: { styleProp, value: val, name: "style" }
                      });
                    }
                    break;
                  }
                  case "BINDING": {
                    if (dep.propName && dep.expression) {
                      const val = state[dep.expression];
                      patches.push({
                        operation: "SET_ATTRIBUTE" /* SET_ATTRIBUTE */,
                        nodeId: domId,
                        payload: { name: dep.propName, value: val }
                      });
                    }
                    break;
                  }
                  case "CONDITIONAL": {
                    if (dep.expression) {
                      const isTruthy = Boolean(evalExpr(dep.expression, state));
                      const targetBranch = isTruthy ? "then" : "else";
                      if (dep.currentBranch !== targetBranch) {
                        dep.currentBranch = targetBranch;
                        const branchIR = isTruthy ? dep.thenBranch : dep.elseBranch;
                        if (branchIR) {
                          const branchAST = renderUIIRToAST(
                            branchIR,
                            `${dep.parentPath}-${targetBranch}`,
                            dep.compInstancePath,
                            0,
                            state
                          );
                          if (branchAST) {
                            const targetNodeId = dep.currentDomId || domId;
                            patches.push({
                              operation: "REPLACE_NODE" /* REPLACE_NODE */,
                              nodeId: targetNodeId,
                              payload: branchAST
                            });
                            dep.currentDomId = branchAST.id;
                          }
                        } else if (typeof dep.branchRenderer === "function") {
                          const branchAST = dep.branchRenderer(targetBranch, state);
                          if (branchAST) {
                            const targetNodeId = dep.currentDomId || domId;
                            patches.push({
                              operation: "REPLACE_NODE" /* REPLACE_NODE */,
                              nodeId: targetNodeId,
                              payload: branchAST
                            });
                            if (branchAST.id) {
                              dep.currentDomId = branchAST.id;
                            }
                          }
                        }
                      }
                    }
                    break;
                  }
                  case "LIST": {
                    const newItems = evalExpr(dep.arrayExpr || "", state) || state[dep.arrayExpr || ""] || [];
                    if (!Array.isArray(newItems)) break;
                    const oldKeys = dep.renderedKeys || [];
                    const newKeys = [];
                    const newItemMap = /* @__PURE__ */ new Map();
                    for (let i = 0; i < newItems.length; i++) {
                      const item = newItems[i];
                      let itemKey = i;
                      if (dep.keyExpr) {
                        const keyScope = typeof item === "object" && item !== null ? { ...item, [dep.itemVar || "item"]: item, index: i } : { [dep.itemVar || "item"]: item, index: i };
                        itemKey = evalExpr(dep.keyExpr, keyScope) ?? i;
                      } else if (typeof item === "string" || typeof item === "number") {
                        itemKey = item;
                      } else if (item && typeof item === "object" && ("id" in item || "key" in item)) {
                        itemKey = item.id ?? item.key;
                      }
                      const strKey = String(itemKey);
                      newKeys.push(strKey);
                      newItemMap.set(strKey, { item, index: i });
                    }
                    const tag = (dep.body?.tag || "li").toLowerCase();
                    const getItemId = (key) => `${dep.parentPath}-${tag}-k_${key}`;
                    const newKeySet = new Set(newKeys);
                    const removedKeys = oldKeys.filter((k) => !newKeySet.has(k));
                    for (const remKey of removedKeys) {
                      const remNodeId = getItemId(remKey);
                      patches.push({
                        operation: "REMOVE_NODE" /* REMOVE_NODE */,
                        nodeId: remNodeId
                      });
                    }
                    const oldKeySet = new Set(oldKeys);
                    for (const key of oldKeys) {
                      if (newKeySet.has(key)) {
                        const { item, index: itemIdx } = newItemMap.get(key);
                        const itemContext = typeof item === "object" && item !== null ? { ...state, ...item, [dep.itemVar || "item"]: item, index: itemIdx, [dep.indexVar || "index"]: itemIdx } : { ...state, [dep.itemVar || "item"]: item, index: itemIdx, [dep.indexVar || "index"]: itemIdx };
                        const itemId = getItemId(key);
                        if (dep.body && dep.body.children) {
                          for (let ci = 0; ci < dep.body.children.length; ci++) {
                            const child = dep.body.children[ci];
                            if (child.kind === "UIText") {
                              const textId = `${itemId}-txt_${ci}`;
                              const updatedText = interpolate(child.value, itemContext);
                              patches.push({
                                operation: "UPDATE_TEXT" /* UPDATE_TEXT */,
                                nodeId: textId,
                                payload: { value: updatedText, text: updatedText }
                              });
                            }
                          }
                        }
                      }
                    }
                    let currentOrder = oldKeys.filter((k) => newKeySet.has(k));
                    for (let targetIndex = 0; targetIndex < newKeys.length; targetIndex++) {
                      const key = newKeys[targetIndex];
                      const itemId = getItemId(key);
                      const { item, index: itemIdx } = newItemMap.get(key);
                      const itemContext = typeof item === "object" && item !== null ? { ...state, ...item, [dep.itemVar || "item"]: item, index: itemIdx, [dep.indexVar || "index"]: itemIdx } : { ...state, [dep.itemVar || "item"]: item, index: itemIdx, [dep.indexVar || "index"]: itemIdx };
                      if (!oldKeySet.has(key)) {
                        const itemAST = renderUIIRToAST(
                          dep.body,
                          dep.parentPath,
                          dep.compInstancePath,
                          targetIndex,
                          itemContext,
                          key
                        );
                        patches.push({
                          operation: "INSERT_CHILD" /* INSERT_CHILD */,
                          parentId: dep.containerId,
                          nodeId: itemId,
                          index: targetIndex,
                          payload: itemAST
                        });
                        currentOrder.splice(targetIndex, 0, key);
                      } else {
                        const currentIndex = currentOrder.indexOf(key);
                        if (currentIndex !== targetIndex && currentIndex !== -1) {
                          patches.push({
                            operation: "MOVE_CHILD" /* MOVE_CHILD */,
                            nodeId: itemId,
                            parentId: dep.containerId,
                            index: targetIndex
                          });
                          currentOrder.splice(currentIndex, 1);
                          currentOrder.splice(targetIndex, 0, key);
                        }
                      }
                    }
                    dep.renderedKeys = [...newKeys];
                    break;
                  }
                }
              }
              if (patches.length > 0 && self.domApplier && typeof self.domApplier.apply === "function") {
                self.domApplier.apply(patches);
              }
            }
          }
        },
        registerState: (instancePath, stateObj) => {
          if (!self.win) return;
          self.win.__leveonas_state__ = self.win.__leveonas_state__ || {};
          self.win.__leveonas_state__[instancePath] = {
            ...self.win.__leveonas_state__[instancePath] || {},
            ...stateObj
          };
        },
        registerReactivity: (instancePath, definition) => {
          if (!self.win) return;
          self.win.__leveonas_reactivity__ = self.win.__leveonas_reactivity__ || {};
          self.win.__leveonas_reactivity__[instancePath] = definition;
          self.win.__leveonas_state__ = self.win.__leveonas_state__ || {};
          self.win.__leveonas_state__[instancePath] = self.win.__leveonas_state__[instancePath] || {};
          const state = self.win.__leveonas_state__[instancePath];
          if (definition && definition.state) {
            for (const [sKey, sVal] of Object.entries(definition.state)) {
              if (state[sKey] === void 0) {
                state[sKey] = sVal;
              }
            }
          }
          if (definition && definition.derived) {
            for (const [dName, dInfo] of Object.entries(definition.derived)) {
              if (state[dName] === void 0 && dInfo.expression) {
                try {
                  const keys = Object.keys(state);
                  const values = Object.values(state);
                  const fn = new Function(...keys, `return (${dInfo.expression});`);
                  state[dName] = fn(...values);
                } catch {
                }
              }
            }
          }
        },
        registerReactivityGraph: (instancePath, graph) => {
          if (!self.win) return;
          self.win.__leveonas_reactivity__ = self.win.__leveonas_reactivity__ || {};
          self.win.__leveonas_reactivity__[instancePath] = graph;
        },
        setText: (target, text) => {
          const el = typeof target === "string" ? self.doc?.querySelector(target) : target;
          if (el) el.textContent = text;
        },
        setHTML: (target, html) => {
          const el = typeof target === "string" ? self.doc?.querySelector(target) : target;
          if (el) el.innerHTML = html;
        },
        addClass: (target, cls) => {
          const el = typeof target === "string" ? self.doc?.querySelector(target) : target;
          if (el && el.classList) el.classList.add(cls);
        },
        removeClass: (target, cls) => {
          const el = typeof target === "string" ? self.doc?.querySelector(target) : target;
          if (el && el.classList) el.classList.remove(cls);
        },
        toggleClass: (target, cls) => {
          const el = typeof target === "string" ? self.doc?.querySelector(target) : target;
          if (el && el.classList) el.classList.toggle(cls);
        },
        setTimeout: (fn, delay) => {
          const timerId = setTimeout(() => {
            self.activeTimers.delete(timerId);
            try {
              fn();
            } catch (err) {
              self.handleError(err, "setTimeout callback");
            }
          }, delay);
          self.activeTimers.add(timerId);
          return timerId;
        },
        setInterval: (fn, delay) => {
          const timerId = setInterval(() => {
            try {
              fn();
            } catch (err) {
              self.handleError(err, "setInterval callback");
            }
          }, delay);
          self.activeTimers.add(timerId);
          return timerId;
        },
        clearTimeout: (timerId) => {
          self.activeTimers.delete(timerId);
          clearTimeout(timerId);
        },
        clearInterval: (timerId) => {
          self.activeTimers.delete(timerId);
          clearInterval(timerId);
        }
      };
    }
    apply(patches) {
      if (!this.doc) return;
      for (const patch of patches) {
        const op = normalizePatchOperationType(patch.operation);
        switch (op) {
          case "ATTACH_EVENT_HANDLER" /* ATTACH_EVENT_HANDLER */:
          case "UPDATE_EVENT_HANDLER" /* UPDATE_EVENT_HANDLER */: {
            const { eventName, targetSelector, handlerCode } = patch.payload || {};
            if (eventName && targetSelector && handlerCode) {
              this.bindEventHandlerFromCode(patch.nodeId, eventName, targetSelector, handlerCode);
            }
            break;
          }
          case "REMOVE_EVENT_HANDLER" /* REMOVE_EVENT_HANDLER */: {
            this.removeRegisteredEventHandler(patch.nodeId);
            break;
          }
          case "CREATE_JS_UNIT" /* CREATE_JS_UNIT */:
          case "UPDATE_JS_UNIT" /* UPDATE_JS_UNIT */:
          case "EXECUTE_JS_UNIT" /* EXECUTE_JS_UNIT */: {
            const code = patch.payload?.code;
            if (code && typeof code === "string") {
              this.executeUnitCode(patch.nodeId, code);
            }
            break;
          }
          case "REMOVE_JS_UNIT" /* REMOVE_JS_UNIT */: {
            this.executedUnitCodes.delete(patch.nodeId);
            break;
          }
          case "CLEANUP_JS_SESSION" /* CLEANUP_JS_SESSION */: {
            this.cleanup();
            break;
          }
        }
      }
    }
    executeUnitCode(nodeId, code) {
      const trimmed = code.trim();
      if (!trimmed) return;
      if (this.executedUnitCodes.get(nodeId) === trimmed) {
        return;
      }
      this.executedUnitCodes.set(nodeId, trimmed);
      try {
        const qs = (sel) => this.doc?.querySelector(sel);
        const qsa = (sel) => this.doc?.querySelectorAll(sel);
        const gid = (id) => this.doc?.getElementById(id);
        const on = (evt, sel, fn) => this.registerEventHandler(`inline-evt-${evt}-${sel}`, evt, sel, fn);
        const varDeclMatch = /^(const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)(?:\s*=\s*([\s\S]+))?$/i.exec(trimmed);
        if (varDeclMatch) {
          const varName = varDeclMatch[2];
          const rawExpr = varDeclMatch[3] ? varDeclMatch[3].trim().replace(/;+$/, "") : "undefined";
          const valExpr = rawExpr || "undefined";
          const evalValFn = new Function(
            "document",
            "window",
            "qs",
            "qsa",
            "gid",
            "on",
            "__leveonas_runtime__",
            "scope",
            `with (window) { with (scope) { return (${valExpr}); } }`
          );
          const evalVal = evalValFn(this.doc, this.win, qs, qsa, gid, on, this.win?.__leveonas_runtime__, this.sharedScope);
          this.sharedScope[varName] = evalVal;
          if (this.win) {
            this.win[varName] = evalVal;
          }
          return;
        }
        const funcDeclMatch = /^(?:async\s+)?function(?:\s+([a-zA-Z_$][a-zA-Z0-9_$]*))\s*\(([^)]*)\)\s*\{([\s\S]*)\}$/i.exec(trimmed);
        if (funcDeclMatch) {
          const funcName = funcDeclMatch[1];
          const evalFn = new Function(
            "document",
            "window",
            "qs",
            "qsa",
            "gid",
            "on",
            "__leveonas_runtime__",
            "scope",
            `with (window) { with (scope) { return (${trimmed}); } }`
          );
          const fnObj = evalFn(this.doc, this.win, qs, qsa, gid, on, this.win?.__leveonas_runtime__, this.sharedScope);
          this.sharedScope[funcName] = fnObj;
          if (this.win) {
            this.win[funcName] = fnObj;
          }
          return;
        }
        const runner = new Function(
          "document",
          "window",
          "qs",
          "qsa",
          "gid",
          "on",
          "__leveonas_runtime__",
          "scope",
          `with (window) { with (scope) {
${trimmed}
}}`
        );
        runner(this.doc, this.win, qs, qsa, gid, on, this.win?.__leveonas_runtime__, this.sharedScope);
        if (this.win && this.sharedScope) {
          for (const k of Object.keys(this.sharedScope)) {
            this.win[k] = this.sharedScope[k];
          }
        }
      } catch (err) {
        this.handleError(err, `Executing JS unit ${nodeId}`);
      }
    }
    bindEventHandlerFromCode(nodeId, eventName, targetSelector, handlerCode) {
      try {
        let handlerFn;
        const cleanCode = handlerCode.trim().replace(/;+$/, "").trim();
        const qs = (sel) => this.doc?.querySelector(sel);
        const qsa = (sel) => this.doc?.querySelectorAll(sel);
        const gid = (id) => this.doc?.getElementById(id);
        const on = (evt, sel, fn) => this.registerEventHandler(`inline-evt-${evt}-${sel}`, evt, sel, fn);
        if (cleanCode.startsWith("function") || cleanCode.startsWith("(") || cleanCode.includes("=>")) {
          const builder = new Function(
            "document",
            "window",
            "qs",
            "qsa",
            "gid",
            "on",
            "__leveonas_runtime__",
            "scope",
            `with (window) { with (scope) { return (${cleanCode}); } }`
          );
          handlerFn = builder(this.doc, this.win, qs, qsa, gid, on, this.win?.__leveonas_runtime__, this.sharedScope);
        } else {
          handlerFn = new Function(
            "event",
            "target",
            "document",
            "window",
            "qs",
            "qsa",
            "gid",
            "on",
            "__leveonas_runtime__",
            "scope",
            `with (window) { with (scope) {
${cleanCode}
}}`
          );
        }
        this.registerEventHandler(nodeId, eventName, targetSelector, handlerFn);
      } catch (err) {
        this.handleError(err, `Compiling event handler for ${eventName} on ${targetSelector}`);
      }
    }
    registerEventHandler(nodeId, eventName, targetSelector, handlerFn) {
      this.removeRegisteredEventHandler(nodeId);
      const cleanEvent = eventName.toLowerCase().replace(/^on/, "");
      const self = this;
      const listener = (event) => {
        let matchedTarget = null;
        if (event.target) {
          if (event.target.closest) {
            matchedTarget = event.target.closest(targetSelector);
          } else if (event.target.matches && event.target.matches(targetSelector)) {
            matchedTarget = event.target;
          } else if (event.target.id && `#${event.target.id}` === targetSelector) {
            matchedTarget = event.target;
          }
        }
        if (matchedTarget) {
          try {
            const qs = (sel) => self.doc?.querySelector(sel);
            const qsa = (sel) => self.doc?.querySelectorAll(sel);
            const gid = (id) => self.doc?.getElementById(id);
            const on = (evt, sel, fn) => self.registerEventHandler(`inline-evt-${evt}-${sel}`, evt, sel, fn);
            handlerFn.call(
              matchedTarget,
              event,
              matchedTarget,
              self.doc,
              self.win,
              qs,
              qsa,
              gid,
              on,
              self.win?.__leveonas_runtime__,
              self.sharedScope
            );
          } catch (err) {
            self.handleError(err, `Event listener execution for ${cleanEvent} on ${targetSelector}`);
          }
        }
      };
      const target = this.doc?.body || this.doc;
      if (target && target.addEventListener) {
        target.addEventListener(cleanEvent, listener, false);
      }
      this.eventHandlerRegistry.set(nodeId, {
        nodeId,
        eventName: cleanEvent,
        targetSelector,
        handlerFn,
        listener
      });
    }
    removeRegisteredEventHandler(nodeId) {
      const existing = this.eventHandlerRegistry.get(nodeId);
      if (!existing) return;
      const target = this.doc?.body || this.doc;
      if (target && target.removeEventListener) {
        target.removeEventListener(existing.eventName, existing.listener, false);
      }
      this.eventHandlerRegistry.delete(nodeId);
    }
    cleanup() {
      const target = this.doc?.body || this.doc;
      if (target && target.removeEventListener) {
        for (const reg of this.eventHandlerRegistry.values()) {
          try {
            target.removeEventListener(reg.eventName, reg.listener, false);
          } catch (e) {
          }
        }
      }
      this.eventHandlerRegistry.clear();
      for (const timerId of this.activeTimers) {
        try {
          clearTimeout(timerId);
          clearInterval(timerId);
        } catch (e) {
        }
      }
      this.activeTimers.clear();
      this.executedUnitCodes.clear();
      this.sharedScope = {};
    }
    handleError(err, context) {
      if (this.onError) {
        this.onError(err, context);
      } else {
        console.warn(`[Leveonas JS Sandbox] ${context}:`, err);
      }
    }
  };

  // packages/runtime/incremental/patch-executor/dom-applier.ts
  var BOOLEAN_ATTRIBUTES = /* @__PURE__ */ new Set([
    "disabled",
    "checked",
    "readonly",
    "required",
    "hidden",
    "selected",
    "autofocus",
    "multiple",
    "novalidate",
    "open",
    "reversed"
  ]);
  function applyAttributeToElement(el, name, value) {
    let attrName = name;
    if (attrName === "className" || attrName === "cm") {
      attrName = "class";
    }
    const strVal = String(value ?? "");
    if (!isAttributeSafe(attrName, strVal)) {
      return;
    }
    const lowerName = attrName.toLowerCase();
    if (BOOLEAN_ATTRIBUTES.has(lowerName)) {
      const isTrue = value === true || strVal === "true" || strVal === attrName;
      if (isTrue) {
        if (el.setAttribute) el.setAttribute(attrName, "");
        el[lowerName] = true;
      } else {
        if (el.removeAttribute) el.removeAttribute(attrName);
        el[lowerName] = false;
      }
      return;
    }
    if (attrName === "class") {
      if (el.setAttribute) el.setAttribute("class", strVal);
      if ("className" in el) el.className = strVal;
      return;
    }
    if (attrName.startsWith("style.")) {
      const sProp = attrName.replace(/^style\./, "");
      const cleanVal = sanitizeCssText(strVal);
      if (el.style && typeof el.style === "object") {
        el.style[sProp] = cleanVal;
      }
      if (el.setAttribute) {
        const existing = el.getAttribute("style") || "";
        const styleObj = {};
        existing.split(";").forEach((p) => {
          const i = p.indexOf(":");
          if (i !== -1) styleObj[p.slice(0, i).trim()] = p.slice(i + 1).trim();
        });
        styleObj[sProp] = cleanVal;
        el.setAttribute("style", Object.entries(styleObj).map(([k, v]) => `${k}: ${v}`).join("; "));
      }
      return;
    }
    if (attrName === "style") {
      const cleanVal = sanitizeCssText(strVal);
      if (el.setAttribute) el.setAttribute("style", cleanVal);
      return;
    }
    if (attrName === "value" && "value" in el) {
      el.value = strVal;
      if (el.setAttribute) el.setAttribute("value", strVal);
      return;
    }
    if (el.setAttribute) {
      el.setAttribute(attrName, strVal);
    }
  }
  function removeAttributeFromElement(el, name) {
    let attrName = name;
    if (attrName === "className" || attrName === "cm") {
      attrName = "class";
    }
    const lowerName = attrName.toLowerCase();
    if (BOOLEAN_ATTRIBUTES.has(lowerName) && lowerName in el) {
      el[lowerName] = false;
    }
    if (attrName === "class" && "className" in el) {
      el.className = "";
    }
    if (attrName === "value" && "value" in el) {
      el.value = "";
    }
    if (el.removeAttribute) {
      el.removeAttribute(attrName);
    }
  }
  var DOMPatchApplier = class {
    constructor(container, documentObj, windowObj) {
      this.container = container;
      this.documentObj = documentObj;
      this.windowObj = windowObj;
      this.nodeMap = /* @__PURE__ */ new Map();
      if (!this.documentObj && typeof document !== "undefined") {
        this.documentObj = document;
      }
      if (!this.windowObj && typeof window !== "undefined") {
        this.windowObj = window;
      }
      this.cssApplier = new CSSPatchApplier(this.documentObj);
      this.jsApplier = new JSPatchApplier(this.documentObj, this.windowObj, void 0, this);
    }
    setDocument(doc, win) {
      this.documentObj = doc;
      if (win) this.windowObj = win;
      this.cssApplier = new CSSPatchApplier(doc);
      this.jsApplier = new JSPatchApplier(doc, this.windowObj || (typeof window !== "undefined" ? window : null), void 0, this);
    }
    setContainer(container) {
      this.container = container;
      this.rebuildNodeIndex(container);
    }
    getContainer() {
      return this.container;
    }
    registerNode(id, domNode) {
      this.nodeMap.set(id, domNode);
      if (domNode) {
        domNode.__ast_id = id;
      }
    }
    registerSubtree(node) {
      if (!node) return;
      if (node.nodeType === 1) {
        const astId = (node.getAttribute ? node.getAttribute("data-ast-id") : null) || (node.dataset ? node.dataset.astId : null) || node.__ast_id || (node.getAttribute ? node.getAttribute("id") : null) || node.id;
        if (astId) {
          this.nodeMap.set(astId, node);
          node.__ast_id = astId;
        }
      } else if (node.nodeType === 3 && node.__ast_id) {
        this.nodeMap.set(node.__ast_id, node);
      }
      if (node.childNodes) {
        for (let i = 0; i < node.childNodes.length; i++) {
          this.registerSubtree(node.childNodes[i]);
        }
      }
    }
    unregisterSubtree(node) {
      if (!node) return;
      if (node.nodeType === 1) {
        const astId = (node.getAttribute ? node.getAttribute("data-ast-id") : null) || (node.dataset ? node.dataset.astId : null) || node.__ast_id || (node.getAttribute ? node.getAttribute("id") : null) || node.id;
        if (astId) {
          this.nodeMap.delete(astId);
        }
        if (node.__ast_id) {
          this.nodeMap.delete(node.__ast_id);
        }
      } else if (node.nodeType === 3 && node.__ast_id) {
        this.nodeMap.delete(node.__ast_id);
      }
      if (node.childNodes) {
        for (let i = 0; i < node.childNodes.length; i++) {
          this.unregisterSubtree(node.childNodes[i]);
        }
      }
    }
    getNode(id) {
      if (this.nodeMap.has(id)) {
        return this.nodeMap.get(id);
      }
      if (this.container) {
        if (id === "leveonas-root" || this.container.__ast_id === id || this.container.getAttribute && this.container.getAttribute("data-ast-id") === id || this.container.getAttribute && this.container.getAttribute("id") === id || this.container.id === id) {
          this.nodeMap.set(id, this.container);
          return this.container;
        }
      }
      if (this.container && typeof this.container.querySelector === "function") {
        const el = this.container.querySelector(`[data-ast-id="${id}"]`);
        if (el) {
          this.nodeMap.set(id, el);
          return el;
        }
      }
      if (this.documentObj && typeof this.documentObj.getElementById === "function") {
        const el = this.documentObj.getElementById(id);
        if (el) {
          this.nodeMap.set(id, el);
          return el;
        }
      }
      return void 0;
    }
    deleteNode(id) {
      const node = this.nodeMap.get(id);
      if (node) {
        this.unregisterSubtree(node);
      }
      this.nodeMap.delete(id);
    }
    rebuildNodeIndex(rootElement) {
      if (!rootElement) return;
      this.registerSubtree(rootElement);
    }
    createDOMNode(payload) {
      const doc = this.documentObj || (typeof document !== "undefined" ? document : null);
      if (!doc) {
        throw new Error("DOM document is not available for creating DOM nodes");
      }
      if (!payload) return doc.createTextNode("");
      if (payload.kind === "Literal" /* Literal */ || payload.kind === "Literal" || payload.value !== void 0 && !payload.children && !payload.properties) {
        const textVal = String(payload.value !== void 0 ? payload.value : payload.text || "");
        const textNode = doc.createTextNode(textVal);
        if (payload.id) {
          this.nodeMap.set(payload.id, textNode);
          textNode.__ast_id = payload.id;
        }
        return textNode;
      }
      let tagName = "div";
      if (payload.kind === "GenericComponent" /* GenericComponent */ || payload.kind === "GenericComponent") {
        const genName = payload.name;
        tagName = ElementMap[genName] || genName || "div";
      } else if (payload.kind) {
        tagName = ElementMap[payload.kind] || "div";
      } else if (payload.name) {
        tagName = ElementMap[payload.name] || payload.name;
      }
      if (tagName.toLowerCase() === "script") {
        tagName = "template";
      }
      const element = doc.createElement(tagName);
      if (payload.id) {
        element.setAttribute("data-ast-id", payload.id);
        this.nodeMap.set(payload.id, element);
        element.__ast_id = payload.id;
      }
      const props = payload.properties || [];
      for (const prop of props) {
        const attrName = prop.name;
        const attrValue = prop.value !== void 0 ? typeof prop.value === "object" && prop.value !== null ? prop.value.value : prop.value : "";
        if (attrName) {
          applyAttributeToElement(element, attrName, attrValue);
        }
      }
      const children = payload.children || [];
      for (const child of children) {
        const childDOM = this.createDOMNode(child);
        element.appendChild(childDOM);
      }
      return element;
    }
    /**
     * Applies a sequence of patch operations sequentially with fail-fast atomicity.
     * If any operation fails, throws a PatchExecutorError immediately without silently swallowing.
     */
    apply(operations) {
      let validOps;
      try {
        validOps = validatePatches(operations);
      } catch (e) {
        throw new PatchExecutorError(`Patch validation failed: ${e.message}`);
      }
      for (let i = 0; i < validOps.length; i++) {
        const op = validOps[i];
        try {
          this.applyOperation(op);
        } catch (e) {
          if (e instanceof PatchExecutorError) {
            throw e;
          }
          throw new PatchExecutorError(
            `DOM execution failed at operation [${i}] ${op.operation} on node ${op.nodeId}: ${e.message}`
          );
        }
      }
    }
    /**
     * Alias for apply(operations).
     */
    applyPatches(operations) {
      return this.apply(operations);
    }
    applyOperation(op) {
      const operationType = normalizePatchOperationType(op.operation);
      switch (operationType) {
        case "UPDATE_TEXT" /* UPDATE_TEXT */: {
          if (!op.nodeId) {
            throw new PatchExecutorError("UPDATE_TEXT requires nodeId");
          }
          const target = this.getNode(op.nodeId);
          if (!target) {
            throw new PatchExecutorError(`UPDATE_TEXT target node ${op.nodeId} not found`);
          }
          if (target.nodeType !== 3) {
            throw new PatchExecutorError(
              `Invalid UPDATE_TEXT target: node ${op.nodeId} is an Element (nodeType ${target.nodeType}), expected Text node (nodeType 3)`
            );
          }
          const textVal = String(op.payload?.text ?? op.payload ?? "");
          target.nodeValue = textVal;
          target.textContent = textVal;
          break;
        }
        case "SET_ATTRIBUTE" /* SET_ATTRIBUTE */: {
          if (!op.nodeId) {
            throw new PatchExecutorError("SET_ATTRIBUTE requires nodeId");
          }
          const target = this.getNode(op.nodeId);
          if (!target) {
            throw new PatchExecutorError(`SET_ATTRIBUTE target node ${op.nodeId} not found`);
          }
          if (op.payload?.className !== void 0) {
            const cls = op.payload.className;
            const isActive = Boolean(op.payload.active);
            if (target.classList) {
              if (isActive) target.classList.add(cls);
              else target.classList.remove(cls);
            } else {
              const current = (target.className || target.getAttribute?.("class") || "").split(/\s+/).filter(Boolean);
              const filtered = current.filter((c) => c !== cls);
              if (isActive) filtered.push(cls);
              const finalCls = filtered.join(" ");
              if (target.setAttribute) target.setAttribute("class", finalCls);
              target.className = finalCls;
            }
            break;
          }
          if (op.payload?.styleProp !== void 0) {
            const sProp = op.payload.styleProp;
            const sVal = String(op.payload.value ?? "");
            if (target.style && typeof target.style === "object") {
              target.style[sProp] = sVal;
            }
            if (target.setAttribute) {
              const existingStyle = target.getAttribute("style") || "";
              const styleObj = {};
              existingStyle.split(";").forEach((pair) => {
                const idx = pair.indexOf(":");
                if (idx !== -1) {
                  styleObj[pair.slice(0, idx).trim()] = pair.slice(idx + 1).trim();
                }
              });
              styleObj[sProp] = sVal;
              const updatedStyle = Object.entries(styleObj).filter(([k, v]) => k && v).map(([k, v]) => `${k}: ${v}`).join("; ");
              target.setAttribute("style", updatedStyle);
            }
            break;
          }
          if (!op.payload || op.payload.name === void 0) {
            throw new PatchExecutorError(`SET_ATTRIBUTE requires payload.name for node ${op.nodeId}`);
          }
          applyAttributeToElement(target, op.payload.name, op.payload.value);
          break;
        }
        case "REMOVE_ATTRIBUTE" /* REMOVE_ATTRIBUTE */: {
          if (!op.nodeId) {
            throw new PatchExecutorError("REMOVE_ATTRIBUTE requires nodeId");
          }
          const target = this.getNode(op.nodeId);
          if (!target) {
            throw new PatchExecutorError(`REMOVE_ATTRIBUTE target node ${op.nodeId} not found`);
          }
          if (!op.payload || op.payload.name === void 0) {
            throw new PatchExecutorError(`REMOVE_ATTRIBUTE requires payload.name for node ${op.nodeId}`);
          }
          removeAttributeFromElement(target, op.payload.name);
          break;
        }
        case "INSERT_CHILD" /* INSERT_CHILD */: {
          const parent = op.parentId ? this.getNode(op.parentId) : this.container;
          if (!parent) {
            throw new PatchExecutorError(
              `INSERT_CHILD parent node ${op.parentId || "container"} not found (nodeId: ${op.nodeId}, index: ${op.index})`
            );
          }
          const newDom = this.createDOMNode(op.payload || { id: op.nodeId });
          const children = parent.childNodes || [];
          const index = op.index !== void 0 ? op.index : children.length;
          if (index < 0 || index > children.length) {
            throw new PatchExecutorError(
              `INSERT_CHILD invalid index ${index} for parent ${op.parentId || "container"} with ${children.length} children (nodeId: ${op.nodeId})`
            );
          }
          if (index < children.length) {
            parent.insertBefore(newDom, children[index]);
          } else {
            parent.appendChild(newDom);
          }
          break;
        }
        case "CREATE_NODE" /* CREATE_NODE */: {
          if (op.parentId) {
            const parent = this.getNode(op.parentId);
            if (!parent) {
              throw new PatchExecutorError(
                `CREATE_NODE parent node ${op.parentId} not found (nodeId: ${op.nodeId})`
              );
            }
            const newDom = this.createDOMNode(op.payload || { id: op.nodeId });
            const children = parent.childNodes || [];
            const index = op.index !== void 0 ? op.index : children.length;
            if (index < children.length) {
              parent.insertBefore(newDom, children[index]);
            } else {
              parent.appendChild(newDom);
            }
          } else if (this.container) {
            const newDom = this.createDOMNode(op.payload || { id: op.nodeId });
            this.container.appendChild(newDom);
          } else {
            this.createDOMNode(op.payload || { id: op.nodeId });
          }
          break;
        }
        case "REMOVE_NODE" /* REMOVE_NODE */: {
          if (!op.nodeId) {
            throw new PatchExecutorError("REMOVE_NODE requires nodeId");
          }
          const target = this.getNode(op.nodeId);
          if (!target) {
            throw new PatchExecutorError(`REMOVE_NODE target node ${op.nodeId} not found`);
          }
          this.unregisterSubtree(target);
          if (target.parentNode) {
            target.parentNode.removeChild(target);
          }
          break;
        }
        case "REMOVE_CHILD" /* REMOVE_CHILD */: {
          const target = op.nodeId ? this.getNode(op.nodeId) : void 0;
          if (target && target.parentNode) {
            this.unregisterSubtree(target);
            target.parentNode.removeChild(target);
          } else if (op.parentId) {
            const parent = this.getNode(op.parentId);
            if (!parent) {
              throw new PatchExecutorError(
                `REMOVE_CHILD target node ${op.nodeId || "unknown"} not found and parent ${op.parentId} not found (index: ${op.index})`
              );
            }
            const children = parent.childNodes || [];
            if (op.index !== void 0 && op.index >= 0 && op.index < children.length) {
              const childToRemove = children[op.index];
              this.unregisterSubtree(childToRemove);
              parent.removeChild(childToRemove);
            } else {
              throw new PatchExecutorError(
                `REMOVE_CHILD target node ${op.nodeId || "unknown"} not found and fallback index ${op.index} invalid for parent ${op.parentId} with ${children.length} children`
              );
            }
          } else {
            throw new PatchExecutorError(
              `REMOVE_CHILD target node ${op.nodeId || "unknown"} not found (parentId: ${op.parentId}, index: ${op.index})`
            );
          }
          break;
        }
        case "MOVE_CHILD" /* MOVE_CHILD */: {
          if (!op.nodeId) {
            throw new PatchExecutorError(`MOVE_CHILD requires nodeId (parentId: ${op.parentId}, index: ${op.index})`);
          }
          const target = this.getNode(op.nodeId);
          if (!target) {
            throw new PatchExecutorError(`MOVE_CHILD target node ${op.nodeId} not found (parentId: ${op.parentId}, index: ${op.index})`);
          }
          const parent = op.parentId ? this.getNode(op.parentId) : target.parentNode;
          if (!parent) {
            throw new PatchExecutorError(`MOVE_CHILD parent node ${op.parentId || "unknown"} not found for target ${op.nodeId} (index: ${op.index})`);
          }
          if (op.index === void 0 || op.index === null) {
            throw new PatchExecutorError(`MOVE_CHILD requires index for target ${op.nodeId} in parent ${op.parentId || "unknown"}`);
          }
          if (target.parentNode) {
            target.parentNode.removeChild(target);
          }
          const children = parent.childNodes || [];
          if (op.index < 0 || op.index > children.length) {
            throw new PatchExecutorError(
              `MOVE_CHILD invalid index ${op.index} for target ${op.nodeId} in parent ${op.parentId || "unknown"} with ${children.length} remaining children`
            );
          }
          if (op.index < children.length) {
            parent.insertBefore(target, children[op.index]);
          } else {
            parent.appendChild(target);
          }
          break;
        }
        case "REPLACE_NODE" /* REPLACE_NODE */: {
          if (!op.nodeId) {
            throw new PatchExecutorError("REPLACE_NODE requires nodeId");
          }
          const target = this.getNode(op.nodeId);
          if (!target) {
            throw new PatchExecutorError(`REPLACE_NODE target node ${op.nodeId} not found`);
          }
          if (target.parentNode) {
            const newDom = this.createDOMNode(op.payload);
            this.unregisterSubtree(target);
            target.parentNode.replaceChild(newDom, target);
          } else if (target === this.container) {
            this.unregisterSubtree(target);
            const newDom = this.createDOMNode(op.payload);
            this.container = newDom;
          } else {
            throw new PatchExecutorError(`REPLACE_NODE target node ${op.nodeId} has no parent`);
          }
          break;
        }
        case "REPLACE_CHILDREN" /* REPLACE_CHILDREN */: {
          const target = op.nodeId ? this.getNode(op.nodeId) : this.container;
          if (!target) {
            throw new PatchExecutorError(`REPLACE_CHILDREN target node ${op.nodeId || "container"} not found`);
          }
          if (target.childNodes) {
            for (let i = 0; i < target.childNodes.length; i++) {
              this.unregisterSubtree(target.childNodes[i]);
            }
          }
          const newChildren = (op.payload || []).map((c) => this.createDOMNode(c));
          if (typeof target.replaceChildren === "function") {
            target.replaceChildren(...newChildren);
          } else {
            while (target.firstChild) {
              target.removeChild(target.firstChild);
            }
            for (const child of newChildren) {
              target.appendChild(child);
            }
          }
          break;
        }
        case "NO_OP" /* NO_OP */:
          break;
        case "SET_CSS_STYLESHEET" /* SET_CSS_STYLESHEET */:
        case "CREATE_CSS_RULE" /* CREATE_CSS_RULE */:
        case "REMOVE_CSS_RULE" /* REMOVE_CSS_RULE */:
        case "UPDATE_CSS_RULE" /* UPDATE_CSS_RULE */:
        case "ADD_CSS_DECLARATION" /* ADD_CSS_DECLARATION */:
        case "UPDATE_CSS_DECLARATION" /* UPDATE_CSS_DECLARATION */:
        case "REMOVE_CSS_DECLARATION" /* REMOVE_CSS_DECLARATION */:
        case "UPDATE_CSS_SELECTOR" /* UPDATE_CSS_SELECTOR */:
        case "ADD_CSS_KEYFRAME" /* ADD_CSS_KEYFRAME */:
        case "REMOVE_CSS_KEYFRAME" /* REMOVE_CSS_KEYFRAME */:
        case "UPDATE_CSS_KEYFRAME" /* UPDATE_CSS_KEYFRAME */:
          this.cssApplier.apply([op]);
          break;
        case "CREATE_JS_UNIT" /* CREATE_JS_UNIT */:
        case "UPDATE_JS_UNIT" /* UPDATE_JS_UNIT */:
        case "REMOVE_JS_UNIT" /* REMOVE_JS_UNIT */:
        case "ATTACH_EVENT_HANDLER" /* ATTACH_EVENT_HANDLER */:
        case "UPDATE_EVENT_HANDLER" /* UPDATE_EVENT_HANDLER */:
        case "REMOVE_EVENT_HANDLER" /* REMOVE_EVENT_HANDLER */:
        case "EXECUTE_JS_UNIT" /* EXECUTE_JS_UNIT */:
        case "CLEANUP_JS_SESSION" /* CLEANUP_JS_SESSION */:
          this.jsApplier.apply([op]);
          break;
        default:
          throw new PatchExecutorError(`Unsupported or invalid patch operation: ${op.operation}`);
      }
    }
    getCSSApplier() {
      return this.cssApplier;
    }
    getJSApplier() {
      return this.jsApplier;
    }
    cleanupJS() {
      this.jsApplier.cleanup();
    }
  };

  // packages/runtime/incremental/patch-generator/serializer.ts
  var PatchSerializer = class {
    static serialize(operations) {
      return this.toJSON(operations);
    }
    static deserialize(json) {
      return this.fromJSON(json);
    }
    static toJSON(operations) {
      return JSON.stringify(operations);
    }
    /**
     * Deterministic logical JSON representation that excludes transport timestamps
     * and normalizes operation types for deterministic testing and snapshotting.
     */
    static toLogicalJSON(operations) {
      const logical = operations.map((op) => {
        const copy = {
          operation: normalizePatchOperationType(op.operation),
          nodeId: op.nodeId
        };
        if (op.parentId !== void 0) copy.parentId = op.parentId;
        if (op.index !== void 0) copy.index = op.index;
        if (op.payload !== void 0) copy.payload = op.payload;
        return copy;
      });
      return JSON.stringify(logical);
    }
    static fromJSON(json) {
      const parsed = JSON.parse(json);
      if (!Array.isArray(parsed)) {
        throw new Error("Invalid patch JSON: expected array of operations");
      }
      return parsed.map((item) => {
        if (item.op !== void 0 && item.n !== void 0) {
          const op = {
            operation: normalizePatchOperationType(item.op),
            nodeId: item.n
          };
          if (item.p !== void 0) op.parentId = item.p;
          if (item.i !== void 0) op.index = item.i;
          if (item.d !== void 0) op.payload = item.d;
          if (item.t !== void 0) op.timestamp = item.t;
          return op;
        }
        return {
          ...item,
          operation: normalizePatchOperationType(item.operation)
        };
      });
    }
    static toCompactJSON(operations) {
      const compact = operations.map((op) => {
        const c = {
          op: normalizePatchOperationType(op.operation),
          n: op.nodeId
        };
        if (op.parentId !== void 0) c.p = op.parentId;
        if (op.index !== void 0) c.i = op.index;
        if (op.payload !== void 0) c.d = op.payload;
        if (op.timestamp !== void 0) c.t = op.timestamp;
        return c;
      });
      return JSON.stringify(compact);
    }
  };

  // packages/common/origin.ts
  var PRODUCTION_LEVEONAS_ORIGIN = "https://leveonas.ainot.site";
  function getLeveonasOrigin(customOrigin) {
    if (customOrigin && typeof customOrigin === "string" && customOrigin.trim()) {
      return customOrigin.trim().replace(/\/+$/, "");
    }
    if (typeof window !== "undefined") {
      const win = window;
      if (win.LEVEONAS_ORIGIN && typeof win.LEVEONAS_ORIGIN === "string") {
        return win.LEVEONAS_ORIGIN.trim().replace(/\/+$/, "");
      }
      if (win.LEVEONAS_BASE_URL && typeof win.LEVEONAS_BASE_URL === "string") {
        return win.LEVEONAS_BASE_URL.trim().replace(/\/+$/, "");
      }
      if (win.location && win.location.origin) {
        const hostname = win.location.hostname;
        if (hostname === "localhost" || hostname === "127.0.0.1") {
          return win.location.origin.replace(/\/+$/, "");
        }
      }
    }
    if (typeof process !== "undefined" && process.env) {
      const envOrigin = process.env.NEXT_PUBLIC_LEVEONAS_ORIGIN || process.env.LEVEONAS_ORIGIN || process.env.NEXT_PUBLIC_LEVEONAS_BASE_URL;
      if (envOrigin && typeof envOrigin === "string" && envOrigin.trim()) {
        return envOrigin.trim().replace(/\/+$/, "");
      }
    }
    return PRODUCTION_LEVEONAS_ORIGIN;
  }
  function getLeveonasApiUrl(endpoint = "/api/generate", customOrigin) {
    if (/^https?:\/\//i.test(endpoint)) {
      return endpoint;
    }
    const origin = getLeveonasOrigin(customOrigin);
    const cleanPath = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${origin}${cleanPath}`;
  }
  function getLeveonasRuntimeScriptUrl(customOrigin) {
    const origin = getLeveonasOrigin(customOrigin);
    return `${origin}/leveonas-runtime.js`;
  }

  // packages/telemetry/client-tracker.ts
  function getUtf8ByteLength(str) {
    if (typeof TextEncoder !== "undefined") {
      return new TextEncoder().encode(str).length;
    }
    if (typeof Buffer !== "undefined") {
      return Buffer.byteLength(str, "utf8");
    }
    return unescape(encodeURIComponent(str)).length;
  }
  var ClientTelemetryTracker = class {
    constructor(initialRunId) {
      this.runId = null;
      this.fetchStartTimestamp = null;
      this.firstPatchReceivedTimestamp = null;
      this.firstPatchAppliedTimestamp = null;
      this.finalPatchReceivedTimestamp = null;
      this.patchBatchCount = 0;
      this.patchOperationCount = 0;
      this.receivedPatchPayloadBytes = 0;
      this.domApplyDurationMs = 0;
      this.serverRequestStartTimestamp = null;
      this.serverTimeToFirstPatchMs = null;
      if (initialRunId) {
        this.runId = initialRunId;
      }
    }
    setRunId(runId) {
      if (runId) {
        this.runId = runId;
      }
    }
    getRunId() {
      return this.runId;
    }
    /**
     * Record the client-side fetch start time.
     */
    recordFetchStart(timestamp) {
      this.fetchStartTimestamp = timestamp ?? Date.now();
    }
    /**
     * Record server timing received over the telemetry stream.
     */
    setServerTiming(serverRequestStartTimestamp, serverTimeToFirstPatchMs) {
      this.serverRequestStartTimestamp = serverRequestStartTimestamp;
      this.serverTimeToFirstPatchMs = serverTimeToFirstPatchMs;
    }
    /**
     * Record arrival of a patch batch in the browser SDK.
     * Uses actual UTF-8 encoded received patch payload byte length where available.
     */
    recordPatchBatch(patches, payloadByteLength) {
      const now = Date.now();
      if (this.firstPatchReceivedTimestamp === null) {
        this.firstPatchReceivedTimestamp = now;
      }
      this.finalPatchReceivedTimestamp = now;
      this.patchBatchCount++;
      this.patchOperationCount += patches.length;
      const byteLen = typeof payloadByteLength === "number" ? payloadByteLength : getUtf8ByteLength(JSON.stringify(patches));
      this.receivedPatchPayloadBytes += byteLen;
    }
    /**
     * Record that a patch batch has been applied to the iframe DOM.
     */
    recordPatchApplied(durationMs) {
      const now = Date.now();
      if (this.firstPatchAppliedTimestamp === null) {
        this.firstPatchAppliedTimestamp = now;
      }
      this.domApplyDurationMs += durationMs;
    }
    /**
     * Build the client telemetry snapshot.
     */
    getTelemetry() {
      const firstRenderDurationMs = this.firstPatchReceivedTimestamp !== null && this.firstPatchAppliedTimestamp !== null ? Math.max(0, this.firstPatchAppliedTimestamp - this.firstPatchReceivedTimestamp) : null;
      const clientTimeFromFetchStartToFirstPatchAppliedMs = this.fetchStartTimestamp !== null && this.firstPatchAppliedTimestamp !== null ? Math.max(0, this.firstPatchAppliedTimestamp - this.fetchStartTimestamp) : null;
      return {
        runId: this.runId,
        fetchStartTimestamp: this.fetchStartTimestamp,
        firstPatchReceivedTimestamp: this.firstPatchReceivedTimestamp,
        firstPatchAppliedTimestamp: this.firstPatchAppliedTimestamp,
        firstRenderDurationMs,
        clientTimeFromFetchStartToFirstPatchAppliedMs,
        serverRequestStartTimestamp: this.serverRequestStartTimestamp,
        serverTimeToFirstPatchMs: this.serverTimeToFirstPatchMs,
        patchBatchCount: this.patchBatchCount,
        patchOperationCount: this.patchOperationCount,
        receivedPatchPayloadBytes: this.receivedPatchPayloadBytes,
        patchBytes: this.receivedPatchPayloadBytes,
        finalPatchReceivedTimestamp: this.finalPatchReceivedTimestamp,
        domApplyDurationMs: this.domApplyDurationMs
      };
    }
  };

  // packages/client/engine.ts
  var Engine = class _Engine {
    constructor(config = {}) {
      this.controller = null;
      this.activeMessageListener = null;
      this.apiKey = config.apiKey || "";
      this.userLlmKey = config.userLlmKey || "";
      const customOrigin = config.baseUrl || config.origin;
      this.apiUrl = config.apiUrl ? getLeveonasApiUrl(config.apiUrl, customOrigin) : getLeveonasApiUrl("/api/generate", customOrigin);
      this.runtimeScriptUrl = getLeveonasRuntimeScriptUrl(customOrigin);
      this.expectedOrigin = getLeveonasOrigin(customOrigin);
    }
    static {
      this.DEFAULT_SANDBOX = "allow-scripts";
    }
    generate(options) {
      const {
        container,
        prompt,
        provider,
        model,
        maxTokens,
        emitDebugText,
        onChunk,
        onPatch,
        onComplete,
        onError,
        onQuotaExceeded,
        fallbackMode
      } = options;
      const containerEl = typeof container === "string" ? document.getElementById(container) || document.querySelector(container) : container;
      if (!containerEl) {
        const msg = `Leveonas: Container ${container} not found.`;
        console.error(msg);
        onError?.(msg);
        return;
      }
      this.cleanupListener();
      const clientTracker = options.telemetry || options.onTelemetry ? new ClientTelemetryTracker() : null;
      containerEl.innerHTML = "";
      containerEl.style.position = "relative";
      const iframe = document.createElement("iframe");
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "none";
      iframe.style.display = "block";
      iframe.style.minHeight = "400px";
      iframe.sandbox = _Engine.DEFAULT_SANDBOX;
      let parentOrigin = "*";
      try {
        if (typeof window !== "undefined" && window.location && window.location.origin && window.location.origin !== "null") {
          parentOrigin = window.location.origin;
        }
      } catch {
        parentOrigin = "*";
      }
      const runtimeUrl = this.runtimeScriptUrl;
      const iframeScript = _Engine.buildIframeSrcdoc(runtimeUrl, parentOrigin);
      iframe.srcdoc = iframeScript;
      containerEl.appendChild(iframe);
      const handleMessage = (event) => {
        if (event.source !== iframe.contentWindow) return;
        if (!event.data || typeof event.data !== "object") return;
        if (event.data.type === "leveonas:resize") {
          if (typeof event.data.height === "number" && Number.isFinite(event.data.height)) {
            iframe.style.height = event.data.height + "px";
          }
          if (typeof event.data.applyDuration === "number") {
            clientTracker?.recordPatchApplied(event.data.applyDuration);
          }
        } else if (event.data.type === "leveonas:error") {
          onError?.(typeof event.data.error === "string" ? event.data.error : "Iframe patch error");
        }
      };
      this.activeMessageListener = handleMessage;
      window.addEventListener("message", handleMessage);
      this._stream(
        iframe,
        prompt,
        provider,
        model,
        maxTokens,
        emitDebugText,
        options.telemetry,
        clientTracker,
        onChunk,
        onPatch,
        options.onServerTelemetry,
        () => {
          if (clientTracker && options.onTelemetry) {
            options.onTelemetry(clientTracker.getTelemetry());
          }
          onComplete?.();
        },
        onError,
        onQuotaExceeded,
        fallbackMode
      );
    }
    static buildIframeSrcdoc(runtimeUrl, parentOrigin) {
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="${runtimeUrl}"><\/script>
  <style id="leveonas-css"></style>
  <style>
    html, body { margin: 0; padding: 0; width: 100%; height: 100%; }
    #leveonas-root { width: 100%; min-height: 100%; }
  </style>
</head>
<body>
  <div id="leveonas-root" data-ast-id="leveonas-root"></div>
  <script>
    (function() {
      var applier = null;
      var rootEl = document.getElementById('leveonas-root');
      var parentOrigin = ${JSON.stringify(parentOrigin)};

      function getRuntime() {
        return window.LeveonasRuntime || null;
      }

      function initApplier() {
        if (!applier) {
          var runtime = getRuntime();
          if (runtime && runtime.DOMPatchApplier) {
            applier = new runtime.DOMPatchApplier(rootEl, document);
            applier.registerNode('leveonas-root', rootEl);
          }
        }
        return applier;
      }

      function postToParent(msg) {
        try {
          window.parent.postMessage(msg, parentOrigin);
        } catch (e) {
          window.parent.postMessage(msg, '*');
        }
      }

      window.addEventListener('message', function(event) {
        // The iframe uses sandbox="allow-scripts" without allow-same-origin, therefore its document has an opaque origin.
        // Security validation therefore relies primarily on:
        // event.source === window.parent
        // rather than assuming event.origin equals the host page origin.
        // Do not treat "*" as trusted by itself.
        if (event.source !== window.parent) return;
        if (!event.data || typeof event.data !== 'object') return;

        var type = event.data.type;
        // Only accept recognized Leveonas message types
        if (type !== 'leveonas:patch' && type !== 'leveonas:update' && type !== 'leveonas:reset') {
          return;
        }

        if (type === 'leveonas:reset') {
          try {
            var app = initApplier();
            if (app && app.cleanupJS) {
              app.cleanupJS();
            }
          } catch (e) {
            // ignore
          }
          return;
        }

        if (type === 'leveonas:patch') {
          try {
            var runtimeApplier = initApplier();
            if (!runtimeApplier) {
              throw new Error('DOMPatchApplier runtime is not initialized in iframe');
            }

            var patches = event.data.patches;
            var runtime = getRuntime();
            if (typeof patches === 'string' && runtime && runtime.PatchSerializer) {
              patches = runtime.PatchSerializer.fromJSON(patches);
            }

            // Validate patch structure before applying
            if (runtime && runtime.validatePatches) {
              patches = runtime.validatePatches(patches);
            } else if (!Array.isArray(patches)) {
              throw new Error('Invalid patch payload: expected an array');
            }

            var tStart = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
            runtimeApplier.apply(patches);
            var applyDuration = ((typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now()) - tStart;

            var h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, 400);
            postToParent({ type: 'leveonas:resize', height: h, applyDuration: applyDuration });
          } catch (err) {
            postToParent({
              type: 'leveonas:error',
              error: err.message || String(err)
            });
          }
        } else if (type === 'leveonas:update' && event.data.mode === 'fallback') {
          try {
            document.body.innerHTML = event.data.html;
            var h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, 400);
            postToParent({ type: 'leveonas:resize', height: h });
          } catch (err) {
            postToParent({
              type: 'leveonas:error',
              error: err.message || String(err)
            });
          }
        }
      });
    })();
  <\/script>
</body>
</html>`;
    }
    abort() {
      if (this.controller) {
        this.controller.abort();
        this.controller = null;
      }
      this.cleanupListener();
    }
    cleanupListener() {
      if (this.activeMessageListener) {
        window.removeEventListener("message", this.activeMessageListener);
        this.activeMessageListener = null;
      }
    }
    async _stream(iframe, prompt, provider, model, maxTokens, emitDebugText, telemetry, clientTracker, onChunk, onPatch, onServerTelemetry, onComplete, onError, onQuotaExceeded, fallbackMode) {
      this.controller = new AbortController();
      const signal = this.controller.signal;
      clientTracker?.recordFetchStart();
      try {
        const response = await fetch(this.apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-leveonas-key": this.apiKey,
            "x-user-llm-key": this.userLlmKey
          },
          body: JSON.stringify({
            prompt,
            provider,
            model,
            maxTokens,
            emitDebugText,
            telemetry
          }),
          signal
        });
        if (response.status === 402) {
          const errData = await response.json().catch(() => ({}));
          if (errData.error === "QUOTA_EXCEEDED" && onQuotaExceeded) {
            onQuotaExceeded();
            return;
          }
        }
        if (!response.ok) {
          const errText = await response.text().catch(() => "");
          throw new Error(`API Error: ${response.status} ${errText}`);
        }
        if (!response.body) {
          throw new Error("No response body received from generation endpoint");
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let lineBuffer = "";
        while (true) {
          if (signal.aborted) {
            await reader.cancel().catch(() => {
            });
            break;
          }
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          lineBuffer += chunk;
          const lines = lineBuffer.split("\n");
          lineBuffer = lines.pop() || "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const dataStr = trimmed.slice(5).trim();
            if (dataStr === "[DONE]") continue;
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.patch) {
                let patches = parsed.patch;
                if (typeof patches === "string") {
                  patches = PatchSerializer.fromJSON(patches);
                }
                try {
                  patches = validatePatches(patches);
                } catch (valErr) {
                  console.warn("Malformed patch received:", valErr.message);
                  onError?.(`Malformed patch rejected: ${valErr.message}`);
                  continue;
                }
                const payloadByteLength = getUtf8ByteLength(dataStr);
                clientTracker?.recordPatchBatch(patches, payloadByteLength);
                onPatch?.(patches);
                if (iframe.contentWindow) {
                  iframe.contentWindow.postMessage({ type: "leveonas:patch", patches }, "*");
                }
              }
              if (parsed.telemetry) {
                if (clientTracker) {
                  if (parsed.telemetry.runId) {
                    clientTracker.setRunId(parsed.telemetry.runId);
                  }
                  if (typeof parsed.telemetry.serverRequestStartTimestamp === "number") {
                    clientTracker.setServerTiming(
                      parsed.telemetry.serverRequestStartTimestamp,
                      parsed.telemetry.serverTimeToFirstPatchMs ?? parsed.telemetry.timeToFirstPatchMs ?? null
                    );
                  }
                }
                onServerTelemetry?.(parsed.telemetry);
              }
              if (parsed.text) {
                onChunk?.(parsed.text);
                if (fallbackMode && iframe.contentWindow) {
                  iframe.contentWindow.postMessage(
                    { type: "leveonas:update", html: parsed.text, mode: "fallback" },
                    "*"
                  );
                }
              }
              if (parsed.error) {
                onError?.(parsed.error);
              }
            } catch (e) {
            }
          }
        }
        if (!signal.aborted) {
          onComplete?.();
        }
      } catch (error) {
        if (error.name === "AbortError") {
        } else {
          onError?.(error.message || String(error));
        }
      } finally {
        this.controller = null;
      }
    }
  };
  if (typeof window !== "undefined") {
    window.Leveonas = window.Leveonas || {};
    window.Leveonas.Engine = Engine;
    window.LeveonasRuntime = {
      DOMPatchApplier,
      PatchSerializer,
      validatePatches,
      isPatchBatchValid,
      PatchValidationError
    };
  }
})();
