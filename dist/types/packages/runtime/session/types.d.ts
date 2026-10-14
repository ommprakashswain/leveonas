export type SessionState = 'CREATED' | 'INITIALIZING' | 'STREAMING' | 'PAUSED' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
export interface SessionConfig {
    id: string;
    timeoutMs?: number;
    heartbeatIntervalMs?: number;
    batchIntervalMs?: number;
}
export interface SessionMetrics {
    startTime: number;
    lastActiveTime: number;
    patchesSent: number;
    bytesSent: number;
}
