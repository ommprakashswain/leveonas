import { ASTNode } from '../ast/nodes';
import { Diagnostic, ValidationRule } from './types';
export declare class SemanticValidator {
    private rules;
    constructor();
    addRule(rule: ValidationRule): void;
    validate(rootNode: ASTNode): Diagnostic[];
}
