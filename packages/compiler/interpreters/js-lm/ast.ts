import { SourceLocation } from '../../ast/types';
import { JSUnitKind } from './types';

export enum JSNodeKind {
  Program = 'JSProgram',
  Unit = 'JSUnit',
  VariableDeclaration = 'JSVariableDeclaration',
  Function = 'JSFunctionDeclaration',
  FunctionDeclaration = 'JSFunctionDeclaration',
  ArrowFunction = 'JSArrowFunction',
  Literal = 'JSLiteral',
  Identifier = 'JSIdentifier',
  BinaryExpression = 'JSBinaryExpression',
  UnaryExpression = 'JSUnaryExpression',
  CallExpression = 'JSCallExpression',
  MemberExpression = 'JSMemberExpression',
  Assignment = 'JSAssignmentExpression',
  Return = 'JSReturnStatement',
  IfStatement = 'JSIfStatement',
  ConditionalExpression = 'JSConditionalExpression',
  Block = 'JSBlockStatement',
  BlockStatement = 'JSBlockStatement',
  EventHandler = 'JSEventHandler',
  DOMOperation = 'JSDOMOperation',
  Timer = 'JSTimer',
  TimerOperation = 'JSTimer',
  ExpressionStatement = 'JSExpressionStatement',
}

export interface JSBaseNode {
  id: string;
  kind: JSNodeKind;
  sourceLocation?: SourceLocation;
}

export interface JSLiteralNode extends JSBaseNode {
  kind: JSNodeKind.Literal;
  value: string | number | boolean | null | undefined;
  raw: string;
}

export interface JSIdentifierNode extends JSBaseNode {
  kind: JSNodeKind.Identifier;
  name: string;
}

export interface JSBinaryExpressionNode extends JSBaseNode {
  kind: JSNodeKind.BinaryExpression;
  operator: string;
  left: JSASTNode | string;
  right: JSASTNode | string;
}

export interface JSUnaryExpressionNode extends JSBaseNode {
  kind: JSNodeKind.UnaryExpression;
  operator: string;
  argument: JSASTNode | string;
  prefix: boolean;
}

export interface JSCallExpressionNode extends JSBaseNode {
  kind: JSNodeKind.CallExpression;
  callee: JSASTNode | string;
  arguments: (JSASTNode | string)[];
}

export interface JSMemberExpressionNode extends JSBaseNode {
  kind: JSNodeKind.MemberExpression;
  object: JSASTNode | string;
  property: JSASTNode | string;
  computed: boolean;
}

export interface JSAssignmentNode extends JSBaseNode {
  kind: JSNodeKind.Assignment;
  operator: string;
  left: JSASTNode | string;
  right: JSASTNode | string;
}

export interface JSReturnNode extends JSBaseNode {
  kind: JSNodeKind.Return;
  argument?: JSASTNode | string;
}

export interface JSConditionalExpressionNode extends JSBaseNode {
  kind: JSNodeKind.ConditionalExpression;
  test: JSASTNode | string;
  consequent: JSASTNode | string;
  alternate: JSASTNode | string;
}

export interface JSVariableDeclarationNode extends JSBaseNode {
  kind: JSNodeKind.VariableDeclaration;
  varKind: 'const' | 'let' | 'var';
  identifier: string;
  initialValue?: string | JSASTNode;
}

export interface JSFunctionDeclarationNode extends JSBaseNode {
  kind: JSNodeKind.FunctionDeclaration;
  name: string;
  params: string[];
  body: string | JSBlockStatementNode;
  isAsync?: boolean;
}

export interface JSArrowFunctionNode extends JSBaseNode {
  kind: JSNodeKind.ArrowFunction;
  params: string[];
  body: string | JSBlockStatementNode;
  isAsync?: boolean;
}

export interface JSEventHandlerNode extends JSBaseNode {
  kind: JSNodeKind.EventHandler;
  eventName: string;
  targetSelector: string;
  handlerCode: string;
  debounceMs?: number;
}

export interface JSDOMOperationNode extends JSBaseNode {
  kind: JSNodeKind.DOMOperation;
  operation: string;
  targetSelector: string;
  args: string[];
}

export interface JSTimerNode extends JSBaseNode {
  kind: JSNodeKind.Timer;
  timerType: 'setTimeout' | 'setInterval' | 'clearTimeout' | 'clearInterval';
  callbackCode?: string;
  delayMs?: number;
  timerIdRef?: string;
}

export interface JSExpressionStatementNode extends JSBaseNode {
  kind: JSNodeKind.ExpressionStatement;
  code: string;
  expression?: JSASTNode;
}

export interface JSBlockStatementNode extends JSBaseNode {
  kind: JSNodeKind.BlockStatement;
  units: JSUnitNode[];
}

export interface JSIfStatementNode extends JSBaseNode {
  kind: JSNodeKind.IfStatement;
  condition: string | JSASTNode;
  consequent: string | JSBlockStatementNode;
  alternate?: string | JSBlockStatementNode;
}

export type JSASTNode =
  | JSLiteralNode
  | JSIdentifierNode
  | JSBinaryExpressionNode
  | JSUnaryExpressionNode
  | JSCallExpressionNode
  | JSMemberExpressionNode
  | JSAssignmentNode
  | JSReturnNode
  | JSConditionalExpressionNode
  | JSVariableDeclarationNode
  | JSFunctionDeclarationNode
  | JSArrowFunctionNode
  | JSEventHandlerNode
  | JSDOMOperationNode
  | JSTimerNode
  | JSExpressionStatementNode
  | JSBlockStatementNode
  | JSIfStatementNode;

export interface JSUnitNode extends JSBaseNode {
  kind: JSNodeKind.Unit;
  unitKind: JSUnitKind;
  code: string;
  rawCode: string;
  isComplete: boolean;
  meta?: {
    eventName?: string;
    targetSelector?: string;
    identifier?: string;
    functionName?: string;
    timerType?: string;
    delayMs?: number;
    operation?: string;
  };
  details?: JSASTNode;
}

export interface JSProgramNode extends JSBaseNode {
  kind: JSNodeKind.Program;
  units: JSUnitNode[];
}

// Deterministic ID Generators
export function getJSProgramId(): string {
  return 'js-program';
}

export function getJSUnitId(unitKind: string, signature: string, disambiguator: number = 0): string {
  const cleanSig = signature.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 32);
  const suffix = disambiguator > 0 ? `-${disambiguator}` : '';
  return `js-unit-${unitKind.toLowerCase()}-${cleanSig || 'unit'}${suffix}`;
}

export function getJSEventHandlerId(eventName: string, selector: string, disambiguator: number = 0): string {
  const cleanSel = selector.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 24);
  const suffix = disambiguator > 0 ? `-${disambiguator}` : '';
  return `js-evt-${eventName.toLowerCase()}-${cleanSel || 'global'}${suffix}`;
}

export function getJSTimerId(timerType: string, disambiguator: number = 0): string {
  const suffix = disambiguator > 0 ? `-${disambiguator}` : '';
  return `js-timer-${timerType.toLowerCase()}${suffix}`;
}

export function getJSDOMOperationId(operation: string, selector: string, disambiguator: number = 0): string {
  const cleanSel = selector.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 24);
  const suffix = disambiguator > 0 ? `-${disambiguator}` : '';
  return `js-dom-${operation.toLowerCase()}-${cleanSel || 'node'}${suffix}`;
}

export function getJSNodeId(nodeKind: string, name: string, disambiguator: number = 0): string {
  const cleanName = name.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 24);
  const suffix = disambiguator > 0 ? `-${disambiguator}` : '';
  return `js-${nodeKind.toLowerCase()}-${cleanName || 'node'}${suffix}`;
}
