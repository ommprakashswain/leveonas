import {
  SvelteComponentDeclarationNode,
  SvelteConditionalNode,
  SvelteEachNode,
  SvelteElementNode,
  SvelteFragmentNode,
  SvelteNodeKind,
  SvelteProgramNode,
  SveltePropNode,
  SvelteSlotNode,
  SvelteTextNode,
  SvelteUINode,
} from '../../interpreters/svelte-lm/ast';
import { extractExpressionDependencies, extractTemplateInterpolations } from '../../interpreters/svelte-lm/reactivity';
import { UIIRFactory } from '../factory';
import {
  UIIRComponentDeclarationNode,
  UIIRNode,
  UIIRProgramNode,
  UIIRPropNode,
} from '../types';

/**
 * Lowers Svelte-LM AST into Common UI IR
 */
export class SvelteToLowering {
  static lower(program: SvelteProgramNode): UIIRProgramNode {
    const components: UIIRComponentDeclarationNode[] = program.components.map((c) =>
      this.lowerComponent(c)
    );
    return UIIRFactory.createProgram(components, program.rootComponent || 'App', program.sourceLocation);
  }

  static lowerComponent(decl: SvelteComponentDeclarationNode): UIIRComponentDeclarationNode {
    const stateDeclarations = decl.stateDeclarations.map((s) =>
      UIIRFactory.createState(s.stateName, s.initialValue, s.typeAnnotation, s.sourceLocation)
    );

    const derivedDeclarations = (decl.reactiveDeclarations || []).map((r) => {
      const knownVars = decl.stateDeclarations.map((s) => s.stateName);
      const deps = r.dependencies || extractExpressionDependencies(r.expression, knownVars);
      return UIIRFactory.createDerived(r.reactiveName || r.name, r.expression, deps, r.sourceLocation);
    });

    const propDeclarations = (decl.propDeclarations || []).map((p) =>
      UIIRFactory.createPropDeclaration(p.propName || p.name, p.defaultValue, p.typeAnnotation, p.sourceLocation)
    );

    const body = decl.body.map((node) => this.lowerUINode(node));

    return UIIRFactory.createComponent(
      decl.name,
      body,
      stateDeclarations,
      derivedDeclarations,
      propDeclarations,
      decl.propsType,
      decl.sourceLocation
    );
  }

  static lowerUINode(node: SvelteUINode): UIIRNode {
    switch (node.kind) {
      case SvelteNodeKind.Text: {
        const textNode = node as SvelteTextNode;
        const deps = textNode.isExpression
          ? extractExpressionDependencies(textNode.value)
          : extractTemplateInterpolations(textNode.value);
        return UIIRFactory.createText(textNode.value, textNode.isExpression, deps, textNode.sourceLocation);
      }

      case SvelteNodeKind.Element: {
        const elem = node as SvelteElementNode;
        const props: UIIRPropNode[] = [];
        const events: any[] = [];
        const bindings: any[] = [];

        for (const p of elem.props) {
          const rawPropName = p.name.trim();
          const isEvt =
            p.isEvent ||
            rawPropName.startsWith('on:') ||
            rawPropName.startsWith('oc:') ||
            rawPropName.startsWith('onClick');

          if (isEvt) {
            let domEvt = rawPropName
              .replace(/^on:/, '')
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
          } else if (p.isBinding || p.name.startsWith('bind:')) {
            const bindingType = p.name === 'bind:checked' ? 'checked' : 'value';
            bindings.push(
              UIIRFactory.createBinding(bindingType, String(p.value), `#${elem.id}`, p.sourceLocation)
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
          elem.dynamicClassConditions,
          events,
          bindings,
          undefined,
          undefined,
          elem.sourceLocation
        );
      }

      case SvelteNodeKind.Slot: {
        const slot = node as SvelteSlotNode;
        const fallback = (slot.children || []).map((c: SvelteUINode) => this.lowerUINode(c));
        return UIIRFactory.createSlot(slot.name || 'default', fallback, slot.sourceLocation);
      }

      case SvelteNodeKind.ComponentInstance: {
        const inst = node as any;
        const props = (inst.props || []).map((p: SveltePropNode) =>
          UIIRFactory.createProp(p.name, p.value, p.rawValue, p.isDynamic, p.isExpression, p.sourceLocation)
        );
        const children = (inst.children || []).map((c: SvelteUINode) => this.lowerUINode(c));
        return UIIRFactory.createComponentInstance(
          inst.componentName,
          props,
          children,
          undefined,
          inst.sourceLocation
        );
      }

      case SvelteNodeKind.Fragment: {
        const frag = node as SvelteFragmentNode;
        const children = frag.children.map((c) => this.lowerUINode(c));
        return UIIRFactory.createFragment(children, undefined, frag.sourceLocation);
      }

      case SvelteNodeKind.Conditional: {
        const cond = node as SvelteConditionalNode;
        const deps = extractExpressionDependencies(cond.conditionExpr);
        return UIIRFactory.createConditional(
          cond.conditionExpr,
          this.lowerUINode(cond.thenBranch),
          cond.elseBranch ? this.lowerUINode(cond.elseBranch) : undefined,
          deps,
          cond.sourceLocation
        );
      }

      case SvelteNodeKind.Each: {
        const each = node as SvelteEachNode;
        const deps = extractExpressionDependencies(each.arrayExpr);
        return UIIRFactory.createList(
          each.arrayExpr,
          each.itemVar,
          this.lowerUINode(each.body),
          each.keyExpr,
          each.indexVar,
          deps,
          each.sourceLocation
        );
      }

      default:
        return UIIRFactory.createFragment([], undefined, (node as any)?.sourceLocation);
    }
  }
}
