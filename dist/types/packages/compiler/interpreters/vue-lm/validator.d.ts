import { VueLMDiagnostic } from './types';
import { VueProgramNode } from './ast';
export declare class VueLMValidator {
    static validate(program: VueProgramNode): VueLMDiagnostic[];
}
