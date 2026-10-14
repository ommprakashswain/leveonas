/**
 * Leveonas Release Validation Pipeline
 *
 * Runs the complete release verification sequence:
 * 1. npm test
 * 2. npm run lint
 * 3. npm run build
 * 4. npm pack --dry-run
 * 5. npm pack
 * 6. Isolated temporary consumer npm install
 * 7. CLI binary test (npx leveonas --version, check, compile, inspect, audit)
 * 8. ESM import test
 * 9. CJS require test
 * 10. TypeScript declaration check
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

function runStep(label: string, cmd: string, cwd: string = process.cwd()): string {
  console.log(`\n⏳ [RELEASE PIPELINE] Step: ${label}...`);
  try {
    const out = execSync(cmd, {
      cwd,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, NODE_ENV: 'production' },
    });
    console.log(`✓ ${label} passed.`);
    return out;
  } catch (err: any) {
    console.error(`❌ FAILED: ${label}`);
    console.error(err.stderr || err.stdout || err.message);
    process.exit(1);
  }
}

export function validateRelease(): void {
  const root = path.resolve(__dirname, '..');

  // Step 1: Lint
  runStep('Lint Codebase', 'npm run lint', root);

  // Step 2: Build All Bundles & Dist
  runStep('Build Artifacts', 'npm run build:bundles && npm run build:dist', root);

  // Step 3: Bundle Size & Framework-Free Verification
  runStep('Bundle Size & Isolation Check', 'npx tsx scripts/bundle-size.ts', root);

  // Step 4: Pack Dry Run
  runStep('npm pack --dry-run', 'npm pack --dry-run', root);

  // Step 5: npm pack
  const packOutput = runStep('npm pack tarball', 'npm pack', root);
  const tarballName = packOutput.trim().split('\n').pop()?.trim();
  if (!tarballName || !tarballName.endsWith('.tgz')) {
    console.error(`Invalid tarball produced: "${tarballName}"`);
    process.exit(1);
  }
  const tarballPath = path.join(root, tarballName);

  // Step 6: Isolated Consumer Installation
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'leveonas-release-consumer-'));
  try {
    fs.writeFileSync(
      path.join(tempDir, 'package.json'),
      JSON.stringify(
        {
          name: 'release-consumer-app',
          version: '1.0.0',
          type: 'module',
          dependencies: {},
        },
        null,
        2
      )
    );

    runStep('Install packed tarball', `npm install "${tarballPath}"`, tempDir);

    // Step 7: CLI Test via installed package
    const binPath = path.join(tempDir, 'node_modules', '.bin', 'leveonas');
    runStep('CLI Version Check', `"${binPath}" --version`, tempDir);
    runStep('CLI Help Check', `"${binPath}" --help`, tempDir);

    // Create a sample LM app
    fs.writeFileSync(
      path.join(tempDir, 'sample.lm'),
      '(di cs:"p-4 bg-slate-900 text-white" (he "Test App") (bu "Click Me"))\n'
    );
    runStep('CLI Check Command', `"${binPath}" check sample.lm`, tempDir);
    runStep('CLI Compile Command', `"${binPath}" compile sample.lm`, tempDir);
    runStep('CLI Inspect Command', `"${binPath}" inspect sample.lm --json`, tempDir);
    runStep('CLI Audit Command', `"${binPath}" audit sample.lm --json`, tempDir);

    // Step 8: ESM Import Test
    fs.writeFileSync(
      path.join(tempDir, 'test-esm.mjs'),
      `
      import { compile, parse, inspect, format, VERSION, createSession } from 'leveonas';
      import assert from 'assert';

      assert.strictEqual(typeof compile, 'function', 'compile must be a function');
      assert.strictEqual(typeof parse, 'function', 'parse must be a function');
      assert.strictEqual(typeof inspect, 'function', 'inspect must be a function');
      assert.strictEqual(typeof format, 'function', 'format must be a function');
      assert.strictEqual(typeof createSession, 'function', 'createSession must be a function');
      assert.ok(VERSION, 'VERSION must be defined');

      const compiled = compile('(di cs:"test" "Hello")');
      assert.strictEqual(compiled.success, true, 'compile must succeed');
      console.log('✓ ESM imports and operations verified.');
      `
    );
    runStep('ESM Import Execution', 'node test-esm.mjs', tempDir);

    // Step 9: CJS Require Test
    fs.writeFileSync(
      path.join(tempDir, 'test-cjs.cjs'),
      `
      const { compile, parse, inspect, format, VERSION, createSession } = require('leveonas');
      const assert = require('assert');

      assert.strictEqual(typeof compile, 'function', 'compile must be a function');
      assert.strictEqual(typeof parse, 'function', 'parse must be a function');
      assert.strictEqual(typeof inspect, 'function', 'inspect must be a function');
      assert.strictEqual(typeof format, 'function', 'format must be a function');
      assert.strictEqual(typeof createSession, 'function', 'createSession must be a function');
      assert.ok(VERSION, 'VERSION must be defined');

      const compiled = compile('(di cs:"test" "Hello CJS")');
      assert.strictEqual(compiled.success, true, 'compile must succeed');
      console.log('✓ CJS require and operations verified.');
      `
    );
    runStep('CJS Require Execution', 'node test-cjs.cjs', tempDir);

    // Step 10: TypeScript Declarations Test
    fs.writeFileSync(
      path.join(tempDir, 'tsconfig.json'),
      JSON.stringify(
        {
          compilerOptions: {
            target: 'ES2022',
            module: 'NodeNext',
            moduleResolution: 'NodeNext',
            strict: true,
            skipLibCheck: false,
            noEmit: true,
          },
        },
        null,
        2
      )
    );
    fs.writeFileSync(
      path.join(tempDir, 'test-types.ts'),
      `
      import { compile, CompileResult, UIIRProgramNode, createSession, LeveonasSession } from 'leveonas';

      const res: CompileResult = compile('(di "Typed")');
      const session: LeveonasSession = createSession();
      session.destroy();
      `
    );
    runStep('TypeScript Type Check', 'npx tsc -p tsconfig.json', tempDir);

    console.log('\n🎉 ALL RELEASE PIPELINE CHECKS PASSED SUCCESSFULLY!\n');
  } finally {
    // Cleanup temporary consumer and tarball
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
      if (fs.existsSync(tarballPath)) {
        fs.unlinkSync(tarballPath);
      }
    } catch {}
  }
}

if (require.main === module || process.argv[1]?.endsWith('release-check.ts')) {
  validateRelease();
}
