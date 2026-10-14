import { StreamBuilderConfig } from './types';
import { BuilderEvent } from './events';
export declare class StreamBuilder {
    private config;
    private buffer;
    private tracker;
    private checkpoints;
    private incremental;
    onEvent?: (event: BuilderEvent) => void;
    constructor(config?: StreamBuilderConfig);
    private emitEvent;
    push(chunk: string): void;
    complete(): void;
    getBuffer(): string;
}
