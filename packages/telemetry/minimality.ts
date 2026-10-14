import {
  PatchOperation,
  PatchOperationType,
  normalizePatchOperationType,
} from '../runtime/incremental/patch-generator/types';
import { MinimalityIssue, PatchMinimality } from './types';

/**
 * PatchMinimalityAnalyzer
 * Evaluates whether AST changes are represented minimally by the patch generator.
 * Identifies issues such as:
 * - Replacing or removing/inserting a compatible node when only text changed
 * - Replacing or removing/inserting a node when only attributes changed
 * - Suboptimal node churn
 */
export class PatchMinimalityAnalyzer {
  private astUpdateCount: number = 0;
  private patchOperationCount: number = 0;
  private issues: MinimalityIssue[] = [];

  /**
   * Record that a valid AST update snapshot occurred.
   */
  public recordASTUpdate(): void {
    this.astUpdateCount++;
  }

  /**
   * Inspect a batch of patches for minimality.
   */
  public inspectPatchBatch(patches: PatchOperation[]): void {
    this.patchOperationCount += patches.length;

    // Scan for potential non-minimal sequences
    for (let i = 0; i < patches.length; i++) {
      const current = patches[i];
      const currentType = normalizePatchOperationType(current.operation || (current as any).type);

      // Check 1: Explicit REPLACE_NODE when only text or attributes changed
      if (currentType === PatchOperationType.REPLACE_NODE) {
        const oldNode = (current as any).oldNode || current.payload?.oldNode;
        const newNode = (current as any).newNode || current.payload?.newNode;
        if (oldNode && newNode && oldNode.kind === newNode.kind && oldNode.name === newNode.name) {
          this.issues.push({
            type: 'REPLACE_NODE_ON_COMPATIBLE_NODE',
            nodeId: current.nodeId,
            description: `Compatible node <${oldNode.name}> was replaced with REPLACE_NODE instead of updating attributes or text in-place`,
            details: { oldNode, newNode },
          });
        }
      }

      // Check 2: Sequential REMOVE_CHILD followed by INSERT_CHILD at same index / same parent
      if (currentType === PatchOperationType.REMOVE_CHILD && i + 1 < patches.length) {
        const next = patches[i + 1];
        const nextType = normalizePatchOperationType(next.operation || (next as any).type);
        if (
          nextType === PatchOperationType.INSERT_CHILD &&
          next.nodeId === current.nodeId &&
          (next.index === current.index || (next as any).index === (current as any).index)
        ) {
          const removedChild = (current as any).childNode || current.payload?.childNode;
          const insertedChild = (next as any).childNode || next.payload?.childNode;
          if (
            removedChild &&
            insertedChild &&
            removedChild.kind === insertedChild.kind &&
            removedChild.name === insertedChild.name
          ) {
            this.issues.push({
              type: 'REMOVE_AND_INSERT_INSTEAD_OF_UPDATE',
              nodeId: current.nodeId,
              description: `Node <${removedChild.name}> at parent ${current.nodeId} was removed and immediately re-inserted instead of in-place UPDATE_TEXT or SET_ATTRIBUTE`,
              details: { removedChild, insertedChild },
            });
          }
        }
      }
    }
  }

  /**
   * Record a custom minimality issue directly.
   */
  public recordIssue(issue: MinimalityIssue): void {
    this.issues.push(issue);
  }

  /**
   * Produce the final minimality metrics report.
   */
  public getReport(): PatchMinimality {
    const patchOps = this.patchOperationCount;
    const astUpdates = this.astUpdateCount;
    const patchOperationsPerAstUpdate = astUpdates > 0 ? patchOps / astUpdates : 0;

    return {
      patchOperationsPerAstUpdate,
      astUpdateCount: astUpdates,
      patchOperationCount: patchOps,
      minimalityIssues: [...this.issues],
      isMinimal: this.issues.length === 0,
    };
  }
}
