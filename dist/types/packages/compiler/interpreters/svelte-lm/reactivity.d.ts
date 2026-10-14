import { PatchOperation } from '../../../runtime/incremental/patch-generator/types';
/**
 * Deterministically extract variable identifier dependencies from an expression.
 * Examples:
 *   "count * 2" -> ["count"]
 *   "price * quantity" -> ["price", "quantity"]
 *   "user.name" -> ["user"]
 *   "a + b * c" -> ["a", "b", "c"]
 */
export declare function extractExpressionDependencies(expr: string, availableScope?: string[]): string[];
/**
 * Extract dependencies from template string interpolations.
 * E.g. "Count: {count}, Double: {double}" -> ["count", "double"]
 */
export declare function extractTemplateInterpolations(template: string): string[];
/**
 * Safely evaluates a simple Svelte expression against a scoped context object
 * without arbitrary `eval` or `with` statements.
 */
export declare function evaluateSvelteExpression(expr: string, context: Record<string, any>): any;
/**
 * Interpolate template strings with current context values.
 */
export declare function interpolateTemplateString(template: string, context: Record<string, any>): string;
export type DOMDependencyKind = 'TEXT' | 'PROPERTY' | 'CLASS' | 'BINDING' | 'CONDITIONAL';
export interface DOMDependencyInfo {
    domNodeId: string;
    kind: DOMDependencyKind;
    template?: string;
    propName?: string;
    className?: string;
    expression?: string;
    dependencies: string[];
    thenNode?: any;
    elseNode?: any;
    currentBranch?: 'then' | 'else';
    branchRenderer?: (branch: 'then' | 'else', context: Record<string, any>) => any;
}
export interface ReactiveDeclarationInfo {
    name: string;
    expression: string;
    dependencies: string[];
    currentValue?: any;
}
export interface StateDeclarationInfo {
    name: string;
    initialValue: any;
    currentValue?: any;
}
export interface SvelteStateUpdateResult {
    updatedState: Record<string, any>;
    recomputedReactive: Record<string, any>;
    changedVariables: string[];
    affectedDomNodeIds: string[];
    patches: PatchOperation[];
}
/**
 * Svelte-LM Reactive Dependency Graph
 * Tracks deterministic dependencies between State -> Reactive Declarations -> DOM Nodes.
 */
export declare class SvelteReactivityGraph {
    componentName: string;
    instancePath: string;
    stateMap: Map<string, StateDeclarationInfo>;
    reactiveMap: Map<string, ReactiveDeclarationInfo>;
    domDependencies: Map<string, DOMDependencyInfo>;
    private varToReactiveDependents;
    private varToDOMDependents;
    constructor(componentName: string, instancePath?: string);
    addState(name: string, initialValue: any): this;
    addReactive(name: string, expression: string, explicitDeps?: string[]): this;
    registerDOMDependency(info: DOMDependencyInfo): this;
    /**
     * Builds the initial context and evaluates all reactive declarations in topological dependency order.
     */
    computeInitialContext(props?: Record<string, any>): Record<string, any>;
    /**
     * Topological sort of reactive declarations based on their dependencies.
     */
    getTopologicalReactiveOrder(): string[];
    /**
     * Reactively update a state variable, recompute dependent reactive variables in order,
     * identify affected DOM nodes, and generate pinpoint PatchOperations.
     */
    updateState(stateName: string, newValue: any, currentContext: Record<string, any>): SvelteStateUpdateResult;
    /**
     * Serialize graph for debugging and inspector visualization.
     */
    toJSON(): Record<string, any>;
}
