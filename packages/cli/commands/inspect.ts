/**
 * Leveonas CLI: `leveonas inspect`
 *
 * Inspects components, state, derived values, dependencies, events, lists, keys, and DOM nodes.
 */

import * as fs from 'node:fs';
import { LeveonasInspector, safeStringify } from '../../lsp/inspect';

export interface InspectOptions {
  file: string;
  json?: boolean;
}

export function runInspectCommand(options: InspectOptions): { success: boolean; data: unknown } {
  if (!fs.existsSync(options.file)) {
    console.error(`Error: File not found: ${options.file}`);
    return { success: false, data: null };
  }

  const content = fs.readFileSync(options.file, 'utf-8');
  const inspection = LeveonasInspector.inspect(content);

  if (options.json) {
    console.log(safeStringify(inspection, 2));
    return { success: true, data: inspection };
  }

  console.log('===============================================================');
  console.log(`LEVEONAS INSPECTOR: ${options.file}`);
  console.log('===============================================================');
  console.log(`Detected Framework: ${inspection.detectedFramework.toUpperCase()}`);
  console.log(`Stream Status:      ${inspection.streamStatus}`);
  console.log(`Diagnostics:        ${inspection.diagnostics.length} issue(s)`);
  console.log('---------------------------------------------------------------');
  console.log('1. REACTIVITY GRAPH & STATE NODES:');
  console.log(`   State Variables:   ${inspection.nodeCount.stateVariables}`);
  console.log(`   Derived Values:    ${inspection.nodeCount.computedValues}`);
  console.log(`   DOM Dependencies:  ${inspection.nodeCount.domDependencies}`);

  for (const node of inspection.reactivityGraph.nodes) {
    console.log(`   • [${node.kind.toUpperCase()}] ${node.name} (id: ${node.id})`);
    if (node.expression) {
      console.log(`     expression: ${node.expression}`);
    }
    if (node.dependencies.length > 0) {
      console.log(`     depends on: [${node.dependencies.join(', ')}]`);
    }
  }

  console.log('---------------------------------------------------------------');
  console.log('2. DOCUMENT SYMBOLS & COMPONENTS:');
  for (const sym of inspection.symbols) {
    console.log(`   • ${sym.name} (${sym.detail || 'component'})`);
    if (sym.children && sym.children.length > 0) {
      for (const ch of sym.children) {
        console.log(`     └─ ${ch.name} (${ch.detail})`);
      }
    }
  }

  console.log('---------------------------------------------------------------');
  console.log(`3. INCREMENTAL PATCH OPERATIONS: (${inspection.patchOperations.length} ops)`);
  for (const op of inspection.patchOperations.slice(0, 10)) {
    console.log(`   • ${op.op} -> ${op.targetId ?? 'root'} (${op.bytes} bytes)`);
  }
  if (inspection.patchOperations.length > 10) {
    console.log(`   ... and ${inspection.patchOperations.length - 10} more operations`);
  }
  console.log('===============================================================');

  return { success: true, data: inspection };
}
