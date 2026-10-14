import { 
  ASTNode, RootNode, PageNode, SectionNode, ContainerNode, HeroNode,
  ButtonNode, InputNode, TextNode, ImageNode, FormNode, GridNode, CardNode,
  GenericComponentNode, PropertyNode, LiteralNode
} from './nodes';
import { ASTNodeKind } from './types';

export interface ASTVisitor {
  visitRoot?(node: RootNode): void;
  visitPage?(node: PageNode): void;
  visitSection?(node: SectionNode): void;
  visitContainer?(node: ContainerNode): void;
  visitHero?(node: HeroNode): void;
  visitButton?(node: ButtonNode): void;
  visitInput?(node: InputNode): void;
  visitText?(node: TextNode): void;
  visitImage?(node: ImageNode): void;
  visitForm?(node: FormNode): void;
  visitGrid?(node: GridNode): void;
  visitCard?(node: CardNode): void;
  visitGenericComponent?(node: GenericComponentNode): void;
  visitProperty?(node: PropertyNode): void;
  visitLiteral?(node: LiteralNode): void;
}

export function visitNode(node: ASTNode, visitor: ASTVisitor): void {
  switch (node.kind) {
    case ASTNodeKind.Root: if (visitor.visitRoot) visitor.visitRoot(node as RootNode); break;
    case ASTNodeKind.Page: if (visitor.visitPage) visitor.visitPage(node as PageNode); break;
    case ASTNodeKind.Section: if (visitor.visitSection) visitor.visitSection(node as SectionNode); break;
    case ASTNodeKind.Container: if (visitor.visitContainer) visitor.visitContainer(node as ContainerNode); break;
    case ASTNodeKind.Hero: if (visitor.visitHero) visitor.visitHero(node as HeroNode); break;
    case ASTNodeKind.Button: if (visitor.visitButton) visitor.visitButton(node as ButtonNode); break;
    case ASTNodeKind.Input: if (visitor.visitInput) visitor.visitInput(node as InputNode); break;
    case ASTNodeKind.Text: if (visitor.visitText) visitor.visitText(node as TextNode); break;
    case ASTNodeKind.Image: if (visitor.visitImage) visitor.visitImage(node as ImageNode); break;
    case ASTNodeKind.Form: if (visitor.visitForm) visitor.visitForm(node as FormNode); break;
    case ASTNodeKind.Grid: if (visitor.visitGrid) visitor.visitGrid(node as GridNode); break;
    case ASTNodeKind.Card: if (visitor.visitCard) visitor.visitCard(node as CardNode); break;
    case ASTNodeKind.GenericComponent: if (visitor.visitGenericComponent) visitor.visitGenericComponent(node as GenericComponentNode); break;
    case ASTNodeKind.Property: if (visitor.visitProperty) visitor.visitProperty(node as PropertyNode); break;
    case ASTNodeKind.Literal: if (visitor.visitLiteral) visitor.visitLiteral(node as LiteralNode); break;
  }
}
