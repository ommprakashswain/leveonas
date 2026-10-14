import { SourceLocation } from '../../ast/types';

export enum ReactNodeKind {
  Program = 'ReactProgram',
  ComponentDeclaration = 'ReactComponentDeclaration',
  StateDeclaration = 'ReactStateDeclaration',
  DerivedDeclaration = 'ReactDerivedDeclaration',
  Element = 'ReactElement',
  ComponentInstance = 'ReactComponentInstance',
  Fragment = 'ReactFragment',
  Conditional = 'ReactConditional',
  List = 'ReactList',
  Text = 'ReactText',
  Prop = 'ReactProp',
  EventHandler = 'ReactEventHandler',
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

export type ReactUINode =
  | ReactElementNode
  | ReactComponentInstanceNode
  | ReactFragmentNode
  | ReactConditionalNode
  | ReactListNode
  | ReactTextNode;

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
  rootComponent: string; // Default 'App' or first component
}

// Deterministic ID Generators
export function getReactProgramId(): string {
  return 'react-program';
}

export function getReactComponentDeclarationId(name: string): string {
  const clean = name.replace(/[^a-zA-Z0-9_-]/g, '_');
  return `react-comp-${clean || 'Anonymous'}`;
}

export function getReactElementId(
  parentPath: string,
  tag: string,
  index: number,
  key?: string
): string {
  const cleanTag = tag.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  const keySuffix = key ? `-k_${String(key).replace(/[^a-zA-Z0-9_-]/g, '_')}` : `-i_${index}`;
  return `${parentPath}-${cleanTag}${keySuffix}`;
}

export function getReactComponentInstanceId(
  parentPath: string,
  compName: string,
  index: number,
  key?: string
): string {
  const cleanName = compName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const keySuffix = key ? `-k_${String(key).replace(/[^a-zA-Z0-9_-]/g, '_')}` : `-i_${index}`;
  return `${parentPath}-${cleanName}${keySuffix}`;
}

export function getReactFragmentId(parentPath: string, index: number, key?: string): string {
  const keySuffix = key ? `-k_${String(key).replace(/[^a-zA-Z0-9_-]/g, '_')}` : `-i_${index}`;
  return `${parentPath}-frag${keySuffix}`;
}

export function getReactTextId(parentPath: string, index: number): string {
  return `${parentPath}-txt-i_${index}`;
}

export function getReactEventHandlerId(
  componentName: string,
  eventName: string,
  selector: string,
  disambiguator: number = 0
): string {
  const cleanComp = componentName.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 24);
  const cleanEvt = eventName.toLowerCase().replace(/^on/, '');
  const cleanSel = selector.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 24);
  const suffix = disambiguator > 0 ? `-${disambiguator}` : '';
  return `react-evt-${cleanComp}-${cleanEvt}-${cleanSel || 'node'}${suffix}`;
}
