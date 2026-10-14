import { StreamingSession } from './session';
import { SessionConfig } from './types';
import { SessionNotFoundError } from './errors';
import { SessionEvent } from './events';

export class SessionManager {
  private sessions: Map<string, StreamingSession> = new Map();
  public onSessionEvent?: (event: SessionEvent) => void;

  createSession(config: SessionConfig): StreamingSession {
    if (this.sessions.has(config.id)) {
      throw new Error(`Session ${config.id} already exists`);
    }

    const session = new StreamingSession(config);
    
    session.onEvent = (event) => {
      if (this.onSessionEvent) {
        this.onSessionEvent(event);
      }
      if (['COMPLETED', 'FAILED', 'CANCELLED', 'EXPIRED'].includes(event.type.replace('Session', '').toUpperCase())) {
        this.removeSession(config.id);
      }
    };

    this.sessions.set(config.id, session);
    return session;
  }

  getSession(id: string): StreamingSession {
    const session = this.sessions.get(id);
    if (!session) {
      throw new SessionNotFoundError(id);
    }
    return session;
  }

  removeSession(id: string): void {
    this.sessions.delete(id);
  }

  getActiveSessionCount(): number {
    return this.sessions.size;
  }

  cancelAll(): void {
    for (const session of this.sessions.values()) {
      session.cancel();
    }
  }
}
