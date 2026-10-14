import { SyntaxState } from './types';
export declare class SyntaxTracker {
    state: SyntaxState;
    braceDepth: number;
    escapeNext: boolean;
    quoteChar: string | null;
    feed(text: string): void;
    clone(): SyntaxTracker;
}
