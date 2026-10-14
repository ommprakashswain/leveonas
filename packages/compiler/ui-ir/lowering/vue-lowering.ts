import {
  VueComponentDeclarationNode,
  VueConditionalNode,
  VueElementNode,
  VueFragmentNode,
  VueListNode,
  VueNodeKind,
  VueProgramNode,
  VuePropNode,
  VueTextNode,
  VueUINode,
} from '../../interpreters/vue-lm/ast';
import { extractExpressionDependencies, extractTemplateInterpolations } from '../../interpreters/svelte-lm/reactivity';
import { UIIRFactory } from '../factory';
import {
  UIIRComponentDeclarationNode,
  UIIRNode,
  UIIRProgramNode,
  UIIRPropNode,
} from '../types';

/**
 * Lowers Vue-LM AST into Common UI IR
 */
export class VueToLowering {
  static lower(program: VueProgramNode): UIIRProgramNode {
    const components: UIIRComponentDeclarationNode[] = program.components.map((c) =>
      this.lowerComponent(c)
    );
    return UIIRFactory.createProgram(components, program.rootComponent || 'App', program.sourceLocation);
  }

  static lowerComponent(decl: VueComponentDeclarationNode): UIIRComponentDeclarationNode {
    const stateDeclarations = decl.stateDeclarations.map((s) =>
      UIIRFactory.createState(s.stateName, s.initialValue, s.typeAnnotation, s.sourceLocation)
    );

    const derivedDeclarations = (decl.computedDeclarations || []).map((c) => {
      const knownVars = decl.stateDeclarations.map((s) => s.stateName);
      const deps = c.dependencies || extractExpressionDependencies(c.expression, knownVars);
      return UIIRFactory.createDerived(c.computedName || c.name, c.expression, deps, c.sourceLocation);
    });

    const body = decl.body.map((node) => this.lowerUINode(node));

    return UIIRFactory.createComponent(
      decl.name,
      body,
      stateDeclarations,
      derivedDeclarations,
      [],
      undefined,
      decl.sourceLocation
    );
  }

  static lowerUINode(node: VueUINode): UIIRNode {
    switch (node.kind) {
      case VueNodeKind.Text: {
        const textNode = node as VueTextNode;
        const normalizedValue = textNode.value.replace(/\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$.]*)\s*\}\}/g, '{$1}');
        const deps = textNode.isExpression
          ? extractExpressionDependencies(normalizedValue)
          : extractTemplateInterpolations(normalizedValue);
        return UIIRFactory.createText(normalizedValue, textNode.isExpression, deps, textNode.sourceLocation);
      }

      case VueNodeKind.Element: {
        const elem = node as VueElementNode;
        const props: UIIRPropNode[] = [];
        const events: any[] = [];
        const bindings: any[] = [];

        if (elem.modelBinding) {
          bindings.push(
            UIIRFactory.createBinding('value', elem.modelBinding, `#${elem.id}`, elem.sourceLocation)
          );
        }

        for (const p of elem.props) {
          const rawPropName = p.name.trim();
          const isEvt =
            p.isEvent ||
            p.directiveName === 'v-on' ||
            rawPropName.startsWith('@') ||
            rawPropName.startsWith('on:') ||
            rawPropName.startsWith('oc:') ||
            rawPropName.startsWith('onClick');

          if (isEvt) {
            let domEvt = rawPropName
              .replace(/^@/, '')
              .replace(/^v-on:/, '')
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
          } else if (p.isModel || p.directiveName === 'v-model') {
            bindings.push(
              UIIRFactory.createBinding('value', String(p.value), `#${elem.id}`, p.sourceLocation)
            );
          } else {
            props.push(
              UIIRFactory.createProp(
                p.name,
                p.value,
                p.rawValue,
                p.isDynamic,
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
          bindings,
          elem.key,
          undefined,
          elem.sourceLocation
        );
      }

      case VueNodeKind.Slot: {
        const slot = node as any;
        const fallback = (slot.children || []).map((c: VueUINode) => this.lowerUINode(c));
        return UIIRFactory.createSlot(slot.name || 'default', fallback, slot.sourceLocation);
      }

      case VueNodeKind.ComponentInstance: {
        const inst = node as any;
        const props = (inst.props || []).map((p: VuePropNode) =>
          UIIRFactory.createProp(p.name, p.value, p.rawValue, p.isDynamic, p.isExpression, p.sourceLocation)
        );
        const children = (inst.children || []).map((c: VueUINode) => this.lowerUINode(c));
        return UIIRFactory.createComponentInstance(
          inst.componentName,
          props,
          children,
          inst.key,
          inst.sourceLocation
        );
      }

      case VueNodeKind.Fragment: {
        const frag = node as VueFragmentNode;
        const children = frag.children.map((c) => this.lowerUINode(c));
        return UIIRFactory.createFragment(children, frag.key, frag.sourceLocation);
      }

      case VueNodeKind.Conditional: {
        const cond = node as VueConditionalNode;
        const deps = extractExpressionDependencies(cond.conditionExpr);
        return UIIRFactory.createConditional(
          cond.conditionExpr,
          this.lowerUINode(cond.thenBranch),
          cond.elseBranch ? this.lowerUINode(cond.elseBranch) : undefined,
          deps,
          cond.sourceLocation
        );
      }

      case VueNodeKind.List: {
        const list = node as VueListNode;
        const deps = extractExpressionDependencies(list.arrayExpr);
        return UIIRFactory.createList(
          list.arrayExpr,
          list.itemVar,
          this.lowerUINode(list.body),
          list.keyExpr,
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
