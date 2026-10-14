/**
 * Leveonas Deterministic Canonical Formatter
 *
 * Formats LM documents and embedded framework blocks into canonical style:
 * - Deterministic indentation (default 2 spaces)
 * - S-expression tree restructuring
 * - Attribute alignment
 * - Idempotency guarantee: format(format(doc)) === format(doc)
 */

import { BlockExtractor } from './block-extractor';
import { FormattingOptions } from './types';

export type FormatterOptions = FormattingOptions;

export class LeveonasFormatter {
  /**
   * Format an entire LM document or embedded blocks.
   */
  public static format(documentText: string, options: FormattingOptions = {}): string {
    const indentSize = options.tabSize ?? 2;
    const indentStr = ' '.repeat(indentSize);

    const blocks = BlockExtractor.extractBlocks(documentText);
    if (blocks.length === 0) return documentText;

    // If pure LM document without enclosing tags
    if (blocks.length === 1 && blocks[0].type === 'lm' && !documentText.startsWith('<')) {
      return LeveonasFormatter.formatSExpressions(documentText.trim(), indentStr) + (options.insertFinalNewline !== false ? '\n' : '');
    }

    // Process embedded blocks
    let result = '';
    const tagRegex = /<([A-Za-z]+)>([\s\S]*?)<\/\1>/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = tagRegex.exec(documentText)) !== null) {
      const preceding = documentText.slice(lastIndex, match.index);
      result += preceding;

      const tag = match[1];
      const inner = match[2].trim();
      const formattedInner = LeveonasFormatter.formatSExpressions(inner, indentStr);

      result += `<${tag}>\n${formattedInner}\n</${tag}>`;
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < documentText.length) {
      const remaining = documentText.slice(lastIndex);
      if (remaining.trim()) {
        result += '\n' + LeveonasFormatter.formatSExpressions(remaining.trim(), indentStr);
      }
    }

    if (options.insertFinalNewline !== false && !result.endsWith('\n')) {
      result += '\n';
    }

    return result;
  }

  /**
   * Deterministically formats S-expression syntax.
   */
  public static formatSExpressions(code: string, indentUnit: string): string {
    const tokens = LeveonasFormatter.tokenizeForFormatting(code);
    let depth = 0;
    let formatted = '';
    let inFreshLine = true;

    for (let i = 0; i < tokens.length; i++) {
      const tok = tokens[i];

      if (tok === '(') {
        if (!inFreshLine && formatted.length > 0 && !formatted.endsWith(' ') && !formatted.endsWith('(') && !formatted.endsWith('\n')) {
          formatted += '\n' + indentUnit.repeat(depth);
          inFreshLine = true;
        }

        if (inFreshLine) {
          formatted += indentUnit.repeat(depth);
          inFreshLine = false;
        }

        formatted += '(';
        depth++;

        // Lookahead to see if next token is tag name
        if (i + 1 < tokens.length && tokens[i + 1] !== '(' && tokens[i + 1] !== ')') {
          i++;
          formatted += tokens[i];
        }
      } else if (tok === ')') {
        depth = Math.max(0, depth - 1);
        formatted += ')';
        inFreshLine = false;

        // Check if next token should be on a new line
        if (i + 1 < tokens.length) {
          const nextTok = tokens[i + 1];
          if (nextTok === '(') {
            formatted += '\n';
            inFreshLine = true;
          }
        }
      } else {
        if (!formatted.endsWith('(') && !formatted.endsWith(' ') && !formatted.endsWith('\n')) {
          formatted += ' ';
        }
        formatted += tok;
        inFreshLine = false;
      }
    }

    // Clean up excessive whitespace
    const lines = formatted.split('\n');
    const cleanedLines = lines
      .map((line) => line.trimEnd())
      .filter((line, idx, arr) => {
        if (line.trim() === '' && (idx === 0 || idx === arr.length - 1)) return false;
        return true;
      });

    return cleanedLines.join('\n');
  }

  private static tokenizeForFormatting(code: string): string[] {
    const tokens: string[] = [];
    let current = 0;

    while (current < code.length) {
      const ch = code[current];

      // Skip whitespace outside strings
      if (/\s/.test(ch)) {
        current++;
        continue;
      }

      // Handle strings
      if (ch === '"' || ch === "'") {
        const quote = ch;
        let strVal = quote;
        current++;
        while (current < code.length) {
          const sCh = code[current];
          strVal += sCh;
          current++;
          if (sCh === quote && code[current - 2] !== '\\') {
            break;
          }
        }
        tokens.push(strVal);
        continue;
      }

      // Handle delimiters
      if (ch === '(' || ch === ')' || ch === '[' || ch === ']' || ch === '{' || ch === '}') {
        tokens.push(ch);
        current++;
        continue;
      }

      // Handle words, attributes, numbers, expressions
      let word = '';
      while (current < code.length && !/\s/.test(code[current]) && !/[()[\]{}]/.test(code[current])) {
        word += code[current];
        current++;
      }
      if (word) {
        tokens.push(word);
      }
    }

    return tokens;
  }
}
