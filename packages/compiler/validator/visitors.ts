import { ValidationContext } from './context';
import { ASTVisitor } from '../ast/visitor';
import { ASTNodeKind } from '../ast/types';
import { ComponentNode, GenericComponentNode, PropertyNode } from '../ast/nodes';

export function createVisitorForRules(context: ValidationContext, visitors: ASTVisitor[]): ASTVisitor {
  return {
    visitRoot(node) { visitors.forEach(v => v.visitRoot?.(node)); },
    visitPage(node) { visitors.forEach(v => v.visitPage?.(node)); },
    visitSection(node) { visitors.forEach(v => v.visitSection?.(node)); },
    visitContainer(node) { visitors.forEach(v => v.visitContainer?.(node)); },
    visitHero(node) { visitors.forEach(v => v.visitHero?.(node)); },
    visitButton(node) { visitors.forEach(v => v.visitButton?.(node)); },
    visitInput(node) { visitors.forEach(v => v.visitInput?.(node)); },
    visitText(node) { visitors.forEach(v => v.visitText?.(node)); },
    visitImage(node) { visitors.forEach(v => v.visitImage?.(node)); },
    visitForm(node) { visitors.forEach(v => v.visitForm?.(node)); },
    visitGrid(node) { visitors.forEach(v => v.visitGrid?.(node)); },
    visitCard(node) { visitors.forEach(v => v.visitCard?.(node)); },
    visitGenericComponent(node) { visitors.forEach(v => v.visitGenericComponent?.(node)); },
    visitProperty(node) { visitors.forEach(v => v.visitProperty?.(node)); },
    visitLiteral(node) { visitors.forEach(v => v.visitLiteral?.(node)); }
  };
}

// A base visitor to easily visit any component node
export function createComponentVisitor(visit: (node: ComponentNode) => void): ASTVisitor {
  return {
    visitRoot: visit,
    visitPage: visit,
    visitSection: visit,
    visitContainer: visit,
    visitHero: visit,
    visitButton: visit,
    visitInput: visit,
    visitText: visit,
    visitImage: visit,
    visitForm: visit,
    visitGrid: visit,
    visitCard: visit,
    visitGenericComponent: visit
  };
}
