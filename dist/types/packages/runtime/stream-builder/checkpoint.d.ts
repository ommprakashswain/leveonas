import { SyntaxTracker } from './state';
export interface Checkpoint {
    id: string;
    offset: number;
    syntaxState: SyntaxTracker;
}
export declare class CheckpointManager {
    private checkpoints;
    createCheckpoint(id: string, offset: number, tracker: SyntaxTracker): void;
    getLatestCheckpoint(): Checkpoint | null;
    clear(): void;
}
