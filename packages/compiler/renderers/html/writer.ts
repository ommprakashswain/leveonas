import { FormatterOptions, HtmlFormatter } from './formatter';

export class HtmlWriter {
  private buffer: string = '';
  private formatter: HtmlFormatter;

  constructor(options?: FormatterOptions) {
    this.formatter = new HtmlFormatter(options);
  }

  write(content: string) {
    this.buffer += content;
  }

  writeIndent(level: number) {
    this.buffer += this.formatter.getIndent(level);
  }

  writeNewline() {
    this.buffer += this.formatter.getNewline();
  }

  getOutput(): string {
    return this.buffer;
  }
}
