/**
 * Leveonas Deterministic Canonical Formatter
 *
 * Formats LM documents and embedded framework blocks into canonical style:
 * - Deterministic indentation (default 2 spaces)
 * - S-expression tree restructuring
 * - Attribute alignment
 * - Idempotency guarantee: format(format(doc)) === format(doc)
 */
import { FormattingOptions } from './types';
export type FormatterOptions = FormattingOptions;
export declare class LeveonasFormatter {
    /**
     * Format an entire LM document or embedded blocks.
     */
    static format(documentText: string, options?: FormattingOptions): string;
    /**
     * Deterministically formats S-expression syntax.
     */
    static formatSExpressions(code: string, indentUnit: string): string;
    private static tokenizeForFormatting;
}
