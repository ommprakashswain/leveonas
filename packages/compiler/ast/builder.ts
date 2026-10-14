import { ASTFactory } from './factory';
import { ASTNodeKind, SourceLocation } from './types';
import { ComponentNode, RootNode, ASTNode } from './nodes';

export class ASTBuilder {
  private current: ComponentNode | null = null;
  private root: RootNode | null = null;
  private stack: ComponentNode[] = [];

  constructor() {
    this.root = ASTFactory.createComponent(ASTNodeKind.Root, this.emptyLoc()) as RootNode;
    this.current = this.root;
    this.stack.push(this.root);
  }

  public getRoot(): RootNode {
    return this.root!;
  }

  public enterComponent(kind: ASTNodeKind, loc?: SourceLocation, name?: string): this {
    const comp = ASTFactory.createComponent(kind, loc || this.emptyLoc(), [], [], name);
    this.current!.children.push(comp as unknown as ASTNode);
    comp.parent = this.current as unknown as ASTNode;
    this.current = comp;
    this.stack.push(comp);
    return this;
  }

  public exitComponent(): this {
    if (this.stack.length > 1) {
      this.stack.pop();
      this.current = this.stack[this.stack.length - 1];
    }
    return this;
  }

  public addProperty(name: string, value: string | number | boolean | null, raw?: string, loc?: SourceLocation): this {
    if (!this.current || this.current.kind === ASTNodeKind.Literal || this.current.kind === ASTNodeKind.Property) return this;
    
    const literal = value !== null ? ASTFactory.createLiteral(value, raw || String(value), loc || this.emptyLoc()) : null;
    const prop = ASTFactory.createProperty(name, literal, loc || this.emptyLoc());
    prop.parent = this.current as unknown as ASTNode;
    this.current.properties.push(prop);
    return this;
  }

  private emptyLoc(): SourceLocation {
    return ASTFactory.createSourceLocation(0, 0, 0, 0, 0, 0);
  }
}
