import {
  LMBlockEvent,
  LMBlockEventType,
  LMStreamLexerOptions,
  LMStreamLexerState,
  LMPosition,
  SUPPORTED_BLOCK_LANGUAGES,
} from './stream-types';

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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
export class LMStreamLexer {
  private state: LMStreamLexerState = LMStreamLexerState.IDLE;
  private currentLanguage: string | null = null;
  private rawLanguage: string | null = null;
  private buffer: string = '';
  private currentPos: LMPosition = { line: 1, column: 1, offset: 0 };
  private supportedLanguages: Set<string>;
  private allowCustomLanguages: boolean;
  private emitTextEvents: boolean;
  private eventListeners: Array<(event: LMBlockEvent) => void> = [];
  private allEvents: LMBlockEvent[] = [];

  constructor(options: LMStreamLexerOptions = {}) {
    const langs = options.supportedLanguages ?? SUPPORTED_BLOCK_LANGUAGES;
    this.supportedLanguages = new Set(
      Array.from(langs).map((l) => l.toUpperCase())
    );
    this.allowCustomLanguages = options.allowCustomLanguages ?? true;
    this.emitTextEvents = options.emitTextEvents ?? true;
  }

  /**
   * Subscribe a listener to receive emitted events.
   */
  public on(listener: (event: LMBlockEvent) => void): () => void {
    this.eventListeners.push(listener);
    return () => {
      const idx = this.eventListeners.indexOf(listener);
      if (idx !== -1) {
        this.eventListeners.splice(idx, 1);
      }
    };
  }

  /**
   * Push a chunk of streaming text into the lexer.
   * Returns newly emitted events for this chunk.
   */
  public push(chunk: string): LMBlockEvent[] {
    if (this.state === LMStreamLexerState.ENDED) {
      throw new Error('Cannot push chunks to an ended LMStreamLexer');
    }

    if (!chunk) {
      return [];
    }

    this.buffer += chunk;
    const newEvents: LMBlockEvent[] = [];

    this.processBuffer(newEvents);

    return newEvents;
  }

  /**
   * Signal the end of the stream.
   * Flushes remaining content and emits completion/error events.
   */
  public end(): LMBlockEvent[] {
    if (this.state === LMStreamLexerState.ENDED) {
      return [];
    }

    const newEvents: LMBlockEvent[] = [];

    if (this.state === LMStreamLexerState.IN_BLOCK && this.currentLanguage) {
      // Flush remaining content
      if (this.buffer.length > 0) {
        const contentEvent: LMBlockEvent = {
          type: LMBlockEventType.BLOCK_CONTENT,
          language: this.currentLanguage,
          content: this.buffer,
          position: { ...this.currentPos },
        };
        this.emit(contentEvent, newEvents);
        this.advancePos(this.buffer);
        this.buffer = '';
      }

      // Emit error for unclosed block
      const errorEvent: LMBlockEvent = {
        type: LMBlockEventType.ERROR,
        message: `Stream ended before closing block for ${this.currentLanguage}`,
        code: 'UNCLOSED_BLOCK',
        position: { ...this.currentPos },
        partialContent: this.currentLanguage,
      };
      this.emit(errorEvent, newEvents);

      const endEvent: LMBlockEvent = {
        type: LMBlockEventType.STREAM_END,
        incompleteBlock: this.currentLanguage,
        position: { ...this.currentPos },
      };
      this.emit(endEvent, newEvents);
    } else {
      // In IDLE state
      if (this.buffer.length > 0) {
        if (this.emitTextEvents) {
          const textEvent: LMBlockEvent = {
            type: LMBlockEventType.TEXT,
            content: this.buffer,
            position: { ...this.currentPos },
          };
          this.emit(textEvent, newEvents);
        }
        this.advancePos(this.buffer);
        this.buffer = '';
      }

      const endEvent: LMBlockEvent = {
        type: LMBlockEventType.STREAM_END,
        position: { ...this.currentPos },
      };
      this.emit(endEvent, newEvents);
    }

    this.state = LMStreamLexerState.ENDED;
    return newEvents;
  }

  /**
   * Reset the lexer state to initial idle condition.
   */
  public reset(): void {
    this.state = LMStreamLexerState.IDLE;
    this.currentLanguage = null;
    this.rawLanguage = null;
    this.buffer = '';
    this.currentPos = { line: 1, column: 1, offset: 0 };
    this.allEvents = [];
  }

  public getState(): LMStreamLexerState {
    return this.state;
  }

  public getCurrentLanguage(): string | null {
    return this.currentLanguage;
  }

  public getAllEvents(): LMBlockEvent[] {
    return [...this.allEvents];
  }

  /**
   * Main buffer processing loop.
   */
  private processBuffer(events: LMBlockEvent[]): void {
    let progress = true;

    while (progress && this.buffer.length > 0) {
      progress = false;

      if (this.state === LMStreamLexerState.IDLE) {
        progress = this.processIdleState(events);
      } else if (this.state === LMStreamLexerState.IN_BLOCK) {
        progress = this.processInBlockState(events);
      }
    }
  }

  /**
   * Processing logic when outside any block (IDLE).
   */
  private processIdleState(events: LMBlockEvent[]): boolean {
    const openAngle = this.buffer.indexOf('<');

    if (openAngle === -1) {
      // No '<' in entire buffer: all text / inter-block whitespace
      if (this.buffer.length > 0) {
        if (this.emitTextEvents) {
          this.emit(
            {
              type: LMBlockEventType.TEXT,
              content: this.buffer,
              position: { ...this.currentPos },
            },
            events
          );
        }
        this.advancePos(this.buffer);
        this.buffer = '';
        return true;
      }
      return false;
    }

    if (openAngle > 0) {
      // Emit text before '<'
      const text = this.buffer.slice(0, openAngle);
      if (this.emitTextEvents) {
        this.emit(
          {
            type: LMBlockEventType.TEXT,
            content: text,
            position: { ...this.currentPos },
          },
          events
        );
      }
      this.advancePos(text);
      this.buffer = this.buffer.slice(openAngle);
      return true;
    }

    // this.buffer starts with '<'
    const closeAngle = this.buffer.indexOf('>');

    if (closeAngle === -1) {
      // Tag is incomplete in this chunk
      const potentialTag = this.buffer.slice(1);
      const isTagPrefix = /^[A-Za-z0-9_/-]*$/.test(potentialTag);

      if (!isTagPrefix || this.buffer.length > 64) {
        // Not a valid tag prefix; emit '<' as text
        const nonTagChar = this.buffer.slice(0, 1);
        if (this.emitTextEvents) {
          this.emit(
            {
              type: LMBlockEventType.TEXT,
              content: nonTagChar,
              position: { ...this.currentPos },
            },
            events
          );
        }
        this.advancePos(nonTagChar);
        this.buffer = this.buffer.slice(1);
        return true;
      }

      // Valid potential tag prefix: wait for next chunk
      return false;
    }

    // Complete tag candidate found between 0 and closeAngle
    const rawTag = this.buffer.slice(0, closeAngle + 1);
    const inner = this.buffer.slice(1, closeAngle).trim();

    if (inner.startsWith('/')) {
      // Orphan closing tag in IDLE state
      const tagName = inner.slice(1).trim();
      this.emit(
        {
          type: LMBlockEventType.ERROR,
          message: `Unexpected closing tag </${tagName}> outside of any open block`,
          code: 'UNEXPECTED_CLOSING_TAG',
          position: { ...this.currentPos },
          partialContent: rawTag,
        },
        events
      );
      this.advancePos(rawTag);
      this.buffer = this.buffer.slice(closeAngle + 1);
      return true;
    }

    // Opening tag candidate
    const isValidIdentifier = /^[A-Za-z][A-Za-z0-9_-]*$/.test(inner);

    if (isValidIdentifier) {
      const normalizedLang = inner.toUpperCase();
      const isKnown = this.supportedLanguages.has(normalizedLang);

      if (!isKnown && !this.allowCustomLanguages) {
        this.emit(
          {
            type: LMBlockEventType.ERROR,
            message: `Unsupported block language: ${inner}`,
            code: 'UNSUPPORTED_LANGUAGE',
            position: { ...this.currentPos },
            partialContent: rawTag,
          },
          events
        );
      } else {
        this.currentLanguage = normalizedLang;
        this.rawLanguage = inner;
        this.state = LMStreamLexerState.IN_BLOCK;

        this.emit(
          {
            type: LMBlockEventType.BLOCK_START,
            language: normalizedLang,
            rawTag,
            isKnown,
            position: { ...this.currentPos },
          },
          events
        );
      }

      this.advancePos(rawTag);
      this.buffer = this.buffer.slice(closeAngle + 1);
      return true;
    } else {
      // Malformed tag, treat as text
      if (this.emitTextEvents) {
        this.emit(
          {
            type: LMBlockEventType.TEXT,
            content: rawTag,
            position: { ...this.currentPos },
          },
          events
        );
      }
      this.advancePos(rawTag);
      this.buffer = this.buffer.slice(closeAngle + 1);
      return true;
    }
  }

  /**
   * Processing logic when inside an active block (IN_BLOCK).
   *
   * Strictly language-agnostic: looks only for the matching closing tag </CURRENT_LANGUAGE>.
   * Preserves all other characters (quotes, comments, other tags) as BLOCK_CONTENT.
   */
  private processInBlockState(events: LMBlockEvent[]): boolean {
    if (!this.currentLanguage) {
      this.state = LMStreamLexerState.IDLE;
      return true;
    }

    const currentLang = this.currentLanguage;
    const openAngle = this.buffer.indexOf('<');

    if (openAngle === -1) {
      // No '<' in buffer: everything is BLOCK_CONTENT
      if (this.buffer.length > 0) {
        this.emit(
          {
            type: LMBlockEventType.BLOCK_CONTENT,
            language: currentLang,
            content: this.buffer,
            position: { ...this.currentPos },
          },
          events
        );
        this.advancePos(this.buffer);
        this.buffer = '';
      }
      return false;
    }

    if (openAngle > 0) {
      // Emit all content before '<'
      const content = this.buffer.slice(0, openAngle);
      this.emit(
        {
          type: LMBlockEventType.BLOCK_CONTENT,
          language: currentLang,
          content,
          position: { ...this.currentPos },
        },
        events
      );
      this.advancePos(content);
      this.buffer = this.buffer.slice(openAngle);
      return true;
    }

    // this.buffer starts with '<'
    // 1. Check if it matches the complete closing tag: </CURRENT_LANGUAGE>
    const closingRegex = new RegExp(`^<\\/\\s*${escapeRegExp(currentLang)}\\s*>`, 'i');
    const match = this.buffer.match(closingRegex);

    if (match) {
      const rawTag = match[0];
      this.emit(
        {
          type: LMBlockEventType.BLOCK_END,
          language: currentLang,
          rawTag,
          position: { ...this.currentPos },
        },
        events
      );

      this.advancePos(rawTag);
      this.buffer = this.buffer.slice(rawTag.length);
      this.state = LMStreamLexerState.IDLE;
      this.currentLanguage = null;
      this.rawLanguage = null;
      return true;
    }

    // 2. Check if this.buffer could be a partial prefix of </CURRENT_LANGUAGE> split across chunks
    if (this.isPrefixOfClosingTag(this.buffer, currentLang)) {
      // Incomplete prefix at the end of current chunk: wait for more data
      return false;
    }

    // 3. Not a closing tag and not a potential prefix:
    // The '<' is regular block content (e.g. <div>, </OTHER>, <5, etc.)
    const char = this.buffer.slice(0, 1);
    this.emit(
      {
        type: LMBlockEventType.BLOCK_CONTENT,
        language: currentLang,
        content: char,
        position: { ...this.currentPos },
      },
      events
    );
    this.advancePos(char);
    this.buffer = this.buffer.slice(1);
    return true;
  }

  /**
   * Checks if the buffer starts with an incomplete prefix of </LANGUAGE> (case-insensitive).
   */
  private isPrefixOfClosingTag(candidate: string, language: string): boolean {
    if (candidate === '<') {
      return true;
    }

    if (candidate === '</') {
      return true;
    }

    if (candidate.startsWith('</')) {
      const afterSlash = candidate.slice(2);
      const trimmedStart = afterSlash.trimStart();
      const targetNameAndClose = `${language}>`.toUpperCase();
      const candidateUpper = trimmedStart.toUpperCase();

      // If no '>' in candidate and candidate matches the start of LANGUAGE>
      if (candidate.indexOf('>') === -1) {
        if (trimmedStart === '') {
          return candidate.length < 16;
        }
        return targetNameAndClose.startsWith(candidateUpper);
      }
    }

    return false;
  }

  /**
   * Helper to emit event to both internal list and active listeners.
   */
  private emit(event: LMBlockEvent, batch: LMBlockEvent[]): void {
    batch.push(event);
    this.allEvents.push(event);
    for (const listener of this.eventListeners) {
      try {
        listener(event);
      } catch (err) {
        console.error('Error in LMStreamLexer event listener:', err);
      }
    }
  }

  /**
   * Advances position tracking across a processed string.
   */
  private advancePos(text: string): void {
    let { line, column, offset } = this.currentPos;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      offset++;
      if (char === '\n') {
        line++;
        column = 1;
      } else {
        column++;
      }
    }
    this.currentPos = { line, column, offset };
  }
}
