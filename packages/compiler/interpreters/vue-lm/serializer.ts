import {
  VueComponentDeclarationNode,
  VueComponentInstanceNode,
  VueConditionalNode,
  VueElementNode,
  VueFragmentNode,
  VueListNode,
  VueNodeKind,
  VueProgramNode,
  VueSlotNode,
  VueTextNode,
  VueUINode,
} from './ast';

export class VueLMSerializer {
  public static toJSON(program: VueProgramNode): string {
    return JSON.stringify(program, null, 2);
  }

  public static fromJSON(jsonStr: string): VueProgramNode {
    return JSON.parse(jsonStr) as VueProgramNode;
  }

  public static toCompactLM(program: VueProgramNode): string {
    const lines: string[] = ['<VUE>'];

    for (const comp of program.components) {
      lines.push(
        `component(${comp.name}${comp.propsType ? `:${comp.propsType}` : ''})(`
      );

      for (const s of comp.stateDeclarations) {
        lines.push(`  state(${s.stateName}, ${JSON.stringify(s.initialValue)})`);
      }

      for (const c of comp.computedDeclarations) {
        lines.push(`  computed(${c.computedName}, ${c.expression})`);
      }

      for (const node of comp.body) {
        lines.push(`  ${this.serializeUINode(node, 1)}`);
      }

      lines.push(')');
    }

    lines.push('</VUE>');
    return lines.join('\n');
  }

  private static serializeUINode(node: VueUINode, indentLevel: number): string {
    if (!node) return '';

    switch (node.kind) {
      case VueNodeKind.Text: {
        const txt = node as VueTextNode;
        return `"${txt.value}"`;
      }

      case VueNodeKind.Slot: {
        const slot = node as VueSlotNode;
        return `slot(${slot.name === 'default' ? '' : slot.name})`;
      }

      case VueNodeKind.Element: {
        const elem = node as VueElementNode;
        const propStr = elem.props
          .map((p) => {
            if (p.isEvent) return `@${p.name}:${p.value}`;
            if (p.isModel) return `v-model:${p.value}`;
            if (typeof p.value === 'string') return `${p.name}:"${p.value}"`;
            return `${p.name}:${p.value}`;
          })
          .join(' ');

        const childrenStr = elem.children
          .map((c) => this.serializeUINode(c, indentLevel + 1))
          .filter(Boolean)
          .join(' ');

        const inner = [propStr, childrenStr].filter(Boolean).join(' ');
        return `${elem.tag}(${inner})`;
      }

      case VueNodeKind.ComponentInstance: {
        const inst = node as VueComponentInstanceNode;
        const propStr = inst.props
          .map((p) => `${p.name}:${JSON.stringify(p.value)}`)
          .join(' ');
        const childrenStr = inst.children
          .map((c) => this.serializeUINode(c, indentLevel + 1))
          .join(' ');
        const inner = [propStr, childrenStr].filter(Boolean).join(' ');
        return `${inst.componentName}(${inner})`;
      }

      case VueNodeKind.Conditional: {
        const cond = node as VueConditionalNode;
        const thenStr = this.serializeUINode(cond.thenBranch, indentLevel);
        const elseStr = cond.elseBranch
          ? `(${this.serializeUINode(cond.elseBranch, indentLevel)})`
          : '';
        return `when(${cond.conditionExpr})(${thenStr})${elseStr}`;
      }

      case VueNodeKind.List: {
        const list = node as VueListNode;
        const keyPart = list.keyExpr ? `, ${list.keyExpr}` : '';
        const bodyStr = this.serializeUINode(list.body, indentLevel);
        return `each(${list.arrayExpr}, ${list.itemVar}${keyPart})(${bodyStr})`;
      }

      case VueNodeKind.Fragment: {
        const frag = node as VueFragmentNode;
        const childrenStr = frag.children
          .map((c) => this.serializeUINode(c, indentLevel))
          .join(' ');
        return `frag(${childrenStr})`;
      }

      default:
        return '';
    }
  }
}
