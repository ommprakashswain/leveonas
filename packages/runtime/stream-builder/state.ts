import { SyntaxState } from './types';

export class SyntaxTracker {
  public state: SyntaxState = 'NORMAL';
  public braceDepth: number = 0;
  public escapeNext: boolean = false;
  public quoteChar: string | null = null;
  
  feed(text: string) {
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = i + 1 < text.length ? text[i + 1] : null;

      if (this.state === 'NORMAL') {
        if (char === '/' && nextChar === '/') {
          this.state = 'IN_COMMENT';
          i++; // Skip next
        } else if (char === '"' || char === "'") {
          this.state = 'IN_STRING';
          this.quoteChar = char;
        } else if (char === '{') {
          this.braceDepth++;
        } else if (char === '}') {
          this.braceDepth = Math.max(0, this.braceDepth - 1);
        }
      } else if (this.state === 'IN_STRING') {
        if (this.escapeNext) {
          this.escapeNext = false;
        } else if (char === '\\') {
          this.escapeNext = true;
        } else if (char === this.quoteChar) {
          this.state = 'NORMAL';
          this.quoteChar = null;
        }
      } else if (this.state === 'IN_COMMENT') {
        if (char === '\n') {
          this.state = 'NORMAL';
        }
      }
    }
  }

  clone(): SyntaxTracker {
    const clone = new SyntaxTracker();
    clone.state = this.state;
    clone.braceDepth = this.braceDepth;
    clone.escapeNext = this.escapeNext;
    clone.quoteChar = this.quoteChar;
    return clone;
  }
}
