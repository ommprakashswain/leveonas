import { RootNode } from '../../ast/nodes';
import { JSProgramNode } from '../js-lm/ast';
import { VueProgramNode } from './ast';
export interface VueReconciliationResult {
    domAST: RootNode;
    jsProgram: JSProgramNode;
    componentInstancesCount: number;
}
export declare class VueReconciler {
    private program;
    private componentMap;
    private componentState;
    private jsUnits;
    private eventCounter;
    constructor(program: VueProgramNode, initialStates?: Record<string, any>);
    /**
     * Reconcile the Vue component program tree into a Leveonas DOM RootNode and accompanying JS runtime units.
     */
    reconcile(rootComponentName?: string): VueReconciliationResult;
}
