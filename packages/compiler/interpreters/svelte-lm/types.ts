import { SourceLocation } from '../../ast/types';

export type SvelteNodeClassification =
  | 'COMPONENT'
  | 'ELEMENT'
  | 'FRAGMENT'
  | 'CONDITIONAL'
  | 'EACH'
  | 'SLOT'
  | 'TEXT';

export type SvelteParserState =
  | 'IDLE'
  | 'IN_COMPONENT_DECLARATION'
  | 'IN_BODY'
  | 'IN_ELEMENT'
  | 'IN_PROPS'
  | 'IN_STRING'
  | 'IN_EXPRESSION'
  | 'IN_CONDITIONAL'
  | 'IN_EACH'
  | 'IN_STATE'
  | 'IN_REACTIVE'
  | 'IN_BINDING'
  | 'IN_SLOT';

export interface SvelteLMDiagnostic {
  message: string;
  severity: 'error' | 'warning' | 'info';
  code: string;
  sourceLocation: SourceLocation;
  suggestion?: string;
}

export interface SvelteLMInterpreterOptions {
  onError?: (diagnostic: SvelteLMDiagnostic) => void;
  allowCustomComponents?: boolean;
  rootComponent?: string;
}

export interface SvelteReactiveDependencyNode {
  sourceVariable: string;
  dependentVariables: string[];
  dependentDomNodeIds: string[];
  computationExpression?: string;
}

export interface SvelteReactivityGraphData {
  componentName: string;
  instancePath: string;
  state: Array<{ name: string; initialValue: any; currentValue?: any }>;
  reactive: Array<{ name: string; expression: string; dependencies: string[]; currentValue?: any }>;
  domDependencies: Array<{
    domNodeId: string;
    kind: string;
    template?: string;
    propName?: string;
    className?: string;
    expression?: string;
    dependencies: string[];
  }>;
  edges: {
    varToReactive: Record<string, string[]>;
    varToDOM: Record<string, string[]>;
  };
}

export interface SvelteTelemetryMetrics {
  svelteLmOutputBytes: number;
  componentCount: number;
  stateCount: number;
  reactiveDeclarationCount: number;
  dependencyCount: number;
  domPatchCount: number;
  domPatchBytes: number;
  firstSvelteUnitLatency?: number;
  firstDOMPatchLatency?: number;
  firstInteractionLatency?: number;
  completionLatency?: number;
}
