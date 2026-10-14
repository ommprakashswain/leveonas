export class PatchExecutorError extends Error {
  constructor(message: string) {
    super(`PatchExecutorError: ${message}`);
    this.name = 'PatchExecutorError';
  }
}
