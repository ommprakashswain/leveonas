export class SessionError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'SessionError';
  }
}

export class SessionNotFoundError extends SessionError {
  constructor(sessionId: string) {
    super('session_not_found', `Session ${sessionId} not found`);
  }
}

export class SessionStateError extends SessionError {
  constructor(message: string) {
    super('invalid_state', message);
  }
}

export class SessionTimeoutError extends SessionError {
  constructor(sessionId: string) {
    super('session_timeout', `Session ${sessionId} timed out`);
  }
}
