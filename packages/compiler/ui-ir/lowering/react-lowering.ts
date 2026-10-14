import {
  ReactComponentDeclarationNode,
  ReactConditionalNode,
  ReactElementNode,
  ReactFragmentNode,
  ReactListNode,
  ReactNodeKind,
  ReactProgramNode,
  ReactPropNode,
  ReactTextNode,
  ReactUINode,
} from '../../interpreters/react-lm/ast';
import { extractExpressionDependencies, extractTemplateInterpolations } from '../../interpreters/svelte-lm/reactivity';
import { UIIRFactory } from '../factory';
import {
  UIIRComponentDeclarationNode,
  UIIRNode,
  UIIRProgramNode,
  UIIRPropNode,
} from '../types';

/**
 * Lowers React-LM AST into Common UI IR
 */
export class ReactToLowering {
  static lower(program: ReactProgramNode): UIIRProgramNode {
    const components: UIIRComponentDeclarationNode[] = program.components.map((c) =>
      this.lowerComponent(c)
    );
    return UIIRFactory.createProgram(components, program.rootComponent || 'App', program.sourceLocation);
  }

  static lowerComponent(decl: ReactComponentDeclarationNode): UIIRComponentDeclarationNode {
    const stateDeclarations = decl.stateDeclarations.map((s) =>
      UIIRFactory.createState(s.stateName, s.initialValue, s.typeAnnotation, s.sourceLocation)
    );

    const derivedDeclarations = (decl.derivedDeclarations || []).map((d) =>
      UIIRFactory.createDerived(
        d.derivedName || d.name || '',
        d.expression,
        d.dependencies && d.dependencies.length > 0 ? d.dependencies : extractExpressionDependencies(d.expression),
        d.sourceLocation
      )
    );

    const body = decl.body.map((node) => this.lowerUINode(node));

    return UIIRFactory.createComponent(
      decl.name,
      body,
      stateDeclarations,
      derivedDeclarations,
      [],
      decl.propsType,
      decl.sourceLocation
    );
  }

  static lowerUINode(node: ReactUINode): UIIRNode {
    switch (node.kind) {
      case ReactNodeKind.Text: {
        const textNode = node as ReactTextNode;
        const deps = textNode.isExpression
          ? extractExpressionDependencies(textNode.value)
          : extractTemplateInterpolations(textNode.value);
        return UIIRFactory.createText(textNode.value, textNode.isExpression, deps, textNode.sourceLocation);
      }

      case ReactNodeKind.Element: {
        const elem = node as ReactElementNode;
        const props: UIIRPropNode[] = [];
        const events: any[] = [];

        for (const p of elem.props) {
          const rawPropName = p.name.trim();
          const isEvt =
            p.isEvent ||
            rawPropName.startsWith('on:') ||
            rawPropName.startsWith('oc:') ||
            rawPropName.startsWith('onClick') ||
            rawPropName.startsWith('on') ||
            rawPropName.startsWith('click') ||
            rawPropName.startsWith('input') ||
            rawPropName.startsWith('change');

          if (isEvt) {
            let domEvt = rawPropName
              .replace(/^on:/, '')
              .replace(/^on/, '')
              .replace(/^oc:/, 'click:')
              .toLowerCase();

            let handler = String(p.value);
            if (domEvt.includes(':')) {
              const parts = domEvt.split(':');
              domEvt = parts[0];
              if (!p.value || p.value === true) {
                handler = parts.slice(1).join(':');
              }
            }

            events.push(
              UIIRFactory.createEvent(
                domEvt,
                `#${elem.id}`,
                handler,
                undefined,
                undefined,
                undefined,
                p.sourceLocation
              )
            );
          } else {
            props.push(
              UIIRFactory.createProp(
                p.name,
                p.value,
                p.rawValue,
                false,
                p.isExpression,
                p.sourceLocation
              )
            );
          }
        }

        const children = elem.children.map((c) => this.lowerUINode(c));
        return UIIRFactory.createElement(
          elem.tag,
          props,
          children,
          undefined,
          events,
          undefined,
          elem.key,
          undefined,
          elem.sourceLocation
        );
      }

      case ReactNodeKind.ComponentInstance: {
        const inst = node as any;
        const props = (inst.props || []).map((p: ReactPropNode) =>
          UIIRFactory.createProp(p.name, p.value, p.rawValue, false, p.isExpression, p.sourceLocation)
        );
        const children = (inst.children || []).map((c: ReactUINode) => this.lowerUINode(c));
        return UIIRFactory.createComponentInstance(
          inst.componentName,
          props,
          children,
          inst.key,
          inst.sourceLocation
        );
      }

      case ReactNodeKind.Fragment: {
        const frag = node as ReactFragmentNode;
        const children = frag.children.map((c) => this.lowerUINode(c));
        return UIIRFactory.createFragment(children, frag.key, frag.sourceLocation);
      }

      case ReactNodeKind.Conditional: {
        const cond = node as ReactConditionalNode;
        const deps = extractExpressionDependencies(cond.conditionExpr);
        return UIIRFactory.createConditional(
          cond.conditionExpr,
          this.lowerUINode(cond.thenBranch),
          cond.elseBranch ? this.lowerUINode(cond.elseBranch) : undefined,
          deps,
          cond.sourceLocation
        );
      }

      case ReactNodeKind.List: {
        const list = node as ReactListNode;
        const deps = extractExpressionDependencies(list.arrayExpr);
        return UIIRFactory.createList(
          list.arrayExpr,
          list.itemVar,
          this.lowerUINode(list.body),
          list.keyProp,
          list.indexVar,
          deps,
          list.sourceLocation
        );
      }

      default:
        return UIIRFactory.createFragment([], undefined, (node as any)?.sourceLocation);
    }
  }
}
