import {
  BenchmarkRunMetrics,
  NormalizedTokenUsage,
} from './types';
import {
  BenchmarkRunExecutor,
  BenchmarkRunExecutorInput,
} from './benchmark';
import {
  buildProviderRequest,
  streamProviderChunks,
  resolveProviderApiKey,
  sanitizeErrorMessage,
} from '@/app/api/generate/providers';
import { LMGenerationPipeline } from '@/packages/compiler/pipeline/generation-pipeline';
import { PatchSerializer } from '@/packages/runtime/incremental/patch-generator/serializer';
import { classifyLMCompliance } from './compliance';

export interface RealBenchmarkExecutorOptions {
  userLlmKey?: string | null;
  fetchFn?: typeof fetch;
  signal?: AbortSignal;
}

/**
 * Creates a real, provider-backed benchmark run executor.
 *
 * Executes real requests against the specified provider adapter (Gemini, Grok, OpenAI, etc.).
 *
 * NORMAL Mode:
 * - Emits standard frontend code using NORMAL_SYSTEM_INSTRUCTION
 * - Collects raw model output without running the HTML-LM compiler
 * - Captures authoritative provider usage, real network SSE payload bytes, and exact timings
 *
 * LEVEONAS Mode:
 * - Emits Leveonas Markup using BASELINE_SYSTEM_INSTRUCTION
 * - Incrementally feeds incoming provider chunks to LMGenerationPipeline
 * - Produces real AST, real diffs, real patches, and serializes patch SSE events
 * - Measures exact UTF-8 patch SSE payload bytes and exact timings
 *
 * Constraints:
 * - Strictly NO mock token estimation: missing usage remains null
 * - Strictly NO fabricated browser render timing: server timeToFirstBrowserRender is null
 * - Strictly NO fabricated network bytes: measured from exact SSE payloads
 * - Strictly NO output alteration: raw emitted model text is preserved byte-for-byte
 * - Zero credentials or sensitive data in returned metrics
 */
export function createRealBenchmarkExecutor(
  options?: RealBenchmarkExecutorOptions
): BenchmarkRunExecutor {
  return async (input: BenchmarkRunExecutorInput): Promise<BenchmarkRunMetrics> => {
    const isNormal = input.mode === 'NORMAL';
    const fetchFn = options?.fetchFn ?? fetch;

    // 1. Authoritative API key resolution
    const userLlmKey = resolveProviderApiKey(input.provider, options?.userLlmKey);
    if (!userLlmKey) {
      const err = new Error(
        `Missing API key for provider "${input.provider}". Please configure the server environment variable or pass the x-user-llm-key header.`
      );
      (err as any).status = 401;
      throw err;
    }

    // 2. Abort controller setup and propagation
    const runController = new AbortController();
    const onExternalAbort = () => {
      runController.abort();
    };

    if (options?.signal) {
      if (options.signal.aborted) {
        runController.abort();
      } else {
        options.signal.addEventListener('abort', onExternalAbort, { once: true });
      }
    }

    // 3. Build identical request configuration via existing provider adapter
    const providerConfig = buildProviderRequest(
      input.provider,
      input.model,
      input.prompt,
      userLlmKey,
      input.systemInstruction,
      input.generationSettings?.maxTokens,
      input.generationSettings?.temperature,
      input.generationSettings?.seed
    );

    const startTime = Date.now();
    let timeToFirstProviderChunk: number | null = null;
    let timeToFirstContent: number | null = null;
    let timeToFirstGeneratedContent: number | null = null;
    let timeToFirstLMChunk: number | null = null;
    let timeToFirstPatch: number | null = null;
    let timeToCompletion: number | null = null;

    let rawOutput = '';
    const usageHolder: { current: NormalizedTokenUsage | null } = { current: null };

    try {
      if (runController.signal.aborted) {
        const abortErr = new Error('Benchmark run aborted');
        abortErr.name = 'AbortError';
        throw abortErr;
      }

      // 4. Execute provider request
      const response = await fetchFn(providerConfig.fetchUrl, {
        ...providerConfig.fetchOptions,
        signal: runController.signal,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        const sanitized = sanitizeErrorMessage(errorText, [userLlmKey]);
        const err = new Error(
          `Provider error (${response.status}): ${sanitized || response.statusText}`
        );
        (err as any).status = response.status;
        throw err;
      }

      if (!response.body) {
        throw new Error(`Provider returned empty response body`);
      }

      // 5. Normalized stream with provider usage accumulation
      const textStream = streamProviderChunks(
        input.provider,
        response,
        runController.signal,
        (usage) => {
          usageHolder.current = usage;
        }
      );

      if (isNormal) {
        // ==========================================
        // NORMAL MODE EXECUTION
        // ==========================================
        let normalNetworkBytes = 0;

        for await (const chunk of textStream) {
          if (runController.signal.aborted) {
            const abortErr = new Error('Benchmark run aborted');
            abortErr.name = 'AbortError';
            throw abortErr;
          }

          const now = Date.now();
          if (timeToFirstProviderChunk === null) {
            timeToFirstProviderChunk = now - startTime;
          }
          if (chunk.length > 0 && timeToFirstContent === null) {
            timeToFirstContent = now - startTime;
            timeToFirstGeneratedContent = timeToFirstContent;
          }

          rawOutput += chunk;

          // Construct exact benchmark SSE representation for chunk streaming
          const sseEvent = `data: ${JSON.stringify({ text: chunk })}\n\n`;
          normalNetworkBytes += Buffer.byteLength(sseEvent, 'utf8');
        }

        if (runController.signal.aborted) {
          const abortErr = new Error('Benchmark run aborted');
          abortErr.name = 'AbortError';
          throw abortErr;
        }

        // Add termination sentinel to network byte count
        const doneEvent = 'data: [DONE]\n\n';
        normalNetworkBytes += Buffer.byteLength(doneEvent, 'utf8');

        timeToCompletion = Date.now() - startTime;

        const outputCharacters = Array.from(rawOutput).length;
        const outputCodeUnits = rawOutput.length;
        const outputBytes = Buffer.byteLength(rawOutput, 'utf8');

        const systemPromptCharacters = Array.from(input.systemInstruction).length;
        const systemPromptBytes = Buffer.byteLength(input.systemInstruction, 'utf8');
        const promptCharacters = Array.from(input.prompt).length;

        const latestUsage = usageHolder.current;
        const inputTokens = latestUsage?.inputTokens ?? null;
        const outputTokens = latestUsage?.outputTokens ?? null;
        const totalTokens = latestUsage?.totalTokens ?? (
          inputTokens !== null && outputTokens !== null ? inputTokens + outputTokens : null
        );

        return {
          runId: input.runId,
          iteration: input.iteration,
          mode: 'NORMAL',
          provider: input.provider,
          model: input.model,
          status: 'success',
          classification: undefined,
          error: null,
          lmCompliance: null,
          promptCharacters,
          systemPromptCharacters,
          systemPromptBytes,
          inputTokens,
          outputTokens,
          totalTokens,
          outputCharacters,
          outputCodeUnits,
          modelOutputBytes: outputBytes,
          applicationSSEBytes: normalNetworkBytes,
          providerTransportBytes: null,
          outputBytes,
          normalGeneratedBytes: outputBytes,
          networkBytes: normalNetworkBytes,
          normalNetworkBytes: normalNetworkBytes,
          timeToFirstProviderChunk,
          timeToFirstContent,
          timeToFirstGeneratedContent,
          timeToFirstPatch: null,
          timeToFirstBrowserRender: null,
          timeToCompletion,
          generationSettings: input.generationSettings,
        };
      } else {
        // ==========================================
        // LEVEONAS MODE EXECUTION
        // ==========================================
        let patchSSEBytes = 0;
        let canonicalPatchBytes = 0;
        let patchBatchCount = 0;
        let patchOperationCount = 0;
        let pipelineError: Error | null = null;

        const pipeline = new LMGenerationPipeline({
          rootId: 'leveonas-root',
          onPatch: (patches) => {
            const now = Date.now();
            if (timeToFirstPatch === null && patches.length > 0) {
              timeToFirstPatch = now - startTime;
            }

            if (patches.length > 0) {
              patchBatchCount += 1;
              patchOperationCount += patches.length;
            }

            // Measure canonical serialized patch bytes
            const canonicalJSON = PatchSerializer.toJSON(patches);
            canonicalPatchBytes += Buffer.byteLength(canonicalJSON, 'utf8');

            // Measure exact serialized SSE event payload
            const serialized = JSON.parse(canonicalJSON);
            const sseEvent = `data: ${JSON.stringify({ patch: serialized })}\n\n`;
            patchSSEBytes += Buffer.byteLength(sseEvent, 'utf8');
          },
          onError: (err) => {
            pipelineError = err instanceof Error ? err : new Error(String(err));
          },
        });

        // Feed chunks incrementally into pipeline as they arrive from the provider stream
        for await (const chunk of textStream) {
          if (runController.signal.aborted) {
            pipeline.abort();
            const abortErr = new Error('Benchmark run aborted');
            abortErr.name = 'AbortError';
            throw abortErr;
          }

          const now = Date.now();
          if (timeToFirstProviderChunk === null) {
            timeToFirstProviderChunk = now - startTime;
          }
          if (chunk.length > 0 && timeToFirstContent === null) {
            timeToFirstContent = now - startTime;
            timeToFirstLMChunk = timeToFirstContent;
          }

          rawOutput += chunk;
          pipeline.write(chunk);
        }

        if (runController.signal.aborted) {
          pipeline.abort();
          const abortErr = new Error('Benchmark run aborted');
          abortErr.name = 'AbortError';
          throw abortErr;
        }

        // Finalize pipeline
        pipeline.end();

        const diags = pipeline.getDiagnostics();
        const errorDiag = diags.find((d: any) => d.severity === 'error');
        if (errorDiag) {
          throw new Error(`HTML-LM Parser Error: ${errorDiag.message}`);
        }

        if (pipelineError) {
          throw pipelineError;
        }

        // Run scientific LM compliance classifier on generated output
        const lmCompliance = classifyLMCompliance(rawOutput);

        // Add termination sentinel to total SSE payload bytes
        const doneEvent = 'data: [DONE]\n\n';
        const totalSSEBytes = patchSSEBytes + Buffer.byteLength(doneEvent, 'utf8');

        timeToCompletion = Date.now() - startTime;

        const outputCharacters = Array.from(rawOutput).length;
        const outputCodeUnits = rawOutput.length;
        const outputBytes = Buffer.byteLength(rawOutput, 'utf8');

        const systemPromptCharacters = Array.from(input.systemInstruction).length;
        const systemPromptBytes = Buffer.byteLength(input.systemInstruction, 'utf8');
        const promptCharacters = Array.from(input.prompt).length;

        const latestUsage = usageHolder.current;
        const inputTokens = latestUsage?.inputTokens ?? null;
        const outputTokens = latestUsage?.outputTokens ?? null;
        const totalTokens = latestUsage?.totalTokens ?? (
          inputTokens !== null && outputTokens !== null ? inputTokens + outputTokens : null
        );

        const classification = lmCompliance.classification;

        return {
          runId: input.runId,
          iteration: input.iteration,
          mode: 'LEVEONAS',
          provider: input.provider,
          model: input.model,
          status: 'success',
          classification,
          error: null,
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
          applicationSSEBytes: totalSSEBytes,
          providerTransportBytes: null,
          outputBytes,
          leveonasLMBytes: outputBytes,
          networkBytes: patchSSEBytes,
          leveonasNetworkBytes: patchSSEBytes,
          lmStreamBytes: outputBytes,
          patchBatchCount,
          patchOperationCount,
          patchBytes: canonicalPatchBytes,
          canonicalPatchBytes,
          patchSSEBytes,
          totalSSEBytes,
          timeToFirstProviderChunk,
          timeToFirstContent,
          timeToFirstLMChunk,
          timeToFirstPatch,
          timeToFirstBrowserRender: null,
          timeToCompletion,
          generationSettings: input.generationSettings,
        };
      }
    } finally {
      if (options?.signal) {
        options.signal.removeEventListener('abort', onExternalAbort);
      }
    }
  };
}
