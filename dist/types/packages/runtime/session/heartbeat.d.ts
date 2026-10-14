export declare class HeartbeatManager {
    private onHeartbeat;
    private intervalMs;
    private timer;
    constructor(onHeartbeat: () => void, intervalMs?: number);
    start(): void;
    stop(): void;
}
