import { SourceLocation } from '../../ast/types';

export interface CSSLMDiagnostic {
  message: string;
  severity: 'error' | 'warning' | 'info';
  location: SourceLocation;
  code?: string;
}

export interface CSSLMInterpreterOptions {
  onError?: (diagnostic: CSSLMDiagnostic) => void;
  onWarning?: (diagnostic: CSSLMDiagnostic) => void;
}

export type CSSParserState =
  | 'IDLE'
  | 'IN_SELECTOR'
  | 'IN_RULE_BLOCK'
  | 'IN_PROPERTY'
  | 'IN_VALUE'
  | 'IN_AT_RULE_HEAD'
  | 'IN_AT_RULE_BLOCK'
  | 'IN_KEYFRAMES_HEAD'
  | 'IN_KEYFRAMES_BLOCK'
  | 'IN_KEYFRAME_STEP_HEAD'
  | 'IN_KEYFRAME_STEP_BLOCK'
  | 'IN_COMMENT'
  | 'IN_STRING';

export interface CSSDeclarationState {
  property: string;
  value: string;
  important: boolean;
  startLoc: SourceLocation;
}

export interface CSSRuleState {
  id: string;
  selector: string;
  declarations: CSSDeclarationState[];
  startLoc: SourceLocation;
  parentRuleId?: string;
}

export interface CSSKeyframeStepState {
  id: string;
  stepSelector: string; // '0%', 'from', '100%', 'to'
  declarations: CSSDeclarationState[];
  startLoc: SourceLocation;
}

export interface CSSKeyframesState {
  id: string;
  name: string;
  steps: CSSKeyframeStepState[];
  startLoc: SourceLocation;
}

export interface CSSMediaRuleState {
  id: string;
  query: string;
  rules: CSSRuleState[];
  startLoc: SourceLocation;
}
