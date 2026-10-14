/**
 * Leveonas Block Extractor
 *
 * Identifies embedded framework blocks (<HTML>, <CSS>, <JS>, <TS>, <REACT>, <VUE>, <SVELTE>, <ANGULAR>)
 * or treats pure S-expression code as LM.
 */

import { EmbeddedBlock, EmbeddedBlockType, Position, Range } from './types';

const BLOCK_TAGS: Record<string, EmbeddedBlockType> = {
  html: 'html',
  HTML: 'html',
  css: 'css',
  CSS: 'css',
  js: 'js',
  JS: 'js',
  javascript: 'js',
  JAVASCRIPT: 'js',
  ts: 'ts',
  TS: 'ts',
  typescript: 'ts',
  TYPESCRIPT: 'ts',
  react: 'react',
  REACT: 'react',
  vue: 'vue',
  VUE: 'vue',
  svelte: 'svelte',
  SVELTE: 'svelte',
  angular: 'angular',
  ANGULAR: 'angular',
  lm: 'lm',
  LM: 'lm',
};

export class BlockExtractor {
  /**
   * Extract all embedded framework blocks from a document.
   */
  public static extractBlocks(documentText: string): EmbeddedBlock[] {
    const blocks: EmbeddedBlock[] = [];
    const regex = /<([A-Za-z]+)>([\s\S]*?)<\/\1>/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(documentText)) !== null) {
      const rawTag = match[1];
      const type = BLOCK_TAGS[rawTag] ?? 'lm';
      const fullMatch = match[0];
      const innerContent = match[2];

      const startIndex = match.index;
      const endIndex = startIndex + fullMatch.length;
      const contentStartIndex = startIndex + rawTag.length + 2; // <TAG>
      const contentEndIndex = contentStartIndex + innerContent.length;

      const startPos = BlockExtractor.offsetToPosition(documentText, startIndex);
      const endPos = BlockExtractor.offsetToPosition(documentText, endIndex);
      const contentStartPos = BlockExtractor.offsetToPosition(documentText, contentStartIndex);
      const contentEndPos = BlockExtractor.offsetToPosition(documentText, contentEndIndex);

      blocks.push({
        type,
        content: innerContent,
        range: { start: startPos, end: endPos },
        contentRange: { start: contentStartPos, end: contentEndPos },
      });
    }

    if (blocks.length === 0) {
      // Check if there is an unclosed tag at the end (e.g. streaming <REACT> ...)
      const unclosedRegex = /<([A-Za-z]+)>([\s\S]*)$/;
      const unclosedMatch = unclosedRegex.exec(documentText);
      if (unclosedMatch) {
        const rawTag = unclosedMatch[1];
        const type = BLOCK_TAGS[rawTag] ?? 'lm';
        const innerContent = unclosedMatch[2];
        const startIndex = unclosedMatch.index;
        const endIndex = documentText.length;
        const contentStartIndex = startIndex + rawTag.length + 2;

        blocks.push({
          type,
          content: innerContent,
          range: {
            start: BlockExtractor.offsetToPosition(documentText, startIndex),
            end: BlockExtractor.offsetToPosition(documentText, endIndex),
          },
          contentRange: {
            start: BlockExtractor.offsetToPosition(documentText, contentStartIndex),
            end: BlockExtractor.offsetToPosition(documentText, endIndex),
          },
        });
      } else {
        // Entire document is pure LM / S-expression
        const endPos = BlockExtractor.offsetToPosition(documentText, documentText.length);
        blocks.push({
          type: BlockExtractor.detectImplicitType(documentText),
          content: documentText,
          range: { start: { line: 0, character: 0, offset: 0 }, end: endPos },
          contentRange: { start: { line: 0, character: 0, offset: 0 }, end: endPos },
        });
      }
    }

    return blocks;
  }

  /**
   * Find the active block containing the specified cursor position.
   */
  public static getActiveBlock(documentText: string, position: Position): EmbeddedBlock {
    const blocks = BlockExtractor.extractBlocks(documentText);
    const offset = position.offset ?? BlockExtractor.positionToOffset(documentText, position);

    for (const b of blocks) {
      const bStartOffset = b.range.start.offset ?? BlockExtractor.positionToOffset(documentText, b.range.start);
      const bEndOffset = b.range.end.offset ?? BlockExtractor.positionToOffset(documentText, b.range.end);

      if (offset >= bStartOffset && offset <= bEndOffset) {
        return b;
      }
    }

    return blocks[0] ?? {
      type: 'lm',
      content: documentText,
      range: { start: { line: 0, character: 0 }, end: BlockExtractor.offsetToPosition(documentText, documentText.length) },
      contentRange: { start: { line: 0, character: 0 }, end: BlockExtractor.offsetToPosition(documentText, documentText.length) },
    };
  }

  /**
   * Detect framework type from code keywords if tags are absent.
   */
  public static detectImplicitType(code: string): EmbeddedBlockType {
    if (code.includes('reactive(') || code.includes('$derived') || code.includes('(each:') || code.includes('bind:value')) {
      return 'svelte';
    }
    if (code.includes('computed(') || code.includes('(slot:') || code.includes('ref(')) {
      return 'vue';
    }
    if (code.includes('signal(') || code.includes('[style.') || code.includes('[class.') || code.includes('*ngIf') || code.includes('*ngFor')) {
      return 'angular';
    }
    if (code.includes('useState') || code.includes('state(') || code.includes('component(') || code.includes('props(')) {
      return 'react';
    }
    if (code.includes('interface ') || code.includes('type ') || code.includes(': string') || code.includes(': number')) {
      return 'ts';
    }
    if (code.includes('{') && code.includes('}') && (code.includes('color:') || code.includes('margin:') || code.includes('display:'))) {
      return 'css';
    }
    return 'html';
  }

  public static offsetToPosition(text: string, offset: number): Position {
    let line = 0;
    let character = 0;
    const clamped = Math.max(0, Math.min(offset, text.length));

    for (let i = 0; i < clamped; i++) {
      if (text.charCodeAt(i) === 10) {
        line++;
        character = 0;
      } else {
        character++;
      }
    }

    return { line, character, offset: clamped };
  }

  public static positionToOffset(text: string, pos: Position): number {
    let currentLine = 0;
    let currentChar = 0;

    for (let i = 0; i < text.length; i++) {
      if (currentLine === pos.line && currentChar === pos.character) {
        return i;
      }
      if (text.charCodeAt(i) === 10) {
        if (currentLine === pos.line) {
          // If position character exceeded line length
          return i;
        }
        currentLine++;
        currentChar = 0;
      } else {
        currentChar++;
      }
    }

    return text.length;
  }
}
