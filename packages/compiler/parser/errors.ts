import { Diagnostic } from './diagnostics';

export class ParserError extends Error {
  public diagnostics: Diagnostic[];

  constructor(message: string, diagnostics: Diagnostic[] = []) {
    super(message);
    this.name = 'ParserError';
    this.diagnostics = diagnostics;
  }
}
