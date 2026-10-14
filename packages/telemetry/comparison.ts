import {
  TokenComparisonInput,
  TokenComparisonResult,
  SizeComparisonInput,
  SizeComparisonResult,
  BenchmarkComparison,
} from './types';

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
export function compareTokens(input: TokenComparisonInput): TokenComparisonResult {
  const { normalInputTokens, normalOutputTokens, leveonasInputTokens, leveonasOutputTokens } = input;

  const outputTokenReduction = normalOutputTokens - leveonasOutputTokens;
  const outputTokenReductionPercent =
    normalOutputTokens > 0 ? (100 * outputTokenReduction) / normalOutputTokens : 0;

  const normalTotal = normalInputTokens + normalOutputTokens;
  const leveonasTotal = leveonasInputTokens + leveonasOutputTokens;
  const totalTokenReduction = normalTotal - leveonasTotal;
  const totalTokenReductionPercent =
    normalTotal > 0 ? (100 * totalTokenReduction) / normalTotal : 0;

  const inputTokenDifference = leveonasInputTokens - normalInputTokens;

  return {
    normalInputTokens,
    normalOutputTokens,
    leveonasInputTokens,
    leveonasOutputTokens,
    outputTokenReduction,
    outputTokenReductionPercent,
    totalTokenReduction,
    totalTokenReductionPercent,
    inputTokenDifference,
    isOutputReduced: outputTokenReduction > 0,
    isTotalReduced: totalTokenReduction > 0,
  };
}

/**
 * Output Size Comparison Utility
 *
 * Compares:
 * 1. Model output size (normalGeneratedBytes vs leveonasLMBytes)
 * 2. Network transport size (normalGeneratedBytes vs leveonasPatchBytes)
 *
 * These three dimensions are independent and should never be assumed equivalent.
 */
export function compareSizes(input: SizeComparisonInput): SizeComparisonResult {
  const { normalGeneratedBytes, leveonasLMBytes, leveonasPatchBytes } = input;

  const lmByteReduction = normalGeneratedBytes - leveonasLMBytes;
  const lmByteReductionPercent =
    normalGeneratedBytes > 0 ? (100 * lmByteReduction) / normalGeneratedBytes : 0;

  const patchByteReduction = normalGeneratedBytes - leveonasPatchBytes;
  const patchByteReductionPercent =
    normalGeneratedBytes > 0 ? (100 * patchByteReduction) / normalGeneratedBytes : 0;

  return {
    normalGeneratedBytes,
    leveonasLMBytes,
    leveonasPatchBytes,
    lmByteReduction,
    lmByteReductionPercent,
    patchByteReduction,
    patchByteReductionPercent,
  };
}

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
export function compareBenchmark(input: BenchmarkComparisonInput): BenchmarkComparison {
  const {
    normalInputTokens,
    normalOutputTokens,
    leveonasInputTokens,
    leveonasOutputTokens,
    normalGeneratedBytes,
    leveonasLMBytes,
    normalNetworkBytes,
    leveonasNetworkBytes,
  } = input;

  let outputTokenReduction: number | null = null;
  let outputTokenReductionPercent: number | null = null;
  let totalTokenReduction: number | null = null;
  let totalTokenReductionPercent: number | null = null;
  let inputTokenDifference: number | null = null;

  if (normalOutputTokens !== null && leveonasOutputTokens !== null) {
    outputTokenReduction = normalOutputTokens - leveonasOutputTokens;
    outputTokenReductionPercent =
      normalOutputTokens > 0 ? (100 * outputTokenReduction) / normalOutputTokens : 0;
  }

  if (
    normalInputTokens !== null &&
    normalOutputTokens !== null &&
    leveonasInputTokens !== null &&
    leveonasOutputTokens !== null
  ) {
    const normalTotal = normalInputTokens + normalOutputTokens;
    const leveonasTotal = leveonasInputTokens + leveonasOutputTokens;
    totalTokenReduction = normalTotal - leveonasTotal;
    totalTokenReductionPercent =
      normalTotal > 0 ? (100 * totalTokenReduction) / normalTotal : 0;
    inputTokenDifference = leveonasInputTokens - normalInputTokens;
  } else if (normalInputTokens !== null && leveonasInputTokens !== null) {
    inputTokenDifference = leveonasInputTokens - normalInputTokens;
  }

  const modelOutputByteReduction =
    typeof normalGeneratedBytes === 'number' && typeof leveonasLMBytes === 'number'
      ? normalGeneratedBytes - leveonasLMBytes
      : null;
  const modelOutputByteReductionPercent =
    modelOutputByteReduction !== null && normalGeneratedBytes > 0
      ? (100 * modelOutputByteReduction) / normalGeneratedBytes
      : null;

  const applicationSSEByteReduction =
    typeof normalNetworkBytes === 'number' && typeof leveonasNetworkBytes === 'number'
      ? normalNetworkBytes - leveonasNetworkBytes
      : null;
  const applicationSSEByteReductionPercent =
    applicationSSEByteReduction !== null && normalNetworkBytes > 0
      ? (100 * applicationSSEByteReduction) / normalNetworkBytes
      : null;

  return {
    outputTokenReduction,
    outputTokenReductionPercent,
    totalTokenReduction,
    totalTokenReductionPercent,
    inputTokenDifference,
    modelOutputByteReduction,
    modelOutputByteReductionPercent,
    applicationSSEByteReduction,
    applicationSSEByteReductionPercent,
    // Backwards-compatible aliases
    outputByteReduction: modelOutputByteReduction,
    outputByteReductionPercent: modelOutputByteReductionPercent,
    networkByteReduction: applicationSSEByteReduction,
    networkByteReductionPercent: applicationSSEByteReductionPercent,
  };
}

