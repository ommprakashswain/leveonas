import { ReactComponentDeclarationNode, ReactProgramNode, ReactUINode } from '../../interpreters/react-lm/ast';
import { UIIRComponentDeclarationNode, UIIRNode, UIIRProgramNode } from '../types';
/**
 * Lowers React-LM AST into Common UI IR
 */
export declare class ReactToLowering {
    static lower(program: ReactProgramNode): UIIRProgramNode;
    static lowerComponent(decl: ReactComponentDeclarationNode): UIIRComponentDeclarationNode;
    static lowerUINode(node: ReactUINode): UIIRNode;
}
