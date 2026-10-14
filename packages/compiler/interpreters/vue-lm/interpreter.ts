import { SourceLocation } from '../../ast/types';
import {
  VueComponentDeclarationNode,
  VueComponentInstanceNode,
  VueComputedDeclarationNode,
  VueConditionalNode,
  VueElementNode,
  VueFragmentNode,
  VueListNode,
  VueNodeKind,
  VueProgramNode,
  VuePropNode,
  VueSlotNode,
  VueStateDeclarationNode,
  VueTextNode,
  VueUINode,
  getVueComponentDeclarationId,
  getVueComponentInstanceId,
  getVueComputedId,
  getVueElementId,
  getVueFragmentId,
  getVueProgramId,
  getVueSlotId,
  getVueStateId,
  getVueTextId,
} from './ast';
import { VueLMDiagnostic, VueLMInterpreterOptions } from './types';
import {
  isCustomComponentName,
  isIntrinsicTag,
  isVueEventProp,
  isVueModelProp,
  isVueShowProp,
  resolveVueElementTag,
  resolveVuePropName,
} from './vocabulary';

export class VueLMInterpreter {
  private program: VueProgramNode;
  private currentLoc: SourceLocation;
  private diagnostics: VueLMDiagnostic[] = [];
  private options: VueLMInterpreterOptions;

  // Stream state
  private buffer: string = '';
  private inString: boolean = false;
  private stringQuote: string = '';
  private inLineComment: boolean = false;
  private inBlockComment: boolean = false;
  private escapeNext: boolean = false;

  constructor(options: VueLMInterpreterOptions = {}) {
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
      id: getVueProgramId(),
      kind: VueNodeKind.Program,
      components: [],
      rootComponent: 'App',
      sourceLocation: { ...this.currentLoc },
    };
  }

  public static parse(source: string, options: VueLMInterpreterOptions = {}): VueProgramNode {
    const interpreter = new VueLMInterpreter(options);
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
      id: getVueProgramId(),
      kind: VueNodeKind.Program,
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

  public getAST(): VueProgramNode {
    return this.program;
  }

  public getDiagnostics(): VueLMDiagnostic[] {
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

  public end(): VueProgramNode {
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

    // 3. Delimiters triggering construct check
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
      .replace(/<VUE(?:-LM)?>/gi, '')
      .replace(/<\/VUE(?:-LM)?>/gi, '')
      .trim();

    if (!clean) return;

    this.parseTokens(clean);
  }

  private flushBuffer(): void {
    const clean = this.buffer
      .replace(/<VUE(?:-LM)?>/gi, '')
      .replace(/<\/VUE(?:-LM)?>/gi, '')
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
      // Incremental parse error during streaming is tolerated as INCOMPLETE
    }
  }

  private parseProgramAST(source: string): VueComponentDeclarationNode[] {
    const components: VueComponentDeclarationNode[] = [];
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

        const { stateDecls, computedDecls, bodyNodes } = this.parseComponentBody(
          bodySource.slice(1, -1),
          compName
        );

        components.push({
          id: getVueComponentDeclarationId(compName),
          kind: VueNodeKind.ComponentDeclaration,
          name: compName,
          propsType,
          stateDeclarations: stateDecls,
          computedDeclarations: computedDecls,
          body: bodyNodes,
          rawCode: compMatch[0] + bodySource,
          sourceLocation: { ...this.currentLoc },
        });
      } else {
        // Fallback: If top level has standalone elements, wrap in default App component
        const standaloneBody = source.slice(pos).trim();
        if (standaloneBody) {
          const { stateDecls, computedDecls, bodyNodes } = this.parseComponentBody(
            standaloneBody,
            'App'
          );
          if (bodyNodes.length > 0 || stateDecls.length > 0 || computedDecls.length > 0) {
            components.push({
              id: getVueComponentDeclarationId('App'),
              kind: VueNodeKind.ComponentDeclaration,
              name: 'App',
              stateDeclarations: stateDecls,
              computedDeclarations: computedDecls,
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
    stateDecls: VueStateDeclarationNode[];
    computedDecls: VueComputedDeclarationNode[];
    bodyNodes: VueUINode[];
  } {
    const stateDecls: VueStateDeclarationNode[] = [];
    const computedDecls: VueComputedDeclarationNode[] = [];
    const bodyNodes: VueUINode[] = [];
    let pos = 0;

    const skipWhitespace = () => {
      while (pos < bodyStr.length && /\s/.test(bodyStr[pos])) pos++;
    };

    while (pos < bodyStr.length) {
      skipWhitespace();
      if (pos >= bodyStr.length) break;

      // 1. Reactive State Declaration: state(count, 0) or ref(count, 0) or reactive(user, {...})
      const stateMatch = /^(?:state|ref|reactive)\s*\(\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*,\s*([^)]+)\)/i.exec(
        bodyStr.slice(pos)
      );
      if (stateMatch) {
        const stateName = stateMatch[1];
        let initialRaw = stateMatch[2].trim();
        let initialVal: any = initialRaw;

        if (initialRaw === 'true') initialVal = true;
        else if (initialRaw === 'false') initialVal = false;
        else if (!isNaN(Number(initialRaw))) initialVal = Number(initialRaw);
        else if (
          (initialRaw.startsWith('"') && initialRaw.endsWith('"')) ||
          (initialRaw.startsWith("'") && initialRaw.endsWith("'"))
        ) {
          initialVal = initialRaw.slice(1, -1);
        }

        const isRef = stateMatch[0].startsWith('ref');
        const isReactive = stateMatch[0].startsWith('reactive');

        stateDecls.push({
          id: getVueStateId(componentName, stateName),
          kind: VueNodeKind.StateDeclaration,
          stateName,
          name: stateName,
          initialValue: initialVal,
          isRef,
          isReactive,
          sourceLocation: { ...this.currentLoc },
        });

        pos += stateMatch[0].length;
        continue;
      }

      // 2. Computed Declaration: computed(double, count * 2) or compVal(double, count * 2)
      const computedMatch = /^(?:computed|compVal)\s*\(\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*,\s*([^)]+)\)/i.exec(
        bodyStr.slice(pos)
      );
      if (computedMatch) {
        const compValName = computedMatch[1];
        const expr = computedMatch[2].trim();

        computedDecls.push({
          id: getVueComputedId(componentName, compValName),
          kind: VueNodeKind.ComputedDeclaration,
          name: compValName,
          computedName: compValName,
          expression: expr,
          sourceLocation: { ...this.currentLoc },
        });

        pos += computedMatch[0].length;
        continue;
      }

      // 3. Conditionals: when(cond)(then)(else) or if(cond)(then)(else)
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
        let elseNode: VueUINode | undefined = undefined;

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
          id: `vue-cond-${componentName}-${bodyNodes.length}`,
          kind: VueNodeKind.Conditional,
          conditionExpr: condExpr,
          thenBranch: thenNodes[0] || {
            id: `vue-frag-${bodyNodes.length}`,
            kind: VueNodeKind.Fragment,
            children: [],
          },
          elseBranch: elseNode,
          sourceLocation: { ...this.currentLoc },
        });
        continue;
      }

      // 4. Lists: each(items, item, key)(body) or for(items, item, key)(body)
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
          id: `vue-list-${componentName}-${bodyNodes.length}`,
          kind: VueNodeKind.List,
          arrayExpr,
          itemVar,
          keyExpr: keyOrIndex,
          body: itemNodes[0] || {
            id: `vue-frag-${bodyNodes.length}`,
            kind: VueNodeKind.Fragment,
            children: [],
          },
          sourceLocation: { ...this.currentLoc },
        });
        continue;
      }

      // 5. Slots: slot() or slot(name)
      const slotMatch = /^slot\s*\(\s*([A-Za-z0-9_$]*)\s*\)/i.exec(bodyStr.slice(pos));
      if (slotMatch) {
        const slotName = slotMatch[1] || 'default';
        bodyNodes.push({
          id: getVueSlotId(`vue-${componentName}`, slotName, bodyNodes.length),
          kind: VueNodeKind.Slot,
          name: slotName,
          children: [],
          sourceLocation: { ...this.currentLoc },
        });
        pos += slotMatch[0].length;
        continue;
      }

      // 6. Fragments: fragment(...) or frag(...)
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
          id: getVueFragmentId(`vue-${componentName}`, bodyNodes.length),
          kind: VueNodeKind.Fragment,
          children: fragChildren,
          sourceLocation: { ...this.currentLoc },
        });
        continue;
      }

      // 7. String Text Literal: "..." or '...'
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
          id: getVueTextId(`vue-${componentName}`, bodyNodes.length),
          kind: VueNodeKind.Text,
          value: textVal,
          sourceLocation: { ...this.currentLoc },
        });
        continue;
      }

      // 8. Intrinsic Elements & Custom Components: tag(...) or Component(...)
      const elemMatch = /^([A-Za-z0-9_@:-]+)\s*\(/i.exec(bodyStr.slice(pos));
      if (elemMatch) {
        const rawIdent = elemMatch[1];
        const openParenIndex = pos + elemMatch[0].length - 1;

        const contentBlock = this.extractMatchingParen(bodyStr, openParenIndex);
        pos = openParenIndex + contentBlock.length;

        const isCustom = isCustomComponentName(rawIdent);
        const canonicalTag = isCustom ? rawIdent : resolveVueElementTag(rawIdent);

        const { props, children, modelBinding, showCondition } = this.parsePropsAndChildren(
          contentBlock.slice(1, -1),
          componentName
        );

        if (isCustom) {
          bodyNodes.push({
            id: getVueComponentInstanceId(`vue-${componentName}`, rawIdent, bodyNodes.length),
            kind: VueNodeKind.ComponentInstance,
            componentName: rawIdent,
            props,
            children,
            sourceLocation: { ...this.currentLoc },
          });
        } else {
          bodyNodes.push({
            id: getVueElementId(`vue-${componentName}`, canonicalTag, bodyNodes.length),
            kind: VueNodeKind.Element,
            tag: canonicalTag,
            isIntrinsic: true,
            props,
            children,
            modelBinding,
            showCondition,
            sourceLocation: { ...this.currentLoc },
          });
        }
        continue;
      }

      // Skip unrecognized char
      pos++;
    }

    return { stateDecls, computedDecls, bodyNodes };
  }

  private parsePropsAndChildren(
    blockStr: string,
    ownerComponent: string
  ): {
    props: VuePropNode[];
    children: VueUINode[];
    modelBinding?: string;
    showCondition?: string;
  } {
    const props: VuePropNode[] = [];
    const children: VueUINode[] = [];
    let modelBinding: string | undefined = undefined;
    let showCondition: string | undefined = undefined;
    let pos = 0;

    const skipWhitespace = () => {
      while (pos < blockStr.length && /\s/.test(blockStr[pos])) pos++;
    };

    while (pos < blockStr.length) {
      skipWhitespace();
      if (pos >= blockStr.length) break;

      // 1. Props: key:value or key:"value" or @click:handler or v-model:name
      const propMatch = /^([A-Za-z0-9_@:$-]+)\s*:\s*/i.exec(blockStr.slice(pos));
      if (propMatch) {
        const rawPropName = propMatch[1];
        pos += propMatch[0].length;
        skipWhitespace();

        let val: any = '';
        let rawVal = '';
        const isEvent = isVueEventProp(rawPropName);
        const isModel = isVueModelProp(rawPropName);
        const isShow = isVueShowProp(rawPropName);

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
          // Arrow function / object expression
          const expr = this.extractMatchingParen(blockStr, pos);
          val = expr;
          rawVal = expr;
          pos += expr.length;
        } else {
          // Identifier / boolean / number
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

        if (isModel) {
          modelBinding = String(val);
        }
        if (isShow) {
          showCondition = String(val);
        }

        const canonicalName = resolveVuePropName(rawPropName);

        props.push({
          id: `vue-prop-${canonicalName}-${props.length}`,
          kind: VueNodeKind.Prop,
          name: canonicalName,
          value: val,
          rawValue: rawVal,
          isEvent,
          isModel,
          directiveName: isModel
            ? 'v-model'
            : isShow
            ? 'v-show'
            : isEvent
            ? 'v-on'
            : undefined,
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

    return { props, children, modelBinding, showCondition };
  }
}
