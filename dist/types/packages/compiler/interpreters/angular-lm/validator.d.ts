import { AngularProgramNode } from './ast';
import { AngularLMDiagnostic } from './types';
export declare class AngularLMValidator {
    static validate(program: AngularProgramNode): AngularLMDiagnostic[];
    private static validateComponent;
}
