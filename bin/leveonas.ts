#!/usr/bin/env node
/**
 * Leveonas CLI Executable
 */

import { runCLI } from '../packages/cli/cli';

const args = process.argv.slice(2);

const result = runCLI(args);

if (result instanceof Promise) {
  result.then((code) => {
    process.exit(code);
  }).catch((err) => {
    console.error('Fatal CLI execution error:', err);
    process.exit(1);
  });
} else {
  process.exit(result);
}
