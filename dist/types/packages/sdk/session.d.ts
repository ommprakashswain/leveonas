/**
 * Leveonas Public SDK Session API
 *
 * Provides a production developer interface for managing generation sessions,
 * real-time SSE streaming, lifecycle destruction, and telemetry collection.
 */
import { LeveonasSessionConfig, RenderRequest, RenderResponse, StreamCallbacks, StreamingEvent } from './types';
import { GenerationMetrics } from '../telemetry/metrics';
export declare class LeveonasSession {
    private config;
    private activeController;
    private lastMetrics;
    private isDestroyed;
    constructor(config?: LeveonasSessionConfig);
    /**
     * Generates UI from prompt or request.
     * Returns an AsyncIterable of StreamingEvents that also resolves to a RenderResponse when awaited.
     */
    generate(promptOrRequest: string | RenderRequest): AsyncIterable<StreamingEvent> & Promise<RenderResponse>;
    /**
     * Stream UI generation using explicit callbacks.
     */
    stream(requestOrPrompt: RenderRequest | string, callbacks?: StreamCallbacks): Promise<GenerationMetrics>;
    /**
     * Abort active generation.
     */
    abort(): void;
    /**
     * Cancel alias for abort.
     */
    cancel(): void;
    /**
     * Synchronous render alias.
     */
    render(request: RenderRequest): Promise<RenderResponse>;
    /**
     * Compile helper.
     */
    compile(request: any): Promise<any>;
    /**
     * Validate helper.
     */
    validate(request: any): Promise<any>;
    /**
     * Retrieve the metrics from the most recent generation run.
     */
    getMetrics(): GenerationMetrics | null;
    /**
     * Destroy the session and cleanup resources.
     */
    destroy(): void;
    private assertNotDestroyed;
}
/**
 * Creates a new Leveonas generation session.
 */
export declare function createSession(config?: LeveonasSessionConfig): LeveonasSession;
