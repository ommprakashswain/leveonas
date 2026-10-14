/**
 * Leveonas Go-To-Definition Provider
 *
 * Resolves source declaration locations for:
 * - Component instances -> Component declaration (component(Name) or (component:Name))
 * - State variable references -> State declaration (state(var, initial) or (state:var initial))
 * - Computed/reactive references -> Computed declaration (computed(var, expr) or reactive(var, expr))
 * - Prop references -> Props declaration (props(p1, p2))
 */

import { BlockExtractor } from './block-extractor';
import { Location, Position, Range } from './types';

export class LeveonasDefinitionProvider {
  /**
   * Resolve definition location for the symbol under cursor.
   */
  public static getDefinition(
    documentText: string,
    position: Position,
    uri: string = 'file://app.lm'
  ): Location | null {
    const offset = position.offset ?? BlockExtractor.positionToOffset(documentText, position);
    const word = LeveonasDefinitionProvider.getWordAtOffset(documentText, offset);
    if (!word) return null;

    // 1. Try resolving Component declaration
    const compRegex = new RegExp(
      `(?:\\bcomponent\\s*\\(\\s*${word}|\\(component:${word}\\b)`,
      'g'
    );
    const compMatch = compRegex.exec(documentText);
    if (compMatch) {
      const defOffset = compMatch.index;
      const startPos = BlockExtractor.offsetToPosition(documentText, defOffset);
      const endPos = BlockExtractor.offsetToPosition(
        documentText,
        defOffset + compMatch[0].length
      );
      return {
        uri,
        range: { start: startPos, end: endPos },
      };
    }

    // 2. Try resolving State variable declaration
    const stateRegex = new RegExp(
      `(?:\\b(?:state|ref|signal|useState)\\s*\\(\\s*${word}\\b|\\((?:state|ref|signal):${word}\\b)`,
      'g'
    );
    const stateMatch = stateRegex.exec(documentText);
    if (stateMatch) {
      const defOffset = stateMatch.index;
      const startPos = BlockExtractor.offsetToPosition(documentText, defOffset);
      const endPos = BlockExtractor.offsetToPosition(
        documentText,
        defOffset + stateMatch[0].length
      );
      return {
        uri,
        range: { start: startPos, end: endPos },
      };
    }

    // 3. Try resolving Computed / Reactive declaration
    const derivedRegex = new RegExp(
      `(?:\\b(?:reactive|computed|\\$derived)\\s*\\(\\s*${word}\\b|\\((?:reactive|computed|derived):${word}\\b)`,
      'g'
    );
    const derivedMatch = derivedRegex.exec(documentText);
    if (derivedMatch) {
      const defOffset = derivedMatch.index;
      const startPos = BlockExtractor.offsetToPosition(documentText, defOffset);
      const endPos = BlockExtractor.offsetToPosition(
        documentText,
        defOffset + derivedMatch[0].length
      );
      return {
        uri,
        range: { start: startPos, end: endPos },
      };
    }

    // 4. Try resolving Component Prop declaration
    const propRegex = new RegExp(`\\bprops\\s*\\([^)]*\\b${word}\\b[^)]*\\)`, 'g');
    const propMatch = propRegex.exec(documentText);
    if (propMatch) {
      const defOffset = propMatch.index;
      const startPos = BlockExtractor.offsetToPosition(documentText, defOffset);
      const endPos = BlockExtractor.offsetToPosition(
        documentText,
        defOffset + propMatch[0].length
      );
      return {
        uri,
        range: { start: startPos, end: endPos },
      };
    }

    return null;
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
