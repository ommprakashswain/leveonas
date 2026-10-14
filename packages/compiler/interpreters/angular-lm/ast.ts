import { SourceLocation } from '../../ast/types';

export enum AngularNodeKind {
  Program = 'AngularProgram',
  ComponentDeclaration = 'AngularComponentDeclaration',
  StateDeclaration = 'AngularStateDeclaration',
  DerivedDeclaration = 'AngularDerivedDeclaration',
  InputDeclaration = 'AngularInputDeclaration',
  OutputDeclaration = 'AngularOutputDeclaration',
  Element = 'AngularElement',
  ComponentInstance = 'AngularComponentInstance',
  Fragment = 'AngularFragment',
  Conditional = 'AngularConditional',
  For = 'AngularFor',
  ContentProjection = 'AngularContentProjection',
  Text = 'AngularText',
  Prop = 'AngularProp',
  EventBinding = 'AngularEventBinding',
  PropertyBinding = 'AngularPropertyBinding',
  ClassBinding = 'AngularClassBinding',
  StyleBinding = 'AngularStyleBinding',
  TwoWayBinding = 'AngularTwoWayBinding',
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
  name: string; // 'default' or selector
  children: AngularUINode[]; // Fallback projected children
}

export interface AngularElementNode extends AngularBaseNode {
  kind: AngularNodeKind.Element;
  tag: string;
  isIntrinsic: boolean;
  props: AngularPropNode[];
  children: AngularUINode[];
  modelBinding?: string; // [(ngModel)]="name"
  dynamicClassConditions?: Record<string, string>; // [class.active]="isActive"
  dynamicStyles?: Record<string, string>; // [style.color]="color"
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

export type AngularUINode =
  | AngularElementNode
  | AngularComponentInstanceNode
  | AngularFragmentNode
  | AngularConditionalNode
  | AngularForNode
  | AngularContentProjectionNode
  | AngularTextNode;

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

let idCounter = 0;

export function resetAngularIdCounter(): void {
  idCounter = 0;
}

export function getAngularProgramId(): string {
  return `angular_prog_${++idCounter}`;
}

export function getAngularComponentDeclarationId(name: string): string {
  return `angular-component-${name}`;
}

export function getAngularComponentInstanceId(name: string): string {
  return `angular-inst-${name}_${++idCounter}`;
}

export function getAngularElementId(tag: string, index?: number): string {
  return index !== undefined ? `angular_${tag}_${index}` : `angular_${tag}_${++idCounter}`;
}

export function getAngularFragmentId(): string {
  return `angular_frag_${++idCounter}`;
}

export function getAngularTextId(index?: number): string {
  return index !== undefined ? `angular_txt_${index}` : `angular_txt_${++idCounter}`;
}

export function getAngularPropId(name: string): string {
  return `angular_prop_${name}_${++idCounter}`;
}

export function getAngularStateDeclarationId(name: string): string {
  return `angular_state_${name}_${++idCounter}`;
}

export function getAngularDerivedDeclarationId(name: string): string {
  return `angular_computed_${name}_${++idCounter}`;
}

export function getAngularInputDeclarationId(name: string): string {
  return `angular_input_${name}_${++idCounter}`;
}

export function getAngularOutputDeclarationId(name: string): string {
  return `angular_output_${name}_${++idCounter}`;
}

export function getAngularConditionalId(): string {
  return `angular_if_${++idCounter}`;
}

export function getAngularForId(): string {
  return `angular_for_${++idCounter}`;
}

export function getAngularContentProjectionId(name: string): string {
  return `angular_ng_content_${name}_${++idCounter}`;
}
