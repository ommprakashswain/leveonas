import { SourceLocation } from '../../ast/types';

export class HTMLLMError extends Error {
  public location?: SourceLocation;

  constructor(message: string, location?: SourceLocation) {
    super(message);
    this.name = 'HTMLLMError';
    this.location = location;
  }
}
