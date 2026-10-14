import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { Scanner } from '../scanner';

describe('Scanner', () => {
  test('should read characters and track position', () => {
    const scanner = new Scanner('a\nbc');
    
    assert.strictEqual(scanner.current(), 'a');
    assert.strictEqual(scanner.peek(), 'a');
    assert.strictEqual(scanner.peekNext(), '\n');
    assert.strictEqual(scanner.line, 1);
    assert.strictEqual(scanner.column, 1);
    assert.strictEqual(scanner.offset, 0);
    assert.strictEqual(scanner.eof(), false);

    assert.strictEqual(scanner.advance(), 'a');
    assert.strictEqual(scanner.current(), '\n');
    assert.strictEqual(scanner.line, 1);
    assert.strictEqual(scanner.column, 2);
    assert.strictEqual(scanner.offset, 1);

    assert.strictEqual(scanner.advance(), '\n');
    assert.strictEqual(scanner.current(), 'b');
    assert.strictEqual(scanner.line, 2);
    assert.strictEqual(scanner.column, 1);
    assert.strictEqual(scanner.offset, 2);

    assert.strictEqual(scanner.advance(), 'b');
    assert.strictEqual(scanner.advance(), 'c');
    
    assert.strictEqual(scanner.eof(), true);
    assert.strictEqual(scanner.current(), '\0');
    assert.strictEqual(scanner.peek(), '\0');
    assert.strictEqual(scanner.peekNext(), '\0');
    assert.strictEqual(scanner.advance(), '\0');
  });

  test('should clone and reset properly', () => {
    const scanner = new Scanner('abc');
    scanner.advance();
    
    const clone = scanner.clone();
    assert.strictEqual(clone.current(), 'b');
    
    clone.advance();
    assert.strictEqual(clone.current(), 'c');
    assert.strictEqual(scanner.current(), 'b');

    scanner.reset();
    assert.strictEqual(scanner.current(), 'a');
    assert.strictEqual(scanner.offset, 0);
  });

  test('should handle snapshots', () => {
    const scanner = new Scanner('abcdef');
    scanner.advance(); // consume a
    scanner.advance(); // consume b
    
    const snapshot = scanner.createSnapshot();
    assert.strictEqual(scanner.current(), 'c');
    
    scanner.advance(); // consume c
    scanner.advance(); // consume d
    assert.strictEqual(scanner.current(), 'e');
    
    scanner.restoreSnapshot(snapshot);
    assert.strictEqual(scanner.current(), 'c');
    assert.strictEqual(scanner.offset, 2);
  });
});
