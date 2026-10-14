/**
 * Leveonas CLI — Security Audit Command
 *
 * Scans LM source files, configs, and markup for dangerous URLs,
 * inline event handlers, exposed secrets, and security policy violations.
 */

import fs from 'fs';
import { LeveonasSecurityAuditor, AuditReport } from '../../security/audit';

export interface AuditCommandOptions {
  files: string[];
  json?: boolean;
}

export function runAuditCommand(options: AuditCommandOptions): { success: boolean; reports: Record<string, AuditReport> } {
  const reports: Record<string, AuditReport> = {};
  let allPassed = true;

  for (const file of options.files) {
    if (!fs.existsSync(file)) {
      console.error(`File not found: ${file}`);
      allPassed = false;
      continue;
    }

    try {
      const content = fs.readFileSync(file, 'utf-8');
      const report = LeveonasSecurityAuditor.auditSource(content, file);
      reports[file] = report;

      if (!report.passed) {
        allPassed = false;
      }

      if (!options.json) {
        console.log(`\nAudit Report for ${file}:`);
        console.log(`  Security Score: ${report.score}/100 [${report.passed ? 'PASSED' : 'FAILED'}]`);
        console.log(`  Issues: Critical: ${report.issueCounts.CRITICAL}, High: ${report.issueCounts.HIGH}, Medium: ${report.issueCounts.MEDIUM}`);

        if (report.issues.length > 0) {
          for (const issue of report.issues) {
            console.log(`    [${issue.severity}] [${issue.code}] ${issue.message}`);
            if (issue.recommendation) {
              console.log(`      ↳ Recommendation: ${issue.recommendation}`);
            }
          }
        } else {
          console.log('  ✓ No security vulnerabilities detected.');
        }
      }
    } catch (err: any) {
      console.error(`Error reading ${file}:`, err.message);
      allPassed = false;
    }
  }

  if (options.json) {
    console.log(JSON.stringify(reports, null, 2));
  }

  return { success: allPassed, reports };
}
