import { PatchOperation } from '../runtime/incremental/patch-generator/types';
import { MinimalityIssue, PatchMinimality } from './types';
/**
 * PatchMinimalityAnalyzer
 * Evaluates whether AST changes are represented minimally by the patch generator.
 * Identifies issues such as:
 * - Replacing or removing/inserting a compatible node when only text changed
 * - Replacing or removing/inserting a node when only attributes changed
 * - Suboptimal node churn
 */
export declare class PatchMinimalityAnalyzer {
    private astUpdateCount;
    private patchOperationCount;
    private issues;
    /**
     * Record that a valid AST update snapshot occurred.
     */
    recordASTUpdate(): void;
    /**
     * Inspect a batch of patches for minimality.
     */
    inspectPatchBatch(patches: PatchOperation[]): void;
    /**
     * Record a custom minimality issue directly.
     */
    recordIssue(issue: MinimalityIssue): void;
    /**
     * Produce the final minimality metrics report.
     */
    getReport(): PatchMinimality;
}
