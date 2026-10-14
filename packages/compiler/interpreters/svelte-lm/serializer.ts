import {
  SvelteComponentDeclarationNode,
  SvelteComponentInstanceNode,
  SvelteConditionalNode,
  SvelteEachNode,
  SvelteElementNode,
  SvelteFragmentNode,
  SvelteNodeKind,
  SvelteProgramNode,
  SvelteSlotNode,
  SvelteTextNode,
  SvelteUINode,
} from './ast';

export class SvelteLMSerializer {
  public static toJSON(program: SvelteProgramNode): string {
    return JSON.stringify(program, null, 2);
  }

  public static fromJSON(jsonStr: string): SvelteProgramNode {
    return JSON.parse(jsonStr) as SvelteProgramNode;
  }

  public static toCompactLM(program: SvelteProgramNode): string {
    const lines: string[] = ['<SVELTE>'];

    for (const comp of program.components) {
      lines.push(
        `component(${comp.name}${comp.propsType ? `:${comp.propsType}` : ''})(`
      );

      for (const p of comp.propDeclarations) {
        lines.push(
          `  prop(${p.propName}${p.defaultValue !== undefined ? `, ${JSON.stringify(p.defaultValue)}` : ''})`
        );
      }

      for (const s of comp.stateDeclarations) {
        lines.push(`  state(${s.stateName}, ${JSON.stringify(s.initialValue)})`);
      }

      for (const r of comp.reactiveDeclarations) {
        lines.push(`  reactive(${r.reactiveName}, ${r.expression})`);
      }

      for (const node of comp.body) {
        lines.push(`  ${this.serializeUINode(node, 1)}`);
      }

      lines.push(')');
    }

    lines.push('</SVELTE>');
    return lines.join('\n');
  }

  private static serializeUINode(node: SvelteUINode, indentLevel: number): string {
    if (!node) return '';

    switch (node.kind) {
      case SvelteNodeKind.Text: {
        const txt = node as SvelteTextNode;
        return `"${txt.value}"`;
      }

      case SvelteNodeKind.Slot: {
        const slot = node as SvelteSlotNode;
        return `slot(${slot.name === 'default' ? '' : slot.name})`;
      }

      case SvelteNodeKind.Element: {
        const elem = node as SvelteElementNode;
        const propStr = elem.props
          .map((p) => {
            if (p.isEvent) return `${p.name}:${p.value}`;
            if (p.isBinding) return `${p.name}:${p.value}`;
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

      case SvelteNodeKind.ComponentInstance: {
        const inst = node as SvelteComponentInstanceNode;
        const propStr = inst.props
          .map((p) => `${p.name}:${JSON.stringify(p.value)}`)
          .join(' ');
        const childrenStr = inst.children
          .map((c) => this.serializeUINode(c, indentLevel + 1))
          .join(' ');
        const inner = [propStr, childrenStr].filter(Boolean).join(' ');
        return `${inst.componentName}(${inner})`;
      }

      case SvelteNodeKind.Conditional: {
        const cond = node as SvelteConditionalNode;
        const thenStr = this.serializeUINode(cond.thenBranch, indentLevel);
        const elseStr = cond.elseBranch
          ? `(${this.serializeUINode(cond.elseBranch, indentLevel)})`
          : '';
        return `when(${cond.conditionExpr})(${thenStr})${elseStr}`;
      }

      case SvelteNodeKind.Each: {
        const each = node as SvelteEachNode;
        const bodyStr = this.serializeUINode(each.body, indentLevel);
        return `each(${each.arrayExpr}, ${each.itemVar}${each.keyExpr ? `, ${each.keyExpr}` : ''})(${bodyStr})`;
      }

      case SvelteNodeKind.Fragment: {
        const frag = node as SvelteFragmentNode;
        return `frag(${frag.children.map((c) => this.serializeUINode(c, indentLevel)).join(' ')})`;
      }

      default:
        return '';
    }
  }
}
