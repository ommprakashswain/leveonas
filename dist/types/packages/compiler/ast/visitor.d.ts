import { ASTNode, RootNode, PageNode, SectionNode, ContainerNode, HeroNode, ButtonNode, InputNode, TextNode, ImageNode, FormNode, GridNode, CardNode, GenericComponentNode, PropertyNode, LiteralNode } from './nodes';
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
export declare function visitNode(node: ASTNode, visitor: ASTVisitor): void;
