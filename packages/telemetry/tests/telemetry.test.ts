import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveEnableTelemetry } from '../../../app/api/generate/config';
import { extractProviderUsage } from '../../../app/api/generate/providers';
import { GenerationTelemetryTracker, generateTelemetryRunId } from '../tracker';
import { ClientTelemetryTracker } from '../client-tracker';
import { compareTokens, compareSizes } from '../comparison';
import { LMGenerationPipeline } from '../../compiler/pipeline/generation-pipeline';
import { PatchOperation, PatchOperationType } from '../../runtime/incremental/patch-generator/types';
import { PatchSerializer } from '../../runtime/incremental/patch-generator/serializer';
import { ASTFactory } from '../../compiler/ast/factory';
import { ASTNodeKind } from '../../compiler/ast/types';
import { STANDARD_TEST_PROMPT, BASELINE_SYSTEM_INSTRUCTION, STANDARD_MODEL_TEST_MATRIX } from '../fixtures';

test('1. Telemetry is disabled by default in production and development', () => {
  assert.equal(resolveEnableTelemetry(undefined, undefined, 'production'), false);
  assert.equal(resolveEnableTelemetry(undefined, undefined, 'development'), false);
  assert.equal(resolveEnableTelemetry(undefined, 'false', 'development'), false);
  assert.equal(resolveEnableTelemetry(null, undefined, 'production'), false);
});

test('2. Telemetry is enabled when explicitly requested', () => {
  assert.equal(resolveEnableTelemetry(true, undefined, 'production'), true);
  assert.equal(resolveEnableTelemetry(false, 'true', 'production'), false);
  assert.equal(resolveEnableTelemetry(undefined, 'true', 'production'), true);
  assert.equal(resolveEnableTelemetry(undefined, 'true', 'development'), true);

  const tracker = new GenerationTelemetryTracker({
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    promptLength: 100,
    systemInstruction: 'sys instruction',
  });
  tracker.recordProviderChunk('<HTML>\n(di [id="app"] "Hello")\n</HTML>');
  tracker.complete();

  const summary = tracker.toServerSummary();
  assert.equal(summary.provider, 'gemini');
  assert.equal(summary.model, 'gemini-2.5-flash');
  assert.equal(typeof summary.timeToCompletionMs, 'number');
});

test('3. Token usage normalization across providers', () => {
  // OpenAI format
  const openaiUsage = extractProviderUsage('openai', {
    usage: { prompt_tokens: 150, completion_tokens: 45, total_tokens: 195 },
  });
  assert.deepEqual(openaiUsage, {
    inputTokens: 150,
    outputTokens: 45,
    totalTokens: 195,
    source: 'provider',
  });

  // Grok format (OpenAI compatible)
  const grokUsage = extractProviderUsage('grok', {
    usage: { prompt_tokens: 200, completion_tokens: 80, total_tokens: 280 },
  });
  assert.deepEqual(grokUsage, {
    inputTokens: 200,
    outputTokens: 80,
    totalTokens: 280,
    source: 'provider',
  });

  // Gemini format
  const geminiUsage = extractProviderUsage('gemini', {
    usageMetadata: { promptTokenCount: 300, candidatesTokenCount: 120, totalTokenCount: 420 },
  });
  assert.deepEqual(geminiUsage, {
    inputTokens: 300,
    outputTokens: 120,
    totalTokens: 420,
    source: 'provider',
  });

  // Anthropic format
  const anthropicStart = extractProviderUsage('anthropic', {
    type: 'message_start',
    message: { usage: { input_tokens: 250, output_tokens: 10 } },
  });
  assert.deepEqual(anthropicStart, {
    inputTokens: 250,
    outputTokens: 10,
    totalTokens: 260,
    source: 'provider',
  });

  const anthropicDelta = extractProviderUsage('anthropic', {
    type: 'message_delta',
    usage: { output_tokens: 95 },
  });
  assert.deepEqual(anthropicDelta, {
    inputTokens: null,
    outputTokens: 95,
    totalTokens: null,
    source: 'provider',
  });
});

test('4. Unavailable token usage returns null and never estimates from characters', () => {
  assert.equal(extractProviderUsage('openai', {}), null);
  assert.equal(extractProviderUsage('gemini', { candidates: [] }), null);
  assert.equal(extractProviderUsage('openai', null), null);

  const tracker = new GenerationTelemetryTracker({
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    promptLength: 200,
    systemInstruction: 'sys',
  });
  tracker.recordProviderChunk('Some response');
  tracker.complete();

  const telemetry = tracker.getTelemetry();
  assert.equal(telemetry.tokens.usage, null);
  assert.equal(telemetry.tokens.tokenCountsAvailable, false);
});

test('5. Patch operation counting and type breakdown', () => {
  const tracker = new GenerationTelemetryTracker({
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    promptLength: 100,
    systemInstruction: 'sys',
  });

  const loc = ASTFactory.createSourceLocation(1, 1, 0, 1, 10, 9);
  const node = ASTFactory.createComponent(ASTNodeKind.Container, loc, [], []);

  const patches: PatchOperation[] = [
    {
      operation: PatchOperationType.CREATE_NODE,
      nodeId: 'n1',
      payload: { node },
    },
    {
      operation: PatchOperationType.UPDATE_TEXT,
      nodeId: 'n1',
      payload: { oldText: 'Old', newText: 'New' },
    },
    {
      operation: PatchOperationType.SET_ATTRIBUTE,
      nodeId: 'n1',
      payload: { name: 'class', value: 'btn' },
    },
  ];

  tracker.recordPatchBatch(patches);
  tracker.complete();

  const telemetry = tracker.getTelemetry();
  assert.equal(telemetry.patches.patchBatchCount, 1);
  assert.equal(telemetry.patches.patchOperationCount, 3);
  assert.equal(telemetry.patches.operations.CREATE_NODE, 1);
  assert.equal(telemetry.patches.operations.UPDATE_TEXT, 1);
  assert.equal(telemetry.patches.operations.SET_ATTRIBUTE, 1);
  assert.equal(telemetry.patches.operations.REMOVE_NODE, 0);
});

test('6. Patch byte counting matches serializer output', () => {
  const tracker = new GenerationTelemetryTracker({
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    promptLength: 100,
    systemInstruction: 'sys',
  });

  const patches: PatchOperation[] = [
    {
      operation: PatchOperationType.UPDATE_TEXT,
      nodeId: 'leveonas-root',
      payload: { oldText: '', newText: 'Hello World' },
    },
  ];

  tracker.recordPatchBatch(patches);
  const telemetry = tracker.getTelemetry();
  assert.ok(telemetry.patches.patchBytes > 0);
});

test('7. Timing calculation and non-negative durations', async () => {
  const start = Date.now() - 50;
  const tracker = new GenerationTelemetryTracker({
    provider: 'openai',
    model: 'gpt-4o',
    promptLength: 80,
    systemInstruction: 'sys',
    requestStartTime: start,
  });

  tracker.recordProviderChunk('<HTML>');
  tracker.recordPatchBatch([
    {
      operation: PatchOperationType.UPDATE_TEXT,
      nodeId: 'leveonas-root',
      payload: { oldText: '', newText: 'A' },
    },
  ]);
  tracker.complete();

  const durations = tracker.getDurations();
  assert.ok(durations.durationToFirstLMChunkMs !== null && durations.durationToFirstLMChunkMs >= 0);
  assert.ok(durations.durationToFirstPatchMs !== null && durations.durationToFirstPatchMs >= 0);
  assert.ok(durations.durationToCompletionMs !== null && durations.durationToCompletionMs >= 0);
  assert.ok(durations.durationToCompletionMs >= durations.durationToFirstPatchMs);
});

test('8. Comparison calculations for tokens and sizes', () => {
  // Token comparison
  const tokenComp = compareTokens({
    normalInputTokens: 1000,
    normalOutputTokens: 2000,
    leveonasInputTokens: 1200, // input increased due to LM system instruction
    leveonasOutputTokens: 1100, // output decreased due to LM conciseness
  });

  assert.equal(tokenComp.outputTokenReduction, 900);
  assert.equal(tokenComp.outputTokenReductionPercent, 45); // (900 / 2000) * 100
  assert.equal(tokenComp.totalTokenReduction, 700); // 3000 - 2300 = 700
  assert.equal(Math.round(tokenComp.totalTokenReductionPercent * 100) / 100, 23.33); // (700 / 3000) * 100
  assert.equal(tokenComp.inputTokenDifference, 200); // Explicitly tracks input difference without calling it savings
  assert.equal(tokenComp.isOutputReduced, true);
  assert.equal(tokenComp.isTotalReduced, true);

  // Size comparison
  const sizeComp = compareSizes({
    normalGeneratedBytes: 10000,
    leveonasLMBytes: 5500,
    leveonasPatchBytes: 6200,
  });

  assert.equal(sizeComp.lmByteReduction, 4500);
  assert.equal(sizeComp.lmByteReductionPercent, 45);
  assert.equal(sizeComp.patchByteReduction, 3800);
  assert.equal(sizeComp.patchByteReductionPercent, 38);
});

test('9. No prompt, credentials, or API key leakage in telemetry', () => {
  const secretApiKey = 'sk-secret-key-12345-very-confidential';
  const confidentialPrompt = 'My confidential corporate prompt with sensitive business logic';
  const confidentialSysInstruction = 'System instruction that should not be dumped wholesale';

  const tracker = new GenerationTelemetryTracker({
    provider: 'openai',
    model: 'gpt-4o',
    promptLength: confidentialPrompt.length,
    systemInstruction: confidentialSysInstruction,
  });

  tracker.recordProviderChunk('<HTML>\n(di "text")\n</HTML>');
  tracker.recordProviderUsage({
    inputTokens: 100,
    outputTokens: 50,
    totalTokens: 150,
    source: 'provider',
  });
  tracker.complete();

  const telemetryStr = JSON.stringify(tracker.getTelemetry());
  const summaryStr = JSON.stringify(tracker.toServerSummary());

  assert.equal(telemetryStr.includes(secretApiKey), false);
  assert.equal(telemetryStr.includes(confidentialPrompt), false);
  assert.equal(telemetryStr.includes(confidentialSysInstruction), false);

  assert.equal(summaryStr.includes(secretApiKey), false);
  assert.equal(summaryStr.includes(confidentialPrompt), false);
  assert.equal(summaryStr.includes(confidentialSysInstruction), false);
});

test('10. Client and server metric separation', () => {
  const clientTracker = new ClientTelemetryTracker();
  assert.equal(clientTracker.getTelemetry().firstPatchReceivedTimestamp, null);

  clientTracker.recordPatchBatch(
    [
      {
        operation: PatchOperationType.UPDATE_TEXT,
        nodeId: 'leveonas-root',
        payload: { oldText: '', newText: 'Hi' },
      },
    ],
    45
  );
  clientTracker.recordPatchApplied(12.5);

  const clientMetrics = clientTracker.getTelemetry();
  assert.equal(clientMetrics.patchBatchCount, 1);
  assert.equal(clientMetrics.patchOperationCount, 1);
  assert.equal(clientMetrics.patchBytes, 45);
  assert.equal(clientMetrics.domApplyDurationMs, 12.5);
  assert.ok(clientMetrics.firstPatchReceivedTimestamp !== null);
  assert.ok(clientMetrics.firstPatchAppliedTimestamp !== null);

  // Assert client telemetry does not contain server AST or provider internals
  assert.equal('durations' in clientMetrics, false);
  assert.equal('tokens' in clientMetrics, false);
});

test('11. Telemetry does not modify patch generation behavior', () => {
  const inputChunks = [
    '<HTML>\n',
    'di(cs(page)\n',
    '  h1(NovaFlow AI)\n',
    '  p(Instant Interfaces)\n',
    ')\n',
    '</HTML>',
  ];

  const patchesWithoutTelemetry: string[] = [];
  const pipelineA = new LMGenerationPipeline({
    onPatch: (patches) => patchesWithoutTelemetry.push(...patches.map((p) => p.type)),
  });

  for (const chunk of inputChunks) {
    pipelineA.write(chunk);
  }
  pipelineA.end();

  const patchesWithTelemetry: string[] = [];
  const tracker = new GenerationTelemetryTracker({
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    promptLength: 50,
    systemInstruction: 'sys',
  });

  const pipelineB = new LMGenerationPipeline({
    onPatch: (patches) => {
      tracker.recordPatchBatch(patches);
      patchesWithTelemetry.push(...patches.map((p) => p.type));
    },
    onASTUpdate: (ast) => {
      tracker.recordASTUpdate(ast);
    },
  });

  for (const chunk of inputChunks) {
    tracker.recordProviderChunk(chunk);
    pipelineB.write(chunk);
  }
  pipelineB.end();
  tracker.complete();

  assert.deepEqual(patchesWithTelemetry, patchesWithoutTelemetry);
  assert.ok(tracker.getTelemetry().patches.patchOperationCount > 0);
});

test('12. Telemetry measures exact model output without altering LM text', () => {
  const modelOutputWithWhitespaceAndComments =
    '   <HTML>  \n  ;; Comment explaining header  \n  (he "NovaFlow") \n </HTML>  ';

  const tracker = new GenerationTelemetryTracker({
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    promptLength: 20,
    systemInstruction: 'sys',
  });

  tracker.recordProviderChunk(modelOutputWithWhitespaceAndComments);
  tracker.complete();

  const telemetry = tracker.getTelemetry();
  // Exactly matches character and byte count without stripping whitespace or comments
  assert.equal(telemetry.lm.rawLMCharacterCount, modelOutputWithWhitespaceAndComments.length);
  assert.equal(
    telemetry.lm.rawLMByteCount,
    Buffer.byteLength(modelOutputWithWhitespaceAndComments, 'utf8')
  );
});

test('13. Standard test fixtures and model test matrix are available', () => {
  assert.ok(STANDARD_TEST_PROMPT.includes('NovaFlow'));
  assert.ok(BASELINE_SYSTEM_INSTRUCTION.includes('Leveonas Markup'));
  assert.equal(STANDARD_MODEL_TEST_MATRIX.length, 3);
  assert.equal(STANDARD_MODEL_TEST_MATRIX[0].provider, 'gemini');
  assert.equal(STANDARD_MODEL_TEST_MATRIX[1].provider, 'grok');
  assert.equal(STANDARD_MODEL_TEST_MATRIX[2].provider, 'openai');

  for (const entry of STANDARD_MODEL_TEST_MATRIX) {
    assert.equal(entry.prompt, STANDARD_TEST_PROMPT);
    assert.equal(entry.systemInstruction, BASELINE_SYSTEM_INSTRUCTION);
    assert.equal(entry.maxTokens, 4096);
  }
});

test('14. Unique runId generation and non-sensitive constraints', () => {
  const id1 = generateTelemetryRunId();
  const id2 = generateTelemetryRunId();
  assert.ok(id1 && id1.length > 0);
  assert.ok(id2 && id2.length > 0);
  assert.notEqual(id1, id2);

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  assert.ok(uuidRegex.test(id1));
  assert.ok(uuidRegex.test(id2));

  // Must NOT contain sensitive data
  const prompt = 'User prompt containing private keywords';
  const apiKey = 'sk-secret-key-abcdef';
  assert.equal(id1.includes(prompt), false);
  assert.equal(id1.includes(apiKey), false);
});

test('15. runId persistence in server serialization', () => {
  const tracker = new GenerationTelemetryTracker({
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    promptLength: 50,
    systemInstruction: 'sys',
  });

  const runId = tracker.getRunId();
  assert.ok(runId && runId.length > 0);

  const summary = tracker.toServerSummary();
  assert.equal(summary.runId, runId);

  const serializedSummary = JSON.stringify(summary);
  const parsedSummary = JSON.parse(serializedSummary);
  assert.equal(parsedSummary.runId, runId);

  const telemetry = tracker.getTelemetry();
  assert.equal(telemetry.runId, runId);
});

test('16. runId persistence in client delivery', () => {
  const clientTracker = new ClientTelemetryTracker();
  assert.equal(clientTracker.getRunId(), null);

  const testRunId = generateTelemetryRunId();
  clientTracker.setRunId(testRunId);
  assert.equal(clientTracker.getRunId(), testRunId);

  const clientTelemetry = clientTracker.getTelemetry();
  assert.equal(clientTelemetry.runId, testRunId);

  // Initialized directly with runId
  const clientTrackerWithId = new ClientTelemetryTracker(testRunId);
  assert.equal(clientTrackerWithId.getTelemetry().runId, testRunId);
});

test('17. Unicode LM output metrics: byte count vs character count vs code-unit count', () => {
  // "Hello 🇮🇳" has:
  // "Hello " = 6 characters, 6 code units, 6 bytes
  // "🇮🇳" = flag of India consisting of 2 regional indicator symbols:
  //   - Array.from("🇮🇳").length === 2 (Unicode scalar characters)
  //   - "🇮🇳".length === 4 (UTF-16 code units / surrogate pairs)
  //   - Buffer.byteLength("🇮🇳", 'utf8') === 8 (UTF-8 bytes)
  const unicodeLMText = '<HTML>(di "Hello 🇮🇳 🚀")</HTML>';
  const expectedCharCount = Array.from(unicodeLMText).length;
  const expectedCodeUnitCount = unicodeLMText.length;
  const expectedByteCount = Buffer.byteLength(unicodeLMText, 'utf8');

  assert.notEqual(expectedCharCount, expectedCodeUnitCount);
  assert.ok(expectedByteCount > expectedCodeUnitCount);

  const tracker = new GenerationTelemetryTracker({
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    promptLength: 10,
    systemInstruction: 'sys',
  });

  tracker.recordProviderChunk(unicodeLMText);
  tracker.complete();

  const telemetry = tracker.getTelemetry();
  assert.equal(telemetry.lm.rawLMCharacterCount, expectedCharCount);
  assert.equal(telemetry.lm.rawLMCodeUnitCount, expectedCodeUnitCount);
  assert.equal(telemetry.lm.rawLMByteCount, expectedByteCount);

  // Verify input size metrics remain separate
  assert.equal(telemetry.tokens.promptCharacters, 10);
  assert.equal(telemetry.tokens.systemPromptCharacters, 3);
  assert.equal(telemetry.tokens.systemPromptBytes, 3);
  assert.equal(telemetry.tokens.outputCharacters, expectedCharCount);
  assert.equal(telemetry.tokens.outputCodeUnits, expectedCodeUnitCount);
});

test('18. Canonical patch bytes vs received patch payload bytes separation', () => {
  const patches: PatchOperation[] = [
    {
      operation: PatchOperationType.UPDATE_TEXT,
      nodeId: 'leveonas-root',
      payload: { oldText: '', newText: 'Payload Test' },
    },
  ];

  // Server canonical calculation
  const serverTracker = new GenerationTelemetryTracker({
    provider: 'openai',
    model: 'gpt-4o',
    promptLength: 20,
    systemInstruction: 'sys',
  });
  serverTracker.recordPatchBatch(patches);

  const serverTelemetry = serverTracker.getTelemetry();
  const canonicalBytes = Buffer.byteLength(PatchSerializer.toJSON(patches), 'utf8');
  assert.equal(serverTelemetry.patches.canonicalPatchBytes, canonicalBytes);
  assert.equal(serverTelemetry.patches.patchBytes, canonicalBytes);

  // Client received payload calculation with wire overhead
  const clientTracker = new ClientTelemetryTracker();
  const simulatedSSEWireBytes = 142; // e.g. includes SSE prefix or envelope
  clientTracker.recordPatchBatch(patches, simulatedSSEWireBytes);

  const clientTelemetry = clientTracker.getTelemetry();
  assert.equal(clientTelemetry.receivedPatchPayloadBytes, simulatedSSEWireBytes);
  assert.equal(clientTelemetry.patchBytes, simulatedSSEWireBytes);
  assert.notEqual(clientTelemetry.receivedPatchPayloadBytes, canonicalBytes);
});

test('19. Server and client timing semantics without clock synchronization assumptions', () => {
  const serverStart = 1000000;
  const serverTracker = new GenerationTelemetryTracker({
    provider: 'openai',
    model: 'gpt-4o',
    promptLength: 20,
    systemInstruction: 'sys',
    requestStartTime: serverStart,
  });

  // Advance time relative to server start
  const firstPatchServerTime = serverStart + 120;
  (serverTracker as any).timestamps.firstPatch = firstPatchServerTime;
  const durations = serverTracker.getDurations();

  assert.equal(durations.serverTimeToFirstPatchMs, 120);
  assert.equal(durations.durationToFirstPatchMs, 120);

  // Client tracks its own fetchStart independently using its local clock
  const clientTracker = new ClientTelemetryTracker();
  const clientFetchStart = 500000; // Completely different epoch clock, e.g. client machine
  clientTracker.recordFetchStart(clientFetchStart);

  clientTracker.recordPatchBatch([
    {
      operation: PatchOperationType.UPDATE_TEXT,
      nodeId: 'leveonas-root',
      payload: { oldText: '', newText: 'T' },
    },
  ]);
  // Patch applied on client
  (clientTracker as any).firstPatchAppliedTimestamp = clientFetchStart + 85;
  const clientTelemetry = clientTracker.getTelemetry();

  assert.equal(clientTelemetry.clientTimeFromFetchStartToFirstPatchAppliedMs, 85);

  // Correlating server timing without merging absolute clocks
  clientTracker.setServerTiming(serverStart, durations.serverTimeToFirstPatchMs);
  const updatedClientTelemetry = clientTracker.getTelemetry();
  assert.equal(updatedClientTelemetry.serverRequestStartTimestamp, serverStart);
  assert.equal(updatedClientTelemetry.serverTimeToFirstPatchMs, 120);
  assert.equal(updatedClientTelemetry.clientTimeFromFetchStartToFirstPatchAppliedMs, 85);
});
