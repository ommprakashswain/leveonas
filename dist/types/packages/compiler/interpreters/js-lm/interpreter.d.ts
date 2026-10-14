import { JSProgramNode, JSASTNode } from './ast';
import { JSLMDiagnostic, JSLMInterpreterOptions } from './types';
export declare class JSLMInterpreter {
    private program;
    private currentLoc;
    private diagnostics;
    private options;
    private buffer;
    private inLineComment;
    private inBlockComment;
    private inString;
    private stringQuote;
    private inTemplateLiteral;
    private templateBraceDepth;
    private escapeNext;
    private parenDepth;
    private braceDepth;
    private bracketDepth;
    private currentUnitText;
    private currentUnitStartLoc;
    constructor(options?: JSLMInterpreterOptions);
    static parse(source: string, options?: JSLMInterpreterOptions): JSProgramNode;
    reset(): void;
    getAST(): JSProgramNode;
    getDiagnostics(): JSLMDiagnostic[];
    hasErrors(): boolean;
    isSafeToExpose(): boolean;
    write(chunk: string): this;
    end(): JSProgramNode;
    private advanceLocation;
    private consumeChar;
    private commitUnit;
    private flushCurrentUnit;
    /**
     * Expands compact LM abbreviations at the start of a statement (c -> const, l -> let, etc.)
     */
    private normalizeLMSyntax;
    private analyzeUnit;
    /**
     * Robust light-weight expression parser that converts expressions into structured AST nodes.
     */
    parseExpression(expr: string, baseId: string): JSASTNode;
}
