import { Position } from '../scanner';
import { LexicalToken } from './lexer';

export enum DiagnosticSeverity {
  Error = 'Error',
  Warning = 'Warning',
  Info = 'Info',
}

export enum DiagnosticCode {
  UnknownKeyword = 'UnknownKeyword',
  UnknownProperty = 'UnknownProperty',
  UnexpectedIdentifier = 'UnexpectedIdentifier',
  ReservedKeywordMisuse = 'ReservedKeywordMisuse',
  DuplicateProperty = 'DuplicateProperty',
  UnknownEnum = 'UnknownEnum',
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
