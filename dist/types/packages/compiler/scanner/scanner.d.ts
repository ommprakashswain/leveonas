import { Source } from './source';
import { Position } from './position';
import { Snapshot } from './types';
export declare class Scanner {
    private _source;
    private _position;
    constructor(source: string | Source, position?: Position);
    get source(): Source;
    get position(): Position;
    get line(): number;
    get column(): number;
    get offset(): number;
    eof(): boolean;
    current(): string;
    peek(): string;
    peekNext(): string;
    advance(): string;
    reset(): void;
    clone(): Scanner;
    createSnapshot(): Snapshot;
    restoreSnapshot(snapshot: Snapshot): void;
}
