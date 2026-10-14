/**
 * Leveonas Phase 5B — Production Runtime Security & Hardening Suite
 *
 * Comprehensive tests for:
 * 1. Iframe isolation & sandbox policy
 * 2. postMessage directional source & envelope validation
 * 3. Patch protocol hardening & prototype pollution prevention
 * 4. Centralized URL validation & obfuscation detection
 * 5. Attribute normalization & inline event handler blocking
 * 6. HTML & CSS injection protection & fallback mode sanitization
 * 7. API input validation & secret leak prevention
 * 8. Error sanitization & path stripping
 * 9. Resource limits & DoS safeguards
 * 10. Session lifecycle & deterministic idempotent cleanup
 * 11. Concurrency isolation across multiple sessions
 * 12. Memory stress testing (100+ cycles)
 * 13. Security CLI auditor engine
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  DEFAULT_SECURITY_LIMITS,
  getSecurityLimits,
} from '../limits';
import {
  isValidUrl,
  sanitizeUrl,
  sanitizeCssText,
  isDangerousProtocol,
  normalizeUrlString,
} from '../urls';
import {
  isAttributeSafe,
  normalizeAttributeName,
  sanitizeAttributes,
} from '../attributes';
import {
  isMessageSourceValid,
  validateIncomingMessage,
} from '../messages';
import {
  censorSecrets,
  censorPaths,
  sanitizeErrorMessage,
} from '../sanitizer';
import {
  validatePatchOperationSecurity,
  validatePatchBatchSecurity,
} from '../patches';
import {
  LeveonasSecurityAuditor,
} from '../audit';
import {
  validatePatches,
  PatchValidationError,
} from '../../runtime/incremental/patch-generator/validator';
import { DOMPatchApplier } from '../../runtime/incremental/patch-executor/dom-applier';
import { Renderer } from '../../sdk/renderer';
import { SessionManager } from '../../runtime/session/manager';
import { StreamingSession } from '../../runtime/session/session';
import { runAuditCommand } from '../../cli/commands/audit';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('Leveonas Phase 5B: Production Security & Hardening Suite', () => {
  // =========================================================================
  // 1. Iframe Isolation & Sandbox Hardening
  // =========================================================================
  describe('1. Iframe Isolation & Sandbox Policy', () => {
    it('verifies safe sandbox policy rejects allow-same-origin and allow-top-navigation', () => {
      const safeReport = LeveonasSecurityAuditor.auditIframeSandbox('allow-scripts');
      assert.strictEqual(safeReport.passed, true);
      assert.strictEqual(safeReport.score, 100);

      const dangerousReport = LeveonasSecurityAuditor.auditIframeSandbox('allow-scripts allow-same-origin allow-top-navigation');
      assert.strictEqual(dangerousReport.passed, false);
      assert.ok(dangerousReport.issueCounts.CRITICAL > 0, 'Must flag allow-same-origin as CRITICAL');
      assert.ok(dangerousReport.issueCounts.HIGH > 0, 'Must flag allow-top-navigation as HIGH');
    });

    it('flags unsandboxed iframes as CRITICAL', () => {
      const report = LeveonasSecurityAuditor.auditIframeSandbox(null);
      assert.strictEqual(report.passed, false);
      assert.strictEqual(report.issueCounts.CRITICAL, 1);
    });
  });

  // =========================================================================
  // 2. PostMessage Directional Source & Envelope Validation
  // =========================================================================
  describe('2. PostMessage Security & Envelope Validation', () => {
    it('validates directional source equality strictly', () => {
      const mockIframeWindow = {} as Window;
      const mockForeignWindow = {} as Window;

      assert.strictEqual(isMessageSourceValid(mockIframeWindow, mockIframeWindow), true);
      assert.strictEqual(isMessageSourceValid(mockForeignWindow, mockIframeWindow), false);
      assert.strictEqual(isMessageSourceValid(null, mockIframeWindow), false);
    });

    it('rejects unknown message types', () => {
      const result = validateIncomingMessage({ type: 'attacker:execute', payload: {} });
      assert.strictEqual(result.isValid, false);
      assert.ok(result.error?.includes('Unrecognized message type'));
    });

    it('rejects prototype pollution in message envelopes', () => {
      const malicious = JSON.parse('{"type":"leveonas:patch","__proto__":{"polluted":true}}');
      const result = validateIncomingMessage(malicious);
      assert.strictEqual(result.isValid, false);
      assert.ok(result.error?.includes('Prototype pollution'));
    });

    it('rejects oversized postMessage payloads', () => {
      const hugePayload = 'X'.repeat(2 * 1024 * 1024); // 2 MB
      const result = validateIncomingMessage(
        { type: 'leveonas:patch', payload: hugePayload },
        { maxBytes: 1024 * 1024 }
      );
      assert.strictEqual(result.isValid, false);
      assert.ok(result.error?.includes('exceeds limit'));
    });

    it('accepts valid, well-formed Leveonas message envelopes', () => {
      const valid = { type: 'leveonas:resize', height: 450, applyDuration: 1.2 };
      const result = validateIncomingMessage(valid);
      assert.strictEqual(result.isValid, true);
      assert.strictEqual(result.message?.type, 'leveonas:resize');
    });
  });

  // =========================================================================
  // 3. Patch Protocol Hardening & Prototype Pollution Prevention
  // =========================================================================
  describe('3. Patch Protocol Hardening', () => {
    it('rejects prototype pollution in patch operations', () => {
      const pollutedOp = JSON.parse('{"operation":"CREATE_NODE","nodeId":"n1","__proto__":{"admin":true}}');
      assert.throws(() => validatePatches([pollutedOp]), PatchValidationError);
    });

    it('rejects patches exceeding maxPatchBatchSize', () => {
      const oversizedBatch = Array.from({ length: 600 }, (_, i) => ({
        operation: 'UPDATE_TEXT',
        nodeId: `node_${i}`,
        payload: { text: 'Hello' },
      }));

      assert.throws(
        () => validatePatches(oversizedBatch, { ...DEFAULT_SECURITY_LIMITS, maxPatchBatchSize: 500 }),
        /exceeds maximum limit/
      );
    });

    it('rejects text content exceeding maxTextLength', () => {
      const longText = 'A'.repeat(70000);
      const op = {
        operation: 'UPDATE_TEXT',
        nodeId: 'n1',
        payload: { text: longText },
      };

      assert.throws(
        () => validatePatches([op], { ...DEFAULT_SECURITY_LIMITS, maxTextLength: 65536 }),
        /text length/
      );
    });

    it('validates node IDs against control character injection', () => {
      const op = {
        operation: 'CREATE_NODE',
        nodeId: 'node\x00malicious',
        payload: { node: { id: 'node\x00malicious', kind: 'div' } },
      };

      assert.throws(() => validatePatches([op]), /invalid nodeId format/);
    });
  });

  // =========================================================================
  // 4. Centralized URL Security & Obfuscation Detection
  // =========================================================================
  describe('4. URL Validation & Sanitization', () => {
    it('detects and rejects plain javascript: and vbscript: URLs', () => {
      assert.strictEqual(isValidUrl('javascript:alert(1)'), false);
      assert.strictEqual(isValidUrl('vbscript:msgbox(1)'), false);
      assert.strictEqual(isValidUrl('file:///etc/passwd'), false);
    });

    it('detects and rejects obfuscated javascript: URLs with tabs, newlines, and control chars', () => {
      assert.strictEqual(isValidUrl('java\tscript:alert(1)'), false);
      assert.strictEqual(isValidUrl('java\n\rscript:alert(1)'), false);
      assert.strictEqual(isValidUrl('java\0script:alert(1)'), false);
      assert.strictEqual(isValidUrl('  javascript  :alert(1)'), false);
    });

    it('permits safe HTTP, HTTPS, mailto, and relative URLs', () => {
      assert.strictEqual(isValidUrl('https://example.com/page'), true);
      assert.strictEqual(isValidUrl('http://localhost:3000'), true);
      assert.strictEqual(isValidUrl('/assets/logo.png'), true);
      assert.strictEqual(isValidUrl('#section-2'), true);
      assert.strictEqual(isValidUrl('mailto:support@leveonas.dev'), true);
    });

    it('sanitizes unsafe URLs to safe fallback', () => {
      assert.strictEqual(sanitizeUrl('javascript:alert(1)', '#'), '#');
      assert.strictEqual(sanitizeUrl('https://safe.com', '#'), 'https://safe.com');
    });

    it('sanitizes CSS text against expressions and dangerous url() schemes', () => {
      const badCss = 'color: red; background: url(javascript:alert(1)); width: expression(document.body.clientWidth);';
      const cleanCss = sanitizeCssText(badCss);
      assert.ok(!cleanCss.includes('javascript:'));
      assert.ok(!cleanCss.includes('expression('));
    });
  });

  // =========================================================================
  // 5. Attribute Normalization & Event Handler Rejection
  // =========================================================================
  describe('5. Attribute Security & Normalization', () => {
    it('rejects inline event handlers in all casings and whitespace variants', () => {
      assert.strictEqual(isAttributeSafe('onclick', 'alert(1)'), false);
      assert.strictEqual(isAttributeSafe('ONCLICK', 'alert(1)'), false);
      assert.strictEqual(isAttributeSafe('OnClick', 'alert(1)'), false);
      assert.strictEqual(isAttributeSafe('on\0error', 'alert(1)'), false);
      assert.strictEqual(isAttributeSafe('onload', 'init()'), false);
      assert.strictEqual(isAttributeSafe('onmouseover', 'steal()'), false);
    });

    it('rejects dangerous navigation and execution attributes', () => {
      assert.strictEqual(isAttributeSafe('srcdoc', '<script>alert(1)</script>'), false);
      assert.strictEqual(isAttributeSafe('href', 'javascript:void(0)'), false);
      assert.strictEqual(isAttributeSafe('formaction', 'javascript:alert(1)'), false);
    });

    it('permits safe standard attributes', () => {
      assert.strictEqual(isAttributeSafe('class', 'btn btn-primary'), true);
      assert.strictEqual(isAttributeSafe('id', 'main-heading'), true);
      assert.strictEqual(isAttributeSafe('href', 'https://leveonas.dev'), true);
      assert.strictEqual(isAttributeSafe('disabled', true), true);
      assert.strictEqual(isAttributeSafe('aria-label', 'Submit form'), true);
    });

    it('sanitizes attribute dictionaries cleanly', () => {
      const input = {
        class: 'active',
        onClick: 'alert(1)',
        href: 'javascript:void(0)',
        'data-safe': 'value',
      };
      const clean = sanitizeAttributes(input);
      assert.strictEqual(clean.class, 'active');
      assert.strictEqual(clean['data-safe'], 'value');
      assert.strictEqual(clean.onClick, undefined);
      assert.strictEqual(clean.href, undefined);
    });
  });

  // =========================================================================
  // 6. HTML & CSS Injection Protection & SDK Fallback Hardening
  // =========================================================================
  describe('6. HTML & CSS Safety & Fallback Mode', () => {
    it('SDK Renderer sanitizeHTML strips <script> tags and inline handlers', () => {
      const renderer = new Renderer();
      const maliciousMarkup = `
        <div class="card">
          <h1>Safe Title</h1>
          <script>window.parent.postMessage('leaked', '*');</script>
          <img src="avatar.jpg" onerror="alert(1)">
          <a href="javascript:alert(2)">Click me</a>
        </div>
      `;

      const sanitized = renderer.sanitizeHTML(maliciousMarkup);
      assert.ok(!sanitized.includes('<script>'), 'Must strip script tags');
      assert.ok(!sanitized.includes('window.parent'), 'Must strip script content');
      assert.ok(!sanitized.includes('onerror'), 'Must strip onerror handler');
      assert.ok(!sanitized.includes('javascript:alert(2)'), 'Must neutralize javascript: URLs');
      assert.ok(sanitized.includes('Safe Title'), 'Must preserve safe text');
    });

    it('DOMPatchApplier rejects applying inline on* attributes or javascript: hrefs to DOM', () => {
      // Mock DOM environment
      const mockRoot = {
        nodeType: 1,
        id: 'leveonas-root',
        childNodes: [] as any[],
        setAttribute: () => {},
        appendChild: () => {},
      };

      const applier = new DOMPatchApplier(mockRoot as any);
      applier.registerNode('n1', mockRoot as any);

      // Attempting to set an unsafe attribute must throw PatchExecutorError during validation
      assert.throws(
        () => {
          applier.applyPatches([
            {
              operation: 'SET_ATTRIBUTE' as any,
              nodeId: 'n1',
              payload: { name: 'onclick', value: 'alert(1)' },
            },
          ]);
        },
        /Patch validation failed|unsafe attribute/
      );
    });
  });

  // =========================================================================
  // 7. API Secret Scrubbing & Error Sanitization
  // =========================================================================
  describe('7. Secret Scrubbing & Error Sanitization', () => {
    it('censorSecrets redacts Google API keys and general bearer tokens', () => {
      const rawText = 'Error connecting with AIzaSyD3x9L7m4Q2k8P1n0B6v5C4w3E2r1T0y9 and sk-1234567890abcdef12345678';
      const cleanText = censorSecrets(rawText);
      assert.ok(!cleanText.includes('AIzaSyD3x9L7m4Q2k8P1n0B6v5C4w3E2r1T0y9'));
      assert.ok(!cleanText.includes('sk-1234567890abcdef12345678'));
      assert.ok(cleanText.includes('[REDACTED_SECRET]'));
    });

    it('censorPaths strips internal server directory paths', () => {
      const rawError = 'Failed to load file /app/applet/packages/compiler/ast.ts at line 42';
      const cleanError = censorPaths(rawError);
      assert.ok(!cleanError.includes('/app/applet/packages/compiler/ast.ts'));
      assert.ok(cleanError.includes('[INTERNAL_PATH]'));
    });

    it('sanitizeErrorMessage redacts internal stacks in production mode', () => {
      const internalErr = new Error('Database ENOENT at /app/applet/server.ts:12:4\n  at run (/app/applet/node_modules/...)');
      const sanitized = sanitizeErrorMessage(internalErr, true);
      assert.strictEqual(sanitized.message, 'An unexpected processing error occurred');
      assert.ok(!sanitized.message.includes('/app/applet'));
    });
  });

  // =========================================================================
  // 8. Session Lifecycle & Idempotent Cleanup
  // =========================================================================
  describe('8. Session Lifecycle & Cleanup', () => {
    it('creates, streams, and performs deterministic idempotent cleanup', () => {
      const manager = new SessionManager();
      const session = manager.createSession({
        id: 'sec-session-1',
        timeoutMs: 5000,
        batchIntervalMs: 10,
      });

      assert.strictEqual(manager.getActiveSessionCount(), 1);

      // Multiple cancel calls must be completely safe and idempotent
      session.cancel();
      session.cancel();
      session.destroy();
      session.destroy();

      manager.removeSession('sec-session-1');
      assert.strictEqual(manager.getActiveSessionCount(), 0);
    });

    it('cleans up resources automatically when session completes or fails', () => {
      const manager = new SessionManager();
      const session = manager.createSession({ id: 'sec-session-2' });

      session.complete();
      assert.strictEqual(manager.getActiveSessionCount(), 0, 'Completed session should be removed');
    });
  });

  // =========================================================================
  // 9. Concurrency & Multi-Session Isolation
  // =========================================================================
  describe('9. Concurrency Isolation', () => {
    it('isolates state and event streams between concurrent sessions', () => {
      const manager = new SessionManager();
      const eventsA: string[] = [];
      const eventsB: string[] = [];

      manager.onSessionEvent = (e) => {
        if (e.sessionId === 'session-A') eventsA.push(e.type);
        if (e.sessionId === 'session-B') eventsB.push(e.type);
      };

      const sessionA = manager.createSession({ id: 'session-A' });
      const sessionB = manager.createSession({ id: 'session-B' });

      sessionA.cancel();

      assert.ok(eventsA.includes('SessionCancelled'), 'Session A must receive cancel event');
      assert.ok(!eventsB.includes('SessionCancelled'), 'Session B must remain unaffected');

      sessionB.complete();
      assert.ok(eventsB.includes('SessionCompleted'), 'Session B completes independently');

      assert.strictEqual(manager.getActiveSessionCount(), 0);
    });
  });

  // =========================================================================
  // 10. Memory Stress Test (100+ Cycles)
  // =========================================================================
  describe('10. Memory & Resource Stress Testing', () => {
    it('runs 100 consecutive session create-stream-destroy cycles without leaks', () => {
      const manager = new SessionManager();
      const initialMemory = process.memoryUsage().heapUsed;

      for (let i = 0; i < 100; i++) {
        const sid = `stress-session-${i}`;
        const session = manager.createSession({
          id: sid,
          batchIntervalMs: 5,
        });

        session.schedulePatch({
          operation: 'CREATE_NODE' as any,
          nodeId: `node_${i}`,
          payload: { node: { id: `node_${i}`, kind: 'div' } },
        });

        session.complete();
      }

      assert.strictEqual(manager.getActiveSessionCount(), 0, 'All 100 sessions must be cleaned up');
      const finalMemory = process.memoryUsage().heapUsed;
      const growthMB = (finalMemory - initialMemory) / (1024 * 1024);

      // Heap growth across 100 cycles should be bounded (< 30 MB)
      assert.ok(growthMB < 30, `Memory growth after 100 cycles (${growthMB.toFixed(2)} MB) exceeds threshold`);
    });
  });

  // =========================================================================
  // 11. Security Audit CLI Engine
  // =========================================================================
  describe('11. Security Audit Tooling', () => {
    it('audits source code and detects vulnerabilities with accurate scores', () => {
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'leveonas-audit-test-'));
      const testFile = path.join(tempDir, 'vuln.lm');

      const vulnerableContent = `
<HTML>
  (di cs:"hero"
    (a hr:"javascript:alert(document.cookie)" "Click me")
    (bo oc:"eval('code')" "Execute")
  )
</HTML>
`;
      fs.writeFileSync(testFile, vulnerableContent, 'utf-8');

      try {
        const { success, reports } = runAuditCommand({ files: [testFile], json: true });
        assert.strictEqual(success, false, 'Audit must fail on dangerous protocols and handlers');
        const report = reports[testFile];
        assert.strictEqual(report.passed, false);
        assert.ok(report.score < 80, 'Score must reflect security penalties');
        assert.ok(report.issues.some((i) => i.code === 'SEC_DANGEROUS_URL_PROTOCOL'));
        assert.ok(report.issues.some((i) => i.code === 'SEC_INLINE_EVENT_HANDLER'));
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });

    it('passes cleanly for valid, secure LM files', () => {
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'leveonas-audit-clean-'));
      const testFile = path.join(tempDir, 'clean.lm');

      const cleanContent = `
<HTML>
  (di cs:"container"
    (h1 "Clean App")
    (a hr:"https://leveonas.dev" "Documentation")
    (bo "Click Me")
  )
</HTML>
`;
      fs.writeFileSync(testFile, cleanContent, 'utf-8');

      try {
        const { success, reports } = runAuditCommand({ files: [testFile], json: true });
        assert.strictEqual(success, true);
        const report = reports[testFile];
        assert.strictEqual(report.passed, true);
        assert.strictEqual(report.score, 100);
        assert.strictEqual(report.issues.length, 0);
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });
  });
});
