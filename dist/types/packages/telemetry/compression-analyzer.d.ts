/**
 * Leveonas LM Compression Breakdown Analyzer
 *
 * Deconstructs the exact source of token and byte savings between standard
 * frontend representations and Leveonas Markup (LM).
 *
 * Quantifies savings across:
 * 1. Tag name abbreviations (div -> di, button -> bo, etc.)
 * 2. Attribute name abbreviations (class -> cs, href -> hr, etc.)
 * 3. Elimination of closing tags (</div> -> single closing paren ')')
 * 4. Framework boilerplate elimination (imports, decorators, setup boilerplate)
 * 5. Punctuation & delimiter compression (< > / " = -> ( : " ))
 */
export interface CompressionFactorMetrics {
    normalChars: number;
    leveonasChars: number;
    savedChars: number;
    savingsPercent: number;
    estimatedTokenSavings: number;
}
export interface CompressionBreakdown {
    tagSavings: CompressionFactorMetrics;
    closingTagSavings: CompressionFactorMetrics;
    attributeSavings: CompressionFactorMetrics;
    boilerplateSavings: CompressionFactorMetrics;
    delimiterSavings: CompressionFactorMetrics;
    totalSavings: {
        normalTotalBytes: number;
        leveonasTotalBytes: number;
        savedBytes: number;
        savingsPercent: number;
    };
    dominantFactors: string[];
}
export declare class LMCompressionAnalyzer {
    /**
     * Analyzes an equivalent pair of standard code vs LM code to produce a fine-grained
     * breakdown of where token/byte savings originate.
     */
    static analyze(normalCode: string, leveonasLM: string): CompressionBreakdown;
}
