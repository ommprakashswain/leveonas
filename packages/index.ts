/**
 * Leveonas — Production Public Package Entry Point
 *
 * Provides stable high-level APIs for compiler, runtime, SDK, LSP, and CLI.
 */

import { BlockExtractor } from './lsp/block-extractor';
import { LeveonasDiagnosticEngine, DiagnosticOptions } from './lsp/diagnostics';
import { LeveonasFormatter, FormatterOptions } from './lsp/formatter';
import { LeveonasInspector, safeStringify, sanitizeForInspection } from './lsp/inspect';
import { LeveonasLanguageService } from './lsp/server';
import { DocumentInspection, LSPDiagnostic, EmbeddedBlockType } from './lsp/types';

import { HTMLLMInterpreter } from './compiler/interpreters/html-lm/interpreter';
import { ReactLMInterpreter } from './compiler/interpreters/react-lm/interpreter';
import { VueLMInterpreter } from './compiler/interpreters/vue-lm/interpreter';
import { SvelteLMInterpreter } from './compiler/interpreters/svelte-lm/interpreter';
import { AngularLMInterpreter } from './compiler/interpreters/angular-lm/interpreter';

import { ReactToLowering } from './compiler/ui-ir/lowering/react-lowering';
import { VueToLowering } from './compiler/ui-ir/lowering/vue-lowering';
import { SvelteToLowering } from './compiler/ui-ir/lowering/svelte-lowering';
import { AngularToLowering } from './compiler/ui-ir/lowering/angular-lowering';

import { CommonUIReconciler } from './compiler/ui-ir/reconciler';
import { UIIRProgramNode } from './compiler/ui-ir/types';
import { ReactReconciler } from './compiler/interpreters/react-lm/reconciler';
import { VueReconciler } from './compiler/interpreters/vue-lm/reconciler';
import { SvelteReconciler } from './compiler/interpreters/svelte-lm/reconciler';
import { AngularReconciler } from './compiler/interpreters/angular-lm/reconciler';

import { LEVEONAS_VERSION, VERSION } from './version';

export { VERSION, LEVEONAS_VERSION };
export { LeveonasLanguageService };
export { LeveonasInspector, safeStringify, sanitizeForInspection };
export { LeveonasFormatter };
export { LeveonasDiagnosticEngine };
export type { DocumentInspection, LSPDiagnostic, EmbeddedBlockType };
export * from './security';

export interface CompileOptions {
  framework?: 'html' | 'react' | 'vue' | 'svelte' | 'angular' | 'auto';
  target?: 'all' | 'ui-ir' | 'dom' | 'patches';
  allowIncomplete?: boolean;
}

export interface CompileResult {
  success: boolean;
  detectedFramework: string;
  ast: unknown;
  frameworkAST: unknown;
  uiIR: UIIRProgramNode | null;
  runtimeIR: unknown;
  domAST: unknown;
  patchOperations: Array<{ op: string; targetId?: string; payload?: unknown; bytes: number }>;
  diagnostics: LSPDiagnostic[];
  error?: string | null;
}

/**
 * Public Compile API: Compiles LM source code into AST, Common UI IR, Runtime IR, and Patches.
 */
export function compile(source: string, options: CompileOptions = {}): CompileResult {
  const blocks = BlockExtractor.extractBlocks(source);
  const activeBlock = blocks[0] ?? {
    type: 'lm' as EmbeddedBlockType,
    content: source,
    range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
    contentRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
  };

  const detectedFramework = options.framework && options.framework !== 'auto'
    ? options.framework
    : activeBlock.type;

  const diagnostics = LeveonasDiagnosticEngine.diagnose(source, {
    streaming: options.allowIncomplete,
  });

  const hasFatalError = diagnostics.some((d) => d.severity === 1 && !d.isIncomplete);
  if (hasFatalError && !options.allowIncomplete) {
    return {
      success: false,
      detectedFramework,
      ast: null,
      frameworkAST: null,
      uiIR: null,
      runtimeIR: null,
      domAST: null,
      patchOperations: [],
      diagnostics,
      error: diagnostics.find((d) => d.severity === 1)?.message || 'Syntax error',
    };
  }

  const inspection = LeveonasInspector.inspect(source);

  return {
    success: inspection.streamStatus !== 'INVALID',
    detectedFramework: inspection.detectedFramework,
    ast: inspection.ast,
    frameworkAST: inspection.frameworkAST,
    uiIR: inspection.uiIR as UIIRProgramNode | null,
    runtimeIR: inspection.runtimeIR,
    domAST: (inspection.patchOperations[0]?.payload as any) ?? null,
    patchOperations: inspection.patchOperations,
    diagnostics,
    error: hasFatalError ? diagnostics.find((d) => d.severity === 1)?.message : null,
  };
}

/**
 * Public Parse API: Parses LM source into typed AST.
 */
export function parse(source: string, options: { framework?: string } = {}): unknown {
  const blocks = BlockExtractor.extractBlocks(source);
  const activeBlock = blocks[0] ?? {
    type: (options.framework || 'html') as EmbeddedBlockType,
    content: source,
    range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
    contentRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
  };

  const framework = options.framework || activeBlock.type;

  switch (framework) {
    case 'react':
      return ReactLMInterpreter.parse(activeBlock.content);
    case 'vue':
      return VueLMInterpreter.parse(activeBlock.content);
    case 'svelte':
      return SvelteLMInterpreter.parse(activeBlock.content);
    case 'angular':
      return AngularLMInterpreter.parse(activeBlock.content);
    default: {
      const interpreter = new HTMLLMInterpreter();
      interpreter.write(activeBlock.content);
      return interpreter.end();
    }
  }
}

/**
 * Public Lowering API: Lowers framework AST or LM code into Common UI IR.
 */
export function lower(astOrSource: any, framework?: string): UIIRProgramNode {
  if (typeof astOrSource === 'string') {
    const parsed = parse(astOrSource, { framework });
    return lower(parsed, framework);
  }

  if (astOrSource && typeof astOrSource === 'object') {
    if (astOrSource.kind === 'UIIRProgram') {
      return astOrSource as UIIRProgramNode;
    }
    if (astOrSource.kind === 'ReactProgram' || framework === 'react') {
      return ReactToLowering.lower(astOrSource);
    }
    if (astOrSource.kind === 'VueProgram' || framework === 'vue') {
      return VueToLowering.lower(astOrSource);
    }
    if (astOrSource.kind === 'SvelteProgram' || framework === 'svelte') {
      return SvelteToLowering.lower(astOrSource);
    }
    if (astOrSource.kind === 'AngularProgram' || framework === 'angular') {
      return AngularToLowering.lower(astOrSource);
    }
  }

  throw new Error('Unsupported AST format for Common UI IR lowering');
}

/**
 * Public Inspect API: Generates multi-stage AST, Reactivity Graph, and DOM inspection.
 */
export function inspect(source: string): DocumentInspection {
  return LeveonasInspector.inspect(source);
}

/**
 * Public Format API: Deterministically formats LM code into canonical S-expression style.
 */
export function format(source: string, options: FormatterOptions = {}): string {
  return LeveonasFormatter.format(source, options);
}

/**
 * Public Diagnose API: Validates LM code and returns rich compiler diagnostics.
 */
export function diagnose(source: string, options: DiagnosticOptions = {}): LSPDiagnostic[] {
  return LeveonasDiagnosticEngine.diagnose(source, options);
}

// Re-export SDK, Runtime, and CLI helpers
export * from './runtime';
export * from './sdk';
export * from './cli';
export * from './common/config';
export * from './telemetry/metrics';
