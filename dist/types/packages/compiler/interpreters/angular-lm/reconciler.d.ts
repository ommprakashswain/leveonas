import { RootNode } from '../../ast/nodes';
import { JSProgramNode } from '../js-lm/ast';
import { AngularProgramNode } from './ast';
export interface AngularReconciliationResult {
    domAST: RootNode;
    jsProgram: JSProgramNode;
    componentInstancesCount: number;
}
/**
 * AngularReconciler
 * Compiler-side wrapper lowering Angular AST to Common UI IR and reconciling via CommonUIReconciler.
 * (Zero duplicate runtime or DOM engine)
 */
export declare class AngularReconciler {
    private program;
    constructor(program: AngularProgramNode);
    reconcile(rootComponentName?: string): AngularReconciliationResult;
}
