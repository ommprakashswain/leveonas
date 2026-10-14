import { PatchOperation } from '../runtime/incremental/patch-generator/types';
import { ClientTelemetry, ServerTelemetrySummary } from '../telemetry/types';
export interface EngineConfig {
    apiKey?: string;
    userLlmKey?: string;
    apiUrl?: string;
    baseUrl?: string;
    origin?: string;
}
export interface GenerateOptions {
    container: string | HTMLElement;
    prompt: string;
    provider: string;
    model: string;
    maxTokens?: number;
    emitDebugText?: boolean;
    telemetry?: boolean;
    onTelemetry?: (telemetry: ClientTelemetry) => void;
    onServerTelemetry?: (telemetry: ServerTelemetrySummary) => void;
    onChunk?: (chunk: string) => void;
    onPatch?: (patches: PatchOperation[]) => void;
    onComplete?: () => void;
    onError?: (error: string) => void;
    onQuotaExceeded?: () => void;
    fallbackMode?: boolean;
}
export declare class Engine {
    static readonly DEFAULT_SANDBOX = "allow-scripts";
    apiKey: string;
    userLlmKey: string;
    apiUrl: string;
    runtimeScriptUrl: string;
    expectedOrigin: string;
    private controller;
    private activeMessageListener;
    constructor(config?: EngineConfig);
    generate(options: GenerateOptions): void;
    static buildIframeSrcdoc(runtimeUrl: string, parentOrigin: string): string;
    abort(): void;
    private cleanupListener;
    private _stream;
}
