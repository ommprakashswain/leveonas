import { SourceLocation } from '../../ast/types';
export declare enum VueNodeKind {
    Program = "VueProgram",
    ComponentDeclaration = "VueComponentDeclaration",
    StateDeclaration = "VueStateDeclaration",
    ComputedDeclaration = "VueComputedDeclaration",
    Element = "VueElement",
    ComponentInstance = "VueComponentInstance",
    Fragment = "VueFragment",
    Conditional = "VueConditional",
    List = "VueList",
    Slot = "VueSlot",
    Text = "VueText",
    Prop = "VueProp",
    EventBinding = "VueEventBinding",
    ModelBinding = "VueModelBinding"
}
export interface VueBaseNode {
    id: string;
    kind: VueNodeKind;
    sourceLocation?: SourceLocation;
}
export interface VuePropNode extends VueBaseNode {
    kind: VueNodeKind.Prop;
    name: string;
    value: string | number | boolean;
    rawValue?: string;
    isDynamic?: boolean;
    isExpression?: boolean;
    isEvent?: boolean;
    isModel?: boolean;
    directiveName?: 'v-bind' | 'v-on' | 'v-model' | 'v-show' | 'v-if' | 'v-for';
}
export interface VueTextNode extends VueBaseNode {
    kind: VueNodeKind.Text;
    value: string;
    isExpression?: boolean;
}
export interface VueStateDeclarationNode extends VueBaseNode {
    kind: VueNodeKind.StateDeclaration;
    stateName: string;
    name?: string;
    initialValue: any;
    isRef?: boolean;
    isReactive?: boolean;
    typeAnnotation?: string;
}
export interface VueComputedDeclarationNode extends VueBaseNode {
    kind: VueNodeKind.ComputedDeclaration;
    name: string;
    computedName: string;
    expression: string;
    dependencies?: string[];
}
export interface VueSlotNode extends VueBaseNode {
    kind: VueNodeKind.Slot;
    name: string;
    children: VueUINode[];
}
export interface VueElementNode extends VueBaseNode {
    kind: VueNodeKind.Element;
    tag: string;
    isIntrinsic: boolean;
    props: VuePropNode[];
    children: VueUINode[];
    modelBinding?: string;
    showCondition?: string;
    key?: string;
}
export interface VueComponentInstanceNode extends VueBaseNode {
    kind: VueNodeKind.ComponentInstance;
    componentName: string;
    props: VuePropNode[];
    children: VueUINode[];
    slots?: Record<string, VueUINode[]>;
    key?: string;
}
export interface VueFragmentNode extends VueBaseNode {
    kind: VueNodeKind.Fragment;
    children: VueUINode[];
    key?: string;
}
export interface VueConditionalNode extends VueBaseNode {
    kind: VueNodeKind.Conditional;
    conditionExpr: string;
    thenBranch: VueUINode;
    elseBranch?: VueUINode;
}
export interface VueListNode extends VueBaseNode {
    kind: VueNodeKind.List;
    arrayExpr: string;
    itemVar: string;
    keyExpr?: string;
    indexVar?: string;
    body: VueUINode;
}
export type VueUINode = VueElementNode | VueComponentInstanceNode | VueFragmentNode | VueConditionalNode | VueListNode | VueSlotNode | VueTextNode;
export interface VueComponentDeclarationNode extends VueBaseNode {
    kind: VueNodeKind.ComponentDeclaration;
    name: string;
    propsType?: string;
    propsParam?: string;
    stateDeclarations: VueStateDeclarationNode[];
    computedDeclarations: VueComputedDeclarationNode[];
    body: VueUINode[];
    rawCode?: string;
}
export interface VueProgramNode extends VueBaseNode {
    kind: VueNodeKind.Program;
    components: VueComponentDeclarationNode[];
    rootComponent: string;
}
export declare function getVueProgramId(): string;
export declare function getVueComponentDeclarationId(name: string): string;
export declare function getVueElementId(parentPath: string, tag: string, index: number, key?: string): string;
export declare function getVueComponentInstanceId(parentPath: string, compName: string, index: number, key?: string): string;
export declare function getVueFragmentId(parentPath: string, index: number, key?: string): string;
export declare function getVueSlotId(parentPath: string, slotName?: string, index?: number): string;
export declare function getVueTextId(parentPath: string, index: number): string;
export declare function getVueStateId(componentName: string, stateName: string): string;
export declare function getVueComputedId(componentName: string, computedName: string): string;
export declare function getVueEventHandlerId(componentName: string, eventName: string, selector: string, disambiguator?: number): string;
