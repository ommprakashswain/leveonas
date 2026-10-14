import { PatchOperation } from '../patch-generator/types';
export declare class CSSPatchApplier {
    private doc;
    private styleEl;
    private rulesMap;
    private keyframesMap;
    constructor(doc?: any);
    ensureStyleElement(): any;
    apply(patches: PatchOperation[]): void;
    syncToStyleElement(): void;
    getCSS(): string;
    reset(): void;
}
