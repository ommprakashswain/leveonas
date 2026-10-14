import { FormatterOptions } from './formatter';
export declare class HtmlWriter {
    private buffer;
    private formatter;
    constructor(options?: FormatterOptions);
    write(content: string): void;
    writeIndent(level: number): void;
    writeNewline(): void;
    getOutput(): string;
}
