import { LexicalToken } from '../lexer';

export enum DiagnosticSeverity {
  Error = 'Error',
  Warning = 'Warning',
  Info = 'Info',
}

export enum DiagnosticCode {
  MissingClosingBrace = 'MissingClosingBrace',
  MissingClosingBracket = 'MissingClosingBracket',
  UnexpectedToken = 'UnexpectedToken',
  UnknownProperty = 'UnknownProperty',
  InvalidNesting = 'InvalidNesting',
  UnexpectedEOF = 'UnexpectedEOF',
  DuplicateProperty = 'DuplicateProperty',
  MissingPropertyValue = 'MissingPropertyValue',
}

export interface Diagnostic {
  code: DiagnosticCode;
  message: string;
  severity: DiagnosticSeverity;
  line: number;
  column: number;
  offset: number;
}

export function createDiagnostic(
  code: DiagnosticCode,
  message: string,
  severity: DiagnosticSeverity,
  line: number,
  column: number,
  offset: number
): Diagnostic {
  return { code, message, severity, line, column, offset };
}
