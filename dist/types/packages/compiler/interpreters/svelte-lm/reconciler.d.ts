import { RootNode } from '../../ast/nodes';
import { JSProgramNode } from '../js-lm/ast';
import { SvelteProgramNode } from './ast';
import { SvelteReactivityGraph, SvelteStateUpdateResult } from './reactivity';
export interface SvelteReconciliationResult {
    domAST: RootNode;
    jsProgram: JSProgramNode;
    componentInstancesCount: number;
    reactivityGraphs: Map<string, SvelteReactivityGraph>;
}
export declare class SvelteReconciler {
    private program;
    private componentMap;
    private componentState;
    private reactivityGraphs;
    private jsUnits;
    private eventCounter;
    constructor(program: SvelteProgramNode, initialStates?: Record<string, any>);
    /**
     * Get the reactivity graph for a component instance.
     */
    getReactivityGraph(instancePath: string): SvelteReactivityGraph | undefined;
    /**
     * Directly compute pinpoint DOM patch operations for a state change using the Reactivity Graph.
     */
    computeStateUpdate(instancePath: string, stateName: string, newValue: any, currentContext?: Record<string, any>): SvelteStateUpdateResult | null;
    /**
     * Reconcile the Svelte component program tree into a Leveonas DOM RootNode, JS runtime units,
     * and fine-grained Reactivity Graphs.
     */
    reconcile(rootComponentName?: string): SvelteReconciliationResult;
}
