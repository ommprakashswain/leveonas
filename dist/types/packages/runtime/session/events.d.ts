export declare enum SessionEventType {
    CREATED = "SessionCreated",
    STARTED = "SessionStarted",
    PATCH_QUEUED = "PatchQueued",
    PATCH_SENT = "PatchSent",
    PATCH_ACKNOWLEDGED = "PatchAcknowledged",
    COMPLETED = "SessionCompleted",
    CANCELLED = "SessionCancelled",
    EXPIRED = "SessionExpired",
    ERROR = "SessionError",
    HEARTBEAT = "SessionHeartbeat"
}
export interface SessionEvent {
    type: SessionEventType;
    sessionId: string;
    timestamp: number;
    payload?: any;
}
