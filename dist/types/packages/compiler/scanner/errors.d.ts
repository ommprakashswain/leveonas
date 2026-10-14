import { Position } from './position';
export declare class ScannerError extends Error {
    readonly position: Position;
    constructor(message: string, position: Position);
}
