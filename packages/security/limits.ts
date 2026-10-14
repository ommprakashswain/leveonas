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

export const DEFAULT_SECURITY_LIMITS: Readonly<LeveonasSecurityLimits> = Object.freeze({
  maxPatchBatchSize: 500,
  maxPatchCount: 5000,
  maxNodeCount: 10000,
  maxTreeDepth: 64,
  maxAttributeLength: 4096,
  maxTextLength: 65536,
  maxMessageBytes: 1048576, // 1 MB
  maxStreamBytes: 5242880, // 5 MB
  maxGenerationDurationMs: 60000, // 60s
  maxSessionDurationMs: 300000, // 5 min
  maxPromptLength: 32768, // 32k chars
  maxTokensCeiling: 8192,
});

/**
 * Resolves production limits from environment variables or custom overrides.
 */
export function getSecurityLimits(overrides?: Partial<LeveonasSecurityLimits>): LeveonasSecurityLimits {
  const env: Record<string, string | undefined> = typeof process !== 'undefined' ? (process.env as Record<string, string | undefined>) || {} : {};

  const parseEnvInt = (key: string, fallback: number): number => {
    const val = env[key];
    if (val && !isNaN(Number(val))) {
      const parsed = parseInt(val, 10);
      if (parsed > 0) return parsed;
    }
    return fallback;
  };

  return {
    maxPatchBatchSize: overrides?.maxPatchBatchSize ?? parseEnvInt('LEVEONAS_MAX_PATCH_BATCH_SIZE', DEFAULT_SECURITY_LIMITS.maxPatchBatchSize),
    maxPatchCount: overrides?.maxPatchCount ?? parseEnvInt('LEVEONAS_MAX_PATCH_COUNT', DEFAULT_SECURITY_LIMITS.maxPatchCount),
    maxNodeCount: overrides?.maxNodeCount ?? parseEnvInt('LEVEONAS_MAX_NODE_COUNT', DEFAULT_SECURITY_LIMITS.maxNodeCount),
    maxTreeDepth: overrides?.maxTreeDepth ?? parseEnvInt('LEVEONAS_MAX_TREE_DEPTH', DEFAULT_SECURITY_LIMITS.maxTreeDepth),
    maxAttributeLength: overrides?.maxAttributeLength ?? parseEnvInt('LEVEONAS_MAX_ATTRIBUTE_LENGTH', DEFAULT_SECURITY_LIMITS.maxAttributeLength),
    maxTextLength: overrides?.maxTextLength ?? parseEnvInt('LEVEONAS_MAX_TEXT_LENGTH', DEFAULT_SECURITY_LIMITS.maxTextLength),
    maxMessageBytes: overrides?.maxMessageBytes ?? parseEnvInt('LEVEONAS_MAX_MESSAGE_BYTES', DEFAULT_SECURITY_LIMITS.maxMessageBytes),
    maxStreamBytes: overrides?.maxStreamBytes ?? parseEnvInt('LEVEONAS_MAX_STREAM_BYTES', DEFAULT_SECURITY_LIMITS.maxStreamBytes),
    maxGenerationDurationMs: overrides?.maxGenerationDurationMs ?? parseEnvInt('LEVEONAS_MAX_GENERATION_DURATION_MS', DEFAULT_SECURITY_LIMITS.maxGenerationDurationMs),
    maxSessionDurationMs: overrides?.maxSessionDurationMs ?? parseEnvInt('LEVEONAS_MAX_SESSION_DURATION_MS', DEFAULT_SECURITY_LIMITS.maxSessionDurationMs),
    maxPromptLength: overrides?.maxPromptLength ?? parseEnvInt('LEVEONAS_MAX_PROMPT_LENGTH', DEFAULT_SECURITY_LIMITS.maxPromptLength),
    maxTokensCeiling: overrides?.maxTokensCeiling ?? parseEnvInt('LEVEONAS_MAX_TOKENS_CEILING', DEFAULT_SECURITY_LIMITS.maxTokensCeiling),
  };
}
