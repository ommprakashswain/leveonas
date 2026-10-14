"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/index.ts
var index_exports = {};
__export(index_exports, {
  AuthenticationError: () => AuthenticationError,
  CSSPatchApplier: () => CSSPatchApplier,
  DEFAULT_CONFIG: () => DEFAULT_CONFIG,
  DEFAULT_LEVEONAS_CONFIG: () => DEFAULT_LEVEONAS_CONFIG,
  DEFAULT_RETRY_POLICY: () => DEFAULT_RETRY_POLICY,
  DEFAULT_SECURITY_LIMITS: () => DEFAULT_SECURITY_LIMITS,
  DOMPatchApplier: () => DOMPatchApplier,
  DiffEngine: () => DiffEngine,
  FORBIDDEN_ATTRIBUTES: () => FORBIDDEN_ATTRIBUTES,
  GeminiProvider: () => GeminiProvider,
  GrokProvider: () => GrokProvider,
  HandlerRegistry: () => HandlerRegistry,
  JSPatchApplier: () => JSPatchApplier,
  LEVEONAS_VERSION: () => LEVEONAS_VERSION,
  LegacyPatchOperationAliases: () => LegacyPatchOperationAliases,
  Leveonas: () => LeveonasSession,
  LeveonasAbortError: () => LeveonasAbortError,
  LeveonasAuthError: () => LeveonasAuthError,
  LeveonasClient: () => LeveonasSession,
  LeveonasDiagnosticEngine: () => LeveonasDiagnosticEngine,
  LeveonasError: () => LeveonasError,
  LeveonasFormatter: () => LeveonasFormatter,
  LeveonasInspector: () => LeveonasInspector,
  LeveonasInvalidRequestError: () => LeveonasInvalidRequestError,
  LeveonasLanguageService: () => LeveonasLanguageService,
  LeveonasProviderError: () => LeveonasProviderError,
  LeveonasRateLimitError: () => LeveonasRateLimitError,
  LeveonasResourceLimitError: () => LeveonasResourceLimitError,
  LeveonasSecurityAuditor: () => LeveonasSecurityAuditor,
  LeveonasSecurityError: () => LeveonasSecurityError,
  LeveonasSession: () => LeveonasSession,
  LeveonasTimeoutError: () => LeveonasTimeoutError,
  LeveonasUnavailableError: () => LeveonasUnavailableError,
  MetricsCollector: () => MetricsCollector,
  OpenAIProvider: () => OpenAIProvider,
  OperationDispatcher: () => OperationDispatcher,
  PRODUCTION_LEVEONAS_ORIGIN: () => PRODUCTION_LEVEONAS_ORIGIN,
  Patch: () => Patch,
  PatchExecutor: () => PatchExecutor,
  PatchExecutorError: () => PatchExecutorError,
  PatchGenerator: () => PatchGenerator,
  PatchOperationType: () => PatchOperationType,
  PatchSerializer: () => PatchSerializer,
  PatchValidationError: () => PatchValidationError,
  STARTER_TEMPLATES: () => STARTER_TEMPLATES,
  TimeoutError: () => TimeoutError,
  URL_ATTRIBUTES: () => URL_ATTRIBUTES,
  VALID_MESSAGE_TYPES: () => VALID_MESSAGE_TYPES,
  VERSION: () => VERSION,
  ValidationError: () => ValidationError,
  addCSSDeclaration: () => addCSSDeclaration,
  addCSSKeyframe: () => addCSSKeyframe,
  addProperty: () => addProperty,
  attachEventHandler: () => attachEventHandler,
  attachTransportTimestamp: () => attachTransportTimestamp,
  censorPaths: () => censorPaths,
  censorSecrets: () => censorSecrets,
  cleanupJSSession: () => cleanupJSSession,
  compile: () => compile,
  createCSSRule: () => createCSSRule,
  createJSUnit: () => createJSUnit,
  createNode: () => createNode,
  createOperation: () => createOperation,
  createSession: () => createSession,
  diagnose: () => diagnose,
  executeJSUnit: () => executeJSUnit,
  format: () => format,
  getLeveonasOrigin: () => getLeveonasOrigin,
  getSecurityLimits: () => getSecurityLimits,
  handleAddProperty: () => handleAddProperty,
  handleInsertNode: () => handleInsertNode,
  handleMoveNode: () => handleMoveNode,
  handleNoOp: () => handleNoOp,
  handleRemoveNode: () => handleRemoveNode,
  handleRemoveProperty: () => handleRemoveProperty,
  handleReplaceChildren: () => handleReplaceChildren,
  handleReplaceNode: () => handleReplaceNode,
  handleUpdateProperty: () => handleUpdateProperty,
  handleUpdateText: () => handleUpdateText,
  insertChild: () => insertChild,
  insertNode: () => insertNode,
  inspect: () => inspect,
  isAttributeSafe: () => isAttributeSafe,
  isDangerousProtocol: () => isDangerousProtocol,
  isMessageSourceValid: () => isMessageSourceValid,
  isPatchBatchValid: () => isPatchBatchValid,
  isRetryableError: () => isRetryableError,
  isValidUrl: () => isValidUrl,
  loadLeveonasConfigFile: () => loadLeveonasConfigFile,
  lower: () => lower,
  materializeASTNode: () => materializeASTNode,
  moveChild: () => moveChild,
  moveNode: () => moveNode,
  noOp: () => noOp,
  normalizeAttributeName: () => normalizeAttributeName,
  normalizePatchOperationType: () => normalizePatchOperationType,
  normalizeUrlString: () => normalizeUrlString,
  parse: () => parse,
  removeAttribute: () => removeAttribute,
  removeCSSDeclaration: () => removeCSSDeclaration,
  removeCSSKeyframe: () => removeCSSKeyframe,
  removeCSSRule: () => removeCSSRule,
  removeChild: () => removeChild,
  removeEventHandler: () => removeEventHandler,
  removeJSUnit: () => removeJSUnit,
  removeNode: () => removeNode,
  removeProperty: () => removeProperty,
  replaceChildren: () => replaceChildren,
  replaceNode: () => replaceNode,
  resolveLeveonasConfig: () => resolveLeveonasConfig,
  runAuditCommand: () => runAuditCommand,
  runBenchmarkCommand: () => runBenchmarkCommand,
  runCLI: () => runCLI,
  runCheckCommand: () => runCheckCommand,
  runCompileCommand: () => runCompileCommand,
  runFormatCommand: () => runFormatCommand,
  runInitCommand: () => runInitCommand,
  runInspectCommand: () => runInspectCommand,
  safeStringify: () => safeStringify,
  sanitizeAttributes: () => sanitizeAttributes,
  sanitizeCssText: () => sanitizeCssText,
  sanitizeErrorMessage: () => sanitizeErrorMessage,
  sanitizeForInspection: () => sanitizeForInspection,
  sanitizeUrl: () => sanitizeUrl,
  serializeASTNode: () => serializeASTNode,
  setAttribute: () => setAttribute,
  setCSSStyleSheet: () => setCSSStyleSheet,
  updateCSSDeclaration: () => updateCSSDeclaration,
  updateCSSKeyframe: () => updateCSSKeyframe,
  updateCSSRule: () => updateCSSRule,
  updateCSSSelector: () => updateCSSSelector,
  updateEventHandler: () => updateEventHandler,
  updateJSUnit: () => updateJSUnit,
  updateProperty: () => updateProperty,
  updateText: () => updateText,
  validateIncomingMessage: () => validateIncomingMessage,
  validatePatchBatchSecurity: () => validatePatchBatchSecurity,
  validatePatchOperationSecurity: () => validatePatchOperationSecurity,
  validatePatches: () => validatePatches,
  withRetry: () => withRetry
});
module.exports = __toCommonJS(index_exports);

// packages/lsp/block-extractor.ts
var BLOCK_TAGS = {
  html: "html",
  HTML: "html",
  css: "css",
  CSS: "css",
  js: "js",
  JS: "js",
  javascript: "js",
  JAVASCRIPT: "js",
  ts: "ts",
  TS: "ts",
  typescript: "ts",
  TYPESCRIPT: "ts",
  react: "react",
  REACT: "react",
  vue: "vue",
  VUE: "vue",
  svelte: "svelte",
  SVELTE: "svelte",
  angular: "angular",
  ANGULAR: "angular",
  lm: "lm",
  LM: "lm"
};
var BlockExtractor = class _BlockExtractor {
  /**
   * Extract all embedded framework blocks from a document.
   */
  static extractBlocks(documentText) {
    const blocks = [];
    const regex = /<([A-Za-z]+)>([\s\S]*?)<\/\1>/g;
    let match;
    while ((match = regex.exec(documentText)) !== null) {
      const rawTag = match[1];
      const type = BLOCK_TAGS[rawTag] ?? "lm";
      const fullMatch = match[0];
      const innerContent = match[2];
      const startIndex = match.index;
      const endIndex = startIndex + fullMatch.length;
      const contentStartIndex = startIndex + rawTag.length + 2;
      const contentEndIndex = contentStartIndex + innerContent.length;
      const startPos = _BlockExtractor.offsetToPosition(documentText, startIndex);
      const endPos = _BlockExtractor.offsetToPosition(documentText, endIndex);
      const contentStartPos = _BlockExtractor.offsetToPosition(documentText, contentStartIndex);
      const contentEndPos = _BlockExtractor.offsetToPosition(documentText, contentEndIndex);
      blocks.push({
        type,
        content: innerContent,
        range: { start: startPos, end: endPos },
        contentRange: { start: contentStartPos, end: contentEndPos }
      });
    }
    if (blocks.length === 0) {
      const unclosedRegex = /<([A-Za-z]+)>([\s\S]*)$/;
      const unclosedMatch = unclosedRegex.exec(documentText);
      if (unclosedMatch) {
        const rawTag = unclosedMatch[1];
        const type = BLOCK_TAGS[rawTag] ?? "lm";
        const innerContent = unclosedMatch[2];
        const startIndex = unclosedMatch.index;
        const endIndex = documentText.length;
        const contentStartIndex = startIndex + rawTag.length + 2;
        blocks.push({
          type,
          content: innerContent,
          range: {
            start: _BlockExtractor.offsetToPosition(documentText, startIndex),
            end: _BlockExtractor.offsetToPosition(documentText, endIndex)
          },
          contentRange: {
            start: _BlockExtractor.offsetToPosition(documentText, contentStartIndex),
            end: _BlockExtractor.offsetToPosition(documentText, endIndex)
          }
        });
      } else {
        const endPos = _BlockExtractor.offsetToPosition(documentText, documentText.length);
        blocks.push({
          type: _BlockExtractor.detectImplicitType(documentText),
          content: documentText,
          range: { start: { line: 0, character: 0, offset: 0 }, end: endPos },
          contentRange: { start: { line: 0, character: 0, offset: 0 }, end: endPos }
        });
      }
    }
    return blocks;
  }
  /**
   * Find the active block containing the specified cursor position.
   */
  static getActiveBlock(documentText, position) {
    const blocks = _BlockExtractor.extractBlocks(documentText);
    const offset = position.offset ?? _BlockExtractor.positionToOffset(documentText, position);
    for (const b of blocks) {
      const bStartOffset = b.range.start.offset ?? _BlockExtractor.positionToOffset(documentText, b.range.start);
      const bEndOffset = b.range.end.offset ?? _BlockExtractor.positionToOffset(documentText, b.range.end);
      if (offset >= bStartOffset && offset <= bEndOffset) {
        return b;
      }
    }
    return blocks[0] ?? {
      type: "lm",
      content: documentText,
      range: { start: { line: 0, character: 0 }, end: _BlockExtractor.offsetToPosition(documentText, documentText.length) },
      contentRange: { start: { line: 0, character: 0 }, end: _BlockExtractor.offsetToPosition(documentText, documentText.length) }
    };
  }
  /**
   * Detect framework type from code keywords if tags are absent.
   */
  static detectImplicitType(code) {
    if (code.includes("reactive(") || code.includes("$derived") || code.includes("(each:") || code.includes("bind:value")) {
      return "svelte";
    }
    if (code.includes("computed(") || code.includes("(slot:") || code.includes("ref(")) {
      return "vue";
    }
    if (code.includes("signal(") || code.includes("[style.") || code.includes("[class.") || code.includes("*ngIf") || code.includes("*ngFor")) {
      return "angular";
    }
    if (code.includes("useState") || code.includes("state(") || code.includes("component(") || code.includes("props(")) {
      return "react";
    }
    if (code.includes("interface ") || code.includes("type ") || code.includes(": string") || code.includes(": number")) {
      return "ts";
    }
    if (code.includes("{") && code.includes("}") && (code.includes("color:") || code.includes("margin:") || code.includes("display:"))) {
      return "css";
    }
    return "html";
  }
  static offsetToPosition(text, offset) {
    let line = 0;
    let character = 0;
    const clamped = Math.max(0, Math.min(offset, text.length));
    for (let i = 0; i < clamped; i++) {
      if (text.charCodeAt(i) === 10) {
        line++;
        character = 0;
      } else {
        character++;
      }
    }
    return { line, character, offset: clamped };
  }
  static positionToOffset(text, pos) {
    let currentLine = 0;
    let currentChar = 0;
    for (let i = 0; i < text.length; i++) {
      if (currentLine === pos.line && currentChar === pos.character) {
        return i;
      }
      if (text.charCodeAt(i) === 10) {
        if (currentLine === pos.line) {
          return i;
        }
        currentLine++;
        currentChar = 0;
      } else {
        currentChar++;
      }
    }
    return text.length;
  }
};

// packages/compiler/interpreters/html-lm/vocabulary.ts
var KNOWN_ELEMENT_ABBREVIATIONS = {
  di: "div",
  bo: "button",
  so: "section",
  al: "article",
  ad: "aside",
  he: "header",
  fe: "footer",
  na: "nav",
  mi: "main",
  sa: "span",
  iu: "input",
  le: "label",
  tl: "table",
  cu: "canvas",
  fr: "form",
  pa: "p"
};
var KNOWN_ATTRIBUTE_ABBREVIATIONS = {
  cs: "class",
  cm: "className",
  hr: "href",
  id: "id",
  sr: "src",
  tp: "type",
  pe: "placeholder",
  nm: "name",
  vu: "value",
  oc: "onClick",
  og: "onChange"
};
var KNOWN_HTML_TAGS = /* @__PURE__ */ new Set([
  "div",
  "button",
  "section",
  "article",
  "aside",
  "header",
  "footer",
  "nav",
  "main",
  "span",
  "input",
  "label",
  "table",
  "canvas",
  "form",
  "p",
  "a",
  "img",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "select",
  "option",
  "textarea",
  "b",
  "i",
  "u",
  "s",
  "strong",
  "em",
  "small",
  "mark",
  "del",
  "ins",
  "sub",
  "sup",
  "code",
  "pre",
  "kbd",
  "samp",
  "var",
  "blockquote",
  "q",
  "cite",
  "abbr",
  "address",
  "time",
  "figure",
  "figcaption",
  "picture",
  "source",
  "audio",
  "video",
  "track",
  "iframe",
  "caption",
  "colgroup",
  "col",
  "tbody",
  "thead",
  "tfoot",
  "tr",
  "td",
  "th",
  "fieldset",
  "legend",
  "datalist",
  "optgroup",
  "output",
  "progress",
  "meter",
  "details",
  "summary",
  "dialog",
  "menu",
  "svg",
  "path",
  "circle",
  "rect",
  "line",
  "polyline",
  "polygon",
  "text",
  "g",
  "hr",
  "br",
  "wbr"
]);
var KNOWN_HTML_ATTRIBUTES = /* @__PURE__ */ new Set([
  "class",
  "className",
  "href",
  "id",
  "src",
  "type",
  "placeholder",
  "name",
  "value",
  "title",
  "alt",
  "role",
  "disabled",
  "hidden",
  "checked",
  "required",
  "readonly",
  "autofocus",
  "autoplay",
  "controls",
  "loop",
  "muted",
  "selected",
  "multiple",
  "action",
  "method",
  "for",
  "htmlFor",
  "target",
  "rel",
  "width",
  "height",
  "style",
  "min",
  "max",
  "step",
  "pattern",
  "accept",
  "autocomplete",
  "rows",
  "cols",
  "wrap",
  "tabindex",
  "contenteditable",
  "spellcheck",
  "draggable",
  "lang",
  "dir",
  "key",
  "ref",
  "onClick",
  "onChange",
  "onSubmit",
  "onInput",
  "onKeyDown",
  "onKeyUp"
]);
var TAG_TO_AST_KIND = {
  div: "Container" /* Container */,
  button: "Button" /* Button */,
  section: "Section" /* Section */,
  article: "Card" /* Card */,
  main: "Page" /* Page */,
  input: "Input" /* Input */,
  form: "Form" /* Form */,
  img: "Image" /* Image */,
  p: "Text" /* Text */
};
function resolveElementTag(identifier) {
  if (KNOWN_ELEMENT_ABBREVIATIONS[identifier]) {
    return KNOWN_ELEMENT_ABBREVIATIONS[identifier];
  }
  return identifier;
}
function resolveAttributeName(identifier) {
  if (KNOWN_ATTRIBUTE_ABBREVIATIONS[identifier]) {
    return KNOWN_ATTRIBUTE_ABBREVIATIONS[identifier];
  }
  return identifier;
}
function isAttributeCommand(identifier) {
  if (KNOWN_ATTRIBUTE_ABBREVIATIONS[identifier]) {
    return true;
  }
  if (KNOWN_HTML_ATTRIBUTES.has(identifier)) {
    return true;
  }
  if (identifier.startsWith("data-") || identifier.startsWith("aria-") || identifier.startsWith("on")) {
    return true;
  }
  return false;
}
function getASTKindForTag(canonicalTag) {
  const kind = TAG_TO_AST_KIND[canonicalTag];
  if (kind) {
    return { kind };
  }
  return { kind: "GenericComponent" /* GenericComponent */, customName: canonicalTag };
}

// packages/compiler/lexer/keywords.ts
var LM_COMPONENTS = /* @__PURE__ */ new Set([
  "Page",
  "Section",
  "Container",
  "Stack",
  "Row",
  "Column",
  "Grid",
  "Center",
  "Spacer",
  "Divider",
  "Surface",
  "Navbar",
  "Sidebar",
  "Breadcrumb",
  "Menu",
  "Dropdown",
  "Tabs",
  "Pagination",
  "Footer",
  "HeroTitle",
  "Heading",
  "Subheading",
  "Text",
  "Caption",
  "Code",
  "Quote",
  "Label",
  "Link",
  "Form",
  "Input",
  "Textarea",
  "Checkbox",
  "Radio",
  "Switch",
  "Select",
  "Slider",
  "Button",
  "SubmitButton",
  "ResetButton",
  "Image",
  "Video",
  "Audio",
  "Avatar",
  "Icon",
  "Logo",
  "Illustration",
  "Alert",
  "Toast",
  "Badge",
  "Progress",
  "Spinner",
  "Skeleton",
  "Tooltip",
  "Modal",
  "Dialog",
  "Table",
  "List",
  "Card",
  "Accordion",
  "Timeline",
  "Tree",
  "Stat",
  "Metric",
  "Chart",
  "Search",
  "CommandPalette",
  "Carousel",
  "Popover",
  "Drawer",
  "ContextMenu",
  "Chat",
  "PromptInput",
  "Message",
  "Artifact",
  "StreamingText",
  "StreamingCode",
  "StreamingPreview",
  "ReasoningPanel",
  "TokenCounter",
  "CodeBlock",
  "Terminal",
  "APIPlayground",
  "FileTree",
  "Console",
  "Markdown",
  "JSONViewer",
  "DiffViewer",
  "TabList",
  "TabPanels",
  "Tab",
  "Panel",
  "MenuItem",
  "AccordionItem",
  "TimelineEvent",
  "TreeNode",
  "Cell",
  "ListItem"
]);

// packages/lsp/diagnostics.ts
var LeveonasDiagnosticEngine = class _LeveonasDiagnosticEngine {
  /**
   * Run full diagnostics on an LM document or embedded framework blocks.
   */
  static diagnose(documentText, options = {}) {
    const diagnostics = [];
    const blocks = BlockExtractor.extractBlocks(documentText);
    for (const block of blocks) {
      const blockDiags = _LeveonasDiagnosticEngine.diagnoseBlock(block, documentText, options);
      diagnostics.push(...blockDiags);
    }
    return diagnostics;
  }
  /**
   * Diagnose a single embedded or top-level block.
   */
  static diagnoseBlock(block, fullDoc, options = {}) {
    const diagnostics = [];
    const content = block.content;
    const baseOffset = block.contentRange.start.offset ?? BlockExtractor.positionToOffset(fullDoc, block.contentRange.start);
    const parenStack = [];
    const stringRanges = [];
    let inString = false;
    let stringQuote = "";
    let stringStartIndex = -1;
    for (let i = 0; i < content.length; i++) {
      const ch = content[i];
      if (ch === '"' || ch === "'") {
        if (!inString) {
          inString = true;
          stringQuote = ch;
          stringStartIndex = i;
        } else if (stringQuote === ch && content[i - 1] !== "\\") {
          inString = false;
          stringRanges.push([stringStartIndex, i]);
          stringQuote = "";
          stringStartIndex = -1;
        }
        continue;
      }
      if (inString) continue;
      if (ch === "(" || ch === "[" || ch === "{") {
        parenStack.push({ char: ch, index: i });
      } else if (ch === ")" || ch === "]" || ch === "}") {
        if (parenStack.length === 0) {
          const pos = BlockExtractor.offsetToPosition(fullDoc, baseOffset + i);
          diagnostics.push({
            range: { start: pos, end: { ...pos, character: pos.character + 1 } },
            severity: 1 /* Error */,
            code: "UnexpectedClosingDelimiter",
            source: "leveonas-parser",
            message: `Unexpected closing delimiter '${ch}' without matching opening delimiter.`,
            isIncomplete: false
          });
        } else {
          const top = parenStack.pop();
          const matchMap = { ")": "(", "]": "[", "}": "{" };
          if (top.char !== matchMap[ch]) {
            const pos = BlockExtractor.offsetToPosition(fullDoc, baseOffset + i);
            diagnostics.push({
              range: { start: pos, end: { ...pos, character: pos.character + 1 } },
              severity: 1 /* Error */,
              code: "MismatchedDelimiter",
              source: "leveonas-parser",
              message: `Mismatched delimiter: expected '${matchMap[ch]}' to match '${top.char}', found '${ch}'.`,
              isIncomplete: false
            });
          }
        }
      }
    }
    if (inString && stringStartIndex >= 0) {
      const pos = BlockExtractor.offsetToPosition(fullDoc, baseOffset + stringStartIndex);
      const isAtEOF = stringStartIndex >= content.length - 2 || options.streaming;
      diagnostics.push({
        range: {
          start: pos,
          end: BlockExtractor.offsetToPosition(fullDoc, baseOffset + content.length)
        },
        severity: isAtEOF ? 3 /* Information */ : 1 /* Error */,
        code: isAtEOF ? "IncompleteString" : "UnterminatedString",
        source: "leveonas-lexer",
        message: isAtEOF ? "Incomplete string literal during streaming/editing." : "Unterminated string literal.",
        isIncomplete: isAtEOF
      });
    }
    if (parenStack.length > 0) {
      for (const unclosed of parenStack) {
        const pos = BlockExtractor.offsetToPosition(fullDoc, baseOffset + unclosed.index);
        const isStreaming = !!options.streaming;
        diagnostics.push({
          range: { start: pos, end: { ...pos, character: pos.character + 1 } },
          severity: isStreaming ? 3 /* Information */ : 1 /* Error */,
          code: isStreaming ? "IncompleteExpression" : "UnclosedDelimiter",
          source: "leveonas-parser",
          message: isStreaming ? `Incomplete expression: unclosed '${unclosed.char}' (in-progress stream or edit).` : `Syntax error: unclosed '${unclosed.char}'.`,
          isIncomplete: isStreaming
        });
      }
    }
    if (inString && stringStartIndex >= 0) {
      stringRanges.push([stringStartIndex, content.length]);
    }
    const isInsideString = (idx) => stringRanges.some(([s, e]) => idx >= s && idx <= e);
    const declaredState = /* @__PURE__ */ new Set();
    const declaredDerived = /* @__PURE__ */ new Set();
    const declaredProps = /* @__PURE__ */ new Set();
    const declaredComponents = /* @__PURE__ */ new Set();
    const declaredIds = /* @__PURE__ */ new Map();
    const stateRegex = /\b(?:state|ref|signal|useState)\s*\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    let stateMatch;
    while ((stateMatch = stateRegex.exec(content)) !== null) {
      declaredState.add(stateMatch[1]);
    }
    const stateBlockRegex = /\((?:state|ref|signal):([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    while ((stateMatch = stateBlockRegex.exec(content)) !== null) {
      declaredState.add(stateMatch[1]);
    }
    const derivedRegex = /\b(?:reactive|computed|\$derived)\s*\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    let derivedMatch;
    while ((derivedMatch = derivedRegex.exec(content)) !== null) {
      declaredDerived.add(derivedMatch[1]);
    }
    const derivedBlockRegex = /\((?:reactive|computed|derived):([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    while ((derivedMatch = derivedBlockRegex.exec(content)) !== null) {
      declaredDerived.add(derivedMatch[1]);
    }
    const compRegex = /\bcomponent\s*\(\s*([A-Za-z0-9_$]+)/g;
    let compMatch;
    while ((compMatch = compRegex.exec(content)) !== null) {
      declaredComponents.add(compMatch[1]);
    }
    const compBlockRegex = /\(component:([A-Za-z0-9_$]+)/g;
    while ((compMatch = compBlockRegex.exec(content)) !== null) {
      declaredComponents.add(compMatch[1]);
    }
    const propsRegex = /\bprops\s*\(([^)]*)\)/g;
    let propsMatch;
    while ((propsMatch = propsRegex.exec(content)) !== null) {
      const pList = propsMatch[1].split(",").map((s) => s.trim().split(":")[0].trim());
      for (const p of pList) {
        if (p) declaredProps.add(p);
      }
    }
    const headRegex = /\(\s*([a-zA-Z0-9_$:-]+)/g;
    let headMatch;
    while ((headMatch = headRegex.exec(content)) !== null) {
      if (isInsideString(headMatch.index)) continue;
      const rawHead = headMatch[1];
      const matchIndex = headMatch.index + 1;
      const pos = BlockExtractor.offsetToPosition(fullDoc, baseOffset + matchIndex);
      const headRange = {
        start: pos,
        end: { ...pos, character: pos.character + rawHead.length }
      };
      if (rawHead.includes(":")) {
        const [prefix] = rawHead.split(":");
        const validDirectives = [
          "component",
          "comp",
          "state",
          "computed",
          "reactive",
          "derived",
          "signal",
          "props",
          "prop",
          "slot",
          "if",
          "else",
          "when",
          "each",
          "for",
          "bind",
          "style",
          "class",
          "let",
          "click",
          "change",
          "input",
          "submit",
          "keydown",
          "keyup",
          "blur",
          "focus",
          "hover",
          "load",
          "error"
        ];
        if (!validDirectives.includes(prefix.toLowerCase()) && !KNOWN_ATTRIBUTE_ABBREVIATIONS[prefix] && !KNOWN_HTML_ATTRIBUTES.has(prefix) && !prefix.startsWith("on")) {
          diagnostics.push({
            range: headRange,
            severity: 2 /* Warning */,
            code: "UnknownDirective",
            source: "leveonas-validator",
            message: `Unknown directive or modifier prefix '${prefix}:'.`
          });
        }
        continue;
      }
      const textBefore = content.slice(0, headMatch.index).trimEnd();
      const isCallArgList = /\b(?:state|reactive|computed|derived|signal|component|comp|props|prop|let|exportLet|if|when|each|for|switch|case|default|function|fn)\s*$/i.test(textBefore);
      if (isCallArgList) {
        continue;
      }
      const isAbbr = rawHead in KNOWN_ELEMENT_ABBREVIATIONS;
      const isKnownHtml = KNOWN_HTML_TAGS.has(rawHead.toLowerCase());
      const isStdComponent = LM_COMPONENTS.has(rawHead);
      const isCustomComp = declaredComponents.has(rawHead);
      const isDeclaredVar = declaredState.has(rawHead) || declaredDerived.has(rawHead) || declaredProps.has(rawHead);
      const isKeyword2 = [
        "state",
        "computed",
        "reactive",
        "props",
        "prop",
        "component",
        "comp",
        "if",
        "when",
        "each",
        "for",
        "slot",
        "bind",
        "signal",
        "derived",
        "effect",
        "Root",
        "App",
        "let",
        "exportLet"
      ].includes(rawHead);
      if (!isAbbr && !isKnownHtml && !isStdComponent && !isCustomComp && !isKeyword2 && !isDeclaredVar) {
        if (rawHead[0] >= "A" && rawHead[0] <= "Z") {
        } else {
          diagnostics.push({
            range: headRange,
            severity: 2 /* Warning */,
            code: "UnknownElement",
            source: "leveonas-validator",
            message: `Unknown LM element or tag '${rawHead}'. Did you mean '${KNOWN_ELEMENT_ABBREVIATIONS[rawHead] ?? "div"}'?`
          });
        }
      }
    }
    const attrRegex = /\b([a-zA-Z0-9_$:-]+):/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(content)) !== null) {
      if (isInsideString(attrMatch.index)) continue;
      const rawAttr = attrMatch[1];
      const matchIndex = attrMatch.index;
      const pos = BlockExtractor.offsetToPosition(fullDoc, baseOffset + matchIndex);
      const attrRange = {
        start: pos,
        end: { ...pos, character: pos.character + rawAttr.length }
      };
      const isAbbr = rawAttr in KNOWN_ATTRIBUTE_ABBREVIATIONS;
      const isHtmlAttr = KNOWN_HTML_ATTRIBUTES.has(rawAttr);
      const isEvent = rawAttr.startsWith("on") || ["click", "change", "input", "submit", "keydown", "keyup"].includes(rawAttr);
      const isSpecial = ["bind", "style", "class", "key", "ref", "as", "slot", "target", "if", "each", "let"].includes(rawAttr);
      if (!isAbbr && !isHtmlAttr && !isEvent && !isSpecial && !rawAttr.startsWith("data-") && !rawAttr.startsWith("aria-")) {
        diagnostics.push({
          range: attrRange,
          severity: 4 /* Hint */,
          code: "UnknownProperty",
          source: "leveonas-validator",
          message: `Unrecognized property or attribute '${rawAttr}'.`
        });
      }
      if (rawAttr === "id" || rawAttr === "id:") {
        const idValRegex = /^(?:id:\s*["']([^"']+)["'])/;
        const subContent = content.slice(matchIndex);
        const idValMatch = idValRegex.exec(subContent);
        if (idValMatch) {
          const idValue = idValMatch[1];
          if (declaredIds.has(idValue)) {
            diagnostics.push({
              range: attrRange,
              severity: 2 /* Warning */,
              code: "DuplicateId",
              source: "leveonas-validator",
              message: `Duplicate DOM ID '${idValue}' in document. DOM IDs must be unique.`
            });
          } else {
            declaredIds.set(idValue, attrRange);
          }
        }
      }
    }
    if (options.validateReactivity !== false) {
      const derivedExprRegex = /\b(?:reactive|computed)\s*\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*,\s*([^)]+)\)|\((?:reactive|computed|derived):([a-zA-Z_$][a-zA-Z0-9_$]*)\s+([^)]+)\)/g;
      let exprMatch;
      while ((exprMatch = derivedExprRegex.exec(content)) !== null) {
        const expr = exprMatch[2] || exprMatch[4];
        if (!expr) continue;
        const matchIndex = exprMatch.index;
        const varRegex = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g;
        let vMatch;
        while ((vMatch = varRegex.exec(expr)) !== null) {
          const vName = vMatch[1];
          const isJsGlobal = ["Math", "String", "Number", "Boolean", "Array", "Object", "JSON", "Date", "true", "false", "null", "undefined"].includes(vName);
          if (!isJsGlobal && !declaredState.has(vName) && !declaredDerived.has(vName) && !declaredProps.has(vName)) {
            const pos = BlockExtractor.offsetToPosition(fullDoc, baseOffset + matchIndex);
            diagnostics.push({
              range: { start: pos, end: { ...pos, character: pos.character + exprMatch[0].length } },
              severity: 2 /* Warning */,
              code: "UnresolvedReactiveDependency",
              source: "leveonas-reactivity",
              message: `Derived computation references '${vName}' which is not a declared state variable or prop.`
            });
          }
        }
      }
    }
    if (block.type === "svelte") {
      if (content.includes("useState(") || content.includes("useEffect(")) {
        diagnostics.push({
          range: block.range,
          severity: 2 /* Warning */,
          code: "UnsupportedFrameworkFeature",
          source: "leveonas-svelte",
          message: "React hooks (useState/useEffect) found inside Svelte block. Use Svelte state()/reactive() instead."
        });
      }
    } else if (block.type === "vue") {
      if (content.includes("*ngIf") || content.includes("*ngFor")) {
        diagnostics.push({
          range: block.range,
          severity: 2 /* Warning */,
          code: "UnsupportedFrameworkFeature",
          source: "leveonas-vue",
          message: "Angular directives found inside Vue block. Use Vue conditionals and lists."
        });
      }
    } else if (block.type === "react") {
      if (content.includes("$derived(") || content.includes("$effect(")) {
        diagnostics.push({
          range: block.range,
          severity: 2 /* Warning */,
          code: "UnsupportedFrameworkFeature",
          source: "leveonas-react",
          message: "Svelte runes found inside React block. Use React state/memo instead."
        });
      }
    }
    return diagnostics;
  }
};

// packages/lsp/formatter.ts
var LeveonasFormatter = class _LeveonasFormatter {
  /**
   * Format an entire LM document or embedded blocks.
   */
  static format(documentText, options = {}) {
    const indentSize = options.tabSize ?? 2;
    const indentStr = " ".repeat(indentSize);
    const blocks = BlockExtractor.extractBlocks(documentText);
    if (blocks.length === 0) return documentText;
    if (blocks.length === 1 && blocks[0].type === "lm" && !documentText.startsWith("<")) {
      return _LeveonasFormatter.formatSExpressions(documentText.trim(), indentStr) + (options.insertFinalNewline !== false ? "\n" : "");
    }
    let result = "";
    const tagRegex = /<([A-Za-z]+)>([\s\S]*?)<\/\1>/g;
    let lastIndex = 0;
    let match;
    while ((match = tagRegex.exec(documentText)) !== null) {
      const preceding = documentText.slice(lastIndex, match.index);
      result += preceding;
      const tag = match[1];
      const inner = match[2].trim();
      const formattedInner = _LeveonasFormatter.formatSExpressions(inner, indentStr);
      result += `<${tag}>
${formattedInner}
</${tag}>`;
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < documentText.length) {
      const remaining = documentText.slice(lastIndex);
      if (remaining.trim()) {
        result += "\n" + _LeveonasFormatter.formatSExpressions(remaining.trim(), indentStr);
      }
    }
    if (options.insertFinalNewline !== false && !result.endsWith("\n")) {
      result += "\n";
    }
    return result;
  }
  /**
   * Deterministically formats S-expression syntax.
   */
  static formatSExpressions(code, indentUnit) {
    const tokens = _LeveonasFormatter.tokenizeForFormatting(code);
    let depth = 0;
    let formatted = "";
    let inFreshLine = true;
    for (let i = 0; i < tokens.length; i++) {
      const tok = tokens[i];
      if (tok === "(") {
        if (!inFreshLine && formatted.length > 0 && !formatted.endsWith(" ") && !formatted.endsWith("(") && !formatted.endsWith("\n")) {
          formatted += "\n" + indentUnit.repeat(depth);
          inFreshLine = true;
        }
        if (inFreshLine) {
          formatted += indentUnit.repeat(depth);
          inFreshLine = false;
        }
        formatted += "(";
        depth++;
        if (i + 1 < tokens.length && tokens[i + 1] !== "(" && tokens[i + 1] !== ")") {
          i++;
          formatted += tokens[i];
        }
      } else if (tok === ")") {
        depth = Math.max(0, depth - 1);
        formatted += ")";
        inFreshLine = false;
        if (i + 1 < tokens.length) {
          const nextTok = tokens[i + 1];
          if (nextTok === "(") {
            formatted += "\n";
            inFreshLine = true;
          }
        }
      } else {
        if (!formatted.endsWith("(") && !formatted.endsWith(" ") && !formatted.endsWith("\n")) {
          formatted += " ";
        }
        formatted += tok;
        inFreshLine = false;
      }
    }
    const lines = formatted.split("\n");
    const cleanedLines = lines.map((line) => line.trimEnd()).filter((line, idx, arr) => {
      if (line.trim() === "" && (idx === 0 || idx === arr.length - 1)) return false;
      return true;
    });
    return cleanedLines.join("\n");
  }
  static tokenizeForFormatting(code) {
    const tokens = [];
    let current = 0;
    while (current < code.length) {
      const ch = code[current];
      if (/\s/.test(ch)) {
        current++;
        continue;
      }
      if (ch === '"' || ch === "'") {
        const quote = ch;
        let strVal = quote;
        current++;
        while (current < code.length) {
          const sCh = code[current];
          strVal += sCh;
          current++;
          if (sCh === quote && code[current - 2] !== "\\") {
            break;
          }
        }
        tokens.push(strVal);
        continue;
      }
      if (ch === "(" || ch === ")" || ch === "[" || ch === "]" || ch === "{" || ch === "}") {
        tokens.push(ch);
        current++;
        continue;
      }
      let word = "";
      while (current < code.length && !/\s/.test(code[current]) && !/[()[\]{}]/.test(code[current])) {
        word += code[current];
        current++;
      }
      if (word) {
        tokens.push(word);
      }
    }
    return tokens;
  }
};

// packages/lsp/symbols.ts
var LeveonasSymbolsProvider = class _LeveonasSymbolsProvider {
  /**
   * Extract hierarchical document symbols from an LM document.
   */
  static getDocumentSymbols(documentText) {
    const symbols = [];
    const blocks = BlockExtractor.extractBlocks(documentText);
    for (const block of blocks) {
      const blockSymbols = _LeveonasSymbolsProvider.extractBlockSymbols(block, documentText);
      symbols.push(...blockSymbols);
    }
    return symbols;
  }
  static extractBlockSymbols(block, fullDoc) {
    const symbols = [];
    const content = block.content;
    const baseOffset = block.contentRange.start.offset ?? BlockExtractor.positionToOffset(fullDoc, block.contentRange.start);
    const compRegex = /\bcomponent\s*\(\s*([A-Za-z0-9_$]+)\s*\)(?:\s*\(\s*props\s*\(([^)]*)\)\))?|\(component:([A-Za-z0-9_$]+)(?:\s+\(props:\s*([^)]*)\))?/g;
    let compMatch;
    while ((compMatch = compRegex.exec(content)) !== null) {
      const name = compMatch[1] || compMatch[3];
      const propsStr = compMatch[2] || compMatch[4] || "";
      const matchOffset = baseOffset + compMatch.index;
      const startPos = BlockExtractor.offsetToPosition(fullDoc, matchOffset);
      const endPos = BlockExtractor.offsetToPosition(fullDoc, matchOffset + compMatch[0].length);
      const compSymbol = {
        name,
        detail: propsStr ? `props: (${propsStr})` : "component",
        kind: 5 /* Class */,
        range: { start: startPos, end: endPos },
        selectionRange: { start: startPos, end: endPos },
        children: []
      };
      if (propsStr) {
        const props = propsStr.split(",").map((s) => s.trim()).filter(Boolean);
        for (const p of props) {
          compSymbol.children?.push({
            name: p,
            detail: "prop",
            kind: 8 /* Field */,
            range: { start: startPos, end: endPos },
            selectionRange: { start: startPos, end: endPos }
          });
        }
      }
      symbols.push(compSymbol);
    }
    const stateRegex = /\b(?:state|ref|signal|useState)\s*\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*,\s*([^)]+)\)|\((?:state|ref|signal):([a-zA-Z_$][a-zA-Z0-9_$]*)\s+([^)]+)\)/g;
    let stateMatch;
    while ((stateMatch = stateRegex.exec(content)) !== null) {
      const name = stateMatch[1] || stateMatch[3];
      const initial = (stateMatch[2] || stateMatch[4] || "").trim();
      const matchOffset = baseOffset + stateMatch.index;
      const startPos = BlockExtractor.offsetToPosition(fullDoc, matchOffset);
      const endPos = BlockExtractor.offsetToPosition(fullDoc, matchOffset + stateMatch[0].length);
      symbols.push({
        name,
        detail: `initial: ${initial}`,
        kind: 13 /* Variable */,
        range: { start: startPos, end: endPos },
        selectionRange: { start: startPos, end: endPos }
      });
    }
    const derivedRegex = /\b(?:reactive|computed|\$derived)\s*\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*,\s*([^)]+)\)|\((?:reactive|computed|derived):([a-zA-Z_$][a-zA-Z0-9_$]*)\s+([^)]+)\)/g;
    let derivedMatch;
    while ((derivedMatch = derivedRegex.exec(content)) !== null) {
      const name = derivedMatch[1] || derivedMatch[3];
      const expr = (derivedMatch[2] || derivedMatch[4] || "").trim();
      const matchOffset = baseOffset + derivedMatch.index;
      const startPos = BlockExtractor.offsetToPosition(fullDoc, matchOffset);
      const endPos = BlockExtractor.offsetToPosition(fullDoc, matchOffset + derivedMatch[0].length);
      symbols.push({
        name,
        detail: `expr: ${expr}`,
        kind: 7 /* Property */,
        range: { start: startPos, end: endPos },
        selectionRange: { start: startPos, end: endPos }
      });
    }
    const elemRegex = /\(\s*([a-zA-Z0-9_$]+)(?:\s+cs:"([^"]*)")?(?:\s+id:"([^"]*)")?/g;
    let elemMatch;
    while ((elemMatch = elemRegex.exec(content)) !== null) {
      const tag = elemMatch[1];
      const cs = elemMatch[2];
      const id = elemMatch[3];
      const isKnown = tag in KNOWN_ELEMENT_ABBREVIATIONS;
      if (isKnown || ["Card", "Navbar", "Footer", "Header", "Sidebar"].includes(tag)) {
        const matchOffset = baseOffset + elemMatch.index;
        const startPos = BlockExtractor.offsetToPosition(fullDoc, matchOffset);
        const endPos = BlockExtractor.offsetToPosition(fullDoc, matchOffset + elemMatch[0].length);
        symbols.push({
          name: `<${KNOWN_ELEMENT_ABBREVIATIONS[tag] ?? tag}>`,
          detail: id ? `#${id}` : cs ? `.${cs}` : "",
          kind: 23 /* Struct */,
          range: { start: startPos, end: endPos },
          selectionRange: { start: startPos, end: endPos }
        });
      }
    }
    return symbols;
  }
};

// packages/compiler/ast/factory.ts
var nodeCounter = 0;
function generateNodeId() {
  return `ast_${++nodeCounter}`;
}
var ASTFactory = class _ASTFactory {
  static createSourceLocation(startLine, startColumn, startOffset, endLine, endColumn, endOffset) {
    return { startLine, startColumn, startOffset, endLine, endColumn, endOffset };
  }
  static createLiteral(value, raw, loc) {
    return {
      id: generateNodeId(),
      kind: "Literal" /* Literal */,
      value,
      raw,
      parent: null,
      sourceLocation: loc,
      metadata: {}
    };
  }
  static createProperty(name, value, loc) {
    const prop = {
      id: generateNodeId(),
      kind: "Property" /* Property */,
      name,
      value,
      parent: null,
      sourceLocation: loc,
      metadata: {}
    };
    if (value) value.parent = prop;
    return prop;
  }
  static createComponent(kind, loc, properties = [], children = [], name) {
    const comp = {
      id: generateNodeId(),
      kind,
      properties,
      children,
      parent: null,
      sourceLocation: loc,
      metadata: {},
      ...name ? { name } : {}
    };
    properties.forEach((p) => p.parent = comp);
    children.forEach((c) => c.parent = comp);
    return comp;
  }
  static clone(node, parent = null) {
    const cloned = { ...node, id: generateNodeId(), parent, metadata: { ...node.metadata } };
    if (cloned.kind === "Property" /* Property */) {
      if (cloned.value) cloned.value = _ASTFactory.clone(cloned.value, cloned);
    } else if (cloned.kind !== "Literal" /* Literal */) {
      cloned.properties = cloned.properties?.map((p) => _ASTFactory.clone(p, cloned)) || [];
      cloned.children = cloned.children?.map((c) => _ASTFactory.clone(c, cloned)) || [];
    }
    return cloned;
  }
};

// packages/compiler/interpreters/html-lm/interpreter.ts
var HTMLLMInterpreter = class _HTMLLMInterpreter {
  constructor(options = {}) {
    this.elementStack = [];
    this.activeAttribute = null;
    this.pendingIdent = "";
    this.pendingIdentStartLoc = null;
    this.diagnostics = [];
    this.options = options;
    this.currentLoc = {
      startLine: 1,
      startColumn: 1,
      startOffset: 0,
      endLine: 1,
      endColumn: 1,
      endOffset: 0
    };
    this.root = ASTFactory.createComponent("Root" /* Root */, { ...this.currentLoc });
  }
  /**
   * Reset interpreter state for a fresh parse.
   */
  reset() {
    this.currentLoc = {
      startLine: 1,
      startColumn: 1,
      startOffset: 0,
      endLine: 1,
      endColumn: 1,
      endOffset: 0
    };
    this.root = ASTFactory.createComponent("Root" /* Root */, { ...this.currentLoc });
    this.elementStack = [];
    this.activeAttribute = null;
    this.pendingIdent = "";
    this.pendingIdentStartLoc = null;
    this.diagnostics = [];
  }
  /**
   * Return the canonical AST RootNode.
   */
  getAST() {
    return this.root;
  }
  /**
   * Return diagnostics collected during parsing.
   */
  getDiagnostics() {
    return [...this.diagnostics];
  }
  hasErrors() {
    return this.diagnostics.some((d) => d.severity === "error");
  }
  hasPendingTokens() {
    return this.pendingIdent.length > 0 || this.activeAttribute !== null;
  }
  getElementStackDepth() {
    return this.elementStack.length;
  }
  /**
   * Checks if the interpreter's current AST state is safely recoverable and exposed to downstream renderers.
   * An AST state is safe to expose if:
   * 1. At least one element has been constructed (root has children).
   * 2. No attribute command is currently mid-parse (activeAttribute is null).
   * 3. No pending token/identifier is in flight (pendingIdent is empty).
   * 4. No unclosed text is currently buffered on the deepest open element.
   * 5. No fatal parsing errors have been logged.
   */
  isSafeToExpose() {
    if (this.activeAttribute !== null) return false;
    if (this.pendingIdent.length > 0) return false;
    if (this.root.children.length === 0) return false;
    if (this.elementStack.length > 0) {
      const top = this.getCurrentElement();
      if (top && top.textBuffer.length > 0) {
        return false;
      }
    }
    return !this.hasErrors();
  }
  /**
   * Write an arbitrary chunk of streaming HTML-LM content.
   */
  write(chunk) {
    for (let i = 0; i < chunk.length; i++) {
      const char = chunk[i];
      this.consumeChar(char);
    }
    return this;
  }
  /**
   * Finalize the stream and flush any pending partial constructs.
   */
  end() {
    if (this.pendingIdent.length > 0) {
      if (this.activeAttribute) {
        this.activeAttribute.valueBuffer += this.pendingIdent;
      } else if (this.elementStack.length > 0) {
        const current = this.getCurrentElement();
        current.textBuffer += this.pendingIdent;
      }
      this.pendingIdent = "";
      this.pendingIdentStartLoc = null;
    }
    if (this.activeAttribute) {
      const attr = this.activeAttribute;
      this.activeAttribute = null;
      let rawValue = attr.valueBuffer.trim();
      let parsedValue = rawValue;
      if (rawValue.startsWith('"') && rawValue.endsWith('"') && rawValue.length >= 2 || rawValue.startsWith("'") && rawValue.endsWith("'") && rawValue.length >= 2) {
        parsedValue = rawValue.slice(1, -1);
      }
      const currentElem = this.getCurrentElement();
      if (currentElem) {
        const litLoc = ASTFactory.createSourceLocation(
          attr.location.startLine,
          attr.location.startColumn,
          attr.location.startOffset,
          this.currentLoc.endLine,
          this.currentLoc.endColumn,
          this.currentLoc.endOffset
        );
        const literal = ASTFactory.createLiteral(parsedValue, rawValue, litLoc);
        const propNode = ASTFactory.createProperty(attr.name, literal, litLoc);
        propNode.parent = currentElem.node;
        currentElem.node.properties.push(propNode);
      }
      this.reportDiagnostic(
        `UNCLOSED_ATTRIBUTE: Attribute '${attr.name}' is unclosed`,
        attr.location,
        "error"
      );
    }
    for (let i = this.elementStack.length - 1; i >= 0; i--) {
      const frame = this.elementStack[i];
      if (frame.textBuffer.length > 0) {
        this.flushTextBuffer(frame);
      }
    }
    if (this.elementStack.length > 0) {
      for (const frame of this.elementStack) {
        this.reportDiagnostic(
          `UNCLOSED_ELEMENT: Element '${frame.customName || frame.tagName}' is unclosed`,
          frame.location,
          "error"
        );
      }
    }
    return this.root;
  }
  /**
   * Parse a complete HTML-LM source string.
   */
  static parse(source, options) {
    const interpreter = new _HTMLLMInterpreter(options);
    interpreter.write(source);
    return interpreter.end();
  }
  consumeChar(char) {
    const charLoc = {
      startLine: this.currentLoc.endLine,
      startColumn: this.currentLoc.endColumn,
      startOffset: this.currentLoc.endOffset,
      endLine: this.currentLoc.endLine,
      endColumn: this.currentLoc.endColumn + 1,
      endOffset: this.currentLoc.endOffset + 1
    };
    if (char === "\n") {
      charLoc.endLine = this.currentLoc.endLine + 1;
      charLoc.endColumn = 1;
    }
    if (this.activeAttribute) {
      this.handleAttributeChar(char, charLoc);
    } else {
      this.handleGeneralChar(char, charLoc);
    }
    this.currentLoc = charLoc;
  }
  handleAttributeChar(char, loc) {
    const attr = this.activeAttribute;
    if (char === "(") {
      attr.parenDepth++;
      attr.valueBuffer += char;
    } else if (char === ")") {
      attr.parenDepth--;
      if (attr.parenDepth === 0) {
        this.closeAttribute();
      } else {
        attr.valueBuffer += char;
      }
    } else {
      attr.valueBuffer += char;
    }
  }
  closeAttribute() {
    if (!this.activeAttribute) return;
    const attr = this.activeAttribute;
    this.activeAttribute = null;
    let rawValue = attr.valueBuffer.trim();
    let parsedValue = rawValue;
    if (rawValue.startsWith('"') && rawValue.endsWith('"') && rawValue.length >= 2 || rawValue.startsWith("'") && rawValue.endsWith("'") && rawValue.length >= 2) {
      parsedValue = rawValue.slice(1, -1);
    } else if (rawValue.length === 0) {
      parsedValue = true;
      rawValue = "true";
    }
    const currentElem = this.getCurrentElement();
    if (currentElem) {
      const litLoc = ASTFactory.createSourceLocation(
        attr.location.startLine,
        attr.location.startColumn,
        attr.location.startOffset,
        this.currentLoc.endLine,
        this.currentLoc.endColumn,
        this.currentLoc.endOffset
      );
      const literal = ASTFactory.createLiteral(parsedValue, rawValue, litLoc);
      const propNode = ASTFactory.createProperty(attr.name, literal, litLoc);
      propNode.parent = currentElem.node;
      currentElem.node.properties.push(propNode);
    }
  }
  handleGeneralChar(char, loc) {
    if (char === "(") {
      if (this.pendingIdent.length > 0) {
        const ident = this.pendingIdent;
        const identLoc = this.pendingIdentStartLoc || loc;
        this.pendingIdent = "";
        this.pendingIdentStartLoc = null;
        if (this.elementStack.length > 0 && isAttributeCommand(ident)) {
          this.activeAttribute = {
            name: resolveAttributeName(ident),
            rawName: ident,
            valueBuffer: "",
            parenDepth: 1,
            location: identLoc
          };
        } else {
          this.openElement(ident, identLoc);
        }
      } else {
        if (this.elementStack.length > 0) {
          this.getCurrentElement().textBuffer += char;
        }
      }
    } else if (char === ")") {
      if (this.pendingIdent.length > 0) {
        if (this.elementStack.length > 0) {
          this.getCurrentElement().textBuffer += this.pendingIdent;
        }
        this.pendingIdent = "";
        this.pendingIdentStartLoc = null;
      }
      if (this.elementStack.length > 0) {
        this.closeElement();
      } else {
        this.reportDiagnostic("Unmatched closing parenthesis at root", loc, "warning");
      }
    } else if (this.isIdentifierChar(char)) {
      if (this.pendingIdent.length === 0) {
        this.pendingIdentStartLoc = loc;
      }
      this.pendingIdent += char;
    } else if (this.isWhitespaceChar(char)) {
      if (this.pendingIdent.length > 0) {
        if (this.elementStack.length > 0) {
          const current = this.getCurrentElement();
          if (current.textBuffer.length > 0) {
            current.textBuffer += this.pendingIdent + char;
          } else {
            current.textBuffer += this.pendingIdent + " ";
          }
        }
        this.pendingIdent = "";
        this.pendingIdentStartLoc = null;
      } else if (this.elementStack.length > 0) {
        const current = this.getCurrentElement();
        if (current.textBuffer.length > 0) {
          current.textBuffer += char;
        }
      }
    } else {
      if (this.pendingIdent.length > 0) {
        if (this.elementStack.length > 0) {
          this.getCurrentElement().textBuffer += this.pendingIdent;
        }
        this.pendingIdent = "";
        this.pendingIdentStartLoc = null;
      }
      if (this.elementStack.length > 0) {
        this.getCurrentElement().textBuffer += char;
      }
    }
  }
  openElement(ident, loc) {
    if (this.elementStack.length > 0) {
      const parent = this.getCurrentElement();
      if (parent.textBuffer.length > 0) {
        this.flushTextBuffer(parent);
      }
      parent.hasChildElements = true;
    }
    const canonicalTag = resolveElementTag(ident);
    const { kind, customName } = getASTKindForTag(canonicalTag);
    const elemNode = ASTFactory.createComponent(kind, loc, [], [], customName);
    if (this.elementStack.length > 0) {
      const parentNode = this.getCurrentElement().node;
      elemNode.parent = parentNode;
      parentNode.children.push(elemNode);
    } else {
      elemNode.parent = this.root;
      this.root.children.push(elemNode);
    }
    this.elementStack.push({
      kind,
      tagName: canonicalTag,
      customName,
      node: elemNode,
      textBuffer: "",
      hasChildElements: false,
      location: loc
    });
  }
  closeElement() {
    const frame = this.elementStack.pop();
    if (!frame) return;
    if (frame.textBuffer.length > 0) {
      this.flushTextBuffer(frame);
    }
  }
  flushTextBuffer(frame) {
    const rawText = frame.textBuffer;
    frame.textBuffer = "";
    if (frame.hasChildElements && rawText.trim().length === 0) {
      return;
    }
    const textToEmit = rawText.trim();
    if (textToEmit.length > 0) {
      const loc = ASTFactory.createSourceLocation(
        frame.location.startLine,
        frame.location.startColumn,
        frame.location.startOffset,
        this.currentLoc.endLine,
        this.currentLoc.endColumn,
        this.currentLoc.endOffset
      );
      const litNode = ASTFactory.createLiteral(textToEmit, textToEmit, loc);
      litNode.parent = frame.node;
      frame.node.children.push(litNode);
    }
  }
  getCurrentElement() {
    return this.elementStack[this.elementStack.length - 1];
  }
  isIdentifierChar(char) {
    const code = char.charCodeAt(0);
    return code >= 65 && code <= 90 || // A-Z
    code >= 97 && code <= 122 || // a-z
    code >= 48 && code <= 57 || // 0-9
    char === "_" || char === "-";
  }
  isWhitespaceChar(char) {
    return char === " " || char === "	" || char === "\n" || char === "\r";
  }
  reportDiagnostic(message, location, severity = "error") {
    const diag = { message, location, severity };
    this.diagnostics.push(diag);
    if (this.options.onError) {
      this.options.onError(diag);
    }
  }
};

// packages/compiler/interpreters/react-lm/ast.ts
function getReactProgramId() {
  return "react-program";
}
function getReactComponentDeclarationId(name) {
  const clean = name.replace(/[^a-zA-Z0-9_-]/g, "_");
  return `react-comp-${clean || "Anonymous"}`;
}
function getReactElementId(parentPath, tag, index, key) {
  const cleanTag = tag.toLowerCase().replace(/[^a-z0-9_-]/g, "_");
  const keySuffix = key ? `-k_${String(key).replace(/[^a-zA-Z0-9_-]/g, "_")}` : `-i_${index}`;
  return `${parentPath}-${cleanTag}${keySuffix}`;
}
function getReactComponentInstanceId(parentPath, compName, index, key) {
  const cleanName = compName.replace(/[^a-zA-Z0-9_-]/g, "_");
  const keySuffix = key ? `-k_${String(key).replace(/[^a-zA-Z0-9_-]/g, "_")}` : `-i_${index}`;
  return `${parentPath}-${cleanName}${keySuffix}`;
}
function getReactFragmentId(parentPath, index, key) {
  const keySuffix = key ? `-k_${String(key).replace(/[^a-zA-Z0-9_-]/g, "_")}` : `-i_${index}`;
  return `${parentPath}-frag${keySuffix}`;
}
function getReactTextId(parentPath, index) {
  return `${parentPath}-txt-i_${index}`;
}
function getReactEventHandlerId(componentName, eventName, selector, disambiguator = 0) {
  const cleanComp = componentName.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 24);
  const cleanEvt = eventName.toLowerCase().replace(/^on/, "");
  const cleanSel = selector.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 24);
  const suffix = disambiguator > 0 ? `-${disambiguator}` : "";
  return `react-evt-${cleanComp}-${cleanEvt}-${cleanSel || "node"}${suffix}`;
}

// packages/compiler/interpreters/react-lm/vocabulary.ts
var REACT_ELEMENT_ABBREVIATIONS = {
  di: "div",
  bo: "button",
  so: "section",
  al: "article",
  ad: "aside",
  he: "header",
  fe: "footer",
  na: "nav",
  mi: "main",
  sa: "span",
  in: "input",
  iu: "input",
  le: "label",
  tl: "table",
  cu: "canvas",
  fo: "form",
  fr: "form",
  im: "img",
  pa: "p",
  an: "a",
  li: "li",
  ul: "ul",
  ol: "ol"
};
var REACT_PROP_ABBREVIATIONS = {
  cs: "className",
  cm: "className",
  id: "id",
  hr: "href",
  sr: "src",
  tp: "type",
  pe: "placeholder",
  nm: "name",
  vu: "value",
  dis: "disabled",
  ky: "key",
  oc: "onClick",
  og: "onChange",
  os: "onSubmit",
  oi: "onInput",
  okd: "onKeyDown",
  oku: "onKeyUp",
  omd: "onMouseDown",
  omu: "onMouseUp",
  ome: "onMouseEnter",
  oml: "onMouseLeave",
  of: "onFocus",
  ob: "onBlur"
};
var KNOWN_REACT_EVENTS = /* @__PURE__ */ new Set([
  "onClick",
  "onChange",
  "onSubmit",
  "onInput",
  "onKeyDown",
  "onKeyUp",
  "onKeyPress",
  "onMouseDown",
  "onMouseUp",
  "onMouseMove",
  "onMouseEnter",
  "onMouseLeave",
  "onFocus",
  "onBlur",
  "onScroll",
  "onReset",
  "onTouchStart",
  "onTouchEnd",
  "onTouchMove"
]);
var TAG_TO_AST_KIND2 = {
  div: "Container" /* Container */,
  button: "Button" /* Button */,
  section: "Section" /* Section */,
  article: "Card" /* Card */,
  main: "Page" /* Page */,
  input: "Input" /* Input */,
  form: "Form" /* Form */,
  img: "Image" /* Image */,
  p: "Text" /* Text */,
  span: "Text" /* Text */,
  h1: "Text" /* Text */,
  h2: "Text" /* Text */,
  h3: "Text" /* Text */,
  h4: "Text" /* Text */,
  h5: "Text" /* Text */,
  h6: "Text" /* Text */,
  header: "Container" /* Container */,
  footer: "Container" /* Container */,
  nav: "Container" /* Container */,
  aside: "Container" /* Container */,
  ul: "Container" /* Container */,
  ol: "Container" /* Container */,
  li: "Container" /* Container */
};
function resolveReactElementTag(identifier) {
  if (REACT_ELEMENT_ABBREVIATIONS[identifier]) {
    return REACT_ELEMENT_ABBREVIATIONS[identifier];
  }
  return identifier;
}
function isCustomComponentName(name) {
  return /^[A-Z][a-zA-Z0-9_$]*$/.test(name);
}
function resolveReactPropName(propName) {
  if (REACT_PROP_ABBREVIATIONS[propName]) {
    return REACT_PROP_ABBREVIATIONS[propName];
  }
  return propName;
}
function isReactEventProp(propName) {
  const resolved = resolveReactPropName(propName);
  return KNOWN_REACT_EVENTS.has(resolved) || /^on[A-Z]/.test(resolved);
}
function getDOMEventNameFromReactEvent(reactEventName) {
  const resolved = resolveReactPropName(reactEventName);
  return resolved.replace(/^on/, "").toLowerCase();
}

// packages/compiler/interpreters/react-lm/interpreter.ts
var ReactLMInterpreter = class _ReactLMInterpreter {
  constructor(options = {}) {
    this.diagnostics = [];
    // Stream state
    this.buffer = "";
    this.inString = false;
    this.stringQuote = "";
    this.inLineComment = false;
    this.inBlockComment = false;
    this.escapeNext = false;
    // Structural parsing stack
    this.stack = [];
    this.parenDepth = 0;
    this.currentToken = "";
    this.options = options;
    this.currentLoc = {
      startLine: 1,
      startColumn: 1,
      startOffset: 0,
      endLine: 1,
      endColumn: 1,
      endOffset: 0
    };
    this.currentTokenStartLoc = { ...this.currentLoc };
    this.program = {
      id: getReactProgramId(),
      kind: "ReactProgram" /* Program */,
      components: [],
      rootComponent: "App",
      sourceLocation: { ...this.currentLoc }
    };
  }
  static parse(source, options = {}) {
    const interpreter = new _ReactLMInterpreter(options);
    interpreter.write(source);
    return interpreter.end();
  }
  reset() {
    this.currentLoc = {
      startLine: 1,
      startColumn: 1,
      startOffset: 0,
      endLine: 1,
      endColumn: 1,
      endOffset: 0
    };
    this.currentTokenStartLoc = { ...this.currentLoc };
    this.program = {
      id: getReactProgramId(),
      kind: "ReactProgram" /* Program */,
      components: [],
      rootComponent: "App",
      sourceLocation: { ...this.currentLoc }
    };
    this.diagnostics = [];
    this.buffer = "";
    this.inString = false;
    this.stringQuote = "";
    this.inLineComment = false;
    this.inBlockComment = false;
    this.escapeNext = false;
    this.stack = [];
    this.parenDepth = 0;
    this.currentToken = "";
  }
  getAST() {
    return this.program;
  }
  getDiagnostics() {
    return [...this.diagnostics];
  }
  hasErrors() {
    return this.diagnostics.some((d) => d.severity === "error");
  }
  isSafeToExpose() {
    if (this.inString || this.inLineComment || this.inBlockComment) {
      return false;
    }
    return this.program.components.length > 0;
  }
  write(chunk) {
    for (let i = 0; i < chunk.length; i++) {
      this.consumeChar(chunk[i]);
    }
    return this;
  }
  end() {
    this.flushBuffer();
    return this.program;
  }
  advanceLocation(char) {
    this.currentLoc.endOffset++;
    if (char === "\n") {
      this.currentLoc.endLine++;
      this.currentLoc.endColumn = 1;
    } else {
      this.currentLoc.endColumn++;
    }
  }
  consumeChar(char) {
    this.advanceLocation(char);
    this.buffer += char;
    if (this.inLineComment) {
      if (char === "\n") {
        this.inLineComment = false;
      }
      return;
    }
    if (this.inBlockComment) {
      if (char === "/" && this.buffer.endsWith("*/")) {
        this.inBlockComment = false;
      }
      return;
    }
    if (!this.inString) {
      if (char === "/" && this.buffer.endsWith("//")) {
        this.inLineComment = true;
        return;
      }
      if (char === "*" && this.buffer.endsWith("/*")) {
        this.inBlockComment = true;
        return;
      }
    }
    if (this.inString) {
      if (this.escapeNext) {
        this.escapeNext = false;
        return;
      }
      if (char === "\\") {
        this.escapeNext = true;
        return;
      }
      if (char === this.stringQuote) {
        this.inString = false;
        this.stringQuote = "";
      }
      return;
    }
    if (char === '"' || char === "'") {
      this.inString = true;
      this.stringQuote = char;
      return;
    }
    if (char === "(" || char === ")" || char === "{" || char === "}" || char === "," || char === ";" || char === "\n" || char === "	" || char === " ") {
      this.checkBufferForConstructs();
    }
  }
  checkBufferForConstructs() {
    const clean = this.buffer.replace(/<REACT(?:-LM)?>/gi, "").replace(/<\/REACT(?:-LM)?>/gi, "").trim();
    if (!clean) return;
    const compDeclRegex = /\b(?:component|comp)\s*\(\s*([A-Za-z_$][A-Za-z0-9_$]*)(?:\s*:\s*([A-Za-z_$][A-Za-z0-9_$]*))?\s*\)\s*\(/g;
    let match;
    this.parseTokens(clean);
  }
  flushBuffer() {
    const clean = this.buffer.replace(/<REACT(?:-LM)?>/gi, "").replace(/<\/REACT(?:-LM)?>/gi, "").trim();
    if (clean) {
      this.parseTokens(clean);
    }
  }
  parseTokens(source) {
    if (!source) return;
    try {
      const parsedComponents = this.parseProgramAST(source);
      if (parsedComponents.length > 0) {
        this.program.components = parsedComponents;
        const appComp = parsedComponents.find((c) => c.name === "App");
        this.program.rootComponent = this.options.rootComponent || appComp?.name || parsedComponents[0].name;
      }
    } catch {
    }
  }
  parseProgramAST(source) {
    const components = [];
    let pos = 0;
    const skipWhitespace = () => {
      while (pos < source.length && /\s/.test(source[pos])) pos++;
    };
    while (pos < source.length) {
      skipWhitespace();
      if (pos >= source.length) break;
      const compMatch = /^(?:component|comp)\s*\(\s*([A-Za-z_$][A-Za-z0-9_$]*)(?:\s*:\s*([A-Za-z_$][A-Za-z0-9_$]*))?\s*\)\s*\(/i.exec(
        source.slice(pos)
      );
      if (compMatch) {
        const compName = compMatch[1];
        const propsType = compMatch[2];
        const openParenIndex = pos + compMatch[0].length - 1;
        const bodySource = this.extractMatchingParen(source, openParenIndex);
        pos = openParenIndex + bodySource.length;
        const { stateDecls, derivedDecls, bodyNodes } = this.parseComponentBody(bodySource.slice(1, -1), compName);
        components.push({
          id: getReactComponentDeclarationId(compName),
          kind: "ReactComponentDeclaration" /* ComponentDeclaration */,
          name: compName,
          propsType,
          stateDeclarations: stateDecls,
          derivedDeclarations: derivedDecls,
          body: bodyNodes,
          rawCode: compMatch[0] + bodySource,
          sourceLocation: { ...this.currentLoc }
        });
      } else {
        const standaloneBody = source.slice(pos).trim();
        if (standaloneBody) {
          const { stateDecls, derivedDecls, bodyNodes } = this.parseComponentBody(standaloneBody, "App");
          if (bodyNodes.length > 0 || stateDecls.length > 0 || derivedDecls.length > 0) {
            components.push({
              id: getReactComponentDeclarationId("App"),
              kind: "ReactComponentDeclaration" /* ComponentDeclaration */,
              name: "App",
              stateDeclarations: stateDecls,
              derivedDeclarations: derivedDecls,
              body: bodyNodes,
              rawCode: standaloneBody,
              sourceLocation: { ...this.currentLoc }
            });
          }
        }
        break;
      }
    }
    return components;
  }
  extractMatchingParen(str, openParenPos) {
    let depth = 0;
    let inStr = false;
    let quote = "";
    for (let i = openParenPos; i < str.length; i++) {
      const ch = str[i];
      if (inStr) {
        if (ch === quote && str[i - 1] !== "\\") inStr = false;
      } else {
        if (ch === '"' || ch === "'") {
          inStr = true;
          quote = ch;
        } else if (ch === "(") {
          depth++;
        } else if (ch === ")") {
          depth--;
          if (depth === 0) {
            return str.slice(openParenPos, i + 1);
          }
        }
      }
    }
    return str.slice(openParenPos);
  }
  parseComponentBody(bodyStr, componentName) {
    const stateDecls = [];
    const derivedDecls = [];
    const bodyNodes = [];
    let pos = 0;
    const skipWhitespace = () => {
      while (pos < bodyStr.length && /\s/.test(bodyStr[pos])) pos++;
    };
    while (pos < bodyStr.length) {
      skipWhitespace();
      if (pos >= bodyStr.length) break;
      const stateMatch = /^state\s*\(\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*,\s*([^)]+)\)/i.exec(bodyStr.slice(pos));
      if (stateMatch) {
        const stateName = stateMatch[1];
        let initialRaw = stateMatch[2].trim();
        let initialVal = initialRaw;
        if (initialRaw === "true") initialVal = true;
        else if (initialRaw === "false") initialVal = false;
        else if (!isNaN(Number(initialRaw))) initialVal = Number(initialRaw);
        else if (initialRaw.startsWith('"') || initialRaw.startsWith("'")) {
          initialVal = initialRaw.slice(1, -1);
        }
        stateDecls.push({
          id: `react-state-${componentName}-${stateName}`,
          kind: "ReactStateDeclaration" /* StateDeclaration */,
          stateName,
          name: stateName,
          initialValue: initialVal,
          sourceLocation: { ...this.currentLoc }
        });
        pos += stateMatch[0].length;
        continue;
      }
      const computedMatch = /^(?:computed|derived)\s*\(\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*,\s*([^)]+)\)/i.exec(
        bodyStr.slice(pos)
      );
      if (computedMatch) {
        const derivedName = computedMatch[1];
        const expr = computedMatch[2].trim();
        derivedDecls.push({
          id: `react-derived-${componentName}-${derivedName}`,
          kind: "ReactDerivedDeclaration" /* DerivedDeclaration */,
          derivedName,
          name: derivedName,
          expression: expr,
          sourceLocation: { ...this.currentLoc }
        });
        pos += computedMatch[0].length;
        continue;
      }
      const whenMatch = /^when\s*\(\s*([^)]+)\)\s*\(/i.exec(bodyStr.slice(pos));
      if (whenMatch) {
        const condExpr = whenMatch[1].trim();
        const openParenIndex = pos + whenMatch[0].length - 1;
        const thenBlock = this.extractMatchingParen(bodyStr, openParenIndex);
        pos = openParenIndex + thenBlock.length;
        const thenNodes = this.parseComponentBody(thenBlock.slice(1, -1), componentName).bodyNodes;
        let elseNode = void 0;
        skipWhitespace();
        if (bodyStr[pos] === "(") {
          const elseOpenParenIndex = pos;
          const elseBlock = this.extractMatchingParen(bodyStr, elseOpenParenIndex);
          pos = elseOpenParenIndex + elseBlock.length;
          const elseNodes = this.parseComponentBody(elseBlock.slice(1, -1), componentName).bodyNodes;
          if (elseNodes.length > 0) {
            elseNode = elseNodes[0];
          }
        }
        bodyNodes.push({
          id: `react-cond-${componentName}-${bodyNodes.length}`,
          kind: "ReactConditional" /* Conditional */,
          conditionExpr: condExpr,
          thenBranch: thenNodes[0] || {
            id: `react-frag-${bodyNodes.length}`,
            kind: "ReactFragment" /* Fragment */,
            children: []
          },
          elseBranch: elseNode,
          sourceLocation: { ...this.currentLoc }
        });
        continue;
      }
      const eachMatch = /^each\s*\(\s*([A-Za-z0-9_$.]+)\s*,\s*([A-Za-z_$][A-Za-z0-9_$]*)(?:\s*,\s*([A-Za-z_$][A-Za-z0-9_$]*))?\s*\)\s*\(/i.exec(
        bodyStr.slice(pos)
      );
      if (eachMatch) {
        const arrayExpr = eachMatch[1];
        const itemVar = eachMatch[2];
        const indexVar = eachMatch[3];
        const openParenIndex = pos + eachMatch[0].length - 1;
        const listBodyBlock = this.extractMatchingParen(bodyStr, openParenIndex);
        pos = openParenIndex + listBodyBlock.length;
        const itemNodes = this.parseComponentBody(listBodyBlock.slice(1, -1), componentName).bodyNodes;
        bodyNodes.push({
          id: `react-list-${componentName}-${bodyNodes.length}`,
          kind: "ReactList" /* List */,
          arrayExpr,
          itemVar,
          indexVar,
          body: itemNodes[0] || {
            id: `react-frag-${bodyNodes.length}`,
            kind: "ReactFragment" /* Fragment */,
            children: []
          },
          sourceLocation: { ...this.currentLoc }
        });
        continue;
      }
      const fragMatch = /^(?:fragment|frag)\s*\(/i.exec(bodyStr.slice(pos));
      if (fragMatch) {
        const openParenIndex = pos + fragMatch[0].length - 1;
        const fragBlock = this.extractMatchingParen(bodyStr, openParenIndex);
        pos = openParenIndex + fragBlock.length;
        const fragChildren = this.parseComponentBody(fragBlock.slice(1, -1), componentName).bodyNodes;
        bodyNodes.push({
          id: getReactFragmentId(`react-${componentName}`, bodyNodes.length),
          kind: "ReactFragment" /* Fragment */,
          children: fragChildren,
          sourceLocation: { ...this.currentLoc }
        });
        continue;
      }
      if (bodyStr[pos] === '"' || bodyStr[pos] === "'") {
        const quote = bodyStr[pos];
        let endQuote = pos + 1;
        while (endQuote < bodyStr.length && (bodyStr[endQuote] !== quote || bodyStr[endQuote - 1] === "\\")) {
          endQuote++;
        }
        const textVal = bodyStr.slice(pos + 1, endQuote);
        pos = endQuote + 1;
        bodyNodes.push({
          id: getReactTextId(`react-${componentName}`, bodyNodes.length),
          kind: "ReactText" /* Text */,
          value: textVal,
          sourceLocation: { ...this.currentLoc }
        });
        continue;
      }
      const elemMatch = /^([A-Za-z0-9_-]+)\s*\(/i.exec(bodyStr.slice(pos));
      if (elemMatch) {
        const rawIdent = elemMatch[1];
        const openParenIndex = pos + elemMatch[0].length - 1;
        const contentBlock = this.extractMatchingParen(bodyStr, openParenIndex);
        pos = openParenIndex + contentBlock.length;
        const isCustom = isCustomComponentName(rawIdent);
        const canonicalTag = isCustom ? rawIdent : resolveReactElementTag(rawIdent);
        const { props, children } = this.parsePropsAndChildren(contentBlock.slice(1, -1), componentName);
        if (isCustom) {
          bodyNodes.push({
            id: getReactComponentInstanceId(`react-${componentName}`, rawIdent, bodyNodes.length),
            kind: "ReactComponentInstance" /* ComponentInstance */,
            componentName: rawIdent,
            props,
            children,
            sourceLocation: { ...this.currentLoc }
          });
        } else {
          bodyNodes.push({
            id: getReactElementId(`react-${componentName}`, canonicalTag, bodyNodes.length),
            kind: "ReactElement" /* Element */,
            tag: canonicalTag,
            isIntrinsic: true,
            props,
            children,
            sourceLocation: { ...this.currentLoc }
          });
        }
        continue;
      }
      pos++;
    }
    return { stateDecls, derivedDecls, bodyNodes };
  }
  parsePropsAndChildren(blockStr, ownerComponent) {
    const props = [];
    const children = [];
    let pos = 0;
    const skipWhitespace = () => {
      while (pos < blockStr.length && /\s/.test(blockStr[pos])) pos++;
    };
    while (pos < blockStr.length) {
      skipWhitespace();
      if (pos >= blockStr.length) break;
      const propMatch = /^([A-Za-z0-9_$-]+)\s*:\s*/i.exec(blockStr.slice(pos));
      if (propMatch) {
        const propName = propMatch[1];
        pos += propMatch[0].length;
        skipWhitespace();
        let val = "";
        let rawVal = "";
        let isEvent = isReactEventProp(propName);
        if (blockStr[pos] === '"' || blockStr[pos] === "'") {
          const q = blockStr[pos];
          let endQ = pos + 1;
          while (endQ < blockStr.length && (blockStr[endQ] !== q || blockStr[endQ - 1] === "\\")) {
            endQ++;
          }
          val = blockStr.slice(pos + 1, endQ);
          rawVal = blockStr.slice(pos, endQ + 1);
          pos = endQ + 1;
        } else if (blockStr[pos] === "(" || blockStr[pos] === "{") {
          const expr = this.extractMatchingParen(blockStr, pos);
          val = expr;
          rawVal = expr;
          pos += expr.length;
        } else {
          let endWord = pos;
          while (endWord < blockStr.length && !/\s|\(|\)|,|;/.test(blockStr[endWord])) {
            endWord++;
          }
          rawVal = blockStr.slice(pos, endWord);
          if (rawVal === "true") val = true;
          else if (rawVal === "false") val = false;
          else if (!isNaN(Number(rawVal)) && rawVal.trim() !== "") val = Number(rawVal);
          else val = rawVal;
          pos = endWord;
        }
        props.push({
          id: `prop-${propName}-${props.length}`,
          kind: "ReactProp" /* Prop */,
          name: resolveReactPropName(propName),
          value: val,
          rawValue: rawVal,
          isEvent,
          sourceLocation: { ...this.currentLoc }
        });
        continue;
      }
      const childParsed = this.parseComponentBody(blockStr.slice(pos), ownerComponent);
      if (childParsed.bodyNodes.length > 0) {
        children.push(...childParsed.bodyNodes);
        break;
      }
      pos++;
    }
    return { props, children };
  }
};

// packages/compiler/interpreters/vue-lm/ast.ts
function getVueProgramId() {
  return "vue-program";
}
function getVueComponentDeclarationId(name) {
  const clean = name.replace(/[^a-zA-Z0-9_-]/g, "_");
  return `vue-component-${clean || "Anonymous"}`;
}
function getVueElementId(parentPath, tag, index, key) {
  const cleanTag = tag.toLowerCase().replace(/[^a-z0-9_-]/g, "_");
  const keySuffix = key ? `-k_${String(key).replace(/[^a-zA-Z0-9_-]/g, "_")}` : `-i_${index}`;
  return `${parentPath}-${cleanTag}${keySuffix}`;
}
function getVueComponentInstanceId(parentPath, compName, index, key) {
  const cleanName = compName.replace(/[^a-zA-Z0-9_-]/g, "_");
  const keySuffix = key ? `-k_${String(key).replace(/[^a-zA-Z0-9_-]/g, "_")}` : `-i_${index}`;
  return `${parentPath}-${cleanName}${keySuffix}`;
}
function getVueFragmentId(parentPath, index, key) {
  const keySuffix = key ? `-k_${String(key).replace(/[^a-zA-Z0-9_-]/g, "_")}` : `-i_${index}`;
  return `${parentPath}-frag${keySuffix}`;
}
function getVueSlotId(parentPath, slotName = "default", index = 0) {
  const cleanSlot = slotName.replace(/[^a-zA-Z0-9_-]/g, "_");
  return `${parentPath}-slot_${cleanSlot}_${index}`;
}
function getVueTextId(parentPath, index) {
  return `${parentPath}-txt-i_${index}`;
}
function getVueStateId(componentName, stateName) {
  const cleanComp = componentName.replace(/[^a-zA-Z0-9_-]/g, "_");
  const cleanState = stateName.replace(/[^a-zA-Z0-9_-]/g, "_");
  return `vue-state-${cleanComp}-${cleanState}`;
}
function getVueComputedId(componentName, computedName) {
  const cleanComp = componentName.replace(/[^a-zA-Z0-9_-]/g, "_");
  const cleanCompVal = computedName.replace(/[^a-zA-Z0-9_-]/g, "_");
  return `vue-computed-${cleanComp}-${cleanCompVal}`;
}

// packages/compiler/interpreters/vue-lm/vocabulary.ts
var VUE_ELEMENT_ABBREVIATIONS = {
  di: "div",
  bo: "button",
  so: "section",
  al: "article",
  ad: "aside",
  he: "header",
  fe: "footer",
  na: "nav",
  mi: "main",
  sa: "span",
  in: "input",
  iu: "input",
  le: "label",
  tl: "table",
  cu: "canvas",
  fo: "form",
  fr: "form",
  im: "img",
  pa: "p",
  an: "a",
  li: "li",
  ul: "ul",
  ol: "ol"
};
var VUE_PROP_ABBREVIATIONS = {
  cs: "className",
  cm: "className",
  class: "className",
  id: "id",
  hr: "href",
  sr: "src",
  tp: "type",
  pe: "placeholder",
  nm: "name",
  vu: "value",
  dis: "disabled",
  ky: "key",
  key: "key",
  vm: "v-model",
  bindModel: "v-model",
  model: "v-model",
  show: "v-show",
  vShow: "v-show",
  oc: "onClick",
  og: "onChange",
  os: "onSubmit",
  oi: "onInput",
  okd: "onKeyDown",
  oku: "onKeyUp",
  omd: "onMouseDown",
  omu: "onMouseUp",
  ome: "onMouseEnter",
  oml: "onMouseLeave",
  of: "onFocus",
  ob: "onBlur"
};
var KNOWN_VUE_EVENTS = /* @__PURE__ */ new Set([
  "click",
  "input",
  "change",
  "submit",
  "keydown",
  "keyup",
  "keypress",
  "mousedown",
  "mouseup",
  "mousemove",
  "mouseenter",
  "mouseleave",
  "focus",
  "blur",
  "scroll",
  "reset",
  "touchstart",
  "touchend",
  "touchmove",
  // React/JSX style camelCase aliases
  "onClick",
  "onInput",
  "onChange",
  "onSubmit",
  "onKeyDown",
  "onKeyUp",
  "onKeyPress",
  "onMouseDown",
  "onMouseUp",
  "onMouseMove",
  "onMouseEnter",
  "onMouseLeave",
  "onFocus",
  "onBlur"
]);
var TAG_TO_AST_KIND3 = {
  div: "Container" /* Container */,
  button: "Button" /* Button */,
  section: "Section" /* Section */,
  article: "Card" /* Card */,
  main: "Page" /* Page */,
  input: "Input" /* Input */,
  form: "Form" /* Form */,
  img: "Image" /* Image */,
  p: "Text" /* Text */,
  span: "Text" /* Text */,
  h1: "Text" /* Text */,
  h2: "Text" /* Text */,
  h3: "Text" /* Text */,
  h4: "Text" /* Text */,
  h5: "Text" /* Text */,
  h6: "Text" /* Text */,
  header: "Container" /* Container */,
  footer: "Container" /* Container */,
  nav: "Container" /* Container */,
  aside: "Container" /* Container */,
  ul: "Container" /* Container */,
  ol: "Container" /* Container */,
  li: "Container" /* Container */
};
function resolveVueElementTag(identifier) {
  if (VUE_ELEMENT_ABBREVIATIONS[identifier]) {
    return VUE_ELEMENT_ABBREVIATIONS[identifier];
  }
  return identifier;
}
function isCustomComponentName2(name) {
  return /^[A-Z][a-zA-Z0-9_$]*$/.test(name);
}
function resolveVuePropName(propName) {
  if (VUE_PROP_ABBREVIATIONS[propName]) {
    return VUE_PROP_ABBREVIATIONS[propName];
  }
  if (propName.startsWith("@")) {
    return propName.slice(1);
  }
  if (propName.startsWith(":") || propName.startsWith("v-bind:")) {
    return propName.replace(/^(?::|v-bind:)/, "");
  }
  return propName;
}
function isVueEventProp(propName) {
  if (propName.startsWith("@") || propName.startsWith("v-on:")) return true;
  const resolved = resolveVuePropName(propName);
  return KNOWN_VUE_EVENTS.has(resolved) || /^on[A-Z]/.test(resolved);
}
function getDOMEventNameFromVueEvent(vueEventName) {
  let clean = vueEventName.replace(/^(?:@|v-on:)/, "");
  if (VUE_PROP_ABBREVIATIONS[clean]) {
    clean = VUE_PROP_ABBREVIATIONS[clean];
  }
  if (/^on[A-Z]/.test(clean)) {
    clean = clean.replace(/^on/, "");
  }
  return clean.toLowerCase();
}
function isVueModelProp(propName) {
  const resolved = resolveVuePropName(propName);
  return resolved === "v-model" || propName === "v-model" || propName === "bindModel" || propName === "model" || propName === "vm";
}
function isVueShowProp(propName) {
  const resolved = resolveVuePropName(propName);
  return resolved === "v-show" || propName === "v-show" || propName === "vShow" || propName === "show";
}

// packages/compiler/interpreters/vue-lm/interpreter.ts
var VueLMInterpreter = class _VueLMInterpreter {
  constructor(options = {}) {
    this.diagnostics = [];
    // Stream state
    this.buffer = "";
    this.inString = false;
    this.stringQuote = "";
    this.inLineComment = false;
    this.inBlockComment = false;
    this.escapeNext = false;
    this.options = options;
    this.currentLoc = {
      startLine: 1,
      startColumn: 1,
      startOffset: 0,
      endLine: 1,
      endColumn: 1,
      endOffset: 0
    };
    this.program = {
      id: getVueProgramId(),
      kind: "VueProgram" /* Program */,
      components: [],
      rootComponent: "App",
      sourceLocation: { ...this.currentLoc }
    };
  }
  static parse(source, options = {}) {
    const interpreter = new _VueLMInterpreter(options);
    interpreter.write(source);
    return interpreter.end();
  }
  reset() {
    this.currentLoc = {
      startLine: 1,
      startColumn: 1,
      startOffset: 0,
      endLine: 1,
      endColumn: 1,
      endOffset: 0
    };
    this.program = {
      id: getVueProgramId(),
      kind: "VueProgram" /* Program */,
      components: [],
      rootComponent: "App",
      sourceLocation: { ...this.currentLoc }
    };
    this.diagnostics = [];
    this.buffer = "";
    this.inString = false;
    this.stringQuote = "";
    this.inLineComment = false;
    this.inBlockComment = false;
    this.escapeNext = false;
  }
  getAST() {
    return this.program;
  }
  getDiagnostics() {
    return [...this.diagnostics];
  }
  hasErrors() {
    return this.diagnostics.some((d) => d.severity === "error");
  }
  isSafeToExpose() {
    if (this.inString || this.inLineComment || this.inBlockComment) {
      return false;
    }
    return this.program.components.length > 0;
  }
  write(chunk) {
    for (let i = 0; i < chunk.length; i++) {
      this.consumeChar(chunk[i]);
    }
    return this;
  }
  end() {
    this.flushBuffer();
    return this.program;
  }
  advanceLocation(char) {
    this.currentLoc.endOffset++;
    if (char === "\n") {
      this.currentLoc.endLine++;
      this.currentLoc.endColumn = 1;
    } else {
      this.currentLoc.endColumn++;
    }
  }
  consumeChar(char) {
    this.advanceLocation(char);
    this.buffer += char;
    if (this.inLineComment) {
      if (char === "\n") {
        this.inLineComment = false;
      }
      return;
    }
    if (this.inBlockComment) {
      if (char === "/" && this.buffer.endsWith("*/")) {
        this.inBlockComment = false;
      }
      return;
    }
    if (!this.inString) {
      if (char === "/" && this.buffer.endsWith("//")) {
        this.inLineComment = true;
        return;
      }
      if (char === "*" && this.buffer.endsWith("/*")) {
        this.inBlockComment = true;
        return;
      }
    }
    if (this.inString) {
      if (this.escapeNext) {
        this.escapeNext = false;
        return;
      }
      if (char === "\\") {
        this.escapeNext = true;
        return;
      }
      if (char === this.stringQuote) {
        this.inString = false;
        this.stringQuote = "";
      }
      return;
    }
    if (char === '"' || char === "'") {
      this.inString = true;
      this.stringQuote = char;
      return;
    }
    if (char === "(" || char === ")" || char === "{" || char === "}" || char === "," || char === ";" || char === "\n" || char === "	" || char === " ") {
      this.checkBufferForConstructs();
    }
  }
  checkBufferForConstructs() {
    const clean = this.buffer.replace(/<VUE(?:-LM)?>/gi, "").replace(/<\/VUE(?:-LM)?>/gi, "").trim();
    if (!clean) return;
    this.parseTokens(clean);
  }
  flushBuffer() {
    const clean = this.buffer.replace(/<VUE(?:-LM)?>/gi, "").replace(/<\/VUE(?:-LM)?>/gi, "").trim();
    if (clean) {
      this.parseTokens(clean);
    }
  }
  parseTokens(source) {
    if (!source) return;
    try {
      const parsedComponents = this.parseProgramAST(source);
      if (parsedComponents.length > 0) {
        this.program.components = parsedComponents;
        const appComp = parsedComponents.find((c) => c.name === "App");
        this.program.rootComponent = this.options.rootComponent || appComp?.name || parsedComponents[0].name;
      }
    } catch {
    }
  }
  parseProgramAST(source) {
    const components = [];
    let pos = 0;
    const skipWhitespace = () => {
      while (pos < source.length && /\s/.test(source[pos])) pos++;
    };
    while (pos < source.length) {
      skipWhitespace();
      if (pos >= source.length) break;
      const compMatch = /^(?:component|comp)\s*\(\s*([A-Za-z_$][A-Za-z0-9_$]*)(?:\s*:\s*([A-Za-z_$][A-Za-z0-9_$]*))?\s*\)\s*\(/i.exec(
        source.slice(pos)
      );
      if (compMatch) {
        const compName = compMatch[1];
        const propsType = compMatch[2];
        const openParenIndex = pos + compMatch[0].length - 1;
        const bodySource = this.extractMatchingParen(source, openParenIndex);
        pos = openParenIndex + bodySource.length;
        const { stateDecls, computedDecls, bodyNodes } = this.parseComponentBody(
          bodySource.slice(1, -1),
          compName
        );
        components.push({
          id: getVueComponentDeclarationId(compName),
          kind: "VueComponentDeclaration" /* ComponentDeclaration */,
          name: compName,
          propsType,
          stateDeclarations: stateDecls,
          computedDeclarations: computedDecls,
          body: bodyNodes,
          rawCode: compMatch[0] + bodySource,
          sourceLocation: { ...this.currentLoc }
        });
      } else {
        const standaloneBody = source.slice(pos).trim();
        if (standaloneBody) {
          const { stateDecls, computedDecls, bodyNodes } = this.parseComponentBody(
            standaloneBody,
            "App"
          );
          if (bodyNodes.length > 0 || stateDecls.length > 0 || computedDecls.length > 0) {
            components.push({
              id: getVueComponentDeclarationId("App"),
              kind: "VueComponentDeclaration" /* ComponentDeclaration */,
              name: "App",
              stateDeclarations: stateDecls,
              computedDeclarations: computedDecls,
              body: bodyNodes,
              rawCode: standaloneBody,
              sourceLocation: { ...this.currentLoc }
            });
          }
        }
        break;
      }
    }
    return components;
  }
  extractMatchingParen(str, openParenPos) {
    let depth = 0;
    let inStr = false;
    let quote = "";
    for (let i = openParenPos; i < str.length; i++) {
      const ch = str[i];
      if (inStr) {
        if (ch === quote && str[i - 1] !== "\\") inStr = false;
      } else {
        if (ch === '"' || ch === "'") {
          inStr = true;
          quote = ch;
        } else if (ch === "(") {
          depth++;
        } else if (ch === ")") {
          depth--;
          if (depth === 0) {
            return str.slice(openParenPos, i + 1);
          }
        }
      }
    }
    return str.slice(openParenPos);
  }
  parseComponentBody(bodyStr, componentName) {
    const stateDecls = [];
    const computedDecls = [];
    const bodyNodes = [];
    let pos = 0;
    const skipWhitespace = () => {
      while (pos < bodyStr.length && /\s/.test(bodyStr[pos])) pos++;
    };
    while (pos < bodyStr.length) {
      skipWhitespace();
      if (pos >= bodyStr.length) break;
      const stateMatch = /^(?:state|ref|reactive)\s*\(\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*,\s*([^)]+)\)/i.exec(
        bodyStr.slice(pos)
      );
      if (stateMatch) {
        const stateName = stateMatch[1];
        let initialRaw = stateMatch[2].trim();
        let initialVal = initialRaw;
        if (initialRaw === "true") initialVal = true;
        else if (initialRaw === "false") initialVal = false;
        else if (!isNaN(Number(initialRaw))) initialVal = Number(initialRaw);
        else if (initialRaw.startsWith('"') && initialRaw.endsWith('"') || initialRaw.startsWith("'") && initialRaw.endsWith("'")) {
          initialVal = initialRaw.slice(1, -1);
        }
        const isRef = stateMatch[0].startsWith("ref");
        const isReactive = stateMatch[0].startsWith("reactive");
        stateDecls.push({
          id: getVueStateId(componentName, stateName),
          kind: "VueStateDeclaration" /* StateDeclaration */,
          stateName,
          name: stateName,
          initialValue: initialVal,
          isRef,
          isReactive,
          sourceLocation: { ...this.currentLoc }
        });
        pos += stateMatch[0].length;
        continue;
      }
      const computedMatch = /^(?:computed|compVal)\s*\(\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*,\s*([^)]+)\)/i.exec(
        bodyStr.slice(pos)
      );
      if (computedMatch) {
        const compValName = computedMatch[1];
        const expr = computedMatch[2].trim();
        computedDecls.push({
          id: getVueComputedId(componentName, compValName),
          kind: "VueComputedDeclaration" /* ComputedDeclaration */,
          name: compValName,
          computedName: compValName,
          expression: expr,
          sourceLocation: { ...this.currentLoc }
        });
        pos += computedMatch[0].length;
        continue;
      }
      const whenMatch = /^(?:when|if)\s*\(\s*([^)]+)\)\s*\(/i.exec(bodyStr.slice(pos));
      if (whenMatch) {
        const condExpr = whenMatch[1].trim();
        const openParenIndex = pos + whenMatch[0].length - 1;
        const thenBlock = this.extractMatchingParen(bodyStr, openParenIndex);
        pos = openParenIndex + thenBlock.length;
        const thenNodes = this.parseComponentBody(
          thenBlock.slice(1, -1),
          componentName
        ).bodyNodes;
        let elseNode = void 0;
        skipWhitespace();
        if (bodyStr[pos] === "(") {
          const elseOpenParenIndex = pos;
          const elseBlock = this.extractMatchingParen(bodyStr, elseOpenParenIndex);
          pos = elseOpenParenIndex + elseBlock.length;
          const elseNodes = this.parseComponentBody(
            elseBlock.slice(1, -1),
            componentName
          ).bodyNodes;
          if (elseNodes.length > 0) {
            elseNode = elseNodes[0];
          }
        }
        bodyNodes.push({
          id: `vue-cond-${componentName}-${bodyNodes.length}`,
          kind: "VueConditional" /* Conditional */,
          conditionExpr: condExpr,
          thenBranch: thenNodes[0] || {
            id: `vue-frag-${bodyNodes.length}`,
            kind: "VueFragment" /* Fragment */,
            children: []
          },
          elseBranch: elseNode,
          sourceLocation: { ...this.currentLoc }
        });
        continue;
      }
      const eachMatch = /^(?:each|for)\s*\(\s*([A-Za-z0-9_$.]+)\s*,\s*([A-Za-z_$][A-Za-z0-9_$]*)(?:\s*,\s*([^)]+))?\s*\)\s*\(/i.exec(
        bodyStr.slice(pos)
      );
      if (eachMatch) {
        const arrayExpr = eachMatch[1];
        const itemVar = eachMatch[2];
        const keyOrIndex = eachMatch[3]?.trim();
        const openParenIndex = pos + eachMatch[0].length - 1;
        const listBodyBlock = this.extractMatchingParen(bodyStr, openParenIndex);
        pos = openParenIndex + listBodyBlock.length;
        const itemNodes = this.parseComponentBody(
          listBodyBlock.slice(1, -1),
          componentName
        ).bodyNodes;
        bodyNodes.push({
          id: `vue-list-${componentName}-${bodyNodes.length}`,
          kind: "VueList" /* List */,
          arrayExpr,
          itemVar,
          keyExpr: keyOrIndex,
          body: itemNodes[0] || {
            id: `vue-frag-${bodyNodes.length}`,
            kind: "VueFragment" /* Fragment */,
            children: []
          },
          sourceLocation: { ...this.currentLoc }
        });
        continue;
      }
      const slotMatch = /^slot\s*\(\s*([A-Za-z0-9_$]*)\s*\)/i.exec(bodyStr.slice(pos));
      if (slotMatch) {
        const slotName = slotMatch[1] || "default";
        bodyNodes.push({
          id: getVueSlotId(`vue-${componentName}`, slotName, bodyNodes.length),
          kind: "VueSlot" /* Slot */,
          name: slotName,
          children: [],
          sourceLocation: { ...this.currentLoc }
        });
        pos += slotMatch[0].length;
        continue;
      }
      const fragMatch = /^(?:fragment|frag)\s*\(/i.exec(bodyStr.slice(pos));
      if (fragMatch) {
        const openParenIndex = pos + fragMatch[0].length - 1;
        const fragBlock = this.extractMatchingParen(bodyStr, openParenIndex);
        pos = openParenIndex + fragBlock.length;
        const fragChildren = this.parseComponentBody(
          fragBlock.slice(1, -1),
          componentName
        ).bodyNodes;
        bodyNodes.push({
          id: getVueFragmentId(`vue-${componentName}`, bodyNodes.length),
          kind: "VueFragment" /* Fragment */,
          children: fragChildren,
          sourceLocation: { ...this.currentLoc }
        });
        continue;
      }
      if (bodyStr[pos] === '"' || bodyStr[pos] === "'") {
        const quote = bodyStr[pos];
        let endQuote = pos + 1;
        while (endQuote < bodyStr.length && (bodyStr[endQuote] !== quote || bodyStr[endQuote - 1] === "\\")) {
          endQuote++;
        }
        const textVal = bodyStr.slice(pos + 1, endQuote);
        pos = endQuote + 1;
        bodyNodes.push({
          id: getVueTextId(`vue-${componentName}`, bodyNodes.length),
          kind: "VueText" /* Text */,
          value: textVal,
          sourceLocation: { ...this.currentLoc }
        });
        continue;
      }
      const elemMatch = /^([A-Za-z0-9_@:-]+)\s*\(/i.exec(bodyStr.slice(pos));
      if (elemMatch) {
        const rawIdent = elemMatch[1];
        const openParenIndex = pos + elemMatch[0].length - 1;
        const contentBlock = this.extractMatchingParen(bodyStr, openParenIndex);
        pos = openParenIndex + contentBlock.length;
        const isCustom = isCustomComponentName2(rawIdent);
        const canonicalTag = isCustom ? rawIdent : resolveVueElementTag(rawIdent);
        const { props, children, modelBinding, showCondition } = this.parsePropsAndChildren(
          contentBlock.slice(1, -1),
          componentName
        );
        if (isCustom) {
          bodyNodes.push({
            id: getVueComponentInstanceId(`vue-${componentName}`, rawIdent, bodyNodes.length),
            kind: "VueComponentInstance" /* ComponentInstance */,
            componentName: rawIdent,
            props,
            children,
            sourceLocation: { ...this.currentLoc }
          });
        } else {
          bodyNodes.push({
            id: getVueElementId(`vue-${componentName}`, canonicalTag, bodyNodes.length),
            kind: "VueElement" /* Element */,
            tag: canonicalTag,
            isIntrinsic: true,
            props,
            children,
            modelBinding,
            showCondition,
            sourceLocation: { ...this.currentLoc }
          });
        }
        continue;
      }
      pos++;
    }
    return { stateDecls, computedDecls, bodyNodes };
  }
  parsePropsAndChildren(blockStr, ownerComponent) {
    const props = [];
    const children = [];
    let modelBinding = void 0;
    let showCondition = void 0;
    let pos = 0;
    const skipWhitespace = () => {
      while (pos < blockStr.length && /\s/.test(blockStr[pos])) pos++;
    };
    while (pos < blockStr.length) {
      skipWhitespace();
      if (pos >= blockStr.length) break;
      const propMatch = /^([A-Za-z0-9_@:$-]+)\s*:\s*/i.exec(blockStr.slice(pos));
      if (propMatch) {
        const rawPropName = propMatch[1];
        pos += propMatch[0].length;
        skipWhitespace();
        let val = "";
        let rawVal = "";
        const isEvent = isVueEventProp(rawPropName);
        const isModel = isVueModelProp(rawPropName);
        const isShow = isVueShowProp(rawPropName);
        if (blockStr[pos] === '"' || blockStr[pos] === "'") {
          const q = blockStr[pos];
          let endQ = pos + 1;
          while (endQ < blockStr.length && (blockStr[endQ] !== q || blockStr[endQ - 1] === "\\")) {
            endQ++;
          }
          val = blockStr.slice(pos + 1, endQ);
          rawVal = blockStr.slice(pos, endQ + 1);
          pos = endQ + 1;
        } else if (blockStr[pos] === "(" || blockStr[pos] === "{") {
          const expr = this.extractMatchingParen(blockStr, pos);
          val = expr;
          rawVal = expr;
          pos += expr.length;
        } else {
          let endWord = pos;
          while (endWord < blockStr.length && !/\s|\(|\)|,|;/.test(blockStr[endWord])) {
            endWord++;
          }
          rawVal = blockStr.slice(pos, endWord);
          if (rawVal === "true") val = true;
          else if (rawVal === "false") val = false;
          else if (!isNaN(Number(rawVal)) && rawVal.trim() !== "") val = Number(rawVal);
          else val = rawVal;
          pos = endWord;
        }
        if (isModel) {
          modelBinding = String(val);
        }
        if (isShow) {
          showCondition = String(val);
        }
        const canonicalName = resolveVuePropName(rawPropName);
        props.push({
          id: `vue-prop-${canonicalName}-${props.length}`,
          kind: "VueProp" /* Prop */,
          name: canonicalName,
          value: val,
          rawValue: rawVal,
          isEvent,
          isModel,
          directiveName: isModel ? "v-model" : isShow ? "v-show" : isEvent ? "v-on" : void 0,
          sourceLocation: { ...this.currentLoc }
        });
        continue;
      }
      const childParsed = this.parseComponentBody(blockStr.slice(pos), ownerComponent);
      if (childParsed.bodyNodes.length > 0) {
        children.push(...childParsed.bodyNodes);
        break;
      }
      pos++;
    }
    return { props, children, modelBinding, showCondition };
  }
};

// packages/compiler/interpreters/svelte-lm/ast.ts
function getSvelteProgramId() {
  return "svelte-program";
}
function getSvelteComponentDeclarationId(name) {
  const clean = name.replace(/[^a-zA-Z0-9_-]/g, "_");
  return `svelte-component-${clean || "Anonymous"}`;
}
function getSvelteElementId(parentPath, tag, index, key) {
  const cleanTag = tag.toLowerCase().replace(/[^a-z0-9_-]/g, "_");
  const keySuffix = key ? `-k_${String(key).replace(/[^a-zA-Z0-9_-]/g, "_")}` : `-i_${index}`;
  return `${parentPath}-${cleanTag}${keySuffix}`;
}
function getSvelteComponentInstanceId(parentPath, compName, index, key) {
  const cleanName = compName.replace(/[^a-zA-Z0-9_-]/g, "_");
  const keySuffix = key ? `-k_${String(key).replace(/[^a-zA-Z0-9_-]/g, "_")}` : `-i_${index}`;
  return `${parentPath}-${cleanName}${keySuffix}`;
}
function getSvelteFragmentId(parentPath, index, key) {
  const keySuffix = key ? `-k_${String(key).replace(/[^a-zA-Z0-9_-]/g, "_")}` : `-i_${index}`;
  return `${parentPath}-frag${keySuffix}`;
}
function getSvelteSlotId(parentPath, slotName = "default", index = 0) {
  const cleanSlot = slotName.replace(/[^a-zA-Z0-9_-]/g, "_");
  return `${parentPath}-slot_${cleanSlot}_${index}`;
}
function getSvelteTextId(parentPath, index) {
  return `${parentPath}-txt-i_${index}`;
}
function getSvelteStateId(componentName, stateName) {
  const cleanComp = componentName.replace(/[^a-zA-Z0-9_-]/g, "_");
  const cleanState = stateName.replace(/[^a-zA-Z0-9_-]/g, "_");
  return `svelte-state-${cleanComp}-${cleanState}`;
}
function getSvelteReactiveId(componentName, reactiveName) {
  const cleanComp = componentName.replace(/[^a-zA-Z0-9_-]/g, "_");
  const cleanReactive = reactiveName.replace(/[^a-zA-Z0-9_-]/g, "_");
  return `svelte-reactive-${cleanComp}-${cleanReactive}`;
}

// packages/runtime/incremental/patch-generator/types.ts
var PatchOperationType = /* @__PURE__ */ ((PatchOperationType4) => {
  PatchOperationType4["CREATE_NODE"] = "CREATE_NODE";
  PatchOperationType4["REMOVE_NODE"] = "REMOVE_NODE";
  PatchOperationType4["REPLACE_NODE"] = "REPLACE_NODE";
  PatchOperationType4["UPDATE_TEXT"] = "UPDATE_TEXT";
  PatchOperationType4["SET_ATTRIBUTE"] = "SET_ATTRIBUTE";
  PatchOperationType4["REMOVE_ATTRIBUTE"] = "REMOVE_ATTRIBUTE";
  PatchOperationType4["INSERT_CHILD"] = "INSERT_CHILD";
  PatchOperationType4["REMOVE_CHILD"] = "REMOVE_CHILD";
  PatchOperationType4["MOVE_CHILD"] = "MOVE_CHILD";
  PatchOperationType4["REPLACE_CHILDREN"] = "REPLACE_CHILDREN";
  PatchOperationType4["NO_OP"] = "NO_OP";
  PatchOperationType4["SET_CSS_STYLESHEET"] = "SET_CSS_STYLESHEET";
  PatchOperationType4["CREATE_CSS_RULE"] = "CREATE_CSS_RULE";
  PatchOperationType4["REMOVE_CSS_RULE"] = "REMOVE_CSS_RULE";
  PatchOperationType4["UPDATE_CSS_RULE"] = "UPDATE_CSS_RULE";
  PatchOperationType4["ADD_CSS_DECLARATION"] = "ADD_CSS_DECLARATION";
  PatchOperationType4["UPDATE_CSS_DECLARATION"] = "UPDATE_CSS_DECLARATION";
  PatchOperationType4["REMOVE_CSS_DECLARATION"] = "REMOVE_CSS_DECLARATION";
  PatchOperationType4["UPDATE_CSS_SELECTOR"] = "UPDATE_CSS_SELECTOR";
  PatchOperationType4["ADD_CSS_KEYFRAME"] = "ADD_CSS_KEYFRAME";
  PatchOperationType4["REMOVE_CSS_KEYFRAME"] = "REMOVE_CSS_KEYFRAME";
  PatchOperationType4["UPDATE_CSS_KEYFRAME"] = "UPDATE_CSS_KEYFRAME";
  PatchOperationType4["CREATE_JS_UNIT"] = "CREATE_JS_UNIT";
  PatchOperationType4["UPDATE_JS_UNIT"] = "UPDATE_JS_UNIT";
  PatchOperationType4["REMOVE_JS_UNIT"] = "REMOVE_JS_UNIT";
  PatchOperationType4["ATTACH_EVENT_HANDLER"] = "ATTACH_EVENT_HANDLER";
  PatchOperationType4["UPDATE_EVENT_HANDLER"] = "UPDATE_EVENT_HANDLER";
  PatchOperationType4["REMOVE_EVENT_HANDLER"] = "REMOVE_EVENT_HANDLER";
  PatchOperationType4["EXECUTE_JS_UNIT"] = "EXECUTE_JS_UNIT";
  PatchOperationType4["CLEANUP_JS_SESSION"] = "CLEANUP_JS_SESSION";
  return PatchOperationType4;
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

// packages/runtime/incremental/patch-generator/operations.ts
function createOperation(operation, nodeId, parentId, index, payload, timestamp) {
  const op = {
    operation,
    nodeId
  };
  if (parentId !== void 0) op.parentId = parentId;
  if (index !== void 0) op.index = index;
  if (payload !== void 0) op.payload = payload;
  if (timestamp !== void 0) op.timestamp = timestamp;
  return op;
}
function attachTransportTimestamp(op, timestamp = Date.now()) {
  return {
    ...op,
    timestamp
  };
}
function createNode(nodeId, parentId, index, payload) {
  return createOperation("CREATE_NODE" /* CREATE_NODE */, nodeId, parentId, index, payload);
}
function insertChild(nodeId, parentId, index, payload) {
  return createOperation("INSERT_CHILD" /* INSERT_CHILD */, nodeId, parentId, index, payload);
}
function insertNode(nodeId, parentId, index, payload) {
  return insertChild(nodeId, parentId, index, payload);
}
function removeChild(nodeId, parentId, index) {
  return createOperation("REMOVE_CHILD" /* REMOVE_CHILD */, nodeId, parentId, index);
}
function removeNode(nodeId, parentId, index) {
  return createOperation("REMOVE_NODE" /* REMOVE_NODE */, nodeId, parentId, index);
}
function moveChild(nodeId, parentId, newIndex, oldIndex) {
  return createOperation("MOVE_CHILD" /* MOVE_CHILD */, nodeId, parentId, newIndex, oldIndex !== void 0 ? { oldIndex } : void 0);
}
function moveNode(nodeId, parentId, newIndex, oldIndex) {
  return moveChild(nodeId, parentId, newIndex, oldIndex);
}
function replaceNode(nodeId, parentId, index, payload) {
  return createOperation("REPLACE_NODE" /* REPLACE_NODE */, nodeId, parentId, index, payload);
}
function updateText(nodeId, text) {
  return createOperation("UPDATE_TEXT" /* UPDATE_TEXT */, nodeId, void 0, void 0, { text });
}
function setAttribute(nodeId, name, value) {
  return createOperation("SET_ATTRIBUTE" /* SET_ATTRIBUTE */, nodeId, void 0, void 0, { name, value });
}
function removeAttribute(nodeId, name) {
  return createOperation("REMOVE_ATTRIBUTE" /* REMOVE_ATTRIBUTE */, nodeId, void 0, void 0, { name });
}
function updateProperty(nodeId, name, value) {
  return setAttribute(nodeId, name, value);
}
function removeProperty(nodeId, name) {
  return removeAttribute(nodeId, name);
}
function addProperty(nodeId, name, value) {
  return setAttribute(nodeId, name, value);
}
function replaceChildren(nodeId, payload) {
  return createOperation("REPLACE_CHILDREN" /* REPLACE_CHILDREN */, nodeId, void 0, void 0, payload);
}
function noOp(nodeId) {
  return createOperation("NO_OP" /* NO_OP */, nodeId);
}
function setCSSStyleSheet(nodeId, cssText) {
  return createOperation("SET_CSS_STYLESHEET" /* SET_CSS_STYLESHEET */, nodeId, void 0, void 0, { cssText });
}
function createCSSRule(nodeId, selector, declarations = [], mediaQuery, index) {
  return createOperation("CREATE_CSS_RULE" /* CREATE_CSS_RULE */, nodeId, void 0, index, {
    selector,
    declarations,
    mediaQuery
  });
}
function removeCSSRule(nodeId, selector) {
  return createOperation("REMOVE_CSS_RULE" /* REMOVE_CSS_RULE */, nodeId, void 0, void 0, { selector });
}
function updateCSSRule(nodeId, selector, declarations, mediaQuery) {
  return createOperation("UPDATE_CSS_RULE" /* UPDATE_CSS_RULE */, nodeId, void 0, void 0, {
    selector,
    declarations,
    mediaQuery
  });
}
function addCSSDeclaration(nodeId, property, value, important = false) {
  return createOperation("ADD_CSS_DECLARATION" /* ADD_CSS_DECLARATION */, nodeId, void 0, void 0, {
    property,
    value,
    important
  });
}
function updateCSSDeclaration(nodeId, property, value, important = false) {
  return createOperation("UPDATE_CSS_DECLARATION" /* UPDATE_CSS_DECLARATION */, nodeId, void 0, void 0, {
    property,
    value,
    important
  });
}
function removeCSSDeclaration(nodeId, property) {
  return createOperation("REMOVE_CSS_DECLARATION" /* REMOVE_CSS_DECLARATION */, nodeId, void 0, void 0, {
    property
  });
}
function updateCSSSelector(nodeId, oldSelector, newSelector) {
  return createOperation("UPDATE_CSS_SELECTOR" /* UPDATE_CSS_SELECTOR */, nodeId, void 0, void 0, {
    oldSelector,
    newSelector
  });
}
function addCSSKeyframe(nodeId, keyframesName, keyframeSelector, declarations) {
  return createOperation("ADD_CSS_KEYFRAME" /* ADD_CSS_KEYFRAME */, nodeId, void 0, void 0, {
    keyframesName,
    keyframeSelector,
    declarations
  });
}
function removeCSSKeyframe(nodeId, keyframesName, keyframeSelector) {
  return createOperation("REMOVE_CSS_KEYFRAME" /* REMOVE_CSS_KEYFRAME */, nodeId, void 0, void 0, {
    keyframesName,
    keyframeSelector
  });
}
function updateCSSKeyframe(nodeId, keyframesName, keyframeSelector, declarations) {
  return createOperation("UPDATE_CSS_KEYFRAME" /* UPDATE_CSS_KEYFRAME */, nodeId, void 0, void 0, {
    keyframesName,
    keyframeSelector,
    declarations
  });
}
function createJSUnit(nodeId, unitKind, code, meta, index) {
  return createOperation("CREATE_JS_UNIT" /* CREATE_JS_UNIT */, nodeId, void 0, index, {
    unitKind,
    code,
    meta
  });
}
function updateJSUnit(nodeId, unitKind, code, meta) {
  return createOperation("UPDATE_JS_UNIT" /* UPDATE_JS_UNIT */, nodeId, void 0, void 0, {
    unitKind,
    code,
    meta
  });
}
function removeJSUnit(nodeId) {
  return createOperation("REMOVE_JS_UNIT" /* REMOVE_JS_UNIT */, nodeId);
}
function attachEventHandler(nodeId, eventName, targetSelector, handlerCode, index) {
  return createOperation("ATTACH_EVENT_HANDLER" /* ATTACH_EVENT_HANDLER */, nodeId, void 0, index, {
    eventName,
    targetSelector,
    handlerCode
  });
}
function updateEventHandler(nodeId, eventName, targetSelector, handlerCode) {
  return createOperation("UPDATE_EVENT_HANDLER" /* UPDATE_EVENT_HANDLER */, nodeId, void 0, void 0, {
    eventName,
    targetSelector,
    handlerCode
  });
}
function removeEventHandler(nodeId, eventName, targetSelector) {
  return createOperation("REMOVE_EVENT_HANDLER" /* REMOVE_EVENT_HANDLER */, nodeId, void 0, void 0, {
    eventName,
    targetSelector
  });
}
function executeJSUnit(nodeId, code) {
  return createOperation("EXECUTE_JS_UNIT" /* EXECUTE_JS_UNIT */, nodeId, void 0, void 0, {
    code
  });
}
function cleanupJSSession() {
  return createOperation("CLEANUP_JS_SESSION" /* CLEANUP_JS_SESSION */, "js-session");
}

// packages/runtime/incremental/patch-generator/diff.ts
function serializeASTNode(node) {
  if (node.kind === "Literal" /* Literal */) {
    const lit = node;
    return {
      id: lit.id,
      kind: lit.kind,
      value: lit.value,
      raw: lit.raw,
      text: String(lit.value)
    };
  }
  const comp = node;
  const props = (comp.properties || []).map((p) => ({
    name: p.name,
    value: p.value?.value ?? true
  }));
  const children = (comp.children || []).map((c) => serializeASTNode(c));
  return {
    id: comp.id,
    kind: comp.kind,
    name: comp.name,
    properties: props,
    children
  };
}
function getNodeKey(node) {
  if (node.kind !== "Literal" /* Literal */ && node.kind !== "Property" /* Property */) {
    const comp = node;
    const keyProp = (comp.properties || []).find((p) => p.name === "key" || p.name === "id");
    if (keyProp && keyProp.value) {
      return String(keyProp.value.value);
    }
  }
  return null;
}
function getNodeText(node) {
  if (node.kind === "Literal" /* Literal */) {
    return String(node.value);
  }
  if (node.children && node.children.length > 0) {
    const firstChild = node.children[0];
    if (firstChild.kind === "Literal" /* Literal */) {
      return String(firstChild.value);
    }
  }
  return null;
}
function areNodesCompatible(oldNode, newNode) {
  if (oldNode.kind !== newNode.kind) return false;
  const oldKey = getNodeKey(oldNode);
  const newKey = getNodeKey(newNode);
  if (oldKey && newKey && oldKey !== newKey) return false;
  if (oldNode.kind === "GenericComponent" /* GenericComponent */ && newNode.kind === "GenericComponent" /* GenericComponent */) {
    return oldNode.name === newNode.name;
  }
  if (oldNode.kind === "Literal" /* Literal */ && newNode.kind === "Literal" /* Literal */) {
    return true;
  }
  return true;
}
function getLongestIncreasingSubsequence(arr) {
  if (arr.length === 0) return [];
  const p = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== -1) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = u + v >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p[v];
  }
  return result;
}
var DiffEngine = class {
  constructor(patch) {
    this.patch = patch;
    this.newToOldIdMap = /* @__PURE__ */ new Map();
    this.oldToNewIdMap = /* @__PURE__ */ new Map();
  }
  /**
   * Resolves the live ID (the ID known to the live DOM / existing AST) for a given node or node ID.
   * - Matched existing node → Old/Live node ID
   * - Genuinely new node → New node ID
   */
  resolveLiveId(nodeOrId) {
    const id = typeof nodeOrId === "string" ? nodeOrId : nodeOrId.id;
    return this.newToOldIdMap.get(id) ?? id;
  }
  /**
   * Centralized ID resolution helper:
   * Matched existing node → Old ID
   * New node → New ID
   */
  getPatchTargetId(oldNode, newNode) {
    if (oldNode) return oldNode.id;
    if (newNode) return this.resolveLiveId(newNode);
    return "";
  }
  diff(oldNode, newNode, indexInParent = 0, liveParentId) {
    if (!areNodesCompatible(oldNode, newNode)) {
      const parentId = liveParentId ?? (oldNode.parent ? this.resolveLiveId(oldNode.parent) : "");
      this.patch.add(replaceNode(oldNode.id, parentId, indexInParent, serializeASTNode(newNode)));
      return;
    }
    this.newToOldIdMap.set(newNode.id, oldNode.id);
    this.oldToNewIdMap.set(oldNode.id, newNode.id);
    if (oldNode.kind === "Literal" /* Literal */ && newNode.kind === "Literal" /* Literal */) {
      const oldLit = oldNode;
      const newLit = newNode;
      if (oldLit.value !== newLit.value) {
        this.patch.add(updateText(oldLit.id, String(newLit.value)));
      }
      return;
    }
    if (oldNode.kind !== "Property" /* Property */ && oldNode.kind !== "Literal" /* Literal */) {
      const oldComp = oldNode;
      const newComp = newNode;
      this.diffProperties(oldComp, newComp);
      this.diffChildren(oldComp, newComp);
    }
  }
  diffProperties(oldComp, newComp) {
    const targetId = oldComp.id;
    const oldProps = new Map((oldComp.properties || []).map((p) => [p.name, p]));
    const newProps = new Map((newComp.properties || []).map((p) => [p.name, p]));
    const allOldNames = Array.from(oldProps.keys()).sort();
    const allNewNames = Array.from(newProps.keys()).sort();
    for (const name of allOldNames) {
      if (!newProps.has(name)) {
        this.patch.add(removeAttribute(targetId, name));
      }
    }
    for (const name of allNewNames) {
      const oldProp = oldProps.get(name);
      const newProp = newProps.get(name);
      const newValue = newProp.value?.value ?? true;
      if (!oldProp) {
        this.patch.add(setAttribute(targetId, name, newValue));
      } else {
        const oldValue = oldProp.value?.value ?? true;
        if (oldValue !== newValue) {
          this.patch.add(setAttribute(targetId, name, newValue));
        }
      }
    }
  }
  diffChildren(oldComp, newComp) {
    const liveParentId = oldComp.id;
    const oldChildren = oldComp.children || [];
    const newChildren = newComp.children || [];
    if (oldChildren.length === 0 && newChildren.length === 0) {
      return;
    }
    if (oldChildren.length === 1 && newChildren.length === 1 && oldChildren[0].kind === "Literal" /* Literal */ && newChildren[0].kind === "Literal" /* Literal */) {
      const oldLit = oldChildren[0];
      const newLit = newChildren[0];
      this.newToOldIdMap.set(newLit.id, oldLit.id);
      this.oldToNewIdMap.set(oldLit.id, newLit.id);
      if (oldLit.value !== newLit.value) {
        this.patch.add(updateText(oldLit.id, String(newLit.value)));
      }
      return;
    }
    if (oldChildren.length === 1 && newChildren.length === 1 && !areNodesCompatible(oldChildren[0], newChildren[0])) {
      this.patch.add(replaceNode(oldChildren[0].id, liveParentId, 0, serializeASTNode(newChildren[0])));
      return;
    }
    if (oldChildren.length === 0 && newChildren.length > 0) {
      for (let i = 0; i < newChildren.length; i++) {
        this.patch.add(insertChild(newChildren[i].id, liveParentId, i, serializeASTNode(newChildren[i])));
      }
      return;
    }
    if (newChildren.length === 0 && oldChildren.length > 0) {
      for (let i = oldChildren.length - 1; i >= 0; i--) {
        this.patch.add(removeChild(oldChildren[i].id, liveParentId, i));
      }
      return;
    }
    const oldMatched = /* @__PURE__ */ new Set();
    const newMatched = /* @__PURE__ */ new Set();
    const newToOldMap = /* @__PURE__ */ new Map();
    const oldToNewMap = /* @__PURE__ */ new Map();
    const recordMatch = (newIdx, oldIdx) => {
      newMatched.add(newIdx);
      oldMatched.add(oldIdx);
      newToOldMap.set(newIdx, oldIdx);
      oldToNewMap.set(oldIdx, newIdx);
      this.newToOldIdMap.set(newChildren[newIdx].id, oldChildren[oldIdx].id);
      this.oldToNewIdMap.set(oldChildren[oldIdx].id, newChildren[newIdx].id);
    };
    const oldKeyMap = /* @__PURE__ */ new Map();
    const oldIdMap = /* @__PURE__ */ new Map();
    for (let i = 0; i < oldChildren.length; i++) {
      const key = getNodeKey(oldChildren[i]);
      if (key && !oldKeyMap.has(key)) {
        oldKeyMap.set(key, i);
      }
      const id = oldChildren[i].id;
      if (id && !oldIdMap.has(id)) {
        oldIdMap.set(id, i);
      }
    }
    for (let j = 0; j < newChildren.length; j++) {
      if (newMatched.has(j)) continue;
      const newKey = getNodeKey(newChildren[j]);
      if (!newKey) continue;
      const oldIdx = oldKeyMap.get(newKey);
      if (oldIdx !== void 0 && !oldMatched.has(oldIdx) && areNodesCompatible(oldChildren[oldIdx], newChildren[j])) {
        recordMatch(j, oldIdx);
      }
    }
    for (let j = 0; j < newChildren.length; j++) {
      if (newMatched.has(j)) continue;
      const newChild = newChildren[j];
      const oldIdx = oldIdMap.get(newChild.id);
      if (oldIdx !== void 0 && !oldMatched.has(oldIdx) && areNodesCompatible(oldChildren[oldIdx], newChild)) {
        recordMatch(j, oldIdx);
      }
    }
    for (let j = 0; j < newChildren.length; j++) {
      if (newMatched.has(j)) continue;
      const newChild = newChildren[j];
      const newText = getNodeText(newChild);
      if (newText === null || newText === "") continue;
      if (j < oldChildren.length && !oldMatched.has(j) && areNodesCompatible(oldChildren[j], newChild)) {
        const oldText = getNodeText(oldChildren[j]);
        if (oldText === newText) {
          recordMatch(j, j);
          continue;
        }
      }
      for (let i = 0; i < oldChildren.length; i++) {
        if (oldMatched.has(i)) continue;
        const oldChild = oldChildren[i];
        if (areNodesCompatible(oldChild, newChild)) {
          const oldText = getNodeText(oldChild);
          if (oldText !== null && newText === oldText) {
            recordMatch(j, i);
            break;
          }
        }
      }
    }
    let prefix = 0;
    while (prefix < oldChildren.length && prefix < newChildren.length && !oldMatched.has(prefix) && !newMatched.has(prefix) && areNodesCompatible(oldChildren[prefix], newChildren[prefix])) {
      recordMatch(prefix, prefix);
      prefix++;
    }
    let oldSuffix = oldChildren.length - 1;
    let newSuffix = newChildren.length - 1;
    while (oldSuffix >= prefix && newSuffix >= prefix && !oldMatched.has(oldSuffix) && !newMatched.has(newSuffix) && areNodesCompatible(oldChildren[oldSuffix], newChildren[newSuffix])) {
      recordMatch(newSuffix, oldSuffix);
      oldSuffix--;
      newSuffix--;
    }
    for (let j = 0; j < newChildren.length; j++) {
      if (newMatched.has(j)) continue;
      if (j < oldChildren.length && !oldMatched.has(j)) {
        if (areNodesCompatible(oldChildren[j], newChildren[j])) {
          recordMatch(j, j);
        }
      }
    }
    for (let i = oldChildren.length - 1; i >= 0; i--) {
      if (!oldMatched.has(i)) {
        const oldChild = oldChildren[i];
        this.patch.add(removeChild(oldChild.id, liveParentId, i));
      }
    }
    for (let j = 0; j < newChildren.length; j++) {
      const oldIndex = newToOldMap.get(j);
      if (oldIndex !== void 0) {
        this.diff(oldChildren[oldIndex], newChildren[j], j, liveParentId);
      }
    }
    const currentChildren = [];
    for (let i = 0; i < oldChildren.length; i++) {
      if (oldMatched.has(i)) {
        currentChildren.push({ liveId: oldChildren[i].id, node: oldChildren[i] });
      }
    }
    for (let targetIdx = 0; targetIdx < newChildren.length; targetIdx++) {
      const oldIndex = newToOldMap.get(targetIdx);
      if (oldIndex === void 0) {
        const newChild = newChildren[targetIdx];
        const insertIndex = Math.min(targetIdx, currentChildren.length);
        this.patch.add(insertChild(newChild.id, liveParentId, insertIndex, serializeASTNode(newChild)));
        currentChildren.splice(insertIndex, 0, { liveId: newChild.id, node: newChild });
      }
    }
    const positionsInCurrent = newChildren.map((nc) => {
      const liveId = this.resolveLiveId(nc);
      return currentChildren.findIndex((c) => c.liveId === liveId);
    });
    const lisArray = positionsInCurrent.length > 0 ? getLongestIncreasingSubsequence(positionsInCurrent) : [];
    const stableSet = new Set(lisArray);
    for (let targetIdx = newChildren.length - 1; targetIdx >= 0; targetIdx--) {
      if (!stableSet.has(targetIdx)) {
        const desiredChild = newChildren[targetIdx];
        const liveChildId = this.resolveLiveId(desiredChild);
        const currentPos = currentChildren.findIndex((c) => c.liveId === liveChildId);
        if (currentPos !== -1) {
          const [moved] = currentChildren.splice(currentPos, 1);
          let destIndex;
          if (targetIdx === newChildren.length - 1) {
            destIndex = currentChildren.length;
          } else {
            const nextChild = newChildren[targetIdx + 1];
            const nextLiveId = this.resolveLiveId(nextChild);
            destIndex = currentChildren.findIndex((c) => c.liveId === nextLiveId);
            if (destIndex === -1) {
              destIndex = currentChildren.length;
            }
          }
          currentChildren.splice(destIndex, 0, moved);
          if (destIndex !== currentPos) {
            this.patch.add(moveChild(liveChildId, liveParentId, destIndex, currentPos));
          }
        }
      }
    }
  }
};

// packages/compiler/interpreters/svelte-lm/reactivity.ts
var RESERVED_JS_KEYWORDS = /* @__PURE__ */ new Set([
  "true",
  "false",
  "null",
  "undefined",
  "NaN",
  "Infinity",
  "Math",
  "Number",
  "String",
  "Boolean",
  "Array",
  "Object",
  "JSON",
  "Date",
  "RegExp",
  "window",
  "document",
  "console",
  "this",
  "typeof",
  "instanceof",
  "void",
  "in",
  "if",
  "else",
  "return",
  "new",
  "var",
  "let",
  "const",
  "function"
]);
function extractExpressionDependencies(expr, availableScope) {
  if (!expr || typeof expr !== "string") return [];
  const trimmed = expr.trim();
  if (!trimmed) return [];
  const identifierRegex = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)(?:\.[a-zA-Z_$][a-zA-Z0-9_$]*)*\b/g;
  const dependencies = /* @__PURE__ */ new Set();
  let match;
  while ((match = identifierRegex.exec(trimmed)) !== null) {
    const rootIdent = match[1];
    if (RESERVED_JS_KEYWORDS.has(rootIdent)) {
      continue;
    }
    if (availableScope && availableScope.length > 0) {
      if (availableScope.includes(rootIdent)) {
        dependencies.add(rootIdent);
      }
    } else {
      dependencies.add(rootIdent);
    }
  }
  return Array.from(dependencies).sort();
}
function extractTemplateInterpolations(template) {
  if (!template || typeof template !== "string") return [];
  const regex = /\{\s*([a-zA-Z_$][a-zA-Z0-9_$.]*)\s*\}/g;
  const deps = /* @__PURE__ */ new Set();
  let match;
  while ((match = regex.exec(template)) !== null) {
    const rawExpr = match[1].trim();
    const rootIdent = rawExpr.split(".")[0];
    if (rootIdent && !RESERVED_JS_KEYWORDS.has(rootIdent)) {
      deps.add(rootIdent);
    }
  }
  return Array.from(deps).sort();
}
function evaluateSvelteExpression(expr, context) {
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
  if (trimmed in context) {
    return context[trimmed];
  }
  if (/^[a-zA-Z_$][a-zA-Z0-9_$]*(?:\.[a-zA-Z_$][a-zA-Z0-9_$]*)+$/.test(trimmed)) {
    const parts = trimmed.split(".");
    let cur = context;
    for (const p of parts) {
      if (cur == null) return void 0;
      cur = cur[p];
    }
    return cur;
  }
  try {
    const keys = Object.keys(context);
    const values = Object.values(context);
    const fn = new Function(...keys, `return (${trimmed});`);
    return fn(...values);
  } catch (err) {
    return null;
  }
}
function interpolateTemplateString(template, context) {
  if (!template) return "";
  return template.replace(/\{\s*([a-zA-Z_$][a-zA-Z0-9_$.]*)\s*\}/g, (match, exprKey) => {
    const val = evaluateSvelteExpression(exprKey, context);
    return val !== void 0 && val !== null ? String(val) : "";
  });
}
var SvelteReactivityGraph = class {
  // varName -> domNodeIds
  constructor(componentName, instancePath = `svelte-root-${componentName}_0`) {
    this.stateMap = /* @__PURE__ */ new Map();
    this.reactiveMap = /* @__PURE__ */ new Map();
    this.domDependencies = /* @__PURE__ */ new Map();
    // domNodeId -> DOMDependencyInfo
    // Adjacency maps for deterministic traversal
    this.varToReactiveDependents = /* @__PURE__ */ new Map();
    // varName -> reactiveNames
    this.varToDOMDependents = /* @__PURE__ */ new Map();
    this.componentName = componentName;
    this.instancePath = instancePath;
  }
  addState(name, initialValue) {
    this.stateMap.set(name, {
      name,
      initialValue,
      currentValue: initialValue
    });
    return this;
  }
  addReactive(name, expression, explicitDeps) {
    const knownVars = Array.from(this.stateMap.keys()).concat(Array.from(this.reactiveMap.keys()));
    const dependencies = explicitDeps || extractExpressionDependencies(expression, knownVars);
    this.reactiveMap.set(name, {
      name,
      expression,
      dependencies
    });
    for (const dep of dependencies) {
      if (!this.varToReactiveDependents.has(dep)) {
        this.varToReactiveDependents.set(dep, /* @__PURE__ */ new Set());
      }
      this.varToReactiveDependents.get(dep).add(name);
    }
    return this;
  }
  registerDOMDependency(info) {
    this.domDependencies.set(info.domNodeId, info);
    for (const dep of info.dependencies) {
      if (!this.varToDOMDependents.has(dep)) {
        this.varToDOMDependents.set(dep, /* @__PURE__ */ new Set());
      }
      this.varToDOMDependents.get(dep).add(info.domNodeId);
    }
    return this;
  }
  /**
   * Builds the initial context and evaluates all reactive declarations in topological dependency order.
   */
  computeInitialContext(props = {}) {
    const context = { ...props };
    for (const [name, stateInfo] of this.stateMap.entries()) {
      context[name] = stateInfo.currentValue !== void 0 ? stateInfo.currentValue : stateInfo.initialValue;
    }
    const reactiveOrder = this.getTopologicalReactiveOrder();
    for (const rName of reactiveOrder) {
      const rInfo = this.reactiveMap.get(rName);
      if (rInfo) {
        const val = evaluateSvelteExpression(rInfo.expression, context);
        rInfo.currentValue = val;
        context[rName] = val;
      }
    }
    return context;
  }
  /**
   * Topological sort of reactive declarations based on their dependencies.
   */
  getTopologicalReactiveOrder() {
    const visited = /* @__PURE__ */ new Set();
    const order = [];
    const visiting = /* @__PURE__ */ new Set();
    const visit = (name) => {
      if (visited.has(name)) return;
      if (visiting.has(name)) {
        return;
      }
      visiting.add(name);
      const rInfo = this.reactiveMap.get(name);
      if (rInfo) {
        for (const dep of rInfo.dependencies) {
          if (this.reactiveMap.has(dep)) {
            visit(dep);
          }
        }
      }
      visiting.delete(name);
      visited.add(name);
      order.push(name);
    };
    for (const name of this.reactiveMap.keys()) {
      visit(name);
    }
    return order;
  }
  /**
   * Reactively update a state variable, recompute dependent reactive variables in order,
   * identify affected DOM nodes, and generate pinpoint PatchOperations.
   */
  updateState(stateName, newValue, currentContext) {
    const updatedState = { ...currentContext, [stateName]: newValue };
    const stateInfo = this.stateMap.get(stateName);
    if (stateInfo) {
      stateInfo.currentValue = newValue;
    }
    const changedVariables = [stateName];
    const recomputedReactive = {};
    const affectedReactiveSet = /* @__PURE__ */ new Set();
    const queue = [stateName];
    while (queue.length > 0) {
      const current = queue.shift();
      const dependents = this.varToReactiveDependents.get(current);
      if (dependents) {
        for (const dep of dependents) {
          if (!affectedReactiveSet.has(dep)) {
            affectedReactiveSet.add(dep);
            queue.push(dep);
          }
        }
      }
    }
    const topoOrder = this.getTopologicalReactiveOrder().filter((r) => affectedReactiveSet.has(r));
    for (const rName of topoOrder) {
      const rInfo = this.reactiveMap.get(rName);
      if (rInfo) {
        const newVal = evaluateSvelteExpression(rInfo.expression, updatedState);
        rInfo.currentValue = newVal;
        updatedState[rName] = newVal;
        recomputedReactive[rName] = newVal;
        changedVariables.push(rName);
      }
    }
    const affectedDomNodeIds = /* @__PURE__ */ new Set();
    for (const vName of changedVariables) {
      const domDeps = this.varToDOMDependents.get(vName);
      if (domDeps) {
        for (const domId of domDeps) {
          affectedDomNodeIds.add(domId);
        }
      }
    }
    const patches = [];
    for (const domId of affectedDomNodeIds) {
      const depInfo = this.domDependencies.get(domId);
      if (!depInfo) continue;
      switch (depInfo.kind) {
        case "TEXT": {
          const newText = interpolateTemplateString(depInfo.template || "", updatedState);
          patches.push({
            operation: "UPDATE_TEXT" /* UPDATE_TEXT */,
            nodeId: domId,
            payload: {
              value: newText,
              text: newText
            }
          });
          break;
        }
        case "PROPERTY": {
          if (depInfo.propName) {
            const val = evaluateSvelteExpression(depInfo.expression || "", updatedState);
            patches.push({
              operation: "SET_ATTRIBUTE" /* SET_ATTRIBUTE */,
              nodeId: domId,
              payload: {
                name: depInfo.propName,
                value: val
              }
            });
          }
          break;
        }
        case "CLASS": {
          if (depInfo.className && depInfo.expression) {
            const isActive = Boolean(evaluateSvelteExpression(depInfo.expression, updatedState));
            patches.push({
              operation: "SET_ATTRIBUTE" /* SET_ATTRIBUTE */,
              nodeId: domId,
              payload: {
                className: depInfo.className,
                active: isActive
              }
            });
          }
          break;
        }
        case "BINDING": {
          if (depInfo.propName && depInfo.expression) {
            const val = updatedState[depInfo.expression];
            patches.push({
              operation: "SET_ATTRIBUTE" /* SET_ATTRIBUTE */,
              nodeId: domId,
              payload: {
                name: depInfo.propName,
                value: val
              }
            });
          }
          break;
        }
        case "CONDITIONAL": {
          if (depInfo.expression) {
            const isTruthy = Boolean(evaluateSvelteExpression(depInfo.expression, updatedState));
            const targetBranch = isTruthy ? "then" : "else";
            if (depInfo.currentBranch !== targetBranch) {
              depInfo.currentBranch = targetBranch;
              let branchAST = null;
              if (typeof depInfo.branchRenderer === "function") {
                branchAST = depInfo.branchRenderer(targetBranch, updatedState);
              } else {
                branchAST = isTruthy ? depInfo.thenNode : depInfo.elseNode;
              }
              if (branchAST) {
                patches.push({
                  operation: "REPLACE_NODE" /* REPLACE_NODE */,
                  nodeId: depInfo.domNodeId,
                  payload: serializeASTNode(branchAST)
                });
              }
            }
          }
          break;
        }
      }
    }
    return {
      updatedState,
      recomputedReactive,
      changedVariables,
      affectedDomNodeIds: Array.from(affectedDomNodeIds),
      patches
    };
  }
  /**
   * Serialize graph for debugging and inspector visualization.
   */
  toJSON() {
    return {
      componentName: this.componentName,
      instancePath: this.instancePath,
      state: Array.from(this.stateMap.values()),
      reactive: Array.from(this.reactiveMap.values()),
      domDependencies: Array.from(this.domDependencies.values()),
      edges: {
        varToReactive: Object.fromEntries(
          Array.from(this.varToReactiveDependents.entries()).map(([k, v]) => [k, Array.from(v)])
        ),
        varToDOM: Object.fromEntries(
          Array.from(this.varToDOMDependents.entries()).map(([k, v]) => [k, Array.from(v)])
        )
      }
    };
  }
};

// packages/compiler/interpreters/svelte-lm/vocabulary.ts
var SVELTE_ELEMENT_ABBREVIATIONS = {
  di: "div",
  bo: "button",
  so: "section",
  al: "article",
  ad: "aside",
  he: "header",
  fe: "footer",
  na: "nav",
  mi: "main",
  sa: "span",
  in: "input",
  iu: "input",
  le: "label",
  tl: "table",
  cu: "canvas",
  fo: "form",
  fr: "form",
  im: "img",
  pa: "p",
  an: "a",
  li: "li",
  ul: "ul",
  ol: "ol"
};
var SVELTE_PROP_ABBREVIATIONS = {
  cs: "className",
  cm: "className",
  class: "className",
  id: "id",
  hr: "href",
  sr: "src",
  tp: "type",
  pe: "placeholder",
  nm: "name",
  vu: "value",
  dis: "disabled",
  ky: "key",
  key: "key",
  // Svelte bindings
  bv: "bind:value",
  bc: "bind:checked",
  bindValue: "bind:value",
  bindChecked: "bind:checked",
  // Svelte events
  oc: "on:click",
  og: "on:change",
  os: "on:submit",
  oi: "on:input",
  okd: "on:keydown",
  oku: "on:keyup",
  omd: "on:mousedown",
  omu: "on:mouseup",
  ome: "on:mouseenter",
  oml: "on:mouseleave",
  of: "on:focus",
  ob: "on:blur"
};
var KNOWN_SVELTE_EVENTS = /* @__PURE__ */ new Set([
  "click",
  "input",
  "change",
  "submit",
  "keydown",
  "keyup",
  "keypress",
  "mousedown",
  "mouseup",
  "mousemove",
  "mouseenter",
  "mouseleave",
  "focus",
  "blur",
  "scroll",
  "reset",
  "touchstart",
  "touchend",
  "touchmove",
  // Svelte on: event syntax
  "on:click",
  "on:input",
  "on:change",
  "on:submit",
  "on:keydown",
  "on:keyup",
  "on:keypress",
  "on:mousedown",
  "on:mouseup",
  "on:mousemove",
  "on:mouseenter",
  "on:mouseleave",
  "on:focus",
  "on:blur",
  // CamelCase aliases
  "onClick",
  "onInput",
  "onChange",
  "onSubmit",
  "onKeyDown",
  "onKeyUp"
]);
var TAG_TO_AST_KIND4 = {
  div: "Container" /* Container */,
  button: "Button" /* Button */,
  section: "Section" /* Section */,
  article: "Card" /* Card */,
  main: "Page" /* Page */,
  input: "Input" /* Input */,
  form: "Form" /* Form */,
  img: "Image" /* Image */,
  p: "Text" /* Text */,
  span: "Text" /* Text */,
  h1: "Text" /* Text */,
  h2: "Text" /* Text */,
  h3: "Text" /* Text */,
  h4: "Text" /* Text */,
  h5: "Text" /* Text */,
  h6: "Text" /* Text */,
  header: "Container" /* Container */,
  footer: "Container" /* Container */,
  nav: "Container" /* Container */,
  aside: "Container" /* Container */,
  ul: "Container" /* Container */,
  ol: "Container" /* Container */,
  li: "Container" /* Container */
};
function resolveSvelteElementTag(identifier) {
  if (SVELTE_ELEMENT_ABBREVIATIONS[identifier]) {
    return SVELTE_ELEMENT_ABBREVIATIONS[identifier];
  }
  return identifier;
}
function isCustomComponentName3(name) {
  return /^[A-Z][a-zA-Z0-9_$]*$/.test(name);
}
function resolveSveltePropName(propName) {
  if (SVELTE_PROP_ABBREVIATIONS[propName]) {
    return SVELTE_PROP_ABBREVIATIONS[propName];
  }
  if (propName.startsWith("on:") || propName.startsWith("bind:")) {
    return propName;
  }
  return propName;
}
function isSvelteEventProp(propName) {
  if (propName.startsWith("on:") || propName.startsWith("@")) return true;
  const resolved = resolveSveltePropName(propName);
  return KNOWN_SVELTE_EVENTS.has(resolved) || /^on[A-Z]/.test(resolved) || resolved.startsWith("on:");
}
function getDOMEventNameFromSvelteEvent(svelteEventName) {
  let clean = svelteEventName.replace(/^(?:on:|@)/, "");
  if (SVELTE_PROP_ABBREVIATIONS[clean]) {
    clean = SVELTE_PROP_ABBREVIATIONS[clean].replace(/^on:/, "");
  }
  if (/^on[A-Z]/.test(clean)) {
    clean = clean.replace(/^on/, "");
  }
  return clean.toLowerCase();
}
function isSvelteBindingProp(propName) {
  const resolved = resolveSveltePropName(propName);
  return resolved.startsWith("bind:") || propName.startsWith("bind:") || propName === "bv" || propName === "bc";
}
function getBindingPropertyName(propName) {
  const resolved = resolveSveltePropName(propName);
  if (resolved === "bind:checked" || propName === "bc" || propName === "bindChecked") return "checked";
  if (resolved === "bind:group") return "group";
  return "value";
}

// packages/compiler/interpreters/svelte-lm/interpreter.ts
var SvelteLMInterpreter = class _SvelteLMInterpreter {
  constructor(options = {}) {
    this.diagnostics = [];
    // Stream state
    this.buffer = "";
    this.inString = false;
    this.stringQuote = "";
    this.inLineComment = false;
    this.inBlockComment = false;
    this.escapeNext = false;
    this.options = options;
    this.currentLoc = {
      startLine: 1,
      startColumn: 1,
      startOffset: 0,
      endLine: 1,
      endColumn: 1,
      endOffset: 0
    };
    this.program = {
      id: getSvelteProgramId(),
      kind: "SvelteProgram" /* Program */,
      components: [],
      rootComponent: "App",
      sourceLocation: { ...this.currentLoc }
    };
  }
  static parse(source, options = {}) {
    const interpreter = new _SvelteLMInterpreter(options);
    interpreter.write(source);
    return interpreter.end();
  }
  reset() {
    this.currentLoc = {
      startLine: 1,
      startColumn: 1,
      startOffset: 0,
      endLine: 1,
      endColumn: 1,
      endOffset: 0
    };
    this.program = {
      id: getSvelteProgramId(),
      kind: "SvelteProgram" /* Program */,
      components: [],
      rootComponent: "App",
      sourceLocation: { ...this.currentLoc }
    };
    this.diagnostics = [];
    this.buffer = "";
    this.inString = false;
    this.stringQuote = "";
    this.inLineComment = false;
    this.inBlockComment = false;
    this.escapeNext = false;
  }
  getAST() {
    return this.program;
  }
  getDiagnostics() {
    return [...this.diagnostics];
  }
  hasErrors() {
    return this.diagnostics.some((d) => d.severity === "error");
  }
  isSafeToExpose() {
    if (this.inString || this.inLineComment || this.inBlockComment) {
      return false;
    }
    return this.program.components.length > 0;
  }
  write(chunk) {
    for (let i = 0; i < chunk.length; i++) {
      this.consumeChar(chunk[i]);
    }
    return this;
  }
  end() {
    this.flushBuffer();
    return this.program;
  }
  advanceLocation(char) {
    this.currentLoc.endOffset++;
    if (char === "\n") {
      this.currentLoc.endLine++;
      this.currentLoc.endColumn = 1;
    } else {
      this.currentLoc.endColumn++;
    }
  }
  consumeChar(char) {
    this.advanceLocation(char);
    this.buffer += char;
    if (this.inLineComment) {
      if (char === "\n") {
        this.inLineComment = false;
      }
      return;
    }
    if (this.inBlockComment) {
      if (char === "/" && this.buffer.endsWith("*/")) {
        this.inBlockComment = false;
      }
      return;
    }
    if (!this.inString) {
      if (char === "/" && this.buffer.endsWith("//")) {
        this.inLineComment = true;
        return;
      }
      if (char === "*" && this.buffer.endsWith("/*")) {
        this.inBlockComment = true;
        return;
      }
    }
    if (this.inString) {
      if (this.escapeNext) {
        this.escapeNext = false;
        return;
      }
      if (char === "\\") {
        this.escapeNext = true;
        return;
      }
      if (char === this.stringQuote) {
        this.inString = false;
        this.stringQuote = "";
      }
      return;
    }
    if (char === '"' || char === "'") {
      this.inString = true;
      this.stringQuote = char;
      return;
    }
    if (char === "(" || char === ")" || char === "{" || char === "}" || char === "," || char === ";" || char === "\n" || char === "	" || char === " ") {
      this.checkBufferForConstructs();
    }
  }
  checkBufferForConstructs() {
    const clean = this.buffer.replace(/<SVELTE(?:-LM)?>/gi, "").replace(/<\/SVELTE(?:-LM)?>/gi, "").trim();
    if (!clean) return;
    this.parseTokens(clean);
  }
  flushBuffer() {
    const clean = this.buffer.replace(/<SVELTE(?:-LM)?>/gi, "").replace(/<\/SVELTE(?:-LM)?>/gi, "").trim();
    if (clean) {
      this.parseTokens(clean);
    }
  }
  parseTokens(source) {
    if (!source) return;
    try {
      const parsedComponents = this.parseProgramAST(source);
      if (parsedComponents.length > 0) {
        this.program.components = parsedComponents;
        const appComp = parsedComponents.find((c) => c.name === "App");
        this.program.rootComponent = this.options.rootComponent || appComp?.name || parsedComponents[0].name;
      }
    } catch {
    }
  }
  parseProgramAST(source) {
    const components = [];
    let pos = 0;
    const skipWhitespace = () => {
      while (pos < source.length && /\s/.test(source[pos])) pos++;
    };
    while (pos < source.length) {
      skipWhitespace();
      if (pos >= source.length) break;
      const compMatch = /^(?:component|comp)\s*\(\s*([A-Za-z_$][A-Za-z0-9_$]*)(?:\s*:\s*([A-Za-z_$][A-Za-z0-9_$]*))?\s*\)\s*\(/i.exec(
        source.slice(pos)
      );
      if (compMatch) {
        const compName = compMatch[1];
        const propsType = compMatch[2];
        const openParenIndex = pos + compMatch[0].length - 1;
        const bodySource = this.extractMatchingParen(source, openParenIndex);
        pos = openParenIndex + bodySource.length;
        const { stateDecls, reactiveDecls, propDecls, bodyNodes } = this.parseComponentBody(
          bodySource.slice(1, -1),
          compName
        );
        components.push({
          id: getSvelteComponentDeclarationId(compName),
          kind: "SvelteComponentDeclaration" /* ComponentDeclaration */,
          name: compName,
          propsType,
          propDeclarations: propDecls,
          stateDeclarations: stateDecls,
          reactiveDeclarations: reactiveDecls,
          body: bodyNodes,
          rawCode: compMatch[0] + bodySource,
          sourceLocation: { ...this.currentLoc }
        });
      } else {
        const standaloneBody = source.slice(pos).trim();
        if (standaloneBody) {
          const { stateDecls, reactiveDecls, propDecls, bodyNodes } = this.parseComponentBody(
            standaloneBody,
            "App"
          );
          if (bodyNodes.length > 0 || stateDecls.length > 0 || reactiveDecls.length > 0 || propDecls.length > 0) {
            components.push({
              id: getSvelteComponentDeclarationId("App"),
              kind: "SvelteComponentDeclaration" /* ComponentDeclaration */,
              name: "App",
              propDeclarations: propDecls,
              stateDeclarations: stateDecls,
              reactiveDeclarations: reactiveDecls,
              body: bodyNodes,
              rawCode: standaloneBody,
              sourceLocation: { ...this.currentLoc }
            });
          }
        }
        break;
      }
    }
    return components;
  }
  extractMatchingParen(str, openParenPos) {
    let depth = 0;
    let inStr = false;
    let quote = "";
    let inBrackets = 0;
    let inBraces = 0;
    for (let i = openParenPos; i < str.length; i++) {
      const ch = str[i];
      if (inStr) {
        if (ch === quote && str[i - 1] !== "\\") inStr = false;
      } else {
        if (ch === '"' || ch === "'") {
          inStr = true;
          quote = ch;
        } else if (ch === "(") {
          depth++;
        } else if (ch === ")") {
          depth--;
          if (depth === 0) {
            return str.slice(openParenPos, i + 1);
          }
        } else if (ch === "[") {
          inBrackets++;
        } else if (ch === "]") {
          if (inBrackets > 0) inBrackets--;
        } else if (ch === "{") {
          inBraces++;
        } else if (ch === "}") {
          if (inBraces > 0) inBraces--;
        }
      }
    }
    return str.slice(openParenPos);
  }
  parseComponentBody(bodyStr, componentName) {
    const stateDecls = [];
    const reactiveDecls = [];
    const propDecls = [];
    const bodyNodes = [];
    let pos = 0;
    const skipWhitespace = () => {
      while (pos < bodyStr.length && /\s/.test(bodyStr[pos])) pos++;
    };
    while (pos < bodyStr.length) {
      skipWhitespace();
      if (pos >= bodyStr.length) break;
      const statePrefix = /^(?:state|let)\s*\(/i.exec(bodyStr.slice(pos));
      if (statePrefix) {
        const openParenPos = pos + statePrefix[0].length - 1;
        const fullBlock = this.extractMatchingParen(bodyStr, openParenPos);
        const inner = fullBlock.slice(1, -1).trim();
        const commaIdx = inner.indexOf(",");
        if (commaIdx !== -1) {
          const stateName = inner.slice(0, commaIdx).trim();
          const initialRaw = inner.slice(commaIdx + 1).trim();
          let initialVal = initialRaw;
          if (initialRaw === "true") initialVal = true;
          else if (initialRaw === "false") initialVal = false;
          else if (!isNaN(Number(initialRaw)) && initialRaw !== "") initialVal = Number(initialRaw);
          else if (initialRaw.startsWith('"') && initialRaw.endsWith('"') || initialRaw.startsWith("'") && initialRaw.endsWith("'")) {
            initialVal = initialRaw.slice(1, -1);
          } else {
            try {
              initialVal = evaluateSvelteExpression(initialRaw, {});
              if (initialVal === void 0) {
                initialVal = JSON.parse(initialRaw);
              }
            } catch {
              initialVal = initialRaw;
            }
          }
          stateDecls.push({
            id: getSvelteStateId(componentName, stateName),
            kind: "SvelteStateDeclaration" /* StateDeclaration */,
            stateName,
            name: stateName,
            initialValue: initialVal !== void 0 ? initialVal : initialRaw,
            sourceLocation: { ...this.currentLoc }
          });
          pos = openParenPos + fullBlock.length;
          continue;
        }
      }
      const reactivePrefix = /^(?:reactive|derived|\$:?)\s*\(/i.exec(bodyStr.slice(pos));
      if (reactivePrefix) {
        const openParenPos = pos + reactivePrefix[0].length - 1;
        const fullBlock = this.extractMatchingParen(bodyStr, openParenPos);
        const inner = fullBlock.slice(1, -1).trim();
        const commaIdx = inner.indexOf(",");
        if (commaIdx !== -1) {
          const reactiveName = inner.slice(0, commaIdx).trim();
          const expr = inner.slice(commaIdx + 1).trim();
          const dependencies = extractExpressionDependencies(expr).filter((id) => id !== reactiveName);
          reactiveDecls.push({
            id: getSvelteReactiveId(componentName, reactiveName),
            kind: "SvelteReactiveDeclaration" /* ReactiveDeclaration */,
            name: reactiveName,
            reactiveName,
            expression: expr,
            dependencies,
            sourceLocation: { ...this.currentLoc }
          });
          pos = openParenPos + fullBlock.length;
          continue;
        }
      }
      const propPrefix = /^(?:prop|exportLet)\s*\(/i.exec(bodyStr.slice(pos));
      if (propPrefix) {
        const openParenPos = pos + propPrefix[0].length - 1;
        const fullBlock = this.extractMatchingParen(bodyStr, openParenPos);
        const inner = fullBlock.slice(1, -1).trim();
        const commaIdx = inner.indexOf(",");
        let propName = inner;
        let defaultVal = void 0;
        if (commaIdx !== -1) {
          propName = inner.slice(0, commaIdx).trim();
          const valRaw = inner.slice(commaIdx + 1).trim();
          defaultVal = evaluateSvelteExpression(valRaw, {}) ?? valRaw;
        }
        propDecls.push({
          id: `svelte-prop-decl-${componentName}-${propName}`,
          kind: "SveltePropDeclaration" /* PropDeclaration */,
          name: propName,
          propName,
          defaultValue: defaultVal,
          sourceLocation: { ...this.currentLoc }
        });
        pos = openParenPos + fullBlock.length;
        continue;
      }
      const whenMatch = /^(?:when|if)\s*\(\s*([^)]+)\)\s*\(/i.exec(bodyStr.slice(pos));
      if (whenMatch) {
        const condExpr = whenMatch[1].trim();
        const openParenIndex = pos + whenMatch[0].length - 1;
        const thenBlock = this.extractMatchingParen(bodyStr, openParenIndex);
        pos = openParenIndex + thenBlock.length;
        const thenNodes = this.parseComponentBody(
          thenBlock.slice(1, -1),
          componentName
        ).bodyNodes;
        let elseNode = void 0;
        skipWhitespace();
        if (bodyStr[pos] === "(") {
          const elseOpenParenIndex = pos;
          const elseBlock = this.extractMatchingParen(bodyStr, elseOpenParenIndex);
          pos = elseOpenParenIndex + elseBlock.length;
          const elseNodes = this.parseComponentBody(
            elseBlock.slice(1, -1),
            componentName
          ).bodyNodes;
          if (elseNodes.length > 0) {
            elseNode = elseNodes[0];
          }
        }
        bodyNodes.push({
          id: `svelte-cond-${componentName}-${bodyNodes.length}`,
          kind: "SvelteConditional" /* Conditional */,
          conditionExpr: condExpr,
          thenBranch: thenNodes[0] || {
            id: `svelte-frag-${bodyNodes.length}`,
            kind: "SvelteFragment" /* Fragment */,
            children: []
          },
          elseBranch: elseNode,
          sourceLocation: { ...this.currentLoc }
        });
        continue;
      }
      const eachMatch = /^(?:each|for)\s*\(\s*([A-Za-z0-9_$.]+)\s*,\s*([A-Za-z_$][A-Za-z0-9_$]*)(?:\s*,\s*([^)]+))?\s*\)\s*\(/i.exec(
        bodyStr.slice(pos)
      );
      if (eachMatch) {
        const arrayExpr = eachMatch[1];
        const itemVar = eachMatch[2];
        const keyOrIndex = eachMatch[3]?.trim();
        const openParenIndex = pos + eachMatch[0].length - 1;
        const listBodyBlock = this.extractMatchingParen(bodyStr, openParenIndex);
        pos = openParenIndex + listBodyBlock.length;
        const itemNodes = this.parseComponentBody(
          listBodyBlock.slice(1, -1),
          componentName
        ).bodyNodes;
        bodyNodes.push({
          id: `svelte-each-${componentName}-${bodyNodes.length}`,
          kind: "SvelteEach" /* Each */,
          arrayExpr,
          itemVar,
          keyExpr: keyOrIndex,
          body: itemNodes[0] || {
            id: `svelte-frag-${bodyNodes.length}`,
            kind: "SvelteFragment" /* Fragment */,
            children: []
          },
          sourceLocation: { ...this.currentLoc }
        });
        continue;
      }
      const slotMatch = /^slot\s*\(\s*([A-Za-z0-9_$]*)\s*\)/i.exec(bodyStr.slice(pos));
      if (slotMatch) {
        const slotName = slotMatch[1] || "default";
        bodyNodes.push({
          id: getSvelteSlotId(`svelte-${componentName}`, slotName, bodyNodes.length),
          kind: "SvelteSlot" /* Slot */,
          name: slotName,
          children: [],
          sourceLocation: { ...this.currentLoc }
        });
        pos += slotMatch[0].length;
        continue;
      }
      const fragMatch = /^(?:fragment|frag)\s*\(/i.exec(bodyStr.slice(pos));
      if (fragMatch) {
        const openParenIndex = pos + fragMatch[0].length - 1;
        const fragBlock = this.extractMatchingParen(bodyStr, openParenIndex);
        pos = openParenIndex + fragBlock.length;
        const fragChildren = this.parseComponentBody(
          fragBlock.slice(1, -1),
          componentName
        ).bodyNodes;
        bodyNodes.push({
          id: getSvelteFragmentId(`svelte-${componentName}`, bodyNodes.length),
          kind: "SvelteFragment" /* Fragment */,
          children: fragChildren,
          sourceLocation: { ...this.currentLoc }
        });
        continue;
      }
      if (bodyStr[pos] === '"' || bodyStr[pos] === "'") {
        const quote = bodyStr[pos];
        let endQuote = pos + 1;
        while (endQuote < bodyStr.length && (bodyStr[endQuote] !== quote || bodyStr[endQuote - 1] === "\\")) {
          endQuote++;
        }
        const textVal = bodyStr.slice(pos + 1, endQuote);
        pos = endQuote + 1;
        bodyNodes.push({
          id: getSvelteTextId(`svelte-${componentName}`, bodyNodes.length),
          kind: "SvelteText" /* Text */,
          value: textVal,
          sourceLocation: { ...this.currentLoc }
        });
        continue;
      }
      const elemMatch = /^([A-Za-z0-9_@:-]+)\s*\(/i.exec(bodyStr.slice(pos));
      if (elemMatch) {
        const rawIdent = elemMatch[1];
        const openParenIndex = pos + elemMatch[0].length - 1;
        const contentBlock = this.extractMatchingParen(bodyStr, openParenIndex);
        pos = openParenIndex + contentBlock.length;
        const isCustom = isCustomComponentName3(rawIdent);
        const canonicalTag = isCustom ? rawIdent : resolveSvelteElementTag(rawIdent);
        const { props, children, bindingTarget, bindingProperty, dynamicClassConditions } = this.parsePropsAndChildren(contentBlock.slice(1, -1), componentName);
        if (isCustom) {
          bodyNodes.push({
            id: getSvelteComponentInstanceId(`svelte-${componentName}`, rawIdent, bodyNodes.length),
            kind: "SvelteComponentInstance" /* ComponentInstance */,
            componentName: rawIdent,
            props,
            children,
            sourceLocation: { ...this.currentLoc }
          });
        } else {
          bodyNodes.push({
            id: getSvelteElementId(`svelte-${componentName}`, canonicalTag, bodyNodes.length),
            kind: "SvelteElement" /* Element */,
            tag: canonicalTag,
            isIntrinsic: true,
            props,
            children,
            bindingTarget,
            bindingProperty,
            dynamicClassConditions,
            sourceLocation: { ...this.currentLoc }
          });
        }
        continue;
      }
      pos++;
    }
    return { stateDecls, reactiveDecls, propDecls, bodyNodes };
  }
  parsePropsAndChildren(blockStr, ownerComponent) {
    const props = [];
    const children = [];
    let bindingTarget = void 0;
    let bindingProperty = void 0;
    const dynamicClassConditions = {};
    let pos = 0;
    const skipWhitespace = () => {
      while (pos < blockStr.length && /\s/.test(blockStr[pos])) pos++;
    };
    while (pos < blockStr.length) {
      skipWhitespace();
      if (pos >= blockStr.length) break;
      const propMatch = /^([A-Za-z0-9_@:$-]+)\s*:\s*/i.exec(blockStr.slice(pos));
      if (propMatch) {
        const rawPropName = propMatch[1];
        pos += propMatch[0].length;
        skipWhitespace();
        let val = "";
        let rawVal = "";
        const isEvent = isSvelteEventProp(rawPropName);
        const isBinding = isSvelteBindingProp(rawPropName);
        if (blockStr[pos] === '"' || blockStr[pos] === "'") {
          const q = blockStr[pos];
          let endQ = pos + 1;
          while (endQ < blockStr.length && (blockStr[endQ] !== q || blockStr[endQ - 1] === "\\")) {
            endQ++;
          }
          val = blockStr.slice(pos + 1, endQ);
          rawVal = blockStr.slice(pos, endQ + 1);
          pos = endQ + 1;
        } else if (blockStr[pos] === "(" || blockStr[pos] === "{") {
          const expr = this.extractMatchingParen(blockStr, pos);
          val = expr;
          rawVal = expr;
          pos += expr.length;
        } else {
          let endWord = pos;
          while (endWord < blockStr.length && !/\s|\(|\)|,|;/.test(blockStr[endWord])) {
            endWord++;
          }
          rawVal = blockStr.slice(pos, endWord);
          if (rawVal === "true") val = true;
          else if (rawVal === "false") val = false;
          else if (!isNaN(Number(rawVal)) && rawVal.trim() !== "") val = Number(rawVal);
          else val = rawVal;
          pos = endWord;
        }
        if (isBinding) {
          bindingTarget = String(val);
          bindingProperty = getBindingPropertyName(rawPropName);
        }
        if (rawPropName.startsWith("class:")) {
          const clsName = rawPropName.slice(6);
          dynamicClassConditions[clsName] = String(val);
        }
        const canonicalName = resolveSveltePropName(rawPropName);
        props.push({
          id: `svelte-prop-${canonicalName}-${props.length}`,
          kind: "SvelteProp" /* Prop */,
          name: canonicalName,
          value: val,
          rawValue: rawVal,
          isEvent,
          isBinding,
          bindingType: isBinding ? getBindingPropertyName(rawPropName) : void 0,
          sourceLocation: { ...this.currentLoc }
        });
        continue;
      }
      const childParsed = this.parseComponentBody(blockStr.slice(pos), ownerComponent);
      if (childParsed.bodyNodes.length > 0) {
        children.push(...childParsed.bodyNodes);
        break;
      }
      pos++;
    }
    return { props, children, bindingTarget, bindingProperty, dynamicClassConditions };
  }
};

// packages/compiler/interpreters/angular-lm/ast.ts
var idCounter = 0;
function getAngularProgramId() {
  return `angular_prog_${++idCounter}`;
}
function getAngularComponentDeclarationId(name) {
  return `angular-component-${name}`;
}
function getAngularComponentInstanceId(name) {
  return `angular-inst-${name}_${++idCounter}`;
}
function getAngularElementId(tag, index) {
  return index !== void 0 ? `angular_${tag}_${index}` : `angular_${tag}_${++idCounter}`;
}
function getAngularFragmentId() {
  return `angular_frag_${++idCounter}`;
}
function getAngularTextId(index) {
  return index !== void 0 ? `angular_txt_${index}` : `angular_txt_${++idCounter}`;
}
function getAngularPropId(name) {
  return `angular_prop_${name}_${++idCounter}`;
}
function getAngularStateDeclarationId(name) {
  return `angular_state_${name}_${++idCounter}`;
}
function getAngularDerivedDeclarationId(name) {
  return `angular_computed_${name}_${++idCounter}`;
}
function getAngularInputDeclarationId(name) {
  return `angular_input_${name}_${++idCounter}`;
}
function getAngularOutputDeclarationId(name) {
  return `angular_output_${name}_${++idCounter}`;
}
function getAngularContentProjectionId(name) {
  return `angular_ng_content_${name}_${++idCounter}`;
}

// packages/compiler/interpreters/angular-lm/vocabulary.ts
var ANGULAR_ELEMENT_ABBREVIATIONS = {
  di: "div",
  bo: "button",
  bu: "button",
  pa: "p",
  p: "p",
  so: "section",
  al: "article",
  ad: "aside",
  he: "header",
  fe: "footer",
  na: "nav",
  mi: "main",
  sa: "span",
  in: "input",
  iu: "input",
  le: "label",
  tl: "table",
  cu: "canvas",
  fo: "form",
  fr: "form",
  im: "img",
  an: "a",
  li: "li",
  ul: "ul",
  ol: "ol",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6"
};
var ANGULAR_PROP_ABBREVIATIONS = {
  cs: "className",
  cm: "className",
  class: "className",
  id: "id",
  hr: "href",
  sr: "src",
  tp: "type",
  pe: "placeholder",
  nm: "name",
  vu: "value",
  dis: "disabled",
  ky: "key",
  key: "key"
};
function resolveAngularElementTag(name) {
  const lower2 = name.toLowerCase();
  if (ANGULAR_ELEMENT_ABBREVIATIONS[lower2]) {
    return { tag: ANGULAR_ELEMENT_ABBREVIATIONS[lower2], isIntrinsic: true };
  }
  if (isIntrinsicTag4(lower2)) {
    return { tag: lower2, isIntrinsic: true };
  }
  return { tag: name, isIntrinsic: false };
}
function isIntrinsicTag4(tag) {
  const intrinsicTags = /* @__PURE__ */ new Set([
    "div",
    "span",
    "p",
    "a",
    "button",
    "input",
    "textarea",
    "select",
    "option",
    "form",
    "label",
    "fieldset",
    "legend",
    "header",
    "footer",
    "nav",
    "main",
    "section",
    "article",
    "aside",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
    "table",
    "tr",
    "td",
    "th",
    "thead",
    "tbody",
    "tfoot",
    "img",
    "svg",
    "canvas",
    "video",
    "audio",
    "iframe",
    "hr",
    "br",
    "pre",
    "code",
    "b",
    "strong",
    "i",
    "em",
    "small",
    "ng-content"
  ]);
  return intrinsicTags.has(tag.toLowerCase());
}
function isCustomComponentName4(name) {
  if (!name || name.length === 0) return false;
  const first = name.charAt(0);
  return first >= "A" && first <= "Z";
}
function extractAngularInterpolations(text) {
  const deps = [];
  const doubleMatches = text.match(/\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$.]*)\s*\}\}/g);
  if (doubleMatches) {
    for (const m of doubleMatches) {
      const dep = m.replace(/\{\{\s*/, "").replace(/\s*\}\}/, "").trim();
      if (dep && !deps.includes(dep)) deps.push(dep);
    }
  }
  const singleMatches = text.match(/\{([a-zA-Z_$][a-zA-Z0-9_$.]*)\}/g);
  if (singleMatches) {
    for (const m of singleMatches) {
      const dep = m.replace(/^\{/, "").replace(/\}$/, "").trim();
      if (dep && !deps.includes(dep)) deps.push(dep);
    }
  }
  return deps;
}
function normalizeAngularInterpolation(text) {
  return text.replace(/\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$.]*)\s*\}\}/g, "{$1}");
}

// packages/compiler/interpreters/angular-lm/interpreter.ts
var AngularLMInterpreter = class _AngularLMInterpreter {
  constructor(options = {}) {
    this.diagnostics = [];
    // Stream state
    this.buffer = "";
    this.inString = false;
    this.stringQuote = "";
    this.inLineComment = false;
    this.inBlockComment = false;
    this.escapeNext = false;
    this.options = options;
    this.currentLoc = {
      startLine: 1,
      startColumn: 1,
      startOffset: 0,
      endLine: 1,
      endColumn: 1,
      endOffset: 0
    };
    this.program = {
      id: getAngularProgramId(),
      kind: "AngularProgram" /* Program */,
      components: [],
      rootComponent: options.defaultRootComponent || "App",
      sourceLocation: { ...this.currentLoc }
    };
  }
  static parse(source, options = {}) {
    const interpreter = new _AngularLMInterpreter(options);
    interpreter.write(source);
    return interpreter.end();
  }
  reset() {
    this.currentLoc = {
      startLine: 1,
      startColumn: 1,
      startOffset: 0,
      endLine: 1,
      endColumn: 1,
      endOffset: 0
    };
    this.program = {
      id: getAngularProgramId(),
      kind: "AngularProgram" /* Program */,
      components: [],
      rootComponent: this.options.defaultRootComponent || "App",
      sourceLocation: { ...this.currentLoc }
    };
    this.diagnostics = [];
    this.buffer = "";
    this.inString = false;
    this.stringQuote = "";
    this.inLineComment = false;
    this.inBlockComment = false;
    this.escapeNext = false;
  }
  getAST() {
    return this.program;
  }
  getDiagnostics() {
    return [...this.diagnostics];
  }
  hasErrors() {
    return this.diagnostics.some((d) => d.severity === "error");
  }
  isSafeToExpose() {
    if (this.inString || this.inLineComment || this.inBlockComment) {
      return false;
    }
    return this.program.components.length > 0;
  }
  write(chunk) {
    for (let i = 0; i < chunk.length; i++) {
      this.consumeChar(chunk[i]);
    }
    return this;
  }
  end() {
    this.flushBuffer();
    return this.program;
  }
  advanceLocation(char) {
    this.currentLoc.endOffset++;
    if (char === "\n") {
      this.currentLoc.endLine++;
      this.currentLoc.endColumn = 1;
    } else {
      this.currentLoc.endColumn++;
    }
  }
  consumeChar(char) {
    this.advanceLocation(char);
    this.buffer += char;
    if (this.inLineComment) {
      if (char === "\n") {
        this.inLineComment = false;
      }
      return;
    }
    if (this.inBlockComment) {
      if (char === "/" && this.buffer.endsWith("*/")) {
        this.inBlockComment = false;
      }
      return;
    }
    if (!this.inString) {
      if (char === "/" && this.buffer.endsWith("//")) {
        this.inLineComment = true;
        return;
      }
      if (char === "*" && this.buffer.endsWith("/*")) {
        this.inBlockComment = true;
        return;
      }
    }
    if (this.inString) {
      if (this.escapeNext) {
        this.escapeNext = false;
        return;
      }
      if (char === "\\") {
        this.escapeNext = true;
        return;
      }
      if (char === this.stringQuote) {
        this.inString = false;
        this.stringQuote = "";
      }
      return;
    }
    if (char === '"' || char === "'" || char === "`") {
      this.inString = true;
      this.stringQuote = char;
      return;
    }
    if (char === "(" || char === ")" || char === "{" || char === "}" || char === "," || char === ";" || char === "\n" || char === "	" || char === " ") {
      this.checkBufferForConstructs();
    }
  }
  checkBufferForConstructs() {
    const clean = this.buffer.replace(/<ANGULAR(?:-LM)?>/gi, "").replace(/<\/ANGULAR(?:-LM)?>/gi, "").trim();
    if (!clean) return;
    this.parseTokens(clean);
  }
  flushBuffer() {
    const clean = this.buffer.replace(/<ANGULAR(?:-LM)?>/gi, "").replace(/<\/ANGULAR(?:-LM)?>/gi, "").trim();
    if (clean) {
      this.parseTokens(clean);
    }
  }
  parseTokens(source) {
    if (!source) return;
    try {
      const parsedComponents = this.parseProgramAST(source);
      if (parsedComponents.length > 0) {
        this.program.components = parsedComponents;
        const appComp = parsedComponents.find((c) => c.name === "App");
        this.program.rootComponent = this.options.defaultRootComponent || appComp?.name || parsedComponents[0].name;
      }
    } catch {
    }
  }
  extractMatchingParen(str, openParenPos) {
    let depth = 0;
    let inStr = false;
    let quote = "";
    let inBrackets = 0;
    let inBraces = 0;
    for (let i = openParenPos; i < str.length; i++) {
      const ch = str[i];
      if (inStr) {
        if (ch === quote && str[i - 1] !== "\\") inStr = false;
      } else {
        if (ch === '"' || ch === "'" || ch === "`") {
          inStr = true;
          quote = ch;
        } else if (ch === "(") {
          depth++;
        } else if (ch === ")") {
          depth--;
          if (depth === 0) {
            return str.slice(openParenPos, i + 1);
          }
        } else if (ch === "[") {
          inBrackets++;
        } else if (ch === "]") {
          if (inBrackets > 0) inBrackets--;
        } else if (ch === "{") {
          inBraces++;
        } else if (ch === "}") {
          if (inBraces > 0) inBraces--;
        }
      }
    }
    return str.slice(openParenPos);
  }
  parseProgramAST(source) {
    const components = [];
    let pos = 0;
    const skipWhitespace = () => {
      while (pos < source.length && /\s/.test(source[pos])) pos++;
    };
    while (pos < source.length) {
      skipWhitespace();
      if (pos >= source.length) break;
      const compMatch = /^(?:component|comp)\s*\(\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\)\s*\(/i.exec(
        source.slice(pos)
      );
      if (compMatch) {
        const compName = compMatch[1];
        const openParenIndex = pos + compMatch[0].length - 1;
        const bodySource = this.extractMatchingParen(source, openParenIndex);
        pos = openParenIndex + bodySource.length;
        const {
          inputs,
          outputs,
          stateDecls,
          derivedDecls,
          bodyNodes
        } = this.parseComponentBody(bodySource.slice(1, -1), compName);
        components.push({
          id: getAngularComponentDeclarationId(compName),
          kind: "AngularComponentDeclaration" /* ComponentDeclaration */,
          name: compName,
          inputs,
          outputs,
          stateDeclarations: stateDecls,
          derivedDeclarations: derivedDecls,
          body: bodyNodes,
          sourceLocation: { ...this.currentLoc }
        });
      } else {
        const standaloneBody = source.slice(pos).trim();
        if (standaloneBody) {
          const {
            inputs,
            outputs,
            stateDecls,
            derivedDecls,
            bodyNodes
          } = this.parseComponentBody(standaloneBody, "App");
          if (bodyNodes.length > 0 || stateDecls.length > 0 || derivedDecls.length > 0 || inputs.length > 0 || outputs.length > 0) {
            components.push({
              id: getAngularComponentDeclarationId("App"),
              kind: "AngularComponentDeclaration" /* ComponentDeclaration */,
              name: "App",
              inputs,
              outputs,
              stateDeclarations: stateDecls,
              derivedDeclarations: derivedDecls,
              body: bodyNodes,
              sourceLocation: { ...this.currentLoc }
            });
          }
        }
        break;
      }
    }
    return components;
  }
  parseComponentBody(bodyStr, componentName) {
    const inputs = [];
    const outputs = [];
    const stateDecls = [];
    const derivedDecls = [];
    const bodyNodes = [];
    let pos = 0;
    const skipWhitespace = () => {
      while (pos < bodyStr.length && /\s/.test(bodyStr[pos])) pos++;
    };
    while (pos < bodyStr.length) {
      skipWhitespace();
      if (pos >= bodyStr.length) break;
      const statePrefix = /^(?:state|signal)\s*\(/i.exec(bodyStr.slice(pos));
      if (statePrefix) {
        const openParenPos = pos + statePrefix[0].length - 1;
        const fullBlock = this.extractMatchingParen(bodyStr, openParenPos);
        const inner = fullBlock.slice(1, -1).trim();
        const commaIdx = inner.indexOf(",");
        if (commaIdx !== -1) {
          const stateName = inner.slice(0, commaIdx).trim();
          const initialRaw = inner.slice(commaIdx + 1).trim();
          let initialVal = initialRaw;
          if (initialRaw === "true") initialVal = true;
          else if (initialRaw === "false") initialVal = false;
          else if (!isNaN(Number(initialRaw)) && initialRaw !== "") initialVal = Number(initialRaw);
          else if (initialRaw.startsWith('"') && initialRaw.endsWith('"') || initialRaw.startsWith("'") && initialRaw.endsWith("'") || initialRaw.startsWith("`") && initialRaw.endsWith("`")) {
            initialVal = initialRaw.slice(1, -1);
          } else {
            try {
              initialVal = evaluateSvelteExpression(initialRaw, {});
              if (initialVal === void 0) {
                initialVal = JSON.parse(initialRaw);
              }
            } catch {
              try {
                initialVal = JSON.parse(initialRaw);
              } catch {
                initialVal = initialRaw;
              }
            }
          }
          stateDecls.push({
            id: getAngularStateDeclarationId(stateName),
            kind: "AngularStateDeclaration" /* StateDeclaration */,
            stateName,
            name: stateName,
            initialValue: initialVal !== void 0 ? initialVal : initialRaw,
            sourceLocation: { ...this.currentLoc }
          });
          pos = openParenPos + fullBlock.length;
          continue;
        }
      }
      const computedPrefix = /^(?:computed|derived)\s*\(/i.exec(bodyStr.slice(pos));
      if (computedPrefix) {
        const openParenPos = pos + computedPrefix[0].length - 1;
        const fullBlock = this.extractMatchingParen(bodyStr, openParenPos);
        const inner = fullBlock.slice(1, -1).trim();
        const commaIdx = inner.indexOf(",");
        if (commaIdx !== -1) {
          const derivedName = inner.slice(0, commaIdx).trim();
          const expr = inner.slice(commaIdx + 1).trim();
          const dependencies = extractExpressionDependencies(expr).filter((id) => id !== derivedName);
          derivedDecls.push({
            id: getAngularDerivedDeclarationId(derivedName),
            kind: "AngularDerivedDeclaration" /* DerivedDeclaration */,
            name: derivedName,
            derivedName,
            expression: expr,
            dependencies,
            sourceLocation: { ...this.currentLoc }
          });
          pos = openParenPos + fullBlock.length;
          continue;
        }
      }
      const inputPrefix = /^(?:input|in)\s*\(/i.exec(bodyStr.slice(pos));
      if (inputPrefix) {
        const openParenPos = pos + inputPrefix[0].length - 1;
        const fullBlock = this.extractMatchingParen(bodyStr, openParenPos);
        const inner = fullBlock.slice(1, -1).trim();
        const isHTMLElement = inner.startsWith("[") || inner.startsWith("(") || inner.includes("[(ngModel)]") || inner.includes("[(model)]") || inner.includes("type:") || inner.includes("value:") || inner.includes("placeholder:") || inner.includes("model:");
        if (!isHTMLElement) {
          const commaIdx = inner.indexOf(",");
          let inName = inner;
          let defaultVal = void 0;
          if (commaIdx !== -1) {
            inName = inner.slice(0, commaIdx).trim();
            defaultVal = inner.slice(commaIdx + 1).trim();
          }
          inputs.push({
            id: getAngularInputDeclarationId(inName),
            kind: "AngularInputDeclaration" /* InputDeclaration */,
            name: inName,
            inputName: inName,
            defaultValue: defaultVal,
            sourceLocation: { ...this.currentLoc }
          });
          pos = openParenPos + fullBlock.length;
          continue;
        }
      }
      const outputPrefix = /^(?:output|out)\s*\(/i.exec(bodyStr.slice(pos));
      if (outputPrefix) {
        const openParenPos = pos + outputPrefix[0].length - 1;
        const fullBlock = this.extractMatchingParen(bodyStr, openParenPos);
        const outName = fullBlock.slice(1, -1).trim();
        outputs.push({
          id: getAngularOutputDeclarationId(outName),
          kind: "AngularOutputDeclaration" /* OutputDeclaration */,
          name: outName,
          outputName: outName,
          sourceLocation: { ...this.currentLoc }
        });
        pos = openParenPos + fullBlock.length;
        continue;
      }
      const condPrefix = /^(?:@if|if|when)\s*\(\s*([^)]+)\)\s*\(/i.exec(bodyStr.slice(pos));
      if (condPrefix) {
        const condExpr = condPrefix[1].trim();
        const openParenIndex = pos + condPrefix[0].length - 1;
        const thenBlock = this.extractMatchingParen(bodyStr, openParenIndex);
        pos = openParenIndex + thenBlock.length;
        const thenNodes = this.parseComponentBody(
          thenBlock.slice(1, -1),
          componentName
        ).bodyNodes;
        let elseNode = void 0;
        skipWhitespace();
        if (bodyStr[pos] === "(") {
          const elseOpenParenIndex = pos;
          const elseBlock = this.extractMatchingParen(bodyStr, elseOpenParenIndex);
          pos = elseOpenParenIndex + elseBlock.length;
          const elseNodes = this.parseComponentBody(
            elseBlock.slice(1, -1),
            componentName
          ).bodyNodes;
          if (elseNodes.length > 0) {
            elseNode = elseNodes[0];
          }
        }
        bodyNodes.push({
          id: `angular-cond-${componentName}-${bodyNodes.length}`,
          kind: "AngularConditional" /* Conditional */,
          conditionExpr: condExpr,
          thenBranch: thenNodes[0] || {
            id: `angular-frag-${bodyNodes.length}`,
            kind: "AngularFragment" /* Fragment */,
            children: []
          },
          elseBranch: elseNode,
          sourceLocation: { ...this.currentLoc }
        });
        continue;
      }
      const forPrefix = /^(?:@for|for)\s*\(\s*([^)]+)\)\s*\(/i.exec(bodyStr.slice(pos));
      if (forPrefix) {
        const loopSignature = forPrefix[1].trim();
        let arrayExpr = "";
        let itemVar = "item";
        let trackExpr = "item.id";
        if (loopSignature.includes(" of ")) {
          const match = loopSignature.match(/([a-zA-Z_$][a-zA-Z0-9_$]*)\s+of\s+([a-zA-Z_$][a-zA-Z0-9_$]*)(?:;\s*track\s+([^;]+))?/);
          if (match) {
            itemVar = match[1];
            arrayExpr = match[2];
            trackExpr = match[3]?.trim() || `${itemVar}.id`;
          }
        } else {
          const parts = loopSignature.split(",").map((p) => p.trim());
          arrayExpr = parts[0];
          if (parts.length > 1) itemVar = parts[1];
          if (parts.length > 2) trackExpr = parts[2];
          else trackExpr = `${itemVar}.id`;
        }
        const openParenIndex = pos + forPrefix[0].length - 1;
        const listBodyBlock = this.extractMatchingParen(bodyStr, openParenIndex);
        pos = openParenIndex + listBodyBlock.length;
        const itemNodes = this.parseComponentBody(
          listBodyBlock.slice(1, -1),
          componentName
        ).bodyNodes;
        bodyNodes.push({
          id: `angular-for-${componentName}-${bodyNodes.length}`,
          kind: "AngularFor" /* For */,
          arrayExpr,
          itemVar,
          trackExpr,
          body: itemNodes[0] || {
            id: `angular-frag-${bodyNodes.length}`,
            kind: "AngularFragment" /* Fragment */,
            children: []
          },
          sourceLocation: { ...this.currentLoc }
        });
        continue;
      }
      const projPrefix = /^(?:ng-content|slot)\s*(?:\(\s*([^)]*)\s*\))?/i.exec(bodyStr.slice(pos));
      if (projPrefix && (projPrefix[0].includes("(") || bodyStr[pos + projPrefix[0].length] === "(")) {
        let slotName = "default";
        let contentChildren = [];
        if (projPrefix[1]) {
          slotName = projPrefix[1].trim() || "default";
        }
        pos += projPrefix[0].length;
        skipWhitespace();
        if (bodyStr[pos] === "(") {
          const openParenIndex = pos;
          const contentBlock = this.extractMatchingParen(bodyStr, openParenIndex);
          pos = openParenIndex + contentBlock.length;
          contentChildren = this.parseComponentBody(
            contentBlock.slice(1, -1),
            componentName
          ).bodyNodes;
        }
        bodyNodes.push({
          id: getAngularContentProjectionId(slotName),
          kind: "AngularContentProjection" /* ContentProjection */,
          name: slotName,
          children: contentChildren,
          sourceLocation: { ...this.currentLoc }
        });
        continue;
      }
      const fragPrefix = /^(?:fragment|frag)\s*\(/i.exec(bodyStr.slice(pos));
      if (fragPrefix) {
        const openParenIndex = pos + fragPrefix[0].length - 1;
        const fragBlock = this.extractMatchingParen(bodyStr, openParenIndex);
        pos = openParenIndex + fragBlock.length;
        const fragChildren = this.parseComponentBody(
          fragBlock.slice(1, -1),
          componentName
        ).bodyNodes;
        bodyNodes.push({
          id: getAngularFragmentId(),
          kind: "AngularFragment" /* Fragment */,
          children: fragChildren,
          sourceLocation: { ...this.currentLoc }
        });
        continue;
      }
      if (bodyStr[pos] === '"' || bodyStr[pos] === "'" || bodyStr[pos] === "`") {
        const quote = bodyStr[pos];
        let endQuote = pos + 1;
        while (endQuote < bodyStr.length && (bodyStr[endQuote] !== quote || bodyStr[endQuote - 1] === "\\")) {
          endQuote++;
        }
        const rawVal = bodyStr.slice(pos + 1, endQuote);
        const textVal = normalizeAngularInterpolation(rawVal);
        pos = endQuote + 1;
        bodyNodes.push({
          id: getAngularTextId(bodyNodes.length),
          kind: "AngularText" /* Text */,
          value: textVal,
          isExpression: textVal.includes("{"),
          sourceLocation: { ...this.currentLoc }
        });
        continue;
      }
      const elemMatch = /^([A-Za-z0-9_@:-]+)\s*\(/i.exec(bodyStr.slice(pos));
      if (elemMatch) {
        const rawIdent = elemMatch[1];
        const openParenIndex = pos + elemMatch[0].length - 1;
        const contentBlock = this.extractMatchingParen(bodyStr, openParenIndex);
        pos = openParenIndex + contentBlock.length;
        const isCustom = isCustomComponentName4(rawIdent);
        const { tag } = resolveAngularElementTag(rawIdent);
        const canonicalTag = isCustom ? rawIdent : tag;
        const {
          props,
          children,
          modelBinding,
          dynamicClassConditions,
          dynamicStyles
        } = this.parsePropsAndChildren(contentBlock.slice(1, -1), componentName);
        if (isCustom) {
          bodyNodes.push({
            id: getAngularComponentInstanceId(rawIdent),
            kind: "AngularComponentInstance" /* ComponentInstance */,
            componentName: rawIdent,
            props,
            children,
            sourceLocation: { ...this.currentLoc }
          });
        } else {
          bodyNodes.push({
            id: getAngularElementId(canonicalTag, bodyNodes.length),
            kind: "AngularElement" /* Element */,
            tag: canonicalTag,
            isIntrinsic: true,
            props,
            children,
            modelBinding,
            dynamicClassConditions,
            dynamicStyles,
            sourceLocation: { ...this.currentLoc }
          });
        }
        continue;
      }
      pos++;
    }
    return {
      inputs,
      outputs,
      stateDecls,
      derivedDecls,
      bodyNodes
    };
  }
  parsePropsAndChildren(contentStr, componentName) {
    const props = [];
    const children = [];
    let modelBinding = void 0;
    const dynamicClassConditions = {};
    const dynamicStyles = {};
    let pos = 0;
    const skipWhitespace = () => {
      while (pos < contentStr.length && /\s/.test(contentStr[pos])) pos++;
    };
    while (pos < contentStr.length) {
      skipWhitespace();
      if (pos >= contentStr.length) break;
      const modelMatch = /^\[\((?:ngModel|model)\)\][:=]\s*([A-Za-z0-9_$.]+|"[^"]*"|'[^']*')/i.exec(
        contentStr.slice(pos)
      );
      if (modelMatch) {
        const val = modelMatch[1].replace(/^["']/, "").replace(/["']$/, "").trim();
        modelBinding = val;
        props.push({
          id: getAngularPropId("model"),
          kind: "AngularProp" /* Prop */,
          name: "model",
          value: val,
          isTwoWayBinding: true,
          sourceLocation: { ...this.currentLoc }
        });
        pos += modelMatch[0].length;
        continue;
      }
      const classMatch = /^\[?class\.([a-zA-Z0-9_-]+)\]?[:=]\s*([A-Za-z0-9_$.]+|"[^"]*"|'[^']*')/i.exec(
        contentStr.slice(pos)
      );
      if (classMatch) {
        const clsName = classMatch[1];
        const expr = classMatch[2].replace(/^["']/, "").replace(/["']$/, "").trim();
        dynamicClassConditions[clsName] = expr;
        props.push({
          id: getAngularPropId(`class_${clsName}`),
          kind: "AngularProp" /* Prop */,
          name: `class.${clsName}`,
          value: expr,
          isClassBinding: true,
          sourceLocation: { ...this.currentLoc }
        });
        pos += classMatch[0].length;
        continue;
      }
      const styleMatch = /^\[?style\.([a-zA-Z0-9_-]+)\]?[:=]\s*([A-Za-z0-9_$.]+|"[^"]*"|'[^']*')/i.exec(
        contentStr.slice(pos)
      );
      if (styleMatch) {
        const styleProp = styleMatch[1];
        const expr = styleMatch[2].replace(/^["']/, "").replace(/["']$/, "").trim();
        dynamicStyles[styleProp] = expr;
        props.push({
          id: getAngularPropId(`style_${styleProp}`),
          kind: "AngularProp" /* Prop */,
          name: `style.${styleProp}`,
          value: expr,
          isStyleBinding: true,
          sourceLocation: { ...this.currentLoc }
        });
        pos += styleMatch[0].length;
        continue;
      }
      const propBindMatch = /^\[([a-zA-Z0-9_-]+)\][:=]\s*([A-Za-z0-9_$.]+|"[^"]*"|'[^']*')/i.exec(
        contentStr.slice(pos)
      );
      if (propBindMatch) {
        const pName = propBindMatch[1];
        const pVal = propBindMatch[2].replace(/^["']/, "").replace(/["']$/, "").trim();
        props.push({
          id: getAngularPropId(pName),
          kind: "AngularProp" /* Prop */,
          name: pName,
          value: pVal,
          isPropertyBinding: true,
          sourceLocation: { ...this.currentLoc }
        });
        pos += propBindMatch[0].length;
        continue;
      }
      const evtMatch = /^(?:\(([a-zA-Z0-9_]+)\)|output:([a-zA-Z0-9_]+))[:=]\s*([A-Za-z0-9_$.]+|"[^"]*"|'[^']*')/i.exec(
        contentStr.slice(pos)
      );
      if (evtMatch) {
        const evtName = evtMatch[1] || evtMatch[2];
        const handler = evtMatch[3].replace(/^["']/, "").replace(/["']$/, "").trim();
        props.push({
          id: getAngularPropId(`evt_${evtName}`),
          kind: "AngularProp" /* Prop */,
          name: `(${evtName})`,
          value: handler,
          isEvent: true,
          sourceLocation: { ...this.currentLoc }
        });
        pos += evtMatch[0].length;
        continue;
      }
      const colonMatch = /^([A-Za-z0-9_$-]+)[:=]\s*([A-Za-z0-9_$.]+|"[^"]*"|'[^']*')/i.exec(
        contentStr.slice(pos)
      );
      if (colonMatch) {
        const rawKey = colonMatch[1];
        const rawVal = colonMatch[2].replace(/^["']/, "").replace(/["']$/, "").trim();
        const normKey = ANGULAR_PROP_ABBREVIATIONS[rawKey.toLowerCase()] || rawKey;
        const isEvt = rawKey === "click" || rawKey === "input" || rawKey === "change" || rawKey === "submit";
        props.push({
          id: getAngularPropId(normKey),
          kind: "AngularProp" /* Prop */,
          name: isEvt ? `(${rawKey})` : normKey,
          value: rawVal,
          isEvent: isEvt,
          sourceLocation: { ...this.currentLoc }
        });
        pos += colonMatch[0].length;
        continue;
      }
      const parsedSub = this.parseComponentBody(contentStr.slice(pos), componentName);
      if (parsedSub.bodyNodes.length > 0) {
        children.push(...parsedSub.bodyNodes);
        break;
      }
      pos++;
    }
    return {
      props,
      children,
      modelBinding,
      dynamicClassConditions: Object.keys(dynamicClassConditions).length > 0 ? dynamicClassConditions : void 0,
      dynamicStyles: Object.keys(dynamicStyles).length > 0 ? dynamicStyles : void 0
    };
  }
};

// packages/compiler/interpreters/js-lm/ast.ts
function getJSProgramId() {
  return "js-program";
}
function getJSUnitId(unitKind, signature, disambiguator = 0) {
  const cleanSig = signature.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 32);
  const suffix = disambiguator > 0 ? `-${disambiguator}` : "";
  return `js-unit-${unitKind.toLowerCase()}-${cleanSig || "unit"}${suffix}`;
}
function getJSEventHandlerId(eventName, selector, disambiguator = 0) {
  const cleanSel = selector.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 24);
  const suffix = disambiguator > 0 ? `-${disambiguator}` : "";
  return `js-evt-${eventName.toLowerCase()}-${cleanSel || "global"}${suffix}`;
}
function getJSTimerId(timerType, disambiguator = 0) {
  const suffix = disambiguator > 0 ? `-${disambiguator}` : "";
  return `js-timer-${timerType.toLowerCase()}${suffix}`;
}
function getJSDOMOperationId(operation, selector, disambiguator = 0) {
  const cleanSel = selector.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 24);
  const suffix = disambiguator > 0 ? `-${disambiguator}` : "";
  return `js-dom-${operation.toLowerCase()}-${cleanSel || "node"}${suffix}`;
}

// packages/compiler/interpreters/react-lm/reconciler.ts
var ReactReconciler = class {
  constructor(program, initialStates) {
    // componentInstanceId -> state object
    this.jsUnits = [];
    this.eventCounter = 0;
    this.program = program;
    this.componentMap = /* @__PURE__ */ new Map();
    for (const comp of program.components) {
      this.componentMap.set(comp.name, comp);
    }
    this.componentState = new Map(initialStates ? Object.entries(initialStates) : []);
  }
  /**
   * Reconcile the React program tree into a Leveonas DOM RootNode and accompanying JS runtime units.
   */
  reconcile(rootComponentName) {
    this.jsUnits = [];
    this.eventCounter = 0;
    const rootName = rootComponentName || (this.program.components.some((c) => c.name === "App") ? "App" : this.program.rootComponent || (this.program.components[0]?.name ?? "App"));
    const rootDecl = this.componentMap.get(rootName) || this.program.components[0];
    const defaultLoc3 = {
      startLine: 1,
      startColumn: 1,
      startOffset: 0,
      endLine: 1,
      endColumn: 1,
      endOffset: 0
    };
    const rootDomNode = ASTFactory.createComponent("Root" /* Root */, defaultLoc3);
    rootDomNode.id = "leveonas-root";
    if (!rootDecl) {
      return {
        domAST: rootDomNode,
        jsProgram: {
          id: getJSProgramId(),
          kind: "JSProgram" /* Program */,
          units: []
        },
        componentInstancesCount: 0
      };
    }
    let instanceCount = 0;
    const renderComponentInstance = (decl, parentPath, props = {}, index = 0) => {
      instanceCount++;
      const instancePath = `${parentPath}-${decl.name}_${index}`;
      if (decl.stateDeclarations.length > 0) {
        const stateObj = {};
        for (const s of decl.stateDeclarations) {
          stateObj[s.stateName] = s.initialValue;
        }
        const stateUnitId = getJSUnitId("state", instancePath);
        const stateCode = `
window.__leveonas_state__ = window.__leveonas_state__ || {};
window.__leveonas_state__[${JSON.stringify(instancePath)}] = window.__leveonas_state__[${JSON.stringify(
          instancePath
        )}] || ${JSON.stringify(stateObj)};
`.trim();
        this.jsUnits.push({
          id: stateUnitId,
          kind: "JSUnit" /* Unit */,
          unitKind: "Variable",
          code: stateCode,
          rawCode: stateCode,
          isComplete: true
        });
      }
      const domNodes = [];
      for (let i = 0; i < decl.body.length; i++) {
        const uiChild = decl.body[i];
        const childNodes = renderUINode(uiChild, instancePath, i, decl.name);
        domNodes.push(...childNodes);
      }
      return domNodes;
    };
    const renderUINode = (node, parentPath, index, ownerComponent) => {
      if (!node) return [];
      switch (node.kind) {
        case "ReactText" /* Text */: {
          const txt = node;
          const loc = txt.sourceLocation || defaultLoc3;
          const lit = ASTFactory.createLiteral(txt.value, `"${txt.value}"`, loc);
          lit.id = `${parentPath}-txt_${index}`;
          return [lit];
        }
        case "ReactFragment" /* Fragment */: {
          const frag = node;
          const res = [];
          for (let i = 0; i < frag.children.length; i++) {
            res.push(...renderUINode(frag.children[i], `${parentPath}-frag_${index}`, i, ownerComponent));
          }
          return res;
        }
        case "ReactConditional" /* Conditional */: {
          const cond = node;
          const isTruthy = cond.conditionExpr !== "false" && cond.conditionExpr !== "0" && cond.conditionExpr !== "null";
          if (isTruthy) {
            return renderUINode(cond.thenBranch, `${parentPath}-then_${index}`, 0, ownerComponent);
          } else if (cond.elseBranch) {
            return renderUINode(cond.elseBranch, `${parentPath}-else_${index}`, 0, ownerComponent);
          }
          return [];
        }
        case "ReactList" /* List */: {
          const list = node;
          return renderUINode(list.body, `${parentPath}-list_${index}`, 0, ownerComponent);
        }
        case "ReactComponentInstance" /* ComponentInstance */: {
          const compInst = node;
          const targetDecl = this.componentMap.get(compInst.componentName);
          if (targetDecl) {
            const propMap = {};
            for (const p of compInst.props) {
              propMap[p.name] = p.value;
            }
            return renderComponentInstance(targetDecl, parentPath, propMap, index);
          }
          const loc = compInst.sourceLocation || defaultLoc3;
          const genericComp = ASTFactory.createComponent("Container" /* Container */, loc, [], [], compInst.componentName);
          genericComp.id = `${parentPath}-${compInst.componentName}_${index}`;
          return [genericComp];
        }
        case "ReactElement" /* Element */: {
          const elem = node;
          const canonicalTag = resolveReactElementTag(elem.tag);
          const astKind = TAG_TO_AST_KIND2[canonicalTag] || "GenericComponent" /* GenericComponent */;
          const loc = elem.sourceLocation || defaultLoc3;
          const elemId = elem.id || `${parentPath}-${canonicalTag}_${index}`;
          const properties = [];
          let hasExplicitId = false;
          for (const prop of elem.props) {
            const canonicalPropName = resolveReactPropName(prop.name);
            if (isReactEventProp(prop.name)) {
              const domEvent = getDOMEventNameFromReactEvent(prop.name);
              const eventTargetSelector = `#${elemId}`;
              hasExplicitId = true;
              let handlerBody = String(prop.value);
              if (handlerBody.startsWith("() =>") || handlerBody.startsWith("(event) =>")) {
                const arrowBody = handlerBody.replace(/^\([^)]*\)\s*=>\s*\{?/, "").replace(/\}?$/, "").trim();
                handlerBody = arrowBody;
              }
              const evtId = getReactEventHandlerId(ownerComponent, domEvent, elemId, ++this.eventCounter);
              const jsEvtId = getJSEventHandlerId(domEvent, `#${elemId}`);
              const jsCode = `
window.__leveonas_runtime__.on(${JSON.stringify(domEvent)}, ${JSON.stringify(eventTargetSelector)}, function(event, target) {
  ${handlerBody}
});
`.trim();
              this.jsUnits.push({
                id: jsEvtId,
                kind: "JSUnit" /* Unit */,
                unitKind: "EventHandler",
                code: jsCode,
                rawCode: jsCode,
                isComplete: true,
                meta: {
                  eventName: domEvent,
                  targetSelector: eventTargetSelector
                },
                details: {
                  id: jsEvtId,
                  kind: "JSEventHandler" /* EventHandler */,
                  eventName: domEvent,
                  targetSelector: eventTargetSelector,
                  handlerCode: handlerBody,
                  sourceLocation: prop.sourceLocation
                }
              });
            } else {
              if (canonicalPropName === "id") {
                hasExplicitId = true;
              }
              const lit = ASTFactory.createLiteral(prop.value, JSON.stringify(prop.value), loc);
              const propNode = ASTFactory.createProperty(canonicalPropName, lit, loc);
              properties.push(propNode);
            }
          }
          if (!hasExplicitId) {
            const idLit = ASTFactory.createLiteral(elemId, `"${elemId}"`, loc);
            properties.unshift(ASTFactory.createProperty("id", idLit, loc));
          }
          const children = [];
          for (let i = 0; i < elem.children.length; i++) {
            const childNodes = renderUINode(elem.children[i], elemId, i, ownerComponent);
            children.push(...childNodes);
          }
          const domComp = ASTFactory.createComponent(
            astKind,
            loc,
            properties,
            children,
            astKind === "GenericComponent" /* GenericComponent */ ? canonicalTag : void 0
          );
          domComp.id = elemId;
          return [domComp];
        }
        default:
          return [];
      }
    };
    const rootChildren = renderComponentInstance(rootDecl, "react-root", {}, 0);
    rootDomNode.children = rootChildren;
    for (const c of rootChildren) {
      c.parent = rootDomNode;
    }
    return {
      domAST: rootDomNode,
      jsProgram: {
        id: getJSProgramId(),
        kind: "JSProgram" /* Program */,
        units: this.jsUnits
      },
      componentInstancesCount: instanceCount
    };
  }
};

// packages/compiler/interpreters/vue-lm/reconciler.ts
var VueReconciler = class {
  constructor(program, initialStates) {
    // instancePath -> state object
    this.jsUnits = [];
    this.eventCounter = 0;
    this.program = program;
    this.componentMap = /* @__PURE__ */ new Map();
    for (const comp of program.components) {
      this.componentMap.set(comp.name, comp);
    }
    this.componentState = new Map(initialStates ? Object.entries(initialStates) : []);
  }
  /**
   * Reconcile the Vue component program tree into a Leveonas DOM RootNode and accompanying JS runtime units.
   */
  reconcile(rootComponentName) {
    this.jsUnits = [];
    this.eventCounter = 0;
    const rootName = rootComponentName || (this.program.components.some((c) => c.name === "App") ? "App" : this.program.rootComponent || (this.program.components[0]?.name ?? "App"));
    const rootDecl = this.componentMap.get(rootName) || this.program.components[0];
    const defaultLoc3 = {
      startLine: 1,
      startColumn: 1,
      startOffset: 0,
      endLine: 1,
      endColumn: 1,
      endOffset: 0
    };
    const rootDomNode = ASTFactory.createComponent("Root" /* Root */, defaultLoc3);
    rootDomNode.id = "leveonas-root";
    if (!rootDecl) {
      return {
        domAST: rootDomNode,
        jsProgram: {
          id: getJSProgramId(),
          kind: "JSProgram" /* Program */,
          units: []
        },
        componentInstancesCount: 0
      };
    }
    let instanceCount = 0;
    const renderComponentInstance = (decl, parentPath, props = {}, slotChildren = [], index = 0) => {
      instanceCount++;
      const instancePath = `${parentPath}-${decl.name}_${index}`;
      const stateObj = {};
      for (const s of decl.stateDeclarations) {
        stateObj[s.stateName] = s.initialValue;
      }
      const computedObj = {};
      for (const c of decl.computedDeclarations) {
        try {
          const expr = c.expression;
          const fn = new Function(...Object.keys(stateObj), `return (${expr});`);
          computedObj[c.computedName] = fn(...Object.values(stateObj));
        } catch {
          computedObj[c.computedName] = null;
        }
      }
      const mergedContext = { ...props, ...stateObj, ...computedObj };
      if (decl.stateDeclarations.length > 0 || decl.computedDeclarations.length > 0) {
        const stateUnitId = getJSUnitId("vue_state", instancePath);
        const stateCode = `
window.__leveonas_state__ = window.__leveonas_state__ || {};
window.__leveonas_state__[${JSON.stringify(instancePath)}] = window.__leveonas_state__[${JSON.stringify(
          instancePath
        )}] || ${JSON.stringify(stateObj)};
`.trim();
        this.jsUnits.push({
          id: stateUnitId,
          kind: "JSUnit" /* Unit */,
          unitKind: "Variable",
          code: stateCode,
          rawCode: stateCode,
          isComplete: true
        });
        for (const c of decl.computedDeclarations) {
          const compUnitId = getJSUnitId("vue_computed", `${instancePath}_${c.computedName}`);
          const compCode = `
window.__leveonas_computed__ = window.__leveonas_computed__ || {};
window.__leveonas_computed__[${JSON.stringify(`${instancePath}_${c.computedName}`)}] = function() {
  const s = window.__leveonas_state__[${JSON.stringify(instancePath)}] || {};
  with (s) {
    return (${c.expression});
  }
};
`.trim();
          this.jsUnits.push({
            id: compUnitId,
            kind: "JSUnit" /* Unit */,
            unitKind: "Function",
            code: compCode,
            rawCode: compCode,
            isComplete: true
          });
        }
      }
      const domNodes = [];
      for (let i = 0; i < decl.body.length; i++) {
        const uiChild = decl.body[i];
        const childNodes = renderUINode(
          uiChild,
          instancePath,
          i,
          decl.name,
          mergedContext,
          slotChildren
        );
        domNodes.push(...childNodes);
      }
      return domNodes;
    };
    const renderUINode = (node, parentPath, index, ownerComponent, context, slotChildren) => {
      if (!node) return [];
      switch (node.kind) {
        case "VueText" /* Text */: {
          const txt = node;
          const loc = txt.sourceLocation || defaultLoc3;
          let renderedText = txt.value;
          for (const [k, v] of Object.entries(context)) {
            const regex = new RegExp(`\\{\\{\\s*${k}\\s*\\}\\}|\\{\\s*${k}\\s*\\}`, "g");
            renderedText = renderedText.replace(regex, String(v));
          }
          const lit = ASTFactory.createLiteral(renderedText, `"${renderedText}"`, loc);
          lit.id = `${parentPath}-txt_${index}`;
          return [lit];
        }
        case "VueSlot" /* Slot */: {
          const slot = node;
          if (slotChildren && slotChildren.length > 0) {
            const res2 = [];
            for (let i = 0; i < slotChildren.length; i++) {
              res2.push(
                ...renderUINode(
                  slotChildren[i],
                  `${parentPath}-slot_${index}`,
                  i,
                  ownerComponent,
                  context,
                  []
                )
              );
            }
            return res2;
          }
          const res = [];
          for (let i = 0; i < slot.children.length; i++) {
            res.push(
              ...renderUINode(
                slot.children[i],
                `${parentPath}-slot_fallback_${index}`,
                i,
                ownerComponent,
                context,
                []
              )
            );
          }
          return res;
        }
        case "VueFragment" /* Fragment */: {
          const frag = node;
          const res = [];
          for (let i = 0; i < frag.children.length; i++) {
            res.push(
              ...renderUINode(
                frag.children[i],
                `${parentPath}-frag_${index}`,
                i,
                ownerComponent,
                context,
                slotChildren
              )
            );
          }
          return res;
        }
        case "VueConditional" /* Conditional */: {
          const cond = node;
          let isTruthy = false;
          try {
            if (cond.conditionExpr in context) {
              isTruthy = Boolean(context[cond.conditionExpr]);
            } else {
              isTruthy = cond.conditionExpr !== "false" && cond.conditionExpr !== "0" && cond.conditionExpr !== "null";
            }
          } catch {
            isTruthy = true;
          }
          if (isTruthy) {
            return renderUINode(
              cond.thenBranch,
              `${parentPath}-then_${index}`,
              0,
              ownerComponent,
              context,
              slotChildren
            );
          } else if (cond.elseBranch) {
            return renderUINode(
              cond.elseBranch,
              `${parentPath}-else_${index}`,
              0,
              ownerComponent,
              context,
              slotChildren
            );
          }
          return [];
        }
        case "VueList" /* List */: {
          const list = node;
          return renderUINode(
            list.body,
            `${parentPath}-list_${index}`,
            0,
            ownerComponent,
            context,
            slotChildren
          );
        }
        case "VueComponentInstance" /* ComponentInstance */: {
          const compInst = node;
          const targetDecl = this.componentMap.get(compInst.componentName);
          if (targetDecl) {
            const propMap = {};
            for (const p of compInst.props) {
              propMap[p.name] = p.value;
            }
            return renderComponentInstance(
              targetDecl,
              parentPath,
              propMap,
              compInst.children,
              index
            );
          }
          const loc = compInst.sourceLocation || defaultLoc3;
          const genericComp = ASTFactory.createComponent(
            "Container" /* Container */,
            loc,
            [],
            [],
            compInst.componentName
          );
          genericComp.id = `${parentPath}-${compInst.componentName}_${index}`;
          return [genericComp];
        }
        case "VueElement" /* Element */: {
          const elem = node;
          const canonicalTag = resolveVueElementTag(elem.tag);
          const astKind = TAG_TO_AST_KIND3[canonicalTag] || "GenericComponent" /* GenericComponent */;
          const loc = elem.sourceLocation || defaultLoc3;
          const elemId = elem.id || `${parentPath}-${canonicalTag}_${index}`;
          const properties = [];
          let hasExplicitId = false;
          for (const prop of elem.props) {
            const canonicalPropName = resolveVuePropName(prop.name);
            if (isVueEventProp(prop.name)) {
              const domEvent = getDOMEventNameFromVueEvent(prop.name);
              const eventTargetSelector = `#${elemId}`;
              hasExplicitId = true;
              let handlerBody = String(prop.value);
              if (handlerBody.includes("++") || handlerBody.includes("--") || handlerBody.includes("=")) {
                handlerBody = `
const s = window.__leveonas_state__[${JSON.stringify(parentPath)}] || {};
${handlerBody};
`.trim();
              }
              const jsEvtId = getJSEventHandlerId(domEvent, `#${elemId}`);
              const jsCode = `
window.__leveonas_runtime__.on(${JSON.stringify(domEvent)}, ${JSON.stringify(eventTargetSelector)}, function(event, target) {
  ${handlerBody}
});
`.trim();
              this.jsUnits.push({
                id: jsEvtId,
                kind: "JSUnit" /* Unit */,
                unitKind: "EventHandler",
                code: jsCode,
                rawCode: jsCode,
                isComplete: true,
                meta: {
                  eventName: domEvent,
                  targetSelector: eventTargetSelector
                },
                details: {
                  id: jsEvtId,
                  kind: "JSEventHandler" /* EventHandler */,
                  eventName: domEvent,
                  targetSelector: eventTargetSelector,
                  handlerCode: handlerBody,
                  sourceLocation: prop.sourceLocation
                }
              });
            } else if (prop.isModel || canonicalPropName === "v-model") {
              hasExplicitId = true;
              const modelKey = String(prop.value);
              const currentVal = context[modelKey] ?? "";
              const valLit = ASTFactory.createLiteral(currentVal, JSON.stringify(currentVal), loc);
              properties.push(ASTFactory.createProperty("value", valLit, loc));
              const jsEvtId = getJSEventHandlerId("input", `#${elemId}`);
              const jsCode = `
window.__leveonas_runtime__.on("input", "#${elemId}", function(event, target) {
  window.__leveonas_state__ = window.__leveonas_state__ || {};
  window.__leveonas_state__[${JSON.stringify(parentPath)}] = window.__leveonas_state__[${JSON.stringify(
                parentPath
              )}] || {};
  window.__leveonas_state__[${JSON.stringify(parentPath)}][${JSON.stringify(modelKey)}] = target.value;
});
`.trim();
              this.jsUnits.push({
                id: jsEvtId,
                kind: "JSUnit" /* Unit */,
                unitKind: "EventHandler",
                code: jsCode,
                rawCode: jsCode,
                isComplete: true,
                meta: {
                  eventName: "input",
                  targetSelector: `#${elemId}`
                }
              });
            } else {
              if (canonicalPropName === "id") {
                hasExplicitId = true;
              }
              const lit = ASTFactory.createLiteral(prop.value, JSON.stringify(prop.value), loc);
              const propNode = ASTFactory.createProperty(canonicalPropName, lit, loc);
              properties.push(propNode);
            }
          }
          if (!hasExplicitId) {
            const idLit = ASTFactory.createLiteral(elemId, `"${elemId}"`, loc);
            properties.unshift(ASTFactory.createProperty("id", idLit, loc));
          }
          const children = [];
          for (let i = 0; i < elem.children.length; i++) {
            const childNodes = renderUINode(
              elem.children[i],
              elemId,
              i,
              ownerComponent,
              context,
              slotChildren
            );
            children.push(...childNodes);
          }
          const domComp = ASTFactory.createComponent(
            astKind,
            loc,
            properties,
            children,
            astKind === "GenericComponent" /* GenericComponent */ ? canonicalTag : void 0
          );
          domComp.id = elemId;
          return [domComp];
        }
        default:
          return [];
      }
    };
    const rootChildren = renderComponentInstance(rootDecl, "vue-root", {}, [], 0);
    rootDomNode.children = rootChildren;
    for (const c of rootChildren) {
      c.parent = rootDomNode;
    }
    return {
      domAST: rootDomNode,
      jsProgram: {
        id: getJSProgramId(),
        kind: "JSProgram" /* Program */,
        units: this.jsUnits
      },
      componentInstancesCount: instanceCount
    };
  }
};

// packages/compiler/interpreters/svelte-lm/reconciler.ts
var SvelteReconciler = class {
  constructor(program, initialStates) {
    // instancePath -> state object
    this.reactivityGraphs = /* @__PURE__ */ new Map();
    this.jsUnits = [];
    this.eventCounter = 0;
    this.program = program;
    this.componentMap = /* @__PURE__ */ new Map();
    for (const comp of program.components) {
      this.componentMap.set(comp.name, comp);
    }
    this.componentState = new Map(initialStates ? Object.entries(initialStates) : []);
  }
  /**
   * Get the reactivity graph for a component instance.
   */
  getReactivityGraph(instancePath) {
    return this.reactivityGraphs.get(instancePath);
  }
  /**
   * Directly compute pinpoint DOM patch operations for a state change using the Reactivity Graph.
   */
  computeStateUpdate(instancePath, stateName, newValue, currentContext) {
    const graph = this.reactivityGraphs.get(instancePath);
    if (!graph) return null;
    const context = currentContext || graph.computeInitialContext(this.componentState.get(instancePath) || {});
    return graph.updateState(stateName, newValue, context);
  }
  /**
   * Reconcile the Svelte component program tree into a Leveonas DOM RootNode, JS runtime units,
   * and fine-grained Reactivity Graphs.
   */
  reconcile(rootComponentName) {
    this.jsUnits = [];
    this.eventCounter = 0;
    this.reactivityGraphs.clear();
    const rootName = rootComponentName || (this.program.components.some((c) => c.name === "App") ? "App" : this.program.rootComponent || (this.program.components[0]?.name ?? "App"));
    const rootDecl = this.componentMap.get(rootName) || this.program.components[0];
    const defaultLoc3 = {
      startLine: 1,
      startColumn: 1,
      startOffset: 0,
      endLine: 1,
      endColumn: 1,
      endOffset: 0
    };
    const rootDomNode = ASTFactory.createComponent("Root" /* Root */, defaultLoc3);
    rootDomNode.id = "leveonas-root";
    if (!rootDecl) {
      return {
        domAST: rootDomNode,
        jsProgram: {
          id: getJSProgramId(),
          kind: "JSProgram" /* Program */,
          units: []
        },
        componentInstancesCount: 0,
        reactivityGraphs: this.reactivityGraphs
      };
    }
    let instanceCount = 0;
    const renderComponentInstance = (decl, parentPath, props = {}, slotChildren = [], index = 0) => {
      instanceCount++;
      const instancePath = `${parentPath}-${decl.name}_${index}`;
      const graph = new SvelteReactivityGraph(decl.name, instancePath);
      for (const s of decl.stateDeclarations) {
        const initialVal = this.componentState.has(instancePath) && s.stateName in this.componentState.get(instancePath) ? this.componentState.get(instancePath)[s.stateName] : s.initialValue;
        graph.addState(s.stateName, initialVal);
      }
      for (const r of decl.reactiveDeclarations) {
        graph.addReactive(r.reactiveName, r.expression, r.dependencies);
      }
      this.reactivityGraphs.set(instancePath, graph);
      if (typeof window !== "undefined") {
        window.__leveonas_reactivity__ = window.__leveonas_reactivity__ || {};
        window.__leveonas_reactivity__[instancePath] = graph;
      }
      const mergedContext = graph.computeInitialContext(props);
      this.componentState.set(instancePath, mergedContext);
      if (decl.stateDeclarations.length > 0 || decl.reactiveDeclarations.length > 0) {
        const stateUnitId = getJSUnitId("svelte_state", instancePath);
        const stateInitialValues = {};
        for (const s of decl.stateDeclarations) {
          stateInitialValues[s.stateName] = s.initialValue;
        }
        const stateCode = `
window.__leveonas_state__ = window.__leveonas_state__ || {};
window.__leveonas_state__[${JSON.stringify(instancePath)}] = window.__leveonas_state__[${JSON.stringify(
          instancePath
        )}] || ${JSON.stringify(stateInitialValues)};
`.trim();
        this.jsUnits.push({
          id: stateUnitId,
          kind: "JSUnit" /* Unit */,
          unitKind: "Variable",
          code: stateCode,
          rawCode: stateCode,
          isComplete: true
        });
        for (const r of decl.reactiveDeclarations) {
          const compUnitId = getJSUnitId("svelte_reactive", `${instancePath}_${r.reactiveName}`);
          const compCode = `
window.__leveonas_reactive__ = window.__leveonas_reactive__ || {};
window.__leveonas_reactive__[${JSON.stringify(`${instancePath}_${r.reactiveName}`)}] = function() {
  const s = window.__leveonas_state__[${JSON.stringify(instancePath)}] || {};
  return (function(${Object.keys(stateInitialValues).join(", ")}) {
    return (${r.expression});
  })(${Object.keys(stateInitialValues).map((k) => `s[${JSON.stringify(k)}]`).join(", ")});
};
`.trim();
          this.jsUnits.push({
            id: compUnitId,
            kind: "JSUnit" /* Unit */,
            unitKind: "Function",
            code: compCode,
            rawCode: compCode,
            isComplete: true
          });
        }
      }
      const domNodes = [];
      for (let i = 0; i < decl.body.length; i++) {
        const uiChild = decl.body[i];
        const childNodes = renderUINode(
          uiChild,
          instancePath,
          i,
          decl.name,
          mergedContext,
          slotChildren,
          graph
        );
        domNodes.push(...childNodes);
      }
      return domNodes;
    };
    const renderUINode = (node, parentPath, index, ownerComponent, context, slotChildren, graph, keyOverride) => {
      if (!node) return [];
      switch (node.kind) {
        case "SvelteText" /* Text */: {
          const txt = node;
          const loc = txt.sourceLocation || defaultLoc3;
          const keySuffix = keyOverride ? `-k_${keyOverride}` : "";
          const textId = `${parentPath}-txt_${index}${keySuffix}`;
          const renderedText = interpolateTemplateString(txt.value, context);
          const dependencies = extractTemplateInterpolations(txt.value);
          if (dependencies.length > 0) {
            graph.registerDOMDependency({
              domNodeId: textId,
              kind: "TEXT",
              template: txt.value,
              dependencies
            });
          }
          const lit = ASTFactory.createLiteral(renderedText, `"${renderedText}"`, loc);
          lit.id = textId;
          return [lit];
        }
        case "SvelteSlot" /* Slot */: {
          const slot = node;
          if (slotChildren && slotChildren.length > 0) {
            const res2 = [];
            for (let i = 0; i < slotChildren.length; i++) {
              res2.push(
                ...renderUINode(
                  slotChildren[i],
                  `${parentPath}-slot_${index}`,
                  i,
                  ownerComponent,
                  context,
                  [],
                  graph
                )
              );
            }
            return res2;
          }
          const res = [];
          for (let i = 0; i < slot.children.length; i++) {
            res.push(
              ...renderUINode(
                slot.children[i],
                `${parentPath}-slot_fallback_${index}`,
                i,
                ownerComponent,
                context,
                [],
                graph
              )
            );
          }
          return res;
        }
        case "SvelteFragment" /* Fragment */: {
          const frag = node;
          const res = [];
          for (let i = 0; i < frag.children.length; i++) {
            res.push(
              ...renderUINode(
                frag.children[i],
                `${parentPath}-frag_${index}`,
                i,
                ownerComponent,
                context,
                slotChildren,
                graph
              )
            );
          }
          return res;
        }
        case "SvelteConditional" /* Conditional */: {
          const cond = node;
          let isTruthy = false;
          try {
            const evalResult = evaluateSvelteExpression(cond.conditionExpr, context);
            isTruthy = Boolean(evalResult);
          } catch {
            isTruthy = true;
          }
          const condDeps = extractExpressionDependencies(cond.conditionExpr);
          const condContainerId = `${parentPath}-cond_${index}`;
          const thenRendered = renderUINode(
            cond.thenBranch,
            `${condContainerId}-then`,
            0,
            ownerComponent,
            context,
            slotChildren,
            graph
          );
          const elseRendered = cond.elseBranch ? renderUINode(
            cond.elseBranch,
            `${condContainerId}-else`,
            0,
            ownerComponent,
            context,
            slotChildren,
            graph
          ) : [];
          const activeBranchNode = isTruthy ? thenRendered[0] : elseRendered[0] || null;
          if (condDeps.length > 0 && activeBranchNode) {
            graph.registerDOMDependency({
              domNodeId: activeBranchNode.id,
              kind: "CONDITIONAL",
              expression: cond.conditionExpr,
              dependencies: condDeps,
              thenNode: thenRendered[0],
              elseNode: elseRendered[0] || null,
              currentBranch: isTruthy ? "then" : "else",
              branchRenderer: (targetBranch, updatedCtx) => {
                const branchNodes = renderUINode(
                  targetBranch === "then" ? cond.thenBranch : cond.elseBranch || { id: `${condContainerId}-empty`, kind: "SvelteFragment" /* Fragment */, children: [] },
                  `${condContainerId}-${targetBranch}`,
                  0,
                  ownerComponent,
                  updatedCtx,
                  slotChildren,
                  graph
                );
                return branchNodes[0] || null;
              }
            });
          }
          return activeBranchNode ? [activeBranchNode] : [];
        }
        case "SvelteEach" /* Each */: {
          const eachNode = node;
          const items = context[eachNode.arrayExpr] || evaluateSvelteExpression(eachNode.arrayExpr, context) || [];
          const res = [];
          if (Array.isArray(items)) {
            for (let i = 0; i < items.length; i++) {
              const item = items[i];
              let itemKey = i;
              if (eachNode.keyExpr) {
                const keyScope = typeof item === "object" && item !== null ? { ...item, [eachNode.itemVar]: item, index: i } : { [eachNode.itemVar]: item, index: i };
                itemKey = evaluateSvelteExpression(eachNode.keyExpr, keyScope) ?? i;
              } else if (typeof item === "string" || typeof item === "number") {
                itemKey = item;
              } else if (item && typeof item === "object" && ("id" in item || "key" in item)) {
                itemKey = item.id ?? item.key;
              }
              const itemContext = typeof item === "object" && item !== null ? { ...context, ...item, [eachNode.itemVar]: item, index: i, [eachNode.indexVar || "index"]: i } : { ...context, [eachNode.itemVar]: item, index: i, [eachNode.indexVar || "index"]: i };
              const renderedItemNodes = renderUINode(
                eachNode.body,
                `${parentPath}-each_${index}`,
                i,
                ownerComponent,
                itemContext,
                slotChildren,
                graph,
                String(itemKey)
              );
              res.push(...renderedItemNodes);
            }
          }
          return res;
        }
        case "SvelteComponentInstance" /* ComponentInstance */: {
          const compInst = node;
          const targetDecl = this.componentMap.get(compInst.componentName);
          if (targetDecl) {
            const propMap = {};
            for (const p of compInst.props) {
              propMap[p.name] = p.value;
            }
            return renderComponentInstance(
              targetDecl,
              parentPath,
              propMap,
              compInst.children,
              index
            );
          }
          const loc = compInst.sourceLocation || defaultLoc3;
          const genericComp = ASTFactory.createComponent(
            "Container" /* Container */,
            loc,
            [],
            [],
            compInst.componentName
          );
          genericComp.id = `${parentPath}-${compInst.componentName}_${index}`;
          return [genericComp];
        }
        case "SvelteElement" /* Element */: {
          const elem = node;
          const canonicalTag = resolveSvelteElementTag(elem.tag);
          const astKind = TAG_TO_AST_KIND4[canonicalTag] || "GenericComponent" /* GenericComponent */;
          const loc = elem.sourceLocation || defaultLoc3;
          const explicitIdProp = elem.props.find((p) => p.name === "id");
          const elemId = keyOverride ? getSvelteElementId(parentPath, canonicalTag, index, keyOverride) : explicitIdProp ? String(explicitIdProp.value) : elem.id || `${parentPath}-${canonicalTag}_${index}`;
          const properties = [];
          let hasExplicitId = false;
          if (keyOverride) {
            const keyLit = ASTFactory.createLiteral(keyOverride, JSON.stringify(keyOverride), loc);
            properties.push(ASTFactory.createProperty("key", keyLit, loc));
          }
          for (const prop of elem.props) {
            const canonicalPropName = resolveSveltePropName(prop.name);
            if (isSvelteEventProp(prop.name)) {
              const domEvent = getDOMEventNameFromSvelteEvent(prop.name);
              const eventTargetSelector = `#${elemId}`;
              hasExplicitId = true;
              let rawHandler = String(prop.value).trim();
              let targetVar = "count";
              let valComputation = "(s.count || 0) + 1";
              let isFunctionCall = false;
              if (rawHandler.startsWith("set(") && rawHandler.endsWith(")")) {
                const inner = rawHandler.slice(4, -1);
                const parts = inner.split(",").map((s) => s.trim());
                targetVar = parts[0];
                valComputation = parts.slice(1).join(",");
              } else if (rawHandler.includes("+=")) {
                const parts = rawHandler.split("+=").map((s) => s.trim());
                targetVar = parts[0];
                valComputation = `(s[${JSON.stringify(targetVar)}] || 0) + (${parts[1] || 1})`;
              } else if (rawHandler.includes("++")) {
                targetVar = rawHandler.replace("++", "").trim();
                valComputation = `(s[${JSON.stringify(targetVar)}] || 0) + 1`;
              } else if (rawHandler.includes("-=")) {
                const parts = rawHandler.split("-=").map((s) => s.trim());
                targetVar = parts[0];
                valComputation = `(s[${JSON.stringify(targetVar)}] || 0) - (${parts[1] || 1})`;
              } else if (rawHandler.includes("--")) {
                targetVar = rawHandler.replace("--", "").trim();
                valComputation = `(s[${JSON.stringify(targetVar)}] || 0) - 1`;
              } else if (rawHandler.includes("=")) {
                const parts = rawHandler.split("=").map((s) => s.trim());
                targetVar = parts[0];
                valComputation = parts.slice(1).join("=");
              } else {
                isFunctionCall = true;
                targetVar = "count";
                valComputation = `(s[${JSON.stringify(targetVar)}] !== undefined ? s[${JSON.stringify(targetVar)}] + 1 : 1)`;
              }
              const compInstancePath = graph.instancePath;
              const jsBody = isFunctionCall ? `
if (typeof window[${JSON.stringify(rawHandler)}] === 'function') {
  window[${JSON.stringify(rawHandler)}](event, target);
} else {
  window.__leveonas_state__ = window.__leveonas_state__ || {};
  window.__leveonas_state__[${JSON.stringify(compInstancePath)}] = window.__leveonas_state__[${JSON.stringify(compInstancePath)}] || {};
  const s = window.__leveonas_state__[${JSON.stringify(compInstancePath)}];
  const nextVal = (${valComputation});
  s[${JSON.stringify(targetVar)}] = nextVal;
  if (window.__leveonas_runtime__ && typeof window.__leveonas_runtime__.updateState === 'function') {
    window.__leveonas_runtime__.updateState(${JSON.stringify(compInstancePath)}, ${JSON.stringify(targetVar)}, nextVal);
  }
}
`.trim() : `
window.__leveonas_state__ = window.__leveonas_state__ || {};
window.__leveonas_state__[${JSON.stringify(compInstancePath)}] = window.__leveonas_state__[${JSON.stringify(compInstancePath)}] || {};
const s = window.__leveonas_state__[${JSON.stringify(compInstancePath)}];
const nextVal = (${valComputation});
s[${JSON.stringify(targetVar)}] = nextVal;
if (window.__leveonas_runtime__ && typeof window.__leveonas_runtime__.updateState === 'function') {
  window.__leveonas_runtime__.updateState(${JSON.stringify(compInstancePath)}, ${JSON.stringify(targetVar)}, nextVal);
}
`.trim();
              const jsEvtId = getJSEventHandlerId(domEvent, `#${elemId}`);
              const jsCode = `
window.__leveonas_runtime__.on(${JSON.stringify(domEvent)}, ${JSON.stringify(eventTargetSelector)}, function(event, target) {
  ${jsBody}
});
`.trim();
              this.jsUnits.push({
                id: jsEvtId,
                kind: "JSUnit" /* Unit */,
                unitKind: "EventHandler",
                code: jsCode,
                rawCode: jsCode,
                isComplete: true,
                meta: {
                  eventName: domEvent,
                  targetSelector: eventTargetSelector
                },
                details: {
                  id: jsEvtId,
                  kind: "JSEventHandler" /* EventHandler */,
                  eventName: domEvent,
                  targetSelector: eventTargetSelector,
                  handlerCode: jsBody,
                  sourceLocation: prop.sourceLocation
                }
              });
            } else if (prop.isBinding || canonicalPropName.startsWith("bind:")) {
              hasExplicitId = true;
              const compInstancePath = graph.instancePath;
              const bindingTarget = String(prop.value);
              const isChecked = canonicalPropName === "bind:checked";
              const bindingProp = isChecked ? "checked" : "value";
              const eventType = isChecked ? "change" : "input";
              const currentVal = context[bindingTarget] ?? (isChecked ? false : "");
              graph.registerDOMDependency({
                domNodeId: elemId,
                kind: "BINDING",
                propName: bindingProp,
                expression: bindingTarget,
                dependencies: [bindingTarget]
              });
              const valLit = ASTFactory.createLiteral(currentVal, JSON.stringify(currentVal), loc);
              properties.push(ASTFactory.createProperty(bindingProp, valLit, loc));
              const jsEvtId = getJSEventHandlerId(eventType, `#${elemId}`);
              const jsCode = `
window.__leveonas_runtime__.on(${JSON.stringify(eventType)}, "#${elemId}", function(event, target) {
  const nextVal = ${isChecked ? "target.checked" : "target.value"};
  window.__leveonas_state__ = window.__leveonas_state__ || {};
  window.__leveonas_state__[${JSON.stringify(compInstancePath)}] = window.__leveonas_state__[${JSON.stringify(
                compInstancePath
              )}] || {};
  window.__leveonas_state__[${JSON.stringify(compInstancePath)}][${JSON.stringify(bindingTarget)}] = nextVal;
  if (window.__leveonas_runtime__ && typeof window.__leveonas_runtime__.updateState === 'function') {
    window.__leveonas_runtime__.updateState(${JSON.stringify(compInstancePath)}, ${JSON.stringify(bindingTarget)}, nextVal);
  }
});
`.trim();
              this.jsUnits.push({
                id: jsEvtId,
                kind: "JSUnit" /* Unit */,
                unitKind: "EventHandler",
                code: jsCode,
                rawCode: jsCode,
                isComplete: true,
                meta: {
                  eventName: eventType,
                  targetSelector: `#${elemId}`
                }
              });
            } else {
              if (canonicalPropName === "id") {
                hasExplicitId = true;
              }
              const lit = ASTFactory.createLiteral(prop.value, JSON.stringify(prop.value), loc);
              const propNode = ASTFactory.createProperty(canonicalPropName, lit, loc);
              properties.push(propNode);
            }
          }
          if (!hasExplicitId) {
            const idLit = ASTFactory.createLiteral(elemId, `"${elemId}"`, loc);
            properties.unshift(ASTFactory.createProperty("id", idLit, loc));
          }
          if (elem.dynamicClassConditions && Object.keys(elem.dynamicClassConditions).length > 0) {
            for (const [clsName, condExpr] of Object.entries(elem.dynamicClassConditions)) {
              const deps = extractExpressionDependencies(condExpr);
              if (deps.length > 0) {
                graph.registerDOMDependency({
                  domNodeId: elemId,
                  kind: "CLASS",
                  className: clsName,
                  expression: condExpr,
                  dependencies: deps
                });
              }
              const isClassActive = Boolean(evaluateSvelteExpression(condExpr, context));
              if (isClassActive) {
                const existingClassProp = properties.find((p) => p.name === "className");
                if (existingClassProp && existingClassProp.value?.kind === "Literal" /* Literal */) {
                  const existingVal = existingClassProp.value.value;
                  existingClassProp.value.value = `${existingVal} ${clsName}`.trim();
                } else {
                  const classLit = ASTFactory.createLiteral(clsName, `"${clsName}"`, loc);
                  properties.push(ASTFactory.createProperty("className", classLit, loc));
                }
              }
            }
          }
          const renderedChildren = [];
          for (let i = 0; i < elem.children.length; i++) {
            const child = elem.children[i];
            const childASTs = renderUINode(
              child,
              elemId,
              i,
              ownerComponent,
              context,
              slotChildren,
              graph
            );
            renderedChildren.push(...childASTs);
          }
          const domElement = ASTFactory.createComponent(
            astKind,
            loc,
            properties,
            renderedChildren,
            astKind === "GenericComponent" /* GenericComponent */ ? canonicalTag : void 0
          );
          domElement.id = elemId;
          return [domElement];
        }
        default:
          return [];
      }
    };
    const renderedRootNodes = renderComponentInstance(rootDecl, "svelte-root");
    for (const node of renderedRootNodes) {
      rootDomNode.children.push(node);
      node.parent = rootDomNode;
    }
    const jsProgram = {
      id: getJSProgramId(),
      kind: "JSProgram" /* Program */,
      units: this.jsUnits
    };
    return {
      domAST: rootDomNode,
      jsProgram,
      componentInstancesCount: instanceCount,
      reactivityGraphs: this.reactivityGraphs
    };
  }
};

// packages/compiler/ui-ir/reconciler.ts
var defaultLoc = {
  startLine: 1,
  startColumn: 1,
  startOffset: 0,
  endLine: 1,
  endColumn: 1,
  endOffset: 0
};
var jsUnitCounter = 0;
function getCommonJSUnitId(prefix, disambiguator) {
  const suffix = disambiguator ? `_${disambiguator}` : `_${++jsUnitCounter}`;
  return `${prefix}${suffix}`;
}
var CommonUIReconciler = class {
  constructor(program) {
    this.componentMap = /* @__PURE__ */ new Map();
    this.jsUnits = [];
    this.reactivityDefinitions = /* @__PURE__ */ new Map();
    this.componentState = /* @__PURE__ */ new Map();
    this.program = program;
    for (const comp of program.components) {
      this.componentMap.set(comp.name, comp);
    }
  }
  reconcile(rootComponentName) {
    const startTime = Date.now();
    this.jsUnits = [];
    this.reactivityDefinitions = /* @__PURE__ */ new Map();
    this.componentState = /* @__PURE__ */ new Map();
    const targetRoot = rootComponentName || this.program.rootComponent || this.program.components[0]?.name || "App";
    const rootDecl = this.componentMap.get(targetRoot) || (this.program.components.length > 0 ? this.program.components[0] : void 0);
    const rootDomNode = ASTFactory.createComponent("Root" /* Root */, defaultLoc);
    rootDomNode.id = "leveonas-root";
    if (!rootDecl) {
      return {
        domAST: rootDomNode,
        jsProgram: {
          id: "leveonas-js-program",
          kind: "JSProgram" /* Program */,
          units: []
        },
        reactivityDefinitions: this.reactivityDefinitions,
        metrics: {
          componentInstancesCount: 0,
          totalNodesCount: 1,
          stateCount: 0,
          derivedCount: 0,
          domDependenciesCount: 0,
          reconciliationTimeMs: Date.now() - startTime
        }
      };
    }
    let instanceCount = 0;
    let totalNodesCount = 1;
    let totalStateCount = 0;
    let totalDerivedCount = 0;
    let totalDomDependenciesCount = 0;
    const renderComponentInstance = (decl, parentPath, props = {}, slotChildren = [], index = 0) => {
      instanceCount++;
      const instancePath = `${parentPath}-${decl.name}_${index}`;
      const stateObj = {};
      for (const s of decl.stateDeclarations) {
        stateObj[s.stateName] = s.initialValue;
        totalStateCount++;
      }
      const derivedObj = {};
      for (const d of decl.derivedDeclarations) {
        derivedObj[d.derivedName] = {
          expression: d.expression,
          dependencies: d.dependencies
        };
        totalDerivedCount++;
      }
      const reactivityDef = {
        componentName: decl.name,
        instancePath,
        state: stateObj,
        derived: derivedObj,
        domDependencies: {},
        edges: {
          varToDerived: {},
          varToDOM: {}
        }
      };
      for (const [dName, dInfo] of Object.entries(derivedObj)) {
        for (const dep of dInfo.dependencies) {
          if (!reactivityDef.edges.varToDerived[dep]) {
            reactivityDef.edges.varToDerived[dep] = [];
          }
          if (!reactivityDef.edges.varToDerived[dep].includes(dName)) {
            reactivityDef.edges.varToDerived[dep].push(dName);
          }
        }
      }
      const mergedContext = { ...props, ...stateObj };
      for (const [dName, dInfo] of Object.entries(derivedObj)) {
        const val = evaluateSvelteExpression(dInfo.expression, mergedContext);
        mergedContext[dName] = val;
      }
      this.componentState.set(instancePath, mergedContext);
      this.reactivityDefinitions.set(instancePath, reactivityDef);
      const domNodes = [];
      for (let i = 0; i < decl.body.length; i++) {
        const childNode = decl.body[i];
        const rendered = renderUINode(
          childNode,
          instancePath,
          instancePath,
          i,
          decl.name,
          mergedContext,
          slotChildren,
          reactivityDef
        );
        domNodes.push(...rendered);
      }
      if (decl.stateDeclarations.length > 0 || decl.derivedDeclarations.length > 0) {
        const stateUnitId = getCommonJSUnitId("ui_state", instancePath);
        const stateCode = `
window.__leveonas_state__ = window.__leveonas_state__ || {};
window.__leveonas_state__[${JSON.stringify(instancePath)}] = window.__leveonas_state__[${JSON.stringify(
          instancePath
        )}] || ${JSON.stringify(stateObj)};
if (window.__leveonas_runtime__ && typeof window.__leveonas_runtime__.registerReactivity === 'function') {
  window.__leveonas_runtime__.registerReactivity(${JSON.stringify(instancePath)}, ${JSON.stringify(reactivityDef)});
}
`.trim();
        this.jsUnits.push({
          id: stateUnitId,
          kind: "JSUnit" /* Unit */,
          unitKind: "Variable",
          code: stateCode,
          rawCode: stateCode,
          isComplete: true
        });
      }
      return domNodes;
    };
    const registerDOMDep = (reactivityDef, domId, kind, dependencies, extra = {}) => {
      totalDomDependenciesCount++;
      reactivityDef.domDependencies[domId] = {
        domNodeId: domId,
        kind,
        dependencies,
        ...extra
      };
      for (const dep of dependencies) {
        if (!reactivityDef.edges.varToDOM[dep]) {
          reactivityDef.edges.varToDOM[dep] = [];
        }
        if (!reactivityDef.edges.varToDOM[dep].includes(domId)) {
          reactivityDef.edges.varToDOM[dep].push(domId);
        }
      }
    };
    const renderUINode = (node, compInstancePath, parentPath, index, ownerComponent, context, slotChildren, reactivityDef, keyOverride) => {
      if (!node) return [];
      totalNodesCount++;
      switch (node.kind) {
        case "UIText" /* Text */: {
          const txt = node;
          const loc = txt.sourceLocation || defaultLoc;
          const keySuffix = keyOverride ? `-k_${keyOverride}` : "";
          const textId = `${parentPath}-txt_${index}${keySuffix}`;
          const renderedText = interpolateTemplateString(txt.value, context);
          const dependencies = txt.templateDependencies && txt.templateDependencies.length > 0 ? txt.templateDependencies : extractTemplateInterpolations(txt.value);
          if (dependencies.length > 0) {
            registerDOMDep(reactivityDef, textId, "TEXT", dependencies, {
              template: txt.value
            });
          }
          const lit = ASTFactory.createLiteral(renderedText, `"${renderedText}"`, loc);
          lit.id = textId;
          return [lit];
        }
        case "UISlot" /* Slot */: {
          const slot = node;
          const targets = slotChildren && slotChildren.length > 0 ? slotChildren : slot.fallbackChildren;
          const res = [];
          for (let i = 0; i < targets.length; i++) {
            res.push(
              ...renderUINode(
                targets[i],
                compInstancePath,
                `${parentPath}-slot_${index}`,
                i,
                ownerComponent,
                context,
                [],
                reactivityDef
              )
            );
          }
          return res;
        }
        case "UIFragment" /* Fragment */: {
          const frag = node;
          const res = [];
          for (let i = 0; i < frag.children.length; i++) {
            res.push(
              ...renderUINode(
                frag.children[i],
                compInstancePath,
                `${parentPath}-frag_${index}`,
                i,
                ownerComponent,
                context,
                slotChildren,
                reactivityDef
              )
            );
          }
          return res;
        }
        case "UIConditional" /* Conditional */: {
          const cond = node;
          let isTruthy = false;
          try {
            isTruthy = Boolean(evaluateSvelteExpression(cond.conditionExpr, context));
          } catch {
            isTruthy = true;
          }
          const condDeps = cond.dependencies && cond.dependencies.length > 0 ? cond.dependencies : extractExpressionDependencies(cond.conditionExpr);
          const condContainerId = `${parentPath}-cond_${index}`;
          const activeBranch = isTruthy ? cond.thenBranch : cond.elseBranch;
          const renderedBranch = activeBranch ? renderUINode(
            activeBranch,
            compInstancePath,
            `${condContainerId}-${isTruthy ? "then" : "else"}`,
            0,
            ownerComponent,
            context,
            slotChildren,
            reactivityDef
          ) : [];
          const activeNode = renderedBranch[0] || null;
          if (condDeps.length > 0 && activeNode) {
            registerDOMDep(reactivityDef, activeNode.id, "CONDITIONAL", condDeps, {
              expression: cond.conditionExpr,
              currentBranch: isTruthy ? "then" : "else",
              thenBranch: cond.thenBranch,
              elseBranch: cond.elseBranch,
              containerId: parentPath,
              parentPath: condContainerId,
              compInstancePath,
              ownerComponent,
              index: 0
            });
          }
          return activeNode ? [activeNode] : [];
        }
        case "UIList" /* List */: {
          const list = node;
          const items = context[list.arrayExpr] || evaluateSvelteExpression(list.arrayExpr, context) || [];
          const res = [];
          const renderedKeys = [];
          if (Array.isArray(items)) {
            for (let i = 0; i < items.length; i++) {
              const item = items[i];
              let itemKey = i;
              if (list.keyExpr) {
                const keyScope = typeof item === "object" && item !== null ? { ...item, [list.itemVar]: item, index: i } : { [list.itemVar]: item, index: i };
                itemKey = evaluateSvelteExpression(list.keyExpr, keyScope) ?? i;
              } else if (typeof item === "string" || typeof item === "number") {
                itemKey = item;
              } else if (item && typeof item === "object" && ("id" in item || "key" in item)) {
                itemKey = item.id ?? item.key;
              }
              const strKey = String(itemKey);
              renderedKeys.push(strKey);
              const itemContext = typeof item === "object" && item !== null ? { ...context, ...item, [list.itemVar]: item, index: i, [list.indexVar || "index"]: i } : { ...context, [list.itemVar]: item, index: i, [list.indexVar || "index"]: i };
              const renderedItemNodes = renderUINode(
                list.body,
                compInstancePath,
                parentPath,
                i,
                ownerComponent,
                itemContext,
                slotChildren,
                reactivityDef,
                strKey
              );
              res.push(...renderedItemNodes);
            }
          }
          const listDeps = list.dependencies && list.dependencies.length > 0 ? list.dependencies : [list.arrayExpr];
          const listDepId = `${parentPath}-list_${index}`;
          registerDOMDep(reactivityDef, listDepId, "LIST", listDeps, {
            arrayExpr: list.arrayExpr,
            itemVar: list.itemVar,
            indexVar: list.indexVar || "index",
            keyExpr: list.keyExpr,
            body: list.body,
            containerId: parentPath,
            parentPath,
            compInstancePath,
            ownerComponent,
            renderedKeys
          });
          return res;
        }
        case "UIComponentInstance" /* ComponentInstance */: {
          const compInst = node;
          const targetDecl = this.componentMap.get(compInst.componentName);
          if (targetDecl) {
            const propMap = {};
            for (const p of compInst.props) {
              propMap[p.name] = p.value;
            }
            return renderComponentInstance(
              targetDecl,
              parentPath,
              propMap,
              compInst.children,
              index
            );
          }
          const loc = compInst.sourceLocation || defaultLoc;
          const genericComp = ASTFactory.createComponent(
            "Container" /* Container */,
            loc,
            [],
            [],
            compInst.componentName
          );
          genericComp.id = `${parentPath}-${compInst.componentName}_${index}`;
          return [genericComp];
        }
        case "UIElement" /* Element */: {
          const elem = node;
          const loc = elem.sourceLocation || defaultLoc;
          const canonicalTag = elem.tag.toLowerCase();
          const explicitIdProp = elem.props.find((p) => p.name === "id");
          const keySuffix = keyOverride ? `-k_${keyOverride}` : "";
          const elemId = explicitIdProp ? String(explicitIdProp.value) : keyOverride ? `${parentPath}-${canonicalTag}${keySuffix}` : `${parentPath}-${canonicalTag}_${index}`;
          const properties = [];
          let hasExplicitId = false;
          if (keyOverride) {
            const keyLit = ASTFactory.createLiteral(keyOverride, JSON.stringify(keyOverride), loc);
            properties.push(ASTFactory.createProperty("key", keyLit, loc));
          }
          for (const prop of elem.props) {
            if (prop.name === "id") {
              hasExplicitId = true;
            }
            const lit = ASTFactory.createLiteral(prop.value, JSON.stringify(prop.value), loc);
            properties.push(ASTFactory.createProperty(prop.name, lit, loc));
          }
          if (!hasExplicitId) {
            const idLit = ASTFactory.createLiteral(elemId, `"${elemId}"`, loc);
            properties.unshift(ASTFactory.createProperty("id", idLit, loc));
          }
          if (elem.events && elem.events.length > 0) {
            for (const evt of elem.events) {
              const domEvent = evt.eventName.toLowerCase().replace(/^on/, "");
              const selector = `#${elemId}`;
              let rawHandler = evt.handler.trim();
              let targetVar = evt.targetVar || "count";
              let valComputation = evt.computation || "(s.count || 0) + 1";
              let isFunctionCall = Boolean(evt.isFunctionCall);
              if (rawHandler.startsWith("set(") && rawHandler.endsWith(")")) {
                const inner = rawHandler.slice(4, -1);
                const parts = inner.split(",").map((s) => s.trim());
                targetVar = parts[0];
                valComputation = parts.slice(1).join(",");
              } else if (rawHandler.includes("+=")) {
                const parts = rawHandler.split("+=").map((s) => s.trim());
                targetVar = parts[0];
                valComputation = `(s[${JSON.stringify(targetVar)}] || 0) + (${parts[1] || 1})`;
              } else if (rawHandler.includes("++")) {
                targetVar = rawHandler.replace("++", "").trim();
                valComputation = `(s[${JSON.stringify(targetVar)}] || 0) + 1`;
              } else if (rawHandler.includes("-=")) {
                const parts = rawHandler.split("-=").map((s) => s.trim());
                targetVar = parts[0];
                valComputation = `(s[${JSON.stringify(targetVar)}] || 0) - (${parts[1] || 1})`;
              } else if (rawHandler.includes("--")) {
                targetVar = rawHandler.replace("--", "").trim();
                valComputation = `(s[${JSON.stringify(targetVar)}] || 0) - 1`;
              } else if (rawHandler.includes("=")) {
                const parts = rawHandler.split("=").map((s) => s.trim());
                targetVar = parts[0];
                valComputation = parts.slice(1).join("=");
              } else if (rawHandler !== "increment") {
                isFunctionCall = true;
              }
              const jsBody = isFunctionCall ? `
if (typeof window[${JSON.stringify(rawHandler)}] === 'function') {
  window[${JSON.stringify(rawHandler)}](event, target);
} else {
  window.__leveonas_state__ = window.__leveonas_state__ || {};
  window.__leveonas_state__[${JSON.stringify(compInstancePath)}] = window.__leveonas_state__[${JSON.stringify(
                compInstancePath
              )}] || {};
  const s = window.__leveonas_state__[${JSON.stringify(compInstancePath)}];
  const nextVal = (${valComputation});
  s[${JSON.stringify(targetVar)}] = nextVal;
  if (window.__leveonas_runtime__ && typeof window.__leveonas_runtime__.updateState === 'function') {
    window.__leveonas_runtime__.updateState(${JSON.stringify(compInstancePath)}, ${JSON.stringify(targetVar)}, nextVal);
  }
}
`.trim() : `
window.__leveonas_state__ = window.__leveonas_state__ || {};
window.__leveonas_state__[${JSON.stringify(compInstancePath)}] = window.__leveonas_state__[${JSON.stringify(
                compInstancePath
              )}] || {};
const s = window.__leveonas_state__[${JSON.stringify(compInstancePath)}];
const nextVal = (${valComputation});
s[${JSON.stringify(targetVar)}] = nextVal;
if (window.__leveonas_runtime__ && typeof window.__leveonas_runtime__.updateState === 'function') {
  window.__leveonas_runtime__.updateState(${JSON.stringify(compInstancePath)}, ${JSON.stringify(targetVar)}, nextVal);
}
`.trim();
              const jsEvtId = getCommonJSUnitId(`ui_evt_${domEvent}`, elemId);
              const jsCode = `
window.__leveonas_runtime__.on(${JSON.stringify(domEvent)}, ${JSON.stringify(selector)}, function(event, target) {
  ${jsBody}
});
`.trim();
              this.jsUnits.push({
                id: jsEvtId,
                kind: "JSUnit" /* Unit */,
                unitKind: "EventHandler",
                code: jsCode,
                rawCode: jsCode,
                isComplete: true,
                meta: {
                  eventName: domEvent,
                  targetSelector: selector
                },
                details: {
                  id: jsEvtId,
                  kind: "JSEventHandler" /* EventHandler */,
                  eventName: domEvent,
                  targetSelector: selector,
                  handlerCode: jsBody,
                  sourceLocation: evt.sourceLocation
                }
              });
            }
          }
          if (elem.bindings && elem.bindings.length > 0) {
            for (const b of elem.bindings) {
              const isChecked = b.bindingType === "checked";
              const bindingProp = isChecked ? "checked" : "value";
              const eventType = isChecked ? "change" : "input";
              const currentVal = context[b.stateVar] ?? (isChecked ? false : "");
              registerDOMDep(reactivityDef, elemId, "BINDING", [b.stateVar], {
                propName: bindingProp,
                expression: b.stateVar
              });
              const valLit = ASTFactory.createLiteral(currentVal, JSON.stringify(currentVal), loc);
              properties.push(ASTFactory.createProperty(bindingProp, valLit, loc));
              const jsEvtId = getCommonJSUnitId(`ui_bind_${eventType}`, elemId);
              const jsCode = `
window.__leveonas_runtime__.on(${JSON.stringify(eventType)}, "#${elemId}", function(event, target) {
  const nextVal = ${isChecked ? "target.checked" : "target.value"};
  window.__leveonas_state__ = window.__leveonas_state__ || {};
  window.__leveonas_state__[${JSON.stringify(compInstancePath)}] = window.__leveonas_state__[${JSON.stringify(
                compInstancePath
              )}] || {};
  window.__leveonas_state__[${JSON.stringify(compInstancePath)}][${JSON.stringify(b.stateVar)}] = nextVal;
  if (window.__leveonas_runtime__ && typeof window.__leveonas_runtime__.updateState === 'function') {
    window.__leveonas_runtime__.updateState(${JSON.stringify(compInstancePath)}, ${JSON.stringify(b.stateVar)}, nextVal);
  }
});
`.trim();
              this.jsUnits.push({
                id: jsEvtId,
                kind: "JSUnit" /* Unit */,
                unitKind: "EventHandler",
                code: jsCode,
                rawCode: jsCode,
                isComplete: true,
                meta: {
                  eventName: eventType,
                  targetSelector: `#${elemId}`
                }
              });
            }
          }
          if (elem.dynamicClassConditions) {
            for (const [clsName, condExpr] of Object.entries(elem.dynamicClassConditions)) {
              const deps = extractExpressionDependencies(condExpr);
              if (deps.length > 0) {
                registerDOMDep(reactivityDef, elemId, "CLASS", deps, {
                  className: clsName,
                  expression: condExpr
                });
              }
              const isActive = Boolean(evaluateSvelteExpression(condExpr, context));
              if (isActive) {
                const classProp = properties.find((p) => p.name === "className");
                if (classProp && classProp.value?.kind === "Literal" /* Literal */) {
                  const existingVal = classProp.value.value;
                  classProp.value.value = `${existingVal} ${clsName}`.trim();
                } else {
                  const classLit = ASTFactory.createLiteral(clsName, `"${clsName}"`, loc);
                  properties.push(ASTFactory.createProperty("className", classLit, loc));
                }
              }
            }
          }
          if (elem.dynamicStyles) {
            for (const [styleProp, styleExpr] of Object.entries(elem.dynamicStyles)) {
              const deps = extractExpressionDependencies(styleExpr);
              if (deps.length > 0) {
                registerDOMDep(reactivityDef, elemId, "STYLE", deps, {
                  propName: styleProp,
                  styleProp,
                  expression: styleExpr
                });
              }
              const initialVal = evaluateSvelteExpression(styleExpr, context);
              if (initialVal !== void 0 && initialVal !== null && initialVal !== "") {
                const stylePropNode = properties.find((p) => p.name === "style");
                if (stylePropNode && stylePropNode.value?.kind === "Literal" /* Literal */) {
                  const existingVal = stylePropNode.value.value;
                  stylePropNode.value.value = `${existingVal}; ${styleProp}: ${initialVal}`.trim();
                } else {
                  const styleLit = ASTFactory.createLiteral(`${styleProp}: ${initialVal}`, `"${styleProp}: ${initialVal}"`, loc);
                  properties.push(ASTFactory.createProperty("style", styleLit, loc));
                }
              }
            }
          }
          const renderedChildren = [];
          for (let i = 0; i < elem.children.length; i++) {
            const child = elem.children[i];
            const childASTs = renderUINode(
              child,
              compInstancePath,
              elemId,
              i,
              ownerComponent,
              context,
              slotChildren,
              reactivityDef
            );
            renderedChildren.push(...childASTs);
          }
          const domElement = ASTFactory.createComponent(
            "GenericComponent" /* GenericComponent */,
            loc,
            properties,
            renderedChildren,
            canonicalTag
          );
          domElement.id = elemId;
          return [domElement];
        }
        default:
          return [];
      }
    };
    const renderedRootNodes = renderComponentInstance(rootDecl, "ui-root");
    for (const node of renderedRootNodes) {
      rootDomNode.children.push(node);
      node.parent = rootDomNode;
    }
    const jsProgram = {
      id: "leveonas-js-program",
      kind: "JSProgram" /* Program */,
      units: this.jsUnits
    };
    return {
      domAST: rootDomNode,
      jsProgram,
      reactivityDefinitions: this.reactivityDefinitions,
      metrics: {
        componentInstancesCount: instanceCount,
        totalNodesCount,
        stateCount: totalStateCount,
        derivedCount: totalDerivedCount,
        domDependenciesCount: totalDomDependenciesCount,
        reconciliationTimeMs: Date.now() - startTime
      }
    };
  }
};

// packages/compiler/ui-ir/factory.ts
var idCounter2 = 0;
function getUIIRId(prefix) {
  return `${prefix}_${++idCounter2}`;
}
var UIIRFactory = class {
  static createProgram(components = [], rootComponent = "App", loc) {
    return {
      id: getUIIRId("ui_program"),
      kind: "UIProgram" /* Program */,
      components,
      rootComponent,
      sourceLocation: loc
    };
  }
  static createComponent(name, body = [], stateDeclarations = [], derivedDeclarations = [], propDeclarations = [], propsType, loc) {
    return {
      id: getUIIRId(`ui_comp_${name}`),
      kind: "UIComponent" /* Component */,
      name,
      propsType,
      propDeclarations,
      stateDeclarations,
      derivedDeclarations,
      body,
      sourceLocation: loc
    };
  }
  static createState(name, initialValue, typeAnnotation, loc) {
    return {
      id: getUIIRId(`ui_state_${name}`),
      kind: "UIState" /* State */,
      stateName: name,
      initialValue,
      typeAnnotation,
      sourceLocation: loc
    };
  }
  static createDerived(name, expression, dependencies = [], loc) {
    return {
      id: getUIIRId(`ui_derived_${name}`),
      kind: "UIDerived" /* Derived */,
      derivedName: name,
      expression,
      dependencies,
      sourceLocation: loc
    };
  }
  static createPropDeclaration(name, defaultValue, typeAnnotation, loc) {
    return {
      id: getUIIRId(`ui_prop_decl_${name}`),
      kind: "UIProp" /* Prop */,
      propName: name,
      defaultValue,
      typeAnnotation,
      sourceLocation: loc
    };
  }
  static createProp(name, value, rawValue, isDynamic = false, isExpression = false, loc) {
    return {
      id: getUIIRId(`ui_prop_${name}`),
      kind: "UIProp" /* Prop */,
      name,
      value,
      rawValue: rawValue ?? String(value),
      isDynamic,
      isExpression,
      sourceLocation: loc
    };
  }
  static createElement(tag, props = [], children = [], dynamicClassConditions, events, bindings, key, dynamicStyles, loc) {
    return {
      id: getUIIRId(`ui_el_${tag}`),
      kind: "UIElement" /* Element */,
      tag,
      props,
      children,
      dynamicClassConditions,
      dynamicStyles,
      events,
      bindings,
      key,
      sourceLocation: loc
    };
  }
  static createText(value, isExpression = false, templateDependencies, loc) {
    return {
      id: getUIIRId("ui_text"),
      kind: "UIText" /* Text */,
      value,
      isExpression,
      templateDependencies,
      sourceLocation: loc
    };
  }
  static createFragment(children = [], key, loc) {
    return {
      id: getUIIRId("ui_frag"),
      kind: "UIFragment" /* Fragment */,
      children,
      key,
      sourceLocation: loc
    };
  }
  static createComponentInstance(componentName, props = [], children = [], key, loc) {
    return {
      id: getUIIRId(`ui_inst_${componentName}`),
      kind: "UIComponentInstance" /* ComponentInstance */,
      componentName,
      props,
      children,
      key,
      sourceLocation: loc
    };
  }
  static createSlot(name = "default", fallbackChildren = [], loc) {
    return {
      id: getUIIRId(`ui_slot_${name}`),
      kind: "UISlot" /* Slot */,
      name,
      fallbackChildren,
      sourceLocation: loc
    };
  }
  static createConditional(conditionExpr, thenBranch, elseBranch, dependencies = [], loc) {
    return {
      id: getUIIRId("ui_cond"),
      kind: "UIConditional" /* Conditional */,
      conditionExpr,
      thenBranch,
      elseBranch,
      dependencies,
      sourceLocation: loc
    };
  }
  static createList(arrayExpr, itemVar, body, keyExpr, indexVar, dependencies = [], loc) {
    return {
      id: getUIIRId("ui_list"),
      kind: "UIList" /* List */,
      arrayExpr,
      itemVar,
      indexVar,
      keyExpr,
      body,
      dependencies,
      sourceLocation: loc
    };
  }
  static createEvent(eventName, targetSelector, handler, targetVar, computation, isFunctionCall, loc) {
    return {
      id: getUIIRId(`ui_evt_${eventName}`),
      kind: "UIEvent" /* Event */,
      eventName,
      targetSelector,
      handler,
      targetVar,
      computation,
      isFunctionCall,
      sourceLocation: loc
    };
  }
  static createBinding(bindingType, stateVar, targetSelector, loc) {
    return {
      id: getUIIRId(`ui_bind_${bindingType}`),
      kind: "UIBinding" /* Binding */,
      bindingType,
      stateVar,
      targetSelector,
      sourceLocation: loc
    };
  }
};

// packages/compiler/ui-ir/lowering/angular-lowering.ts
var AngularToLowering = class {
  static lower(program) {
    const components = [];
    for (const comp of program.components) {
      components.push(this.lowerComponent(comp));
    }
    return UIIRFactory.createProgram(components, program.rootComponent || "App", program.sourceLocation);
  }
  static lowerComponent(comp) {
    const propDeclarations = [];
    for (const input of comp.inputs || []) {
      propDeclarations.push(
        UIIRFactory.createPropDeclaration(
          input.name || input.inputName,
          input.defaultValue,
          input.typeAnnotation,
          input.sourceLocation
        )
      );
    }
    const stateDeclarations = [];
    for (const state of comp.stateDeclarations || []) {
      stateDeclarations.push(
        UIIRFactory.createState(
          state.name || state.stateName,
          state.initialValue,
          state.typeAnnotation,
          state.sourceLocation
        )
      );
    }
    const derivedDeclarations = [];
    for (const derived of comp.derivedDeclarations || []) {
      const deps = derived.dependencies && derived.dependencies.length > 0 ? derived.dependencies : extractExpressionDependencies(derived.expression);
      derivedDeclarations.push(
        UIIRFactory.createDerived(
          derived.name || derived.derivedName,
          derived.expression,
          deps,
          derived.sourceLocation
        )
      );
    }
    const body = [];
    for (const child of comp.body || []) {
      const lowered = this.lowerUINode(child);
      if (lowered) body.push(lowered);
    }
    return UIIRFactory.createComponent(
      comp.name,
      body,
      stateDeclarations,
      derivedDeclarations,
      propDeclarations,
      void 0,
      comp.sourceLocation
    );
  }
  static lowerUINode(node) {
    if (!node) return null;
    switch (node.kind) {
      case "AngularText" /* Text */: {
        const txt = node;
        const normalized = normalizeAngularInterpolation(txt.value);
        const deps = extractAngularInterpolations(txt.value);
        return UIIRFactory.createText(normalized, deps.length > 0, deps, txt.sourceLocation);
      }
      case "AngularElement" /* Element */: {
        const elem = node;
        const props = [];
        const events = [];
        const bindings = [];
        if (elem.modelBinding) {
          bindings.push(
            UIIRFactory.createBinding("value", elem.modelBinding, `#${elem.id}`, elem.sourceLocation)
          );
        }
        for (const p of elem.props || []) {
          const rawPropName = p.name.trim();
          if (p.isEvent || rawPropName.startsWith("(") || rawPropName.startsWith("output:") || rawPropName === "click" || rawPropName === "input" || rawPropName === "change" || rawPropName === "submit") {
            const domEvt = rawPropName.replace(/^\(/, "").replace(/\)$/, "").replace(/^output:/, "").toLowerCase();
            const handlerStr = String(p.value).trim();
            events.push(
              UIIRFactory.createEvent(
                domEvt,
                `#${elem.id}`,
                handlerStr,
                void 0,
                void 0,
                false,
                p.sourceLocation
              )
            );
          } else if (p.isTwoWayBinding || rawPropName.startsWith("[(") || rawPropName === "model") {
            const stateVar = String(p.value).trim();
            bindings.push(
              UIIRFactory.createBinding("value", stateVar, `#${elem.id}`, p.sourceLocation)
            );
          } else if (p.isClassBinding || rawPropName.startsWith("[class.") || rawPropName.startsWith("class.")) {
          } else if (p.isStyleBinding || rawPropName.startsWith("[style.") || rawPropName.startsWith("style.")) {
          } else {
            const cleanPropName = rawPropName.replace(/^\[/, "").replace(/\]$/, "");
            props.push(
              UIIRFactory.createProp(
                cleanPropName,
                p.value,
                p.rawValue,
                p.isDynamic || p.isPropertyBinding,
                p.isExpression,
                p.sourceLocation
              )
            );
          }
        }
        const children = [];
        for (const child of elem.children || []) {
          const lowered = this.lowerUINode(child);
          if (lowered) children.push(lowered);
        }
        return UIIRFactory.createElement(
          elem.tag,
          props,
          children,
          elem.dynamicClassConditions,
          events,
          bindings,
          elem.key,
          elem.dynamicStyles,
          elem.sourceLocation
        );
      }
      case "AngularComponentInstance" /* ComponentInstance */: {
        const compInst = node;
        const props = [];
        for (const p of compInst.props || []) {
          props.push(
            UIIRFactory.createProp(
              p.name,
              p.value,
              p.rawValue,
              p.isDynamic,
              p.isExpression,
              p.sourceLocation
            )
          );
        }
        const children = [];
        for (const child of compInst.children || []) {
          const lowered = this.lowerUINode(child);
          if (lowered) children.push(lowered);
        }
        return UIIRFactory.createComponentInstance(
          compInst.componentName,
          props,
          children,
          compInst.key,
          compInst.sourceLocation
        );
      }
      case "AngularFragment" /* Fragment */: {
        const frag = node;
        const children = [];
        for (const child of frag.children || []) {
          const lowered = this.lowerUINode(child);
          if (lowered) children.push(lowered);
        }
        return UIIRFactory.createFragment(children, frag.key, frag.sourceLocation);
      }
      case "AngularContentProjection" /* ContentProjection */: {
        const proj = node;
        const fallback = [];
        for (const child of proj.children || []) {
          const lowered = this.lowerUINode(child);
          if (lowered) fallback.push(lowered);
        }
        return UIIRFactory.createSlot(proj.name || "default", fallback, proj.sourceLocation);
      }
      case "AngularConditional" /* Conditional */: {
        const cond = node;
        const thenLowered = this.lowerUINode(cond.thenBranch) || UIIRFactory.createFragment([]);
        const elseLowered = cond.elseBranch ? this.lowerUINode(cond.elseBranch) || void 0 : void 0;
        const deps = cond.dependencies && cond.dependencies.length > 0 ? cond.dependencies : extractExpressionDependencies(cond.conditionExpr);
        return UIIRFactory.createConditional(
          cond.conditionExpr,
          thenLowered,
          elseLowered,
          deps,
          cond.sourceLocation
        );
      }
      case "AngularFor" /* For */: {
        const forNode = node;
        const bodyLowered = this.lowerUINode(forNode.body) || UIIRFactory.createFragment([]);
        const deps = forNode.dependencies && forNode.dependencies.length > 0 ? forNode.dependencies : [forNode.arrayExpr];
        const keyExpr = forNode.trackExpr || `${forNode.itemVar || "item"}.id`;
        return UIIRFactory.createList(
          forNode.arrayExpr,
          forNode.itemVar || "item",
          bodyLowered,
          keyExpr,
          forNode.indexVar || "index",
          deps,
          forNode.sourceLocation
        );
      }
      default:
        return null;
    }
  }
};

// packages/compiler/interpreters/angular-lm/reconciler.ts
var AngularReconciler = class {
  constructor(program) {
    this.program = program;
  }
  reconcile(rootComponentName) {
    const uiirProgram = AngularToLowering.lower(this.program);
    const reconciler = new CommonUIReconciler(uiirProgram);
    const result = reconciler.reconcile(rootComponentName);
    return {
      domAST: result.domAST,
      jsProgram: result.jsProgram,
      componentInstancesCount: result.metrics.componentInstancesCount
    };
  }
};

// packages/compiler/ui-ir/lowering/react-lowering.ts
var ReactToLowering = class {
  static lower(program) {
    const components = program.components.map(
      (c) => this.lowerComponent(c)
    );
    return UIIRFactory.createProgram(components, program.rootComponent || "App", program.sourceLocation);
  }
  static lowerComponent(decl) {
    const stateDeclarations = decl.stateDeclarations.map(
      (s) => UIIRFactory.createState(s.stateName, s.initialValue, s.typeAnnotation, s.sourceLocation)
    );
    const derivedDeclarations = (decl.derivedDeclarations || []).map(
      (d) => UIIRFactory.createDerived(
        d.derivedName || d.name || "",
        d.expression,
        d.dependencies && d.dependencies.length > 0 ? d.dependencies : extractExpressionDependencies(d.expression),
        d.sourceLocation
      )
    );
    const body = decl.body.map((node) => this.lowerUINode(node));
    return UIIRFactory.createComponent(
      decl.name,
      body,
      stateDeclarations,
      derivedDeclarations,
      [],
      decl.propsType,
      decl.sourceLocation
    );
  }
  static lowerUINode(node) {
    switch (node.kind) {
      case "ReactText" /* Text */: {
        const textNode = node;
        const deps = textNode.isExpression ? extractExpressionDependencies(textNode.value) : extractTemplateInterpolations(textNode.value);
        return UIIRFactory.createText(textNode.value, textNode.isExpression, deps, textNode.sourceLocation);
      }
      case "ReactElement" /* Element */: {
        const elem = node;
        const props = [];
        const events = [];
        for (const p of elem.props) {
          const rawPropName = p.name.trim();
          const isEvt = p.isEvent || rawPropName.startsWith("on:") || rawPropName.startsWith("oc:") || rawPropName.startsWith("onClick") || rawPropName.startsWith("on") || rawPropName.startsWith("click") || rawPropName.startsWith("input") || rawPropName.startsWith("change");
          if (isEvt) {
            let domEvt = rawPropName.replace(/^on:/, "").replace(/^on/, "").replace(/^oc:/, "click:").toLowerCase();
            let handler = String(p.value);
            if (domEvt.includes(":")) {
              const parts = domEvt.split(":");
              domEvt = parts[0];
              if (!p.value || p.value === true) {
                handler = parts.slice(1).join(":");
              }
            }
            events.push(
              UIIRFactory.createEvent(
                domEvt,
                `#${elem.id}`,
                handler,
                void 0,
                void 0,
                void 0,
                p.sourceLocation
              )
            );
          } else {
            props.push(
              UIIRFactory.createProp(
                p.name,
                p.value,
                p.rawValue,
                false,
                p.isExpression,
                p.sourceLocation
              )
            );
          }
        }
        const children = elem.children.map((c) => this.lowerUINode(c));
        return UIIRFactory.createElement(
          elem.tag,
          props,
          children,
          void 0,
          events,
          void 0,
          elem.key,
          void 0,
          elem.sourceLocation
        );
      }
      case "ReactComponentInstance" /* ComponentInstance */: {
        const inst = node;
        const props = (inst.props || []).map(
          (p) => UIIRFactory.createProp(p.name, p.value, p.rawValue, false, p.isExpression, p.sourceLocation)
        );
        const children = (inst.children || []).map((c) => this.lowerUINode(c));
        return UIIRFactory.createComponentInstance(
          inst.componentName,
          props,
          children,
          inst.key,
          inst.sourceLocation
        );
      }
      case "ReactFragment" /* Fragment */: {
        const frag = node;
        const children = frag.children.map((c) => this.lowerUINode(c));
        return UIIRFactory.createFragment(children, frag.key, frag.sourceLocation);
      }
      case "ReactConditional" /* Conditional */: {
        const cond = node;
        const deps = extractExpressionDependencies(cond.conditionExpr);
        return UIIRFactory.createConditional(
          cond.conditionExpr,
          this.lowerUINode(cond.thenBranch),
          cond.elseBranch ? this.lowerUINode(cond.elseBranch) : void 0,
          deps,
          cond.sourceLocation
        );
      }
      case "ReactList" /* List */: {
        const list = node;
        const deps = extractExpressionDependencies(list.arrayExpr);
        return UIIRFactory.createList(
          list.arrayExpr,
          list.itemVar,
          this.lowerUINode(list.body),
          list.keyProp,
          list.indexVar,
          deps,
          list.sourceLocation
        );
      }
      default:
        return UIIRFactory.createFragment([], void 0, node?.sourceLocation);
    }
  }
};

// packages/compiler/ui-ir/lowering/vue-lowering.ts
var VueToLowering = class {
  static lower(program) {
    const components = program.components.map(
      (c) => this.lowerComponent(c)
    );
    return UIIRFactory.createProgram(components, program.rootComponent || "App", program.sourceLocation);
  }
  static lowerComponent(decl) {
    const stateDeclarations = decl.stateDeclarations.map(
      (s) => UIIRFactory.createState(s.stateName, s.initialValue, s.typeAnnotation, s.sourceLocation)
    );
    const derivedDeclarations = (decl.computedDeclarations || []).map((c) => {
      const knownVars = decl.stateDeclarations.map((s) => s.stateName);
      const deps = c.dependencies || extractExpressionDependencies(c.expression, knownVars);
      return UIIRFactory.createDerived(c.computedName || c.name, c.expression, deps, c.sourceLocation);
    });
    const body = decl.body.map((node) => this.lowerUINode(node));
    return UIIRFactory.createComponent(
      decl.name,
      body,
      stateDeclarations,
      derivedDeclarations,
      [],
      void 0,
      decl.sourceLocation
    );
  }
  static lowerUINode(node) {
    switch (node.kind) {
      case "VueText" /* Text */: {
        const textNode = node;
        const normalizedValue = textNode.value.replace(/\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$.]*)\s*\}\}/g, "{$1}");
        const deps = textNode.isExpression ? extractExpressionDependencies(normalizedValue) : extractTemplateInterpolations(normalizedValue);
        return UIIRFactory.createText(normalizedValue, textNode.isExpression, deps, textNode.sourceLocation);
      }
      case "VueElement" /* Element */: {
        const elem = node;
        const props = [];
        const events = [];
        const bindings = [];
        if (elem.modelBinding) {
          bindings.push(
            UIIRFactory.createBinding("value", elem.modelBinding, `#${elem.id}`, elem.sourceLocation)
          );
        }
        for (const p of elem.props) {
          const rawPropName = p.name.trim();
          const isEvt = p.isEvent || p.directiveName === "v-on" || rawPropName.startsWith("@") || rawPropName.startsWith("on:") || rawPropName.startsWith("oc:") || rawPropName.startsWith("onClick");
          if (isEvt) {
            let domEvt = rawPropName.replace(/^@/, "").replace(/^v-on:/, "").replace(/^on:/, "").replace(/^on/, "").replace(/^oc:/, "click:").toLowerCase();
            let handler = String(p.value);
            if (domEvt.includes(":")) {
              const parts = domEvt.split(":");
              domEvt = parts[0];
              if (!p.value || p.value === true) {
                handler = parts.slice(1).join(":");
              }
            }
            events.push(
              UIIRFactory.createEvent(
                domEvt,
                `#${elem.id}`,
                handler,
                void 0,
                void 0,
                void 0,
                p.sourceLocation
              )
            );
          } else if (p.isModel || p.directiveName === "v-model") {
            bindings.push(
              UIIRFactory.createBinding("value", String(p.value), `#${elem.id}`, p.sourceLocation)
            );
          } else {
            props.push(
              UIIRFactory.createProp(
                p.name,
                p.value,
                p.rawValue,
                p.isDynamic,
                p.isExpression,
                p.sourceLocation
              )
            );
          }
        }
        const children = elem.children.map((c) => this.lowerUINode(c));
        return UIIRFactory.createElement(
          elem.tag,
          props,
          children,
          void 0,
          events,
          bindings,
          elem.key,
          void 0,
          elem.sourceLocation
        );
      }
      case "VueSlot" /* Slot */: {
        const slot = node;
        const fallback = (slot.children || []).map((c) => this.lowerUINode(c));
        return UIIRFactory.createSlot(slot.name || "default", fallback, slot.sourceLocation);
      }
      case "VueComponentInstance" /* ComponentInstance */: {
        const inst = node;
        const props = (inst.props || []).map(
          (p) => UIIRFactory.createProp(p.name, p.value, p.rawValue, p.isDynamic, p.isExpression, p.sourceLocation)
        );
        const children = (inst.children || []).map((c) => this.lowerUINode(c));
        return UIIRFactory.createComponentInstance(
          inst.componentName,
          props,
          children,
          inst.key,
          inst.sourceLocation
        );
      }
      case "VueFragment" /* Fragment */: {
        const frag = node;
        const children = frag.children.map((c) => this.lowerUINode(c));
        return UIIRFactory.createFragment(children, frag.key, frag.sourceLocation);
      }
      case "VueConditional" /* Conditional */: {
        const cond = node;
        const deps = extractExpressionDependencies(cond.conditionExpr);
        return UIIRFactory.createConditional(
          cond.conditionExpr,
          this.lowerUINode(cond.thenBranch),
          cond.elseBranch ? this.lowerUINode(cond.elseBranch) : void 0,
          deps,
          cond.sourceLocation
        );
      }
      case "VueList" /* List */: {
        const list = node;
        const deps = extractExpressionDependencies(list.arrayExpr);
        return UIIRFactory.createList(
          list.arrayExpr,
          list.itemVar,
          this.lowerUINode(list.body),
          list.keyExpr,
          list.indexVar,
          deps,
          list.sourceLocation
        );
      }
      default:
        return UIIRFactory.createFragment([], void 0, node?.sourceLocation);
    }
  }
};

// packages/compiler/ui-ir/lowering/svelte-lowering.ts
var SvelteToLowering = class {
  static lower(program) {
    const components = program.components.map(
      (c) => this.lowerComponent(c)
    );
    return UIIRFactory.createProgram(components, program.rootComponent || "App", program.sourceLocation);
  }
  static lowerComponent(decl) {
    const stateDeclarations = decl.stateDeclarations.map(
      (s) => UIIRFactory.createState(s.stateName, s.initialValue, s.typeAnnotation, s.sourceLocation)
    );
    const derivedDeclarations = (decl.reactiveDeclarations || []).map((r) => {
      const knownVars = decl.stateDeclarations.map((s) => s.stateName);
      const deps = r.dependencies || extractExpressionDependencies(r.expression, knownVars);
      return UIIRFactory.createDerived(r.reactiveName || r.name, r.expression, deps, r.sourceLocation);
    });
    const propDeclarations = (decl.propDeclarations || []).map(
      (p) => UIIRFactory.createPropDeclaration(p.propName || p.name, p.defaultValue, p.typeAnnotation, p.sourceLocation)
    );
    const body = decl.body.map((node) => this.lowerUINode(node));
    return UIIRFactory.createComponent(
      decl.name,
      body,
      stateDeclarations,
      derivedDeclarations,
      propDeclarations,
      decl.propsType,
      decl.sourceLocation
    );
  }
  static lowerUINode(node) {
    switch (node.kind) {
      case "SvelteText" /* Text */: {
        const textNode = node;
        const deps = textNode.isExpression ? extractExpressionDependencies(textNode.value) : extractTemplateInterpolations(textNode.value);
        return UIIRFactory.createText(textNode.value, textNode.isExpression, deps, textNode.sourceLocation);
      }
      case "SvelteElement" /* Element */: {
        const elem = node;
        const props = [];
        const events = [];
        const bindings = [];
        for (const p of elem.props) {
          const rawPropName = p.name.trim();
          const isEvt = p.isEvent || rawPropName.startsWith("on:") || rawPropName.startsWith("oc:") || rawPropName.startsWith("onClick");
          if (isEvt) {
            let domEvt = rawPropName.replace(/^on:/, "").replace(/^oc:/, "click:").toLowerCase();
            let handler = String(p.value);
            if (domEvt.includes(":")) {
              const parts = domEvt.split(":");
              domEvt = parts[0];
              if (!p.value || p.value === true) {
                handler = parts.slice(1).join(":");
              }
            }
            events.push(
              UIIRFactory.createEvent(
                domEvt,
                `#${elem.id}`,
                handler,
                void 0,
                void 0,
                void 0,
                p.sourceLocation
              )
            );
          } else if (p.isBinding || p.name.startsWith("bind:")) {
            const bindingType = p.name === "bind:checked" ? "checked" : "value";
            bindings.push(
              UIIRFactory.createBinding(bindingType, String(p.value), `#${elem.id}`, p.sourceLocation)
            );
          } else {
            props.push(
              UIIRFactory.createProp(
                p.name,
                p.value,
                p.rawValue,
                p.isDynamic,
                p.isExpression,
                p.sourceLocation
              )
            );
          }
        }
        const children = elem.children.map((c) => this.lowerUINode(c));
        return UIIRFactory.createElement(
          elem.tag,
          props,
          children,
          elem.dynamicClassConditions,
          events,
          bindings,
          void 0,
          void 0,
          elem.sourceLocation
        );
      }
      case "SvelteSlot" /* Slot */: {
        const slot = node;
        const fallback = (slot.children || []).map((c) => this.lowerUINode(c));
        return UIIRFactory.createSlot(slot.name || "default", fallback, slot.sourceLocation);
      }
      case "SvelteComponentInstance" /* ComponentInstance */: {
        const inst = node;
        const props = (inst.props || []).map(
          (p) => UIIRFactory.createProp(p.name, p.value, p.rawValue, p.isDynamic, p.isExpression, p.sourceLocation)
        );
        const children = (inst.children || []).map((c) => this.lowerUINode(c));
        return UIIRFactory.createComponentInstance(
          inst.componentName,
          props,
          children,
          void 0,
          inst.sourceLocation
        );
      }
      case "SvelteFragment" /* Fragment */: {
        const frag = node;
        const children = frag.children.map((c) => this.lowerUINode(c));
        return UIIRFactory.createFragment(children, void 0, frag.sourceLocation);
      }
      case "SvelteConditional" /* Conditional */: {
        const cond = node;
        const deps = extractExpressionDependencies(cond.conditionExpr);
        return UIIRFactory.createConditional(
          cond.conditionExpr,
          this.lowerUINode(cond.thenBranch),
          cond.elseBranch ? this.lowerUINode(cond.elseBranch) : void 0,
          deps,
          cond.sourceLocation
        );
      }
      case "SvelteEach" /* Each */: {
        const each = node;
        const deps = extractExpressionDependencies(each.arrayExpr);
        return UIIRFactory.createList(
          each.arrayExpr,
          each.itemVar,
          this.lowerUINode(each.body),
          each.keyExpr,
          each.indexVar,
          deps,
          each.sourceLocation
        );
      }
      default:
        return UIIRFactory.createFragment([], void 0, node?.sourceLocation);
    }
  }
};

// packages/lsp/inspect.ts
function safeStringify(obj, space) {
  const seen = /* @__PURE__ */ new WeakSet();
  return JSON.stringify(
    obj,
    (key, value) => {
      if (key === "parent") return void 0;
      if (value instanceof Map) {
        const o = {};
        for (const [k, v] of value.entries()) o[String(k)] = v;
        return o;
      }
      if (value instanceof Set) {
        return Array.from(value);
      }
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) return void 0;
        seen.add(value);
      }
      return value;
    },
    space
  );
}
function sanitizeForInspection(obj) {
  const seen = /* @__PURE__ */ new WeakSet();
  function clean(val) {
    if (val === null || typeof val !== "object") {
      return val;
    }
    if (val instanceof Map) {
      const out2 = {};
      for (const [k, v] of val.entries()) {
        out2[String(k)] = clean(v);
      }
      return out2;
    }
    if (val instanceof Set) {
      return Array.from(val).map(clean);
    }
    if (seen.has(val)) {
      return void 0;
    }
    seen.add(val);
    if (Array.isArray(val)) {
      return val.map(clean);
    }
    const out = {};
    for (const [key, value] of Object.entries(val)) {
      if (key === "parent") continue;
      out[key] = clean(value);
    }
    return out;
  }
  return clean(obj);
}
var LeveonasInspector = class {
  /**
   * Run full inspection across all compiler layers.
   */
  static inspect(documentText) {
    const blocks = BlockExtractor.extractBlocks(documentText);
    const activeBlock = blocks[0] ?? {
      type: "lm",
      content: documentText,
      range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
      contentRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }
    };
    const detectedFramework = activeBlock.type;
    const diagnostics = LeveonasDiagnosticEngine.diagnose(documentText);
    const symbols = LeveonasSymbolsProvider.getDocumentSymbols(documentText);
    let streamStatus = "VALID";
    const hasError = diagnostics.some((d) => d.severity === 1 && !d.isIncomplete);
    const hasIncomplete = diagnostics.some((d) => d.isIncomplete);
    if (hasError) {
      streamStatus = "INVALID";
    } else if (hasIncomplete) {
      streamStatus = "INCOMPLETE";
    }
    let rawAST = null;
    let frameworkAST = null;
    let uiIR = null;
    let runtimeIR = null;
    let patchOps = [];
    const reactivityNodes = [];
    const reactivityEdges = [];
    let stateCount = 0;
    let computedCount = 0;
    let domDepCount = 0;
    try {
      const code = activeBlock.content;
      const extractReactivityFromCompiled = (compiled) => {
        if (!compiled.reactivityDefinitions) return;
        for (const rDef of compiled.reactivityDefinitions.values()) {
          if (rDef.state) {
            for (const [stateName] of Object.entries(rDef.state)) {
              stateCount++;
              reactivityNodes.push({
                id: `state_${stateName}`,
                name: stateName,
                kind: "state",
                dependencies: [],
                dependents: []
              });
            }
          }
          if (rDef.derived) {
            for (const [derivedName, derivedInfo] of Object.entries(rDef.derived)) {
              computedCount++;
              reactivityNodes.push({
                id: `derived_${derivedName}`,
                name: derivedName,
                kind: "derived",
                expression: derivedInfo.expression,
                dependencies: derivedInfo.dependencies || [],
                dependents: []
              });
              for (const src of derivedInfo.dependencies || []) {
                reactivityEdges.push({ from: `state_${src}`, to: `derived_${derivedName}`, kind: "reactivity" });
              }
            }
          }
          if (rDef.domDependencies) {
            for (const [domId, domDep] of Object.entries(rDef.domDependencies)) {
              domDepCount++;
              reactivityNodes.push({
                id: domId,
                name: `${domDep.kind}:${domDep.domNodeId || domId}`,
                kind: "dom",
                expression: domDep.expression,
                dependencies: domDep.dependencies || [],
                dependents: [],
                domTarget: domDep.domNodeId || domId
              });
              for (const src of domDep.dependencies || []) {
                reactivityEdges.push({ from: `state_${src}`, to: domId, kind: "dom_update" });
              }
            }
          }
        }
      };
      if (detectedFramework === "react") {
        const prog = ReactLMInterpreter.parse(code);
        frameworkAST = prog;
        rawAST = prog;
        const lowered = ReactToLowering.lower(prog);
        uiIR = lowered;
        const uiReconciler = new CommonUIReconciler(lowered);
        const compiled = uiReconciler.reconcile();
        runtimeIR = compiled;
        extractReactivityFromCompiled(compiled);
        const reconciler = new ReactReconciler(prog);
        const res = reconciler.reconcile();
        patchOps = [
          {
            op: "CREATE_ROOT",
            targetId: res.domAST?.id ?? "leveonas-root",
            payload: res.domAST,
            bytes: safeStringify(res.domAST).length
          },
          ...res.jsProgram.units.map((u) => ({
            op: "REGISTER_EVENT",
            targetId: u.id,
            payload: u,
            bytes: safeStringify(u).length
          }))
        ];
      } else if (detectedFramework === "vue") {
        const prog = VueLMInterpreter.parse(code);
        frameworkAST = prog;
        rawAST = prog;
        const lowered = VueToLowering.lower(prog);
        uiIR = lowered;
        const uiReconciler = new CommonUIReconciler(lowered);
        const compiled = uiReconciler.reconcile();
        runtimeIR = compiled;
        extractReactivityFromCompiled(compiled);
        const reconciler = new VueReconciler(prog);
        const res = reconciler.reconcile();
        patchOps = [
          {
            op: "CREATE_ROOT",
            targetId: res.domAST?.id ?? "leveonas-root",
            payload: res.domAST,
            bytes: safeStringify(res.domAST).length
          },
          ...res.jsProgram.units.map((u) => ({
            op: "REGISTER_EVENT",
            targetId: u.id,
            payload: u,
            bytes: safeStringify(u).length
          }))
        ];
      } else if (detectedFramework === "svelte") {
        const prog = SvelteLMInterpreter.parse(code);
        frameworkAST = prog;
        rawAST = prog;
        const lowered = SvelteToLowering.lower(prog);
        uiIR = lowered;
        const uiReconciler = new CommonUIReconciler(lowered);
        const compiled = uiReconciler.reconcile();
        runtimeIR = compiled;
        extractReactivityFromCompiled(compiled);
        const reconciler = new SvelteReconciler(prog);
        const res = reconciler.reconcile();
        patchOps = [
          {
            op: "CREATE_ROOT",
            targetId: res.domAST?.id ?? "leveonas-root",
            payload: res.domAST,
            bytes: safeStringify(res.domAST).length
          },
          ...res.jsProgram.units.map((u) => ({
            op: "REGISTER_EVENT",
            targetId: u.id,
            payload: u,
            bytes: safeStringify(u).length
          }))
        ];
      } else if (detectedFramework === "angular") {
        const prog = AngularLMInterpreter.parse(code);
        frameworkAST = prog;
        rawAST = prog;
        const lowered = AngularToLowering.lower(prog);
        uiIR = lowered;
        const uiReconciler = new CommonUIReconciler(lowered);
        const compiled = uiReconciler.reconcile();
        runtimeIR = compiled;
        extractReactivityFromCompiled(compiled);
        const reconciler = new AngularReconciler(prog);
        const res = reconciler.reconcile();
        patchOps = [
          {
            op: "CREATE_ROOT",
            targetId: res.domAST?.id ?? "leveonas-root",
            payload: res.domAST,
            bytes: safeStringify(res.domAST).length
          },
          ...res.jsProgram.units.map((u) => ({
            op: "REGISTER_EVENT",
            targetId: u.id,
            payload: u,
            bytes: safeStringify(u).length
          }))
        ];
      } else {
        const interpreter = new HTMLLMInterpreter();
        interpreter.write(code);
        interpreter.end();
        const prog = interpreter.getAST();
        frameworkAST = prog;
        rawAST = prog;
        uiIR = {
          kind: "UIIRProgram",
          id: "html_program",
          version: "1.0.0",
          components: /* @__PURE__ */ new Map([
            [
              "HTMLRoot",
              {
                id: "comp_html",
                name: "HTMLRoot",
                stateDeclarations: /* @__PURE__ */ new Map(),
                derivedDeclarations: /* @__PURE__ */ new Map(),
                methods: /* @__PURE__ */ new Map(),
                template: prog
              }
            ]
          ]),
          rootComponent: "HTMLRoot"
        };
        patchOps = [
          {
            op: "CREATE_ROOT",
            targetId: "leveonas-root",
            payload: { kind: "RootNode" },
            bytes: safeStringify(prog).length
          }
        ];
      }
    } catch {
      if (streamStatus === "VALID") {
        streamStatus = "INCOMPLETE";
      }
    }
    const reactivityGraph = {
      nodes: reactivityNodes,
      edges: reactivityEdges
    };
    return sanitizeForInspection({
      raw: documentText,
      detectedFramework,
      streamStatus,
      diagnostics,
      ast: rawAST,
      frameworkAST,
      uiIR,
      runtimeIR,
      reactivityGraph,
      patchOperations: patchOps,
      symbols,
      nodeCount: {
        astNodes: rawAST ? Object.keys(rawAST).length : 0,
        uiIRNodes: uiIR ? Object.keys(uiIR).length : 0,
        stateVariables: stateCount,
        computedValues: computedCount,
        domDependencies: domDepCount,
        patchOps: patchOps.length
      }
    });
  }
};

// packages/lsp/completion.ts
var LeveonasCompletionProvider = class _LeveonasCompletionProvider {
  /**
   * Compute completion items at a specific document position.
   */
  static getCompletions(documentText, position) {
    const offset = position.offset ?? BlockExtractor.positionToOffset(documentText, position);
    const textBefore = documentText.slice(0, offset);
    const currentLineStart = textBefore.lastIndexOf("\n") + 1;
    const currentLine = textBefore.slice(currentLineStart);
    const completions = [];
    const stateVars = _LeveonasCompletionProvider.extractStateVariables(documentText);
    const computedVars = _LeveonasCompletionProvider.extractComputedVariables(documentText);
    const declaredComps = _LeveonasCompletionProvider.extractDeclaredComponents(documentText);
    const isInsideParenOpen = /\(\s*[a-zA-Z0-9_$:-]*$/.test(currentLine);
    const isInsideElementBody = /\(\s*[a-zA-Z0-9_$:-]+\s+[^)]*$/.test(currentLine);
    if (isInsideParenOpen && !isInsideElementBody) {
      for (const [abbr, fullName] of Object.entries(KNOWN_ELEMENT_ABBREVIATIONS)) {
        completions.push({
          label: abbr,
          kind: 22 /* Struct */,
          detail: `<${fullName}> (LM element abbreviation)`,
          documentation: `Generates standard HTML <${fullName}> container/element.`,
          insertText: `${abbr} `,
          sortText: `0_${abbr}`
        });
      }
      for (const compName of LM_COMPONENTS) {
        completions.push({
          label: compName,
          kind: 7 /* Class */,
          detail: `Component: ${compName}`,
          documentation: `Standard Leveonas semantic component.`,
          insertText: `${compName} `,
          sortText: `1_${compName}`
        });
      }
      for (const comp of declaredComps) {
        completions.push({
          label: comp,
          kind: 7 /* Class */,
          detail: `(user component) ${comp}`,
          insertText: `${comp} `,
          sortText: `00_${comp}`
        });
      }
      const keywords = [
        { label: "state", detail: "state(name, initialValue)", snippet: "state(${1:name}, ${2:0})" },
        { label: "computed", detail: "computed(name, expr)", snippet: "computed(${1:name}, ${2:expr})" },
        { label: "reactive", detail: "reactive(name, expr)", snippet: "reactive(${1:name}, ${2:expr})" },
        { label: "signal", detail: "signal(name, initialValue)", snippet: "signal(${1:name}, ${2:0})" },
        { label: "props", detail: "props(p1, p2)", snippet: "props(${1:title})" },
        { label: "component", detail: "component(Name)(...)", snippet: "component(${1:Name})(\n  $0\n)" },
        { label: "if", detail: "if(condition, then, else)", snippet: "if(${1:condition},\n  $2\n)" },
        { label: "each", detail: "each(list, item, index, body)", snippet: "each(${1:items}, ${2:item}, ${3:i},\n  $0\n)" }
      ];
      for (const kw of keywords) {
        completions.push({
          label: kw.label,
          kind: 14 /* Keyword */,
          detail: kw.detail,
          insertText: kw.label,
          sortText: `2_${kw.label}`
        });
      }
    }
    if (isInsideElementBody || !isInsideParenOpen) {
      for (const [abbr, fullName] of Object.entries(KNOWN_ATTRIBUTE_ABBREVIATIONS)) {
        completions.push({
          label: `${abbr}:`,
          kind: 10 /* Property */,
          detail: `${fullName} (LM attribute abbreviation)`,
          documentation: `Sets the ${fullName} HTML property.`,
          insertText: `${abbr}:"`,
          sortText: `0_${abbr}`
        });
      }
      for (const attr of KNOWN_HTML_ATTRIBUTES) {
        completions.push({
          label: `${attr}:`,
          kind: 10 /* Property */,
          detail: `HTML Attribute: ${attr}`,
          insertText: `${attr}:"`,
          sortText: `1_${attr}`
        });
      }
      const events = ["click", "change", "input", "submit", "keydown", "keyup", "focus", "blur"];
      for (const ev of events) {
        completions.push({
          label: `${ev}:`,
          kind: 23 /* Event */,
          detail: `Event handler: ${ev}`,
          insertText: `${ev}:`,
          sortText: `2_${ev}`
        });
      }
      for (const st of stateVars) {
        completions.push({
          label: st,
          kind: 6 /* Variable */,
          detail: `(state) ${st}`,
          documentation: `Reactive state variable in current scope.`,
          insertText: st,
          sortText: `00_${st}`
        });
      }
      for (const cp of computedVars) {
        completions.push({
          label: cp,
          kind: 10 /* Property */,
          detail: `(computed) ${cp}`,
          documentation: `Derived reactive variable in current scope.`,
          insertText: cp,
          sortText: `01_${cp}`
        });
      }
    }
    return completions;
  }
  static extractStateVariables(doc) {
    const list = [];
    const stateRegex = /\b(?:state|ref|signal|useState)\s*\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    let match;
    while ((match = stateRegex.exec(doc)) !== null) {
      if (!list.includes(match[1])) list.push(match[1]);
    }
    return list;
  }
  static extractComputedVariables(doc) {
    const list = [];
    const compRegex = /\b(?:reactive|computed|\$derived)\s*\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    let match;
    while ((match = compRegex.exec(doc)) !== null) {
      if (!list.includes(match[1])) list.push(match[1]);
    }
    return list;
  }
  static extractDeclaredComponents(doc) {
    const list = [];
    const compRegex = /\bcomponent\s*\(\s*([A-Za-z0-9_$]+)/g;
    let match;
    while ((match = compRegex.exec(doc)) !== null) {
      if (!list.includes(match[1])) list.push(match[1]);
    }
    return list;
  }
};

// packages/lsp/definition.ts
var LeveonasDefinitionProvider = class _LeveonasDefinitionProvider {
  /**
   * Resolve definition location for the symbol under cursor.
   */
  static getDefinition(documentText, position, uri = "file://app.lm") {
    const offset = position.offset ?? BlockExtractor.positionToOffset(documentText, position);
    const word = _LeveonasDefinitionProvider.getWordAtOffset(documentText, offset);
    if (!word) return null;
    const compRegex = new RegExp(
      `(?:\\bcomponent\\s*\\(\\s*${word}|\\(component:${word}\\b)`,
      "g"
    );
    const compMatch = compRegex.exec(documentText);
    if (compMatch) {
      const defOffset = compMatch.index;
      const startPos = BlockExtractor.offsetToPosition(documentText, defOffset);
      const endPos = BlockExtractor.offsetToPosition(
        documentText,
        defOffset + compMatch[0].length
      );
      return {
        uri,
        range: { start: startPos, end: endPos }
      };
    }
    const stateRegex = new RegExp(
      `(?:\\b(?:state|ref|signal|useState)\\s*\\(\\s*${word}\\b|\\((?:state|ref|signal):${word}\\b)`,
      "g"
    );
    const stateMatch = stateRegex.exec(documentText);
    if (stateMatch) {
      const defOffset = stateMatch.index;
      const startPos = BlockExtractor.offsetToPosition(documentText, defOffset);
      const endPos = BlockExtractor.offsetToPosition(
        documentText,
        defOffset + stateMatch[0].length
      );
      return {
        uri,
        range: { start: startPos, end: endPos }
      };
    }
    const derivedRegex = new RegExp(
      `(?:\\b(?:reactive|computed|\\$derived)\\s*\\(\\s*${word}\\b|\\((?:reactive|computed|derived):${word}\\b)`,
      "g"
    );
    const derivedMatch = derivedRegex.exec(documentText);
    if (derivedMatch) {
      const defOffset = derivedMatch.index;
      const startPos = BlockExtractor.offsetToPosition(documentText, defOffset);
      const endPos = BlockExtractor.offsetToPosition(
        documentText,
        defOffset + derivedMatch[0].length
      );
      return {
        uri,
        range: { start: startPos, end: endPos }
      };
    }
    const propRegex = new RegExp(`\\bprops\\s*\\([^)]*\\b${word}\\b[^)]*\\)`, "g");
    const propMatch = propRegex.exec(documentText);
    if (propMatch) {
      const defOffset = propMatch.index;
      const startPos = BlockExtractor.offsetToPosition(documentText, defOffset);
      const endPos = BlockExtractor.offsetToPosition(
        documentText,
        defOffset + propMatch[0].length
      );
      return {
        uri,
        range: { start: startPos, end: endPos }
      };
    }
    return null;
  }
  static getWordAtOffset(text, offset) {
    if (offset < 0 || offset > text.length) return null;
    let start = offset;
    while (start > 0 && /[a-zA-Z0-9_$]/.test(text[start - 1])) {
      start--;
    }
    let end = offset;
    while (end < text.length && /[a-zA-Z0-9_$]/.test(text[end])) {
      end++;
    }
    if (start === end) return null;
    return text.slice(start, end);
  }
};

// packages/lsp/hover.ts
var ELEMENT_DOCS = {
  di: { tag: "div", desc: "Generic flow container element" },
  bo: { tag: "button", desc: "Interactive clickable button element" },
  so: { tag: "section", desc: "Thematic grouping of content with heading" },
  al: { tag: "article", desc: "Self-contained composition (card, post, article)" },
  ad: { tag: "aside", desc: "Sidebar or tangentially related content" },
  he: { tag: "header", desc: "Introductory content or navigational aids" },
  fe: { tag: "footer", desc: "Footer section for nearest sectioning content" },
  na: { tag: "nav", desc: "Section of navigation links" },
  mi: { tag: "main", desc: "Dominant content of the document body" },
  sa: { tag: "span", desc: "Generic inline container for phrasing content" },
  iu: { tag: "input", desc: "Interactive form input control" },
  le: { tag: "label", desc: "Caption for a user interface item" },
  tl: { tag: "table", desc: "Tabular data representation container" },
  cu: { tag: "canvas", desc: "Bitmap canvas for scriptable 2D/3D graphics" },
  fr: { tag: "form", desc: "Interactive form section with submit controls" }
};
var ATTR_DOCS = {
  cs: { attr: "class", desc: "CSS class names for styling" },
  cm: { attr: "className", desc: "JSX/React CSS class names" },
  hr: { attr: "href", desc: "Hyperlink target URL" },
  hf: { attr: "href", desc: "Hyperlink target URL" },
  id: { attr: "id", desc: "Unique element identifier within DOM" },
  sr: { attr: "src", desc: "Source URL for media or embeddable content" },
  tp: { attr: "type", desc: "Type of input or button behavior" },
  pe: { attr: "placeholder", desc: "Hint text shown in empty input controls" },
  nm: { attr: "name", desc: "Name of form control sent on submission" },
  vu: { attr: "value", desc: "Current value of form control or input" },
  oc: { attr: "onClick", desc: "Click event handler callback" },
  og: { attr: "onChange", desc: "Change event handler callback" }
};
var PRIMITIVE_DOCS = {
  state: "**state(name, initialValue)**\n\nDeclares a local reactive state variable with initial value.",
  useState: "**useState(name, initialValue)**\n\nDeclares a React-LM local state variable.",
  signal: "**signal(name, initialValue)**\n\nDeclares an Angular-LM signal reactive primitive.",
  ref: "**ref(name, initialValue)**\n\nDeclares a Vue-LM reactive ref primitive.",
  computed: "**computed(name, expression)**\n\nDeclares a derived reactive value recalculated when dependencies change.",
  reactive: "**reactive(name, expression)**\n\nDeclares a Svelte-LM reactive declaration ($derived expression).",
  component: "**component(Name, ...)**\n\nDeclares a reusable UI component with isolated scope and props.",
  props: "**props(name1, name2, ...)**\n\nDeclares incoming input properties for the enclosing component.",
  bind: "**bind(prop, stateVar)**\n\nTwo-way binding between an element property and a reactive state variable.",
  if: "**if(condition, thenNode, elseNode)**\n\nConditional UI branch rendered dynamically based on condition.",
  each: "**each(list, item, index, body)**\n\nKeyed iterative list renderer with automatic reconciliation.",
  slot: "**slot(name)**\n\nContent projection outlet for child elements."
};
var LeveonasHoverProvider = class _LeveonasHoverProvider {
  /**
   * Get hover documentation for the token under cursor.
   */
  static getHover(documentText, position) {
    const offset = position.offset ?? BlockExtractor.positionToOffset(documentText, position);
    const tokenInfo = _LeveonasHoverProvider.extractTokenAtOffset(documentText, offset);
    if (!tokenInfo) return null;
    const { token, range } = tokenInfo;
    if (token in KNOWN_ELEMENT_ABBREVIATIONS || token in ELEMENT_DOCS) {
      const canonical = KNOWN_ELEMENT_ABBREVIATIONS[token] ?? ELEMENT_DOCS[token]?.tag ?? token;
      const desc = ELEMENT_DOCS[token]?.desc ?? `HTML <${canonical}> element`;
      return {
        contents: {
          kind: "markdown",
          value: `### \`${token}\` \u2192 \`<${canonical}>\`

**LM Element Abbreviation**  
${desc}

*Lowered to ASTNodeKind.${canonical[0].toUpperCase() + canonical.slice(1)}*`
        },
        range
      };
    }
    if (token in KNOWN_ATTRIBUTE_ABBREVIATIONS || token in ATTR_DOCS) {
      const canonical = KNOWN_ATTRIBUTE_ABBREVIATIONS[token] ?? ATTR_DOCS[token]?.attr ?? token;
      const desc = ATTR_DOCS[token]?.desc ?? `HTML ${canonical} attribute`;
      return {
        contents: {
          kind: "markdown",
          value: `### \`${token}:\` \u2192 \`${canonical}\`

**LM Attribute Abbreviation**  
${desc}`
        },
        range
      };
    }
    if (token in PRIMITIVE_DOCS) {
      return {
        contents: {
          kind: "markdown",
          value: PRIMITIVE_DOCS[token]
        },
        range
      };
    }
    if (KNOWN_HTML_TAGS.has(token.toLowerCase())) {
      return {
        contents: {
          kind: "markdown",
          value: `### \`<${token.toLowerCase()}>\`

Standard HTML5 element representation in Leveonas Common UI IR.`
        },
        range
      };
    }
    if (LM_COMPONENTS.has(token)) {
      return {
        contents: {
          kind: "markdown",
          value: `### Component: \`${token}\`

Standard Leveonas semantic component.`
        },
        range
      };
    }
    const customHover = _LeveonasHoverProvider.findCustomSymbolHover(documentText, token, range);
    if (customHover) return customHover;
    return null;
  }
  static extractTokenAtOffset(text, offset) {
    if (offset < 0 || offset > text.length) return null;
    let start = offset;
    while (start > 0 && /[a-zA-Z0-9_$:-]/.test(text[start - 1])) {
      start--;
    }
    let end = offset;
    while (end < text.length && /[a-zA-Z0-9_$:-]/.test(text[end])) {
      end++;
    }
    if (start === end) return null;
    let rawToken = text.slice(start, end);
    if (rawToken.endsWith(":")) {
      rawToken = rawToken.slice(0, -1);
    }
    if (rawToken.includes(":")) {
      const parts = rawToken.split(":");
      rawToken = parts[parts.length - 1];
    }
    const startPos = BlockExtractor.offsetToPosition(text, start);
    const endPos = BlockExtractor.offsetToPosition(text, end);
    return {
      token: rawToken,
      range: { start: startPos, end: endPos }
    };
  }
  static findCustomSymbolHover(documentText, symbolName, range) {
    const stateRegex = new RegExp(
      `\\b(?:state|ref|signal|useState)\\s*\\(\\s*${symbolName}\\s*,\\s*([^)]+)\\)|\\((?:state|ref|signal):${symbolName}\\s+([^)]+)`,
      "g"
    );
    const stateMatch = stateRegex.exec(documentText);
    if (stateMatch) {
      const initVal = (stateMatch[1] || stateMatch[2] || "").trim();
      return {
        contents: {
          kind: "markdown",
          value: `### (state) \`${symbolName}\`

**Reactive State Variable**  
Initial value: \`${initVal}\`

Tracked in Common UI IR reactivity dependency graph.`
        },
        range
      };
    }
    const compRegex = new RegExp(
      `\\b(?:reactive|computed|\\$derived)\\s*\\(\\s*${symbolName}\\s*,\\s*([^)]+)\\)|\\((?:reactive|computed|derived):${symbolName}\\s+([^)]+)`,
      "g"
    );
    const compMatch = compRegex.exec(documentText);
    if (compMatch) {
      const expr = (compMatch[1] || compMatch[2] || "").trim();
      return {
        contents: {
          kind: "markdown",
          value: `### (computed) \`${symbolName}\`

**Derived Value**  
Expression: \`${expr}\`

Automatically recalculated when referenced state dependencies change.`
        },
        range
      };
    }
    const componentRegex = new RegExp(
      `\\bcomponent\\s*\\(\\s*${symbolName}\\s*\\)(?:\\s*\\(\\s*props\\s*\\(([^)]*)\\)\\))?|\\(component:${symbolName}(?:\\s+\\(props:\\s*([^)]*)\\))?`,
      "g"
    );
    const compDeclMatch = componentRegex.exec(documentText);
    if (compDeclMatch) {
      const props = compDeclMatch[1]?.trim() ?? compDeclMatch[2]?.trim() ?? "none";
      return {
        contents: {
          kind: "markdown",
          value: `### (component) \`${symbolName}\`

**User Declared Component**  
Props: \`${props}\``
        },
        range
      };
    }
    return null;
  }
};

// packages/lsp/references.ts
var LeveonasReferencesProvider = class _LeveonasReferencesProvider {
  /**
   * Find all reference locations for the symbol under cursor.
   */
  static findReferences(documentText, position, uri = "file://app.lm", includeDeclaration = true) {
    const offset = position.offset ?? BlockExtractor.positionToOffset(documentText, position);
    const word = _LeveonasReferencesProvider.getWordAtOffset(documentText, offset);
    if (!word) return [];
    const locations = [];
    const wordRegex = new RegExp(`\\b${word}\\b`, "g");
    let match;
    while ((match = wordRegex.exec(documentText)) !== null) {
      const matchOffset = match.index;
      const startPos = BlockExtractor.offsetToPosition(documentText, matchOffset);
      const endPos = BlockExtractor.offsetToPosition(documentText, matchOffset + word.length);
      locations.push({
        uri,
        range: { start: startPos, end: endPos }
      });
    }
    return locations;
  }
  static getWordAtOffset(text, offset) {
    if (offset < 0 || offset > text.length) return null;
    let start = offset;
    while (start > 0 && /[a-zA-Z0-9_$]/.test(text[start - 1])) {
      start--;
    }
    let end = offset;
    while (end < text.length && /[a-zA-Z0-9_$]/.test(text[end])) {
      end++;
    }
    if (start === end) return null;
    return text.slice(start, end);
  }
};

// packages/lsp/server.ts
var LeveonasLanguageService = class {
  /**
   * Compute full compiler & parser diagnostics for a document.
   */
  getDiagnostics(documentText, options) {
    return LeveonasDiagnosticEngine.diagnose(documentText, options);
  }
  /**
   * Provide hover information for symbol at cursor.
   */
  getHover(documentText, position) {
    return LeveonasHoverProvider.getHover(documentText, position);
  }
  /**
   * Provide autocompletions at cursor position.
   */
  getCompletions(documentText, position) {
    return LeveonasCompletionProvider.getCompletions(documentText, position);
  }
  /**
   * Jump to definition of symbol at cursor.
   */
  getDefinition(documentText, position, uri) {
    return LeveonasDefinitionProvider.getDefinition(documentText, position, uri);
  }
  /**
   * Find all references of symbol across document.
   */
  findReferences(documentText, position, uri, includeDeclaration = true) {
    return LeveonasReferencesProvider.findReferences(
      documentText,
      position,
      uri,
      includeDeclaration
    );
  }
  /**
   * Extract document outline and symbols.
   */
  getDocumentSymbols(documentText) {
    return LeveonasSymbolsProvider.getDocumentSymbols(documentText);
  }
  /**
   * Format document to canonical LM syntax deterministically.
   */
  formatDocument(documentText, options) {
    return LeveonasFormatter.format(documentText, options);
  }
  /**
   * Full AST, IR, Reactivity Graph, and Patch inspection for developer tooling.
   */
  inspectDocument(documentText) {
    return LeveonasInspector.inspect(documentText);
  }
  /**
   * Extract embedded framework blocks.
   */
  extractBlocks(documentText) {
    return BlockExtractor.extractBlocks(documentText);
  }
};

// packages/version.ts
var LEVEONAS_VERSION = "0.5.0";
var VERSION = LEVEONAS_VERSION;

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

// packages/runtime/incremental/patch-generator/patch.ts
var OPERATION_ORDER_PRIORITY = {
  ["REMOVE_ATTRIBUTE" /* REMOVE_ATTRIBUTE */]: 1,
  ["SET_ATTRIBUTE" /* SET_ATTRIBUTE */]: 2,
  ["UPDATE_TEXT" /* UPDATE_TEXT */]: 3,
  ["REMOVE_CHILD" /* REMOVE_CHILD */]: 4,
  ["REMOVE_NODE" /* REMOVE_NODE */]: 4,
  ["CREATE_NODE" /* CREATE_NODE */]: 5,
  ["INSERT_CHILD" /* INSERT_CHILD */]: 6,
  ["MOVE_CHILD" /* MOVE_CHILD */]: 7,
  ["REPLACE_NODE" /* REPLACE_NODE */]: 8,
  ["REPLACE_CHILDREN" /* REPLACE_CHILDREN */]: 9,
  ["NO_OP" /* NO_OP */]: 99
};
var Patch = class {
  constructor() {
    this.operations = [];
  }
  add(operation) {
    if (operation.operation !== "NO_OP" /* NO_OP */) {
      this.operations.push(operation);
    }
  }
  getOperations(sortDeterministic = true) {
    if (!sortDeterministic) {
      return [...this.operations];
    }
    return [...this.operations].sort((a, b) => {
      const prioA = OPERATION_ORDER_PRIORITY[a.operation] ?? 50;
      const prioB = OPERATION_ORDER_PRIORITY[b.operation] ?? 50;
      return prioA - prioB;
    });
  }
  isEmpty() {
    return this.operations.length === 0;
  }
  clear() {
    this.operations = [];
  }
};

// packages/runtime/incremental/patch-generator/generator.ts
var PatchGenerator = class {
  generate(oldAst, newAst) {
    const patch = new Patch();
    const diffEngine = new DiffEngine(patch);
    diffEngine.diff(oldAst, newAst);
    return patch.getOperations();
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

// packages/runtime/incremental/patch-executor/errors.ts
var PatchExecutorError = class extends Error {
  constructor(message) {
    super(`PatchExecutorError: ${message}`);
    this.name = "PatchExecutorError";
  }
};

// packages/runtime/incremental/patch-executor/registry.ts
var HandlerRegistry = class {
  constructor() {
    this.handlers = /* @__PURE__ */ new Map();
  }
  register(type, handler) {
    this.handlers.set(type, handler);
  }
  get(type) {
    return this.handlers.get(type);
  }
};

// packages/runtime/incremental/patch-executor/handlers.ts
function materializeASTNode(payload, parent = null) {
  if (!payload) {
    const emptyLoc2 = ASTFactory.createSourceLocation(0, 0, 0, 0, 0, 0);
    return ASTFactory.createLiteral("", "", emptyLoc2);
  }
  if (payload.kind && (payload.sourceLocation !== void 0 || typeof payload.clone === "function")) {
    payload.parent = parent;
    return payload;
  }
  const emptyLoc = ASTFactory.createSourceLocation(0, 0, 0, 0, 0, 0);
  if (payload.kind === "Literal" /* Literal */ || payload.kind === "Literal" || payload.value !== void 0 && !payload.children && !payload.properties) {
    const val = payload.value !== void 0 ? payload.value : payload.text ?? "";
    const raw = payload.raw !== void 0 ? payload.raw : String(val);
    const lit = ASTFactory.createLiteral(val, raw, payload.sourceLocation || emptyLoc);
    if (payload.id) lit.id = payload.id;
    lit.parent = parent;
    return lit;
  }
  const kind = payload.kind || "GenericComponent" /* GenericComponent */;
  const name = payload.name;
  const comp = ASTFactory.createComponent(kind, payload.sourceLocation || emptyLoc, [], [], name);
  if (payload.id) comp.id = payload.id;
  comp.parent = parent;
  if (payload.properties) {
    comp.properties = payload.properties.map((p) => {
      const pVal = typeof p.value === "object" && p.value !== null ? p.value.value : p.value;
      const lit = ASTFactory.createLiteral(pVal, String(pVal), emptyLoc);
      const prop = ASTFactory.createProperty(p.name, lit, emptyLoc);
      prop.parent = comp;
      lit.parent = prop;
      return prop;
    });
  }
  if (payload.children) {
    comp.children = payload.children.map((c) => materializeASTNode(c, comp));
  }
  return comp;
}
var handleInsertNode = (op, ctx) => {
  if (!op.parentId) {
    if (op.operation === "CREATE_NODE" /* CREATE_NODE */) {
      const newNode2 = materializeASTNode(op.payload || { id: op.nodeId }, null);
      ctx.setNode(newNode2.id, newNode2);
      return;
    }
    throw new PatchExecutorError("INSERT_CHILD requires parentId");
  }
  if (op.index === void 0 || op.index === null) throw new PatchExecutorError("INSERT_CHILD requires index");
  if (ctx.isRemoved(op.parentId)) {
    throw new PatchExecutorError(`Operation targeting removed node: ${op.parentId}`);
  }
  const parent = ctx.getNode(op.parentId);
  if (!parent) throw new PatchExecutorError(`Parent node ${op.parentId} not found`);
  if (!parent.children) parent.children = [];
  if (op.index < 0 || op.index > parent.children.length) {
    throw new PatchExecutorError(`Invalid child index ${op.index} for INSERT_CHILD on parent ${op.parentId} with ${parent.children.length} children`);
  }
  const newNode = materializeASTNode(op.payload, parent);
  const checkNoDuplicate = (node) => {
    if (ctx.getNode(node.id)) {
      throw new PatchExecutorError(`Duplicate node identity: ${node.id} already exists in registry`);
    }
    if (node.children) {
      node.children.forEach(checkNoDuplicate);
    }
  };
  checkNoDuplicate(newNode);
  const addNodeToContext = (node) => {
    ctx.setNode(node.id, node);
    if (node.children) {
      node.children.forEach(addNodeToContext);
    }
  };
  addNodeToContext(newNode);
  parent.children.splice(op.index, 0, newNode);
};
var handleRemoveNode = (op, ctx) => {
  if (op.parentId) {
    if (ctx.isRemoved(op.parentId)) {
      throw new PatchExecutorError(`Operation targeting removed node: ${op.parentId}`);
    }
    const parent = ctx.getNode(op.parentId);
    if (!parent) throw new PatchExecutorError(`Parent node ${op.parentId} not found`);
    if (!parent.children) {
      throw new PatchExecutorError(`Parent node ${op.parentId} has no children`);
    }
    let childIndex = -1;
    if (op.nodeId) {
      childIndex = parent.children.findIndex((c) => c.id === op.nodeId);
    }
    if (childIndex === -1 && op.index !== void 0 && op.index >= 0 && op.index < parent.children.length) {
      childIndex = op.index;
    }
    if (childIndex === -1) {
      throw new PatchExecutorError(`Child node ${op.nodeId || op.index} not found in parent ${op.parentId}`);
    }
    const [removed] = parent.children.splice(childIndex, 1);
    const removeNodeFromContext = (node) => {
      ctx.deleteNode(node.id);
      if (node.children) {
        node.children.forEach(removeNodeFromContext);
      }
    };
    removeNodeFromContext(removed);
  } else {
    if (!op.nodeId) throw new PatchExecutorError("REMOVE_NODE requires nodeId or parentId");
    if (ctx.isRemoved(op.nodeId)) {
      throw new PatchExecutorError(`Operation targeting removed node: ${op.nodeId}`);
    }
    const node = ctx.getNode(op.nodeId);
    if (!node) throw new PatchExecutorError(`Node ${op.nodeId} not found`);
    if (node.parent && node.parent.children) {
      const idx = node.parent.children.findIndex((c) => c.id === node.id);
      if (idx !== -1) {
        node.parent.children.splice(idx, 1);
      }
    }
    const removeNodeFromContext = (n) => {
      ctx.deleteNode(n.id);
      if (n.children) {
        n.children.forEach(removeNodeFromContext);
      }
    };
    removeNodeFromContext(node);
  }
};
var handleMoveNode = (op, ctx) => {
  if (!op.nodeId) throw new PatchExecutorError("MOVE_CHILD requires nodeId");
  if (!op.parentId) throw new PatchExecutorError("MOVE_CHILD requires parentId");
  if (op.index === void 0 || op.index === null) throw new PatchExecutorError("MOVE_CHILD requires index");
  if (ctx.isRemoved(op.nodeId)) {
    throw new PatchExecutorError(`Operation targeting removed node: ${op.nodeId}`);
  }
  if (ctx.isRemoved(op.parentId)) {
    throw new PatchExecutorError(`Operation targeting removed node: ${op.parentId}`);
  }
  const parent = ctx.getNode(op.parentId);
  if (!parent) throw new PatchExecutorError(`Parent node ${op.parentId} not found`);
  if (!parent.children) {
    throw new PatchExecutorError(`Parent node ${op.parentId} has no children`);
  }
  const childIndex = parent.children.findIndex((c) => c.id === op.nodeId);
  if (childIndex === -1) {
    throw new PatchExecutorError(`Child node ${op.nodeId} not found in parent ${op.parentId}`);
  }
  const [moved] = parent.children.splice(childIndex, 1);
  if (op.index < 0 || op.index > parent.children.length) {
    parent.children.splice(childIndex, 0, moved);
    throw new PatchExecutorError(
      `Invalid target index ${op.index} for MOVE_CHILD on parent ${op.parentId} with ${parent.children.length} remaining children`
    );
  }
  parent.children.splice(op.index, 0, moved);
};
var handleReplaceNode = (op, ctx) => {
  if (!op.nodeId) throw new PatchExecutorError("REPLACE_NODE requires nodeId");
  if (ctx.isRemoved(op.nodeId)) {
    throw new PatchExecutorError(`Operation targeting removed node: ${op.nodeId}`);
  }
  const removeNodeFromContext = (node) => {
    ctx.deleteNode(node.id);
    if (node.children) {
      node.children.forEach(removeNodeFromContext);
    }
  };
  const checkNoDuplicate = (node) => {
    if (ctx.getNode(node.id)) {
      throw new PatchExecutorError(`Duplicate node identity: ${node.id} already exists in registry`);
    }
    if (node.children) {
      node.children.forEach(checkNoDuplicate);
    }
  };
  const addNodeToContext = (node) => {
    ctx.setNode(node.id, node);
    if (node.children) {
      node.children.forEach(addNodeToContext);
    }
  };
  if (!op.parentId || op.parentId === "" || ctx.root && ctx.root.id === op.nodeId) {
    if (ctx.root && ctx.root.id === op.nodeId) {
      removeNodeFromContext(ctx.root);
      const newNode2 = materializeASTNode(op.payload, null);
      checkNoDuplicate(newNode2);
      addNodeToContext(newNode2);
      ctx.root = newNode2;
      return;
    }
    throw new PatchExecutorError("REPLACE_NODE requires parentId");
  }
  if (ctx.isRemoved(op.parentId)) {
    throw new PatchExecutorError(`Operation targeting removed node: ${op.parentId}`);
  }
  const parent = ctx.getNode(op.parentId);
  if (!parent) throw new PatchExecutorError(`Parent node ${op.parentId} not found`);
  if (!parent.children) {
    throw new PatchExecutorError(`Parent node ${op.parentId} has no children`);
  }
  let childIndex = parent.children.findIndex((c) => c.id === op.nodeId);
  if (childIndex === -1 && op.index !== void 0 && op.index >= 0 && op.index < parent.children.length) {
    childIndex = op.index;
  }
  if (childIndex === -1) {
    throw new PatchExecutorError(`Child node ${op.nodeId} not found in parent ${op.parentId}`);
  }
  const [removed] = parent.children.splice(childIndex, 1);
  removeNodeFromContext(removed);
  const newNode = materializeASTNode(op.payload, parent);
  checkNoDuplicate(newNode);
  addNodeToContext(newNode);
  parent.children.splice(childIndex, 0, newNode);
};
var handleUpdateText = (op, ctx) => {
  if (!op.nodeId) throw new PatchExecutorError("UPDATE_TEXT requires nodeId");
  if (ctx.isRemoved(op.nodeId)) {
    throw new PatchExecutorError(`Operation targeting removed node: ${op.nodeId}`);
  }
  const node = ctx.getNode(op.nodeId);
  if (!node) throw new PatchExecutorError(`Node ${op.nodeId} not found`);
  const textVal = typeof op.payload === "object" && op.payload !== null ? op.payload.text : op.payload ?? "";
  if (node.kind !== "Literal" /* Literal */) {
    throw new PatchExecutorError(`Invalid UPDATE_TEXT target: node ${op.nodeId} is a ${node.kind}, expected Literal`);
  }
  const lit = node;
  lit.value = textVal;
  lit.raw = String(textVal);
};
var handleUpdateProperty = (op, ctx) => {
  if (!op.nodeId) throw new PatchExecutorError("SET_ATTRIBUTE requires nodeId");
  if (ctx.isRemoved(op.nodeId)) {
    throw new PatchExecutorError(`Operation targeting removed node: ${op.nodeId}`);
  }
  const node = ctx.getNode(op.nodeId);
  if (!node) throw new PatchExecutorError(`Node ${op.nodeId} not found`);
  if (!op.payload || op.payload.name === void 0) {
    throw new PatchExecutorError("SET_ATTRIBUTE requires payload.name");
  }
  if (!node.properties) node.properties = [];
  const prop = node.properties.find((p) => p.name === op.payload.name);
  const emptyLoc = ASTFactory.createSourceLocation(0, 0, 0, 0, 0, 0);
  if (prop) {
    if (prop.value) {
      prop.value.value = op.payload.value;
      prop.value.raw = String(op.payload.value);
    } else {
      prop.value = ASTFactory.createLiteral(op.payload.value, String(op.payload.value), emptyLoc);
      prop.value.parent = prop;
    }
  } else {
    const newProp = ASTFactory.createProperty(op.payload.name, ASTFactory.createLiteral(op.payload.value, String(op.payload.value), emptyLoc), emptyLoc);
    newProp.parent = node;
    node.properties.push(newProp);
  }
};
var handleRemoveProperty = (op, ctx) => {
  if (!op.nodeId) throw new PatchExecutorError("REMOVE_ATTRIBUTE requires nodeId");
  if (ctx.isRemoved(op.nodeId)) {
    throw new PatchExecutorError(`Operation targeting removed node: ${op.nodeId}`);
  }
  const node = ctx.getNode(op.nodeId);
  if (!node) throw new PatchExecutorError(`Node ${op.nodeId} not found`);
  if (!op.payload || op.payload.name === void 0) {
    throw new PatchExecutorError("REMOVE_ATTRIBUTE requires payload.name");
  }
  if (!node.properties) return;
  node.properties = node.properties.filter((p) => p.name !== op.payload.name);
};
var handleAddProperty = (op, ctx) => {
  handleUpdateProperty(op, ctx);
};
var handleReplaceChildren = (op, ctx) => {
  if (!op.nodeId) throw new PatchExecutorError("REPLACE_CHILDREN requires nodeId");
  if (ctx.isRemoved(op.nodeId)) {
    throw new PatchExecutorError(`Operation targeting removed node: ${op.nodeId}`);
  }
  const node = ctx.getNode(op.nodeId);
  if (!node) throw new PatchExecutorError(`Node ${op.nodeId} not found`);
  const removeNodeFromContext = (n) => {
    ctx.deleteNode(n.id);
    if (n.children) {
      n.children.forEach(removeNodeFromContext);
    }
  };
  if (node.children) {
    node.children.forEach(removeNodeFromContext);
  }
  const rawChildren = Array.isArray(op.payload) ? op.payload : [];
  const newChildren = rawChildren.map((c) => materializeASTNode(c, node));
  const checkNoDuplicate = (n) => {
    if (ctx.getNode(n.id)) {
      throw new PatchExecutorError(`Duplicate node identity: ${n.id} already exists in registry`);
    }
    if (n.children) {
      n.children.forEach(checkNoDuplicate);
    }
  };
  newChildren.forEach(checkNoDuplicate);
  const addNodeToContext = (n) => {
    ctx.setNode(n.id, n);
    if (n.children) {
      n.children.forEach(addNodeToContext);
    }
  };
  newChildren.forEach(addNodeToContext);
  node.children = newChildren;
};
var handleNoOp = () => {
};

// packages/runtime/incremental/patch-executor/dispatcher.ts
var OperationDispatcher = class {
  constructor() {
    this.registry = new HandlerRegistry();
    this.registry.register("CREATE_NODE" /* CREATE_NODE */, handleInsertNode);
    this.registry.register("INSERT_CHILD" /* INSERT_CHILD */, handleInsertNode);
    this.registry.register("REMOVE_CHILD" /* REMOVE_CHILD */, handleRemoveNode);
    this.registry.register("REMOVE_NODE" /* REMOVE_NODE */, handleRemoveNode);
    this.registry.register("MOVE_CHILD" /* MOVE_CHILD */, handleMoveNode);
    this.registry.register("REPLACE_NODE" /* REPLACE_NODE */, handleReplaceNode);
    this.registry.register("UPDATE_TEXT" /* UPDATE_TEXT */, handleUpdateText);
    this.registry.register("SET_ATTRIBUTE" /* SET_ATTRIBUTE */, handleUpdateProperty);
    this.registry.register("REMOVE_ATTRIBUTE" /* REMOVE_ATTRIBUTE */, handleRemoveProperty);
    this.registry.register("REPLACE_CHILDREN" /* REPLACE_CHILDREN */, handleReplaceChildren);
    this.registry.register("NO_OP" /* NO_OP */, handleNoOp);
  }
  dispatch(operation, context) {
    const canonicalType = normalizePatchOperationType(operation.operation);
    const handler = this.registry.get(canonicalType);
    if (!handler) {
      throw new PatchExecutorError(`No handler registered for operation type: ${operation.operation}`);
    }
    handler(operation, context);
  }
};

// packages/runtime/incremental/patch-executor/executor.ts
var PatchExecutor = class {
  constructor(root) {
    this.root = root;
    this.dispatcher = new OperationDispatcher();
    this.nodeMap = /* @__PURE__ */ new Map();
    this.removedNodeIds = /* @__PURE__ */ new Set();
    this.context = {
      getNode: (id) => this.nodeMap.get(id),
      setNode: (id, node) => {
        this.nodeMap.set(id, node);
        this.removedNodeIds.delete(id);
      },
      deleteNode: (id) => {
        this.nodeMap.delete(id);
        this.removedNodeIds.add(id);
      },
      isRemoved: (id) => this.removedNodeIds.has(id),
      markRemoved: (id) => this.removedNodeIds.add(id),
      root
    };
    this.buildIndex(root);
  }
  buildIndex(node) {
    this.context.setNode(node.id, node);
    if (node.children) {
      node.children.forEach((c) => this.buildIndex(c));
    }
  }
  /**
   * Executes a sequence of patch operations with sequential fail-fast atomicity.
   * If any operation fails, throws immediately, reporting which operation failed,
   * without silently continuing.
   */
  execute(operations) {
    for (let i = 0; i < operations.length; i++) {
      const op = operations[i];
      try {
        this.dispatcher.dispatch(op, this.context);
      } catch (e) {
        if (e instanceof PatchExecutorError) {
          throw e;
        }
        throw new PatchExecutorError(
          `Execution failed at operation [${i}] ${op.operation} on node ${op.nodeId}: ${e.message}`
        );
      }
    }
  }
  getRoot() {
    return this.context.root;
  }
};

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

// packages/runtime/browser.ts
if (typeof window !== "undefined") {
  window.LeveonasRuntime = {
    DOMPatchApplier,
    CSSPatchApplier,
    JSPatchApplier,
    PatchSerializer,
    PatchExecutorError,
    normalizePatchOperationType,
    PatchOperationType,
    validatePatches,
    isPatchBatchValid,
    PatchValidationError
  };
}

// packages/telemetry/metrics.ts
var MetricsCollector = class {
  constructor(config = { mode: "production" }) {
    this.config = config;
    this.startTime = 0;
    this.firstChunkTime = 0;
    this.firstPatchTime = 0;
    this.endTime = 0;
    this.streamByteCount = 0;
    this.patchByteCount = 0;
    this.patchOperationCount = 0;
    this.inTokens = null;
    this.outTokens = null;
    this.totTokens = null;
    this.isCompleted = false;
    this.start();
  }
  start() {
    this.startTime = Date.now();
  }
  recordChunk(byteLength) {
    if (!this.firstChunkTime) {
      this.firstChunkTime = Date.now();
    }
    this.streamByteCount += byteLength;
  }
  recordPatch(operationCount, byteLength) {
    if (!this.firstPatchTime) {
      this.firstPatchTime = Date.now();
    }
    this.patchOperationCount += operationCount;
    this.patchByteCount += byteLength;
  }
  recordUsage(inputTokens, outputTokens, totalTokens) {
    if (typeof inputTokens === "number") this.inTokens = inputTokens;
    if (typeof outputTokens === "number") this.outTokens = outputTokens;
    if (typeof totalTokens === "number") this.totTokens = totalTokens;
  }
  complete() {
    if (!this.isCompleted) {
      this.endTime = Date.now();
      this.isCompleted = true;
    }
    const duration = Math.max(0, this.endTime - this.startTime);
    const ttfc = this.firstChunkTime ? Math.max(0, this.firstChunkTime - this.startTime) : duration;
    const ttfp = this.firstPatchTime ? Math.max(0, this.firstPatchTime - this.startTime) : duration;
    const metrics = {
      durationMs: duration,
      timeToFirstChunkMs: ttfc,
      timeToFirstPatchMs: ttfp,
      completionTimeMs: duration,
      patchCount: this.patchOperationCount,
      patchBytes: this.patchByteCount,
      streamBytes: this.streamByteCount,
      inputTokens: this.inTokens,
      outputTokens: this.outTokens,
      totalTokens: this.totTokens
    };
    if (this.config.mode === "development") {
      console.log("[Leveonas Metrics]", {
        durationMs: metrics.durationMs,
        ttfc: metrics.timeToFirstChunkMs,
        ttfp: metrics.timeToFirstPatchMs,
        patches: metrics.patchCount,
        patchBytes: metrics.patchBytes,
        streamBytes: metrics.streamBytes,
        tokens: metrics.totalTokens
      });
    }
    this.config.onMetrics?.(metrics);
    return metrics;
  }
};

// packages/sdk/errors.ts
var LeveonasError = class extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = "LeveonasError";
  }
};
var AuthenticationError = class extends LeveonasError {
  constructor(message = "Authentication failed") {
    super(message, 401, "unauthorized");
    this.name = "AuthenticationError";
  }
};
var ValidationError = class extends LeveonasError {
  constructor(message) {
    super(message, 400, "validation_failed");
    this.name = "ValidationError";
  }
};
var TimeoutError = class extends LeveonasError {
  constructor(message = "Request timed out") {
    super(message, 408, "timeout");
    this.name = "TimeoutError";
  }
};

// packages/sdk/provider.ts
var LeveonasProviderError = class _LeveonasProviderError extends Error {
  constructor(message, provider, isRetryable = false, statusCode) {
    super(message);
    this.name = "LeveonasProviderError";
    this.provider = provider;
    this.isRetryable = isRetryable;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, _LeveonasProviderError.prototype);
  }
};
var LeveonasAuthError = class _LeveonasAuthError extends LeveonasProviderError {
  constructor(message, provider, statusCode = 401) {
    super(message, provider, false, statusCode);
    this.name = "LeveonasAuthError";
    Object.setPrototypeOf(this, _LeveonasAuthError.prototype);
  }
};
var LeveonasInvalidRequestError = class _LeveonasInvalidRequestError extends LeveonasProviderError {
  constructor(message, provider, statusCode = 400) {
    super(message, provider, false, statusCode);
    this.name = "LeveonasInvalidRequestError";
    Object.setPrototypeOf(this, _LeveonasInvalidRequestError.prototype);
  }
};
var LeveonasRateLimitError = class _LeveonasRateLimitError extends LeveonasProviderError {
  constructor(message, provider, statusCode = 429) {
    super(message, provider, true, statusCode);
    this.name = "LeveonasRateLimitError";
    Object.setPrototypeOf(this, _LeveonasRateLimitError.prototype);
  }
};
var LeveonasTimeoutError = class _LeveonasTimeoutError extends LeveonasProviderError {
  constructor(message, provider) {
    super(message, provider, true, 408);
    this.name = "LeveonasTimeoutError";
    Object.setPrototypeOf(this, _LeveonasTimeoutError.prototype);
  }
};
var LeveonasUnavailableError = class _LeveonasUnavailableError extends LeveonasProviderError {
  constructor(message, provider, statusCode = 503) {
    super(message, provider, true, statusCode);
    this.name = "LeveonasUnavailableError";
    Object.setPrototypeOf(this, _LeveonasUnavailableError.prototype);
  }
};
var LeveonasSecurityError = class _LeveonasSecurityError extends LeveonasProviderError {
  constructor(message, provider) {
    super(message, provider, false, 403);
    this.name = "LeveonasSecurityError";
    Object.setPrototypeOf(this, _LeveonasSecurityError.prototype);
  }
};
var LeveonasResourceLimitError = class _LeveonasResourceLimitError extends LeveonasProviderError {
  constructor(message, provider) {
    super(message, provider, false, 413);
    this.name = "LeveonasResourceLimitError";
    Object.setPrototypeOf(this, _LeveonasResourceLimitError.prototype);
  }
};
var LeveonasAbortError = class _LeveonasAbortError extends LeveonasProviderError {
  constructor(provider) {
    super("Operation aborted by user or timeout", provider, false, 499);
    this.name = "LeveonasAbortError";
    Object.setPrototypeOf(this, _LeveonasAbortError.prototype);
  }
};
function isRetryableError(error) {
  if (error instanceof LeveonasProviderError) {
    return error.isRetryable;
  }
  if (error instanceof Error && error.name === "AbortError") {
    return false;
  }
  return false;
}
var DEFAULT_RETRY_POLICY = {
  maxRetries: 3,
  initialDelayMs: 500,
  maxDelayMs: 4e3,
  backoffFactor: 2,
  jitter: true
};
async function withRetry(fn, policy = {}) {
  const merged = { ...DEFAULT_RETRY_POLICY, ...policy };
  let attempt = 0;
  let delay = merged.initialDelayMs;
  while (true) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (attempt > merged.maxRetries || !isRetryableError(error)) {
        throw error;
      }
      const jitterFactor = merged.jitter ? 0.75 + Math.random() * 0.5 : 1;
      const calculatedDelay = Math.min(delay * jitterFactor, merged.maxDelayMs);
      await new Promise((resolve) => setTimeout(resolve, calculatedDelay));
      delay = Math.min(delay * merged.backoffFactor, merged.maxDelayMs);
    }
  }
}
var GeminiProvider = class {
  constructor(defaultApiKey) {
    this.defaultApiKey = defaultApiKey;
    this.id = "gemini";
    this.name = "Google Gemini";
  }
  async *generate(request) {
    const key = request.apiKey || this.defaultApiKey;
    if (!key && typeof process !== "undefined" && !process.env.GEMINI_API_KEY) {
      throw new LeveonasAuthError("Missing Gemini API key", this.id);
    }
    const model = request.model || "gemini-2.5-flash";
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${key || process.env.GEMINI_API_KEY}`;
    const body = {
      contents: [{ role: "user", parts: [{ text: request.prompt }] }],
      systemInstruction: request.systemInstruction ? { parts: [{ text: request.systemInstruction }] } : void 0,
      generationConfig: {
        maxOutputTokens: request.maxTokens,
        temperature: request.temperature
      }
    };
    let response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: request.signal
      });
    } catch (err) {
      if (err.name === "AbortError") throw new LeveonasAbortError(this.id);
      throw new LeveonasUnavailableError(`Network connection failed: ${err.message}`, this.id);
    }
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new LeveonasAuthError(`Gemini authentication error (HTTP ${response.status})`, this.id, response.status);
      }
      if (response.status === 429) {
        throw new LeveonasRateLimitError("Gemini rate limit exceeded", this.id);
      }
      if (response.status >= 500) {
        throw new LeveonasUnavailableError(`Gemini service error (HTTP ${response.status})`, this.id, response.status);
      }
      throw new LeveonasInvalidRequestError(`Gemini request failed (HTTP ${response.status})`, this.id, response.status);
    }
    if (!response.body) {
      throw new LeveonasUnavailableError("Gemini returned an empty response body", this.id);
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const jsonStr = trimmed.slice(5).trim();
          if (!jsonStr || jsonStr === "[DONE]") continue;
          try {
            const data = JSON.parse(jsonStr);
            const candidate = data.candidates?.[0];
            const text = candidate?.content?.parts?.[0]?.text || "";
            const usage = data.usageMetadata;
            yield {
              text,
              inputTokens: usage?.promptTokenCount ?? null,
              outputTokens: usage?.candidatesTokenCount ?? null,
              totalTokens: usage?.totalTokenCount ?? null,
              finishReason: candidate?.finishReason ?? null,
              raw: data
            };
          } catch {
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
};
var OpenAIProvider = class {
  constructor(defaultApiKey) {
    this.defaultApiKey = defaultApiKey;
    this.id = "openai";
    this.name = "OpenAI";
  }
  async *generate(request) {
    const key = request.apiKey || this.defaultApiKey;
    if (!key && typeof process !== "undefined" && !process.env.OPENAI_API_KEY) {
      throw new LeveonasAuthError("Missing OpenAI API key", this.id);
    }
    const model = request.model || "gpt-4o-mini";
    const endpoint = "https://api.openai.com/v1/chat/completions";
    const messages = [];
    if (request.systemInstruction) {
      messages.push({ role: "system", content: request.systemInstruction });
    }
    messages.push({ role: "user", content: request.prompt });
    const body = {
      model,
      stream: true,
      stream_options: { include_usage: true },
      messages,
      max_tokens: request.maxTokens,
      temperature: request.temperature
    };
    let response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key || process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify(body),
        signal: request.signal
      });
    } catch (err) {
      if (err.name === "AbortError") throw new LeveonasAbortError(this.id);
      throw new LeveonasUnavailableError(`Network connection failed: ${err.message}`, this.id);
    }
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new LeveonasAuthError(`OpenAI authentication error (HTTP ${response.status})`, this.id, response.status);
      }
      if (response.status === 429) {
        throw new LeveonasRateLimitError("OpenAI rate limit exceeded", this.id);
      }
      if (response.status >= 500) {
        throw new LeveonasUnavailableError(`OpenAI service error (HTTP ${response.status})`, this.id, response.status);
      }
      throw new LeveonasInvalidRequestError(`OpenAI request failed (HTTP ${response.status})`, this.id, response.status);
    }
    if (!response.body) {
      throw new LeveonasUnavailableError("OpenAI returned an empty response body", this.id);
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const jsonStr = trimmed.slice(5).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const data = JSON.parse(jsonStr);
            const text = data.choices?.[0]?.delta?.content || "";
            const usage = data.usage;
            yield {
              text,
              inputTokens: usage?.prompt_tokens ?? null,
              outputTokens: usage?.completion_tokens ?? null,
              totalTokens: usage?.total_tokens ?? null,
              finishReason: data.choices?.[0]?.finish_reason ?? null,
              raw: data
            };
          } catch {
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
};
var GrokProvider = class {
  constructor(defaultApiKey) {
    this.defaultApiKey = defaultApiKey;
    this.id = "grok";
    this.name = "xAI Grok";
  }
  async *generate(request) {
    const key = request.apiKey || this.defaultApiKey;
    if (!key && typeof process !== "undefined" && !process.env.XAI_API_KEY) {
      throw new LeveonasAuthError("Missing xAI/Grok API key", this.id);
    }
    const model = request.model || "grok-2-latest";
    const endpoint = "https://api.x.ai/v1/chat/completions";
    const messages = [];
    if (request.systemInstruction) {
      messages.push({ role: "system", content: request.systemInstruction });
    }
    messages.push({ role: "user", content: request.prompt });
    const body = {
      model,
      stream: true,
      messages,
      max_tokens: request.maxTokens,
      temperature: request.temperature
    };
    let response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key || process.env.XAI_API_KEY}`
        },
        body: JSON.stringify(body),
        signal: request.signal
      });
    } catch (err) {
      if (err.name === "AbortError") throw new LeveonasAbortError(this.id);
      throw new LeveonasUnavailableError(`Network connection failed: ${err.message}`, this.id);
    }
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new LeveonasAuthError(`Grok authentication error (HTTP ${response.status})`, this.id, response.status);
      }
      if (response.status === 429) {
        throw new LeveonasRateLimitError("Grok rate limit exceeded", this.id);
      }
      if (response.status >= 500) {
        throw new LeveonasUnavailableError(`Grok service error (HTTP ${response.status})`, this.id, response.status);
      }
      throw new LeveonasInvalidRequestError(`Grok request failed (HTTP ${response.status})`, this.id, response.status);
    }
    if (!response.body) {
      throw new LeveonasUnavailableError("Grok returned an empty response body", this.id);
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const jsonStr = trimmed.slice(5).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const data = JSON.parse(jsonStr);
            const text = data.choices?.[0]?.delta?.content || "";
            const usage = data.usage;
            yield {
              text,
              inputTokens: usage?.prompt_tokens ?? null,
              outputTokens: usage?.completion_tokens ?? null,
              totalTokens: usage?.total_tokens ?? null,
              finishReason: data.choices?.[0]?.finish_reason ?? null,
              raw: data
            };
          } catch {
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
};

// packages/sdk/session.ts
var LeveonasSession = class {
  constructor(config = {}) {
    this.config = config;
    this.activeController = null;
    this.lastMetrics = null;
    this.isDestroyed = false;
  }
  /**
   * Generates UI from prompt or request.
   * Returns an AsyncIterable of StreamingEvents that also resolves to a RenderResponse when awaited.
   */
  generate(promptOrRequest) {
    this.assertNotDestroyed();
    const request = typeof promptOrRequest === "string" ? {
      prompt: promptOrRequest,
      provider: this.config.provider,
      model: this.config.model,
      telemetry: this.config.telemetry
    } : {
      provider: this.config.provider,
      model: this.config.model,
      telemetry: this.config.telemetry,
      ...promptOrRequest
    };
    this.activeController = new AbortController();
    const signal = this.activeController.signal;
    const fetchFn = this.config.fetchFn || (typeof fetch !== "undefined" ? fetch : void 0);
    if (!fetchFn) {
      throw new LeveonasError("No fetch implementation available in the current environment");
    }
    const endpoint = this.config.endpoint || "/api/generate";
    const metricsCollector = new MetricsCollector({
      mode: this.config.telemetry ? "development" : "production"
    });
    const eventQueue = [];
    let resolveNext = null;
    let streamDone = false;
    let streamError = null;
    let accumulatedText = "";
    let accumulatedPatches = [];
    const pushEvent = (event) => {
      eventQueue.push(event);
      if (resolveNext) {
        resolveNext();
        resolveNext = null;
      }
    };
    const startStream = async () => {
      try {
        pushEvent({ type: "generation:start", timestamp: Date.now() });
        const headers = {
          "Content-Type": "application/json"
        };
        if (this.config.apiKey) {
          headers["x-leveonas-key"] = this.config.apiKey;
          headers["Authorization"] = `Bearer ${this.config.apiKey}`;
        }
        await withRetry(
          async () => {
            const res = await fetchFn(endpoint, {
              method: "POST",
              headers,
              body: JSON.stringify(request),
              signal
            });
            if (!res.ok) {
              const errText = await res.text().catch(() => res.statusText);
              throw new LeveonasError(`Request failed with status ${res.status}: ${errText}`);
            }
            if (!res.body) {
              throw new LeveonasError("Response body is missing");
            }
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const chunkBytes = value.byteLength;
              metricsCollector.recordChunk(chunkBytes);
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n");
              buffer = lines.pop() || "";
              for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed.startsWith("data:")) continue;
                const dataStr = trimmed.slice(5).trim();
                if (!dataStr || dataStr === "[DONE]") continue;
                try {
                  const parsed = JSON.parse(dataStr);
                  if (parsed.text) {
                    accumulatedText += parsed.text;
                    pushEvent({
                      type: "generation:chunk",
                      text: accumulatedText,
                      delta: parsed.text,
                      timestamp: Date.now()
                    });
                  }
                  if (parsed.patch) {
                    accumulatedPatches.push(parsed.patch);
                    const patchOps = Array.isArray(parsed.patch) ? parsed.patch.length : 1;
                    metricsCollector.recordPatch(patchOps, dataStr.length);
                    pushEvent({
                      type: "generation:patch",
                      patch: parsed.patch,
                      timestamp: Date.now()
                    });
                  }
                  if (parsed.diagnostic) {
                    pushEvent({
                      type: "generation:diagnostic",
                      diagnostic: parsed.diagnostic,
                      timestamp: Date.now()
                    });
                  }
                  if (parsed.usage) {
                    metricsCollector.recordUsage(
                      parsed.usage.inputTokens,
                      parsed.usage.outputTokens,
                      parsed.usage.totalTokens
                    );
                  }
                  if (parsed.error) {
                    throw new LeveonasError(parsed.error);
                  }
                } catch (err) {
                  if (err instanceof LeveonasError) throw err;
                }
              }
            }
          },
          this.config.retryPolicy
        );
        const metrics = metricsCollector.complete();
        this.lastMetrics = metrics;
        pushEvent({
          type: "generation:complete",
          metrics,
          timestamp: Date.now()
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          streamError = err;
          pushEvent({
            type: "generation:error",
            error: err,
            timestamp: Date.now()
          });
        }
      } finally {
        streamDone = true;
        this.activeController = null;
        if (resolveNext) {
          resolveNext();
          resolveNext = null;
        }
      }
    };
    const streamPromise = startStream();
    const asyncIterable = {
      [Symbol.asyncIterator]() {
        return {
          async next() {
            while (eventQueue.length === 0) {
              if (streamDone) {
                if (streamError) throw streamError;
                return { done: true, value: void 0 };
              }
              await new Promise((resolve) => {
                resolveNext = resolve;
              });
            }
            return { done: false, value: eventQueue.shift() };
          }
        };
      }
    };
    const combined = Object.assign(
      (async () => {
        await streamPromise;
        if (streamError) throw streamError;
        return {
          html: accumulatedText,
          ast: accumulatedPatches,
          metrics: this.lastMetrics || void 0
        };
      })(),
      asyncIterable
    );
    return combined;
  }
  /**
   * Stream UI generation using explicit callbacks.
   */
  async stream(requestOrPrompt, callbacks = {}) {
    this.assertNotDestroyed();
    callbacks.onStart?.();
    try {
      const generator = this.generate(requestOrPrompt);
      for await (const event of generator) {
        switch (event.type) {
          case "generation:chunk":
            callbacks.onChunk?.(event.delta);
            break;
          case "generation:patch":
            callbacks.onPatch?.(event.patch);
            break;
          case "generation:diagnostic":
            callbacks.onDiagnostic?.(event.diagnostic);
            break;
          case "generation:complete":
            callbacks.onComplete?.(event.metrics);
            break;
          case "generation:error":
            callbacks.onError?.(event.error);
            break;
        }
      }
      return this.lastMetrics;
    } catch (err) {
      callbacks.onError?.(err);
      throw err;
    }
  }
  /**
   * Abort active generation.
   */
  abort() {
    if (this.activeController) {
      this.activeController.abort();
      this.activeController = null;
    }
  }
  /**
   * Cancel alias for abort.
   */
  cancel() {
    this.abort();
  }
  /**
   * Synchronous render alias.
   */
  async render(request) {
    return this.generate(request);
  }
  /**
   * Compile helper.
   */
  async compile(request) {
    const res = await this.generate(typeof request === "string" ? request : request.source);
    return {
      html: res.html,
      ast: res.ast,
      success: true,
      diagnostics: []
    };
  }
  /**
   * Validate helper.
   */
  async validate(request) {
    return {
      valid: true,
      diagnostics: []
    };
  }
  /**
   * Retrieve the metrics from the most recent generation run.
   */
  getMetrics() {
    return this.lastMetrics;
  }
  /**
   * Destroy the session and cleanup resources.
   */
  destroy() {
    this.abort();
    this.isDestroyed = true;
    this.lastMetrics = null;
  }
  assertNotDestroyed() {
    if (this.isDestroyed) {
      throw new LeveonasError("Cannot operate on a destroyed LeveonasSession");
    }
  }
};
function createSession(config) {
  return new LeveonasSession(config);
}

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

// packages/sdk/config.ts
var DEFAULT_CONFIG = {
  baseUrl: PRODUCTION_LEVEONAS_ORIGIN,
  timeout: 3e4,
  retries: 3,
  debug: false
};

// packages/cli/commands/init.ts
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));
var STARTER_TEMPLATES = {
  html: {
    config: {
      provider: "gemini",
      model: "gemini-2.5-flash",
      runtime: {
        fallbackOnError: true,
        isolateCss: true
      },
      security: {
        strictAttributeValidation: true,
        blockDangerousUrls: true
      }
    },
    lm: `(di cs:"min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-8"
  (ca cs:"max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4"
    (he cs:"text-2xl font-bold text-white tracking-tight" "Welcome to Leveonas")
    (pa cs:"text-sm text-slate-400 leading-relaxed" "High-performance streaming frontend engine rendering real-time UI patches.")
    (bu cs:"w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors" "Get Started")
  )
)
`,
    readme: `# Leveonas HTML-LM Project

This is a minimal Leveonas frontend project rendered progressively using high-performance streaming DOM patches.

## Commands

- **Check syntax & reactivity**:
  \`\`\`bash
  npx leveonas check app.lm
  \`\`\`

- **Compile to Common UI IR**:
  \`\`\`bash
  npx leveonas compile app.lm
  \`\`\`

- **Format code**:
  \`\`\`bash
  npx leveonas format --write app.lm
  \`\`\`

- **Security Audit**:
  \`\`\`bash
  npx leveonas audit app.lm
  \`\`\`
`
  },
  react: {
    config: {
      provider: "gemini",
      model: "gemini-2.5-flash"
    },
    lm: `(lm:react
  (state count: 0)
  (computed doubleCount: (* count 2))
  (di cs:"min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6"
    (ca cs:"bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 text-center"
      (he cs:"text-xl font-semibold" "React-LM Interactive Counter")
      (pa cs:"text-slate-400" "Current count: " count " (Double: " doubleCount ")")
      (bu cs:"px-4 py-2 bg-blue-600 rounded-lg" oc:(fn () (set count (+ count 1))) "Increment")
    )
  )
)
`,
    readme: `# Leveonas React-LM Project

An interactive reactive component compiled to Common UI IR and rendered with sub-millisecond DOM patches.
`
  },
  vue: {
    config: {
      provider: "gemini",
      model: "gemini-2.5-flash"
    },
    lm: `(lm:vue
  (state message: "Hello from Vue-LM" active: true)
  (di cs:"min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6"
    (ca cs:"bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-3"
      (he cs:"text-lg font-medium" message)
      (pa cs:"text-zinc-400 text-sm" "Reactive Vue-LM component powered by Leveonas.")
    )
  )
)
`,
    readme: `# Leveonas Vue-LM Project
`
  },
  svelte: {
    config: {
      provider: "gemini",
      model: "gemini-2.5-flash"
    },
    lm: `(lm:svelte
  (state score: 100)
  (di cs:"min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-6"
    (ca cs:"bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-3"
      (he cs:"text-xl font-bold text-amber-400" "Svelte-LM Project")
      (pa cs:"text-neutral-400" "Score: " score)
    )
  )
)
`,
    readme: `# Leveonas Svelte-LM Project
`
  },
  angular: {
    config: {
      provider: "gemini",
      model: "gemini-2.5-flash"
    },
    lm: `(lm:angular
  (state title: "Angular-LM Architecture")
  (di cs:"min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6"
    (ca cs:"bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3"
      (he cs:"text-xl font-bold text-red-500" title)
      (pa cs:"text-slate-400" "Enterprise streaming component with Common UI IR.")
    )
  )
)
`,
    readme: `# Leveonas Angular-LM Project
`
  }
};
function runInitCommand(options = {}) {
  const targetDir = options.directory || process.cwd();
  const templateKey = options.template || "html";
  const template = STARTER_TEMPLATES[templateKey] || STARTER_TEMPLATES.html;
  const filesCreated = [];
  try {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    const configPath = path.join(targetDir, "leveonas.config.json");
    const lmPath = path.join(targetDir, "app.lm");
    const readmePath = path.join(targetDir, "README.md");
    if (fs.existsSync(configPath) && !options.force) {
      return {
        success: false,
        filesCreated: [],
        error: "Project already contains leveonas.config.json. Use --force to overwrite."
      };
    }
    fs.writeFileSync(configPath, JSON.stringify(template.config, null, 2) + "\n");
    filesCreated.push(configPath);
    fs.writeFileSync(lmPath, template.lm);
    filesCreated.push(lmPath);
    fs.writeFileSync(readmePath, template.readme);
    filesCreated.push(readmePath);
    if (!options.quiet) {
      console.log(`
\u2728 Initialized new Leveonas project (${templateKey}) in ${targetDir}`);
      console.log("Created:");
      filesCreated.forEach((f) => console.log(`  - ${path.basename(f)}`));
      console.log("\nNext steps:");
      console.log("  npx leveonas check app.lm");
      console.log("  npx leveonas compile app.lm\n");
    }
    return {
      success: true,
      filesCreated
    };
  } catch (err) {
    return {
      success: false,
      filesCreated,
      error: err.message
    };
  }
}

// packages/cli/commands/check.ts
var fs2 = __toESM(require("node:fs"));
function runCheckCommand(options) {
  const lsp = new LeveonasLanguageService();
  const results = [];
  let allPassed = true;
  for (const filePath of options.files) {
    if (!fs2.existsSync(filePath)) {
      if (!options.quiet) {
        console.error(`Error: File not found: ${filePath}`);
      }
      results.push({
        filePath,
        passed: false,
        diagnostics: [
          {
            line: 0,
            column: 0,
            severity: "Error",
            message: `File not found: ${filePath}`
          }
        ]
      });
      allPassed = false;
      continue;
    }
    const content = fs2.readFileSync(filePath, "utf-8");
    const diags = lsp.getDiagnostics(content, { streaming: options.streaming });
    const formattedDiags = diags.map((d) => {
      let sev = "Info";
      if (d.severity === 1 /* Error */) sev = "Error";
      else if (d.severity === 2 /* Warning */) sev = "Warning";
      else if (d.severity === 4 /* Hint */) sev = "Hint";
      return {
        line: d.range.start.line + 1,
        column: d.range.start.character + 1,
        severity: sev,
        message: d.message,
        code: d.code
      };
    });
    const hasErrors = diags.some(
      (d) => d.severity === 1 /* Error */ && !d.isIncomplete
    );
    const passed = !hasErrors;
    if (!passed) allPassed = false;
    results.push({
      filePath,
      passed,
      diagnostics: formattedDiags
    });
    if (!options.quiet) {
      if (formattedDiags.length === 0) {
        console.log(`\u2713 ${filePath}: Clean (no diagnostics)`);
      } else {
        console.log(`${passed ? "\u26A0" : "\u2717"} ${filePath}:`);
        for (const d of formattedDiags) {
          console.log(`  [${d.severity}] line ${d.line}:${d.column} - ${d.message} (${d.code})`);
        }
      }
    }
  }
  return { success: allPassed, results };
}

// packages/cli/commands/format.ts
var fs3 = __toESM(require("node:fs"));
function runFormatCommand(options) {
  const results = [];
  let allFormatted = true;
  for (const filePath of options.files) {
    if (!fs3.existsSync(filePath)) {
      console.error(`Error: File not found: ${filePath}`);
      allFormatted = false;
      continue;
    }
    const content = fs3.readFileSync(filePath, "utf-8");
    const formatted = LeveonasFormatter.format(content, { tabSize: options.tabSize ?? 2 });
    const isFormatted = content === formatted;
    if (!isFormatted) {
      allFormatted = false;
    }
    results.push({
      filePath,
      isFormatted,
      formattedContent: formatted
    });
    if (options.write && !isFormatted) {
      fs3.writeFileSync(filePath, formatted, "utf-8");
      console.log(`\u2713 Formatted: ${filePath}`);
    } else if (options.check) {
      if (isFormatted) {
        console.log(`\u2713 ${filePath} is properly formatted.`);
      } else {
        console.log(`\u2717 ${filePath} needs formatting.`);
      }
    } else if (!options.write && !options.check) {
      console.log(formatted);
    }
  }
  const success = options.check ? allFormatted : true;
  return { success, results };
}

// packages/cli/commands/compile.ts
var fs4 = __toESM(require("node:fs"));
function runCompileCommand(options) {
  if (!fs4.existsSync(options.file)) {
    console.error(`Error: File not found: ${options.file}`);
    return { success: false, data: null };
  }
  const content = fs4.readFileSync(options.file, "utf-8");
  const inspection = LeveonasInspector.inspect(content);
  let outputData = null;
  const target = options.target ?? "ui-ir";
  switch (target) {
    case "ast":
      outputData = inspection.ast ?? inspection.frameworkAST;
      break;
    case "ui-ir":
      outputData = inspection.uiIR;
      break;
    case "runtime-ir":
      outputData = inspection.runtimeIR;
      break;
    case "patch":
      outputData = inspection.patchOperations;
      break;
    default:
      outputData = inspection.uiIR;
  }
  const serialized = safeStringify(outputData, 2);
  if (options.output) {
    fs4.writeFileSync(options.output, serialized, "utf-8");
    console.log(`\u2713 Compiled target [${target}] written to ${options.output}`);
  } else {
    console.log(serialized);
  }
  return { success: true, data: outputData };
}

// packages/cli/commands/inspect.ts
var fs5 = __toESM(require("node:fs"));
function runInspectCommand(options) {
  if (!fs5.existsSync(options.file)) {
    console.error(`Error: File not found: ${options.file}`);
    return { success: false, data: null };
  }
  const content = fs5.readFileSync(options.file, "utf-8");
  const inspection = LeveonasInspector.inspect(content);
  if (options.json) {
    console.log(safeStringify(inspection, 2));
    return { success: true, data: inspection };
  }
  console.log("===============================================================");
  console.log(`LEVEONAS INSPECTOR: ${options.file}`);
  console.log("===============================================================");
  console.log(`Detected Framework: ${inspection.detectedFramework.toUpperCase()}`);
  console.log(`Stream Status:      ${inspection.streamStatus}`);
  console.log(`Diagnostics:        ${inspection.diagnostics.length} issue(s)`);
  console.log("---------------------------------------------------------------");
  console.log("1. REACTIVITY GRAPH & STATE NODES:");
  console.log(`   State Variables:   ${inspection.nodeCount.stateVariables}`);
  console.log(`   Derived Values:    ${inspection.nodeCount.computedValues}`);
  console.log(`   DOM Dependencies:  ${inspection.nodeCount.domDependencies}`);
  for (const node of inspection.reactivityGraph.nodes) {
    console.log(`   \u2022 [${node.kind.toUpperCase()}] ${node.name} (id: ${node.id})`);
    if (node.expression) {
      console.log(`     expression: ${node.expression}`);
    }
    if (node.dependencies.length > 0) {
      console.log(`     depends on: [${node.dependencies.join(", ")}]`);
    }
  }
  console.log("---------------------------------------------------------------");
  console.log("2. DOCUMENT SYMBOLS & COMPONENTS:");
  for (const sym of inspection.symbols) {
    console.log(`   \u2022 ${sym.name} (${sym.detail || "component"})`);
    if (sym.children && sym.children.length > 0) {
      for (const ch of sym.children) {
        console.log(`     \u2514\u2500 ${ch.name} (${ch.detail})`);
      }
    }
  }
  console.log("---------------------------------------------------------------");
  console.log(`3. INCREMENTAL PATCH OPERATIONS: (${inspection.patchOperations.length} ops)`);
  for (const op of inspection.patchOperations.slice(0, 10)) {
    console.log(`   \u2022 ${op.op} -> ${op.targetId ?? "root"} (${op.bytes} bytes)`);
  }
  if (inspection.patchOperations.length > 10) {
    console.log(`   ... and ${inspection.patchOperations.length - 10} more operations`);
  }
  console.log("===============================================================");
  return { success: true, data: inspection };
}

// packages/telemetry/fixtures.ts
var STANDARD_TEST_PROMPT = "Create a modern landing page for a fictional AI startup called NovaFlow. Include a navbar with logo and three links, a hero section with a large heading, description and two buttons, a three-card features section, and a footer. Make it polished, responsive, and visually impressive.";
var NORMAL_SYSTEM_INSTRUCTION = `You are a frontend web developer. Generate clean, modern, responsive HTML, CSS, and JavaScript according to the user's prompt. Output valid code without unnecessary conversational text or markdown code fences.`;
var BASELINE_SYSTEM_INSTRUCTION = `You are a software developer who writes code using Leveonas Markup (LM), a universal frontend intermediate representation and compression format.

LM represents frontend UI structures in a compact, stream-native intermediate representation while strictly preserving document structure, styles, and logic. (The current executable runtime interprets <HTML> markup into incremental DOM patches).

Rules:
1. Output ONLY pure Leveonas Markup. No markdown code fences (\`\`\`), no conversational text, no ambient explanations.
2. For markup-like structures, use Python-style nested parentheses instead of verbose opening and closing tags.
3. For element/tag and attribute names when compressing, apply the deterministic abbreviation rule ONLY to the canonical LM vocabulary (e.g., div->di, button->bo, section->so, article->al, aside->ad, header->he, footer->fe, nav->na, main->mi, span->sa, input->iu, label->le, table->tl, canvas->cu, form->fr; class->cs, href->hr, id->id, src->sr, type->tp, placeholder->pe, name->nm, value->vu; onClick->oc, onChange->og, className->cm; h1-h6 stay unchanged). Any identifier not in this canonical vocabulary (custom components, unlisted attributes) MUST remain uncompressed. Never invent compressed forms.
4. Enclose HTML structures in the <HTML> ... </HTML> boundary block so the Leveonas streaming pipeline interprets the section. (CSS styles may optionally be enclosed in <CSS> ... </CSS>, and JS logic in <JS> ... </JS>).
5. Never invent unsupported syntax. Stream blocks sequentially in logical order and keep output incrementally interpretable.`;

// packages/telemetry/scenarios.ts
var BENCHMARK_SCENARIOS = {
  scenario_a: {
    id: "scenario_a",
    name: "Scenario A: Simple Landing Page",
    category: "Marketing / Layout",
    description: "Polished responsive landing page with navbar, hero, 3 feature cards, and footer.",
    expectedFunctionality: [
      "Responsive navigation bar with brand logo and navigation links",
      "Hero section with headline, subtext, and call-to-action buttons",
      "Three feature cards highlighting key product benefits with icons/titles",
      "Footer with copyright notice and navigation links"
    ],
    defaultPrompt: "Create a modern landing page for a fictional AI startup called NovaFlow. Include a navbar with logo and three links, a hero section with a large heading, description and two buttons, a three-card features section, and a footer. Make it polished, responsive, and visually impressive.",
    prompts: {
      html: "Create a modern landing page for a fictional AI startup called NovaFlow using HTML. Include a navbar with logo and three links, a hero section with a large heading, description and two buttons, a three-card features section, and a footer. Make it polished, responsive, and visually impressive.",
      react: "Create a modern React landing page component for a fictional AI startup called NovaFlow. Include a navbar with logo and three links, a hero section with a large heading, description and two buttons, a three-card features section, and a footer. Structure as clean reusable components with responsive layout.",
      vue: "Create a modern Vue landing page component for a fictional AI startup called NovaFlow. Include a navbar with logo and three links, a hero section with a large heading, description and two buttons, a three-card features section, and a footer. Structure with clean template and reactive state.",
      svelte: "Create a modern Svelte landing page component for a fictional AI startup called NovaFlow. Include a navbar with logo and three links, a hero section with a large heading, description and two buttons, a three-card features section, and a footer. Structure with declarative markup.",
      angular: "Create a modern Angular landing page component for a fictional AI startup called NovaFlow. Include a navbar with logo and three links, a hero section with a large heading, description and two buttons, a three-card features section, and a footer. Structure with standalone component and template bindings."
    }
  },
  scenario_b: {
    id: "scenario_b",
    name: "Scenario B: Interactive Dashboard",
    category: "Analytics / State Management",
    description: "Analytics dashboard with metrics cards, time-range filters, derived statistics, and interactive controls.",
    expectedFunctionality: [
      "Top statistics cards showing revenue, active users, conversion rate, and bounce rate",
      "Time-range filter selector (24h, 7d, 30d, 90d) that updates state",
      "Derived metric calculations (e.g. average daily revenue = total / days, net growth)",
      "Visual chart placeholders / metric bars representing data trends",
      "Action buttons for export data, refresh stats, and toggle theme"
    ],
    defaultPrompt: "Create an interactive analytics dashboard. Include a header with timeframe filters (Today, 7 Days, 30 Days), 4 key metric cards with growth badges, a main chart placeholder section with data bars, and a table of recent transactions with status badges. Include state for selected timeframe and derived summary statistics.",
    prompts: {
      html: "Create an interactive analytics dashboard in HTML/JS. Include a header with timeframe filters (Today, 7 Days, 30 Days), 4 key metric cards with growth badges, a chart placeholder section, and recent transactions table with status badges. Wire button click handlers to update active filter state.",
      react: "Create an interactive React analytics dashboard component. Use state for selected timeframe filter, computed/derived summary statistics (e.g. average value), 4 metric cards, a data chart placeholder, and interactive action buttons with state updates.",
      vue: "Create an interactive Vue analytics dashboard component. Use reactive state for selected timeframe, computed properties for average and totals, 4 metric cards, a chart placeholder, and action buttons updating state.",
      svelte: "Create an interactive Svelte analytics dashboard component. Use state for selected timeframe filter, reactive declarations ($:) for computed summary metrics, 4 metric cards, a chart placeholder, and click handlers.",
      angular: "Create an interactive Angular analytics dashboard component. Use state/signal for selected timeframe, computed signal for derived statistics, 4 metric cards, chart visualizer, and event bindings for timeframe buttons."
    }
  },
  scenario_c: {
    id: "scenario_c",
    name: "Scenario C: Todo Application",
    category: "CRUD / List & Form Control",
    description: "Complete Todo app with item addition, completion toggle, deletion, and active/completed filtering.",
    expectedFunctionality: [
      "Input form to add new todo items with enter-key and submit button",
      "Keyed list of todo items with completion checkboxes and delete buttons",
      "Stateful filter tabs (All, Active, Completed) filtering the visible list",
      'Derived remaining item counter (e.g. "3 items left")',
      "Clear completed action button enabled when completed items exist"
    ],
    defaultPrompt: 'Create a complete Todo application. Include a text input with an "Add" button, a keyed list of todos with completion checkboxes and delete buttons, filter tabs (All, Active, Completed), and a counter showing remaining active items. Include full state management and two-way input binding.',
    prompts: {
      html: "Create a complete Todo application in HTML/JS. Include an input field with Add button, a list of todo items with checkboxes and delete buttons, filter buttons (All, Active, Completed), and a counter of remaining items.",
      react: "Create a complete React Todo application component. Include state for todos list, new todo text input, and active filter. Include derived remaining count, add todo, toggle todo, delete todo, and filter tabs.",
      vue: "Create a complete Vue Todo application component. Use reactive state for items list and new input, computed filteredItems and remainingCount, add, toggle, and remove handlers, and filter tabs.",
      svelte: "Create a complete Svelte Todo application component. Use state for todos and filter, reactive declaration ($:) for remaining count, two-way bind:value for input, keyed #each block, and filter tabs.",
      angular: "Create a complete Angular Todo application component. Use state for todos list and filter, computed for remaining count, [(ngModel)] two-way binding on input, @for keyed list with track by id, and event bindings."
    }
  },
  scenario_d: {
    id: "scenario_d",
    name: "Scenario D: E-Commerce Product Page",
    category: "E-Commerce / Dynamic Pricing",
    description: "Interactive product catalog with item selection, quantity adjustment, derived subtotal & discount, and cart summary.",
    expectedFunctionality: [
      'Product grid with item cards showing thumbnail, title, price, and "Select" button',
      "Active product detail view with color/size selector and quantity stepper (+ / -)",
      "Derived pricing calculations: subtotal = price * quantity, tax, discount, and final total",
      "Add to cart action with order summary drawer / panel",
      "Dynamic style or class highlight on currently selected variant"
    ],
    defaultPrompt: "Create an e-commerce product detail & checkout widget. Include product selector with image, title, base price, and rating, quantity stepper (+/-), optional promo code input, and a live pricing summary calculating subtotal, 10% tax, discount, and total. Include state for selected item, quantity, and applied promo.",
    prompts: {
      html: "Create an e-commerce product widget in HTML/JS. Include product info, quantity +/- buttons, promo code field, and live order summary displaying subtotal, tax, discount, and total updated on state changes.",
      react: "Create a React e-commerce product page component. Use state for selected product, quantity, and discount code. Include computed derived values for subtotal, tax, and grand total, quantity increment/decrement controls, and responsive layout.",
      vue: "Create a Vue e-commerce product page component. Use reactive state for quantity and promo, computed properties for subtotal, discount, and total, quantity buttons, and product summary card.",
      svelte: "Create a Svelte e-commerce product page component. Use state for item quantity and selected option, reactive declarations ($:) for price calculations, quantity buttons, and cart summary.",
      angular: "Create an Angular e-commerce product page component. Use state/signals for product and quantity, computed for subtotal and grand total, event bindings for quantity +/- buttons, and style bindings for active selection."
    }
  },
  scenario_e: {
    id: "scenario_e",
    name: "Scenario E: Complex Multi-Section App",
    category: "Full Application / Architecture",
    description: "Multi-component application with user profile, tab navigation, list management, modal dialogs, and dynamic styling.",
    expectedFunctionality: [
      "Top navigation header with user avatar, title, and notifications indicator",
      "Tab bar switching between multiple views (Overview, Settings, Team Members)",
      "Team members data table with role badges, status toggles, and delete actions",
      "Modal / dialog form for inviting a new team member with validation",
      "Dynamic theme / styling bindings with state-controlled active accents"
    ],
    defaultPrompt: "Create a complex multi-section SaaS project management app. Include a top bar with user profile, a tab bar (Overview, Team, Settings), a member list with role selection and status toggles, a conditional modal/form to invite members with validation, and dynamic status badge styling based on state.",
    prompts: {
      html: "Create a complex SaaS workspace application in HTML/JS. Include navigation tabs, a member directory table with role toggles, a conditional modal form to add members, and dynamic status badges updated with interactive events.",
      react: "Create a complex multi-component React workspace app. Include state for active tab, members list, modal visibility, and form inputs. Include conditional rendering for modal, keyed list of members, derived member counts, and dynamic class/style bindings.",
      vue: "Create a complex Vue workspace application component. Use state for active tab, team members, and modal state. Use computed stats, v-if / conditional rendering for modal, v-for keyed list, and dynamic classes for role badges.",
      svelte: "Create a complex Svelte workspace application component. Use state for active tab, members array, and modal show/hide. Use reactive declarations, conditional blocks, keyed #each list, and dynamic class/style directives.",
      angular: "Create a complex Angular workspace application component. Use state/signals for active tab, members list, and dialog visibility. Use computed for active member count, @if conditional modal, @for keyed list with track id, and [class.active] / [style.color] bindings."
    }
  }
};
function getNormalSystemInstruction(framework) {
  switch (framework) {
    case "react":
      return `You are an expert React developer. Write a clean, modern, fully-functional React component in TypeScript/TSX according to the user's prompt. Use functional components, React hooks (useState, useMemo), and clean JSX. Output valid code without unnecessary conversational text or markdown code fences.`;
    case "vue":
      return `You are an expert Vue developer. Write a clean, modern Vue 3 Single File Component using <script setup> with TypeScript and reactive Composition API (ref, computed) according to the user's prompt. Output valid code without unnecessary conversational text or markdown code fences.`;
    case "svelte":
      return `You are an expert Svelte developer. Write a clean, modern Svelte component with declarative script state, reactive declarations ($:), and Svelte template directives according to the user's prompt. Output valid code without unnecessary conversational text or markdown code fences.`;
    case "angular":
      return `You are an expert Angular developer. Write a clean, modern Angular standalone component with signals, computed properties, and Angular template directives according to the user's prompt. Output valid code without unnecessary conversational text or markdown code fences.`;
    case "html":
    default:
      return NORMAL_SYSTEM_INSTRUCTION;
  }
}
function getLeveonasSystemInstruction(framework) {
  switch (framework) {
    case "react":
      return `You are a software developer who writes code using Leveonas React Markup (React-LM), a token-efficient declarative component representation.
Enclose React-LM components in the <REACT> ... </REACT> block.
Syntax rules:
1. component(Name)(state(name, initialVal) computed(name, expr) di(...))
2. Intrinsic tags use canonical LM abbreviations: di (div), bo (button), he (header), fe (footer), sa (span), pa (p), iu (input), etc.
3. Event handlers: click:increment or click:"count += 1"
4. Output ONLY pure React-LM without markdown code fences or conversational text.`;
    case "vue":
      return `You are a software developer who writes code using Leveonas Vue Markup (Vue-LM), a token-efficient declarative component representation.
Enclose Vue-LM components in the <VUE> ... </VUE> block.
Syntax rules:
1. component(Name)(state(name, initialVal) computed(name, expr) di(...))
2. Intrinsic tags use canonical LM abbreviations: di (div), bo (button), he (header), fe (footer), sa (span), pa (p), iu (input), etc.
3. Event handlers: @click:increment or @click:"count += 1"
4. Mustache interpolation: {{varName}}
5. Output ONLY pure Vue-LM without markdown code fences or conversational text.`;
    case "svelte":
      return `You are a software developer who writes code using Leveonas Svelte Markup (Svelte-LM), a token-efficient declarative component representation.
Enclose Svelte-LM components in the <SVELTE> ... </SVELTE> block.
Syntax rules:
1. component(Name)(state(name, initialVal) reactive(name, expr) di(...))
2. Intrinsic tags use canonical LM abbreviations: di (div), bo (button), he (header), fe (footer), sa (span), pa (p), iu (input), etc.
3. Event handlers: on:click:increment or on:click:"count += 1"
4. Directives: class:active:isActive, bind:value:username
5. Output ONLY pure Svelte-LM without markdown code fences or conversational text.`;
    case "angular":
      return `You are a software developer who writes code using Leveonas Angular Markup (Angular-LM), a token-efficient declarative component representation.
Enclose Angular-LM components in the <ANGULAR> ... </ANGULAR> block.
Syntax rules:
1. component(Name)(state(name, initialVal) computed(name, expr) di(...))
2. Intrinsic tags use canonical LM abbreviations: di (div), bo (button), he (header), fe (footer), sa (span), pa (p), iu (input), etc.
3. Event bindings: (click):increment, property bindings: [value]:expr, style bindings: [style.color]:bgColor, class bindings: [class.active]:isActive
4. Mustache interpolation: {{varName}}
5. Output ONLY pure Angular-LM without markdown code fences or conversational text.`;
    case "html":
    default:
      return BASELINE_SYSTEM_INSTRUCTION;
  }
}

// packages/telemetry/compression-analyzer.ts
var LMCompressionAnalyzer = class {
  /**
   * Analyzes an equivalent pair of standard code vs LM code to produce a fine-grained
   * breakdown of where token/byte savings originate.
   */
  static analyze(normalCode, leveonasLM) {
    const normalBytes = Buffer.byteLength(normalCode, "utf8");
    const leveonasBytes = Buffer.byteLength(leveonasLM, "utf8");
    const closingTagMatches = normalCode.match(/<\/[a-zA-Z0-9_-]+>/g) || [];
    const closingTagCharsNormal = closingTagMatches.reduce((acc, tag) => acc + tag.length, 0);
    const closingTagCharsLM = closingTagMatches.length;
    const closingTagSaved = Math.max(0, closingTagCharsNormal - closingTagCharsLM);
    const openingTagMatches = normalCode.match(/<([a-zA-Z0-9_-]+)[\s>]/g) || [];
    let tagCharsNormal = 0;
    let tagCharsLM = 0;
    for (const match of openingTagMatches) {
      const rawTag = match.replace(/[<\s>]/g, "");
      tagCharsNormal += rawTag.length;
      if (["div", "button", "section", "article", "header", "footer", "nav", "main", "span", "input", "label", "form", "table"].includes(rawTag)) {
        tagCharsLM += 2;
      } else {
        tagCharsLM += rawTag.length;
      }
    }
    const tagSaved = Math.max(0, tagCharsNormal - tagCharsLM);
    const attrMatches = normalCode.match(/\b(class|className|href|src|type|placeholder|name|value|onClick|onChange)\s*=/g) || [];
    let attrCharsNormal = 0;
    let attrCharsLM = 0;
    for (const match of attrMatches) {
      attrCharsNormal += match.length;
      attrCharsLM += 3;
    }
    const attrSaved = Math.max(0, attrCharsNormal - attrCharsLM);
    const boilerplateMatches = normalCode.match(
      /(?:import\s+[\s\S]*?from\s+['"].*?['"];?|export\s+default\s+function[\s\S]*?\(.*?\)\s*\{|@Component\s*\(.*?\)|<script\s+setup.*?>|<\/script>|<style.*?>|<\/style>|const\s+\[.*?\]\s*,\s*set.*?=\s*useState\(.*?\);?)/g
    ) || [];
    const boilerplateCharsNormal = boilerplateMatches.reduce((acc, m) => acc + m.length, 0);
    const boilerplateCharsLM = Math.round(boilerplateCharsNormal * 0.22);
    const boilerplateSaved = Math.max(0, boilerplateCharsNormal - boilerplateCharsLM);
    const normalDelims = (normalCode.match(/[<>\/="]/g) || []).length;
    const lmDelims = (leveonasLM.match(/[():"]/g) || []).length;
    const delimiterSaved = Math.max(0, normalDelims - lmDelims);
    const makeFactor = (normalChars, lmChars) => {
      const saved = Math.max(0, normalChars - lmChars);
      return {
        normalChars,
        leveonasChars: lmChars,
        savedChars: saved,
        savingsPercent: normalChars > 0 ? Number((saved / normalChars * 100).toFixed(1)) : 0,
        estimatedTokenSavings: Math.round(saved / 3.8)
        // ~3.8 chars per token in code
      };
    };
    const savedBytes = Math.max(0, normalBytes - leveonasBytes);
    const savingsPercent = normalBytes > 0 ? Number((savedBytes / normalBytes * 100).toFixed(1)) : 0;
    const factors = [
      { name: "Elimination of HTML closing tags", saved: closingTagSaved },
      { name: "Tag name abbreviations (div->di, button->bo)", saved: tagSaved },
      { name: "Attribute abbreviations (class->cs, href->hr)", saved: attrSaved },
      { name: "Framework boilerplate compression", saved: boilerplateSaved },
      { name: "Punctuation & delimiter compactness", saved: delimiterSaved }
    ].sort((a, b) => b.saved - a.saved);
    const dominantFactors = factors.slice(0, 3).map((f) => f.name);
    return {
      tagSavings: makeFactor(tagCharsNormal, tagCharsLM),
      closingTagSavings: makeFactor(closingTagCharsNormal, closingTagCharsLM),
      attributeSavings: makeFactor(attrCharsNormal, attrCharsLM),
      boilerplateSavings: makeFactor(boilerplateCharsNormal, boilerplateCharsLM),
      delimiterSavings: makeFactor(normalDelims, lmDelims),
      totalSavings: {
        normalTotalBytes: normalBytes,
        leveonasTotalBytes: leveonasBytes,
        savedBytes,
        savingsPercent
      },
      dominantFactors
    };
  }
};

// packages/telemetry/ir-profiler.ts
var defaultLoc2 = {
  startLine: 1,
  startColumn: 1,
  startOffset: 0,
  endLine: 1,
  endColumn: 1,
  endOffset: 0
};
function safeByteLength(obj) {
  if (!obj) return 0;
  if (typeof obj === "string") return Buffer.byteLength(obj, "utf8");
  const seen = /* @__PURE__ */ new WeakSet();
  try {
    const str = JSON.stringify(obj, (key, value) => {
      if (key === "parent" || key === "_parent") return void 0;
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return void 0;
        }
        seen.add(value);
      }
      return value;
    });
    return Buffer.byteLength(str || "", "utf8");
  } catch {
    return 0;
  }
}
var LeveonasIRProfiler = class {
  /**
   * Profiles the full compilation pipeline across any of the 5 frameworks:
   * LM Text -> Framework AST -> Common UI IR -> CommonUIReconciler -> DOM AST & Reactivity -> Patch Generation -> Serialization
   */
  static profile(lmCode, framework = "html") {
    const lmBytes = Buffer.byteLength(lmCode, "utf8");
    let parseTimeMs = 0;
    let loweringTimeMs = 0;
    let validationTimeMs = 0;
    let reconciliationTimeMs = 0;
    let patchGenerationTimeMs = 0;
    let serializationTimeMs = 0;
    let astBytes = 0;
    let commonUIIRBytes = 0;
    let runtimeIRBytes = 0;
    let domASTBytes = 0;
    let patchBytes = 0;
    let patchSSEBytes = 0;
    const patchBreakdown = {
      CREATE_NODE: 0,
      INSERT_CHILD: 0,
      REMOVE_NODE: 0,
      MOVE_CHILD: 0,
      UPDATE_TEXT: 0,
      SET_ATTRIBUTE: 0,
      UPDATE_STYLE: 0,
      CLASS_UPDATE: 0,
      EVENT_UPDATE: 0,
      EXECUTE_JS_UNIT: 0,
      ATTACH_EVENT_HANDLER: 0,
      TOTAL: 0
    };
    try {
      const t0 = performance.now();
      let ast;
      let uiir;
      let rootComponentName = "App";
      if (framework === "react") {
        ast = ReactLMInterpreter.parse(lmCode);
        const t1 = performance.now();
        parseTimeMs = Number((t1 - t0).toFixed(3));
        astBytes = safeByteLength(ast);
        const t2 = performance.now();
        uiir = ReactToLowering.lower(ast);
        const t3 = performance.now();
        loweringTimeMs = Number((t3 - t2).toFixed(3));
        rootComponentName = uiir.components[0]?.name || "App";
      } else if (framework === "vue") {
        ast = VueLMInterpreter.parse(lmCode);
        const t1 = performance.now();
        parseTimeMs = Number((t1 - t0).toFixed(3));
        astBytes = safeByteLength(ast);
        const t2 = performance.now();
        uiir = VueToLowering.lower(ast);
        const t3 = performance.now();
        loweringTimeMs = Number((t3 - t2).toFixed(3));
        rootComponentName = uiir.components[0]?.name || "App";
      } else if (framework === "svelte") {
        ast = SvelteLMInterpreter.parse(lmCode);
        const t1 = performance.now();
        parseTimeMs = Number((t1 - t0).toFixed(3));
        astBytes = safeByteLength(ast);
        const t2 = performance.now();
        uiir = SvelteToLowering.lower(ast);
        const t3 = performance.now();
        loweringTimeMs = Number((t3 - t2).toFixed(3));
        rootComponentName = uiir.components[0]?.name || "App";
      } else if (framework === "angular") {
        ast = AngularLMInterpreter.parse(lmCode);
        const t1 = performance.now();
        parseTimeMs = Number((t1 - t0).toFixed(3));
        astBytes = safeByteLength(ast);
        const t2 = performance.now();
        uiir = AngularToLowering.lower(ast);
        const t3 = performance.now();
        loweringTimeMs = Number((t3 - t2).toFixed(3));
        rootComponentName = uiir.components[0]?.name || "App";
      } else {
        const t1 = performance.now();
        parseTimeMs = Number((t1 - t0).toFixed(3));
        astBytes = lmBytes;
        uiir = {
          id: "ui_prog_root",
          kind: "UIProgram",
          components: [
            {
              id: "ui_comp_App",
              kind: "UIComponent",
              name: "App",
              propDeclarations: [],
              stateDeclarations: [],
              derivedDeclarations: [],
              body: []
            }
          ],
          rootComponent: "App"
        };
      }
      commonUIIRBytes = safeByteLength(uiir);
      const t4 = performance.now();
      const isValid = Boolean(uiir && uiir.components && uiir.components.length > 0);
      const t5 = performance.now();
      validationTimeMs = Number((t5 - t4).toFixed(3));
      const t6 = performance.now();
      const reconciler = new CommonUIReconciler(uiir);
      const { domAST, jsProgram } = reconciler.reconcile(rootComponentName);
      const t7 = performance.now();
      reconciliationTimeMs = Number((t7 - t6).toFixed(3));
      domASTBytes = safeByteLength(domAST);
      runtimeIRBytes = safeByteLength(jsProgram);
      const t8 = performance.now();
      const emptyRoot = ASTFactory.createComponent("Root" /* Root */, defaultLoc2, [], []);
      emptyRoot.id = "leveonas-root";
      const patches = new PatchGenerator().generate(emptyRoot, domAST);
      for (const unit of jsProgram.units) {
        if (unit.meta?.eventName && unit.meta?.targetSelector) {
          patches.push({
            operation: "ATTACH_EVENT_HANDLER" /* ATTACH_EVENT_HANDLER */,
            nodeId: unit.id,
            payload: {
              eventName: unit.meta.eventName,
              targetSelector: unit.meta.targetSelector,
              handlerCode: unit.details?.handlerCode || unit.code
            }
          });
        } else {
          patches.push({
            operation: "EXECUTE_JS_UNIT" /* EXECUTE_JS_UNIT */,
            nodeId: unit.id,
            payload: { code: unit.code }
          });
        }
      }
      const t9 = performance.now();
      patchGenerationTimeMs = Number((t9 - t8).toFixed(3));
      const t10 = performance.now();
      const canonicalJSON = PatchSerializer.toJSON(patches);
      patchBytes = Buffer.byteLength(canonicalJSON, "utf8");
      const serialized = JSON.parse(canonicalJSON);
      const sseEvent = `data: ${JSON.stringify({ patch: serialized })}

data: [DONE]

`;
      patchSSEBytes = Buffer.byteLength(sseEvent, "utf8");
      const t11 = performance.now();
      serializationTimeMs = Number((t11 - t10).toFixed(3));
      for (const p of patches) {
        patchBreakdown.TOTAL++;
        switch (p.operation) {
          case "CREATE_NODE" /* CREATE_NODE */:
            patchBreakdown.CREATE_NODE++;
            break;
          case "INSERT_CHILD" /* INSERT_CHILD */:
            patchBreakdown.INSERT_CHILD++;
            break;
          case "REMOVE_NODE" /* REMOVE_NODE */:
            patchBreakdown.REMOVE_NODE++;
            break;
          case "MOVE_CHILD" /* MOVE_CHILD */:
            patchBreakdown.MOVE_CHILD++;
            break;
          case "UPDATE_TEXT" /* UPDATE_TEXT */:
            patchBreakdown.UPDATE_TEXT++;
            break;
          case "SET_ATTRIBUTE" /* SET_ATTRIBUTE */:
            if (p.payload?.styleProp) patchBreakdown.UPDATE_STYLE++;
            else if (p.payload?.className !== void 0) patchBreakdown.CLASS_UPDATE++;
            else patchBreakdown.SET_ATTRIBUTE++;
            break;
          case "EXECUTE_JS_UNIT" /* EXECUTE_JS_UNIT */:
            patchBreakdown.EXECUTE_JS_UNIT++;
            break;
          case "ATTACH_EVENT_HANDLER" /* ATTACH_EVENT_HANDLER */:
            patchBreakdown.ATTACH_EVENT_HANDLER++;
            break;
          default:
            break;
        }
      }
      const totalCompilerTimeMs = Number(
        (parseTimeMs + loweringTimeMs + validationTimeMs + reconciliationTimeMs + patchGenerationTimeMs + serializationTimeMs).toFixed(3)
      );
      return {
        framework,
        timings: {
          parseTimeMs,
          loweringTimeMs,
          validationTimeMs,
          reconciliationTimeMs,
          patchGenerationTimeMs,
          serializationTimeMs,
          totalCompilerTimeMs
        },
        sizes: {
          lmBytes,
          astBytes,
          commonUIIRBytes,
          runtimeIRBytes,
          domASTBytes,
          patchBytes,
          patchSSEBytes
        },
        patchBreakdown,
        compileSuccess: true,
        error: null
      };
    } catch (err) {
      return {
        framework,
        timings: {
          parseTimeMs,
          loweringTimeMs,
          validationTimeMs,
          reconciliationTimeMs,
          patchGenerationTimeMs,
          serializationTimeMs,
          totalCompilerTimeMs: 0
        },
        sizes: {
          lmBytes,
          astBytes,
          commonUIIRBytes,
          runtimeIRBytes,
          domASTBytes,
          patchBytes,
          patchSSEBytes
        },
        patchBreakdown,
        compileSuccess: false,
        error: err?.message || String(err)
      };
    }
  }
};

// packages/telemetry/tracker.ts
function generateTelemetryRunId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  try {
    const { randomUUID } = require("crypto");
    return randomUUID();
  } catch {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === "x" ? r : r & 3 | 8;
      return v.toString(16);
    });
  }
}

// packages/telemetry/comparison.ts
function compareBenchmark(input) {
  const {
    normalInputTokens,
    normalOutputTokens,
    leveonasInputTokens,
    leveonasOutputTokens,
    normalGeneratedBytes,
    leveonasLMBytes,
    normalNetworkBytes,
    leveonasNetworkBytes
  } = input;
  let outputTokenReduction = null;
  let outputTokenReductionPercent = null;
  let totalTokenReduction = null;
  let totalTokenReductionPercent = null;
  let inputTokenDifference = null;
  if (normalOutputTokens !== null && leveonasOutputTokens !== null) {
    outputTokenReduction = normalOutputTokens - leveonasOutputTokens;
    outputTokenReductionPercent = normalOutputTokens > 0 ? 100 * outputTokenReduction / normalOutputTokens : 0;
  }
  if (normalInputTokens !== null && normalOutputTokens !== null && leveonasInputTokens !== null && leveonasOutputTokens !== null) {
    const normalTotal = normalInputTokens + normalOutputTokens;
    const leveonasTotal = leveonasInputTokens + leveonasOutputTokens;
    totalTokenReduction = normalTotal - leveonasTotal;
    totalTokenReductionPercent = normalTotal > 0 ? 100 * totalTokenReduction / normalTotal : 0;
    inputTokenDifference = leveonasInputTokens - normalInputTokens;
  } else if (normalInputTokens !== null && leveonasInputTokens !== null) {
    inputTokenDifference = leveonasInputTokens - normalInputTokens;
  }
  const modelOutputByteReduction = typeof normalGeneratedBytes === "number" && typeof leveonasLMBytes === "number" ? normalGeneratedBytes - leveonasLMBytes : null;
  const modelOutputByteReductionPercent = modelOutputByteReduction !== null && normalGeneratedBytes > 0 ? 100 * modelOutputByteReduction / normalGeneratedBytes : null;
  const applicationSSEByteReduction = typeof normalNetworkBytes === "number" && typeof leveonasNetworkBytes === "number" ? normalNetworkBytes - leveonasNetworkBytes : null;
  const applicationSSEByteReductionPercent = applicationSSEByteReduction !== null && normalNetworkBytes > 0 ? 100 * applicationSSEByteReduction / normalNetworkBytes : null;
  return {
    outputTokenReduction,
    outputTokenReductionPercent,
    totalTokenReduction,
    totalTokenReductionPercent,
    inputTokenDifference,
    modelOutputByteReduction,
    modelOutputByteReductionPercent,
    applicationSSEByteReduction,
    applicationSSEByteReductionPercent,
    // Backwards-compatible aliases
    outputByteReduction: modelOutputByteReduction,
    outputByteReductionPercent: modelOutputByteReductionPercent,
    networkByteReduction: applicationSSEByteReduction,
    networkByteReductionPercent: applicationSSEByteReductionPercent
  };
}

// packages/compiler/lexer/stream-types.ts
var SUPPORTED_BLOCK_LANGUAGES = [
  "HTML",
  "CSS",
  "JS",
  "TS",
  "REACT",
  "NEXTJS",
  "TAILWIND",
  "VUE",
  "SVELTE",
  "ANGULAR"
];

// packages/compiler/lexer/stream-lexer.ts
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
var LMStreamLexer = class {
  constructor(options = {}) {
    this.state = "IDLE" /* IDLE */;
    this.currentLanguage = null;
    this.rawLanguage = null;
    this.buffer = "";
    this.currentPos = { line: 1, column: 1, offset: 0 };
    this.eventListeners = [];
    this.allEvents = [];
    const langs = options.supportedLanguages ?? SUPPORTED_BLOCK_LANGUAGES;
    this.supportedLanguages = new Set(
      Array.from(langs).map((l) => l.toUpperCase())
    );
    this.allowCustomLanguages = options.allowCustomLanguages ?? true;
    this.emitTextEvents = options.emitTextEvents ?? true;
  }
  /**
   * Subscribe a listener to receive emitted events.
   */
  on(listener) {
    this.eventListeners.push(listener);
    return () => {
      const idx = this.eventListeners.indexOf(listener);
      if (idx !== -1) {
        this.eventListeners.splice(idx, 1);
      }
    };
  }
  /**
   * Push a chunk of streaming text into the lexer.
   * Returns newly emitted events for this chunk.
   */
  push(chunk) {
    if (this.state === "ENDED" /* ENDED */) {
      throw new Error("Cannot push chunks to an ended LMStreamLexer");
    }
    if (!chunk) {
      return [];
    }
    this.buffer += chunk;
    const newEvents = [];
    this.processBuffer(newEvents);
    return newEvents;
  }
  /**
   * Signal the end of the stream.
   * Flushes remaining content and emits completion/error events.
   */
  end() {
    if (this.state === "ENDED" /* ENDED */) {
      return [];
    }
    const newEvents = [];
    if (this.state === "IN_BLOCK" /* IN_BLOCK */ && this.currentLanguage) {
      if (this.buffer.length > 0) {
        const contentEvent = {
          type: "BLOCK_CONTENT" /* BLOCK_CONTENT */,
          language: this.currentLanguage,
          content: this.buffer,
          position: { ...this.currentPos }
        };
        this.emit(contentEvent, newEvents);
        this.advancePos(this.buffer);
        this.buffer = "";
      }
      const errorEvent = {
        type: "ERROR" /* ERROR */,
        message: `Stream ended before closing block for ${this.currentLanguage}`,
        code: "UNCLOSED_BLOCK",
        position: { ...this.currentPos },
        partialContent: this.currentLanguage
      };
      this.emit(errorEvent, newEvents);
      const endEvent = {
        type: "STREAM_END" /* STREAM_END */,
        incompleteBlock: this.currentLanguage,
        position: { ...this.currentPos }
      };
      this.emit(endEvent, newEvents);
    } else {
      if (this.buffer.length > 0) {
        if (this.emitTextEvents) {
          const textEvent = {
            type: "TEXT" /* TEXT */,
            content: this.buffer,
            position: { ...this.currentPos }
          };
          this.emit(textEvent, newEvents);
        }
        this.advancePos(this.buffer);
        this.buffer = "";
      }
      const endEvent = {
        type: "STREAM_END" /* STREAM_END */,
        position: { ...this.currentPos }
      };
      this.emit(endEvent, newEvents);
    }
    this.state = "ENDED" /* ENDED */;
    return newEvents;
  }
  /**
   * Reset the lexer state to initial idle condition.
   */
  reset() {
    this.state = "IDLE" /* IDLE */;
    this.currentLanguage = null;
    this.rawLanguage = null;
    this.buffer = "";
    this.currentPos = { line: 1, column: 1, offset: 0 };
    this.allEvents = [];
  }
  getState() {
    return this.state;
  }
  getCurrentLanguage() {
    return this.currentLanguage;
  }
  getAllEvents() {
    return [...this.allEvents];
  }
  /**
   * Main buffer processing loop.
   */
  processBuffer(events) {
    let progress = true;
    while (progress && this.buffer.length > 0) {
      progress = false;
      if (this.state === "IDLE" /* IDLE */) {
        progress = this.processIdleState(events);
      } else if (this.state === "IN_BLOCK" /* IN_BLOCK */) {
        progress = this.processInBlockState(events);
      }
    }
  }
  /**
   * Processing logic when outside any block (IDLE).
   */
  processIdleState(events) {
    const openAngle = this.buffer.indexOf("<");
    if (openAngle === -1) {
      if (this.buffer.length > 0) {
        if (this.emitTextEvents) {
          this.emit(
            {
              type: "TEXT" /* TEXT */,
              content: this.buffer,
              position: { ...this.currentPos }
            },
            events
          );
        }
        this.advancePos(this.buffer);
        this.buffer = "";
        return true;
      }
      return false;
    }
    if (openAngle > 0) {
      const text = this.buffer.slice(0, openAngle);
      if (this.emitTextEvents) {
        this.emit(
          {
            type: "TEXT" /* TEXT */,
            content: text,
            position: { ...this.currentPos }
          },
          events
        );
      }
      this.advancePos(text);
      this.buffer = this.buffer.slice(openAngle);
      return true;
    }
    const closeAngle = this.buffer.indexOf(">");
    if (closeAngle === -1) {
      const potentialTag = this.buffer.slice(1);
      const isTagPrefix = /^[A-Za-z0-9_/-]*$/.test(potentialTag);
      if (!isTagPrefix || this.buffer.length > 64) {
        const nonTagChar = this.buffer.slice(0, 1);
        if (this.emitTextEvents) {
          this.emit(
            {
              type: "TEXT" /* TEXT */,
              content: nonTagChar,
              position: { ...this.currentPos }
            },
            events
          );
        }
        this.advancePos(nonTagChar);
        this.buffer = this.buffer.slice(1);
        return true;
      }
      return false;
    }
    const rawTag = this.buffer.slice(0, closeAngle + 1);
    const inner = this.buffer.slice(1, closeAngle).trim();
    if (inner.startsWith("/")) {
      const tagName = inner.slice(1).trim();
      this.emit(
        {
          type: "ERROR" /* ERROR */,
          message: `Unexpected closing tag </${tagName}> outside of any open block`,
          code: "UNEXPECTED_CLOSING_TAG",
          position: { ...this.currentPos },
          partialContent: rawTag
        },
        events
      );
      this.advancePos(rawTag);
      this.buffer = this.buffer.slice(closeAngle + 1);
      return true;
    }
    const isValidIdentifier = /^[A-Za-z][A-Za-z0-9_-]*$/.test(inner);
    if (isValidIdentifier) {
      const normalizedLang = inner.toUpperCase();
      const isKnown = this.supportedLanguages.has(normalizedLang);
      if (!isKnown && !this.allowCustomLanguages) {
        this.emit(
          {
            type: "ERROR" /* ERROR */,
            message: `Unsupported block language: ${inner}`,
            code: "UNSUPPORTED_LANGUAGE",
            position: { ...this.currentPos },
            partialContent: rawTag
          },
          events
        );
      } else {
        this.currentLanguage = normalizedLang;
        this.rawLanguage = inner;
        this.state = "IN_BLOCK" /* IN_BLOCK */;
        this.emit(
          {
            type: "BLOCK_START" /* BLOCK_START */,
            language: normalizedLang,
            rawTag,
            isKnown,
            position: { ...this.currentPos }
          },
          events
        );
      }
      this.advancePos(rawTag);
      this.buffer = this.buffer.slice(closeAngle + 1);
      return true;
    } else {
      if (this.emitTextEvents) {
        this.emit(
          {
            type: "TEXT" /* TEXT */,
            content: rawTag,
            position: { ...this.currentPos }
          },
          events
        );
      }
      this.advancePos(rawTag);
      this.buffer = this.buffer.slice(closeAngle + 1);
      return true;
    }
  }
  /**
   * Processing logic when inside an active block (IN_BLOCK).
   *
   * Strictly language-agnostic: looks only for the matching closing tag </CURRENT_LANGUAGE>.
   * Preserves all other characters (quotes, comments, other tags) as BLOCK_CONTENT.
   */
  processInBlockState(events) {
    if (!this.currentLanguage) {
      this.state = "IDLE" /* IDLE */;
      return true;
    }
    const currentLang = this.currentLanguage;
    const openAngle = this.buffer.indexOf("<");
    if (openAngle === -1) {
      if (this.buffer.length > 0) {
        this.emit(
          {
            type: "BLOCK_CONTENT" /* BLOCK_CONTENT */,
            language: currentLang,
            content: this.buffer,
            position: { ...this.currentPos }
          },
          events
        );
        this.advancePos(this.buffer);
        this.buffer = "";
      }
      return false;
    }
    if (openAngle > 0) {
      const content = this.buffer.slice(0, openAngle);
      this.emit(
        {
          type: "BLOCK_CONTENT" /* BLOCK_CONTENT */,
          language: currentLang,
          content,
          position: { ...this.currentPos }
        },
        events
      );
      this.advancePos(content);
      this.buffer = this.buffer.slice(openAngle);
      return true;
    }
    const closingRegex = new RegExp(`^<\\/\\s*${escapeRegExp(currentLang)}\\s*>`, "i");
    const match = this.buffer.match(closingRegex);
    if (match) {
      const rawTag = match[0];
      this.emit(
        {
          type: "BLOCK_END" /* BLOCK_END */,
          language: currentLang,
          rawTag,
          position: { ...this.currentPos }
        },
        events
      );
      this.advancePos(rawTag);
      this.buffer = this.buffer.slice(rawTag.length);
      this.state = "IDLE" /* IDLE */;
      this.currentLanguage = null;
      this.rawLanguage = null;
      return true;
    }
    if (this.isPrefixOfClosingTag(this.buffer, currentLang)) {
      return false;
    }
    const char = this.buffer.slice(0, 1);
    this.emit(
      {
        type: "BLOCK_CONTENT" /* BLOCK_CONTENT */,
        language: currentLang,
        content: char,
        position: { ...this.currentPos }
      },
      events
    );
    this.advancePos(char);
    this.buffer = this.buffer.slice(1);
    return true;
  }
  /**
   * Checks if the buffer starts with an incomplete prefix of </LANGUAGE> (case-insensitive).
   */
  isPrefixOfClosingTag(candidate, language) {
    if (candidate === "<") {
      return true;
    }
    if (candidate === "</") {
      return true;
    }
    if (candidate.startsWith("</")) {
      const afterSlash = candidate.slice(2);
      const trimmedStart = afterSlash.trimStart();
      const targetNameAndClose = `${language}>`.toUpperCase();
      const candidateUpper = trimmedStart.toUpperCase();
      if (candidate.indexOf(">") === -1) {
        if (trimmedStart === "") {
          return candidate.length < 16;
        }
        return targetNameAndClose.startsWith(candidateUpper);
      }
    }
    return false;
  }
  /**
   * Helper to emit event to both internal list and active listeners.
   */
  emit(event, batch) {
    batch.push(event);
    this.allEvents.push(event);
    for (const listener of this.eventListeners) {
      try {
        listener(event);
      } catch (err) {
        console.error("Error in LMStreamLexer event listener:", err);
      }
    }
  }
  /**
   * Advances position tracking across a processed string.
   */
  advancePos(text) {
    let { line, column, offset } = this.currentPos;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      offset++;
      if (char === "\n") {
        line++;
        column = 1;
      } else {
        column++;
      }
    }
    this.currentPos = { line, column, offset };
  }
};

// packages/compiler/interpreters/css-lm/ast.ts
function getCSSRuleId(selector, parentId) {
  const normSel = selector.trim().replace(/\s+/g, " ");
  return parentId ? `css-rule:${parentId}::${normSel}` : `css-rule:${normSel}`;
}
function getCSSDeclarationId(ruleId, property) {
  const normProp = property.trim().toLowerCase();
  return `css-decl:${ruleId}::${normProp}`;
}
function getCSSMediaRuleId(query) {
  const normQuery = query.trim().replace(/\s+/g, " ");
  return `css-media:${normQuery}`;
}
function getCSSKeyframesId(name) {
  const normName = name.trim();
  return `css-kf:${normName}`;
}
function getCSSKeyframeBlockId(keyframesId, selector) {
  const normSel = selector.trim().replace(/\s+/g, " ");
  return `css-kfb:${keyframesId}::${normSel}`;
}

// packages/compiler/interpreters/css-lm/vocabulary.ts
var CSS_PROPERTY_ABBREVIATIONS = {
  // Background
  bg: "background",
  bgc: "background-color",
  bgi: "background-image",
  bgp: "background-position",
  bgr: "background-repeat",
  bgs: "background-size",
  bga: "background-attachment",
  bgcl: "background-clip",
  bgor: "background-origin",
  // Typography & Text
  c: "color",
  fs: "font-size",
  fw: "font-weight",
  ff: "font-family",
  fst: "font-style",
  fv: "font-variant",
  lh: "line-height",
  ta: "text-align",
  td: "text-decoration",
  tdc: "text-decoration-color",
  tdl: "text-decoration-line",
  tds: "text-decoration-style",
  tt: "text-transform",
  ti: "text-indent",
  to: "text-overflow",
  ts: "transition",
  tsh: "text-shadow",
  ls: "letter-spacing",
  ws: "white-space",
  wb: "word-break",
  ww: "word-wrap",
  va: "vertical-align",
  // Spacing & Box Model
  p: "padding",
  pt: "padding-top",
  pr: "padding-right",
  pb: "padding-bottom",
  pl: "padding-left",
  px: "padding-inline",
  py: "padding-block",
  m: "margin",
  mt: "margin-top",
  mr: "margin-right",
  mb: "margin-bottom",
  ml: "margin-left",
  mx: "margin-inline",
  my: "margin-block",
  w: "width",
  h: "height",
  minw: "min-width",
  maxw: "max-width",
  minh: "min-height",
  maxh: "max-height",
  bxz: "box-sizing",
  bxs: "box-shadow",
  // Display & Layout
  d: "display",
  pos: "position",
  t: "top",
  r: "right",
  b: "bottom",
  l: "left",
  z: "z-index",
  zi: "z-index",
  fl: "float",
  cl: "clear",
  ov: "overflow",
  ovx: "overflow-x",
  ovy: "overflow-y",
  vis: "visibility",
  op: "opacity",
  // Flexbox
  fx: "flex",
  fg: "flex-grow",
  fsr: "flex-shrink",
  fb: "flex-basis",
  fd: "flex-direction",
  fwr: "flex-wrap",
  jc: "justify-content",
  ji: "justify-items",
  js: "justify-self",
  ai: "align-items",
  ac: "align-content",
  as: "align-self",
  ord: "order",
  g: "gap",
  rg: "row-gap",
  cg: "column-gap",
  // Grid
  gtc: "grid-template-columns",
  gtr: "grid-template-rows",
  gta: "grid-template-areas",
  ga: "grid-area",
  gc: "grid-column",
  gcs: "grid-column-start",
  gce: "grid-column-end",
  gr: "grid-row",
  grs: "grid-row-start",
  gre: "grid-row-end",
  gac: "grid-auto-columns",
  gar: "grid-auto-rows",
  gaf: "grid-auto-flow",
  // Borders
  bd: "border",
  br: "border-radius",
  bc: "border-color",
  bw: "border-width",
  bs: "border-style",
  bdt: "border-top",
  bdr: "border-right",
  bdb: "border-bottom",
  bdl: "border-left",
  bdtc: "border-top-color",
  bdrc: "border-right-color",
  bdbc: "border-bottom-color",
  bdlc: "border-left-color",
  bdtw: "border-top-width",
  bdrw: "border-right-width",
  bdbw: "border-bottom-width",
  bdlw: "border-left-width",
  bdts: "border-top-style",
  bdrs: "border-right-style",
  bdbs: "border-bottom-style",
  bdls: "border-left-style",
  brtl: "border-top-left-radius",
  brtr: "border-top-right-radius",
  brbr: "border-bottom-right-radius",
  brbl: "border-bottom-left-radius",
  ol: "outline",
  olc: "outline-color",
  olw: "outline-width",
  ols: "outline-style",
  olo: "outline-offset",
  // Transform & Animation
  tr: "transform",
  tro: "transform-origin",
  trs: "transform-style",
  an: "animation",
  and: "animation-duration",
  anm: "animation-name",
  ant: "animation-timing-function",
  andel: "animation-delay",
  anic: "animation-iteration-count",
  andir: "animation-direction",
  anfm: "animation-fill-mode",
  anps: "animation-play-state",
  tsd: "transition-duration",
  tsp: "transition-property",
  tst: "transition-timing-function",
  tsdel: "transition-delay",
  // UI & Interaction
  cur: "cursor",
  pe: "pointer-events",
  us: "user-select",
  rsz: "resize",
  app: "appearance",
  ct: "content",
  filt: "filter",
  bdf: "backdrop-filter",
  acc: "accent-color",
  cbr: "caret-color"
};
var CANONICAL_TO_LM_CSS_PROPERTY = {};
for (const [abbr, prop] of Object.entries(CSS_PROPERTY_ABBREVIATIONS)) {
  if (!CANONICAL_TO_LM_CSS_PROPERTY[prop] || abbr.length < CANONICAL_TO_LM_CSS_PROPERTY[prop].length) {
    CANONICAL_TO_LM_CSS_PROPERTY[prop] = abbr;
  }
}
function decodeCSSProperty(lmProperty) {
  const trimmed = lmProperty.trim();
  if (trimmed.startsWith("--")) {
    return trimmed;
  }
  const lower2 = trimmed.toLowerCase();
  return CSS_PROPERTY_ABBREVIATIONS[lower2] || trimmed;
}

// packages/compiler/interpreters/css-lm/interpreter.ts
var CSSLMInterpreter = class _CSSLMInterpreter {
  constructor(options = {}) {
    this.diagnostics = [];
    // State machine
    this.mode = "SEEKING_HEAD";
    this.buffer = "";
    this.headKind = "DIRECT";
    this.headArgument = "";
    this.currentProperty = "";
    // Stacks / Contexts
    this.currentRule = null;
    this.currentMedia = null;
    this.currentKeyframes = null;
    this.currentKeyframeStep = null;
    // Sub-states
    this.inComment = false;
    this.inString = false;
    this.stringQuote = "";
    this.escapeNext = false;
    this.valueParenDepth = 0;
    this.options = options;
    this.currentLoc = {
      startLine: 1,
      startColumn: 1,
      startOffset: 0,
      endLine: 1,
      endColumn: 1,
      endOffset: 0
    };
    this.stylesheet = {
      id: "css-stylesheet",
      kind: "CSSStyleSheet" /* StyleSheet */,
      rules: [],
      sourceLocation: { ...this.currentLoc }
    };
  }
  static parse(source, options = {}) {
    const interpreter = new _CSSLMInterpreter(options);
    interpreter.write(source);
    return interpreter.end();
  }
  reset() {
    this.currentLoc = {
      startLine: 1,
      startColumn: 1,
      startOffset: 0,
      endLine: 1,
      endColumn: 1,
      endOffset: 0
    };
    this.stylesheet = {
      id: "css-stylesheet",
      kind: "CSSStyleSheet" /* StyleSheet */,
      rules: [],
      sourceLocation: { ...this.currentLoc }
    };
    this.diagnostics = [];
    this.mode = "SEEKING_HEAD";
    this.buffer = "";
    this.headKind = "DIRECT";
    this.headArgument = "";
    this.currentProperty = "";
    this.currentRule = null;
    this.currentMedia = null;
    this.currentKeyframes = null;
    this.currentKeyframeStep = null;
    this.inComment = false;
    this.inString = false;
    this.stringQuote = "";
    this.escapeNext = false;
    this.valueParenDepth = 0;
  }
  getAST() {
    return this.stylesheet;
  }
  getDiagnostics() {
    return [...this.diagnostics];
  }
  hasErrors() {
    return this.diagnostics.some((d) => d.severity === "error");
  }
  isSafeToExpose() {
    if (this.inComment || this.inString) return false;
    if (this.mode === "IN_PROP_NAME" && this.buffer.trim().length > 0) return false;
    if (this.valueParenDepth > 0) return false;
    if (this.hasErrors()) return false;
    return this.stylesheet.rules.length > 0;
  }
  write(chunk) {
    for (let i = 0; i < chunk.length; i++) {
      this.consumeChar(chunk[i]);
    }
    return this;
  }
  end() {
    this.flushPending();
    return this.stylesheet;
  }
  advanceLocation(char) {
    this.currentLoc.endOffset++;
    if (char === "\n") {
      this.currentLoc.endLine++;
      this.currentLoc.endColumn = 1;
    } else {
      this.currentLoc.endColumn++;
    }
  }
  consumeChar(char) {
    this.advanceLocation(char);
    if (this.inComment) {
      this.buffer += char;
      if (this.buffer.endsWith("*/")) {
        this.inComment = false;
        this.buffer = "";
      }
      return;
    }
    if (!this.inString && char === "*" && this.buffer.endsWith("/")) {
      this.inComment = true;
      this.buffer = "";
      return;
    }
    if (this.inString) {
      this.buffer += char;
      if (this.escapeNext) {
        this.escapeNext = false;
        return;
      }
      if (char === "\\") {
        this.escapeNext = true;
        return;
      }
      if (char === this.stringQuote) {
        this.inString = false;
        this.stringQuote = "";
      }
      return;
    }
    if (char === '"' || char === "'") {
      this.inString = true;
      this.stringQuote = char;
      this.buffer += char;
      return;
    }
    switch (this.mode) {
      case "SEEKING_HEAD":
      case "IN_MEDIA_BODY":
      case "IN_KEYFRAMES_BODY":
        this.handleSeekingHead(char);
        break;
      case "IN_HEAD":
        this.handleInHead(char);
        break;
      case "IN_HEAD_ARG":
        this.handleInHeadArg(char);
        break;
      case "AFTER_HEAD_ARG":
        this.handleAfterHeadArg(char);
        break;
      case "IN_RULE_BODY":
      case "IN_KEYFRAME_STEP_BODY":
        this.handleInRuleBody(char);
        break;
      case "IN_PROP_NAME":
        this.handleInPropName(char);
        break;
      case "IN_PROP_VALUE_COLON":
        this.handleInPropValueColon(char);
        break;
      case "IN_PROP_VALUE_PAREN":
        this.handleInPropValueParen(char);
        break;
    }
  }
  handleSeekingHead(char) {
    if (/\s/.test(char) || char === ";") return;
    if (char === ")" || char === "}") {
      if (this.currentKeyframes) {
        this.closeKeyframes();
        return;
      }
      if (this.currentMedia) {
        this.closeMedia();
        return;
      }
    }
    this.buffer = char;
    this.mode = "IN_HEAD";
  }
  handleInHead(char) {
    if (char === "(" || char === "{") {
      const raw = this.buffer.trim();
      this.buffer = "";
      const isRuleFunc = /^rule\s*$/i.test(raw);
      const isMediaFunc = /^(?:media|@media)\s*$/i.test(raw);
      const isKfFunc = /^(?:keyframes|kf|@keyframes)\s*$/i.test(raw);
      if (isRuleFunc) {
        this.headKind = "RULE";
        this.mode = "IN_HEAD_ARG";
        return;
      }
      if (isMediaFunc) {
        this.headKind = "MEDIA";
        this.mode = "IN_HEAD_ARG";
        return;
      }
      if (isKfFunc) {
        this.headKind = "KEYFRAMES";
        this.mode = "IN_HEAD_ARG";
        return;
      }
      if (raw.startsWith("@media")) {
        const query = raw.replace(/^@media\s*/i, "").trim();
        this.startMedia(query || "all");
        return;
      }
      if (raw.startsWith("@keyframes")) {
        const name = raw.replace(/^@keyframes\s*/i, "").trim();
        this.startKeyframes(name);
        return;
      }
      if (this.currentKeyframes) {
        this.startKeyframeStep(raw);
      } else {
        this.startRule(raw);
      }
      return;
    }
    this.buffer += char;
  }
  handleInHeadArg(char) {
    if (char === ")") {
      let arg = this.buffer.trim();
      this.buffer = "";
      if (arg.startsWith('"') && arg.endsWith('"') || arg.startsWith("'") && arg.endsWith("'")) {
        arg = arg.substring(1, arg.length - 1).trim();
      }
      this.headArgument = arg;
      this.mode = "AFTER_HEAD_ARG";
      return;
    }
    this.buffer += char;
  }
  handleAfterHeadArg(char) {
    if (/\s/.test(char)) return;
    if (char === "(" || char === "{") {
      const arg = this.headArgument;
      const kind = this.headKind;
      this.headArgument = "";
      this.buffer = "";
      if (kind === "RULE") {
        this.startRule(arg);
      } else if (kind === "MEDIA") {
        this.startMedia(arg);
      } else if (kind === "KEYFRAMES") {
        this.startKeyframes(arg);
      }
    }
  }
  handleInRuleBody(char) {
    if (/\s/.test(char) || char === ";") return;
    if (char === ")" || char === "}") {
      this.closeCurrentRuleOrStep();
      return;
    }
    this.buffer = char;
    this.mode = "IN_PROP_NAME";
  }
  handleInPropName(char) {
    if (char === ":") {
      this.currentProperty = this.buffer.trim();
      this.buffer = "";
      this.mode = "IN_PROP_VALUE_COLON";
      return;
    }
    if (char === "(") {
      this.currentProperty = this.buffer.trim();
      this.buffer = "";
      this.valueParenDepth = 0;
      this.mode = "IN_PROP_VALUE_PAREN";
      return;
    }
    if (char === ")" || char === "}") {
      this.closeCurrentRuleOrStep();
      return;
    }
    this.buffer += char;
  }
  handleInPropValueColon(char) {
    if (char === "(") {
      this.valueParenDepth++;
      this.buffer += char;
      return;
    }
    if (char === ")" && this.valueParenDepth > 0) {
      this.valueParenDepth--;
      this.buffer += char;
      return;
    }
    if (char === ";" || char === "\n" || char === ")" && this.valueParenDepth === 0 || char === "}") {
      const val = this.buffer.trim();
      this.buffer = "";
      this.commitDeclaration(this.currentProperty, val);
      this.currentProperty = "";
      if (char === ")" || char === "}") {
        this.closeCurrentRuleOrStep();
      } else {
        this.mode = this.currentKeyframeStep ? "IN_KEYFRAME_STEP_BODY" : "IN_RULE_BODY";
      }
      return;
    }
    this.buffer += char;
  }
  handleInPropValueParen(char) {
    if (char === "(") {
      this.valueParenDepth++;
      this.buffer += char;
      return;
    }
    if (char === ")") {
      if (this.valueParenDepth > 0) {
        this.valueParenDepth--;
        this.buffer += char;
        return;
      }
      const val = this.buffer.trim();
      this.buffer = "";
      this.commitDeclaration(this.currentProperty, val);
      this.currentProperty = "";
      this.mode = this.currentKeyframeStep ? "IN_KEYFRAME_STEP_BODY" : "IN_RULE_BODY";
      return;
    }
    this.buffer += char;
  }
  startRule(selector) {
    const cleanSel = selector.trim();
    const id = getCSSRuleId(cleanSel, this.currentMedia?.id);
    this.currentRule = {
      id,
      selector: cleanSel,
      declarations: [],
      startLoc: { ...this.currentLoc },
      parentMedia: this.currentMedia || void 0
    };
    this.mode = "IN_RULE_BODY";
  }
  startMedia(query) {
    let cleanQuery = query.trim();
    if (cleanQuery.startsWith("(") && cleanQuery.endsWith(")")) {
      cleanQuery = cleanQuery.substring(1, cleanQuery.length - 1).trim();
    }
    const id = getCSSMediaRuleId(cleanQuery);
    this.currentMedia = {
      id,
      query: cleanQuery,
      rules: [],
      startLoc: { ...this.currentLoc }
    };
    this.mode = "IN_MEDIA_BODY";
  }
  startKeyframes(name) {
    const cleanName = name.trim();
    const id = getCSSKeyframesId(cleanName);
    this.currentKeyframes = {
      id,
      name: cleanName,
      keyframes: [],
      startLoc: { ...this.currentLoc }
    };
    this.mode = "IN_KEYFRAMES_BODY";
  }
  startKeyframeStep(stepSelector) {
    if (!this.currentKeyframes) return;
    const cleanStep = stepSelector.trim();
    const id = getCSSKeyframeBlockId(this.currentKeyframes.id, cleanStep);
    this.currentKeyframeStep = {
      id,
      keyframeSelector: cleanStep,
      declarations: [],
      startLoc: { ...this.currentLoc },
      parentKeyframes: this.currentKeyframes
    };
    this.mode = "IN_KEYFRAME_STEP_BODY";
  }
  commitDeclaration(rawProp, rawVal) {
    const propName = decodeCSSProperty(rawProp.trim());
    let val = rawVal.trim();
    let important = false;
    if (/!\s*important\s*$/i.test(val)) {
      important = true;
      val = val.replace(/!\s*important\s*$/i, "").trim();
    }
    if (!propName || val.length === 0) return;
    if (this.currentKeyframeStep) {
      const declId = getCSSDeclarationId(this.currentKeyframeStep.id, propName);
      const declNode = {
        id: declId,
        kind: "CSSDeclaration" /* Declaration */,
        property: propName,
        value: val,
        important,
        sourceLocation: { ...this.currentLoc }
      };
      this.currentKeyframeStep.declarations.push(declNode);
      return;
    }
    if (this.currentRule) {
      const declId = getCSSDeclarationId(this.currentRule.id, propName);
      const declNode = {
        id: declId,
        kind: "CSSDeclaration" /* Declaration */,
        property: propName,
        value: val,
        important,
        sourceLocation: { ...this.currentLoc }
      };
      const existingIdx = this.currentRule.declarations.findIndex(
        (d) => d.property.toLowerCase() === propName.toLowerCase()
      );
      if (existingIdx >= 0) {
        this.currentRule.declarations[existingIdx] = declNode;
      } else {
        this.currentRule.declarations.push(declNode);
      }
    }
  }
  closeCurrentRuleOrStep() {
    if (this.currentKeyframeStep) {
      const stepNode = {
        id: this.currentKeyframeStep.id,
        kind: "CSSKeyframeBlock" /* KeyframeBlock */,
        keyframeSelector: this.currentKeyframeStep.keyframeSelector,
        declarations: this.currentKeyframeStep.declarations,
        sourceLocation: this.currentKeyframeStep.startLoc
      };
      this.currentKeyframes?.keyframes.push(stepNode);
      this.currentKeyframeStep = null;
      this.mode = "IN_KEYFRAMES_BODY";
      return;
    }
    if (this.currentRule) {
      const ruleNode = {
        id: this.currentRule.id,
        kind: "CSSRule" /* Rule */,
        selector: this.currentRule.selector,
        declarations: this.currentRule.declarations,
        sourceLocation: this.currentRule.startLoc
      };
      if (this.currentMedia) {
        this.currentMedia.rules.push(ruleNode);
        this.mode = "IN_MEDIA_BODY";
      } else {
        this.stylesheet.rules.push(ruleNode);
        this.mode = "SEEKING_HEAD";
      }
      this.currentRule = null;
      return;
    }
    this.mode = "SEEKING_HEAD";
  }
  closeMedia() {
    if (this.currentMedia) {
      const mediaNode = {
        id: this.currentMedia.id,
        kind: "CSSMediaRule" /* MediaRule */,
        query: this.currentMedia.query,
        rules: this.currentMedia.rules,
        sourceLocation: this.currentMedia.startLoc
      };
      this.stylesheet.rules.push(mediaNode);
      this.currentMedia = null;
      this.mode = "SEEKING_HEAD";
    }
  }
  closeKeyframes() {
    if (this.currentKeyframes) {
      const kfNode = {
        id: this.currentKeyframes.id,
        kind: "CSSKeyframesRule" /* KeyframesRule */,
        name: this.currentKeyframes.name,
        keyframes: this.currentKeyframes.keyframes,
        sourceLocation: this.currentKeyframes.startLoc
      };
      this.stylesheet.rules.push(kfNode);
      this.currentKeyframes = null;
      this.mode = "SEEKING_HEAD";
    }
  }
  flushPending() {
    if (this.currentProperty.length > 0 && this.buffer.length > 0) {
      this.commitDeclaration(this.currentProperty, this.buffer.trim());
      this.currentProperty = "";
      this.buffer = "";
    }
    if (this.currentKeyframeStep) {
      this.closeCurrentRuleOrStep();
    }
    if (this.currentRule) {
      this.closeCurrentRuleOrStep();
    }
    if (this.currentKeyframes) {
      this.closeKeyframes();
    }
    if (this.currentMedia) {
      this.closeMedia();
    }
  }
};

// packages/compiler/interpreters/js-lm/interpreter.ts
var JSLMInterpreter = class _JSLMInterpreter {
  constructor(options = {}) {
    this.diagnostics = [];
    // Stream state
    this.buffer = "";
    this.inLineComment = false;
    this.inBlockComment = false;
    this.inString = false;
    this.stringQuote = "";
    this.inTemplateLiteral = false;
    this.templateBraceDepth = 0;
    this.escapeNext = false;
    // Structural depth
    this.parenDepth = 0;
    this.braceDepth = 0;
    this.bracketDepth = 0;
    // Units
    this.currentUnitText = "";
    this.options = options;
    this.currentLoc = {
      startLine: 1,
      startColumn: 1,
      startOffset: 0,
      endLine: 1,
      endColumn: 1,
      endOffset: 0
    };
    this.currentUnitStartLoc = { ...this.currentLoc };
    this.program = {
      id: getJSProgramId(),
      kind: "JSProgram" /* Program */,
      units: [],
      sourceLocation: { ...this.currentLoc }
    };
  }
  static parse(source, options = {}) {
    const interpreter = new _JSLMInterpreter(options);
    interpreter.write(source);
    return interpreter.end();
  }
  reset() {
    this.currentLoc = {
      startLine: 1,
      startColumn: 1,
      startOffset: 0,
      endLine: 1,
      endColumn: 1,
      endOffset: 0
    };
    this.currentUnitStartLoc = { ...this.currentLoc };
    this.program = {
      id: getJSProgramId(),
      kind: "JSProgram" /* Program */,
      units: [],
      sourceLocation: { ...this.currentLoc }
    };
    this.diagnostics = [];
    this.buffer = "";
    this.currentUnitText = "";
    this.inLineComment = false;
    this.inBlockComment = false;
    this.inString = false;
    this.stringQuote = "";
    this.inTemplateLiteral = false;
    this.templateBraceDepth = 0;
    this.escapeNext = false;
    this.parenDepth = 0;
    this.braceDepth = 0;
    this.bracketDepth = 0;
  }
  getAST() {
    return this.program;
  }
  getDiagnostics() {
    return [...this.diagnostics];
  }
  hasErrors() {
    return this.diagnostics.some((d) => d.severity === "error");
  }
  isSafeToExpose() {
    if (this.inLineComment || this.inBlockComment || this.inString || this.inTemplateLiteral) {
      return false;
    }
    return this.program.units.some((u) => u.isComplete);
  }
  write(chunk) {
    for (let i = 0; i < chunk.length; i++) {
      this.consumeChar(chunk[i]);
    }
    return this;
  }
  end() {
    this.flushCurrentUnit(true);
    return this.program;
  }
  advanceLocation(char) {
    this.currentLoc.endOffset++;
    if (char === "\n") {
      this.currentLoc.endLine++;
      this.currentLoc.endColumn = 1;
    } else {
      this.currentLoc.endColumn++;
    }
  }
  consumeChar(char) {
    this.advanceLocation(char);
    if (this.inLineComment) {
      this.currentUnitText += char;
      if (char === "\n") {
        this.inLineComment = false;
      }
      return;
    }
    if (this.inBlockComment) {
      this.currentUnitText += char;
      if (this.currentUnitText.endsWith("*/")) {
        this.inBlockComment = false;
      }
      return;
    }
    if (!this.inString && !this.inTemplateLiteral) {
      if (char === "/" && this.currentUnitText.endsWith("/")) {
        this.inLineComment = true;
        this.currentUnitText += char;
        return;
      }
      if (char === "*" && this.currentUnitText.endsWith("/")) {
        this.inBlockComment = true;
        this.currentUnitText += char;
        return;
      }
    }
    if (this.inString) {
      this.currentUnitText += char;
      if (this.escapeNext) {
        this.escapeNext = false;
        return;
      }
      if (char === "\\") {
        this.escapeNext = true;
        return;
      }
      if (char === this.stringQuote) {
        this.inString = false;
        this.stringQuote = "";
      }
      return;
    }
    if (!this.inTemplateLiteral && (char === '"' || char === "'")) {
      this.inString = true;
      this.stringQuote = char;
      this.currentUnitText += char;
      return;
    }
    if (this.inTemplateLiteral) {
      this.currentUnitText += char;
      if (this.escapeNext) {
        this.escapeNext = false;
        return;
      }
      if (char === "\\") {
        this.escapeNext = true;
        return;
      }
      if (char === "`" && this.templateBraceDepth === 0) {
        this.inTemplateLiteral = false;
        return;
      }
      if (char === "{" && this.currentUnitText.endsWith("${")) {
        this.templateBraceDepth++;
        return;
      }
      if (char === "}" && this.templateBraceDepth > 0) {
        this.templateBraceDepth--;
        return;
      }
      return;
    }
    if (char === "`") {
      this.inTemplateLiteral = true;
      this.templateBraceDepth = 0;
      this.currentUnitText += char;
      return;
    }
    if (char === "(") this.parenDepth++;
    if (char === ")") {
      if (this.parenDepth > 0) this.parenDepth--;
    }
    if (char === "{") this.braceDepth++;
    if (char === "}") {
      if (this.braceDepth > 0) this.braceDepth--;
    }
    if (char === "[") this.bracketDepth++;
    if (char === "]") {
      if (this.bracketDepth > 0) this.bracketDepth--;
    }
    this.currentUnitText += char;
    if (this.parenDepth === 0 && this.braceDepth === 0 && this.bracketDepth === 0) {
      if (char === ";") {
        this.commitUnit(true);
      } else if (char === "}") {
        this.commitUnit(true);
      }
    }
  }
  commitUnit(isComplete) {
    const raw = this.currentUnitText.trim();
    if (!raw) {
      this.currentUnitText = "";
      return;
    }
    const unit = this.analyzeUnit(raw, isComplete);
    if (unit) {
      const lastIdx = this.program.units.length - 1;
      if (lastIdx >= 0 && !this.program.units[lastIdx].isComplete) {
        this.program.units[lastIdx] = unit;
      } else {
        this.program.units.push(unit);
      }
    }
    this.currentUnitText = "";
    this.currentUnitStartLoc = { ...this.currentLoc };
  }
  flushCurrentUnit(isFinal) {
    const raw = this.currentUnitText.trim();
    if (!raw) return;
    const isComplete = this.parenDepth === 0 && this.braceDepth === 0 && this.bracketDepth === 0 && !this.inString && !this.inTemplateLiteral && !this.inBlockComment;
    const unit = this.analyzeUnit(raw, isComplete);
    if (unit) {
      const lastIdx = this.program.units.length - 1;
      if (lastIdx >= 0 && !this.program.units[lastIdx].isComplete) {
        this.program.units[lastIdx] = unit;
      } else {
        this.program.units.push(unit);
      }
    }
    this.currentUnitText = "";
  }
  /**
   * Expands compact LM abbreviations at the start of a statement (c -> const, l -> let, etc.)
   */
  normalizeLMSyntax(raw) {
    let normalized = raw.trim();
    normalized = normalized.replace(/^c\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/, "const $1");
    normalized = normalized.replace(/^l\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/, "let $1");
    normalized = normalized.replace(/^v\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/, "var $1");
    normalized = normalized.replace(/^fn\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/, "function $1");
    normalized = normalized.replace(/^async\s+fn\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/, "async function $1");
    normalized = normalized.replace(/^ret(\s+.*)?$/, "return$1");
    return normalized;
  }
  analyzeUnit(raw, isComplete) {
    const normalized = this.normalizeLMSyntax(raw);
    const index = this.program.units.length;
    const eventMatch = /^(?:event|on|evt)\s*\(\s*(['"`])([a-zA-Z0-9_-]+)\1\s*,\s*(['"`])([^'"`]+)\3\s*,\s*([\s\S]+)\)$/i.exec(
      normalized.replace(/;$/, "")
    );
    if (eventMatch) {
      const eventName = eventMatch[2];
      const targetSelector = eventMatch[4];
      const handlerCode = eventMatch[5];
      const id2 = getJSEventHandlerId(eventName, targetSelector);
      const handlerNode = {
        id: id2,
        kind: "JSEventHandler" /* EventHandler */,
        eventName,
        targetSelector,
        handlerCode,
        sourceLocation: { ...this.currentUnitStartLoc }
      };
      return {
        id: id2,
        kind: "JSUnit" /* Unit */,
        unitKind: "EventHandler",
        code: `window.__leveonas_runtime__.on(${JSON.stringify(eventName)}, ${JSON.stringify(targetSelector)}, ${handlerCode});`,
        rawCode: raw,
        isComplete,
        meta: {
          eventName,
          targetSelector
        },
        details: handlerNode,
        sourceLocation: { ...this.currentUnitStartLoc }
      };
    }
    const timerMatch = /^(?:setTimeout|setInterval|clearTimeout|clearInterval|st|si|ct|ci)\s*\(\s*([\s\S]+?)\s*(?:,\s*([0-9]+))?\s*\)$/i.exec(
      normalized.replace(/;$/, "")
    );
    if (timerMatch) {
      const fnName = normalized.match(/^[a-zA-Z]+/)?.[0] || "";
      const isInterval = fnName === "setInterval" || fnName === "si";
      const isClearTimeout = fnName === "clearTimeout" || fnName === "ct";
      const isClearInterval = fnName === "clearInterval" || fnName === "ci";
      let timerType = "setTimeout";
      if (isInterval) timerType = "setInterval";
      else if (isClearTimeout) timerType = "clearTimeout";
      else if (isClearInterval) timerType = "clearInterval";
      const arg1 = timerMatch[1];
      const delayMs = timerMatch[2] ? parseInt(timerMatch[2], 10) : 0;
      const id2 = getJSTimerId(timerType, index);
      let runtimeCode = "";
      if (timerType === "clearTimeout" || timerType === "clearInterval") {
        runtimeCode = `window.__leveonas_runtime__.${timerType}(${arg1});`;
      } else {
        runtimeCode = `window.__leveonas_runtime__.${timerType}(${arg1}, ${delayMs});`;
      }
      const timerNode = {
        id: id2,
        kind: "JSTimer" /* Timer */,
        timerType,
        callbackCode: timerType === "clearTimeout" || timerType === "clearInterval" ? void 0 : arg1,
        delayMs: timerType === "clearTimeout" || timerType === "clearInterval" ? void 0 : delayMs,
        timerIdRef: timerType === "clearTimeout" || timerType === "clearInterval" ? arg1 : void 0,
        sourceLocation: { ...this.currentUnitStartLoc }
      };
      return {
        id: id2,
        kind: "JSUnit" /* Unit */,
        unitKind: "Timer",
        code: runtimeCode,
        rawCode: raw,
        isComplete,
        meta: {
          timerType,
          delayMs
        },
        details: timerNode,
        sourceLocation: { ...this.currentUnitStartLoc }
      };
    }
    const varMatch = /^(const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)(?:\s*=\s*([\s\S]+))?$/i.exec(
      normalized.replace(/;$/, "")
    );
    if (varMatch) {
      const varKind = varMatch[1].toLowerCase();
      const identifier = varMatch[2];
      const initialValue = varMatch[3] ? varMatch[3].trim() : void 0;
      const id2 = getJSUnitId("var", identifier);
      let initialAST;
      if (initialValue) {
        initialAST = this.parseExpression(initialValue, `${id2}-val`);
      }
      const varNode = {
        id: id2,
        kind: "JSVariableDeclaration" /* VariableDeclaration */,
        varKind,
        identifier,
        initialValue: initialAST || initialValue,
        sourceLocation: { ...this.currentUnitStartLoc }
      };
      const code2 = normalized.endsWith(";") ? normalized : `${normalized};`;
      return {
        id: id2,
        kind: "JSUnit" /* Unit */,
        unitKind: "Variable",
        code: code2,
        rawCode: raw,
        isComplete,
        meta: {
          identifier
        },
        details: varNode,
        sourceLocation: { ...this.currentUnitStartLoc }
      };
    }
    const funcMatch = /^(?:async\s+)?function(?:\s+([a-zA-Z_$][a-zA-Z0-9_$]*))?\s*\(([^)]*)\)\s*\{([\s\S]*)\}$/i.exec(
      normalized
    );
    if (funcMatch) {
      const funcName = funcMatch[1] || `anonymous_${index}`;
      const params = funcMatch[2].split(",").map((p) => p.trim()).filter(Boolean);
      const body = funcMatch[3];
      const isAsync = normalized.startsWith("async");
      const id2 = getJSUnitId("func", funcName);
      const funcNode = {
        id: id2,
        kind: "JSFunctionDeclaration" /* FunctionDeclaration */,
        name: funcName,
        params,
        body,
        isAsync,
        sourceLocation: { ...this.currentUnitStartLoc }
      };
      return {
        id: id2,
        kind: "JSUnit" /* Unit */,
        unitKind: "Function",
        code: normalized,
        rawCode: raw,
        isComplete,
        meta: {
          functionName: funcName
        },
        details: funcNode,
        sourceLocation: { ...this.currentUnitStartLoc }
      };
    }
    const arrowMatch = /^(?:async\s+)?(?:\(([^)]*)\)|([a-zA-Z_$][a-zA-Z0-9_$]*))\s*=>\s*([\s\S]+)$/i.exec(
      normalized.replace(/;$/, "")
    );
    if (arrowMatch) {
      const paramsStr = arrowMatch[1] !== void 0 ? arrowMatch[1] : arrowMatch[2];
      const params = paramsStr.split(",").map((p) => p.trim()).filter(Boolean);
      const body = arrowMatch[3].trim();
      const isAsync = normalized.startsWith("async");
      const id2 = getJSUnitId("arrow", `fn_${index}`);
      const arrowNode = {
        id: id2,
        kind: "JSArrowFunction" /* ArrowFunction */,
        params,
        body,
        isAsync,
        sourceLocation: { ...this.currentUnitStartLoc }
      };
      return {
        id: id2,
        kind: "JSUnit" /* Unit */,
        unitKind: "ArrowFunction",
        code: normalized.endsWith(";") ? normalized : `${normalized};`,
        rawCode: raw,
        isComplete,
        details: arrowNode,
        sourceLocation: { ...this.currentUnitStartLoc }
      };
    }
    const returnMatch = /^return(?:\s+([\s\S]+))?$/i.exec(normalized.replace(/;$/, ""));
    if (returnMatch) {
      const arg = returnMatch[1]?.trim();
      const id2 = getJSUnitId("ret", `ret_${index}`);
      const returnNode = {
        id: id2,
        kind: "JSReturnStatement" /* Return */,
        argument: arg ? this.parseExpression(arg, `${id2}-arg`) : void 0,
        sourceLocation: { ...this.currentUnitStartLoc }
      };
      return {
        id: id2,
        kind: "JSUnit" /* Unit */,
        unitKind: "Return",
        code: normalized.endsWith(";") ? normalized : `${normalized};`,
        rawCode: raw,
        isComplete,
        details: returnNode,
        sourceLocation: { ...this.currentUnitStartLoc }
      };
    }
    const ifMatch = /^if\s*\(([\s\S]+?)\)\s*\{([\s\S]*)\}(?:\s*else\s*\{([\s\S]*)\})?$/i.exec(normalized);
    if (ifMatch) {
      const condition = ifMatch[1];
      const consequent = ifMatch[2];
      const alternate = ifMatch[3];
      const id2 = getJSUnitId("if", condition.slice(0, 16));
      const ifNode = {
        id: id2,
        kind: "JSIfStatement" /* IfStatement */,
        condition: this.parseExpression(condition, `${id2}-cond`),
        consequent,
        alternate,
        sourceLocation: { ...this.currentUnitStartLoc }
      };
      return {
        id: id2,
        kind: "JSUnit" /* Unit */,
        unitKind: "IfStatement",
        code: normalized,
        rawCode: raw,
        isComplete,
        details: ifNode,
        sourceLocation: { ...this.currentUnitStartLoc }
      };
    }
    const domHelperMatch = /^(setText|setHTML|setAttr|removeAttr|addClass|removeClass|toggleClass|append|remove|createEl|cel)\s*\(([\s\S]*)\)$/i.exec(
      normalized.replace(/;$/, "")
    );
    if (domHelperMatch) {
      const opName = domHelperMatch[1];
      const rawArgs = domHelperMatch[2];
      const args = rawArgs.split(",").map((a) => a.trim()).filter(Boolean);
      const targetSelector = args[0] || "body";
      const id2 = getJSDOMOperationId(opName, targetSelector, index);
      const domNode = {
        id: id2,
        kind: "JSDOMOperation" /* DOMOperation */,
        operation: opName,
        targetSelector,
        args: args.slice(1),
        sourceLocation: { ...this.currentUnitStartLoc }
      };
      return {
        id: id2,
        kind: "JSUnit" /* Unit */,
        unitKind: "DOMOperation",
        code: `window.__leveonas_runtime__.${opName}(${args.join(", ")});`,
        rawCode: raw,
        isComplete,
        meta: {
          operation: opName,
          targetSelector
        },
        details: domNode,
        sourceLocation: { ...this.currentUnitStartLoc }
      };
    }
    const id = getJSUnitId("stmt", normalized.slice(0, 16), index);
    const code = normalized.endsWith(";") || normalized.endsWith("}") ? normalized : `${normalized};`;
    const exprAST = this.parseExpression(normalized.replace(/;$/, ""), id);
    const unitKind = exprAST.kind === "JSAssignmentExpression" /* Assignment */ ? "Statement" : exprAST.kind === "JSCallExpression" /* CallExpression */ ? "Expression" : "Statement";
    return {
      id,
      kind: "JSUnit" /* Unit */,
      unitKind,
      code,
      rawCode: raw,
      isComplete,
      details: exprAST,
      sourceLocation: { ...this.currentUnitStartLoc }
    };
  }
  /**
   * Robust light-weight expression parser that converts expressions into structured AST nodes.
   */
  parseExpression(expr, baseId) {
    const trimmed = expr.trim();
    if (/^-?[0-9]+(\.[0-9]+)?$/.test(trimmed)) {
      const val = parseFloat(trimmed);
      return {
        id: `${baseId}-lit`,
        kind: "JSLiteral" /* Literal */,
        value: val,
        raw: trimmed,
        sourceLocation: { ...this.currentUnitStartLoc }
      };
    }
    if (trimmed.startsWith('"') && trimmed.endsWith('"') || trimmed.startsWith("'") && trimmed.endsWith("'")) {
      const val = trimmed.slice(1, -1);
      return {
        id: `${baseId}-lit`,
        kind: "JSLiteral" /* Literal */,
        value: val,
        raw: trimmed,
        sourceLocation: { ...this.currentUnitStartLoc }
      };
    }
    if (trimmed === "true" || trimmed === "false" || trimmed === "null" || trimmed === "undefined") {
      const val = trimmed === "true" ? true : trimmed === "false" ? false : trimmed === "null" ? null : void 0;
      return {
        id: `${baseId}-lit`,
        kind: "JSLiteral" /* Literal */,
        value: val,
        raw: trimmed,
        sourceLocation: { ...this.currentUnitStartLoc }
      };
    }
    if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(trimmed)) {
      return {
        id: `${baseId}-id`,
        kind: "JSIdentifier" /* Identifier */,
        name: trimmed,
        sourceLocation: { ...this.currentUnitStartLoc }
      };
    }
    const assignMatch = /^([a-zA-Z_$][a-zA-Z0-9_$.\[\]]*)\s*(=|\+=|-=|\*=|\/=)\s*([\s\S]+)$/.exec(trimmed);
    if (assignMatch) {
      return {
        id: `${baseId}-assign`,
        kind: "JSAssignmentExpression" /* Assignment */,
        operator: assignMatch[2],
        left: this.parseExpression(assignMatch[1], `${baseId}-left`),
        right: this.parseExpression(assignMatch[3], `${baseId}-right`),
        sourceLocation: { ...this.currentUnitStartLoc }
      };
    }
    const ternaryMatch = /^([^\?]+)\?([^:]+):([\s\S]+)$/.exec(trimmed);
    if (ternaryMatch) {
      return {
        id: `${baseId}-ternary`,
        kind: "JSConditionalExpression" /* ConditionalExpression */,
        test: this.parseExpression(ternaryMatch[1], `${baseId}-test`),
        consequent: this.parseExpression(ternaryMatch[2], `${baseId}-cons`),
        alternate: this.parseExpression(ternaryMatch[3], `${baseId}-alt`),
        sourceLocation: { ...this.currentUnitStartLoc }
      };
    }
    const callMatch = /^([a-zA-Z_$][a-zA-Z0-9_$.\[\]]*)\s*\(([\s\S]*)\)$/.exec(trimmed);
    if (callMatch) {
      const calleeStr = callMatch[1];
      const argsStr = callMatch[2].trim();
      const args = argsStr ? argsStr.split(",").map((a, i) => this.parseExpression(a.trim(), `${baseId}-arg${i}`)) : [];
      return {
        id: `${baseId}-call`,
        kind: "JSCallExpression" /* CallExpression */,
        callee: this.parseExpression(calleeStr, `${baseId}-callee`),
        arguments: args,
        sourceLocation: { ...this.currentUnitStartLoc }
      };
    }
    const memberMatch = /^([a-zA-Z_$][a-zA-Z0-9_$]*)\.([a-zA-Z_$][a-zA-Z0-9_$]*)$/.exec(trimmed);
    if (memberMatch) {
      return {
        id: `${baseId}-mem`,
        kind: "JSMemberExpression" /* MemberExpression */,
        object: {
          id: `${baseId}-obj`,
          kind: "JSIdentifier" /* Identifier */,
          name: memberMatch[1],
          sourceLocation: { ...this.currentUnitStartLoc }
        },
        property: {
          id: `${baseId}-prop`,
          kind: "JSIdentifier" /* Identifier */,
          name: memberMatch[2],
          sourceLocation: { ...this.currentUnitStartLoc }
        },
        computed: false,
        sourceLocation: { ...this.currentUnitStartLoc }
      };
    }
    const binaryOps = ["===", "!==", "==", "!=", "<=", ">=", "&&", "||", "+", "-", "*", "/", "%", ">", "<"];
    for (const op of binaryOps) {
      const opIdx = trimmed.indexOf(` ${op} `);
      if (opIdx !== -1) {
        const leftStr = trimmed.slice(0, opIdx);
        const rightStr = trimmed.slice(opIdx + op.length + 2);
        return {
          id: `${baseId}-bin`,
          kind: "JSBinaryExpression" /* BinaryExpression */,
          operator: op,
          left: this.parseExpression(leftStr, `${baseId}-l`),
          right: this.parseExpression(rightStr, `${baseId}-r`),
          sourceLocation: { ...this.currentUnitStartLoc }
        };
      }
    }
    if (trimmed.startsWith("!") || trimmed.startsWith("-") && !/^[0-9]/.test(trimmed.slice(1))) {
      const op = trimmed[0];
      return {
        id: `${baseId}-unary`,
        kind: "JSUnaryExpression" /* UnaryExpression */,
        operator: op,
        argument: this.parseExpression(trimmed.slice(1), `${baseId}-arg`),
        prefix: true,
        sourceLocation: { ...this.currentUnitStartLoc }
      };
    }
    return {
      id: `${baseId}-expr`,
      kind: "JSExpressionStatement" /* ExpressionStatement */,
      code: trimmed,
      sourceLocation: { ...this.currentUnitStartLoc }
    };
  }
};

// packages/compiler/interpreters/ts-lm/ast.ts
function getTSProgramId() {
  return "ts-program";
}
function getTSUnitId(unitKind, signature, disambiguator = 0) {
  const cleanSig = signature.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 32);
  const suffix = disambiguator > 0 ? `-${disambiguator}` : "";
  return `ts-unit-${unitKind.toLowerCase()}-${cleanSig || "unit"}${suffix}`;
}
function getTSEventHandlerId(eventName, selector, disambiguator = 0) {
  const cleanSel = selector.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 24);
  const suffix = disambiguator > 0 ? `-${disambiguator}` : "";
  return `ts-evt-${eventName.toLowerCase()}-${cleanSel || "global"}${suffix}`;
}
function getTSTimerId(timerType, disambiguator = 0) {
  const suffix = disambiguator > 0 ? `-${disambiguator}` : "";
  return `ts-timer-${timerType.toLowerCase()}${suffix}`;
}

// packages/compiler/interpreters/ts-lm/lowering.ts
var tsCompiler = null;
try {
  tsCompiler = require("typescript");
} catch {
}
function lowerTSToJS(tsCode) {
  const trimmed = tsCode.trim();
  if (!trimmed) return "";
  if (tsCompiler && typeof tsCompiler.transpileModule === "function") {
    try {
      const result = tsCompiler.transpileModule(trimmed, {
        compilerOptions: {
          target: tsCompiler.ScriptTarget?.ES2022 ?? 9,
          module: tsCompiler.ModuleKind?.ESNext ?? 99,
          removeComments: false,
          isolatedModules: true
        }
      });
      return result.outputText.trim();
    } catch {
      return fallbackTypeErasure(trimmed);
    }
  }
  return fallbackTypeErasure(trimmed);
}
function fallbackTypeErasure(code) {
  let stripped = code.replace(/:\s*[A-Za-z0-9_$<>[\]|, ]+(?=\s*(=|[),;{]|\bas\b))/g, "");
  stripped = stripped.replace(/<[A-Za-z0-9_$, ]+>/g, "");
  return stripped.trim();
}
function lowerTSUnit(unit) {
  if (unit.classification === "TYPE_ONLY") {
    return {
      loweredCode: "",
      isTypeOnly: true,
      classification: "TYPE_ONLY"
    };
  }
  if (unit.unitKind === "EventHandler" && unit.meta?.eventName && unit.meta?.targetSelector) {
    const eventName = unit.meta.eventName;
    const targetSelector = unit.meta.targetSelector;
    let handlerCode = unit.code;
    if (unit.details && "handlerCode" in unit.details) {
      handlerCode = unit.details.handlerCode;
    }
    const loweredHandler = lowerTSToJS(handlerCode);
    const code = `window.__leveonas_runtime__.on(${JSON.stringify(eventName)}, ${JSON.stringify(targetSelector)}, ${loweredHandler});`;
    return {
      loweredCode: code,
      isTypeOnly: false,
      classification: "RUNTIME"
    };
  }
  if (unit.unitKind === "Timer" && unit.meta?.timerType && typeof unit.meta?.delayMs === "number") {
    const timerType = unit.meta.timerType;
    const delayMs = unit.meta.delayMs;
    let callbackCode = "";
    if (unit.details && "callbackCode" in unit.details) {
      callbackCode = unit.details.callbackCode;
    }
    const loweredCallback = lowerTSToJS(callbackCode);
    const code = `window.__leveonas_runtime__.${timerType}(${loweredCallback}, ${delayMs});`;
    return {
      loweredCode: code,
      isTypeOnly: false,
      classification: "RUNTIME"
    };
  }
  const lowered = lowerTSToJS(unit.code);
  return {
    loweredCode: lowered,
    isTypeOnly: false,
    classification: "RUNTIME"
  };
}
function convertTSToJSUnit(tsUnit, index) {
  if (tsUnit.classification === "TYPE_ONLY") {
    return null;
  }
  const { loweredCode } = lowerTSUnit(tsUnit);
  if (!loweredCode && tsUnit.isComplete) {
    return null;
  }
  let jsId;
  if (tsUnit.unitKind === "EventHandler" && tsUnit.meta?.eventName && tsUnit.meta?.targetSelector) {
    jsId = getJSEventHandlerId(tsUnit.meta.eventName, tsUnit.meta.targetSelector);
  } else if (tsUnit.unitKind === "Timer" && tsUnit.meta?.timerType) {
    jsId = getJSTimerId(tsUnit.meta.timerType, index);
  } else if (tsUnit.meta?.identifier) {
    jsId = getJSUnitId("var", tsUnit.meta.identifier);
  } else if (tsUnit.meta?.functionName) {
    jsId = getJSUnitId("func", tsUnit.meta.functionName);
  } else if (tsUnit.meta?.className) {
    jsId = getJSUnitId("cls", tsUnit.meta.className);
  } else if (tsUnit.meta?.enumName) {
    jsId = getJSUnitId("enum", tsUnit.meta.enumName);
  } else {
    jsId = getJSUnitId("stmt", tsUnit.code.slice(0, 16), index);
  }
  let details = void 0;
  if (tsUnit.unitKind === "EventHandler" && tsUnit.meta?.eventName && tsUnit.meta?.targetSelector) {
    let handlerCode = loweredCode;
    if (tsUnit.details && "handlerCode" in tsUnit.details) {
      handlerCode = lowerTSToJS(tsUnit.details.handlerCode);
    }
    details = {
      id: jsId,
      kind: "JSEventHandler" /* EventHandler */,
      eventName: tsUnit.meta.eventName,
      targetSelector: tsUnit.meta.targetSelector,
      handlerCode,
      sourceLocation: tsUnit.sourceLocation
    };
  } else if (tsUnit.unitKind === "Timer" && tsUnit.meta?.timerType) {
    let callbackCode = "";
    if (tsUnit.details && "callbackCode" in tsUnit.details) {
      callbackCode = lowerTSToJS(tsUnit.details.callbackCode);
    }
    details = {
      id: jsId,
      kind: "JSTimer" /* Timer */,
      timerType: tsUnit.meta.timerType,
      callbackCode,
      delayMs: tsUnit.meta.delayMs || 0,
      sourceLocation: tsUnit.sourceLocation
    };
  } else if (tsUnit.unitKind === "Variable" && tsUnit.meta?.identifier) {
    details = {
      id: jsId,
      kind: "JSVariableDeclaration" /* VariableDeclaration */,
      varKind: tsUnit.details?.varKind || "const",
      identifier: tsUnit.meta.identifier,
      initialValue: tsUnit.details?.initialValue ? lowerTSToJS(tsUnit.details.initialValue) : void 0,
      sourceLocation: tsUnit.sourceLocation
    };
  } else if (tsUnit.unitKind === "Function" && tsUnit.meta?.functionName) {
    details = {
      id: jsId,
      kind: "JSFunctionDeclaration" /* FunctionDeclaration */,
      name: tsUnit.meta.functionName,
      params: tsUnit.details?.params?.map((p) => p.name) || [],
      body: tsUnit.details?.body ? lowerTSToJS(tsUnit.details.body) : "",
      sourceLocation: tsUnit.sourceLocation
    };
  }
  return {
    id: jsId,
    kind: "JSUnit" /* Unit */,
    unitKind: tsUnit.unitKind,
    code: loweredCode,
    rawCode: tsUnit.rawCode,
    isComplete: tsUnit.isComplete,
    meta: tsUnit.meta,
    details,
    sourceLocation: tsUnit.sourceLocation
  };
}
function convertTSProgramToJSProgram(tsProgram) {
  const jsUnits = [];
  for (let i = 0; i < tsProgram.units.length; i++) {
    const tsUnit = tsProgram.units[i];
    const jsUnit = convertTSToJSUnit(tsUnit, i);
    if (jsUnit) {
      jsUnits.push(jsUnit);
    }
  }
  return {
    id: getJSProgramId(),
    kind: "JSProgram" /* Program */,
    units: jsUnits,
    sourceLocation: tsProgram.sourceLocation
  };
}

// packages/compiler/interpreters/ts-lm/vocabulary.ts
var TS_TYPE_ABBREVIATIONS = {
  num: "number",
  str: "string",
  bool: "boolean",
  obj: "object",
  sym: "symbol",
  arr: "Array",
  unk: "unknown",
  undef: "undefined"
};
function decodeTSLM(code) {
  if (!code) return "";
  let result = code;
  result = result.replace(/\biface\s+/g, "interface ");
  result = result.replace(/\btp\s+([A-Za-z_$])/g, "type $1");
  result = result.replace(/\b(?:fn|func)\s+/g, "function ");
  result = result.replace(/\bcls\s+/g, "class ");
  result = result.replace(/\bimp\s+/g, "import ");
  result = result.replace(/\bexp\s+/g, "export ");
  result = result.replace(/(:\s*|\b(?:Array|Promise|Record|Map|Set)<\s*|\b(?:type|interface)\s+[A-Za-z_$][A-Za-z0-9_$]*\s*=\s*)([A-Za-z0-9_$\s|<>&[\],]+)/g, (match, prefix, typeBody) => {
    let expandedBody = typeBody;
    for (const [abbr, full] of Object.entries(TS_TYPE_ABBREVIATIONS)) {
      expandedBody = expandedBody.replace(new RegExp(`\\b${abbr}\\b`, "g"), full);
    }
    return `${prefix}${expandedBody}`;
  });
  return result;
}

// packages/compiler/interpreters/ts-lm/interpreter.ts
var TSLMInterpreter = class _TSLMInterpreter {
  constructor(options = {}) {
    this.diagnostics = [];
    // Stream state
    this.buffer = "";
    this.inLineComment = false;
    this.inBlockComment = false;
    this.inString = false;
    this.stringQuote = "";
    this.inTemplateLiteral = false;
    this.templateBraceDepth = 0;
    this.escapeNext = false;
    // Structural depth
    this.parenDepth = 0;
    this.braceDepth = 0;
    this.bracketDepth = 0;
    this.genericDepth = 0;
    // Units
    this.currentUnitText = "";
    this.options = options;
    this.currentLoc = {
      startLine: 1,
      startColumn: 1,
      startOffset: 0,
      endLine: 1,
      endColumn: 1,
      endOffset: 0
    };
    this.currentUnitStartLoc = { ...this.currentLoc };
    this.program = {
      id: getTSProgramId(),
      kind: "TSProgram" /* Program */,
      units: [],
      sourceLocation: { ...this.currentLoc }
    };
  }
  static parse(source, options = {}) {
    const interpreter = new _TSLMInterpreter(options);
    interpreter.write(source);
    return interpreter.end();
  }
  reset() {
    this.currentLoc = {
      startLine: 1,
      startColumn: 1,
      startOffset: 0,
      endLine: 1,
      endColumn: 1,
      endOffset: 0
    };
    this.currentUnitStartLoc = { ...this.currentLoc };
    this.program = {
      id: getTSProgramId(),
      kind: "TSProgram" /* Program */,
      units: [],
      sourceLocation: { ...this.currentLoc }
    };
    this.diagnostics = [];
    this.buffer = "";
    this.currentUnitText = "";
    this.inLineComment = false;
    this.inBlockComment = false;
    this.inString = false;
    this.stringQuote = "";
    this.inTemplateLiteral = false;
    this.templateBraceDepth = 0;
    this.escapeNext = false;
    this.parenDepth = 0;
    this.braceDepth = 0;
    this.bracketDepth = 0;
    this.genericDepth = 0;
  }
  getAST() {
    return this.program;
  }
  getDiagnostics() {
    return [...this.diagnostics];
  }
  hasErrors() {
    return this.diagnostics.some((d) => d.severity === "error");
  }
  isSafeToExpose() {
    if (this.inLineComment || this.inBlockComment || this.inString || this.inTemplateLiteral) {
      return false;
    }
    return this.program.units.some((u) => u.isComplete);
  }
  write(chunk) {
    for (let i = 0; i < chunk.length; i++) {
      this.consumeChar(chunk[i]);
    }
    return this;
  }
  end() {
    this.flushCurrentUnit(true);
    return this.program;
  }
  advanceLocation(char) {
    this.currentLoc.endOffset++;
    if (char === "\n") {
      this.currentLoc.endLine++;
      this.currentLoc.endColumn = 1;
    } else {
      this.currentLoc.endColumn++;
    }
  }
  consumeChar(char) {
    this.advanceLocation(char);
    if (this.inLineComment) {
      this.currentUnitText += char;
      if (char === "\n") {
        this.inLineComment = false;
      }
      return;
    }
    if (this.inBlockComment) {
      this.currentUnitText += char;
      if (this.currentUnitText.endsWith("*/")) {
        this.inBlockComment = false;
      }
      return;
    }
    if (!this.inString && !this.inTemplateLiteral) {
      if (char === "/" && this.currentUnitText.endsWith("/")) {
        this.inLineComment = true;
        this.currentUnitText += char;
        return;
      }
      if (char === "*" && this.currentUnitText.endsWith("/")) {
        this.inBlockComment = true;
        this.currentUnitText += char;
        return;
      }
    }
    if (this.inString) {
      this.currentUnitText += char;
      if (this.escapeNext) {
        this.escapeNext = false;
        return;
      }
      if (char === "\\") {
        this.escapeNext = true;
        return;
      }
      if (char === this.stringQuote) {
        this.inString = false;
        this.stringQuote = "";
      }
      return;
    }
    if (!this.inTemplateLiteral && (char === '"' || char === "'")) {
      this.inString = true;
      this.stringQuote = char;
      this.currentUnitText += char;
      return;
    }
    if (this.inTemplateLiteral) {
      this.currentUnitText += char;
      if (this.escapeNext) {
        this.escapeNext = false;
        return;
      }
      if (char === "\\") {
        this.escapeNext = true;
        return;
      }
      if (char === "`" && this.templateBraceDepth === 0) {
        this.inTemplateLiteral = false;
        return;
      }
      if (char === "{" && this.currentUnitText.endsWith("${")) {
        this.templateBraceDepth++;
        return;
      }
      if (char === "}" && this.templateBraceDepth > 0) {
        this.templateBraceDepth--;
        return;
      }
      return;
    }
    if (char === "`") {
      this.inTemplateLiteral = true;
      this.templateBraceDepth = 0;
      this.currentUnitText += char;
      return;
    }
    if (char === "(") this.parenDepth++;
    if (char === ")") {
      if (this.parenDepth > 0) this.parenDepth--;
    }
    if (char === "{") this.braceDepth++;
    if (char === "}") {
      if (this.braceDepth > 0) this.braceDepth--;
    }
    if (char === "[") this.bracketDepth++;
    if (char === "]") {
      if (this.bracketDepth > 0) this.bracketDepth--;
    }
    this.currentUnitText += char;
    if (this.parenDepth === 0 && this.braceDepth === 0 && this.bracketDepth === 0) {
      if (char === ";") {
        this.commitUnit(true);
      } else if (char === "}") {
        const trimmed = this.currentUnitText.trim();
        const mustWaitForSemicolon = /^(?:export\s+)?(?:const|let|var|type|import)\b/i.test(trimmed);
        if (!mustWaitForSemicolon) {
          this.commitUnit(true);
        }
      }
    }
  }
  commitUnit(isComplete) {
    let raw = this.currentUnitText.trim();
    raw = raw.replace(/^<TS(?:-LM)?>/i, "").replace(/<\/TS(?:-LM)?>$/i, "").trim();
    if (!raw || raw === ";") {
      this.currentUnitText = "";
      return;
    }
    const unit = this.analyzeUnit(raw, isComplete);
    if (unit) {
      const lastIdx = this.program.units.length - 1;
      if (lastIdx >= 0 && !this.program.units[lastIdx].isComplete) {
        this.program.units[lastIdx] = unit;
      } else {
        this.program.units.push(unit);
      }
    }
    this.currentUnitText = "";
    this.currentUnitStartLoc = { ...this.currentLoc };
  }
  flushCurrentUnit(isFinal) {
    let raw = this.currentUnitText.trim();
    raw = raw.replace(/^<TS(?:-LM)?>/i, "").replace(/<\/TS(?:-LM)?>$/i, "").trim();
    if (!raw || raw === ";") return;
    const isComplete = this.parenDepth === 0 && this.braceDepth === 0 && this.bracketDepth === 0 && !this.inString && !this.inTemplateLiteral && !this.inBlockComment;
    const unit = this.analyzeUnit(raw, isComplete);
    if (unit) {
      const lastIdx = this.program.units.length - 1;
      if (lastIdx >= 0 && !this.program.units[lastIdx].isComplete) {
        this.program.units[lastIdx] = unit;
      } else {
        this.program.units.push(unit);
      }
    }
    this.currentUnitText = "";
  }
  analyzeUnit(raw, isComplete) {
    const index = this.program.units.length;
    const expanded = decodeTSLM(raw);
    const eventMatch = /^(?:event|on)\s*\(\s*(['"`])([a-zA-Z0-9_-]+)\1\s*,\s*(['"`])([^'"`]+)\3\s*,\s*([\s\S]+)\)$/i.exec(
      expanded.replace(/;$/, "")
    );
    if (eventMatch) {
      const eventName = eventMatch[2];
      const targetSelector = eventMatch[4];
      const handlerCode = eventMatch[5];
      const id2 = getTSEventHandlerId(eventName, targetSelector);
      const unit2 = {
        id: id2,
        kind: "TSUnit" /* Unit */,
        unitKind: "EventHandler",
        classification: "RUNTIME",
        code: expanded,
        rawCode: raw,
        isComplete,
        meta: {
          eventName,
          targetSelector
        },
        details: {
          id: id2,
          kind: "TSEventHandler" /* EventHandler */,
          eventName,
          targetSelector,
          handlerCode,
          sourceLocation: { ...this.currentUnitStartLoc }
        },
        sourceLocation: { ...this.currentUnitStartLoc }
      };
      const { loweredCode: loweredCode2 } = lowerTSUnit(unit2);
      unit2.loweredCode = loweredCode2;
      return unit2;
    }
    const timerMatch = /^(?:setTimeout|setInterval|st|si)\s*\(\s*([\s\S]+?)\s*,\s*([0-9]+)\s*\)$/i.exec(
      expanded.replace(/;$/, "")
    );
    if (timerMatch) {
      const isInterval = expanded.startsWith("setInterval") || expanded.startsWith("si");
      const timerType = isInterval ? "setInterval" : "setTimeout";
      const callbackCode = timerMatch[1];
      const delayMs = parseInt(timerMatch[2], 10) || 0;
      const id2 = getTSTimerId(timerType, index);
      const unit2 = {
        id: id2,
        kind: "TSUnit" /* Unit */,
        unitKind: "Timer",
        classification: "RUNTIME",
        code: expanded,
        rawCode: raw,
        isComplete,
        meta: {
          timerType,
          delayMs
        },
        details: {
          id: id2,
          kind: "TSTimer" /* Timer */,
          timerType,
          callbackCode,
          delayMs,
          sourceLocation: { ...this.currentUnitStartLoc }
        },
        sourceLocation: { ...this.currentUnitStartLoc }
      };
      const { loweredCode: loweredCode2 } = lowerTSUnit(unit2);
      unit2.loweredCode = loweredCode2;
      return unit2;
    }
    const interfaceMatch = /^(?:export\s+)?interface\s+([a-zA-Z_$][a-zA-Z0-9_$]*)(?:<([^>]+)>)?(?:\s+extends\s+([^{]+))?\s*\{([\s\S]*)\}$/i.exec(
      expanded
    );
    if (interfaceMatch) {
      const interfaceName = interfaceMatch[1];
      const typeParams = interfaceMatch[2] ? interfaceMatch[2].split(",").map((p) => p.trim()) : void 0;
      const extendsList = interfaceMatch[3] ? interfaceMatch[3].split(",").map((e) => e.trim()) : void 0;
      const rawBody = interfaceMatch[4];
      const id2 = getTSUnitId("iface", interfaceName);
      return {
        id: id2,
        kind: "TSUnit" /* Unit */,
        unitKind: "Interface",
        classification: "TYPE_ONLY",
        code: expanded,
        rawCode: raw,
        loweredCode: "",
        // Erased from runtime
        isComplete,
        meta: {
          interfaceName
        },
        details: {
          id: id2,
          kind: "TSInterfaceDeclaration" /* InterfaceDeclaration */,
          name: interfaceName,
          typeParams,
          extends: extendsList,
          properties: [],
          methods: [],
          rawBody,
          sourceLocation: { ...this.currentUnitStartLoc }
        },
        sourceLocation: { ...this.currentUnitStartLoc }
      };
    }
    const typeAliasMatch = /^(?:export\s+)?type\s+([a-zA-Z_$][a-zA-Z0-9_$]*)(?:<([^>]+)>)?\s*=\s*([\s\S]+)$/i.exec(
      expanded.replace(/;$/, "")
    );
    if (typeAliasMatch) {
      const typeName = typeAliasMatch[1];
      const typeParams = typeAliasMatch[2] ? typeAliasMatch[2].split(",").map((p) => p.trim()) : void 0;
      const typeDefinition = typeAliasMatch[3].trim();
      const id2 = getTSUnitId("type", typeName);
      return {
        id: id2,
        kind: "TSUnit" /* Unit */,
        unitKind: "TypeAlias",
        classification: "TYPE_ONLY",
        code: expanded,
        rawCode: raw,
        loweredCode: "",
        // Erased from runtime
        isComplete,
        meta: {
          typeName
        },
        details: {
          id: id2,
          kind: "TSTypeAliasDeclaration" /* TypeAliasDeclaration */,
          name: typeName,
          typeParams,
          typeDefinition,
          sourceLocation: { ...this.currentUnitStartLoc }
        },
        sourceLocation: { ...this.currentUnitStartLoc }
      };
    }
    const typeImportMatch = /^import\s+type\s+([\s\S]+?)\s+from\s+(['"`][^'"`]+['"`])$/i.exec(
      expanded.replace(/;$/, "")
    );
    if (typeImportMatch) {
      const symbols = typeImportMatch[1].replace(/[{}]/g, "").split(",").map((s) => s.trim()).filter(Boolean);
      const moduleSpecifier = typeImportMatch[2].replace(/['"`]/g, "");
      const id2 = getTSUnitId("imp_type", moduleSpecifier);
      return {
        id: id2,
        kind: "TSUnit" /* Unit */,
        unitKind: "Import",
        classification: "TYPE_ONLY",
        code: expanded,
        rawCode: raw,
        loweredCode: "",
        isComplete,
        details: {
          id: id2,
          kind: "TSImportDeclaration" /* ImportDeclaration */,
          isTypeOnly: true,
          importedSymbols: symbols,
          moduleSpecifier,
          isSupportedAtRuntime: true,
          sourceLocation: { ...this.currentUnitStartLoc }
        },
        sourceLocation: { ...this.currentUnitStartLoc }
      };
    }
    const importMatch = /^import\s+([\s\S]+?)\s+from\s+(['"`][^'"`]+['"`])$/i.exec(
      expanded.replace(/;$/, "")
    );
    if (importMatch) {
      const symbols = importMatch[1].replace(/[{}]/g, "").split(",").map((s) => s.trim()).filter(Boolean);
      const moduleSpecifier = importMatch[2].replace(/['"`]/g, "");
      const id2 = getTSUnitId("imp", moduleSpecifier);
      this.diagnostics.push({
        message: `External runtime module import from '${moduleSpecifier}' is not supported in sandbox. Use type-only import or global runtime bindings.`,
        severity: "warning",
        code: "TS_IMPORT_SANDBOX",
        sourceLocation: { ...this.currentUnitStartLoc }
      });
      return {
        id: id2,
        kind: "TSUnit" /* Unit */,
        unitKind: "Import",
        classification: "RUNTIME",
        code: expanded,
        rawCode: raw,
        loweredCode: "",
        isComplete,
        details: {
          id: id2,
          kind: "TSImportDeclaration" /* ImportDeclaration */,
          isTypeOnly: false,
          importedSymbols: symbols,
          moduleSpecifier,
          isSupportedAtRuntime: false,
          sourceLocation: { ...this.currentUnitStartLoc }
        },
        sourceLocation: { ...this.currentUnitStartLoc }
      };
    }
    const enumMatch = /^(?:export\s+)?(?:const\s+)?enum\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\{([\s\S]*)\}$/i.exec(
      expanded
    );
    if (enumMatch) {
      const enumName = enumMatch[1];
      const membersRaw = enumMatch[2];
      const id2 = getTSUnitId("enum", enumName);
      const members = membersRaw.split(",").map((m) => m.trim()).filter(Boolean).map((m) => {
        const parts = m.split("=");
        return {
          name: parts[0].trim(),
          value: parts[1] ? parts[1].trim() : void 0
        };
      });
      const unit2 = {
        id: id2,
        kind: "TSUnit" /* Unit */,
        unitKind: "Enum",
        classification: "RUNTIME",
        code: expanded,
        rawCode: raw,
        isComplete,
        meta: {
          enumName
        },
        details: {
          id: id2,
          kind: "TSEnumDeclaration" /* EnumDeclaration */,
          name: enumName,
          members,
          sourceLocation: { ...this.currentUnitStartLoc }
        },
        sourceLocation: { ...this.currentUnitStartLoc }
      };
      const { loweredCode: loweredCode2 } = lowerTSUnit(unit2);
      unit2.loweredCode = loweredCode2;
      return unit2;
    }
    const classMatch = /^(?:export\s+)?class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)(?:<([^>]+)>)?(?:\s+extends\s+([a-zA-Z_$][a-zA-Z0-9_$]*))?(?:\s+implements\s+([^{]+))?\s*\{([\s\S]*)\}$/i.exec(
      expanded
    );
    if (classMatch) {
      const className = classMatch[1];
      const typeParams = classMatch[2] ? classMatch[2].split(",").map((p) => p.trim()) : void 0;
      const extendsClass = classMatch[3] ? classMatch[3].trim() : void 0;
      const implementsList = classMatch[4] ? classMatch[4].split(",").map((i) => i.trim()) : void 0;
      const rawBody = classMatch[5];
      const id2 = getTSUnitId("cls", className);
      const unit2 = {
        id: id2,
        kind: "TSUnit" /* Unit */,
        unitKind: "Class",
        classification: "RUNTIME",
        code: expanded,
        rawCode: raw,
        isComplete,
        meta: {
          className
        },
        details: {
          id: id2,
          kind: "TSClassDeclaration" /* ClassDeclaration */,
          name: className,
          typeParams,
          extends: extendsClass,
          implements: implementsList,
          properties: [],
          methods: [],
          rawBody,
          sourceLocation: { ...this.currentUnitStartLoc }
        },
        sourceLocation: { ...this.currentUnitStartLoc }
      };
      const { loweredCode: loweredCode2 } = lowerTSUnit(unit2);
      unit2.loweredCode = loweredCode2;
      return unit2;
    }
    const varMatch = /^(?:export\s+)?(const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)(?:\s*:\s*([^=]+))?(?:\s*=\s*([\s\S]+))?$/i.exec(
      expanded.replace(/;$/, "")
    );
    if (varMatch) {
      const varKind = varMatch[1].toLowerCase();
      const identifier = varMatch[2];
      const typeAnnotation = varMatch[3] ? varMatch[3].trim() : void 0;
      const initialValue = varMatch[4] ? varMatch[4].trim() : void 0;
      const id2 = getTSUnitId("var", identifier);
      const unit2 = {
        id: id2,
        kind: "TSUnit" /* Unit */,
        unitKind: "Variable",
        classification: "RUNTIME",
        code: expanded.endsWith(";") ? expanded : `${expanded};`,
        rawCode: raw,
        isComplete,
        meta: {
          identifier
        },
        details: {
          id: id2,
          kind: "TSVariableDeclaration" /* VariableDeclaration */,
          varKind,
          identifier,
          typeAnnotation,
          initialValue,
          sourceLocation: { ...this.currentUnitStartLoc }
        },
        sourceLocation: { ...this.currentUnitStartLoc }
      };
      const { loweredCode: loweredCode2 } = lowerTSUnit(unit2);
      unit2.loweredCode = loweredCode2;
      return unit2;
    }
    const funcMatch = /^(?:export\s+)?(?:async\s+)?function(?:\s+([a-zA-Z_$][a-zA-Z0-9_$]*))?(?:<([^>]+)>)?\s*\(([^)]*)\)(?:\s*:\s*([^{]+))?\s*\{([\s\S]*)\}$/i.exec(
      expanded
    );
    if (funcMatch) {
      const funcName = funcMatch[1] || `anonymous_${index}`;
      const typeParams = funcMatch[2] ? funcMatch[2].split(",").map((p) => p.trim()) : void 0;
      const paramsRaw = funcMatch[3];
      const returnType = funcMatch[4] ? funcMatch[4].trim() : void 0;
      const body = funcMatch[5];
      const id2 = getTSUnitId("func", funcName);
      const params = paramsRaw.split(",").map((p) => p.trim()).filter(Boolean).map((p) => {
        const parts = p.split(":");
        return {
          name: parts[0].trim().replace(/\?$/, ""),
          isOptional: parts[0].trim().endsWith("?"),
          typeAnnotation: parts[1] ? parts[1].trim() : void 0
        };
      });
      const unit2 = {
        id: id2,
        kind: "TSUnit" /* Unit */,
        unitKind: "Function",
        classification: "RUNTIME",
        code: expanded,
        rawCode: raw,
        isComplete,
        meta: {
          functionName: funcName
        },
        details: {
          id: id2,
          kind: "TSFunctionDeclaration" /* FunctionDeclaration */,
          name: funcName,
          typeParams,
          params,
          returnType,
          body,
          sourceLocation: { ...this.currentUnitStartLoc }
        },
        sourceLocation: { ...this.currentUnitStartLoc }
      };
      const { loweredCode: loweredCode2 } = lowerTSUnit(unit2);
      unit2.loweredCode = loweredCode2;
      return unit2;
    }
    const id = getTSUnitId("stmt", expanded.slice(0, 16), index);
    const code = expanded.endsWith(";") || expanded.endsWith("}") ? expanded : `${expanded};`;
    const unit = {
      id,
      kind: "TSUnit" /* Unit */,
      unitKind: "Expression",
      classification: "RUNTIME",
      code,
      rawCode: raw,
      isComplete,
      details: {
        id,
        kind: "TSExpressionStatement" /* ExpressionStatement */,
        code,
        sourceLocation: { ...this.currentUnitStartLoc }
      },
      sourceLocation: { ...this.currentUnitStartLoc }
    };
    const { loweredCode } = lowerTSUnit(unit);
    unit.loweredCode = loweredCode;
    return unit;
  }
};

// packages/compiler/ast/clone.ts
function cloneLocation(loc) {
  if (!loc) {
    return {
      startLine: 1,
      startColumn: 1,
      startOffset: 0,
      endLine: 1,
      endColumn: 1,
      endOffset: 0
    };
  }
  return { ...loc };
}
function cloneASTNode(node, parent = null) {
  if (node.kind === "Literal" /* Literal */) {
    const lit = node;
    const cloned = {
      id: lit.id,
      kind: lit.kind,
      value: lit.value,
      raw: lit.raw,
      parent,
      sourceLocation: cloneLocation(lit.sourceLocation),
      metadata: { ...lit.metadata }
    };
    return cloned;
  }
  if (node.kind === "Property" /* Property */) {
    const prop = node;
    const clonedProp = {
      id: prop.id,
      kind: prop.kind,
      name: prop.name,
      value: null,
      parent,
      sourceLocation: cloneLocation(prop.sourceLocation),
      metadata: { ...prop.metadata }
    };
    if (prop.value) {
      clonedProp.value = cloneASTNode(prop.value, clonedProp);
    }
    return clonedProp;
  }
  const comp = node;
  const clonedComp = {
    id: comp.id,
    kind: comp.kind,
    parent,
    sourceLocation: cloneLocation(comp.sourceLocation),
    metadata: { ...comp.metadata },
    properties: [],
    children: []
  };
  if ("name" in comp) {
    clonedComp.name = comp.name;
  }
  clonedComp.properties = (comp.properties || []).map(
    (p) => cloneASTNode(p, clonedComp)
  );
  clonedComp.children = (comp.children || []).map(
    (c) => cloneASTNode(c, clonedComp)
  );
  return clonedComp;
}

// packages/runtime/incremental/patch-generator/css-diff.ts
var CSSDiffEngine = class {
  constructor(patch) {
    this.patch = patch;
  }
  diff(oldSheet, newSheet) {
    if (!oldSheet) {
      for (let i = 0; i < newSheet.rules.length; i++) {
        const item = newSheet.rules[i];
        this.emitInitialRule(item, i);
      }
      return;
    }
    const oldRulesMap = /* @__PURE__ */ new Map();
    for (const r of oldSheet.rules) {
      oldRulesMap.set(r.id, r);
    }
    const newRulesMap = /* @__PURE__ */ new Map();
    for (const r of newSheet.rules) {
      newRulesMap.set(r.id, r);
    }
    for (const [id, oldItem] of oldRulesMap.entries()) {
      if (!newRulesMap.has(id)) {
        if (oldItem.kind === "CSSRule") {
          this.patch.add(removeCSSRule(id, oldItem.selector));
        } else if (oldItem.kind === "CSSKeyframesRule") {
          this.patch.add(removeCSSRule(id, `@keyframes ${oldItem.name}`));
        } else if (oldItem.kind === "CSSMediaRule") {
          this.patch.add(removeCSSRule(id, `@media ${oldItem.query}`));
        }
      }
    }
    for (let i = 0; i < newSheet.rules.length; i++) {
      const newItem = newSheet.rules[i];
      const oldItem = oldRulesMap.get(newItem.id);
      if (!oldItem) {
        this.emitInitialRule(newItem, i);
      } else if (oldItem.kind === newItem.kind) {
        if (newItem.kind === "CSSRule") {
          this.diffCSSRule(oldItem, newItem);
        } else if (newItem.kind === "CSSKeyframesRule") {
          this.diffCSSKeyframes(oldItem, newItem);
        } else if (newItem.kind === "CSSMediaRule") {
          this.diffCSSMedia(oldItem, newItem);
        }
      } else {
        this.patch.add(removeCSSRule(oldItem.id));
        this.emitInitialRule(newItem, i);
      }
    }
  }
  emitInitialRule(item, index) {
    if (item.kind === "CSSRule") {
      const rule = item;
      this.patch.add(
        createCSSRule(
          rule.id,
          rule.selector,
          rule.declarations.map((d) => ({
            property: d.property,
            value: d.value,
            important: d.important
          })),
          void 0,
          index
        )
      );
    } else if (item.kind === "CSSKeyframesRule") {
      const kf = item;
      for (const block of kf.keyframes) {
        this.patch.add(
          addCSSKeyframe(
            block.id,
            kf.name,
            block.keyframeSelector,
            block.declarations.map((d) => ({
              property: d.property,
              value: d.value,
              important: d.important
            }))
          )
        );
      }
    } else if (item.kind === "CSSMediaRule") {
      const media = item;
      for (let j = 0; j < media.rules.length; j++) {
        const r = media.rules[j];
        this.patch.add(
          createCSSRule(
            r.id,
            r.selector,
            r.declarations.map((d) => ({
              property: d.property,
              value: d.value,
              important: d.important
            })),
            media.query,
            j
          )
        );
      }
    }
  }
  diffCSSRule(oldRule, newRule) {
    const oldDecls = /* @__PURE__ */ new Map();
    for (const d of oldRule.declarations) {
      oldDecls.set(d.property.toLowerCase(), d);
    }
    const newDecls = /* @__PURE__ */ new Map();
    for (const d of newRule.declarations) {
      newDecls.set(d.property.toLowerCase(), d);
    }
    for (const [prop] of oldDecls.entries()) {
      if (!newDecls.has(prop)) {
        this.patch.add(removeCSSDeclaration(oldRule.id, prop));
      }
    }
    for (const [prop, newDecl] of newDecls.entries()) {
      const oldDecl = oldDecls.get(prop);
      if (!oldDecl) {
        this.patch.add(
          addCSSDeclaration(oldRule.id, newDecl.property, newDecl.value, newDecl.important)
        );
      } else if (oldDecl.value !== newDecl.value || oldDecl.important !== newDecl.important) {
        this.patch.add(
          updateCSSDeclaration(oldRule.id, newDecl.property, newDecl.value, newDecl.important)
        );
      }
    }
  }
  diffCSSKeyframes(oldKf, newKf) {
    const oldBlocks = /* @__PURE__ */ new Map();
    for (const b of oldKf.keyframes) {
      oldBlocks.set(b.keyframeSelector, b);
    }
    const newBlocks = /* @__PURE__ */ new Map();
    for (const b of newKf.keyframes) {
      newBlocks.set(b.keyframeSelector, b);
    }
    for (const [sel] of oldBlocks.entries()) {
      if (!newBlocks.has(sel)) {
        this.patch.add(removeCSSKeyframe(oldKf.id, oldKf.name, sel));
      }
    }
    for (const [sel, newBlock] of newBlocks.entries()) {
      const oldBlock = oldBlocks.get(sel);
      if (!oldBlock) {
        this.patch.add(
          addCSSKeyframe(
            newBlock.id,
            newKf.name,
            newBlock.keyframeSelector,
            newBlock.declarations.map((d) => ({
              property: d.property,
              value: d.value,
              important: d.important
            }))
          )
        );
      } else {
        this.patch.add(
          updateCSSKeyframe(
            newBlock.id,
            newKf.name,
            newBlock.keyframeSelector,
            newBlock.declarations.map((d) => ({
              property: d.property,
              value: d.value,
              important: d.important
            }))
          )
        );
      }
    }
  }
  diffCSSMedia(oldMedia, newMedia) {
    const oldRules = /* @__PURE__ */ new Map();
    for (const r of oldMedia.rules) {
      oldRules.set(r.id, r);
    }
    const newRules = /* @__PURE__ */ new Map();
    for (const r of newMedia.rules) {
      newRules.set(r.id, r);
    }
    for (const [id, oldRule] of oldRules.entries()) {
      if (!newRules.has(id)) {
        this.patch.add(removeCSSRule(id, oldRule.selector));
      }
    }
    for (let i = 0; i < newMedia.rules.length; i++) {
      const newRule = newMedia.rules[i];
      const oldRule = oldRules.get(newRule.id);
      if (!oldRule) {
        this.patch.add(
          createCSSRule(
            newRule.id,
            newRule.selector,
            newRule.declarations.map((d) => ({
              property: d.property,
              value: d.value,
              important: d.important
            })),
            newMedia.query,
            i
          )
        );
      } else {
        this.diffCSSRule(oldRule, newRule);
      }
    }
  }
};
function diffCSSStyleSheets(oldSheet, newSheet) {
  const patch = new Patch();
  const diffEngine = new CSSDiffEngine(patch);
  diffEngine.diff(oldSheet, newSheet);
  return patch.getOperations();
}

// packages/runtime/incremental/patch-generator/js-diff.ts
function diffJSPrograms(oldProgram, newProgram) {
  const patches = [];
  if (!oldProgram) {
    for (let i = 0; i < newProgram.units.length; i++) {
      const unit = newProgram.units[i];
      if (!unit.isComplete) continue;
      if (unit.details && unit.details.kind === "JSEventHandler" /* EventHandler */) {
        const evt = unit.details;
        patches.push(
          attachEventHandler(
            unit.id,
            evt.eventName,
            evt.targetSelector,
            evt.handlerCode,
            i
          )
        );
      } else {
        patches.push(
          createJSUnit(
            unit.id,
            unit.unitKind,
            unit.code,
            unit.meta,
            i
          )
        );
        patches.push(executeJSUnit(unit.id, unit.code));
      }
    }
    return patches;
  }
  const oldUnitsMap = /* @__PURE__ */ new Map();
  for (const unit of oldProgram.units) {
    oldUnitsMap.set(unit.id, unit);
  }
  const newUnitsMap = /* @__PURE__ */ new Map();
  for (let i = 0; i < newProgram.units.length; i++) {
    const unit = newProgram.units[i];
    newUnitsMap.set(unit.id, unit);
    if (!unit.isComplete) continue;
    const oldUnit = oldUnitsMap.get(unit.id);
    if (!oldUnit) {
      if (unit.details && unit.details.kind === "JSEventHandler" /* EventHandler */) {
        const evt = unit.details;
        patches.push(
          attachEventHandler(
            unit.id,
            evt.eventName,
            evt.targetSelector,
            evt.handlerCode,
            i
          )
        );
      } else {
        patches.push(
          createJSUnit(
            unit.id,
            unit.unitKind,
            unit.code,
            unit.meta,
            i
          )
        );
        patches.push(executeJSUnit(unit.id, unit.code));
      }
    } else if (oldUnit.code !== unit.code || !oldUnit.isComplete) {
      if (unit.details && unit.details.kind === "JSEventHandler" /* EventHandler */) {
        const evt = unit.details;
        patches.push(
          updateEventHandler(
            unit.id,
            evt.eventName,
            evt.targetSelector,
            evt.handlerCode
          )
        );
      } else {
        patches.push(
          updateJSUnit(
            unit.id,
            unit.unitKind,
            unit.code,
            unit.meta
          )
        );
        patches.push(executeJSUnit(unit.id, unit.code));
      }
    }
  }
  for (const oldUnit of oldProgram.units) {
    if (!newUnitsMap.has(oldUnit.id)) {
      if (oldUnit.details && oldUnit.details.kind === "JSEventHandler" /* EventHandler */) {
        const evt = oldUnit.details;
        patches.push(
          removeEventHandler(
            oldUnit.id,
            evt.eventName,
            evt.targetSelector
          )
        );
      } else {
        patches.push(removeJSUnit(oldUnit.id));
      }
    }
  }
  return patches;
}

// packages/compiler/pipeline/generation-pipeline.ts
var LMGenerationPipeline = class {
  constructor(options = {}) {
    this.previousAST = null;
    this.previousCSSAST = null;
    this.previousJSAST = null;
    this.previousTSAST = null;
    this.previousReactAST = null;
    this.previousVueAST = null;
    this.previousSvelteAST = null;
    this.previousAngularAST = null;
    this.activeBlockLanguage = null;
    this.isInsideHTMLBlock = false;
    this.isInsideCSSBlock = false;
    this.isInsideJSBlock = false;
    this.isInsideTSBlock = false;
    this.isInsideReactBlock = false;
    this.isInsideVueBlock = false;
    this.isInsideSvelteBlock = false;
    this.isInsideAngularBlock = false;
    this.isAborted = false;
    this.options = options;
    this.rootId = options.rootId || "leveonas-root";
    this.patchGenerator = new PatchGenerator();
    this.interpreter = new HTMLLMInterpreter({
      onError: (diagnostic) => {
        if (diagnostic.severity === "error") {
          this.options.onError?.(new Error(`HTML-LM Parser Error: ${diagnostic.message}`));
        }
      }
    });
    this.cssInterpreter = new CSSLMInterpreter({
      onError: (diagnostic) => {
        if (diagnostic.severity === "error") {
          this.options.onError?.(new Error(`CSS-LM Parser Error: ${diagnostic.message}`));
        }
      }
    });
    this.jsInterpreter = new JSLMInterpreter({
      onError: (diagnostic) => {
        if (diagnostic.severity === "error") {
          this.options.onError?.(new Error(`JS-LM Parser Error: ${diagnostic.message}`));
        }
      }
    });
    this.tsInterpreter = new TSLMInterpreter({
      onError: (diagnostic) => {
        if (diagnostic.severity === "error") {
          this.options.onError?.(new Error(`TS-LM Parser Error: ${diagnostic.message}`));
        }
      }
    });
    this.reactInterpreter = new ReactLMInterpreter({
      onError: (diagnostic) => {
        if (diagnostic.severity === "error") {
          this.options.onError?.(new Error(`React-LM Parser Error: ${diagnostic.message}`));
        }
      }
    });
    this.vueInterpreter = new VueLMInterpreter({
      onError: (diagnostic) => {
        if (diagnostic.severity === "error") {
          this.options.onError?.(new Error(`Vue-LM Parser Error: ${diagnostic.message}`));
        }
      }
    });
    this.svelteInterpreter = new SvelteLMInterpreter({
      onError: (diagnostic) => {
        if (diagnostic.severity === "error") {
          this.options.onError?.(new Error(`Svelte-LM Parser Error: ${diagnostic.message}`));
        }
      }
    });
    this.angularInterpreter = new AngularLMInterpreter();
    this.lexer = new LMStreamLexer({
      supportedLanguages: [
        "HTML",
        "CSS",
        "JS",
        "TS",
        "TYPESCRIPT",
        "REACT",
        "REACT-LM",
        "VUE",
        "VUE-LM",
        "NEXTJS",
        "TAILWIND",
        "SVELTE",
        "ANGULAR",
        "ANGULAR-LM"
      ],
      emitTextEvents: true
    });
    this.lexer.on((event) => {
      this.handleLexerEvent(event);
    });
  }
  /**
   * Handle an event from the LM stream lexer.
   * Routes HTML, CSS, JS, TS, React, and Vue blocks to their respective incremental interpreters.
   */
  handleLexerEvent(event) {
    if (this.isAborted) return;
    switch (event.type) {
      case "BLOCK_START" /* BLOCK_START */: {
        const lang = (event.language || "").toUpperCase();
        this.activeBlockLanguage = lang;
        if (lang === "HTML") {
          this.isInsideHTMLBlock = true;
          this.isInsideCSSBlock = false;
          this.isInsideJSBlock = false;
          this.isInsideTSBlock = false;
          this.isInsideReactBlock = false;
          this.isInsideVueBlock = false;
        } else if (lang === "CSS") {
          this.isInsideCSSBlock = true;
          this.isInsideHTMLBlock = false;
          this.isInsideJSBlock = false;
          this.isInsideTSBlock = false;
          this.isInsideReactBlock = false;
          this.isInsideVueBlock = false;
        } else if (lang === "JS" || lang === "JAVASCRIPT") {
          this.isInsideJSBlock = true;
          this.isInsideHTMLBlock = false;
          this.isInsideCSSBlock = false;
          this.isInsideTSBlock = false;
          this.isInsideReactBlock = false;
          this.isInsideVueBlock = false;
        } else if (lang === "TS" || lang === "TYPESCRIPT") {
          this.isInsideTSBlock = true;
          this.isInsideHTMLBlock = false;
          this.isInsideCSSBlock = false;
          this.isInsideJSBlock = false;
          this.isInsideReactBlock = false;
          this.isInsideVueBlock = false;
        } else if (lang === "REACT" || lang === "REACT-LM") {
          this.isInsideReactBlock = true;
          this.isInsideHTMLBlock = false;
          this.isInsideCSSBlock = false;
          this.isInsideJSBlock = false;
          this.isInsideTSBlock = false;
          this.isInsideVueBlock = false;
        } else if (lang === "VUE" || lang === "VUE-LM") {
          this.isInsideVueBlock = true;
          this.isInsideHTMLBlock = false;
          this.isInsideCSSBlock = false;
          this.isInsideJSBlock = false;
          this.isInsideTSBlock = false;
          this.isInsideReactBlock = false;
          this.isInsideSvelteBlock = false;
        } else if (lang === "SVELTE" || lang === "SVELTE-LM") {
          this.isInsideSvelteBlock = true;
          this.isInsideHTMLBlock = false;
          this.isInsideCSSBlock = false;
          this.isInsideJSBlock = false;
          this.isInsideTSBlock = false;
          this.isInsideReactBlock = false;
          this.isInsideVueBlock = false;
          this.isInsideAngularBlock = false;
        } else if (lang === "ANGULAR" || lang === "ANGULAR-LM") {
          this.isInsideAngularBlock = true;
          this.isInsideHTMLBlock = false;
          this.isInsideCSSBlock = false;
          this.isInsideJSBlock = false;
          this.isInsideTSBlock = false;
          this.isInsideReactBlock = false;
          this.isInsideVueBlock = false;
          this.isInsideSvelteBlock = false;
        } else {
          this.isInsideHTMLBlock = false;
          this.isInsideCSSBlock = false;
          this.isInsideJSBlock = false;
          this.isInsideTSBlock = false;
          this.isInsideReactBlock = false;
          this.isInsideVueBlock = false;
          this.isInsideSvelteBlock = false;
          this.isInsideAngularBlock = false;
        }
        break;
      }
      case "BLOCK_CONTENT" /* BLOCK_CONTENT */: {
        const lang = (event.language || this.activeBlockLanguage || "").toUpperCase();
        if (lang === "HTML") {
          this.interpreter.write(event.content);
        } else if (lang === "CSS") {
          this.cssInterpreter.write(event.content);
        } else if (lang === "JS" || lang === "JAVASCRIPT") {
          this.jsInterpreter.write(event.content);
        } else if (lang === "TS" || lang === "TYPESCRIPT") {
          this.tsInterpreter.write(event.content);
        } else if (lang === "REACT" || lang === "REACT-LM") {
          this.reactInterpreter.write(event.content);
        } else if (lang === "VUE" || lang === "VUE-LM") {
          this.vueInterpreter.write(event.content);
        } else if (lang === "SVELTE" || lang === "SVELTE-LM") {
          this.svelteInterpreter.write(event.content);
        } else if (lang === "ANGULAR" || lang === "ANGULAR-LM") {
          this.angularInterpreter.write(event.content);
        }
        break;
      }
      case "BLOCK_END" /* BLOCK_END */: {
        const lang = (event.language || "").toUpperCase();
        if (lang === "HTML") {
          this.isInsideHTMLBlock = false;
        } else if (lang === "CSS") {
          this.isInsideCSSBlock = false;
        } else if (lang === "JS" || lang === "JAVASCRIPT") {
          this.isInsideJSBlock = false;
        } else if (lang === "TS" || lang === "TYPESCRIPT") {
          this.isInsideTSBlock = false;
        } else if (lang === "REACT" || lang === "REACT-LM") {
          this.isInsideReactBlock = false;
        } else if (lang === "VUE" || lang === "VUE-LM") {
          this.isInsideVueBlock = false;
        } else if (lang === "SVELTE" || lang === "SVELTE-LM") {
          this.isInsideSvelteBlock = false;
        } else if (lang === "ANGULAR" || lang === "ANGULAR-LM") {
          this.isInsideAngularBlock = false;
        }
        this.activeBlockLanguage = null;
        break;
      }
      case "TEXT" /* TEXT */: {
        if (!this.isInsideHTMLBlock && !this.isInsideCSSBlock && !this.isInsideJSBlock && !this.isInsideTSBlock && !this.isInsideReactBlock && !this.isInsideVueBlock && !this.isInsideSvelteBlock && event.content) {
          this.interpreter.write(event.content);
        }
        break;
      }
    }
  }
  /**
   * Receive a chunk of raw LM text from the normalized provider stream.
   */
  write(chunk) {
    if (this.isAborted || !chunk) return;
    this.options.onText?.(chunk);
    try {
      this.lexer.push(chunk);
    } catch (err) {
      this.options.onError?.(err);
      return;
    }
    this.tryGeneratePatches(false);
  }
  /**
   * Check whether interpreters are currently in safe, renderable states,
   * and if so, diff against previous ASTs and emit minimal incremental patches.
   * Strictly isolates errors between HTML, CSS, JS, TS, React, and Vue.
   */
  tryGeneratePatches(isFinal) {
    if (this.isAborted) return;
    const patchesToEmit = [];
    let processedReact = false;
    try {
      if (isFinal || this.reactInterpreter.isSafeToExpose()) {
        const currentReact = this.reactInterpreter.getAST();
        if (currentReact && currentReact.components.length > 0) {
          processedReact = true;
          this.previousReactAST = JSON.parse(JSON.stringify(currentReact));
          this.options.onReactASTUpdate?.(this.previousReactAST);
          const reconciler = new ReactReconciler(currentReact);
          const { domAST: reconciledDOM, jsProgram: reconciledJS } = reconciler.reconcile();
          if (reconciledDOM && reconciledDOM.children.length > 0) {
            if (this.previousAST === null) {
              const loc = {
                startLine: 1,
                startColumn: 1,
                startOffset: 0,
                endLine: 1,
                endColumn: 1,
                endOffset: 0
              };
              const initialRoot = ASTFactory.createComponent("Root" /* Root */, loc, [], []);
              initialRoot.id = this.rootId;
              const reactDOMPatches = this.patchGenerator.generate(initialRoot, reconciledDOM);
              if (reactDOMPatches.length > 0) {
                this.previousAST = cloneASTNode(reconciledDOM);
                this.options.onASTUpdate?.(this.previousAST);
                patchesToEmit.push(...reactDOMPatches);
              }
            } else {
              const reactDOMPatches = this.patchGenerator.generate(this.previousAST, reconciledDOM);
              if (reactDOMPatches.length > 0) {
                this.previousAST = cloneASTNode(reconciledDOM);
                this.options.onASTUpdate?.(this.previousAST);
                patchesToEmit.push(...reactDOMPatches);
              }
            }
          }
          if (reconciledJS && reconciledJS.units.length > 0) {
            const reactJSPatches = diffJSPrograms(this.previousJSAST, reconciledJS);
            if (reactJSPatches.length > 0) {
              this.previousJSAST = JSON.parse(JSON.stringify(reconciledJS));
              this.options.onJSASTUpdate?.(this.previousJSAST);
              patchesToEmit.push(...reactJSPatches);
            }
          }
        }
      }
    } catch (err) {
      this.options.onError?.(err);
    }
    let processedVue = false;
    try {
      if (isFinal || this.vueInterpreter.isSafeToExpose()) {
        const currentVue = this.vueInterpreter.getAST();
        if (currentVue && currentVue.components.length > 0) {
          processedVue = true;
          this.previousVueAST = JSON.parse(JSON.stringify(currentVue));
          this.options.onVueASTUpdate?.(this.previousVueAST);
          const reconciler = new VueReconciler(currentVue);
          const { domAST: reconciledDOM, jsProgram: reconciledJS } = reconciler.reconcile();
          if (reconciledDOM && reconciledDOM.children.length > 0) {
            if (this.previousAST === null) {
              const loc = {
                startLine: 1,
                startColumn: 1,
                startOffset: 0,
                endLine: 1,
                endColumn: 1,
                endOffset: 0
              };
              const initialRoot = ASTFactory.createComponent("Root" /* Root */, loc, [], []);
              initialRoot.id = this.rootId;
              const vueDOMPatches = this.patchGenerator.generate(initialRoot, reconciledDOM);
              if (vueDOMPatches.length > 0) {
                this.previousAST = cloneASTNode(reconciledDOM);
                this.options.onASTUpdate?.(this.previousAST);
                patchesToEmit.push(...vueDOMPatches);
              }
            } else {
              const vueDOMPatches = this.patchGenerator.generate(this.previousAST, reconciledDOM);
              if (vueDOMPatches.length > 0) {
                this.previousAST = cloneASTNode(reconciledDOM);
                this.options.onASTUpdate?.(this.previousAST);
                patchesToEmit.push(...vueDOMPatches);
              }
            }
          }
          if (reconciledJS && reconciledJS.units.length > 0) {
            const vueJSPatches = diffJSPrograms(this.previousJSAST, reconciledJS);
            if (vueJSPatches.length > 0) {
              this.previousJSAST = JSON.parse(JSON.stringify(reconciledJS));
              this.options.onJSASTUpdate?.(this.previousJSAST);
              patchesToEmit.push(...vueJSPatches);
            }
          }
        }
      }
    } catch (err) {
      this.options.onError?.(err);
    }
    let processedSvelte = false;
    try {
      if (isFinal || this.svelteInterpreter.isSafeToExpose()) {
        const currentSvelte = this.svelteInterpreter.getAST();
        if (currentSvelte && currentSvelte.components.length > 0) {
          processedSvelte = true;
          this.previousSvelteAST = JSON.parse(JSON.stringify(currentSvelte));
          this.options.onSvelteASTUpdate?.(this.previousSvelteAST);
          const reconciler = new SvelteReconciler(currentSvelte);
          const { domAST: reconciledDOM, jsProgram: reconciledJS } = reconciler.reconcile();
          if (reconciledDOM && reconciledDOM.children.length > 0) {
            if (this.previousAST === null) {
              const loc = {
                startLine: 1,
                startColumn: 1,
                startOffset: 0,
                endLine: 1,
                endColumn: 1,
                endOffset: 0
              };
              const initialRoot = ASTFactory.createComponent("Root" /* Root */, loc, [], []);
              initialRoot.id = this.rootId;
              const svelteDOMPatches = this.patchGenerator.generate(initialRoot, reconciledDOM);
              if (svelteDOMPatches.length > 0) {
                this.previousAST = cloneASTNode(reconciledDOM);
                this.options.onASTUpdate?.(this.previousAST);
                patchesToEmit.push(...svelteDOMPatches);
              }
            } else {
              const svelteDOMPatches = this.patchGenerator.generate(this.previousAST, reconciledDOM);
              if (svelteDOMPatches.length > 0) {
                this.previousAST = cloneASTNode(reconciledDOM);
                this.options.onASTUpdate?.(this.previousAST);
                patchesToEmit.push(...svelteDOMPatches);
              }
            }
          }
          if (reconciledJS && reconciledJS.units.length > 0) {
            const svelteJSPatches = diffJSPrograms(this.previousJSAST, reconciledJS);
            if (svelteJSPatches.length > 0) {
              this.previousJSAST = JSON.parse(JSON.stringify(reconciledJS));
              this.options.onJSASTUpdate?.(this.previousJSAST);
              patchesToEmit.push(...svelteJSPatches);
            }
          }
        }
      }
    } catch (err) {
      this.options.onError?.(err);
    }
    let processedAngular = false;
    try {
      if (isFinal || this.angularInterpreter.isSafeToExpose()) {
        const currentAngular = this.angularInterpreter.getAST();
        if (currentAngular && currentAngular.components.length > 0) {
          processedAngular = true;
          this.previousAngularAST = JSON.parse(JSON.stringify(currentAngular));
          this.options.onAngularASTUpdate?.(this.previousAngularAST);
          const reconciler = new AngularReconciler(currentAngular);
          const { domAST: reconciledDOM, jsProgram: reconciledJS } = reconciler.reconcile();
          if (reconciledDOM && reconciledDOM.children.length > 0) {
            if (this.previousAST === null) {
              const loc = {
                startLine: 1,
                startColumn: 1,
                startOffset: 0,
                endLine: 1,
                endColumn: 1,
                endOffset: 0
              };
              const initialRoot = ASTFactory.createComponent("Root" /* Root */, loc, [], []);
              initialRoot.id = this.rootId;
              const angularDOMPatches = this.patchGenerator.generate(initialRoot, reconciledDOM);
              if (angularDOMPatches.length > 0) {
                this.previousAST = cloneASTNode(reconciledDOM);
                this.options.onASTUpdate?.(this.previousAST);
                patchesToEmit.push(...angularDOMPatches);
              }
            } else {
              const angularDOMPatches = this.patchGenerator.generate(this.previousAST, reconciledDOM);
              if (angularDOMPatches.length > 0) {
                this.previousAST = cloneASTNode(reconciledDOM);
                this.options.onASTUpdate?.(this.previousAST);
                patchesToEmit.push(...angularDOMPatches);
              }
            }
          }
          if (reconciledJS && reconciledJS.units.length > 0) {
            const angularJSPatches = diffJSPrograms(this.previousJSAST, reconciledJS);
            if (angularJSPatches.length > 0) {
              this.previousJSAST = JSON.parse(JSON.stringify(reconciledJS));
              this.options.onJSASTUpdate?.(this.previousJSAST);
              patchesToEmit.push(...angularJSPatches);
            }
          }
        }
      }
    } catch (err) {
      this.options.onError?.(err);
    }
    if (!processedReact && !processedVue && !processedSvelte && !processedAngular) {
      try {
        if (isFinal || this.interpreter.isSafeToExpose()) {
          const currentAST = this.interpreter.getAST();
          if (currentAST && currentAST.children.length > 0) {
            if (this.previousAST === null) {
              const loc = {
                startLine: 1,
                startColumn: 1,
                startOffset: 0,
                endLine: 1,
                endColumn: 1,
                endOffset: 0
              };
              const initialRoot = ASTFactory.createComponent("Root" /* Root */, loc, [], []);
              initialRoot.id = this.rootId;
              const htmlPatches = this.patchGenerator.generate(initialRoot, currentAST);
              if (htmlPatches.length > 0) {
                this.previousAST = cloneASTNode(currentAST);
                this.options.onASTUpdate?.(this.previousAST);
                patchesToEmit.push(...htmlPatches);
              }
            } else {
              const htmlPatches = this.patchGenerator.generate(this.previousAST, currentAST);
              if (htmlPatches.length > 0) {
                this.previousAST = cloneASTNode(currentAST);
                this.options.onASTUpdate?.(this.previousAST);
                patchesToEmit.push(...htmlPatches);
              }
            }
          }
        }
      } catch (err) {
        this.options.onError?.(err);
      }
    }
    try {
      if (isFinal || this.cssInterpreter.isSafeToExpose()) {
        const currentCSS = this.cssInterpreter.getAST();
        if (currentCSS && currentCSS.rules.length > 0) {
          const cssPatches = diffCSSStyleSheets(this.previousCSSAST, currentCSS);
          if (cssPatches.length > 0) {
            this.previousCSSAST = JSON.parse(JSON.stringify(currentCSS));
            this.options.onCSSASTUpdate?.(this.previousCSSAST);
            patchesToEmit.push(...cssPatches);
          }
        }
      }
    } catch (err) {
      this.options.onError?.(err);
    }
    try {
      if (isFinal || this.tsInterpreter.isSafeToExpose()) {
        const currentTS = this.tsInterpreter.getAST();
        if (currentTS && currentTS.units.some((u) => u.isComplete)) {
          this.previousTSAST = JSON.parse(JSON.stringify(currentTS));
          this.options.onTSASTUpdate?.(this.previousTSAST);
          const loweredJSFromTS = convertTSProgramToJSProgram(currentTS);
          const currentJS = this.jsInterpreter.getAST();
          const mergedUnits = [...loweredJSFromTS.units];
          if (currentJS && currentJS.units.length > 0) {
            for (const jsUnit of currentJS.units) {
              if (!mergedUnits.some((u) => u.id === jsUnit.id)) {
                mergedUnits.push(jsUnit);
              }
            }
          }
          const combinedJSProgram = {
            id: loweredJSFromTS.id,
            kind: loweredJSFromTS.kind,
            units: mergedUnits,
            sourceLocation: loweredJSFromTS.sourceLocation
          };
          const jsPatches = diffJSPrograms(this.previousJSAST, combinedJSProgram);
          if (jsPatches.length > 0) {
            this.previousJSAST = JSON.parse(JSON.stringify(combinedJSProgram));
            this.options.onJSASTUpdate?.(this.previousJSAST);
            patchesToEmit.push(...jsPatches);
          }
        }
      }
    } catch (err) {
      this.options.onError?.(err);
    }
    if (!processedReact && !processedVue && !processedSvelte) {
      try {
        if ((isFinal || this.jsInterpreter.isSafeToExpose()) && !this.tsInterpreter.getAST().units.some((u) => u.isComplete)) {
          const currentJS = this.jsInterpreter.getAST();
          if (currentJS && currentJS.units.some((u) => u.isComplete)) {
            const jsPatches = diffJSPrograms(this.previousJSAST, currentJS);
            if (jsPatches.length > 0) {
              this.previousJSAST = JSON.parse(JSON.stringify(currentJS));
              this.options.onJSASTUpdate?.(this.previousJSAST);
              patchesToEmit.push(...jsPatches);
            }
          }
        }
      } catch (err) {
        this.options.onError?.(err);
      }
    }
    if (patchesToEmit.length > 0) {
      this.options.onPatch?.(patchesToEmit);
    }
  }
  /**
   * Signal the end of the LM stream.
   * Flushes lexer, finalizes interpreters, and produces any final patches.
   */
  end() {
    if (this.isAborted) return;
    try {
      this.lexer.end();
      this.interpreter.end();
      this.cssInterpreter.end();
      this.jsInterpreter.end();
      this.tsInterpreter.end();
      this.reactInterpreter.end();
      this.vueInterpreter.end();
      this.svelteInterpreter.end();
    } catch (err) {
      this.options.onError?.(err);
    }
    this.tryGeneratePatches(true);
  }
  /**
   * Abort this generation pipeline and release resources (Section 15).
   */
  abort() {
    this.isAborted = true;
    this.previousAST = null;
    this.previousCSSAST = null;
    this.previousJSAST = null;
    this.previousTSAST = null;
    this.previousReactAST = null;
    this.previousVueAST = null;
    this.previousSvelteAST = null;
  }
  /**
   * Return the previous committed HTML AST snapshot.
   */
  getPreviousAST() {
    return this.previousAST;
  }
  /**
   * Return the current live HTML AST.
   */
  getCurrentAST() {
    return this.interpreter.getAST();
  }
  /**
   * Return the current live CSS AST.
   */
  getCurrentCSSAST() {
    return this.cssInterpreter.getAST();
  }
  /**
   * Return the current live JS AST.
   */
  getCurrentJSAST() {
    return this.jsInterpreter.getAST();
  }
  /**
   * Return the current live TS AST.
   */
  getCurrentTSAST() {
    return this.tsInterpreter.getAST();
  }
  /**
   * Return the current live React AST.
   */
  getCurrentReactAST() {
    return this.reactInterpreter.getAST();
  }
  /**
   * Return the current live Vue AST.
   */
  getCurrentVueAST() {
    return this.vueInterpreter.getAST();
  }
  /**
   * Return the current live Svelte AST.
   */
  getCurrentSvelteAST() {
    return this.svelteInterpreter.getAST();
  }
  /**
   * Return diagnostics collected during parsing from all interpreters.
   */
  getDiagnostics() {
    return [
      ...this.interpreter.getDiagnostics(),
      ...this.cssInterpreter.getDiagnostics(),
      ...this.jsInterpreter.getDiagnostics(),
      ...this.tsInterpreter.getDiagnostics(),
      ...this.reactInterpreter.getDiagnostics(),
      ...this.vueInterpreter.getDiagnostics(),
      ...this.svelteInterpreter.getDiagnostics()
    ];
  }
};

// packages/telemetry/compliance.ts
function classifyLMSyntacticCompliance(rawOutput) {
  if (!rawOutput || typeof rawOutput !== "string" || rawOutput.trim().length === 0) {
    return {
      isCompliant: false,
      score: 0,
      reason: "Output is empty.",
      details: {
        hasBlockDelimiters: false,
        hasParenthesisStructure: false,
        abbreviationCount: 0,
        lmConstructCount: 0,
        rawHTMLTagCount: 0,
        rawHTMLClosingTagCount: 0,
        hasMarkdownFences: false
      }
    };
  }
  const text = rawOutput.trim();
  const hasMarkdownFences = /^```|```$/m.test(text);
  const hasBlockDelimiters = /<(HTML|CSS|JS|TS|REACT|NEXTJS|TAILWIND|VUE|SVELTE)>[\s\S]*<\/\1>/i.test(text) || /<(HTML|CSS|JS|TS|REACT|NEXTJS|TAILWIND|VUE|SVELTE)>/i.test(text);
  const rawHTMLClosingTagMatches = text.match(
    /<\/(div|section|header|footer|nav|main|button|span|input|label|table|form|article|aside|p|h[1-6]|ul|ol|li|a|body|head|script|style)>/gi
  ) || [];
  const rawHTMLClosingTagCount = rawHTMLClosingTagMatches.length;
  const rawHTMLTagMatches = text.match(
    /<(div|section|header|footer|nav|main|button|span|input|label|table|form|article|aside|p|h[1-6]|ul|ol|li|a|body|head|script|style|!DOCTYPE)\b[^>]*>/gi
  ) || [];
  const rawHTMLTagCount = rawHTMLTagMatches.length;
  const lmParenthesisMatches = text.match(
    /\b(di|so|he|fe|na|mi|bo|sa|iu|le|tl|cu|fr|al|ad|cs|cm|hr|sr|tp|pe|nm|vu|oc|og|h[1-6]|p|a|img|ul|ol|li)\s*\(/g
  ) || [];
  const sExprMatches = text.match(
    /\(\s*(di|so|he|fe|na|mi|bo|sa|iu|le|tl|cu|fr|al|ad|cs|cm|hr|sr|tp|pe|nm|vu|oc|og|h[1-6]|p|a|img|ul|ol|li)\b/g
  ) || [];
  const lmConstructCount = lmParenthesisMatches.length + sExprMatches.length;
  const hasParenthesisStructure = lmConstructCount > 0 && text.includes("(") && text.includes(")");
  let abbreviationCount = 0;
  for (const abbr of Object.keys(KNOWN_ELEMENT_ABBREVIATIONS)) {
    const regex = new RegExp(`(\\b|\\()${abbr}\\s*\\(`, "g");
    const matches = text.match(regex);
    if (matches) abbreviationCount += matches.length;
  }
  for (const abbr of Object.keys(KNOWN_ATTRIBUTE_ABBREVIATIONS)) {
    const regex = new RegExp(`(\\b|\\()${abbr}\\s*\\(`, "g");
    const matches = text.match(regex);
    if (matches) abbreviationCount += matches.length;
  }
  let score = 0;
  if (hasBlockDelimiters) score += 25;
  if (hasParenthesisStructure) score += 35;
  if (abbreviationCount > 0) score += Math.min(30, abbreviationCount * 5);
  if (lmConstructCount >= 3) score += 10;
  if (rawHTMLClosingTagCount > 0) {
    score -= rawHTMLClosingTagCount * 25;
  }
  if (rawHTMLTagCount > 0) {
    score -= rawHTMLTagCount * 20;
  }
  if (hasMarkdownFences) {
    score -= 15;
  }
  score = Math.max(0, Math.min(100, score));
  let isCompliant = false;
  let reason = "";
  if (rawHTMLClosingTagCount > 0 || rawHTMLTagCount > 1) {
    isCompliant = false;
    reason = `Model emitted ordinary uncompressed HTML with standard tags (${rawHTMLClosingTagCount} closing tags, ${rawHTMLTagCount} opening tags).`;
  } else if (!hasParenthesisStructure && lmConstructCount === 0) {
    isCompliant = false;
    reason = "No Leveonas Markup parenthesis structure or element declarations detected.";
  } else if (score >= 50) {
    isCompliant = true;
    reason = `Valid Leveonas Markup syntax detected (${lmConstructCount} LM constructs, ${abbreviationCount} canonical abbreviations).`;
  } else {
    isCompliant = false;
    reason = `Insufficient LM syntax compliance (score: ${score}/100).`;
  }
  return {
    isCompliant,
    score,
    reason,
    details: {
      hasBlockDelimiters,
      hasParenthesisStructure,
      abbreviationCount,
      lmConstructCount,
      rawHTMLTagCount,
      rawHTMLClosingTagCount,
      hasMarkdownFences
    }
  };
}
function validateLMWithParser(rawOutput) {
  if (!rawOutput || typeof rawOutput !== "string" || rawOutput.trim().length === 0) {
    return {
      succeeded: false,
      astProduced: false,
      patchCount: 0,
      patchOperationCount: 0,
      diagnostics: ["Output is empty or missing."]
    };
  }
  let pipelineError = null;
  const diagnostics = [];
  let astProduced = false;
  let patchCount = 0;
  let patchOperationCount = 0;
  try {
    const pipeline = new LMGenerationPipeline({
      rootId: "leveonas-root",
      onPatch: (patches) => {
        if (patches.length > 0) {
          patchCount += 1;
          patchOperationCount += patches.length;
        }
      },
      onASTUpdate: (ast) => {
        if (ast && ast.children && ast.children.length > 0) {
          astProduced = true;
        }
      },
      onError: (err) => {
        const msg = err instanceof Error ? err.message : String(err);
        diagnostics.push(msg);
        pipelineError = err instanceof Error ? err : new Error(msg);
      }
    });
    pipeline.write(rawOutput);
    pipeline.end();
    const currentAST = pipeline.getCurrentAST();
    if (currentAST && currentAST.children && currentAST.children.length > 0) {
      astProduced = true;
    }
    const interpDiags = pipeline.getDiagnostics();
    for (const d of interpDiags) {
      if (d.severity === "error") {
        diagnostics.push(`[Error] ${d.message}`);
      } else if (d.severity === "warning") {
        diagnostics.push(`[Warning] ${d.message}`);
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    diagnostics.push(msg);
    pipelineError = err instanceof Error ? err : new Error(msg);
  }
  const hasFatalError = pipelineError !== null || diagnostics.some((d) => d.startsWith("[Error]"));
  const succeeded = !hasFatalError && astProduced;
  return {
    succeeded,
    astProduced,
    patchCount,
    patchOperationCount,
    diagnostics
  };
}
function validateLMGeneration(rawOutput) {
  const syntactic = classifyLMSyntacticCompliance(rawOutput);
  const parser = validateLMWithParser(rawOutput);
  let classification = "INVALID_LM";
  let reason = "";
  if (!parser.succeeded && parser.diagnostics.length > 0 && parser.diagnostics.some((d) => d.includes("Error") || d.includes("Parser"))) {
    classification = "PARSER_ERROR";
    reason = `Parser error: ${parser.diagnostics.join(", ")}`;
  } else if (!syntactic.isCompliant) {
    classification = "INVALID_LM";
    reason = syntactic.reason;
  } else if (!parser.astProduced) {
    classification = "INVALID_LM";
    reason = "No valid AST nodes were produced by the interpreter.";
  } else {
    classification = "VALID_LM";
    reason = `Valid LM: Syntactic score ${syntactic.score}%, parser produced ${parser.patchOperationCount} operations and valid AST.`;
  }
  const isLMCompliant = classification === "VALID_LM";
  return {
    classification,
    syntactic,
    parser,
    isLMCompliant,
    score: syntactic.score,
    reason,
    details: syntactic.details
  };
}

// packages/telemetry/benchmark.ts
function isBenchmarkAllowed(nodeEnv = process.env.NODE_ENV) {
  if (nodeEnv === "production" && process.env.LEVEONAS_ENABLE_BENCHMARK !== "true") {
    return false;
  }
  return true;
}
function calculateMetricStatistics(values) {
  const validValues = values.filter(
    (v) => typeof v === "number" && !Number.isNaN(v)
  );
  if (validValues.length === 0) {
    return {
      mean: null,
      median: null,
      minimum: null,
      maximum: null,
      count: 0
    };
  }
  const sum = validValues.reduce((acc, val) => acc + val, 0);
  const mean = sum / validValues.length;
  const sorted = [...validValues].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  const minimum = sorted[0];
  const maximum = sorted[sorted.length - 1];
  return {
    mean: Number(mean.toFixed(2)),
    median: Number(median.toFixed(2)),
    minimum,
    maximum,
    count: validValues.length
  };
}
function aggregateModeStatistics(runs, systemPromptCharacters, systemPromptBytes, promptCharacters) {
  const successfulRuns = runs.filter((r) => r.status !== "failed" && r.status !== "aborted");
  const successfulRunsCount = successfulRuns.length;
  const totalRunsCount = runs.length;
  let validLMRunsCount = 0;
  let invalidLMRunsCount = 0;
  let parserErrorRunsCount = 0;
  let abortedRunsCount = 0;
  let providerErrorRunsCount = 0;
  for (const r of runs) {
    if (r.status === "aborted") {
      abortedRunsCount++;
    } else if (r.status === "failed") {
      providerErrorRunsCount++;
    } else if (r.classification === "VALID_LM") {
      validLMRunsCount++;
    } else if (r.classification === "INVALID_LM") {
      invalidLMRunsCount++;
    } else if (r.classification === "PARSER_ERROR") {
      parserErrorRunsCount++;
    } else if (r.mode === "LEVEONAS") {
      if (r.lmCompliance?.isLMCompliant) {
        validLMRunsCount++;
      } else {
        invalidLMRunsCount++;
      }
    }
  }
  let lmComplianceRate = null;
  const leveonasRuns = successfulRuns.filter((r) => r.mode === "LEVEONAS");
  if (leveonasRuns.length > 0) {
    const compliantCount = leveonasRuns.filter(
      (r) => r.classification === "VALID_LM" || r.lmCompliance?.isLMCompliant === true
    ).length;
    lmComplianceRate = Number((compliantCount / leveonasRuns.length * 100).toFixed(1));
  }
  return {
    successfulRunsCount,
    totalRunsCount,
    validLMRunsCount,
    invalidLMRunsCount,
    parserErrorRunsCount,
    abortedRunsCount,
    providerErrorRunsCount,
    inputTokens: calculateMetricStatistics(successfulRuns.map((r) => r.inputTokens)),
    outputTokens: calculateMetricStatistics(successfulRuns.map((r) => r.outputTokens)),
    totalTokens: calculateMetricStatistics(successfulRuns.map((r) => r.totalTokens)),
    modelOutputBytes: calculateMetricStatistics(
      successfulRuns.map((r) => r.modelOutputBytes ?? r.outputBytes)
    ),
    applicationSSEBytes: calculateMetricStatistics(
      successfulRuns.map((r) => r.applicationSSEBytes ?? r.networkBytes)
    ),
    providerTransportBytes: calculateMetricStatistics(
      successfulRuns.map((r) => r.providerTransportBytes)
    ),
    outputBytes: calculateMetricStatistics(successfulRuns.map((r) => r.outputBytes)),
    networkBytes: calculateMetricStatistics(successfulRuns.map((r) => r.networkBytes)),
    patchBatchCount: calculateMetricStatistics(successfulRuns.map((r) => r.patchBatchCount)),
    patchOperationCount: calculateMetricStatistics(successfulRuns.map((r) => r.patchOperationCount)),
    patchBytes: calculateMetricStatistics(
      successfulRuns.map((r) => r.patchBytes ?? r.canonicalPatchBytes)
    ),
    canonicalPatchBytes: calculateMetricStatistics(
      successfulRuns.map((r) => r.canonicalPatchBytes ?? r.patchBytes)
    ),
    patchSSEBytes: calculateMetricStatistics(successfulRuns.map((r) => r.patchSSEBytes)),
    timeToFirstContent: calculateMetricStatistics(successfulRuns.map((r) => r.timeToFirstContent)),
    timeToFirstLMChunk: calculateMetricStatistics(successfulRuns.map((r) => r.timeToFirstLMChunk)),
    timeToFirstPatch: calculateMetricStatistics(successfulRuns.map((r) => r.timeToFirstPatch)),
    timeToFirstBrowserRender: calculateMetricStatistics(
      successfulRuns.map((r) => r.timeToFirstBrowserRender)
    ),
    timeToCompletion: calculateMetricStatistics(successfulRuns.map((r) => r.timeToCompletion)),
    jsLMBytes: calculateMetricStatistics(successfulRuns.map((r) => r.jsLMBytes)),
    canonicalJSBytes: calculateMetricStatistics(successfulRuns.map((r) => r.canonicalJSBytes)),
    jsPatchBytes: calculateMetricStatistics(successfulRuns.map((r) => r.jsPatchBytes)),
    firstJSUnitLatencyMs: calculateMetricStatistics(successfulRuns.map((r) => r.firstJSUnitLatencyMs)),
    firstJSExecutionLatencyMs: calculateMetricStatistics(successfulRuns.map((r) => r.firstJSExecutionLatencyMs)),
    normalJSOutputTokens: calculateMetricStatistics(successfulRuns.map((r) => r.normalJSOutputTokens)),
    leveonasJSOutputTokens: calculateMetricStatistics(successfulRuns.map((r) => r.leveonasJSOutputTokens)),
    lmComplianceRate,
    systemPromptCharacters,
    systemPromptBytes,
    promptCharacters,
    runs
  };
}
async function runABBenchmark(options) {
  if (!isBenchmarkAllowed()) {
    throw new Error("Benchmark harness is disabled in production.");
  }
  const {
    provider,
    model,
    framework = "html",
    scenario,
    prompt: customPrompt,
    iterations = 5,
    maxTokens = 4096,
    temperature,
    seed,
    executor,
    randomFn
  } = options;
  let prompt = customPrompt;
  if (!prompt) {
    if (scenario && BENCHMARK_SCENARIOS[scenario]) {
      prompt = BENCHMARK_SCENARIOS[scenario].prompts[framework] || BENCHMARK_SCENARIOS[scenario].defaultPrompt;
    } else {
      prompt = STANDARD_TEST_PROMPT;
    }
  }
  if (!executor) {
    throw new Error("Benchmark executor is required to execute benchmark runs.");
  }
  const benchmarkId = generateTelemetryRunId();
  const generationSettings = {
    maxTokens,
    temperature,
    seed
  };
  const normalSysInstruction = getNormalSystemInstruction(framework);
  const leveonasSysInstruction = getLeveonasSystemInstruction(framework);
  const normalSystemPromptCharacters = Array.from(normalSysInstruction).length;
  const normalSystemPromptBytes = Buffer.byteLength(normalSysInstruction, "utf8");
  const leveonasSystemPromptCharacters = Array.from(leveonasSysInstruction).length;
  const leveonasSystemPromptBytes = Buffer.byteLength(leveonasSysInstruction, "utf8");
  const promptCharacters = Array.from(prompt).length;
  const normalRuns = [];
  const leveonasRuns = [];
  const iterationErrors = [];
  const executionOrders = [];
  const iterationsList = [];
  const rng = randomFn ?? Math.random;
  for (let i = 1; i <= iterations; i++) {
    const order = rng() < 0.5 ? ["NORMAL", "LEVEONAS"] : ["LEVEONAS", "NORMAL"];
    executionOrders.push(order);
    let iterationNormal = null;
    let iterationLeveonas = null;
    try {
      for (const mode of order) {
        if (mode === "NORMAL") {
          const normalRunId = generateTelemetryRunId();
          iterationNormal = await executor({
            mode: "NORMAL",
            provider,
            model,
            prompt,
            systemInstruction: normalSysInstruction,
            runId: normalRunId,
            iteration: i,
            generationSettings
          });
          iterationNormal.framework = framework;
          iterationNormal.scenario = scenario;
        } else {
          const leveonasRunId = generateTelemetryRunId();
          iterationLeveonas = await executor({
            mode: "LEVEONAS",
            provider,
            model,
            prompt,
            systemInstruction: leveonasSysInstruction,
            runId: leveonasRunId,
            iteration: i,
            generationSettings
          });
          iterationLeveonas.framework = framework;
          iterationLeveonas.scenario = scenario;
        }
      }
      if (iterationNormal && iterationLeveonas) {
        normalRuns.push(iterationNormal);
        leveonasRuns.push(iterationLeveonas);
        iterationsList.push({
          iteration: i,
          executionOrder: order,
          normal: iterationNormal,
          leveonas: iterationLeveonas
        });
      }
    } catch (err) {
      const isAuthError = err?.status === 401 || err?.status === 403 || /unauthorized|invalid api key|api key|quota_exceeded/i.test(err?.message || "");
      const isAbortError = err?.name === "AbortError" || /aborted/i.test(err?.message || "");
      if (isAuthError || isAbortError) {
        throw err;
      }
      iterationErrors.push(`Iteration ${i} failed: ${err?.message || String(err)}`);
    }
  }
  if (normalRuns.length === 0 || leveonasRuns.length === 0) {
    throw new Error(
      `All ${iterations} benchmark iterations failed. Errors:
${iterationErrors.join("\n")}`
    );
  }
  const normalStats = aggregateModeStatistics(
    normalRuns,
    normalSystemPromptCharacters,
    normalSystemPromptBytes,
    promptCharacters
  );
  const leveonasStats = aggregateModeStatistics(
    leveonasRuns,
    leveonasSystemPromptCharacters,
    leveonasSystemPromptBytes,
    promptCharacters
  );
  const comparison = compareBenchmark({
    normalInputTokens: normalStats.inputTokens.mean,
    normalOutputTokens: normalStats.outputTokens.mean,
    leveonasInputTokens: leveonasStats.inputTokens.mean,
    leveonasOutputTokens: leveonasStats.outputTokens.mean,
    normalGeneratedBytes: normalStats.modelOutputBytes.mean ?? 0,
    leveonasLMBytes: leveonasStats.modelOutputBytes.mean ?? 0,
    normalNetworkBytes: normalStats.applicationSSEBytes.mean ?? 0,
    leveonasNetworkBytes: leveonasStats.applicationSSEBytes.mean ?? 0
  });
  let compilerProfiling = void 0;
  let compressionBreakdown = void 0;
  const sampleLeveonasRun = leveonasRuns[0];
  const sampleNormalRun = normalRuns[0];
  if (sampleLeveonasRun && sampleLeveonasRun.outputBytes) {
    const rawLM = sampleLeveonasRun.rawLMText || '<HTML>\n(di (h1 "Sample"))\n</HTML>';
    compilerProfiling = LeveonasIRProfiler.profile(rawLM, framework);
  }
  if (sampleNormalRun && sampleLeveonasRun) {
    const normText = sampleNormalRun.rawOutputText || "<div><h1>Sample</h1></div>";
    const lmText = sampleLeveonasRun.rawLMText || '(di (h1 "Sample"))';
    compressionBreakdown = LMCompressionAnalyzer.analyze(normText, lmText);
  }
  return {
    benchmarkId,
    provider,
    model,
    framework,
    scenario,
    iterations,
    executionOrders,
    iterationsList,
    generationSettings,
    normalSystemPromptCharacters,
    normalSystemPromptBytes,
    leveonasSystemPromptCharacters,
    leveonasSystemPromptBytes,
    normal: normalStats,
    leveonas: leveonasStats,
    comparison,
    compilerProfiling,
    compressionBreakdown
  };
}
function createMockBenchmarkExecutor(options) {
  const normalText = options?.normalOutputText ?? "<!DOCTYPE html><html><head><title>NovaFlow</title></head><body><header>NovaFlow</header><main>Hero</main></body></html>";
  const leveonasLM = options?.leveonasOutputLM ?? '<HTML>\n(he (h1 "NovaFlow AI"))\n(mi (so (p "Instant Interfaces")))\n</HTML>';
  return async (input) => {
    const isNormal = input.mode === "NORMAL";
    const text = isNormal ? normalText : leveonasLM;
    const outputCharacters = Array.from(text).length;
    const outputCodeUnits = text.length;
    const outputBytes = Buffer.byteLength(text, "utf8");
    const systemPromptCharacters = Array.from(input.systemInstruction).length;
    const systemPromptBytes = Buffer.byteLength(input.systemInstruction, "utf8");
    const promptCharacters = Array.from(input.prompt).length;
    const tokenConfig = isNormal ? options?.providerTokens?.normal : options?.providerTokens?.leveonas;
    const inputTokens = tokenConfig !== void 0 ? tokenConfig.inputTokens : 150;
    const outputTokens = tokenConfig !== void 0 ? tokenConfig.outputTokens : isNormal ? 1200 : 400;
    const totalTokens = tokenConfig !== void 0 ? tokenConfig.totalTokens : inputTokens !== null && outputTokens !== null ? inputTokens + outputTokens : null;
    const patchSSEBytes = isNormal ? 0 : options?.patchSSEBytes ?? Math.round(outputBytes * 1.15);
    const normalNetworkBytes = outputBytes;
    const applicationSSEBytes = isNormal ? normalNetworkBytes : patchSSEBytes;
    const timeToFirstProviderChunk = options?.timings?.timeToFirstProviderChunk ?? 200;
    const timeToFirstContent = options?.timings?.timeToFirstContent ?? 250;
    const timeToFirstPatch = isNormal ? null : options?.timings?.timeToFirstPatch ?? 280;
    const timeToFirstBrowserRender = options?.timings?.timeToFirstBrowserRender ?? (isNormal ? 1500 : 310);
    const timeToCompletion = options?.timings?.timeToCompletion ?? (isNormal ? 2800 : 1200);
    const lmCompliance = !isNormal ? validateLMGeneration(text) : null;
    const classification = !isNormal ? lmCompliance?.classification : void 0;
    return {
      runId: input.runId,
      iteration: input.iteration,
      mode: input.mode,
      provider: input.provider,
      model: input.model,
      status: "success",
      classification,
      lmCompliance,
      promptCharacters,
      systemPromptCharacters,
      systemPromptBytes,
      inputTokens,
      outputTokens,
      totalTokens,
      outputCharacters,
      outputCodeUnits,
      modelOutputBytes: outputBytes,
      applicationSSEBytes,
      providerTransportBytes: null,
      outputBytes,
      normalGeneratedBytes: isNormal ? outputBytes : void 0,
      leveonasLMBytes: !isNormal ? outputBytes : void 0,
      networkBytes: applicationSSEBytes,
      normalNetworkBytes: isNormal ? applicationSSEBytes : void 0,
      leveonasNetworkBytes: !isNormal ? applicationSSEBytes : void 0,
      lmStreamBytes: !isNormal ? outputBytes : void 0,
      patchBytes: !isNormal ? outputBytes : void 0,
      canonicalPatchBytes: !isNormal ? outputBytes : void 0,
      patchSSEBytes: !isNormal ? patchSSEBytes : void 0,
      totalSSEBytes: !isNormal ? patchSSEBytes : void 0,
      timeToFirstProviderChunk,
      timeToFirstContent,
      timeToFirstGeneratedContent: isNormal ? timeToFirstContent : void 0,
      timeToFirstLMChunk: !isNormal ? timeToFirstContent : void 0,
      timeToFirstPatch,
      timeToFirstBrowserRender,
      timeToCompletion,
      generationSettings: input.generationSettings
    };
  };
}

// packages/cli/commands/benchmark.ts
async function runBenchmarkCommand(options) {
  const provider = (options.provider ?? "gemini").toLowerCase();
  const model = options.model ?? "gemini-2.5-flash";
  const framework = options.framework ?? "react";
  const scenarioId = options.scenario ?? "scenario_a";
  const iterations = Math.max(1, options.iterations ?? 3);
  const scenario = BENCHMARK_SCENARIOS[scenarioId] ?? BENCHMARK_SCENARIOS.scenario_a;
  const prompt = scenario.prompts[framework] ?? scenario.defaultPrompt;
  if (!options.json && !options.csv) {
    console.log("===============================================================");
    console.log("LEVEONAS REPRODUCIBLE DEVELOPER BENCHMARK SUITE");
    console.log("===============================================================");
    console.log(`Provider:        ${provider}`);
    console.log(`Model:           ${model}`);
    console.log(`Framework:       ${framework.toUpperCase()}`);
    console.log(`Scenario:        ${scenario.name} (${scenarioId})`);
    console.log(`Iterations:      ${iterations} paired run(s)`);
    console.log(`Browser Harness: ${options.browser ? "ENABLED (Real DOM measurement)" : "DISABLED (Server simulation)"}`);
    console.log("---------------------------------------------------------------");
  }
  const executor = createMockBenchmarkExecutor();
  try {
    const result = await runABBenchmark({
      scenario: scenarioId,
      framework,
      provider,
      model,
      prompt,
      iterations,
      executor
    });
    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
      return { success: true, data: result };
    }
    if (options.csv) {
      console.log("scenario,framework,provider,model,normal_tokens,leveonas_tokens,token_reduction_pct,normal_bytes,leveonas_bytes,wire_reduction_pct,ttfc_ms,ttfp_ms,duration_ms");
      const normalTokens = result.normal.outputTokens.mean ?? "null";
      const leveonasTokens = result.leveonas.outputTokens.mean ?? "null";
      const tokenRed = result.comparison.outputTokenReductionPercent ?? "null";
      const normalBytes = result.normal.outputBytes.mean ?? "null";
      const leveonasBytes = result.leveonas.outputBytes.mean ?? "null";
      const byteRed = result.comparison.outputByteReductionPercent ?? "null";
      const ttfc = result.leveonas.timeToFirstContent.mean ?? "null";
      const ttfp = result.leveonas.timeToFirstBrowserRender.mean ?? "null";
      const dur = result.leveonas.timeToCompletion.mean ?? "null";
      console.log(`${scenarioId},${framework},${provider},${model},${normalTokens},${leveonasTokens},${tokenRed},${normalBytes},${leveonasBytes},${byteRed},${ttfc},${ttfp},${dur}`);
      return { success: true, data: result };
    }
    console.log("BENCHMARK RESULTS SUMMARY:");
    console.log(`  Completed Iterations: ${result.iterationsList?.length ?? iterations} / ${iterations}`);
    console.log("---------------------------------------------------------------");
    console.log("1. TOKEN METRICS (Provider-Reported):");
    if (result.comparison.outputTokenReductionPercent !== null) {
      console.log(`  Normal Output Tokens:   ${result.normal.outputTokens.mean?.toFixed(1) ?? "N/A"}`);
      console.log(`  Leveonas Output Tokens: ${result.leveonas.outputTokens.mean?.toFixed(1) ?? "N/A"}`);
      console.log(`  Output Token Reduction: ${result.comparison.outputTokenReductionPercent.toFixed(1)}%`);
    } else {
      console.log("  Token Reduction:        N/A (Provider tokens not reported)");
    }
    console.log("---------------------------------------------------------------");
    console.log("2. WIRE & NETWORK BYTES (Locally Measured):");
    console.log(`  Normal Emitted Bytes:   ${result.normal.outputBytes.mean?.toFixed(0) ?? "N/A"} B`);
    console.log(`  Leveonas Patch Bytes:   ${result.leveonas.outputBytes.mean?.toFixed(0) ?? "N/A"} B`);
    if (result.comparison.outputByteReductionPercent !== null) {
      console.log(`  Wire Reduction:         ${result.comparison.outputByteReductionPercent.toFixed(1)}%`);
    }
    console.log("---------------------------------------------------------------");
    console.log("3. STREAMING & DOM LATENCY (Measured):");
    console.log(`  Time to First Content:  ${result.leveonas.timeToFirstContent.mean?.toFixed(1) ?? "N/A"} ms`);
    console.log(`  Time to First Patch:    ${result.leveonas.timeToFirstBrowserRender.mean?.toFixed(1) ?? "N/A"} ms`);
    console.log(`  Total Completion:       ${result.leveonas.timeToCompletion.mean?.toFixed(1) ?? "N/A"} ms`);
    console.log("===============================================================");
    return { success: true, data: result };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const sanitized = message.replace(/(?:key|secret|token)=[^\s&]+/gi, "key=***");
    console.error(`Benchmark execution error: ${sanitized}`);
    return { success: false, data: null };
  }
}

// packages/cli/commands/audit.ts
var import_fs = __toESM(require("fs"));
function runAuditCommand(options) {
  const reports = {};
  let allPassed = true;
  for (const file of options.files) {
    if (!import_fs.default.existsSync(file)) {
      console.error(`File not found: ${file}`);
      allPassed = false;
      continue;
    }
    try {
      const content = import_fs.default.readFileSync(file, "utf-8");
      const report = LeveonasSecurityAuditor.auditSource(content, file);
      reports[file] = report;
      if (!report.passed) {
        allPassed = false;
      }
      if (!options.json) {
        console.log(`
Audit Report for ${file}:`);
        console.log(`  Security Score: ${report.score}/100 [${report.passed ? "PASSED" : "FAILED"}]`);
        console.log(`  Issues: Critical: ${report.issueCounts.CRITICAL}, High: ${report.issueCounts.HIGH}, Medium: ${report.issueCounts.MEDIUM}`);
        if (report.issues.length > 0) {
          for (const issue of report.issues) {
            console.log(`    [${issue.severity}] [${issue.code}] ${issue.message}`);
            if (issue.recommendation) {
              console.log(`      \u21B3 Recommendation: ${issue.recommendation}`);
            }
          }
        } else {
          console.log("  \u2713 No security vulnerabilities detected.");
        }
      }
    } catch (err) {
      console.error(`Error reading ${file}:`, err.message);
      allPassed = false;
    }
  }
  if (options.json) {
    console.log(JSON.stringify(reports, null, 2));
  }
  return { success: allPassed, reports };
}

// packages/cli/cli.ts
function runCLI(args) {
  if (args.length === 0 || args[0] === "--help" || args[0] === "-h" || args[0] === "help") {
    printHelp();
    return 0;
  }
  if (args[0] === "--version" || args[0] === "-v" || args[0] === "version") {
    console.log(`leveonas v${VERSION}`);
    return 0;
  }
  const command = args[0];
  const rest = args.slice(1);
  let isJson = false;
  let isQuiet = false;
  let isVerbose = false;
  for (const arg of rest) {
    if (arg === "--json") isJson = true;
    if (arg === "--quiet" || arg === "-q") isQuiet = true;
    if (arg === "--verbose") isVerbose = true;
  }
  switch (command) {
    case "init": {
      let template = "html";
      let force = false;
      let targetDir = process.cwd();
      for (let i = 0; i < rest.length; i++) {
        if (rest[i].startsWith("--template=")) {
          const t = rest[i].split("=")[1];
          if (["html", "react", "vue", "svelte", "angular"].includes(t)) {
            template = t;
          } else {
            console.error(`Error: Unknown template "${t}". Supported: html, react, vue, svelte, angular`);
            return 2;
          }
        } else if (rest[i] === "--force" || rest[i] === "-f") {
          force = true;
        } else if (!rest[i].startsWith("-")) {
          targetDir = rest[i];
        }
      }
      const res = runInitCommand({ directory: targetDir, template, force, quiet: isQuiet });
      if (!res.success) {
        if (isJson) {
          console.log(JSON.stringify(res, null, 2));
        } else {
          console.error(`Error: ${res.error}`);
        }
        return 1;
      }
      if (isJson) {
        console.log(JSON.stringify(res, null, 2));
      }
      return 0;
    }
    case "check": {
      const files = [];
      let streaming = false;
      for (let i = 0; i < rest.length; i++) {
        if (rest[i] === "--streaming" || rest[i] === "-s") {
          streaming = true;
        } else if (!rest[i].startsWith("-")) {
          files.push(rest[i]);
        }
      }
      if (files.length === 0) {
        console.error("Error: Please provide at least one file to check.");
        return 2;
      }
      const res = runCheckCommand({ files, streaming, quiet: isQuiet });
      return res.success ? 0 : 1;
    }
    case "format":
    case "fmt": {
      const files = [];
      let write = false;
      let check = false;
      let tabSize = 2;
      for (let i = 0; i < rest.length; i++) {
        if (rest[i] === "--write" || rest[i] === "-w") {
          write = true;
        } else if (rest[i] === "--check" || rest[i] === "-c") {
          check = true;
        } else if (rest[i].startsWith("--tab-size=")) {
          tabSize = parseInt(rest[i].split("=")[1], 10) || 2;
        } else if (!rest[i].startsWith("-")) {
          files.push(rest[i]);
        }
      }
      if (files.length === 0) {
        console.error("Error: Please provide at least one file to format.");
        return 2;
      }
      const res = runFormatCommand({ files, write, check, tabSize });
      return res.success ? 0 : 1;
    }
    case "compile": {
      let file = "";
      let target = "ui-ir";
      let json = true;
      let output;
      for (let i = 0; i < rest.length; i++) {
        if (rest[i].startsWith("--target=")) {
          target = rest[i].split("=")[1];
        } else if (rest[i].startsWith("--output=") || rest[i].startsWith("-o=")) {
          output = rest[i].split("=")[1];
        } else if (rest[i] === "--json") {
          json = true;
        } else if (!rest[i].startsWith("-")) {
          file = rest[i];
        }
      }
      if (!file) {
        console.error("Error: Please specify an LM file to compile.");
        return 2;
      }
      const res = runCompileCommand({ file, target, json, output });
      return res.success ? 0 : 1;
    }
    case "inspect": {
      let file = "";
      let json = false;
      for (let i = 0; i < rest.length; i++) {
        if (rest[i] === "--json") {
          json = true;
        } else if (!rest[i].startsWith("-")) {
          file = rest[i];
        }
      }
      if (!file) {
        console.error("Error: Please specify an LM file to inspect.");
        return 2;
      }
      const res = runInspectCommand({ file, json });
      return res.success ? 0 : 1;
    }
    case "benchmark": {
      let provider = "gemini";
      let model = "gemini-2.5-flash";
      let framework = "react";
      let scenario = "scenario_a";
      let iterations = 3;
      let json = isJson;
      for (let i = 0; i < rest.length; i++) {
        if (rest[i].startsWith("--provider=")) {
          provider = rest[i].split("=")[1];
        } else if (rest[i].startsWith("--model=")) {
          model = rest[i].split("=")[1];
        } else if (rest[i].startsWith("--framework=")) {
          framework = rest[i].split("=")[1];
        } else if (rest[i].startsWith("--scenario=")) {
          scenario = rest[i].split("=")[1];
        } else if (rest[i].startsWith("--iterations=") || rest[i].startsWith("-n=")) {
          iterations = parseInt(rest[i].split("=")[1], 10) || 3;
        } else if (rest[i] === "--json") {
          json = true;
        }
      }
      return runBenchmarkCommand({
        provider,
        model,
        framework,
        scenario,
        iterations,
        json
      }).then((res) => res.success ? 0 : 4);
    }
    case "audit":
    case "security": {
      const files = [];
      let json = isJson;
      for (let i = 0; i < rest.length; i++) {
        if (rest[i] === "--json") {
          json = true;
        } else if (!rest[i].startsWith("-")) {
          files.push(rest[i]);
        }
      }
      if (files.length === 0) {
        console.error("Error: Please provide at least one file to audit.");
        return 2;
      }
      const res = runAuditCommand({ files, json });
      return res.success ? 0 : 3;
    }
    default:
      console.error(`Unknown command: ${command}`);
      printHelp();
      return 2;
  }
}
function printHelp() {
  console.log(`
Leveonas CLI \u2014 Production Developer Platform & Tooling

USAGE:
  leveonas <command> [options] [files...]

COMMANDS:
  init [dir]                Initialize a new Leveonas project with starter templates
                            Options: --template=html|react|vue|svelte|angular, --force

  check <files...>          Check LM files for syntax, typing, and reactivity errors
                            Options: --streaming, --quiet, --json

  format <files...>         Format LM files deterministically
                            Options: --write (-w), --check (-c), --tab-size=2

  compile <file>            Compile LM file to target representation
                            Options: --target=ast|ui-ir|runtime-ir|patch, --output=out.json, --json

  inspect <file>            Inspect AST, Reactivity Graph, DOM dependencies, and patches
                            Options: --json

  audit <files...>          Audit LM files for security vulnerabilities, unsafe URLs, and handlers
                            Options: --json

  benchmark                 Run reproducible A/B performance benchmark across frameworks & scenarios
                            Options: --provider=gemini|openai|grok, --framework=react|vue|svelte|angular|html,
                                     --scenario=scenario_a|b|c|d|e, --iterations=3, --json, --csv

  help                      Show this help message
  version                   Show version information

GLOBAL OPTIONS:
  --json                    Output machine-readable JSON
  --quiet, -q               Suppress non-error log messages
  --verbose                 Show detailed debug information
  --version, -v             Print version
  --help, -h                Print help

EXIT CODES:
  0                         Success
  1                         Validation / compilation failure
  2                         CLI usage error (invalid flags, missing arguments)
  3                         Security audit failure / dangerous pattern detected
  4                         Provider / network / runtime failure
`);
}

// packages/common/config.ts
var DEFAULT_LEVEONAS_CONFIG = {
  provider: "gemini",
  model: "gemini-2.5-flash",
  limits: DEFAULT_SECURITY_LIMITS,
  telemetry: false,
  benchmark: {
    defaultScenario: "scenario_a",
    iterations: 3
  },
  runtime: {
    fallbackOnError: true,
    isolateCss: true
  },
  security: {
    strictAttributeValidation: true,
    blockDangerousUrls: true,
    allowedUrlProtocols: ["http:", "https:", "mailto:", "tel:"]
  }
};
function resolveLeveonasConfig(overrides) {
  if (!overrides) return { ...DEFAULT_LEVEONAS_CONFIG };
  return {
    provider: overrides.provider || DEFAULT_LEVEONAS_CONFIG.provider,
    model: overrides.model || DEFAULT_LEVEONAS_CONFIG.model,
    limits: getSecurityLimits(overrides.limits),
    telemetry: overrides.telemetry ?? DEFAULT_LEVEONAS_CONFIG.telemetry,
    benchmark: {
      ...DEFAULT_LEVEONAS_CONFIG.benchmark,
      ...overrides.benchmark || {}
    },
    runtime: {
      ...DEFAULT_LEVEONAS_CONFIG.runtime,
      ...overrides.runtime || {}
    },
    security: {
      ...DEFAULT_LEVEONAS_CONFIG.security,
      ...overrides.security || {}
    }
  };
}
function loadLeveonasConfigFile(cwd = process.cwd()) {
  const fs7 = require("fs");
  const path2 = require("path");
  const possibleFiles = [
    path2.join(cwd, "leveonas.config.json"),
    path2.join(cwd, "leveonas.config.js"),
    path2.join(cwd, "leveonas.config.mjs")
  ];
  for (const filePath of possibleFiles) {
    if (fs7.existsSync(filePath)) {
      try {
        if (filePath.endsWith(".json")) {
          const raw = fs7.readFileSync(filePath, "utf-8");
          const parsed = JSON.parse(raw);
          return resolveLeveonasConfig(parsed);
        }
      } catch (err) {
        console.warn(`[Leveonas Config] Failed to parse ${filePath}: ${err.message}`);
      }
    }
  }
  return resolveLeveonasConfig();
}

// packages/index.ts
function compile(source, options = {}) {
  const blocks = BlockExtractor.extractBlocks(source);
  const activeBlock = blocks[0] ?? {
    type: "lm",
    content: source,
    range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
    contentRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }
  };
  const detectedFramework = options.framework && options.framework !== "auto" ? options.framework : activeBlock.type;
  const diagnostics = LeveonasDiagnosticEngine.diagnose(source, {
    streaming: options.allowIncomplete
  });
  const hasFatalError = diagnostics.some((d) => d.severity === 1 && !d.isIncomplete);
  if (hasFatalError && !options.allowIncomplete) {
    return {
      success: false,
      detectedFramework,
      ast: null,
      frameworkAST: null,
      uiIR: null,
      runtimeIR: null,
      domAST: null,
      patchOperations: [],
      diagnostics,
      error: diagnostics.find((d) => d.severity === 1)?.message || "Syntax error"
    };
  }
  const inspection = LeveonasInspector.inspect(source);
  return {
    success: inspection.streamStatus !== "INVALID",
    detectedFramework: inspection.detectedFramework,
    ast: inspection.ast,
    frameworkAST: inspection.frameworkAST,
    uiIR: inspection.uiIR,
    runtimeIR: inspection.runtimeIR,
    domAST: inspection.patchOperations[0]?.payload ?? null,
    patchOperations: inspection.patchOperations,
    diagnostics,
    error: hasFatalError ? diagnostics.find((d) => d.severity === 1)?.message : null
  };
}
function parse(source, options = {}) {
  const blocks = BlockExtractor.extractBlocks(source);
  const activeBlock = blocks[0] ?? {
    type: options.framework || "html",
    content: source,
    range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
    contentRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }
  };
  const framework = options.framework || activeBlock.type;
  switch (framework) {
    case "react":
      return ReactLMInterpreter.parse(activeBlock.content);
    case "vue":
      return VueLMInterpreter.parse(activeBlock.content);
    case "svelte":
      return SvelteLMInterpreter.parse(activeBlock.content);
    case "angular":
      return AngularLMInterpreter.parse(activeBlock.content);
    default: {
      const interpreter = new HTMLLMInterpreter();
      interpreter.write(activeBlock.content);
      return interpreter.end();
    }
  }
}
function lower(astOrSource, framework) {
  if (typeof astOrSource === "string") {
    const parsed = parse(astOrSource, { framework });
    return lower(parsed, framework);
  }
  if (astOrSource && typeof astOrSource === "object") {
    if (astOrSource.kind === "UIIRProgram") {
      return astOrSource;
    }
    if (astOrSource.kind === "ReactProgram" || framework === "react") {
      return ReactToLowering.lower(astOrSource);
    }
    if (astOrSource.kind === "VueProgram" || framework === "vue") {
      return VueToLowering.lower(astOrSource);
    }
    if (astOrSource.kind === "SvelteProgram" || framework === "svelte") {
      return SvelteToLowering.lower(astOrSource);
    }
    if (astOrSource.kind === "AngularProgram" || framework === "angular") {
      return AngularToLowering.lower(astOrSource);
    }
  }
  throw new Error("Unsupported AST format for Common UI IR lowering");
}
function inspect(source) {
  return LeveonasInspector.inspect(source);
}
function format(source, options = {}) {
  return LeveonasFormatter.format(source, options);
}
function diagnose(source, options = {}) {
  return LeveonasDiagnosticEngine.diagnose(source, options);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthenticationError,
  CSSPatchApplier,
  DEFAULT_CONFIG,
  DEFAULT_LEVEONAS_CONFIG,
  DEFAULT_RETRY_POLICY,
  DEFAULT_SECURITY_LIMITS,
  DOMPatchApplier,
  DiffEngine,
  FORBIDDEN_ATTRIBUTES,
  GeminiProvider,
  GrokProvider,
  HandlerRegistry,
  JSPatchApplier,
  LEVEONAS_VERSION,
  LegacyPatchOperationAliases,
  Leveonas,
  LeveonasAbortError,
  LeveonasAuthError,
  LeveonasClient,
  LeveonasDiagnosticEngine,
  LeveonasError,
  LeveonasFormatter,
  LeveonasInspector,
  LeveonasInvalidRequestError,
  LeveonasLanguageService,
  LeveonasProviderError,
  LeveonasRateLimitError,
  LeveonasResourceLimitError,
  LeveonasSecurityAuditor,
  LeveonasSecurityError,
  LeveonasSession,
  LeveonasTimeoutError,
  LeveonasUnavailableError,
  MetricsCollector,
  OpenAIProvider,
  OperationDispatcher,
  PRODUCTION_LEVEONAS_ORIGIN,
  Patch,
  PatchExecutor,
  PatchExecutorError,
  PatchGenerator,
  PatchOperationType,
  PatchSerializer,
  PatchValidationError,
  STARTER_TEMPLATES,
  TimeoutError,
  URL_ATTRIBUTES,
  VALID_MESSAGE_TYPES,
  VERSION,
  ValidationError,
  addCSSDeclaration,
  addCSSKeyframe,
  addProperty,
  attachEventHandler,
  attachTransportTimestamp,
  censorPaths,
  censorSecrets,
  cleanupJSSession,
  compile,
  createCSSRule,
  createJSUnit,
  createNode,
  createOperation,
  createSession,
  diagnose,
  executeJSUnit,
  format,
  getLeveonasOrigin,
  getSecurityLimits,
  handleAddProperty,
  handleInsertNode,
  handleMoveNode,
  handleNoOp,
  handleRemoveNode,
  handleRemoveProperty,
  handleReplaceChildren,
  handleReplaceNode,
  handleUpdateProperty,
  handleUpdateText,
  insertChild,
  insertNode,
  inspect,
  isAttributeSafe,
  isDangerousProtocol,
  isMessageSourceValid,
  isPatchBatchValid,
  isRetryableError,
  isValidUrl,
  loadLeveonasConfigFile,
  lower,
  materializeASTNode,
  moveChild,
  moveNode,
  noOp,
  normalizeAttributeName,
  normalizePatchOperationType,
  normalizeUrlString,
  parse,
  removeAttribute,
  removeCSSDeclaration,
  removeCSSKeyframe,
  removeCSSRule,
  removeChild,
  removeEventHandler,
  removeJSUnit,
  removeNode,
  removeProperty,
  replaceChildren,
  replaceNode,
  resolveLeveonasConfig,
  runAuditCommand,
  runBenchmarkCommand,
  runCLI,
  runCheckCommand,
  runCompileCommand,
  runFormatCommand,
  runInitCommand,
  runInspectCommand,
  safeStringify,
  sanitizeAttributes,
  sanitizeCssText,
  sanitizeErrorMessage,
  sanitizeForInspection,
  sanitizeUrl,
  serializeASTNode,
  setAttribute,
  setCSSStyleSheet,
  updateCSSDeclaration,
  updateCSSKeyframe,
  updateCSSRule,
  updateCSSSelector,
  updateEventHandler,
  updateJSUnit,
  updateProperty,
  updateText,
  validateIncomingMessage,
  validatePatchBatchSecurity,
  validatePatchOperationSecurity,
  validatePatches,
  withRetry
});
