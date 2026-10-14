import { SourceLocation } from '../ast/types';
import {
  UIIRBindingNode,
  UIIRComponentDeclarationNode,
  UIIRComponentInstanceNode,
  UIIRConditionalNode,
  UIIRDerivedDeclarationNode,
  UIIRElementNode,
  UIIREventNode,
  UIIRFragmentNode,
  UIIRListNode,
  UIIRNode,
  UIIRNodeKind,
  UIIRProgramNode,
  UIIRPropDeclarationNode,
  UIIRPropNode,
  UIIRSlotNode,
  UIIRStateDeclarationNode,
  UIIRTextNode,
} from './types';

let idCounter = 0;

export function resetUIIRIdCounter(): void {
  idCounter = 0;
}

export function getUIIRId(prefix: string): string {
  return `${prefix}_${++idCounter}`;
}

export class UIIRFactory {
  static createProgram(
    components: UIIRComponentDeclarationNode[] = [],
    rootComponent: string = 'App',
    loc?: SourceLocation
  ): UIIRProgramNode {
    return {
      id: getUIIRId('ui_program'),
      kind: UIIRNodeKind.Program,
      components,
      rootComponent,
      sourceLocation: loc,
    };
  }

  static createComponent(
    name: string,
    body: UIIRNode[] = [],
    stateDeclarations: UIIRStateDeclarationNode[] = [],
    derivedDeclarations: UIIRDerivedDeclarationNode[] = [],
    propDeclarations: UIIRPropDeclarationNode[] = [],
    propsType?: string,
    loc?: SourceLocation
  ): UIIRComponentDeclarationNode {
    return {
      id: getUIIRId(`ui_comp_${name}`),
      kind: UIIRNodeKind.Component,
      name,
      propsType,
      propDeclarations,
      stateDeclarations,
      derivedDeclarations,
      body,
      sourceLocation: loc,
    };
  }

  static createState(
    name: string,
    initialValue: any,
    typeAnnotation?: string,
    loc?: SourceLocation
  ): UIIRStateDeclarationNode {
    return {
      id: getUIIRId(`ui_state_${name}`),
      kind: UIIRNodeKind.State,
      stateName: name,
      initialValue,
      typeAnnotation,
      sourceLocation: loc,
    };
  }

  static createDerived(
    name: string,
    expression: string,
    dependencies: string[] = [],
    loc?: SourceLocation
  ): UIIRDerivedDeclarationNode {
    return {
      id: getUIIRId(`ui_derived_${name}`),
      kind: UIIRNodeKind.Derived,
      derivedName: name,
      expression,
      dependencies,
      sourceLocation: loc,
    };
  }

  static createPropDeclaration(
    name: string,
    defaultValue?: any,
    typeAnnotation?: string,
    loc?: SourceLocation
  ): UIIRPropDeclarationNode {
    return {
      id: getUIIRId(`ui_prop_decl_${name}`),
      kind: UIIRNodeKind.Prop,
      propName: name,
      defaultValue,
      typeAnnotation,
      sourceLocation: loc,
    };
  }

  static createProp(
    name: string,
    value: string | number | boolean,
    rawValue?: string,
    isDynamic: boolean = false,
    isExpression: boolean = false,
    loc?: SourceLocation
  ): UIIRPropNode {
    return {
      id: getUIIRId(`ui_prop_${name}`),
      kind: UIIRNodeKind.Prop,
      name,
      value,
      rawValue: rawValue ?? String(value),
      isDynamic,
      isExpression,
      sourceLocation: loc,
    };
  }

  static createElement(
    tag: string,
    props: UIIRPropNode[] = [],
    children: UIIRNode[] = [],
    dynamicClassConditions?: Record<string, string>,
    events?: UIIREventNode[],
    bindings?: UIIRBindingNode[],
    key?: string,
    dynamicStyles?: Record<string, string>,
    loc?: SourceLocation
  ): UIIRElementNode {
    return {
      id: getUIIRId(`ui_el_${tag}`),
      kind: UIIRNodeKind.Element,
      tag,
      props,
      children,
      dynamicClassConditions,
      dynamicStyles,
      events,
      bindings,
      key,
      sourceLocation: loc,
    };
  }

  static createText(
    value: string,
    isExpression: boolean = false,
    templateDependencies?: string[],
    loc?: SourceLocation
  ): UIIRTextNode {
    return {
      id: getUIIRId('ui_text'),
      kind: UIIRNodeKind.Text,
      value,
      isExpression,
      templateDependencies,
      sourceLocation: loc,
    };
  }

  static createFragment(
    children: UIIRNode[] = [],
    key?: string,
    loc?: SourceLocation
  ): UIIRFragmentNode {
    return {
      id: getUIIRId('ui_frag'),
      kind: UIIRNodeKind.Fragment,
      children,
      key,
      sourceLocation: loc,
    };
  }

  static createComponentInstance(
    componentName: string,
    props: UIIRPropNode[] = [],
    children: UIIRNode[] = [],
    key?: string,
    loc?: SourceLocation
  ): UIIRComponentInstanceNode {
    return {
      id: getUIIRId(`ui_inst_${componentName}`),
      kind: UIIRNodeKind.ComponentInstance,
      componentName,
      props,
      children,
      key,
      sourceLocation: loc,
    };
  }

  static createSlot(
    name: string = 'default',
    fallbackChildren: UIIRNode[] = [],
    loc?: SourceLocation
  ): UIIRSlotNode {
    return {
      id: getUIIRId(`ui_slot_${name}`),
      kind: UIIRNodeKind.Slot,
      name,
      fallbackChildren,
      sourceLocation: loc,
    };
  }

  static createConditional(
    conditionExpr: string,
    thenBranch: UIIRNode,
    elseBranch?: UIIRNode,
    dependencies: string[] = [],
    loc?: SourceLocation
  ): UIIRConditionalNode {
    return {
      id: getUIIRId('ui_cond'),
      kind: UIIRNodeKind.Conditional,
      conditionExpr,
      thenBranch,
      elseBranch,
      dependencies,
      sourceLocation: loc,
    };
  }

  static createList(
    arrayExpr: string,
    itemVar: string,
    body: UIIRNode,
    keyExpr?: string,
    indexVar?: string,
    dependencies: string[] = [],
    loc?: SourceLocation
  ): UIIRListNode {
    return {
      id: getUIIRId('ui_list'),
      kind: UIIRNodeKind.List,
      arrayExpr,
      itemVar,
      indexVar,
      keyExpr,
      body,
      dependencies,
      sourceLocation: loc,
    };
  }

  static createEvent(
    eventName: string,
    targetSelector: string,
    handler: string,
    targetVar?: string,
    computation?: string,
    isFunctionCall?: boolean,
    loc?: SourceLocation
  ): UIIREventNode {
    return {
      id: getUIIRId(`ui_evt_${eventName}`),
      kind: UIIRNodeKind.Event,
      eventName,
      targetSelector,
      handler,
      targetVar,
      computation,
      isFunctionCall,
      sourceLocation: loc,
    };
  }

  static createBinding(
    bindingType: 'value' | 'checked' | 'group',
    stateVar: string,
    targetSelector: string,
    loc?: SourceLocation
  ): UIIRBindingNode {
    return {
      id: getUIIRId(`ui_bind_${bindingType}`),
      kind: UIIRNodeKind.Binding,
      bindingType,
      stateVar,
      targetSelector,
      sourceLocation: loc,
    };
  }
}
