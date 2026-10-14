import { SourceLocation } from '../../ast/types';
export declare enum ReactNodeKind {
    Program = "ReactProgram",
    ComponentDeclaration = "ReactComponentDeclaration",
    StateDeclaration = "ReactStateDeclaration",
    DerivedDeclaration = "ReactDerivedDeclaration",
    Element = "ReactElement",
    ComponentInstance = "ReactComponentInstance",
    Fragment = "ReactFragment",
    Conditional = "ReactConditional",
    List = "ReactList",
    Text = "ReactText",
    Prop = "ReactProp",
    EventHandler = "ReactEventHandler"
}
export interface ReactBaseNode {
    id: string;
    kind: ReactNodeKind;
    sourceLocation?: SourceLocation;
}
export interface ReactPropNode extends ReactBaseNode {
    kind: ReactNodeKind.Prop;
    name: string;
    value: string | number | boolean;
    rawValue?: string;
    isExpression?: boolean;
    isEvent?: boolean;
}
export interface ReactTextNode extends ReactBaseNode {
    kind: ReactNodeKind.Text;
    value: string;
    isExpression?: boolean;
}
export interface ReactStateDeclarationNode extends ReactBaseNode {
    kind: ReactNodeKind.StateDeclaration;
    stateName: string;
    name?: string;
    initialValue: any;
    typeAnnotation?: string;
}
export interface ReactDerivedDeclarationNode extends ReactBaseNode {
    kind: ReactNodeKind.DerivedDeclaration;
    derivedName: string;
    name?: string;
    expression: string;
    dependencies?: string[];
    typeAnnotation?: string;
}
export interface ReactElementNode extends ReactBaseNode {
    kind: ReactNodeKind.Element;
    tag: string;
    isIntrinsic: boolean;
    props: ReactPropNode[];
    children: ReactUINode[];
    key?: string;
}
export interface ReactComponentInstanceNode extends ReactBaseNode {
    kind: ReactNodeKind.ComponentInstance;
    componentName: string;
    props: ReactPropNode[];
    children: ReactUINode[];
    key?: string;
}
export interface ReactFragmentNode extends ReactBaseNode {
    kind: ReactNodeKind.Fragment;
    children: ReactUINode[];
    key?: string;
}
export interface ReactConditionalNode extends ReactBaseNode {
    kind: ReactNodeKind.Conditional;
    conditionExpr: string;
    thenBranch: ReactUINode;
    elseBranch?: ReactUINode;
}
export interface ReactListNode extends ReactBaseNode {
    kind: ReactNodeKind.List;
    arrayExpr: string;
    itemVar: string;
    indexVar?: string;
    body: ReactUINode;
    keyProp?: string;
}
export type ReactUINode = ReactElementNode | ReactComponentInstanceNode | ReactFragmentNode | ReactConditionalNode | ReactListNode | ReactTextNode;
export interface ReactComponentDeclarationNode extends ReactBaseNode {
    kind: ReactNodeKind.ComponentDeclaration;
    name: string;
    propsType?: string;
    propsParam?: string;
    stateDeclarations: ReactStateDeclarationNode[];
    derivedDeclarations?: ReactDerivedDeclarationNode[];
    body: ReactUINode[];
    rawCode?: string;
}
export interface ReactProgramNode extends ReactBaseNode {
    kind: ReactNodeKind.Program;
    components: ReactComponentDeclarationNode[];
    rootComponent: string;
}
export declare function getReactProgramId(): string;
export declare function getReactComponentDeclarationId(name: string): string;
export declare function getReactElementId(parentPath: string, tag: string, index: number, key?: string): string;
export declare function getReactComponentInstanceId(parentPath: string, compName: string, index: number, key?: string): string;
export declare function getReactFragmentId(parentPath: string, index: number, key?: string): string;
export declare function getReactTextId(parentPath: string, index: number): string;
export declare function getReactEventHandlerId(componentName: string, eventName: string, selector: string, disambiguator?: number): string;
