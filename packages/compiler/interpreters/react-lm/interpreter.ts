import { SourceLocation } from '../../ast/types';
import {
  ReactComponentDeclarationNode,
  ReactComponentInstanceNode,
  ReactConditionalNode,
  ReactDerivedDeclarationNode,
  ReactElementNode,
  ReactFragmentNode,
  ReactListNode,
  ReactNodeKind,
  ReactProgramNode,
  ReactPropNode,
  ReactStateDeclarationNode,
  ReactTextNode,
  ReactUINode,
  getReactComponentDeclarationId,
  getReactComponentInstanceId,
  getReactElementId,
  getReactFragmentId,
  getReactProgramId,
  getReactTextId,
} from './ast';
import { ReactLMDiagnostic, ReactLMInterpreterOptions } from './types';
import {
  isCustomComponentName,
  isIntrinsicTag,
  isReactEventProp,
  resolveReactElementTag,
  resolveReactPropName,
} from './vocabulary';

interface ASTStackFrame {
  type: 'COMPONENT' | 'ELEMENT' | 'CUSTOM_INSTANCE' | 'FRAGMENT' | 'CONDITIONAL' | 'LIST';
  name?: string;
  tag?: string;
  props?: ReactPropNode[];
  children?: ReactUINode[];
  stateDecls?: ReactStateDeclarationNode[];
  conditionExpr?: string;
  thenBranch?: ReactUINode;
  elseBranch?: ReactUINode;
  arrayExpr?: string;
  itemVar?: string;
  body?: ReactUINode;
  startLoc: SourceLocation;
}

export class ReactLMInterpreter {
  private program: ReactProgramNode;
  private currentLoc: SourceLocation;
  private diagnostics: ReactLMDiagnostic[] = [];
  private options: ReactLMInterpreterOptions;

  // Stream state
  private buffer: string = '';
  private inString: boolean = false;
  private stringQuote: string = '';
  private inLineComment: boolean = false;
  private inBlockComment: boolean = false;
  private escapeNext: boolean = false;

  // Structural parsing stack
  private stack: ASTStackFrame[] = [];
  private parenDepth: number = 0;
  private currentToken: string = '';
  private currentTokenStartLoc: SourceLocation;

  constructor(options: ReactLMInterpreterOptions = {}) {
    this.options = options;
    this.currentLoc = {
      startLine: 1,
      startColumn: 1,
      startOffset: 0,
      endLine: 1,
      endColumn: 1,
      endOffset: 0,
    };
    this.currentTokenStartLoc = { ...this.currentLoc };
    this.program = {
      id: getReactProgramId(),
      kind: ReactNodeKind.Program,
      components: [],
      rootComponent: 'App',
      sourceLocation: { ...this.currentLoc },
    };
  }

  public static parse(source: string, options: ReactLMInterpreterOptions = {}): ReactProgramNode {
    const interpreter = new ReactLMInterpreter(options);
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
    this.currentTokenStartLoc = { ...this.currentLoc };
    this.program = {
      id: getReactProgramId(),
      kind: ReactNodeKind.Program,
      components: [],
      rootComponent: 'App',
      sourceLocation: { ...this.currentLoc },
    };
    this.diagnostics = [];
    this.buffer = '';
    this.inString = false;
    this.stringQuote = '';
    this.inLineComment = false;
    this.inBlockComment = false;
    this.escapeNext = false;
    this.stack = [];
    this.parenDepth = 0;
    this.currentToken = '';
  }

  public getAST(): ReactProgramNode {
    return this.program;
  }

  public getDiagnostics(): ReactLMDiagnostic[] {
    return [...this.diagnostics];
  }

  public hasErrors(): boolean {
    return this.diagnostics.some((d) => d.severity === 'error');
  }

  public isSafeToExpose(): boolean {
    if (this.inString || this.inLineComment || this.inBlockComment) {
      return false;
    }
    return this.program.components.length > 0;
  }

  public write(chunk: string): this {
    for (let i = 0; i < chunk.length; i++) {
      this.consumeChar(chunk[i]);
    }
    return this;
  }

  public end(): ReactProgramNode {
    this.flushBuffer();
    return this.program;
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
    this.buffer += char;

    // 1. Comments
    if (this.inLineComment) {
      if (char === '\n') {
        this.inLineComment = false;
      }
      return;
    }

    if (this.inBlockComment) {
      if (char === '/' && this.buffer.endsWith('*/')) {
        this.inBlockComment = false;
      }
      return;
    }

    if (!this.inString) {
      if (char === '/' && this.buffer.endsWith('//')) {
        this.inLineComment = true;
        return;
      }
      if (char === '*' && this.buffer.endsWith('/*')) {
        this.inBlockComment = true;
        return;
      }
    }

    // 2. Strings
    if (this.inString) {
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
      return;
    }

    // 3. Delimiters
    if (char === '(' || char === ')' || char === '{' || char === '}' || char === ',' || char === ';' || char === '\n' || char === '\t' || char === ' ') {
      // Process full buffer up to this point
      this.checkBufferForConstructs();
    }
  }

  private checkBufferForConstructs(): void {
    // Top-level / Block parser
    const clean = this.buffer
      .replace(/<REACT(?:-LM)?>/gi, '')
      .replace(/<\/REACT(?:-LM)?>/gi, '')
      .trim();

    if (!clean) return;

    // Detect component declarations: component(Name)(...) or comp(Name)(...)
    const compDeclRegex = /\b(?:component|comp)\s*\(\s*([A-Za-z_$][A-Za-z0-9_$]*)(?:\s*:\s*([A-Za-z_$][A-Za-z0-9_$]*))?\s*\)\s*\(/g;
    let match: RegExpExecArray | null;

    // For robust parsing, we can tokenize and recursively parse
    this.parseTokens(clean);
  }

  private flushBuffer(): void {
    const clean = this.buffer
      .replace(/<REACT(?:-LM)?>/gi, '')
      .replace(/<\/REACT(?:-LM)?>/gi, '')
      .trim();

    if (clean) {
      this.parseTokens(clean);
    }
  }

  private parseTokens(source: string): void {
    if (!source) return;

    // Tokenizer matching:
    // 1. Strings: "..." or '...'
    // 2. Parenthesized expressions / calls
    // 3. Keywords / Identifiers / Props: key:value or key:"val"
    // 4. State: state(count, 0)
    // 5. When: when(cond)(then)(else)
    // 6. Each: each(items, item)(body)
    // 7. Component: component(Name)(body)

    try {
      const parsedComponents = this.parseProgramAST(source);
      if (parsedComponents.length > 0) {
        this.program.components = parsedComponents;
        const appComp = parsedComponents.find((c) => c.name === 'App');
        this.program.rootComponent = this.options.rootComponent || appComp?.name || parsedComponents[0].name;
      }
    } catch {
      // Incremental parse error during streaming is tolerated as INCOMPLETE
    }
  }

  private parseProgramAST(source: string): ReactComponentDeclarationNode[] {
    const components: ReactComponentDeclarationNode[] = [];
    let pos = 0;

    const skipWhitespace = () => {
      while (pos < source.length && /\s/.test(source[pos])) pos++;
    };

    while (pos < source.length) {
      skipWhitespace();
      if (pos >= source.length) break;

      // Check for component(...) or comp(...)
      const compMatch = /^(?:component|comp)\s*\(\s*([A-Za-z_$][A-Za-z0-9_$]*)(?:\s*:\s*([A-Za-z_$][A-Za-z0-9_$]*))?\s*\)\s*\(/i.exec(
        source.slice(pos)
      );

      if (compMatch) {
        const compName = compMatch[1];
        const propsType = compMatch[2];
        const openParenIndex = pos + compMatch[0].length - 1;

        // Parse component body up to matching closing paren
        const bodySource = this.extractMatchingParen(source, openParenIndex);
        pos = openParenIndex + bodySource.length;

        const { stateDecls, derivedDecls, bodyNodes } = this.parseComponentBody(bodySource.slice(1, -1), compName);

        components.push({
          id: getReactComponentDeclarationId(compName),
          kind: ReactNodeKind.ComponentDeclaration,
          name: compName,
          propsType,
          stateDeclarations: stateDecls,
          derivedDeclarations: derivedDecls,
          body: bodyNodes,
          rawCode: compMatch[0] + bodySource,
          sourceLocation: { ...this.currentLoc },
        });
      } else {
        // Fallback: If top level has standalone elements, wrap in default App component
        const standaloneBody = source.slice(pos).trim();
        if (standaloneBody) {
          const { stateDecls, derivedDecls, bodyNodes } = this.parseComponentBody(standaloneBody, 'App');
          if (bodyNodes.length > 0 || stateDecls.length > 0 || derivedDecls.length > 0) {
            components.push({
              id: getReactComponentDeclarationId('App'),
              kind: ReactNodeKind.ComponentDeclaration,
              name: 'App',
              stateDeclarations: stateDecls,
              derivedDeclarations: derivedDecls,
              body: bodyNodes,
              rawCode: standaloneBody,
              sourceLocation: { ...this.currentLoc },
            });
          }
        }
        break;
      }
    }

    return components;
  }

  private extractMatchingParen(str: string, openParenPos: number): string {
    let depth = 0;
    let inStr = false;
    let quote = '';

    for (let i = openParenPos; i < str.length; i++) {
      const ch = str[i];
      if (inStr) {
        if (ch === quote && str[i - 1] !== '\\') inStr = false;
      } else {
        if (ch === '"' || ch === "'") {
          inStr = true;
          quote = ch;
        } else if (ch === '(') {
          depth++;
        } else if (ch === ')') {
          depth--;
          if (depth === 0) {
            return str.slice(openParenPos, i + 1);
          }
        }
      }
    }

    return str.slice(openParenPos);
  }

  private parseComponentBody(
    bodyStr: string,
    componentName: string
  ): {
    stateDecls: ReactStateDeclarationNode[];
    derivedDecls: ReactDerivedDeclarationNode[];
    bodyNodes: ReactUINode[];
  } {
    const stateDecls: ReactStateDeclarationNode[] = [];
    const derivedDecls: ReactDerivedDeclarationNode[] = [];
    const bodyNodes: ReactUINode[] = [];
    let pos = 0;

    const skipWhitespace = () => {
      while (pos < bodyStr.length && /\s/.test(bodyStr[pos])) pos++;
    };

    while (pos < bodyStr.length) {
      skipWhitespace();
      if (pos >= bodyStr.length) break;

      // 1. State Declaration: state(count, 0)
      const stateMatch = /^state\s*\(\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*,\s*([^)]+)\)/i.exec(bodyStr.slice(pos));
      if (stateMatch) {
        const stateName = stateMatch[1];
        let initialRaw = stateMatch[2].trim();
        let initialVal: any = initialRaw;

        if (initialRaw === 'true') initialVal = true;
        else if (initialRaw === 'false') initialVal = false;
        else if (!isNaN(Number(initialRaw))) initialVal = Number(initialRaw);
        else if (initialRaw.startsWith('"') || initialRaw.startsWith("'")) {
          initialVal = initialRaw.slice(1, -1);
        }

        stateDecls.push({
          id: `react-state-${componentName}-${stateName}`,
          kind: ReactNodeKind.StateDeclaration,
          stateName,
          name: stateName,
          initialValue: initialVal,
          sourceLocation: { ...this.currentLoc },
        });

        pos += stateMatch[0].length;
        continue;
      }

      // 2. Computed / Derived Declaration: computed(double, count * 2) or derived(double, count * 2)
      const computedMatch = /^(?:computed|derived)\s*\(\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*,\s*([^)]+)\)/i.exec(
        bodyStr.slice(pos)
      );
      if (computedMatch) {
        const derivedName = computedMatch[1];
        const expr = computedMatch[2].trim();

        derivedDecls.push({
          id: `react-derived-${componentName}-${derivedName}`,
          kind: ReactNodeKind.DerivedDeclaration,
          derivedName,
          name: derivedName,
          expression: expr,
          sourceLocation: { ...this.currentLoc },
        });

        pos += computedMatch[0].length;
        continue;
      }

      // 2. Conditionals: when(cond)(then)(else)
      const whenMatch = /^when\s*\(\s*([^)]+)\)\s*\(/i.exec(bodyStr.slice(pos));
      if (whenMatch) {
        const condExpr = whenMatch[1].trim();
        const openParenIndex = pos + whenMatch[0].length - 1;
        const thenBlock = this.extractMatchingParen(bodyStr, openParenIndex);
        pos = openParenIndex + thenBlock.length;

        const thenNodes = this.parseComponentBody(thenBlock.slice(1, -1), componentName).bodyNodes;
        let elseNode: ReactUINode | undefined = undefined;

        skipWhitespace();
        if (bodyStr[pos] === '(') {
          const elseOpenParenIndex = pos;
          const elseBlock = this.extractMatchingParen(bodyStr, elseOpenParenIndex);
          pos = elseOpenParenIndex + elseBlock.length;
          const elseNodes = this.parseComponentBody(elseBlock.slice(1, -1), componentName).bodyNodes;
          if (elseNodes.length > 0) {
            elseNode = elseNodes[0];
          }
        }

        bodyNodes.push({
          id: `react-cond-${componentName}-${bodyNodes.length}`,
          kind: ReactNodeKind.Conditional,
          conditionExpr: condExpr,
          thenBranch: thenNodes[0] || {
            id: `react-frag-${bodyNodes.length}`,
            kind: ReactNodeKind.Fragment,
            children: [],
          },
          elseBranch: elseNode,
          sourceLocation: { ...this.currentLoc },
        });
        continue;
      }

      // 3. Lists: each(items, item)(body)
      const eachMatch = /^each\s*\(\s*([A-Za-z0-9_$.]+)\s*,\s*([A-Za-z_$][A-Za-z0-9_$]*)(?:\s*,\s*([A-Za-z_$][A-Za-z0-9_$]*))?\s*\)\s*\(/i.exec(
        bodyStr.slice(pos)
      );
      if (eachMatch) {
        const arrayExpr = eachMatch[1];
        const itemVar = eachMatch[2];
        const indexVar = eachMatch[3];
        const openParenIndex = pos + eachMatch[0].length - 1;

        const listBodyBlock = this.extractMatchingParen(bodyStr, openParenIndex);
        pos = openParenIndex + listBodyBlock.length;

        const itemNodes = this.parseComponentBody(listBodyBlock.slice(1, -1), componentName).bodyNodes;

        bodyNodes.push({
          id: `react-list-${componentName}-${bodyNodes.length}`,
          kind: ReactNodeKind.List,
          arrayExpr,
          itemVar,
          indexVar,
          body: itemNodes[0] || {
            id: `react-frag-${bodyNodes.length}`,
            kind: ReactNodeKind.Fragment,
            children: [],
          },
          sourceLocation: { ...this.currentLoc },
        });
        continue;
      }

      // 4. Fragments: fragment(...) or frag(...)
      const fragMatch = /^(?:fragment|frag)\s*\(/i.exec(bodyStr.slice(pos));
      if (fragMatch) {
        const openParenIndex = pos + fragMatch[0].length - 1;
        const fragBlock = this.extractMatchingParen(bodyStr, openParenIndex);
        pos = openParenIndex + fragBlock.length;

        const fragChildren = this.parseComponentBody(fragBlock.slice(1, -1), componentName).bodyNodes;

        bodyNodes.push({
          id: getReactFragmentId(`react-${componentName}`, bodyNodes.length),
          kind: ReactNodeKind.Fragment,
          children: fragChildren,
          sourceLocation: { ...this.currentLoc },
        });
        continue;
      }

      // 5. String Text Literal: "..." or '...'
      if (bodyStr[pos] === '"' || bodyStr[pos] === "'") {
        const quote = bodyStr[pos];
        let endQuote = pos + 1;
        while (endQuote < bodyStr.length && (bodyStr[endQuote] !== quote || bodyStr[endQuote - 1] === '\\')) {
          endQuote++;
        }
        const textVal = bodyStr.slice(pos + 1, endQuote);
        pos = endQuote + 1;

        bodyNodes.push({
          id: getReactTextId(`react-${componentName}`, bodyNodes.length),
          kind: ReactNodeKind.Text,
          value: textVal,
          sourceLocation: { ...this.currentLoc },
        });
        continue;
      }

      // 6. Intrinsic Elements & Custom Components: tag(...) or Component(...)
      const elemMatch = /^([A-Za-z0-9_-]+)\s*\(/i.exec(bodyStr.slice(pos));
      if (elemMatch) {
        const rawIdent = elemMatch[1];
        const openParenIndex = pos + elemMatch[0].length - 1;

        const contentBlock = this.extractMatchingParen(bodyStr, openParenIndex);
        pos = openParenIndex + contentBlock.length;

        const isCustom = isCustomComponentName(rawIdent);
        const canonicalTag = isCustom ? rawIdent : resolveReactElementTag(rawIdent);

        const { props, children } = this.parsePropsAndChildren(contentBlock.slice(1, -1), componentName);

        if (isCustom) {
          bodyNodes.push({
            id: getReactComponentInstanceId(`react-${componentName}`, rawIdent, bodyNodes.length),
            kind: ReactNodeKind.ComponentInstance,
            componentName: rawIdent,
            props,
            children,
            sourceLocation: { ...this.currentLoc },
          });
        } else {
          bodyNodes.push({
            id: getReactElementId(`react-${componentName}`, canonicalTag, bodyNodes.length),
            kind: ReactNodeKind.Element,
            tag: canonicalTag,
            isIntrinsic: true,
            props,
            children,
            sourceLocation: { ...this.currentLoc },
          });
        }
        continue;
      }

      // Skip unrecognized char
      pos++;
    }

    return { stateDecls, derivedDecls, bodyNodes };
  }

  private parsePropsAndChildren(
    blockStr: string,
    ownerComponent: string
  ): { props: ReactPropNode[]; children: ReactUINode[] } {
    const props: ReactPropNode[] = [];
    const children: ReactUINode[] = [];
    let pos = 0;

    const skipWhitespace = () => {
      while (pos < blockStr.length && /\s/.test(blockStr[pos])) pos++;
    };

    while (pos < blockStr.length) {
      skipWhitespace();
      if (pos >= blockStr.length) break;

      // 1. Props: key:value or key:"value" or key:() => { ... }
      const propMatch = /^([A-Za-z0-9_$-]+)\s*:\s*/i.exec(blockStr.slice(pos));
      if (propMatch) {
        const propName = propMatch[1];
        pos += propMatch[0].length;
        skipWhitespace();

        let val: any = '';
        let rawVal = '';
        let isEvent = isReactEventProp(propName);

        if (blockStr[pos] === '"' || blockStr[pos] === "'") {
          const q = blockStr[pos];
          let endQ = pos + 1;
          while (endQ < blockStr.length && (blockStr[endQ] !== q || blockStr[endQ - 1] === '\\')) {
            endQ++;
          }
          val = blockStr.slice(pos + 1, endQ);
          rawVal = blockStr.slice(pos, endQ + 1);
          pos = endQ + 1;
        } else if (blockStr[pos] === '(' || blockStr[pos] === '{') {
          // Arrow function / object expression
          const expr = this.extractMatchingParen(blockStr, pos);
          val = expr;
          rawVal = expr;
          pos += expr.length;
        } else {
          // Identifier / boolean / number
          let endWord = pos;
          while (endWord < blockStr.length && !/\s|\(|\)|,|;/.test(blockStr[endWord])) {
            endWord++;
          }
          rawVal = blockStr.slice(pos, endWord);
          if (rawVal === 'true') val = true;
          else if (rawVal === 'false') val = false;
          else if (!isNaN(Number(rawVal)) && rawVal.trim() !== '') val = Number(rawVal);
          else val = rawVal;
          pos = endWord;
        }

        props.push({
          id: `prop-${propName}-${props.length}`,
          kind: ReactNodeKind.Prop,
          name: resolveReactPropName(propName),
          value: val,
          rawValue: rawVal,
          isEvent,
          sourceLocation: { ...this.currentLoc },
        });
        continue;
      }

      // 2. Nested Child Elements & Text
      const childParsed = this.parseComponentBody(blockStr.slice(pos), ownerComponent);
      if (childParsed.bodyNodes.length > 0) {
        children.push(...childParsed.bodyNodes);
        break; // Consumed remaining
      }

      pos++;
    }

    return { props, children };
  }
}
