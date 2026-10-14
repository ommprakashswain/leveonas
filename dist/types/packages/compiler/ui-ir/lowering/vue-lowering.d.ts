import { VueComponentDeclarationNode, VueProgramNode, VueUINode } from '../../interpreters/vue-lm/ast';
import { UIIRComponentDeclarationNode, UIIRNode, UIIRProgramNode } from '../types';
/**
 * Lowers Vue-LM AST into Common UI IR
 */
export declare class VueToLowering {
    static lower(program: VueProgramNode): UIIRProgramNode;
    static lowerComponent(decl: VueComponentDeclarationNode): UIIRComponentDeclarationNode;
    static lowerUINode(node: VueUINode): UIIRNode;
}
