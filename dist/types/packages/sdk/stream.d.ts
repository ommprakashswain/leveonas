import { StreamCallbacks } from './types';
export declare class StreamProcessor {
    private activeRequest;
    process(response: Response, callbacks: StreamCallbacks): Promise<void>;
    cancel(): void;
}
