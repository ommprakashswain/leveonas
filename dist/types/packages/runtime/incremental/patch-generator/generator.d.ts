import { ASTNode } from '../../../compiler/ast/nodes';
import { PatchOperation } from './types';
export declare class PatchGenerator {
    generate(oldAst: ASTNode, newAst: ASTNode): PatchOperation[];
}
