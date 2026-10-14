import { GenerationMetrics } from '../telemetry/metrics';
import { LeveonasSecurityLimits } from '../security/limits';
import { RetryPolicy } from './provider';
export interface RenderRequest {
    prompt: string;
    model?: string;
    provider?: string;
    maxTokens?: number;
    temperature?: number;
    systemInstruction?: string;
    telemetry?: boolean;
}
export interface RenderResponse {
    html: string;
    ast: any;
    metrics?: GenerationMetrics;
}
export type StreamingEventType = 'generation:start' | 'generation:chunk' | 'generation:patch' | 'generation:diagnostic' | 'generation:error' | 'generation:complete';
export interface StreamingEventStart {
    type: 'generation:start';
    timestamp: number;
}
export interface StreamingEventChunk {
    type: 'generation:chunk';
    text: string;
    delta: string;
    timestamp: number;
}
export interface StreamingEventPatch {
    type: 'generation:patch';
    patch: any;
    timestamp: number;
}
export interface StreamingEventDiagnostic {
    type: 'generation:diagnostic';
    diagnostic: any;
    timestamp: number;
}
export interface StreamingEventError {
    type: 'generation:error';
    error: Error;
    code?: string;
    timestamp: number;
}
export interface StreamingEventComplete {
    type: 'generation:complete';
    metrics: GenerationMetrics;
    timestamp: number;
}
export type StreamingEvent = StreamingEventStart | StreamingEventChunk | StreamingEventPatch | StreamingEventDiagnostic | StreamingEventError | StreamingEventComplete;
export interface StreamCallbacks {
    /** Called when the stream starts. */
    onStart?: () => void;
    /** Called when a text chunk is received. */
    onChunk?: (text: string) => void;
    /** Called when a patch is received. */
    onPatch?: (patch: any) => void;
    /** Called when a diagnostic is received. */
    onDiagnostic?: (diagnostic: any) => void;
    /** Called when the stream completes successfully. */
    onComplete?: (metrics?: GenerationMetrics) => void;
    /** Called when an error occurs during streaming. */
    onError?: (error: Error) => void;
}
export interface LeveonasSessionConfig {
    endpoint?: string;
    apiKey?: string;
    provider?: string;
    model?: string;
    limits?: Partial<LeveonasSecurityLimits>;
    retryPolicy?: Partial<RetryPolicy>;
    telemetry?: boolean;
    fetchFn?: typeof fetch;
}
export interface CompileRequest {
    source: string;
    framework?: string;
}
export interface CompileResponse {
    html: string;
    ast: any;
    success: boolean;
    diagnostics: any[];
}
export interface ValidateRequest {
    source: string;
    framework?: string;
}
export interface ValidateResponse {
    valid: boolean;
    diagnostics: any[];
}
