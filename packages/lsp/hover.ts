/**
 * Leveonas Hover Information Provider
 *
 * Provides rich markdown documentation on hover for:
 * - LM element abbreviations (di -> div, bo -> button, etc.)
 * - Attribute abbreviations (cs -> class, hr -> href, oc -> onClick, etc.)
 * - Framework reactivity primitives (state, computed, reactive, signal, props)
 * - Declared component signatures and parameters
 */

import { BlockExtractor } from './block-extractor';
import { Hover, Position, Range } from './types';
import {
  KNOWN_ATTRIBUTE_ABBREVIATIONS,
  KNOWN_ELEMENT_ABBREVIATIONS,
  KNOWN_HTML_ATTRIBUTES,
  KNOWN_HTML_TAGS,
} from '../compiler/interpreters/html-lm/vocabulary';
import { LM_COMPONENTS } from '../compiler/lexer/keywords';

const ELEMENT_DOCS: Record<string, { tag: string; desc: string }> = {
  di: { tag: 'div', desc: 'Generic flow container element' },
  bo: { tag: 'button', desc: 'Interactive clickable button element' },
  so: { tag: 'section', desc: 'Thematic grouping of content with heading' },
  al: { tag: 'article', desc: 'Self-contained composition (card, post, article)' },
  ad: { tag: 'aside', desc: 'Sidebar or tangentially related content' },
  he: { tag: 'header', desc: 'Introductory content or navigational aids' },
  fe: { tag: 'footer', desc: 'Footer section for nearest sectioning content' },
  na: { tag: 'nav', desc: 'Section of navigation links' },
  mi: { tag: 'main', desc: 'Dominant content of the document body' },
  sa: { tag: 'span', desc: 'Generic inline container for phrasing content' },
  iu: { tag: 'input', desc: 'Interactive form input control' },
  le: { tag: 'label', desc: 'Caption for a user interface item' },
  tl: { tag: 'table', desc: 'Tabular data representation container' },
  cu: { tag: 'canvas', desc: 'Bitmap canvas for scriptable 2D/3D graphics' },
  fr: { tag: 'form', desc: 'Interactive form section with submit controls' },
};

const ATTR_DOCS: Record<string, { attr: string; desc: string }> = {
  cs: { attr: 'class', desc: 'CSS class names for styling' },
  cm: { attr: 'className', desc: 'JSX/React CSS class names' },
  hr: { attr: 'href', desc: 'Hyperlink target URL' },
  hf: { attr: 'href', desc: 'Hyperlink target URL' },
  id: { attr: 'id', desc: 'Unique element identifier within DOM' },
  sr: { attr: 'src', desc: 'Source URL for media or embeddable content' },
  tp: { attr: 'type', desc: 'Type of input or button behavior' },
  pe: { attr: 'placeholder', desc: 'Hint text shown in empty input controls' },
  nm: { attr: 'name', desc: 'Name of form control sent on submission' },
  vu: { attr: 'value', desc: 'Current value of form control or input' },
  oc: { attr: 'onClick', desc: 'Click event handler callback' },
  og: { attr: 'onChange', desc: 'Change event handler callback' },
};

const PRIMITIVE_DOCS: Record<string, string> = {
  state: '**state(name, initialValue)**\n\nDeclares a local reactive state variable with initial value.',
  useState: '**useState(name, initialValue)**\n\nDeclares a React-LM local state variable.',
  signal: '**signal(name, initialValue)**\n\nDeclares an Angular-LM signal reactive primitive.',
  ref: '**ref(name, initialValue)**\n\nDeclares a Vue-LM reactive ref primitive.',
  computed: '**computed(name, expression)**\n\nDeclares a derived reactive value recalculated when dependencies change.',
  reactive: '**reactive(name, expression)**\n\nDeclares a Svelte-LM reactive declaration ($derived expression).',
  component: '**component(Name, ...)**\n\nDeclares a reusable UI component with isolated scope and props.',
  props: '**props(name1, name2, ...)**\n\nDeclares incoming input properties for the enclosing component.',
  bind: '**bind(prop, stateVar)**\n\nTwo-way binding between an element property and a reactive state variable.',
  if: '**if(condition, thenNode, elseNode)**\n\nConditional UI branch rendered dynamically based on condition.',
  each: '**each(list, item, index, body)**\n\nKeyed iterative list renderer with automatic reconciliation.',
  slot: '**slot(name)**\n\nContent projection outlet for child elements.',
};

export class LeveonasHoverProvider {
  /**
   * Get hover documentation for the token under cursor.
   */
  public static getHover(documentText: string, position: Position): Hover | null {
    const offset = position.offset ?? BlockExtractor.positionToOffset(documentText, position);
    const tokenInfo = LeveonasHoverProvider.extractTokenAtOffset(documentText, offset);
    if (!tokenInfo) return null;

    const { token, range } = tokenInfo;

    // 1. Check element abbreviations
    if (token in KNOWN_ELEMENT_ABBREVIATIONS || token in ELEMENT_DOCS) {
      const canonical = KNOWN_ELEMENT_ABBREVIATIONS[token] ?? ELEMENT_DOCS[token]?.tag ?? token;
      const desc = ELEMENT_DOCS[token]?.desc ?? `HTML <${canonical}> element`;
      return {
        contents: {
          kind: 'markdown',
          value: `### \`${token}\` → \`<${canonical}>\`\n\n**LM Element Abbreviation**  \n${desc}\n\n*Lowered to ASTNodeKind.${canonical[0].toUpperCase() + canonical.slice(1)}*`,
        },
        range,
      };
    }

    // 2. Check attribute abbreviations
    if (token in KNOWN_ATTRIBUTE_ABBREVIATIONS || token in ATTR_DOCS) {
      const canonical = KNOWN_ATTRIBUTE_ABBREVIATIONS[token] ?? ATTR_DOCS[token]?.attr ?? token;
      const desc = ATTR_DOCS[token]?.desc ?? `HTML ${canonical} attribute`;
      return {
        contents: {
          kind: 'markdown',
          value: `### \`${token}:\` → \`${canonical}\`\n\n**LM Attribute Abbreviation**  \n${desc}`,
        },
        range,
      };
    }

    // 3. Check primitive keywords
    if (token in PRIMITIVE_DOCS) {
      return {
        contents: {
          kind: 'markdown',
          value: PRIMITIVE_DOCS[token],
        },
        range,
      };
    }

    // 4. Check standard HTML tags
    if (KNOWN_HTML_TAGS.has(token.toLowerCase())) {
      return {
        contents: {
          kind: 'markdown',
          value: `### \`<${token.toLowerCase()}>\`\n\nStandard HTML5 element representation in Leveonas Common UI IR.`,
        },
        range,
      };
    }

    // 5. Check standard component library
    if (LM_COMPONENTS.has(token)) {
      return {
        contents: {
          kind: 'markdown',
          value: `### Component: \`${token}\`\n\nStandard Leveonas semantic component.`,
        },
        range,
      };
    }

    // 6. Check user-declared state / reactive / component in the document
    const customHover = LeveonasHoverProvider.findCustomSymbolHover(documentText, token, range);
    if (customHover) return customHover;

    return null;
  }

  private static extractTokenAtOffset(
    text: string,
    offset: number
  ): { token: string; range: Range } | null {
    if (offset < 0 || offset > text.length) return null;

    // Find word boundary around offset
    let start = offset;
    while (start > 0 && /[a-zA-Z0-9_$:-]/.test(text[start - 1])) {
      start--;
    }

    let end = offset;
    while (end < text.length && /[a-zA-Z0-9_$:-]/.test(text[end])) {
      end++;
    }

    if (start === end) return null;

    let rawToken = text.slice(start, end);
    // Strip trailing colon for attribute names
    if (rawToken.endsWith(':')) {
      rawToken = rawToken.slice(0, -1);
    }
    // Strip leading directive prefix if present
    if (rawToken.includes(':')) {
      const parts = rawToken.split(':');
      rawToken = parts[parts.length - 1];
    }

    const startPos = BlockExtractor.offsetToPosition(text, start);
    const endPos = BlockExtractor.offsetToPosition(text, end);

    return {
      token: rawToken,
      range: { start: startPos, end: endPos },
    };
  }

  private static findCustomSymbolHover(
    documentText: string,
    symbolName: string,
    range: Range
  ): Hover | null {
    // Check if it is a declared state variable
    const stateRegex = new RegExp(
      `\\b(?:state|ref|signal|useState)\\s*\\(\\s*${symbolName}\\s*,\\s*([^)]+)\\)|\\((?:state|ref|signal):${symbolName}\\s+([^)]+)`,
      'g'
    );
    const stateMatch = stateRegex.exec(documentText);
    if (stateMatch) {
      const initVal = (stateMatch[1] || stateMatch[2] || '').trim();
      return {
        contents: {
          kind: 'markdown',
          value: `### (state) \`${symbolName}\`\n\n**Reactive State Variable**  \nInitial value: \`${initVal}\`\n\nTracked in Common UI IR reactivity dependency graph.`,
        },
        range,
      };
    }

    // Check if it is a computed / reactive variable
    const compRegex = new RegExp(
      `\\b(?:reactive|computed|\\$derived)\\s*\\(\\s*${symbolName}\\s*,\\s*([^)]+)\\)|\\((?:reactive|computed|derived):${symbolName}\\s+([^)]+)`,
      'g'
    );
    const compMatch = compRegex.exec(documentText);
    if (compMatch) {
      const expr = (compMatch[1] || compMatch[2] || '').trim();
      return {
        contents: {
          kind: 'markdown',
          value: `### (computed) \`${symbolName}\`\n\n**Derived Value**  \nExpression: \`${expr}\`\n\nAutomatically recalculated when referenced state dependencies change.`,
        },
        range,
      };
    }

    // Check if it is a declared component
    const componentRegex = new RegExp(
      `\\bcomponent\\s*\\(\\s*${symbolName}\\s*\\)(?:\\s*\\(\\s*props\\s*\\(([^)]*)\\)\\))?|\\(component:${symbolName}(?:\\s+\\(props:\\s*([^)]*)\\))?`,
      'g'
    );
    const compDeclMatch = componentRegex.exec(documentText);
    if (compDeclMatch) {
      const props = compDeclMatch[1]?.trim() ?? compDeclMatch[2]?.trim() ?? 'none';
      return {
        contents: {
          kind: 'markdown',
          value: `### (component) \`${symbolName}\`\n\n**User Declared Component**  \nProps: \`${props}\``,
        },
        range,
      };
    }

    return null;
  }
}
