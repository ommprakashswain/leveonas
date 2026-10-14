import { SourceLocation } from '../../ast/types';

export type JSUnitKind =
  | 'Variable'
  | 'Function'
  | 'ArrowFunction'
  | 'EventHandler'
  | 'DOMOperation'
  | 'Timer'
  | 'Expression'
  | 'Statement'
  | 'Block'
  | 'Return'
  | 'Conditional'
  | 'IfStatement';

export type JSParserState =
  | 'IDLE'
  | 'IN_BLOCK'
  | 'IN_IDENTIFIER'
  | 'IN_STRING'
  | 'IN_TEMPLATE_LITERAL'
  | 'IN_COMMENT_LINE'
  | 'IN_COMMENT_BLOCK'
  | 'IN_PAREN'
  | 'IN_BRACE'
  | 'IN_BRACKET'
  | 'COMPLETE_UNIT';

export interface JSLMDiagnostic {
  message: string;
  severity: 'error' | 'warning' | 'info';
  code: string;
  sourceLocation: SourceLocation;
  suggestion?: string;
}

export interface JSLMInterpreterOptions {
  onError?: (diagnostic: JSLMDiagnostic) => void;
  allowCustomGlobals?: boolean;
}
