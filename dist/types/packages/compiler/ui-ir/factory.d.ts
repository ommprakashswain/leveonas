import { SourceLocation } from '../ast/types';
import { UIIRBindingNode, UIIRComponentDeclarationNode, UIIRComponentInstanceNode, UIIRConditionalNode, UIIRDerivedDeclarationNode, UIIRElementNode, UIIREventNode, UIIRFragmentNode, UIIRListNode, UIIRNode, UIIRProgramNode, UIIRPropDeclarationNode, UIIRPropNode, UIIRSlotNode, UIIRStateDeclarationNode, UIIRTextNode } from './types';
export declare function resetUIIRIdCounter(): void;
export declare function getUIIRId(prefix: string): string;
export declare class UIIRFactory {
    static createProgram(components?: UIIRComponentDeclarationNode[], rootComponent?: string, loc?: SourceLocation): UIIRProgramNode;
    static createComponent(name: string, body?: UIIRNode[], stateDeclarations?: UIIRStateDeclarationNode[], derivedDeclarations?: UIIRDerivedDeclarationNode[], propDeclarations?: UIIRPropDeclarationNode[], propsType?: string, loc?: SourceLocation): UIIRComponentDeclarationNode;
    static createState(name: string, initialValue: any, typeAnnotation?: string, loc?: SourceLocation): UIIRStateDeclarationNode;
    static createDerived(name: string, expression: string, dependencies?: string[], loc?: SourceLocation): UIIRDerivedDeclarationNode;
    static createPropDeclaration(name: string, defaultValue?: any, typeAnnotation?: string, loc?: SourceLocation): UIIRPropDeclarationNode;
    static createProp(name: string, value: string | number | boolean, rawValue?: string, isDynamic?: boolean, isExpression?: boolean, loc?: SourceLocation): UIIRPropNode;
    static createElement(tag: string, props?: UIIRPropNode[], children?: UIIRNode[], dynamicClassConditions?: Record<string, string>, events?: UIIREventNode[], bindings?: UIIRBindingNode[], key?: string, dynamicStyles?: Record<string, string>, loc?: SourceLocation): UIIRElementNode;
    static createText(value: string, isExpression?: boolean, templateDependencies?: string[], loc?: SourceLocation): UIIRTextNode;
    static createFragment(children?: UIIRNode[], key?: string, loc?: SourceLocation): UIIRFragmentNode;
    static createComponentInstance(componentName: string, props?: UIIRPropNode[], children?: UIIRNode[], key?: string, loc?: SourceLocation): UIIRComponentInstanceNode;
    static createSlot(name?: string, fallbackChildren?: UIIRNode[], loc?: SourceLocation): UIIRSlotNode;
    static createConditional(conditionExpr: string, thenBranch: UIIRNode, elseBranch?: UIIRNode, dependencies?: string[], loc?: SourceLocation): UIIRConditionalNode;
    static createList(arrayExpr: string, itemVar: string, body: UIIRNode, keyExpr?: string, indexVar?: string, dependencies?: string[], loc?: SourceLocation): UIIRListNode;
    static createEvent(eventName: string, targetSelector: string, handler: string, targetVar?: string, computation?: string, isFunctionCall?: boolean, loc?: SourceLocation): UIIREventNode;
    static createBinding(bindingType: 'value' | 'checked' | 'group', stateVar: string, targetSelector: string, loc?: SourceLocation): UIIRBindingNode;
}
