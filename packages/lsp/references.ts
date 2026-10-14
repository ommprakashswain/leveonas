/**
 * Leveonas Find References Provider
 *
 * Discovers all occurrences of a symbol across the document:
 * - Components (declaration, instantiation)
 * - State variables (declaration, reactive expressions, event handlers, bindings, interpolations)
 * - Computed/derived values
 * - Props
 */

import { BlockExtractor } from './block-extractor';
import { Location, Position, Range } from './types';

export class LeveonasReferencesProvider {
  /**
   * Find all reference locations for the symbol under cursor.
   */
  public static findReferences(
    documentText: string,
    position: Position,
    uri: string = 'file://app.lm',
    includeDeclaration: boolean = true
  ): Location[] {
    const offset = position.offset ?? BlockExtractor.positionToOffset(documentText, position);
    const word = LeveonasReferencesProvider.getWordAtOffset(documentText, offset);
    if (!word) return [];

    const locations: Location[] = [];
    const wordRegex = new RegExp(`\\b${word}\\b`, 'g');
    let match: RegExpExecArray | null;

    while ((match = wordRegex.exec(documentText)) !== null) {
      const matchOffset = match.index;
      const startPos = BlockExtractor.offsetToPosition(documentText, matchOffset);
      const endPos = BlockExtractor.offsetToPosition(documentText, matchOffset + word.length);

      locations.push({
        uri,
        range: { start: startPos, end: endPos },
      });
    }

    return locations;
  }

  private static getWordAtOffset(text: string, offset: number): string | null {
    if (offset < 0 || offset > text.length) return null;

    let start = offset;
    while (start > 0 && /[a-zA-Z0-9_$]/.test(text[start - 1])) {
      start--;
    }

    let end = offset;
    while (end < text.length && /[a-zA-Z0-9_$]/.test(text[end])) {
      end++;
    }

    if (start === end) return null;
    return text.slice(start, end);
  }
}
