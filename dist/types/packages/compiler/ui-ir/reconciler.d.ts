import { RootNode } from '../ast/nodes';
import { JSProgramNode } from '../interpreters/js-lm/ast';
import { UIIRProgramNode, UIReactivityDefinition, UIReconcilerMetrics } from './types';
export declare function resetCommonJSUnitCounter(): void;
export declare function getCommonJSUnitId(prefix: string, disambiguator?: string): string;
export interface CommonUIReconciliationResult {
    domAST: RootNode;
    jsProgram: JSProgramNode;
    reactivityDefinitions: Map<string, UIReactivityDefinition>;
    metrics: UIReconcilerMetrics;
}
/**
 * Common UI Reconciler
 * Lowers Common UI IR into canonical Leveonas DOM AST and serializable Runtime IR.
 */
export declare class CommonUIReconciler {
    private program;
    private componentMap;
    private jsUnits;
    private reactivityDefinitions;
    private componentState;
    constructor(program: UIIRProgramNode);
    reconcile(rootComponentName?: string): CommonUIReconciliationResult;
}
