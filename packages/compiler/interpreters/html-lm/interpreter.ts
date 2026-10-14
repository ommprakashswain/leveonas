import { ASTFactory } from '../../ast/factory';
import { ASTNode, ComponentNode, LiteralNode, PropertyNode, RootNode } from '../../ast/nodes';
import { ASTNodeKind, SourceLocation } from '../../ast/types';
import { AttributeFrame, ElementFrame, HTMLLMDiagnostic, HTMLLMInterpreterOptions } from './types';
import {
  getASTKindForTag,
  isAttributeCommand,
  resolveAttributeName,
  resolveElementTag,
} from './vocabulary';

export class HTMLLMInterpreter {
  private root: RootNode;
  private elementStack: ElementFrame[] = [];
  private activeAttribute: AttributeFrame | null = null;
  private pendingIdent: string = '';
  private pendingIdentStartLoc: SourceLocation | null = null;
  private currentLoc: SourceLocation;
  private diagnostics: HTMLLMDiagnostic[] = [];
  private options: HTMLLMInterpreterOptions;

  constructor(options: HTMLLMInterpreterOptions = {}) {
    this.options = options;
    this.currentLoc = {
      startLine: 1,
      startColumn: 1,
      startOffset: 0,
      endLine: 1,
      endColumn: 1,
      endOffset: 0,
    };
    this.root = ASTFactory.createComponent(ASTNodeKind.Root, { ...this.currentLoc }) as RootNode;
  }

  /**
   * Reset interpreter state for a fresh parse.
   */
  public reset(): void {
    this.currentLoc = {
      startLine: 1,
      startColumn: 1,
      startOffset: 0,
      endLine: 1,
      endColumn: 1,
      endOffset: 0,
    };
    this.root = ASTFactory.createComponent(ASTNodeKind.Root, { ...this.currentLoc }) as RootNode;
    this.elementStack = [];
    this.activeAttribute = null;
    this.pendingIdent = '';
    this.pendingIdentStartLoc = null;
    this.diagnostics = [];
  }

  /**
   * Return the canonical AST RootNode.
   */
  public getAST(): RootNode {
    return this.root;
  }

  /**
   * Return diagnostics collected during parsing.
   */
  public getDiagnostics(): HTMLLMDiagnostic[] {
    return [...this.diagnostics];
  }

  public hasErrors(): boolean {
    return this.diagnostics.some(d => d.severity === 'error');
  }

  public hasPendingTokens(): boolean {
    return this.pendingIdent.length > 0 || this.activeAttribute !== null;
  }

  public getElementStackDepth(): number {
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
  public isSafeToExpose(): boolean {
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
  public write(chunk: string): this {
    for (let i = 0; i < chunk.length; i++) {
      const char = chunk[i];
      this.consumeChar(char);
    }
    return this;
  }

  /**
   * Finalize the stream and flush any pending partial constructs.
   */
  public end(): RootNode {
    // Flush pending identifier if stream ended mid-word
    if (this.pendingIdent.length > 0) {
      if (this.activeAttribute) {
        this.activeAttribute.valueBuffer += this.pendingIdent;
      } else if (this.elementStack.length > 0) {
        const current = this.getCurrentElement();
        current.textBuffer += this.pendingIdent;
      }
      this.pendingIdent = '';
      this.pendingIdentStartLoc = null;
    }

    // Flush active attribute if stream ended before closing parenthesis
    if (this.activeAttribute) {
      const attr = this.activeAttribute;
      this.activeAttribute = null;

      let rawValue = attr.valueBuffer.trim();
      let parsedValue: string | boolean = rawValue;

      if (
        (rawValue.startsWith('"') && rawValue.endsWith('"') && rawValue.length >= 2) ||
        (rawValue.startsWith("'") && rawValue.endsWith("'") && rawValue.length >= 2)
      ) {
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
        propNode.parent = currentElem.node as unknown as ASTNode;
        currentElem.node.properties.push(propNode);
      }

      this.reportDiagnostic(
        `UNCLOSED_ATTRIBUTE: Attribute '${attr.name}' is unclosed`,
        attr.location,
        'error'
      );
    }

    // Flush any pending text buffers in open elements
    for (let i = this.elementStack.length - 1; i >= 0; i--) {
      const frame = this.elementStack[i];
      if (frame.textBuffer.length > 0) {
        this.flushTextBuffer(frame);
      }
    }

    // Report diagnostics for unclosed elements
    if (this.elementStack.length > 0) {
      for (const frame of this.elementStack) {
        this.reportDiagnostic(
          `UNCLOSED_ELEMENT: Element '${frame.customName || frame.tagName}' is unclosed`,
          frame.location,
          'error'
        );
      }
    }

    return this.root;
  }

  /**
   * Parse a complete HTML-LM source string.
   */
  public static parse(source: string, options?: HTMLLMInterpreterOptions): RootNode {
    const interpreter = new HTMLLMInterpreter(options);
    interpreter.write(source);
    return interpreter.end();
  }

  private consumeChar(char: string): void {
    const charLoc: SourceLocation = {
      startLine: this.currentLoc.endLine,
      startColumn: this.currentLoc.endColumn,
      startOffset: this.currentLoc.endOffset,
      endLine: this.currentLoc.endLine,
      endColumn: this.currentLoc.endColumn + 1,
      endOffset: this.currentLoc.endOffset + 1,
    };

    if (char === '\n') {
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

  private handleAttributeChar(char: string, loc: SourceLocation): void {
    const attr = this.activeAttribute!;

    if (char === '(') {
      attr.parenDepth++;
      attr.valueBuffer += char;
    } else if (char === ')') {
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

  private closeAttribute(): void {
    if (!this.activeAttribute) return;

    const attr = this.activeAttribute;
    this.activeAttribute = null;

    let rawValue = attr.valueBuffer.trim();
    let parsedValue: string | boolean = rawValue;

    // Handle quoted values: "value" or 'value'
    if (
      (rawValue.startsWith('"') && rawValue.endsWith('"') && rawValue.length >= 2) ||
      (rawValue.startsWith("'") && rawValue.endsWith("'") && rawValue.length >= 2)
    ) {
      parsedValue = rawValue.slice(1, -1);
    } else if (rawValue.length === 0) {
      // Empty attribute command like disabled() represents boolean true
      parsedValue = true;
      rawValue = 'true';
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
      propNode.parent = currentElem.node as unknown as ASTNode;
      currentElem.node.properties.push(propNode);
    }
  }

  private handleGeneralChar(char: string, loc: SourceLocation): void {
    if (char === '(') {
      if (this.pendingIdent.length > 0) {
        const ident = this.pendingIdent;
        const identLoc = this.pendingIdentStartLoc || loc;
        this.pendingIdent = '';
        this.pendingIdentStartLoc = null;

        if (this.elementStack.length > 0 && isAttributeCommand(ident)) {
          // Open an attribute on the current element
          this.activeAttribute = {
            name: resolveAttributeName(ident),
            rawName: ident,
            valueBuffer: '',
            parenDepth: 1,
            location: identLoc,
          };
        } else {
          // Open a child element
          this.openElement(ident, identLoc);
        }
      } else {
        // Stray '(' in text content
        if (this.elementStack.length > 0) {
          this.getCurrentElement().textBuffer += char;
        }
      }
    } else if (char === ')') {
      if (this.pendingIdent.length > 0) {
        if (this.elementStack.length > 0) {
          this.getCurrentElement().textBuffer += this.pendingIdent;
        }
        this.pendingIdent = '';
        this.pendingIdentStartLoc = null;
      }

      if (this.elementStack.length > 0) {
        this.closeElement();
      } else {
        this.reportDiagnostic('Unmatched closing parenthesis at root', loc, 'warning');
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
            current.textBuffer += this.pendingIdent + ' ';
          }
        }
        this.pendingIdent = '';
        this.pendingIdentStartLoc = null;
      } else if (this.elementStack.length > 0) {
        const current = this.getCurrentElement();
        // Only append whitespace if textBuffer already has content
        if (current.textBuffer.length > 0) {
          current.textBuffer += char;
        }
      }
    } else {
      // Non-identifier symbol, punctuation, unicode, emoji, etc.
      if (this.pendingIdent.length > 0) {
        if (this.elementStack.length > 0) {
          this.getCurrentElement().textBuffer += this.pendingIdent;
        }
        this.pendingIdent = '';
        this.pendingIdentStartLoc = null;
      }

      if (this.elementStack.length > 0) {
        this.getCurrentElement().textBuffer += char;
      }
    }
  }

  private openElement(ident: string, loc: SourceLocation): void {
    // Flush any pending text on parent element before entering child
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
      elemNode.parent = parentNode as unknown as ASTNode;
      parentNode.children.push(elemNode as unknown as ASTNode);
    } else {
      elemNode.parent = this.root as unknown as ASTNode;
      this.root.children.push(elemNode as unknown as ASTNode);
    }

    this.elementStack.push({
      kind,
      tagName: canonicalTag,
      customName,
      node: elemNode,
      textBuffer: '',
      hasChildElements: false,
      location: loc,
    });
  }

  private closeElement(): void {
    const frame = this.elementStack.pop();
    if (!frame) return;

    if (frame.textBuffer.length > 0) {
      this.flushTextBuffer(frame);
    }
  }

  private flushTextBuffer(frame: ElementFrame): void {
    const rawText = frame.textBuffer;
    frame.textBuffer = '';

    // If frame has child elements and text is only whitespace, ignore formatting whitespace
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
      litNode.parent = frame.node as unknown as ASTNode;
      frame.node.children.push(litNode as unknown as ASTNode);
    }
  }

  private getCurrentElement(): ElementFrame {
    return this.elementStack[this.elementStack.length - 1];
  }

  private isIdentifierChar(char: string): boolean {
    const code = char.charCodeAt(0);
    return (
      (code >= 65 && code <= 90) || // A-Z
      (code >= 97 && code <= 122) || // a-z
      (code >= 48 && code <= 57) || // 0-9
      char === '_' ||
      char === '-'
    );
  }

  private isWhitespaceChar(char: string): boolean {
    return char === ' ' || char === '\t' || char === '\n' || char === '\r';
  }

  private reportDiagnostic(
    message: string,
    location: SourceLocation,
    severity: 'error' | 'warning' | 'info' = 'error'
  ): void {
    const diag: HTMLLMDiagnostic = { message, location, severity };
    this.diagnostics.push(diag);
    if (this.options.onError) {
      this.options.onError(diag);
    }
  }
}
