import { describe, it, beforeEach } from 'node:test';
import * as assert from 'node:assert';
import { Leveonas } from '../client';
import { AuthenticationError } from '../errors';

describe('Leveonas SDK', () => {
  let client: Leveonas;

  beforeEach(() => {
    client = new Leveonas({ apiKey: 'test-key', baseUrl: 'https://leveonas.ainot.site' });
  });

  it('should initialize with config', () => {
    assert.ok(client);
  });

  it('should be able to render', async () => {
    (global as any).fetch = () =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ html: '<div>Hello</div>', ast: {} }),
      });

    const res = await client.render({ prompt: 'test' });
    assert.strictEqual(res.html, '<div>Hello</div>');
  });
  
  it('should handle authentication errors', async () => {
    (global as any).fetch = () =>
      Promise.resolve({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Unauthorized' }),
      });

    await assert.rejects(
      async () => {
        await client.render({ prompt: 'test' });
      },
      AuthenticationError
    );
  });
  
  it('should compile source', async () => {
    (global as any).fetch = () =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ html: '<div>Compiled</div>', success: true }),
      });

    const res = await client.compile({ source: 'Page {}' });
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.html, '<div>Compiled</div>');
  });
});
