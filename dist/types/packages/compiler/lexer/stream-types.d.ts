export declare enum LMBlockEventType {
    BLOCK_START = "BLOCK_START",
    BLOCK_CONTENT = "BLOCK_CONTENT",
    BLOCK_END = "BLOCK_END",
    TEXT = "TEXT",
    ERROR = "ERROR",
    STREAM_END = "STREAM_END"
}
export declare const SUPPORTED_BLOCK_LANGUAGES: readonly ["HTML", "CSS", "JS", "TS", "REACT", "NEXTJS", "TAILWIND", "VUE", "SVELTE", "ANGULAR"];
export type SupportedBlockLanguage = (typeof SUPPORTED_BLOCK_LANGUAGES)[number];
export interface LMPosition {
    line: number;
    column: number;
    offset: number;
}
export interface LMBlockStartEvent {
    type: LMBlockEventType.BLOCK_START;
    language: string;
    rawTag: string;
    isKnown: boolean;
    position: LMPosition;
}
export interface LMBlockContentEvent {
    type: LMBlockEventType.BLOCK_CONTENT;
    language: string;
    content: string;
    position: LMPosition;
}
export interface LMBlockEndEvent {
    type: LMBlockEventType.BLOCK_END;
    language: string;
    rawTag: string;
    position: LMPosition;
}
export interface LMTextEvent {
    type: LMBlockEventType.TEXT;
    content: string;
    position: LMPosition;
}
export interface LMErrorEvent {
    type: LMBlockEventType.ERROR;
    message: string;
    code: string;
    position: LMPosition;
    partialContent?: string;
}
export interface LMStreamEndEvent {
    type: LMBlockEventType.STREAM_END;
    incompleteBlock?: string;
    position: LMPosition;
}
export type LMBlockEvent = LMBlockStartEvent | LMBlockContentEvent | LMBlockEndEvent | LMTextEvent | LMErrorEvent | LMStreamEndEvent;
export declare enum LMStreamLexerState {
    IDLE = "IDLE",
    IN_BLOCK = "IN_BLOCK",
    ENDED = "ENDED"
}
export interface LMStreamLexerOptions {
    /**
     * List of known languages/frameworks.
     * Defaults to SUPPORTED_BLOCK_LANGUAGES.
     */
    supportedLanguages?: readonly string[] | string[];
    /**
     * Whether to accept and parse custom/unlisted tag blocks (e.g. <GRAPHQL>).
     * If false, unknown tags will emit an ERROR event.
     * Default is true.
     */
    allowCustomLanguages?: boolean;
    /**
     * Whether to emit TEXT events for ambient content between blocks.
     * Default is true.
     */
    emitTextEvents?: boolean;
}
