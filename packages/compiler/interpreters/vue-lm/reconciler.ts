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
  VueComponentDeclarationNode,
  VueComponentInstanceNode,
  VueComputedDeclarationNode,
  VueConditionalNode,
  VueElementNode,
  VueFragmentNode,
  VueListNode,
  VueNodeKind,
  VueProgramNode,
  VuePropNode,
  VueSlotNode,
  VueStateDeclarationNode,
  VueTextNode,
  VueUINode,
  getVueEventHandlerId,
} from './ast';
import {
  TAG_TO_AST_KIND,
  getDOMEventNameFromVueEvent,
  isIntrinsicTag,
  isVueEventProp,
  resolveVueElementTag,
  resolveVuePropName,
} from './vocabulary';

export interface VueReconciliationResult {
  domAST: RootNode;
  jsProgram: JSProgramNode;
  componentInstancesCount: number;
}

export class VueReconciler {
  private program: VueProgramNode;
  private componentMap: Map<string, VueComponentDeclarationNode>;
  private componentState: Map<string, any>; // instancePath -> state object
  private jsUnits: JSUnitNode[] = [];
  private eventCounter: number = 0;

  constructor(program: VueProgramNode, initialStates?: Record<string, any>) {
    this.program = program;
    this.componentMap = new Map();
    for (const comp of program.components) {
      this.componentMap.set(comp.name, comp);
    }
    this.componentState = new Map(initialStates ? Object.entries(initialStates) : []);
  }

  /**
   * Reconcile the Vue component program tree into a Leveonas DOM RootNode and accompanying JS runtime units.
   */
  public reconcile(rootComponentName?: string): VueReconciliationResult {
    this.jsUnits = [];
    this.eventCounter = 0;

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
      };
    }

    let instanceCount = 0;

    const renderComponentInstance = (
      decl: VueComponentDeclarationNode,
      parentPath: string,
      props: Record<string, any> = {},
      slotChildren: VueUINode[] = [],
      index: number = 0
    ): ASTNode[] => {
      instanceCount++;
      const instancePath = `${parentPath}-${decl.name}_${index}`;

      // Build state object
      const stateObj: Record<string, any> = {};
      for (const s of decl.stateDeclarations) {
        stateObj[s.stateName] = s.initialValue;
      }

      // Compute initial computed values
      const computedObj: Record<string, any> = {};
      for (const c of decl.computedDeclarations) {
        try {
          // Simple safe evaluation for numeric/string arithmetic e.g. count * 2, price * qty
          const expr = c.expression;
          const fn = new Function(...Object.keys(stateObj), `return (${expr});`);
          computedObj[c.computedName] = fn(...Object.values(stateObj));
        } catch {
          computedObj[c.computedName] = null;
        }
      }

      const mergedContext = { ...props, ...stateObj, ...computedObj };

      // Emit JS state store unit if state or computed exists
      if (decl.stateDeclarations.length > 0 || decl.computedDeclarations.length > 0) {
        const stateUnitId = getJSUnitId('vue_state', instancePath);
        const stateCode = `
window.__leveonas_state__ = window.__leveonas_state__ || {};
window.__leveonas_state__[${JSON.stringify(instancePath)}] = window.__leveonas_state__[${JSON.stringify(
          instancePath
        )}] || ${JSON.stringify(stateObj)};
`.trim();

        this.jsUnits.push({
          id: stateUnitId,
          kind: JSNodeKind.Unit,
          unitKind: 'Variable',
          code: stateCode,
          rawCode: stateCode,
          isComplete: true,
        });

        // Emit computed getters if present
        for (const c of decl.computedDeclarations) {
          const compUnitId = getJSUnitId('vue_computed', `${instancePath}_${c.computedName}`);
          const compCode = `
window.__leveonas_computed__ = window.__leveonas_computed__ || {};
window.__leveonas_computed__[${JSON.stringify(`${instancePath}_${c.computedName}`)}] = function() {
  const s = window.__leveonas_state__[${JSON.stringify(instancePath)}] || {};
  with (s) {
    return (${c.expression});
  }
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
          slotChildren
        );
        domNodes.push(...childNodes);
      }

      return domNodes;
    };

    const renderUINode = (
      node: VueUINode,
      parentPath: string,
      index: number,
      ownerComponent: string,
      context: Record<string, any>,
      slotChildren: VueUINode[]
    ): ASTNode[] => {
      if (!node) return [];

      switch (node.kind) {
        case VueNodeKind.Text: {
          const txt = node as VueTextNode;
          const loc = txt.sourceLocation || defaultLoc;
          // Interpolate expressions like {count} or {double} or {{count}}
          let renderedText = txt.value;
          for (const [k, v] of Object.entries(context)) {
            const regex = new RegExp(`\\{\\{\\s*${k}\\s*\\}\\}|\\{\\s*${k}\\s*\\}`, 'g');
            renderedText = renderedText.replace(regex, String(v));
          }
          const lit = ASTFactory.createLiteral(renderedText, `"${renderedText}"`, loc);
          lit.id = `${parentPath}-txt_${index}`;
          return [lit];
        }

        case VueNodeKind.Slot: {
          const slot = node as VueSlotNode;
          // If instance passed children to slot, render them
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
                  []
                )
              );
            }
            return res;
          }
          // Otherwise render fallback slot children
          const res: ASTNode[] = [];
          for (let i = 0; i < slot.children.length; i++) {
            res.push(
              ...renderUINode(
                slot.children[i],
                `${parentPath}-slot_fallback_${index}`,
                i,
                ownerComponent,
                context,
                []
              )
            );
          }
          return res;
        }

        case VueNodeKind.Fragment: {
          const frag = node as VueFragmentNode;
          const res: ASTNode[] = [];
          for (let i = 0; i < frag.children.length; i++) {
            res.push(
              ...renderUINode(
                frag.children[i],
                `${parentPath}-frag_${index}`,
                i,
                ownerComponent,
                context,
                slotChildren
              )
            );
          }
          return res;
        }

        case VueNodeKind.Conditional: {
          const cond = node as VueConditionalNode;
          let isTruthy = false;
          try {
            if (cond.conditionExpr in context) {
              isTruthy = Boolean(context[cond.conditionExpr]);
            } else {
              isTruthy =
                cond.conditionExpr !== 'false' &&
                cond.conditionExpr !== '0' &&
                cond.conditionExpr !== 'null';
            }
          } catch {
            isTruthy = true;
          }

          if (isTruthy) {
            return renderUINode(
              cond.thenBranch,
              `${parentPath}-then_${index}`,
              0,
              ownerComponent,
              context,
              slotChildren
            );
          } else if (cond.elseBranch) {
            return renderUINode(
              cond.elseBranch,
              `${parentPath}-else_${index}`,
              0,
              ownerComponent,
              context,
              slotChildren
            );
          }
          return [];
        }

        case VueNodeKind.List: {
          const list = node as VueListNode;
          // Render item body template
          return renderUINode(
            list.body,
            `${parentPath}-list_${index}`,
            0,
            ownerComponent,
            context,
            slotChildren
          );
        }

        case VueNodeKind.ComponentInstance: {
          const compInst = node as VueComponentInstanceNode;
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
          // Fallback if component declaration not found: treat as generic container
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

        case VueNodeKind.Element: {
          const elem = node as VueElementNode;
          const canonicalTag = resolveVueElementTag(elem.tag);
          const astKind = TAG_TO_AST_KIND[canonicalTag] || ASTNodeKind.GenericComponent;
          const loc = elem.sourceLocation || defaultLoc;

          const elemId = elem.id || `${parentPath}-${canonicalTag}_${index}`;
          const properties: PropertyNode[] = [];
          let hasExplicitId = false;

          for (const prop of elem.props) {
            const canonicalPropName = resolveVuePropName(prop.name);

            if (isVueEventProp(prop.name)) {
              // Event handler mapping
              const domEvent = getDOMEventNameFromVueEvent(prop.name);
              const eventTargetSelector = `#${elemId}`;

              // Ensure element has an ID property so event delegation can find it
              hasExplicitId = true;

              let handlerBody = String(prop.value);
              // Handle expressions like `count++` or `setCount(count + 1)`
              if (handlerBody.includes('++') || handlerBody.includes('--') || handlerBody.includes('=')) {
                handlerBody = `
const s = window.__leveonas_state__[${JSON.stringify(parentPath)}] || {};
${handlerBody};
`.trim();
              }

              const jsEvtId = getJSEventHandlerId(domEvent, `#${elemId}`);
              const jsCode = `
window.__leveonas_runtime__.on(${JSON.stringify(domEvent)}, ${JSON.stringify(eventTargetSelector)}, function(event, target) {
  ${handlerBody}
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
                  handlerCode: handlerBody,
                  sourceLocation: prop.sourceLocation,
                },
              });
            } else if (prop.isModel || canonicalPropName === 'v-model') {
              // v-model two-way binding on input element
              hasExplicitId = true;
              const modelKey = String(prop.value);
              const currentVal = context[modelKey] ?? '';

              // 1. Set initial DOM value property
              const valLit = ASTFactory.createLiteral(currentVal, JSON.stringify(currentVal), loc);
              properties.push(ASTFactory.createProperty('value', valLit, loc));

              // 2. Attach input event handler
              const jsEvtId = getJSEventHandlerId('input', `#${elemId}`);
              const jsCode = `
window.__leveonas_runtime__.on("input", "#${elemId}", function(event, target) {
  window.__leveonas_state__ = window.__leveonas_state__ || {};
  window.__leveonas_state__[${JSON.stringify(parentPath)}] = window.__leveonas_state__[${JSON.stringify(
                parentPath
              )}] || {};
  window.__leveonas_state__[${JSON.stringify(parentPath)}][${JSON.stringify(modelKey)}] = target.value;
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
                  eventName: 'input',
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

          const children: ASTNode[] = [];
          for (let i = 0; i < elem.children.length; i++) {
            const childNodes = renderUINode(
              elem.children[i],
              elemId,
              i,
              ownerComponent,
              context,
              slotChildren
            );
            children.push(...childNodes);
          }

          const domComp = ASTFactory.createComponent(
            astKind,
            loc,
            properties,
            children,
            astKind === ASTNodeKind.GenericComponent ? canonicalTag : undefined
          ) as ASTNode;
          domComp.id = elemId;
          return [domComp];
        }

        default:
          return [];
      }
    };

    const rootChildren = renderComponentInstance(rootDecl, 'vue-root', {}, [], 0);
    rootDomNode.children = rootChildren;
    for (const c of rootChildren) {
      c.parent = rootDomNode;
    }

    return {
      domAST: rootDomNode,
      jsProgram: {
        id: getJSProgramId(),
        kind: JSNodeKind.Program,
        units: this.jsUnits,
      },
      componentInstancesCount: instanceCount,
    };
  }
}
