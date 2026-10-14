import { SessionState } from './types';
export declare class StateMachine {
    private state;
    private validTransitions;
    getState(): SessionState;
    transition(newState: SessionState): void;
    isTerminal(): boolean;
}
