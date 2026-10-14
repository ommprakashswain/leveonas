import { LeveonasConfig, DEFAULT_CONFIG } from './config';
import { LeveonasError, TimeoutError, AuthenticationError, ValidationError } from './errors';
import { getAuthHeaders } from './auth';
import { mergeHeaders, delay, logDebug } from './utils';

export class Transport {
  private config: LeveonasConfig;

  constructor(config: LeveonasConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retries: number = this.config.retries || 0
  ): Promise<T> {
    const baseUrl = this.config.baseUrl || DEFAULT_CONFIG.baseUrl;
    const url = `${baseUrl}${endpoint}`;
    const headers = mergeHeaders(
      {
        'Content-Type': 'application/json',
        ...getAuthHeaders(this.config)
      },
      this.config.headers
    );

    let attempt = 0;
    while (attempt <= retries) {
      const controller = new AbortController();
      let timeoutId: any = null;

      if (this.config.timeout) {
        timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
      }

      try {
        logDebug(this.config.debug || false, `Requesting ${url} (attempt ${attempt + 1})`);
        
        const response = await fetch(url, {
          ...options,
          headers: {
            ...headers,
            ...(options.headers as any || {})
          },
          signal: options.signal || controller.signal
        });

        if (timeoutId) clearTimeout(timeoutId);

        if (!response.ok) {
          await this.handleError(response);
        }

        const data = await response.json();
        return data as T;
      } catch (error: any) {
        if (timeoutId) clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
          if (!options.signal?.aborted) {
             throw new TimeoutError();
          }
          throw error;
        }

        if (error instanceof LeveonasError) {
          throw error;
        }

        if (attempt >= retries) {
          throw new LeveonasError(error.message || 'Network request failed');
        }

        attempt++;
        const backoff = Math.pow(2, attempt) * 100;
        await delay(backoff);
      }
    }

    throw new LeveonasError('Max retries reached');
  }

  async requestStream(
    endpoint: string,
    options: RequestInit = {},
    retries: number = this.config.retries || 0
  ): Promise<Response> {
    const baseUrl = this.config.baseUrl || DEFAULT_CONFIG.baseUrl;
    const url = `${baseUrl}${endpoint}`;
    const headers = mergeHeaders(
      {
        'Content-Type': 'application/json',
        ...getAuthHeaders(this.config)
      },
      this.config.headers
    );

    let attempt = 0;
    while (attempt <= retries) {
      const controller = new AbortController();
      let timeoutId: any = null;

      if (this.config.timeout) {
        timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
      }

      try {
        logDebug(this.config.debug || false, `Streaming ${url} (attempt ${attempt + 1})`);
        
        const response = await fetch(url, {
          ...options,
          headers: {
            ...headers,
            ...(options.headers as any || {})
          },
          signal: options.signal || controller.signal
        });

        if (timeoutId) clearTimeout(timeoutId);

        if (!response.ok) {
          await this.handleError(response);
        }

        return response;
      } catch (error: any) {
        if (timeoutId) clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
          if (!options.signal?.aborted) {
             throw new TimeoutError();
          }
          throw error;
        }

        if (error instanceof LeveonasError) {
          throw error;
        }

        if (attempt >= retries) {
          throw new LeveonasError(error.message || 'Network stream request failed');
        }

        attempt++;
        const backoff = Math.pow(2, attempt) * 100;
        await delay(backoff);
      }
    }
    throw new LeveonasError('Max retries reached');
  }

  private async handleError(response: Response) {
    let message = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      message = errorData.error || errorData.message || message;
    } catch {
      try {
        message = await response.text() || message;
      } catch {}
    }

    if (response.status === 401 || response.status === 403) {
      throw new AuthenticationError(message);
    } else if (response.status === 400) {
      throw new ValidationError(message);
    } else {
      throw new LeveonasError(message, response.status);
    }
  }
}
