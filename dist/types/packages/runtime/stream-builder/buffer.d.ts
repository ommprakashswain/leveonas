export declare class StreamBuffer {
    private maxSize;
    private buffer;
    constructor(maxSize?: number);
    append(chunk: string): void;
    get(): string;
    clear(): void;
    get length(): number;
}
