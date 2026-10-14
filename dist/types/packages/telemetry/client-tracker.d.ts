import { PatchOperation } from '../runtime/incremental/patch-generator/types';
import { ClientTelemetry } from './types';
/**
 * Calculates UTF-8 byte length across browser and Node.js environments.
 */
export declare function getUtf8ByteLength(str: string): number;
/**
 * ClientTelemetryTracker
 * Tracks client-side performance and metrics in the browser SDK without exposing raw code.
 */
export declare class ClientTelemetryTracker {
    private runId;
    private fetchStartTimestamp;
    private firstPatchReceivedTimestamp;
    private firstPatchAppliedTimestamp;
    private finalPatchReceivedTimestamp;
    private patchBatchCount;
    private patchOperationCount;
    private receivedPatchPayloadBytes;
    private domApplyDurationMs;
    private serverRequestStartTimestamp;
    private serverTimeToFirstPatchMs;
    constructor(initialRunId?: string);
    setRunId(runId: string): void;
    getRunId(): string | null;
    /**
     * Record the client-side fetch start time.
     */
    recordFetchStart(timestamp?: number): void;
    /**
     * Record server timing received over the telemetry stream.
     */
    setServerTiming(serverRequestStartTimestamp: number, serverTimeToFirstPatchMs: number | null): void;
    /**
     * Record arrival of a patch batch in the browser SDK.
     * Uses actual UTF-8 encoded received patch payload byte length where available.
     */
    recordPatchBatch(patches: PatchOperation[], payloadByteLength?: number): void;
    /**
     * Record that a patch batch has been applied to the iframe DOM.
     */
    recordPatchApplied(durationMs: number): void;
    /**
     * Build the client telemetry snapshot.
     */
    getTelemetry(): ClientTelemetry;
}
