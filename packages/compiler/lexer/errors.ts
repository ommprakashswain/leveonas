import { Diagnostic } from './diagnostics';

export class LexerError extends Error {
  public diagnostics: Diagnostic[];

  constructor(message: string, diagnostics: Diagnostic[] = []) {
    super(message);
    this.name = 'LexerError';
    this.diagnostics = diagnostics;
  }
}
