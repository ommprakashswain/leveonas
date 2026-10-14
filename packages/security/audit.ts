/**
 * Leveonas Security Audit Engine
 *
 * Performs comprehensive static and configuration audits for:
 * - Dangerous javascript: / vbscript: URLs
 * - Inline DOM event handlers
 * - Leaked API keys or credentials
 * - Unsafe iframe sandbox configurations
 * - Prototype pollution vectors
 * - Dangerous CSS expressions / behaviors
 */

import { isDangerousProtocol, normalizeUrlString } from './urls';
import { normalizeAttributeName } from './attributes';
import { censorSecrets } from './sanitizer';

export interface AuditIssue {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'INJECTION' | 'CREDENTIAL_EXPOSURE' | 'ISOLATION' | 'PROTOTYPE_POLLUTION' | 'RESOURCE_LIMIT';
  code: string;
  message: string;
  location?: string;
  recommendation?: string;
}

export interface AuditReport {
  passed: boolean;
  score: number; // 0 to 100
  totalChecks: number;
  issueCounts: {
    CRITICAL: number;
    HIGH: number;
    MEDIUM: number;
    LOW: number;
  };
  issues: AuditIssue[];
}

export class LeveonasSecurityAuditor {
  /**
   * Audits raw LM source code or HTML markup for dangerous patterns.
   */
  public static auditSource(content: string, filename: string = 'inline.lm'): AuditReport {
    const issues: AuditIssue[] = [];
    let totalChecks = 0;

    // 1. Check for dangerous script URLs (including LM abbreviations hr, sr)
    totalChecks++;
    const urlMatches = content.matchAll(/(?:href|hr|src|sr|action|poster)\s*[:=]\s*["']([^"']+)["']/gi);
    for (const match of urlMatches) {
      const url = match[1];
      if (isDangerousProtocol(url)) {
        issues.push({
          severity: 'CRITICAL',
          category: 'INJECTION',
          code: 'SEC_DANGEROUS_URL_PROTOCOL',
          message: `Dangerous protocol detected in URL: "${url.slice(0, 40)}"`,
          location: `${filename}`,
          recommendation: 'Use HTTP, HTTPS, or relative URLs. Avoid javascript: or vbscript: URLs.',
        });
      }
    }

    // 2. Check for inline event handlers and suspicious eval executions
    totalChecks++;
    const eventMatches = content.matchAll(/\b(?:on[a-zA-Z]+|oc|og|oe)\s*[:=]\s*["']([^"']+)["']/gi);
    for (const match of eventMatches) {
      const rawHandler = match[0].split(/[:=]/)[0].trim();
      const handlerCode = match[1];
      if (rawHandler.toLowerCase().startsWith('on') || /eval\s*\(|new\s+Function|document\.cookie/i.test(handlerCode)) {
        issues.push({
          severity: 'HIGH',
          category: 'INJECTION',
          code: 'SEC_INLINE_EVENT_HANDLER',
          message: `Suspicious or inline event handler detected: "${rawHandler}"`,
          location: `${filename}`,
          recommendation: 'Use canonical Leveonas event bindings instead of inline on* handlers or eval().',
        });
      }
    }

    // 3. Check for obvious exposed API keys
    totalChecks++;
    const apiKeyMatches = content.matchAll(/(?:AIza[0-9A-Za-z-_]{35}|sk-[a-zA-Z0-9]{20,})/g);
    for (const match of apiKeyMatches) {
      issues.push({
        severity: 'CRITICAL',
        category: 'CREDENTIAL_EXPOSURE',
        code: 'SEC_HARDCODED_API_KEY',
        message: 'Hardcoded API key detected in source code',
        location: `${filename}`,
        recommendation: 'Pass API credentials via secure server proxy or environment variables.',
      });
    }

    // 4. Check for CSS expression or behavior
    totalChecks++;
    if (/expression\s*\(|behavior\s*:|-moz-binding\s*:/i.test(content)) {
      issues.push({
        severity: 'HIGH',
        category: 'INJECTION',
        code: 'SEC_DANGEROUS_CSS_DIRECTIVE',
        message: 'Potentially dangerous CSS directive (expression/behavior/-moz-binding) detected',
        location: `${filename}`,
        recommendation: 'Remove proprietary CSS execution directives.',
      });
    }

    // Calculate score
    const penalty =
      issues.filter((i) => i.severity === 'CRITICAL').length * 40 +
      issues.filter((i) => i.severity === 'HIGH').length * 20 +
      issues.filter((i) => i.severity === 'MEDIUM').length * 10 +
      issues.filter((i) => i.severity === 'LOW').length * 5;

    const score = Math.max(0, 100 - penalty);

    return {
      passed: issues.filter((i) => i.severity === 'CRITICAL' || i.severity === 'HIGH').length === 0,
      score,
      totalChecks,
      issueCounts: {
        CRITICAL: issues.filter((i) => i.severity === 'CRITICAL').length,
        HIGH: issues.filter((i) => i.severity === 'HIGH').length,
        MEDIUM: issues.filter((i) => i.severity === 'MEDIUM').length,
        LOW: issues.filter((i) => i.severity === 'LOW').length,
      },
      issues,
    };
  }

  /**
   * Audits iframe sandbox permissions to ensure least privilege.
   */
  public static auditIframeSandbox(sandboxAttr: string | null): AuditReport {
    const issues: AuditIssue[] = [];

    if (!sandboxAttr) {
      issues.push({
        severity: 'CRITICAL',
        category: 'ISOLATION',
        code: 'SEC_IFRAME_UNSANDBOXED',
        message: 'Iframe missing sandbox attribute entirely',
        recommendation: 'Set sandbox="allow-scripts" without allow-same-origin.',
      });
    } else {
      const tokens = sandboxAttr.toLowerCase().split(/\s+/).filter(Boolean);

      if (tokens.includes('allow-same-origin')) {
        issues.push({
          severity: 'CRITICAL',
          category: 'ISOLATION',
          code: 'SEC_DANGEROUS_SANDBOX_TOKEN',
          message: 'sandbox="allow-same-origin" grants iframe full access to parent origin cookies and storage',
          recommendation: 'Remove "allow-same-origin" to maintain an opaque sandboxed origin.',
        });
      }

      if (tokens.includes('allow-top-navigation') || tokens.includes('allow-top-navigation-by-user-activation')) {
        issues.push({
          severity: 'HIGH',
          category: 'ISOLATION',
          code: 'SEC_TOP_NAVIGATION_ENABLED',
          message: 'Iframe is allowed to navigate the parent window',
          recommendation: 'Remove top-navigation permissions unless explicitly required.',
        });
      }

      if (tokens.includes('allow-modals') || tokens.includes('allow-popups')) {
        issues.push({
          severity: 'MEDIUM',
          category: 'ISOLATION',
          code: 'SEC_POPUP_PERMISSIONS_ENABLED',
          message: 'Iframe is permitted to spawn popups or modal alerts',
          recommendation: 'Disable popups/modals unless demonstrated requirement exists.',
        });
      }
    }

    const penalty =
      issues.filter((i) => i.severity === 'CRITICAL').length * 50 +
      issues.filter((i) => i.severity === 'HIGH').length * 25 +
      issues.filter((i) => i.severity === 'MEDIUM').length * 10;

    return {
      passed: issues.filter((i) => i.severity === 'CRITICAL').length === 0,
      score: Math.max(0, 100 - penalty),
      totalChecks: 4,
      issueCounts: {
        CRITICAL: issues.filter((i) => i.severity === 'CRITICAL').length,
        HIGH: issues.filter((i) => i.severity === 'HIGH').length,
        MEDIUM: issues.filter((i) => i.severity === 'MEDIUM').length,
        LOW: 0,
      },
      issues,
    };
  }
}
