import { RootNode } from '../../ast/nodes';
import { HTMLLMDiagnostic, HTMLLMInterpreterOptions } from './types';
export declare class HTMLLMInterpreter {
    private root;
    private elementStack;
    private activeAttribute;
    private pendingIdent;
    private pendingIdentStartLoc;
    private currentLoc;
    private diagnostics;
    private options;
    constructor(options?: HTMLLMInterpreterOptions);
    /**
     * Reset interpreter state for a fresh parse.
     */
    reset(): void;
    /**
     * Return the canonical AST RootNode.
     */
    getAST(): RootNode;
    /**
     * Return diagnostics collected during parsing.
     */
    getDiagnostics(): HTMLLMDiagnostic[];
    hasErrors(): boolean;
    hasPendingTokens(): boolean;
    getElementStackDepth(): number;
    /**
     * Checks if the interpreter's current AST state is safely recoverable and exposed to downstream renderers.
     * An AST state is safe to expose if:
     * 1. At least one element has been constructed (root has children).
     * 2. No attribute command is currently mid-parse (activeAttribute is null).
     * 3. No pending token/identifier is in flight (pendingIdent is empty).
     * 4. No unclosed text is currently buffered on the deepest open element.
     * 5. No fatal parsing errors have been logged.
     */
    isSafeToExpose(): boolean;
    /**
     * Write an arbitrary chunk of streaming HTML-LM content.
     */
    write(chunk: string): this;
    /**
     * Finalize the stream and flush any pending partial constructs.
     */
    end(): RootNode;
    /**
     * Parse a complete HTML-LM source string.
     */
    static parse(source: string, options?: HTMLLMInterpreterOptions): RootNode;
    private consumeChar;
    private handleAttributeChar;
    private closeAttribute;
    private handleGeneralChar;
    private openElement;
    private closeElement;
    private flushTextBuffer;
    private getCurrentElement;
    private isIdentifierChar;
    private isWhitespaceChar;
    private reportDiagnostic;
}
