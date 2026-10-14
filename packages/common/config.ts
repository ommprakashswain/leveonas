/**
 * Leveonas Universal Configuration System
 *
 * Provides typed schema and file loader for leveonas.config.json / .js / .ts.
 * Enforces production security defaults unless explicitly configured.
 */

import { LeveonasSecurityLimits, DEFAULT_SECURITY_LIMITS, getSecurityLimits } from '../security/limits';
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

export const DEFAULT_LEVEONAS_CONFIG: LeveonasProjectConfig = {
  provider: 'gemini',
  model: 'gemini-2.5-flash',
  limits: DEFAULT_SECURITY_LIMITS,
  telemetry: false,
  benchmark: {
    defaultScenario: 'scenario_a',
    iterations: 3,
  },
  runtime: {
    fallbackOnError: true,
    isolateCss: true,
  },
  security: {
    strictAttributeValidation: true,
    blockDangerousUrls: true,
    allowedUrlProtocols: ['http:', 'https:', 'mailto:', 'tel:'],
  },
};

/**
 * Resolves a full configuration by merging user overrides onto production defaults.
 */
export function resolveLeveonasConfig(overrides?: Partial<LeveonasProjectConfig>): LeveonasProjectConfig {
  if (!overrides) return { ...DEFAULT_LEVEONAS_CONFIG };

  return {
    provider: overrides.provider || DEFAULT_LEVEONAS_CONFIG.provider,
    model: overrides.model || DEFAULT_LEVEONAS_CONFIG.model,
    limits: getSecurityLimits(overrides.limits),
    telemetry: overrides.telemetry ?? DEFAULT_LEVEONAS_CONFIG.telemetry,
    benchmark: {
      ...DEFAULT_LEVEONAS_CONFIG.benchmark,
      ...(overrides.benchmark || {}),
    },
    runtime: {
      ...DEFAULT_LEVEONAS_CONFIG.runtime,
      ...(overrides.runtime || {}),
    },
    security: {
      ...DEFAULT_LEVEONAS_CONFIG.security,
      ...(overrides.security || {}),
    },
  };
}

/**
 * Attempts to load leveonas.config.json from the current working directory.
 */
export function loadLeveonasConfigFile(cwd: string = process.cwd()): LeveonasProjectConfig {
  const fs = require('fs');
  const path = require('path');

  const possibleFiles = [
    path.join(cwd, 'leveonas.config.json'),
    path.join(cwd, 'leveonas.config.js'),
    path.join(cwd, 'leveonas.config.mjs'),
  ];

  for (const filePath of possibleFiles) {
    if (fs.existsSync(filePath)) {
      try {
        if (filePath.endsWith('.json')) {
          const raw = fs.readFileSync(filePath, 'utf-8');
          const parsed = JSON.parse(raw);
          return resolveLeveonasConfig(parsed);
        }
      } catch (err: any) {
        console.warn(`[Leveonas Config] Failed to parse ${filePath}: ${err.message}`);
      }
    }
  }

  return resolveLeveonasConfig();
}
