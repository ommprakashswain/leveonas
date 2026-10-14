import { SourceLocation } from '../../ast/types';
export declare enum AngularNodeKind {
    Program = "AngularProgram",
    ComponentDeclaration = "AngularComponentDeclaration",
    StateDeclaration = "AngularStateDeclaration",
    DerivedDeclaration = "AngularDerivedDeclaration",
    InputDeclaration = "AngularInputDeclaration",
    OutputDeclaration = "AngularOutputDeclaration",
    Element = "AngularElement",
    ComponentInstance = "AngularComponentInstance",
    Fragment = "AngularFragment",
    Conditional = "AngularConditional",
    For = "AngularFor",
    ContentProjection = "AngularContentProjection",
    Text = "AngularText",
    Prop = "AngularProp",
    EventBinding = "AngularEventBinding",
    PropertyBinding = "AngularPropertyBinding",
    ClassBinding = "AngularClassBinding",
    StyleBinding = "AngularStyleBinding",
    TwoWayBinding = "AngularTwoWayBinding"
}
export interface AngularBaseNode {
    id: string;
    kind: AngularNodeKind;
    sourceLocation?: SourceLocation;
}
export interface AngularPropNode extends AngularBaseNode {
    kind: AngularNodeKind.Prop;
    name: string;
    value: string | number | boolean;
    rawValue?: string;
    isDynamic?: boolean;
    isExpression?: boolean;
    isEvent?: boolean;
    isPropertyBinding?: boolean;
    isClassBinding?: boolean;
    isStyleBinding?: boolean;
    isTwoWayBinding?: boolean;
}
export interface AngularTextNode extends AngularBaseNode {
    kind: AngularNodeKind.Text;
    value: string;
    isExpression?: boolean;
}
export interface AngularStateDeclarationNode extends AngularBaseNode {
    kind: AngularNodeKind.StateDeclaration;
    name: string;
    stateName: string;
    initialValue: any;
    typeAnnotation?: string;
}
export interface AngularDerivedDeclarationNode extends AngularBaseNode {
    kind: AngularNodeKind.DerivedDeclaration;
    name: string;
    derivedName: string;
    expression: string;
    dependencies?: string[];
}
export interface AngularInputDeclarationNode extends AngularBaseNode {
    kind: AngularNodeKind.InputDeclaration;
    name: string;
    inputName: string;
    defaultValue?: any;
    typeAnnotation?: string;
}
export interface AngularOutputDeclarationNode extends AngularBaseNode {
    kind: AngularNodeKind.OutputDeclaration;
    name: string;
    outputName: string;
    typeAnnotation?: string;
}
export interface AngularContentProjectionNode extends AngularBaseNode {
    kind: AngularNodeKind.ContentProjection;
    name: string;
    children: AngularUINode[];
}
export interface AngularElementNode extends AngularBaseNode {
    kind: AngularNodeKind.Element;
    tag: string;
    isIntrinsic: boolean;
    props: AngularPropNode[];
    children: AngularUINode[];
    modelBinding?: string;
    dynamicClassConditions?: Record<string, string>;
    dynamicStyles?: Record<string, string>;
    key?: string;
}
export interface AngularComponentInstanceNode extends AngularBaseNode {
    kind: AngularNodeKind.ComponentInstance;
    componentName: string;
    props: AngularPropNode[];
    children: AngularUINode[];
    slots?: Record<string, AngularUINode[]>;
    key?: string;
}
export interface AngularFragmentNode extends AngularBaseNode {
    kind: AngularNodeKind.Fragment;
    children: AngularUINode[];
    key?: string;
}
export interface AngularConditionalNode extends AngularBaseNode {
    kind: AngularNodeKind.Conditional;
    conditionExpr: string;
    thenBranch: AngularUINode;
    elseBranch?: AngularUINode;
    dependencies?: string[];
}
export interface AngularForNode extends AngularBaseNode {
    kind: AngularNodeKind.For;
    arrayExpr: string;
    itemVar: string;
    trackExpr?: string;
    indexVar?: string;
    body: AngularUINode;
    dependencies?: string[];
}
export type AngularUINode = AngularElementNode | AngularComponentInstanceNode | AngularFragmentNode | AngularConditionalNode | AngularForNode | AngularContentProjectionNode | AngularTextNode;
export interface AngularComponentDeclarationNode extends AngularBaseNode {
    kind: AngularNodeKind.ComponentDeclaration;
    name: string;
    inputs: AngularInputDeclarationNode[];
    outputs: AngularOutputDeclarationNode[];
    stateDeclarations: AngularStateDeclarationNode[];
    derivedDeclarations: AngularDerivedDeclarationNode[];
    body: AngularUINode[];
}
export interface AngularProgramNode extends AngularBaseNode {
    kind: AngularNodeKind.Program;
    components: AngularComponentDeclarationNode[];
    rootComponent: string;
}
export declare function resetAngularIdCounter(): void;
export declare function getAngularProgramId(): string;
export declare function getAngularComponentDeclarationId(name: string): string;
export declare function getAngularComponentInstanceId(name: string): string;
export declare function getAngularElementId(tag: string, index?: number): string;
export declare function getAngularFragmentId(): string;
export declare function getAngularTextId(index?: number): string;
export declare function getAngularPropId(name: string): string;
export declare function getAngularStateDeclarationId(name: string): string;
export declare function getAngularDerivedDeclarationId(name: string): string;
export declare function getAngularInputDeclarationId(name: string): string;
export declare function getAngularOutputDeclarationId(name: string): string;
export declare function getAngularConditionalId(): string;
export declare function getAngularForId(): string;
export declare function getAngularContentProjectionId(name: string): string;
