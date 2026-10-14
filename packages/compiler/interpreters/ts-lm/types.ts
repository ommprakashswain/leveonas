import { SourceLocation } from '../../ast/types';

export type TSUnitClassification = 'RUNTIME' | 'TYPE_ONLY';

export type TSUnitKind =
  | 'Variable'
  | 'Function'
  | 'Interface'
  | 'TypeAlias'
  | 'Class'
  | 'Enum'
  | 'EventHandler'
  | 'DOMOperation'
  | 'Timer'
  | 'Import'
  | 'Export'
  | 'Expression'
  | 'Statement';

export type TSParserState =
  | 'IDLE'
  | 'IN_BLOCK'
  | 'IN_IDENTIFIER'
  | 'IN_TYPE_ANNOTATION'
  | 'IN_INTERFACE'
  | 'IN_TYPE_ALIAS'
  | 'IN_CLASS'
  | 'IN_ENUM'
  | 'IN_STRING'
  | 'IN_TEMPLATE_LITERAL'
  | 'IN_COMMENT_LINE'
  | 'IN_COMMENT_BLOCK'
  | 'IN_PAREN'
  | 'IN_BRACE'
  | 'IN_BRACKET'
  | 'IN_GENERICS'
  | 'COMPLETE_UNIT';

export interface TSLMDiagnostic {
  message: string;
  severity: 'error' | 'warning' | 'info';
  code: string;
  sourceLocation: SourceLocation;
  suggestion?: string;
}

export interface TSLMInterpreterOptions {
  onError?: (diagnostic: TSLMDiagnostic) => void;
  allowCustomGlobals?: boolean;
}

export interface TSTelemetryMetrics {
  tsLmOutputBytes: number;
  loweredJsBytes: number;
  typeOnlyUnitCount: number;
  runtimeUnitCount: number;
  tsParseLatency: number;
  tsLoweringLatency: number;
  firstTSUnitLatency?: number;
  firstLoweredJSUnitLatency?: number;
  firstExecutionLatency?: number;
}
