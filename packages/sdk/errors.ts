export class LeveonasError extends Error {
  constructor(message: string, public statusCode?: number, public code?: string) {
    super(message);
    this.name = 'LeveonasError';
  }
}

export class AuthenticationError extends LeveonasError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, 'unauthorized');
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends LeveonasError {
  constructor(message: string) {
    super(message, 400, 'validation_failed');
    this.name = 'ValidationError';
  }
}

export class TimeoutError extends LeveonasError {
  constructor(message: string = 'Request timed out') {
    super(message, 408, 'timeout');
    this.name = 'TimeoutError';
  }
}
