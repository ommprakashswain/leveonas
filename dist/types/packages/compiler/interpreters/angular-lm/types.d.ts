import { SourceLocation } from '../../ast/types';
export interface AngularLMDiagnostic {
    severity: 'error' | 'warning' | 'info';
    message: string;
    sourceLocation?: SourceLocation;
    code?: string;
}
export interface AngularLMInterpreterOptions {
    strictMode?: boolean;
    allowCustomComponents?: boolean;
    defaultRootComponent?: string;
}
export interface AngularReactivityBinding {
    type: 'EVENT' | 'PROPERTY' | 'CLASS' | 'STYLE' | 'TWO_WAY';
    targetSelector: string;
    targetProperty?: string;
    expression: string;
    handlerName?: string;
}
