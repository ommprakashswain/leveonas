var __defProp = Object.defineProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// packages/compiler/ast/index.ts
var ast_exports = {};
__export(ast_exports, {
  ASTBuilder: () => ASTBuilder,
  ASTError: () => ASTError,
  ASTFactory: () => ASTFactory,
  ASTNodeKind: () => ASTNodeKind,
  ASTPrinter: () => ASTPrinter,
  ASTWalker: () => ASTWalker,
  cloneASTNode: () => cloneASTNode,
  cloneLocation: () => cloneLocation,
  generateNodeId: () => generateNodeId,
  visitNode: () => visitNode
});

// packages/compiler/ast/types.ts
var ASTNodeKind = /* @__PURE__ */ ((ASTNodeKind2) => {
  ASTNodeKind2["Root"] = "Root";
  ASTNodeKind2["Page"] = "Page";
  ASTNodeKind2["Section"] = "Section";
  ASTNodeKind2["Container"] = "Container";
  ASTNodeKind2["Hero"] = "Hero";
  ASTNodeKind2["Button"] = "Button";
  ASTNodeKind2["Input"] = "Input";
  ASTNodeKind2["Text"] = "Text";
  ASTNodeKind2["Image"] = "Image";
  ASTNodeKind2["Form"] = "Form";
  ASTNodeKind2["Grid"] = "Grid";
  ASTNodeKind2["Card"] = "Card";
  ASTNodeKind2["GenericComponent"] = "GenericComponent";
  ASTNodeKind2["Property"] = "Property";
  ASTNodeKind2["Literal"] = "Literal";
  return ASTNodeKind2;
})(ASTNodeKind || {});

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

// packages/compiler/ast/builder.ts
var ASTBuilder = class {
  constructor() {
    this.current = null;
    this.root = null;
    this.stack = [];
    this.root = ASTFactory.createComponent("Root" /* Root */, this.emptyLoc());
    this.current = this.root;
    this.stack.push(this.root);
  }
  getRoot() {
    return this.root;
  }
  enterComponent(kind, loc, name) {
    const comp = ASTFactory.createComponent(kind, loc || this.emptyLoc(), [], [], name);
    this.current.children.push(comp);
    comp.parent = this.current;
    this.current = comp;
    this.stack.push(comp);
    return this;
  }
  exitComponent() {
    if (this.stack.length > 1) {
      this.stack.pop();
      this.current = this.stack[this.stack.length - 1];
    }
    return this;
  }
  addProperty(name, value, raw, loc) {
    if (!this.current || this.current.kind === "Literal" /* Literal */ || this.current.kind === "Property" /* Property */) return this;
    const literal = value !== null ? ASTFactory.createLiteral(value, raw || String(value), loc || this.emptyLoc()) : null;
    const prop = ASTFactory.createProperty(name, literal, loc || this.emptyLoc());
    prop.parent = this.current;
    this.current.properties.push(prop);
    return this;
  }
  emptyLoc() {
    return ASTFactory.createSourceLocation(0, 0, 0, 0, 0, 0);
  }
};

// packages/compiler/ast/visitor.ts
function visitNode(node, visitor) {
  switch (node.kind) {
    case "Root" /* Root */:
      if (visitor.visitRoot) visitor.visitRoot(node);
      break;
    case "Page" /* Page */:
      if (visitor.visitPage) visitor.visitPage(node);
      break;
    case "Section" /* Section */:
      if (visitor.visitSection) visitor.visitSection(node);
      break;
    case "Container" /* Container */:
      if (visitor.visitContainer) visitor.visitContainer(node);
      break;
    case "Hero" /* Hero */:
      if (visitor.visitHero) visitor.visitHero(node);
      break;
    case "Button" /* Button */:
      if (visitor.visitButton) visitor.visitButton(node);
      break;
    case "Input" /* Input */:
      if (visitor.visitInput) visitor.visitInput(node);
      break;
    case "Text" /* Text */:
      if (visitor.visitText) visitor.visitText(node);
      break;
    case "Image" /* Image */:
      if (visitor.visitImage) visitor.visitImage(node);
      break;
    case "Form" /* Form */:
      if (visitor.visitForm) visitor.visitForm(node);
      break;
    case "Grid" /* Grid */:
      if (visitor.visitGrid) visitor.visitGrid(node);
      break;
    case "Card" /* Card */:
      if (visitor.visitCard) visitor.visitCard(node);
      break;
    case "GenericComponent" /* GenericComponent */:
      if (visitor.visitGenericComponent) visitor.visitGenericComponent(node);
      break;
    case "Property" /* Property */:
      if (visitor.visitProperty) visitor.visitProperty(node);
      break;
    case "Literal" /* Literal */:
      if (visitor.visitLiteral) visitor.visitLiteral(node);
      break;
  }
}

// packages/compiler/ast/walker.ts
var ASTWalker = class _ASTWalker {
  static walk(node, visitor) {
    visitNode(node, visitor);
    if (node.kind === "Property" /* Property */) {
      if (node.value) {
        _ASTWalker.walk(node.value, visitor);
      }
    } else if (node.kind !== "Literal" /* Literal */) {
      const comp = node;
      if (comp.properties) {
        for (const prop of comp.properties) {
          _ASTWalker.walk(prop, visitor);
        }
      }
      if (comp.children) {
        for (const child of comp.children) {
          _ASTWalker.walk(child, visitor);
        }
      }
    }
  }
};

// packages/compiler/ast/printer.ts
var ASTPrinter = class _ASTPrinter {
  static print(node, indentLevel = 0) {
    const indent = "  ".repeat(indentLevel);
    let out = "";
    if (node.kind === "Literal" /* Literal */) {
      return `${indent}Literal(${node.raw})
`;
    }
    if (node.kind === "Property" /* Property */) {
      const prop = node;
      out += `${indent}Property(${prop.name})`;
      if (prop.value) {
        out += `: ${prop.value.raw}`;
      }
      return out + "\n";
    }
    const comp = node;
    let name = comp.kind.toString();
    if (comp.kind === "GenericComponent" /* GenericComponent */) {
      name = comp.name;
    }
    out += `${indent}${name} [id=${comp.id}]
`;
    if (comp.properties && comp.properties.length > 0) {
      out += `${indent}  Properties:
`;
      for (const prop of comp.properties) {
        out += _ASTPrinter.print(prop, indentLevel + 2);
      }
    }
    if (comp.children && comp.children.length > 0) {
      out += `${indent}  Children:
`;
      for (const child of comp.children) {
        out += _ASTPrinter.print(child, indentLevel + 2);
      }
    }
    return out;
  }
  static serialize(node) {
    const replacer = (key, value) => {
      if (key === "parent") return void 0;
      return value;
    };
    return JSON.stringify(node, replacer, 2);
  }
};

// packages/compiler/ast/errors.ts
var ASTError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "ASTError";
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

// packages/compiler/lexer/index.ts
var lexer_exports = {};
__export(lexer_exports, {
  DiagnosticCode: () => DiagnosticCode,
  DiagnosticSeverity: () => DiagnosticSeverity,
  LMBlockEventType: () => LMBlockEventType,
  LMStreamLexer: () => LMStreamLexer,
  LMStreamLexerState: () => LMStreamLexerState,
  LM_COMPONENTS: () => LM_COMPONENTS,
  LM_ENUMS: () => LM_ENUMS,
  LM_PROPERTIES: () => LM_PROPERTIES,
  Lexer: () => Lexer,
  LexerError: () => LexerError,
  LexicalTokenType: () => LexicalTokenType,
  SUPPORTED_BLOCK_LANGUAGES: () => SUPPORTED_BLOCK_LANGUAGES,
  createDiagnostic: () => createDiagnostic,
  isComponent: () => isComponent,
  isEnum: () => isEnum,
  isProperty: () => isProperty
});

// packages/compiler/tokenizer/token.ts
function createToken(type, value, line, column, offset) {
  return { type, value, line, column, offset };
}

// packages/compiler/tokenizer/errors.ts
var TokenizerError = class extends Error {
  constructor(message, line, column, offset) {
    super(`${message} at line ${line}, column ${column} (offset ${offset})`);
    this.name = "TokenizerError";
    this.line = line;
    this.column = column;
    this.offset = offset;
  }
};

// packages/compiler/tokenizer/utils.ts
function isWhitespace(char) {
  return char === " " || char === "	" || char === "\n" || char === "\r";
}
function isAlpha(char) {
  return char >= "a" && char <= "z" || char >= "A" && char <= "Z" || char === "_";
}
function isDigit(char) {
  return char >= "0" && char <= "9";
}
function isAlphaNumeric(char) {
  return isAlpha(char) || isDigit(char);
}

// packages/compiler/tokenizer/keywords.ts
var KEYWORDS = /* @__PURE__ */ new Set([
  "true",
  "false",
  "null"
]);
function isKeyword(value) {
  return KEYWORDS.has(value);
}
function isBoolean(value) {
  return value === "true" || value === "false";
}

// packages/compiler/tokenizer/scanner.ts
var Scanner = class {
  constructor(source) {
    this.offset = 0;
    this.line = 1;
    this.column = 1;
    this.source = source;
  }
  tokenize() {
    const tokens = [];
    let token = this.nextToken();
    while (token.type !== "EOF" /* EOF */) {
      tokens.push(token);
      token = this.nextToken();
    }
    tokens.push(token);
    return tokens;
  }
  nextToken() {
    this.skipWhitespaceAndComments();
    if (this.isAtEnd()) {
      return this.makeToken("EOF" /* EOF */, "");
    }
    const char = this.peek();
    switch (char) {
      case "{":
        return this.advanceAndMakeToken("BraceOpen" /* BraceOpen */);
      case "}":
        return this.advanceAndMakeToken("BraceClose" /* BraceClose */);
      case "[":
        return this.advanceAndMakeToken("BracketOpen" /* BracketOpen */);
      case "]":
        return this.advanceAndMakeToken("BracketClose" /* BracketClose */);
      case "(":
        return this.advanceAndMakeToken("ParenOpen" /* ParenOpen */);
      case ")":
        return this.advanceAndMakeToken("ParenClose" /* ParenClose */);
      case ":":
        return this.advanceAndMakeToken("Colon" /* Colon */);
      case ",":
        return this.advanceAndMakeToken("Comma" /* Comma */);
      case ".":
        return this.advanceAndMakeToken("Dot" /* Dot */);
      case '"':
        return this.readString();
    }
    if (isAlpha(char)) {
      return this.readIdentifierOrKeyword();
    }
    if (isDigit(char) || char === "-" && isDigit(this.peekNext())) {
      return this.readNumber();
    }
    throw new TokenizerError(`Unexpected character: '${char}'`, this.line, this.column, this.offset);
  }
  skipWhitespaceAndComments() {
    while (!this.isAtEnd()) {
      const char = this.peek();
      if (isWhitespace(char)) {
        this.advance();
      } else if (char === "/" && this.peekNext() === "/") {
        while (!this.isAtEnd() && this.peek() !== "\n") {
          this.advance();
        }
      } else if (char === "/" && this.peekNext() === "*") {
        this.advance();
        this.advance();
        while (!this.isAtEnd()) {
          if (this.peek() === "*" && this.peekNext() === "/") {
            this.advance();
            this.advance();
            break;
          }
          this.advance();
        }
      } else {
        break;
      }
    }
  }
  readString() {
    const startLine = this.line;
    const startCol = this.column;
    const startOffset = this.offset;
    this.advance();
    let value = "";
    while (!this.isAtEnd() && this.peek() !== '"') {
      if (this.peek() === "\\") {
        this.advance();
        if (!this.isAtEnd()) {
          value += this.advance();
        }
      } else {
        value += this.advance();
      }
    }
    if (this.isAtEnd()) {
      throw new TokenizerError("Unterminated string", startLine, startCol, startOffset);
    }
    this.advance();
    return createToken("String" /* String */, value, startLine, startCol, startOffset);
  }
  readIdentifierOrKeyword() {
    const startLine = this.line;
    const startCol = this.column;
    const startOffset = this.offset;
    let value = "";
    while (!this.isAtEnd() && (isAlphaNumeric(this.peek()) || this.peek() === "-")) {
      value += this.advance();
    }
    let type = "Identifier" /* Identifier */;
    if (isBoolean(value)) {
      type = "Boolean" /* Boolean */;
    } else if (isKeyword(value)) {
      type = "Keyword" /* Keyword */;
    }
    return createToken(type, value, startLine, startCol, startOffset);
  }
  readNumber() {
    const startLine = this.line;
    const startCol = this.column;
    const startOffset = this.offset;
    let value = "";
    if (this.peek() === "-") {
      value += this.advance();
    }
    while (!this.isAtEnd() && isDigit(this.peek())) {
      value += this.advance();
    }
    if (this.peek() === "." && isDigit(this.peekNext())) {
      value += this.advance();
      while (!this.isAtEnd() && isDigit(this.peek())) {
        value += this.advance();
      }
    }
    return createToken("Number" /* Number */, value, startLine, startCol, startOffset);
  }
  advance() {
    const char = this.source[this.offset];
    this.offset++;
    if (char === "\n") {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    return char;
  }
  peek() {
    if (this.isAtEnd()) return "\0";
    return this.source[this.offset];
  }
  peekNext() {
    if (this.offset + 1 >= this.source.length) return "\0";
    return this.source[this.offset + 1];
  }
  isAtEnd() {
    return this.offset >= this.source.length;
  }
  advanceAndMakeToken(type) {
    const startLine = this.line;
    const startCol = this.column;
    const startOffset = this.offset;
    const char = this.advance();
    return createToken(type, char, startLine, startCol, startOffset);
  }
  makeToken(type, value) {
    return createToken(type, value, this.line, this.column, this.offset);
  }
};

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
function isComponent(name) {
  return LM_COMPONENTS.has(name);
}

// packages/compiler/lexer/properties.ts
var LM_PROPERTIES = /* @__PURE__ */ new Set([
  "id",
  "class",
  "pad",
  "px",
  "py",
  "pt",
  "pb",
  "pl",
  "pr",
  "m",
  "mx",
  "my",
  "mt",
  "mb",
  "ml",
  "mr",
  "gap",
  "theme",
  "variant",
  "size",
  "state",
  "hidden",
  "disabled",
  "loading",
  "responsive",
  "animation",
  "width",
  "center",
  "align",
  "justify",
  "cols",
  "rows",
  "flex",
  "vertical",
  "color",
  "thickness",
  "shadow",
  "radius",
  "bg",
  "sticky",
  "transparent",
  "collapsible",
  "separator",
  "orientation",
  "trigger",
  "page",
  "total",
  "onChange",
  "level",
  "cite",
  "for",
  "href",
  "external",
  "type",
  "placeholder",
  "bind",
  "label",
  "group",
  "options",
  "min",
  "max",
  "src",
  "alt",
  "objectFit",
  "autoPlay",
  "loop",
  "controls",
  "fallback",
  "name",
  "duration",
  "value",
  "content",
  "position",
  "open",
  "onClose",
  "striped",
  "border",
  "multiple",
  "selectable",
  "trend",
  "format",
  "data",
  "query",
  "actions",
  "history",
  "role",
  "ast",
  "lang",
  "lines",
  "endpoint",
  "files",
  "logs",
  "old",
  "new"
]);
function isProperty(name) {
  return LM_PROPERTIES.has(name);
}

// packages/compiler/lexer/enums.ts
var LM_ENUMS = /* @__PURE__ */ new Set([
  // Sizes
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
  "7xl",
  "8xl",
  "9xl",
  "full",
  "auto",
  "screen",
  // Variants / Themes / Colors
  "primary",
  "secondary",
  "accent",
  "surface",
  "background",
  "foreground",
  "success",
  "warning",
  "danger",
  "info",
  "muted",
  "ghost",
  "outline",
  "solid",
  "soft",
  // Alignments / Justifications
  "start",
  "center",
  "end",
  "between",
  "around",
  "evenly",
  "stretch",
  "top",
  "bottom",
  "left",
  "right",
  // Orientations
  "horizontal",
  "vertical",
  // Types
  "text",
  "password",
  "email",
  "number",
  "tel",
  "url",
  "search",
  "date",
  "time",
  // Roles
  "user",
  "assistant",
  "system",
  "model",
  // Animation/State
  "hover",
  "focus",
  "active",
  "pulse",
  "spin",
  "bounce",
  "fade"
]);
function isEnum(name) {
  return LM_ENUMS.has(name);
}

// packages/compiler/lexer/diagnostics.ts
var DiagnosticSeverity = /* @__PURE__ */ ((DiagnosticSeverity4) => {
  DiagnosticSeverity4["Error"] = "Error";
  DiagnosticSeverity4["Warning"] = "Warning";
  DiagnosticSeverity4["Info"] = "Info";
  return DiagnosticSeverity4;
})(DiagnosticSeverity || {});
var DiagnosticCode = /* @__PURE__ */ ((DiagnosticCode3) => {
  DiagnosticCode3["UnknownKeyword"] = "UnknownKeyword";
  DiagnosticCode3["UnknownProperty"] = "UnknownProperty";
  DiagnosticCode3["UnexpectedIdentifier"] = "UnexpectedIdentifier";
  DiagnosticCode3["ReservedKeywordMisuse"] = "ReservedKeywordMisuse";
  DiagnosticCode3["DuplicateProperty"] = "DuplicateProperty";
  DiagnosticCode3["UnknownEnum"] = "UnknownEnum";
  return DiagnosticCode3;
})(DiagnosticCode || {});
function createDiagnostic(code, message, severity, line, column, offset) {
  return { code, message, severity, line, column, offset };
}

// packages/compiler/lexer/lexer.ts
var LexicalTokenType = /* @__PURE__ */ ((LexicalTokenType2) => {
  LexicalTokenType2["Component"] = "Component";
  LexicalTokenType2["Property"] = "Property";
  LexicalTokenType2["Enum"] = "Enum";
  LexicalTokenType2["Identifier"] = "Identifier";
  LexicalTokenType2["StringLiteral"] = "StringLiteral";
  LexicalTokenType2["NumberLiteral"] = "NumberLiteral";
  LexicalTokenType2["BooleanLiteral"] = "BooleanLiteral";
  LexicalTokenType2["Punctuation"] = "Punctuation";
  LexicalTokenType2["EOF"] = "EOF";
  return LexicalTokenType2;
})(LexicalTokenType || {});
var Lexer = class {
  constructor(tokens) {
    this.current = 0;
    this.diagnostics = [];
    // Track properties per component (simple heuristic: clear when seeing a Component or BraceOpen)
    // This is a bit parser-like, but to detect DuplicateProperty we need *some* context,
    // or we can just emit it when we see a property if we track a stack.
    // Wait, the prompt says "Generate diagnostics for ... Duplicate property"
    // Let's track properties within a bracket/brace if possible, or just emit a warning?
    // Let's do a simple state machine to track properties within brackets `[]`.
    this.currentProperties = /* @__PURE__ */ new Set();
    this.insideBrackets = false;
    this.tokens = tokens;
  }
  getDiagnostics() {
    return this.diagnostics;
  }
  lex() {
    const lexicalTokens = [];
    while (!this.isAtEnd()) {
      lexicalTokens.push(this.nextLexicalToken());
    }
    lexicalTokens.push({
      type: "EOF" /* EOF */,
      value: "",
      originalToken: this.tokens[this.current],
      line: this.tokens[this.current]?.line || 0,
      column: this.tokens[this.current]?.column || 0,
      offset: this.tokens[this.current]?.offset || 0
    });
    return lexicalTokens;
  }
  isAtEnd() {
    return this.current >= this.tokens.length || this.tokens[this.current].type === "EOF" /* EOF */;
  }
  advance() {
    return this.tokens[this.current++];
  }
  peek() {
    return this.tokens[this.current];
  }
  nextLexicalToken() {
    const token = this.advance();
    if (token.type === "String" /* String */) {
      return this.makeLexicalToken("StringLiteral" /* StringLiteral */, token);
    }
    if (token.type === "Number" /* Number */) {
      return this.makeLexicalToken("NumberLiteral" /* NumberLiteral */, token);
    }
    if (token.type === "Boolean" /* Boolean */) {
      return this.makeLexicalToken("BooleanLiteral" /* BooleanLiteral */, token);
    }
    if (token.type === "BraceOpen" /* BraceOpen */ || token.type === "BraceClose" /* BraceClose */ || token.type === "BracketOpen" /* BracketOpen */ || token.type === "BracketClose" /* BracketClose */ || token.type === "ParenOpen" /* ParenOpen */ || token.type === "ParenClose" /* ParenClose */ || token.type === "Colon" /* Colon */ || token.type === "Comma" /* Comma */ || token.type === "Dot" /* Dot */) {
      if (token.type === "BracketOpen" /* BracketOpen */) {
        this.insideBrackets = true;
        this.currentProperties.clear();
      } else if (token.type === "BracketClose" /* BracketClose */) {
        this.insideBrackets = false;
        this.currentProperties.clear();
      }
      return this.makeLexicalToken("Punctuation" /* Punctuation */, token);
    }
    if (token.type === "Identifier" /* Identifier */) {
      const value = token.value;
      if (isComponent(value)) {
        return this.makeLexicalToken("Component" /* Component */, token);
      }
      if (isProperty(value)) {
        if (this.currentProperties.has(value)) {
          this.reportDiagnostic("DuplicateProperty" /* DuplicateProperty */, `Duplicate property '${value}'`, "Warning" /* Warning */, token);
        } else {
          this.currentProperties.add(value);
        }
        return this.makeLexicalToken("Property" /* Property */, token);
      }
      if (isEnum(value)) {
        return this.makeLexicalToken("Enum" /* Enum */, token);
      }
      if (this.insideBrackets) {
        this.reportDiagnostic("UnknownProperty" /* UnknownProperty */, `Unknown property or enum '${value}'`, "Warning" /* Warning */, token);
      } else if (value.length > 0 && value[0] === value[0].toUpperCase()) {
        this.reportDiagnostic("UnknownKeyword" /* UnknownKeyword */, `Unknown component '${value}'`, "Warning" /* Warning */, token);
      } else {
        this.reportDiagnostic("UnexpectedIdentifier" /* UnexpectedIdentifier */, `Unexpected identifier '${value}'`, "Warning" /* Warning */, token);
      }
      return this.makeLexicalToken("Identifier" /* Identifier */, token);
    }
    if (token.type === "Keyword" /* Keyword */) {
      return this.makeLexicalToken("Identifier" /* Identifier */, token);
    }
    return this.makeLexicalToken("Identifier" /* Identifier */, token);
  }
  makeLexicalToken(type, token) {
    return {
      type,
      value: token.value,
      originalToken: token,
      line: token.line,
      column: token.column,
      offset: token.offset
    };
  }
  reportDiagnostic(code, message, severity, token) {
    this.diagnostics.push(
      createDiagnostic(code, message, severity, token.line, token.column, token.offset)
    );
  }
};

// packages/compiler/lexer/errors.ts
var LexerError = class extends Error {
  constructor(message, diagnostics = []) {
    super(message);
    this.name = "LexerError";
    this.diagnostics = diagnostics;
  }
};

// packages/compiler/lexer/stream-types.ts
var LMBlockEventType = /* @__PURE__ */ ((LMBlockEventType2) => {
  LMBlockEventType2["BLOCK_START"] = "BLOCK_START";
  LMBlockEventType2["BLOCK_CONTENT"] = "BLOCK_CONTENT";
  LMBlockEventType2["BLOCK_END"] = "BLOCK_END";
  LMBlockEventType2["TEXT"] = "TEXT";
  LMBlockEventType2["ERROR"] = "ERROR";
  LMBlockEventType2["STREAM_END"] = "STREAM_END";
  return LMBlockEventType2;
})(LMBlockEventType || {});
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
var LMStreamLexerState = /* @__PURE__ */ ((LMStreamLexerState2) => {
  LMStreamLexerState2["IDLE"] = "IDLE";
  LMStreamLexerState2["IN_BLOCK"] = "IN_BLOCK";
  LMStreamLexerState2["ENDED"] = "ENDED";
  return LMStreamLexerState2;
})(LMStreamLexerState || {});

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

// packages/compiler/parser/index.ts
var parser_exports = {};
__export(parser_exports, {
  ASTNodeType: () => ASTNodeType,
  DiagnosticCode: () => DiagnosticCode2,
  DiagnosticSeverity: () => DiagnosticSeverity2,
  Parser: () => Parser,
  ParserError: () => ParserError,
  createComponentNode: () => createComponentNode,
  createDiagnostic: () => createDiagnostic2,
  createLiteralNode: () => createLiteralNode,
  createPropertyNode: () => createPropertyNode,
  createSourceLocation: () => createSourceLocation,
  generateNodeId: () => generateNodeId2,
  isLiteral: () => isLiteral
});

// packages/compiler/parser/diagnostics.ts
var DiagnosticSeverity2 = /* @__PURE__ */ ((DiagnosticSeverity4) => {
  DiagnosticSeverity4["Error"] = "Error";
  DiagnosticSeverity4["Warning"] = "Warning";
  DiagnosticSeverity4["Info"] = "Info";
  return DiagnosticSeverity4;
})(DiagnosticSeverity2 || {});
var DiagnosticCode2 = /* @__PURE__ */ ((DiagnosticCode3) => {
  DiagnosticCode3["MissingClosingBrace"] = "MissingClosingBrace";
  DiagnosticCode3["MissingClosingBracket"] = "MissingClosingBracket";
  DiagnosticCode3["UnexpectedToken"] = "UnexpectedToken";
  DiagnosticCode3["UnknownProperty"] = "UnknownProperty";
  DiagnosticCode3["InvalidNesting"] = "InvalidNesting";
  DiagnosticCode3["UnexpectedEOF"] = "UnexpectedEOF";
  DiagnosticCode3["DuplicateProperty"] = "DuplicateProperty";
  DiagnosticCode3["MissingPropertyValue"] = "MissingPropertyValue";
  return DiagnosticCode3;
})(DiagnosticCode2 || {});
function createDiagnostic2(code, message, severity, line, column, offset) {
  return { code, message, severity, line, column, offset };
}

// packages/compiler/parser/nodes.ts
var ASTNodeType = /* @__PURE__ */ ((ASTNodeType2) => {
  ASTNodeType2["Page"] = "PageNode";
  ASTNodeType2["Section"] = "SectionNode";
  ASTNodeType2["Container"] = "ContainerNode";
  ASTNodeType2["Hero"] = "HeroNode";
  ASTNodeType2["Button"] = "ButtonNode";
  ASTNodeType2["Input"] = "InputNode";
  ASTNodeType2["Text"] = "TextNode";
  ASTNodeType2["Image"] = "ImageNode";
  ASTNodeType2["Form"] = "FormNode";
  ASTNodeType2["Grid"] = "GridNode";
  ASTNodeType2["Card"] = "CardNode";
  ASTNodeType2["GenericComponent"] = "GenericComponentNode";
  ASTNodeType2["Property"] = "PropertyNode";
  ASTNodeType2["Literal"] = "LiteralNode";
  return ASTNodeType2;
})(ASTNodeType || {});

// packages/compiler/parser/builder.ts
var nodeCounter2 = 0;
function generateNodeId2() {
  return `node_${++nodeCounter2}`;
}
function createSourceLocation(startLine, startColumn, startOffset, endLine, endColumn, endOffset) {
  return { startLine, startColumn, startOffset, endLine, endColumn, endOffset };
}
function createLiteralNode(value, raw, loc) {
  return {
    type: "LiteralNode" /* Literal */,
    nodeId: generateNodeId2(),
    value,
    raw,
    sourceLocation: loc
  };
}
function createPropertyNode(name, value, loc) {
  return {
    type: "PropertyNode" /* Property */,
    nodeId: generateNodeId2(),
    name,
    value,
    sourceLocation: loc
  };
}
function createComponentNode(componentName, loc, parent = null, properties = [], children = []) {
  let type = "GenericComponentNode" /* GenericComponent */;
  switch (componentName) {
    case "Page":
      type = "PageNode" /* Page */;
      break;
    case "Section":
      type = "SectionNode" /* Section */;
      break;
    case "Container":
      type = "ContainerNode" /* Container */;
      break;
    case "HeroTitle":
    case "Hero":
      type = "HeroNode" /* Hero */;
      break;
    case "Button":
      type = "ButtonNode" /* Button */;
      break;
    case "Input":
      type = "InputNode" /* Input */;
      break;
    case "Text":
      type = "TextNode" /* Text */;
      break;
    case "Image":
      type = "ImageNode" /* Image */;
      break;
    case "Form":
      type = "FormNode" /* Form */;
      break;
    case "Grid":
      type = "GridNode" /* Grid */;
      break;
    case "Card":
      type = "CardNode" /* Card */;
      break;
  }
  const baseNode = {
    type,
    nodeId: generateNodeId2(),
    parent,
    sourceLocation: loc,
    properties,
    children
  };
  if (type === "GenericComponentNode" /* GenericComponent */) {
    return { ...baseNode, type: "GenericComponentNode" /* GenericComponent */, name: componentName };
  }
  return baseNode;
}

// packages/compiler/parser/grammar.ts
function isLiteral(type) {
  return type === "StringLiteral" /* StringLiteral */ || type === "NumberLiteral" /* NumberLiteral */ || type === "BooleanLiteral" /* BooleanLiteral */ || type === "Enum" /* Enum */;
}

// packages/compiler/parser/parser.ts
var Parser = class {
  constructor(tokens) {
    this.current = 0;
    this.diagnostics = [];
    this.tokens = tokens;
  }
  getDiagnostics() {
    return this.diagnostics;
  }
  parse() {
    const rootNodes = [];
    while (!this.isAtEnd()) {
      const node = this.parseComponent(null);
      if (node) {
        rootNodes.push(node);
      } else {
        const token = this.peek();
        this.reportError("UnexpectedToken" /* UnexpectedToken */, `Unexpected token: ${token.value}`, token);
        this.advance();
      }
    }
    return rootNodes;
  }
  isAtEnd() {
    return this.peek().type === "EOF" /* EOF */;
  }
  peek() {
    return this.tokens[this.current];
  }
  previous() {
    return this.tokens[this.current - 1];
  }
  advance() {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }
  check(type, value) {
    if (this.isAtEnd()) return false;
    const token = this.peek();
    if (token.type !== type) return false;
    if (value !== void 0 && token.value !== value) return false;
    return true;
  }
  match(type, value) {
    if (this.check(type, value)) {
      this.advance();
      return true;
    }
    return false;
  }
  consume(type, message, code, value) {
    if (this.check(type, value)) {
      return this.advance();
    }
    const token = this.peek();
    this.reportError(code, message, token);
    return null;
  }
  reportError(code, message, token) {
    this.diagnostics.push(createDiagnostic2(
      code,
      message,
      "Error" /* Error */,
      token.line,
      token.column,
      token.offset
    ));
  }
  parseComponent(parent) {
    if (this.check("Component" /* Component */) || this.check("Identifier" /* Identifier */)) {
      const token = this.advance();
      const componentName = token.value;
      const startLoc = { line: token.line, column: token.column, offset: token.offset };
      const properties = [];
      const children = [];
      if (this.match("Punctuation" /* Punctuation */, "[")) {
        while (!this.check("Punctuation" /* Punctuation */, "]") && !this.isAtEnd()) {
          const prop = this.parseProperty();
          if (prop) properties.push(prop);
          if (!this.match("Punctuation" /* Punctuation */, ",")) {
            break;
          }
        }
        this.consume("Punctuation" /* Punctuation */, 'Expected "]" after properties.', "MissingClosingBracket" /* MissingClosingBracket */, "]");
      }
      if (this.check("StringLiteral" /* StringLiteral */)) {
        const strToken = this.advance();
        const literal = createLiteralNode(
          strToken.value,
          strToken.originalToken.value,
          createSourceLocation(strToken.line, strToken.column, strToken.offset, strToken.line, strToken.column + strToken.originalToken.value.length + 2, strToken.offset + strToken.originalToken.value.length + 2)
        );
        const textComp = createComponentNode("Text", literal.sourceLocation, null, [], [literal]);
        children.push(textComp);
      } else if (this.match("Punctuation" /* Punctuation */, "{")) {
        while (!this.check("Punctuation" /* Punctuation */, "}") && !this.isAtEnd()) {
          if (this.check("StringLiteral" /* StringLiteral */)) {
            const strToken = this.advance();
            const literal = createLiteralNode(
              strToken.value,
              strToken.originalToken.value,
              createSourceLocation(strToken.line, strToken.column, strToken.offset, strToken.line, strToken.column + strToken.value.length + 2, strToken.offset + strToken.value.length + 2)
            );
            const textComp = createComponentNode("Text", literal.sourceLocation, null, [], [literal]);
            children.push(textComp);
          } else {
            const child = this.parseComponent(null);
            if (child) {
              children.push(child);
            } else {
              this.advance();
            }
          }
        }
        this.consume("Punctuation" /* Punctuation */, 'Expected "}" after component children.', "MissingClosingBrace" /* MissingClosingBrace */, "}");
      }
      const endToken = this.previous();
      const endOffset = endToken.offset + (endToken.originalToken.value ? endToken.originalToken.value.length : 1);
      const loc = createSourceLocation(
        startLoc.line,
        startLoc.column,
        startLoc.offset,
        endToken.line,
        endToken.column,
        endOffset
      );
      const component = createComponentNode(componentName, loc, parent, properties, children);
      for (const child of children) {
        if ("parent" in child) {
          child.parent = component;
        }
      }
      return component;
    }
    return null;
  }
  parseProperty() {
    if (this.check("Property" /* Property */) || this.check("Identifier" /* Identifier */) || this.check("Enum" /* Enum */)) {
      const nameToken = this.advance();
      const name = nameToken.value;
      const startLoc = { line: nameToken.line, column: nameToken.column, offset: nameToken.offset };
      let literal = null;
      let endToken = nameToken;
      if (this.match("Punctuation" /* Punctuation */, ":")) {
        if (isLiteral(this.peek().type)) {
          const valToken = this.advance();
          endToken = valToken;
          let val = valToken.value;
          if (valToken.type === "NumberLiteral" /* NumberLiteral */) val = parseFloat(valToken.value);
          else if (valToken.type === "BooleanLiteral" /* BooleanLiteral */) val = valToken.value === "true";
          literal = createLiteralNode(
            val,
            valToken.originalToken.value,
            createSourceLocation(
              valToken.line,
              valToken.column,
              valToken.offset,
              valToken.line,
              valToken.column + valToken.originalToken.value.length,
              valToken.offset + valToken.originalToken.value.length
            )
          );
        } else {
          this.reportError("MissingPropertyValue" /* MissingPropertyValue */, 'Expected value after ":" in property.', this.peek());
        }
      } else {
        literal = createLiteralNode(
          true,
          "true",
          createSourceLocation(nameToken.line, nameToken.column, nameToken.offset, nameToken.line, nameToken.column, nameToken.offset)
        );
      }
      const loc = createSourceLocation(
        startLoc.line,
        startLoc.column,
        startLoc.offset,
        endToken.line,
        endToken.column,
        endToken.offset + (endToken.originalToken.value ? endToken.originalToken.value.length : 1)
      );
      return createPropertyNode(name, literal, loc);
    }
    this.reportError("UnknownProperty" /* UnknownProperty */, "Expected property name.", this.peek());
    return null;
  }
};

// packages/compiler/parser/errors.ts
var ParserError = class extends Error {
  constructor(message, diagnostics = []) {
    super(message);
    this.name = "ParserError";
    this.diagnostics = diagnostics;
  }
};

// packages/compiler/pipeline/index.ts
var pipeline_exports = {};
__export(pipeline_exports, {
  CompilerPipeline: () => CompilerPipeline,
  LMGenerationPipeline: () => LMGenerationPipeline,
  PipelineDiagnosticSeverity: () => PipelineDiagnosticSeverity,
  PipelineError: () => PipelineError
});

// packages/compiler/pipeline/diagnostics.ts
var PipelineDiagnosticSeverity = /* @__PURE__ */ ((PipelineDiagnosticSeverity2) => {
  PipelineDiagnosticSeverity2["Error"] = "Error";
  PipelineDiagnosticSeverity2["Warning"] = "Warning";
  PipelineDiagnosticSeverity2["Info"] = "Info";
  return PipelineDiagnosticSeverity2;
})(PipelineDiagnosticSeverity || {});

// packages/compiler/pipeline/errors.ts
var PipelineError = class extends Error {
  constructor(message, stage) {
    super(message);
    this.stage = stage;
    this.name = "PipelineError";
  }
};

// packages/compiler/pipeline/context.ts
var PipelineContext = class {
  constructor(options) {
    this.options = options;
    this.diagnostics = [];
    this.statistics = {
      scannerTime: 0,
      tokenizerTime: 0,
      lexerTime: 0,
      parserTime: 0,
      validatorTime: 0,
      rendererTime: 0,
      patchGeneratorTime: 0,
      totalTime: 0
    };
  }
  reportDiagnostic(diagnostic) {
    if (this.options.collectDiagnostics !== false) {
      this.diagnostics.push(diagnostic);
    }
  }
  hasErrors() {
    return this.diagnostics.some((d) => d.severity === "Error" /* Error */);
  }
  getWarnings() {
    return this.diagnostics.filter((d) => d.severity === "Warning" /* Warning */);
  }
};

// packages/compiler/validator/diagnostics.ts
var DiagnosticBag = class {
  constructor() {
    this.diagnostics = [];
  }
  add(code, severity, message, sourceLocation, suggestedFix) {
    this.diagnostics.push({
      code,
      severity,
      message,
      sourceLocation,
      suggestedFix
    });
  }
  getDiagnostics() {
    return this.diagnostics;
  }
  hasErrors() {
    return this.diagnostics.some((d) => d.severity === "Error" /* Error */);
  }
};

// packages/compiler/validator/context.ts
var ValidationContext = class {
  constructor(rootNode) {
    this.rootNode = rootNode;
    this.diagnostics = new DiagnosticBag();
  }
  reportError(code, message, loc, fix) {
    this.diagnostics.add(code, "Error" /* Error */, message, loc, fix);
  }
  reportWarning(code, message, loc, fix) {
    this.diagnostics.add(code, "Warning" /* Warning */, message, loc, fix);
  }
  reportInfo(code, message, loc, fix) {
    this.diagnostics.add(code, "Info" /* Info */, message, loc, fix);
  }
};

// packages/compiler/validator/visitors.ts
function createComponentVisitor(visit) {
  return {
    visitRoot: visit,
    visitPage: visit,
    visitSection: visit,
    visitContainer: visit,
    visitHero: visit,
    visitButton: visit,
    visitInput: visit,
    visitText: visit,
    visitImage: visit,
    visitForm: visit,
    visitGrid: visit,
    visitCard: visit,
    visitGenericComponent: visit
  };
}

// packages/compiler/validator/rules.ts
var HierarchyRule = {
  name: "HierarchyRule",
  validate(context) {
    ASTWalker.walk(context.rootNode, {
      visitPage(node) {
        if (node.parent && node.parent.kind !== "Root" /* Root */) {
          context.reportError(
            "V_HIERARCHY_001",
            "Page component must be a direct child of Root",
            node.sourceLocation,
            "Move the Page component to the root level"
          );
        }
      },
      visitSection(node) {
        if (node.parent && node.parent.kind !== "Page" /* Page */ && node.parent.kind !== "Root" /* Root */) {
          context.reportError(
            "V_HIERARCHY_002",
            "Section component should typically be a child of Page or Root",
            node.sourceLocation,
            "Consider moving the Section component"
          );
        }
      }
    });
  }
};
var DuplicatePropertyRule = {
  name: "DuplicatePropertyRule",
  validate(context) {
    ASTWalker.walk(context.rootNode, createComponentVisitor((node) => {
      const propNames = /* @__PURE__ */ new Set();
      for (const prop of node.properties || []) {
        if (propNames.has(prop.name)) {
          context.reportError(
            "V_PROP_001",
            `Duplicate property '${prop.name}' found on component '${node.kind}'`,
            prop.sourceLocation,
            `Remove the duplicate '${prop.name}' property`
          );
        }
        propNames.add(prop.name);
      }
    }));
  }
};
var UnknownComponentRule = {
  name: "UnknownComponentRule",
  validate(context) {
    ASTWalker.walk(context.rootNode, {
      visitGenericComponent(node) {
        context.reportError(
          "V_COMP_001",
          `Unknown component '${node.name}'`,
          node.sourceLocation,
          `Ensure '${node.name}' is a supported standard component`
        );
      }
    });
  }
};
var ComponentSchema = {
  ["Page" /* Page */]: {
    props: {
      theme: ["light", "dark", "system"],
      title: "string"
    }
  },
  ["Button" /* Button */]: {
    props: {
      primary: "boolean",
      size: ["sm", "md", "lg"],
      label: "string"
    }
  },
  ["Image" /* Image */]: {
    required: ["src"],
    props: {
      src: "string",
      alt: "string"
    }
  }
};
var SchemaValidationRule = {
  name: "SchemaValidationRule",
  validate(context) {
    ASTWalker.walk(context.rootNode, createComponentVisitor((node) => {
      const schema = ComponentSchema[node.kind];
      if (!schema) return;
      const propNames = new Set((node.properties || []).map((p) => p.name));
      for (const req of schema.required || []) {
        if (!propNames.has(req)) {
          context.reportError(
            "V_SCHEMA_001",
            `Missing required property '${req}' on '${node.kind}' component`,
            node.sourceLocation,
            `Add the '${req}' property`
          );
        }
      }
      for (const prop of node.properties || []) {
        const expected = schema.props?.[prop.name];
        if (expected) {
          const value = prop.value?.value;
          if (Array.isArray(expected)) {
            if (value !== void 0 && !expected.includes(String(value))) {
              context.reportError(
                "V_SCHEMA_002",
                `Invalid enum value '${value}' for property '${prop.name}'. Expected one of: ${expected.join(", ")}`,
                prop.sourceLocation,
                `Change to a valid enum value`
              );
            }
          } else if (typeof expected === "string") {
            if (value !== void 0 && typeof value !== expected) {
              context.reportError(
                "V_SCHEMA_003",
                `Invalid type for property '${prop.name}'. Expected ${expected}, got ${typeof value}`,
                prop.sourceLocation,
                `Change value to ${expected}`
              );
            }
          }
        } else {
          context.reportWarning(
            "V_SCHEMA_004",
            `Unknown property '${prop.name}' on '${node.kind}' component`,
            prop.sourceLocation,
            `Verify property name or remove it`
          );
        }
      }
    }));
  }
};
var InvalidNestingRule = {
  name: "InvalidNestingRule",
  validate(context) {
    ASTWalker.walk(context.rootNode, createComponentVisitor((node) => {
      if (node.kind === "Button" /* Button */) {
        for (const child of node.children) {
          if (child.kind === "Input" /* Input */ || child.kind === "Form" /* Form */ || child.kind === "Button" /* Button */) {
            context.reportError(
              "V_NEST_001",
              `Component '${child.kind}' cannot be a child of '${node.kind}'`,
              child.sourceLocation,
              `Remove or move the '${child.kind}' component`
            );
          }
        }
      }
    }));
  }
};
var ResponsiveRule = {
  name: "ResponsiveRule",
  validate(context) {
    ASTWalker.walk(context.rootNode, createComponentVisitor((node) => {
      for (const prop of node.properties || []) {
        if (prop.name === "responsive") {
          if (typeof prop.value?.value === "string" && !prop.value.value.match(/^(sm|md|lg|xl)\s*:/)) {
            context.reportError(
              "V_RESP_001",
              `Invalid responsive definition in '${prop.name}'. Expected format like 'md:flex'`,
              prop.sourceLocation,
              `Fix the responsive syntax`
            );
          }
        }
      }
    }));
  }
};
var AnimationRule = {
  name: "AnimationRule",
  validate(context) {
    ASTWalker.walk(context.rootNode, createComponentVisitor((node) => {
      for (const prop of node.properties || []) {
        if (prop.name === "animation") {
          const allowedAnimations = ["fade", "slide", "zoom", "bounce"];
          if (typeof prop.value?.value === "string" && !allowedAnimations.includes(prop.value.value)) {
            context.reportError(
              "V_ANIM_001",
              `Invalid animation '${prop.value.value}'. Expected one of: ${allowedAnimations.join(", ")}`,
              prop.sourceLocation,
              `Use a valid animation name`
            );
          }
        }
      }
    }));
  }
};
var StandardRules = [
  HierarchyRule,
  DuplicatePropertyRule,
  UnknownComponentRule,
  SchemaValidationRule,
  InvalidNestingRule,
  ResponsiveRule,
  AnimationRule
];

// packages/compiler/validator/validator.ts
var SemanticValidator = class {
  constructor() {
    this.rules = [];
    this.rules = [...StandardRules];
  }
  addRule(rule) {
    this.rules.push(rule);
  }
  validate(rootNode) {
    const context = new ValidationContext(rootNode);
    for (const rule of this.rules) {
      try {
        rule.validate(context);
      } catch (err) {
        context.reportError(
          "V_FATAL",
          `Rule ${rule.name} failed with an exception: ${err instanceof Error ? err.message : String(err)}`,
          { startLine: 0, startColumn: 0, startOffset: 0, endLine: 0, endColumn: 0, endOffset: 0 }
        );
      }
    }
    return context.diagnostics.getDiagnostics();
  }
};

// packages/compiler/renderers/html/formatter.ts
var HtmlFormatter = class {
  constructor(options = {}) {
    this.options = options;
  }
  format(html) {
    if (this.options.minify) {
      return html.replace(/\s+/g, " ").replace(/>\s+</g, "><").trim();
    }
    return html;
  }
  getIndent(level) {
    if (this.options.minify) return "";
    const size = this.options.indentSize ?? 2;
    return " ".repeat(level * size);
  }
  getNewline() {
    if (this.options.minify) return "";
    return "\n";
  }
};

// packages/compiler/renderers/html/writer.ts
var HtmlWriter = class {
  constructor(options) {
    this.buffer = "";
    this.formatter = new HtmlFormatter(options);
  }
  write(content) {
    this.buffer += content;
  }
  writeIndent(level) {
    this.buffer += this.formatter.getIndent(level);
  }
  writeNewline() {
    this.buffer += this.formatter.getNewline();
  }
  getOutput() {
    return this.buffer;
  }
};

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
var SelfClosingElements = /* @__PURE__ */ new Set([
  "input",
  "img",
  "br",
  "hr",
  "meta",
  "link"
]);

// packages/compiler/renderers/html/escape.ts
function escapeHtml(unsafe) {
  if (typeof unsafe !== "string") return "";
  return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function escapeAttribute(unsafe) {
  if (typeof unsafe !== "string") return "";
  return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// packages/compiler/renderers/html/serializer.ts
var HtmlSerializer = class {
  constructor(writer) {
    this.writer = writer;
  }
  serialize(node, indentLevel = 0) {
    if (node.kind === "Literal" /* Literal */) {
      const literal = node;
      this.writer.writeIndent(indentLevel);
      this.writer.write(escapeHtml(String(literal.value)));
      this.writer.writeNewline();
      return;
    }
    if (node.kind === "Property" /* Property */) {
      return;
    }
    if (node.kind === "Root" /* Root */) {
      const comp2 = node;
      for (const child of comp2.children || []) {
        this.serialize(child, indentLevel);
      }
      return;
    }
    let tagName = "div";
    let isComponent2 = true;
    const comp = node;
    if (node.kind === "GenericComponent" /* GenericComponent */) {
      const genName = node.name;
      tagName = ElementMap[genName] || genName || "div";
    } else {
      tagName = ElementMap[node.kind] || "div";
    }
    this.writer.writeIndent(indentLevel);
    this.writer.write(`<${tagName}`);
    const attributes = /* @__PURE__ */ new Map();
    if (tagName === "button" && !attributes.has("type")) {
      attributes.set("type", "button");
    }
    if (tagName === "img" && !attributes.has("alt")) {
      attributes.set("alt", "");
    }
    if (comp.properties) {
      for (const prop of comp.properties) {
        let attrName = prop.name;
        let attrValue = String(prop.value?.value ?? "");
        if (attrName === "className") {
          attrName = "class";
        }
        attributes.set(attrName, attrValue);
      }
    }
    const sortedKeys = Array.from(attributes.keys()).sort();
    for (const key of sortedKeys) {
      const val = attributes.get(key);
      this.writer.write(` ${escapeAttribute(key)}="${escapeAttribute(val)}"`);
    }
    if (SelfClosingElements.has(tagName)) {
      this.writer.write(` />`);
      this.writer.writeNewline();
    } else {
      this.writer.write(`>`);
      this.writer.writeNewline();
      if (comp.children && comp.children.length > 0) {
        for (const child of comp.children) {
          this.serialize(child, indentLevel + 1);
        }
      }
      this.writer.writeIndent(indentLevel);
      this.writer.write(`</${tagName}>`);
      this.writer.writeNewline();
    }
  }
};

// packages/compiler/renderers/html/errors.ts
var RenderError = class extends Error {
  constructor(message) {
    super(`RenderError: ${message}`);
    this.name = "RenderError";
  }
};

// packages/compiler/renderers/html/renderer.ts
var HtmlRenderer = class {
  constructor(options = {}) {
    this.options = options;
  }
  render(ast) {
    if (!ast) {
      throw new RenderError("Cannot render a null or undefined AST");
    }
    try {
      const writer = new HtmlWriter(this.options);
      const serializer = new HtmlSerializer(writer);
      serializer.serialize(ast);
      let output = writer.getOutput();
      if (!this.options.minify) {
        output = output.trim();
      }
      return output;
    } catch (e) {
      throw new RenderError(`Failed to render HTML: ${e.message}`);
    }
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
function insertChild(nodeId, parentId, index, payload) {
  return createOperation("INSERT_CHILD" /* INSERT_CHILD */, nodeId, parentId, index, payload);
}
function removeChild(nodeId, parentId, index) {
  return createOperation("REMOVE_CHILD" /* REMOVE_CHILD */, nodeId, parentId, index);
}
function moveChild(nodeId, parentId, newIndex, oldIndex) {
  return createOperation("MOVE_CHILD" /* MOVE_CHILD */, nodeId, parentId, newIndex, oldIndex !== void 0 ? { oldIndex } : void 0);
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

// packages/runtime/incremental/patch-generator/generator.ts
var PatchGenerator = class {
  generate(oldAst, newAst) {
    const patch = new Patch();
    const diffEngine = new DiffEngine(patch);
    diffEngine.diff(oldAst, newAst);
    return patch.getOperations();
  }
};

// packages/compiler/pipeline/stages.ts
function mapNodeType(type) {
  switch (type) {
    case "PageNode" /* Page */:
      return "Page" /* Page */;
    case "SectionNode" /* Section */:
      return "Section" /* Section */;
    case "ContainerNode" /* Container */:
      return "Container" /* Container */;
    case "HeroNode" /* Hero */:
      return "Hero" /* Hero */;
    case "ButtonNode" /* Button */:
      return "Button" /* Button */;
    case "InputNode" /* Input */:
      return "Input" /* Input */;
    case "TextNode" /* Text */:
      return "Text" /* Text */;
    case "ImageNode" /* Image */:
      return "Image" /* Image */;
    case "FormNode" /* Form */:
      return "Form" /* Form */;
    case "GridNode" /* Grid */:
      return "Grid" /* Grid */;
    case "CardNode" /* Card */:
      return "Card" /* Card */;
    case "GenericComponentNode" /* GenericComponent */:
      return "GenericComponent" /* GenericComponent */;
    case "PropertyNode" /* Property */:
      return "Property" /* Property */;
    case "LiteralNode" /* Literal */:
      return "Literal" /* Literal */;
    default:
      return "GenericComponent" /* GenericComponent */;
  }
}
function adaptParserTreeToAST(parserNodes) {
  const root = ASTFactory.createComponent("Root" /* Root */, ASTFactory.createSourceLocation(0, 0, 0, 0, 0, 0));
  function adaptNode(node, parent) {
    if (node.type === "LiteralNode" /* Literal */) {
      const lit = node;
      const res2 = ASTFactory.createLiteral(lit.value, lit.raw, lit.sourceLocation);
      res2.parent = parent;
      res2.id = lit.nodeId;
      return res2;
    }
    if (node.type === "PropertyNode" /* Property */) {
      const prop = node;
      const val = prop.value ? adaptNode(prop.value, null) : null;
      const res2 = ASTFactory.createProperty(prop.name, val, prop.sourceLocation);
      if (val) val.parent = res2;
      res2.parent = parent;
      res2.id = prop.nodeId;
      return res2;
    }
    const comp = node;
    const kind = mapNodeType(comp.type);
    const name = comp.type === "GenericComponentNode" /* GenericComponent */ ? comp.name : void 0;
    const res = ASTFactory.createComponent(kind, comp.sourceLocation, [], [], name);
    res.parent = parent;
    res.id = comp.nodeId;
    const props = comp.properties.map((p) => adaptNode(p, res));
    const children = comp.children.map((c) => adaptNode(c, res));
    res.properties = props;
    res.children = children;
    return res;
  }
  root.children = parserNodes.map((n) => adaptNode(n, root));
  return root;
}
var PipelineStages = class {
  constructor(context) {
    this.context = context;
  }
  runTokenizer(source) {
    const start = performance.now();
    const tokenizer = new Scanner(source);
    const tokens = tokenizer.tokenize();
    this.context.statistics.tokenizerTime = performance.now() - start;
    return tokens;
  }
  runLexer(tokens) {
    const start = performance.now();
    const lexer = new Lexer(tokens);
    const lexTokens = lexer.lex();
    const diagnostics = lexer.getDiagnostics();
    for (const d of diagnostics) {
      this.context.reportDiagnostic({
        stage: "lexer",
        code: d.code,
        message: d.message,
        severity: d.severity,
        location: {
          startLine: d.line,
          startColumn: d.column,
          startOffset: d.offset
        }
      });
    }
    this.context.statistics.lexerTime = performance.now() - start;
    return lexTokens;
  }
  runParser(tokens) {
    const start = performance.now();
    const parser = new Parser(tokens);
    const parserNodes = parser.parse();
    const diagnostics = parser.getDiagnostics();
    for (const d of diagnostics) {
      this.context.reportDiagnostic({
        stage: "parser",
        code: d.code,
        message: d.message,
        severity: d.severity,
        location: {
          startLine: d.line,
          startColumn: d.column,
          startOffset: d.offset
        }
      });
    }
    const rootNode = adaptParserTreeToAST(parserNodes);
    this.context.statistics.parserTime = performance.now() - start;
    return rootNode;
  }
  runValidator(ast) {
    const start = performance.now();
    const validator = new SemanticValidator();
    const diagnostics = validator.validate(ast);
    for (const d of diagnostics) {
      this.context.reportDiagnostic({
        stage: "validator",
        code: d.code,
        message: d.message,
        severity: d.severity,
        location: d.sourceLocation
      });
    }
    this.context.statistics.validatorTime = performance.now() - start;
  }
  runRenderer(ast, minify = false) {
    const start = performance.now();
    const renderer = new HtmlRenderer({ minify, indentSize: 2 });
    const html = renderer.render(ast);
    this.context.statistics.rendererTime = performance.now() - start;
    return html;
  }
  runPatchGenerator(oldAst, newAst) {
    const start = performance.now();
    const generator = new PatchGenerator();
    const patches = generator.generate(oldAst, newAst);
    this.context.statistics.patchGeneratorTime = performance.now() - start;
    return patches;
  }
};

// packages/compiler/pipeline/pipeline.ts
var CompilerPipeline = class {
  constructor(defaultOptions = {}) {
    this.defaultOptions = defaultOptions;
    this.previousAst = null;
  }
  compile(source, options) {
    const mergedOptions = { ...this.defaultOptions, ...options };
    const context = new PipelineContext(mergedOptions);
    const stages = new PipelineStages(context);
    const totalStart = performance.now();
    let ast = null;
    let html = "";
    let patches = [];
    try {
      const tokens = stages.runTokenizer(source);
      const lexTokens = stages.runLexer(tokens);
      if (mergedOptions.stopOnError && context.hasErrors()) {
        return this.createResult(context, ast, html, patches, totalStart, false);
      }
      ast = stages.runParser(lexTokens);
      if (mergedOptions.stopOnError && context.hasErrors()) {
        return this.createResult(context, ast, html, patches, totalStart, false);
      }
      stages.runValidator(ast);
      if (mergedOptions.stopOnError && context.hasErrors()) {
        return this.createResult(context, ast, html, patches, totalStart, false);
      }
      html = stages.runRenderer(ast, mergedOptions.minifyHtml !== false && !mergedOptions.prettyHtml);
      if (mergedOptions.generatePatches !== false) {
        if (this.previousAst) {
          patches = stages.runPatchGenerator(this.previousAst, ast);
        } else {
          const emptyRoot = adaptParserTreeToAST([]);
          patches = stages.runPatchGenerator(emptyRoot, ast);
        }
        this.previousAst = ast;
      }
    } catch (error) {
      context.reportDiagnostic({
        stage: "pipeline",
        code: "PipelineError",
        message: error.message || String(error),
        severity: "Error" /* Error */
      });
    }
    context.statistics.totalTime = performance.now() - totalStart;
    return this.createResult(context, ast, html, patches, totalStart, !context.hasErrors());
  }
  createResult(context, ast, html, patches, startTime, success) {
    if (!context.statistics.totalTime) {
      context.statistics.totalTime = performance.now() - startTime;
    }
    return {
      ast,
      html,
      patches,
      diagnostics: context.diagnostics,
      warnings: context.getWarnings(),
      statistics: context.statistics,
      success
    };
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
function isKnownElementAbbreviation(abbr) {
  return abbr in KNOWN_ELEMENT_ABBREVIATIONS;
}
function isKnownAttributeAbbreviation(abbr) {
  return abbr in KNOWN_ATTRIBUTE_ABBREVIATIONS;
}
function expandElementAbbreviation(abbr) {
  return KNOWN_ELEMENT_ABBREVIATIONS[abbr] ?? abbr;
}
function expandAttributeAbbreviation(abbr) {
  return KNOWN_ATTRIBUTE_ABBREVIATIONS[abbr] ?? abbr;
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

// packages/compiler/interpreters/css-lm/ast.ts
var CSSNodeKind = /* @__PURE__ */ ((CSSNodeKind2) => {
  CSSNodeKind2["StyleSheet"] = "CSSStyleSheet";
  CSSNodeKind2["Rule"] = "CSSRule";
  CSSNodeKind2["Declaration"] = "CSSDeclaration";
  CSSNodeKind2["MediaRule"] = "CSSMediaRule";
  CSSNodeKind2["KeyframesRule"] = "CSSKeyframesRule";
  CSSNodeKind2["KeyframeBlock"] = "CSSKeyframeBlock";
  return CSSNodeKind2;
})(CSSNodeKind || {});
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
function encodeCSSProperty(property) {
  const normalized = property.trim().toLowerCase();
  if (normalized.startsWith("--")) {
    return property.trim();
  }
  return CANONICAL_TO_LM_CSS_PROPERTY[normalized] || property.trim();
}
function decodeCSSProperty(lmProperty) {
  const trimmed = lmProperty.trim();
  if (trimmed.startsWith("--")) {
    return trimmed;
  }
  const lower = trimmed.toLowerCase();
  return CSS_PROPERTY_ABBREVIATIONS[lower] || trimmed;
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

// packages/compiler/interpreters/js-lm/ast.ts
var JSNodeKind = /* @__PURE__ */ ((JSNodeKind2) => {
  JSNodeKind2["Program"] = "JSProgram";
  JSNodeKind2["Unit"] = "JSUnit";
  JSNodeKind2["VariableDeclaration"] = "JSVariableDeclaration";
  JSNodeKind2["Function"] = "JSFunctionDeclaration";
  JSNodeKind2["FunctionDeclaration"] = "JSFunctionDeclaration";
  JSNodeKind2["ArrowFunction"] = "JSArrowFunction";
  JSNodeKind2["Literal"] = "JSLiteral";
  JSNodeKind2["Identifier"] = "JSIdentifier";
  JSNodeKind2["BinaryExpression"] = "JSBinaryExpression";
  JSNodeKind2["UnaryExpression"] = "JSUnaryExpression";
  JSNodeKind2["CallExpression"] = "JSCallExpression";
  JSNodeKind2["MemberExpression"] = "JSMemberExpression";
  JSNodeKind2["Assignment"] = "JSAssignmentExpression";
  JSNodeKind2["Return"] = "JSReturnStatement";
  JSNodeKind2["IfStatement"] = "JSIfStatement";
  JSNodeKind2["ConditionalExpression"] = "JSConditionalExpression";
  JSNodeKind2["Block"] = "JSBlockStatement";
  JSNodeKind2["BlockStatement"] = "JSBlockStatement";
  JSNodeKind2["EventHandler"] = "JSEventHandler";
  JSNodeKind2["DOMOperation"] = "JSDOMOperation";
  JSNodeKind2["Timer"] = "JSTimer";
  JSNodeKind2["TimerOperation"] = "JSTimer";
  JSNodeKind2["ExpressionStatement"] = "JSExpressionStatement";
  return JSNodeKind2;
})(JSNodeKind || {});
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
function getJSNodeId(nodeKind, name, disambiguator = 0) {
  const cleanName = name.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 24);
  const suffix = disambiguator > 0 ? `-${disambiguator}` : "";
  return `js-${nodeKind.toLowerCase()}-${cleanName || "node"}${suffix}`;
}

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
var TSNodeKind = /* @__PURE__ */ ((TSNodeKind2) => {
  TSNodeKind2["Program"] = "TSProgram";
  TSNodeKind2["Unit"] = "TSUnit";
  TSNodeKind2["VariableDeclaration"] = "TSVariableDeclaration";
  TSNodeKind2["FunctionDeclaration"] = "TSFunctionDeclaration";
  TSNodeKind2["InterfaceDeclaration"] = "TSInterfaceDeclaration";
  TSNodeKind2["TypeAliasDeclaration"] = "TSTypeAliasDeclaration";
  TSNodeKind2["ClassDeclaration"] = "TSClassDeclaration";
  TSNodeKind2["EnumDeclaration"] = "TSEnumDeclaration";
  TSNodeKind2["EventHandler"] = "TSEventHandler";
  TSNodeKind2["DOMOperation"] = "TSDOMOperation";
  TSNodeKind2["Timer"] = "TSTimer";
  TSNodeKind2["ImportDeclaration"] = "TSImportDeclaration";
  TSNodeKind2["ExportDeclaration"] = "TSExportDeclaration";
  TSNodeKind2["ExpressionStatement"] = "TSExpressionStatement";
  return TSNodeKind2;
})(TSNodeKind || {});
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
  tsCompiler = __require("typescript");
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
var TS_KEYWORD_ABBREVIATIONS = {
  iface: "interface",
  tp: "type",
  fn: "function",
  func: "function",
  cls: "class",
  imp: "import",
  exp: "export"
};
var TS_DOM_ABBREVIATIONS = {
  qs: "document.querySelector",
  qsa: "document.querySelectorAll",
  gid: "document.getElementById",
  st: "setTimeout",
  si: "setInterval",
  on: "__leveonas_runtime__.on",
  setText: "__leveonas_runtime__.setText",
  setHTML: "__leveonas_runtime__.setHTML",
  addClass: "__leveonas_runtime__.addClass",
  removeClass: "__leveonas_runtime__.removeClass",
  toggleClass: "__leveonas_runtime__.toggleClass"
};
var KNOWN_DOM_EVENTS = /* @__PURE__ */ new Set([
  "click",
  "dblclick",
  "mousedown",
  "mouseup",
  "mousemove",
  "mouseenter",
  "mouseleave",
  "keydown",
  "keyup",
  "keypress",
  "input",
  "change",
  "submit",
  "focus",
  "blur",
  "reset",
  "scroll",
  "resize",
  "touchstart",
  "touchend",
  "touchmove"
]);
function expandTSTypeAbbreviation(typeStr) {
  if (!typeStr) return typeStr;
  let expanded = typeStr;
  for (const [abbr, full] of Object.entries(TS_TYPE_ABBREVIATIONS)) {
    const regex = new RegExp(`\\b${abbr}\\b`, "g");
    expanded = expanded.replace(regex, full);
  }
  return expanded;
}
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
function isValidDOMEvent(eventName) {
  const clean = eventName.toLowerCase().replace(/^on/, "");
  return KNOWN_DOM_EVENTS.has(clean);
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

// packages/compiler/interpreters/react-lm/ast.ts
var ReactNodeKind = /* @__PURE__ */ ((ReactNodeKind2) => {
  ReactNodeKind2["Program"] = "ReactProgram";
  ReactNodeKind2["ComponentDeclaration"] = "ReactComponentDeclaration";
  ReactNodeKind2["StateDeclaration"] = "ReactStateDeclaration";
  ReactNodeKind2["DerivedDeclaration"] = "ReactDerivedDeclaration";
  ReactNodeKind2["Element"] = "ReactElement";
  ReactNodeKind2["ComponentInstance"] = "ReactComponentInstance";
  ReactNodeKind2["Fragment"] = "ReactFragment";
  ReactNodeKind2["Conditional"] = "ReactConditional";
  ReactNodeKind2["List"] = "ReactList";
  ReactNodeKind2["Text"] = "ReactText";
  ReactNodeKind2["Prop"] = "ReactProp";
  ReactNodeKind2["EventHandler"] = "ReactEventHandler";
  return ReactNodeKind2;
})(ReactNodeKind || {});
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
function isIntrinsicTag(name) {
  if (REACT_ELEMENT_ABBREVIATIONS[name]) return true;
  return /^[a-z][a-z0-9_-]*$/.test(name);
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

// packages/compiler/interpreters/vue-lm/ast.ts
var VueNodeKind = /* @__PURE__ */ ((VueNodeKind2) => {
  VueNodeKind2["Program"] = "VueProgram";
  VueNodeKind2["ComponentDeclaration"] = "VueComponentDeclaration";
  VueNodeKind2["StateDeclaration"] = "VueStateDeclaration";
  VueNodeKind2["ComputedDeclaration"] = "VueComputedDeclaration";
  VueNodeKind2["Element"] = "VueElement";
  VueNodeKind2["ComponentInstance"] = "VueComponentInstance";
  VueNodeKind2["Fragment"] = "VueFragment";
  VueNodeKind2["Conditional"] = "VueConditional";
  VueNodeKind2["List"] = "VueList";
  VueNodeKind2["Slot"] = "VueSlot";
  VueNodeKind2["Text"] = "VueText";
  VueNodeKind2["Prop"] = "VueProp";
  VueNodeKind2["EventBinding"] = "VueEventBinding";
  VueNodeKind2["ModelBinding"] = "VueModelBinding";
  return VueNodeKind2;
})(VueNodeKind || {});
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
function getVueEventHandlerId(componentName, eventName, selector, disambiguator = 0) {
  const cleanComp = componentName.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 24);
  const cleanEvt = eventName.toLowerCase().replace(/^(?:on|@)/, "");
  const cleanSel = selector.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 24);
  const suffix = disambiguator > 0 ? `-${disambiguator}` : "";
  return `vue-evt-${cleanComp}-${cleanEvt}-${cleanSel || "node"}${suffix}`;
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
function isIntrinsicTag4(name) {
  if (VUE_ELEMENT_ABBREVIATIONS[name]) return true;
  return /^[a-z][a-z0-9_-]*$/.test(name);
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

// packages/compiler/interpreters/svelte-lm/ast.ts
var SvelteNodeKind = /* @__PURE__ */ ((SvelteNodeKind2) => {
  SvelteNodeKind2["Program"] = "SvelteProgram";
  SvelteNodeKind2["ComponentDeclaration"] = "SvelteComponentDeclaration";
  SvelteNodeKind2["StateDeclaration"] = "SvelteStateDeclaration";
  SvelteNodeKind2["ReactiveDeclaration"] = "SvelteReactiveDeclaration";
  SvelteNodeKind2["PropDeclaration"] = "SveltePropDeclaration";
  SvelteNodeKind2["Element"] = "SvelteElement";
  SvelteNodeKind2["ComponentInstance"] = "SvelteComponentInstance";
  SvelteNodeKind2["Fragment"] = "SvelteFragment";
  SvelteNodeKind2["Conditional"] = "SvelteConditional";
  SvelteNodeKind2["Each"] = "SvelteEach";
  SvelteNodeKind2["Slot"] = "SvelteSlot";
  SvelteNodeKind2["Text"] = "SvelteText";
  SvelteNodeKind2["Prop"] = "SvelteProp";
  SvelteNodeKind2["EventBinding"] = "SvelteEventBinding";
  SvelteNodeKind2["Binding"] = "SvelteBinding";
  return SvelteNodeKind2;
})(SvelteNodeKind || {});
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
function getSvelteEventHandlerId(componentName, eventName, selector, disambiguator = 0) {
  const cleanComp = componentName.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 24);
  const cleanEvt = eventName.toLowerCase().replace(/^(?:on:|on|@)/, "");
  const cleanSel = selector.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 24);
  const suffix = disambiguator > 0 ? `-${disambiguator}` : "";
  return `svelte-evt-${cleanComp}-${cleanEvt}-${cleanSel || "node"}${suffix}`;
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
function isIntrinsicTag7(name) {
  if (SVELTE_ELEMENT_ABBREVIATIONS[name]) return true;
  return /^[a-z][a-z0-9_-]*$/.test(name);
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

// packages/compiler/interpreters/angular-lm/ast.ts
var AngularNodeKind = /* @__PURE__ */ ((AngularNodeKind2) => {
  AngularNodeKind2["Program"] = "AngularProgram";
  AngularNodeKind2["ComponentDeclaration"] = "AngularComponentDeclaration";
  AngularNodeKind2["StateDeclaration"] = "AngularStateDeclaration";
  AngularNodeKind2["DerivedDeclaration"] = "AngularDerivedDeclaration";
  AngularNodeKind2["InputDeclaration"] = "AngularInputDeclaration";
  AngularNodeKind2["OutputDeclaration"] = "AngularOutputDeclaration";
  AngularNodeKind2["Element"] = "AngularElement";
  AngularNodeKind2["ComponentInstance"] = "AngularComponentInstance";
  AngularNodeKind2["Fragment"] = "AngularFragment";
  AngularNodeKind2["Conditional"] = "AngularConditional";
  AngularNodeKind2["For"] = "AngularFor";
  AngularNodeKind2["ContentProjection"] = "AngularContentProjection";
  AngularNodeKind2["Text"] = "AngularText";
  AngularNodeKind2["Prop"] = "AngularProp";
  AngularNodeKind2["EventBinding"] = "AngularEventBinding";
  AngularNodeKind2["PropertyBinding"] = "AngularPropertyBinding";
  AngularNodeKind2["ClassBinding"] = "AngularClassBinding";
  AngularNodeKind2["StyleBinding"] = "AngularStyleBinding";
  AngularNodeKind2["TwoWayBinding"] = "AngularTwoWayBinding";
  return AngularNodeKind2;
})(AngularNodeKind || {});
var idCounter = 0;
function resetAngularIdCounter() {
  idCounter = 0;
}
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
function getAngularConditionalId() {
  return `angular_if_${++idCounter}`;
}
function getAngularForId() {
  return `angular_for_${++idCounter}`;
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
var KNOWN_ANGULAR_EVENTS = /* @__PURE__ */ new Set([
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
  "touchend"
]);
function resolveAngularElementTag(name) {
  const lower = name.toLowerCase();
  if (ANGULAR_ELEMENT_ABBREVIATIONS[lower]) {
    return { tag: ANGULAR_ELEMENT_ABBREVIATIONS[lower], isIntrinsic: true };
  }
  if (isIntrinsicTag10(lower)) {
    return { tag: lower, isIntrinsic: true };
  }
  return { tag: name, isIntrinsic: false };
}
function isIntrinsicTag10(tag) {
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

// packages/compiler/ui-ir/types.ts
var UIIRNodeKind = /* @__PURE__ */ ((UIIRNodeKind2) => {
  UIIRNodeKind2["Program"] = "UIProgram";
  UIIRNodeKind2["Component"] = "UIComponent";
  UIIRNodeKind2["State"] = "UIState";
  UIIRNodeKind2["Derived"] = "UIDerived";
  UIIRNodeKind2["Prop"] = "UIProp";
  UIIRNodeKind2["Element"] = "UIElement";
  UIIRNodeKind2["Text"] = "UIText";
  UIIRNodeKind2["Fragment"] = "UIFragment";
  UIIRNodeKind2["ComponentInstance"] = "UIComponentInstance";
  UIIRNodeKind2["Slot"] = "UISlot";
  UIIRNodeKind2["Conditional"] = "UIConditional";
  UIIRNodeKind2["List"] = "UIList";
  UIIRNodeKind2["Event"] = "UIEvent";
  UIIRNodeKind2["Binding"] = "UIBinding";
  return UIIRNodeKind2;
})(UIIRNodeKind || {});

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
function resetCommonJSUnitCounter() {
  jsUnitCounter = 0;
}
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
function resetUIIRIdCounter() {
  idCounter2 = 0;
}
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

// packages/compiler/ui-ir/index.ts
var ui_ir_exports = {};
__export(ui_ir_exports, {
  AngularToLowering: () => AngularToLowering,
  CommonUIReconciler: () => CommonUIReconciler,
  ReactToLowering: () => ReactToLowering,
  SvelteToLowering: () => SvelteToLowering,
  UIIRFactory: () => UIIRFactory,
  UIIRNodeKind: () => UIIRNodeKind,
  UIIRSerializer: () => UIIRSerializer,
  UIIRValidator: () => UIIRValidator,
  VueToLowering: () => VueToLowering,
  getCommonJSUnitId: () => getCommonJSUnitId,
  getUIIRId: () => getUIIRId,
  resetCommonJSUnitCounter: () => resetCommonJSUnitCounter,
  resetUIIRIdCounter: () => resetUIIRIdCounter
});

// packages/compiler/ui-ir/serializer.ts
var UIIRSerializer = class {
  static toJSON(program) {
    return JSON.stringify(program, null, 2);
  }
  static fromJSON(jsonStr) {
    return JSON.parse(jsonStr);
  }
  static toSummaryString(program) {
    const lines = [
      `UIIR Program: root=${program.rootComponent}, components=${program.components.length}`
    ];
    for (const comp of program.components) {
      lines.push(`  Component: ${comp.name}`);
      lines.push(`    State: ${comp.stateDeclarations.map((s) => s.stateName).join(", ") || "none"}`);
      lines.push(
        `    Derived: ${comp.derivedDeclarations.map((d) => `${d.derivedName}:(${d.expression})`).join(", ") || "none"}`
      );
      lines.push(`    Body nodes: ${comp.body.length}`);
    }
    return lines.join("\n");
  }
};

// packages/compiler/ui-ir/validator.ts
var UIIRValidator = class {
  static validate(program) {
    const diagnostics = [];
    if (!program.components || program.components.length === 0) {
      diagnostics.push({
        severity: "error",
        message: "Program contains no component declarations"
      });
      return diagnostics;
    }
    const componentNames = /* @__PURE__ */ new Set();
    for (const comp of program.components) {
      if (componentNames.has(comp.name)) {
        diagnostics.push({
          severity: "error",
          message: `Duplicate component name: ${comp.name}`,
          componentName: comp.name
        });
      }
      componentNames.add(comp.name);
      this.validateComponent(comp, diagnostics);
    }
    if (!componentNames.has(program.rootComponent)) {
      diagnostics.push({
        severity: "error",
        message: `Root component '${program.rootComponent}' is not declared in program components`
      });
    }
    return diagnostics;
  }
  static validateComponent(comp, diagnostics) {
    const stateNames = new Set(comp.stateDeclarations.map((s) => s.stateName));
    const derivedNames = new Set(comp.derivedDeclarations.map((d) => d.derivedName));
    for (const name of stateNames) {
      if (derivedNames.has(name)) {
        diagnostics.push({
          severity: "error",
          message: `Identifier '${name}' declared as both state and derived in component '${comp.name}'`,
          componentName: comp.name
        });
      }
    }
    const derivedMap = /* @__PURE__ */ new Map();
    for (const d of comp.derivedDeclarations) {
      derivedMap.set(d.derivedName, d);
    }
    const visiting = /* @__PURE__ */ new Set();
    const visited = /* @__PURE__ */ new Set();
    const checkCycles = (name, path) => {
      if (visiting.has(name)) {
        diagnostics.push({
          severity: "error",
          message: `Circular dependency detected in derived values: ${path.join(" -> ")} -> ${name}`,
          componentName: comp.name
        });
        return true;
      }
      if (visited.has(name)) return false;
      visiting.add(name);
      const node = derivedMap.get(name);
      if (node) {
        for (const dep of node.dependencies) {
          if (derivedMap.has(dep)) {
            checkCycles(dep, [...path, name]);
          }
        }
      }
      visiting.delete(name);
      visited.add(name);
      return false;
    };
    for (const name of derivedMap.keys()) {
      checkCycles(name, []);
    }
    for (const child of comp.body) {
      this.validateNode(child, comp.name, diagnostics);
    }
  }
  static validateNode(node, componentName, diagnostics) {
    if (!node || !node.kind) {
      diagnostics.push({
        severity: "error",
        message: `Invalid node encountered in component '${componentName}'`,
        componentName
      });
      return;
    }
    switch (node.kind) {
      case "UIElement" /* Element */: {
        for (const c of node.children) {
          this.validateNode(c, componentName, diagnostics);
        }
        break;
      }
      case "UIFragment" /* Fragment */: {
        for (const c of node.children) {
          this.validateNode(c, componentName, diagnostics);
        }
        break;
      }
      case "UIConditional" /* Conditional */: {
        this.validateNode(node.thenBranch, componentName, diagnostics);
        if (node.elseBranch) {
          this.validateNode(node.elseBranch, componentName, diagnostics);
        }
        break;
      }
      case "UIList" /* List */: {
        this.validateNode(node.body, componentName, diagnostics);
        break;
      }
      default:
        break;
    }
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

// packages/compiler/interpreters/index.ts
var interpreters_exports = {};
__export(interpreters_exports, {
  AngularLM: () => angular_lm_exports,
  AngularLMInterpreter: () => AngularLMInterpreter,
  AngularReconciler: () => AngularReconciler,
  CSSLM: () => css_lm_exports,
  CSSLMInterpreter: () => CSSLMInterpreter,
  HTMLLM: () => html_lm_exports,
  HTMLLMInterpreter: () => HTMLLMInterpreter,
  JSLM: () => js_lm_exports,
  JSLMInterpreter: () => JSLMInterpreter,
  ReactLM: () => react_lm_exports,
  ReactLMInterpreter: () => ReactLMInterpreter,
  ReactReconciler: () => ReactReconciler,
  SvelteLM: () => svelte_lm_exports,
  SvelteLMInterpreter: () => SvelteLMInterpreter,
  SvelteReconciler: () => SvelteReconciler,
  TSLM: () => ts_lm_exports,
  TSLMInterpreter: () => TSLMInterpreter,
  VueLM: () => vue_lm_exports,
  VueLMInterpreter: () => VueLMInterpreter,
  VueReconciler: () => VueReconciler
});

// packages/compiler/interpreters/html-lm/index.ts
var html_lm_exports = {};
__export(html_lm_exports, {
  HTMLLMError: () => HTMLLMError,
  HTMLLMInterpreter: () => HTMLLMInterpreter,
  HTMLLMTokenType: () => HTMLLMTokenType,
  KNOWN_ATTRIBUTE_ABBREVIATIONS: () => KNOWN_ATTRIBUTE_ABBREVIATIONS,
  KNOWN_ELEMENT_ABBREVIATIONS: () => KNOWN_ELEMENT_ABBREVIATIONS,
  KNOWN_HTML_ATTRIBUTES: () => KNOWN_HTML_ATTRIBUTES,
  KNOWN_HTML_TAGS: () => KNOWN_HTML_TAGS,
  TAG_TO_AST_KIND: () => TAG_TO_AST_KIND,
  expandAttributeAbbreviation: () => expandAttributeAbbreviation,
  expandElementAbbreviation: () => expandElementAbbreviation,
  getASTKindForTag: () => getASTKindForTag,
  isAttributeCommand: () => isAttributeCommand,
  isKnownAttributeAbbreviation: () => isKnownAttributeAbbreviation,
  isKnownElementAbbreviation: () => isKnownElementAbbreviation,
  resolveAttributeName: () => resolveAttributeName,
  resolveElementTag: () => resolveElementTag
});

// packages/compiler/interpreters/html-lm/errors.ts
var HTMLLMError = class extends Error {
  constructor(message, location) {
    super(message);
    this.name = "HTMLLMError";
    this.location = location;
  }
};

// packages/compiler/interpreters/html-lm/types.ts
var HTMLLMTokenType = /* @__PURE__ */ ((HTMLLMTokenType2) => {
  HTMLLMTokenType2["IDENTIFIER"] = "IDENTIFIER";
  HTMLLMTokenType2["OPEN_PAREN"] = "OPEN_PAREN";
  HTMLLMTokenType2["CLOSE_PAREN"] = "CLOSE_PAREN";
  HTMLLMTokenType2["TEXT"] = "TEXT";
  HTMLLMTokenType2["WHITESPACE"] = "WHITESPACE";
  HTMLLMTokenType2["EOF"] = "EOF";
  return HTMLLMTokenType2;
})(HTMLLMTokenType || {});

// packages/compiler/interpreters/css-lm/index.ts
var css_lm_exports = {};
__export(css_lm_exports, {
  CANONICAL_TO_LM_CSS_PROPERTY: () => CANONICAL_TO_LM_CSS_PROPERTY,
  CSSLMInterpreter: () => CSSLMInterpreter,
  CSSNodeKind: () => CSSNodeKind,
  CSS_PROPERTY_ABBREVIATIONS: () => CSS_PROPERTY_ABBREVIATIONS,
  decodeCSSProperty: () => decodeCSSProperty,
  encodeCSSProperty: () => encodeCSSProperty,
  getCSSDeclarationId: () => getCSSDeclarationId,
  getCSSKeyframeBlockId: () => getCSSKeyframeBlockId,
  getCSSKeyframesId: () => getCSSKeyframesId,
  getCSSMediaRuleId: () => getCSSMediaRuleId,
  getCSSRuleId: () => getCSSRuleId,
  serializeCSSDeclaration: () => serializeCSSDeclaration,
  serializeCSSKeyframeBlock: () => serializeCSSKeyframeBlock,
  serializeCSSKeyframesRule: () => serializeCSSKeyframesRule,
  serializeCSSMediaRule: () => serializeCSSMediaRule,
  serializeCSSRule: () => serializeCSSRule,
  serializeCSSStyleSheet: () => serializeCSSStyleSheet,
  validateCSSAST: () => validateCSSAST
});

// packages/compiler/interpreters/css-lm/serializer.ts
function serializeCSSDeclaration(decl, options = {}) {
  const importantStr = decl.important ? " !important" : "";
  const sep = options.minify ? ":" : ": ";
  return `${decl.property}${sep}${decl.value}${importantStr};`;
}
function serializeCSSRule(rule, options = {}, indentLevel = 0) {
  const minify = !!options.minify;
  const indent = minify ? "" : (options.indent || "  ").repeat(indentLevel);
  const innerIndent = minify ? "" : (options.indent || "  ").repeat(indentLevel + 1);
  const newline = minify ? "" : "\n";
  const space = minify ? "" : " ";
  const decls = rule.declarations.map((d) => `${innerIndent}${serializeCSSDeclaration(d, options)}`).join(newline);
  if (minify) {
    return `${rule.selector}{${decls}}`;
  }
  if (rule.declarations.length === 0) {
    return `${indent}${rule.selector} {}`;
  }
  return `${indent}${rule.selector}${space}{${newline}${decls}${newline}${indent}}`;
}
function serializeCSSKeyframeBlock(block, options = {}, indentLevel = 1) {
  const minify = !!options.minify;
  const indent = minify ? "" : (options.indent || "  ").repeat(indentLevel);
  const innerIndent = minify ? "" : (options.indent || "  ").repeat(indentLevel + 1);
  const newline = minify ? "" : "\n";
  const space = minify ? "" : " ";
  const decls = block.declarations.map((d) => `${innerIndent}${serializeCSSDeclaration(d, options)}`).join(newline);
  if (minify) {
    return `${block.keyframeSelector}{${decls}}`;
  }
  return `${indent}${block.keyframeSelector}${space}{${newline}${decls}${newline}${indent}}`;
}
function serializeCSSKeyframesRule(kf, options = {}, indentLevel = 0) {
  const minify = !!options.minify;
  const indent = minify ? "" : (options.indent || "  ").repeat(indentLevel);
  const newline = minify ? "" : "\n";
  const space = minify ? "" : " ";
  const blocks = kf.keyframes.map((b) => serializeCSSKeyframeBlock(b, options, indentLevel + 1)).join(newline);
  if (minify) {
    return `@keyframes ${kf.name}{${blocks}}`;
  }
  return `${indent}@keyframes ${kf.name}${space}{${newline}${blocks}${newline}${indent}}`;
}
function serializeCSSMediaRule(media, options = {}, indentLevel = 0) {
  const minify = !!options.minify;
  const indent = minify ? "" : (options.indent || "  ").repeat(indentLevel);
  const newline = minify ? "" : "\n";
  const space = minify ? "" : " ";
  const formattedQuery = media.query.includes(":") && !media.query.startsWith("(") && !media.query.includes("screen") && !media.query.includes("print") && !media.query.includes("only") && !media.query.includes("and") ? `(${media.query})` : media.query;
  const innerRules = media.rules.map((r) => serializeCSSRule(r, options, indentLevel + 1)).join(newline + (minify ? "" : "\n"));
  if (minify) {
    return `@media ${formattedQuery}{${innerRules}}`;
  }
  return `${indent}@media ${formattedQuery}${space}{${newline}${innerRules}${newline}${indent}}`;
}
function serializeCSSStyleSheet(sheet, options = {}) {
  const minify = !!options.minify;
  const separator = minify ? "" : "\n\n";
  const serializedRules = sheet.rules.map((item) => {
    switch (item.kind) {
      case "CSSRule":
        return serializeCSSRule(item, options);
      case "CSSMediaRule":
        return serializeCSSMediaRule(item, options);
      case "CSSKeyframesRule":
        return serializeCSSKeyframesRule(item, options);
      default:
        return "";
    }
  }).filter(Boolean);
  return serializedRules.join(separator);
}

// packages/compiler/interpreters/css-lm/validator.ts
function validateCSSAST(sheet) {
  const diagnostics = [];
  let totalRules = 0;
  let totalDeclarations = 0;
  for (const item of sheet.rules) {
    if (item.kind === "CSSRule") {
      totalRules++;
      const rule = item;
      if (!rule.selector || rule.selector.trim().length === 0) {
        diagnostics.push({
          message: "CSS Rule missing selector",
          severity: "error",
          location: rule.sourceLocation || { startLine: 1, startColumn: 1, startOffset: 0, endLine: 1, endColumn: 1, endOffset: 0 }
        });
      }
      for (const decl of rule.declarations) {
        totalDeclarations++;
        if (!decl.property || decl.property.trim().length === 0) {
          diagnostics.push({
            message: "CSS Declaration missing property name",
            severity: "error",
            location: decl.sourceLocation || { startLine: 1, startColumn: 1, startOffset: 0, endLine: 1, endColumn: 1, endOffset: 0 }
          });
        }
        if (decl.value === void 0 || decl.value === null) {
          diagnostics.push({
            message: `CSS Declaration "${decl.property}" missing value`,
            severity: "error",
            location: decl.sourceLocation || { startLine: 1, startColumn: 1, startOffset: 0, endLine: 1, endColumn: 1, endOffset: 0 }
          });
        }
      }
    }
  }
  const hasErrors = diagnostics.some((d) => d.severity === "error");
  return {
    isValid: !hasErrors,
    isIncomplete: false,
    diagnostics,
    totalRules,
    totalDeclarations
  };
}

// packages/compiler/interpreters/js-lm/index.ts
var js_lm_exports = {};
__export(js_lm_exports, {
  JSLMInterpreter: () => JSLMInterpreter,
  JSNodeKind: () => JSNodeKind,
  JS_DOM_ABBREVIATIONS: () => JS_DOM_ABBREVIATIONS,
  JS_KEYWORD_ABBREVIATIONS: () => JS_KEYWORD_ABBREVIATIONS,
  SUPPORTED_EVENTS: () => SUPPORTED_EVENTS,
  decodeJSAbbreviation: () => decodeJSAbbreviation,
  encodeJSAbbreviation: () => encodeJSAbbreviation,
  getJSDOMOperationId: () => getJSDOMOperationId,
  getJSEventHandlerId: () => getJSEventHandlerId,
  getJSNodeId: () => getJSNodeId,
  getJSProgramId: () => getJSProgramId,
  getJSTimerId: () => getJSTimerId,
  getJSUnitId: () => getJSUnitId,
  isValidDOMEvent: () => isValidDOMEvent2,
  serializeJSProgram: () => serializeJSProgram,
  serializeJSUnit: () => serializeJSUnit,
  validateJSAST: () => validateJSAST
});

// packages/compiler/interpreters/js-lm/vocabulary.ts
var JS_KEYWORD_ABBREVIATIONS = {
  c: "const",
  l: "let",
  v: "var",
  fn: "function",
  ret: "return",
  evt: "event",
  cel: "document.createElement"
};
var JS_DOM_ABBREVIATIONS = {
  // Selectors
  qs: "document.querySelector",
  qsa: "document.querySelectorAll",
  gid: "document.getElementById",
  // Event Listeners
  on: "event",
  evt: "event",
  off: "removeEventListener",
  // Timers
  st: "setTimeout",
  si: "setInterval",
  ct: "clearTimeout",
  ci: "clearInterval",
  // DOM Mutations
  setText: "setText",
  setHTML: "setHTML",
  setAttr: "setAttribute",
  removeAttr: "removeAttribute",
  addClass: "classList.add",
  removeClass: "classList.remove",
  toggleClass: "classList.toggle",
  append: "appendChild",
  remove: "remove",
  createEl: "document.createElement",
  cel: "document.createElement"
};
var SUPPORTED_EVENTS = /* @__PURE__ */ new Set([
  "click",
  "dblclick",
  "input",
  "change",
  "submit",
  "reset",
  "focus",
  "blur",
  "keydown",
  "keyup",
  "keypress",
  "mouseenter",
  "mouseleave",
  "mouseover",
  "mouseout",
  "mousedown",
  "mouseup",
  "mousemove",
  "touchstart",
  "touchend",
  "touchmove",
  "scroll",
  "resize",
  "load",
  "unload"
]);
function decodeJSAbbreviation(abbr) {
  const trimmed = abbr.trim();
  if (JS_DOM_ABBREVIATIONS[trimmed]) return JS_DOM_ABBREVIATIONS[trimmed];
  if (JS_KEYWORD_ABBREVIATIONS[trimmed]) return JS_KEYWORD_ABBREVIATIONS[trimmed];
  return trimmed;
}
function encodeJSAbbreviation(fullName) {
  const trimmed = fullName.trim();
  for (const [abbr, name] of Object.entries(JS_DOM_ABBREVIATIONS)) {
    if (name === trimmed) return abbr;
  }
  for (const [abbr, name] of Object.entries(JS_KEYWORD_ABBREVIATIONS)) {
    if (name === trimmed) return abbr;
  }
  return trimmed;
}
function isValidDOMEvent2(eventName) {
  return SUPPORTED_EVENTS.has(eventName.toLowerCase().replace(/^on/, ""));
}

// packages/compiler/interpreters/js-lm/serializer.ts
function serializeJSUnit(unit) {
  if (unit.details) {
    switch (unit.details.kind) {
      case "JSEventHandler" /* EventHandler */: {
        const evt = unit.details;
        return `window.__leveonas_runtime__.on(${JSON.stringify(evt.eventName)}, ${JSON.stringify(evt.targetSelector)}, ${evt.handlerCode});`;
      }
      case "JSTimer" /* Timer */: {
        const t = unit.details;
        if (t.timerType === "clearTimeout" || t.timerType === "clearInterval") {
          return `window.__leveonas_runtime__.${t.timerType}(${t.timerIdRef || ""});`;
        }
        return `window.__leveonas_runtime__.${t.timerType}(${t.callbackCode}, ${t.delayMs || 0});`;
      }
      case "JSDOMOperation" /* DOMOperation */: {
        const dom = unit.details;
        const argsStr = dom.args.length > 0 ? `, ${dom.args.join(", ")}` : "";
        return `window.__leveonas_runtime__.${dom.operation}(${JSON.stringify(dom.targetSelector)}${argsStr});`;
      }
    }
  }
  return unit.code;
}
function serializeJSProgram(program, options = {}) {
  const lines = [];
  for (const unit of program.units) {
    if (!unit.isComplete) continue;
    const code = serializeJSUnit(unit);
    if (code && code.trim()) {
      lines.push(code.trim());
    }
  }
  const body = lines.join("\n\n");
  if (options.wrapInIIFE) {
    return `(function() {
  'use strict';
${lines.map((l) => "  " + l).join("\n")}
})();`;
  }
  return body;
}

// packages/compiler/interpreters/js-lm/validator.ts
function validateJSAST(program) {
  const diagnostics = [];
  if (!program || program.kind !== "JSProgram" /* Program */) {
    diagnostics.push({
      message: "Invalid AST: Root must be a JSProgramNode",
      severity: "error",
      code: "INVALID_ROOT",
      sourceLocation: program?.sourceLocation || {
        startLine: 1,
        startColumn: 1,
        startOffset: 0,
        endLine: 1,
        endColumn: 1,
        endOffset: 0
      }
    });
    return diagnostics;
  }
  const seenIds = /* @__PURE__ */ new Set();
  for (let i = 0; i < program.units.length; i++) {
    const unit = program.units[i];
    if (!unit.id) {
      diagnostics.push({
        message: `JSUnit at index ${i} is missing a deterministic ID`,
        severity: "error",
        code: "MISSING_UNIT_ID",
        sourceLocation: unit.sourceLocation || program.sourceLocation || {
          startLine: 1,
          startColumn: 1,
          startOffset: 0,
          endLine: 1,
          endColumn: 1,
          endOffset: 0
        }
      });
    } else if (seenIds.has(unit.id)) {
      diagnostics.push({
        message: `Duplicate JSUnit ID detected: ${unit.id}`,
        severity: "warning",
        code: "DUPLICATE_UNIT_ID",
        sourceLocation: unit.sourceLocation || program.sourceLocation || {
          startLine: 1,
          startColumn: 1,
          startOffset: 0,
          endLine: 1,
          endColumn: 1,
          endOffset: 0
        }
      });
    } else {
      seenIds.add(unit.id);
    }
  }
  return diagnostics;
}

// packages/compiler/interpreters/ts-lm/index.ts
var ts_lm_exports = {};
__export(ts_lm_exports, {
  KNOWN_DOM_EVENTS: () => KNOWN_DOM_EVENTS,
  TSLMInterpreter: () => TSLMInterpreter,
  TSLMSerializer: () => TSLMSerializer,
  TSNodeKind: () => TSNodeKind,
  TS_DOM_ABBREVIATIONS: () => TS_DOM_ABBREVIATIONS,
  TS_KEYWORD_ABBREVIATIONS: () => TS_KEYWORD_ABBREVIATIONS,
  TS_TYPE_ABBREVIATIONS: () => TS_TYPE_ABBREVIATIONS,
  convertTSProgramToJSProgram: () => convertTSProgramToJSProgram,
  convertTSToJSUnit: () => convertTSToJSUnit,
  decodeTSLM: () => decodeTSLM,
  expandTSTypeAbbreviation: () => expandTSTypeAbbreviation,
  getTSEventHandlerId: () => getTSEventHandlerId,
  getTSProgramId: () => getTSProgramId,
  getTSTimerId: () => getTSTimerId,
  getTSUnitId: () => getTSUnitId,
  isValidDOMEvent: () => isValidDOMEvent,
  lowerTSToJS: () => lowerTSToJS,
  lowerTSUnit: () => lowerTSUnit,
  validateTSCode: () => validateTSCode,
  validateTSProgram: () => validateTSProgram
});

// packages/compiler/interpreters/ts-lm/validator.ts
var tsCompiler2 = null;
try {
  tsCompiler2 = __require("typescript");
} catch {
}
function validateTSCode(code, isFinal = false) {
  const trimmed = code.trim();
  if (!trimmed) {
    return { isValid: true, isIncomplete: false, diagnostics: [] };
  }
  if (tsCompiler2 && typeof tsCompiler2.createSourceFile === "function") {
    const sourceFile = tsCompiler2.createSourceFile(
      "stream.ts",
      trimmed,
      tsCompiler2.ScriptTarget?.Latest ?? 99,
      true,
      tsCompiler2.ScriptKind?.TS ?? 3
    );
    const parseDiagnostics = sourceFile.parseDiagnostics || [];
    const diagnostics = [];
    let isIncomplete2 = false;
    for (const diag of parseDiagnostics) {
      const message = tsCompiler2.flattenDiagnosticMessageText ? tsCompiler2.flattenDiagnosticMessageText(diag.messageText, "\n") : String(diag.messageText);
      const isEofRelated = message.includes("expected") || message.includes("Unterminated") || message.includes("Unexpected end of text") || diag.code === 1005 || // '{' or '}' or ';' expected
      diag.code === 1109 || // Expression expected
      diag.code === 1128;
      if (!isFinal && isEofRelated) {
        isIncomplete2 = true;
        continue;
      }
      const { line, character } = sourceFile.getLineAndCharacterOfPosition(diag.start || 0);
      diagnostics.push({
        message,
        severity: diag.category === (tsCompiler2.DiagnosticCategory?.Error ?? 1) ? "error" : "warning",
        code: `TS${diag.code}`,
        sourceLocation: {
          startLine: line + 1,
          startColumn: character + 1,
          startOffset: diag.start || 0,
          endLine: line + 1,
          endColumn: character + (diag.length || 1) + 1,
          endOffset: (diag.start || 0) + (diag.length || 1)
        }
      });
    }
    const hasFatalErrors = diagnostics.some((d) => d.severity === "error");
    return {
      isValid: !hasFatalErrors,
      isIncomplete: isIncomplete2,
      diagnostics
    };
  }
  const openBraces = (trimmed.match(/\{/g) || []).length;
  const closeBraces = (trimmed.match(/\}/g) || []).length;
  const openParens = (trimmed.match(/\(/g) || []).length;
  const closeParens = (trimmed.match(/\)/g) || []).length;
  const isIncomplete = openBraces > closeBraces || openParens > closeParens;
  return {
    isValid: true,
    isIncomplete: !isFinal && isIncomplete,
    diagnostics: []
  };
}
function validateTSProgram(program, isFinal = false) {
  const allDiagnostics = [];
  let isIncomplete = false;
  for (const unit of program.units) {
    const res = validateTSCode(unit.code, isFinal && unit.isComplete);
    if (res.isIncomplete) {
      isIncomplete = true;
    }
    allDiagnostics.push(...res.diagnostics);
  }
  return {
    isValid: !allDiagnostics.some((d) => d.severity === "error"),
    isIncomplete,
    diagnostics: allDiagnostics
  };
}

// packages/compiler/interpreters/ts-lm/serializer.ts
var TSLMSerializer = class {
  /**
   * Converts a TSProgramNode to a compact JSON string representation.
   */
  static toJSON(program) {
    return JSON.stringify(program);
  }
  /**
   * Parses a JSON string back into a TSProgramNode.
   */
  static fromJSON(json) {
    return JSON.parse(json);
  }
  /**
   * Formats a TSProgramNode into a human-readable debug summary.
   */
  static toDebugString(program) {
    const lines = [`TSProgram (${program.units.length} units):`];
    for (let i = 0; i < program.units.length; i++) {
      const u = program.units[i];
      const status = u.isComplete ? "COMPLETE" : "INCOMPLETE";
      lines.push(
        `  [${i}] ${u.classification} ${u.unitKind} (${u.id}) [${status}]`
      );
      lines.push(`      TS: ${u.code.replace(/\n/g, " ")}`);
      if (u.loweredCode) {
        lines.push(`      JS: ${u.loweredCode.replace(/\n/g, " ")}`);
      }
    }
    return lines.join("\n");
  }
};

// packages/compiler/interpreters/react-lm/index.ts
var react_lm_exports = {};
__export(react_lm_exports, {
  KNOWN_REACT_EVENTS: () => KNOWN_REACT_EVENTS,
  REACT_ELEMENT_ABBREVIATIONS: () => REACT_ELEMENT_ABBREVIATIONS,
  REACT_PROP_ABBREVIATIONS: () => REACT_PROP_ABBREVIATIONS,
  ReactLMInterpreter: () => ReactLMInterpreter,
  ReactLMSerializer: () => ReactLMSerializer,
  ReactLMValidator: () => ReactLMValidator,
  ReactNodeKind: () => ReactNodeKind,
  ReactReconciler: () => ReactReconciler,
  TAG_TO_AST_KIND: () => TAG_TO_AST_KIND2,
  getDOMEventNameFromReactEvent: () => getDOMEventNameFromReactEvent,
  getReactComponentDeclarationId: () => getReactComponentDeclarationId,
  getReactComponentInstanceId: () => getReactComponentInstanceId,
  getReactElementId: () => getReactElementId,
  getReactEventHandlerId: () => getReactEventHandlerId,
  getReactFragmentId: () => getReactFragmentId,
  getReactProgramId: () => getReactProgramId,
  getReactTextId: () => getReactTextId,
  isCustomComponentName: () => isCustomComponentName,
  isIntrinsicTag: () => isIntrinsicTag,
  isReactEventProp: () => isReactEventProp,
  resolveReactElementTag: () => resolveReactElementTag,
  resolveReactPropName: () => resolveReactPropName,
  validateReactProgram: () => validateReactProgram
});

// packages/compiler/interpreters/react-lm/validator.ts
function validateReactProgram(program, isFinal = false) {
  const diagnostics = [];
  if (program.components.length === 0) {
    if (isFinal) {
      diagnostics.push({
        message: "React program contains no component declarations.",
        severity: "warning",
        code: "REACT_EMPTY_PROGRAM",
        sourceLocation: {
          startLine: 1,
          startColumn: 1,
          startOffset: 0,
          endLine: 1,
          endColumn: 1,
          endOffset: 0
        }
      });
    }
  }
  const seenNames = /* @__PURE__ */ new Set();
  for (const comp of program.components) {
    if (seenNames.has(comp.name)) {
      diagnostics.push({
        message: `Duplicate component declaration '${comp.name}'.`,
        severity: "error",
        code: "REACT_DUPLICATE_COMPONENT",
        sourceLocation: comp.sourceLocation || {
          startLine: 1,
          startColumn: 1,
          startOffset: 0,
          endLine: 1,
          endColumn: 1,
          endOffset: 0
        }
      });
    }
    seenNames.add(comp.name);
  }
  const hasFatalErrors = diagnostics.some((d) => d.severity === "error");
  return {
    isValid: !hasFatalErrors,
    isIncomplete: false,
    diagnostics
  };
}
var ReactLMValidator = class {
  static validate(program, isFinal = false) {
    return validateReactProgram(program, isFinal);
  }
};

// packages/compiler/interpreters/react-lm/serializer.ts
var ReactLMSerializer = class {
  static toJSON(program) {
    return JSON.stringify(program);
  }
  static fromJSON(json) {
    return JSON.parse(json);
  }
  static toDebugString(program) {
    const lines = [`ReactProgram (${program.components.length} components):`];
    for (const comp of program.components) {
      lines.push(`  Component ${comp.name} (${comp.id}):`);
      if (comp.stateDeclarations.length > 0) {
        lines.push(
          `    States: ${comp.stateDeclarations.map((s) => `${s.stateName}=${JSON.stringify(s.initialValue)}`).join(", ")}`
        );
      }
      lines.push(`    Body elements: ${comp.body.length}`);
    }
    return lines.join("\n");
  }
};

// packages/compiler/interpreters/vue-lm/index.ts
var vue_lm_exports = {};
__export(vue_lm_exports, {
  KNOWN_VUE_EVENTS: () => KNOWN_VUE_EVENTS,
  TAG_TO_AST_KIND: () => TAG_TO_AST_KIND3,
  VUE_ELEMENT_ABBREVIATIONS: () => VUE_ELEMENT_ABBREVIATIONS,
  VUE_PROP_ABBREVIATIONS: () => VUE_PROP_ABBREVIATIONS,
  VueLMInterpreter: () => VueLMInterpreter,
  VueLMSerializer: () => VueLMSerializer,
  VueLMValidator: () => VueLMValidator,
  VueNodeKind: () => VueNodeKind,
  VueReconciler: () => VueReconciler,
  getDOMEventNameFromVueEvent: () => getDOMEventNameFromVueEvent,
  getVueComponentDeclarationId: () => getVueComponentDeclarationId,
  getVueComponentInstanceId: () => getVueComponentInstanceId,
  getVueComputedId: () => getVueComputedId,
  getVueElementId: () => getVueElementId,
  getVueEventHandlerId: () => getVueEventHandlerId,
  getVueFragmentId: () => getVueFragmentId,
  getVueProgramId: () => getVueProgramId,
  getVueSlotId: () => getVueSlotId,
  getVueStateId: () => getVueStateId,
  getVueTextId: () => getVueTextId,
  isCustomComponentName: () => isCustomComponentName2,
  isIntrinsicTag: () => isIntrinsicTag4,
  isVueEventProp: () => isVueEventProp,
  isVueModelProp: () => isVueModelProp,
  isVueShowProp: () => isVueShowProp,
  resolveVueElementTag: () => resolveVueElementTag,
  resolveVuePropName: () => resolveVuePropName
});

// packages/compiler/interpreters/vue-lm/validator.ts
var VueLMValidator = class {
  static validate(program) {
    const diagnostics = [];
    if (!program.components || program.components.length === 0) {
      diagnostics.push({
        code: "VUE_EMPTY_PROGRAM",
        message: "Vue-LM program contains no component declarations",
        severity: "warning",
        sourceLocation: program.sourceLocation || {
          startLine: 1,
          startColumn: 1,
          startOffset: 0,
          endLine: 1,
          endColumn: 1,
          endOffset: 0
        },
        suggestion: "Declare at least one component, e.g. component(App)(...)"
      });
      return diagnostics;
    }
    const seenComponents = /* @__PURE__ */ new Set();
    for (const comp of program.components) {
      if (seenComponents.has(comp.name)) {
        diagnostics.push({
          code: "VUE_DUPLICATE_COMPONENT",
          message: `Duplicate component declaration '${comp.name}'`,
          severity: "error",
          sourceLocation: comp.sourceLocation || {
            startLine: 1,
            startColumn: 1,
            startOffset: 0,
            endLine: 1,
            endColumn: 1,
            endOffset: 0
          },
          suggestion: `Rename one of the '${comp.name}' component declarations`
        });
      }
      seenComponents.add(comp.name);
      const seenState = /* @__PURE__ */ new Set();
      for (const s of comp.stateDeclarations) {
        if (seenState.has(s.stateName)) {
          diagnostics.push({
            code: "VUE_DUPLICATE_STATE",
            message: `Duplicate reactive state '${s.stateName}' in component '${comp.name}'`,
            severity: "error",
            sourceLocation: s.sourceLocation || comp.sourceLocation || {
              startLine: 1,
              startColumn: 1,
              startOffset: 0,
              endLine: 1,
              endColumn: 1,
              endOffset: 0
            }
          });
        }
        seenState.add(s.stateName);
      }
      for (const c of comp.computedDeclarations) {
        if (seenState.has(c.computedName)) {
          diagnostics.push({
            code: "VUE_STATE_COMPUTED_COLLISION",
            message: `Computed value '${c.computedName}' collides with state in component '${comp.name}'`,
            severity: "error",
            sourceLocation: c.sourceLocation || comp.sourceLocation || {
              startLine: 1,
              startColumn: 1,
              startOffset: 0,
              endLine: 1,
              endColumn: 1,
              endOffset: 0
            }
          });
        }
      }
    }
    return diagnostics;
  }
};

// packages/compiler/interpreters/vue-lm/serializer.ts
var VueLMSerializer = class {
  static toJSON(program) {
    return JSON.stringify(program, null, 2);
  }
  static fromJSON(jsonStr) {
    return JSON.parse(jsonStr);
  }
  static toCompactLM(program) {
    const lines = ["<VUE>"];
    for (const comp of program.components) {
      lines.push(
        `component(${comp.name}${comp.propsType ? `:${comp.propsType}` : ""})(`
      );
      for (const s of comp.stateDeclarations) {
        lines.push(`  state(${s.stateName}, ${JSON.stringify(s.initialValue)})`);
      }
      for (const c of comp.computedDeclarations) {
        lines.push(`  computed(${c.computedName}, ${c.expression})`);
      }
      for (const node of comp.body) {
        lines.push(`  ${this.serializeUINode(node, 1)}`);
      }
      lines.push(")");
    }
    lines.push("</VUE>");
    return lines.join("\n");
  }
  static serializeUINode(node, indentLevel) {
    if (!node) return "";
    switch (node.kind) {
      case "VueText" /* Text */: {
        const txt = node;
        return `"${txt.value}"`;
      }
      case "VueSlot" /* Slot */: {
        const slot = node;
        return `slot(${slot.name === "default" ? "" : slot.name})`;
      }
      case "VueElement" /* Element */: {
        const elem = node;
        const propStr = elem.props.map((p) => {
          if (p.isEvent) return `@${p.name}:${p.value}`;
          if (p.isModel) return `v-model:${p.value}`;
          if (typeof p.value === "string") return `${p.name}:"${p.value}"`;
          return `${p.name}:${p.value}`;
        }).join(" ");
        const childrenStr = elem.children.map((c) => this.serializeUINode(c, indentLevel + 1)).filter(Boolean).join(" ");
        const inner = [propStr, childrenStr].filter(Boolean).join(" ");
        return `${elem.tag}(${inner})`;
      }
      case "VueComponentInstance" /* ComponentInstance */: {
        const inst = node;
        const propStr = inst.props.map((p) => `${p.name}:${JSON.stringify(p.value)}`).join(" ");
        const childrenStr = inst.children.map((c) => this.serializeUINode(c, indentLevel + 1)).join(" ");
        const inner = [propStr, childrenStr].filter(Boolean).join(" ");
        return `${inst.componentName}(${inner})`;
      }
      case "VueConditional" /* Conditional */: {
        const cond = node;
        const thenStr = this.serializeUINode(cond.thenBranch, indentLevel);
        const elseStr = cond.elseBranch ? `(${this.serializeUINode(cond.elseBranch, indentLevel)})` : "";
        return `when(${cond.conditionExpr})(${thenStr})${elseStr}`;
      }
      case "VueList" /* List */: {
        const list = node;
        const keyPart = list.keyExpr ? `, ${list.keyExpr}` : "";
        const bodyStr = this.serializeUINode(list.body, indentLevel);
        return `each(${list.arrayExpr}, ${list.itemVar}${keyPart})(${bodyStr})`;
      }
      case "VueFragment" /* Fragment */: {
        const frag = node;
        const childrenStr = frag.children.map((c) => this.serializeUINode(c, indentLevel)).join(" ");
        return `frag(${childrenStr})`;
      }
      default:
        return "";
    }
  }
};

// packages/compiler/interpreters/svelte-lm/index.ts
var svelte_lm_exports = {};
__export(svelte_lm_exports, {
  KNOWN_SVELTE_EVENTS: () => KNOWN_SVELTE_EVENTS,
  SVELTE_ELEMENT_ABBREVIATIONS: () => SVELTE_ELEMENT_ABBREVIATIONS,
  SVELTE_PROP_ABBREVIATIONS: () => SVELTE_PROP_ABBREVIATIONS,
  SvelteLMInterpreter: () => SvelteLMInterpreter,
  SvelteLMSerializer: () => SvelteLMSerializer,
  SvelteLMValidator: () => SvelteLMValidator,
  SvelteNodeKind: () => SvelteNodeKind,
  SvelteReactivityGraph: () => SvelteReactivityGraph,
  SvelteReconciler: () => SvelteReconciler,
  TAG_TO_AST_KIND: () => TAG_TO_AST_KIND4,
  evaluateSvelteExpression: () => evaluateSvelteExpression,
  extractExpressionDependencies: () => extractExpressionDependencies,
  extractTemplateInterpolations: () => extractTemplateInterpolations,
  getBindingPropertyName: () => getBindingPropertyName,
  getDOMEventNameFromSvelteEvent: () => getDOMEventNameFromSvelteEvent,
  getSvelteComponentDeclarationId: () => getSvelteComponentDeclarationId,
  getSvelteComponentInstanceId: () => getSvelteComponentInstanceId,
  getSvelteElementId: () => getSvelteElementId,
  getSvelteEventHandlerId: () => getSvelteEventHandlerId,
  getSvelteFragmentId: () => getSvelteFragmentId,
  getSvelteProgramId: () => getSvelteProgramId,
  getSvelteReactiveId: () => getSvelteReactiveId,
  getSvelteSlotId: () => getSvelteSlotId,
  getSvelteStateId: () => getSvelteStateId,
  getSvelteTextId: () => getSvelteTextId,
  interpolateTemplateString: () => interpolateTemplateString,
  isCustomComponentName: () => isCustomComponentName3,
  isIntrinsicTag: () => isIntrinsicTag7,
  isSvelteBindingProp: () => isSvelteBindingProp,
  isSvelteEventProp: () => isSvelteEventProp,
  resolveSvelteElementTag: () => resolveSvelteElementTag,
  resolveSveltePropName: () => resolveSveltePropName
});

// packages/compiler/interpreters/svelte-lm/validator.ts
var SvelteLMValidator = class {
  static validate(program) {
    const diagnostics = [];
    if (!program.components || program.components.length === 0) {
      diagnostics.push({
        code: "SVELTE_EMPTY_PROGRAM",
        message: "Svelte-LM program contains no component declarations",
        severity: "warning",
        sourceLocation: program.sourceLocation || {
          startLine: 1,
          startColumn: 1,
          startOffset: 0,
          endLine: 1,
          endColumn: 1,
          endOffset: 0
        },
        suggestion: "Declare at least one component, e.g. component(App)(...)"
      });
      return diagnostics;
    }
    const seenComponents = /* @__PURE__ */ new Set();
    for (const comp of program.components) {
      if (seenComponents.has(comp.name)) {
        diagnostics.push({
          code: "SVELTE_DUPLICATE_COMPONENT",
          message: `Duplicate component declaration '${comp.name}'`,
          severity: "error",
          sourceLocation: comp.sourceLocation || {
            startLine: 1,
            startColumn: 1,
            startOffset: 0,
            endLine: 1,
            endColumn: 1,
            endOffset: 0
          },
          suggestion: `Rename one of the '${comp.name}' component declarations`
        });
      }
      seenComponents.add(comp.name);
      const seenState = /* @__PURE__ */ new Set();
      for (const s of comp.stateDeclarations) {
        if (seenState.has(s.stateName)) {
          diagnostics.push({
            code: "SVELTE_DUPLICATE_STATE",
            message: `Duplicate reactive state '${s.stateName}' in component '${comp.name}'`,
            severity: "error",
            sourceLocation: s.sourceLocation || comp.sourceLocation || {
              startLine: 1,
              startColumn: 1,
              startOffset: 0,
              endLine: 1,
              endColumn: 1,
              endOffset: 0
            }
          });
        }
        seenState.add(s.stateName);
      }
      for (const r of comp.reactiveDeclarations) {
        if (seenState.has(r.reactiveName)) {
          diagnostics.push({
            code: "SVELTE_STATE_REACTIVE_COLLISION",
            message: `Reactive declaration '${r.reactiveName}' collides with state variable in component '${comp.name}'`,
            severity: "error",
            sourceLocation: r.sourceLocation || comp.sourceLocation || {
              startLine: 1,
              startColumn: 1,
              startOffset: 0,
              endLine: 1,
              endColumn: 1,
              endOffset: 0
            }
          });
        }
      }
    }
    return diagnostics;
  }
};

// packages/compiler/interpreters/svelte-lm/serializer.ts
var SvelteLMSerializer = class {
  static toJSON(program) {
    return JSON.stringify(program, null, 2);
  }
  static fromJSON(jsonStr) {
    return JSON.parse(jsonStr);
  }
  static toCompactLM(program) {
    const lines = ["<SVELTE>"];
    for (const comp of program.components) {
      lines.push(
        `component(${comp.name}${comp.propsType ? `:${comp.propsType}` : ""})(`
      );
      for (const p of comp.propDeclarations) {
        lines.push(
          `  prop(${p.propName}${p.defaultValue !== void 0 ? `, ${JSON.stringify(p.defaultValue)}` : ""})`
        );
      }
      for (const s of comp.stateDeclarations) {
        lines.push(`  state(${s.stateName}, ${JSON.stringify(s.initialValue)})`);
      }
      for (const r of comp.reactiveDeclarations) {
        lines.push(`  reactive(${r.reactiveName}, ${r.expression})`);
      }
      for (const node of comp.body) {
        lines.push(`  ${this.serializeUINode(node, 1)}`);
      }
      lines.push(")");
    }
    lines.push("</SVELTE>");
    return lines.join("\n");
  }
  static serializeUINode(node, indentLevel) {
    if (!node) return "";
    switch (node.kind) {
      case "SvelteText" /* Text */: {
        const txt = node;
        return `"${txt.value}"`;
      }
      case "SvelteSlot" /* Slot */: {
        const slot = node;
        return `slot(${slot.name === "default" ? "" : slot.name})`;
      }
      case "SvelteElement" /* Element */: {
        const elem = node;
        const propStr = elem.props.map((p) => {
          if (p.isEvent) return `${p.name}:${p.value}`;
          if (p.isBinding) return `${p.name}:${p.value}`;
          if (typeof p.value === "string") return `${p.name}:"${p.value}"`;
          return `${p.name}:${p.value}`;
        }).join(" ");
        const childrenStr = elem.children.map((c) => this.serializeUINode(c, indentLevel + 1)).filter(Boolean).join(" ");
        const inner = [propStr, childrenStr].filter(Boolean).join(" ");
        return `${elem.tag}(${inner})`;
      }
      case "SvelteComponentInstance" /* ComponentInstance */: {
        const inst = node;
        const propStr = inst.props.map((p) => `${p.name}:${JSON.stringify(p.value)}`).join(" ");
        const childrenStr = inst.children.map((c) => this.serializeUINode(c, indentLevel + 1)).join(" ");
        const inner = [propStr, childrenStr].filter(Boolean).join(" ");
        return `${inst.componentName}(${inner})`;
      }
      case "SvelteConditional" /* Conditional */: {
        const cond = node;
        const thenStr = this.serializeUINode(cond.thenBranch, indentLevel);
        const elseStr = cond.elseBranch ? `(${this.serializeUINode(cond.elseBranch, indentLevel)})` : "";
        return `when(${cond.conditionExpr})(${thenStr})${elseStr}`;
      }
      case "SvelteEach" /* Each */: {
        const each = node;
        const bodyStr = this.serializeUINode(each.body, indentLevel);
        return `each(${each.arrayExpr}, ${each.itemVar}${each.keyExpr ? `, ${each.keyExpr}` : ""})(${bodyStr})`;
      }
      case "SvelteFragment" /* Fragment */: {
        const frag = node;
        return `frag(${frag.children.map((c) => this.serializeUINode(c, indentLevel)).join(" ")})`;
      }
      default:
        return "";
    }
  }
};

// packages/compiler/interpreters/angular-lm/index.ts
var angular_lm_exports = {};
__export(angular_lm_exports, {
  ANGULAR_ELEMENT_ABBREVIATIONS: () => ANGULAR_ELEMENT_ABBREVIATIONS,
  ANGULAR_PROP_ABBREVIATIONS: () => ANGULAR_PROP_ABBREVIATIONS,
  AngularLMInterpreter: () => AngularLMInterpreter,
  AngularLMSerializer: () => AngularLMSerializer,
  AngularLMValidator: () => AngularLMValidator,
  AngularNodeKind: () => AngularNodeKind,
  AngularReconciler: () => AngularReconciler,
  KNOWN_ANGULAR_EVENTS: () => KNOWN_ANGULAR_EVENTS,
  extractAngularInterpolations: () => extractAngularInterpolations,
  getAngularComponentDeclarationId: () => getAngularComponentDeclarationId,
  getAngularComponentInstanceId: () => getAngularComponentInstanceId,
  getAngularConditionalId: () => getAngularConditionalId,
  getAngularContentProjectionId: () => getAngularContentProjectionId,
  getAngularDerivedDeclarationId: () => getAngularDerivedDeclarationId,
  getAngularElementId: () => getAngularElementId,
  getAngularForId: () => getAngularForId,
  getAngularFragmentId: () => getAngularFragmentId,
  getAngularInputDeclarationId: () => getAngularInputDeclarationId,
  getAngularOutputDeclarationId: () => getAngularOutputDeclarationId,
  getAngularProgramId: () => getAngularProgramId,
  getAngularPropId: () => getAngularPropId,
  getAngularStateDeclarationId: () => getAngularStateDeclarationId,
  getAngularTextId: () => getAngularTextId,
  isCustomComponentName: () => isCustomComponentName4,
  isIntrinsicTag: () => isIntrinsicTag10,
  normalizeAngularInterpolation: () => normalizeAngularInterpolation,
  resetAngularIdCounter: () => resetAngularIdCounter,
  resolveAngularElementTag: () => resolveAngularElementTag
});

// packages/compiler/interpreters/angular-lm/serializer.ts
var AngularLMSerializer = class {
  static toJSON(program) {
    return JSON.stringify(program, null, 2);
  }
  static fromJSON(json) {
    return JSON.parse(json);
  }
};

// packages/compiler/interpreters/angular-lm/validator.ts
var AngularLMValidator = class {
  static validate(program) {
    const diagnostics = [];
    if (!program || program.kind !== "AngularProgram" /* Program */) {
      diagnostics.push({
        severity: "error",
        message: "Invalid AST: Root must be an AngularProgramNode"
      });
      return diagnostics;
    }
    if (!program.components || program.components.length === 0) {
      diagnostics.push({
        severity: "warning",
        message: "Angular program contains no component declarations"
      });
    }
    const componentNames = /* @__PURE__ */ new Set();
    for (const comp of program.components) {
      if (componentNames.has(comp.name)) {
        diagnostics.push({
          severity: "error",
          message: `Duplicate component declaration: "${comp.name}"`,
          sourceLocation: comp.sourceLocation
        });
      }
      componentNames.add(comp.name);
      this.validateComponent(comp, diagnostics);
    }
    return diagnostics;
  }
  static validateComponent(comp, diagnostics) {
    const stateNames = /* @__PURE__ */ new Set();
    for (const s of comp.stateDeclarations) {
      if (stateNames.has(s.stateName)) {
        diagnostics.push({
          severity: "error",
          message: `Duplicate state declaration "${s.stateName}" in component "${comp.name}"`,
          sourceLocation: s.sourceLocation
        });
      }
      stateNames.add(s.stateName);
    }
    const derivedNames = /* @__PURE__ */ new Set();
    for (const d of comp.derivedDeclarations) {
      if (derivedNames.has(d.derivedName)) {
        diagnostics.push({
          severity: "error",
          message: `Duplicate computed declaration "${d.derivedName}" in component "${comp.name}"`,
          sourceLocation: d.sourceLocation
        });
      }
      derivedNames.add(d.derivedName);
    }
    const validateNode = (node) => {
      if (!node) return;
      if (node.kind === "AngularFor" /* For */) {
        if (!node.arrayExpr) {
          diagnostics.push({
            severity: "error",
            message: `Angular @for missing array expression in component "${comp.name}"`,
            sourceLocation: node.sourceLocation
          });
        }
      }
    };
    for (const child of comp.body) {
      validateNode(child);
    }
  }
};
export {
  ast_exports as AST,
  AngularLMInterpreter,
  AngularReconciler,
  CSSLMInterpreter,
  CommonUIReconciler,
  HTMLLMInterpreter,
  interpreters_exports as Interpreters,
  JSLMInterpreter,
  lexer_exports as Lexer,
  parser_exports as Parser,
  pipeline_exports as Pipeline,
  ReactLMInterpreter,
  ReactReconciler,
  SvelteLMInterpreter,
  SvelteReconciler,
  TSLMInterpreter,
  ui_ir_exports as UIIR,
  VueLMInterpreter,
  VueReconciler
};
