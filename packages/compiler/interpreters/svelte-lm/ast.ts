import { SourceLocation } from '../../ast/types';

export enum SvelteNodeKind {
  Program = 'SvelteProgram',
  ComponentDeclaration = 'SvelteComponentDeclaration',
  StateDeclaration = 'SvelteStateDeclaration',
  ReactiveDeclaration = 'SvelteReactiveDeclaration',
  PropDeclaration = 'SveltePropDeclaration',
  Element = 'SvelteElement',
  ComponentInstance = 'SvelteComponentInstance',
  Fragment = 'SvelteFragment',
  Conditional = 'SvelteConditional',
  Each = 'SvelteEach',
  Slot = 'SvelteSlot',
  Text = 'SvelteText',
  Prop = 'SvelteProp',
  EventBinding = 'SvelteEventBinding',
  Binding = 'SvelteBinding',
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
  name: string; // 'default' or named slot
  children: SvelteUINode[]; // Fallback default children
}

export interface SvelteElementNode extends SvelteBaseNode {
  kind: SvelteNodeKind.Element;
  tag: string;
  isIntrinsic: boolean;
  props: SveltePropNode[];
  children: SvelteUINode[];
  bindingTarget?: string; // e.g. 'name' or 'count'
  bindingProperty?: string; // 'value' | 'checked'
  dynamicClassConditions?: Record<string, string>; // class:active="isActive"
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

export type SvelteUINode =
  | SvelteElementNode
  | SvelteComponentInstanceNode
  | SvelteFragmentNode
  | SvelteConditionalNode
  | SvelteEachNode
  | SvelteSlotNode
  | SvelteTextNode;

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
  rootComponent: string; // Default 'App' or first component
}

// Deterministic ID Generators
export function getSvelteProgramId(): string {
  return 'svelte-program';
}

export function getSvelteComponentDeclarationId(name: string): string {
  const clean = name.replace(/[^a-zA-Z0-9_-]/g, '_');
  return `svelte-component-${clean || 'Anonymous'}`;
}

export function getSvelteElementId(
  parentPath: string,
  tag: string,
  index: number,
  key?: string
): string {
  const cleanTag = tag.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  const keySuffix = key ? `-k_${String(key).replace(/[^a-zA-Z0-9_-]/g, '_')}` : `-i_${index}`;
  return `${parentPath}-${cleanTag}${keySuffix}`;
}

export function getSvelteComponentInstanceId(
  parentPath: string,
  compName: string,
  index: number,
  key?: string
): string {
  const cleanName = compName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const keySuffix = key ? `-k_${String(key).replace(/[^a-zA-Z0-9_-]/g, '_')}` : `-i_${index}`;
  return `${parentPath}-${cleanName}${keySuffix}`;
}

export function getSvelteFragmentId(parentPath: string, index: number, key?: string): string {
  const keySuffix = key ? `-k_${String(key).replace(/[^a-zA-Z0-9_-]/g, '_')}` : `-i_${index}`;
  return `${parentPath}-frag${keySuffix}`;
}

export function getSvelteSlotId(parentPath: string, slotName: string = 'default', index: number = 0): string {
  const cleanSlot = slotName.replace(/[^a-zA-Z0-9_-]/g, '_');
  return `${parentPath}-slot_${cleanSlot}_${index}`;
}

export function getSvelteTextId(parentPath: string, index: number): string {
  return `${parentPath}-txt-i_${index}`;
}

export function getSvelteStateId(componentName: string, stateName: string): string {
  const cleanComp = componentName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanState = stateName.replace(/[^a-zA-Z0-9_-]/g, '_');
  return `svelte-state-${cleanComp}-${cleanState}`;
}

export function getSvelteReactiveId(componentName: string, reactiveName: string): string {
  const cleanComp = componentName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanReactive = reactiveName.replace(/[^a-zA-Z0-9_-]/g, '_');
  return `svelte-reactive-${cleanComp}-${cleanReactive}`;
}

export function getSvelteEventHandlerId(
  componentName: string,
  eventName: string,
  selector: string,
  disambiguator: number = 0
): string {
  const cleanComp = componentName.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 24);
  const cleanEvt = eventName.toLowerCase().replace(/^(?:on:|on|@)/, '');
  const cleanSel = selector.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 24);
  const suffix = disambiguator > 0 ? `-${disambiguator}` : '';
  return `svelte-evt-${cleanComp}-${cleanEvt}-${cleanSel || 'node'}${suffix}`;
}
