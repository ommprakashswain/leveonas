import { PatchOperation, PatchOperationType } from '../runtime/incremental/patch-generator/types';
import { PatchSerializer } from '../runtime/incremental/patch-generator/serializer';
import { ASTFactory } from '../compiler/ast/factory';
import { ASTNodeKind, SourceLocation } from '../compiler/ast/types';
import { RootNode } from '../compiler/ast/nodes';
import { PatchGenerator } from '../runtime/incremental/patch-generator/generator';
import { CommonUIReconciler } from '../compiler/ui-ir/reconciler';
import { UIIRProgramNode } from '../compiler/ui-ir/types';
import { ReactLMInterpreter } from '../compiler/interpreters/react-lm/interpreter';
import { ReactToLowering } from '../compiler/ui-ir/lowering/react-lowering';
import { VueLMInterpreter } from '../compiler/interpreters/vue-lm/interpreter';
import { VueToLowering } from '../compiler/ui-ir/lowering/vue-lowering';
import { SvelteLMInterpreter } from '../compiler/interpreters/svelte-lm/interpreter';
import { SvelteToLowering } from '../compiler/ui-ir/lowering/svelte-lowering';
import { AngularLMInterpreter } from '../compiler/interpreters/angular-lm/interpreter';
import { AngularToLowering } from '../compiler/ui-ir/lowering/angular-lowering';
import { BenchmarkFramework } from './scenarios';

const defaultLoc: SourceLocation = {
  startLine: 1,
  startColumn: 1,
  startOffset: 0,
  endLine: 1,
  endColumn: 1,
  endOffset: 0,
};

function safeByteLength(obj: any): number {
  if (!obj) return 0;
  if (typeof obj === 'string') return Buffer.byteLength(obj, 'utf8');
  const seen = new WeakSet();
  try {
    const str = JSON.stringify(obj, (key, value) => {
      if (key === 'parent' || key === '_parent') return undefined;
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return undefined;
        }
        seen.add(value);
      }
      return value;
    });
    return Buffer.byteLength(str || '', 'utf8');
  } catch {
    return 0;
  }
}

export interface CompilerStageTimings {
  parseTimeMs: number;
  loweringTimeMs: number;
  validationTimeMs: number;
  reconciliationTimeMs: number;
  patchGenerationTimeMs: number;
  serializationTimeMs: number;
  totalCompilerTimeMs: number;
}

export interface IRSizeMetrics {
  lmBytes: number;
  astBytes: number;
  commonUIIRBytes: number;
  runtimeIRBytes: number;
  domASTBytes: number;
  patchBytes: number;
  patchSSEBytes: number;
}

export interface PatchTypeBreakdown {
  CREATE_NODE: number;
  INSERT_CHILD: number;
  REMOVE_NODE: number;
  MOVE_CHILD: number;
  UPDATE_TEXT: number;
  SET_ATTRIBUTE: number;
  UPDATE_STYLE: number;
  CLASS_UPDATE: number;
  EVENT_UPDATE: number;
  EXECUTE_JS_UNIT: number;
  ATTACH_EVENT_HANDLER: number;
  TOTAL: number;
}

export interface ProfilerResult {
  framework: BenchmarkFramework;
  timings: CompilerStageTimings;
  sizes: IRSizeMetrics;
  patchBreakdown: PatchTypeBreakdown;
  compileSuccess: boolean;
  error: string | null;
}

export class LeveonasIRProfiler {
  /**
   * Profiles the full compilation pipeline across any of the 5 frameworks:
   * LM Text -> Framework AST -> Common UI IR -> CommonUIReconciler -> DOM AST & Reactivity -> Patch Generation -> Serialization
   */
  static profile(lmCode: string, framework: BenchmarkFramework = 'html'): ProfilerResult {
    const lmBytes = Buffer.byteLength(lmCode, 'utf8');

    let parseTimeMs = 0;
    let loweringTimeMs = 0;
    let validationTimeMs = 0;
    let reconciliationTimeMs = 0;
    let patchGenerationTimeMs = 0;
    let serializationTimeMs = 0;

    let astBytes = 0;
    let commonUIIRBytes = 0;
    let runtimeIRBytes = 0;
    let domASTBytes = 0;
    let patchBytes = 0;
    let patchSSEBytes = 0;

    const patchBreakdown: PatchTypeBreakdown = {
      CREATE_NODE: 0,
      INSERT_CHILD: 0,
      REMOVE_NODE: 0,
      MOVE_CHILD: 0,
      UPDATE_TEXT: 0,
      SET_ATTRIBUTE: 0,
      UPDATE_STYLE: 0,
      CLASS_UPDATE: 0,
      EVENT_UPDATE: 0,
      EXECUTE_JS_UNIT: 0,
      ATTACH_EVENT_HANDLER: 0,
      TOTAL: 0,
    };

    try {
      // 1. Parsing stage
      const t0 = performance.now();
      let ast: any;
      let uiir: UIIRProgramNode;
      let rootComponentName = 'App';

      if (framework === 'react') {
        ast = ReactLMInterpreter.parse(lmCode);
        const t1 = performance.now();
        parseTimeMs = Number((t1 - t0).toFixed(3));
        astBytes = safeByteLength(ast);

        // 2. Lowering stage
        const t2 = performance.now();
        uiir = ReactToLowering.lower(ast);
        const t3 = performance.now();
        loweringTimeMs = Number((t3 - t2).toFixed(3));
        rootComponentName = uiir.components[0]?.name || 'App';
      } else if (framework === 'vue') {
        ast = VueLMInterpreter.parse(lmCode);
        const t1 = performance.now();
        parseTimeMs = Number((t1 - t0).toFixed(3));
        astBytes = safeByteLength(ast);

        const t2 = performance.now();
        uiir = VueToLowering.lower(ast);
        const t3 = performance.now();
        loweringTimeMs = Number((t3 - t2).toFixed(3));
        rootComponentName = uiir.components[0]?.name || 'App';
      } else if (framework === 'svelte') {
        ast = SvelteLMInterpreter.parse(lmCode);
        const t1 = performance.now();
        parseTimeMs = Number((t1 - t0).toFixed(3));
        astBytes = safeByteLength(ast);

        const t2 = performance.now();
        uiir = SvelteToLowering.lower(ast);
        const t3 = performance.now();
        loweringTimeMs = Number((t3 - t2).toFixed(3));
        rootComponentName = uiir.components[0]?.name || 'App';
      } else if (framework === 'angular') {
        ast = AngularLMInterpreter.parse(lmCode);
        const t1 = performance.now();
        parseTimeMs = Number((t1 - t0).toFixed(3));
        astBytes = safeByteLength(ast);

        const t2 = performance.now();
        uiir = AngularToLowering.lower(ast);
        const t3 = performance.now();
        loweringTimeMs = Number((t3 - t2).toFixed(3));
        rootComponentName = uiir.components[0]?.name || 'App';
      } else {
        // HTML / fallback: synthesize a component program
        const t1 = performance.now();
        parseTimeMs = Number((t1 - t0).toFixed(3));
        astBytes = lmBytes;
        uiir = {
          id: 'ui_prog_root',
          kind: 'UIProgram' as any,
          components: [
            {
              id: 'ui_comp_App',
              kind: 'UIComponent' as any,
              name: 'App',
              propDeclarations: [],
              stateDeclarations: [],
              derivedDeclarations: [],
              body: [],
            },
          ],
          rootComponent: 'App',
        };
      }

      commonUIIRBytes = safeByteLength(uiir);

      // 3. Validation stage
      const t4 = performance.now();
      const isValid = Boolean(uiir && uiir.components && uiir.components.length > 0);
      const t5 = performance.now();
      validationTimeMs = Number((t5 - t4).toFixed(3));

      // 4. Reconciliation stage
      const t6 = performance.now();
      const reconciler = new CommonUIReconciler(uiir);
      const { domAST, jsProgram } = reconciler.reconcile(rootComponentName);
      const t7 = performance.now();
      reconciliationTimeMs = Number((t7 - t6).toFixed(3));

      domASTBytes = safeByteLength(domAST);
      runtimeIRBytes = safeByteLength(jsProgram);

      // 5. Patch Generation stage
      const t8 = performance.now();
      const emptyRoot = ASTFactory.createComponent(ASTNodeKind.Root, defaultLoc, [], []) as RootNode;
      emptyRoot.id = 'leveonas-root';
      const patches: PatchOperation[] = new PatchGenerator().generate(emptyRoot, domAST);

      // Append JS Units as EXECUTE_JS_UNIT / ATTACH_EVENT_HANDLER patches
      for (const unit of jsProgram.units) {
        if (unit.meta?.eventName && unit.meta?.targetSelector) {
          patches.push({
            operation: PatchOperationType.ATTACH_EVENT_HANDLER,
            nodeId: unit.id,
            payload: {
              eventName: unit.meta.eventName,
              targetSelector: unit.meta.targetSelector,
              handlerCode: (unit.details as any)?.handlerCode || unit.code,
            },
          });
        } else {
          patches.push({
            operation: PatchOperationType.EXECUTE_JS_UNIT,
            nodeId: unit.id,
            payload: { code: unit.code },
          });
        }
      }

      const t9 = performance.now();
      patchGenerationTimeMs = Number((t9 - t8).toFixed(3));

      // 6. Serialization stage
      const t10 = performance.now();
      const canonicalJSON = PatchSerializer.toJSON(patches);
      patchBytes = Buffer.byteLength(canonicalJSON, 'utf8');

      const serialized = JSON.parse(canonicalJSON);
      const sseEvent = `data: ${JSON.stringify({ patch: serialized })}\n\ndata: [DONE]\n\n`;
      patchSSEBytes = Buffer.byteLength(sseEvent, 'utf8');
      const t11 = performance.now();
      serializationTimeMs = Number((t11 - t10).toFixed(3));

      // Count patch types
      for (const p of patches) {
        patchBreakdown.TOTAL++;
        switch (p.operation) {
          case PatchOperationType.CREATE_NODE:
            patchBreakdown.CREATE_NODE++;
            break;
          case PatchOperationType.INSERT_CHILD:
            patchBreakdown.INSERT_CHILD++;
            break;
          case PatchOperationType.REMOVE_NODE:
            patchBreakdown.REMOVE_NODE++;
            break;
          case PatchOperationType.MOVE_CHILD:
            patchBreakdown.MOVE_CHILD++;
            break;
          case PatchOperationType.UPDATE_TEXT:
            patchBreakdown.UPDATE_TEXT++;
            break;
          case PatchOperationType.SET_ATTRIBUTE:
            if (p.payload?.styleProp) patchBreakdown.UPDATE_STYLE++;
            else if (p.payload?.className !== undefined) patchBreakdown.CLASS_UPDATE++;
            else patchBreakdown.SET_ATTRIBUTE++;
            break;
          case PatchOperationType.EXECUTE_JS_UNIT:
            patchBreakdown.EXECUTE_JS_UNIT++;
            break;
          case PatchOperationType.ATTACH_EVENT_HANDLER:
            patchBreakdown.ATTACH_EVENT_HANDLER++;
            break;
          default:
            break;
        }
      }

      const totalCompilerTimeMs = Number(
        (
          parseTimeMs +
          loweringTimeMs +
          validationTimeMs +
          reconciliationTimeMs +
          patchGenerationTimeMs +
          serializationTimeMs
        ).toFixed(3)
      );

      return {
        framework,
        timings: {
          parseTimeMs,
          loweringTimeMs,
          validationTimeMs,
          reconciliationTimeMs,
          patchGenerationTimeMs,
          serializationTimeMs,
          totalCompilerTimeMs,
        },
        sizes: {
          lmBytes,
          astBytes,
          commonUIIRBytes,
          runtimeIRBytes,
          domASTBytes,
          patchBytes,
          patchSSEBytes,
        },
        patchBreakdown,
        compileSuccess: true,
        error: null,
      };
    } catch (err: any) {
      return {
        framework,
        timings: {
          parseTimeMs,
          loweringTimeMs,
          validationTimeMs,
          reconciliationTimeMs,
          patchGenerationTimeMs,
          serializationTimeMs,
          totalCompilerTimeMs: 0,
        },
        sizes: {
          lmBytes,
          astBytes,
          commonUIIRBytes,
          runtimeIRBytes,
          domASTBytes,
          patchBytes,
          patchSSEBytes,
        },
        patchBreakdown,
        compileSuccess: false,
        error: err?.message || String(err),
      };
    }
  }
}
