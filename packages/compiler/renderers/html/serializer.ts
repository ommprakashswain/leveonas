import { ASTNode, ComponentNode, GenericComponentNode, LiteralNode, PropertyNode } from '../../ast/nodes';
import { ASTNodeKind } from '../../ast/types';
import { ElementMap, SelfClosingElements } from './element-map';
import { escapeHtml, escapeAttribute } from './escape';
import { HtmlWriter } from './writer';

export class HtmlSerializer {
  constructor(private writer: HtmlWriter) {}

  serialize(node: ASTNode, indentLevel: number = 0) {
    if (node.kind === ASTNodeKind.Literal) {
      const literal = node as LiteralNode;
      this.writer.writeIndent(indentLevel);
      this.writer.write(escapeHtml(String(literal.value)));
      this.writer.writeNewline();
      return;
    }

    if (node.kind === ASTNodeKind.Property) {
      return;
    }

    if (node.kind === ASTNodeKind.Root) {
      const comp = node as ComponentNode;
      for (const child of comp.children || []) {
        this.serialize(child, indentLevel);
      }
      return;
    }

    let tagName = 'div';
    let isComponent = true;
    const comp = node as ComponentNode;
    
    if (node.kind === ASTNodeKind.GenericComponent) {
      const genName = (node as GenericComponentNode).name;
      tagName = ElementMap[genName] || genName || 'div';
    } else {
      tagName = ElementMap[node.kind] || 'div';
    }

    this.writer.writeIndent(indentLevel);
    this.writer.write(`<${tagName}`);

    // Map properties to attributes
    const attributes = new Map<string, string>();
    
    // Default accessibility enhancements
    if (tagName === 'button' && !attributes.has('type')) {
      attributes.set('type', 'button');
    }
    
    if (tagName === 'img' && !attributes.has('alt')) {
      attributes.set('alt', '');
    }

    if (comp.properties) {
      for (const prop of comp.properties) {
        let attrName = prop.name;
        let attrValue = String(prop.value?.value ?? '');

        // Basic mapping for React/DOM diffs (e.g., className) if needed, though we only want semantic HTML
        if (attrName === 'className') {
          attrName = 'class';
        }

        attributes.set(attrName, attrValue);
      }
    }

    // Sort attributes deterministically
    const sortedKeys = Array.from(attributes.keys()).sort();
    for (const key of sortedKeys) {
      const val = attributes.get(key)!;
      this.writer.write(` ${escapeAttribute(key)}="${escapeAttribute(val)}"`);
    }

    if (SelfClosingElements.has(tagName)) {
      this.writer.write(` />`);
      this.writer.writeNewline();
    } else {
      this.writer.write(`>`);
      this.writer.writeNewline();

      if (comp.children && comp.children.length > 0) {
        for (const child of comp.children) {
          this.serialize(child, indentLevel + 1);
        }
      }

      this.writer.writeIndent(indentLevel);
      this.writer.write(`</${tagName}>`);
      this.writer.writeNewline();
    }
  }
}
