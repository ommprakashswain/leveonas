import { describe, it } from 'node:test';
import assert from 'node:assert';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { runCLI } from '../cli';
import { runCheckCommand } from '../commands/check';
import { runFormatCommand } from '../commands/format';
import { runCompileCommand } from '../commands/compile';
import { runInspectCommand } from '../commands/inspect';
import { runBenchmarkCommand } from '../commands/benchmark';

describe('Leveonas Phase 4: CLI Command Suite', () => {
  const tmpDir = os.tmpdir();
  const testLmFile = path.join(tmpDir, `test_app_${Date.now()}.lm`);
  const invalidLmFile = path.join(tmpDir, `test_invalid_${Date.now()}.lm`);

  const sampleLmContent = `
<SVELTE>
component(App)(
  state(count, 0)
  reactive(double, count * 2)
  di(cs:"card"
    h1("Count is {count}")
    bo(click:increment "Increment")
  )
)
</SVELTE>
`.trim();

  const invalidContent = `(di cs:"card" ] (h1 "Error"))`;

  // Setup test files
  fs.writeFileSync(testLmFile, sampleLmContent, 'utf-8');
  fs.writeFileSync(invalidLmFile, invalidContent, 'utf-8');

  // =========================================================================
  // 1. Check Command
  // =========================================================================
  it('1. `check` command validates clean files and flags syntax errors', () => {
    const cleanCheck = runCheckCommand({ files: [testLmFile], quiet: true });
    assert.strictEqual(cleanCheck.success, true, 'Clean file should pass check');

    const invalidCheck = runCheckCommand({ files: [invalidLmFile], quiet: true });
    assert.strictEqual(invalidCheck.success, false, 'Invalid file should fail check');
    assert.ok(invalidCheck.results[0].diagnostics.length > 0);
  });

  // =========================================================================
  // 2. Format Command
  // =========================================================================
  it('2. `format` command formats code and supports --check / --write', () => {
    const unformattedPath = path.join(tmpDir, `unformatted_${Date.now()}.lm`);
    fs.writeFileSync(unformattedPath, `(di  cs:"card" (h1 "Hi" ))`, 'utf-8');

    // Run --check on unformatted file
    const checkRes = runFormatCommand({ files: [unformattedPath], check: true });
    assert.strictEqual(checkRes.success, false, 'Unformatted file should fail --check');

    // Run --write
    const writeRes = runFormatCommand({ files: [unformattedPath], write: true });
    assert.strictEqual(writeRes.success, true);

    // Re-check after write
    const reCheckRes = runFormatCommand({ files: [unformattedPath], check: true });
    assert.strictEqual(reCheckRes.success, true, 'File should pass --check after formatting');

    // Cleanup
    if (fs.existsSync(unformattedPath)) fs.unlinkSync(unformattedPath);
  });

  // =========================================================================
  // 3. Compile Command
  // =========================================================================
  it('3. `compile` command compiles to UI-IR, AST, and Patches', () => {
    const compileUIIR = runCompileCommand({ file: testLmFile, target: 'ui-ir', json: true });
    assert.strictEqual(compileUIIR.success, true);
    assert.ok(compileUIIR.data !== null);

    const compileAST = runCompileCommand({ file: testLmFile, target: 'ast', json: true });
    assert.strictEqual(compileAST.success, true);

    const compileRuntime = runCompileCommand({ file: testLmFile, target: 'runtime-ir', json: true });
    assert.strictEqual(compileRuntime.success, true);
  });

  // =========================================================================
  // 4. Inspect Command
  // =========================================================================
  it('4. `inspect` command extracts reactivity graph and symbol counts', () => {
    const inspectRes = runInspectCommand({ file: testLmFile, json: true });
    assert.strictEqual(inspectRes.success, true);

    const data = inspectRes.data as {
      detectedFramework: string;
      nodeCount: { stateVariables: number; computedValues: number };
      reactivityGraph: { nodes: unknown[] };
    };
    assert.strictEqual(data.detectedFramework, 'svelte');
    assert.strictEqual(data.nodeCount.stateVariables, 1);
    assert.strictEqual(data.nodeCount.computedValues, 1);
    assert.ok(data.reactivityGraph.nodes.length >= 2);
  });

  // =========================================================================
  // 5. Benchmark CLI
  // =========================================================================
  it('5. `benchmark` command runs paired A/B scenarios with sanitized errors', async () => {
    const benchRes = await runBenchmarkCommand({
      provider: 'gemini',
      model: 'gemini-2.5-flash',
      framework: 'react',
      scenario: 'scenario_a',
      iterations: 2,
      json: true,
    });

    assert.strictEqual(benchRes.success, true);
    assert.ok(benchRes.data !== null);
  });

  // =========================================================================
  // 6. Router & Help / Version
  // =========================================================================
  it('6. CLI router handles --help and --version', () => {
    const helpCode = runCLI(['--help']);
    assert.strictEqual(helpCode, 0);

    const versionCode = runCLI(['--version']);
    assert.strictEqual(versionCode, 0);
  });

  // Cleanup temporary test files
  it('7. Cleans up test artifacts', () => {
    if (fs.existsSync(testLmFile)) fs.unlinkSync(testLmFile);
    if (fs.existsSync(invalidLmFile)) fs.unlinkSync(invalidLmFile);
  });
});
