export interface Snapshot {
    readonly offset: number;
    readonly line: number;
    readonly column: number;
}
export interface CharContext {
    readonly char: string;
    readonly line: number;
    readonly column: number;
    readonly offset: number;
}
