import { LMStreamLexer, LMBlockEvent, LMBlockEventType } from '../lexer';
import { HTMLLMInterpreter } from '../interpreters/html-lm/interpreter';
import { CSSLMInterpreter } from '../interpreters/css-lm/interpreter';
import { CSSStyleSheetNode } from '../interpreters/css-lm/ast';
import { JSLMInterpreter } from '../interpreters/js-lm/interpreter';
import { JSProgramNode } from '../interpreters/js-lm/ast';
import { TSLMInterpreter } from '../interpreters/ts-lm/interpreter';
import { TSProgramNode } from '../interpreters/ts-lm/ast';
import { convertTSProgramToJSProgram } from '../interpreters/ts-lm/lowering';
import { ReactLMInterpreter } from '../interpreters/react-lm/interpreter';
import { ReactProgramNode } from '../interpreters/react-lm/ast';
import { ReactReconciler } from '../interpreters/react-lm/reconciler';
import { VueLMInterpreter } from '../interpreters/vue-lm/interpreter';
import { VueProgramNode } from '../interpreters/vue-lm/ast';
import { VueReconciler } from '../interpreters/vue-lm/reconciler';
import { SvelteLMInterpreter } from '../interpreters/svelte-lm/interpreter';
import { SvelteProgramNode } from '../interpreters/svelte-lm/ast';
import { SvelteReconciler } from '../interpreters/svelte-lm/reconciler';
import { AngularLMInterpreter } from '../interpreters/angular-lm/interpreter';
import { AngularProgramNode } from '../interpreters/angular-lm/ast';
import { AngularReconciler } from '../interpreters/angular-lm/reconciler';
import { RootNode, ASTNode } from '../ast/nodes';
import { ASTNodeKind, SourceLocation } from '../ast/types';
import { ASTFactory } from '../ast/factory';
import { cloneASTNode } from '../ast/clone';
import { PatchGenerator } from '../../runtime/incremental/patch-generator/generator';
import { diffCSSStyleSheets } from '../../runtime/incremental/patch-generator/css-diff';
import { diffJSPrograms } from '../../runtime/incremental/patch-generator/js-diff';
import { PatchSerializer } from '../../runtime/incremental/patch-generator/serializer';
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
export class LMGenerationPipeline {
  private rootId: string;
  private lexer: LMStreamLexer;
  private interpreter: HTMLLMInterpreter;
  private cssInterpreter: CSSLMInterpreter;
  private jsInterpreter: JSLMInterpreter;
  private tsInterpreter: TSLMInterpreter;
  private reactInterpreter: ReactLMInterpreter;
  private vueInterpreter: VueLMInterpreter;
  private svelteInterpreter: SvelteLMInterpreter;
  private angularInterpreter: AngularLMInterpreter;
  private patchGenerator: PatchGenerator;
  private previousAST: RootNode | null = null;
  private previousCSSAST: CSSStyleSheetNode | null = null;
  private previousJSAST: JSProgramNode | null = null;
  private previousTSAST: TSProgramNode | null = null;
  private previousReactAST: ReactProgramNode | null = null;
  private previousVueAST: VueProgramNode | null = null;
  private previousSvelteAST: SvelteProgramNode | null = null;
  private previousAngularAST: AngularProgramNode | null = null;
  private activeBlockLanguage: string | null = null;
  private isInsideHTMLBlock: boolean = false;
  private isInsideCSSBlock: boolean = false;
  private isInsideJSBlock: boolean = false;
  private isInsideTSBlock: boolean = false;
  private isInsideReactBlock: boolean = false;
  private isInsideVueBlock: boolean = false;
  private isInsideSvelteBlock: boolean = false;
  private isInsideAngularBlock: boolean = false;
  private isAborted: boolean = false;
  private options: LMGenerationPipelineOptions;

  constructor(options: LMGenerationPipelineOptions = {}) {
    this.options = options;
    this.rootId = options.rootId || 'leveonas-root';
    this.patchGenerator = new PatchGenerator();

    // Isolated HTML interpreter for this request/session
    this.interpreter = new HTMLLMInterpreter({
      onError: (diagnostic) => {
        if (diagnostic.severity === 'error') {
          this.options.onError?.(new Error(`HTML-LM Parser Error: ${diagnostic.message}`));
        }
      },
    });

    // Isolated CSS interpreter for this request/session
    this.cssInterpreter = new CSSLMInterpreter({
      onError: (diagnostic) => {
        if (diagnostic.severity === 'error') {
          this.options.onError?.(new Error(`CSS-LM Parser Error: ${diagnostic.message}`));
        }
      },
    });

    // Isolated JS interpreter for this request/session
    this.jsInterpreter = new JSLMInterpreter({
      onError: (diagnostic) => {
        if (diagnostic.severity === 'error') {
          this.options.onError?.(new Error(`JS-LM Parser Error: ${diagnostic.message}`));
        }
      },
    });

    // Isolated TS interpreter for this request/session
    this.tsInterpreter = new TSLMInterpreter({
      onError: (diagnostic) => {
        if (diagnostic.severity === 'error') {
          this.options.onError?.(new Error(`TS-LM Parser Error: ${diagnostic.message}`));
        }
      },
    });

    // Isolated React interpreter for this request/session
    this.reactInterpreter = new ReactLMInterpreter({
      onError: (diagnostic) => {
        if (diagnostic.severity === 'error') {
          this.options.onError?.(new Error(`React-LM Parser Error: ${diagnostic.message}`));
        }
      },
    });

    // Isolated Vue interpreter for this request/session
    this.vueInterpreter = new VueLMInterpreter({
      onError: (diagnostic) => {
        if (diagnostic.severity === 'error') {
          this.options.onError?.(new Error(`Vue-LM Parser Error: ${diagnostic.message}`));
        }
      },
    });

    // Isolated Svelte interpreter for this request/session
    this.svelteInterpreter = new SvelteLMInterpreter({
      onError: (diagnostic) => {
        if (diagnostic.severity === 'error') {
          this.options.onError?.(new Error(`Svelte-LM Parser Error: ${diagnostic.message}`));
        }
      },
    });

    // Isolated Angular interpreter for this request/session
    this.angularInterpreter = new AngularLMInterpreter();

    // Isolated stream lexer for this request/session
    this.lexer = new LMStreamLexer({
      supportedLanguages: [
        'HTML',
        'CSS',
        'JS',
        'TS',
        'TYPESCRIPT',
        'REACT',
        'REACT-LM',
        'VUE',
        'VUE-LM',
        'NEXTJS',
        'TAILWIND',
        'SVELTE',
        'ANGULAR',
        'ANGULAR-LM',
      ],
      emitTextEvents: true,
    });
    this.lexer.on((event: LMBlockEvent) => {
      this.handleLexerEvent(event);
    });
  }

  /**
   * Handle an event from the LM stream lexer.
   * Routes HTML, CSS, JS, TS, React, and Vue blocks to their respective incremental interpreters.
   */
  private handleLexerEvent(event: LMBlockEvent): void {
    if (this.isAborted) return;

    switch (event.type) {
      case LMBlockEventType.BLOCK_START: {
        const lang = (event.language || '').toUpperCase();
        this.activeBlockLanguage = lang;
        if (lang === 'HTML') {
          this.isInsideHTMLBlock = true;
          this.isInsideCSSBlock = false;
          this.isInsideJSBlock = false;
          this.isInsideTSBlock = false;
          this.isInsideReactBlock = false;
          this.isInsideVueBlock = false;
        } else if (lang === 'CSS') {
          this.isInsideCSSBlock = true;
          this.isInsideHTMLBlock = false;
          this.isInsideJSBlock = false;
          this.isInsideTSBlock = false;
          this.isInsideReactBlock = false;
          this.isInsideVueBlock = false;
        } else if (lang === 'JS' || lang === 'JAVASCRIPT') {
          this.isInsideJSBlock = true;
          this.isInsideHTMLBlock = false;
          this.isInsideCSSBlock = false;
          this.isInsideTSBlock = false;
          this.isInsideReactBlock = false;
          this.isInsideVueBlock = false;
        } else if (lang === 'TS' || lang === 'TYPESCRIPT') {
          this.isInsideTSBlock = true;
          this.isInsideHTMLBlock = false;
          this.isInsideCSSBlock = false;
          this.isInsideJSBlock = false;
          this.isInsideReactBlock = false;
          this.isInsideVueBlock = false;
        } else if (lang === 'REACT' || lang === 'REACT-LM') {
          this.isInsideReactBlock = true;
          this.isInsideHTMLBlock = false;
          this.isInsideCSSBlock = false;
          this.isInsideJSBlock = false;
          this.isInsideTSBlock = false;
          this.isInsideVueBlock = false;
        } else if (lang === 'VUE' || lang === 'VUE-LM') {
          this.isInsideVueBlock = true;
          this.isInsideHTMLBlock = false;
          this.isInsideCSSBlock = false;
          this.isInsideJSBlock = false;
          this.isInsideTSBlock = false;
          this.isInsideReactBlock = false;
          this.isInsideSvelteBlock = false;
        } else if (lang === 'SVELTE' || lang === 'SVELTE-LM') {
          this.isInsideSvelteBlock = true;
          this.isInsideHTMLBlock = false;
          this.isInsideCSSBlock = false;
          this.isInsideJSBlock = false;
          this.isInsideTSBlock = false;
          this.isInsideReactBlock = false;
          this.isInsideVueBlock = false;
          this.isInsideAngularBlock = false;
        } else if (lang === 'ANGULAR' || lang === 'ANGULAR-LM') {
          this.isInsideAngularBlock = true;
          this.isInsideHTMLBlock = false;
          this.isInsideCSSBlock = false;
          this.isInsideJSBlock = false;
          this.isInsideTSBlock = false;
          this.isInsideReactBlock = false;
          this.isInsideVueBlock = false;
          this.isInsideSvelteBlock = false;
        } else {
          this.isInsideHTMLBlock = false;
          this.isInsideCSSBlock = false;
          this.isInsideJSBlock = false;
          this.isInsideTSBlock = false;
          this.isInsideReactBlock = false;
          this.isInsideVueBlock = false;
          this.isInsideSvelteBlock = false;
          this.isInsideAngularBlock = false;
        }
        break;
      }

      case LMBlockEventType.BLOCK_CONTENT: {
        const lang = (event.language || this.activeBlockLanguage || '').toUpperCase();
        if (lang === 'HTML') {
          this.interpreter.write(event.content);
        } else if (lang === 'CSS') {
          this.cssInterpreter.write(event.content);
        } else if (lang === 'JS' || lang === 'JAVASCRIPT') {
          this.jsInterpreter.write(event.content);
        } else if (lang === 'TS' || lang === 'TYPESCRIPT') {
          this.tsInterpreter.write(event.content);
        } else if (lang === 'REACT' || lang === 'REACT-LM') {
          this.reactInterpreter.write(event.content);
        } else if (lang === 'VUE' || lang === 'VUE-LM') {
          this.vueInterpreter.write(event.content);
        } else if (lang === 'SVELTE' || lang === 'SVELTE-LM') {
          this.svelteInterpreter.write(event.content);
        } else if (lang === 'ANGULAR' || lang === 'ANGULAR-LM') {
          this.angularInterpreter.write(event.content);
        }
        break;
      }

      case LMBlockEventType.BLOCK_END: {
        const lang = (event.language || '').toUpperCase();
        if (lang === 'HTML') {
          this.isInsideHTMLBlock = false;
        } else if (lang === 'CSS') {
          this.isInsideCSSBlock = false;
        } else if (lang === 'JS' || lang === 'JAVASCRIPT') {
          this.isInsideJSBlock = false;
        } else if (lang === 'TS' || lang === 'TYPESCRIPT') {
          this.isInsideTSBlock = false;
        } else if (lang === 'REACT' || lang === 'REACT-LM') {
          this.isInsideReactBlock = false;
        } else if (lang === 'VUE' || lang === 'VUE-LM') {
          this.isInsideVueBlock = false;
        } else if (lang === 'SVELTE' || lang === 'SVELTE-LM') {
          this.isInsideSvelteBlock = false;
        } else if (lang === 'ANGULAR' || lang === 'ANGULAR-LM') {
          this.isInsideAngularBlock = false;
        }
        this.activeBlockLanguage = null;
        break;
      }

      case LMBlockEventType.TEXT: {
        // If content arrived outside of explicit boundary blocks, default to HTML interpreter if not empty
        if (
          !this.isInsideHTMLBlock &&
          !this.isInsideCSSBlock &&
          !this.isInsideJSBlock &&
          !this.isInsideTSBlock &&
          !this.isInsideReactBlock &&
          !this.isInsideVueBlock &&
          !this.isInsideSvelteBlock &&
          event.content
        ) {
          this.interpreter.write(event.content);
        }
        break;
      }
    }
  }

  /**
   * Receive a chunk of raw LM text from the normalized provider stream.
   */
  public write(chunk: string): void {
    if (this.isAborted || !chunk) return;

    // Emit raw text event for debugging (Section 19)
    this.options.onText?.(chunk);

    // Push into lexer
    try {
      this.lexer.push(chunk);
    } catch (err: any) {
      this.options.onError?.(err);
      return;
    }

    // After consuming chunk, evaluate whether ASTs have reached safe renderable states
    this.tryGeneratePatches(false);
  }

  /**
   * Check whether interpreters are currently in safe, renderable states,
   * and if so, diff against previous ASTs and emit minimal incremental patches.
   * Strictly isolates errors between HTML, CSS, JS, TS, React, and Vue.
   */
  private tryGeneratePatches(isFinal: boolean): void {
    if (this.isAborted) return;

    const patchesToEmit: PatchOperation[] = [];

    // 1. Process React AST (Reconciled to DOM & JS)
    let processedReact = false;
    try {
      if (isFinal || this.reactInterpreter.isSafeToExpose()) {
        const currentReact = this.reactInterpreter.getAST();
        if (currentReact && currentReact.components.length > 0) {
          processedReact = true;
          this.previousReactAST = JSON.parse(JSON.stringify(currentReact));
          this.options.onReactASTUpdate?.(this.previousReactAST!);

          const reconciler = new ReactReconciler(currentReact);
          const { domAST: reconciledDOM, jsProgram: reconciledJS } = reconciler.reconcile();

          // Diff Reconciled DOM AST against previousAST
          if (reconciledDOM && reconciledDOM.children.length > 0) {
            if (this.previousAST === null) {
              const loc: SourceLocation = {
                startLine: 1,
                startColumn: 1,
                startOffset: 0,
                endLine: 1,
                endColumn: 1,
                endOffset: 0,
              };
              const initialRoot = ASTFactory.createComponent(ASTNodeKind.Root, loc, [], []) as RootNode;
              initialRoot.id = this.rootId;

              const reactDOMPatches = this.patchGenerator.generate(initialRoot, reconciledDOM);
              if (reactDOMPatches.length > 0) {
                this.previousAST = cloneASTNode(reconciledDOM);
                this.options.onASTUpdate?.(this.previousAST);
                patchesToEmit.push(...reactDOMPatches);
              }
            } else {
              const reactDOMPatches = this.patchGenerator.generate(this.previousAST, reconciledDOM);
              if (reactDOMPatches.length > 0) {
                this.previousAST = cloneASTNode(reconciledDOM);
                this.options.onASTUpdate?.(this.previousAST);
                patchesToEmit.push(...reactDOMPatches);
              }
            }
          }

          // Diff Reconciled JS against previousJSAST
          if (reconciledJS && reconciledJS.units.length > 0) {
            const reactJSPatches = diffJSPrograms(this.previousJSAST, reconciledJS);
            if (reactJSPatches.length > 0) {
              this.previousJSAST = JSON.parse(JSON.stringify(reconciledJS));
              this.options.onJSASTUpdate?.(this.previousJSAST!);
              patchesToEmit.push(...reactJSPatches);
            }
          }
        }
      }
    } catch (err: any) {
      this.options.onError?.(err);
    }

    // 2. Process Vue AST (Reconciled to DOM & JS)
    let processedVue = false;
    try {
      if (isFinal || this.vueInterpreter.isSafeToExpose()) {
        const currentVue = this.vueInterpreter.getAST();
        if (currentVue && currentVue.components.length > 0) {
          processedVue = true;
          this.previousVueAST = JSON.parse(JSON.stringify(currentVue));
          this.options.onVueASTUpdate?.(this.previousVueAST!);

          const reconciler = new VueReconciler(currentVue);
          const { domAST: reconciledDOM, jsProgram: reconciledJS } = reconciler.reconcile();

          // Diff Reconciled DOM AST against previousAST
          if (reconciledDOM && reconciledDOM.children.length > 0) {
            if (this.previousAST === null) {
              const loc: SourceLocation = {
                startLine: 1,
                startColumn: 1,
                startOffset: 0,
                endLine: 1,
                endColumn: 1,
                endOffset: 0,
              };
              const initialRoot = ASTFactory.createComponent(ASTNodeKind.Root, loc, [], []) as RootNode;
              initialRoot.id = this.rootId;

              const vueDOMPatches = this.patchGenerator.generate(initialRoot, reconciledDOM);
              if (vueDOMPatches.length > 0) {
                this.previousAST = cloneASTNode(reconciledDOM);
                this.options.onASTUpdate?.(this.previousAST);
                patchesToEmit.push(...vueDOMPatches);
              }
            } else {
              const vueDOMPatches = this.patchGenerator.generate(this.previousAST, reconciledDOM);
              if (vueDOMPatches.length > 0) {
                this.previousAST = cloneASTNode(reconciledDOM);
                this.options.onASTUpdate?.(this.previousAST);
                patchesToEmit.push(...vueDOMPatches);
              }
            }
          }

          // Diff Reconciled JS against previousJSAST
          if (reconciledJS && reconciledJS.units.length > 0) {
            const vueJSPatches = diffJSPrograms(this.previousJSAST, reconciledJS);
            if (vueJSPatches.length > 0) {
              this.previousJSAST = JSON.parse(JSON.stringify(reconciledJS));
              this.options.onJSASTUpdate?.(this.previousJSAST!);
              patchesToEmit.push(...vueJSPatches);
            }
          }
        }
      }
    } catch (err: any) {
      this.options.onError?.(err);
    }

    // 3. Process Svelte AST (Reconciled to DOM & JS)
    let processedSvelte = false;
    try {
      if (isFinal || this.svelteInterpreter.isSafeToExpose()) {
        const currentSvelte = this.svelteInterpreter.getAST();
        if (currentSvelte && currentSvelte.components.length > 0) {
          processedSvelte = true;
          this.previousSvelteAST = JSON.parse(JSON.stringify(currentSvelte));
          this.options.onSvelteASTUpdate?.(this.previousSvelteAST!);

          const reconciler = new SvelteReconciler(currentSvelte);
          const { domAST: reconciledDOM, jsProgram: reconciledJS } = reconciler.reconcile();

          // Diff Reconciled DOM AST against previousAST
          if (reconciledDOM && reconciledDOM.children.length > 0) {
            if (this.previousAST === null) {
              const loc: SourceLocation = {
                startLine: 1,
                startColumn: 1,
                startOffset: 0,
                endLine: 1,
                endColumn: 1,
                endOffset: 0,
              };
              const initialRoot = ASTFactory.createComponent(ASTNodeKind.Root, loc, [], []) as RootNode;
              initialRoot.id = this.rootId;

              const svelteDOMPatches = this.patchGenerator.generate(initialRoot, reconciledDOM);
              if (svelteDOMPatches.length > 0) {
                this.previousAST = cloneASTNode(reconciledDOM);
                this.options.onASTUpdate?.(this.previousAST);
                patchesToEmit.push(...svelteDOMPatches);
              }
            } else {
              const svelteDOMPatches = this.patchGenerator.generate(this.previousAST, reconciledDOM);
              if (svelteDOMPatches.length > 0) {
                this.previousAST = cloneASTNode(reconciledDOM);
                this.options.onASTUpdate?.(this.previousAST);
                patchesToEmit.push(...svelteDOMPatches);
              }
            }
          }

          // Diff Reconciled JS against previousJSAST
          if (reconciledJS && reconciledJS.units.length > 0) {
            const svelteJSPatches = diffJSPrograms(this.previousJSAST, reconciledJS);
            if (svelteJSPatches.length > 0) {
              this.previousJSAST = JSON.parse(JSON.stringify(reconciledJS));
              this.options.onJSASTUpdate?.(this.previousJSAST!);
              patchesToEmit.push(...svelteJSPatches);
            }
          }
        }
      }
    } catch (err: any) {
      this.options.onError?.(err);
    }

    // 4. Process Angular AST (Reconciled to DOM & JS via Common UI IR)
    let processedAngular = false;
    try {
      if (isFinal || this.angularInterpreter.isSafeToExpose()) {
        const currentAngular = this.angularInterpreter.getAST();
        if (currentAngular && currentAngular.components.length > 0) {
          processedAngular = true;
          this.previousAngularAST = JSON.parse(JSON.stringify(currentAngular));
          this.options.onAngularASTUpdate?.(this.previousAngularAST!);

          const reconciler = new AngularReconciler(currentAngular);
          const { domAST: reconciledDOM, jsProgram: reconciledJS } = reconciler.reconcile();

          // Diff Reconciled DOM AST against previousAST
          if (reconciledDOM && reconciledDOM.children.length > 0) {
            if (this.previousAST === null) {
              const loc: SourceLocation = {
                startLine: 1,
                startColumn: 1,
                startOffset: 0,
                endLine: 1,
                endColumn: 1,
                endOffset: 0,
              };
              const initialRoot = ASTFactory.createComponent(ASTNodeKind.Root, loc, [], []) as RootNode;
              initialRoot.id = this.rootId;

              const angularDOMPatches = this.patchGenerator.generate(initialRoot, reconciledDOM);
              if (angularDOMPatches.length > 0) {
                this.previousAST = cloneASTNode(reconciledDOM);
                this.options.onASTUpdate?.(this.previousAST);
                patchesToEmit.push(...angularDOMPatches);
              }
            } else {
              const angularDOMPatches = this.patchGenerator.generate(this.previousAST, reconciledDOM);
              if (angularDOMPatches.length > 0) {
                this.previousAST = cloneASTNode(reconciledDOM);
                this.options.onASTUpdate?.(this.previousAST);
                patchesToEmit.push(...angularDOMPatches);
              }
            }
          }

          // Diff Reconciled JS against previousJSAST
          if (reconciledJS && reconciledJS.units.length > 0) {
            const angularJSPatches = diffJSPrograms(this.previousJSAST, reconciledJS);
            if (angularJSPatches.length > 0) {
              this.previousJSAST = JSON.parse(JSON.stringify(reconciledJS));
              this.options.onJSASTUpdate?.(this.previousJSAST!);
              patchesToEmit.push(...angularJSPatches);
            }
          }
        }
      }
    } catch (err: any) {
      this.options.onError?.(err);
    }

    // 5. Process HTML AST (only if React, Vue, Svelte, or Angular blocks were not primary UI source)
    if (!processedReact && !processedVue && !processedSvelte && !processedAngular) {
      try {
        if (isFinal || this.interpreter.isSafeToExpose()) {
          const currentAST = this.interpreter.getAST();
          if (currentAST && currentAST.children.length > 0) {
            if (this.previousAST === null) {
              const loc: SourceLocation = {
                startLine: 1,
                startColumn: 1,
                startOffset: 0,
                endLine: 1,
                endColumn: 1,
                endOffset: 0,
              };
              const initialRoot = ASTFactory.createComponent(ASTNodeKind.Root, loc, [], []) as RootNode;
              initialRoot.id = this.rootId;

              const htmlPatches = this.patchGenerator.generate(initialRoot, currentAST);
              if (htmlPatches.length > 0) {
                this.previousAST = cloneASTNode(currentAST);
                this.options.onASTUpdate?.(this.previousAST);
                patchesToEmit.push(...htmlPatches);
              }
            } else {
              const htmlPatches = this.patchGenerator.generate(this.previousAST, currentAST);
              if (htmlPatches.length > 0) {
                this.previousAST = cloneASTNode(currentAST);
                this.options.onASTUpdate?.(this.previousAST);
                patchesToEmit.push(...htmlPatches);
              }
            }
          }
        }
      } catch (err: any) {
        this.options.onError?.(err);
      }
    }

    // 4. Process CSS AST
    try {
      if (isFinal || this.cssInterpreter.isSafeToExpose()) {
        const currentCSS = this.cssInterpreter.getAST();
        if (currentCSS && currentCSS.rules.length > 0) {
          const cssPatches = diffCSSStyleSheets(this.previousCSSAST, currentCSS);
          if (cssPatches.length > 0) {
            this.previousCSSAST = JSON.parse(JSON.stringify(currentCSS));
            this.options.onCSSASTUpdate?.(this.previousCSSAST!);
            patchesToEmit.push(...cssPatches);
          }
        }
      }
    } catch (err: any) {
      this.options.onError?.(err);
    }

    // 5. Process TS AST (lowered to JS units)
    try {
      if (isFinal || this.tsInterpreter.isSafeToExpose()) {
        const currentTS = this.tsInterpreter.getAST();
        if (currentTS && currentTS.units.some((u) => u.isComplete)) {
          this.previousTSAST = JSON.parse(JSON.stringify(currentTS));
          this.options.onTSASTUpdate?.(this.previousTSAST!);

          // Lower TS program to equivalent JS program
          const loweredJSFromTS = convertTSProgramToJSProgram(currentTS);

          // Merge with any JS units from explicit <JS> block if present
          const currentJS = this.jsInterpreter.getAST();
          const mergedUnits = [...loweredJSFromTS.units];
          if (currentJS && currentJS.units.length > 0) {
            for (const jsUnit of currentJS.units) {
              if (!mergedUnits.some((u) => u.id === jsUnit.id)) {
                mergedUnits.push(jsUnit);
              }
            }
          }

          const combinedJSProgram: JSProgramNode = {
            id: loweredJSFromTS.id,
            kind: loweredJSFromTS.kind,
            units: mergedUnits,
            sourceLocation: loweredJSFromTS.sourceLocation,
          };

          const jsPatches = diffJSPrograms(this.previousJSAST, combinedJSProgram);
          if (jsPatches.length > 0) {
            this.previousJSAST = JSON.parse(JSON.stringify(combinedJSProgram));
            this.options.onJSASTUpdate?.(this.previousJSAST!);
            patchesToEmit.push(...jsPatches);
          }
        }
      }
    } catch (err: any) {
      this.options.onError?.(err);
    }

    // 7. Process Pure JS AST (when no TS AST was processed and not from React, Vue, or Svelte)
    if (!processedReact && !processedVue && !processedSvelte) {
      try {
        if ((isFinal || this.jsInterpreter.isSafeToExpose()) && !this.tsInterpreter.getAST().units.some((u) => u.isComplete)) {
          const currentJS = this.jsInterpreter.getAST();
          if (currentJS && currentJS.units.some((u) => u.isComplete)) {
            const jsPatches = diffJSPrograms(this.previousJSAST, currentJS);
            if (jsPatches.length > 0) {
              this.previousJSAST = JSON.parse(JSON.stringify(currentJS));
              this.options.onJSASTUpdate?.(this.previousJSAST!);
              patchesToEmit.push(...jsPatches);
            }
          }
        }
      } catch (err: any) {
        this.options.onError?.(err);
      }
    }

    // 8. Emit combined patches if any
    if (patchesToEmit.length > 0) {
      this.options.onPatch?.(patchesToEmit);
    }
  }

  /**
   * Signal the end of the LM stream.
   * Flushes lexer, finalizes interpreters, and produces any final patches.
   */
  public end(): void {
    if (this.isAborted) return;

    try {
      this.lexer.end();
      this.interpreter.end();
      this.cssInterpreter.end();
      this.jsInterpreter.end();
      this.tsInterpreter.end();
      this.reactInterpreter.end();
      this.vueInterpreter.end();
      this.svelteInterpreter.end();
    } catch (err: any) {
      this.options.onError?.(err);
    }

    this.tryGeneratePatches(true);
  }

  /**
   * Abort this generation pipeline and release resources (Section 15).
   */
  public abort(): void {
    this.isAborted = true;
    this.previousAST = null;
    this.previousCSSAST = null;
    this.previousJSAST = null;
    this.previousTSAST = null;
    this.previousReactAST = null;
    this.previousVueAST = null;
    this.previousSvelteAST = null;
  }

  /**
   * Return the previous committed HTML AST snapshot.
   */
  public getPreviousAST(): RootNode | null {
    return this.previousAST;
  }

  /**
   * Return the current live HTML AST.
   */
  public getCurrentAST(): RootNode {
    return this.interpreter.getAST();
  }

  /**
   * Return the current live CSS AST.
   */
  public getCurrentCSSAST(): CSSStyleSheetNode {
    return this.cssInterpreter.getAST();
  }

  /**
   * Return the current live JS AST.
   */
  public getCurrentJSAST(): JSProgramNode {
    return this.jsInterpreter.getAST();
  }

  /**
   * Return the current live TS AST.
   */
  public getCurrentTSAST(): TSProgramNode {
    return this.tsInterpreter.getAST();
  }

  /**
   * Return the current live React AST.
   */
  public getCurrentReactAST(): ReactProgramNode {
    return this.reactInterpreter.getAST();
  }

  /**
   * Return the current live Vue AST.
   */
  public getCurrentVueAST(): VueProgramNode {
    return this.vueInterpreter.getAST();
  }

  /**
   * Return the current live Svelte AST.
   */
  public getCurrentSvelteAST(): SvelteProgramNode {
    return this.svelteInterpreter.getAST();
  }

  /**
   * Return diagnostics collected during parsing from all interpreters.
   */
  public getDiagnostics() {
    return [
      ...this.interpreter.getDiagnostics(),
      ...this.cssInterpreter.getDiagnostics(),
      ...this.jsInterpreter.getDiagnostics(),
      ...this.tsInterpreter.getDiagnostics(),
      ...this.reactInterpreter.getDiagnostics(),
      ...this.vueInterpreter.getDiagnostics(),
      ...this.svelteInterpreter.getDiagnostics(),
    ];
  }
}
