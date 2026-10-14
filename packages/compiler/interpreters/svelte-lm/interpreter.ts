import { SourceLocation } from '../../ast/types';
import {
  SvelteComponentDeclarationNode,
  SvelteComponentInstanceNode,
  SvelteConditionalNode,
  SvelteEachNode,
  SvelteElementNode,
  SvelteFragmentNode,
  SvelteNodeKind,
  SvelteProgramNode,
  SveltePropDeclarationNode,
  SveltePropNode,
  SvelteReactiveDeclarationNode,
  SvelteSlotNode,
  SvelteStateDeclarationNode,
  SvelteTextNode,
  SvelteUINode,
  getSvelteComponentDeclarationId,
  getSvelteComponentInstanceId,
  getSvelteElementId,
  getSvelteFragmentId,
  getSvelteProgramId,
  getSvelteReactiveId,
  getSvelteSlotId,
  getSvelteStateId,
  getSvelteTextId,
} from './ast';
import {
  extractExpressionDependencies,
  evaluateSvelteExpression,
} from './reactivity';
import { SvelteLMDiagnostic, SvelteLMInterpreterOptions } from './types';
import {
  getBindingPropertyName,
  isCustomComponentName,
  isIntrinsicTag,
  isSvelteBindingProp,
  isSvelteEventProp,
  resolveSvelteElementTag,
  resolveSveltePropName,
} from './vocabulary';

export class SvelteLMInterpreter {
  private program: SvelteProgramNode;
  private currentLoc: SourceLocation;
  private diagnostics: SvelteLMDiagnostic[] = [];
  private options: SvelteLMInterpreterOptions;

  // Stream state
  private buffer: string = '';
  private inString: boolean = false;
  private stringQuote: string = '';
  private inLineComment: boolean = false;
  private inBlockComment: boolean = false;
  private escapeNext: boolean = false;

  constructor(options: SvelteLMInterpreterOptions = {}) {
    this.options = options;
    this.currentLoc = {
      startLine: 1,
      startColumn: 1,
      startOffset: 0,
      endLine: 1,
      endColumn: 1,
      endOffset: 0,
    };
    this.program = {
      id: getSvelteProgramId(),
      kind: SvelteNodeKind.Program,
      components: [],
      rootComponent: 'App',
      sourceLocation: { ...this.currentLoc },
    };
  }

  public static parse(
    source: string,
    options: SvelteLMInterpreterOptions = {}
  ): SvelteProgramNode {
    const interpreter = new SvelteLMInterpreter(options);
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
    this.program = {
      id: getSvelteProgramId(),
      kind: SvelteNodeKind.Program,
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
  }

  public getAST(): SvelteProgramNode {
    return this.program;
  }

  public getDiagnostics(): SvelteLMDiagnostic[] {
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

  public end(): SvelteProgramNode {
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
    if (
      char === '(' ||
      char === ')' ||
      char === '{' ||
      char === '}' ||
      char === ',' ||
      char === ';' ||
      char === '\n' ||
      char === '\t' ||
      char === ' '
    ) {
      this.checkBufferForConstructs();
    }
  }

  private checkBufferForConstructs(): void {
    const clean = this.buffer
      .replace(/<SVELTE(?:-LM)?>/gi, '')
      .replace(/<\/SVELTE(?:-LM)?>/gi, '')
      .trim();

    if (!clean) return;

    this.parseTokens(clean);
  }

  private flushBuffer(): void {
    const clean = this.buffer
      .replace(/<SVELTE(?:-LM)?>/gi, '')
      .replace(/<\/SVELTE(?:-LM)?>/gi, '')
      .trim();

    if (clean) {
      this.parseTokens(clean);
    }
  }

  private parseTokens(source: string): void {
    if (!source) return;

    try {
      const parsedComponents = this.parseProgramAST(source);
      if (parsedComponents.length > 0) {
        this.program.components = parsedComponents;
        const appComp = parsedComponents.find((c) => c.name === 'App');
        this.program.rootComponent =
          this.options.rootComponent || appComp?.name || parsedComponents[0].name;
      }
    } catch {
      // Incremental parse errors during in-flight streaming are tolerated as INCOMPLETE
    }
  }

  private parseProgramAST(source: string): SvelteComponentDeclarationNode[] {
    const components: SvelteComponentDeclarationNode[] = [];
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

        const bodySource = this.extractMatchingParen(source, openParenIndex);
        pos = openParenIndex + bodySource.length;

        const { stateDecls, reactiveDecls, propDecls, bodyNodes } = this.parseComponentBody(
          bodySource.slice(1, -1),
          compName
        );

        components.push({
          id: getSvelteComponentDeclarationId(compName),
          kind: SvelteNodeKind.ComponentDeclaration,
          name: compName,
          propsType,
          propDeclarations: propDecls,
          stateDeclarations: stateDecls,
          reactiveDeclarations: reactiveDecls,
          body: bodyNodes,
          rawCode: compMatch[0] + bodySource,
          sourceLocation: { ...this.currentLoc },
        });
      } else {
        // Fallback: Standalone elements wrap in default App component
        const standaloneBody = source.slice(pos).trim();
        if (standaloneBody) {
          const { stateDecls, reactiveDecls, propDecls, bodyNodes } = this.parseComponentBody(
            standaloneBody,
            'App'
          );
          if (
            bodyNodes.length > 0 ||
            stateDecls.length > 0 ||
            reactiveDecls.length > 0 ||
            propDecls.length > 0
          ) {
            components.push({
              id: getSvelteComponentDeclarationId('App'),
              kind: SvelteNodeKind.ComponentDeclaration,
              name: 'App',
              propDeclarations: propDecls,
              stateDeclarations: stateDecls,
              reactiveDeclarations: reactiveDecls,
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
    let inBrackets = 0;
    let inBraces = 0;

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
        } else if (ch === '[') {
          inBrackets++;
        } else if (ch === ']') {
          if (inBrackets > 0) inBrackets--;
        } else if (ch === '{') {
          inBraces++;
        } else if (ch === '}') {
          if (inBraces > 0) inBraces--;
        }
      }
    }

    return str.slice(openParenPos);
  }

  private parseComponentBody(
    bodyStr: string,
    componentName: string
  ): {
    stateDecls: SvelteStateDeclarationNode[];
    reactiveDecls: SvelteReactiveDeclarationNode[];
    propDecls: SveltePropDeclarationNode[];
    bodyNodes: SvelteUINode[];
  } {
    const stateDecls: SvelteStateDeclarationNode[] = [];
    const reactiveDecls: SvelteReactiveDeclarationNode[] = [];
    const propDecls: SveltePropDeclarationNode[] = [];
    const bodyNodes: SvelteUINode[] = [];
    let pos = 0;

    const skipWhitespace = () => {
      while (pos < bodyStr.length && /\s/.test(bodyStr[pos])) pos++;
    };

    while (pos < bodyStr.length) {
      skipWhitespace();
      if (pos >= bodyStr.length) break;

      // 1. Svelte State: state(count, 0) or let(count, 0)
      const statePrefix = /^(?:state|let)\s*\(/i.exec(bodyStr.slice(pos));
      if (statePrefix) {
        const openParenPos = pos + statePrefix[0].length - 1;
        const fullBlock = this.extractMatchingParen(bodyStr, openParenPos);
        const inner = fullBlock.slice(1, -1).trim();
        const commaIdx = inner.indexOf(',');
        if (commaIdx !== -1) {
          const stateName = inner.slice(0, commaIdx).trim();
          const initialRaw = inner.slice(commaIdx + 1).trim();
          let initialVal: any = initialRaw;

          if (initialRaw === 'true') initialVal = true;
          else if (initialRaw === 'false') initialVal = false;
          else if (!isNaN(Number(initialRaw)) && initialRaw !== '') initialVal = Number(initialRaw);
          else if (
            (initialRaw.startsWith('"') && initialRaw.endsWith('"')) ||
            (initialRaw.startsWith("'") && initialRaw.endsWith("'"))
          ) {
            initialVal = initialRaw.slice(1, -1);
          } else {
            try {
              initialVal = evaluateSvelteExpression(initialRaw, {});
              if (initialVal === undefined) {
                // Try JSON parse if array or object
                initialVal = JSON.parse(initialRaw);
              }
            } catch {
              initialVal = initialRaw;
            }
          }

          stateDecls.push({
            id: getSvelteStateId(componentName, stateName),
            kind: SvelteNodeKind.StateDeclaration,
            stateName,
            name: stateName,
            initialValue: initialVal !== undefined ? initialVal : initialRaw,
            sourceLocation: { ...this.currentLoc },
          });

          pos = openParenPos + fullBlock.length;
          continue;
        }
      }

      // 2. Svelte Reactive Declaration: reactive(double, count * 2) or derived(double, count * 2) or $: double = count * 2
      const reactivePrefix = /^(?:reactive|derived|\$:?)\s*\(/i.exec(bodyStr.slice(pos));
      if (reactivePrefix) {
        const openParenPos = pos + reactivePrefix[0].length - 1;
        const fullBlock = this.extractMatchingParen(bodyStr, openParenPos);
        const inner = fullBlock.slice(1, -1).trim();
        const commaIdx = inner.indexOf(',');
        if (commaIdx !== -1) {
          const reactiveName = inner.slice(0, commaIdx).trim();
          const expr = inner.slice(commaIdx + 1).trim();

          const dependencies = extractExpressionDependencies(expr).filter((id) => id !== reactiveName);

          reactiveDecls.push({
            id: getSvelteReactiveId(componentName, reactiveName),
            kind: SvelteNodeKind.ReactiveDeclaration,
            name: reactiveName,
            reactiveName,
            expression: expr,
            dependencies,
            sourceLocation: { ...this.currentLoc },
          });

          pos = openParenPos + fullBlock.length;
          continue;
        }
      }

      // 3. Svelte Component Prop: prop(title, "Default") or exportLet(title)
      const propPrefix = /^(?:prop|exportLet)\s*\(/i.exec(bodyStr.slice(pos));
      if (propPrefix) {
        const openParenPos = pos + propPrefix[0].length - 1;
        const fullBlock = this.extractMatchingParen(bodyStr, openParenPos);
        const inner = fullBlock.slice(1, -1).trim();
        const commaIdx = inner.indexOf(',');
        let propName = inner;
        let defaultVal: any = undefined;
        if (commaIdx !== -1) {
          propName = inner.slice(0, commaIdx).trim();
          const valRaw = inner.slice(commaIdx + 1).trim();
          defaultVal = evaluateSvelteExpression(valRaw, {}) ?? valRaw;
        }

        propDecls.push({
          id: `svelte-prop-decl-${componentName}-${propName}`,
          kind: SvelteNodeKind.PropDeclaration,
          name: propName,
          propName,
          defaultValue: defaultVal,
          sourceLocation: { ...this.currentLoc },
        });

        pos = openParenPos + fullBlock.length;
        continue;
      }

      // 4. Conditionals: when(cond)(then)(else) or if(cond)(then)(else)
      const whenMatch = /^(?:when|if)\s*\(\s*([^)]+)\)\s*\(/i.exec(bodyStr.slice(pos));
      if (whenMatch) {
        const condExpr = whenMatch[1].trim();
        const openParenIndex = pos + whenMatch[0].length - 1;
        const thenBlock = this.extractMatchingParen(bodyStr, openParenIndex);
        pos = openParenIndex + thenBlock.length;

        const thenNodes = this.parseComponentBody(
          thenBlock.slice(1, -1),
          componentName
        ).bodyNodes;
        let elseNode: SvelteUINode | undefined = undefined;

        skipWhitespace();
        if (bodyStr[pos] === '(') {
          const elseOpenParenIndex = pos;
          const elseBlock = this.extractMatchingParen(bodyStr, elseOpenParenIndex);
          pos = elseOpenParenIndex + elseBlock.length;
          const elseNodes = this.parseComponentBody(
            elseBlock.slice(1, -1),
            componentName
          ).bodyNodes;
          if (elseNodes.length > 0) {
            elseNode = elseNodes[0];
          }
        }

        bodyNodes.push({
          id: `svelte-cond-${componentName}-${bodyNodes.length}`,
          kind: SvelteNodeKind.Conditional,
          conditionExpr: condExpr,
          thenBranch: thenNodes[0] || {
            id: `svelte-frag-${bodyNodes.length}`,
            kind: SvelteNodeKind.Fragment,
            children: [],
          },
          elseBranch: elseNode,
          sourceLocation: { ...this.currentLoc },
        });
        continue;
      }

      // 5. Each Blocks: each(items, item, key)(body) or for(items, item, key)(body)
      const eachMatch = /^(?:each|for)\s*\(\s*([A-Za-z0-9_$.]+)\s*,\s*([A-Za-z_$][A-Za-z0-9_$]*)(?:\s*,\s*([^)]+))?\s*\)\s*\(/i.exec(
        bodyStr.slice(pos)
      );
      if (eachMatch) {
        const arrayExpr = eachMatch[1];
        const itemVar = eachMatch[2];
        const keyOrIndex = eachMatch[3]?.trim();
        const openParenIndex = pos + eachMatch[0].length - 1;

        const listBodyBlock = this.extractMatchingParen(bodyStr, openParenIndex);
        pos = openParenIndex + listBodyBlock.length;

        const itemNodes = this.parseComponentBody(
          listBodyBlock.slice(1, -1),
          componentName
        ).bodyNodes;

        bodyNodes.push({
          id: `svelte-each-${componentName}-${bodyNodes.length}`,
          kind: SvelteNodeKind.Each,
          arrayExpr,
          itemVar,
          keyExpr: keyOrIndex,
          body: itemNodes[0] || {
            id: `svelte-frag-${bodyNodes.length}`,
            kind: SvelteNodeKind.Fragment,
            children: [],
          },
          sourceLocation: { ...this.currentLoc },
        });
        continue;
      }

      // 6. Slots: slot() or slot(name)
      const slotMatch = /^slot\s*\(\s*([A-Za-z0-9_$]*)\s*\)/i.exec(bodyStr.slice(pos));
      if (slotMatch) {
        const slotName = slotMatch[1] || 'default';
        bodyNodes.push({
          id: getSvelteSlotId(`svelte-${componentName}`, slotName, bodyNodes.length),
          kind: SvelteNodeKind.Slot,
          name: slotName,
          children: [],
          sourceLocation: { ...this.currentLoc },
        });
        pos += slotMatch[0].length;
        continue;
      }

      // 7. Fragments: fragment(...) or frag(...)
      const fragMatch = /^(?:fragment|frag)\s*\(/i.exec(bodyStr.slice(pos));
      if (fragMatch) {
        const openParenIndex = pos + fragMatch[0].length - 1;
        const fragBlock = this.extractMatchingParen(bodyStr, openParenIndex);
        pos = openParenIndex + fragBlock.length;

        const fragChildren = this.parseComponentBody(
          fragBlock.slice(1, -1),
          componentName
        ).bodyNodes;

        bodyNodes.push({
          id: getSvelteFragmentId(`svelte-${componentName}`, bodyNodes.length),
          kind: SvelteNodeKind.Fragment,
          children: fragChildren,
          sourceLocation: { ...this.currentLoc },
        });
        continue;
      }

      // 8. String Text Literal: "..." or '...'
      if (bodyStr[pos] === '"' || bodyStr[pos] === "'") {
        const quote = bodyStr[pos];
        let endQuote = pos + 1;
        while (
          endQuote < bodyStr.length &&
          (bodyStr[endQuote] !== quote || bodyStr[endQuote - 1] === '\\')
        ) {
          endQuote++;
        }
        const textVal = bodyStr.slice(pos + 1, endQuote);
        pos = endQuote + 1;

        bodyNodes.push({
          id: getSvelteTextId(`svelte-${componentName}`, bodyNodes.length),
          kind: SvelteNodeKind.Text,
          value: textVal,
          sourceLocation: { ...this.currentLoc },
        });
        continue;
      }

      // 9. Intrinsic Elements & Custom Components: tag(...) or Component(...)
      const elemMatch = /^([A-Za-z0-9_@:-]+)\s*\(/i.exec(bodyStr.slice(pos));
      if (elemMatch) {
        const rawIdent = elemMatch[1];
        const openParenIndex = pos + elemMatch[0].length - 1;

        const contentBlock = this.extractMatchingParen(bodyStr, openParenIndex);
        pos = openParenIndex + contentBlock.length;

        const isCustom = isCustomComponentName(rawIdent);
        const canonicalTag = isCustom ? rawIdent : resolveSvelteElementTag(rawIdent);

        const { props, children, bindingTarget, bindingProperty, dynamicClassConditions } =
          this.parsePropsAndChildren(contentBlock.slice(1, -1), componentName);

        if (isCustom) {
          bodyNodes.push({
            id: getSvelteComponentInstanceId(`svelte-${componentName}`, rawIdent, bodyNodes.length),
            kind: SvelteNodeKind.ComponentInstance,
            componentName: rawIdent,
            props,
            children,
            sourceLocation: { ...this.currentLoc },
          });
        } else {
          bodyNodes.push({
            id: getSvelteElementId(`svelte-${componentName}`, canonicalTag, bodyNodes.length),
            kind: SvelteNodeKind.Element,
            tag: canonicalTag,
            isIntrinsic: true,
            props,
            children,
            bindingTarget,
            bindingProperty,
            dynamicClassConditions,
            sourceLocation: { ...this.currentLoc },
          });
        }
        continue;
      }

      // Skip unrecognized char
      pos++;
    }

    return { stateDecls, reactiveDecls, propDecls, bodyNodes };
  }

  private parsePropsAndChildren(
    blockStr: string,
    ownerComponent: string
  ): {
    props: SveltePropNode[];
    children: SvelteUINode[];
    bindingTarget?: string;
    bindingProperty?: string;
    dynamicClassConditions?: Record<string, string>;
  } {
    const props: SveltePropNode[] = [];
    const children: SvelteUINode[] = [];
    let bindingTarget: string | undefined = undefined;
    let bindingProperty: string | undefined = undefined;
    const dynamicClassConditions: Record<string, string> = {};
    let pos = 0;

    const skipWhitespace = () => {
      while (pos < blockStr.length && /\s/.test(blockStr[pos])) pos++;
    };

    while (pos < blockStr.length) {
      skipWhitespace();
      if (pos >= blockStr.length) break;

      // 1. Props: key:value, on:click:handler, bind:value:name, class:active:isActive
      const propMatch = /^([A-Za-z0-9_@:$-]+)\s*:\s*/i.exec(blockStr.slice(pos));
      if (propMatch) {
        const rawPropName = propMatch[1];
        pos += propMatch[0].length;
        skipWhitespace();

        let val: any = '';
        let rawVal = '';
        const isEvent = isSvelteEventProp(rawPropName);
        const isBinding = isSvelteBindingProp(rawPropName);

        if (blockStr[pos] === '"' || blockStr[pos] === "'") {
          const q = blockStr[pos];
          let endQ = pos + 1;
          while (
            endQ < blockStr.length &&
            (blockStr[endQ] !== q || blockStr[endQ - 1] === '\\')
          ) {
            endQ++;
          }
          val = blockStr.slice(pos + 1, endQ);
          rawVal = blockStr.slice(pos, endQ + 1);
          pos = endQ + 1;
        } else if (blockStr[pos] === '(' || blockStr[pos] === '{') {
          const expr = this.extractMatchingParen(blockStr, pos);
          val = expr;
          rawVal = expr;
          pos += expr.length;
        } else {
          let endWord = pos;
          while (
            endWord < blockStr.length &&
            !/\s|\(|\)|,|;/.test(blockStr[endWord])
          ) {
            endWord++;
          }
          rawVal = blockStr.slice(pos, endWord);
          if (rawVal === 'true') val = true;
          else if (rawVal === 'false') val = false;
          else if (!isNaN(Number(rawVal)) && rawVal.trim() !== '') val = Number(rawVal);
          else val = rawVal;
          pos = endWord;
        }

        if (isBinding) {
          bindingTarget = String(val);
          bindingProperty = getBindingPropertyName(rawPropName);
        }

        if (rawPropName.startsWith('class:')) {
          const clsName = rawPropName.slice(6);
          dynamicClassConditions[clsName] = String(val);
        }

        const canonicalName = resolveSveltePropName(rawPropName);

        props.push({
          id: `svelte-prop-${canonicalName}-${props.length}`,
          kind: SvelteNodeKind.Prop,
          name: canonicalName,
          value: val,
          rawValue: rawVal,
          isEvent,
          isBinding,
          bindingType: isBinding ? getBindingPropertyName(rawPropName) : undefined,
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

    return { props, children, bindingTarget, bindingProperty, dynamicClassConditions };
  }
}
