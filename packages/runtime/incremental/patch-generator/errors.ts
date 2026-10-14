export class PatchGeneratorError extends Error {
  constructor(message: string) {
    super(`PatchGeneratorError: ${message}`);
    this.name = 'PatchGeneratorError';
  }
}
