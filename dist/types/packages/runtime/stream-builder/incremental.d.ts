import { CheckpointManager } from './checkpoint';
import { SyntaxTracker } from './state';
export declare class IncrementalManager {
    private checkpoints;
    constructor(checkpoints: CheckpointManager);
    createFragment(rawContent: string, tracker: SyntaxTracker): string;
}
