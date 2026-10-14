import { SourceLocation } from '../ast/types';
import { PatchOperation } from '../../runtime/incremental/patch-generator/types';

/**
 * Leveonas Common UI IR (Intermediate Representation)
 * Framework-neutral UI & Reactivity Model for React, Vue, Svelte, and future frameworks.
 */

export enum UIIRNodeKind {
  Program = 'UIProgram',
  Component = 'UIComponent',
  State = 'UIState',
  Derived = 'UIDerived',
  Prop = 'UIProp',
  Element = 'UIElement',
  Text = 'UIText',
  Fragment = 'UIFragment',
  ComponentInstance = 'UIComponentInstance',
  Slot = 'UISlot',
  Conditional = 'UIConditional',
  List = 'UIList',
  Event = 'UIEvent',
  Binding = 'UIBinding',
}

export interface UIIRBaseNode {
  id: string;
  kind: UIIRNodeKind;
  sourceLocation?: SourceLocation;
}

export interface UIIRPropNode extends UIIRBaseNode {
  kind: UIIRNodeKind.Prop;
  name: string;
  value: string | number | boolean;
  rawValue?: string;
  isDynamic?: boolean;
  isExpression?: boolean;
}

export interface UIIRTextNode extends UIIRBaseNode {
  kind: UIIRNodeKind.Text;
  value: string;
  isExpression?: boolean;
  templateDependencies?: string[];
}

export interface UIIRStateDeclarationNode extends UIIRBaseNode {
  kind: UIIRNodeKind.State;
  stateName: string;
  initialValue: any;
  typeAnnotation?: string;
}

export interface UIIRDerivedDeclarationNode extends UIIRBaseNode {
  kind: UIIRNodeKind.Derived;
  derivedName: string;
  expression: string;
  dependencies: string[];
}

export interface UIIRPropDeclarationNode extends UIIRBaseNode {
  kind: UIIRNodeKind.Prop;
  propName: string;
  defaultValue?: any;
  typeAnnotation?: string;
}

export interface UIIRSlotNode extends UIIRBaseNode {
  kind: UIIRNodeKind.Slot;
  name: string;
  fallbackChildren: UIIRNode[];
}

export interface UIIRElementNode extends UIIRBaseNode {
  kind: UIIRNodeKind.Element;
  tag: string;
  props: UIIRPropNode[];
  children: UIIRNode[];
  key?: string;
  dynamicClassConditions?: Record<string, string>; // className -> conditionExpression
  dynamicStyles?: Record<string, string>; // styleProp -> expression
  events?: UIIREventNode[];
  bindings?: UIIRBindingNode[];
}

export interface UIIRComponentInstanceNode extends UIIRBaseNode {
  kind: UIIRNodeKind.ComponentInstance;
  componentName: string;
  props: UIIRPropNode[];
  children: UIIRNode[];
  key?: string;
}

export interface UIIRFragmentNode extends UIIRBaseNode {
  kind: UIIRNodeKind.Fragment;
  children: UIIRNode[];
  key?: string;
}

export interface UIIRConditionalNode extends UIIRBaseNode {
  kind: UIIRNodeKind.Conditional;
  conditionExpr: string;
  dependencies: string[];
  thenBranch: UIIRNode;
  elseBranch?: UIIRNode;
}

export interface UIIRListNode extends UIIRBaseNode {
  kind: UIIRNodeKind.List;
  arrayExpr: string;
  itemVar: string;
  indexVar?: string;
  keyExpr?: string;
  body: UIIRNode;
  dependencies: string[];
}

export interface UIIREventNode extends UIIRBaseNode {
  kind: UIIRNodeKind.Event;
  eventName: string;
  targetSelector: string;
  handler: string;
  targetVar?: string;
  computation?: string;
  isFunctionCall?: boolean;
}

export interface UIIRBindingNode extends UIIRBaseNode {
  kind: UIIRNodeKind.Binding;
  bindingType: 'value' | 'checked' | 'group';
  stateVar: string;
  targetSelector: string;
}

export type UIIRNode =
  | UIIRElementNode
  | UIIRTextNode
  | UIIRFragmentNode
  | UIIRComponentInstanceNode
  | UIIRSlotNode
  | UIIRConditionalNode
  | UIIRListNode;

export interface UIIRComponentDeclarationNode extends UIIRBaseNode {
  kind: UIIRNodeKind.Component;
  name: string;
  propsType?: string;
  propDeclarations: UIIRPropDeclarationNode[];
  stateDeclarations: UIIRStateDeclarationNode[];
  derivedDeclarations: UIIRDerivedDeclarationNode[];
  body: UIIRNode[];
}

export interface UIIRProgramNode extends UIIRBaseNode {
  kind: UIIRNodeKind.Program;
  components: UIIRComponentDeclarationNode[];
  rootComponent: string;
}

/**
 * Serializable Reactivity Graph Data Structure
 * Consumed directly by Leveonas Browser Runtime (zero compiler classes)
 */
export type DOMDependencyKind = 'TEXT' | 'PROPERTY' | 'CLASS' | 'STYLE' | 'BINDING' | 'CONDITIONAL' | 'LIST';

export interface SerializableDOMDependency {
  domNodeId: string;
  kind: DOMDependencyKind;
  template?: string;
  propName?: string;
  className?: string;
  styleProp?: string;
  expression?: string;
  dependencies: string[];
  currentBranch?: 'then' | 'else';
  // Conditional serializable definitions
  thenBranch?: UIIRNode;
  elseBranch?: UIIRNode;
  parentPath?: string;
  compInstancePath?: string;
  ownerComponent?: string;
  index?: number;
  // List serializable definitions
  arrayExpr?: string;
  itemVar?: string;
  indexVar?: string;
  keyExpr?: string;
  body?: UIIRNode;
  containerId?: string;
  renderedKeys?: string[];
}

export interface SerializableDerivedInfo {
  name: string;
  expression: string;
  dependencies: string[];
  currentValue?: any;
}

export interface SerializableStateInfo {
  name: string;
  initialValue: any;
  currentValue?: any;
}

export interface UIReactivityDefinition {
  componentName: string;
  instancePath: string;
  state: Record<string, any>;
  derived: Record<string, { expression: string; dependencies: string[]; }>;
  domDependencies: Record<string, SerializableDOMDependency>;
  edges: {
    varToDerived: Record<string, string[]>;
    varToDOM: Record<string, string[]>;
  };
}

export interface UIReconcilerMetrics {
  componentInstancesCount: number;
  totalNodesCount: number;
  stateCount: number;
  derivedCount: number;
  domDependenciesCount: number;
  reconciliationTimeMs: number;
}
