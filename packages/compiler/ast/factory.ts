import { ASTNodeKind, SourceLocation } from './types';
import { 
  ASTNode, RootNode, PageNode, SectionNode, ContainerNode, HeroNode,
  ButtonNode, InputNode, TextNode, ImageNode, FormNode, GridNode, CardNode,
  GenericComponentNode, PropertyNode, LiteralNode, ComponentNode
} from './nodes';

let nodeCounter = 0;

export function generateNodeId(): string {
  return `ast_${++nodeCounter}`;
}

export class ASTFactory {
  static createSourceLocation(
    startLine: number, startColumn: number, startOffset: number,
    endLine: number, endColumn: number, endOffset: number
  ): SourceLocation {
    return { startLine, startColumn, startOffset, endLine, endColumn, endOffset };
  }

  static createLiteral(
    value: string | number | boolean,
    raw: string,
    loc: SourceLocation
  ): LiteralNode {
    return {
      id: generateNodeId(),
      kind: ASTNodeKind.Literal,
      value,
      raw,
      parent: null,
      sourceLocation: loc,
      metadata: {}
    };
  }

  static createProperty(
    name: string,
    value: LiteralNode | null,
    loc: SourceLocation
  ): PropertyNode {
    const prop: PropertyNode = {
      id: generateNodeId(),
      kind: ASTNodeKind.Property,
      name,
      value,
      parent: null,
      sourceLocation: loc,
      metadata: {}
    };
    if (value) value.parent = prop;
    return prop;
  }

  static createComponent(
    kind: ASTNodeKind,
    loc: SourceLocation,
    properties: PropertyNode[] = [],
    children: ASTNode[] = [],
    name?: string
  ): ComponentNode {
    const comp = {
      id: generateNodeId(),
      kind,
      properties,
      children,
      parent: null,
      sourceLocation: loc,
      metadata: {},
      ...(name ? { name } : {})
    } as ComponentNode;

    properties.forEach(p => p.parent = comp as unknown as ASTNode);
    children.forEach(c => c.parent = comp as unknown as ASTNode);
    return comp;
  }

  static clone<T extends ASTNode>(node: T, parent: ASTNode | null = null): T {
    const cloned = { ...node, id: generateNodeId(), parent, metadata: { ...node.metadata } } as any;
    
    if (cloned.kind === ASTNodeKind.Property) {
      if (cloned.value) cloned.value = ASTFactory.clone(cloned.value, cloned);
    } else if (cloned.kind !== ASTNodeKind.Literal) {
      cloned.properties = cloned.properties?.map((p: any) => ASTFactory.clone(p, cloned)) || [];
      cloned.children = cloned.children?.map((c: any) => ASTFactory.clone(c, cloned)) || [];
    }

    return cloned as T;
  }
}
