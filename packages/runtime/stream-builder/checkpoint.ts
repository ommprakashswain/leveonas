import { SyntaxTracker } from './state';

export interface Checkpoint {
  id: string;
  offset: number;
  syntaxState: SyntaxTracker;
}

export class CheckpointManager {
  private checkpoints: Checkpoint[] = [];

  createCheckpoint(id: string, offset: number, tracker: SyntaxTracker) {
    this.checkpoints.push({
      id,
      offset,
      syntaxState: tracker.clone()
    });
  }

  getLatestCheckpoint(): Checkpoint | null {
    if (this.checkpoints.length === 0) return null;
    return this.checkpoints[this.checkpoints.length - 1];
  }

  clear() {
    this.checkpoints = [];
  }
}
