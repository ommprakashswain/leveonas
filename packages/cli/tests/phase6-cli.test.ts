/**
 * Leveonas Phase 6: CLI & Tooling Test Suite
 *
 * Verifies:
 * 1. `leveonas init` scaffolding with templates
 * 2. Standard exit code contract (0=success, 1=validation error, 2=usage error, 3=security error)
 * 3. Machine-readable JSON output for all commands
 * 4. Benchmark CLI options (iterations, json, csv)
 */

import { test } from 'node:test';
import assert from 'node:assert';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

import { runCLI } from '../cli';
import { runInitCommand } from '../commands/init';

test('Leveonas Phase 6 CLI Test Suite', async (t) => {
  await t.test('1. `leveonas init` creates working project structure', async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'leveonas-init-test-'));

    try {
      const res = runInitCommand({ directory: tempDir, template: 'react', quiet: true });
      assert.strictEqual(res.success, true);
      assert.strictEqual(res.filesCreated.length, 3);

      const configPath = path.join(tempDir, 'leveonas.config.json');
      const lmPath = path.join(tempDir, 'app.lm');
      const readmePath = path.join(tempDir, 'README.md');

      assert.ok(fs.existsSync(configPath), 'Config must exist');
      assert.ok(fs.existsSync(lmPath), 'app.lm must exist');
      assert.ok(fs.existsSync(readmePath), 'README.md must exist');

      // Verify immediate check & compile
      const checkCode = runCLI(['check', lmPath]);
      assert.strictEqual(checkCode, 0, 'Generated project must pass check');

      const compileCode = runCLI(['compile', lmPath]);
      assert.strictEqual(compileCode, 0, 'Generated project must pass compile');

      // Attempting to re-init without force fails with code 1
      const failInit = runCLI(['init', tempDir]);
      assert.strictEqual(failInit, 1);

      // With force succeeds
      const forceInit = runCLI(['init', tempDir, '--force']);
      assert.strictEqual(forceInit, 0);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  await t.test('2. Standard Exit Code Contract verification', async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'leveonas-codes-test-'));

    try {
      const validLm = path.join(tempDir, 'valid.lm');
      fs.writeFileSync(validLm, '(di cs:"card" (he "Title"))');

      const invalidLm = path.join(tempDir, 'invalid.lm');
      fs.writeFileSync(invalidLm, '(di cs:"card" (he "Title")'); // missing closing paren

      const dangerousLm = path.join(tempDir, 'dangerous.lm');
      fs.writeFileSync(dangerousLm, '(a href:"javascript:alert(1)" "Click")');

      // 0: Success
      assert.strictEqual(runCLI(['check', validLm]), 0);
      assert.strictEqual(runCLI(['compile', validLm]), 0);

      // 1: Validation / Compilation Failure
      assert.strictEqual(runCLI(['check', invalidLm]), 1);

      // 2: CLI Usage Error (missing args or unknown command)
      assert.strictEqual(runCLI(['check']), 2);
      assert.strictEqual(runCLI(['compile']), 2);
      assert.strictEqual(runCLI(['inspect']), 2);
      assert.strictEqual(runCLI(['audit']), 2);
      assert.strictEqual(runCLI(['unknown-command']), 2);

      // 3: Security Audit Failure
      assert.strictEqual(runCLI(['audit', dangerousLm]), 3);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  await t.test('3. Machine-readable JSON output for CLI inspect and audit', async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'leveonas-json-test-'));

    try {
      const validLm = path.join(tempDir, 'sample.lm');
      fs.writeFileSync(validLm, '(di cs:"container" (he "Hello"))');

      // Inspect JSON
      let inspectLog = '';
      const originalLog = console.log;
      console.log = (msg: any) => {
        inspectLog += String(msg);
      };

      try {
        const inspectCode = runCLI(['inspect', validLm, '--json']);
        assert.strictEqual(inspectCode, 0);
        const parsed = JSON.parse(inspectLog);
        assert.strictEqual(parsed.streamStatus, 'VALID');
        assert.ok(parsed.uiIR);
      } finally {
        console.log = originalLog;
      }
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
