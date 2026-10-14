import { SourceLocation } from '../../ast/types';
export declare enum SvelteNodeKind {
    Program = "SvelteProgram",
    ComponentDeclaration = "SvelteComponentDeclaration",
    StateDeclaration = "SvelteStateDeclaration",
    ReactiveDeclaration = "SvelteReactiveDeclaration",
    PropDeclaration = "SveltePropDeclaration",
    Element = "SvelteElement",
    ComponentInstance = "SvelteComponentInstance",
    Fragment = "SvelteFragment",
    Conditional = "SvelteConditional",
    Each = "SvelteEach",
    Slot = "SvelteSlot",
    Text = "SvelteText",
    Prop = "SvelteProp",
    EventBinding = "SvelteEventBinding",
    Binding = "SvelteBinding"
}
export interface SvelteBaseNode {
    id: string;
    kind: SvelteNodeKind;
    sourceLocation?: SourceLocation;
}
export interface SveltePropNode extends SvelteBaseNode {
    kind: SvelteNodeKind.Prop;
    name: string;
    value: string | number | boolean;
    rawValue?: string;
    isDynamic?: boolean;
    isExpression?: boolean;
    isEvent?: boolean;
    isBinding?: boolean;
    bindingType?: 'value' | 'checked' | 'group';
}
export interface SvelteTextNode extends SvelteBaseNode {
    kind: SvelteNodeKind.Text;
    value: string;
    isExpression?: boolean;
}
export interface SvelteStateDeclarationNode extends SvelteBaseNode {
    kind: SvelteNodeKind.StateDeclaration;
    stateName: string;
    name?: string;
    initialValue: any;
    typeAnnotation?: string;
}
export interface SvelteReactiveDeclarationNode extends SvelteBaseNode {
    kind: SvelteNodeKind.ReactiveDeclaration;
    name: string;
    reactiveName: string;
    expression: string;
    dependencies?: string[];
}
export interface SveltePropDeclarationNode extends SvelteBaseNode {
    kind: SvelteNodeKind.PropDeclaration;
    name: string;
    propName: string;
    defaultValue?: any;
    typeAnnotation?: string;
}
export interface SvelteSlotNode extends SvelteBaseNode {
    kind: SvelteNodeKind.Slot;
    name: string;
    children: SvelteUINode[];
}
export interface SvelteElementNode extends SvelteBaseNode {
    kind: SvelteNodeKind.Element;
    tag: string;
    isIntrinsic: boolean;
    props: SveltePropNode[];
    children: SvelteUINode[];
    bindingTarget?: string;
    bindingProperty?: string;
    dynamicClassConditions?: Record<string, string>;
    key?: string;
}
export interface SvelteComponentInstanceNode extends SvelteBaseNode {
    kind: SvelteNodeKind.ComponentInstance;
    componentName: string;
    props: SveltePropNode[];
    children: SvelteUINode[];
    slots?: Record<string, SvelteUINode[]>;
    key?: string;
}
export interface SvelteFragmentNode extends SvelteBaseNode {
    kind: SvelteNodeKind.Fragment;
    children: SvelteUINode[];
    key?: string;
}
export interface SvelteConditionalNode extends SvelteBaseNode {
    kind: SvelteNodeKind.Conditional;
    conditionExpr: string;
    thenBranch: SvelteUINode;
    elseBranch?: SvelteUINode;
}
export interface SvelteEachNode extends SvelteBaseNode {
    kind: SvelteNodeKind.Each;
    arrayExpr: string;
    itemVar: string;
    keyExpr?: string;
    indexVar?: string;
    body: SvelteUINode;
}
export type SvelteUINode = SvelteElementNode | SvelteComponentInstanceNode | SvelteFragmentNode | SvelteConditionalNode | SvelteEachNode | SvelteSlotNode | SvelteTextNode;
export interface SvelteComponentDeclarationNode extends SvelteBaseNode {
    kind: SvelteNodeKind.ComponentDeclaration;
    name: string;
    propsType?: string;
    propsParam?: string;
    propDeclarations: SveltePropDeclarationNode[];
    stateDeclarations: SvelteStateDeclarationNode[];
    reactiveDeclarations: SvelteReactiveDeclarationNode[];
    body: SvelteUINode[];
    rawCode?: string;
}
export interface SvelteProgramNode extends SvelteBaseNode {
    kind: SvelteNodeKind.Program;
    components: SvelteComponentDeclarationNode[];
    rootComponent: string;
}
export declare function getSvelteProgramId(): string;
export declare function getSvelteComponentDeclarationId(name: string): string;
export declare function getSvelteElementId(parentPath: string, tag: string, index: number, key?: string): string;
export declare function getSvelteComponentInstanceId(parentPath: string, compName: string, index: number, key?: string): string;
export declare function getSvelteFragmentId(parentPath: string, index: number, key?: string): string;
export declare function getSvelteSlotId(parentPath: string, slotName?: string, index?: number): string;
export declare function getSvelteTextId(parentPath: string, index: number): string;
export declare function getSvelteStateId(componentName: string, stateName: string): string;
export declare function getSvelteReactiveId(componentName: string, reactiveName: string): string;
export declare function getSvelteEventHandlerId(componentName: string, eventName: string, selector: string, disambiguator?: number): string;
