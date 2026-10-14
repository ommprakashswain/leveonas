import { LeveonasConfig } from './config';
import { Renderer } from './renderer';
import { RenderRequest, RenderResponse, StreamCallbacks, CompileRequest, CompileResponse, ValidateRequest, ValidateResponse } from './types';
/**
 * The official Leveonas JavaScript/TypeScript SDK.
 */
export declare class Leveonas {
    private transport;
    private streamProcessor;
    private activeController;
    renderer: Renderer;
    /**
     * Initialize a new Leveonas client
     * @param config Configuration options for the Leveonas client
     */
    constructor(config?: LeveonasConfig);
    /**
     * Generate/render a complete UI synchronously.
     * @param request Render configuration
     * @returns Generated HTML and AST
     */
    generate(request: RenderRequest): Promise<RenderResponse>;
    /**
     * Render a complete UI synchronously.
     * @param request Render configuration
     * @returns Generated HTML and AST
     */
    render(request: RenderRequest): Promise<RenderResponse>;
    /**
     * Stream UI generation in real-time.
     * @param request Render configuration
     * @param callbacks Stream event callbacks
     */
    stream(request: RenderRequest, callbacks: StreamCallbacks): Promise<void>;
    /**
     * Compile a Leveonas DSL string into HTML and AST.
     * @param request Compile request payload
     * @returns Compilation results including HTML, AST, and diagnostics
     */
    compile(request: CompileRequest): Promise<CompileResponse>;
    /**
     * Validate a Leveonas DSL string.
     * @param request Validate request payload
     * @returns Validation diagnostics
     */
    validate(request: ValidateRequest): Promise<ValidateResponse>;
    /**
     * Cancel any active streaming or fetch request.
     */
    cancel(): void;
    /**
     * Abort alias for cancel.
     */
    abort(): void;
}
