export function isWhitespace(char: string): boolean {
  return char === ' ' || char === '\t' || char === '\n' || char === '\r';
}

export function isAlpha(char: string): boolean {
  return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || char === '_';
}

export function isDigit(char: string): boolean {
  return char >= '0' && char <= '9';
}

export function isAlphaNumeric(char: string): boolean {
  return isAlpha(char) || isDigit(char);
}
