export class ASTError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ASTError';
  }
}
