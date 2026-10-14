import { ASTNode } from '../ast/nodes';
import { ValidationContext } from './context';
import { StandardRules } from './rules';
import { Diagnostic, ValidationRule } from './types';

export class SemanticValidator {
  private rules: ValidationRule[] = [];

  constructor() {
    this.rules = [...StandardRules];
  }

  addRule(rule: ValidationRule) {
    this.rules.push(rule);
  }

  validate(rootNode: ASTNode): Diagnostic[] {
    const context = new ValidationContext(rootNode);

    for (const rule of this.rules) {
      try {
        rule.validate(context);
      } catch (err) {
        context.reportError(
          'V_FATAL',
          `Rule ${rule.name} failed with an exception: ${err instanceof Error ? err.message : String(err)}`,
          { startLine: 0, startColumn: 0, startOffset: 0, endLine: 0, endColumn: 0, endOffset: 0 }
        );
      }
    }

    return context.diagnostics.getDiagnostics();
  }
}
