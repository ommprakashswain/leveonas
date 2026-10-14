import { AngularComponentDeclarationNode, AngularProgramNode, AngularUINode } from '../../interpreters/angular-lm/ast';
import { UIIRComponentDeclarationNode, UIIRNode, UIIRProgramNode } from '../types';
/**
 * AngularToLowering Adapter
 * Lowers Angular-LM AST into Common Leveonas UI IR.
 */
export declare class AngularToLowering {
    static lower(program: AngularProgramNode): UIIRProgramNode;
    static lowerComponent(comp: AngularComponentDeclarationNode): UIIRComponentDeclarationNode;
    static lowerUINode(node: AngularUINode): UIIRNode | null;
}
