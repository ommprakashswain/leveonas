import { ASTNodeKind, SourceLocation } from './types';
import { RootNode } from './nodes';
export declare class ASTBuilder {
    private current;
    private root;
    private stack;
    constructor();
    getRoot(): RootNode;
    enterComponent(kind: ASTNodeKind, loc?: SourceLocation, name?: string): this;
    exitComponent(): this;
    addProperty(name: string, value: string | number | boolean | null, raw?: string, loc?: SourceLocation): this;
    private emptyLoc;
}
