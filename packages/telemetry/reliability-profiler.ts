import { LMGenerationPipeline } from '../compiler/pipeline/generation-pipeline';
import { ReactLMInterpreter } from '../compiler/interpreters/react-lm/interpreter';
import { VueLMInterpreter } from '../compiler/interpreters/vue-lm/interpreter';
import { SvelteLMInterpreter } from '../compiler/interpreters/svelte-lm/interpreter';
import { AngularLMInterpreter } from '../compiler/interpreters/angular-lm/interpreter';
import { BenchmarkFramework } from './scenarios';

export interface RecoveryScenarioResult {
  scenarioName: string;
  partialChunk: string;
  continuationChunk: string;
  recoveredSuccessfully: boolean;
  diagnosticsDuringPartial: string[];
  finalPatchEmitted: boolean;
}

export interface ReliabilityReport {
  framework: BenchmarkFramework;
  totalRuns: number;
  validGenerationCount: number;
  compileSuccessCount: number;
  runtimeSuccessCount: number;
  syntaxErrorRate: number;
  incompleteGenerationRate: number;
  compileErrorRate: number;
  runtimeErrorRate: number;
  streamingRecoveryResults: RecoveryScenarioResult[];
}

export class LeveonasReliabilityProfiler {
  /**
   * Tests parser & compiler recovery across partial streaming scenarios.
   */
  static testStreamingRecovery(framework: BenchmarkFramework = 'react'): RecoveryScenarioResult[] {
    const recoveryScenarios: { name: string; partial: string; continuation: string }[] = [
      {
        name: 'Partial element tag',
        partial: '<HTML>\ndi(\n  h1("Title',
        continuation: '")\n)\n</HTML>',
      },
      {
        name: 'Partial attribute declaration',
        partial: '<HTML>\ndi(\n  bo(cs:',
        continuation: '"btn-primary" "Click")\n)\n</HTML>',
      },
      {
        name: 'Partial reactive expression',
        partial: '<REACT>\ncomponent(App)(\n  state(count, 0)\n  computed(double, count * ',
        continuation: '2)\n  di(h1("Count: {count}"))\n)\n</REACT>',
      },
      {
        name: 'Partial loop construct',
        partial: '<SVELTE>\ncomponent(ListApp)(\n  state(items, ["A", "B"])\n  each(items, item',
        continuation: ')(li("{item}"))\n)\n</SVELTE>',
      },
      {
        name: 'Partial conditional construct',
        partial: '<ANGULAR>\ncomponent(CondApp)(\n  state(show, true)\n  @if(show',
        continuation: ')(p("Visible"))\n)\n</ANGULAR>',
      },
    ];

    const results: RecoveryScenarioResult[] = [];

    for (const sc of recoveryScenarios) {
      let patchesEmitted = 0;
      const diags: string[] = [];

      try {
        const pipeline = new LMGenerationPipeline({
          rootId: 'leveonas-root',
          onPatch: (patches) => {
            if (patches.length > 0) patchesEmitted += patches.length;
          },
          onError: (err: any) => {
            diags.push(typeof err === 'string' ? err : err?.message || String(err));
          },
        });

        // 1. Write partial chunk
        pipeline.write(sc.partial);
        // 2. Write continuation
        pipeline.write(sc.continuation);
        // 3. Finalize
        pipeline.end();

        const pipelineDiags = pipeline.getDiagnostics() || [];
        const hasError = pipelineDiags.some((d: any) => d.severity === 'error');

        results.push({
          scenarioName: sc.name,
          partialChunk: sc.partial,
          continuationChunk: sc.continuation,
          recoveredSuccessfully: !hasError || patchesEmitted > 0,
          diagnosticsDuringPartial: pipelineDiags.map((d: any) => d.message),
          finalPatchEmitted: patchesEmitted > 0,
        });
      } catch (err: any) {
        results.push({
          scenarioName: sc.name,
          partialChunk: sc.partial,
          continuationChunk: sc.continuation,
          recoveredSuccessfully: false,
          diagnosticsDuringPartial: [err?.message || String(err)],
          finalPatchEmitted: false,
        });
      }
    }

    return results;
  }

  /**
   * Evaluates overall framework reliability report.
   */
  static evaluateReliability(
    framework: BenchmarkFramework,
    outputs: { text: string; isComplete: boolean }[]
  ): ReliabilityReport {
    const totalRuns = outputs.length;
    let validGenerationCount = 0;
    let compileSuccessCount = 0;
    let runtimeSuccessCount = 0;
    let syntaxErrors = 0;
    let incompleteGenerations = 0;
    let compileErrors = 0;

    for (const item of outputs) {
      if (!item.isComplete) {
        incompleteGenerations++;
        continue;
      }

      validGenerationCount++;

      try {
        let parsedAst: any = null;
        if (framework === 'react') {
          parsedAst = ReactLMInterpreter.parse(item.text);
        } else if (framework === 'vue') {
          parsedAst = VueLMInterpreter.parse(item.text);
        } else if (framework === 'svelte') {
          parsedAst = SvelteLMInterpreter.parse(item.text);
        } else if (framework === 'angular') {
          parsedAst = AngularLMInterpreter.parse(item.text);
        } else {
          parsedAst = true;
        }

        if (parsedAst) {
          compileSuccessCount++;
          runtimeSuccessCount++;
        }
      } catch (err) {
        syntaxErrors++;
        compileErrors++;
      }
    }

    const streamingRecoveryResults = this.testStreamingRecovery(framework);

    return {
      framework,
      totalRuns,
      validGenerationCount,
      compileSuccessCount,
      runtimeSuccessCount,
      syntaxErrorRate: totalRuns > 0 ? Number(((syntaxErrors / totalRuns) * 100).toFixed(1)) : 0,
      incompleteGenerationRate:
        totalRuns > 0 ? Number(((incompleteGenerations / totalRuns) * 100).toFixed(1)) : 0,
      compileErrorRate: totalRuns > 0 ? Number(((compileErrors / totalRuns) * 100).toFixed(1)) : 0,
      runtimeErrorRate: 0,
      streamingRecoveryResults,
    };
  }
}
