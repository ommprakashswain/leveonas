import { SourceLocation } from '../../ast/types';
import { TSUnitKind, TSUnitClassification } from './types';
export declare enum TSNodeKind {
    Program = "TSProgram",
    Unit = "TSUnit",
    VariableDeclaration = "TSVariableDeclaration",
    FunctionDeclaration = "TSFunctionDeclaration",
    InterfaceDeclaration = "TSInterfaceDeclaration",
    TypeAliasDeclaration = "TSTypeAliasDeclaration",
    ClassDeclaration = "TSClassDeclaration",
    EnumDeclaration = "TSEnumDeclaration",
    EventHandler = "TSEventHandler",
    DOMOperation = "TSDOMOperation",
    Timer = "TSTimer",
    ImportDeclaration = "TSImportDeclaration",
    ExportDeclaration = "TSExportDeclaration",
    ExpressionStatement = "TSExpressionStatement"
}
export interface TSBaseNode {
    id: string;
    kind: TSNodeKind;
    sourceLocation?: SourceLocation;
}
export interface TSPropertySignature {
    name: string;
    typeAnnotation: string;
    isOptional: boolean;
    isReadonly?: boolean;
}
export interface TSMethodSignature {
    name: string;
    params: Array<{
        name: string;
        typeAnnotation: string;
        isOptional?: boolean;
    }>;
    returnType: string;
    typeParams?: string[];
}
export interface TSInterfaceDeclarationNode extends TSBaseNode {
    kind: TSNodeKind.InterfaceDeclaration;
    name: string;
    typeParams?: string[];
    extends?: string[];
    properties: TSPropertySignature[];
    methods: TSMethodSignature[];
    rawBody: string;
}
export interface TSTypeAliasDeclarationNode extends TSBaseNode {
    kind: TSNodeKind.TypeAliasDeclaration;
    name: string;
    typeParams?: string[];
    typeDefinition: string;
}
export interface TSVariableDeclarationNode extends TSBaseNode {
    kind: TSNodeKind.VariableDeclaration;
    varKind: 'const' | 'let' | 'var';
    identifier: string;
    typeAnnotation?: string;
    initialValue?: string;
}
export interface TSFunctionDeclarationNode extends TSBaseNode {
    kind: TSNodeKind.FunctionDeclaration;
    name: string;
    typeParams?: string[];
    params: Array<{
        name: string;
        typeAnnotation?: string;
        isOptional?: boolean;
        defaultValue?: string;
    }>;
    returnType?: string;
    body: string;
    isAsync?: boolean;
}
export interface TSClassProperty {
    name: string;
    typeAnnotation?: string;
    initialValue?: string;
    isStatic?: boolean;
    visibility?: 'public' | 'private' | 'protected';
    isReadonly?: boolean;
}
export interface TSClassMethod {
    name: string;
    typeParams?: string[];
    params: Array<{
        name: string;
        typeAnnotation?: string;
        isOptional?: boolean;
    }>;
    returnType?: string;
    body: string;
    isStatic?: boolean;
    isAsync?: boolean;
    visibility?: 'public' | 'private' | 'protected';
}
export interface TSClassDeclarationNode extends TSBaseNode {
    kind: TSNodeKind.ClassDeclaration;
    name: string;
    typeParams?: string[];
    extends?: string;
    implements?: string[];
    properties: TSClassProperty[];
    methods: TSClassMethod[];
    rawBody: string;
}
export interface TSEnumMember {
    name: string;
    value?: string | number;
}
export interface TSEnumDeclarationNode extends TSBaseNode {
    kind: TSNodeKind.EnumDeclaration;
    name: string;
    members: TSEnumMember[];
    isConst?: boolean;
}
export interface TSEventHandlerNode extends TSBaseNode {
    kind: TSNodeKind.EventHandler;
    eventName: string;
    targetSelector: string;
    handlerCode: string;
    paramTypes?: Record<string, string>;
    debounceMs?: number;
}
export interface TSDOMOperationNode extends TSBaseNode {
    kind: TSNodeKind.DOMOperation;
    operation: string;
    targetSelector: string;
    args: string[];
}
export interface TSTimerNode extends TSBaseNode {
    kind: TSNodeKind.Timer;
    timerType: 'setTimeout' | 'setInterval';
    callbackCode: string;
    delayMs: number;
}
export interface TSImportDeclarationNode extends TSBaseNode {
    kind: TSNodeKind.ImportDeclaration;
    isTypeOnly: boolean;
    importedSymbols: string[];
    moduleSpecifier: string;
    isSupportedAtRuntime: boolean;
}
export interface TSExportDeclarationNode extends TSBaseNode {
    kind: TSNodeKind.ExportDeclaration;
    isTypeOnly: boolean;
    exportedSymbols: string[];
    declarationCode?: string;
}
export interface TSExpressionStatementNode extends TSBaseNode {
    kind: TSNodeKind.ExpressionStatement;
    code: string;
}
export interface TSUnitNode extends TSBaseNode {
    kind: TSNodeKind.Unit;
    unitKind: TSUnitKind;
    classification: TSUnitClassification;
    code: string;
    rawCode: string;
    loweredCode?: string;
    isComplete: boolean;
    meta?: {
        eventName?: string;
        targetSelector?: string;
        identifier?: string;
        functionName?: string;
        interfaceName?: string;
        typeName?: string;
        className?: string;
        enumName?: string;
        timerType?: string;
        delayMs?: number;
    };
    details?: TSVariableDeclarationNode | TSFunctionDeclarationNode | TSInterfaceDeclarationNode | TSTypeAliasDeclarationNode | TSClassDeclarationNode | TSEnumDeclarationNode | TSEventHandlerNode | TSDOMOperationNode | TSTimerNode | TSImportDeclarationNode | TSExportDeclarationNode | TSExpressionStatementNode;
}
export interface TSProgramNode extends TSBaseNode {
    kind: TSNodeKind.Program;
    units: TSUnitNode[];
}
export declare function getTSProgramId(): string;
export declare function getTSUnitId(unitKind: string, signature: string, disambiguator?: number): string;
export declare function getTSEventHandlerId(eventName: string, selector: string, disambiguator?: number): string;
export declare function getTSTimerId(timerType: string, disambiguator?: number): string;
