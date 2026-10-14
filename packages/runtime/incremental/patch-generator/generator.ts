import { ASTNode } from '../../../compiler/ast/nodes';
import { Patch } from './patch';
import { DiffEngine } from './diff';
import { PatchOperation } from './types';

export class PatchGenerator {
  generate(oldAst: ASTNode, newAst: ASTNode): PatchOperation[] {
    const patch = new Patch();
    const diffEngine = new DiffEngine(patch);
    diffEngine.diff(oldAst, newAst);
    return patch.getOperations();
  }
}
