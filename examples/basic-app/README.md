# Basic Leveonas App

A minimal HTML-LM application showcasing the S-expression syntax and Common UI IR reconciliation.

## Quickstart

```bash
# Check syntax & diagnostics
leveonas check app.lm

# Format deterministically
leveonas format app.lm --write

# Compile to Common UI IR
leveonas compile app.lm --target=ui-ir

# Deep inspect AST & DOM nodes
leveonas inspect app.lm
```
