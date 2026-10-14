import { SourceLocation } from '../../ast/types';
import {
  AngularComponentDeclarationNode,
  AngularComponentInstanceNode,
  AngularConditionalNode,
  AngularContentProjectionNode,
  AngularDerivedDeclarationNode,
  AngularElementNode,
  AngularForNode,
  AngularFragmentNode,
  AngularInputDeclarationNode,
  AngularNodeKind,
  AngularOutputDeclarationNode,
  AngularProgramNode,
  AngularPropNode,
  AngularStateDeclarationNode,
  AngularTextNode,
  AngularUINode,
  getAngularComponentDeclarationId,
  getAngularComponentInstanceId,
  getAngularConditionalId,
  getAngularContentProjectionId,
  getAngularDerivedDeclarationId,
  getAngularElementId,
  getAngularForId,
  getAngularFragmentId,
  getAngularInputDeclarationId,
  getAngularOutputDeclarationId,
  getAngularProgramId,
  getAngularPropId,
  getAngularStateDeclarationId,
  getAngularTextId,
} from './ast';
import { AngularLMDiagnostic, AngularLMInterpreterOptions } from './types';
import {
  ANGULAR_PROP_ABBREVIATIONS,
  isCustomComponentName,
  isIntrinsicTag,
  normalizeAngularInterpolation,
  resolveAngularElementTag,
} from './vocabulary';
import { evaluateSvelteExpression, extractExpressionDependencies } from '../svelte-lm/reactivity';

export class AngularLMInterpreter {
  private program: AngularProgramNode;
  private currentLoc: SourceLocation;
  private diagnostics: AngularLMDiagnostic[] = [];
  private options: AngularLMInterpreterOptions;

  // Stream state
  private buffer: string = '';
  private inString: boolean = false;
  private stringQuote: string = '';
  private inLineComment: boolean = false;
  private inBlockComment: boolean = false;
  private escapeNext: boolean = false;

  constructor(options: AngularLMInterpreterOptions = {}) {
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
      id: getAngularProgramId(),
      kind: AngularNodeKind.Program,
      components: [],
      rootComponent: options.defaultRootComponent || 'App',
      sourceLocation: { ...this.currentLoc },
    };
  }

  public static parse(source: string, options: AngularLMInterpreterOptions = {}): AngularProgramNode {
    const interpreter = new AngularLMInterpreter(options);
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
      id: getAngularProgramId(),
      kind: AngularNodeKind.Program,
      components: [],
      rootComponent: this.options.defaultRootComponent || 'App',
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

  public getAST(): AngularProgramNode {
    return this.program;
  }

  public getDiagnostics(): AngularLMDiagnostic[] {
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

  public end(): AngularProgramNode {
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

    if (char === '"' || char === "'" || char === '`') {
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
      .replace(/<ANGULAR(?:-LM)?>/gi, '')
      .replace(/<\/ANGULAR(?:-LM)?>/gi, '')
      .trim();

    if (!clean) return;

    this.parseTokens(clean);
  }

  private flushBuffer(): void {
    const clean = this.buffer
      .replace(/<ANGULAR(?:-LM)?>/gi, '')
      .replace(/<\/ANGULAR(?:-LM)?>/gi, '')
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
          this.options.defaultRootComponent || appComp?.name || parsedComponents[0].name;
      }
    } catch {
      // Streaming partial chunks may temporarily be incomplete
    }
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
        if (ch === '"' || ch === "'" || ch === '`') {
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

  private parseProgramAST(source: string): AngularComponentDeclarationNode[] {
    const components: AngularComponentDeclarationNode[] = [];
    let pos = 0;

    const skipWhitespace = () => {
      while (pos < source.length && /\s/.test(source[pos])) pos++;
    };

    while (pos < source.length) {
      skipWhitespace();
      if (pos >= source.length) break;

      // Check for component(...) or comp(...)
      const compMatch = /^(?:component|comp)\s*\(\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\)\s*\(/i.exec(
        source.slice(pos)
      );

      if (compMatch) {
        const compName = compMatch[1];
        const openParenIndex = pos + compMatch[0].length - 1;

        const bodySource = this.extractMatchingParen(source, openParenIndex);
        pos = openParenIndex + bodySource.length;

        const {
          inputs,
          outputs,
          stateDecls,
          derivedDecls,
          bodyNodes,
        } = this.parseComponentBody(bodySource.slice(1, -1), compName);

        components.push({
          id: getAngularComponentDeclarationId(compName),
          kind: AngularNodeKind.ComponentDeclaration,
          name: compName,
          inputs,
          outputs,
          stateDeclarations: stateDecls,
          derivedDeclarations: derivedDecls,
          body: bodyNodes,
          sourceLocation: { ...this.currentLoc },
        });
      } else {
        // Standalone body fallback: wrap in App component
        const standaloneBody = source.slice(pos).trim();
        if (standaloneBody) {
          const {
            inputs,
            outputs,
            stateDecls,
            derivedDecls,
            bodyNodes,
          } = this.parseComponentBody(standaloneBody, 'App');
          if (
            bodyNodes.length > 0 ||
            stateDecls.length > 0 ||
            derivedDecls.length > 0 ||
            inputs.length > 0 ||
            outputs.length > 0
          ) {
            components.push({
              id: getAngularComponentDeclarationId('App'),
              kind: AngularNodeKind.ComponentDeclaration,
              name: 'App',
              inputs,
              outputs,
              stateDeclarations: stateDecls,
              derivedDeclarations: derivedDecls,
              body: bodyNodes,
              sourceLocation: { ...this.currentLoc },
            });
          }
        }
        break;
      }
    }

    return components;
  }

  private parseComponentBody(
    bodyStr: string,
    componentName: string
  ): {
    inputs: AngularInputDeclarationNode[];
    outputs: AngularOutputDeclarationNode[];
    stateDecls: AngularStateDeclarationNode[];
    derivedDecls: AngularDerivedDeclarationNode[];
    bodyNodes: AngularUINode[];
  } {
    const inputs: AngularInputDeclarationNode[] = [];
    const outputs: AngularOutputDeclarationNode[] = [];
    const stateDecls: AngularStateDeclarationNode[] = [];
    const derivedDecls: AngularDerivedDeclarationNode[] = [];
    const bodyNodes: AngularUINode[] = [];
    let pos = 0;

    const skipWhitespace = () => {
      while (pos < bodyStr.length && /\s/.test(bodyStr[pos])) pos++;
    };

    while (pos < bodyStr.length) {
      skipWhitespace();
      if (pos >= bodyStr.length) break;

      // 1. Angular State / Signal: state(count, 0) or signal(count, 0)
      const statePrefix = /^(?:state|signal)\s*\(/i.exec(bodyStr.slice(pos));
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
            (initialRaw.startsWith("'") && initialRaw.endsWith("'")) ||
            (initialRaw.startsWith('`') && initialRaw.endsWith('`'))
          ) {
            initialVal = initialRaw.slice(1, -1);
          } else {
            try {
              initialVal = evaluateSvelteExpression(initialRaw, {});
              if (initialVal === undefined) {
                initialVal = JSON.parse(initialRaw);
              }
            } catch {
              try {
                initialVal = JSON.parse(initialRaw);
              } catch {
                initialVal = initialRaw;
              }
            }
          }

          stateDecls.push({
            id: getAngularStateDeclarationId(stateName),
            kind: AngularNodeKind.StateDeclaration,
            stateName,
            name: stateName,
            initialValue: initialVal !== undefined ? initialVal : initialRaw,
            sourceLocation: { ...this.currentLoc },
          });

          pos = openParenPos + fullBlock.length;
          continue;
        }
      }

      // 2. Computed / Derived: computed(double, count * 2) or derived(double, count * 2)
      const computedPrefix = /^(?:computed|derived)\s*\(/i.exec(bodyStr.slice(pos));
      if (computedPrefix) {
        const openParenPos = pos + computedPrefix[0].length - 1;
        const fullBlock = this.extractMatchingParen(bodyStr, openParenPos);
        const inner = fullBlock.slice(1, -1).trim();
        const commaIdx = inner.indexOf(',');
        if (commaIdx !== -1) {
          const derivedName = inner.slice(0, commaIdx).trim();
          const expr = inner.slice(commaIdx + 1).trim();
          const dependencies = extractExpressionDependencies(expr).filter((id) => id !== derivedName);

          derivedDecls.push({
            id: getAngularDerivedDeclarationId(derivedName),
            kind: AngularNodeKind.DerivedDeclaration,
            name: derivedName,
            derivedName,
            expression: expr,
            dependencies,
            sourceLocation: { ...this.currentLoc },
          });

          pos = openParenPos + fullBlock.length;
          continue;
        }
      }

      // 3. Inputs: input(username, "Guest") or in(username, "Guest")
      // Check if it's an input declaration: input(name, default?) vs HTML element input([value]:username)
      const inputPrefix = /^(?:input|in)\s*\(/i.exec(bodyStr.slice(pos));
      if (inputPrefix) {
        const openParenPos = pos + inputPrefix[0].length - 1;
        const fullBlock = this.extractMatchingParen(bodyStr, openParenPos);
        const inner = fullBlock.slice(1, -1).trim();

        const isHTMLElement =
          inner.startsWith('[') ||
          inner.startsWith('(') ||
          inner.includes('[(ngModel)]') ||
          inner.includes('[(model)]') ||
          inner.includes('type:') ||
          inner.includes('value:') ||
          inner.includes('placeholder:') ||
          inner.includes('model:');

        if (!isHTMLElement) {
          const commaIdx = inner.indexOf(',');
          let inName = inner;
          let defaultVal: any = undefined;
          if (commaIdx !== -1) {
            inName = inner.slice(0, commaIdx).trim();
            defaultVal = inner.slice(commaIdx + 1).trim();
          }

          inputs.push({
            id: getAngularInputDeclarationId(inName),
            kind: AngularNodeKind.InputDeclaration,
            name: inName,
            inputName: inName,
            defaultValue: defaultVal,
            sourceLocation: { ...this.currentLoc },
          });

          pos = openParenPos + fullBlock.length;
          continue;
        }
      }

      // 4. Outputs: output(selected) or out(selected)
      const outputPrefix = /^(?:output|out)\s*\(/i.exec(bodyStr.slice(pos));
      if (outputPrefix) {
        const openParenPos = pos + outputPrefix[0].length - 1;
        const fullBlock = this.extractMatchingParen(bodyStr, openParenPos);
        const outName = fullBlock.slice(1, -1).trim();

        outputs.push({
          id: getAngularOutputDeclarationId(outName),
          kind: AngularNodeKind.OutputDeclaration,
          name: outName,
          outputName: outName,
          sourceLocation: { ...this.currentLoc },
        });

        pos = openParenPos + fullBlock.length;
        continue;
      }

      // 5. Conditionals: @if(cond)(then)(else) or if(cond)(then)(else) or when(cond)(then)(else)
      const condPrefix = /^(?:@if|if|when)\s*\(\s*([^)]+)\)\s*\(/i.exec(bodyStr.slice(pos));
      if (condPrefix) {
        const condExpr = condPrefix[1].trim();
        const openParenIndex = pos + condPrefix[0].length - 1;
        const thenBlock = this.extractMatchingParen(bodyStr, openParenIndex);
        pos = openParenIndex + thenBlock.length;

        const thenNodes = this.parseComponentBody(
          thenBlock.slice(1, -1),
          componentName
        ).bodyNodes;
        let elseNode: AngularUINode | undefined = undefined;

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
          id: `angular-cond-${componentName}-${bodyNodes.length}`,
          kind: AngularNodeKind.Conditional,
          conditionExpr: condExpr,
          thenBranch: thenNodes[0] || {
            id: `angular-frag-${bodyNodes.length}`,
            kind: AngularNodeKind.Fragment,
            children: [],
          },
          elseBranch: elseNode,
          sourceLocation: { ...this.currentLoc },
        });
        continue;
      }

      // 6. Loops: @for(items, item, item.id)(body) or @for(item of items; track item.id)(body) or for(items, item, item.id)(body)
      const forPrefix = /^(?:@for|for)\s*\(\s*([^)]+)\)\s*\(/i.exec(bodyStr.slice(pos));
      if (forPrefix) {
        const loopSignature = forPrefix[1].trim();
        let arrayExpr = '';
        let itemVar = 'item';
        let trackExpr = 'item.id';

        if (loopSignature.includes(' of ')) {
          const match = loopSignature.match(/([a-zA-Z_$][a-zA-Z0-9_$]*)\s+of\s+([a-zA-Z_$][a-zA-Z0-9_$]*)(?:;\s*track\s+([^;]+))?/);
          if (match) {
            itemVar = match[1];
            arrayExpr = match[2];
            trackExpr = match[3]?.trim() || `${itemVar}.id`;
          }
        } else {
          const parts = loopSignature.split(',').map((p) => p.trim());
          arrayExpr = parts[0];
          if (parts.length > 1) itemVar = parts[1];
          if (parts.length > 2) trackExpr = parts[2];
          else trackExpr = `${itemVar}.id`;
        }

        const openParenIndex = pos + forPrefix[0].length - 1;
        const listBodyBlock = this.extractMatchingParen(bodyStr, openParenIndex);
        pos = openParenIndex + listBodyBlock.length;

        const itemNodes = this.parseComponentBody(
          listBodyBlock.slice(1, -1),
          componentName
        ).bodyNodes;

        bodyNodes.push({
          id: `angular-for-${componentName}-${bodyNodes.length}`,
          kind: AngularNodeKind.For,
          arrayExpr,
          itemVar,
          trackExpr,
          body: itemNodes[0] || {
            id: `angular-frag-${bodyNodes.length}`,
            kind: AngularNodeKind.Fragment,
            children: [],
          },
          sourceLocation: { ...this.currentLoc },
        });
        continue;
      }

      // 7. Content Projection: ng-content(...) or slot(...)
      const projPrefix = /^(?:ng-content|slot)\s*(?:\(\s*([^)]*)\s*\))?/i.exec(bodyStr.slice(pos));
      if (projPrefix && (projPrefix[0].includes('(') || bodyStr[pos + projPrefix[0].length] === '(')) {
        let slotName = 'default';
        let contentChildren: AngularUINode[] = [];

        if (projPrefix[1]) {
          slotName = projPrefix[1].trim() || 'default';
        }
        pos += projPrefix[0].length;
        skipWhitespace();

        if (bodyStr[pos] === '(') {
          const openParenIndex = pos;
          const contentBlock = this.extractMatchingParen(bodyStr, openParenIndex);
          pos = openParenIndex + contentBlock.length;
          contentChildren = this.parseComponentBody(
            contentBlock.slice(1, -1),
            componentName
          ).bodyNodes;
        }

        bodyNodes.push({
          id: getAngularContentProjectionId(slotName),
          kind: AngularNodeKind.ContentProjection,
          name: slotName,
          children: contentChildren,
          sourceLocation: { ...this.currentLoc },
        });
        continue;
      }

      // 8. Fragments: fragment(...) or frag(...)
      const fragPrefix = /^(?:fragment|frag)\s*\(/i.exec(bodyStr.slice(pos));
      if (fragPrefix) {
        const openParenIndex = pos + fragPrefix[0].length - 1;
        const fragBlock = this.extractMatchingParen(bodyStr, openParenIndex);
        pos = openParenIndex + fragBlock.length;

        const fragChildren = this.parseComponentBody(
          fragBlock.slice(1, -1),
          componentName
        ).bodyNodes;

        bodyNodes.push({
          id: getAngularFragmentId(),
          kind: AngularNodeKind.Fragment,
          children: fragChildren,
          sourceLocation: { ...this.currentLoc },
        });
        continue;
      }

      // 9. String Text Literal: "..." or '...' or `...`
      if (bodyStr[pos] === '"' || bodyStr[pos] === "'" || bodyStr[pos] === '`') {
        const quote = bodyStr[pos];
        let endQuote = pos + 1;
        while (
          endQuote < bodyStr.length &&
          (bodyStr[endQuote] !== quote || bodyStr[endQuote - 1] === '\\')
        ) {
          endQuote++;
        }
        const rawVal = bodyStr.slice(pos + 1, endQuote);
        const textVal = normalizeAngularInterpolation(rawVal);
        pos = endQuote + 1;

        bodyNodes.push({
          id: getAngularTextId(bodyNodes.length),
          kind: AngularNodeKind.Text,
          value: textVal,
          isExpression: textVal.includes('{'),
          sourceLocation: { ...this.currentLoc },
        });
        continue;
      }

      // 10. Intrinsic Elements & Custom Components: tag(...) or Component(...)
      const elemMatch = /^([A-Za-z0-9_@:-]+)\s*\(/i.exec(bodyStr.slice(pos));
      if (elemMatch) {
        const rawIdent = elemMatch[1];
        const openParenIndex = pos + elemMatch[0].length - 1;

        const contentBlock = this.extractMatchingParen(bodyStr, openParenIndex);
        pos = openParenIndex + contentBlock.length;

        const isCustom = isCustomComponentName(rawIdent);
        const { tag } = resolveAngularElementTag(rawIdent);
        const canonicalTag = isCustom ? rawIdent : tag;

        const {
          props,
          children,
          modelBinding,
          dynamicClassConditions,
          dynamicStyles,
        } = this.parsePropsAndChildren(contentBlock.slice(1, -1), componentName);

        if (isCustom) {
          bodyNodes.push({
            id: getAngularComponentInstanceId(rawIdent),
            kind: AngularNodeKind.ComponentInstance,
            componentName: rawIdent,
            props,
            children,
            sourceLocation: { ...this.currentLoc },
          });
        } else {
          bodyNodes.push({
            id: getAngularElementId(canonicalTag, bodyNodes.length),
            kind: AngularNodeKind.Element,
            tag: canonicalTag,
            isIntrinsic: true,
            props,
            children,
            modelBinding,
            dynamicClassConditions,
            dynamicStyles,
            sourceLocation: { ...this.currentLoc },
          });
        }
        continue;
      }

      // Skip unhandled characters
      pos++;
    }

    return {
      inputs,
      outputs,
      stateDecls,
      derivedDecls,
      bodyNodes,
    };
  }

  private parsePropsAndChildren(
    contentStr: string,
    componentName: string
  ): {
    props: AngularPropNode[];
    children: AngularUINode[];
    modelBinding?: string;
    dynamicClassConditions?: Record<string, string>;
    dynamicStyles?: Record<string, string>;
  } {
    const props: AngularPropNode[] = [];
    const children: AngularUINode[] = [];
    let modelBinding: string | undefined = undefined;
    const dynamicClassConditions: Record<string, string> = {};
    const dynamicStyles: Record<string, string> = {};

    let pos = 0;
    const skipWhitespace = () => {
      while (pos < contentStr.length && /\s/.test(contentStr[pos])) pos++;
    };

    while (pos < contentStr.length) {
      skipWhitespace();
      if (pos >= contentStr.length) break;

      // 1. Two-way binding: [(ngModel)]:username / [(ngModel)]="username" / [(model)]:username
      const modelMatch = /^\[\((?:ngModel|model)\)\][:=]\s*([A-Za-z0-9_$.]+|"[^"]*"|'[^']*')/i.exec(
        contentStr.slice(pos)
      );
      if (modelMatch) {
        const val = modelMatch[1].replace(/^["']/, '').replace(/["']$/, '').trim();
        modelBinding = val;
        props.push({
          id: getAngularPropId('model'),
          kind: AngularNodeKind.Prop,
          name: 'model',
          value: val,
          isTwoWayBinding: true,
          sourceLocation: { ...this.currentLoc },
        });
        pos += modelMatch[0].length;
        continue;
      }

      // 2. Class binding: [class.active]:isActive / [class.active]="isActive" / class.active:isActive
      const classMatch = /^\[?class\.([a-zA-Z0-9_-]+)\]?[:=]\s*([A-Za-z0-9_$.]+|"[^"]*"|'[^']*')/i.exec(
        contentStr.slice(pos)
      );
      if (classMatch) {
        const clsName = classMatch[1];
        const expr = classMatch[2].replace(/^["']/, '').replace(/["']$/, '').trim();
        dynamicClassConditions[clsName] = expr;
        props.push({
          id: getAngularPropId(`class_${clsName}`),
          kind: AngularNodeKind.Prop,
          name: `class.${clsName}`,
          value: expr,
          isClassBinding: true,
          sourceLocation: { ...this.currentLoc },
        });
        pos += classMatch[0].length;
        continue;
      }

      // 3. Style binding: [style.color]:textColor / [style.color]="textColor" / style.color:textColor
      const styleMatch = /^\[?style\.([a-zA-Z0-9_-]+)\]?[:=]\s*([A-Za-z0-9_$.]+|"[^"]*"|'[^']*')/i.exec(
        contentStr.slice(pos)
      );
      if (styleMatch) {
        const styleProp = styleMatch[1];
        const expr = styleMatch[2].replace(/^["']/, '').replace(/["']$/, '').trim();
        dynamicStyles[styleProp] = expr;
        props.push({
          id: getAngularPropId(`style_${styleProp}`),
          kind: AngularNodeKind.Prop,
          name: `style.${styleProp}`,
          value: expr,
          isStyleBinding: true,
          sourceLocation: { ...this.currentLoc },
        });
        pos += styleMatch[0].length;
        continue;
      }

      // 4. Property binding: [prop]:expr / [prop]="expr"
      const propBindMatch = /^\[([a-zA-Z0-9_-]+)\][:=]\s*([A-Za-z0-9_$.]+|"[^"]*"|'[^']*')/i.exec(
        contentStr.slice(pos)
      );
      if (propBindMatch) {
        const pName = propBindMatch[1];
        const pVal = propBindMatch[2].replace(/^["']/, '').replace(/["']$/, '').trim();
        props.push({
          id: getAngularPropId(pName),
          kind: AngularNodeKind.Prop,
          name: pName,
          value: pVal,
          isPropertyBinding: true,
          sourceLocation: { ...this.currentLoc },
        });
        pos += propBindMatch[0].length;
        continue;
      }

      // 5. Event binding: (click):handler / (click)="handler" / output:click:handler
      const evtMatch = /^(?:\(([a-zA-Z0-9_]+)\)|output:([a-zA-Z0-9_]+))[:=]\s*([A-Za-z0-9_$.]+|"[^"]*"|'[^']*')/i.exec(
        contentStr.slice(pos)
      );
      if (evtMatch) {
        const evtName = evtMatch[1] || evtMatch[2];
        const handler = evtMatch[3].replace(/^["']/, '').replace(/["']$/, '').trim();
        props.push({
          id: getAngularPropId(`evt_${evtName}`),
          kind: AngularNodeKind.Prop,
          name: `(${evtName})`,
          value: handler,
          isEvent: true,
          sourceLocation: { ...this.currentLoc },
        });
        pos += evtMatch[0].length;
        continue;
      }

      // 6. Standard colon-separated prop or event or shorthand: click:increment or id:"my-id" or title:"Hello"
      const colonMatch = /^([A-Za-z0-9_$-]+)[:=]\s*([A-Za-z0-9_$.]+|"[^"]*"|'[^']*')/i.exec(
        contentStr.slice(pos)
      );
      if (colonMatch) {
        const rawKey = colonMatch[1];
        const rawVal = colonMatch[2].replace(/^["']/, '').replace(/["']$/, '').trim();
        const normKey = ANGULAR_PROP_ABBREVIATIONS[rawKey.toLowerCase()] || rawKey;
        const isEvt = rawKey === 'click' || rawKey === 'input' || rawKey === 'change' || rawKey === 'submit';

        props.push({
          id: getAngularPropId(normKey),
          kind: AngularNodeKind.Prop,
          name: isEvt ? `(${rawKey})` : normKey,
          value: rawVal,
          isEvent: isEvt,
          sourceLocation: { ...this.currentLoc },
        });
        pos += colonMatch[0].length;
        continue;
      }

      // 7. Child UI constructs (string text literals, nested elements, @if, @for, etc.)
      const parsedSub = this.parseComponentBody(contentStr.slice(pos), componentName);
      if (parsedSub.bodyNodes.length > 0) {
        children.push(...parsedSub.bodyNodes);
        break;
      }

      pos++;
    }

    return {
      props,
      children,
      modelBinding,
      dynamicClassConditions: Object.keys(dynamicClassConditions).length > 0 ? dynamicClassConditions : undefined,
      dynamicStyles: Object.keys(dynamicStyles).length > 0 ? dynamicStyles : undefined,
    };
  }
}
