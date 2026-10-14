export class RenderError extends Error {
  constructor(message: string) {
    super(`RenderError: ${message}`);
    this.name = 'RenderError';
  }
}
