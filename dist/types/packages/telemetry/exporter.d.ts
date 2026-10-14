import { BenchmarkResult } from './types';
/**
 * Benchmark Results Exporter
 *
 * Formats A/B benchmark results for scientific reproducibility and export
 * in standard RFC 4180 CSV and structured JSON formats.
 */
export declare class BenchmarkExporter {
    /**
     * Generates formatted JSON containing all metadata, summary statistics,
     * per-iteration paired metrics, and comparison calculations.
     */
    static toJSON(result: BenchmarkResult): string;
    /**
     * Generates standard RFC 4180 compliant CSV containing every paired observation
     * and aggregated summary metrics.
     */
    static toCSV(result: BenchmarkResult): string;
}
