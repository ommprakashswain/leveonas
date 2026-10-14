import { SvelteLMDiagnostic } from './types';
import { SvelteProgramNode } from './ast';
export declare class SvelteLMValidator {
    static validate(program: SvelteProgramNode): SvelteLMDiagnostic[];
}
