import { LexicalToken, LexicalTokenType } from '../lexer';
import { Diagnostic, DiagnosticCode, DiagnosticSeverity, createDiagnostic } from './diagnostics';
import { 
  ASTNode, 
  ComponentNode, 
  PropertyNode, 
  LiteralNode,
  SourceLocation 
} from './nodes';
import { 
  createComponentNode, 
  createPropertyNode, 
  createLiteralNode, 
  createSourceLocation 
} from './builder';
import { isLiteral } from './grammar';

export class Parser {
  private tokens: LexicalToken[];
  private current = 0;
  private diagnostics: Diagnostic[] = [];

  constructor(tokens: LexicalToken[]) {
    this.tokens = tokens;
  }

  public getDiagnostics(): Diagnostic[] {
    return this.diagnostics;
  }

  public parse(): ComponentNode[] {
    const rootNodes: ComponentNode[] = [];
    
    while (!this.isAtEnd()) {
      const node = this.parseComponent(null);
      if (node) {
        rootNodes.push(node);
      } else {
        // Recover from unknown token at root
        const token = this.peek();
        this.reportError(DiagnosticCode.UnexpectedToken, `Unexpected token: ${token.value}`, token);
        this.advance();
      }
    }
    
    return rootNodes;
  }

  private isAtEnd(): boolean {
    return this.peek().type === LexicalTokenType.EOF;
  }

  private peek(): LexicalToken {
    return this.tokens[this.current];
  }

  private previous(): LexicalToken {
    return this.tokens[this.current - 1];
  }

  private advance(): LexicalToken {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private check(type: LexicalTokenType, value?: string): boolean {
    if (this.isAtEnd()) return false;
    const token = this.peek();
    if (token.type !== type) return false;
    if (value !== undefined && token.value !== value) return false;
    return true;
  }

  private match(type: LexicalTokenType, value?: string): boolean {
    if (this.check(type, value)) {
      this.advance();
      return true;
    }
    return false;
  }

  private consume(type: LexicalTokenType, message: string, code: DiagnosticCode, value?: string): LexicalToken | null {
    if (this.check(type, value)) {
      return this.advance();
    }
    const token = this.peek();
    this.reportError(code, message, token);
    return null;
  }

  private reportError(code: DiagnosticCode, message: string, token: LexicalToken) {
    this.diagnostics.push(createDiagnostic(
      code, message, DiagnosticSeverity.Error, token.line, token.column, token.offset
    ));
  }

  private parseComponent(parent: ComponentNode | null): ComponentNode | null {
    if (this.check(LexicalTokenType.Component) || this.check(LexicalTokenType.Identifier)) {
      const token = this.advance();
      const componentName = token.value;
      
      const startLoc = { line: token.line, column: token.column, offset: token.offset };
      
      const properties: PropertyNode[] = [];
      const children: ASTNode[] = [];
      
      // Parse Properties e.g. [pad:xl, center]
      if (this.match(LexicalTokenType.Punctuation, '[')) {
        while (!this.check(LexicalTokenType.Punctuation, ']') && !this.isAtEnd()) {
          const prop = this.parseProperty();
          if (prop) properties.push(prop);
          
          if (!this.match(LexicalTokenType.Punctuation, ',')) {
            break;
          }
        }
        
        this.consume(LexicalTokenType.Punctuation, 'Expected "]" after properties.', DiagnosticCode.MissingClosingBracket, ']');
      }
      
      // Parse direct Text content like HeroTitle "Text"
      if (this.check(LexicalTokenType.StringLiteral)) {
        const strToken = this.advance();
        const literal = createLiteralNode(
          strToken.value,
          strToken.originalToken.value,
          createSourceLocation(strToken.line, strToken.column, strToken.offset, strToken.line, strToken.column + strToken.originalToken.value.length + 2, strToken.offset + strToken.originalToken.value.length + 2)
        );
        // Map as a Text Component internally if needed, but LM allows strings as text nodes
        const textComp = createComponentNode('Text', literal.sourceLocation, null, [], [literal]);
        children.push(textComp);
      }
      // Parse block Children { ... }
      else if (this.match(LexicalTokenType.Punctuation, '{')) {
        while (!this.check(LexicalTokenType.Punctuation, '}') && !this.isAtEnd()) {
          // If we see a string literal inside children, treat it as an implicit text node
          if (this.check(LexicalTokenType.StringLiteral)) {
            const strToken = this.advance();
            const literal = createLiteralNode(strToken.value, strToken.originalToken.value, 
               createSourceLocation(strToken.line, strToken.column, strToken.offset, strToken.line, strToken.column + strToken.value.length + 2, strToken.offset + strToken.value.length + 2)
            );
            const textComp = createComponentNode('Text', literal.sourceLocation, null, [], [literal]);
            children.push(textComp);
          } else {
            const child = this.parseComponent(null); // Parent set later
            if (child) {
              children.push(child);
            } else {
              // skip bad token
              this.advance();
            }
          }
        }
        
        this.consume(LexicalTokenType.Punctuation, 'Expected "}" after component children.', DiagnosticCode.MissingClosingBrace, '}');
      }

      const endToken = this.previous();
      const endOffset = endToken.offset + (endToken.originalToken.value ? endToken.originalToken.value.length : 1);
      
      const loc = createSourceLocation(
        startLoc.line, startLoc.column, startLoc.offset,
        endToken.line, endToken.column, endOffset
      );
      
      const component = createComponentNode(componentName, loc, parent, properties, children);
      
      // set parents
      for (const child of children) {
        if ('parent' in child) {
          (child as any).parent = component;
        }
      }
      
      return component;
    }
    
    return null;
  }

  private parseProperty(): PropertyNode | null {
    if (this.check(LexicalTokenType.Property) || this.check(LexicalTokenType.Identifier) || this.check(LexicalTokenType.Enum)) {
      const nameToken = this.advance();
      const name = nameToken.value;
      const startLoc = { line: nameToken.line, column: nameToken.column, offset: nameToken.offset };
      
      let literal: LiteralNode | null = null;
      let endToken = nameToken;
      
      if (this.match(LexicalTokenType.Punctuation, ':')) {
        if (isLiteral(this.peek().type)) {
          const valToken = this.advance();
          endToken = valToken;
          
          let val: string | number | boolean = valToken.value;
          if (valToken.type === LexicalTokenType.NumberLiteral) val = parseFloat(valToken.value);
          else if (valToken.type === LexicalTokenType.BooleanLiteral) val = valToken.value === 'true';
          
          literal = createLiteralNode(
            val, 
            valToken.originalToken.value,
            createSourceLocation(
              valToken.line, valToken.column, valToken.offset,
              valToken.line, valToken.column + valToken.originalToken.value.length, valToken.offset + valToken.originalToken.value.length
            )
          );
        } else {
          this.reportError(DiagnosticCode.MissingPropertyValue, 'Expected value after ":" in property.', this.peek());
        }
      } else {
        // Just the presence of trait/enum e.g. `center`
        literal = createLiteralNode(
          true,
          'true',
          createSourceLocation(nameToken.line, nameToken.column, nameToken.offset, nameToken.line, nameToken.column, nameToken.offset)
        );
      }
      
      const loc = createSourceLocation(
        startLoc.line, startLoc.column, startLoc.offset,
        endToken.line, endToken.column, endToken.offset + (endToken.originalToken.value ? endToken.originalToken.value.length : 1)
      );
      
      return createPropertyNode(name, literal, loc);
    }
    
    this.reportError(DiagnosticCode.UnknownProperty, 'Expected property name.', this.peek());
    return null;
  }
}
