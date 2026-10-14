import { Position } from './position';

export class ScannerError extends Error {
  constructor(message: string, public readonly position: Position) {
    super(`${message} at line ${position.line}, column ${position.column} (offset ${position.offset})`);
    this.name = 'ScannerError';
  }
}
