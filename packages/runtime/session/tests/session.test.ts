import { describe, it, beforeEach, afterEach } from 'node:test';
import * as assert from 'node:assert';
import { StreamingSession } from '../session';
import { StreamController } from '../stream';
import { SessionEventType } from '../events';
import { PatchOperation, PatchOperationType } from '../../incremental/patch-generator/types';

describe('StreamingSession', () => {
  let session: StreamingSession;

  beforeEach(() => {
    session = new StreamingSession({ id: 'test-1', timeoutMs: 5000, heartbeatIntervalMs: 1000 });
  });

  afterEach(() => {
    session.cancel();
  });

  it('handles cancellation properly', () => {
    let errorSent: any = null;
    const controller = {
      sendChunk: () => {},
      sendPatch: () => {},
      sendError: (err: any) => { errorSent = err; },
      sendComplete: () => {},
      sendHeartbeat: () => {},
      onDisconnect: () => {}
    };
    session.attachStream(controller);
    
    session.cancel();
    
    assert.strictEqual(session.getState(), 'CANCELLED');
    assert.deepStrictEqual(errorSent, { code: 'cancelled', message: 'Session cancelled' });
  });

  it('handles reconnect', () => {
    const controller1 = {
      sendChunk: () => {},
      sendPatch: () => {},
      sendError: () => {},
      sendComplete: () => {},
      sendHeartbeat: () => {},
      onDisconnect: () => {}
    };
    session.attachStream(controller1);
    session.pause();
    assert.strictEqual(session.getState(), 'PAUSED');
    
    const controller2 = {
      sendChunk: () => {},
      sendPatch: () => {},
      sendError: () => {},
      sendComplete: () => {},
      sendHeartbeat: () => {},
      onDisconnect: () => {}
    };
    session.attachStream(controller2);
    assert.strictEqual(session.getState(), 'STREAMING');
  });
});
