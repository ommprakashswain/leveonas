import { ReactProgramNode } from './ast';
import { ReactLMDiagnostic } from './types';
export interface ReactValidationResult {
    isValid: boolean;
    isIncomplete: boolean;
    diagnostics: ReactLMDiagnostic[];
}
export declare function validateReactProgram(program: ReactProgramNode, isFinal?: boolean): ReactValidationResult;
export declare class ReactLMValidator {
    static validate(program: ReactProgramNode, isFinal?: boolean): ReactValidationResult;
}
