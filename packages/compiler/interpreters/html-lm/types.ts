import { ASTNodeKind, SourceLocation } from '../../ast/types';
import { ComponentNode, PropertyNode, RootNode } from '../../ast/nodes';

export enum HTMLLMTokenType {
  IDENTIFIER = 'IDENTIFIER',
  OPEN_PAREN = 'OPEN_PAREN',
  CLOSE_PAREN = 'CLOSE_PAREN',
  TEXT = 'TEXT',
  WHITESPACE = 'WHITESPACE',
  EOF = 'EOF',
}

export interface HTMLLMToken {
  type: HTMLLMTokenType;
  value: string;
  location: SourceLocation;
}

export interface ElementFrame {
  kind: ASTNodeKind;
  tagName: string;
  customName?: string;
  node: ComponentNode;
  textBuffer: string;
  hasChildElements: boolean;
  location: SourceLocation;
}

export interface AttributeFrame {
  name: string;
  rawName: string;
  valueBuffer: string;
  parenDepth: number;
  location: SourceLocation;
}

export interface HTMLLMDiagnostic {
  message: string;
  severity: 'error' | 'warning' | 'info';
  location: SourceLocation;
}

export interface HTMLLMInterpreterOptions {
  trackLocations?: boolean;
  onError?: (diagnostic: HTMLLMDiagnostic) => void;
}
