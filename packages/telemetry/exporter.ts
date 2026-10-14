import { BenchmarkResult } from './types';

/**
 * Benchmark Results Exporter
 *
 * Formats A/B benchmark results for scientific reproducibility and export
 * in standard RFC 4180 CSV and structured JSON formats.
 */
export class BenchmarkExporter {
  /**
   * Generates formatted JSON containing all metadata, summary statistics,
   * per-iteration paired metrics, and comparison calculations.
   */
  static toJSON(result: BenchmarkResult): string {
    return JSON.stringify(result, null, 2);
  }

  /**
   * Generates standard RFC 4180 compliant CSV containing every paired observation
   * and aggregated summary metrics.
   */
  static toCSV(result: BenchmarkResult): string {
    const lines: string[] = [];

    // Header metadata comments
    lines.push(`# Leveonas Phase 3 Benchmark Export`);
    lines.push(`# Benchmark ID: ${result.benchmarkId}`);
    lines.push(`# Provider: ${result.provider}`);
    lines.push(`# Model: ${result.model}`);
    lines.push(`# Iterations: ${result.iterations}`);
    lines.push(`# Timestamp: ${new Date().toISOString()}`);
    lines.push('');

    // Summary Comparison Section
    lines.push('SECTION,METRIC,NORMAL,LEVEONAS,DIFFERENCE,PERCENT_REDUCTION');
    const comp = result.comparison;
    const n = result.normal;
    const l = result.leveonas;

    const row = (metric: string, nVal: any, lVal: any, diff: any, pct: any) => {
      const escape = (val: any) => (val === null || val === undefined ? 'null' : `"${val}"`);
      return `SUMMARY,${escape(metric)},${escape(nVal)},${escape(lVal)},${escape(diff)},${escape(pct)}`;
    };

    lines.push(
      row(
        'Input Tokens',
        n.inputTokens.mean,
        l.inputTokens.mean,
        comp.inputTokenDifference,
        'N/A'
      )
    );
    lines.push(
      row(
        'Output Tokens',
        n.outputTokens.mean,
        l.outputTokens.mean,
        comp.outputTokenReduction,
        comp.outputTokenReductionPercent
      )
    );
    lines.push(
      row(
        'Total Tokens',
        n.totalTokens.mean,
        l.totalTokens.mean,
        comp.totalTokenReduction,
        comp.totalTokenReductionPercent
      )
    );
    lines.push(
      row(
        'Model Output Bytes',
        n.modelOutputBytes.mean,
        l.modelOutputBytes.mean,
        comp.modelOutputByteReduction,
        comp.modelOutputByteReductionPercent
      )
    );
    lines.push(
      row(
        'Network SSE Bytes',
        n.applicationSSEBytes.mean,
        l.applicationSSEBytes.mean,
        comp.applicationSSEByteReduction,
        comp.applicationSSEByteReductionPercent
      )
    );
    lines.push(
      row(
        'Time To First Content (ms)',
        n.timeToFirstContent.mean,
        l.timeToFirstContent.mean,
        l.timeToFirstContent.mean && n.timeToFirstContent.mean
          ? Number((l.timeToFirstContent.mean - n.timeToFirstContent.mean).toFixed(1))
          : null,
        'N/A'
      )
    );
    lines.push(
      row(
        'Completion Time (ms)',
        n.timeToCompletion.mean,
        l.timeToCompletion.mean,
        l.timeToCompletion.mean && n.timeToCompletion.mean
          ? Number((l.timeToCompletion.mean - n.timeToCompletion.mean).toFixed(1))
          : null,
        'N/A'
      )
    );

    lines.push('');

    // Detailed Raw Iterations Data
    lines.push(
      'ITERATION,MODE,STATUS,CLASSIFICATION,INPUT_TOKENS,OUTPUT_TOKENS,TOTAL_TOKENS,OUTPUT_BYTES,NETWORK_BYTES,PATCH_BYTES,PATCH_COUNT,TIME_FIRST_CHUNK_MS,TIME_FIRST_CONTENT_MS,TIME_FIRST_PATCH_MS,TIME_COMPLETION_MS'
    );

    const formatNum = (v: any) => (v === null || v === undefined ? '' : String(v));

    if (result.iterationsList && result.iterationsList.length > 0) {
      for (const it of result.iterationsList) {
        // Normal row
        const nr = it.normal;
        lines.push(
          [
            it.iteration,
            'NORMAL',
            nr.status || 'success',
            nr.classification || 'N/A',
            formatNum(nr.inputTokens),
            formatNum(nr.outputTokens),
            formatNum(nr.totalTokens),
            formatNum(nr.modelOutputBytes || nr.outputBytes),
            formatNum(nr.applicationSSEBytes || nr.networkBytes),
            '',
            '',
            formatNum(nr.timeToFirstProviderChunk),
            formatNum(nr.timeToFirstContent),
            '',
            formatNum(nr.timeToCompletion),
          ].join(',')
        );

        // Leveonas row
        const lr = it.leveonas;
        lines.push(
          [
            it.iteration,
            'LEVEONAS',
            lr.status || 'success',
            lr.classification || 'VALID_LM',
            formatNum(lr.inputTokens),
            formatNum(lr.outputTokens),
            formatNum(lr.totalTokens),
            formatNum(lr.modelOutputBytes || lr.outputBytes),
            formatNum(lr.applicationSSEBytes || lr.networkBytes),
            formatNum(lr.patchBytes || lr.canonicalPatchBytes),
            formatNum(lr.patchOperationCount),
            formatNum(lr.timeToFirstProviderChunk),
            formatNum(lr.timeToFirstContent),
            formatNum(lr.timeToFirstPatch),
            formatNum(lr.timeToCompletion),
          ].join(',')
        );
      }
    }

    return lines.join('\n');
  }
}
