import { LMBlockEvent, LMStreamLexerOptions, LMStreamLexerState } from './stream-types';
/**
 * LMStreamLexer
 *
 * A lightweight, language-agnostic streaming framing lexer for Leveonas Markup (LM).
 *
 * Responsibility:
 * - Detects top-level LM boundary tags (<HTML>, <CSS>, <JS>, <TS>, <REACT>, etc.)
 *   and matching closing boundary tags (</HTML>, </CSS>, </JS>, etc.).
 * - Emits structured framing events (BLOCK_START, BLOCK_CONTENT, BLOCK_END, TEXT, ERROR, STREAM_END).
 * - Strictly language-agnostic: preserves all characters inside a block as raw BLOCK_CONTENT
 *   without parsing quotes, comments, parentheses, or language-specific syntax.
 * - Language-specific interpretation and AST construction occur downstream.
 */
export declare class LMStreamLexer {
    private state;
    private currentLanguage;
    private rawLanguage;
    private buffer;
    private currentPos;
    private supportedLanguages;
    private allowCustomLanguages;
    private emitTextEvents;
    private eventListeners;
    private allEvents;
    constructor(options?: LMStreamLexerOptions);
    /**
     * Subscribe a listener to receive emitted events.
     */
    on(listener: (event: LMBlockEvent) => void): () => void;
    /**
     * Push a chunk of streaming text into the lexer.
     * Returns newly emitted events for this chunk.
     */
    push(chunk: string): LMBlockEvent[];
    /**
     * Signal the end of the stream.
     * Flushes remaining content and emits completion/error events.
     */
    end(): LMBlockEvent[];
    /**
     * Reset the lexer state to initial idle condition.
     */
    reset(): void;
    getState(): LMStreamLexerState;
    getCurrentLanguage(): string | null;
    getAllEvents(): LMBlockEvent[];
    /**
     * Main buffer processing loop.
     */
    private processBuffer;
    /**
     * Processing logic when outside any block (IDLE).
     */
    private processIdleState;
    /**
     * Processing logic when inside an active block (IN_BLOCK).
     *
     * Strictly language-agnostic: looks only for the matching closing tag </CURRENT_LANGUAGE>.
     * Preserves all other characters (quotes, comments, other tags) as BLOCK_CONTENT.
     */
    private processInBlockState;
    /**
     * Checks if the buffer starts with an incomplete prefix of </LANGUAGE> (case-insensitive).
     */
    private isPrefixOfClosingTag;
    /**
     * Helper to emit event to both internal list and active listeners.
     */
    private emit;
    /**
     * Advances position tracking across a processed string.
     */
    private advancePos;
}
