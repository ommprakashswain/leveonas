export class TokenizerError extends Error {
  public line: number;
  public column: number;
  public offset: number;

  constructor(message: string, line: number, column: number, offset: number) {
    super(`${message} at line ${line}, column ${column} (offset ${offset})`);
    this.name = 'TokenizerError';
    this.line = line;
    this.column = column;
    this.offset = offset;
  }
}
