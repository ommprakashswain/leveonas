import { StreamingSession } from './session';
import { SessionConfig } from './types';
import { SessionEvent } from './events';
export declare class SessionManager {
    private sessions;
    onSessionEvent?: (event: SessionEvent) => void;
    createSession(config: SessionConfig): StreamingSession;
    getSession(id: string): StreamingSession;
    removeSession(id: string): void;
    getActiveSessionCount(): number;
    cancelAll(): void;
}
