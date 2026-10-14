import { ASTNodeKind, SourceLocation } from './types';
import { ASTNode, PropertyNode, LiteralNode, ComponentNode } from './nodes';
export declare function generateNodeId(): string;
export declare class ASTFactory {
    static createSourceLocation(startLine: number, startColumn: number, startOffset: number, endLine: number, endColumn: number, endOffset: number): SourceLocation;
    static createLiteral(value: string | number | boolean, raw: string, loc: SourceLocation): LiteralNode;
    static createProperty(name: string, value: LiteralNode | null, loc: SourceLocation): PropertyNode;
    static createComponent(kind: ASTNodeKind, loc: SourceLocation, properties?: PropertyNode[], children?: ASTNode[], name?: string): ComponentNode;
    static clone<T extends ASTNode>(node: T, parent?: ASTNode | null): T;
}
