import { SourceLocation } from '../../ast/types';
import {
  JSNodeKind,
  JSProgramNode,
  JSUnitNode,
  JSASTNode,
  JSLiteralNode,
  JSIdentifierNode,
  JSBinaryExpressionNode,
  JSUnaryExpressionNode,
  JSCallExpressionNode,
  JSMemberExpressionNode,
  JSAssignmentNode,
  JSReturnNode,
  JSConditionalExpressionNode,
  JSVariableDeclarationNode,
  JSFunctionDeclarationNode,
  JSArrowFunctionNode,
  JSEventHandlerNode,
  JSDOMOperationNode,
  JSTimerNode,
  JSExpressionStatementNode,
  JSIfStatementNode,
  JSBlockStatementNode,
  getJSEventHandlerId,
  getJSProgramId,
  getJSTimerId,
  getJSUnitId,
  getJSDOMOperationId,
  getJSNodeId,
} from './ast';
import { JSLMDiagnostic, JSLMInterpreterOptions, JSUnitKind } from './types';
import { decodeJSAbbreviation, isValidDOMEvent } from './vocabulary';

export class JSLMInterpreter {
  private program: JSProgramNode;
  private currentLoc: SourceLocation;
  private diagnostics: JSLMDiagnostic[] = [];
  private options: JSLMInterpreterOptions;

  // Stream state
  private buffer: string = '';
  private inLineComment: boolean = false;
  private inBlockComment: boolean = false;
  private inString: boolean = false;
  private stringQuote: string = '';
  private inTemplateLiteral: boolean = false;
  private templateBraceDepth: number = 0;
  private escapeNext: boolean = false;

  // Structural depth
  private parenDepth: number = 0;
  private braceDepth: number = 0;
  private bracketDepth: number = 0;

  // Units
  private currentUnitText: string = '';
  private currentUnitStartLoc: SourceLocation;

  constructor(options: JSLMInterpreterOptions = {}) {
    this.options = options;
    this.currentLoc = {
      startLine: 1,
      startColumn: 1,
      startOffset: 0,
      endLine: 1,
      endColumn: 1,
      endOffset: 0,
    };
    this.currentUnitStartLoc = { ...this.currentLoc };
    this.program = {
      id: getJSProgramId(),
      kind: JSNodeKind.Program,
      units: [],
      sourceLocation: { ...this.currentLoc },
    };
  }

  public static parse(source: string, options: JSLMInterpreterOptions = {}): JSProgramNode {
    const interpreter = new JSLMInterpreter(options);
    interpreter.write(source);
    return interpreter.end();
  }

  public reset(): void {
    this.currentLoc = {
      startLine: 1,
      startColumn: 1,
      startOffset: 0,
      endLine: 1,
      endColumn: 1,
      endOffset: 0,
    };
    this.currentUnitStartLoc = { ...this.currentLoc };
    this.program = {
      id: getJSProgramId(),
      kind: JSNodeKind.Program,
      units: [],
      sourceLocation: { ...this.currentLoc },
    };
    this.diagnostics = [];
    this.buffer = '';
    this.currentUnitText = '';
    this.inLineComment = false;
    this.inBlockComment = false;
    this.inString = false;
    this.stringQuote = '';
    this.inTemplateLiteral = false;
    this.templateBraceDepth = 0;
    this.escapeNext = false;
    this.parenDepth = 0;
    this.braceDepth = 0;
    this.bracketDepth = 0;
  }

  public getAST(): JSProgramNode {
    return this.program;
  }

  public getDiagnostics(): JSLMDiagnostic[] {
    return [...this.diagnostics];
  }

  public hasErrors(): boolean {
    return this.diagnostics.some((d) => d.severity === 'error');
  }

  public isSafeToExpose(): boolean {
    if (this.inLineComment || this.inBlockComment || this.inString || this.inTemplateLiteral) {
      return false;
    }
    return this.program.units.some((u) => u.isComplete);
  }

  public write(chunk: string): this {
    for (let i = 0; i < chunk.length; i++) {
      this.consumeChar(chunk[i]);
    }
    return this;
  }

  public end(): JSProgramNode {
    this.flushCurrentUnit(true);
    return this.program;
  }

  private advanceLocation(char: string): void {
    this.currentLoc.endOffset++;
    if (char === '\n') {
      this.currentLoc.endLine++;
      this.currentLoc.endColumn = 1;
    } else {
      this.currentLoc.endColumn++;
    }
  }

  private consumeChar(char: string): void {
    this.advanceLocation(char);

    // 1. Comments
    if (this.inLineComment) {
      this.currentUnitText += char;
      if (char === '\n') {
        this.inLineComment = false;
      }
      return;
    }

    if (this.inBlockComment) {
      this.currentUnitText += char;
      if (this.currentUnitText.endsWith('*/')) {
        this.inBlockComment = false;
      }
      return;
    }

    if (!this.inString && !this.inTemplateLiteral) {
      if (char === '/' && this.currentUnitText.endsWith('/')) {
        this.inLineComment = true;
        this.currentUnitText += char;
        return;
      }
      if (char === '*' && this.currentUnitText.endsWith('/')) {
        this.inBlockComment = true;
        this.currentUnitText += char;
        return;
      }
    }

    // 2. Strings
    if (this.inString) {
      this.currentUnitText += char;
      if (this.escapeNext) {
        this.escapeNext = false;
        return;
      }
      if (char === '\\') {
        this.escapeNext = true;
        return;
      }
      if (char === this.stringQuote) {
        this.inString = false;
        this.stringQuote = '';
      }
      return;
    }

    if (!this.inTemplateLiteral && (char === '"' || char === "'")) {
      this.inString = true;
      this.stringQuote = char;
      this.currentUnitText += char;
      return;
    }

    // 3. Template Literals
    if (this.inTemplateLiteral) {
      this.currentUnitText += char;
      if (this.escapeNext) {
        this.escapeNext = false;
        return;
      }
      if (char === '\\') {
        this.escapeNext = true;
        return;
      }
      if (char === '`' && this.templateBraceDepth === 0) {
        this.inTemplateLiteral = false;
        return;
      }
      if (char === '{' && this.currentUnitText.endsWith('${')) {
        this.templateBraceDepth++;
        return;
      }
      if (char === '}' && this.templateBraceDepth > 0) {
        this.templateBraceDepth--;
        return;
      }
      return;
    }

    if (char === '`') {
      this.inTemplateLiteral = true;
      this.templateBraceDepth = 0;
      this.currentUnitText += char;
      return;
    }

    // 4. Bracket tracking
    if (char === '(') this.parenDepth++;
    if (char === ')') if (this.parenDepth > 0) this.parenDepth--;
    if (char === '{') this.braceDepth++;
    if (char === '}') if (this.braceDepth > 0) this.braceDepth--;
    if (char === '[') this.bracketDepth++;
    if (char === ']') if (this.bracketDepth > 0) this.bracketDepth--;

    this.currentUnitText += char;

    // 5. Unit boundary detection at top level
    if (this.parenDepth === 0 && this.braceDepth === 0 && this.bracketDepth === 0) {
      if (char === ';') {
        this.commitUnit(true);
      } else if (char === '}') {
        // Block closed at top level (e.g. function body or if block)
        this.commitUnit(true);
      }
    }
  }

  private commitUnit(isComplete: boolean): void {
    const raw = this.currentUnitText.trim();
    if (!raw) {
      this.currentUnitText = '';
      return;
    }

    const unit = this.analyzeUnit(raw, isComplete);
    if (unit) {
      // Check if unit replaces an uncompleted unit at the end
      const lastIdx = this.program.units.length - 1;
      if (lastIdx >= 0 && !this.program.units[lastIdx].isComplete) {
        this.program.units[lastIdx] = unit;
      } else {
        this.program.units.push(unit);
      }
    }

    this.currentUnitText = '';
    this.currentUnitStartLoc = { ...this.currentLoc };
  }

  private flushCurrentUnit(isFinal: boolean): void {
    const raw = this.currentUnitText.trim();
    if (!raw) return;

    const isComplete =
      this.parenDepth === 0 &&
      this.braceDepth === 0 &&
      this.bracketDepth === 0 &&
      !this.inString &&
      !this.inTemplateLiteral &&
      !this.inBlockComment;

    const unit = this.analyzeUnit(raw, isComplete);
    if (unit) {
      const lastIdx = this.program.units.length - 1;
      if (lastIdx >= 0 && !this.program.units[lastIdx].isComplete) {
        this.program.units[lastIdx] = unit;
      } else {
        this.program.units.push(unit);
      }
    }
    this.currentUnitText = '';
  }

  /**
   * Expands compact LM abbreviations at the start of a statement (c -> const, l -> let, etc.)
   */
  private normalizeLMSyntax(raw: string): string {
    let normalized = raw.trim();

    // Compact variable keywords: c x = ... -> const x = ...
    normalized = normalized.replace(/^c\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/, 'const $1');
    normalized = normalized.replace(/^l\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/, 'let $1');
    normalized = normalized.replace(/^v\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/, 'var $1');

    // Compact function keyword: fn foo(...) -> function foo(...)
    normalized = normalized.replace(/^fn\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/, 'function $1');
    normalized = normalized.replace(/^async\s+fn\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/, 'async function $1');

    // Compact return keyword: ret ... -> return ...
    normalized = normalized.replace(/^ret(\s+.*)?$/, 'return$1');

    return normalized;
  }

  private analyzeUnit(raw: string, isComplete: boolean): JSUnitNode {
    const normalized = this.normalizeLMSyntax(raw);
    const index = this.program.units.length;

    // 1. Event Handlers: event(...) / on(...) / evt(...)
    const eventMatch = /^(?:event|on|evt)\s*\(\s*(['"`])([a-zA-Z0-9_-]+)\1\s*,\s*(['"`])([^'"`]+)\3\s*,\s*([\s\S]+)\)$/i.exec(
      normalized.replace(/;$/, '')
    );
    if (eventMatch) {
      const eventName = eventMatch[2];
      const targetSelector = eventMatch[4];
      const handlerCode = eventMatch[5];
      const id = getJSEventHandlerId(eventName, targetSelector);

      const handlerNode: JSEventHandlerNode = {
        id,
        kind: JSNodeKind.EventHandler,
        eventName,
        targetSelector,
        handlerCode,
        sourceLocation: { ...this.currentUnitStartLoc },
      };

      return {
        id,
        kind: JSNodeKind.Unit,
        unitKind: 'EventHandler',
        code: `window.__leveonas_runtime__.on(${JSON.stringify(eventName)}, ${JSON.stringify(targetSelector)}, ${handlerCode});`,
        rawCode: raw,
        isComplete,
        meta: {
          eventName,
          targetSelector,
        },
        details: handlerNode,
        sourceLocation: { ...this.currentUnitStartLoc },
      };
    }

    // 2. Timers: setTimeout / setInterval / clearTimeout / clearInterval or st / si / ct / ci
    const timerMatch = /^(?:setTimeout|setInterval|clearTimeout|clearInterval|st|si|ct|ci)\s*\(\s*([\s\S]+?)\s*(?:,\s*([0-9]+))?\s*\)$/i.exec(
      normalized.replace(/;$/, '')
    );
    if (timerMatch) {
      const fnName = normalized.match(/^[a-zA-Z]+/)?.[0] || '';
      const isInterval = fnName === 'setInterval' || fnName === 'si';
      const isClearTimeout = fnName === 'clearTimeout' || fnName === 'ct';
      const isClearInterval = fnName === 'clearInterval' || fnName === 'ci';

      let timerType: 'setTimeout' | 'setInterval' | 'clearTimeout' | 'clearInterval' = 'setTimeout';
      if (isInterval) timerType = 'setInterval';
      else if (isClearTimeout) timerType = 'clearTimeout';
      else if (isClearInterval) timerType = 'clearInterval';

      const arg1 = timerMatch[1];
      const delayMs = timerMatch[2] ? parseInt(timerMatch[2], 10) : 0;
      const id = getJSTimerId(timerType, index);

      let runtimeCode = '';
      if (timerType === 'clearTimeout' || timerType === 'clearInterval') {
        runtimeCode = `window.__leveonas_runtime__.${timerType}(${arg1});`;
      } else {
        runtimeCode = `window.__leveonas_runtime__.${timerType}(${arg1}, ${delayMs});`;
      }

      const timerNode: JSTimerNode = {
        id,
        kind: JSNodeKind.Timer,
        timerType,
        callbackCode: timerType === 'clearTimeout' || timerType === 'clearInterval' ? undefined : arg1,
        delayMs: timerType === 'clearTimeout' || timerType === 'clearInterval' ? undefined : delayMs,
        timerIdRef: timerType === 'clearTimeout' || timerType === 'clearInterval' ? arg1 : undefined,
        sourceLocation: { ...this.currentUnitStartLoc },
      };

      return {
        id,
        kind: JSNodeKind.Unit,
        unitKind: 'Timer',
        code: runtimeCode,
        rawCode: raw,
        isComplete,
        meta: {
          timerType,
          delayMs,
        },
        details: timerNode,
        sourceLocation: { ...this.currentUnitStartLoc },
      };
    }

    // 3. Variable Declarations: const / let / var (including expanded c / l / v)
    const varMatch = /^(const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)(?:\s*=\s*([\s\S]+))?$/i.exec(
      normalized.replace(/;$/, '')
    );
    if (varMatch) {
      const varKind = varMatch[1].toLowerCase() as 'const' | 'let' | 'var';
      const identifier = varMatch[2];
      const initialValue = varMatch[3] ? varMatch[3].trim() : undefined;
      const id = getJSUnitId('var', identifier);

      // Parse initial value sub-AST node if available
      let initialAST: JSASTNode | undefined;
      if (initialValue) {
        initialAST = this.parseExpression(initialValue, `${id}-val`);
      }

      const varNode: JSVariableDeclarationNode = {
        id,
        kind: JSNodeKind.VariableDeclaration,
        varKind,
        identifier,
        initialValue: initialAST || initialValue,
        sourceLocation: { ...this.currentUnitStartLoc },
      };

      const code = normalized.endsWith(';') ? normalized : `${normalized};`;

      return {
        id,
        kind: JSNodeKind.Unit,
        unitKind: 'Variable',
        code,
        rawCode: raw,
        isComplete,
        meta: {
          identifier,
        },
        details: varNode,
        sourceLocation: { ...this.currentUnitStartLoc },
      };
    }

    // 4. Function Declarations: function foo(...) { ... } or async function foo(...) { ... }
    const funcMatch = /^(?:async\s+)?function(?:\s+([a-zA-Z_$][a-zA-Z0-9_$]*))?\s*\(([^)]*)\)\s*\{([\s\S]*)\}$/i.exec(
      normalized
    );
    if (funcMatch) {
      const funcName = funcMatch[1] || `anonymous_${index}`;
      const params = funcMatch[2]
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);
      const body = funcMatch[3];
      const isAsync = normalized.startsWith('async');
      const id = getJSUnitId('func', funcName);

      const funcNode: JSFunctionDeclarationNode = {
        id,
        kind: JSNodeKind.FunctionDeclaration,
        name: funcName,
        params,
        body,
        isAsync,
        sourceLocation: { ...this.currentUnitStartLoc },
      };

      return {
        id,
        kind: JSNodeKind.Unit,
        unitKind: 'Function',
        code: normalized,
        rawCode: raw,
        isComplete,
        meta: {
          functionName: funcName,
        },
        details: funcNode,
        sourceLocation: { ...this.currentUnitStartLoc },
      };
    }

    // 5. Standalone Arrow Functions: (...) => ...
    const arrowMatch = /^(?:async\s+)?(?:\(([^)]*)\)|([a-zA-Z_$][a-zA-Z0-9_$]*))\s*=>\s*([\s\S]+)$/i.exec(
      normalized.replace(/;$/, '')
    );
    if (arrowMatch) {
      const paramsStr = arrowMatch[1] !== undefined ? arrowMatch[1] : arrowMatch[2];
      const params = paramsStr
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);
      const body = arrowMatch[3].trim();
      const isAsync = normalized.startsWith('async');
      const id = getJSUnitId('arrow', `fn_${index}`);

      const arrowNode: JSArrowFunctionNode = {
        id,
        kind: JSNodeKind.ArrowFunction,
        params,
        body,
        isAsync,
        sourceLocation: { ...this.currentUnitStartLoc },
      };

      return {
        id,
        kind: JSNodeKind.Unit,
        unitKind: 'ArrowFunction',
        code: normalized.endsWith(';') ? normalized : `${normalized};`,
        rawCode: raw,
        isComplete,
        details: arrowNode,
        sourceLocation: { ...this.currentUnitStartLoc },
      };
    }

    // 6. Return statements: return ... or ret ...
    const returnMatch = /^return(?:\s+([\s\S]+))?$/i.exec(normalized.replace(/;$/, ''));
    if (returnMatch) {
      const arg = returnMatch[1]?.trim();
      const id = getJSUnitId('ret', `ret_${index}`);

      const returnNode: JSReturnNode = {
        id,
        kind: JSNodeKind.Return,
        argument: arg ? this.parseExpression(arg, `${id}-arg`) : undefined,
        sourceLocation: { ...this.currentUnitStartLoc },
      };

      return {
        id,
        kind: JSNodeKind.Unit,
        unitKind: 'Return',
        code: normalized.endsWith(';') ? normalized : `${normalized};`,
        rawCode: raw,
        isComplete,
        details: returnNode,
        sourceLocation: { ...this.currentUnitStartLoc },
      };
    }

    // 7. If Statements: if (...) { ... } else { ... }
    const ifMatch = /^if\s*\(([\s\S]+?)\)\s*\{([\s\S]*)\}(?:\s*else\s*\{([\s\S]*)\})?$/i.exec(normalized);
    if (ifMatch) {
      const condition = ifMatch[1];
      const consequent = ifMatch[2];
      const alternate = ifMatch[3];
      const id = getJSUnitId('if', condition.slice(0, 16));

      const ifNode: JSIfStatementNode = {
        id,
        kind: JSNodeKind.IfStatement,
        condition: this.parseExpression(condition, `${id}-cond`),
        consequent,
        alternate,
        sourceLocation: { ...this.currentUnitStartLoc },
      };

      return {
        id,
        kind: JSNodeKind.Unit,
        unitKind: 'IfStatement',
        code: normalized,
        rawCode: raw,
        isComplete,
        details: ifNode,
        sourceLocation: { ...this.currentUnitStartLoc },
      };
    }

    // 8. DOM Operation helper call: setText(el, val), addClass(el, cls), etc.
    const domHelperMatch = /^(setText|setHTML|setAttr|removeAttr|addClass|removeClass|toggleClass|append|remove|createEl|cel)\s*\(([\s\S]*)\)$/i.exec(
      normalized.replace(/;$/, '')
    );
    if (domHelperMatch) {
      const opName = domHelperMatch[1];
      const rawArgs = domHelperMatch[2];
      const args = rawArgs
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean);
      const targetSelector = args[0] || 'body';
      const id = getJSDOMOperationId(opName, targetSelector, index);

      const domNode: JSDOMOperationNode = {
        id,
        kind: JSNodeKind.DOMOperation,
        operation: opName,
        targetSelector,
        args: args.slice(1),
        sourceLocation: { ...this.currentUnitStartLoc },
      };

      return {
        id,
        kind: JSNodeKind.Unit,
        unitKind: 'DOMOperation',
        code: `window.__leveonas_runtime__.${opName}(${args.join(', ')});`,
        rawCode: raw,
        isComplete,
        meta: {
          operation: opName,
          targetSelector,
        },
        details: domNode,
        sourceLocation: { ...this.currentUnitStartLoc },
      };
    }

    // 9. Generic Expression / Statement
    const id = getJSUnitId('stmt', normalized.slice(0, 16), index);
    const code = normalized.endsWith(';') || normalized.endsWith('}') ? normalized : `${normalized};`;
    const exprAST = this.parseExpression(normalized.replace(/;$/, ''), id);

    const unitKind: JSUnitKind =
      exprAST.kind === JSNodeKind.Assignment
        ? 'Statement'
        : exprAST.kind === JSNodeKind.CallExpression
        ? 'Expression'
        : 'Statement';

    return {
      id,
      kind: JSNodeKind.Unit,
      unitKind,
      code,
      rawCode: raw,
      isComplete,
      details: exprAST,
      sourceLocation: { ...this.currentUnitStartLoc },
    };
  }

  /**
   * Robust light-weight expression parser that converts expressions into structured AST nodes.
   */
  public parseExpression(expr: string, baseId: string): JSASTNode {
    const trimmed = expr.trim();

    // 1. Literal: number
    if (/^-?[0-9]+(\.[0-9]+)?$/.test(trimmed)) {
      const val = parseFloat(trimmed);
      return {
        id: `${baseId}-lit`,
        kind: JSNodeKind.Literal,
        value: val,
        raw: trimmed,
        sourceLocation: { ...this.currentUnitStartLoc },
      };
    }

    // 2. Literal: string
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
      const val = trimmed.slice(1, -1);
      return {
        id: `${baseId}-lit`,
        kind: JSNodeKind.Literal,
        value: val,
        raw: trimmed,
        sourceLocation: { ...this.currentUnitStartLoc },
      };
    }

    // 3. Literal: boolean / null / undefined
    if (trimmed === 'true' || trimmed === 'false' || trimmed === 'null' || trimmed === 'undefined') {
      const val = trimmed === 'true' ? true : trimmed === 'false' ? false : trimmed === 'null' ? null : undefined;
      return {
        id: `${baseId}-lit`,
        kind: JSNodeKind.Literal,
        value: val,
        raw: trimmed,
        sourceLocation: { ...this.currentUnitStartLoc },
      };
    }

    // 4. Identifier: e.g. foo, count, $el
    if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(trimmed)) {
      return {
        id: `${baseId}-id`,
        kind: JSNodeKind.Identifier,
        name: trimmed,
        sourceLocation: { ...this.currentUnitStartLoc },
      };
    }

    // 5. Assignment: e.g. x = y, count += 1
    const assignMatch = /^([a-zA-Z_$][a-zA-Z0-9_$.\[\]]*)\s*(=|\+=|-=|\*=|\/=)\s*([\s\S]+)$/.exec(trimmed);
    if (assignMatch) {
      return {
        id: `${baseId}-assign`,
        kind: JSNodeKind.Assignment,
        operator: assignMatch[2],
        left: this.parseExpression(assignMatch[1], `${baseId}-left`),
        right: this.parseExpression(assignMatch[3], `${baseId}-right`),
        sourceLocation: { ...this.currentUnitStartLoc },
      };
    }

    // 6. Ternary Conditional Expression: cond ? a : b
    const ternaryMatch = /^([^\?]+)\?([^:]+):([\s\S]+)$/.exec(trimmed);
    if (ternaryMatch) {
      return {
        id: `${baseId}-ternary`,
        kind: JSNodeKind.ConditionalExpression,
        test: this.parseExpression(ternaryMatch[1], `${baseId}-test`),
        consequent: this.parseExpression(ternaryMatch[2], `${baseId}-cons`),
        alternate: this.parseExpression(ternaryMatch[3], `${baseId}-alt`),
        sourceLocation: { ...this.currentUnitStartLoc },
      };
    }

    // 7. Call Expression: foo(...) or obj.bar(...)
    const callMatch = /^([a-zA-Z_$][a-zA-Z0-9_$.\[\]]*)\s*\(([\s\S]*)\)$/.exec(trimmed);
    if (callMatch) {
      const calleeStr = callMatch[1];
      const argsStr = callMatch[2].trim();
      const args = argsStr
        ? argsStr.split(',').map((a, i) => this.parseExpression(a.trim(), `${baseId}-arg${i}`))
        : [];

      return {
        id: `${baseId}-call`,
        kind: JSNodeKind.CallExpression,
        callee: this.parseExpression(calleeStr, `${baseId}-callee`),
        arguments: args,
        sourceLocation: { ...this.currentUnitStartLoc },
      };
    }

    // 8. Member Expression: obj.prop or obj["prop"]
    const memberMatch = /^([a-zA-Z_$][a-zA-Z0-9_$]*)\.([a-zA-Z_$][a-zA-Z0-9_$]*)$/.exec(trimmed);
    if (memberMatch) {
      return {
        id: `${baseId}-mem`,
        kind: JSNodeKind.MemberExpression,
        object: {
          id: `${baseId}-obj`,
          kind: JSNodeKind.Identifier,
          name: memberMatch[1],
          sourceLocation: { ...this.currentUnitStartLoc },
        },
        property: {
          id: `${baseId}-prop`,
          kind: JSNodeKind.Identifier,
          name: memberMatch[2],
          sourceLocation: { ...this.currentUnitStartLoc },
        },
        computed: false,
        sourceLocation: { ...this.currentUnitStartLoc },
      };
    }

    // 9. Binary Expression: e.g. a + b, count > 10, a === b, x && y
    const binaryOps = ['===', '!==', '==', '!=', '<=', '>=', '&&', '||', '+', '-', '*', '/', '%', '>', '<'];
    for (const op of binaryOps) {
      const opIdx = trimmed.indexOf(` ${op} `);
      if (opIdx !== -1) {
        const leftStr = trimmed.slice(0, opIdx);
        const rightStr = trimmed.slice(opIdx + op.length + 2);
        return {
          id: `${baseId}-bin`,
          kind: JSNodeKind.BinaryExpression,
          operator: op,
          left: this.parseExpression(leftStr, `${baseId}-l`),
          right: this.parseExpression(rightStr, `${baseId}-r`),
          sourceLocation: { ...this.currentUnitStartLoc },
        };
      }
    }

    // 10. Unary Expression: !x, -y, ++count, count++
    if (trimmed.startsWith('!') || (trimmed.startsWith('-') && !/^[0-9]/.test(trimmed.slice(1)))) {
      const op = trimmed[0];
      return {
        id: `${baseId}-unary`,
        kind: JSNodeKind.UnaryExpression,
        operator: op,
        argument: this.parseExpression(trimmed.slice(1), `${baseId}-arg`),
        prefix: true,
        sourceLocation: { ...this.currentUnitStartLoc },
      };
    }

    // Default fallback: ExpressionStatementNode
    return {
      id: `${baseId}-expr`,
      kind: JSNodeKind.ExpressionStatement,
      code: trimmed,
      sourceLocation: { ...this.currentUnitStartLoc },
    };
  }
}
