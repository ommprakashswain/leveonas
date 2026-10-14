import { ASTNode, ComponentNode, PropertyNode } from './nodes';
import { ASTNodeKind } from './types';

export class ASTPrinter {
  static print(node: ASTNode, indentLevel = 0): string {
    const indent = '  '.repeat(indentLevel);
    let out = '';

    if (node.kind === ASTNodeKind.Literal) {
      return `${indent}Literal(${(node as any).raw})\n`;
    }

    if (node.kind === ASTNodeKind.Property) {
      const prop = node as PropertyNode;
      out += `${indent}Property(${prop.name})`;
      if (prop.value) {
        out += `: ${prop.value.raw}`;
      }
      return out + '\n';
    }

    const comp = node as ComponentNode;
    let name = comp.kind.toString();
    if (comp.kind === ASTNodeKind.GenericComponent) {
      name = (comp as any).name;
    }

    out += `${indent}${name} [id=${comp.id}]\n`;
    
    if (comp.properties && comp.properties.length > 0) {
      out += `${indent}  Properties:\n`;
      for (const prop of comp.properties) {
        out += ASTPrinter.print(prop, indentLevel + 2);
      }
    }

    if (comp.children && comp.children.length > 0) {
      out += `${indent}  Children:\n`;
      for (const child of comp.children) {
        out += ASTPrinter.print(child, indentLevel + 2);
      }
    }

    return out;
  }
  
  static serialize(node: ASTNode): string {
     const replacer = (key: string, value: any) => {
        if (key === 'parent') return undefined;
        return value;
     };
     return JSON.stringify(node, replacer, 2);
  }
}
