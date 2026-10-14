/**
 * Leveonas CLI: `leveonas check`
 *
 * Runs compiler diagnostics on one or more LM files.
 */

import * as fs from 'node:fs';
import { LeveonasLanguageService } from '../../lsp';
import { DiagnosticSeverity } from '../../lsp/types';

export interface CheckOptions {
  files: string[];
  streaming?: boolean;
  quiet?: boolean;
}

export interface CheckResult {
  filePath: string;
  passed: boolean;
  diagnostics: Array<{
    line: number;
    column: number;
    severity: string;
    message: string;
    code?: string | number;
  }>;
}

export function runCheckCommand(options: CheckOptions): { success: boolean; results: CheckResult[] } {
  const lsp = new LeveonasLanguageService();
  const results: CheckResult[] = [];
  let allPassed = true;

  for (const filePath of options.files) {
    if (!fs.existsSync(filePath)) {
      if (!options.quiet) {
        console.error(`Error: File not found: ${filePath}`);
      }
      results.push({
        filePath,
        passed: false,
        diagnostics: [
          {
            line: 0,
            column: 0,
            severity: 'Error',
            message: `File not found: ${filePath}`,
          },
        ],
      });
      allPassed = false;
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const diags = lsp.getDiagnostics(content, { streaming: options.streaming });

    const formattedDiags = diags.map((d) => {
      let sev = 'Info';
      if (d.severity === DiagnosticSeverity.Error) sev = 'Error';
      else if (d.severity === DiagnosticSeverity.Warning) sev = 'Warning';
      else if (d.severity === DiagnosticSeverity.Hint) sev = 'Hint';

      return {
        line: d.range.start.line + 1,
        column: d.range.start.character + 1,
        severity: sev,
        message: d.message,
        code: d.code,
      };
    });

    const hasErrors = diags.some(
      (d) => d.severity === DiagnosticSeverity.Error && !d.isIncomplete
    );
    const passed = !hasErrors;
    if (!passed) allPassed = false;

    results.push({
      filePath,
      passed,
      diagnostics: formattedDiags,
    });

    if (!options.quiet) {
      if (formattedDiags.length === 0) {
        console.log(`✓ ${filePath}: Clean (no diagnostics)`);
      } else {
        console.log(`${passed ? '⚠' : '✗'} ${filePath}:`);
        for (const d of formattedDiags) {
          console.log(`  [${d.severity}] line ${d.line}:${d.column} - ${d.message} (${d.code})`);
        }
      }
    }
  }

  return { success: allPassed, results };
}
