import {
  JSNodeKind,
  JSProgramNode,
  JSUnitNode,
  getJSEventHandlerId,
  getJSProgramId,
  getJSTimerId,
  getJSUnitId,
} from '../js-lm/ast';
import { TSProgramNode, TSUnitNode } from './ast';
import { TSUnitClassification } from './types';

// Optional dynamic reference to typescript compiler
let tsCompiler: any = null;
try {
  tsCompiler = require('typescript');
} catch {
  // TypeScript not installed in runtime environment; fallbackTypeErasure is used
}

/**
 * Transpiles a raw TypeScript snippet to clean, deterministic JavaScript.
 * Uses official TypeScript compiler transpileModule if available.
 */
export function lowerTSToJS(tsCode: string): string {
  const trimmed = tsCode.trim();
  if (!trimmed) return '';

  if (tsCompiler && typeof tsCompiler.transpileModule === 'function') {
    try {
      const result = tsCompiler.transpileModule(trimmed, {
        compilerOptions: {
          target: tsCompiler.ScriptTarget?.ES2022 ?? 9,
          module: tsCompiler.ModuleKind?.ESNext ?? 99,
          removeComments: false,
          isolatedModules: true,
        },
      });

      return result.outputText.trim();
    } catch {
      // Fallback on transpile failure
      return fallbackTypeErasure(trimmed);
    }
  }

  return fallbackTypeErasure(trimmed);
}

/**
 * Fallback lightweight type erasure for quick parsing.
 */
function fallbackTypeErasure(code: string): string {
  // Strip type annotations: e.g. `: number`, `: string[]`
  let stripped = code.replace(/:\s*[A-Za-z0-9_$<>[\]|, ]+(?=\s*(=|[),;{]|\bas\b))/g, '');
  // Strip generic parameters: `<T>`
  stripped = stripped.replace(/<[A-Za-z0-9_$, ]+>/g, '');
  return stripped.trim();
}

/**
 * Lowers a TSUnitNode to its runtime JavaScript code and classification.
 */
export function lowerTSUnit(unit: TSUnitNode): {
  loweredCode: string;
  isTypeOnly: boolean;
  classification: TSUnitClassification;
} {
  if (unit.classification === 'TYPE_ONLY') {
    return {
      loweredCode: '',
      isTypeOnly: true,
      classification: 'TYPE_ONLY',
    };
  }

  // Handle Event Handlers
  if (unit.unitKind === 'EventHandler' && unit.meta?.eventName && unit.meta?.targetSelector) {
    const eventName = unit.meta.eventName;
    const targetSelector = unit.meta.targetSelector;
    let handlerCode = unit.code;

    // If unit has details
    if (unit.details && 'handlerCode' in unit.details) {
      handlerCode = (unit.details as any).handlerCode;
    }

    const loweredHandler = lowerTSToJS(handlerCode);
    const code = `window.__leveonas_runtime__.on(${JSON.stringify(eventName)}, ${JSON.stringify(targetSelector)}, ${loweredHandler});`;

    return {
      loweredCode: code,
      isTypeOnly: false,
      classification: 'RUNTIME',
    };
  }

  // Handle Timers
  if (unit.unitKind === 'Timer' && unit.meta?.timerType && typeof unit.meta?.delayMs === 'number') {
    const timerType = unit.meta.timerType;
    const delayMs = unit.meta.delayMs;
    let callbackCode = '';

    if (unit.details && 'callbackCode' in unit.details) {
      callbackCode = (unit.details as any).callbackCode;
    }

    const loweredCallback = lowerTSToJS(callbackCode);
    const code = `window.__leveonas_runtime__.${timerType}(${loweredCallback}, ${delayMs});`;

    return {
      loweredCode: code,
      isTypeOnly: false,
      classification: 'RUNTIME',
    };
  }

  // Standard runtime unit (Variable, Function, Class, Enum, Expression, Statement)
  const lowered = lowerTSToJS(unit.code);

  return {
    loweredCode: lowered,
    isTypeOnly: false,
    classification: 'RUNTIME',
  };
}

/**
 * Converts a TSUnitNode to an equivalent JSUnitNode for the existing Leveonas JS runtime and patch protocol.
 * Returns null for TYPE_ONLY units (interfaces, type aliases, type-only imports) so no execution patch is emitted.
 */
export function convertTSToJSUnit(tsUnit: TSUnitNode, index: number): JSUnitNode | null {
  if (tsUnit.classification === 'TYPE_ONLY') {
    return null;
  }

  const { loweredCode } = lowerTSUnit(tsUnit);
  if (!loweredCode && tsUnit.isComplete) {
    return null;
  }

  // Preserve deterministic ID mapping
  let jsId: string;
  if (tsUnit.unitKind === 'EventHandler' && tsUnit.meta?.eventName && tsUnit.meta?.targetSelector) {
    jsId = getJSEventHandlerId(tsUnit.meta.eventName, tsUnit.meta.targetSelector);
  } else if (tsUnit.unitKind === 'Timer' && tsUnit.meta?.timerType) {
    jsId = getJSTimerId(tsUnit.meta.timerType, index);
  } else if (tsUnit.meta?.identifier) {
    jsId = getJSUnitId('var', tsUnit.meta.identifier);
  } else if (tsUnit.meta?.functionName) {
    jsId = getJSUnitId('func', tsUnit.meta.functionName);
  } else if (tsUnit.meta?.className) {
    jsId = getJSUnitId('cls', tsUnit.meta.className);
  } else if (tsUnit.meta?.enumName) {
    jsId = getJSUnitId('enum', tsUnit.meta.enumName);
  } else {
    jsId = getJSUnitId('stmt', tsUnit.code.slice(0, 16), index);
  }

  let details: any = undefined;
  if (tsUnit.unitKind === 'EventHandler' && tsUnit.meta?.eventName && tsUnit.meta?.targetSelector) {
    let handlerCode = loweredCode;
    if (tsUnit.details && 'handlerCode' in tsUnit.details) {
      handlerCode = lowerTSToJS((tsUnit.details as any).handlerCode);
    }
    details = {
      id: jsId,
      kind: JSNodeKind.EventHandler,
      eventName: tsUnit.meta.eventName,
      targetSelector: tsUnit.meta.targetSelector,
      handlerCode,
      sourceLocation: tsUnit.sourceLocation,
    };
  } else if (tsUnit.unitKind === 'Timer' && tsUnit.meta?.timerType) {
    let callbackCode = '';
    if (tsUnit.details && 'callbackCode' in tsUnit.details) {
      callbackCode = lowerTSToJS((tsUnit.details as any).callbackCode);
    }
    details = {
      id: jsId,
      kind: JSNodeKind.Timer,
      timerType: tsUnit.meta.timerType as 'setTimeout' | 'setInterval',
      callbackCode,
      delayMs: tsUnit.meta.delayMs || 0,
      sourceLocation: tsUnit.sourceLocation,
    };
  } else if (tsUnit.unitKind === 'Variable' && tsUnit.meta?.identifier) {
    details = {
      id: jsId,
      kind: JSNodeKind.VariableDeclaration,
      varKind: (tsUnit.details as any)?.varKind || 'const',
      identifier: tsUnit.meta.identifier,
      initialValue: (tsUnit.details as any)?.initialValue ? lowerTSToJS((tsUnit.details as any).initialValue) : undefined,
      sourceLocation: tsUnit.sourceLocation,
    };
  } else if (tsUnit.unitKind === 'Function' && tsUnit.meta?.functionName) {
    details = {
      id: jsId,
      kind: JSNodeKind.FunctionDeclaration,
      name: tsUnit.meta.functionName,
      params: (tsUnit.details as any)?.params?.map((p: any) => p.name) || [],
      body: (tsUnit.details as any)?.body ? lowerTSToJS((tsUnit.details as any).body) : '',
      sourceLocation: tsUnit.sourceLocation,
    };
  }

  return {
    id: jsId,
    kind: JSNodeKind.Unit,
    unitKind: tsUnit.unitKind as any,
    code: loweredCode,
    rawCode: tsUnit.rawCode,
    isComplete: tsUnit.isComplete,
    meta: tsUnit.meta as any,
    details,
    sourceLocation: tsUnit.sourceLocation,
  };
}

/**
 * Converts a TSProgramNode to an equivalent JSProgramNode containing only lowered runtime units.
 */
export function convertTSProgramToJSProgram(tsProgram: TSProgramNode): JSProgramNode {
  const jsUnits: JSUnitNode[] = [];

  for (let i = 0; i < tsProgram.units.length; i++) {
    const tsUnit = tsProgram.units[i];
    const jsUnit = convertTSToJSUnit(tsUnit, i);
    if (jsUnit) {
      jsUnits.push(jsUnit);
    }
  }

  return {
    id: getJSProgramId(),
    kind: JSNodeKind.Program,
    units: jsUnits,
    sourceLocation: tsProgram.sourceLocation,
  };
}
