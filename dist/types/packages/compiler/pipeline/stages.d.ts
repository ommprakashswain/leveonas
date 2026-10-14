import { PipelineContext } from './context';
import { Token } from '../tokenizer/types';
import { LexicalToken } from '../lexer';
import { ComponentNode as ParserComponentNode } from '../parser/nodes';
import { RootNode } from '../ast/nodes';
export declare function adaptParserTreeToAST(parserNodes: ParserComponentNode[]): RootNode;
export declare class PipelineStages {
    private context;
    constructor(context: PipelineContext);
    runTokenizer(source: string): Token[];
    runLexer(tokens: Token[]): LexicalToken[];
    runParser(tokens: LexicalToken[]): RootNode;
    runValidator(ast: RootNode): void;
    runRenderer(ast: RootNode, minify?: boolean): string;
    runPatchGenerator(oldAst: RootNode, newAst: RootNode): import("../../runtime/incremental/patch-generator").PatchOperation[];
}
