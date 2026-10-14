import { PipelineContext } from './context';
import { PipelineDiagnostic, PipelineDiagnosticSeverity } from './diagnostics';
import { Token } from '../tokenizer/types';
import { Scanner as TokenizerScanner } from '../tokenizer';
import { Lexer, LexicalToken } from '../lexer';
import { Parser } from '../parser';
import { SemanticValidator } from '../validator';
import { HtmlRenderer } from '../renderers/html';
import { PatchGenerator } from '../../runtime/incremental/patch-generator';
import { ASTNode as ParserASTNode, ComponentNode as ParserComponentNode, ASTNodeType, PropertyNode as ParserPropertyNode, LiteralNode as ParserLiteralNode } from '../parser/nodes';
import { ASTNode, RootNode, ComponentNode, PropertyNode, LiteralNode } from '../ast/nodes';
import { ASTFactory } from '../ast/factory';
import { ASTNodeKind } from '../ast/types';

function mapNodeType(type: ASTNodeType): ASTNodeKind {
  switch (type) {
    case ASTNodeType.Page: return ASTNodeKind.Page;
    case ASTNodeType.Section: return ASTNodeKind.Section;
    case ASTNodeType.Container: return ASTNodeKind.Container;
    case ASTNodeType.Hero: return ASTNodeKind.Hero;
    case ASTNodeType.Button: return ASTNodeKind.Button;
    case ASTNodeType.Input: return ASTNodeKind.Input;
    case ASTNodeType.Text: return ASTNodeKind.Text;
    case ASTNodeType.Image: return ASTNodeKind.Image;
    case ASTNodeType.Form: return ASTNodeKind.Form;
    case ASTNodeType.Grid: return ASTNodeKind.Grid;
    case ASTNodeType.Card: return ASTNodeKind.Card;
    case ASTNodeType.GenericComponent: return ASTNodeKind.GenericComponent;
    case ASTNodeType.Property: return ASTNodeKind.Property;
    case ASTNodeType.Literal: return ASTNodeKind.Literal;
    default: return ASTNodeKind.GenericComponent;
  }
}

export function adaptParserTreeToAST(parserNodes: ParserComponentNode[]): RootNode {
  const root = ASTFactory.createComponent(ASTNodeKind.Root, ASTFactory.createSourceLocation(0, 0, 0, 0, 0, 0)) as RootNode;
  
  function adaptNode(node: ParserASTNode, parent: ASTNode | null): ASTNode {
    if (node.type === ASTNodeType.Literal) {
      const lit = node as ParserLiteralNode;
      const res = ASTFactory.createLiteral(lit.value, lit.raw, lit.sourceLocation);
      res.parent = parent;
      res.id = lit.nodeId;
      return res;
    }
    if (node.type === ASTNodeType.Property) {
      const prop = node as ParserPropertyNode;
      const val = prop.value ? adaptNode(prop.value, null) as LiteralNode : null;
      const res = ASTFactory.createProperty(prop.name, val, prop.sourceLocation);
      if (val) val.parent = res;
      res.parent = parent;
      res.id = prop.nodeId;
      return res;
    }
    
    const comp = node as ParserComponentNode;
    const kind = mapNodeType(comp.type);
    const name = comp.type === ASTNodeType.GenericComponent ? (comp as any).name : undefined;
    
    const res = ASTFactory.createComponent(kind, comp.sourceLocation, [], [], name);
    res.parent = parent;
    res.id = comp.nodeId;
    
    const props = comp.properties.map(p => adaptNode(p, res as unknown as ASTNode) as PropertyNode);
    const children = comp.children.map(c => adaptNode(c as ParserASTNode, res as unknown as ASTNode));
    
    res.properties = props;
    res.children = children;
    
    return res as unknown as ASTNode;
  }
  
  root.children = parserNodes.map(n => adaptNode(n, root as unknown as ASTNode));
  return root;
}

export class PipelineStages {
  constructor(private context: PipelineContext) {}
  
  public runTokenizer(source: string): Token[] {
    const start = performance.now();
    const tokenizer = new TokenizerScanner(source);
    const tokens = tokenizer.tokenize();
    this.context.statistics.tokenizerTime = performance.now() - start;
    return tokens;
  }
  
  public runLexer(tokens: Token[]): LexicalToken[] {
    const start = performance.now();
    const lexer = new Lexer(tokens);
    const lexTokens = lexer.lex();
    
    const diagnostics = lexer.getDiagnostics();
    for (const d of diagnostics) {
      this.context.reportDiagnostic({
        stage: 'lexer',
        code: d.code,
        message: d.message,
        severity: d.severity as unknown as PipelineDiagnosticSeverity,
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
  
  public runParser(tokens: LexicalToken[]): RootNode {
    const start = performance.now();
    const parser = new Parser(tokens);
    const parserNodes = parser.parse();
    
    const diagnostics = parser.getDiagnostics();
    for (const d of diagnostics) {
      this.context.reportDiagnostic({
        stage: 'parser',
        code: d.code,
        message: d.message,
        severity: d.severity as unknown as PipelineDiagnosticSeverity,
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
  
  public runValidator(ast: RootNode): void {
    const start = performance.now();
    const validator = new SemanticValidator();
    const diagnostics = validator.validate(ast);
    
    for (const d of diagnostics) {
      this.context.reportDiagnostic({
        stage: 'validator',
        code: d.code,
        message: d.message,
        severity: d.severity as unknown as PipelineDiagnosticSeverity,
        location: d.sourceLocation
      });
    }
    
    this.context.statistics.validatorTime = performance.now() - start;
  }
  
  public runRenderer(ast: RootNode, minify: boolean = false): string {
    const start = performance.now();
    const renderer = new HtmlRenderer({ minify, indentSize: 2 });
    const html = renderer.render(ast);
    this.context.statistics.rendererTime = performance.now() - start;
    return html;
  }
  
  public runPatchGenerator(oldAst: RootNode, newAst: RootNode) {
    const start = performance.now();
    const generator = new PatchGenerator();
    const patches = generator.generate(oldAst, newAst);
    this.context.statistics.patchGeneratorTime = performance.now() - start;
    return patches;
  }
}
