import { BufferOverflowError } from './errors';

export class StreamBuffer {
  private buffer: string = '';
  
  constructor(private maxSize: number = 1024 * 1024 * 50) {} // 50MB default

  append(chunk: string) {
    if (this.buffer.length + chunk.length > this.maxSize) {
      throw new BufferOverflowError();
    }
    this.buffer += chunk;
  }

  get(): string {
    return this.buffer;
  }
  
  clear() {
    this.buffer = '';
  }
  
  get length(): number {
    return this.buffer.length;
  }
}
