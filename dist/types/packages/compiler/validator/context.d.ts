import { ASTNode } from '../ast/nodes';
import { DiagnosticBag } from './diagnostics';
import { SourceLocation } from '../ast/types';
export declare class ValidationContext {
    rootNode: ASTNode;
    diagnostics: DiagnosticBag;
    constructor(rootNode: ASTNode);
    reportError(code: string, message: string, loc: SourceLocation, fix?: string): void;
    reportWarning(code: string, message: string, loc: SourceLocation, fix?: string): void;
    reportInfo(code: string, message: string, loc: SourceLocation, fix?: string): void;
}
