import { LexicalTokenType } from '../lexer';

// Defines the grammar structures for LM components.
// For now, this just acts as a placeholder if we want to expand into a driven parser.
// The actual logic is implemented recursively in parser.ts.

export function isLiteral(type: LexicalTokenType): boolean {
  return (
    type === LexicalTokenType.StringLiteral ||
    type === LexicalTokenType.NumberLiteral ||
    type === LexicalTokenType.BooleanLiteral ||
    type === LexicalTokenType.Enum
  );
}
