import { TokenComparisonInput, TokenComparisonResult, SizeComparisonInput, SizeComparisonResult, BenchmarkComparison } from './types';
/**
 * Token Economics Comparison Utility
 *
 * Compares standard frontend generation token usage against Leveonas LM generation.
 *
 * Formulas:
 *   outputTokenReduction = normalOutputTokens - leveonasOutputTokens
 *   outputTokenReductionPercent = 100 * outputTokenReduction / normalOutputTokens
 *   totalTokenReduction = (normalInputTokens + normalOutputTokens) - (leveonasInputTokens + leveonasOutputTokens)
 *   totalTokenReductionPercent = 100 * totalTokenReduction / (normalInputTokens + normalOutputTokens)
 *
 * Note: Increased input tokens are tracked explicitly as inputTokenDifference and are NOT labeled "savings".
 */
export declare function compareTokens(input: TokenComparisonInput): TokenComparisonResult;
/**
 * Output Size Comparison Utility
 *
 * Compares:
 * 1. Model output size (normalGeneratedBytes vs leveonasLMBytes)
 * 2. Network transport size (normalGeneratedBytes vs leveonasPatchBytes)
 *
 * These three dimensions are independent and should never be assumed equivalent.
 */
export declare function compareSizes(input: SizeComparisonInput): SizeComparisonResult;
export interface BenchmarkComparisonInput {
    normalInputTokens: number | null;
    normalOutputTokens: number | null;
    leveonasInputTokens: number | null;
    leveonasOutputTokens: number | null;
    normalGeneratedBytes: number;
    leveonasLMBytes: number;
    normalNetworkBytes: number;
    leveonasNetworkBytes: number;
}
/**
 * Benchmark Comparison Utility
 *
 * Implements authoritative formulas for A/B comparison:
 * - outputTokenReduction = normalOutputTokens - leveonasOutputTokens
 * - outputTokenReductionPercent = 100 * outputTokenReduction / normalOutputTokens
 * - totalTokenReduction = (normalInputTokens + normalOutputTokens) - (leveonasInputTokens + leveonasOutputTokens)
 * - totalTokenReductionPercent = 100 * totalTokenReduction / (normalInputTokens + normalOutputTokens)
 * - inputTokenDifference = leveonasInputTokens - normalInputTokens (NOT labeled savings)
 * - outputByteReduction = normalGeneratedBytes - leveonasLMBytes
 * - outputByteReductionPercent = 100 * outputByteReduction / normalGeneratedBytes
 * - networkByteReduction = normalNetworkBytes - leveonasNetworkBytes (where leveonasNetworkBytes = actual patch SSE bytes)
 * - networkByteReductionPercent = 100 * networkByteReduction / normalNetworkBytes
 */
export declare function compareBenchmark(input: BenchmarkComparisonInput): BenchmarkComparison;
