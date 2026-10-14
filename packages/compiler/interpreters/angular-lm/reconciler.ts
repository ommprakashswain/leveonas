import { RootNode } from '../../ast/nodes';
import { JSProgramNode } from '../js-lm/ast';
import { CommonUIReconciler, CommonUIReconciliationResult } from '../../ui-ir/reconciler';
import { AngularToLowering } from '../../ui-ir/lowering/angular-lowering';
import { AngularProgramNode } from './ast';

export interface AngularReconciliationResult {
  domAST: RootNode;
  jsProgram: JSProgramNode;
  componentInstancesCount: number;
}

/**
 * AngularReconciler
 * Compiler-side wrapper lowering Angular AST to Common UI IR and reconciling via CommonUIReconciler.
 * (Zero duplicate runtime or DOM engine)
 */
export class AngularReconciler {
  private program: AngularProgramNode;

  constructor(program: AngularProgramNode) {
    this.program = program;
  }

  public reconcile(rootComponentName?: string): AngularReconciliationResult {
    const uiirProgram = AngularToLowering.lower(this.program);
    const reconciler = new CommonUIReconciler(uiirProgram);
    const result: CommonUIReconciliationResult = reconciler.reconcile(rootComponentName);

    return {
      domAST: result.domAST,
      jsProgram: result.jsProgram,
      componentInstancesCount: result.metrics.componentInstancesCount,
    };
  }
}
