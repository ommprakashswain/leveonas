import { LMComplianceReport, LMSyntacticComplianceReport, LMParserValidationReport } from './types';
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
export declare function classifyLMSyntacticCompliance(rawOutput: string): LMSyntacticComplianceReport;
/**
 * Validates raw LM output by processing it through the actual production LMGenerationPipeline.
 * Captures diagnostics, AST production, and patch operations.
 */
export declare function validateLMWithParser(rawOutput: string): LMParserValidationReport;
/**
 * Comprehensive scientific validation of LM model output.
 * Combines syntactic compliance heuristics, actual compiler parsing, AST verification,
 * and canonical status classification.
 */
export declare function validateLMGeneration(rawOutput: string): LMComplianceReport;
/**
 * Main export for classifying LM compliance.
 * Performs both syntactic and parser-based validation.
 */
export declare function classifyLMCompliance(rawOutput: string): LMComplianceReport;
