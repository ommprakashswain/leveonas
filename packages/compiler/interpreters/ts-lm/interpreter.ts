import { SourceLocation } from '../../ast/types';
import {
  TSClassDeclarationNode,
  TSEnumDeclarationNode,
  TSEventHandlerNode,
  TSFunctionDeclarationNode,
  TSImportDeclarationNode,
  TSInterfaceDeclarationNode,
  TSNodeKind,
  TSProgramNode,
  TSTimerNode,
  TSTypeAliasDeclarationNode,
  TSUnitNode,
  TSVariableDeclarationNode,
  getTSEventHandlerId,
  getTSProgramId,
  getTSTimerId,
  getTSUnitId,
} from './ast';
import { lowerTSUnit } from './lowering';
import { TSLMDiagnostic, TSLMInterpreterOptions, TSUnitClassification, TSUnitKind } from './types';
import { decodeTSLM } from './vocabulary';

export class TSLMInterpreter {
  private program: TSProgramNode;
  private currentLoc: SourceLocation;
  private diagnostics: TSLMDiagnostic[] = [];
  private options: TSLMInterpreterOptions;

  // Stream state
  private buffer: string = '';
  private inLineComment: boolean = false;
  private inBlockComment: boolean = false;
  private inString: boolean = false;
  private stringQuote: string = '';
  private inTemplateLiteral: boolean = false;
  private templateBraceDepth: number = 0;
  private escapeNext: boolean = false;

  // Structural depth
  private parenDepth: number = 0;
  private braceDepth: number = 0;
  private bracketDepth: number = 0;
  private genericDepth: number = 0;

  // Units
  private currentUnitText: string = '';
  private currentUnitStartLoc: SourceLocation;

  constructor(options: TSLMInterpreterOptions = {}) {
    this.options = options;
    this.currentLoc = {
      startLine: 1,
      startColumn: 1,
      startOffset: 0,
      endLine: 1,
      endColumn: 1,
      endOffset: 0,
    };
    this.currentUnitStartLoc = { ...this.currentLoc };
    this.program = {
      id: getTSProgramId(),
      kind: TSNodeKind.Program,
      units: [],
      sourceLocation: { ...this.currentLoc },
    };
  }

  public static parse(source: string, options: TSLMInterpreterOptions = {}): TSProgramNode {
    const interpreter = new TSLMInterpreter(options);
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
    this.currentUnitStartLoc = { ...this.currentLoc };
    this.program = {
      id: getTSProgramId(),
      kind: TSNodeKind.Program,
      units: [],
      sourceLocation: { ...this.currentLoc },
    };
    this.diagnostics = [];
    this.buffer = '';
    this.currentUnitText = '';
    this.inLineComment = false;
    this.inBlockComment = false;
    this.inString = false;
    this.stringQuote = '';
    this.inTemplateLiteral = false;
    this.templateBraceDepth = 0;
    this.escapeNext = false;
    this.parenDepth = 0;
    this.braceDepth = 0;
    this.bracketDepth = 0;
    this.genericDepth = 0;
  }

  public getAST(): TSProgramNode {
    return this.program;
  }

  public getDiagnostics(): TSLMDiagnostic[] {
    return [...this.diagnostics];
  }

  public hasErrors(): boolean {
    return this.diagnostics.some((d) => d.severity === 'error');
  }

  public isSafeToExpose(): boolean {
    if (this.inLineComment || this.inBlockComment || this.inString || this.inTemplateLiteral) {
      return false;
    }
    return this.program.units.some((u) => u.isComplete);
  }

  public write(chunk: string): this {
    for (let i = 0; i < chunk.length; i++) {
      this.consumeChar(chunk[i]);
    }
    return this;
  }

  public end(): TSProgramNode {
    this.flushCurrentUnit(true);
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

    // 1. Comments
    if (this.inLineComment) {
      this.currentUnitText += char;
      if (char === '\n') {
        this.inLineComment = false;
      }
      return;
    }

    if (this.inBlockComment) {
      this.currentUnitText += char;
      if (this.currentUnitText.endsWith('*/')) {
        this.inBlockComment = false;
      }
      return;
    }

    if (!this.inString && !this.inTemplateLiteral) {
      if (char === '/' && this.currentUnitText.endsWith('/')) {
        this.inLineComment = true;
        this.currentUnitText += char;
        return;
      }
      if (char === '*' && this.currentUnitText.endsWith('/')) {
        this.inBlockComment = true;
        this.currentUnitText += char;
        return;
      }
    }

    // 2. Strings
    if (this.inString) {
      this.currentUnitText += char;
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

    if (!this.inTemplateLiteral && (char === '"' || char === "'")) {
      this.inString = true;
      this.stringQuote = char;
      this.currentUnitText += char;
      return;
    }

    // 3. Template Literals
    if (this.inTemplateLiteral) {
      this.currentUnitText += char;
      if (this.escapeNext) {
        this.escapeNext = false;
        return;
      }
      if (char === '\\') {
        this.escapeNext = true;
        return;
      }
      if (char === '`' && this.templateBraceDepth === 0) {
        this.inTemplateLiteral = false;
        return;
      }
      if (char === '{' && this.currentUnitText.endsWith('${')) {
        this.templateBraceDepth++;
        return;
      }
      if (char === '}' && this.templateBraceDepth > 0) {
        this.templateBraceDepth--;
        return;
      }
      return;
    }

    if (char === '`') {
      this.inTemplateLiteral = true;
      this.templateBraceDepth = 0;
      this.currentUnitText += char;
      return;
    }

    // 4. Bracket tracking
    if (char === '(') this.parenDepth++;
    if (char === ')') if (this.parenDepth > 0) this.parenDepth--;
    if (char === '{') this.braceDepth++;
    if (char === '}') if (this.braceDepth > 0) this.braceDepth--;
    if (char === '[') this.bracketDepth++;
    if (char === ']') if (this.bracketDepth > 0) this.bracketDepth--;

    this.currentUnitText += char;

    // 5. Unit boundary detection at top level
    if (this.parenDepth === 0 && this.braceDepth === 0 && this.bracketDepth === 0) {
      if (char === ';') {
        this.commitUnit(true);
      } else if (char === '}') {
        const trimmed = this.currentUnitText.trim();
        // Only commit on '}' for declarations that legitimately end with a block:
        // interface, function, class, enum, etc.
        // Variables (const/let/var), type aliases (type), and imports/exports (import/export) must wait for ';'
        const mustWaitForSemicolon = /^(?:export\s+)?(?:const|let|var|type|import)\b/i.test(trimmed);
        if (!mustWaitForSemicolon) {
          this.commitUnit(true);
        }
      }
    }
  }

  private commitUnit(isComplete: boolean): void {
    let raw = this.currentUnitText.trim();
    // Strip ambient boundary tags if present
    raw = raw.replace(/^<TS(?:-LM)?>/i, '').replace(/<\/TS(?:-LM)?>$/i, '').trim();

    if (!raw || raw === ';') {
      this.currentUnitText = '';
      return;
    }

    const unit = this.analyzeUnit(raw, isComplete);
    if (unit) {
      const lastIdx = this.program.units.length - 1;
      if (lastIdx >= 0 && !this.program.units[lastIdx].isComplete) {
        this.program.units[lastIdx] = unit;
      } else {
        this.program.units.push(unit);
      }
    }

    this.currentUnitText = '';
    this.currentUnitStartLoc = { ...this.currentLoc };
  }

  private flushCurrentUnit(isFinal: boolean): void {
    let raw = this.currentUnitText.trim();
    raw = raw.replace(/^<TS(?:-LM)?>/i, '').replace(/<\/TS(?:-LM)?>$/i, '').trim();
    if (!raw || raw === ';') return;

    const isComplete =
      this.parenDepth === 0 &&
      this.braceDepth === 0 &&
      this.bracketDepth === 0 &&
      !this.inString &&
      !this.inTemplateLiteral &&
      !this.inBlockComment;

    const unit = this.analyzeUnit(raw, isComplete);
    if (unit) {
      const lastIdx = this.program.units.length - 1;
      if (lastIdx >= 0 && !this.program.units[lastIdx].isComplete) {
        this.program.units[lastIdx] = unit;
      } else {
        this.program.units.push(unit);
      }
    }
    this.currentUnitText = '';
  }

  private analyzeUnit(raw: string, isComplete: boolean): TSUnitNode {
    const index = this.program.units.length;

    // 1. Expand TS-LM abbreviations
    const expanded = decodeTSLM(raw);

    // 2. Event Handlers: event("click", "#sel", ...) or on("click", "#sel", ...)
    const eventMatch = /^(?:event|on)\s*\(\s*(['"`])([a-zA-Z0-9_-]+)\1\s*,\s*(['"`])([^'"`]+)\3\s*,\s*([\s\S]+)\)$/i.exec(
      expanded.replace(/;$/, '')
    );
    if (eventMatch) {
      const eventName = eventMatch[2];
      const targetSelector = eventMatch[4];
      const handlerCode = eventMatch[5];
      const id = getTSEventHandlerId(eventName, targetSelector);

      const unit: TSUnitNode = {
        id,
        kind: TSNodeKind.Unit,
        unitKind: 'EventHandler',
        classification: 'RUNTIME',
        code: expanded,
        rawCode: raw,
        isComplete,
        meta: {
          eventName,
          targetSelector,
        },
        details: {
          id,
          kind: TSNodeKind.EventHandler,
          eventName,
          targetSelector,
          handlerCode,
          sourceLocation: { ...this.currentUnitStartLoc },
        },
        sourceLocation: { ...this.currentUnitStartLoc },
      };

      const { loweredCode } = lowerTSUnit(unit);
      unit.loweredCode = loweredCode;
      return unit;
    }

    // 3. Timers: setTimeout / setInterval or st / si
    const timerMatch = /^(?:setTimeout|setInterval|st|si)\s*\(\s*([\s\S]+?)\s*,\s*([0-9]+)\s*\)$/i.exec(
      expanded.replace(/;$/, '')
    );
    if (timerMatch) {
      const isInterval = expanded.startsWith('setInterval') || expanded.startsWith('si');
      const timerType = isInterval ? 'setInterval' : 'setTimeout';
      const callbackCode = timerMatch[1];
      const delayMs = parseInt(timerMatch[2], 10) || 0;
      const id = getTSTimerId(timerType, index);

      const unit: TSUnitNode = {
        id,
        kind: TSNodeKind.Unit,
        unitKind: 'Timer',
        classification: 'RUNTIME',
        code: expanded,
        rawCode: raw,
        isComplete,
        meta: {
          timerType,
          delayMs,
        },
        details: {
          id,
          kind: TSNodeKind.Timer,
          timerType,
          callbackCode,
          delayMs,
          sourceLocation: { ...this.currentUnitStartLoc },
        },
        sourceLocation: { ...this.currentUnitStartLoc },
      };

      const { loweredCode } = lowerTSUnit(unit);
      unit.loweredCode = loweredCode;
      return unit;
    }

    // 4. Interfaces: interface Name<T> { ... }
    const interfaceMatch = /^(?:export\s+)?interface\s+([a-zA-Z_$][a-zA-Z0-9_$]*)(?:<([^>]+)>)?(?:\s+extends\s+([^{]+))?\s*\{([\s\S]*)\}$/i.exec(
      expanded
    );
    if (interfaceMatch) {
      const interfaceName = interfaceMatch[1];
      const typeParams = interfaceMatch[2] ? interfaceMatch[2].split(',').map((p) => p.trim()) : undefined;
      const extendsList = interfaceMatch[3] ? interfaceMatch[3].split(',').map((e) => e.trim()) : undefined;
      const rawBody = interfaceMatch[4];
      const id = getTSUnitId('iface', interfaceName);

      return {
        id,
        kind: TSNodeKind.Unit,
        unitKind: 'Interface',
        classification: 'TYPE_ONLY',
        code: expanded,
        rawCode: raw,
        loweredCode: '', // Erased from runtime
        isComplete,
        meta: {
          interfaceName,
        },
        details: {
          id,
          kind: TSNodeKind.InterfaceDeclaration,
          name: interfaceName,
          typeParams,
          extends: extendsList,
          properties: [],
          methods: [],
          rawBody,
          sourceLocation: { ...this.currentUnitStartLoc },
        },
        sourceLocation: { ...this.currentUnitStartLoc },
      };
    }

    // 5. Type Aliases: type Name<T> = ...
    const typeAliasMatch = /^(?:export\s+)?type\s+([a-zA-Z_$][a-zA-Z0-9_$]*)(?:<([^>]+)>)?\s*=\s*([\s\S]+)$/i.exec(
      expanded.replace(/;$/, '')
    );
    if (typeAliasMatch) {
      const typeName = typeAliasMatch[1];
      const typeParams = typeAliasMatch[2] ? typeAliasMatch[2].split(',').map((p) => p.trim()) : undefined;
      const typeDefinition = typeAliasMatch[3].trim();
      const id = getTSUnitId('type', typeName);

      return {
        id,
        kind: TSNodeKind.Unit,
        unitKind: 'TypeAlias',
        classification: 'TYPE_ONLY',
        code: expanded,
        rawCode: raw,
        loweredCode: '', // Erased from runtime
        isComplete,
        meta: {
          typeName,
        },
        details: {
          id,
          kind: TSNodeKind.TypeAliasDeclaration,
          name: typeName,
          typeParams,
          typeDefinition,
          sourceLocation: { ...this.currentUnitStartLoc },
        },
        sourceLocation: { ...this.currentUnitStartLoc },
      };
    }

    // 6. Type-only Imports: import type { ... } from '...'
    const typeImportMatch = /^import\s+type\s+([\s\S]+?)\s+from\s+(['"`][^'"`]+['"`])$/i.exec(
      expanded.replace(/;$/, '')
    );
    if (typeImportMatch) {
      const symbols = typeImportMatch[1].replace(/[{}]/g, '').split(',').map((s) => s.trim()).filter(Boolean);
      const moduleSpecifier = typeImportMatch[2].replace(/['"`]/g, '');
      const id = getTSUnitId('imp_type', moduleSpecifier);

      return {
        id,
        kind: TSNodeKind.Unit,
        unitKind: 'Import',
        classification: 'TYPE_ONLY',
        code: expanded,
        rawCode: raw,
        loweredCode: '',
        isComplete,
        details: {
          id,
          kind: TSNodeKind.ImportDeclaration,
          isTypeOnly: true,
          importedSymbols: symbols,
          moduleSpecifier,
          isSupportedAtRuntime: true,
          sourceLocation: { ...this.currentUnitStartLoc },
        },
        sourceLocation: { ...this.currentUnitStartLoc },
      };
    }

    // 7. General Imports: import { ... } from '...'
    const importMatch = /^import\s+([\s\S]+?)\s+from\s+(['"`][^'"`]+['"`])$/i.exec(
      expanded.replace(/;$/, '')
    );
    if (importMatch) {
      const symbols = importMatch[1].replace(/[{}]/g, '').split(',').map((s) => s.trim()).filter(Boolean);
      const moduleSpecifier = importMatch[2].replace(/['"`]/g, '');
      const id = getTSUnitId('imp', moduleSpecifier);

      // Warning diagnostic for external runtime module loading in sandbox
      this.diagnostics.push({
        message: `External runtime module import from '${moduleSpecifier}' is not supported in sandbox. Use type-only import or global runtime bindings.`,
        severity: 'warning',
        code: 'TS_IMPORT_SANDBOX',
        sourceLocation: { ...this.currentUnitStartLoc },
      });

      return {
        id,
        kind: TSNodeKind.Unit,
        unitKind: 'Import',
        classification: 'RUNTIME',
        code: expanded,
        rawCode: raw,
        loweredCode: '',
        isComplete,
        details: {
          id,
          kind: TSNodeKind.ImportDeclaration,
          isTypeOnly: false,
          importedSymbols: symbols,
          moduleSpecifier,
          isSupportedAtRuntime: false,
          sourceLocation: { ...this.currentUnitStartLoc },
        },
        sourceLocation: { ...this.currentUnitStartLoc },
      };
    }

    // 8. Enums: enum Status { Idle, Loading, Done }
    const enumMatch = /^(?:export\s+)?(?:const\s+)?enum\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\{([\s\S]*)\}$/i.exec(
      expanded
    );
    if (enumMatch) {
      const enumName = enumMatch[1];
      const membersRaw = enumMatch[2];
      const id = getTSUnitId('enum', enumName);

      const members = membersRaw
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean)
        .map((m) => {
          const parts = m.split('=');
          return {
            name: parts[0].trim(),
            value: parts[1] ? parts[1].trim() : undefined,
          };
        });

      const unit: TSUnitNode = {
        id,
        kind: TSNodeKind.Unit,
        unitKind: 'Enum',
        classification: 'RUNTIME',
        code: expanded,
        rawCode: raw,
        isComplete,
        meta: {
          enumName,
        },
        details: {
          id,
          kind: TSNodeKind.EnumDeclaration,
          name: enumName,
          members,
          sourceLocation: { ...this.currentUnitStartLoc },
        },
        sourceLocation: { ...this.currentUnitStartLoc },
      };

      const { loweredCode } = lowerTSUnit(unit);
      unit.loweredCode = loweredCode;
      return unit;
    }

    // 9. Classes: class Name<T> extends Base implements Iface { ... }
    const classMatch = /^(?:export\s+)?class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)(?:<([^>]+)>)?(?:\s+extends\s+([a-zA-Z_$][a-zA-Z0-9_$]*))?(?:\s+implements\s+([^{]+))?\s*\{([\s\S]*)\}$/i.exec(
      expanded
    );
    if (classMatch) {
      const className = classMatch[1];
      const typeParams = classMatch[2] ? classMatch[2].split(',').map((p) => p.trim()) : undefined;
      const extendsClass = classMatch[3] ? classMatch[3].trim() : undefined;
      const implementsList = classMatch[4] ? classMatch[4].split(',').map((i) => i.trim()) : undefined;
      const rawBody = classMatch[5];
      const id = getTSUnitId('cls', className);

      const unit: TSUnitNode = {
        id,
        kind: TSNodeKind.Unit,
        unitKind: 'Class',
        classification: 'RUNTIME',
        code: expanded,
        rawCode: raw,
        isComplete,
        meta: {
          className,
        },
        details: {
          id,
          kind: TSNodeKind.ClassDeclaration,
          name: className,
          typeParams,
          extends: extendsClass,
          implements: implementsList,
          properties: [],
          methods: [],
          rawBody,
          sourceLocation: { ...this.currentUnitStartLoc },
        },
        sourceLocation: { ...this.currentUnitStartLoc },
      };

      const { loweredCode } = lowerTSUnit(unit);
      unit.loweredCode = loweredCode;
      return unit;
    }

    // 10. Variables: const / let / var identifier: type = initialValue
    const varMatch = /^(?:export\s+)?(const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)(?:\s*:\s*([^=]+))?(?:\s*=\s*([\s\S]+))?$/i.exec(
      expanded.replace(/;$/, '')
    );
    if (varMatch) {
      const varKind = varMatch[1].toLowerCase() as 'const' | 'let' | 'var';
      const identifier = varMatch[2];
      const typeAnnotation = varMatch[3] ? varMatch[3].trim() : undefined;
      const initialValue = varMatch[4] ? varMatch[4].trim() : undefined;
      const id = getTSUnitId('var', identifier);

      const unit: TSUnitNode = {
        id,
        kind: TSNodeKind.Unit,
        unitKind: 'Variable',
        classification: 'RUNTIME',
        code: expanded.endsWith(';') ? expanded : `${expanded};`,
        rawCode: raw,
        isComplete,
        meta: {
          identifier,
        },
        details: {
          id,
          kind: TSNodeKind.VariableDeclaration,
          varKind,
          identifier,
          typeAnnotation,
          initialValue,
          sourceLocation: { ...this.currentUnitStartLoc },
        },
        sourceLocation: { ...this.currentUnitStartLoc },
      };

      const { loweredCode } = lowerTSUnit(unit);
      unit.loweredCode = loweredCode;
      return unit;
    }

    // 11. Functions: function name<T>(params: type): returnType { body }
    const funcMatch = /^(?:export\s+)?(?:async\s+)?function(?:\s+([a-zA-Z_$][a-zA-Z0-9_$]*))?(?:<([^>]+)>)?\s*\(([^)]*)\)(?:\s*:\s*([^{]+))?\s*\{([\s\S]*)\}$/i.exec(
      expanded
    );
    if (funcMatch) {
      const funcName = funcMatch[1] || `anonymous_${index}`;
      const typeParams = funcMatch[2] ? funcMatch[2].split(',').map((p) => p.trim()) : undefined;
      const paramsRaw = funcMatch[3];
      const returnType = funcMatch[4] ? funcMatch[4].trim() : undefined;
      const body = funcMatch[5];
      const id = getTSUnitId('func', funcName);

      const params = paramsRaw
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => {
          const parts = p.split(':');
          return {
            name: parts[0].trim().replace(/\?$/, ''),
            isOptional: parts[0].trim().endsWith('?'),
            typeAnnotation: parts[1] ? parts[1].trim() : undefined,
          };
        });

      const unit: TSUnitNode = {
        id,
        kind: TSNodeKind.Unit,
        unitKind: 'Function',
        classification: 'RUNTIME',
        code: expanded,
        rawCode: raw,
        isComplete,
        meta: {
          functionName: funcName,
        },
        details: {
          id,
          kind: TSNodeKind.FunctionDeclaration,
          name: funcName,
          typeParams,
          params,
          returnType,
          body,
          sourceLocation: { ...this.currentUnitStartLoc },
        },
        sourceLocation: { ...this.currentUnitStartLoc },
      };

      const { loweredCode } = lowerTSUnit(unit);
      unit.loweredCode = loweredCode;
      return unit;
    }

    // 12. Generic Expression / Statement
    const id = getTSUnitId('stmt', expanded.slice(0, 16), index);
    const code = expanded.endsWith(';') || expanded.endsWith('}') ? expanded : `${expanded};`;

    const unit: TSUnitNode = {
      id,
      kind: TSNodeKind.Unit,
      unitKind: 'Expression',
      classification: 'RUNTIME',
      code,
      rawCode: raw,
      isComplete,
      details: {
        id,
        kind: TSNodeKind.ExpressionStatement,
        code,
        sourceLocation: { ...this.currentUnitStartLoc },
      },
      sourceLocation: { ...this.currentUnitStartLoc },
    };

    const { loweredCode } = lowerTSUnit(unit);
    unit.loweredCode = loweredCode;
    return unit;
  }
}
