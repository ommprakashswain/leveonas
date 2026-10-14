export interface StreamBuilderConfig {
    flushIntervalMs?: number;
    maxBufferSize?: number;
}
export type SyntaxState = 'NORMAL' | 'IN_STRING' | 'IN_COMMENT';
export interface Fragment {
    raw: string;
    recovered: string;
    isComplete: boolean;
    braceDepth: number;
}
