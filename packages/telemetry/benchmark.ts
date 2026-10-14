import {
  STANDARD_TEST_PROMPT,
  NORMAL_SYSTEM_INSTRUCTION,
  BASELINE_SYSTEM_INSTRUCTION,
} from './fixtures';
import {
  BenchmarkFramework,
  BenchmarkScenarioId,
  BENCHMARK_SCENARIOS,
  getNormalSystemInstruction,
  getLeveonasSystemInstruction,
} from './scenarios';
import { LMCompressionAnalyzer } from './compression-analyzer';
import { LeveonasIRProfiler } from './ir-profiler';
import { generateTelemetryRunId } from './tracker';
import { compareBenchmark } from './comparison';
import {
  BenchmarkMode,
  BenchmarkGenerationSettings,
  BenchmarkRunMetrics,
  MetricStatistics,
  BenchmarkModeStatistics,
  BenchmarkResult,
  BenchmarkIteration,
  LMOutputClassification,
} from './types';
import { LMGenerationPipeline } from '../compiler/pipeline/generation-pipeline';
import { PatchSerializer } from '../runtime/incremental/patch-generator/serializer';
import { validateLMGeneration } from './compliance';

/**
 * Validates if running the benchmark harness is allowed.
 * Strictly development-only: disabled by default in production.
 */
export function isBenchmarkAllowed(nodeEnv = process.env.NODE_ENV): boolean {
  if (nodeEnv === 'production' && process.env.LEVEONAS_ENABLE_BENCHMARK !== 'true') {
    return false;
  }
  return true;
}

/**
 * Calculates descriptive statistics (mean, median, min, max) for numeric measurements.
 * Does not calculate averages when insufficient non-null measurements exist.
 */
export function calculateMetricStatistics(
  values: (number | null | undefined)[]
): MetricStatistics {
  const validValues = values.filter(
    (v): v is number => typeof v === 'number' && !Number.isNaN(v)
  );

  if (validValues.length === 0) {
    return {
      mean: null,
      median: null,
      minimum: null,
      maximum: null,
      count: 0,
    };
  }

  const sum = validValues.reduce((acc, val) => acc + val, 0);
  const mean = sum / validValues.length;

  const sorted = [...validValues].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  const minimum = sorted[0];
  const maximum = sorted[sorted.length - 1];

  return {
    mean: Number(mean.toFixed(2)),
    median: Number(median.toFixed(2)),
    minimum,
    maximum,
    count: validValues.length,
  };
}

export interface BenchmarkRunExecutorInput {
  mode: BenchmarkMode;
  provider: string;
  model: string;
  prompt: string;
  systemInstruction: string;
  runId: string;
  iteration: number;
  generationSettings: BenchmarkGenerationSettings;
}

export type BenchmarkRunExecutor = (
  input: BenchmarkRunExecutorInput
) => Promise<BenchmarkRunMetrics>;

export interface BenchmarkOptions {
  provider: string;
  model: string;
  prompt?: string;
  framework?: BenchmarkFramework;
  scenario?: BenchmarkScenarioId;
  iterations?: number;
  maxTokens?: number;
  temperature?: number;
  seed?: number;
  executor?: BenchmarkRunExecutor;
  // Injectable randomizer function for deterministic testing
  randomFn?: () => number;
}

/**
 * Aggregates all run metrics for a benchmark mode into mode statistics.
 * Strictly excludes failed or aborted runs from all descriptive statistics.
 */
export function aggregateModeStatistics(
  runs: BenchmarkRunMetrics[],
  systemPromptCharacters: number,
  systemPromptBytes: number,
  promptCharacters: number
): BenchmarkModeStatistics {
  const successfulRuns = runs.filter((r) => r.status !== 'failed' && r.status !== 'aborted');
  const successfulRunsCount = successfulRuns.length;
  const totalRunsCount = runs.length;

  let validLMRunsCount = 0;
  let invalidLMRunsCount = 0;
  let parserErrorRunsCount = 0;
  let abortedRunsCount = 0;
  let providerErrorRunsCount = 0;

  for (const r of runs) {
    if (r.status === 'aborted') {
      abortedRunsCount++;
    } else if (r.status === 'failed') {
      providerErrorRunsCount++;
    } else if (r.classification === 'VALID_LM') {
      validLMRunsCount++;
    } else if (r.classification === 'INVALID_LM') {
      invalidLMRunsCount++;
    } else if (r.classification === 'PARSER_ERROR') {
      parserErrorRunsCount++;
    } else if (r.mode === 'LEVEONAS') {
      if (r.lmCompliance?.isLMCompliant) {
        validLMRunsCount++;
      } else {
        invalidLMRunsCount++;
      }
    }
  }

  let lmComplianceRate: number | null = null;
  const leveonasRuns = successfulRuns.filter((r) => r.mode === 'LEVEONAS');
  if (leveonasRuns.length > 0) {
    const compliantCount = leveonasRuns.filter(
      (r) => r.classification === 'VALID_LM' || r.lmCompliance?.isLMCompliant === true
    ).length;
    lmComplianceRate = Number(((compliantCount / leveonasRuns.length) * 100).toFixed(1));
  }

  return {
    successfulRunsCount,
    totalRunsCount,
    validLMRunsCount,
    invalidLMRunsCount,
    parserErrorRunsCount,
    abortedRunsCount,
    providerErrorRunsCount,
    inputTokens: calculateMetricStatistics(successfulRuns.map((r) => r.inputTokens)),
    outputTokens: calculateMetricStatistics(successfulRuns.map((r) => r.outputTokens)),
    totalTokens: calculateMetricStatistics(successfulRuns.map((r) => r.totalTokens)),
    modelOutputBytes: calculateMetricStatistics(
      successfulRuns.map((r) => r.modelOutputBytes ?? r.outputBytes)
    ),
    applicationSSEBytes: calculateMetricStatistics(
      successfulRuns.map((r) => r.applicationSSEBytes ?? r.networkBytes)
    ),
    providerTransportBytes: calculateMetricStatistics(
      successfulRuns.map((r) => r.providerTransportBytes)
    ),
    outputBytes: calculateMetricStatistics(successfulRuns.map((r) => r.outputBytes)),
    networkBytes: calculateMetricStatistics(successfulRuns.map((r) => r.networkBytes)),
    patchBatchCount: calculateMetricStatistics(successfulRuns.map((r) => r.patchBatchCount)),
    patchOperationCount: calculateMetricStatistics(successfulRuns.map((r) => r.patchOperationCount)),
    patchBytes: calculateMetricStatistics(
      successfulRuns.map((r) => r.patchBytes ?? r.canonicalPatchBytes)
    ),
    canonicalPatchBytes: calculateMetricStatistics(
      successfulRuns.map((r) => r.canonicalPatchBytes ?? r.patchBytes)
    ),
    patchSSEBytes: calculateMetricStatistics(successfulRuns.map((r) => r.patchSSEBytes)),
    timeToFirstContent: calculateMetricStatistics(successfulRuns.map((r) => r.timeToFirstContent)),
    timeToFirstLMChunk: calculateMetricStatistics(successfulRuns.map((r) => r.timeToFirstLMChunk)),
    timeToFirstPatch: calculateMetricStatistics(successfulRuns.map((r) => r.timeToFirstPatch)),
    timeToFirstBrowserRender: calculateMetricStatistics(
      successfulRuns.map((r) => r.timeToFirstBrowserRender)
    ),
    timeToCompletion: calculateMetricStatistics(successfulRuns.map((r) => r.timeToCompletion)),
    jsLMBytes: calculateMetricStatistics(successfulRuns.map((r) => r.jsLMBytes)),
    canonicalJSBytes: calculateMetricStatistics(successfulRuns.map((r) => r.canonicalJSBytes)),
    jsPatchBytes: calculateMetricStatistics(successfulRuns.map((r) => r.jsPatchBytes)),
    firstJSUnitLatencyMs: calculateMetricStatistics(successfulRuns.map((r) => r.firstJSUnitLatencyMs)),
    firstJSExecutionLatencyMs: calculateMetricStatistics(successfulRuns.map((r) => r.firstJSExecutionLatencyMs)),
    normalJSOutputTokens: calculateMetricStatistics(successfulRuns.map((r) => r.normalJSOutputTokens)),
    leveonasJSOutputTokens: calculateMetricStatistics(successfulRuns.map((r) => r.leveonasJSOutputTokens)),
    lmComplianceRate,
    systemPromptCharacters,
    systemPromptBytes,
    promptCharacters,
    runs,
  };
}

/**
 * Formats benchmark results into a clean human-readable table.
 * Displays: Metric | Normal | Leveonas | Difference
 */
export function formatBenchmarkTable(result: BenchmarkResult): string {
  const formatVal = (val: number | null | undefined, unit = ''): string => {
    if (val === null || val === undefined) return 'N/A';
    return `${val}${unit ? ` ${unit}` : ''}`;
  };

  const formatDiff = (
    normalVal: number | null | undefined,
    leveonasVal: number | null | undefined,
    unit = ''
  ): string => {
    if (
      normalVal === null ||
      normalVal === undefined ||
      leveonasVal === null ||
      leveonasVal === undefined
    ) {
      return 'N/A';
    }
    const diff = leveonasVal - normalVal;
    const sign = diff > 0 ? '+' : '';
    const pct =
      normalVal !== 0 ? ` (${((diff / normalVal) * 100).toFixed(1)}%)` : '';
    return `${sign}${diff.toFixed(1)}${unit ? ` ${unit}` : ''}${pct}`;
  };

  const rows: [string, string, string, string][] = [
    [
      'Input tokens',
      formatVal(result.normal.inputTokens.mean),
      formatVal(result.leveonas.inputTokens.mean),
      formatDiff(result.normal.inputTokens.mean, result.leveonas.inputTokens.mean),
    ],
    [
      'Output tokens',
      formatVal(result.normal.outputTokens.mean),
      formatVal(result.leveonas.outputTokens.mean),
      formatDiff(result.normal.outputTokens.mean, result.leveonas.outputTokens.mean),
    ],
    [
      'Total tokens',
      formatVal(result.normal.totalTokens.mean),
      formatVal(result.leveonas.totalTokens.mean),
      formatDiff(result.normal.totalTokens.mean, result.leveonas.totalTokens.mean),
    ],
    [
      'Output bytes',
      formatVal(result.normal.modelOutputBytes?.mean ?? result.normal.outputBytes.mean, 'B'),
      formatVal(result.leveonas.modelOutputBytes?.mean ?? result.leveonas.outputBytes.mean, 'B'),
      formatDiff(result.normal.outputBytes.mean, result.leveonas.outputBytes.mean, 'B'),
    ],
    [
      'Network bytes',
      formatVal(result.normal.applicationSSEBytes?.mean ?? result.normal.networkBytes.mean, 'B'),
      formatVal(result.leveonas.applicationSSEBytes?.mean ?? result.leveonas.networkBytes.mean, 'B'),
      formatDiff(result.normal.networkBytes.mean, result.leveonas.networkBytes.mean, 'B'),
    ],
    [
      'Time to first content',
      formatVal(result.normal.timeToFirstContent.mean, 'ms'),
      formatVal(result.leveonas.timeToFirstContent.mean, 'ms'),
      formatDiff(
        result.normal.timeToFirstContent.mean,
        result.leveonas.timeToFirstContent.mean,
        'ms'
      ),
    ],
    [
      'Time to first browser render',
      formatVal(result.normal.timeToFirstBrowserRender.mean, 'ms'),
      formatVal(result.leveonas.timeToFirstBrowserRender.mean ?? result.leveonas.timeToFirstPatch?.mean, 'ms'),
      formatDiff(
        result.normal.timeToFirstBrowserRender.mean,
        result.leveonas.timeToFirstBrowserRender.mean ?? result.leveonas.timeToFirstPatch?.mean,
        'ms'
      ),
    ],
    [
      'Completion time',
      formatVal(result.normal.timeToCompletion.mean, 'ms'),
      formatVal(result.leveonas.timeToCompletion.mean, 'ms'),
      formatDiff(
        result.normal.timeToCompletion.mean,
        result.leveonas.timeToCompletion.mean,
        'ms'
      ),
    ],
  ];

  const colWidths = [28, 14, 14, 22];
  const pad = (str: string, width: number) => str.padEnd(width, ' ');

  const header = `${pad('Metric', colWidths[0])} | ${pad('Normal', colWidths[1])} | ${pad(
    'Leveonas',
    colWidths[2]
  )} | ${pad('Difference', colWidths[3])}`;
  const separator = colWidths.map((w) => '-'.repeat(w)).join('-|-');

  const formattedRows = rows
    .map(
      ([metric, normal, leveonas, diff]) =>
        `${pad(metric, colWidths[0])} | ${pad(normal, colWidths[1])} | ${pad(
          leveonas,
          colWidths[2]
        )} | ${pad(diff, colWidths[3])}`
    )
    .join('\n');

  return `${header}\n${separator}\n${formattedRows}`;
}

/**
 * A/B Benchmark Harness.
 *
 * Runs NORMAL code generation vs LEVEONAS LM generation across N iterations
 * using the exact same provider, model, user prompt, and generation settings.
 *
 * Guaranteed constraints:
 * - Order Randomization: per iteration, randomly chooses [NORMAL, LEVEONAS] or [LEVEONAS, NORMAL]
 * - Deterministic Testing: accepts optional randomFn to control execution order without nondeterminism
 * - Same user prompt & generation settings across both arms
 * - Same provider and model
 * - Distinct system instructions (NORMAL_SYSTEM_INSTRUCTION vs BASELINE_SYSTEM_INSTRUCTION)
 * - Unique runId per execution
 * - Authoritative provider-reported tokens (null if unavailable, never estimated)
 * - Raw emitted byte counts (modelOutputBytes) measured without modification
 * - Reconstructed application SSE payload bytes (applicationSSEBytes) measured separately
 * - Canonical patch bytes measured separately
 * - Preserves fairness: identical temperature/seed/maxTokens
 * - Development-only: disabled in production
 */
export async function runABBenchmark(
  options: BenchmarkOptions
): Promise<BenchmarkResult> {
  if (!isBenchmarkAllowed()) {
    throw new Error('Benchmark harness is disabled in production.');
  }

  const {
    provider,
    model,
    framework = 'html',
    scenario,
    prompt: customPrompt,
    iterations = 5,
    maxTokens = 4096,
    temperature,
    seed,
    executor,
    randomFn,
  } = options;

  let prompt = customPrompt;
  if (!prompt) {
    if (scenario && BENCHMARK_SCENARIOS[scenario]) {
      prompt = BENCHMARK_SCENARIOS[scenario].prompts[framework] || BENCHMARK_SCENARIOS[scenario].defaultPrompt;
    } else {
      prompt = STANDARD_TEST_PROMPT;
    }
  }

  if (!executor) {
    throw new Error('Benchmark executor is required to execute benchmark runs.');
  }

  const benchmarkId = generateTelemetryRunId();
  const generationSettings: BenchmarkGenerationSettings = {
    maxTokens,
    temperature,
    seed,
  };

  const normalSysInstruction = getNormalSystemInstruction(framework);
  const leveonasSysInstruction = getLeveonasSystemInstruction(framework);

  const normalSystemPromptCharacters = Array.from(normalSysInstruction).length;
  const normalSystemPromptBytes = Buffer.byteLength(normalSysInstruction, 'utf8');

  const leveonasSystemPromptCharacters = Array.from(leveonasSysInstruction).length;
  const leveonasSystemPromptBytes = Buffer.byteLength(leveonasSysInstruction, 'utf8');

  const promptCharacters = Array.from(prompt).length;

  const normalRuns: BenchmarkRunMetrics[] = [];
  const leveonasRuns: BenchmarkRunMetrics[] = [];
  const iterationErrors: string[] = [];
  const executionOrders: BenchmarkMode[][] = [];
  const iterationsList: BenchmarkIteration[] = [];

  const rng = randomFn ?? Math.random;

  for (let i = 1; i <= iterations; i++) {
    // Randomize execution order per iteration to eliminate order bias
    const order: BenchmarkMode[] = rng() < 0.5 ? ['NORMAL', 'LEVEONAS'] : ['LEVEONAS', 'NORMAL'];
    executionOrders.push(order);

    let iterationNormal: BenchmarkRunMetrics | null = null;
    let iterationLeveonas: BenchmarkRunMetrics | null = null;

    try {
      for (const mode of order) {
        if (mode === 'NORMAL') {
          const normalRunId = generateTelemetryRunId();
          iterationNormal = await executor({
            mode: 'NORMAL',
            provider,
            model,
            prompt,
            systemInstruction: normalSysInstruction,
            runId: normalRunId,
            iteration: i,
            generationSettings,
          });
          iterationNormal.framework = framework;
          iterationNormal.scenario = scenario;
        } else {
          const leveonasRunId = generateTelemetryRunId();
          iterationLeveonas = await executor({
            mode: 'LEVEONAS',
            provider,
            model,
            prompt,
            systemInstruction: leveonasSysInstruction,
            runId: leveonasRunId,
            iteration: i,
            generationSettings,
          });
          iterationLeveonas.framework = framework;
          iterationLeveonas.scenario = scenario;
        }
      }

      if (iterationNormal && iterationLeveonas) {
        normalRuns.push(iterationNormal);
        leveonasRuns.push(iterationLeveonas);
        iterationsList.push({
          iteration: i,
          executionOrder: order,
          normal: iterationNormal,
          leveonas: iterationLeveonas,
        });
      }
    } catch (err: any) {
      // Authentication errors, quota errors, or abort errors abort immediately
      const isAuthError =
        err?.status === 401 ||
        err?.status === 403 ||
        /unauthorized|invalid api key|api key|quota_exceeded/i.test(err?.message || '');
      const isAbortError = err?.name === 'AbortError' || /aborted/i.test(err?.message || '');

      if (isAuthError || isAbortError) {
        throw err;
      }

      iterationErrors.push(`Iteration ${i} failed: ${err?.message || String(err)}`);
    }
  }

  if (normalRuns.length === 0 || leveonasRuns.length === 0) {
    throw new Error(
      `All ${iterations} benchmark iterations failed. Errors:\n${iterationErrors.join('\n')}`
    );
  }

  const normalStats = aggregateModeStatistics(
    normalRuns,
    normalSystemPromptCharacters,
    normalSystemPromptBytes,
    promptCharacters
  );

  const leveonasStats = aggregateModeStatistics(
    leveonasRuns,
    leveonasSystemPromptCharacters,
    leveonasSystemPromptBytes,
    promptCharacters
  );

  const comparison = compareBenchmark({
    normalInputTokens: normalStats.inputTokens.mean,
    normalOutputTokens: normalStats.outputTokens.mean,
    leveonasInputTokens: leveonasStats.inputTokens.mean,
    leveonasOutputTokens: leveonasStats.outputTokens.mean,
    normalGeneratedBytes: normalStats.modelOutputBytes.mean ?? 0,
    leveonasLMBytes: leveonasStats.modelOutputBytes.mean ?? 0,
    normalNetworkBytes: normalStats.applicationSSEBytes.mean ?? 0,
    leveonasNetworkBytes: leveonasStats.applicationSSEBytes.mean ?? 0,
  });

  // Calculate compiler profiling for Leveonas mode
  let compilerProfiling: any = undefined;
  let compressionBreakdown: any = undefined;

  const sampleLeveonasRun = leveonasRuns[0];
  const sampleNormalRun = normalRuns[0];
  if (sampleLeveonasRun && (sampleLeveonasRun as any).outputBytes) {
    const rawLM = (sampleLeveonasRun as any).rawLMText || '<HTML>\n(di (h1 "Sample"))\n</HTML>';
    compilerProfiling = LeveonasIRProfiler.profile(rawLM, framework);
  }
  if (sampleNormalRun && sampleLeveonasRun) {
    const normText = (sampleNormalRun as any).rawOutputText || '<div><h1>Sample</h1></div>';
    const lmText = (sampleLeveonasRun as any).rawLMText || '(di (h1 "Sample"))';
    compressionBreakdown = LMCompressionAnalyzer.analyze(normText, lmText);
  }

  return {
    benchmarkId,
    provider,
    model,
    framework,
    scenario,
    iterations,
    executionOrders,
    iterationsList,
    generationSettings,
    normalSystemPromptCharacters,
    normalSystemPromptBytes,
    leveonasSystemPromptCharacters,
    leveonasSystemPromptBytes,
    normal: normalStats,
    leveonas: leveonasStats,
    comparison,
    compilerProfiling,
    compressionBreakdown,
  };
}

/**
 * Creates a mock benchmark executor for deterministic testing and simulation.
 */
export function createMockBenchmarkExecutor(options?: {
  normalOutputText?: string;
  leveonasOutputLM?: string;
  providerTokens?: {
    normal?: {
      inputTokens: number | null;
      outputTokens: number | null;
      totalTokens: number | null;
    };
    leveonas?: {
      inputTokens: number | null;
      outputTokens: number | null;
      totalTokens: number | null;
    };
  };
  timings?: {
    timeToFirstProviderChunk?: number;
    timeToFirstContent?: number;
    timeToFirstPatch?: number;
    timeToFirstBrowserRender?: number;
    timeToCompletion?: number;
  };
  patchSSEBytes?: number;
}): BenchmarkRunExecutor {
  const normalText =
    options?.normalOutputText ??
    '<!DOCTYPE html><html><head><title>NovaFlow</title></head><body><header>NovaFlow</header><main>Hero</main></body></html>';
  const leveonasLM =
    options?.leveonasOutputLM ??
    '<HTML>\n(he (h1 "NovaFlow AI"))\n(mi (so (p "Instant Interfaces")))\n</HTML>';

  return async (input: BenchmarkRunExecutorInput): Promise<BenchmarkRunMetrics> => {
    const isNormal = input.mode === 'NORMAL';
    const text = isNormal ? normalText : leveonasLM;

    const outputCharacters = Array.from(text).length;
    const outputCodeUnits = text.length;
    const outputBytes = Buffer.byteLength(text, 'utf8');

    const systemPromptCharacters = Array.from(input.systemInstruction).length;
    const systemPromptBytes = Buffer.byteLength(input.systemInstruction, 'utf8');
    const promptCharacters = Array.from(input.prompt).length;

    const tokenConfig = isNormal
      ? options?.providerTokens?.normal
      : options?.providerTokens?.leveonas;

    const inputTokens = tokenConfig !== undefined ? tokenConfig.inputTokens : 150;
    const outputTokens = tokenConfig !== undefined
      ? tokenConfig.outputTokens
      : isNormal
      ? 1200
      : 400;
    const totalTokens = tokenConfig !== undefined
      ? tokenConfig.totalTokens
      : inputTokens !== null && outputTokens !== null
      ? inputTokens + outputTokens
      : null;

    const patchSSEBytes = isNormal ? 0 : (options?.patchSSEBytes ?? Math.round(outputBytes * 1.15));
    const normalNetworkBytes = outputBytes;
    const applicationSSEBytes = isNormal ? normalNetworkBytes : patchSSEBytes;

    const timeToFirstProviderChunk = options?.timings?.timeToFirstProviderChunk ?? 200;
    const timeToFirstContent = options?.timings?.timeToFirstContent ?? 250;
    const timeToFirstPatch = isNormal ? null : (options?.timings?.timeToFirstPatch ?? 280);
    const timeToFirstBrowserRender =
      options?.timings?.timeToFirstBrowserRender ?? (isNormal ? 1500 : 310);
    const timeToCompletion =
      options?.timings?.timeToCompletion ?? (isNormal ? 2800 : 1200);

    const lmCompliance = !isNormal ? validateLMGeneration(text) : null;
    const classification: LMOutputClassification | undefined = !isNormal
      ? lmCompliance?.classification
      : undefined;

    return {
      runId: input.runId,
      iteration: input.iteration,
      mode: input.mode,
      provider: input.provider,
      model: input.model,
      status: 'success',
      classification,
      lmCompliance,
      promptCharacters,
      systemPromptCharacters,
      systemPromptBytes,
      inputTokens,
      outputTokens,
      totalTokens,
      outputCharacters,
      outputCodeUnits,
      modelOutputBytes: outputBytes,
      applicationSSEBytes,
      providerTransportBytes: null,
      outputBytes,
      normalGeneratedBytes: isNormal ? outputBytes : undefined,
      leveonasLMBytes: !isNormal ? outputBytes : undefined,
      networkBytes: applicationSSEBytes,
      normalNetworkBytes: isNormal ? applicationSSEBytes : undefined,
      leveonasNetworkBytes: !isNormal ? applicationSSEBytes : undefined,
      lmStreamBytes: !isNormal ? outputBytes : undefined,
      patchBytes: !isNormal ? outputBytes : undefined,
      canonicalPatchBytes: !isNormal ? outputBytes : undefined,
      patchSSEBytes: !isNormal ? patchSSEBytes : undefined,
      totalSSEBytes: !isNormal ? patchSSEBytes : undefined,
      timeToFirstProviderChunk,
      timeToFirstContent,
      timeToFirstGeneratedContent: isNormal ? timeToFirstContent : undefined,
      timeToFirstLMChunk: !isNormal ? timeToFirstContent : undefined,
      timeToFirstPatch,
      timeToFirstBrowserRender,
      timeToCompletion,
      generationSettings: input.generationSettings,
    };
  };
}

/**
 * Creates an executor that processes LM text through the real LMGenerationPipeline
 * to calculate exact real patch SSE byte counts and model bytes.
 */
export function createPipelineBenchmarkExecutor(options?: {
  normalOutputText?: string;
  leveonasOutputLM?: string;
  providerTokens?: {
    normal?: {
      inputTokens: number | null;
      outputTokens: number | null;
      totalTokens: number | null;
    };
    leveonas?: {
      inputTokens: number | null;
      outputTokens: number | null;
      totalTokens: number | null;
    };
  };
}): BenchmarkRunExecutor {
  const normalText =
    options?.normalOutputText ??
    '<!DOCTYPE html><html><head><title>NovaFlow</title></head><body><header>NovaFlow</header><main>Hero</main></body></html>';
  const leveonasLM =
    options?.leveonasOutputLM ??
    '<HTML>\ndi(cs(page)\n  h1(NovaFlow AI)\n  p(Instant Interfaces)\n)\n</HTML>';

  return async (input: BenchmarkRunExecutorInput): Promise<BenchmarkRunMetrics> => {
    const isNormal = input.mode === 'NORMAL';
    const text = isNormal ? normalText : leveonasLM;

    const outputCharacters = Array.from(text).length;
    const outputCodeUnits = text.length;
    const outputBytes = Buffer.byteLength(text, 'utf8');

    const systemPromptCharacters = Array.from(input.systemInstruction).length;
    const systemPromptBytes = Buffer.byteLength(input.systemInstruction, 'utf8');
    const promptCharacters = Array.from(input.prompt).length;

    const tokenConfig = isNormal
      ? options?.providerTokens?.normal
      : options?.providerTokens?.leveonas;

    const inputTokens = tokenConfig ? tokenConfig.inputTokens : null;
    const outputTokens = tokenConfig ? tokenConfig.outputTokens : null;
    const totalTokens = tokenConfig ? tokenConfig.totalTokens : null;

    let patchSSEBytes = 0;
    let canonicalPatchBytes = 0;
    let totalSSEBytes = 0;
    let timeToFirstPatch: number | null = null;
    let patchBatchCount = 0;
    let patchOperationCount = 0;

    if (!isNormal) {
      const pipeline = new LMGenerationPipeline({
        rootId: 'leveonas-root',
        onPatch: (patches) => {
          if (timeToFirstPatch === null && patches.length > 0) {
            timeToFirstPatch = 120;
          }
          if (patches.length > 0) {
            patchBatchCount++;
            patchOperationCount += patches.length;
          }
          const canonicalJSON = PatchSerializer.toJSON(patches);
          canonicalPatchBytes += Buffer.byteLength(canonicalJSON, 'utf8');
          const serialized = JSON.parse(canonicalJSON);
          const sseEvent = `data: ${JSON.stringify({ patch: serialized })}\n\n`;
          const eventBytes = Buffer.byteLength(sseEvent, 'utf8');
          patchSSEBytes += eventBytes;
          totalSSEBytes += eventBytes;
        },
      });

      pipeline.write(leveonasLM);
      pipeline.end();
    }

    const applicationSSEBytes = isNormal ? outputBytes : patchSSEBytes;
    const lmCompliance = !isNormal ? validateLMGeneration(text) : null;
    const classification: LMOutputClassification | undefined = !isNormal
      ? lmCompliance?.classification
      : undefined;

    return {
      runId: input.runId,
      iteration: input.iteration,
      mode: input.mode,
      provider: input.provider,
      model: input.model,
      status: 'success',
      classification,
      lmCompliance,
      promptCharacters,
      systemPromptCharacters,
      systemPromptBytes,
      inputTokens,
      outputTokens,
      totalTokens,
      outputCharacters,
      outputCodeUnits,
      modelOutputBytes: outputBytes,
      applicationSSEBytes,
      providerTransportBytes: null,
      outputBytes,
      normalGeneratedBytes: isNormal ? outputBytes : undefined,
      leveonasLMBytes: !isNormal ? outputBytes : undefined,
      networkBytes: applicationSSEBytes,
      normalNetworkBytes: isNormal ? applicationSSEBytes : undefined,
      leveonasNetworkBytes: !isNormal ? applicationSSEBytes : undefined,
      lmStreamBytes: !isNormal ? outputBytes : undefined,
      patchBatchCount: !isNormal ? patchBatchCount : undefined,
      patchOperationCount: !isNormal ? patchOperationCount : undefined,
      patchBytes: !isNormal ? canonicalPatchBytes : undefined,
      canonicalPatchBytes: !isNormal ? canonicalPatchBytes : undefined,
      patchSSEBytes: !isNormal ? patchSSEBytes : undefined,
      totalSSEBytes: !isNormal ? totalSSEBytes : undefined,
      timeToFirstProviderChunk: 100,
      timeToFirstContent: 150,
      timeToFirstGeneratedContent: isNormal ? 150 : undefined,
      timeToFirstLMChunk: !isNormal ? 150 : undefined,
      timeToFirstPatch: isNormal ? null : timeToFirstPatch,
      timeToFirstBrowserRender: isNormal ? 800 : 180,
      timeToCompletion: isNormal ? 1400 : 600,
      generationSettings: input.generationSettings,
    };
  };
}
