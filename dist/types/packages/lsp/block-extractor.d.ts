/**
 * Leveonas Block Extractor
 *
 * Identifies embedded framework blocks (<HTML>, <CSS>, <JS>, <TS>, <REACT>, <VUE>, <SVELTE>, <ANGULAR>)
 * or treats pure S-expression code as LM.
 */
import { EmbeddedBlock, EmbeddedBlockType, Position } from './types';
export declare class BlockExtractor {
    /**
     * Extract all embedded framework blocks from a document.
     */
    static extractBlocks(documentText: string): EmbeddedBlock[];
    /**
     * Find the active block containing the specified cursor position.
     */
    static getActiveBlock(documentText: string, position: Position): EmbeddedBlock;
    /**
     * Detect framework type from code keywords if tags are absent.
     */
    static detectImplicitType(code: string): EmbeddedBlockType;
    static offsetToPosition(text: string, offset: number): Position;
    static positionToOffset(text: string, pos: Position): number;
}
