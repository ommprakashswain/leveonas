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
    score: number;
    totalChecks: number;
    issueCounts: {
        CRITICAL: number;
        HIGH: number;
        MEDIUM: number;
        LOW: number;
    };
    issues: AuditIssue[];
}
export declare class LeveonasSecurityAuditor {
    /**
     * Audits raw LM source code or HTML markup for dangerous patterns.
     */
    static auditSource(content: string, filename?: string): AuditReport;
    /**
     * Audits iframe sandbox permissions to ensure least privilege.
     */
    static auditIframeSandbox(sandboxAttr: string | null): AuditReport;
}
