import { TokenType, Token } from './types';

export function createToken(type: TokenType, value: string, line: number, column: number, offset: number): Token {
  return { type, value, line, column, offset };
}
