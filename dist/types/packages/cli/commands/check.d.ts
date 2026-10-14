/**
 * Leveonas CLI: `leveonas check`
 *
 * Runs compiler diagnostics on one or more LM files.
 */
export interface CheckOptions {
    files: string[];
    streaming?: boolean;
    quiet?: boolean;
}
export interface CheckResult {
    filePath: string;
    passed: boolean;
    diagnostics: Array<{
        line: number;
        column: number;
        severity: string;
        message: string;
        code?: string | number;
    }>;
}
export declare function runCheckCommand(options: CheckOptions): {
    success: boolean;
    results: CheckResult[];
};
