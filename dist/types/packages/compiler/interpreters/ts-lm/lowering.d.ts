import { JSProgramNode, JSUnitNode } from '../js-lm/ast';
import { TSProgramNode, TSUnitNode } from './ast';
import { TSUnitClassification } from './types';
/**
 * Transpiles a raw TypeScript snippet to clean, deterministic JavaScript.
 * Uses official TypeScript compiler transpileModule if available.
 */
export declare function lowerTSToJS(tsCode: string): string;
/**
 * Lowers a TSUnitNode to its runtime JavaScript code and classification.
 */
export declare function lowerTSUnit(unit: TSUnitNode): {
    loweredCode: string;
    isTypeOnly: boolean;
    classification: TSUnitClassification;
};
/**
 * Converts a TSUnitNode to an equivalent JSUnitNode for the existing Leveonas JS runtime and patch protocol.
 * Returns null for TYPE_ONLY units (interfaces, type aliases, type-only imports) so no execution patch is emitted.
 */
export declare function convertTSToJSUnit(tsUnit: TSUnitNode, index: number): JSUnitNode | null;
/**
 * Converts a TSProgramNode to an equivalent JSProgramNode containing only lowered runtime units.
 */
export declare function convertTSProgramToJSProgram(tsProgram: TSProgramNode): JSProgramNode;
