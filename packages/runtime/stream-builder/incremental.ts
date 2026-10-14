import { CheckpointManager } from './checkpoint';
import { SyntaxTracker } from './state';
import { SyntaxRecoverer } from './recover';

export class IncrementalManager {
  constructor(
    private checkpoints: CheckpointManager
  ) {}
  
  createFragment(rawContent: string, tracker: SyntaxTracker): string {
    return SyntaxRecoverer.recover(rawContent, tracker);
  }
}
