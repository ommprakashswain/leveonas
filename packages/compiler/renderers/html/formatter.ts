export interface FormatterOptions {
  minify?: boolean;
  indentSize?: number;
}

export class HtmlFormatter {
  constructor(private options: FormatterOptions = {}) {}

  format(html: string): string {
    if (this.options.minify) {
      return html.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
    }
    return html; // A real formatter might implement recursive DOM printing
  }
  
  getIndent(level: number): string {
    if (this.options.minify) return '';
    const size = this.options.indentSize ?? 2;
    return ' '.repeat(level * size);
  }
  
  getNewline(): string {
    if (this.options.minify) return '';
    return '\n';
  }
}
