export class PipelineError extends Error {
  constructor(message: string, public readonly stage?: string) {
    super(message);
    this.name = 'PipelineError';
  }
}
