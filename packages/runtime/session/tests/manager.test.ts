import { describe, it, beforeEach, afterEach } from 'node:test';
import * as assert from 'node:assert';
import { SessionManager } from '../manager';
import { StreamController } from '../stream';
import { SessionEventType } from '../events';
import { PatchOperation, PatchOperationType } from '../../incremental/patch-generator/types';
import { SessionNotFoundError } from '../errors';

describe('SessionManager', () => {
  let manager: SessionManager;

  beforeEach(() => {
    manager = new SessionManager();
  });

  afterEach(() => {
    manager.cancelAll();
  });

  it('creates and tracks a session', () => {
    const session = manager.createSession({ id: 'test-1' });
    assert.strictEqual(manager.getActiveSessionCount(), 1);
    assert.strictEqual(manager.getSession('test-1'), session);
    assert.strictEqual(session.getState(), 'CREATED');
  });

  it('throws on duplicate session', () => {
    manager.createSession({ id: 'test-1' });
    assert.throws(() => {
      manager.createSession({ id: 'test-1' });
    });
  });

  it('throws on not found session', () => {
    assert.throws(() => manager.getSession('missing'), SessionNotFoundError);
  });

  it('attaches stream and goes to streaming state', () => {
    const session = manager.createSession({ id: 'test-1' });
    
    let disconnectCb: any;
    const controller: StreamController = {
      sendChunk: () => {},
      sendPatch: () => {},
      sendError: () => {},
      sendComplete: () => {},
      sendHeartbeat: () => {},
      onDisconnect: (cb) => { disconnectCb = cb; }
    };

    session.attachStream(controller);
    assert.strictEqual(session.getState(), 'STREAMING');
  });

  it('cleans up terminal sessions', () => {
    const session = manager.createSession({ id: 'test-1' });
    const controller: StreamController = {
      sendChunk: () => {},
      sendPatch: () => {},
      sendError: () => {},
      sendComplete: () => {},
      sendHeartbeat: () => {},
      onDisconnect: () => {}
    };
    session.attachStream(controller);
    
    session.complete();
    assert.strictEqual(manager.getActiveSessionCount(), 0);
  });
});
