import { SourceLocation } from '../../ast/types';
import {
  CSSDeclarationNode,
  CSSKeyframeBlockNode,
  CSSKeyframesRuleNode,
  CSSMediaRuleNode,
  CSSNodeKind,
  CSSRuleItem,
  CSSRuleNode,
  CSSStyleSheetNode,
  getCSSDeclarationId,
  getCSSKeyframeBlockId,
  getCSSKeyframesId,
  getCSSMediaRuleId,
  getCSSRuleId,
} from './ast';
import { CSSLMDiagnostic, CSSLMInterpreterOptions } from './types';
import { decodeCSSProperty } from './vocabulary';

interface RuleContext {
  id: string;
  selector: string;
  declarations: CSSDeclarationNode[];
  startLoc: SourceLocation;
  parentMedia?: MediaContext;
}

interface MediaContext {
  id: string;
  query: string;
  rules: CSSRuleNode[];
  startLoc: SourceLocation;
}

interface KeyframesContext {
  id: string;
  name: string;
  keyframes: CSSKeyframeBlockNode[];
  startLoc: SourceLocation;
}

interface KeyframeBlockContext {
  id: string;
  keyframeSelector: string;
  declarations: CSSDeclarationNode[];
  startLoc: SourceLocation;
  parentKeyframes: KeyframesContext;
}

type ParserMode =
  | 'SEEKING_HEAD'
  | 'IN_HEAD'
  | 'IN_HEAD_ARG'
  | 'AFTER_HEAD_ARG'
  | 'IN_RULE_BODY'
  | 'IN_PROP_NAME'
  | 'IN_PROP_VALUE_COLON'
  | 'IN_PROP_VALUE_PAREN'
  | 'IN_MEDIA_BODY'
  | 'IN_KEYFRAMES_BODY'
  | 'IN_KEYFRAME_STEP_BODY';

export class CSSLMInterpreter {
  private stylesheet: CSSStyleSheetNode;
  private currentLoc: SourceLocation;
  private diagnostics: CSSLMDiagnostic[] = [];
  private options: CSSLMInterpreterOptions;

  // State machine
  private mode: ParserMode = 'SEEKING_HEAD';
  private buffer: string = '';
  private headKind: 'RULE' | 'MEDIA' | 'KEYFRAMES' | 'DIRECT' | 'KEYFRAME_STEP' = 'DIRECT';
  private headArgument: string = '';
  private currentProperty: string = '';

  // Stacks / Contexts
  private currentRule: RuleContext | null = null;
  private currentMedia: MediaContext | null = null;
  private currentKeyframes: KeyframesContext | null = null;
  private currentKeyframeStep: KeyframeBlockContext | null = null;

  // Sub-states
  private inComment: boolean = false;
  private inString: boolean = false;
  private stringQuote: string = '';
  private escapeNext: boolean = false;
  private valueParenDepth: number = 0;

  constructor(options: CSSLMInterpreterOptions = {}) {
    this.options = options;
    this.currentLoc = {
      startLine: 1,
      startColumn: 1,
      startOffset: 0,
      endLine: 1,
      endColumn: 1,
      endOffset: 0,
    };
    this.stylesheet = {
      id: 'css-stylesheet',
      kind: CSSNodeKind.StyleSheet,
      rules: [],
      sourceLocation: { ...this.currentLoc },
    };
  }

  public static parse(source: string, options: CSSLMInterpreterOptions = {}): CSSStyleSheetNode {
    const interpreter = new CSSLMInterpreter(options);
    interpreter.write(source);
    return interpreter.end();
  }

  public reset(): void {
    this.currentLoc = {
      startLine: 1,
      startColumn: 1,
      startOffset: 0,
      endLine: 1,
      endColumn: 1,
      endOffset: 0,
    };
    this.stylesheet = {
      id: 'css-stylesheet',
      kind: CSSNodeKind.StyleSheet,
      rules: [],
      sourceLocation: { ...this.currentLoc },
    };
    this.diagnostics = [];
    this.mode = 'SEEKING_HEAD';
    this.buffer = '';
    this.headKind = 'DIRECT';
    this.headArgument = '';
    this.currentProperty = '';
    this.currentRule = null;
    this.currentMedia = null;
    this.currentKeyframes = null;
    this.currentKeyframeStep = null;
    this.inComment = false;
    this.inString = false;
    this.stringQuote = '';
    this.escapeNext = false;
    this.valueParenDepth = 0;
  }

  public getAST(): CSSStyleSheetNode {
    return this.stylesheet;
  }

  public getDiagnostics(): CSSLMDiagnostic[] {
    return [...this.diagnostics];
  }

  public hasErrors(): boolean {
    return this.diagnostics.some((d) => d.severity === 'error');
  }

  public isSafeToExpose(): boolean {
    if (this.inComment || this.inString) return false;
    if (this.mode === 'IN_PROP_NAME' && this.buffer.trim().length > 0) return false;
    if (this.valueParenDepth > 0) return false;
    if (this.hasErrors()) return false;
    return this.stylesheet.rules.length > 0;
  }

  public write(chunk: string): this {
    for (let i = 0; i < chunk.length; i++) {
      this.consumeChar(chunk[i]);
    }
    return this;
  }

  public end(): CSSStyleSheetNode {
    this.flushPending();
    return this.stylesheet;
  }

  private advanceLocation(char: string): void {
    this.currentLoc.endOffset++;
    if (char === '\n') {
      this.currentLoc.endLine++;
      this.currentLoc.endColumn = 1;
    } else {
      this.currentLoc.endColumn++;
    }
  }

  private consumeChar(char: string): void {
    this.advanceLocation(char);

    // 1. Comments /* ... */
    if (this.inComment) {
      this.buffer += char;
      if (this.buffer.endsWith('*/')) {
        this.inComment = false;
        this.buffer = '';
      }
      return;
    }

    if (!this.inString && char === '*' && this.buffer.endsWith('/')) {
      this.inComment = true;
      this.buffer = '';
      return;
    }

    // 2. Strings "..." or '...'
    if (this.inString) {
      this.buffer += char;
      if (this.escapeNext) {
        this.escapeNext = false;
        return;
      }
      if (char === '\\') {
        this.escapeNext = true;
        return;
      }
      if (char === this.stringQuote) {
        this.inString = false;
        this.stringQuote = '';
      }
      return;
    }

    if (char === '"' || char === "'") {
      this.inString = true;
      this.stringQuote = char;
      this.buffer += char;
      return;
    }

    // 3. State Dispatch
    switch (this.mode) {
      case 'SEEKING_HEAD':
      case 'IN_MEDIA_BODY':
      case 'IN_KEYFRAMES_BODY':
        this.handleSeekingHead(char);
        break;

      case 'IN_HEAD':
        this.handleInHead(char);
        break;

      case 'IN_HEAD_ARG':
        this.handleInHeadArg(char);
        break;

      case 'AFTER_HEAD_ARG':
        this.handleAfterHeadArg(char);
        break;

      case 'IN_RULE_BODY':
      case 'IN_KEYFRAME_STEP_BODY':
        this.handleInRuleBody(char);
        break;

      case 'IN_PROP_NAME':
        this.handleInPropName(char);
        break;

      case 'IN_PROP_VALUE_COLON':
        this.handleInPropValueColon(char);
        break;

      case 'IN_PROP_VALUE_PAREN':
        this.handleInPropValueParen(char);
        break;
    }
  }

  private handleSeekingHead(char: string): void {
    if (/\s/.test(char) || char === ';') return;

    if (char === ')' || char === '}') {
      // Closing media query or keyframes
      if (this.currentKeyframes) {
        this.closeKeyframes();
        return;
      }
      if (this.currentMedia) {
        this.closeMedia();
        return;
      }
    }

    this.buffer = char;
    this.mode = 'IN_HEAD';
  }

  private handleInHead(char: string): void {
    if (char === '(' || char === '{') {
      const raw = this.buffer.trim();
      this.buffer = '';

      // Check if it is a wrapper function: rule("..."), media("..."), keyframes("...")
      const isRuleFunc = /^rule\s*$/i.test(raw);
      const isMediaFunc = /^(?:media|@media)\s*$/i.test(raw);
      const isKfFunc = /^(?:keyframes|kf|@keyframes)\s*$/i.test(raw);

      if (isRuleFunc) {
        this.headKind = 'RULE';
        this.mode = 'IN_HEAD_ARG';
        return;
      }

      if (isMediaFunc) {
        this.headKind = 'MEDIA';
        this.mode = 'IN_HEAD_ARG';
        return;
      }

      if (isKfFunc) {
        this.headKind = 'KEYFRAMES';
        this.mode = 'IN_HEAD_ARG';
        return;
      }

      // Check @media (query) or @keyframes name
      if (raw.startsWith('@media')) {
        const query = raw.replace(/^@media\s*/i, '').trim();
        this.startMedia(query || 'all');
        return;
      }

      if (raw.startsWith('@keyframes')) {
        const name = raw.replace(/^@keyframes\s*/i, '').trim();
        this.startKeyframes(name);
        return;
      }

      // Direct selector like .card(...) or body(...) or keyframe step from(...), 0%(...)
      if (this.currentKeyframes) {
        this.startKeyframeStep(raw);
      } else {
        this.startRule(raw);
      }
      return;
    }

    this.buffer += char;
  }

  private handleInHeadArg(char: string): void {
    if (char === ')') {
      let arg = this.buffer.trim();
      this.buffer = '';
      // Strip outer quotes if any
      if ((arg.startsWith('"') && arg.endsWith('"')) || (arg.startsWith("'") && arg.endsWith("'"))) {
        arg = arg.substring(1, arg.length - 1).trim();
      }
      this.headArgument = arg;
      this.mode = 'AFTER_HEAD_ARG';
      return;
    }

    this.buffer += char;
  }

  private handleAfterHeadArg(char: string): void {
    if (/\s/.test(char)) return;

    if (char === '(' || char === '{') {
      const arg = this.headArgument;
      const kind = this.headKind;
      this.headArgument = '';
      this.buffer = '';

      if (kind === 'RULE') {
        this.startRule(arg);
      } else if (kind === 'MEDIA') {
        this.startMedia(arg);
      } else if (kind === 'KEYFRAMES') {
        this.startKeyframes(arg);
      }
    }
  }

  private handleInRuleBody(char: string): void {
    if (/\s/.test(char) || char === ';') return;

    if (char === ')' || char === '}') {
      this.closeCurrentRuleOrStep();
      return;
    }

    // Start property name
    this.buffer = char;
    this.mode = 'IN_PROP_NAME';
  }

  private handleInPropName(char: string): void {
    if (char === ':') {
      this.currentProperty = this.buffer.trim();
      this.buffer = '';
      this.mode = 'IN_PROP_VALUE_COLON';
      return;
    }

    if (char === '(') {
      this.currentProperty = this.buffer.trim();
      this.buffer = '';
      this.valueParenDepth = 0;
      this.mode = 'IN_PROP_VALUE_PAREN';
      return;
    }

    if (char === ')' || char === '}') {
      this.closeCurrentRuleOrStep();
      return;
    }

    this.buffer += char;
  }

  private handleInPropValueColon(char: string): void {
    if (char === '(') {
      this.valueParenDepth++;
      this.buffer += char;
      return;
    }

    if (char === ')' && this.valueParenDepth > 0) {
      this.valueParenDepth--;
      this.buffer += char;
      return;
    }

    if (char === ';' || char === '\n' || (char === ')' && this.valueParenDepth === 0) || char === '}') {
      const val = this.buffer.trim();
      this.buffer = '';
      this.commitDeclaration(this.currentProperty, val);
      this.currentProperty = '';

      if (char === ')' || char === '}') {
        this.closeCurrentRuleOrStep();
      } else {
        this.mode = this.currentKeyframeStep ? 'IN_KEYFRAME_STEP_BODY' : 'IN_RULE_BODY';
      }
      return;
    }

    this.buffer += char;
  }

  private handleInPropValueParen(char: string): void {
    if (char === '(') {
      this.valueParenDepth++;
      this.buffer += char;
      return;
    }

    if (char === ')') {
      if (this.valueParenDepth > 0) {
        this.valueParenDepth--;
        this.buffer += char;
        return;
      }

      // Closing the property paren `p(20px)`
      const val = this.buffer.trim();
      this.buffer = '';
      this.commitDeclaration(this.currentProperty, val);
      this.currentProperty = '';
      this.mode = this.currentKeyframeStep ? 'IN_KEYFRAME_STEP_BODY' : 'IN_RULE_BODY';
      return;
    }

    this.buffer += char;
  }

  private startRule(selector: string): void {
    const cleanSel = selector.trim();
    const id = getCSSRuleId(cleanSel, this.currentMedia?.id);
    this.currentRule = {
      id,
      selector: cleanSel,
      declarations: [],
      startLoc: { ...this.currentLoc },
      parentMedia: this.currentMedia || undefined,
    };
    this.mode = 'IN_RULE_BODY';
  }

  private startMedia(query: string): void {
    let cleanQuery = query.trim();
    if (cleanQuery.startsWith('(') && cleanQuery.endsWith(')')) {
      cleanQuery = cleanQuery.substring(1, cleanQuery.length - 1).trim();
    }
    const id = getCSSMediaRuleId(cleanQuery);
    this.currentMedia = {
      id,
      query: cleanQuery,
      rules: [],
      startLoc: { ...this.currentLoc },
    };
    this.mode = 'IN_MEDIA_BODY';
  }

  private startKeyframes(name: string): void {
    const cleanName = name.trim();
    const id = getCSSKeyframesId(cleanName);
    this.currentKeyframes = {
      id,
      name: cleanName,
      keyframes: [],
      startLoc: { ...this.currentLoc },
    };
    this.mode = 'IN_KEYFRAMES_BODY';
  }

  private startKeyframeStep(stepSelector: string): void {
    if (!this.currentKeyframes) return;
    const cleanStep = stepSelector.trim();
    const id = getCSSKeyframeBlockId(this.currentKeyframes.id, cleanStep);
    this.currentKeyframeStep = {
      id,
      keyframeSelector: cleanStep,
      declarations: [],
      startLoc: { ...this.currentLoc },
      parentKeyframes: this.currentKeyframes,
    };
    this.mode = 'IN_KEYFRAME_STEP_BODY';
  }

  private commitDeclaration(rawProp: string, rawVal: string): void {
    const propName = decodeCSSProperty(rawProp.trim());
    let val = rawVal.trim();
    let important = false;

    if (/!\s*important\s*$/i.test(val)) {
      important = true;
      val = val.replace(/!\s*important\s*$/i, '').trim();
    }

    if (!propName || val.length === 0) return;

    if (this.currentKeyframeStep) {
      const declId = getCSSDeclarationId(this.currentKeyframeStep.id, propName);
      const declNode: CSSDeclarationNode = {
        id: declId,
        kind: CSSNodeKind.Declaration,
        property: propName,
        value: val,
        important,
        sourceLocation: { ...this.currentLoc },
      };
      this.currentKeyframeStep.declarations.push(declNode);
      return;
    }

    if (this.currentRule) {
      const declId = getCSSDeclarationId(this.currentRule.id, propName);
      const declNode: CSSDeclarationNode = {
        id: declId,
        kind: CSSNodeKind.Declaration,
        property: propName,
        value: val,
        important,
        sourceLocation: { ...this.currentLoc },
      };

      const existingIdx = this.currentRule.declarations.findIndex(
        (d) => d.property.toLowerCase() === propName.toLowerCase()
      );
      if (existingIdx >= 0) {
        this.currentRule.declarations[existingIdx] = declNode;
      } else {
        this.currentRule.declarations.push(declNode);
      }
    }
  }

  private closeCurrentRuleOrStep(): void {
    if (this.currentKeyframeStep) {
      const stepNode: CSSKeyframeBlockNode = {
        id: this.currentKeyframeStep.id,
        kind: CSSNodeKind.KeyframeBlock,
        keyframeSelector: this.currentKeyframeStep.keyframeSelector,
        declarations: this.currentKeyframeStep.declarations,
        sourceLocation: this.currentKeyframeStep.startLoc,
      };
      this.currentKeyframes?.keyframes.push(stepNode);
      this.currentKeyframeStep = null;
      this.mode = 'IN_KEYFRAMES_BODY';
      return;
    }

    if (this.currentRule) {
      const ruleNode: CSSRuleNode = {
        id: this.currentRule.id,
        kind: CSSNodeKind.Rule,
        selector: this.currentRule.selector,
        declarations: this.currentRule.declarations,
        sourceLocation: this.currentRule.startLoc,
      };

      if (this.currentMedia) {
        this.currentMedia.rules.push(ruleNode);
        this.mode = 'IN_MEDIA_BODY';
      } else {
        this.stylesheet.rules.push(ruleNode);
        this.mode = 'SEEKING_HEAD';
      }

      this.currentRule = null;
      return;
    }

    this.mode = 'SEEKING_HEAD';
  }

  private closeMedia(): void {
    if (this.currentMedia) {
      const mediaNode: CSSMediaRuleNode = {
        id: this.currentMedia.id,
        kind: CSSNodeKind.MediaRule,
        query: this.currentMedia.query,
        rules: this.currentMedia.rules,
        sourceLocation: this.currentMedia.startLoc,
      };
      this.stylesheet.rules.push(mediaNode);
      this.currentMedia = null;
      this.mode = 'SEEKING_HEAD';
    }
  }

  private closeKeyframes(): void {
    if (this.currentKeyframes) {
      const kfNode: CSSKeyframesRuleNode = {
        id: this.currentKeyframes.id,
        kind: CSSNodeKind.KeyframesRule,
        name: this.currentKeyframes.name,
        keyframes: this.currentKeyframes.keyframes,
        sourceLocation: this.currentKeyframes.startLoc,
      };
      this.stylesheet.rules.push(kfNode);
      this.currentKeyframes = null;
      this.mode = 'SEEKING_HEAD';
    }
  }

  private flushPending(): void {
    if (this.currentProperty.length > 0 && this.buffer.length > 0) {
      this.commitDeclaration(this.currentProperty, this.buffer.trim());
      this.currentProperty = '';
      this.buffer = '';
    }
    if (this.currentKeyframeStep) {
      this.closeCurrentRuleOrStep();
    }
    if (this.currentRule) {
      this.closeCurrentRuleOrStep();
    }
    if (this.currentKeyframes) {
      this.closeKeyframes();
    }
    if (this.currentMedia) {
      this.closeMedia();
    }
  }
}
