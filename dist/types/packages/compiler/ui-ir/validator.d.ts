import { UIIRProgramNode } from './types';
export interface UIIRDiagnostic {
    severity: 'error' | 'warning' | 'info';
    message: string;
    componentName?: string;
    nodeId?: string;
}
export declare class UIIRValidator {
    static validate(program: UIIRProgramNode): UIIRDiagnostic[];
    private static validateComponent;
    private static validateNode;
}
