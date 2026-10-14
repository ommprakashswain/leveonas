import { ASTNode } from '../../ast/nodes';
import { FormatterOptions } from './formatter';
export interface HtmlRendererOptions extends FormatterOptions {
}
export declare class HtmlRenderer {
    private options;
    constructor(options?: HtmlRendererOptions);
    render(ast: ASTNode): string;
}
