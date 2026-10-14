import { TSProgramNode } from './ast';
import { TSLMDiagnostic } from './types';
export interface TSValidationResult {
    isValid: boolean;
    isIncomplete: boolean;
    diagnostics: TSLMDiagnostic[];
}
/**
 * Validates TypeScript code syntax.
 * Distinguishes INCOMPLETE streaming state from genuine INVALID syntax.
 */
export declare function validateTSCode(code: string, isFinal?: boolean): TSValidationResult;
/**
 * Validates a TSProgramNode.
 */
export declare function validateTSProgram(program: TSProgramNode, isFinal?: boolean): TSValidationResult;
