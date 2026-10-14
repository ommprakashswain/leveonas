import { PatchOperation, PatchOperationType } from '../../../runtime/incremental/patch-generator/types';
import { serializeASTNode } from '../../../runtime/incremental/patch-generator/diff';

/**
 * Dependency Extraction & Safe Expression Evaluation for Svelte-LM Reactivity
 */

const RESERVED_JS_KEYWORDS = new Set([
  'true',
  'false',
  'null',
  'undefined',
  'NaN',
  'Infinity',
  'Math',
  'Number',
  'String',
  'Boolean',
  'Array',
  'Object',
  'JSON',
  'Date',
  'RegExp',
  'window',
  'document',
  'console',
  'this',
  'typeof',
  'instanceof',
  'void',
  'in',
  'if',
  'else',
  'return',
  'new',
  'var',
  'let',
  'const',
  'function',
]);

/**
 * Deterministically extract variable identifier dependencies from an expression.
 * Examples:
 *   "count * 2" -> ["count"]
 *   "price * quantity" -> ["price", "quantity"]
 *   "user.name" -> ["user"]
 *   "a + b * c" -> ["a", "b", "c"]
 */
export function extractExpressionDependencies(expr: string, availableScope?: string[]): string[] {
  if (!expr || typeof expr !== 'string') return [];

  const trimmed = expr.trim();
  if (!trimmed) return [];

  // Match all potential identifiers, capturing the root object of member expressions (e.g. user from user.name)
  const identifierRegex = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)(?:\.[a-zA-Z_$][a-zA-Z0-9_$]*)*\b/g;
  const dependencies = new Set<string>();

  let match: RegExpExecArray | null;
  while ((match = identifierRegex.exec(trimmed)) !== null) {
    const rootIdent = match[1];

    if (RESERVED_JS_KEYWORDS.has(rootIdent)) {
      continue;
    }

    // If an explicit scope was provided, filter to known identifiers
    if (availableScope && availableScope.length > 0) {
      if (availableScope.includes(rootIdent)) {
        dependencies.add(rootIdent);
      }
    } else {
      dependencies.add(rootIdent);
    }
  }

  return Array.from(dependencies).sort();
}

/**
 * Extract dependencies from template string interpolations.
 * E.g. "Count: {count}, Double: {double}" -> ["count", "double"]
 */
export function extractTemplateInterpolations(template: string): string[] {
  if (!template || typeof template !== 'string') return [];
  const regex = /\{\s*([a-zA-Z_$][a-zA-Z0-9_$.]*)\s*\}/g;
  const deps = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = regex.exec(template)) !== null) {
    const rawExpr = match[1].trim();
    const rootIdent = rawExpr.split('.')[0];
    if (rootIdent && !RESERVED_JS_KEYWORDS.has(rootIdent)) {
      deps.add(rootIdent);
    }
  }
  return Array.from(deps).sort();
}

/**
 * Safely evaluates a simple Svelte expression against a scoped context object
 * without arbitrary `eval` or `with` statements.
 */
export function evaluateSvelteExpression(expr: string, context: Record<string, any>): any {
  if (!expr || typeof expr !== 'string') return undefined;
  const trimmed = expr.trim();

  // 1. Literal checks
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

  // 2. Direct scope variable lookup
  if (trimmed in context) {
    return context[trimmed];
  }

  // 3. Simple member path (e.g. user.name or item.price)
  if (/^[a-zA-Z_$][a-zA-Z0-9_$]*(?:\.[a-zA-Z_$][a-zA-Z0-9_$]*)+$/.test(trimmed)) {
    const parts = trimmed.split('.');
    let cur = context;
    for (const p of parts) {
      if (cur == null) return undefined;
      cur = cur[p];
    }
    return cur;
  }

  // 4. Safe arithmetic / logical expression evaluator
  // Handles expressions like: count * 2, price * quantity, a + b, count >= 10, !isActive
  try {
    const keys = Object.keys(context);
    const values = Object.values(context);
    // Uses isolated Function constructor with explicit parameter names (no 'with' statement)
    const fn = new Function(...keys, `return (${trimmed});`);
    return fn(...values);
  } catch (err) {
    // If evaluation fails, return null
    return null;
  }
}

/**
 * Interpolate template strings with current context values.
 */
export function interpolateTemplateString(template: string, context: Record<string, any>): string {
  if (!template) return '';
  return template.replace(/\{\s*([a-zA-Z_$][a-zA-Z0-9_$.]*)\s*\}/g, (match, exprKey) => {
    const val = evaluateSvelteExpression(exprKey, context);
    return val !== undefined && val !== null ? String(val) : '';
  });
}

export type DOMDependencyKind = 'TEXT' | 'PROPERTY' | 'CLASS' | 'BINDING' | 'CONDITIONAL';

export interface DOMDependencyInfo {
  domNodeId: string;
  kind: DOMDependencyKind;
  template?: string;
  propName?: string;
  className?: string;
  expression?: string;
  dependencies: string[];
  thenNode?: any;
  elseNode?: any;
  currentBranch?: 'then' | 'else';
  branchRenderer?: (branch: 'then' | 'else', context: Record<string, any>) => any;
}

export interface ReactiveDeclarationInfo {
  name: string;
  expression: string;
  dependencies: string[];
  currentValue?: any;
}

export interface StateDeclarationInfo {
  name: string;
  initialValue: any;
  currentValue?: any;
}

export interface SvelteStateUpdateResult {
  updatedState: Record<string, any>;
  recomputedReactive: Record<string, any>;
  changedVariables: string[];
  affectedDomNodeIds: string[];
  patches: PatchOperation[];
}

/**
 * Svelte-LM Reactive Dependency Graph
 * Tracks deterministic dependencies between State -> Reactive Declarations -> DOM Nodes.
 */
export class SvelteReactivityGraph {
  public componentName: string;
  public instancePath: string;

  public stateMap: Map<string, StateDeclarationInfo> = new Map();
  public reactiveMap: Map<string, ReactiveDeclarationInfo> = new Map();
  public domDependencies: Map<string, DOMDependencyInfo> = new Map(); // domNodeId -> DOMDependencyInfo

  // Adjacency maps for deterministic traversal
  private varToReactiveDependents: Map<string, Set<string>> = new Map(); // varName -> reactiveNames
  private varToDOMDependents: Map<string, Set<string>> = new Map(); // varName -> domNodeIds

  constructor(componentName: string, instancePath: string = `svelte-root-${componentName}_0`) {
    this.componentName = componentName;
    this.instancePath = instancePath;
  }

  public addState(name: string, initialValue: any): this {
    this.stateMap.set(name, {
      name,
      initialValue,
      currentValue: initialValue,
    });
    return this;
  }

  public addReactive(name: string, expression: string, explicitDeps?: string[]): this {
    const knownVars = Array.from(this.stateMap.keys()).concat(Array.from(this.reactiveMap.keys()));
    const dependencies = explicitDeps || extractExpressionDependencies(expression, knownVars);

    this.reactiveMap.set(name, {
      name,
      expression,
      dependencies,
    });

    for (const dep of dependencies) {
      if (!this.varToReactiveDependents.has(dep)) {
        this.varToReactiveDependents.set(dep, new Set());
      }
      this.varToReactiveDependents.get(dep)!.add(name);
    }

    return this;
  }

  public registerDOMDependency(info: DOMDependencyInfo): this {
    this.domDependencies.set(info.domNodeId, info);

    for (const dep of info.dependencies) {
      if (!this.varToDOMDependents.has(dep)) {
        this.varToDOMDependents.set(dep, new Set());
      }
      this.varToDOMDependents.get(dep)!.add(info.domNodeId);
    }

    return this;
  }

  /**
   * Builds the initial context and evaluates all reactive declarations in topological dependency order.
   */
  public computeInitialContext(props: Record<string, any> = {}): Record<string, any> {
    const context: Record<string, any> = { ...props };

    for (const [name, stateInfo] of this.stateMap.entries()) {
      context[name] = stateInfo.currentValue !== undefined ? stateInfo.currentValue : stateInfo.initialValue;
    }

    const reactiveOrder = this.getTopologicalReactiveOrder();
    for (const rName of reactiveOrder) {
      const rInfo = this.reactiveMap.get(rName);
      if (rInfo) {
        const val = evaluateSvelteExpression(rInfo.expression, context);
        rInfo.currentValue = val;
        context[rName] = val;
      }
    }

    return context;
  }

  /**
   * Topological sort of reactive declarations based on their dependencies.
   */
  public getTopologicalReactiveOrder(): string[] {
    const visited = new Set<string>();
    const order: string[] = [];
    const visiting = new Set<string>();

    const visit = (name: string) => {
      if (visited.has(name)) return;
      if (visiting.has(name)) {
        // Cyclic dependency detected, break cycle
        return;
      }
      visiting.add(name);
      const rInfo = this.reactiveMap.get(name);
      if (rInfo) {
        for (const dep of rInfo.dependencies) {
          if (this.reactiveMap.has(dep)) {
            visit(dep);
          }
        }
      }
      visiting.delete(name);
      visited.add(name);
      order.push(name);
    };

    for (const name of this.reactiveMap.keys()) {
      visit(name);
    }

    return order;
  }

  /**
   * Reactively update a state variable, recompute dependent reactive variables in order,
   * identify affected DOM nodes, and generate pinpoint PatchOperations.
   */
  public updateState(
    stateName: string,
    newValue: any,
    currentContext: Record<string, any>
  ): SvelteStateUpdateResult {
    const updatedState = { ...currentContext, [stateName]: newValue };
    const stateInfo = this.stateMap.get(stateName);
    if (stateInfo) {
      stateInfo.currentValue = newValue;
    }

    const changedVariables = [stateName];
    const recomputedReactive: Record<string, any> = {};

    // 1. Find all affected reactive declarations (topologically ordered)
    const affectedReactiveSet = new Set<string>();
    const queue = [stateName];

    while (queue.length > 0) {
      const current = queue.shift()!;
      const dependents = this.varToReactiveDependents.get(current);
      if (dependents) {
        for (const dep of dependents) {
          if (!affectedReactiveSet.has(dep)) {
            affectedReactiveSet.add(dep);
            queue.push(dep);
          }
        }
      }
    }

    const topoOrder = this.getTopologicalReactiveOrder().filter((r) => affectedReactiveSet.has(r));

    // 2. Recompute affected reactive declarations
    for (const rName of topoOrder) {
      const rInfo = this.reactiveMap.get(rName);
      if (rInfo) {
        const newVal = evaluateSvelteExpression(rInfo.expression, updatedState);
        rInfo.currentValue = newVal;
        updatedState[rName] = newVal;
        recomputedReactive[rName] = newVal;
        changedVariables.push(rName);
      }
    }

    // 3. Find all affected DOM nodes
    const affectedDomNodeIds = new Set<string>();
    for (const vName of changedVariables) {
      const domDeps = this.varToDOMDependents.get(vName);
      if (domDeps) {
        for (const domId of domDeps) {
          affectedDomNodeIds.add(domId);
        }
      }
    }

    // 4. Generate pinpoint DOM patches for ONLY the affected nodes
    const patches: PatchOperation[] = [];

    for (const domId of affectedDomNodeIds) {
      const depInfo = this.domDependencies.get(domId);
      if (!depInfo) continue;

      switch (depInfo.kind) {
        case 'TEXT': {
          const newText = interpolateTemplateString(depInfo.template || '', updatedState);
          patches.push({
            operation: PatchOperationType.UPDATE_TEXT,
            nodeId: domId,
            payload: {
              value: newText,
              text: newText,
            },
          });
          break;
        }

        case 'PROPERTY': {
          if (depInfo.propName) {
            const val = evaluateSvelteExpression(depInfo.expression || '', updatedState);
            patches.push({
              operation: PatchOperationType.SET_ATTRIBUTE,
              nodeId: domId,
              payload: {
                name: depInfo.propName,
                value: val,
              },
            });
          }
          break;
        }

        case 'CLASS': {
          if (depInfo.className && depInfo.expression) {
            const isActive = Boolean(evaluateSvelteExpression(depInfo.expression, updatedState));
            patches.push({
              operation: PatchOperationType.SET_ATTRIBUTE,
              nodeId: domId,
              payload: {
                className: depInfo.className,
                active: isActive,
              },
            });
          }
          break;
        }

        case 'BINDING': {
          if (depInfo.propName && depInfo.expression) {
            const val = updatedState[depInfo.expression];
            patches.push({
              operation: PatchOperationType.SET_ATTRIBUTE,
              nodeId: domId,
              payload: {
                name: depInfo.propName,
                value: val,
              },
            });
          }
          break;
        }

        case 'CONDITIONAL': {
          if (depInfo.expression) {
            const isTruthy = Boolean(evaluateSvelteExpression(depInfo.expression, updatedState));
            const targetBranch = isTruthy ? 'then' : 'else';
            if (depInfo.currentBranch !== targetBranch) {
              depInfo.currentBranch = targetBranch;
              let branchAST: any = null;
              if (typeof depInfo.branchRenderer === 'function') {
                branchAST = depInfo.branchRenderer(targetBranch, updatedState);
              } else {
                branchAST = isTruthy ? depInfo.thenNode : depInfo.elseNode;
              }

              if (branchAST) {
                patches.push({
                  operation: PatchOperationType.REPLACE_NODE,
                  nodeId: depInfo.domNodeId,
                  payload: serializeASTNode(branchAST),
                });
              }
            }
          }
          break;
        }
      }
    }

    return {
      updatedState,
      recomputedReactive,
      changedVariables,
      affectedDomNodeIds: Array.from(affectedDomNodeIds),
      patches,
    };
  }

  /**
   * Serialize graph for debugging and inspector visualization.
   */
  public toJSON(): Record<string, any> {
    return {
      componentName: this.componentName,
      instancePath: this.instancePath,
      state: Array.from(this.stateMap.values()),
      reactive: Array.from(this.reactiveMap.values()),
      domDependencies: Array.from(this.domDependencies.values()),
      edges: {
        varToReactive: Object.fromEntries(
          Array.from(this.varToReactiveDependents.entries()).map(([k, v]) => [k, Array.from(v)])
        ),
        varToDOM: Object.fromEntries(
          Array.from(this.varToDOMDependents.entries()).map(([k, v]) => [k, Array.from(v)])
        ),
      },
    };
  }
}
