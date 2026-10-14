export class StreamBuilderError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'StreamBuilderError';
  }
}

export class BufferOverflowError extends StreamBuilderError {
  constructor() {
    super('buffer_overflow', 'Stream buffer exceeded maximum size');
  }
}
