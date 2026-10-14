import { LeveonasConfig } from './config';
import { Transport } from './transport';
import { StreamProcessor } from './stream';
import { Renderer } from './renderer';
import {
  RenderRequest,
  RenderResponse,
  StreamCallbacks,
  CompileRequest,
  CompileResponse,
  ValidateRequest,
  ValidateResponse
} from './types';

/**
 * The official Leveonas JavaScript/TypeScript SDK.
 */
export class Leveonas {
  private transport: Transport;
  private streamProcessor: StreamProcessor;
  private activeController: AbortController | null = null;
  public renderer: Renderer;

  /**
   * Initialize a new Leveonas client
   * @param config Configuration options for the Leveonas client
   */
  constructor(config: LeveonasConfig = { apiKey: '' }) {
    this.transport = new Transport({ apiKey: '', ...config });
    this.streamProcessor = new StreamProcessor();
    this.renderer = new Renderer();
  }

  /**
   * Generate/render a complete UI synchronously.
   * @param request Render configuration
   * @returns Generated HTML and AST
   */
  async generate(request: RenderRequest): Promise<RenderResponse> {
    return this.render(request);
  }

  /**
   * Render a complete UI synchronously.
   * @param request Render configuration
   * @returns Generated HTML and AST
   */
  async render(request: RenderRequest): Promise<RenderResponse> {
    return this.transport.request<RenderResponse>('/api/render', {
      method: 'POST',
      body: JSON.stringify(request)
    });
  }

  /**
   * Stream UI generation in real-time.
   * @param request Render configuration
   * @param callbacks Stream event callbacks
   */
  async stream(request: RenderRequest, callbacks: StreamCallbacks): Promise<void> {
    this.activeController = new AbortController();
    
    try {
      const response = await this.transport.requestStream('/api/generate', {
        method: 'POST',
        body: JSON.stringify(request),
        signal: this.activeController.signal
      });

      await this.streamProcessor.process(response, callbacks);
    } finally {
      this.activeController = null;
    }
  }

  /**
   * Compile a Leveonas DSL string into HTML and AST.
   * @param request Compile request payload
   * @returns Compilation results including HTML, AST, and diagnostics
   */
  async compile(request: CompileRequest): Promise<CompileResponse> {
    return this.transport.request<CompileResponse>('/api/compile', {
      method: 'POST',
      body: JSON.stringify(request)
    });
  }

  /**
   * Validate a Leveonas DSL string.
   * @param request Validate request payload
   * @returns Validation diagnostics
   */
  async validate(request: ValidateRequest): Promise<ValidateResponse> {
    return this.transport.request<ValidateResponse>('/api/validate', {
      method: 'POST',
      body: JSON.stringify(request)
    });
  }

  /**
   * Cancel any active streaming or fetch request.
   */
  cancel(): void {
    if (this.activeController) {
      this.activeController.abort();
      this.activeController = null;
    }
    this.streamProcessor.cancel();
  }

  /**
   * Abort alias for cancel.
   */
  abort(): void {
    this.cancel();
  }
}
