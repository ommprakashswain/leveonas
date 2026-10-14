/**
 * Leveonas Distribution Build Script
 *
 * Bundles:
 * - dist/index.js (CJS) & dist/index.mjs (ESM)
 * - dist/runtime.js (CJS) & dist/runtime.mjs (ESM)
 * - dist/sdk.js (CJS) & dist/sdk.mjs (ESM)
 * - dist/compiler.js (CJS) & dist/compiler.mjs (ESM)
 * - dist/lsp.js (CJS) & dist/lsp.mjs (ESM)
 * - dist/bin/leveonas.js (CLI executable)
 * - TypeScript type definitions (.d.ts)
 */

import * as esbuild from 'esbuild';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT_DIR = process.cwd();
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const BIN_DIR = path.join(DIST_DIR, 'bin');

async function buildDist() {
  console.log('Building Leveonas production distribution artifacts...');

  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST_DIR, { recursive: true });
  fs.mkdirSync(BIN_DIR, { recursive: true });

  // Common esbuild config for Node libraries
  const commonConfig: esbuild.BuildOptions = {
    bundle: true,
    platform: 'node',
    target: 'node18',
    packages: 'external',
    external: [
      'typescript',
      '@google/genai',
      'esbuild',
      'next',
      'react',
      'react-dom',
      'node:*',
      'fs',
      'path',
      'os',
      'child_process',
      'crypto',
      'events',
      'stream',
      'util',
      'http',
      'https',
      'url',
      'buffer',
      'assert',
      'perf_hooks',
    ],
  };

  // 1. Build Main Package Entry Point (ESM & CJS)
  await esbuild.build({
    ...commonConfig,
    entryPoints: [path.join(ROOT_DIR, 'packages/index.ts')],
    outfile: path.join(DIST_DIR, 'index.js'),
    format: 'cjs',
  });

  await esbuild.build({
    ...commonConfig,
    entryPoints: [path.join(ROOT_DIR, 'packages/index.ts')],
    outfile: path.join(DIST_DIR, 'index.mjs'),
    format: 'esm',
  });

  // 2. Build Runtime Package Entry Point
  await esbuild.build({
    ...commonConfig,
    entryPoints: [path.join(ROOT_DIR, 'packages/runtime/index.ts')],
    outfile: path.join(DIST_DIR, 'runtime.js'),
    format: 'cjs',
  });

  await esbuild.build({
    ...commonConfig,
    entryPoints: [path.join(ROOT_DIR, 'packages/runtime/index.ts')],
    outfile: path.join(DIST_DIR, 'runtime.mjs'),
    format: 'esm',
  });

  // 3. Build SDK Package Entry Point
  await esbuild.build({
    ...commonConfig,
    entryPoints: [path.join(ROOT_DIR, 'packages/sdk/index.ts')],
    outfile: path.join(DIST_DIR, 'sdk.js'),
    format: 'cjs',
  });

  await esbuild.build({
    ...commonConfig,
    entryPoints: [path.join(ROOT_DIR, 'packages/sdk/index.ts')],
    outfile: path.join(DIST_DIR, 'sdk.mjs'),
    format: 'esm',
  });

  // 4. Build Compiler Entry Point
  await esbuild.build({
    ...commonConfig,
    entryPoints: [path.join(ROOT_DIR, 'packages/compiler/index.ts')],
    outfile: path.join(DIST_DIR, 'compiler.js'),
    format: 'cjs',
  });

  await esbuild.build({
    ...commonConfig,
    entryPoints: [path.join(ROOT_DIR, 'packages/compiler/index.ts')],
    outfile: path.join(DIST_DIR, 'compiler.mjs'),
    format: 'esm',
  });

  // 5. Build LSP Entry Point
  await esbuild.build({
    ...commonConfig,
    entryPoints: [path.join(ROOT_DIR, 'packages/lsp/index.ts')],
    outfile: path.join(DIST_DIR, 'lsp.js'),
    format: 'cjs',
  });

  await esbuild.build({
    ...commonConfig,
    entryPoints: [path.join(ROOT_DIR, 'packages/lsp/index.ts')],
    outfile: path.join(DIST_DIR, 'lsp.mjs'),
    format: 'esm',
  });

  // 6. Build Security Package Entry Point
  await esbuild.build({
    ...commonConfig,
    entryPoints: [path.join(ROOT_DIR, 'packages/security/index.ts')],
    outfile: path.join(DIST_DIR, 'security.js'),
    format: 'cjs',
  });

  await esbuild.build({
    ...commonConfig,
    entryPoints: [path.join(ROOT_DIR, 'packages/security/index.ts')],
    outfile: path.join(DIST_DIR, 'security.mjs'),
    format: 'esm',
  });

  // 7. Build CLI Binary (dist/bin/leveonas.js)
  const cliOutPath = path.join(BIN_DIR, 'leveonas.js');
  await esbuild.build({
    ...commonConfig,
    entryPoints: [path.join(ROOT_DIR, 'bin/leveonas.ts')],
    outfile: cliOutPath,
    format: 'cjs',
  });

  // Ensure CLI binary starts with single shebang and is executable
  let cliContent = fs.readFileSync(cliOutPath, 'utf-8');
  if (!cliContent.startsWith('#!/usr/bin/env node')) {
    cliContent = `#!/usr/bin/env node\n${cliContent}`;
    fs.writeFileSync(cliOutPath, cliContent, 'utf-8');
  }

  // Ensure CLI binary is executable
  try {
    fs.chmodSync(cliOutPath, '755');
  } catch {
    // Non-fatal on Windows
  }

  // 7. Generate Type Declarations (Fatal on error)
  console.log('Generating TypeScript declaration files with tsconfig.dist.json...');
  execSync(
    'npx tsc --project tsconfig.dist.json',
    { stdio: 'inherit' }
  );

  // Ensure top-level .d.ts re-exports exist
  fs.writeFileSync(
    path.join(DIST_DIR, 'index.d.ts'),
    `export * from './types/packages/index';\n`,
    'utf-8'
  );
  fs.writeFileSync(
    path.join(DIST_DIR, 'runtime.d.ts'),
    `export * from './types/packages/runtime/index';\n`,
    'utf-8'
  );
  fs.writeFileSync(
    path.join(DIST_DIR, 'sdk.d.ts'),
    `export * from './types/packages/sdk/index';\n`,
    'utf-8'
  );
  fs.writeFileSync(
    path.join(DIST_DIR, 'compiler.d.ts'),
    `export * from './types/packages/compiler/index';\n`,
    'utf-8'
  );
  fs.writeFileSync(
    path.join(DIST_DIR, 'lsp.d.ts'),
    `export * from './types/packages/lsp/index';\n`,
    'utf-8'
  );

  console.log('✓ Leveonas production package built successfully in dist/');
}

buildDist().catch((err) => {
  console.error('Build distribution failed:', err);
  process.exit(1);
});
