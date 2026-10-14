/**
 * Leveonas Bundle Size & Framework-Free Runtime Analyzer
 *
 * Measures bundle sizes for:
 * - Browser Runtime (`public/leveonas-runtime.js`)
 * - Client Engine (`public/leveonas.js`)
 * - Dist artifacts (ESM, CJS, CLI binary)
 *
 * Verifies that the browser runtime bundle is strictly framework-free
 * (contains NO React, Vue, Svelte, or Angular framework code).
 */

import * as fs from 'fs';
import * as path from 'path';

interface BundleReport {
  name: string;
  path: string;
  bytes: number;
  kb: string;
  isFrameworkFree: boolean;
  notes: string;
}

export function analyzeBundles(): BundleReport[] {
  const root = path.resolve(__dirname, '..');
  const reports: BundleReport[] = [];

  const targets = [
    {
      name: 'Sandboxed Browser Runtime',
      file: 'public/leveonas-runtime.js',
      mustBeFrameworkFree: true,
      notes: 'Executes Common UI IR patches inside sandbox iframe',
    },
    {
      name: 'Host Client Engine',
      file: 'public/leveonas.js',
      mustBeFrameworkFree: true,
      notes: 'Parent window SSE receiver and postMessage router',
    },
    {
      name: 'Core Distribution (ESM)',
      file: 'dist/index.mjs',
      mustBeFrameworkFree: false,
      notes: 'Public SDK, Compiler, Reconciler, and Providers',
    },
    {
      name: 'Core Distribution (CJS)',
      file: 'dist/index.cjs',
      mustBeFrameworkFree: false,
      notes: 'CommonJS production bundle',
    },
    {
      name: 'CLI Binary',
      file: 'dist/cli.mjs',
      mustBeFrameworkFree: false,
      notes: 'Standalone developer command-line tool',
    },
  ];

  for (const target of targets) {
    const fullPath = path.join(root, target.file);
    if (!fs.existsSync(fullPath)) {
      continue;
    }

    const stat = fs.statSync(fullPath);
    const content = fs.readFileSync(fullPath, 'utf-8');

    // Framework-free check: ensure no React/Vue/Svelte/Angular runtime internals
    const frameworkSignatures = [
      'react-dom',
      '__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED',
      'vue.runtime',
      'svelte/internal',
      '@angular/core',
    ];

    const foundFrameworks = frameworkSignatures.filter((sig) => content.includes(sig));
    const isFrameworkFree = foundFrameworks.length === 0;

    reports.push({
      name: target.name,
      path: target.file,
      bytes: stat.size,
      kb: (stat.size / 1024).toFixed(2) + ' KB',
      isFrameworkFree,
      notes: target.notes,
    });

    if (target.mustBeFrameworkFree && !isFrameworkFree) {
      throw new Error(
        `VIOLATION: ${target.name} (${target.file}) contains framework internals: ${foundFrameworks.join(', ')}`
      );
    }
  }

  return reports;
}

if (require.main === module || process.argv[1]?.endsWith('bundle-size.ts')) {
  console.log('\n======================================================');
  console.log('LEVEONAS PRODUCTION BUNDLE SIZE & ISOLATION REPORT');
  console.log('======================================================\n');

  try {
    const reports = analyzeBundles();
    for (const r of reports) {
      console.log(`📦 ${r.name}`);
      console.log(`   File:           ${r.path}`);
      console.log(`   Size:           ${r.kb} (${r.bytes} bytes)`);
      console.log(`   Framework-Free: ${r.isFrameworkFree ? '✓ YES (0 framework runtimes)' : '✗ NO'}`);
      console.log(`   Notes:          ${r.notes}\n`);
    }
    console.log('✓ All runtime isolation guarantees satisfied.');
  } catch (err: any) {
    console.error('Bundle analysis failed:', err.message);
    process.exit(1);
  }
}
