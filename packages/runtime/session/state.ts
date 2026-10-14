import { SessionState } from './types';
import { SessionStateError } from './errors';

export class StateMachine {
  private state: SessionState = 'CREATED';

  private validTransitions: Record<SessionState, SessionState[]> = {
    CREATED: ['INITIALIZING', 'CANCELLED', 'COMPLETED', 'FAILED'],
    INITIALIZING: ['STREAMING', 'FAILED', 'CANCELLED'],
    STREAMING: ['PAUSED', 'COMPLETED', 'FAILED', 'CANCELLED'],
    PAUSED: ['STREAMING', 'COMPLETED', 'FAILED', 'CANCELLED'],
    COMPLETED: [],
    FAILED: [],
    CANCELLED: []
  };

  getState(): SessionState {
    return this.state;
  }

  transition(newState: SessionState): void {
    if (!this.validTransitions[this.state].includes(newState)) {
      throw new SessionStateError(`Cannot transition from ${this.state} to ${newState}`);
    }
    this.state = newState;
  }

  isTerminal(): boolean {
    return ['COMPLETED', 'FAILED', 'CANCELLED'].includes(this.state);
  }
}
