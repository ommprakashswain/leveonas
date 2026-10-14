import { Source } from './source';
import { Position } from './position';
import { Snapshot } from './types';

export class Scanner {
  private _source: Source;
  private _position: Position;

  constructor(source: string | Source, position?: Position) {
    this._source = typeof source === 'string' ? new Source(source) : source;
    this._position = position ? position.clone() : new Position(1, 1, 0);
  }

  public get source(): Source {
    return this._source;
  }

  public get position(): Position {
    return this._position.clone();
  }

  public get line(): number {
    return this._position.line;
  }

  public get column(): number {
    return this._position.column;
  }

  public get offset(): number {
    return this._position.offset;
  }

  public eof(): boolean {
    return this._position.offset >= this._source.length;
  }

  public current(): string {
    if (this.eof()) return '\0';
    return this._source.charAt(this._position.offset);
  }

  public peek(): string {
    return this.current();
  }

  public peekNext(): string {
    if (this._position.offset + 1 >= this._source.length) return '\0';
    return this._source.charAt(this._position.offset + 1);
  }

  public advance(): string {
    if (this.eof()) return '\0';
    const char = this.current();
    this._position = this._position.advance(char);
    return char;
  }

  public reset(): void {
    this._position = new Position(1, 1, 0);
  }

  public clone(): Scanner {
    return new Scanner(this._source, this._position);
  }

  public createSnapshot(): Snapshot {
    return {
      offset: this._position.offset,
      line: this._position.line,
      column: this._position.column,
    };
  }

  public restoreSnapshot(snapshot: Snapshot): void {
    this._position = new Position(snapshot.line, snapshot.column, snapshot.offset);
  }
}
