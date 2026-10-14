import { RootNode } from '../../ast/nodes';
import { JSProgramNode } from '../js-lm/ast';
import { ReactProgramNode } from './ast';
export interface ReconciliationResult {
    domAST: RootNode;
    jsProgram: JSProgramNode;
    componentInstancesCount: number;
}
export declare class ReactReconciler {
    private program;
    private componentMap;
    private componentState;
    private jsUnits;
    private eventCounter;
    constructor(program: ReactProgramNode, initialStates?: Record<string, any>);
    /**
     * Reconcile the React program tree into a Leveonas DOM RootNode and accompanying JS runtime units.
     */
    reconcile(rootComponentName?: string): ReconciliationResult;
}
