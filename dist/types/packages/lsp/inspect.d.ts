/**
 * Leveonas AST, Common UI IR, Reactivity & Patch Inspector Engine
 *
 * Provides complete multi-stage inspection:
 * Raw LM -> Parsed AST -> Framework AST -> Common UI IR -> Runtime IR -> DOM AST -> Patch Operations
 */
import { DocumentInspection } from './types';
export declare function safeStringify(obj: any, space?: number): string;
export declare function sanitizeForInspection<T>(obj: T): T;
export declare class LeveonasInspector {
    /**
     * Run full inspection across all compiler layers.
     */
    static inspect(documentText: string): DocumentInspection;
}
