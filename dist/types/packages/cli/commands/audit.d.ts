/**
 * Leveonas CLI — Security Audit Command
 *
 * Scans LM source files, configs, and markup for dangerous URLs,
 * inline event handlers, exposed secrets, and security policy violations.
 */
import { AuditReport } from '../../security/audit';
export interface AuditCommandOptions {
    files: string[];
    json?: boolean;
}
export declare function runAuditCommand(options: AuditCommandOptions): {
    success: boolean;
    reports: Record<string, AuditReport>;
};
