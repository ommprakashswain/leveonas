import { PatchOperation } from '../patch-generator/types';
import { CSSPatchApplier } from './css-applier';
import { JSPatchApplier } from './js-applier';
export interface DOMNodeLookup {
    getElementById(id: string): any;
}
export declare class DOMPatchApplier {
    private container?;
    private documentObj?;
    private windowObj?;
    private nodeMap;
    private cssApplier;
    private jsApplier;
    constructor(container?: any | undefined, documentObj?: any | undefined, windowObj?: any | undefined);
    setDocument(doc: any, win?: any): void;
    setContainer(container: any): void;
    getContainer(): any;
    registerNode(id: string, domNode: any): void;
    registerSubtree(node: any): void;
    unregisterSubtree(node: any): void;
    getNode(id: string): any;
    deleteNode(id: string): void;
    rebuildNodeIndex(rootElement: any): void;
    createDOMNode(payload: any): any;
    /**
     * Applies a sequence of patch operations sequentially with fail-fast atomicity.
     * If any operation fails, throws a PatchExecutorError immediately without silently swallowing.
     */
    apply(operations: PatchOperation[]): void;
    /**
     * Alias for apply(operations).
     */
    applyPatches(operations: PatchOperation[]): void;
    private applyOperation;
    getCSSApplier(): CSSPatchApplier;
    getJSApplier(): JSPatchApplier;
    cleanupJS(): void;
}
