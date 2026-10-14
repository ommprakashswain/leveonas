/**
 * Leveonas Production Security & Resource Limits
 *
 * Configurable safeguards against DoS, memory exhaustion,
 * infinite streams, pathological trees, and oversized payloads.
 */
export interface LeveonasSecurityLimits {
    /** Maximum number of patch operations permitted in a single batch */
    maxPatchBatchSize: number;
    /** Maximum cumulative patch operations allowed per session/generation */
    maxPatchCount: number;
    /** Maximum total DOM/AST node count allowed in the tree */
    maxNodeCount: number;
    /** Maximum allowed DOM/AST nesting depth */
    maxTreeDepth: number;
    /** Maximum allowed length (in chars) for any single attribute value */
    maxAttributeLength: number;
    /** Maximum allowed length (in chars) for any single text node */
    maxTextLength: number;
    /** Maximum allowed size in bytes for a postMessage payload */
    maxMessageBytes: number;
    /** Maximum cumulative streaming bytes allowed per generation */
    maxStreamBytes: number;
    /** Maximum duration (in ms) allowed for an active generation stream */
    maxGenerationDurationMs: number;
    /** Maximum duration (in ms) allowed for an active session lifecycle */
    maxSessionDurationMs: number;
    /** Maximum character length allowed for an incoming user prompt */
    maxPromptLength: number;
    /** Maximum tokens requested from LLM providers */
    maxTokensCeiling: number;
}
export declare const DEFAULT_SECURITY_LIMITS: Readonly<LeveonasSecurityLimits>;
/**
 * Resolves production limits from environment variables or custom overrides.
 */
export declare function getSecurityLimits(overrides?: Partial<LeveonasSecurityLimits>): LeveonasSecurityLimits;
