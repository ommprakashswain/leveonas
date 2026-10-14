import { CSSStyleSheetNode } from '../interpreters/css-lm/ast';
import { JSProgramNode } from '../interpreters/js-lm/ast';
import { TSProgramNode } from '../interpreters/ts-lm/ast';
import { ReactProgramNode } from '../interpreters/react-lm/ast';
import { VueProgramNode } from '../interpreters/vue-lm/ast';
import { SvelteProgramNode } from '../interpreters/svelte-lm/ast';
import { AngularProgramNode } from '../interpreters/angular-lm/ast';
import { RootNode } from '../ast/nodes';
import { PatchOperation } from '../../runtime/incremental/patch-generator/types';
export interface LMGenerationPipelineOptions {
    /**
     * Deterministic ID for the application root DOM container.
     * Default: 'leveonas-root'
     */
    rootId?: string;
    /**
     * Callback invoked with typed PatchOperation[] whenever new valid incremental patches are computed.
     */
    onPatch?: (patches: PatchOperation[]) => void;
    /**
     * Callback invoked with raw text chunks as received from the LM stream.
     * For debugging model output as specified in Section 19.
     */
    onText?: (chunk: string) => void;
    /**
     * Callback invoked on fatal pipeline or interpreter errors.
     */
    onError?: (error: Error | string) => void;
    /**
     * Callback invoked when a safe, renderable AST snapshot is committed.
     */
    onASTUpdate?: (ast: RootNode) => void;
    /**
     * Callback invoked when a safe, renderable CSS AST snapshot is committed.
     */
    onCSSASTUpdate?: (cssAst: CSSStyleSheetNode) => void;
    /**
     * Callback invoked when a safe, executable JS AST snapshot is committed.
     */
    onJSASTUpdate?: (jsAst: JSProgramNode) => void;
    /**
     * Callback invoked when a safe TS AST snapshot is committed.
     */
    onTSASTUpdate?: (tsAst: TSProgramNode) => void;
    /**
     * Callback invoked when a safe React AST snapshot is committed.
     */
    onReactASTUpdate?: (reactAst: ReactProgramNode) => void;
    /**
     * Callback invoked when a safe Vue AST snapshot is committed.
     */
    onVueASTUpdate?: (vueAst: VueProgramNode) => void;
    /**
     * Callback invoked when a safe Svelte AST snapshot is committed.
     */
    onSvelteASTUpdate?: (svelteAst: SvelteProgramNode) => void;
    /**
     * Callback invoked when a safe Angular AST snapshot is committed.
     */
    onAngularASTUpdate?: (angularAst: AngularProgramNode) => void;
}
/**
 * Server-side orchestration pipeline for streaming LM generation.
 * Responsibilities:
 * 1. Receive normalized LM chunks from provider stream.
 * 2. Feed stream lexer (LMStreamLexer) to delineate boundary blocks (<HTML>, <CSS>, <JS>, <TS>, <REACT>, <VUE>, <SVELTE>, <ANGULAR>, etc.).
 * 3. Safely route and process HTML-LM, CSS-LM, JS-LM, TS-LM, React-LM, Vue-LM, Svelte-LM, and Angular-LM.
 * 4. Maintain independent server-side AST state per session.
 * 5. Lower TypeScript AST units into existing JavaScript runtime representations.
 * 6. Reconcile React, Vue, Svelte, and Angular Component ASTs into Leveonas DOM representation and JS event/state bindings.
 * 7. Generate minimal incremental patches using PatchGenerator, CSSDiffEngine, and JSDiffEngine.
 * 8. Serialize patches using PatchSerializer and emit stream events with strict error isolation.
 */
export declare class LMGenerationPipeline {
    private rootId;
    private lexer;
    private interpreter;
    private cssInterpreter;
    private jsInterpreter;
    private tsInterpreter;
    private reactInterpreter;
    private vueInterpreter;
    private svelteInterpreter;
    private angularInterpreter;
    private patchGenerator;
    private previousAST;
    private previousCSSAST;
    private previousJSAST;
    private previousTSAST;
    private previousReactAST;
    private previousVueAST;
    private previousSvelteAST;
    private previousAngularAST;
    private activeBlockLanguage;
    private isInsideHTMLBlock;
    private isInsideCSSBlock;
    private isInsideJSBlock;
    private isInsideTSBlock;
    private isInsideReactBlock;
    private isInsideVueBlock;
    private isInsideSvelteBlock;
    private isInsideAngularBlock;
    private isAborted;
    private options;
    constructor(options?: LMGenerationPipelineOptions);
    /**
     * Handle an event from the LM stream lexer.
     * Routes HTML, CSS, JS, TS, React, and Vue blocks to their respective incremental interpreters.
     */
    private handleLexerEvent;
    /**
     * Receive a chunk of raw LM text from the normalized provider stream.
     */
    write(chunk: string): void;
    /**
     * Check whether interpreters are currently in safe, renderable states,
     * and if so, diff against previous ASTs and emit minimal incremental patches.
     * Strictly isolates errors between HTML, CSS, JS, TS, React, and Vue.
     */
    private tryGeneratePatches;
    /**
     * Signal the end of the LM stream.
     * Flushes lexer, finalizes interpreters, and produces any final patches.
     */
    end(): void;
    /**
     * Abort this generation pipeline and release resources (Section 15).
     */
    abort(): void;
    /**
     * Return the previous committed HTML AST snapshot.
     */
    getPreviousAST(): RootNode | null;
    /**
     * Return the current live HTML AST.
     */
    getCurrentAST(): RootNode;
    /**
     * Return the current live CSS AST.
     */
    getCurrentCSSAST(): CSSStyleSheetNode;
    /**
     * Return the current live JS AST.
     */
    getCurrentJSAST(): JSProgramNode;
    /**
     * Return the current live TS AST.
     */
    getCurrentTSAST(): TSProgramNode;
    /**
     * Return the current live React AST.
     */
    getCurrentReactAST(): ReactProgramNode;
    /**
     * Return the current live Vue AST.
     */
    getCurrentVueAST(): VueProgramNode;
    /**
     * Return the current live Svelte AST.
     */
    getCurrentSvelteAST(): SvelteProgramNode;
    /**
     * Return diagnostics collected during parsing from all interpreters.
     */
    getDiagnostics(): (import("../interpreters/html-lm").HTMLLMDiagnostic | import("../interpreters/react-lm").ReactLMDiagnostic)[];
}
