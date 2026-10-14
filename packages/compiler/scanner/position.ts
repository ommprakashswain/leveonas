export class Position {
  constructor(
    public readonly line: number,
    public readonly column: number,
    public readonly offset: number
  ) {}

  public advance(char: string): Position {
    if (char === '\n') {
      return new Position(this.line + 1, 1, this.offset + 1);
    }
    return new Position(this.line, this.column + 1, this.offset + 1);
  }

  public clone(): Position {
    return new Position(this.line, this.column, this.offset);
  }
}
