export interface SourceLocation {
  startLine: number;
  startColumn: number;
  startOffset: number;
  endLine: number;
  endColumn: number;
  endOffset: number;
}

export enum ASTNodeType {
  Page = 'PageNode',
  Section = 'SectionNode',
  Container = 'ContainerNode',
  Hero = 'HeroNode',
  Button = 'ButtonNode',
  Input = 'InputNode',
  Text = 'TextNode',
  Image = 'ImageNode',
  Form = 'FormNode',
  Grid = 'GridNode',
  Card = 'CardNode',
  GenericComponent = 'GenericComponentNode',
  Property = 'PropertyNode',
  Literal = 'LiteralNode',
}

export interface BaseASTNode {
  type: ASTNodeType;
  nodeId: string;
  parent: BaseASTNode | null;
  sourceLocation: SourceLocation;
  children: BaseASTNode[];
  properties: PropertyNode[];
}

export interface PropertyNode {
  type: ASTNodeType.Property;
  nodeId: string;
  name: string;
  value: LiteralNode | null;
  sourceLocation: SourceLocation;
}

export interface LiteralNode {
  type: ASTNodeType.Literal;
  nodeId: string;
  value: string | number | boolean;
  raw: string;
  sourceLocation: SourceLocation;
}

export interface GenericComponentNode extends BaseASTNode {
  type: ASTNodeType.GenericComponent;
  name: string;
}

export interface PageNode extends BaseASTNode { type: ASTNodeType.Page; }
export interface SectionNode extends BaseASTNode { type: ASTNodeType.Section; }
export interface ContainerNode extends BaseASTNode { type: ASTNodeType.Container; }
export interface HeroNode extends BaseASTNode { type: ASTNodeType.Hero; }
export interface ButtonNode extends BaseASTNode { type: ASTNodeType.Button; }
export interface InputNode extends BaseASTNode { type: ASTNodeType.Input; }
export interface TextNode extends BaseASTNode { type: ASTNodeType.Text; }
export interface ImageNode extends BaseASTNode { type: ASTNodeType.Image; }
export interface FormNode extends BaseASTNode { type: ASTNodeType.Form; }
export interface GridNode extends BaseASTNode { type: ASTNodeType.Grid; }
export interface CardNode extends BaseASTNode { type: ASTNodeType.Card; }

export type ComponentNode =
  | PageNode
  | SectionNode
  | ContainerNode
  | HeroNode
  | ButtonNode
  | InputNode
  | TextNode
  | ImageNode
  | FormNode
  | GridNode
  | CardNode
  | GenericComponentNode;

export type ASTNode = ComponentNode | PropertyNode | LiteralNode;
