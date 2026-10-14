/**
 * Leveonas AST, Common UI IR, Reactivity & Patch Inspector Engine
 *
 * Provides complete multi-stage inspection:
 * Raw LM -> Parsed AST -> Framework AST -> Common UI IR -> Runtime IR -> DOM AST -> Patch Operations
 */

import { BlockExtractor } from './block-extractor';
import { LeveonasDiagnosticEngine } from './diagnostics';
import { LeveonasSymbolsProvider } from './symbols';
import {
  DocumentInspection,
  EmbeddedBlockType,
  ReactivityGraphInfo,
  ReactivityNodeInfo,
} from './types';
import { HTMLLMInterpreter } from '../compiler/interpreters/html-lm/interpreter';
import { ReactLMInterpreter } from '../compiler/interpreters/react-lm/interpreter';
import { VueLMInterpreter } from '../compiler/interpreters/vue-lm/interpreter';
import { SvelteLMInterpreter } from '../compiler/interpreters/svelte-lm/interpreter';
import { AngularLMInterpreter } from '../compiler/interpreters/angular-lm/interpreter';
import { ReactReconciler } from '../compiler/interpreters/react-lm/reconciler';
import { VueReconciler } from '../compiler/interpreters/vue-lm/reconciler';
import { SvelteReconciler } from '../compiler/interpreters/svelte-lm/reconciler';
import { AngularReconciler } from '../compiler/interpreters/angular-lm/reconciler';
import { CommonUIReconciler } from '../compiler/ui-ir/reconciler';
import { ReactToLowering } from '../compiler/ui-ir/lowering/react-lowering';
import { VueToLowering } from '../compiler/ui-ir/lowering/vue-lowering';
import { SvelteToLowering } from '../compiler/ui-ir/lowering/svelte-lowering';
import { AngularToLowering } from '../compiler/ui-ir/lowering/angular-lowering';

export function safeStringify(obj: any, space?: number): string {
  const seen = new WeakSet();
  return JSON.stringify(
    obj,
    (key, value) => {
      if (key === 'parent') return undefined;
      if (value instanceof Map) {
        const o: Record<string, any> = {};
        for (const [k, v] of value.entries()) o[String(k)] = v;
        return o;
      }
      if (value instanceof Set) {
        return Array.from(value);
      }
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) return undefined;
        seen.add(value);
      }
      return value;
    },
    space
  );
}

export function sanitizeForInspection<T>(obj: T): T {
  const seen = new WeakSet();
  function clean(val: any): any {
    if (val === null || typeof val !== 'object') {
      return val;
    }
    if (val instanceof Map) {
      const out: Record<string, any> = {};
      for (const [k, v] of val.entries()) {
        out[String(k)] = clean(v);
      }
      return out;
    }
    if (val instanceof Set) {
      return Array.from(val).map(clean);
    }
    if (seen.has(val)) {
      return undefined;
    }
    seen.add(val);
    if (Array.isArray(val)) {
      return val.map(clean);
    }
    const out: Record<string, any> = {};
    for (const [key, value] of Object.entries(val)) {
      if (key === 'parent') continue;
      out[key] = clean(value);
    }
    return out as T;
  }
  return clean(obj);
}

export class LeveonasInspector {
  /**
   * Run full inspection across all compiler layers.
   */
  public static inspect(documentText: string): DocumentInspection {
    const blocks = BlockExtractor.extractBlocks(documentText);
    const activeBlock = blocks[0] ?? {
      type: 'lm' as EmbeddedBlockType,
      content: documentText,
      range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
      contentRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
    };

    const detectedFramework = activeBlock.type;
    const diagnostics = LeveonasDiagnosticEngine.diagnose(documentText);
    const symbols = LeveonasSymbolsProvider.getDocumentSymbols(documentText);

    // Determine stream status
    let streamStatus: 'VALID' | 'INCOMPLETE' | 'INVALID' = 'VALID';
    const hasError = diagnostics.some((d) => d.severity === 1 && !d.isIncomplete);
    const hasIncomplete = diagnostics.some((d) => d.isIncomplete);

    if (hasError) {
      streamStatus = 'INVALID';
    } else if (hasIncomplete) {
      streamStatus = 'INCOMPLETE';
    }

    let rawAST: unknown = null;
    let frameworkAST: unknown = null;
    let uiIR: unknown = null;
    let runtimeIR: unknown = null;
    let patchOps: Array<{ op: string; targetId?: string; payload?: unknown; bytes: number }> = [];
    const reactivityNodes: ReactivityNodeInfo[] = [];
    const reactivityEdges: { from: string; to: string; kind?: string }[] = [];

    let stateCount = 0;
    let computedCount = 0;
    let domDepCount = 0;

    try {
      const code = activeBlock.content;

      const extractReactivityFromCompiled = (compiled: { reactivityDefinitions?: Map<string, any> }) => {
        if (!compiled.reactivityDefinitions) return;
        for (const rDef of compiled.reactivityDefinitions.values()) {
          if (rDef.state) {
            for (const [stateName] of Object.entries(rDef.state)) {
              stateCount++;
              reactivityNodes.push({
                id: `state_${stateName}`,
                name: stateName,
                kind: 'state',
                dependencies: [],
                dependents: [],
              });
            }
          }

          if (rDef.derived) {
            for (const [derivedName, derivedInfo] of Object.entries(rDef.derived as Record<string, any>)) {
              computedCount++;
              reactivityNodes.push({
                id: `derived_${derivedName}`,
                name: derivedName,
                kind: 'derived',
                expression: derivedInfo.expression,
                dependencies: derivedInfo.dependencies || [],
                dependents: [],
              });

              for (const src of (derivedInfo.dependencies || [])) {
                reactivityEdges.push({ from: `state_${src}`, to: `derived_${derivedName}`, kind: 'reactivity' });
              }
            }
          }

          if (rDef.domDependencies) {
            for (const [domId, domDep] of Object.entries(rDef.domDependencies as Record<string, any>)) {
              domDepCount++;
              reactivityNodes.push({
                id: domId,
                name: `${domDep.kind}:${domDep.domNodeId || domId}`,
                kind: 'dom',
                expression: domDep.expression,
                dependencies: domDep.dependencies || [],
                dependents: [],
                domTarget: domDep.domNodeId || domId,
              });

              for (const src of (domDep.dependencies || [])) {
                reactivityEdges.push({ from: `state_${src}`, to: domId, kind: 'dom_update' });
              }
            }
          }
        }
      };

      if (detectedFramework === 'react') {
        const prog = ReactLMInterpreter.parse(code);
        frameworkAST = prog;
        rawAST = prog;

        const lowered = ReactToLowering.lower(prog);
        uiIR = lowered;

        const uiReconciler = new CommonUIReconciler(lowered);
        const compiled = uiReconciler.reconcile();
        runtimeIR = compiled;
        extractReactivityFromCompiled(compiled);

        const reconciler = new ReactReconciler(prog);
        const res = reconciler.reconcile();
        patchOps = [
          {
            op: 'CREATE_ROOT',
            targetId: res.domAST?.id ?? 'leveonas-root',
            payload: res.domAST,
            bytes: safeStringify(res.domAST).length,
          },
          ...res.jsProgram.units.map((u) => ({
            op: 'REGISTER_EVENT',
            targetId: u.id,
            payload: u,
            bytes: safeStringify(u).length,
          })),
        ];
      } else if (detectedFramework === 'vue') {
        const prog = VueLMInterpreter.parse(code);
        frameworkAST = prog;
        rawAST = prog;

        const lowered = VueToLowering.lower(prog);
        uiIR = lowered;

        const uiReconciler = new CommonUIReconciler(lowered);
        const compiled = uiReconciler.reconcile();
        runtimeIR = compiled;
        extractReactivityFromCompiled(compiled);

        const reconciler = new VueReconciler(prog);
        const res = reconciler.reconcile();
        patchOps = [
          {
            op: 'CREATE_ROOT',
            targetId: res.domAST?.id ?? 'leveonas-root',
            payload: res.domAST,
            bytes: safeStringify(res.domAST).length,
          },
          ...res.jsProgram.units.map((u) => ({
            op: 'REGISTER_EVENT',
            targetId: u.id,
            payload: u,
            bytes: safeStringify(u).length,
          })),
        ];
      } else if (detectedFramework === 'svelte') {
        const prog = SvelteLMInterpreter.parse(code);
        frameworkAST = prog;
        rawAST = prog;

        const lowered = SvelteToLowering.lower(prog);
        uiIR = lowered;

        const uiReconciler = new CommonUIReconciler(lowered);
        const compiled = uiReconciler.reconcile();
        runtimeIR = compiled;
        extractReactivityFromCompiled(compiled);

        const reconciler = new SvelteReconciler(prog);
        const res = reconciler.reconcile();
        patchOps = [
          {
            op: 'CREATE_ROOT',
            targetId: res.domAST?.id ?? 'leveonas-root',
            payload: res.domAST,
            bytes: safeStringify(res.domAST).length,
          },
          ...res.jsProgram.units.map((u) => ({
            op: 'REGISTER_EVENT',
            targetId: u.id,
            payload: u,
            bytes: safeStringify(u).length,
          })),
        ];
      } else if (detectedFramework === 'angular') {
        const prog = AngularLMInterpreter.parse(code);
        frameworkAST = prog;
        rawAST = prog;

        const lowered = AngularToLowering.lower(prog);
        uiIR = lowered;

        const uiReconciler = new CommonUIReconciler(lowered);
        const compiled = uiReconciler.reconcile();
        runtimeIR = compiled;
        extractReactivityFromCompiled(compiled);

        const reconciler = new AngularReconciler(prog);
        const res = reconciler.reconcile();
        patchOps = [
          {
            op: 'CREATE_ROOT',
            targetId: res.domAST?.id ?? 'leveonas-root',
            payload: res.domAST,
            bytes: safeStringify(res.domAST).length,
          },
          ...res.jsProgram.units.map((u) => ({
            op: 'REGISTER_EVENT',
            targetId: u.id,
            payload: u,
            bytes: safeStringify(u).length,
          })),
        ];
      } else {
        // HTML-LM
        const interpreter = new HTMLLMInterpreter();
        interpreter.write(code);
        interpreter.end();
        const prog = interpreter.getAST();
        frameworkAST = prog;
        rawAST = prog;

        uiIR = {
          kind: 'UIIRProgram',
          id: 'html_program',
          version: '1.0.0',
          components: new Map([
            [
              'HTMLRoot',
              {
                id: 'comp_html',
                name: 'HTMLRoot',
                stateDeclarations: new Map(),
                derivedDeclarations: new Map(),
                methods: new Map(),
                template: prog,
              },
            ],
          ]),
          rootComponent: 'HTMLRoot',
        } as any;

        patchOps = [
          {
            op: 'CREATE_ROOT',
            targetId: 'leveonas-root',
            payload: { kind: 'RootNode' },
            bytes: safeStringify(prog).length,
          },
        ];
      }
    } catch {
      // Degrade gracefully on partial/incomplete streams
      if (streamStatus === 'VALID') {
        streamStatus = 'INCOMPLETE';
      }
    }

    const reactivityGraph: ReactivityGraphInfo = {
      nodes: reactivityNodes,
      edges: reactivityEdges,
    };

    return sanitizeForInspection({
      raw: documentText,
      detectedFramework,
      streamStatus,
      diagnostics,
      ast: rawAST,
      frameworkAST,
      uiIR,
      runtimeIR,
      reactivityGraph,
      patchOperations: patchOps,
      symbols,
      nodeCount: {
        astNodes: rawAST ? Object.keys(rawAST as object).length : 0,
        uiIRNodes: uiIR ? Object.keys(uiIR as object).length : 0,
        stateVariables: stateCount,
        computedValues: computedCount,
        domDependencies: domDepCount,
        patchOps: patchOps.length,
      },
    });
  }
}
