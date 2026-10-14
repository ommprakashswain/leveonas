/**
 * Leveonas Unified CLI Router
 *
 * Dispatches commands: init, check, format, compile, inspect, audit, benchmark, help, version.
 *
 * Exit Code Contract:
 * - 0: Success
 * - 1: Validation / compilation failure
 * - 2: CLI usage error (missing args, invalid command/flag)
 * - 3: Security audit failure / dangerous pattern detected
 * - 4: Provider / network / runtime failure
 */

import { runInitCommand } from './commands/init';
import { runCheckCommand } from './commands/check';
import { runFormatCommand } from './commands/format';
import { runCompileCommand } from './commands/compile';
import { runInspectCommand } from './commands/inspect';
import { runBenchmarkCommand } from './commands/benchmark';
import { runAuditCommand } from './commands/audit';
import { BenchmarkFramework, BenchmarkScenarioId } from '../telemetry/scenarios';
import { VERSION } from '../version';

export function runCLI(args: string[]): Promise<number> | number {
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h' || args[0] === 'help') {
    printHelp();
    return 0;
  }

  if (args[0] === '--version' || args[0] === '-v' || args[0] === 'version') {
    console.log(`leveonas v${VERSION}`);
    return 0;
  }

  const command = args[0];
  const rest = args.slice(1);

  // Global flags
  let isJson = false;
  let isQuiet = false;
  let isVerbose = false;

  for (const arg of rest) {
    if (arg === '--json') isJson = true;
    if (arg === '--quiet' || arg === '-q') isQuiet = true;
    if (arg === '--verbose') isVerbose = true;
  }

  switch (command) {
    case 'init': {
      let template: 'html' | 'react' | 'vue' | 'svelte' | 'angular' = 'html';
      let force = false;
      let targetDir = process.cwd();

      for (let i = 0; i < rest.length; i++) {
        if (rest[i].startsWith('--template=')) {
          const t = rest[i].split('=')[1] as any;
          if (['html', 'react', 'vue', 'svelte', 'angular'].includes(t)) {
            template = t;
          } else {
            console.error(`Error: Unknown template "${t}". Supported: html, react, vue, svelte, angular`);
            return 2;
          }
        } else if (rest[i] === '--force' || rest[i] === '-f') {
          force = true;
        } else if (!rest[i].startsWith('-')) {
          targetDir = rest[i];
        }
      }

      const res = runInitCommand({ directory: targetDir, template, force, quiet: isQuiet });
      if (!res.success) {
        if (isJson) {
          console.log(JSON.stringify(res, null, 2));
        } else {
          console.error(`Error: ${res.error}`);
        }
        return 1;
      }
      if (isJson) {
        console.log(JSON.stringify(res, null, 2));
      }
      return 0;
    }

    case 'check': {
      const files: string[] = [];
      let streaming = false;

      for (let i = 0; i < rest.length; i++) {
        if (rest[i] === '--streaming' || rest[i] === '-s') {
          streaming = true;
        } else if (!rest[i].startsWith('-')) {
          files.push(rest[i]);
        }
      }

      if (files.length === 0) {
        console.error('Error: Please provide at least one file to check.');
        return 2; // CLI usage error
      }

      const res = runCheckCommand({ files, streaming, quiet: isQuiet });
      return res.success ? 0 : 1;
    }

    case 'format':
    case 'fmt': {
      const files: string[] = [];
      let write = false;
      let check = false;
      let tabSize = 2;

      for (let i = 0; i < rest.length; i++) {
        if (rest[i] === '--write' || rest[i] === '-w') {
          write = true;
        } else if (rest[i] === '--check' || rest[i] === '-c') {
          check = true;
        } else if (rest[i].startsWith('--tab-size=')) {
          tabSize = parseInt(rest[i].split('=')[1], 10) || 2;
        } else if (!rest[i].startsWith('-')) {
          files.push(rest[i]);
        }
      }

      if (files.length === 0) {
        console.error('Error: Please provide at least one file to format.');
        return 2;
      }

      const res = runFormatCommand({ files, write, check, tabSize });
      return res.success ? 0 : 1;
    }

    case 'compile': {
      let file = '';
      let target: 'ast' | 'ui-ir' | 'runtime-ir' | 'patch' = 'ui-ir';
      let json = true;
      let output: string | undefined;

      for (let i = 0; i < rest.length; i++) {
        if (rest[i].startsWith('--target=')) {
          target = rest[i].split('=')[1] as 'ast' | 'ui-ir' | 'runtime-ir' | 'patch';
        } else if (rest[i].startsWith('--output=') || rest[i].startsWith('-o=')) {
          output = rest[i].split('=')[1];
        } else if (rest[i] === '--json') {
          json = true;
        } else if (!rest[i].startsWith('-')) {
          file = rest[i];
        }
      }

      if (!file) {
        console.error('Error: Please specify an LM file to compile.');
        return 2;
      }

      const res = runCompileCommand({ file, target, json, output });
      return res.success ? 0 : 1;
    }

    case 'inspect': {
      let file = '';
      let json = false;

      for (let i = 0; i < rest.length; i++) {
        if (rest[i] === '--json') {
          json = true;
        } else if (!rest[i].startsWith('-')) {
          file = rest[i];
        }
      }

      if (!file) {
        console.error('Error: Please specify an LM file to inspect.');
        return 2;
      }

      const res = runInspectCommand({ file, json });
      return res.success ? 0 : 1;
    }

    case 'benchmark': {
      let provider = 'gemini';
      let model = 'gemini-2.5-flash';
      let framework: BenchmarkFramework = 'react';
      let scenario: BenchmarkScenarioId = 'scenario_a';
      let iterations = 3;
      let json = isJson;

      for (let i = 0; i < rest.length; i++) {
        if (rest[i].startsWith('--provider=')) {
          provider = rest[i].split('=')[1];
        } else if (rest[i].startsWith('--model=')) {
          model = rest[i].split('=')[1];
        } else if (rest[i].startsWith('--framework=')) {
          framework = rest[i].split('=')[1] as BenchmarkFramework;
        } else if (rest[i].startsWith('--scenario=')) {
          scenario = rest[i].split('=')[1] as BenchmarkScenarioId;
        } else if (rest[i].startsWith('--iterations=') || rest[i].startsWith('-n=')) {
          iterations = parseInt(rest[i].split('=')[1], 10) || 3;
        } else if (rest[i] === '--json') {
          json = true;
        }
      }

      return runBenchmarkCommand({
        provider,
        model,
        framework,
        scenario,
        iterations,
        json,
      }).then((res) => (res.success ? 0 : 4));
    }

    case 'audit':
    case 'security': {
      const files: string[] = [];
      let json = isJson;

      for (let i = 0; i < rest.length; i++) {
        if (rest[i] === '--json') {
          json = true;
        } else if (!rest[i].startsWith('-')) {
          files.push(rest[i]);
        }
      }

      if (files.length === 0) {
        console.error('Error: Please provide at least one file to audit.');
        return 2;
      }

      const res = runAuditCommand({ files, json });
      return res.success ? 0 : 3; // 3 = security failure
    }

    default:
      console.error(`Unknown command: ${command}`);
      printHelp();
      return 2;
  }
}

function printHelp(): void {
  console.log(`
Leveonas CLI — Production Developer Platform & Tooling

USAGE:
  leveonas <command> [options] [files...]

COMMANDS:
  init [dir]                Initialize a new Leveonas project with starter templates
                            Options: --template=html|react|vue|svelte|angular, --force

  check <files...>          Check LM files for syntax, typing, and reactivity errors
                            Options: --streaming, --quiet, --json

  format <files...>         Format LM files deterministically
                            Options: --write (-w), --check (-c), --tab-size=2

  compile <file>            Compile LM file to target representation
                            Options: --target=ast|ui-ir|runtime-ir|patch, --output=out.json, --json

  inspect <file>            Inspect AST, Reactivity Graph, DOM dependencies, and patches
                            Options: --json

  audit <files...>          Audit LM files for security vulnerabilities, unsafe URLs, and handlers
                            Options: --json

  benchmark                 Run reproducible A/B performance benchmark across frameworks & scenarios
                            Options: --provider=gemini|openai|grok, --framework=react|vue|svelte|angular|html,
                                     --scenario=scenario_a|b|c|d|e, --iterations=3, --json, --csv

  help                      Show this help message
  version                   Show version information

GLOBAL OPTIONS:
  --json                    Output machine-readable JSON
  --quiet, -q               Suppress non-error log messages
  --verbose                 Show detailed debug information
  --version, -v             Print version
  --help, -h                Print help

EXIT CODES:
  0                         Success
  1                         Validation / compilation failure
  2                         CLI usage error (invalid flags, missing arguments)
  3                         Security audit failure / dangerous pattern detected
  4                         Provider / network / runtime failure
`);
}
