/**
 * Leveonas Universal Configuration System
 *
 * Provides typed schema and file loader for leveonas.config.json / .js / .ts.
 * Enforces production security defaults unless explicitly configured.
 */
import { LeveonasSecurityLimits } from '../security/limits';
import { ObservabilityConfig } from '../telemetry/metrics';
export interface LeveonasProjectConfig {
    /** Default LLM provider (e.g. 'gemini', 'openai', 'grok') */
    provider?: string;
    /** Default model ID (e.g. 'gemini-2.5-flash', 'gpt-4o-mini') */
    model?: string;
    /** Production runtime security and resource limits */
    limits?: Partial<LeveonasSecurityLimits>;
    /** Telemetry and metrics collection options */
    telemetry?: boolean | ObservabilityConfig;
    /** Benchmark runner options */
    benchmark?: {
        defaultScenario?: string;
        iterations?: number;
        provider?: string;
        model?: string;
    };
    /** Browser runtime options */
    runtime?: {
        fallbackOnError?: boolean;
        isolateCss?: boolean;
        cspPolicy?: string;
    };
    /** Security auditing and sandbox policies */
    security?: {
        strictAttributeValidation?: boolean;
        blockDangerousUrls?: boolean;
        allowedUrlProtocols?: string[];
    };
}
export declare const DEFAULT_LEVEONAS_CONFIG: LeveonasProjectConfig;
/**
 * Resolves a full configuration by merging user overrides onto production defaults.
 */
export declare function resolveLeveonasConfig(overrides?: Partial<LeveonasProjectConfig>): LeveonasProjectConfig;
/**
 * Attempts to load leveonas.config.json from the current working directory.
 */
export declare function loadLeveonasConfigFile(cwd?: string): LeveonasProjectConfig;
