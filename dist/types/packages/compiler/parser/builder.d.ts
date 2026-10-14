import { SourceLocation, PropertyNode, LiteralNode, ComponentNode, ASTNode } from './nodes';
export declare function generateNodeId(): string;
export declare function createSourceLocation(startLine: number, startColumn: number, startOffset: number, endLine: number, endColumn: number, endOffset: number): SourceLocation;
export declare function createLiteralNode(value: string | number | boolean, raw: string, loc: SourceLocation): LiteralNode;
export declare function createPropertyNode(name: string, value: LiteralNode | null, loc: SourceLocation): PropertyNode;
export declare function createComponentNode(componentName: string, loc: SourceLocation, parent?: ComponentNode | null, properties?: PropertyNode[], children?: ASTNode[]): ComponentNode;
