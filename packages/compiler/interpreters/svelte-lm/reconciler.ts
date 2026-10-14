import { ASTFactory } from '../../ast/factory';
import { ASTNode, ComponentNode, LiteralNode, PropertyNode, RootNode } from '../../ast/nodes';
import { ASTNodeKind, SourceLocation } from '../../ast/types';
import {
  JSNodeKind,
  JSProgramNode,
  JSUnitNode,
  getJSEventHandlerId,
  getJSProgramId,
  getJSUnitId,
} from '../js-lm/ast';
import {
  SvelteComponentDeclarationNode,
  SvelteComponentInstanceNode,
  SvelteConditionalNode,
  SvelteEachNode,
  SvelteElementNode,
  SvelteFragmentNode,
  SvelteNodeKind,
  SvelteProgramNode,
  SveltePropDeclarationNode,
  SveltePropNode,
  SvelteReactiveDeclarationNode,
  SvelteSlotNode,
  SvelteStateDeclarationNode,
  SvelteTextNode,
  SvelteUINode,
  getSvelteElementId,
  getSvelteEventHandlerId,
} from './ast';
import {
  DOMDependencyInfo,
  SvelteReactivityGraph,
  SvelteStateUpdateResult,
  evaluateSvelteExpression,
  extractExpressionDependencies,
  extractTemplateInterpolations,
  interpolateTemplateString,
} from './reactivity';
import {
  TAG_TO_AST_KIND,
  getDOMEventNameFromSvelteEvent,
  isIntrinsicTag,
  isSvelteEventProp,
  resolveSvelteElementTag,
  resolveSveltePropName,
} from './vocabulary';

export interface SvelteReconciliationResult {
  domAST: RootNode;
  jsProgram: JSProgramNode;
  componentInstancesCount: number;
  reactivityGraphs: Map<string, SvelteReactivityGraph>; // instancePath -> SvelteReactivityGraph
}

export class SvelteReconciler {
  private program: SvelteProgramNode;
  private componentMap: Map<string, SvelteComponentDeclarationNode>;
  private componentState: Map<string, any>; // instancePath -> state object
  private reactivityGraphs: Map<string, SvelteReactivityGraph> = new Map();
  private jsUnits: JSUnitNode[] = [];
  private eventCounter: number = 0;

  constructor(program: SvelteProgramNode, initialStates?: Record<string, any>) {
    this.program = program;
    this.componentMap = new Map();
    for (const comp of program.components) {
      this.componentMap.set(comp.name, comp);
    }
    this.componentState = new Map(initialStates ? Object.entries(initialStates) : []);
  }

  /**
   * Get the reactivity graph for a component instance.
   */
  public getReactivityGraph(instancePath: string): SvelteReactivityGraph | undefined {
    return this.reactivityGraphs.get(instancePath);
  }

  /**
   * Directly compute pinpoint DOM patch operations for a state change using the Reactivity Graph.
   */
  public computeStateUpdate(
    instancePath: string,
    stateName: string,
    newValue: any,
    currentContext?: Record<string, any>
  ): SvelteStateUpdateResult | null {
    const graph = this.reactivityGraphs.get(instancePath);
    if (!graph) return null;

    const context = currentContext || graph.computeInitialContext(this.componentState.get(instancePath) || {});
    return graph.updateState(stateName, newValue, context);
  }

  /**
   * Reconcile the Svelte component program tree into a Leveonas DOM RootNode, JS runtime units,
   * and fine-grained Reactivity Graphs.
   */
  public reconcile(rootComponentName?: string): SvelteReconciliationResult {
    this.jsUnits = [];
    this.eventCounter = 0;
    this.reactivityGraphs.clear();

    const rootName =
      rootComponentName ||
      (this.program.components.some((c) => c.name === 'App')
        ? 'App'
        : (this.program.rootComponent || (this.program.components[0]?.name ?? 'App')));
    const rootDecl = this.componentMap.get(rootName) || this.program.components[0];

    const defaultLoc: SourceLocation = {
      startLine: 1,
      startColumn: 1,
      startOffset: 0,
      endLine: 1,
      endColumn: 1,
      endOffset: 0,
    };

    const rootDomNode = ASTFactory.createComponent(ASTNodeKind.Root, defaultLoc) as RootNode;
    rootDomNode.id = 'leveonas-root';

    if (!rootDecl) {
      return {
        domAST: rootDomNode,
        jsProgram: {
          id: getJSProgramId(),
          kind: JSNodeKind.Program,
          units: [],
        },
        componentInstancesCount: 0,
        reactivityGraphs: this.reactivityGraphs,
      };
    }

    let instanceCount = 0;

    const renderComponentInstance = (
      decl: SvelteComponentDeclarationNode,
      parentPath: string,
      props: Record<string, any> = {},
      slotChildren: SvelteUINode[] = [],
      index: number = 0
    ): ASTNode[] => {
      instanceCount++;
      const instancePath = `${parentPath}-${decl.name}_${index}`;

      // Create explicit Reactivity Graph for this component instance
      const graph = new SvelteReactivityGraph(decl.name, instancePath);

      // Register state declarations in the graph
      for (const s of decl.stateDeclarations) {
        const initialVal = this.componentState.has(instancePath) && s.stateName in this.componentState.get(instancePath)
          ? this.componentState.get(instancePath)[s.stateName]
          : s.initialValue;
        graph.addState(s.stateName, initialVal);
      }

      // Register reactive declarations in the graph
      for (const r of decl.reactiveDeclarations) {
        graph.addReactive(r.reactiveName, r.expression, r.dependencies);
      }

      this.reactivityGraphs.set(instancePath, graph);

      // Register graph in global runtime if in browser or runtime environment
      if (typeof window !== 'undefined') {
        (window as any).__leveonas_reactivity__ = (window as any).__leveonas_reactivity__ || {};
        (window as any).__leveonas_reactivity__[instancePath] = graph;
      }

      // Compute initial context in dependency order
      const mergedContext = graph.computeInitialContext(props);
      this.componentState.set(instancePath, mergedContext);

      // Emit JS state store unit if state or reactive declarations exist
      if (decl.stateDeclarations.length > 0 || decl.reactiveDeclarations.length > 0) {
        const stateUnitId = getJSUnitId('svelte_state', instancePath);
        const stateInitialValues: Record<string, any> = {};
        for (const s of decl.stateDeclarations) {
          stateInitialValues[s.stateName] = s.initialValue;
        }

        const stateCode = `
window.__leveonas_state__ = window.__leveonas_state__ || {};
window.__leveonas_state__[${JSON.stringify(instancePath)}] = window.__leveonas_state__[${JSON.stringify(
          instancePath
        )}] || ${JSON.stringify(stateInitialValues)};
`.trim();

        this.jsUnits.push({
          id: stateUnitId,
          kind: JSNodeKind.Unit,
          unitKind: 'Variable',
          code: stateCode,
          rawCode: stateCode,
          isComplete: true,
        });

        // Emit safe reactive computations runner
        for (const r of decl.reactiveDeclarations) {
          const compUnitId = getJSUnitId('svelte_reactive', `${instancePath}_${r.reactiveName}`);
          const compCode = `
window.__leveonas_reactive__ = window.__leveonas_reactive__ || {};
window.__leveonas_reactive__[${JSON.stringify(`${instancePath}_${r.reactiveName}`)}] = function() {
  const s = window.__leveonas_state__[${JSON.stringify(instancePath)}] || {};
  return (function(${Object.keys(stateInitialValues).join(', ')}) {
    return (${r.expression});
  })(${Object.keys(stateInitialValues).map((k) => `s[${JSON.stringify(k)}]`).join(', ')});
};
`.trim();
          this.jsUnits.push({
            id: compUnitId,
            kind: JSNodeKind.Unit,
            unitKind: 'Function',
            code: compCode,
            rawCode: compCode,
            isComplete: true,
          });
        }
      }

      const domNodes: ASTNode[] = [];
      for (let i = 0; i < decl.body.length; i++) {
        const uiChild = decl.body[i];
        const childNodes = renderUINode(
          uiChild,
          instancePath,
          i,
          decl.name,
          mergedContext,
          slotChildren,
          graph
        );
        domNodes.push(...childNodes);
      }

      return domNodes;
    };

    const renderUINode = (
      node: SvelteUINode,
      parentPath: string,
      index: number,
      ownerComponent: string,
      context: Record<string, any>,
      slotChildren: SvelteUINode[],
      graph: SvelteReactivityGraph,
      keyOverride?: string
    ): ASTNode[] => {
      if (!node) return [];

      switch (node.kind) {
        case SvelteNodeKind.Text: {
          const txt = node as SvelteTextNode;
          const loc = txt.sourceLocation || defaultLoc;
          const keySuffix = keyOverride ? `-k_${keyOverride}` : '';
          const textId = `${parentPath}-txt_${index}${keySuffix}`;

          // Interpolate template expressions e.g. {count}, {double}, {item.name}
          const renderedText = interpolateTemplateString(txt.value, context);

          // Register text node dependencies in Reactivity Graph
          const dependencies = extractTemplateInterpolations(txt.value);
          if (dependencies.length > 0) {
            graph.registerDOMDependency({
              domNodeId: textId,
              kind: 'TEXT',
              template: txt.value,
              dependencies,
            });
          }

          const lit = ASTFactory.createLiteral(renderedText, `"${renderedText}"`, loc);
          lit.id = textId;
          return [lit];
        }

        case SvelteNodeKind.Slot: {
          const slot = node as SvelteSlotNode;
          if (slotChildren && slotChildren.length > 0) {
            const res: ASTNode[] = [];
            for (let i = 0; i < slotChildren.length; i++) {
              res.push(
                ...renderUINode(
                  slotChildren[i],
                  `${parentPath}-slot_${index}`,
                  i,
                  ownerComponent,
                  context,
                  [],
                  graph
                )
              );
            }
            return res;
          }
          const res: ASTNode[] = [];
          for (let i = 0; i < slot.children.length; i++) {
            res.push(
              ...renderUINode(
                slot.children[i],
                `${parentPath}-slot_fallback_${index}`,
                i,
                ownerComponent,
                context,
                [],
                graph
              )
            );
          }
          return res;
        }

        case SvelteNodeKind.Fragment: {
          const frag = node as SvelteFragmentNode;
          const res: ASTNode[] = [];
          for (let i = 0; i < frag.children.length; i++) {
            res.push(
              ...renderUINode(
                frag.children[i],
                `${parentPath}-frag_${index}`,
                i,
                ownerComponent,
                context,
                slotChildren,
                graph
              )
            );
          }
          return res;
        }

        case SvelteNodeKind.Conditional: {
          const cond = node as SvelteConditionalNode;
          let isTruthy = false;
          try {
            const evalResult = evaluateSvelteExpression(cond.conditionExpr, context);
            isTruthy = Boolean(evalResult);
          } catch {
            isTruthy = true;
          }

          const condDeps = extractExpressionDependencies(cond.conditionExpr);
          const condContainerId = `${parentPath}-cond_${index}`;

          // Pre-render then and else branches for fast swapping
          const thenRendered = renderUINode(
            cond.thenBranch,
            `${condContainerId}-then`,
            0,
            ownerComponent,
            context,
            slotChildren,
            graph
          );
          const elseRendered = cond.elseBranch
            ? renderUINode(
                cond.elseBranch,
                `${condContainerId}-else`,
                0,
                ownerComponent,
                context,
                slotChildren,
                graph
              )
            : [];

          const activeBranchNode = isTruthy ? thenRendered[0] : (elseRendered[0] || null);

          if (condDeps.length > 0 && activeBranchNode) {
            graph.registerDOMDependency({
              domNodeId: activeBranchNode.id,
              kind: 'CONDITIONAL',
              expression: cond.conditionExpr,
              dependencies: condDeps,
              thenNode: thenRendered[0],
              elseNode: elseRendered[0] || null,
              currentBranch: isTruthy ? 'then' : 'else',
              branchRenderer: (targetBranch, updatedCtx) => {
                const branchNodes = renderUINode(
                  targetBranch === 'then' ? cond.thenBranch : (cond.elseBranch || { id: `${condContainerId}-empty`, kind: SvelteNodeKind.Fragment, children: [] }),
                  `${condContainerId}-${targetBranch}`,
                  0,
                  ownerComponent,
                  updatedCtx,
                  slotChildren,
                  graph
                );
                return branchNodes[0] || null;
              },
            });
          }

          return activeBranchNode ? [activeBranchNode] : [];
        }

        case SvelteNodeKind.Each: {
          const eachNode = node as SvelteEachNode;
          const items = context[eachNode.arrayExpr] || evaluateSvelteExpression(eachNode.arrayExpr, context) || [];
          const res: ASTNode[] = [];

          if (Array.isArray(items)) {
            for (let i = 0; i < items.length; i++) {
              const item = items[i];
              let itemKey: any = i;

              if (eachNode.keyExpr) {
                const keyScope = typeof item === 'object' && item !== null
                  ? { ...item, [eachNode.itemVar]: item, index: i }
                  : { [eachNode.itemVar]: item, index: i };
                itemKey = evaluateSvelteExpression(eachNode.keyExpr, keyScope) ?? i;
              } else if (typeof item === 'string' || typeof item === 'number') {
                itemKey = item;
              } else if (item && typeof item === 'object' && ('id' in item || 'key' in item)) {
                itemKey = item.id ?? item.key;
              }

              const itemContext = typeof item === 'object' && item !== null
                ? { ...context, ...item, [eachNode.itemVar]: item, index: i, [eachNode.indexVar || 'index']: i }
                : { ...context, [eachNode.itemVar]: item, index: i, [eachNode.indexVar || 'index']: i };

              const renderedItemNodes = renderUINode(
                eachNode.body,
                `${parentPath}-each_${index}`,
                i,
                ownerComponent,
                itemContext,
                slotChildren,
                graph,
                String(itemKey)
              );
              res.push(...renderedItemNodes);
            }
          }

          return res;
        }

        case SvelteNodeKind.ComponentInstance: {
          const compInst = node as SvelteComponentInstanceNode;
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

        case SvelteNodeKind.Element: {
          const elem = node as SvelteElementNode;
          const canonicalTag = resolveSvelteElementTag(elem.tag);
          const astKind = TAG_TO_AST_KIND[canonicalTag] || ASTNodeKind.GenericComponent;
          const loc = elem.sourceLocation || defaultLoc;

          const explicitIdProp = elem.props.find((p) => p.name === 'id');
          const elemId = keyOverride
            ? getSvelteElementId(parentPath, canonicalTag, index, keyOverride)
            : (explicitIdProp ? String(explicitIdProp.value) : (elem.id || `${parentPath}-${canonicalTag}_${index}`));
          const properties: PropertyNode[] = [];
          let hasExplicitId = false;

          // Key property for keyed lists
          if (keyOverride) {
            const keyLit = ASTFactory.createLiteral(keyOverride, JSON.stringify(keyOverride), loc);
            properties.push(ASTFactory.createProperty('key', keyLit, loc));
          }

          for (const prop of elem.props) {
            const canonicalPropName = resolveSveltePropName(prop.name);

            if (isSvelteEventProp(prop.name)) {
              const domEvent = getDOMEventNameFromSvelteEvent(prop.name);
              const eventTargetSelector = `#${elemId}`;

              hasExplicitId = true;

              let rawHandler = String(prop.value).trim();
              let targetVar = 'count';
              let valComputation = '(s.count || 0) + 1';
              let isFunctionCall = false;

              if (rawHandler.startsWith('set(') && rawHandler.endsWith(')')) {
                const inner = rawHandler.slice(4, -1);
                const parts = inner.split(',').map((s) => s.trim());
                targetVar = parts[0];
                valComputation = parts.slice(1).join(',');
              } else if (rawHandler.includes('+=')) {
                const parts = rawHandler.split('+=').map(s => s.trim());
                targetVar = parts[0];
                valComputation = `(s[${JSON.stringify(targetVar)}] || 0) + (${parts[1] || 1})`;
              } else if (rawHandler.includes('++')) {
                targetVar = rawHandler.replace('++', '').trim();
                valComputation = `(s[${JSON.stringify(targetVar)}] || 0) + 1`;
              } else if (rawHandler.includes('-=')) {
                const parts = rawHandler.split('-=').map(s => s.trim());
                targetVar = parts[0];
                valComputation = `(s[${JSON.stringify(targetVar)}] || 0) - (${parts[1] || 1})`;
              } else if (rawHandler.includes('--')) {
                targetVar = rawHandler.replace('--', '').trim();
                valComputation = `(s[${JSON.stringify(targetVar)}] || 0) - 1`;
              } else if (rawHandler.includes('=')) {
                const parts = rawHandler.split('=').map(s => s.trim());
                targetVar = parts[0];
                valComputation = parts.slice(1).join('=');
              } else {
                isFunctionCall = true;
                targetVar = 'count';
                valComputation = `(s[${JSON.stringify(targetVar)}] !== undefined ? s[${JSON.stringify(targetVar)}] + 1 : 1)`;
              }

              const compInstancePath = graph.instancePath;
              const jsBody = isFunctionCall
                ? `
if (typeof window[${JSON.stringify(rawHandler)}] === 'function') {
  window[${JSON.stringify(rawHandler)}](event, target);
} else {
  window.__leveonas_state__ = window.__leveonas_state__ || {};
  window.__leveonas_state__[${JSON.stringify(compInstancePath)}] = window.__leveonas_state__[${JSON.stringify(compInstancePath)}] || {};
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
window.__leveonas_state__[${JSON.stringify(compInstancePath)}] = window.__leveonas_state__[${JSON.stringify(compInstancePath)}] || {};
const s = window.__leveonas_state__[${JSON.stringify(compInstancePath)}];
const nextVal = (${valComputation});
s[${JSON.stringify(targetVar)}] = nextVal;
if (window.__leveonas_runtime__ && typeof window.__leveonas_runtime__.updateState === 'function') {
  window.__leveonas_runtime__.updateState(${JSON.stringify(compInstancePath)}, ${JSON.stringify(targetVar)}, nextVal);
}
`.trim();

              const jsEvtId = getJSEventHandlerId(domEvent, `#${elemId}`);
              const jsCode = `
window.__leveonas_runtime__.on(${JSON.stringify(domEvent)}, ${JSON.stringify(eventTargetSelector)}, function(event, target) {
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
                  targetSelector: eventTargetSelector,
                },
                details: {
                  id: jsEvtId,
                  kind: JSNodeKind.EventHandler,
                  eventName: domEvent,
                  targetSelector: eventTargetSelector,
                  handlerCode: jsBody,
                  sourceLocation: prop.sourceLocation,
                },
              });
            } else if (prop.isBinding || canonicalPropName.startsWith('bind:')) {
              hasExplicitId = true;
              const compInstancePath = graph.instancePath;
              const bindingTarget = String(prop.value);
              const isChecked = canonicalPropName === 'bind:checked';
              const bindingProp = isChecked ? 'checked' : 'value';
              const eventType = isChecked ? 'change' : 'input';

              const currentVal = context[bindingTarget] ?? (isChecked ? false : '');

              // Register binding in Reactivity Graph
              graph.registerDOMDependency({
                domNodeId: elemId,
                kind: 'BINDING',
                propName: bindingProp,
                expression: bindingTarget,
                dependencies: [bindingTarget],
              });

              const valLit = ASTFactory.createLiteral(currentVal, JSON.stringify(currentVal), loc);
              properties.push(ASTFactory.createProperty(bindingProp, valLit, loc));

              const jsEvtId = getJSEventHandlerId(eventType, `#${elemId}`);
              const jsCode = `
window.__leveonas_runtime__.on(${JSON.stringify(eventType)}, "#${elemId}", function(event, target) {
  const nextVal = ${isChecked ? 'target.checked' : 'target.value'};
  window.__leveonas_state__ = window.__leveonas_state__ || {};
  window.__leveonas_state__[${JSON.stringify(compInstancePath)}] = window.__leveonas_state__[${JSON.stringify(
                compInstancePath
              )}] || {};
  window.__leveonas_state__[${JSON.stringify(compInstancePath)}][${JSON.stringify(bindingTarget)}] = nextVal;
  if (window.__leveonas_runtime__ && typeof window.__leveonas_runtime__.updateState === 'function') {
    window.__leveonas_runtime__.updateState(${JSON.stringify(compInstancePath)}, ${JSON.stringify(bindingTarget)}, nextVal);
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
            } else {
              if (canonicalPropName === 'id') {
                hasExplicitId = true;
              }
              const lit = ASTFactory.createLiteral(prop.value, JSON.stringify(prop.value), loc);
              const propNode = ASTFactory.createProperty(canonicalPropName, lit, loc);
              properties.push(propNode);
            }
          }

          if (!hasExplicitId) {
            const idLit = ASTFactory.createLiteral(elemId, `"${elemId}"`, loc);
            properties.unshift(ASTFactory.createProperty('id', idLit, loc));
          }

          // Handle dynamic class conditions: class:active="isActive"
          if (elem.dynamicClassConditions && Object.keys(elem.dynamicClassConditions).length > 0) {
            for (const [clsName, condExpr] of Object.entries(elem.dynamicClassConditions)) {
              const deps = extractExpressionDependencies(condExpr);
              if (deps.length > 0) {
                graph.registerDOMDependency({
                  domNodeId: elemId,
                  kind: 'CLASS',
                  className: clsName,
                  expression: condExpr,
                  dependencies: deps,
                });
              }

              const isClassActive = Boolean(evaluateSvelteExpression(condExpr, context));
              if (isClassActive) {
                const existingClassProp = properties.find((p) => p.name === 'className');
                if (existingClassProp && existingClassProp.value?.kind === ASTNodeKind.Literal) {
                  const existingVal = (existingClassProp.value as LiteralNode).value;
                  (existingClassProp.value as LiteralNode).value = `${existingVal} ${clsName}`.trim();
                } else {
                  const classLit = ASTFactory.createLiteral(clsName, `"${clsName}"`, loc);
                  properties.push(ASTFactory.createProperty('className', classLit, loc));
                }
              }
            }
          }

          const renderedChildren: ASTNode[] = [];
          for (let i = 0; i < elem.children.length; i++) {
            const child = elem.children[i];
            const childASTs = renderUINode(
              child,
              elemId,
              i,
              ownerComponent,
              context,
              slotChildren,
              graph
            );
            renderedChildren.push(...childASTs);
          }

          const domElement = ASTFactory.createComponent(
            astKind,
            loc,
            properties,
            renderedChildren,
            astKind === ASTNodeKind.GenericComponent ? canonicalTag : undefined
          ) as ASTNode;
          domElement.id = elemId;

          return [domElement];
        }

        default:
          return [];
      }
    };

    const renderedRootNodes = renderComponentInstance(rootDecl, 'svelte-root');
    for (const node of renderedRootNodes) {
      rootDomNode.children.push(node);
      node.parent = rootDomNode;
    }

    const jsProgram: JSProgramNode = {
      id: getJSProgramId(),
      kind: JSNodeKind.Program,
      units: this.jsUnits,
    };

    return {
      domAST: rootDomNode,
      jsProgram,
      componentInstancesCount: instanceCount,
      reactivityGraphs: this.reactivityGraphs,
    };
  }
}
