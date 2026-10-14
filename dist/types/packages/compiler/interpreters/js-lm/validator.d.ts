import { JSProgramNode } from './ast';
import { JSLMDiagnostic } from './types';
/**
 * Structural validation of JS-LM AST before execution or diffing.
 */
export declare function validateJSAST(program: JSProgramNode): JSLMDiagnostic[];
