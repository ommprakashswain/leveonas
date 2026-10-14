import { ASTNode } from '../../ast/nodes';
import { HtmlWriter } from './writer';
export declare class HtmlSerializer {
    private writer;
    constructor(writer: HtmlWriter);
    serialize(node: ASTNode, indentLevel?: number): void;
}
