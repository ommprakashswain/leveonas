import { SourceLocation } from '../../ast/types';

export enum VueNodeKind {
  Program = 'VueProgram',
  ComponentDeclaration = 'VueComponentDeclaration',
  StateDeclaration = 'VueStateDeclaration',
  ComputedDeclaration = 'VueComputedDeclaration',
  Element = 'VueElement',
  ComponentInstance = 'VueComponentInstance',
  Fragment = 'VueFragment',
  Conditional = 'VueConditional',
  List = 'VueList',
  Slot = 'VueSlot',
  Text = 'VueText',
  Prop = 'VueProp',
  EventBinding = 'VueEventBinding',
  ModelBinding = 'VueModelBinding',
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
  name: string; // 'default' or named slot
  children: VueUINode[]; // Fallback default children
}

export interface VueElementNode extends VueBaseNode {
  kind: VueNodeKind.Element;
  tag: string;
  isIntrinsic: boolean;
  props: VuePropNode[];
  children: VueUINode[];
  modelBinding?: string; // e.g. 'count' or 'username'
  showCondition?: string; // e.g. 'isVisible'
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

export type VueUINode =
  | VueElementNode
  | VueComponentInstanceNode
  | VueFragmentNode
  | VueConditionalNode
  | VueListNode
  | VueSlotNode
  | VueTextNode;

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
  rootComponent: string; // Default 'App' or first component
}

// Deterministic ID Generators
export function getVueProgramId(): string {
  return 'vue-program';
}

export function getVueComponentDeclarationId(name: string): string {
  const clean = name.replace(/[^a-zA-Z0-9_-]/g, '_');
  return `vue-component-${clean || 'Anonymous'}`;
}

export function getVueElementId(
  parentPath: string,
  tag: string,
  index: number,
  key?: string
): string {
  const cleanTag = tag.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  const keySuffix = key ? `-k_${String(key).replace(/[^a-zA-Z0-9_-]/g, '_')}` : `-i_${index}`;
  return `${parentPath}-${cleanTag}${keySuffix}`;
}

export function getVueComponentInstanceId(
  parentPath: string,
  compName: string,
  index: number,
  key?: string
): string {
  const cleanName = compName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const keySuffix = key ? `-k_${String(key).replace(/[^a-zA-Z0-9_-]/g, '_')}` : `-i_${index}`;
  return `${parentPath}-${cleanName}${keySuffix}`;
}

export function getVueFragmentId(parentPath: string, index: number, key?: string): string {
  const keySuffix = key ? `-k_${String(key).replace(/[^a-zA-Z0-9_-]/g, '_')}` : `-i_${index}`;
  return `${parentPath}-frag${keySuffix}`;
}

export function getVueSlotId(parentPath: string, slotName: string = 'default', index: number = 0): string {
  const cleanSlot = slotName.replace(/[^a-zA-Z0-9_-]/g, '_');
  return `${parentPath}-slot_${cleanSlot}_${index}`;
}

export function getVueTextId(parentPath: string, index: number): string {
  return `${parentPath}-txt-i_${index}`;
}

export function getVueStateId(componentName: string, stateName: string): string {
  const cleanComp = componentName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanState = stateName.replace(/[^a-zA-Z0-9_-]/g, '_');
  return `vue-state-${cleanComp}-${cleanState}`;
}

export function getVueComputedId(componentName: string, computedName: string): string {
  const cleanComp = componentName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanCompVal = computedName.replace(/[^a-zA-Z0-9_-]/g, '_');
  return `vue-computed-${cleanComp}-${cleanCompVal}`;
}

export function getVueEventHandlerId(
  componentName: string,
  eventName: string,
  selector: string,
  disambiguator: number = 0
): string {
  const cleanComp = componentName.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 24);
  const cleanEvt = eventName.toLowerCase().replace(/^(?:on|@)/, '');
  const cleanSel = selector.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 24);
  const suffix = disambiguator > 0 ? `-${disambiguator}` : '';
  return `vue-evt-${cleanComp}-${cleanEvt}-${cleanSel || 'node'}${suffix}`;
}
