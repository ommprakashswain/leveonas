import {
  AngularComponentDeclarationNode,
  AngularComponentInstanceNode,
  AngularConditionalNode,
  AngularContentProjectionNode,
  AngularElementNode,
  AngularForNode,
  AngularFragmentNode,
  AngularNodeKind,
  AngularProgramNode,
  AngularPropNode,
  AngularTextNode,
  AngularUINode,
} from '../../interpreters/angular-lm/ast';
import { extractAngularInterpolations, normalizeAngularInterpolation } from '../../interpreters/angular-lm/vocabulary';
import { extractExpressionDependencies } from '../../interpreters/svelte-lm/reactivity';
import { UIIRFactory } from '../factory';
import {
  UIIRBindingNode,
  UIIRComponentDeclarationNode,
  UIIRComponentInstanceNode,
  UIIRConditionalNode,
  UIIRElementNode,
  UIIREventNode,
  UIIRFragmentNode,
  UIIRListNode,
  UIIRNode,
  UIIRProgramNode,
  UIIRPropDeclarationNode,
  UIIRPropNode,
  UIIRSlotNode,
  UIIRStateDeclarationNode,
  UIIRTextNode,
} from '../types';

/**
 * AngularToLowering Adapter
 * Lowers Angular-LM AST into Common Leveonas UI IR.
 */
export class AngularToLowering {
  public static lower(program: AngularProgramNode): UIIRProgramNode {
    const components: UIIRComponentDeclarationNode[] = [];

    for (const comp of program.components) {
      components.push(this.lowerComponent(comp));
    }

    return UIIRFactory.createProgram(components, program.rootComponent || 'App', program.sourceLocation);
  }

  public static lowerComponent(comp: AngularComponentDeclarationNode): UIIRComponentDeclarationNode {
    // 1. Inputs -> PropDeclarations
    const propDeclarations: UIIRPropDeclarationNode[] = [];
    for (const input of comp.inputs || []) {
      propDeclarations.push(
        UIIRFactory.createPropDeclaration(
          input.name || input.inputName,
          input.defaultValue,
          input.typeAnnotation,
          input.sourceLocation
        )
      );
    }

    // 2. State / Signals -> StateDeclarations
    const stateDeclarations: UIIRStateDeclarationNode[] = [];
    for (const state of comp.stateDeclarations || []) {
      stateDeclarations.push(
        UIIRFactory.createState(
          state.name || state.stateName,
          state.initialValue,
          state.typeAnnotation,
          state.sourceLocation
        )
      );
    }

    // 3. Computed / Derived -> DerivedDeclarations
    const derivedDeclarations = [];
    for (const derived of comp.derivedDeclarations || []) {
      const deps = derived.dependencies && derived.dependencies.length > 0
        ? derived.dependencies
        : extractExpressionDependencies(derived.expression);
      derivedDeclarations.push(
        UIIRFactory.createDerived(
          derived.name || derived.derivedName,
          derived.expression,
          deps,
          derived.sourceLocation
        )
      );
    }

    // 4. Template Body -> UIIRNodes
    const body: UIIRNode[] = [];
    for (const child of comp.body || []) {
      const lowered = this.lowerUINode(child);
      if (lowered) body.push(lowered);
    }

    return UIIRFactory.createComponent(
      comp.name,
      body,
      stateDeclarations,
      derivedDeclarations,
      propDeclarations,
      undefined,
      comp.sourceLocation
    );
  }

  public static lowerUINode(node: AngularUINode): UIIRNode | null {
    if (!node) return null;

    switch (node.kind) {
      case AngularNodeKind.Text: {
        const txt = node as AngularTextNode;
        const normalized = normalizeAngularInterpolation(txt.value);
        const deps = extractAngularInterpolations(txt.value);
        return UIIRFactory.createText(normalized, deps.length > 0, deps, txt.sourceLocation);
      }

      case AngularNodeKind.Element: {
        const elem = node as AngularElementNode;
        const props: UIIRPropNode[] = [];
        const events: UIIREventNode[] = [];
        const bindings: UIIRBindingNode[] = [];

        // Two-way binding: [(ngModel)]="name" / model:name
        if (elem.modelBinding) {
          bindings.push(
            UIIRFactory.createBinding('value', elem.modelBinding, `#${elem.id}`, elem.sourceLocation)
          );
        }

        for (const p of elem.props || []) {
          const rawPropName = p.name.trim();

          // Event binding: (click)="handler" / output:click / click:handler
          if (
            p.isEvent ||
            rawPropName.startsWith('(') ||
            rawPropName.startsWith('output:') ||
            rawPropName === 'click' ||
            rawPropName === 'input' ||
            rawPropName === 'change' ||
            rawPropName === 'submit'
          ) {
            const domEvt = rawPropName
              .replace(/^\(/, '')
              .replace(/\)$/, '')
              .replace(/^output:/, '')
              .toLowerCase();
            const handlerStr = String(p.value).trim();
            events.push(
              UIIRFactory.createEvent(
                domEvt,
                `#${elem.id}`,
                handlerStr,
                undefined,
                undefined,
                false,
                p.sourceLocation
              )
            );
          } else if (p.isTwoWayBinding || rawPropName.startsWith('[(') || rawPropName === 'model') {
            const stateVar = String(p.value).trim();
            bindings.push(
              UIIRFactory.createBinding('value', stateVar, `#${elem.id}`, p.sourceLocation)
            );
          } else if (p.isClassBinding || rawPropName.startsWith('[class.') || rawPropName.startsWith('class.')) {
            // Handled via dynamicClassConditions below
          } else if (p.isStyleBinding || rawPropName.startsWith('[style.') || rawPropName.startsWith('style.')) {
            // Handled via dynamicStyles below
          } else {
            // Regular prop or property binding [prop]="expr"
            const cleanPropName = rawPropName.replace(/^\[/, '').replace(/\]$/, '');
            props.push(
              UIIRFactory.createProp(
                cleanPropName,
                p.value,
                p.rawValue,
                p.isDynamic || p.isPropertyBinding,
                p.isExpression,
                p.sourceLocation
              )
            );
          }
        }

        const children: UIIRNode[] = [];
        for (const child of elem.children || []) {
          const lowered = this.lowerUINode(child);
          if (lowered) children.push(lowered);
        }

        return UIIRFactory.createElement(
          elem.tag,
          props,
          children,
          elem.dynamicClassConditions,
          events,
          bindings,
          elem.key,
          elem.dynamicStyles,
          elem.sourceLocation
        );
      }

      case AngularNodeKind.ComponentInstance: {
        const compInst = node as AngularComponentInstanceNode;
        const props: UIIRPropNode[] = [];
        for (const p of compInst.props || []) {
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

        const children: UIIRNode[] = [];
        for (const child of compInst.children || []) {
          const lowered = this.lowerUINode(child);
          if (lowered) children.push(lowered);
        }

        return UIIRFactory.createComponentInstance(
          compInst.componentName,
          props,
          children,
          compInst.key,
          compInst.sourceLocation
        );
      }

      case AngularNodeKind.Fragment: {
        const frag = node as AngularFragmentNode;
        const children: UIIRNode[] = [];
        for (const child of frag.children || []) {
          const lowered = this.lowerUINode(child);
          if (lowered) children.push(lowered);
        }
        return UIIRFactory.createFragment(children, frag.key, frag.sourceLocation);
      }

      case AngularNodeKind.ContentProjection: {
        const proj = node as AngularContentProjectionNode;
        const fallback: UIIRNode[] = [];
        for (const child of proj.children || []) {
          const lowered = this.lowerUINode(child);
          if (lowered) fallback.push(lowered);
        }
        return UIIRFactory.createSlot(proj.name || 'default', fallback, proj.sourceLocation);
      }

      case AngularNodeKind.Conditional: {
        const cond = node as AngularConditionalNode;
        const thenLowered = this.lowerUINode(cond.thenBranch) || UIIRFactory.createFragment([]);
        const elseLowered = cond.elseBranch ? this.lowerUINode(cond.elseBranch) || undefined : undefined;
        const deps = cond.dependencies && cond.dependencies.length > 0
          ? cond.dependencies
          : extractExpressionDependencies(cond.conditionExpr);
        return UIIRFactory.createConditional(
          cond.conditionExpr,
          thenLowered,
          elseLowered,
          deps,
          cond.sourceLocation
        );
      }

      case AngularNodeKind.For: {
        const forNode = node as AngularForNode;
        const bodyLowered = this.lowerUINode(forNode.body) || UIIRFactory.createFragment([]);
        const deps = forNode.dependencies && forNode.dependencies.length > 0
          ? forNode.dependencies
          : [forNode.arrayExpr];
        const keyExpr = forNode.trackExpr || `${forNode.itemVar || 'item'}.id`;
        return UIIRFactory.createList(
          forNode.arrayExpr,
          forNode.itemVar || 'item',
          bodyLowered,
          keyExpr,
          forNode.indexVar || 'index',
          deps,
          forNode.sourceLocation
        );
      }

      default:
        return null;
    }
  }
}
