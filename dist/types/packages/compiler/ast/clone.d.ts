import { SourceLocation } from './types';
import { ASTNode } from './nodes';
export declare function cloneLocation(loc?: SourceLocation): SourceLocation;
export declare function cloneASTNode<T extends ASTNode>(node: T, parent?: ASTNode | null): T;
