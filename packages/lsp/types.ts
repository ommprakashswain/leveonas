/**
 * Leveonas Language Server Protocol & Developer Tooling Types
 */

export interface Position {
  line: number; // 0-based
  character: number; // 0-based
  offset?: number; // 0-based character offset from start of document
}

export interface Range {
  start: Position;
  end: Position;
}

export enum DiagnosticSeverity {
  Error = 1,
  Warning = 2,
  Information = 3,
  Hint = 4,
}

export interface LSPDiagnostic {
  range: Range;
  severity: DiagnosticSeverity;
  code?: string | number;
  source: string;
  message: string;
  suggestion?: string;
  isIncomplete?: boolean;
  data?: Record<string, unknown>;
}

export enum CompletionItemKind {
  Text = 1,
  Method = 2,
  Function = 3,
  Constructor = 4,
  Field = 5,
  Variable = 6,
  Class = 7,
  Interface = 8,
  Module = 9,
  Property = 10,
  Unit = 11,
  Value = 12,
  Enum = 13,
  Keyword = 14,
  Snippet = 15,
  Color = 16,
  File = 17,
  Reference = 18,
  Folder = 19,
  EnumMember = 20,
  Constant = 21,
  Struct = 22,
  Event = 23,
  Operator = 24,
  TypeParameter = 25,
}

export interface CompletionItem {
  label: string;
  kind: CompletionItemKind;
  detail?: string;
  documentation?: string;
  insertText?: string;
  sortText?: string;
  filterText?: string;
}

export interface Hover {
  contents: {
    kind: 'markdown' | 'plaintext';
    value: string;
  };
  range?: Range;
}

export interface Location {
  uri?: string;
  range: Range;
}

export enum SymbolKind {
  File = 1,
  Module = 2,
  Namespace = 3,
  Package = 4,
  Class = 5,
  Method = 6,
  Property = 7,
  Field = 8,
  Constructor = 9,
  Enum = 10,
  Interface = 11,
  Function = 12,
  Variable = 13,
  Constant = 14,
  String = 15,
  Number = 16,
  Boolean = 17,
  Array = 18,
  Object = 19,
  Key = 20,
  Null = 21,
  EnumMember = 22,
  Struct = 23,
  Event = 24,
  Operator = 25,
  TypeParameter = 26,
}

export interface DocumentSymbol {
  name: string;
  detail?: string;
  kind: SymbolKind;
  range: Range;
  selectionRange: Range;
  children?: DocumentSymbol[];
}

export interface TextEdit {
  range: Range;
  newText: string;
}

export interface FormattingOptions {
  tabSize?: number;
  insertSpaces?: boolean;
  trimTrailingWhitespace?: boolean;
  insertFinalNewline?: boolean;
}

export type EmbeddedBlockType =
  | 'html'
  | 'css'
  | 'js'
  | 'ts'
  | 'react'
  | 'vue'
  | 'svelte'
  | 'angular'
  | 'lm';

export interface EmbeddedBlock {
  type: EmbeddedBlockType;
  content: string;
  range: Range;
  contentRange: Range;
  tagRange?: Range;
}

export interface ReactivityNodeInfo {
  id: string;
  name: string;
  kind: 'state' | 'derived' | 'dom' | 'list';
  expression?: string;
  dependencies: string[];
  dependents: string[];
  domTarget?: string;
}

export interface ReactivityGraphInfo {
  nodes: ReactivityNodeInfo[];
  edges: { from: string; to: string; kind?: string }[];
}

export interface StreamStepRecord {
  step: number;
  timestampMs: number;
  providerChunk?: string;
  lmUnit?: string;
  astNodeCount?: number;
  uiIRNodeCount?: number;
  patchCount?: number;
  patchSummary?: string;
}

export interface DocumentInspection {
  raw: string;
  detectedFramework: EmbeddedBlockType;
  streamStatus: 'VALID' | 'INCOMPLETE' | 'INVALID';
  diagnostics: LSPDiagnostic[];
  ast: unknown | null;
  frameworkAST: unknown | null;
  uiIR: unknown | null;
  runtimeIR: unknown | null;
  reactivityGraph: ReactivityGraphInfo;
  patchOperations: Array<{
    op: string;
    targetId?: string;
    payload?: unknown;
    bytes: number;
  }>;
  symbols: DocumentSymbol[];
  streamTimeline?: StreamStepRecord[];
  nodeCount: {
    astNodes: number;
    uiIRNodes: number;
    stateVariables: number;
    computedValues: number;
    domDependencies: number;
    patchOps: number;
  };
}
