import { Diagnostic } from './types';

export class ValidationError extends Error {
  constructor(public diagnostics: Diagnostic[]) {
    super(`Validation failed with ${diagnostics.length} diagnostics`);
    this.name = 'ValidationError';
  }
}
