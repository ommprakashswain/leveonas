import { describe, it } from 'node:test';
import assert from 'node:assert';
import * as path from 'node:path';
import { execFileSync, execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';

describe('Leveonas Phase 5A-H: Production Package & CLI Distribution Suite', () => {
  const rootDir = process.cwd();
  const distDir = path.join(rootDir, 'dist');
  const cliBin = path.join(distDir, 'bin/leveonas.js');

  // Ensure distribution build exists before tests
  if (!fs.existsSync(cliBin) || !fs.existsSync(path.join(distDir, 'index.d.ts'))) {
    execSync('npm run build:dist', { stdio: 'pipe' });
  }

  // =========================================================================
  // 1. Built Artifact Verification
  // =========================================================================
  it('1. Built artifacts exist in dist/ with CJS, ESM, types, and CLI binary', () => {
    assert.strictEqual(fs.existsSync(path.join(distDir, 'index.js')), true, 'dist/index.js (CJS) must exist');
    assert.strictEqual(fs.existsSync(path.join(distDir, 'index.mjs')), true, 'dist/index.mjs (ESM) must exist');
    assert.strictEqual(fs.existsSync(path.join(distDir, 'runtime.js')), true, 'dist/runtime.js must exist');
    assert.strictEqual(fs.existsSync(path.join(distDir, 'runtime.mjs')), true, 'dist/runtime.mjs must exist');
    assert.strictEqual(fs.existsSync(path.join(distDir, 'sdk.js')), true, 'dist/sdk.js must exist');
    assert.strictEqual(fs.existsSync(path.join(distDir, 'sdk.mjs')), true, 'dist/sdk.mjs must exist');
    assert.strictEqual(fs.existsSync(path.join(distDir, 'compiler.js')), true, 'dist/compiler.js must exist');
    assert.strictEqual(fs.existsSync(path.join(distDir, 'compiler.mjs')), true, 'dist/compiler.mjs must exist');
    assert.strictEqual(fs.existsSync(path.join(distDir, 'lsp.js')), true, 'dist/lsp.js must exist');
    assert.strictEqual(fs.existsSync(path.join(distDir, 'lsp.mjs')), true, 'dist/lsp.mjs must exist');
    assert.strictEqual(fs.existsSync(path.join(distDir, 'index.d.ts')), true, 'dist/index.d.ts must exist');
    assert.strictEqual(fs.existsSync(path.join(distDir, 'runtime.d.ts')), true, 'dist/runtime.d.ts must exist');
    assert.strictEqual(fs.existsSync(path.join(distDir, 'sdk.d.ts')), true, 'dist/sdk.d.ts must exist');
    assert.strictEqual(fs.existsSync(path.join(distDir, 'compiler.d.ts')), true, 'dist/compiler.d.ts must exist');
    assert.strictEqual(fs.existsSync(path.join(distDir, 'lsp.d.ts')), true, 'dist/lsp.d.ts must exist');
    assert.strictEqual(fs.existsSync(cliBin), true, 'dist/bin/leveonas.js must exist');
  });

  // =========================================================================
  // 2. Package Identity & Version Consistency
  // =========================================================================
  it('2. Central version source is consistent across package.json, version.ts, and dist', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
    const distPkg = require(path.join(distDir, 'index.js'));
    const versionTsContent = fs.readFileSync(path.join(rootDir, 'packages/version.ts'), 'utf-8');

    assert.strictEqual(pkg.name, 'leveonas', 'Root package name must be leveonas');
    assert.strictEqual(pkg.private, undefined, 'Root package must not have private: true');
    assert.ok(versionTsContent.includes(`'${pkg.version}'`), 'packages/version.ts must match package.json version');
    assert.strictEqual(distPkg.VERSION, pkg.version, 'dist exported VERSION must match package.json');
  });

  // =========================================================================
  // 3. NPM Pack Validation
  // =========================================================================
  it('3. npm pack includes only production artifacts and excludes private/website files', () => {
    const stdout = execSync('npm pack --dry-run --json', { encoding: 'utf-8', cwd: rootDir });
    const packResults = JSON.parse(stdout);
    assert.ok(Array.isArray(packResults) && packResults.length > 0, 'Pack dry-run should return array');

    const files = packResults[0].files.map((f: { path: string }) => f.path);

    // Required files
    const hasDistIndex = files.some((p: string) => p === 'dist/index.js');
    const hasDistMjs = files.some((p: string) => p === 'dist/index.mjs');
    const hasDistDts = files.some((p: string) => p === 'dist/index.d.ts');
    const hasReadme = files.some((p: string) => p.toLowerCase() === 'readme.md');
    const hasLicense = files.some((p: string) => p.toLowerCase() === 'license');
    const hasPkgJson = files.some((p: string) => p === 'package.json');

    assert.ok(hasDistIndex, 'Pack must include dist/index.js');
    assert.ok(hasDistMjs, 'Pack must include dist/index.mjs');
    assert.ok(hasDistDts, 'Pack must include dist/index.d.ts');
    assert.ok(hasReadme, 'Pack must include README.md');
    assert.ok(hasLicense, 'Pack must include LICENSE');
    assert.ok(hasPkgJson, 'Pack must include package.json');

    // Forbidden files in package tarball
    for (const f of files) {
      assert.ok(!f.startsWith('.next'), `Package must not include .next: ${f}`);
      assert.ok(!f.startsWith('.env'), `Package must not include env files: ${f}`);
      assert.ok(!f.startsWith('app/'), `Package must not include website app directory: ${f}`);
      assert.ok(!f.startsWith('components/'), `Package must not include website components directory: ${f}`);
      assert.ok(!f.startsWith('test-'), `Package must not include test runner scripts: ${f}`);
    }
  });

  // =========================================================================
  // 4. Actual Package Installation & Cross-Format Testing
  // =========================================================================
  it('4. Installs packed tarball into fresh temp consumer and runs CLI, ESM, CJS, and Types', () => {
    const rootPkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
    const expectedVersion = rootPkg.version;

    // 1. Pack tarball
    const packOut = execSync('npm pack', { encoding: 'utf-8', cwd: rootDir }).trim();
    const tarballFileName = packOut.split('\n').pop()!.trim();
    const tarballPath = path.resolve(rootDir, tarballFileName);
    assert.ok(fs.existsSync(tarballPath), `Tarball ${tarballPath} must exist`);

    // 2. Create temp test consumer directory
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'leveonas-consumer-test-'));

    try {
      // Create minimal consumer package.json
      fs.writeFileSync(
        path.join(tempDir, 'package.json'),
        JSON.stringify(
          {
            name: 'temp-leveonas-consumer',
            version: '1.0.0',
            type: 'module',
          },
          null,
          2
        ),
        'utf-8'
      );

      // Perform a real npm install of the packed tarball
      try {
        execSync(`npm install "${tarballPath}" --no-audit --no-fund`, {
          cwd: tempDir,
          stdio: 'pipe',
        });
      } catch {
        // Fallback unpack if npm registry network lookup blocks offline
        const nmDir = path.join(tempDir, 'node_modules');
        const binDir = path.join(nmDir, '.bin');
        fs.mkdirSync(nmDir, { recursive: true });
        fs.mkdirSync(binDir, { recursive: true });
        execSync(`tar -xzf "${tarballPath}" -C "${tempDir}"`, { stdio: 'pipe' });
        fs.renameSync(path.join(tempDir, 'package'), path.join(nmDir, 'leveonas'));
        const installedBin = path.join(nmDir, 'leveonas/dist/bin/leveonas.js');
        fs.chmodSync(installedBin, '755');
        const binLink = path.join(binDir, 'leveonas');
        try {
          fs.symlinkSync(path.join('..', 'leveonas/dist/bin/leveonas.js'), binLink);
        } catch {
          fs.copyFileSync(installedBin, binLink);
        }
      }

      const binLink = path.join(tempDir, 'node_modules/.bin/leveonas');

      // 3. Test CLI from installed package binary
      const npxVersion = execSync(`"${binLink}" --version`, {
        cwd: tempDir,
        encoding: 'utf-8',
      });
      assert.ok(
        npxVersion.includes(`leveonas v${expectedVersion}`),
        `binary version should output ${expectedVersion}, got: ${npxVersion}`
      );

      const npxHelp = execSync(`"${binLink}" --help`, {
        cwd: tempDir,
        encoding: 'utf-8',
      });
      assert.ok(npxHelp.includes('COMMANDS:'), 'binary help should show COMMANDS');

      // Create a test app.lm in temp consumer
      const testLmContent = `<HTML>
(di cs:"container"
  (h1 "Test App")
  (pa "Reconciled with Leveonas")
  (bo "Click Me")
)
</HTML>
`;
      fs.writeFileSync(path.join(tempDir, 'app.lm'), testLmContent, 'utf-8');

      // Test check command from installed package
      const checkOut = execSync(`"${binLink}" check app.lm`, {
        cwd: tempDir,
        encoding: 'utf-8',
      });
      assert.ok(checkOut.includes('Clean') || checkOut.includes('✓'), `check output: ${checkOut}`);

      // Test compile command from installed package
      const compileOut = execSync(`"${binLink}" compile app.lm --target=ui-ir`, {
        cwd: tempDir,
        encoding: 'utf-8',
      });
      assert.ok(compileOut.length > 0 && (compileOut.includes('body') || compileOut.includes('kind') || compileOut.includes('{')), `compile output: ${compileOut}`);

      // Test inspect command from installed package
      const inspectOut = execSync(`"${binLink}" inspect app.lm --json`, {
        cwd: tempDir,
        encoding: 'utf-8',
      });
      const parsedInspect = JSON.parse(inspectOut);
      assert.strictEqual(parsedInspect.detectedFramework, 'html');

      // 4. Test ESM imports from installed package
      const esmScript = `
import { compile, parse, lower, format, diagnose, inspect, VERSION } from 'leveonas';
import { DOMPatchApplier, normalizePatchOperationType } from 'leveonas/runtime';
import { createSession, Leveonas } from 'leveonas/sdk';
import { HTMLLMInterpreter } from 'leveonas/compiler';
import { LeveonasLanguageService } from 'leveonas/lsp';

console.log('ESM Import Test Starting...');
if (!VERSION || typeof compile !== 'function' || typeof parse !== 'function' || typeof lower !== 'function' || typeof format !== 'function' || typeof diagnose !== 'function' || typeof inspect !== 'function') {
  throw new Error('Root exports missing');
}

const res = compile('<HTML>(di cs:"test" (h1 "Hello World"))</HTML>');
if (!res.success || res.detectedFramework !== 'html') {
  throw new Error('compile failed: ' + JSON.stringify(res));
}

const formatted = format('(di   cs:"demo"  (h2 "Sub"))');
if (!formatted.includes('(di cs:"demo"')) {
  throw new Error('format failed');
}

const session = createSession({ apiKey: 'test' });
if (!(session instanceof Leveonas)) {
  throw new Error('createSession failed');
}

console.log('✓ ESM Package verification succeeded');
`;
      fs.writeFileSync(path.join(tempDir, 'test-esm.mjs'), esmScript, 'utf-8');
      const esmOutput = execSync('node test-esm.mjs', { cwd: tempDir, encoding: 'utf-8' });
      assert.ok(esmOutput.includes('✓ ESM Package verification succeeded'));

      // 5. Test CJS imports from installed package
      const cjsScript = `
const { compile, parse, lower, format, diagnose, inspect, VERSION } = require('leveonas');
const { DOMPatchApplier } = require('leveonas/runtime');
const { createSession } = require('leveonas/sdk');
const { HTMLLMInterpreter } = require('leveonas/compiler');
const { LeveonasLanguageService } = require('leveonas/lsp');

console.log('CJS Import Test Starting...');
if (!VERSION || typeof compile !== 'function' || typeof parse !== 'function' || typeof lower !== 'function' || typeof format !== 'function' || typeof diagnose !== 'function' || typeof inspect !== 'function') {
  throw new Error('Root CJS exports missing');
}

const res = compile('<REACT>(component:App (di (h1 "Hi")))</REACT>');
if (!res.success) {
  throw new Error('CJS compile failed');
}

console.log('✓ CJS Package verification succeeded');
`;
      fs.writeFileSync(path.join(tempDir, 'test-cjs.cjs'), cjsScript, 'utf-8');
      const cjsOutput = execSync('node test-cjs.cjs', { cwd: tempDir, encoding: 'utf-8' });
      assert.ok(cjsOutput.includes('✓ CJS Package verification succeeded'));

      // 6. Test TypeScript Consumer Declaration Verification
      const tsConsumerScript = `
import { compile, parse, lower, format, diagnose, inspect, CompileResult, DocumentInspection } from 'leveonas';
import { DOMPatchApplier } from 'leveonas/runtime';
import { Leveonas, createSession } from 'leveonas/sdk';
import { HTMLLMInterpreter } from 'leveonas/compiler';
import { LeveonasLanguageService } from 'leveonas/lsp';

const source = '<HTML>(di (h1 "Types Test"))</HTML>';
const result: CompileResult = compile(source);
const inspection: DocumentInspection = inspect(source);
const session: Leveonas = createSession();
const service: LeveonasLanguageService = new LeveonasLanguageService();

console.log('Types compile check complete:', result.detectedFramework);
`;
      fs.writeFileSync(path.join(tempDir, 'consumer.ts'), tsConsumerScript, 'utf-8');

      // Run tsc on consumer using root TypeScript compiler
      const tscBin = path.join(rootDir, 'node_modules/typescript/bin/tsc');
      let tscOut = '';
      try {
        tscOut = execSync(
          `node "${tscBin}" consumer.ts --noEmit --skipLibCheck --module esnext --target es2020 --moduleResolution bundler`,
          { cwd: tempDir, encoding: 'utf-8' }
        );
      } catch (err: any) {
        console.error('TSC Consumer Error Output:', err.stdout || err.stderr || err.message);
        throw err;
      }
      assert.strictEqual(tscOut.trim(), '', 'TypeScript compilation of consumer should produce no errors');
    } finally {
      // Cleanup tarball and temp directory
      if (fs.existsSync(tarballPath)) {
        fs.unlinkSync(tarballPath);
      }
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    }
  });
});
