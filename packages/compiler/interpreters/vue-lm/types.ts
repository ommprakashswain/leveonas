import { SourceLocation } from '../../ast/types';

export type VueNodeClassification =
  | 'COMPONENT'
  | 'ELEMENT'
  | 'FRAGMENT'
  | 'CONDITIONAL'
  | 'LIST'
  | 'SLOT'
  | 'TEXT';

export type VueParserState =
  | 'IDLE'
  | 'IN_COMPONENT_DECLARATION'
  | 'IN_BODY'
  | 'IN_ELEMENT'
  | 'IN_PROPS'
  | 'IN_STRING'
  | 'IN_EXPRESSION'
  | 'IN_CONDITIONAL'
  | 'IN_LIST'
  | 'IN_STATE'
  | 'IN_COMPUTED'
  | 'IN_SLOT';

export interface VueLMDiagnostic {
  message: string;
  severity: 'error' | 'warning' | 'info';
  code: string;
  sourceLocation: SourceLocation;
  suggestion?: string;
}

export interface VueLMInterpreterOptions {
  onError?: (diagnostic: VueLMDiagnostic) => void;
  allowCustomComponents?: boolean;
  rootComponent?: string;
}

export interface VueTelemetryMetrics {
  vueLmOutputBytes: number;
  componentCount: number;
  reactiveStateCount: number;
  computedCount: number;
  domPatchCount: number;
  domPatchBytes: number;
  firstVueComponentLatency?: number;
  firstDOMPatchLatency?: number;
  firstInteractionLatency?: number;
  completionLatency?: number;
}
