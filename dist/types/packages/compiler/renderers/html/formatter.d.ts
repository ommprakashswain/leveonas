export interface FormatterOptions {
    minify?: boolean;
    indentSize?: number;
}
export declare class HtmlFormatter {
    private options;
    constructor(options?: FormatterOptions);
    format(html: string): string;
    getIndent(level: number): string;
    getNewline(): string;
}
