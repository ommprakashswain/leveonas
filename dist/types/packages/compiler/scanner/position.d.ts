export declare class Position {
    readonly line: number;
    readonly column: number;
    readonly offset: number;
    constructor(line: number, column: number, offset: number);
    advance(char: string): Position;
    clone(): Position;
}
