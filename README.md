# Leveonas

[![npm version](https://img.shields.io/npm/v/leveonas.svg)](https://www.npmjs.com/package/leveonas)
[![License: MIT](https://img.shields.io/badge/License-MIT-2DD4A7.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/ommprakashswain/leveonas/actions/workflows/ci.yml/badge.svg)](https://github.com/ommprakashswain/leveonas/actions)
[![GitHub Repository](https://img.shields.io/badge/GitHub-ommprakashswain%2Fleveonas-black?logo=github)](https://github.com/ommprakashswain/leveonas)

> **Token-Optimized, Streaming-Native Intermediate Representation & Cross-Framework Compiler Runtime for Generative AI User Interfaces.**

Leveonas provides an S-expression compact language representation (LM) paired with a framework-neutral **Common UI IR**, streaming incremental patch pipeline, and a sandboxed framework-free browser runtime.

---

## Key Features

- **Cross-Framework Lowering**: Lowers HTML-LM, React-LM, Vue-LM, Svelte-LM, and Angular-LM into an identical framework-neutral Common UI IR.
- **Token & Byte Compression**: Eliminates closing tags, aligns syntax, and reduces token overhead by up to 50–70% compared to raw framework JSX/HTML.
- **Streaming Incremental Patches**: Streams granular DOM operations (`CREATE_NODE`, `INSERT_CHILD`, `UPDATE_TEXT`, `SET_ATTRIBUTE`, `UPDATE_STYLE`) over SSE before generation completes.
- **Unified Developer Tooling**: CLI binary (`leveonas`), Language Server Protocol (LSP), diagnostics, deterministic formatter, and playground AST/reactivity visualizers.
- **Sandboxed Framework-Free Browser Runtime**: Fast direct DOM patch application within an isolated sandbox environment with sub-millisecond execution and zero framework bundling overhead.

---

## Architecture & Security Model

```
┌───────────────────────────────────────────────────────────────┐
│                     LLM Output Stream                         │
│   (HTML-LM / React-LM / Vue-LM / Svelte-LM / Angular-LM)      │
└───────────────────────────────┬───────────────────────────────┘
                                │ Incremental Stream
                                ▼
┌───────────────────────────────────────────────────────────────┐
│                    Leveonas LM Parser                         │
│   • Streaming-Aware Lexer & JIT S-Expression Parser           │
│   • Multi-Stage Error Recovery & Incomplete Toleration        │
└───────────────────────────────┬───────────────────────────────┘
                                │ Framework AST
                                ▼
┌───────────────────────────────────────────────────────────────┐
│                   Common UI IR Lowering                       │
│   • Canonical UI IR (Components, State, Derived, UI Nodes)    │
│   • Explicit Fine-Grained Reactivity Dependency Graph         │
└───────────────────────────────┬───────────────────────────────┘
                                │ Common UI IR
                                ▼
┌───────────────────────────────────────────────────────────────┐
│                    Common UI Reconciler                       │
│   • DOM AST Generation & Reconciled Runtime IR                │
│   • Incremental Patch Engine (CREATE, SET_ATTR, TEXT, EVENT)  │
└───────────────────────────────┬───────────────────────────────┘
                                │ Structured postMessage
                                ▼
┌───────────────────────────────────────────────────────────────┐
│            Sandboxed Browser Runtime (DOMPatchApplier)        │
│   • Isolated Execution: sandbox="allow-scripts" (no same-origin) │
│   • Origin Verification: event.source === window.parent       │
│   • Direct DOM Mutations & Fine-Grained Reactive Execution    │
└───────────────────────────────────────────────────────────────┘
```

### Security Guarantees
1. **Isolated Execution Context**: The browser runtime executes within an `<iframe>` configured with `sandbox="allow-scripts"` (strictly omitting `allow-same-origin` to prevent cookie and localStorage access from untrusted user content).
2. **Message Authentication**: The sandbox message dispatcher enforces `event.source === window.parent` to reject cross-frame spoofing attacks.
3. **Safe Dynamic Evaluator**: Event handlers and dynamic expressions execute in a sandboxed scope without direct access to the parent document context.

---

## Installation

### CLI

```bash
npm install -g leveonas
```

### In Your Project

```bash
npm install leveonas
```

---

## Quickstart

### 1. Create an LM File (`app.lm`)

```html
<REACT>
(component:Counter
  (state:count 0)
  (di cs:"p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4 max-w-sm"
    (h2 cs:"text-xl font-bold text-cyan-400" "Counter")
    (pa cs:"text-slate-300 text-sm" "Current count: {count}")
    (di cs:"flex gap-2"
      (bo cs:"px-3 py-1.5 bg-cyan-500 text-black font-semibold rounded-lg text-xs" oc:"count++" "+1")
      (bo cs:"px-3 py-1.5 bg-slate-700 text-white rounded-lg text-xs" oc:"count = 0" "Reset")
    )
  )
)
</REACT>
```

### 2. Check, Format & Compile

```bash
# Check syntax & reactive dependencies
leveonas check app.lm

# Format canonical style
leveonas format app.lm --write

# Compile to Common UI IR
leveonas compile app.lm --target=ui-ir

# Deep inspect Reactivity Graph & DOM tree
leveonas inspect app.lm
```

---

## Programmatic API

```typescript
import { compile, inspect, format, diagnose } from 'leveonas';

// Compile LM code to Common UI IR and Patches
const result = compile(sourceCode);
console.log(result.detectedFramework); // "react"
console.log(result.uiIR);              // UIIRProgramNode
console.log(result.patchOperations);   // [{ op: "CREATE_ROOT", ... }]

// Format S-expressions deterministically
const formatted = format(sourceCode, { tabSize: 2 });

// Run diagnostics
const diagnostics = diagnose(sourceCode, { streaming: true });
```

---

## Framework Support Matrix

| Framework | LM Syntax Block | Lowering Target | Reactivity Model | Status |
| :--- | :--- | :--- | :--- | :--- |
| **HTML** | `<HTML>` | Common UI IR | Static DOM | Stable |
| **CSS** | `<CSS>` | CSS Object Model | Dynamic Styles | Stable |
| **JS / TS** | `<JS>`, `<TS>` | JS Runtime Units | Scoped Handlers | Stable |
| **React** | `<REACT>` | Common UI IR | `useState` / props | Stable |
| **Vue** | `<VUE>` | Common UI IR | `ref` / `computed` | Stable |
| **Svelte** | `<SVELTE>` | Common UI IR | `state` / `reactive` | Stable |
| **Angular** | `<ANGULAR>` | Common UI IR | `signal` / `computed` | Stable |

---

## Benchmark Methodology & Factual Metrics

Leveonas includes a standardized benchmark harness (`leveonas benchmark` / `packages/telemetry`) measuring:
- **Output Token Reduction**: Measured against raw component representations (JSX, SFC) across synthetic and real-world scenarios.
- **Byte Minimality**: Exact payload size comparisons for wire transfer.
- **Time-to-First-Patch (TTFP)**: Streaming latency from the first received chunk to initial DOM patch application.
- **Reconciliation Overhead**: CPU time to parse, lower, and generate patch operations.

All performance claims in Leveonas are validated via reproducible benchmark suites. Run `leveonas benchmark` to measure real numbers on your local machine.

---

## Current Limitations

- **Complex Third-Party Component Ecosystems**: Custom React/Vue component libraries requiring proprietary runtime contexts (e.g. Radix primitives with React Context providers) must be lowered through adapter definitions.
- **Asynchronous Data Loaders**: Server components (`async/await` Suspense boundaries) require explicit data slot contracts in Common UI IR.
- **Web Workers & Multi-threading**: The patch applier operates in the main thread of the isolated iframe; worker-based offscreen canvas rendering is planned for future iterations.

---

## Documentation

- [Installation Guide](docs/INSTALLATION.md)
- [Public API Reference](docs/API.md)
- [CLI Reference](docs/CLI.md)
- [Packaging Architecture](docs/PACKAGING.md)

---

## License

MIT

