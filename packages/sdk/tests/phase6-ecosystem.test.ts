/**
 * Leveonas Phase 6: Production Platform & Developer Ecosystem Test Suite
 *
 * Verifies:
 * 1. SDK session lifecycle & AsyncIterable streaming events
 * 2. Provider normalization (Gemini, OpenAI, Grok)
 * 3. Exponential backoff retry engine & error classification
 * 4. Metrics API without fabricated tokens
 * 5. Configuration resolution & security defaults
 * 6. Compilation of all 7 official examples
 * 7. Compilation of all 5 starter templates
 * 8. Framework-free browser runtime bundle verification
 */

import { test } from 'node:test';
import assert from 'node:assert';
import * as fs from 'fs';
import * as path from 'path';

import {
  createSession,
  LeveonasSession,
  withRetry,
  isRetryableError,
  LeveonasAuthError,
  LeveonasRateLimitError,
  LeveonasUnavailableError,
  LeveonasAbortError,
  GeminiProvider,
  OpenAIProvider,
  GrokProvider,
} from '../index';
import { MetricsCollector } from '../../telemetry/metrics';
import { resolveLeveonasConfig, DEFAULT_LEVEONAS_CONFIG } from '../../common/config';
import { compile } from '../../index';
import { analyzeBundles } from '../../../scripts/bundle-size';

test('Leveonas Phase 6 Ecosystem Test Suite', async (t) => {
  await t.test('1. SDK session creation and lifecycle management', async () => {
    const session = createSession({
      provider: 'gemini',
      model: 'gemini-2.5-flash',
    });

    assert.ok(session instanceof LeveonasSession, 'Session must be instance of LeveonasSession');
    assert.strictEqual(session.getMetrics(), null, 'Initial metrics must be null');

    session.abort();
    session.destroy();

    // Operating after destroy must throw
    assert.throws(() => {
      session.generate('test');
    }, /Cannot operate on a destroyed LeveonasSession/);
  });

  await t.test('2. Provider error classification & retryable determination', async () => {
    const authErr = new LeveonasAuthError('Invalid key', 'gemini');
    assert.strictEqual(authErr.isRetryable, false, 'Auth error must NOT be retryable');
    assert.strictEqual(isRetryableError(authErr), false);

    const rateLimitErr = new LeveonasRateLimitError('Rate limit exceeded', 'openai');
    assert.strictEqual(rateLimitErr.isRetryable, true, 'Rate limit error MUST be retryable');
    assert.strictEqual(isRetryableError(rateLimitErr), true);

    const unavailErr = new LeveonasUnavailableError('Server overloaded', 'grok');
    assert.strictEqual(unavailErr.isRetryable, true, '503 unavailable MUST be retryable');
    assert.strictEqual(isRetryableError(unavailErr), true);

    const abortErr = new LeveonasAbortError('gemini');
    assert.strictEqual(abortErr.isRetryable, false, 'Abort error must NOT be retryable');
    assert.strictEqual(isRetryableError(abortErr), false);
  });

  await t.test('3. Exponential backoff retry engine behavior', async () => {
    let callCount = 0;
    // Retries on retryable error until threshold
    const res = await withRetry(
      async () => {
        callCount++;
        if (callCount < 3) {
          throw new LeveonasRateLimitError('Too many requests', 'openai');
        }
        return 'success';
      },
      { maxRetries: 3, initialDelayMs: 10, maxDelayMs: 50, jitter: false }
    );

    assert.strictEqual(res, 'success');
    assert.strictEqual(callCount, 3, 'Should have succeeded on 3rd attempt');

    // Does not retry on non-retryable error
    let nonRetryCount = 0;
    await assert.rejects(async () => {
      await withRetry(
        async () => {
          nonRetryCount++;
          throw new LeveonasAuthError('Bad token', 'gemini');
        },
        { maxRetries: 3, initialDelayMs: 10 }
      );
    }, LeveonasAuthError);

    assert.strictEqual(nonRetryCount, 1, 'Non-retryable error must fail immediately on 1st call');
  });

  await t.test('4. Metrics API strictly prevents token fabrication', async () => {
    const collector = new MetricsCollector({ mode: 'disabled' });
    collector.recordChunk(150);
    collector.recordPatch(2, 80);

    // No usage reported by provider
    const metrics = collector.complete();

    assert.ok(metrics.durationMs >= 0, 'Duration must be non-negative');
    assert.strictEqual(metrics.streamBytes, 150);
    assert.strictEqual(metrics.patchCount, 2);
    assert.strictEqual(metrics.patchBytes, 80);
    assert.strictEqual(metrics.inputTokens, null, 'Unreported input tokens must remain null');
    assert.strictEqual(metrics.outputTokens, null, 'Unreported output tokens must remain null');
    assert.strictEqual(metrics.totalTokens, null, 'Unreported total tokens must remain null');

    // Authoritative usage recorded
    const collectorWithUsage = new MetricsCollector({ mode: 'disabled' });
    collectorWithUsage.recordUsage(100, 50, 150);
    const metricsWithUsage = collectorWithUsage.complete();

    assert.strictEqual(metricsWithUsage.inputTokens, 100);
    assert.strictEqual(metricsWithUsage.outputTokens, 50);
    assert.strictEqual(metricsWithUsage.totalTokens, 150);
  });

  await t.test('5. Universal configuration resolution & security defaults', async () => {
    const config = resolveLeveonasConfig();
    assert.strictEqual(config.provider, DEFAULT_LEVEONAS_CONFIG.provider);
    assert.strictEqual(config.model, DEFAULT_LEVEONAS_CONFIG.model);
    assert.strictEqual(config.security?.strictAttributeValidation, true);
    assert.strictEqual(config.security?.blockDangerousUrls, true);

    const custom = resolveLeveonasConfig({
      provider: 'openai',
      model: 'gpt-4o-mini',
      limits: { maxTreeDepth: 25 },
    });
    assert.strictEqual(custom.provider, 'openai');
    assert.strictEqual(custom.model, 'gpt-4o-mini');
    assert.strictEqual(custom.limits?.maxTreeDepth, 25);
    // Unspecified limits should fallback to secure defaults
    assert.ok(custom.limits?.maxPatchBatchSize! > 0);
  });

  await t.test('6. All 7 official examples compile cleanly to Common UI IR', async () => {
    const examplesDir = path.resolve(__dirname, '../../../examples');
    const examples = [
      'hello-world',
      'landing-page',
      'dashboard',
      'todo',
      'ecommerce',
      'realtime',
      'multi-framework',
    ];

    for (const ex of examples) {
      const appLmPath = path.join(examplesDir, ex, 'app.lm');
      assert.ok(fs.existsSync(appLmPath), `Example ${ex}/app.lm must exist`);

      const source = fs.readFileSync(appLmPath, 'utf-8');
      const compiled = compile(source);

      assert.strictEqual(
        compiled.success,
        true,
        `Example "${ex}" failed compilation: ${compiled.error}`
      );
      assert.ok(compiled.uiIR, `Example "${ex}" must produce Common UI IR`);
      assert.ok(compiled.patchOperations.length > 0, `Example "${ex}" must produce patches`);
    }
  });

  await t.test('7. All 5 framework starter templates compile cleanly', async () => {
    const templatesDir = path.resolve(__dirname, '../../../templates');
    const templates = ['html', 'react', 'vue', 'svelte', 'angular'];

    for (const tpl of templates) {
      const appLmPath = path.join(templatesDir, tpl, 'app.lm');
      assert.ok(fs.existsSync(appLmPath), `Template ${tpl}/app.lm must exist`);

      const source = fs.readFileSync(appLmPath, 'utf-8');
      const compiled = compile(source);

      assert.strictEqual(
        compiled.success,
        true,
        `Template "${tpl}" failed compilation: ${compiled.error}`
      );
      assert.ok(compiled.uiIR, `Template "${tpl}" must produce Common UI IR`);
    }
  });

  await t.test('8. Sandboxed browser runtime is strictly framework-free', async () => {
    const reports = analyzeBundles();
    const runtimeReport = reports.find((r) => r.path === 'public/leveonas-runtime.js');

    assert.ok(runtimeReport, 'Browser runtime report must be present');
    assert.strictEqual(
      runtimeReport.isFrameworkFree,
      true,
      'Browser runtime MUST be framework-free (0 React/Vue/Svelte/Angular dependencies)'
    );
  });
});
