import { ASTFactory } from '../ast/factory';
import { ASTNode, LiteralNode, PropertyNode, RootNode } from '../ast/nodes';
import { ASTNodeKind, SourceLocation } from '../ast/types';
import { JSNodeKind, JSProgramNode, JSUnitNode } from '../interpreters/js-lm/ast';
import {
  evaluateSvelteExpression,
  extractExpressionDependencies,
  extractTemplateInterpolations,
  interpolateTemplateString,
} from '../interpreters/svelte-lm/reactivity';
import {
  DOMDependencyKind,
  UIIRBindingNode,
  UIIRComponentDeclarationNode,
  UIIRComponentInstanceNode,
  UIIRConditionalNode,
  UIIRDerivedDeclarationNode,
  UIIRElementNode,
  UIIREventNode,
  UIIRFragmentNode,
  UIIRListNode,
  UIIRNode,
  UIIRNodeKind,
  UIIRProgramNode,
  UIIRSlotNode,
  UIIRStateDeclarationNode,
  UIIRTextNode,
  UIReactivityDefinition,
  UIReconcilerMetrics,
} from './types';

const defaultLoc: SourceLocation = {
  startLine: 1,
  startColumn: 1,
  startOffset: 0,
  endLine: 1,
  endColumn: 1,
  endOffset: 0,
};

let jsUnitCounter = 0;

export function resetCommonJSUnitCounter(): void {
  jsUnitCounter = 0;
}

export function getCommonJSUnitId(prefix: string, disambiguator?: string): string {
  const suffix = disambiguator ? `_${disambiguator}` : `_${++jsUnitCounter}`;
  return `${prefix}${suffix}`;
}

export interface CommonUIReconciliationResult {
  domAST: RootNode;
  jsProgram: JSProgramNode;
  reactivityDefinitions: Map<string, UIReactivityDefinition>;
  metrics: UIReconcilerMetrics;
}

/**
 * Common UI Reconciler
 * Lowers Common UI IR into canonical Leveonas DOM AST and serializable Runtime IR.
 */
export class CommonUIReconciler {
  private program: UIIRProgramNode;
  private componentMap: Map<string, UIIRComponentDeclarationNode> = new Map();
  private jsUnits: JSUnitNode[] = [];
  private reactivityDefinitions: Map<string, UIReactivityDefinition> = new Map();
  private componentState: Map<string, Record<string, any>> = new Map();

  constructor(program: UIIRProgramNode) {
    this.program = program;
    for (const comp of program.components) {
      this.componentMap.set(comp.name, comp);
    }
  }

  public reconcile(rootComponentName?: string): CommonUIReconciliationResult {
    const startTime = Date.now();
    this.jsUnits = [];
    this.reactivityDefinitions = new Map();
    this.componentState = new Map();

    const targetRoot = rootComponentName || this.program.rootComponent || this.program.components[0]?.name || 'App';
    const rootDecl = this.componentMap.get(targetRoot) || (this.program.components.length > 0 ? this.program.components[0] : undefined);

    const rootDomNode = ASTFactory.createComponent(ASTNodeKind.Root, defaultLoc) as RootNode;
    rootDomNode.id = 'leveonas-root';

    if (!rootDecl) {
      return {
        domAST: rootDomNode,
        jsProgram: {
          id: 'leveonas-js-program',
          kind: JSNodeKind.Program,
          units: [],
        },
        reactivityDefinitions: this.reactivityDefinitions,
        metrics: {
          componentInstancesCount: 0,
          totalNodesCount: 1,
          stateCount: 0,
          derivedCount: 0,
          domDependenciesCount: 0,
          reconciliationTimeMs: Date.now() - startTime,
        },
      };
    }

    let instanceCount = 0;
    let totalNodesCount = 1;
    let totalStateCount = 0;
    let totalDerivedCount = 0;
    let totalDomDependenciesCount = 0;

    const renderComponentInstance = (
      decl: UIIRComponentDeclarationNode,
      parentPath: string,
      props: Record<string, any> = {},
      slotChildren: UIIRNode[] = [],
      index: number = 0
    ): ASTNode[] => {
      instanceCount++;
      const instancePath = `${parentPath}-${decl.name}_${index}`;

      const stateObj: Record<string, any> = {};
      for (const s of decl.stateDeclarations) {
        stateObj[s.stateName] = s.initialValue;
        totalStateCount++;
      }

      const derivedObj: Record<string, { expression: string; dependencies: string[] }> = {};
      for (const d of decl.derivedDeclarations) {
        derivedObj[d.derivedName] = {
          expression: d.expression,
          dependencies: d.dependencies,
        };
        totalDerivedCount++;
      }

      const reactivityDef: UIReactivityDefinition = {
        componentName: decl.name,
        instancePath,
        state: stateObj,
        derived: derivedObj,
        domDependencies: {},
        edges: {
          varToDerived: {},
          varToDOM: {},
        },
      };

      // Build initial variable-to-derived edges
      for (const [dName, dInfo] of Object.entries(derivedObj)) {
        for (const dep of dInfo.dependencies) {
          if (!reactivityDef.edges.varToDerived[dep]) {
            reactivityDef.edges.varToDerived[dep] = [];
          }
          if (!reactivityDef.edges.varToDerived[dep].includes(dName)) {
            reactivityDef.edges.varToDerived[dep].push(dName);
          }
        }
      }

      // Compute initial context
      const mergedContext: Record<string, any> = { ...props, ...stateObj };

      // Topologically compute derived values
      for (const [dName, dInfo] of Object.entries(derivedObj)) {
        const val = evaluateSvelteExpression(dInfo.expression, mergedContext);
        mergedContext[dName] = val;
      }

      this.componentState.set(instancePath, mergedContext);
      this.reactivityDefinitions.set(instancePath, reactivityDef);

      const domNodes: ASTNode[] = [];
      for (let i = 0; i < decl.body.length; i++) {
        const childNode = decl.body[i];
        const rendered = renderUINode(
          childNode,
          instancePath,
          instancePath,
          i,
          decl.name,
          mergedContext,
          slotChildren,
          reactivityDef
        );
        domNodes.push(...rendered);
      }

      // Emit serializable state registration unit with populated domDependencies
      if (decl.stateDeclarations.length > 0 || decl.derivedDeclarations.length > 0) {
        const stateUnitId = getCommonJSUnitId('ui_state', instancePath);
        const stateCode = `
window.__leveonas_state__ = window.__leveonas_state__ || {};
window.__leveonas_state__[${JSON.stringify(instancePath)}] = window.__leveonas_state__[${JSON.stringify(
          instancePath
        )}] || ${JSON.stringify(stateObj)};
if (window.__leveonas_runtime__ && typeof window.__leveonas_runtime__.registerReactivity === 'function') {
  window.__leveonas_runtime__.registerReactivity(${JSON.stringify(instancePath)}, ${JSON.stringify(reactivityDef)});
}
`.trim();

        this.jsUnits.push({
          id: stateUnitId,
          kind: JSNodeKind.Unit,
          unitKind: 'Variable',
          code: stateCode,
          rawCode: stateCode,
          isComplete: true,
        });
      }

      return domNodes;
    };

    const registerDOMDep = (
      reactivityDef: UIReactivityDefinition,
      domId: string,
      kind: DOMDependencyKind,
      dependencies: string[],
      extra: Partial<any> = {}
    ) => {
      totalDomDependenciesCount++;
      reactivityDef.domDependencies[domId] = {
        domNodeId: domId,
        kind,
        dependencies,
        ...extra,
      };

      for (const dep of dependencies) {
        if (!reactivityDef.edges.varToDOM[dep]) {
          reactivityDef.edges.varToDOM[dep] = [];
        }
        if (!reactivityDef.edges.varToDOM[dep].includes(domId)) {
          reactivityDef.edges.varToDOM[dep].push(domId);
        }
      }
    };

    const renderUINode = (
      node: UIIRNode,
      compInstancePath: string,
      parentPath: string,
      index: number,
      ownerComponent: string,
      context: Record<string, any>,
      slotChildren: UIIRNode[],
      reactivityDef: UIReactivityDefinition,
      keyOverride?: string
    ): ASTNode[] => {
      if (!node) return [];
      totalNodesCount++;

      switch (node.kind) {
        case UIIRNodeKind.Text: {
          const txt = node as UIIRTextNode;
          const loc = txt.sourceLocation || defaultLoc;
          const keySuffix = keyOverride ? `-k_${keyOverride}` : '';
          const textId = `${parentPath}-txt_${index}${keySuffix}`;

          const renderedText = interpolateTemplateString(txt.value, context);
          const dependencies =
            txt.templateDependencies && txt.templateDependencies.length > 0
              ? txt.templateDependencies
              : extractTemplateInterpolations(txt.value);

          if (dependencies.length > 0) {
            registerDOMDep(reactivityDef, textId, 'TEXT', dependencies, {
              template: txt.value,
            });
          }

          const lit = ASTFactory.createLiteral(renderedText, `"${renderedText}"`, loc);
          lit.id = textId;
          return [lit];
        }

        case UIIRNodeKind.Slot: {
          const slot = node as UIIRSlotNode;
          const targets = slotChildren && slotChildren.length > 0 ? slotChildren : slot.fallbackChildren;
          const res: ASTNode[] = [];
          for (let i = 0; i < targets.length; i++) {
            res.push(
              ...renderUINode(
                targets[i],
                compInstancePath,
                `${parentPath}-slot_${index}`,
                i,
                ownerComponent,
                context,
                [],
                reactivityDef
              )
            );
          }
          return res;
        }

        case UIIRNodeKind.Fragment: {
          const frag = node as UIIRFragmentNode;
          const res: ASTNode[] = [];
          for (let i = 0; i < frag.children.length; i++) {
            res.push(
              ...renderUINode(
                frag.children[i],
                compInstancePath,
                `${parentPath}-frag_${index}`,
                i,
                ownerComponent,
                context,
                slotChildren,
                reactivityDef
              )
            );
          }
          return res;
        }

        case UIIRNodeKind.Conditional: {
          const cond = node as UIIRConditionalNode;
          let isTruthy = false;
          try {
            isTruthy = Boolean(evaluateSvelteExpression(cond.conditionExpr, context));
          } catch {
            isTruthy = true;
          }

          const condDeps =
            cond.dependencies && cond.dependencies.length > 0
              ? cond.dependencies
              : extractExpressionDependencies(cond.conditionExpr);
          const condContainerId = `${parentPath}-cond_${index}`;

          const activeBranch = isTruthy ? cond.thenBranch : cond.elseBranch;
          const renderedBranch = activeBranch
            ? renderUINode(
                activeBranch,
                compInstancePath,
                `${condContainerId}-${isTruthy ? 'then' : 'else'}`,
                0,
                ownerComponent,
                context,
                slotChildren,
                reactivityDef
              )
            : [];

          const activeNode = renderedBranch[0] || null;

          if (condDeps.length > 0 && activeNode) {
            registerDOMDep(reactivityDef, activeNode.id, 'CONDITIONAL', condDeps, {
              expression: cond.conditionExpr,
              currentBranch: isTruthy ? 'then' : 'else',
              thenBranch: cond.thenBranch,
              elseBranch: cond.elseBranch,
              containerId: parentPath,
              parentPath: condContainerId,
              compInstancePath,
              ownerComponent,
              index: 0,
            });
          }

          return activeNode ? [activeNode] : [];
        }

        case UIIRNodeKind.List: {
          const list = node as UIIRListNode;
          const items = context[list.arrayExpr] || evaluateSvelteExpression(list.arrayExpr, context) || [];
          const res: ASTNode[] = [];
          const renderedKeys: string[] = [];

          if (Array.isArray(items)) {
            for (let i = 0; i < items.length; i++) {
              const item = items[i];
              let itemKey: any = i;

              if (list.keyExpr) {
                const keyScope = typeof item === 'object' && item !== null
                  ? { ...item, [list.itemVar]: item, index: i }
                  : { [list.itemVar]: item, index: i };
                itemKey = evaluateSvelteExpression(list.keyExpr, keyScope) ?? i;
              } else if (typeof item === 'string' || typeof item === 'number') {
                itemKey = item;
              } else if (item && typeof item === 'object' && ('id' in item || 'key' in item)) {
                itemKey = item.id ?? item.key;
              }

              const strKey = String(itemKey);
              renderedKeys.push(strKey);

              const itemContext = typeof item === 'object' && item !== null
                ? { ...context, ...item, [list.itemVar]: item, index: i, [list.indexVar || 'index']: i }
                : { ...context, [list.itemVar]: item, index: i, [list.indexVar || 'index']: i };

              const renderedItemNodes = renderUINode(
                list.body,
                compInstancePath,
                parentPath,
                i,
                ownerComponent,
                itemContext,
                slotChildren,
                reactivityDef,
                strKey
              );
              res.push(...renderedItemNodes);
            }
          }

          // Register LIST dependency
          const listDeps = list.dependencies && list.dependencies.length > 0 ? list.dependencies : [list.arrayExpr];
          const listDepId = `${parentPath}-list_${index}`;
          registerDOMDep(reactivityDef, listDepId, 'LIST', listDeps, {
            arrayExpr: list.arrayExpr,
            itemVar: list.itemVar,
            indexVar: list.indexVar || 'index',
            keyExpr: list.keyExpr,
            body: list.body,
            containerId: parentPath,
            parentPath,
            compInstancePath,
            ownerComponent,
            renderedKeys,
          });

          return res;
        }

        case UIIRNodeKind.ComponentInstance: {
          const compInst = node as UIIRComponentInstanceNode;
          const targetDecl = this.componentMap.get(compInst.componentName);
          if (targetDecl) {
            const propMap: Record<string, any> = {};
            for (const p of compInst.props) {
              propMap[p.name] = p.value;
            }
            return renderComponentInstance(
              targetDecl,
              parentPath,
              propMap,
              compInst.children,
              index
            );
          }
          const loc = compInst.sourceLocation || defaultLoc;
          const genericComp = ASTFactory.createComponent(
            ASTNodeKind.Container,
            loc,
            [],
            [],
            compInst.componentName
          ) as ASTNode;
          genericComp.id = `${parentPath}-${compInst.componentName}_${index}`;
          return [genericComp];
        }

        case UIIRNodeKind.Element: {
          const elem = node as UIIRElementNode;
          const loc = elem.sourceLocation || defaultLoc;
          const canonicalTag = elem.tag.toLowerCase();

          const explicitIdProp = elem.props.find((p) => p.name === 'id');
          const keySuffix = keyOverride ? `-k_${keyOverride}` : '';
          const elemId = explicitIdProp
            ? String(explicitIdProp.value)
            : (keyOverride ? `${parentPath}-${canonicalTag}${keySuffix}` : `${parentPath}-${canonicalTag}_${index}`);

          const properties: PropertyNode[] = [];
          let hasExplicitId = false;

          if (keyOverride) {
            const keyLit = ASTFactory.createLiteral(keyOverride, JSON.stringify(keyOverride), loc);
            properties.push(ASTFactory.createProperty('key', keyLit, loc));
          }

          for (const prop of elem.props) {
            if (prop.name === 'id') {
              hasExplicitId = true;
            }
            const lit = ASTFactory.createLiteral(prop.value, JSON.stringify(prop.value), loc);
            properties.push(ASTFactory.createProperty(prop.name, lit, loc));
          }

          if (!hasExplicitId) {
            const idLit = ASTFactory.createLiteral(elemId, `"${elemId}"`, loc);
            properties.unshift(ASTFactory.createProperty('id', idLit, loc));
          }

          // Handle Events
          if (elem.events && elem.events.length > 0) {
            for (const evt of elem.events) {
              const domEvent = evt.eventName.toLowerCase().replace(/^on/, '');
              const selector = `#${elemId}`;

              let rawHandler = evt.handler.trim();
              let targetVar = evt.targetVar || 'count';
              let valComputation = evt.computation || '(s.count || 0) + 1';
              let isFunctionCall = Boolean(evt.isFunctionCall);

              if (rawHandler.startsWith('set(') && rawHandler.endsWith(')')) {
                const inner = rawHandler.slice(4, -1);
                const parts = inner.split(',').map((s) => s.trim());
                targetVar = parts[0];
                valComputation = parts.slice(1).join(',');
              } else if (rawHandler.includes('+=')) {
                const parts = rawHandler.split('+=').map((s) => s.trim());
                targetVar = parts[0];
                valComputation = `(s[${JSON.stringify(targetVar)}] || 0) + (${parts[1] || 1})`;
              } else if (rawHandler.includes('++')) {
                targetVar = rawHandler.replace('++', '').trim();
                valComputation = `(s[${JSON.stringify(targetVar)}] || 0) + 1`;
              } else if (rawHandler.includes('-=')) {
                const parts = rawHandler.split('-=').map((s) => s.trim());
                targetVar = parts[0];
                valComputation = `(s[${JSON.stringify(targetVar)}] || 0) - (${parts[1] || 1})`;
              } else if (rawHandler.includes('--')) {
                targetVar = rawHandler.replace('--', '').trim();
                valComputation = `(s[${JSON.stringify(targetVar)}] || 0) - 1`;
              } else if (rawHandler.includes('=')) {
                const parts = rawHandler.split('=').map((s) => s.trim());
                targetVar = parts[0];
                valComputation = parts.slice(1).join('=');
              } else if (rawHandler !== 'increment') {
                isFunctionCall = true;
              }

              const jsBody = isFunctionCall
                ? `
if (typeof window[${JSON.stringify(rawHandler)}] === 'function') {
  window[${JSON.stringify(rawHandler)}](event, target);
} else {
  window.__leveonas_state__ = window.__leveonas_state__ || {};
  window.__leveonas_state__[${JSON.stringify(compInstancePath)}] = window.__leveonas_state__[${JSON.stringify(
                    compInstancePath
                  )}] || {};
  const s = window.__leveonas_state__[${JSON.stringify(compInstancePath)}];
  const nextVal = (${valComputation});
  s[${JSON.stringify(targetVar)}] = nextVal;
  if (window.__leveonas_runtime__ && typeof window.__leveonas_runtime__.updateState === 'function') {
    window.__leveonas_runtime__.updateState(${JSON.stringify(compInstancePath)}, ${JSON.stringify(targetVar)}, nextVal);
  }
}
`.trim()
                : `
window.__leveonas_state__ = window.__leveonas_state__ || {};
window.__leveonas_state__[${JSON.stringify(compInstancePath)}] = window.__leveonas_state__[${JSON.stringify(
                    compInstancePath
                  )}] || {};
const s = window.__leveonas_state__[${JSON.stringify(compInstancePath)}];
const nextVal = (${valComputation});
s[${JSON.stringify(targetVar)}] = nextVal;
if (window.__leveonas_runtime__ && typeof window.__leveonas_runtime__.updateState === 'function') {
  window.__leveonas_runtime__.updateState(${JSON.stringify(compInstancePath)}, ${JSON.stringify(targetVar)}, nextVal);
}
`.trim();

              const jsEvtId = getCommonJSUnitId(`ui_evt_${domEvent}`, elemId);
              const jsCode = `
window.__leveonas_runtime__.on(${JSON.stringify(domEvent)}, ${JSON.stringify(selector)}, function(event, target) {
  ${jsBody}
});
`.trim();

              this.jsUnits.push({
                id: jsEvtId,
                kind: JSNodeKind.Unit,
                unitKind: 'EventHandler',
                code: jsCode,
                rawCode: jsCode,
                isComplete: true,
                meta: {
                  eventName: domEvent,
                  targetSelector: selector,
                },
                details: {
                  id: jsEvtId,
                  kind: JSNodeKind.EventHandler,
                  eventName: domEvent,
                  targetSelector: selector,
                  handlerCode: jsBody,
                  sourceLocation: evt.sourceLocation,
                },
              });
            }
          }

          // Handle Bindings
          if (elem.bindings && elem.bindings.length > 0) {
            for (const b of elem.bindings) {
              const isChecked = b.bindingType === 'checked';
              const bindingProp = isChecked ? 'checked' : 'value';
              const eventType = isChecked ? 'change' : 'input';
              const currentVal = context[b.stateVar] ?? (isChecked ? false : '');

              registerDOMDep(reactivityDef, elemId, 'BINDING', [b.stateVar], {
                propName: bindingProp,
                expression: b.stateVar,
              });

              const valLit = ASTFactory.createLiteral(currentVal, JSON.stringify(currentVal), loc);
              properties.push(ASTFactory.createProperty(bindingProp, valLit, loc));

              const jsEvtId = getCommonJSUnitId(`ui_bind_${eventType}`, elemId);
              const jsCode = `
window.__leveonas_runtime__.on(${JSON.stringify(eventType)}, "#${elemId}", function(event, target) {
  const nextVal = ${isChecked ? 'target.checked' : 'target.value'};
  window.__leveonas_state__ = window.__leveonas_state__ || {};
  window.__leveonas_state__[${JSON.stringify(compInstancePath)}] = window.__leveonas_state__[${JSON.stringify(
                compInstancePath
              )}] || {};
  window.__leveonas_state__[${JSON.stringify(compInstancePath)}][${JSON.stringify(b.stateVar)}] = nextVal;
  if (window.__leveonas_runtime__ && typeof window.__leveonas_runtime__.updateState === 'function') {
    window.__leveonas_runtime__.updateState(${JSON.stringify(compInstancePath)}, ${JSON.stringify(b.stateVar)}, nextVal);
  }
});
`.trim();

              this.jsUnits.push({
                id: jsEvtId,
                kind: JSNodeKind.Unit,
                unitKind: 'EventHandler',
                code: jsCode,
                rawCode: jsCode,
                isComplete: true,
                meta: {
                  eventName: eventType,
                  targetSelector: `#${elemId}`,
                },
              });
            }
          }

          // Handle dynamic classes
          if (elem.dynamicClassConditions) {
            for (const [clsName, condExpr] of Object.entries(elem.dynamicClassConditions)) {
              const deps = extractExpressionDependencies(condExpr);
              if (deps.length > 0) {
                registerDOMDep(reactivityDef, elemId, 'CLASS', deps, {
                  className: clsName,
                  expression: condExpr,
                });
              }

              const isActive = Boolean(evaluateSvelteExpression(condExpr, context));
              if (isActive) {
                const classProp = properties.find((p) => p.name === 'className');
                if (classProp && classProp.value?.kind === ASTNodeKind.Literal) {
                  const existingVal = (classProp.value as LiteralNode).value;
                  (classProp.value as LiteralNode).value = `${existingVal} ${clsName}`.trim();
                } else {
                  const classLit = ASTFactory.createLiteral(clsName, `"${clsName}"`, loc);
                  properties.push(ASTFactory.createProperty('className', classLit, loc));
                }
              }
            }
          }

          // Handle dynamic styles
          if (elem.dynamicStyles) {
            for (const [styleProp, styleExpr] of Object.entries(elem.dynamicStyles)) {
              const deps = extractExpressionDependencies(styleExpr);
              if (deps.length > 0) {
                registerDOMDep(reactivityDef, elemId, 'STYLE', deps, {
                  propName: styleProp,
                  styleProp: styleProp,
                  expression: styleExpr,
                });
              }

              const initialVal = evaluateSvelteExpression(styleExpr, context);
              if (initialVal !== undefined && initialVal !== null && initialVal !== '') {
                const stylePropNode = properties.find((p) => p.name === 'style');
                if (stylePropNode && stylePropNode.value?.kind === ASTNodeKind.Literal) {
                  const existingVal = (stylePropNode.value as LiteralNode).value;
                  (stylePropNode.value as LiteralNode).value = `${existingVal}; ${styleProp}: ${initialVal}`.trim();
                } else {
                  const styleLit = ASTFactory.createLiteral(`${styleProp}: ${initialVal}`, `"${styleProp}: ${initialVal}"`, loc);
                  properties.push(ASTFactory.createProperty('style', styleLit, loc));
                }
              }
            }
          }

          const renderedChildren: ASTNode[] = [];
          for (let i = 0; i < elem.children.length; i++) {
            const child = elem.children[i];
            const childASTs = renderUINode(
              child,
              compInstancePath,
              elemId,
              i,
              ownerComponent,
              context,
              slotChildren,
              reactivityDef
            );
            renderedChildren.push(...childASTs);
          }

          const domElement = ASTFactory.createComponent(
            ASTNodeKind.GenericComponent,
            loc,
            properties,
            renderedChildren,
            canonicalTag
          ) as ASTNode;
          domElement.id = elemId;

          return [domElement];
        }

        default:
          return [];
      }
    };

    const renderedRootNodes = renderComponentInstance(rootDecl, 'ui-root');
    for (const node of renderedRootNodes) {
      rootDomNode.children.push(node);
      node.parent = rootDomNode;
    }

    const jsProgram: JSProgramNode = {
      id: 'leveonas-js-program',
      kind: JSNodeKind.Program,
      units: this.jsUnits,
    };

    return {
      domAST: rootDomNode,
      jsProgram,
      reactivityDefinitions: this.reactivityDefinitions,
      metrics: {
        componentInstancesCount: instanceCount,
        totalNodesCount,
        stateCount: totalStateCount,
        derivedCount: totalDerivedCount,
        domDependenciesCount: totalDomDependenciesCount,
        reconciliationTimeMs: Date.now() - startTime,
      },
    };
  }
}
