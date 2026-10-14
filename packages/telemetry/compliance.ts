import {
  KNOWN_ELEMENT_ABBREVIATIONS,
  KNOWN_ATTRIBUTE_ABBREVIATIONS,
} from '../compiler/interpreters/html-lm/vocabulary';
import {
  LMComplianceDetails,
  LMComplianceReport,
  LMSyntacticComplianceReport,
  LMParserValidationReport,
  LMOutputClassification,
} from './types';
import { LMGenerationPipeline } from '../compiler/pipeline/generation-pipeline';

/**
 * Evaluates the syntactic structural compliance of a model generation
 * against Leveonas Markup (LM) grammar rules.
 *
 * Rules:
 * - Pure LM syntax uses parenthesis-based tree structures (e.g. `di(cs(...) ...)` or `(he ...)`)
 * - Pure LM syntax must not contain standard HTML closing tags (e.g. `</div>`, `</section>`, `</button>`)
 * - Pure LM syntax must not contain `<!DOCTYPE html>` or raw `<div class="...">`
 * - Pure LM syntax should not be wrapped in markdown code fences
 *
 * Note: This evaluates syntactic formatting heuristics only, NOT semantic or parser correctness.
 */
export function classifyLMSyntacticCompliance(rawOutput: string): LMSyntacticComplianceReport {
  if (!rawOutput || typeof rawOutput !== 'string' || rawOutput.trim().length === 0) {
    return {
      isCompliant: false,
      score: 0,
      reason: 'Output is empty.',
      details: {
        hasBlockDelimiters: false,
        hasParenthesisStructure: false,
        abbreviationCount: 0,
        lmConstructCount: 0,
        rawHTMLTagCount: 0,
        rawHTMLClosingTagCount: 0,
        hasMarkdownFences: false,
      },
    };
  }

  const text = rawOutput.trim();

  // Check for markdown code fences (```html, ```)
  const hasMarkdownFences = /^```|```$/m.test(text);

  // Check for LM block delimiters (<HTML>, </HTML>, <CSS>, <JS>, <REACT>, etc.)
  const hasBlockDelimiters =
    /<(HTML|CSS|JS|TS|REACT|NEXTJS|TAILWIND|VUE|SVELTE)>[\s\S]*<\/\1>/i.test(text) ||
    /<(HTML|CSS|JS|TS|REACT|NEXTJS|TAILWIND|VUE|SVELTE)>/i.test(text);

  // Check for standard HTML closing tags (e.g. </div>, </section>, </header>, </button>, </p>, </span>)
  // Note: </HTML>, </CSS>, </JS> are LM block terminators, not raw HTML tags
  const rawHTMLClosingTagMatches =
    text.match(
      /<\/(div|section|header|footer|nav|main|button|span|input|label|table|form|article|aside|p|h[1-6]|ul|ol|li|a|body|head|script|style)>/gi
    ) || [];
  const rawHTMLClosingTagCount = rawHTMLClosingTagMatches.length;

  // Check for standard HTML open tags with angle brackets (e.g. <div class="...">, <button>, <!DOCTYPE)
  // Note: <HTML>, <CSS>, <JS> are LM block initiators, not raw HTML tags
  const rawHTMLTagMatches =
    text.match(
      /<(div|section|header|footer|nav|main|button|span|input|label|table|form|article|aside|p|h[1-6]|ul|ol|li|a|body|head|script|style|!DOCTYPE)\b[^>]*>/gi
    ) || [];
  const rawHTMLTagCount = rawHTMLTagMatches.length;

  // Check for LM parenthesis structure: e.g. `di(`, `(di `, `so(`, `(so `, `he(`, `(he `, `bo(`, `(bo `, `p(`, `(p `, `cs(`, `(cs `
  const lmParenthesisMatches =
    text.match(
      /\b(di|so|he|fe|na|mi|bo|sa|iu|le|tl|cu|fr|al|ad|cs|cm|hr|sr|tp|pe|nm|vu|oc|og|h[1-6]|p|a|img|ul|ol|li)\s*\(/g
    ) || [];
  const sExprMatches =
    text.match(
      /\(\s*(di|so|he|fe|na|mi|bo|sa|iu|le|tl|cu|fr|al|ad|cs|cm|hr|sr|tp|pe|nm|vu|oc|og|h[1-6]|p|a|img|ul|ol|li)\b/g
    ) || [];
  const lmConstructCount = lmParenthesisMatches.length + sExprMatches.length;

  const hasParenthesisStructure = lmConstructCount > 0 && text.includes('(') && text.includes(')');

  // Count abbreviations from canonical vocabulary
  let abbreviationCount = 0;
  for (const abbr of Object.keys(KNOWN_ELEMENT_ABBREVIATIONS)) {
    const regex = new RegExp(`(\\b|\\()${abbr}\\s*\\(`, 'g');
    const matches = text.match(regex);
    if (matches) abbreviationCount += matches.length;
  }
  for (const abbr of Object.keys(KNOWN_ATTRIBUTE_ABBREVIATIONS)) {
    const regex = new RegExp(`(\\b|\\()${abbr}\\s*\\(`, 'g');
    const matches = text.match(regex);
    if (matches) abbreviationCount += matches.length;
  }

  // Scoring calculation
  let score = 0;
  if (hasBlockDelimiters) score += 25;
  if (hasParenthesisStructure) score += 35;
  if (abbreviationCount > 0) score += Math.min(30, abbreviationCount * 5);
  if (lmConstructCount >= 3) score += 10;

  // Penalties for raw uncompressed HTML
  if (rawHTMLClosingTagCount > 0) {
    score -= rawHTMLClosingTagCount * 25;
  }
  if (rawHTMLTagCount > 0) {
    score -= rawHTMLTagCount * 20;
  }
  if (hasMarkdownFences) {
    score -= 15;
  }

  score = Math.max(0, Math.min(100, score));

  let isCompliant = false;
  let reason = '';

  if (rawHTMLClosingTagCount > 0 || rawHTMLTagCount > 1) {
    isCompliant = false;
    reason = `Model emitted ordinary uncompressed HTML with standard tags (${rawHTMLClosingTagCount} closing tags, ${rawHTMLTagCount} opening tags).`;
  } else if (!hasParenthesisStructure && lmConstructCount === 0) {
    isCompliant = false;
    reason = 'No Leveonas Markup parenthesis structure or element declarations detected.';
  } else if (score >= 50) {
    isCompliant = true;
    reason = `Valid Leveonas Markup syntax detected (${lmConstructCount} LM constructs, ${abbreviationCount} canonical abbreviations).`;
  } else {
    isCompliant = false;
    reason = `Insufficient LM syntax compliance (score: ${score}/100).`;
  }

  return {
    isCompliant,
    score,
    reason,
    details: {
      hasBlockDelimiters,
      hasParenthesisStructure,
      abbreviationCount,
      lmConstructCount,
      rawHTMLTagCount,
      rawHTMLClosingTagCount,
      hasMarkdownFences,
    },
  };
}

/**
 * Validates raw LM output by processing it through the actual production LMGenerationPipeline.
 * Captures diagnostics, AST production, and patch operations.
 */
export function validateLMWithParser(rawOutput: string): LMParserValidationReport {
  if (!rawOutput || typeof rawOutput !== 'string' || rawOutput.trim().length === 0) {
    return {
      succeeded: false,
      astProduced: false,
      patchCount: 0,
      patchOperationCount: 0,
      diagnostics: ['Output is empty or missing.'],
    };
  }

  let pipelineError: Error | null = null;
  const diagnostics: string[] = [];
  let astProduced = false;
  let patchCount = 0;
  let patchOperationCount = 0;

  try {
    const pipeline = new LMGenerationPipeline({
      rootId: 'leveonas-root',
      onPatch: (patches) => {
        if (patches.length > 0) {
          patchCount += 1;
          patchOperationCount += patches.length;
        }
      },
      onASTUpdate: (ast) => {
        if (ast && ast.children && ast.children.length > 0) {
          astProduced = true;
        }
      },
      onError: (err) => {
        const msg = err instanceof Error ? err.message : String(err);
        diagnostics.push(msg);
        pipelineError = err instanceof Error ? err : new Error(msg);
      },
    });

    pipeline.write(rawOutput);
    pipeline.end();

    const currentAST = pipeline.getCurrentAST();
    if (currentAST && currentAST.children && currentAST.children.length > 0) {
      astProduced = true;
    }

    const interpDiags = pipeline.getDiagnostics();
    for (const d of interpDiags) {
      if (d.severity === 'error') {
        diagnostics.push(`[Error] ${d.message}`);
      } else if (d.severity === 'warning') {
        diagnostics.push(`[Warning] ${d.message}`);
      }
    }
  } catch (err: any) {
    const msg = err instanceof Error ? err.message : String(err);
    diagnostics.push(msg);
    pipelineError = err instanceof Error ? err : new Error(msg);
  }

  const hasFatalError =
    pipelineError !== null || diagnostics.some((d) => d.startsWith('[Error]'));
  const succeeded = !hasFatalError && astProduced;

  return {
    succeeded,
    astProduced,
    patchCount,
    patchOperationCount,
    diagnostics,
  };
}

/**
 * Comprehensive scientific validation of LM model output.
 * Combines syntactic compliance heuristics, actual compiler parsing, AST verification,
 * and canonical status classification.
 */
export function validateLMGeneration(rawOutput: string): LMComplianceReport {
  const syntactic = classifyLMSyntacticCompliance(rawOutput);
  const parser = validateLMWithParser(rawOutput);

  let classification: LMOutputClassification = 'INVALID_LM';
  let reason = '';

  if (!parser.succeeded && parser.diagnostics.length > 0 && parser.diagnostics.some((d) => d.includes('Error') || d.includes('Parser'))) {
    classification = 'PARSER_ERROR';
    reason = `Parser error: ${parser.diagnostics.join(', ')}`;
  } else if (!syntactic.isCompliant) {
    classification = 'INVALID_LM';
    reason = syntactic.reason;
  } else if (!parser.astProduced) {
    classification = 'INVALID_LM';
    reason = 'No valid AST nodes were produced by the interpreter.';
  } else {
    classification = 'VALID_LM';
    reason = `Valid LM: Syntactic score ${syntactic.score}%, parser produced ${parser.patchOperationCount} operations and valid AST.`;
  }

  const isLMCompliant = classification === 'VALID_LM';

  return {
    classification,
    syntactic,
    parser,
    isLMCompliant,
    score: syntactic.score,
    reason,
    details: syntactic.details,
  };
}

/**
 * Main export for classifying LM compliance.
 * Performs both syntactic and parser-based validation.
 */
export function classifyLMCompliance(rawOutput: string): LMComplianceReport {
  return validateLMGeneration(rawOutput);
}
