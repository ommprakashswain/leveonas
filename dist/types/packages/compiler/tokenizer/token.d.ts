import { TokenType, Token } from './types';
export declare function createToken(type: TokenType, value: string, line: number, column: number, offset: number): Token;
