/**
 * Leveonas CLI: `leveonas compile`
 *
 * Compiles LM files to AST, Common UI IR, Runtime IR, or Incremental Patches.
 */

import * as fs from 'node:fs';
import { LeveonasInspector, safeStringify } from '../../lsp/inspect';

export interface CompileOptions {
  file: string;
  target?: 'ast' | 'ui-ir' | 'runtime-ir' | 'patch';
  json?: boolean;
  output?: string;
}

export function runCompileCommand(options: CompileOptions): { success: boolean; data: unknown } {
  if (!fs.existsSync(options.file)) {
    console.error(`Error: File not found: ${options.file}`);
    return { success: false, data: null };
  }

  const content = fs.readFileSync(options.file, 'utf-8');
  const inspection = LeveonasInspector.inspect(content);

  let outputData: unknown = null;
  const target = options.target ?? 'ui-ir';

  switch (target) {
    case 'ast':
      outputData = inspection.ast ?? inspection.frameworkAST;
      break;
    case 'ui-ir':
      outputData = inspection.uiIR;
      break;
    case 'runtime-ir':
      outputData = inspection.runtimeIR;
      break;
    case 'patch':
      outputData = inspection.patchOperations;
      break;
    default:
      outputData = inspection.uiIR;
  }

  const serialized = safeStringify(outputData, 2);

  if (options.output) {
    fs.writeFileSync(options.output, serialized, 'utf-8');
    console.log(`✓ Compiled target [${target}] written to ${options.output}`);
  } else {
    console.log(serialized);
  }

  return { success: true, data: outputData };
}
