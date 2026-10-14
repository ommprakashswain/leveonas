import { CompilationOptions } from './options';
import { CompilationResult } from './result';
import { PipelineContext } from './context';
import { PipelineStages, adaptParserTreeToAST } from './stages';
import { PipelineError } from './errors';
import { PipelineDiagnosticSeverity } from './diagnostics';
import { RootNode } from '../ast/nodes';

export class CompilerPipeline {
  private previousAst: RootNode | null = null;
  
  constructor(private defaultOptions: CompilationOptions = {}) {}
  
  public compile(source: string, options?: CompilationOptions): CompilationResult {
    const mergedOptions = { ...this.defaultOptions, ...options };
    const context = new PipelineContext(mergedOptions);
    const stages = new PipelineStages(context);
    
    const totalStart = performance.now();
    
    let ast: RootNode | null = null;
    let html = '';
    let patches: any[] = [];
    
    try {
      // 1. Tokenize
      const tokens = stages.runTokenizer(source);
      
      // 2. Lex
      const lexTokens = stages.runLexer(tokens);
      
      if (mergedOptions.stopOnError && context.hasErrors()) {
        return this.createResult(context, ast, html, patches, totalStart, false);
      }
      
      // 3. Parse
      ast = stages.runParser(lexTokens);
      
      if (mergedOptions.stopOnError && context.hasErrors()) {
        return this.createResult(context, ast, html, patches, totalStart, false);
      }
      
      // 4. Validate
      stages.runValidator(ast);
      
      if (mergedOptions.stopOnError && context.hasErrors()) {
        return this.createResult(context, ast, html, patches, totalStart, false);
      }
      
      // 5. Render HTML
      html = stages.runRenderer(ast, mergedOptions.minifyHtml !== false && !mergedOptions.prettyHtml);
      
      // 6. Generate Patches
      if (mergedOptions.generatePatches !== false) {
        if (this.previousAst) {
          patches = stages.runPatchGenerator(this.previousAst, ast);
        } else {
          // If no previous AST, we can just generate a patch from empty root to this one
          const emptyRoot = adaptParserTreeToAST([]);
          patches = stages.runPatchGenerator(emptyRoot, ast);
        }
        this.previousAst = ast;
      }
      
    } catch (error: any) {
      context.reportDiagnostic({
        stage: 'pipeline',
        code: 'PipelineError',
        message: error.message || String(error),
        severity: PipelineDiagnosticSeverity.Error
      });
    }
    
    context.statistics.totalTime = performance.now() - totalStart;
    
    return this.createResult(context, ast, html, patches, totalStart, !context.hasErrors());
  }
  
  private createResult(
    context: PipelineContext, 
    ast: RootNode | null, 
    html: string, 
    patches: any[],
    startTime: number,
    success: boolean
  ): CompilationResult {
    if (!context.statistics.totalTime) {
      context.statistics.totalTime = performance.now() - startTime;
    }
    
    return {
      ast,
      html,
      patches,
      diagnostics: context.diagnostics,
      warnings: context.getWarnings(),
      statistics: context.statistics,
      success
    };
  }
}
