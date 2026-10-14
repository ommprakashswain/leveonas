import { ValidationContext } from './context';
import { ASTVisitor } from '../ast/visitor';
import { ComponentNode } from '../ast/nodes';
export declare function createVisitorForRules(context: ValidationContext, visitors: ASTVisitor[]): ASTVisitor;
export declare function createComponentVisitor(visit: (node: ComponentNode) => void): ASTVisitor;
