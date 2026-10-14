import { CSSStyleSheetNode } from '../../../compiler/interpreters/css-lm/ast';
import { Patch } from './patch';
import { PatchOperation } from './types';
export declare class CSSDiffEngine {
    private patch;
    constructor(patch: Patch);
    diff(oldSheet: CSSStyleSheetNode | null, newSheet: CSSStyleSheetNode): void;
    private emitInitialRule;
    private diffCSSRule;
    private diffCSSKeyframes;
    private diffCSSMedia;
}
export declare function diffCSSStyleSheets(oldSheet: CSSStyleSheetNode | null, newSheet: CSSStyleSheetNode): PatchOperation[];
