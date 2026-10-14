/**
 * Leveonas Streaming-Aware Diagnostic Engine
 *
 * Exposes comprehensive compiler diagnostics for LM documents:
 * - Differentiates INCOMPLETE (streaming / typing in progress) from INVALID (fatal syntax error)
 * - Validates element abbreviations and canonical HTML tags
 * - Validates attribute abbreviations and canonical properties
 * - Validates state declarations, reactivity graphs, and computed dependencies
 * - Validates event bindings, list keys, and duplicate IDs
 * - Validates cross-framework feature compliance
 */

import { BlockExtractor } from './block-extractor';
import { DiagnosticSeverity, EmbeddedBlock, LSPDiagnostic, Range } from './types';
import {
  KNOWN_ATTRIBUTE_ABBREVIATIONS,
  KNOWN_ELEMENT_ABBREVIATIONS,
  KNOWN_HTML_ATTRIBUTES,
  KNOWN_HTML_TAGS,
} from '../compiler/interpreters/html-lm/vocabulary';
import { LM_COMPONENTS } from '../compiler/lexer/keywords';

export interface DiagnosticOptions {
  streaming?: boolean;
  validateReactivity?: boolean;
  validateProperties?: boolean;
}

export class LeveonasDiagnosticEngine {
  /**
   * Run full diagnostics on an LM document or embedded framework blocks.
   */
  public static diagnose(documentText: string, options: DiagnosticOptions = {}): LSPDiagnostic[] {
    const diagnostics: LSPDiagnostic[] = [];
    const blocks = BlockExtractor.extractBlocks(documentText);

    for (const block of blocks) {
      const blockDiags = LeveonasDiagnosticEngine.diagnoseBlock(block, documentText, options);
      diagnostics.push(...blockDiags);
    }

    return diagnostics;
  }

  /**
   * Diagnose a single embedded or top-level block.
   */
  public static diagnoseBlock(
    block: EmbeddedBlock,
    fullDoc: string,
    options: DiagnosticOptions = {}
  ): LSPDiagnostic[] {
    const diagnostics: LSPDiagnostic[] = [];
    const content = block.content;
    const baseOffset = block.contentRange.start.offset ?? BlockExtractor.positionToOffset(fullDoc, block.contentRange.start);

    // 1. Parentheses and Bracket Balance Analysis (Streaming-Aware)
    const parenStack: { char: string; index: number }[] = [];
    const stringRanges: Array<[number, number]> = [];
    let inString = false;
    let stringQuote = '';
    let stringStartIndex = -1;

    for (let i = 0; i < content.length; i++) {
      const ch = content[i];

      // String literal boundary check
      if (ch === '"' || ch === "'") {
        if (!inString) {
          inString = true;
          stringQuote = ch;
          stringStartIndex = i;
        } else if (stringQuote === ch && content[i - 1] !== '\\') {
          inString = false;
          stringRanges.push([stringStartIndex, i]);
          stringQuote = '';
          stringStartIndex = -1;
        }
        continue;
      }

      if (inString) continue;

      if (ch === '(' || ch === '[' || ch === '{') {
        parenStack.push({ char: ch, index: i });
      } else if (ch === ')' || ch === ']' || ch === '}') {
        if (parenStack.length === 0) {
          // Unexpected closing delimiter -> INVALID
          const pos = BlockExtractor.offsetToPosition(fullDoc, baseOffset + i);
          diagnostics.push({
            range: { start: pos, end: { ...pos, character: pos.character + 1 } },
            severity: DiagnosticSeverity.Error,
            code: 'UnexpectedClosingDelimiter',
            source: 'leveonas-parser',
            message: `Unexpected closing delimiter '${ch}' without matching opening delimiter.`,
            isIncomplete: false,
          });
        } else {
          const top = parenStack.pop()!;
          const matchMap: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
          if (top.char !== matchMap[ch]) {
            // Mismatched closing delimiter -> INVALID
            const pos = BlockExtractor.offsetToPosition(fullDoc, baseOffset + i);
            diagnostics.push({
              range: { start: pos, end: { ...pos, character: pos.character + 1 } },
              severity: DiagnosticSeverity.Error,
              code: 'MismatchedDelimiter',
              source: 'leveonas-parser',
              message: `Mismatched delimiter: expected '${matchMap[ch]}' to match '${top.char}', found '${ch}'.`,
              isIncomplete: false,
            });
          }
        }
      }
    }

    // Check for unclosed string at EOF
    if (inString && stringStartIndex >= 0) {
      const pos = BlockExtractor.offsetToPosition(fullDoc, baseOffset + stringStartIndex);
      const isAtEOF = stringStartIndex >= content.length - 2 || options.streaming;

      diagnostics.push({
        range: {
          start: pos,
          end: BlockExtractor.offsetToPosition(fullDoc, baseOffset + content.length),
        },
        severity: isAtEOF ? DiagnosticSeverity.Information : DiagnosticSeverity.Error,
        code: isAtEOF ? 'IncompleteString' : 'UnterminatedString',
        source: 'leveonas-lexer',
        message: isAtEOF
          ? 'Incomplete string literal during streaming/editing.'
          : 'Unterminated string literal.',
        isIncomplete: isAtEOF,
      });
    }

    // Check for unclosed parentheses/brackets at EOF
    if (parenStack.length > 0) {
      for (const unclosed of parenStack) {
        const pos = BlockExtractor.offsetToPosition(fullDoc, baseOffset + unclosed.index);
        const isStreaming = !!options.streaming;
        diagnostics.push({
          range: { start: pos, end: { ...pos, character: pos.character + 1 } },
          severity: isStreaming ? DiagnosticSeverity.Information : DiagnosticSeverity.Error,
          code: isStreaming ? 'IncompleteExpression' : 'UnclosedDelimiter',
          source: 'leveonas-parser',
          message: isStreaming
            ? `Incomplete expression: unclosed '${unclosed.char}' (in-progress stream or edit).`
            : `Syntax error: unclosed '${unclosed.char}'.`,
          isIncomplete: isStreaming,
        });
      }
    }

    if (inString && stringStartIndex >= 0) {
      stringRanges.push([stringStartIndex, content.length]);
    }

    const isInsideString = (idx: number) => stringRanges.some(([s, e]) => idx >= s && idx <= e);

    // 2. Structural & Semantic Token Validation
    const declaredState = new Set<string>();
    const declaredDerived = new Set<string>();
    const declaredProps = new Set<string>();
    const declaredComponents = new Set<string>();
    const declaredIds = new Map<string, Range>();

    // Scan for state, derived, computed, signal, and component declarations
    const stateRegex = /\b(?:state|ref|signal|useState)\s*\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    let stateMatch: RegExpExecArray | null;
    while ((stateMatch = stateRegex.exec(content)) !== null) {
      declaredState.add(stateMatch[1]);
    }

    const stateBlockRegex = /\((?:state|ref|signal):([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    while ((stateMatch = stateBlockRegex.exec(content)) !== null) {
      declaredState.add(stateMatch[1]);
    }

    const derivedRegex = /\b(?:reactive|computed|\$derived)\s*\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    let derivedMatch: RegExpExecArray | null;
    while ((derivedMatch = derivedRegex.exec(content)) !== null) {
      declaredDerived.add(derivedMatch[1]);
    }

    const derivedBlockRegex = /\((?:reactive|computed|derived):([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    while ((derivedMatch = derivedBlockRegex.exec(content)) !== null) {
      declaredDerived.add(derivedMatch[1]);
    }

    const compRegex = /\bcomponent\s*\(\s*([A-Za-z0-9_$]+)/g;
    let compMatch: RegExpExecArray | null;
    while ((compMatch = compRegex.exec(content)) !== null) {
      declaredComponents.add(compMatch[1]);
    }

    const compBlockRegex = /\(component:([A-Za-z0-9_$]+)/g;
    while ((compMatch = compBlockRegex.exec(content)) !== null) {
      declaredComponents.add(compMatch[1]);
    }

    const propsRegex = /\bprops\s*\(([^)]*)\)/g;
    let propsMatch: RegExpExecArray | null;
    while ((propsMatch = propsRegex.exec(content)) !== null) {
      const pList = propsMatch[1].split(',').map((s) => s.trim().split(':')[0].trim());
      for (const p of pList) {
        if (p) declaredProps.add(p);
      }
    }

    // 3. S-expression Head & Attribute Validation
    // Match forms like (di cs:"card" id:"main" ... ) or (h1 "Title")
    const headRegex = /\(\s*([a-zA-Z0-9_$:-]+)/g;
    let headMatch: RegExpExecArray | null;

    while ((headMatch = headRegex.exec(content)) !== null) {
      if (isInsideString(headMatch.index)) continue;
      const rawHead = headMatch[1];
      const matchIndex = headMatch.index + 1; // start of identifier inside '('
      const pos = BlockExtractor.offsetToPosition(fullDoc, baseOffset + matchIndex);
      const headRange: Range = {
        start: pos,
        end: { ...pos, character: pos.character + rawHead.length },
      };

      // Check for component/directive/event prefix
      if (rawHead.includes(':')) {
        const [prefix] = rawHead.split(':');
        const validDirectives = [
          'component', 'comp', 'state', 'computed', 'reactive', 'derived', 'signal',
          'props', 'prop', 'slot', 'if', 'else', 'when', 'each', 'for', 'bind', 'style', 'class', 'let',
          'click', 'change', 'input', 'submit', 'keydown', 'keyup', 'blur', 'focus', 'hover', 'load', 'error'
        ];
        if (
          !validDirectives.includes(prefix.toLowerCase()) &&
          !KNOWN_ATTRIBUTE_ABBREVIATIONS[prefix] &&
          !KNOWN_HTML_ATTRIBUTES.has(prefix) &&
          !prefix.startsWith('on')
        ) {
          diagnostics.push({
            range: headRange,
            severity: DiagnosticSeverity.Warning,
            code: 'UnknownDirective',
            source: 'leveonas-validator',
            message: `Unknown directive or modifier prefix '${prefix}:'.`,
          });
        }
        continue;
      }

      // Check if this paren is an argument list following a keyword like state(...), reactive(...), component(...)
      const textBefore = content.slice(0, headMatch.index).trimEnd();
      const isCallArgList = /\b(?:state|reactive|computed|derived|signal|component|comp|props|prop|let|exportLet|if|when|each|for|switch|case|default|function|fn)\s*$/i.test(textBefore);
      if (isCallArgList) {
        continue;
      }

      // Check element or component name
      const isAbbr = rawHead in KNOWN_ELEMENT_ABBREVIATIONS;
      const isKnownHtml = KNOWN_HTML_TAGS.has(rawHead.toLowerCase());
      const isStdComponent = LM_COMPONENTS.has(rawHead);
      const isCustomComp = declaredComponents.has(rawHead);
      const isDeclaredVar = declaredState.has(rawHead) || declaredDerived.has(rawHead) || declaredProps.has(rawHead);
      const isKeyword = [
        'state', 'computed', 'reactive', 'props', 'prop', 'component', 'comp', 'if', 'when', 'each', 'for',
        'slot', 'bind', 'signal', 'derived', 'effect', 'Root', 'App', 'let', 'exportLet'
      ].includes(rawHead);

      if (!isAbbr && !isKnownHtml && !isStdComponent && !isCustomComp && !isKeyword && !isDeclaredVar) {
        // If it starts with uppercase, it might be a component instance
        if (rawHead[0] >= 'A' && rawHead[0] <= 'Z') {
          // Allowed as custom component, but give hint if not declared
          // Non-fatal
        } else {
          diagnostics.push({
            range: headRange,
            severity: DiagnosticSeverity.Warning,
            code: 'UnknownElement',
            source: 'leveonas-validator',
            message: `Unknown LM element or tag '${rawHead}'. Did you mean '${KNOWN_ELEMENT_ABBREVIATIONS[rawHead] ?? 'div'}'?`,
          });
        }
      }
    }

    // 4. Attribute and ID Validation
    const attrRegex = /\b([a-zA-Z0-9_$:-]+):/g;
    let attrMatch: RegExpExecArray | null;

    while ((attrMatch = attrRegex.exec(content)) !== null) {
      if (isInsideString(attrMatch.index)) continue;
      const rawAttr = attrMatch[1];
      const matchIndex = attrMatch.index;
      const pos = BlockExtractor.offsetToPosition(fullDoc, baseOffset + matchIndex);
      const attrRange: Range = {
        start: pos,
        end: { ...pos, character: pos.character + rawAttr.length },
      };

      const isAbbr = rawAttr in KNOWN_ATTRIBUTE_ABBREVIATIONS;
      const isHtmlAttr = KNOWN_HTML_ATTRIBUTES.has(rawAttr);
      const isEvent = rawAttr.startsWith('on') || ['click', 'change', 'input', 'submit', 'keydown', 'keyup'].includes(rawAttr);
      const isSpecial = ['bind', 'style', 'class', 'key', 'ref', 'as', 'slot', 'target', 'if', 'each', 'let'].includes(rawAttr);

      if (!isAbbr && !isHtmlAttr && !isEvent && !isSpecial && !rawAttr.startsWith('data-') && !rawAttr.startsWith('aria-')) {
        diagnostics.push({
          range: attrRange,
          severity: DiagnosticSeverity.Hint,
          code: 'UnknownProperty',
          source: 'leveonas-validator',
          message: `Unrecognized property or attribute '${rawAttr}'.`,
        });
      }

      // Check ID duplicate values
      if (rawAttr === 'id' || rawAttr === 'id:') {
        const idValRegex = /^(?:id:\s*["']([^"']+)["'])/;
        const subContent = content.slice(matchIndex);
        const idValMatch = idValRegex.exec(subContent);
        if (idValMatch) {
          const idValue = idValMatch[1];
          if (declaredIds.has(idValue)) {
            diagnostics.push({
              range: attrRange,
              severity: DiagnosticSeverity.Warning,
              code: 'DuplicateId',
              source: 'leveonas-validator',
              message: `Duplicate DOM ID '${idValue}' in document. DOM IDs must be unique.`,
            });
          } else {
            declaredIds.set(idValue, attrRange);
          }
        }
      }
    }

    // 5. Reactive Dependency Checks
    if (options.validateReactivity !== false) {
      // Check for derived values using undeclared identifiers
      const derivedExprRegex = /\b(?:reactive|computed)\s*\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*,\s*([^)]+)\)|\((?:reactive|computed|derived):([a-zA-Z_$][a-zA-Z0-9_$]*)\s+([^)]+)\)/g;
      let exprMatch: RegExpExecArray | null;

      while ((exprMatch = derivedExprRegex.exec(content)) !== null) {
        const expr = exprMatch[2] || exprMatch[4];
        if (!expr) continue;
        const matchIndex = exprMatch.index;

        // Find referenced variables in expression
        const varRegex = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g;
        let vMatch: RegExpExecArray | null;
        while ((vMatch = varRegex.exec(expr)) !== null) {
          const vName = vMatch[1];
          const isJsGlobal = ['Math', 'String', 'Number', 'Boolean', 'Array', 'Object', 'JSON', 'Date', 'true', 'false', 'null', 'undefined'].includes(vName);
          if (!isJsGlobal && !declaredState.has(vName) && !declaredDerived.has(vName) && !declaredProps.has(vName)) {
            const pos = BlockExtractor.offsetToPosition(fullDoc, baseOffset + matchIndex);
            diagnostics.push({
              range: { start: pos, end: { ...pos, character: pos.character + exprMatch[0].length } },
              severity: DiagnosticSeverity.Warning,
              code: 'UnresolvedReactiveDependency',
              source: 'leveonas-reactivity',
              message: `Derived computation references '${vName}' which is not a declared state variable or prop.`,
            });
          }
        }
      }
    }

    // 6. Cross-Framework Compliance Check
    if (block.type === 'svelte') {
      if (content.includes('useState(') || content.includes('useEffect(')) {
        diagnostics.push({
          range: block.range,
          severity: DiagnosticSeverity.Warning,
          code: 'UnsupportedFrameworkFeature',
          source: 'leveonas-svelte',
          message: 'React hooks (useState/useEffect) found inside Svelte block. Use Svelte state()/reactive() instead.',
        });
      }
    } else if (block.type === 'vue') {
      if (content.includes('*ngIf') || content.includes('*ngFor')) {
        diagnostics.push({
          range: block.range,
          severity: DiagnosticSeverity.Warning,
          code: 'UnsupportedFrameworkFeature',
          source: 'leveonas-vue',
          message: 'Angular directives found inside Vue block. Use Vue conditionals and lists.',
        });
      }
    } else if (block.type === 'react') {
      if (content.includes('$derived(') || content.includes('$effect(')) {
        diagnostics.push({
          range: block.range,
          severity: DiagnosticSeverity.Warning,
          code: 'UnsupportedFrameworkFeature',
          source: 'leveonas-react',
          message: 'Svelte runes found inside React block. Use React state/memo instead.',
        });
      }
    }

    return diagnostics;
  }
}
