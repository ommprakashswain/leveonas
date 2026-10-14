import {
  JSProgramNode,
  JSUnitNode,
  JSNodeKind,
  JSEventHandlerNode,
  JSTimerNode,
  JSDOMOperationNode,
} from './ast';

export interface JSSerializerOptions {
  wrapInIIFE?: boolean;
  indent?: string;
}

/**
 * Serializes a single JSUnitNode to clean standard executable JavaScript.
 */
export function serializeJSUnit(unit: JSUnitNode): string {
  if (unit.details) {
    switch (unit.details.kind) {
      case JSNodeKind.EventHandler: {
        const evt = unit.details as JSEventHandlerNode;
        return `window.__leveonas_runtime__.on(${JSON.stringify(evt.eventName)}, ${JSON.stringify(evt.targetSelector)}, ${evt.handlerCode});`;
      }
      case JSNodeKind.Timer: {
        const t = unit.details as JSTimerNode;
        if (t.timerType === 'clearTimeout' || t.timerType === 'clearInterval') {
          return `window.__leveonas_runtime__.${t.timerType}(${t.timerIdRef || ''});`;
        }
        return `window.__leveonas_runtime__.${t.timerType}(${t.callbackCode}, ${t.delayMs || 0});`;
      }
      case JSNodeKind.DOMOperation: {
        const dom = unit.details as JSDOMOperationNode;
        const argsStr = dom.args.length > 0 ? `, ${dom.args.join(', ')}` : '';
        return `window.__leveonas_runtime__.${dom.operation}(${JSON.stringify(dom.targetSelector)}${argsStr});`;
      }
    }
  }

  return unit.code;
}

/**
 * Serializes an entire JSProgramNode to standard executable JavaScript.
 */
export function serializeJSProgram(program: JSProgramNode, options: JSSerializerOptions = {}): string {
  const lines: string[] = [];

  for (const unit of program.units) {
    if (!unit.isComplete) continue;
    const code = serializeJSUnit(unit);
    if (code && code.trim()) {
      lines.push(code.trim());
    }
  }

  const body = lines.join('\n\n');

  if (options.wrapInIIFE) {
    return `(function() {\n  'use strict';\n${lines.map((l) => '  ' + l).join('\n')}\n})();`;
  }

  return body;
}
