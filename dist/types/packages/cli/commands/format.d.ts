/**
 * Leveonas CLI: `leveonas format`
 *
 * Formats LM files deterministically.
 */
export interface FormatOptions {
    files: string[];
    write?: boolean;
    check?: boolean;
    tabSize?: number;
}
export interface FormatResult {
    filePath: string;
    isFormatted: boolean;
    formattedContent: string;
}
export declare function runFormatCommand(options: FormatOptions): {
    success: boolean;
    results: FormatResult[];
};
