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
  ReactComponentDeclarationNode,
  ReactComponentInstanceNode,
  ReactConditionalNode,
  ReactElementNode,
  ReactFragmentNode,
  ReactListNode,
  ReactNodeKind,
  ReactProgramNode,
  ReactPropNode,
  ReactTextNode,
  ReactUINode,
  getReactEventHandlerId,
} from './ast';
import {
  TAG_TO_AST_KIND,
  getDOMEventNameFromReactEvent,
  isIntrinsicTag,
  isReactEventProp,
  resolveReactElementTag,
  resolveReactPropName,
} from './vocabulary';

export interface ReconciliationResult {
  domAST: RootNode;
  jsProgram: JSProgramNode;
  componentInstancesCount: number;
}

export class ReactReconciler {
  private program: ReactProgramNode;
  private componentMap: Map<string, ReactComponentDeclarationNode>;
  private componentState: Map<string, any>; // componentInstanceId -> state object
  private jsUnits: JSUnitNode[] = [];
  private eventCounter: number = 0;

  constructor(program: ReactProgramNode, initialStates?: Record<string, any>) {
    this.program = program;
    this.componentMap = new Map();
    for (const comp of program.components) {
      this.componentMap.set(comp.name, comp);
    }
    this.componentState = new Map(initialStates ? Object.entries(initialStates) : []);
  }

  /**
   * Reconcile the React program tree into a Leveonas DOM RootNode and accompanying JS runtime units.
   */
  public reconcile(rootComponentName?: string): ReconciliationResult {
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
      decl: ReactComponentDeclarationNode,
      parentPath: string,
      props: Record<string, any> = {},
      index: number = 0
    ): ASTNode[] => {
      instanceCount++;
      const instancePath = `${parentPath}-${decl.name}_${index}`;

      // Initialize component state if declared and not present
      if (decl.stateDeclarations.length > 0) {
        const stateObj: Record<string, any> = {};
        for (const s of decl.stateDeclarations) {
          stateObj[s.stateName] = s.initialValue;
        }

        // Emit JS unit for component state store if needed
        const stateUnitId = getJSUnitId('state', instancePath);
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
      }

      const domNodes: ASTNode[] = [];
      for (let i = 0; i < decl.body.length; i++) {
        const uiChild = decl.body[i];
        const childNodes = renderUINode(uiChild, instancePath, i, decl.name);
        domNodes.push(...childNodes);
      }

      return domNodes;
    };

    const renderUINode = (
      node: ReactUINode,
      parentPath: string,
      index: number,
      ownerComponent: string
    ): ASTNode[] => {
      if (!node) return [];

      switch (node.kind) {
        case ReactNodeKind.Text: {
          const txt = node as ReactTextNode;
          const loc = txt.sourceLocation || defaultLoc;
          const lit = ASTFactory.createLiteral(txt.value, `"${txt.value}"`, loc);
          lit.id = `${parentPath}-txt_${index}`;
          return [lit];
        }

        case ReactNodeKind.Fragment: {
          const frag = node as ReactFragmentNode;
          const res: ASTNode[] = [];
          for (let i = 0; i < frag.children.length; i++) {
            res.push(...renderUINode(frag.children[i], `${parentPath}-frag_${index}`, i, ownerComponent));
          }
          return res;
        }

        case ReactNodeKind.Conditional: {
          const cond = node as ReactConditionalNode;
          // In static reconciliation evaluate condition expression or render thenBranch
          const isTruthy = cond.conditionExpr !== 'false' && cond.conditionExpr !== '0' && cond.conditionExpr !== 'null';
          if (isTruthy) {
            return renderUINode(cond.thenBranch, `${parentPath}-then_${index}`, 0, ownerComponent);
          } else if (cond.elseBranch) {
            return renderUINode(cond.elseBranch, `${parentPath}-else_${index}`, 0, ownerComponent);
          }
          return [];
        }

        case ReactNodeKind.List: {
          const list = node as ReactListNode;
          // Render item body template
          return renderUINode(list.body, `${parentPath}-list_${index}`, 0, ownerComponent);
        }

        case ReactNodeKind.ComponentInstance: {
          const compInst = node as ReactComponentInstanceNode;
          const targetDecl = this.componentMap.get(compInst.componentName);
          if (targetDecl) {
            const propMap: Record<string, any> = {};
            for (const p of compInst.props) {
              propMap[p.name] = p.value;
            }
            return renderComponentInstance(targetDecl, parentPath, propMap, index);
          }
          // Fallback if component declaration not found: treat as generic container
          const loc = compInst.sourceLocation || defaultLoc;
          const genericComp = ASTFactory.createComponent(ASTNodeKind.Container, loc, [], [], compInst.componentName) as ASTNode;
          genericComp.id = `${parentPath}-${compInst.componentName}_${index}`;
          return [genericComp];
        }

        case ReactNodeKind.Element: {
          const elem = node as ReactElementNode;
          const canonicalTag = resolveReactElementTag(elem.tag);
          const astKind = TAG_TO_AST_KIND[canonicalTag] || ASTNodeKind.GenericComponent;
          const loc = elem.sourceLocation || defaultLoc;

          const elemId = elem.id || `${parentPath}-${canonicalTag}_${index}`;
          const properties: PropertyNode[] = [];
          let hasExplicitId = false;

          for (const prop of elem.props) {
            const canonicalPropName = resolveReactPropName(prop.name);

            if (isReactEventProp(prop.name)) {
              // Event handler mapping
              const domEvent = getDOMEventNameFromReactEvent(prop.name);
              const eventTargetSelector = `#${elemId}`;

              // Ensure element has an ID property so event delegation can find it
              hasExplicitId = true;

              let handlerBody = String(prop.value);
              // Check if handler is state updater like `state.count++` or `setCount(count + 1)`
              if (handlerBody.startsWith('() =>') || handlerBody.startsWith('(event) =>')) {
                const arrowBody = handlerBody.replace(/^\([^)]*\)\s*=>\s*\{?/, '').replace(/\}?$/, '').trim();
                handlerBody = arrowBody;
              }

              const evtId = getReactEventHandlerId(ownerComponent, domEvent, elemId, ++this.eventCounter);
              const jsEvtId = getJSEventHandlerId(domEvent, `#${elemId}`);

              // Generate runtime event registration code
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
            const childNodes = renderUINode(elem.children[i], elemId, i, ownerComponent);
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

    const rootChildren = renderComponentInstance(rootDecl, 'react-root', {}, 0);
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
