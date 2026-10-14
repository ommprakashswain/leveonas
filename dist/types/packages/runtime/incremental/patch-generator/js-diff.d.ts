import { JSProgramNode } from '../../../compiler/interpreters/js-lm/ast';
import { PatchOperation } from './types';
/**
 * Diffs two JSProgramNodes and generates a minimal list of JS patch operations.
 */
export declare function diffJSPrograms(oldProgram: JSProgramNode | null, newProgram: JSProgramNode): PatchOperation[];
