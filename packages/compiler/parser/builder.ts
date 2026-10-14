import { 
  ASTNodeType, 
  SourceLocation, 
  PropertyNode, 
  LiteralNode,
  ComponentNode,
  ASTNode
} from './nodes';

let nodeCounter = 0;

export function generateNodeId(): string {
  return `node_${++nodeCounter}`;
}

export function createSourceLocation(
  startLine: number,
  startColumn: number,
  startOffset: number,
  endLine: number,
  endColumn: number,
  endOffset: number
): SourceLocation {
  return { startLine, startColumn, startOffset, endLine, endColumn, endOffset };
}

export function createLiteralNode(
  value: string | number | boolean,
  raw: string,
  loc: SourceLocation
): LiteralNode {
  return {
    type: ASTNodeType.Literal,
    nodeId: generateNodeId(),
    value,
    raw,
    sourceLocation: loc,
  };
}

export function createPropertyNode(
  name: string,
  value: LiteralNode | null,
  loc: SourceLocation
): PropertyNode {
  return {
    type: ASTNodeType.Property,
    nodeId: generateNodeId(),
    name,
    value,
    sourceLocation: loc,
  };
}

export function createComponentNode(
  componentName: string,
  loc: SourceLocation,
  parent: ComponentNode | null = null,
  properties: PropertyNode[] = [],
  children: ASTNode[] = []
): ComponentNode {
  let type = ASTNodeType.GenericComponent;
  
  switch (componentName) {
    case 'Page': type = ASTNodeType.Page; break;
    case 'Section': type = ASTNodeType.Section; break;
    case 'Container': type = ASTNodeType.Container; break;
    case 'HeroTitle': 
    case 'Hero': type = ASTNodeType.Hero; break;
    case 'Button': type = ASTNodeType.Button; break;
    case 'Input': type = ASTNodeType.Input; break;
    case 'Text': type = ASTNodeType.Text; break;
    case 'Image': type = ASTNodeType.Image; break;
    case 'Form': type = ASTNodeType.Form; break;
    case 'Grid': type = ASTNodeType.Grid; break;
    case 'Card': type = ASTNodeType.Card; break;
  }

  const baseNode = {
    type,
    nodeId: generateNodeId(),
    parent,
    sourceLocation: loc,
    properties,
    children,
  };

  if (type === ASTNodeType.GenericComponent) {
    return { ...baseNode, type: ASTNodeType.GenericComponent, name: componentName } as unknown as ComponentNode;
  }

  return baseNode as ComponentNode;
}
