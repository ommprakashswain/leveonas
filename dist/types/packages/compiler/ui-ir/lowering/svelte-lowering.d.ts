import { SvelteComponentDeclarationNode, SvelteProgramNode, SvelteUINode } from '../../interpreters/svelte-lm/ast';
import { UIIRComponentDeclarationNode, UIIRNode, UIIRProgramNode } from '../types';
/**
 * Lowers Svelte-LM AST into Common UI IR
 */
export declare class SvelteToLowering {
    static lower(program: SvelteProgramNode): UIIRProgramNode;
    static lowerComponent(decl: SvelteComponentDeclarationNode): UIIRComponentDeclarationNode;
    static lowerUINode(node: SvelteUINode): UIIRNode;
}
