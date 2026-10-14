import { ASTNode } from '../ast/nodes';
import { PatchOperation } from '../../runtime/incremental/patch-generator/types';
import { PipelineDiagnostic } from './diagnostics';

export interface ExecutionStatistics {
  scannerTime: number;
  tokenizerTime: number;
  lexerTime: number;
  parserTime: number;
  validatorTime: number;
  rendererTime: number;
  patchGeneratorTime: number;
  totalTime: number;
}

export interface CompilationResult {
  ast: ASTNode | null;
  html: string;
  patches: PatchOperation[];
  diagnostics: PipelineDiagnostic[];
  warnings: PipelineDiagnostic[];
  statistics: ExecutionStatistics;
  success: boolean;
}
