/**
 * Leveonas Autocompletion Provider
 *
 * Provides context-aware completions for:
 * - LM element abbreviations (di, bo, so, iu, etc.)
 * - Semantic UI component names (Card, Navbar, Stat, etc.)
 * - Attribute abbreviations (cs:, id:, hr:, oc:, etc.)
 * - Standard HTML attributes & event handlers
 * - In-scope state variables & computed values
 * - Declared user components
 */

import { BlockExtractor } from './block-extractor';
import { CompletionItem, CompletionItemKind, Position } from './types';
import {
  KNOWN_ATTRIBUTE_ABBREVIATIONS,
  KNOWN_ELEMENT_ABBREVIATIONS,
  KNOWN_HTML_ATTRIBUTES,
  KNOWN_HTML_TAGS,
} from '../compiler/interpreters/html-lm/vocabulary';
import { LM_COMPONENTS } from '../compiler/lexer/keywords';

export class LeveonasCompletionProvider {
  /**
   * Compute completion items at a specific document position.
   */
  public static getCompletions(documentText: string, position: Position): CompletionItem[] {
    const offset = position.offset ?? BlockExtractor.positionToOffset(documentText, position);
    const textBefore = documentText.slice(0, offset);

    // Determine current line context
    const currentLineStart = textBefore.lastIndexOf('\n') + 1;
    const currentLine = textBefore.slice(currentLineStart);

    const completions: CompletionItem[] = [];

    // Find state and computed declarations in document
    const stateVars = LeveonasCompletionProvider.extractStateVariables(documentText);
    const computedVars = LeveonasCompletionProvider.extractComputedVariables(documentText);
    const declaredComps = LeveonasCompletionProvider.extractDeclaredComponents(documentText);

    // Check if we are right after an opening parenthesis '('
    const isInsideParenOpen = /\(\s*[a-zA-Z0-9_$:-]*$/.test(currentLine);
    // Check if typing an attribute inside an S-expression: e.g. '(di cs:"card" '
    const isInsideElementBody = /\(\s*[a-zA-Z0-9_$:-]+\s+[^)]*$/.test(currentLine);

    if (isInsideParenOpen && !isInsideElementBody) {
      // 1. Element Abbreviations
      for (const [abbr, fullName] of Object.entries(KNOWN_ELEMENT_ABBREVIATIONS)) {
        completions.push({
          label: abbr,
          kind: CompletionItemKind.Struct,
          detail: `<${fullName}> (LM element abbreviation)`,
          documentation: `Generates standard HTML <${fullName}> container/element.`,
          insertText: `${abbr} `,
          sortText: `0_${abbr}`,
        });
      }

      // 2. Semantic Components
      for (const compName of LM_COMPONENTS) {
        completions.push({
          label: compName,
          kind: CompletionItemKind.Class,
          detail: `Component: ${compName}`,
          documentation: `Standard Leveonas semantic component.`,
          insertText: `${compName} `,
          sortText: `1_${compName}`,
        });
      }

      // 3. User-Declared Components
      for (const comp of declaredComps) {
        completions.push({
          label: comp,
          kind: CompletionItemKind.Class,
          detail: `(user component) ${comp}`,
          insertText: `${comp} `,
          sortText: `00_${comp}`,
        });
      }

      // 4. Reactive Keywords
      const keywords = [
        { label: 'state', detail: 'state(name, initialValue)', snippet: 'state(${1:name}, ${2:0})' },
        { label: 'computed', detail: 'computed(name, expr)', snippet: 'computed(${1:name}, ${2:expr})' },
        { label: 'reactive', detail: 'reactive(name, expr)', snippet: 'reactive(${1:name}, ${2:expr})' },
        { label: 'signal', detail: 'signal(name, initialValue)', snippet: 'signal(${1:name}, ${2:0})' },
        { label: 'props', detail: 'props(p1, p2)', snippet: 'props(${1:title})' },
        { label: 'component', detail: 'component(Name)(...)', snippet: 'component(${1:Name})(\n  $0\n)' },
        { label: 'if', detail: 'if(condition, then, else)', snippet: 'if(${1:condition},\n  $2\n)' },
        { label: 'each', detail: 'each(list, item, index, body)', snippet: 'each(${1:items}, ${2:item}, ${3:i},\n  $0\n)' },
      ];

      for (const kw of keywords) {
        completions.push({
          label: kw.label,
          kind: CompletionItemKind.Keyword,
          detail: kw.detail,
          insertText: kw.label,
          sortText: `2_${kw.label}`,
        });
      }
    }

    if (isInsideElementBody || !isInsideParenOpen) {
      // 1. Attribute Abbreviations
      for (const [abbr, fullName] of Object.entries(KNOWN_ATTRIBUTE_ABBREVIATIONS)) {
        completions.push({
          label: `${abbr}:`,
          kind: CompletionItemKind.Property,
          detail: `${fullName} (LM attribute abbreviation)`,
          documentation: `Sets the ${fullName} HTML property.`,
          insertText: `${abbr}:"`,
          sortText: `0_${abbr}`,
        });
      }

      // 2. Standard HTML Attributes
      for (const attr of KNOWN_HTML_ATTRIBUTES) {
        completions.push({
          label: `${attr}:`,
          kind: CompletionItemKind.Property,
          detail: `HTML Attribute: ${attr}`,
          insertText: `${attr}:"`,
          sortText: `1_${attr}`,
        });
      }

      // 3. Event Handlers
      const events = ['click', 'change', 'input', 'submit', 'keydown', 'keyup', 'focus', 'blur'];
      for (const ev of events) {
        completions.push({
          label: `${ev}:`,
          kind: CompletionItemKind.Event,
          detail: `Event handler: ${ev}`,
          insertText: `${ev}:`,
          sortText: `2_${ev}`,
        });
      }

      // 4. In-Scope State Variables
      for (const st of stateVars) {
        completions.push({
          label: st,
          kind: CompletionItemKind.Variable,
          detail: `(state) ${st}`,
          documentation: `Reactive state variable in current scope.`,
          insertText: st,
          sortText: `00_${st}`,
        });
      }

      // 5. In-Scope Computed Variables
      for (const cp of computedVars) {
        completions.push({
          label: cp,
          kind: CompletionItemKind.Property,
          detail: `(computed) ${cp}`,
          documentation: `Derived reactive variable in current scope.`,
          insertText: cp,
          sortText: `01_${cp}`,
        });
      }
    }

    return completions;
  }

  private static extractStateVariables(doc: string): string[] {
    const list: string[] = [];
    const stateRegex = /\b(?:state|ref|signal|useState)\s*\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    let match: RegExpExecArray | null;
    while ((match = stateRegex.exec(doc)) !== null) {
      if (!list.includes(match[1])) list.push(match[1]);
    }
    return list;
  }

  private static extractComputedVariables(doc: string): string[] {
    const list: string[] = [];
    const compRegex = /\b(?:reactive|computed|\$derived)\s*\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    let match: RegExpExecArray | null;
    while ((match = compRegex.exec(doc)) !== null) {
      if (!list.includes(match[1])) list.push(match[1]);
    }
    return list;
  }

  private static extractDeclaredComponents(doc: string): string[] {
    const list: string[] = [];
    const compRegex = /\bcomponent\s*\(\s*([A-Za-z0-9_$]+)/g;
    let match: RegExpExecArray | null;
    while ((match = compRegex.exec(doc)) !== null) {
      if (!list.includes(match[1])) list.push(match[1]);
    }
    return list;
  }
}
