import { SourceLocation } from '../../ast/types';

export type ReactNodeClassification = 'INTRINSIC' | 'COMPONENT' | 'FRAGMENT' | 'CONDITIONAL' | 'LIST' | 'TEXT';

export type ReactParserState =
  | 'IDLE'
  | 'IN_COMPONENT_DECLARATION'
  | 'IN_PARAMS'
  | 'IN_BODY'
  | 'IN_ELEMENT'
  | 'IN_PROPS'
  | 'IN_STRING'
  | 'IN_EXPRESSION'
  | 'IN_CONDITIONAL'
  | 'IN_LIST'
  | 'IN_STATE';

export interface ReactLMDiagnostic {
  message: string;
  severity: 'error' | 'warning' | 'info';
  code: string;
  sourceLocation: SourceLocation;
  suggestion?: string;
}

export interface ReactLMInterpreterOptions {
  onError?: (diagnostic: ReactLMDiagnostic) => void;
  allowCustomComponents?: boolean;
  rootComponent?: string;
}

export interface ReactTelemetryMetrics {
  reactLmOutputBytes: number;
  equivalentJsxBytes: number;
  componentCount: number;
  domPatchBytes: number;
  reconciliationLatencyMs: number;
  firstComponentLatencyMs?: number;
  firstDOMPatchLatencyMs?: number;
  completionLatencyMs?: number;
}
