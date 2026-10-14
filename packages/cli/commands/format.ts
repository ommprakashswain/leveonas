/**
 * Leveonas CLI: `leveonas format`
 *
 * Formats LM files deterministically.
 */

import * as fs from 'node:fs';
import { LeveonasFormatter } from '../../lsp/formatter';

export interface FormatOptions {
  files: string[];
  write?: boolean;
  check?: boolean;
  tabSize?: number;
}

export interface FormatResult {
  filePath: string;
  isFormatted: boolean;
  formattedContent: string;
}

export function runFormatCommand(options: FormatOptions): { success: boolean; results: FormatResult[] } {
  const results: FormatResult[] = [];
  let allFormatted = true;

  for (const filePath of options.files) {
    if (!fs.existsSync(filePath)) {
      console.error(`Error: File not found: ${filePath}`);
      allFormatted = false;
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const formatted = LeveonasFormatter.format(content, { tabSize: options.tabSize ?? 2 });
    const isFormatted = content === formatted;

    if (!isFormatted) {
      allFormatted = false;
    }

    results.push({
      filePath,
      isFormatted,
      formattedContent: formatted,
    });

    if (options.write && !isFormatted) {
      fs.writeFileSync(filePath, formatted, 'utf-8');
      console.log(`✓ Formatted: ${filePath}`);
    } else if (options.check) {
      if (isFormatted) {
        console.log(`✓ ${filePath} is properly formatted.`);
      } else {
        console.log(`✗ ${filePath} needs formatting.`);
      }
    } else if (!options.write && !options.check) {
      // Print formatted output to stdout
      console.log(formatted);
    }
  }

  const success = options.check ? allFormatted : true;
  return { success, results };
}
