import { PatchOperation, PatchOperationType, normalizePatchOperationType } from '../patch-generator/types';

export interface RegisteredEventHandler {
  nodeId: string;
  eventName: string;
  targetSelector: string;
  handlerFn: Function;
  listener: (e: any) => void;
}

export class JSPatchApplier {
  private doc: any;
  private win: any;
  private executedUnitCodes: Map<string, string> = new Map();
  private eventHandlerRegistry: Map<string, RegisteredEventHandler> = new Map();
  private activeTimers: Set<any> = new Set();
  private sharedScope: Record<string, any> = {};
  private onError?: (err: Error, context: string) => void;
  private domApplier?: any;

  constructor(
    doc?: any,
    win?: any,
    onError?: (err: Error, context: string) => void,
    domApplier?: any
  ) {
    this.doc = doc || (typeof document !== 'undefined' ? document : null);
    this.win = win || (typeof window !== 'undefined' ? window : null);
    this.onError = onError;
    this.domApplier = domApplier;

    this.setupRuntimeScope();
  }

  public setDOMApplier(domApplier: any): void {
    this.domApplier = domApplier;
  }

  private setupRuntimeScope(): void {
    if (!this.win) return;

    const self = this;

    // Provide __leveonas_runtime__ on window
    this.win.__leveonas_runtime__ = {
      qs: (selector: string) => self.doc?.querySelector(selector),
      qsa: (selector: string) => self.doc?.querySelectorAll(selector),
      gid: (id: string) => self.doc?.getElementById(id),

      on: (eventName: string, selector: string, fn: Function) => {
        return self.registerEventHandler(`inline-evt-${eventName}-${selector}`, eventName, selector, fn);
      },

      applyPatches: (patches: PatchOperation[]) => {
        if (self.domApplier && typeof self.domApplier.apply === 'function') {
          self.domApplier.apply(patches);
        }
      },

      updateState: (instancePath: string, stateName: string, newValue: any) => {
        if (!self.win) return;
        self.win.__leveonas_state__ = self.win.__leveonas_state__ || {};
        self.win.__leveonas_state__[instancePath] = self.win.__leveonas_state__[instancePath] || {};
        self.win.__leveonas_state__[instancePath][stateName] = newValue;

        const reactivityDef = self.win.__leveonas_reactivity__?.[instancePath];
        if (reactivityDef) {
          if (typeof reactivityDef.updateState === 'function') {
            // Backward compatibility for objects with updateState method
            const res = reactivityDef.updateState(stateName, newValue, self.win.__leveonas_state__[instancePath]);
            if (res && res.patches && res.patches.length > 0) {
              if (self.domApplier && typeof self.domApplier.apply === 'function') {
                self.domApplier.apply(res.patches);
              }
            }
          } else if (reactivityDef.domDependencies) {
            // Framework-neutral serializable reactivity definition
            const state = self.win.__leveonas_state__[instancePath];
            const changedVars = [stateName];

            // Safe expression evaluation helper
            const evalExpr = (expr: string, ctx: Record<string, any>): any => {
              if (!expr || typeof expr !== 'string') return undefined;
              const trimmed = expr.trim();
              if (trimmed === 'true') return true;
              if (trimmed === 'false') return false;
              if (trimmed === 'null') return null;
              if (trimmed === 'undefined') return undefined;
              if (!isNaN(Number(trimmed)) && trimmed !== '') return Number(trimmed);
              if (
                (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
                (trimmed.startsWith("'") && trimmed.endsWith("'"))
              ) {
                return trimmed.slice(1, -1);
              }
              if (trimmed in ctx) return ctx[trimmed];
              if (/^[a-zA-Z_$][a-zA-Z0-9_$]*(?:\.[a-zA-Z_$][a-zA-Z0-9_$]*)+$/.test(trimmed)) {
                const parts = trimmed.split('.');
                let cur = ctx;
                for (const p of parts) {
                  if (cur == null) return undefined;
                  cur = cur[p];
                }
                return cur;
              }
              try {
                const keys = Object.keys(ctx);
                const values = Object.values(ctx);
                const fn = new Function(...keys, `return (${trimmed});`);
                return fn(...values);
              } catch {
                return null;
              }
            };

            const interpolate = (tpl: string, ctx: Record<string, any>): string => {
              if (!tpl) return '';
              return tpl.replace(/\{\s*([a-zA-Z_$][a-zA-Z0-9_$.]*)\s*\}/g, (_, key) => {
                const val = evalExpr(key, ctx);
                return val !== undefined && val !== null ? String(val) : '';
              });
            };

            const renderUIIRToAST = (
              node: any,
              parentPath: string,
              compInstancePath: string,
              index: number,
              context: Record<string, any>,
              keyOverride?: string
            ): any => {
              if (!node) return null;
              switch (node.kind) {
                case 'UIText': {
                  const keySuffix = keyOverride ? `-k_${keyOverride}` : '';
                  const textId = `${parentPath}-txt_${index}${keySuffix}`;
                  const renderedText = interpolate(node.value, context);
                  return {
                    id: textId,
                    kind: 'Literal',
                    value: renderedText,
                    raw: JSON.stringify(renderedText),
                  };
                }
                case 'UIElement': {
                  const canonicalTag = (node.tag || 'div').toLowerCase();
                  const explicitIdProp = (node.props || []).find((p: any) => p.name === 'id');
                  const keySuffix = keyOverride ? `-k_${keyOverride}` : '';
                  const elemId = explicitIdProp
                    ? String(explicitIdProp.value)
                    : (keyOverride ? `${parentPath}-${canonicalTag}${keySuffix}` : `${parentPath}-${canonicalTag}_${index}`);

                  const properties: any[] = [];
                  let hasExplicitId = false;

                  if (keyOverride) {
                    properties.push({
                      name: 'key',
                      value: { id: `${elemId}-prop_key`, kind: 'Literal', value: keyOverride, raw: JSON.stringify(keyOverride) }
                    });
                  }

                  for (const prop of (node.props || [])) {
                    if (prop.name === 'id') hasExplicitId = true;
                    let pVal = prop.value;
                    if (typeof pVal === 'string' && pVal.includes('{')) {
                      pVal = interpolate(pVal, context);
                    }
                    properties.push({
                      name: prop.name,
                      value: { id: `${elemId}-prop_${prop.name}`, kind: 'Literal', value: pVal, raw: JSON.stringify(pVal) }
                    });
                  }

                  if (!hasExplicitId) {
                    properties.unshift({
                      name: 'id',
                      value: { id: `${elemId}-prop_id`, kind: 'Literal', value: elemId, raw: JSON.stringify(elemId) }
                    });
                  }

                  const children: any[] = [];
                  for (let i = 0; i < (node.children || []).length; i++) {
                    const childAST = renderUIIRToAST(node.children[i], elemId, compInstancePath, i, context);
                    if (childAST) children.push(childAST);
                  }

                  return {
                    id: elemId,
                    kind: 'GenericComponent',
                    name: canonicalTag,
                    properties,
                    children,
                  };
                }
                case 'UIFragment': {
                  const children: any[] = [];
                  for (let i = 0; i < (node.children || []).length; i++) {
                    const childAST = renderUIIRToAST(node.children[i], `${parentPath}-frag_${index}`, compInstancePath, i, context);
                    if (childAST) children.push(childAST);
                  }
                  return children[0] || null;
                }
                case 'UIConditional': {
                  let isTruthy = false;
                  try {
                    isTruthy = Boolean(evalExpr(node.conditionExpr, context));
                  } catch {
                    isTruthy = true;
                  }
                  const activeBranch = isTruthy ? node.thenBranch : node.elseBranch;
                  if (!activeBranch) return null;
                  return renderUIIRToAST(activeBranch, `${parentPath}-cond_${index}-${isTruthy ? 'then' : 'else'}`, compInstancePath, 0, context);
                }
                default:
                  return null;
              }
            };

            // 1. Recompute derived declarations
            const derivedMap = reactivityDef.derived || {};
            const queue = [stateName];
            const affectedDerived = new Set<string>();

            while (queue.length > 0) {
              const cur = queue.shift()!;
              const dependents = reactivityDef.edges?.varToDerived?.[cur] || [];
              for (const dep of dependents) {
                if (!affectedDerived.has(dep)) {
                  affectedDerived.add(dep);
                  queue.push(dep);
                }
              }
            }

            for (const dName of affectedDerived) {
              const dInfo = derivedMap[dName];
              if (dInfo && dInfo.expression) {
                const newVal = evalExpr(dInfo.expression, state);
                state[dName] = newVal;
                changedVars.push(dName);
              }
            }

            // 2. Identify affected DOM nodes
            const affectedDomIds = new Set<string>();
            for (const v of changedVars) {
              const domIds = reactivityDef.edges?.varToDOM?.[v] || [];
              for (const domId of domIds) {
                affectedDomIds.add(domId);
              }
            }

            // 3. Generate pinpoint DOM patches
            const patches: PatchOperation[] = [];
            for (const domId of affectedDomIds) {
              const dep = reactivityDef.domDependencies[domId];
              if (!dep) continue;

              switch (dep.kind) {
                case 'TEXT': {
                  const val = interpolate(dep.template || '', state);
                  patches.push({
                    operation: PatchOperationType.UPDATE_TEXT,
                    nodeId: domId,
                    payload: { value: val, text: val },
                  });
                  break;
                }
                case 'PROPERTY': {
                  if (dep.propName) {
                    const val = evalExpr(dep.expression || '', state);
                    patches.push({
                      operation: PatchOperationType.SET_ATTRIBUTE,
                      nodeId: domId,
                      payload: { name: dep.propName, value: val },
                    });
                  }
                  break;
                }
                case 'CLASS': {
                  if (dep.className && dep.expression) {
                    const active = Boolean(evalExpr(dep.expression, state));
                    patches.push({
                      operation: PatchOperationType.SET_ATTRIBUTE,
                      nodeId: domId,
                      payload: { name: 'class', className: dep.className, active },
                    });
                  }
                  break;
                }
                case 'STYLE': {
                  const styleProp = dep.styleProp || dep.propName;
                  if (styleProp && dep.expression) {
                    const val = evalExpr(dep.expression, state);
                    patches.push({
                      operation: PatchOperationType.SET_ATTRIBUTE,
                      nodeId: domId,
                      payload: { styleProp, value: val, name: 'style' },
                    });
                  }
                  break;
                }
                case 'BINDING': {
                  if (dep.propName && dep.expression) {
                    const val = state[dep.expression];
                    patches.push({
                      operation: PatchOperationType.SET_ATTRIBUTE,
                      nodeId: domId,
                      payload: { name: dep.propName, value: val },
                    });
                  }
                  break;
                }
                case 'CONDITIONAL': {
                  if (dep.expression) {
                    const isTruthy = Boolean(evalExpr(dep.expression, state));
                    const targetBranch = isTruthy ? 'then' : 'else';
                    if (dep.currentBranch !== targetBranch) {
                      dep.currentBranch = targetBranch;
                      const branchIR = isTruthy ? dep.thenBranch : dep.elseBranch;
                      if (branchIR) {
                        const branchAST = renderUIIRToAST(
                          branchIR,
                          `${dep.parentPath}-${targetBranch}`,
                          dep.compInstancePath,
                          0,
                          state
                        );
                        if (branchAST) {
                          const targetNodeId = dep.currentDomId || domId;
                          patches.push({
                            operation: PatchOperationType.REPLACE_NODE,
                            nodeId: targetNodeId,
                            payload: branchAST,
                          });
                          dep.currentDomId = branchAST.id;
                        }
                      } else if (typeof dep.branchRenderer === 'function') {
                        const branchAST = dep.branchRenderer(targetBranch, state);
                        if (branchAST) {
                          const targetNodeId = dep.currentDomId || domId;
                          patches.push({
                            operation: PatchOperationType.REPLACE_NODE,
                            nodeId: targetNodeId,
                            payload: branchAST,
                          });
                          if (branchAST.id) {
                            dep.currentDomId = branchAST.id;
                          }
                        }
                      }
                    }
                  }
                  break;
                }
                case 'LIST': {
                  const newItems = evalExpr(dep.arrayExpr || '', state) || state[dep.arrayExpr || ''] || [];
                  if (!Array.isArray(newItems)) break;

                  const oldKeys = dep.renderedKeys || [];
                  const newKeys: string[] = [];
                  const newItemMap = new Map<string, { item: any; index: number }>();

                  for (let i = 0; i < newItems.length; i++) {
                    const item = newItems[i];
                    let itemKey: any = i;
                    if (dep.keyExpr) {
                      const keyScope = typeof item === 'object' && item !== null
                        ? { ...item, [dep.itemVar || 'item']: item, index: i }
                        : { [dep.itemVar || 'item']: item, index: i };
                      itemKey = evalExpr(dep.keyExpr, keyScope) ?? i;
                    } else if (typeof item === 'string' || typeof item === 'number') {
                      itemKey = item;
                    } else if (item && typeof item === 'object' && ('id' in item || 'key' in item)) {
                      itemKey = item.id ?? item.key;
                    }
                    const strKey = String(itemKey);
                    newKeys.push(strKey);
                    newItemMap.set(strKey, { item, index: i });
                  }

                  const tag = (dep.body?.tag || 'li').toLowerCase();
                  const getItemId = (key: string) => `${dep.parentPath}-${tag}-k_${key}`;

                  // 1. Removals
                  const newKeySet = new Set(newKeys);
                  const removedKeys = oldKeys.filter((k: string) => !newKeySet.has(k));
                  for (const remKey of removedKeys) {
                    const remNodeId = getItemId(remKey);
                    patches.push({
                      operation: PatchOperationType.REMOVE_NODE,
                      nodeId: remNodeId,
                    });
                  }

                  // 2. In-place content updates for preserved keys
                  const oldKeySet = new Set(oldKeys);
                  for (const key of oldKeys) {
                    if (newKeySet.has(key)) {
                      const { item, index: itemIdx } = newItemMap.get(key)!;
                      const itemContext = typeof item === 'object' && item !== null
                        ? { ...state, ...item, [dep.itemVar || 'item']: item, index: itemIdx, [dep.indexVar || 'index']: itemIdx }
                        : { ...state, [dep.itemVar || 'item']: item, index: itemIdx, [dep.indexVar || 'index']: itemIdx };
                      const itemId = getItemId(key);
                      if (dep.body && dep.body.children) {
                        for (let ci = 0; ci < dep.body.children.length; ci++) {
                          const child = dep.body.children[ci];
                          if (child.kind === 'UIText') {
                            const textId = `${itemId}-txt_${ci}`;
                            const updatedText = interpolate(child.value, itemContext);
                            patches.push({
                              operation: PatchOperationType.UPDATE_TEXT,
                              nodeId: textId,
                              payload: { value: updatedText, text: updatedText },
                            });
                          }
                        }
                      }
                    }
                  }

                  // 3. Insertions & Moves / Reordering
                  let currentOrder = oldKeys.filter((k: string) => newKeySet.has(k));
                  for (let targetIndex = 0; targetIndex < newKeys.length; targetIndex++) {
                    const key = newKeys[targetIndex];
                    const itemId = getItemId(key);
                    const { item, index: itemIdx } = newItemMap.get(key)!;
                    const itemContext = typeof item === 'object' && item !== null
                      ? { ...state, ...item, [dep.itemVar || 'item']: item, index: itemIdx, [dep.indexVar || 'index']: itemIdx }
                      : { ...state, [dep.itemVar || 'item']: item, index: itemIdx, [dep.indexVar || 'index']: itemIdx };

                    if (!oldKeySet.has(key)) {
                      const itemAST = renderUIIRToAST(
                        dep.body,
                        dep.parentPath,
                        dep.compInstancePath,
                        targetIndex,
                        itemContext,
                        key
                      );
                      patches.push({
                        operation: PatchOperationType.INSERT_CHILD,
                        parentId: dep.containerId,
                        nodeId: itemId,
                        index: targetIndex,
                        payload: itemAST,
                      });
                      currentOrder.splice(targetIndex, 0, key);
                    } else {
                      const currentIndex = currentOrder.indexOf(key);
                      if (currentIndex !== targetIndex && currentIndex !== -1) {
                        patches.push({
                          operation: PatchOperationType.MOVE_CHILD,
                          nodeId: itemId,
                          parentId: dep.containerId,
                          index: targetIndex,
                        });
                        currentOrder.splice(currentIndex, 1);
                        currentOrder.splice(targetIndex, 0, key);
                      }
                    }
                  }

                  dep.renderedKeys = [...newKeys];
                  break;
                }
              }
            }

            if (patches.length > 0 && self.domApplier && typeof self.domApplier.apply === 'function') {
              self.domApplier.apply(patches);
            }
          }
        }
      },

      registerState: (instancePath: string, stateObj: Record<string, any>) => {
        if (!self.win) return;
        self.win.__leveonas_state__ = self.win.__leveonas_state__ || {};
        self.win.__leveonas_state__[instancePath] = {
          ...(self.win.__leveonas_state__[instancePath] || {}),
          ...stateObj,
        };
      },

      registerReactivity: (instancePath: string, definition: any) => {
        if (!self.win) return;
        self.win.__leveonas_reactivity__ = self.win.__leveonas_reactivity__ || {};
        self.win.__leveonas_reactivity__[instancePath] = definition;
        self.win.__leveonas_state__ = self.win.__leveonas_state__ || {};
        self.win.__leveonas_state__[instancePath] = self.win.__leveonas_state__[instancePath] || {};
        const state = self.win.__leveonas_state__[instancePath];
        if (definition && definition.state) {
          for (const [sKey, sVal] of Object.entries(definition.state)) {
            if (state[sKey] === undefined) {
              state[sKey] = sVal;
            }
          }
        }
        if (definition && definition.derived) {
          for (const [dName, dInfo] of Object.entries(definition.derived as Record<string, any>)) {
            if (state[dName] === undefined && dInfo.expression) {
              try {
                const keys = Object.keys(state);
                const values = Object.values(state);
                const fn = new Function(...keys, `return (${dInfo.expression});`);
                state[dName] = fn(...values);
              } catch {
                // Ignore initial eval errors
              }
            }
          }
        }
      },

      registerReactivityGraph: (instancePath: string, graph: any) => {
        if (!self.win) return;
        self.win.__leveonas_reactivity__ = self.win.__leveonas_reactivity__ || {};
        self.win.__leveonas_reactivity__[instancePath] = graph;
      },

      setText: (target: any, text: string) => {
        const el = typeof target === 'string' ? self.doc?.querySelector(target) : target;
        if (el) el.textContent = text;
      },

      setHTML: (target: any, html: string) => {
        const el = typeof target === 'string' ? self.doc?.querySelector(target) : target;
        if (el) el.innerHTML = html;
      },

      addClass: (target: any, cls: string) => {
        const el = typeof target === 'string' ? self.doc?.querySelector(target) : target;
        if (el && el.classList) el.classList.add(cls);
      },

      removeClass: (target: any, cls: string) => {
        const el = typeof target === 'string' ? self.doc?.querySelector(target) : target;
        if (el && el.classList) el.classList.remove(cls);
      },

      toggleClass: (target: any, cls: string) => {
        const el = typeof target === 'string' ? self.doc?.querySelector(target) : target;
        if (el && el.classList) el.classList.toggle(cls);
      },

      setTimeout: (fn: Function, delay: number) => {
        const timerId = setTimeout(() => {
          self.activeTimers.delete(timerId);
          try {
            fn();
          } catch (err: any) {
            self.handleError(err, 'setTimeout callback');
          }
        }, delay);
        self.activeTimers.add(timerId);
        return timerId;
      },

      setInterval: (fn: Function, delay: number) => {
        const timerId = setInterval(() => {
          try {
            fn();
          } catch (err: any) {
            self.handleError(err, 'setInterval callback');
          }
        }, delay);
        self.activeTimers.add(timerId);
        return timerId;
      },

      clearTimeout: (timerId: any) => {
        self.activeTimers.delete(timerId);
        clearTimeout(timerId);
      },

      clearInterval: (timerId: any) => {
        self.activeTimers.delete(timerId);
        clearInterval(timerId);
      },
    };
  }

  public apply(patches: PatchOperation[]): void {
    if (!this.doc) return;

    for (const patch of patches) {
      const op = normalizePatchOperationType(patch.operation);

      switch (op) {
        case PatchOperationType.ATTACH_EVENT_HANDLER:
        case PatchOperationType.UPDATE_EVENT_HANDLER: {
          const { eventName, targetSelector, handlerCode } = patch.payload || {};
          if (eventName && targetSelector && handlerCode) {
            this.bindEventHandlerFromCode(patch.nodeId, eventName, targetSelector, handlerCode);
          }
          break;
        }

        case PatchOperationType.REMOVE_EVENT_HANDLER: {
          this.removeRegisteredEventHandler(patch.nodeId);
          break;
        }

        case PatchOperationType.CREATE_JS_UNIT:
        case PatchOperationType.UPDATE_JS_UNIT:
        case PatchOperationType.EXECUTE_JS_UNIT: {
          const code = patch.payload?.code;
          if (code && typeof code === 'string') {
            this.executeUnitCode(patch.nodeId, code);
          }
          break;
        }

        case PatchOperationType.REMOVE_JS_UNIT: {
          this.executedUnitCodes.delete(patch.nodeId);
          break;
        }

        case PatchOperationType.CLEANUP_JS_SESSION: {
          this.cleanup();
          break;
        }
      }
    }
  }

  private executeUnitCode(nodeId: string, code: string): void {
    const trimmed = code.trim();
    if (!trimmed) return;

    // Idempotency: avoid re-executing identical code for the same unit ID
    if (this.executedUnitCodes.get(nodeId) === trimmed) {
      return;
    }

    this.executedUnitCodes.set(nodeId, trimmed);

    try {
      const qs = (sel: string) => this.doc?.querySelector(sel);
      const qsa = (sel: string) => this.doc?.querySelectorAll(sel);
      const gid = (id: string) => this.doc?.getElementById(id);
      const on = (evt: string, sel: string, fn: Function) =>
        this.registerEventHandler(`inline-evt-${evt}-${sel}`, evt, sel, fn);

      // Handle top-level variable definitions by promoting to shared scope
      const varDeclMatch = /^(const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)(?:\s*=\s*([\s\S]+))?$/i.exec(trimmed);
      if (varDeclMatch) {
        const varName = varDeclMatch[2];
        const rawExpr = varDeclMatch[3] ? varDeclMatch[3].trim().replace(/;+$/, '') : 'undefined';
        const valExpr = rawExpr || 'undefined';

        const evalValFn = new Function(
          'document',
          'window',
          'qs',
          'qsa',
          'gid',
          'on',
          '__leveonas_runtime__',
          'scope',
          `with (window) { with (scope) { return (${valExpr}); } }`
        );
        const evalVal = evalValFn(this.doc, this.win, qs, qsa, gid, on, this.win?.__leveonas_runtime__, this.sharedScope);
        this.sharedScope[varName] = evalVal;
        if (this.win) {
          this.win[varName] = evalVal;
        }
        return;
      }

      // Handle top level function declarations
      const funcDeclMatch = /^(?:async\s+)?function(?:\s+([a-zA-Z_$][a-zA-Z0-9_$]*))\s*\(([^)]*)\)\s*\{([\s\S]*)\}$/i.exec(trimmed);
      if (funcDeclMatch) {
        const funcName = funcDeclMatch[1];
        const evalFn = new Function(
          'document',
          'window',
          'qs',
          'qsa',
          'gid',
          'on',
          '__leveonas_runtime__',
          'scope',
          `with (window) { with (scope) { return (${trimmed}); } }`
        );
        const fnObj = evalFn(this.doc, this.win, qs, qsa, gid, on, this.win?.__leveonas_runtime__, this.sharedScope);
        this.sharedScope[funcName] = fnObj;
        if (this.win) {
          this.win[funcName] = fnObj;
        }
        return;
      }

      // Generic statement execution
      const runner = new Function(
        'document',
        'window',
        'qs',
        'qsa',
        'gid',
        'on',
        '__leveonas_runtime__',
        'scope',
        `with (window) { with (scope) {\n${trimmed}\n}}`
      );

      runner(this.doc, this.win, qs, qsa, gid, on, this.win?.__leveonas_runtime__, this.sharedScope);

      if (this.win && this.sharedScope) {
        for (const k of Object.keys(this.sharedScope)) {
          this.win[k] = this.sharedScope[k];
        }
      }
    } catch (err: any) {
      this.handleError(err, `Executing JS unit ${nodeId}`);
    }
  }

  private bindEventHandlerFromCode(
    nodeId: string,
    eventName: string,
    targetSelector: string,
    handlerCode: string
  ): void {
    try {
      let handlerFn: Function;
      const cleanCode = handlerCode.trim().replace(/;+$/, '').trim();

      const qs = (sel: string) => this.doc?.querySelector(sel);
      const qsa = (sel: string) => this.doc?.querySelectorAll(sel);
      const gid = (id: string) => this.doc?.getElementById(id);
      const on = (evt: string, sel: string, fn: Function) =>
        this.registerEventHandler(`inline-evt-${evt}-${sel}`, evt, sel, fn);

      if (cleanCode.startsWith('function') || cleanCode.startsWith('(') || cleanCode.includes('=>')) {
        const builder = new Function(
          'document',
          'window',
          'qs',
          'qsa',
          'gid',
          'on',
          '__leveonas_runtime__',
          'scope',
          `with (window) { with (scope) { return (${cleanCode}); } }`
        );
        handlerFn = builder(this.doc, this.win, qs, qsa, gid, on, this.win?.__leveonas_runtime__, this.sharedScope);
      } else {
        handlerFn = new Function(
          'event',
          'target',
          'document',
          'window',
          'qs',
          'qsa',
          'gid',
          'on',
          '__leveonas_runtime__',
          'scope',
          `with (window) { with (scope) {\n${cleanCode}\n}}`
        );
      }

      this.registerEventHandler(nodeId, eventName, targetSelector, handlerFn);
    } catch (err: any) {
      this.handleError(err, `Compiling event handler for ${eventName} on ${targetSelector}`);
    }
  }

  public registerEventHandler(
    nodeId: string,
    eventName: string,
    targetSelector: string,
    handlerFn: Function
  ): void {
    // Remove previous listener with same ID if any
    this.removeRegisteredEventHandler(nodeId);

    const cleanEvent = eventName.toLowerCase().replace(/^on/, '');
    const self = this;

    const listener = (event: any) => {
      let matchedTarget: any = null;
      if (event.target) {
        if (event.target.closest) {
          matchedTarget = event.target.closest(targetSelector);
        } else if (event.target.matches && event.target.matches(targetSelector)) {
          matchedTarget = event.target;
        } else if (event.target.id && `#${event.target.id}` === targetSelector) {
          matchedTarget = event.target;
        }
      }

      if (matchedTarget) {
        try {
          const qs = (sel: string) => self.doc?.querySelector(sel);
          const qsa = (sel: string) => self.doc?.querySelectorAll(sel);
          const gid = (id: string) => self.doc?.getElementById(id);
          const on = (evt: string, sel: string, fn: Function) =>
            self.registerEventHandler(`inline-evt-${evt}-${sel}`, evt, sel, fn);

          handlerFn.call(
            matchedTarget,
            event,
            matchedTarget,
            self.doc,
            self.win,
            qs,
            qsa,
            gid,
            on,
            self.win?.__leveonas_runtime__,
            self.sharedScope
          );
        } catch (err: any) {
          self.handleError(err, `Event listener execution for ${cleanEvent} on ${targetSelector}`);
        }
      }
    };

    const target = this.doc?.body || this.doc;
    if (target && target.addEventListener) {
      target.addEventListener(cleanEvent, listener, false);
    }

    this.eventHandlerRegistry.set(nodeId, {
      nodeId,
      eventName: cleanEvent,
      targetSelector,
      handlerFn,
      listener,
    });
  }

  public removeRegisteredEventHandler(nodeId: string): void {
    const existing = this.eventHandlerRegistry.get(nodeId);
    if (!existing) return;

    const target = this.doc?.body || this.doc;
    if (target && target.removeEventListener) {
      target.removeEventListener(existing.eventName, existing.listener, false);
    }

    this.eventHandlerRegistry.delete(nodeId);
  }

  public cleanup(): void {
    // 1. Remove all event listeners
    const target = this.doc?.body || this.doc;
    if (target && target.removeEventListener) {
      for (const reg of this.eventHandlerRegistry.values()) {
        try {
          target.removeEventListener(reg.eventName, reg.listener, false);
        } catch (e) {
          // ignore
        }
      }
    }
    this.eventHandlerRegistry.clear();

    // 2. Clear all timers
    for (const timerId of this.activeTimers) {
      try {
        clearTimeout(timerId);
        clearInterval(timerId);
      } catch (e) {
        // ignore
      }
    }
    this.activeTimers.clear();

    // 3. Clear execution records and shared scope
    this.executedUnitCodes.clear();
    this.sharedScope = {};
  }

  private handleError(err: Error, context: string): void {
    if (this.onError) {
      this.onError(err, context);
    } else {
      console.warn(`[Leveonas JS Sandbox] ${context}:`, err);
    }
  }
}
