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

// packages/lsp/index.ts
var index_exports = {};
__export(index_exports, {
  BlockExtractor: () => BlockExtractor,
  CompletionItemKind: () => CompletionItemKind,
  DiagnosticSeverity: () => DiagnosticSeverity,
  LeveonasCompletionProvider: () => LeveonasCompletionProvider,
  LeveonasDefinitionProvider: () => LeveonasDefinitionProvider,
  LeveonasDiagnosticEngine: () => LeveonasDiagnosticEngine,
  LeveonasFormatter: () => LeveonasFormatter,
  LeveonasHoverProvider: () => LeveonasHoverProvider,
  LeveonasInspector: () => LeveonasInspector,
  LeveonasLanguageService: () => LeveonasLanguageService,
  LeveonasReferencesProvider: () => LeveonasReferencesProvider,
  LeveonasSymbolsProvider: () => LeveonasSymbolsProvider,
  SymbolKind: () => SymbolKind,
  safeStringify: () => safeStringify,
  sanitizeForInspection: () => sanitizeForInspection
});
module.exports = __toCommonJS(index_exports);

// packages/lsp/types.ts
var DiagnosticSeverity = /* @__PURE__ */ ((DiagnosticSeverity2) => {
  DiagnosticSeverity2[DiagnosticSeverity2["Error"] = 1] = "Error";
  DiagnosticSeverity2[DiagnosticSeverity2["Warning"] = 2] = "Warning";
  DiagnosticSeverity2[DiagnosticSeverity2["Information"] = 3] = "Information";
  DiagnosticSeverity2[DiagnosticSeverity2["Hint"] = 4] = "Hint";
  return DiagnosticSeverity2;
})(DiagnosticSeverity || {});
var CompletionItemKind = /* @__PURE__ */ ((CompletionItemKind2) => {
  CompletionItemKind2[CompletionItemKind2["Text"] = 1] = "Text";
  CompletionItemKind2[CompletionItemKind2["Method"] = 2] = "Method";
  CompletionItemKind2[CompletionItemKind2["Function"] = 3] = "Function";
  CompletionItemKind2[CompletionItemKind2["Constructor"] = 4] = "Constructor";
  CompletionItemKind2[CompletionItemKind2["Field"] = 5] = "Field";
  CompletionItemKind2[CompletionItemKind2["Variable"] = 6] = "Variable";
  CompletionItemKind2[CompletionItemKind2["Class"] = 7] = "Class";
  CompletionItemKind2[CompletionItemKind2["Interface"] = 8] = "Interface";
  CompletionItemKind2[CompletionItemKind2["Module"] = 9] = "Module";
  CompletionItemKind2[CompletionItemKind2["Property"] = 10] = "Property";
  CompletionItemKind2[CompletionItemKind2["Unit"] = 11] = "Unit";
  CompletionItemKind2[CompletionItemKind2["Value"] = 12] = "Value";
  CompletionItemKind2[CompletionItemKind2["Enum"] = 13] = "Enum";
  CompletionItemKind2[CompletionItemKind2["Keyword"] = 14] = "Keyword";
  CompletionItemKind2[CompletionItemKind2["Snippet"] = 15] = "Snippet";
  CompletionItemKind2[CompletionItemKind2["Color"] = 16] = "Color";
  CompletionItemKind2[CompletionItemKind2["File"] = 17] = "File";
  CompletionItemKind2[CompletionItemKind2["Reference"] = 18] = "Reference";
  CompletionItemKind2[CompletionItemKind2["Folder"] = 19] = "Folder";
  CompletionItemKind2[CompletionItemKind2["EnumMember"] = 20] = "EnumMember";
  CompletionItemKind2[CompletionItemKind2["Constant"] = 21] = "Constant";
  CompletionItemKind2[CompletionItemKind2["Struct"] = 22] = "Struct";
  CompletionItemKind2[CompletionItemKind2["Event"] = 23] = "Event";
  CompletionItemKind2[CompletionItemKind2["Operator"] = 24] = "Operator";
  CompletionItemKind2[CompletionItemKind2["TypeParameter"] = 25] = "TypeParameter";
  return CompletionItemKind2;
})(CompletionItemKind || {});
var SymbolKind = /* @__PURE__ */ ((SymbolKind2) => {
  SymbolKind2[SymbolKind2["File"] = 1] = "File";
  SymbolKind2[SymbolKind2["Module"] = 2] = "Module";
  SymbolKind2[SymbolKind2["Namespace"] = 3] = "Namespace";
  SymbolKind2[SymbolKind2["Package"] = 4] = "Package";
  SymbolKind2[SymbolKind2["Class"] = 5] = "Class";
  SymbolKind2[SymbolKind2["Method"] = 6] = "Method";
  SymbolKind2[SymbolKind2["Property"] = 7] = "Property";
  SymbolKind2[SymbolKind2["Field"] = 8] = "Field";
  SymbolKind2[SymbolKind2["Constructor"] = 9] = "Constructor";
  SymbolKind2[SymbolKind2["Enum"] = 10] = "Enum";
  SymbolKind2[SymbolKind2["Interface"] = 11] = "Interface";
  SymbolKind2[SymbolKind2["Function"] = 12] = "Function";
  SymbolKind2[SymbolKind2["Variable"] = 13] = "Variable";
  SymbolKind2[SymbolKind2["Constant"] = 14] = "Constant";
  SymbolKind2[SymbolKind2["String"] = 15] = "String";
  SymbolKind2[SymbolKind2["Number"] = 16] = "Number";
  SymbolKind2[SymbolKind2["Boolean"] = 17] = "Boolean";
  SymbolKind2[SymbolKind2["Array"] = 18] = "Array";
  SymbolKind2[SymbolKind2["Object"] = 19] = "Object";
  SymbolKind2[SymbolKind2["Key"] = 20] = "Key";
  SymbolKind2[SymbolKind2["Null"] = 21] = "Null";
  SymbolKind2[SymbolKind2["EnumMember"] = 22] = "EnumMember";
  SymbolKind2[SymbolKind2["Struct"] = 23] = "Struct";
  SymbolKind2[SymbolKind2["Event"] = 24] = "Event";
  SymbolKind2[SymbolKind2["Operator"] = 25] = "Operator";
  SymbolKind2[SymbolKind2["TypeParameter"] = 26] = "TypeParameter";
  return SymbolKind2;
})(SymbolKind || {});

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
      const isKeyword = [
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
      if (!isAbbr && !isKnownHtml && !isStdComponent && !isCustomComp && !isKeyword && !isDeclaredVar) {
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
  const lower = name.toLowerCase();
  if (ANGULAR_ELEMENT_ABBREVIATIONS[lower]) {
    return { tag: ANGULAR_ELEMENT_ABBREVIATIONS[lower], isIntrinsic: true };
  }
  if (isIntrinsicTag4(lower)) {
    return { tag: lower, isIntrinsic: true };
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
    const defaultLoc2 = {
      startLine: 1,
      startColumn: 1,
      startOffset: 0,
      endLine: 1,
      endColumn: 1,
      endOffset: 0
    };
    const rootDomNode = ASTFactory.createComponent("Root" /* Root */, defaultLoc2);
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
          const loc = txt.sourceLocation || defaultLoc2;
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
          const loc = compInst.sourceLocation || defaultLoc2;
          const genericComp = ASTFactory.createComponent("Container" /* Container */, loc, [], [], compInst.componentName);
          genericComp.id = `${parentPath}-${compInst.componentName}_${index}`;
          return [genericComp];
        }
        case "ReactElement" /* Element */: {
          const elem = node;
          const canonicalTag = resolveReactElementTag(elem.tag);
          const astKind = TAG_TO_AST_KIND2[canonicalTag] || "GenericComponent" /* GenericComponent */;
          const loc = elem.sourceLocation || defaultLoc2;
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
    const defaultLoc2 = {
      startLine: 1,
      startColumn: 1,
      startOffset: 0,
      endLine: 1,
      endColumn: 1,
      endOffset: 0
    };
    const rootDomNode = ASTFactory.createComponent("Root" /* Root */, defaultLoc2);
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
          const loc = txt.sourceLocation || defaultLoc2;
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
          const loc = compInst.sourceLocation || defaultLoc2;
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
          const loc = elem.sourceLocation || defaultLoc2;
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
    const defaultLoc2 = {
      startLine: 1,
      startColumn: 1,
      startOffset: 0,
      endLine: 1,
      endColumn: 1,
      endOffset: 0
    };
    const rootDomNode = ASTFactory.createComponent("Root" /* Root */, defaultLoc2);
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
          const loc = txt.sourceLocation || defaultLoc2;
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
          const loc = compInst.sourceLocation || defaultLoc2;
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
          const loc = elem.sourceLocation || defaultLoc2;
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BlockExtractor,
  CompletionItemKind,
  DiagnosticSeverity,
  LeveonasCompletionProvider,
  LeveonasDefinitionProvider,
  LeveonasDiagnosticEngine,
  LeveonasFormatter,
  LeveonasHoverProvider,
  LeveonasInspector,
  LeveonasLanguageService,
  LeveonasReferencesProvider,
  LeveonasSymbolsProvider,
  SymbolKind,
  safeStringify,
  sanitizeForInspection
});
