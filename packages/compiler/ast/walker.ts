import { ASTNode } from './nodes';
import { ASTNodeKind } from './types';
import { ASTVisitor, visitNode } from './visitor';

export class ASTWalker {
  static walk(node: ASTNode, visitor: ASTVisitor): void {
    visitNode(node, visitor);
    
    if (node.kind === ASTNodeKind.Property) {
      if ((node as any).value) {
        ASTWalker.walk((node as any).value, visitor);
      }
    } else if (node.kind !== ASTNodeKind.Literal) {
      const comp = node as any;
      if (comp.properties) {
        for (const prop of comp.properties) {
          ASTWalker.walk(prop, visitor);
        }
      }
      if (comp.children) {
        for (const child of comp.children) {
          ASTWalker.walk(child, visitor);
        }
      }
    }
  }
}
