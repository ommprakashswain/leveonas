import test from 'node:test';
import assert from 'node:assert/strict';
import {
  classifyLMCompliance,
  classifyLMSyntacticCompliance,
  validateLMWithParser,
  validateLMGeneration,
} from '../compliance';

test('1. Identifies genuine Leveonas Markup with high score', () => {
  const validLM = `<HTML>
di(cs(min-h-screen bg-black text-white)
  he(cs(h-16 flex items-center justify-between px-6)
    sa(cs(text-lg font-bold) NovaFlow)
    na(cs(flex gap-4)
      a(hr(/features) Features)
      a(hr(/pricing) Pricing)
    )
  )
  mi(cs(p-8)
    h1(cs(text-4xl font-extrabold) Next-Gen Streaming)
    p(cs(text-gray-400) Ultra low-latency interfaces.)
    bo(cs(bg-blue-600 px-4 py-2 rounded) Get Started)
  )
)
</HTML>`;

  const report = classifyLMCompliance(validLM);
  assert.equal(report.isLMCompliant, true);
  assert.equal(report.classification, 'VALID_LM');
  assert.ok(report.score >= 70);
  assert.equal(report.details?.hasBlockDelimiters, true);
  assert.equal(report.details?.hasParenthesisStructure, true);
  assert.equal(report.details?.rawHTMLClosingTagCount, 0);
  assert.ok(report.details!.abbreviationCount > 5);
  assert.equal(report.parser.succeeded, true);
  assert.equal(report.parser.astProduced, true);
  assert.ok(report.parser.patchOperationCount > 0);
});

test('2. Rejects ordinary uncompressed HTML with standard tags', () => {
  const rawHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>NovaFlow</title>
</head>
<body class="bg-black text-white">
  <header class="h-16 flex items-center justify-between px-6">
    <span class="text-lg font-bold">NovaFlow</span>
    <nav class="flex gap-4">
      <a href="/features">Features</a>
      <a href="/pricing">Pricing</a>
    </nav>
  </header>
  <main class="p-8">
    <h1 class="text-4xl font-extrabold">Next-Gen Streaming</h1>
    <p class="text-gray-400">Ultra low-latency interfaces.</p>
    <button class="bg-blue-600 px-4 py-2 rounded">Get Started</button>
  </main>
 </body>
</html>`;

  const report = classifyLMCompliance(rawHTML);
  assert.equal(report.isLMCompliant, false);
  assert.equal(report.classification, 'INVALID_LM');
  assert.ok(report.details!.rawHTMLClosingTagCount > 0);
  assert.match(report.reason, /ordinary uncompressed HTML/);
});

test('3. Rejects empty or blank output', () => {
  const report = classifyLMCompliance('');
  assert.equal(report.isLMCompliant, false);
  assert.equal(report.score, 0);
  assert.match(report.reason, /empty/);
});

test('4. Identifies compact element hierarchy LM', () => {
  const compactLM = `<HTML>\nhe(cs(navbar)\n  h1(NovaFlow AI)\n  p(Instant Interfaces)\n)\n</HTML>`;
  const report = classifyLMCompliance(compactLM);
  assert.equal(report.isLMCompliant, true);
  assert.equal(report.classification, 'VALID_LM');
  assert.equal(report.details?.hasParenthesisStructure, true);
  assert.equal(report.parser.succeeded, true);
  assert.equal(report.parser.astProduced, true);
});

test('5. Distinguishes syntactic compliance from parser validation', () => {
  const validLM = `<HTML>\ndi(cs(hero)\n  h1(Leveonas)\n)\n</HTML>`;
  const syntactic = classifyLMSyntacticCompliance(validLM);
  const parser = validateLMWithParser(validLM);

  assert.equal(syntactic.isCompliant, true);
  assert.ok(syntactic.score >= 50);
  assert.equal(parser.succeeded, true);
  assert.equal(parser.astProduced, true);
  assert.ok(parser.patchOperationCount > 0);
});
