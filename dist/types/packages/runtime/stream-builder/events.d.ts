export declare enum BuilderEventType {
    CHUNK_RECEIVED = "ChunkReceived",
    CHECKPOINT_CREATED = "CheckpointCreated",
    FRAGMENT_READY = "FragmentReady",
    RECOVER_ATTEMPT = "RecoverAttempt",
    RECOVER_SUCCEEDED = "RecoverSucceeded",
    RECOVER_FAILED = "RecoverFailed",
    STREAM_COMPLETED = "StreamCompleted"
}
export interface BuilderEvent {
    type: BuilderEventType;
    timestamp: number;
    payload?: any;
}
