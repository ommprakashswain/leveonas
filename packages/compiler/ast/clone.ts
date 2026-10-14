import { ASTNodeKind, SourceLocation } from './types';
import { ASTNode, ComponentNode, GenericComponentNode, LiteralNode, PropertyNode } from './nodes';

export function cloneLocation(loc?: SourceLocation): SourceLocation {
  if (!loc) {
    return {
      startLine: 1,
      startColumn: 1,
      startOffset: 0,
      endLine: 1,
      endColumn: 1,
      endOffset: 0,
    };
  }
  return { ...loc };
}

export function cloneASTNode<T extends ASTNode>(node: T, parent: ASTNode | null = null): T {
  if (node.kind === ASTNodeKind.Literal) {
    const lit = node as unknown as LiteralNode;
    const cloned: LiteralNode = {
      id: lit.id,
      kind: lit.kind,
      value: lit.value,
      raw: lit.raw,
      parent,
      sourceLocation: cloneLocation(lit.sourceLocation),
      metadata: { ...lit.metadata },
    };
    return cloned as unknown as T;
  }

  if (node.kind === ASTNodeKind.Property) {
    const prop = node as unknown as PropertyNode;
    const clonedProp: PropertyNode = {
      id: prop.id,
      kind: prop.kind,
      name: prop.name,
      value: null,
      parent,
      sourceLocation: cloneLocation(prop.sourceLocation),
      metadata: { ...prop.metadata },
    };
    if (prop.value) {
      clonedProp.value = cloneASTNode(prop.value, clonedProp as unknown as ASTNode);
    }
    return clonedProp as unknown as T;
  }

  const comp = node as unknown as ComponentNode;
  const clonedComp: any = {
    id: comp.id,
    kind: comp.kind,
    parent,
    sourceLocation: cloneLocation(comp.sourceLocation),
    metadata: { ...comp.metadata },
    properties: [],
    children: [],
  };

  if ('name' in comp) {
    clonedComp.name = (comp as GenericComponentNode).name;
  }

  clonedComp.properties = (comp.properties || []).map((p) =>
    cloneASTNode(p, clonedComp as unknown as ASTNode)
  );
  clonedComp.children = (comp.children || []).map((c) =>
    cloneASTNode(c, clonedComp as unknown as ASTNode)
  );

  return clonedComp as unknown as T;
}
