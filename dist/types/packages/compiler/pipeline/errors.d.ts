export declare class PipelineError extends Error {
    readonly stage?: string | undefined;
    constructor(message: string, stage?: string | undefined);
}
