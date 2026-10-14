import { SourceLocation, ASTNodeKind, NodeMetadata } from './types';

export interface BaseNode {
  id: string;
  kind: ASTNodeKind;
  parent: ASTNode | null;
  sourceLocation: SourceLocation;
  metadata: NodeMetadata;
}

export interface PropertyNode extends BaseNode {
  kind: ASTNodeKind.Property;
  name: string;
  value: LiteralNode | null;
}

export interface LiteralNode extends BaseNode {
  kind: ASTNodeKind.Literal;
  value: string | number | boolean;
  raw: string;
}

export interface ComponentNode extends BaseNode {
  properties: PropertyNode[];
  children: ASTNode[];
}

export interface GenericComponentNode extends ComponentNode {
  kind: ASTNodeKind.GenericComponent;
  name: string;
}

export interface RootNode extends ComponentNode { kind: ASTNodeKind.Root; }
export interface PageNode extends ComponentNode { kind: ASTNodeKind.Page; }
export interface SectionNode extends ComponentNode { kind: ASTNodeKind.Section; }
export interface ContainerNode extends ComponentNode { kind: ASTNodeKind.Container; }
export interface HeroNode extends ComponentNode { kind: ASTNodeKind.Hero; }
export interface ButtonNode extends ComponentNode { kind: ASTNodeKind.Button; }
export interface InputNode extends ComponentNode { kind: ASTNodeKind.Input; }
export interface TextNode extends ComponentNode { kind: ASTNodeKind.Text; }
export interface ImageNode extends ComponentNode { kind: ASTNodeKind.Image; }
export interface FormNode extends ComponentNode { kind: ASTNodeKind.Form; }
export interface GridNode extends ComponentNode { kind: ASTNodeKind.Grid; }
export interface CardNode extends ComponentNode { kind: ASTNodeKind.Card; }

export type ASTNode = 
  | RootNode | PageNode | SectionNode | ContainerNode | HeroNode | ButtonNode
  | InputNode | TextNode | ImageNode | FormNode | GridNode | CardNode
  | GenericComponentNode | PropertyNode | LiteralNode;
