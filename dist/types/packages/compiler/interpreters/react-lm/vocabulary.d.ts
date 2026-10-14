/**
 * Canonical React-LM Vocabulary, Keyword, Element, and Prop Mappings
 *
 * Implements token-efficient React/JSX representations while maintaining
 * deterministic reconciliation and lowering to Leveonas DOM & JS infrastructure.
 */
import { ASTNodeKind } from '../../ast/types';
export declare const REACT_ELEMENT_ABBREVIATIONS: Record<string, string>;
export declare const REACT_PROP_ABBREVIATIONS: Record<string, string>;
export declare const KNOWN_REACT_EVENTS: Set<string>;
export declare const TAG_TO_AST_KIND: Record<string, ASTNodeKind>;
export declare function resolveReactElementTag(identifier: string): string;
export declare function isIntrinsicTag(name: string): boolean;
export declare function isCustomComponentName(name: string): boolean;
export declare function resolveReactPropName(propName: string): string;
export declare function isReactEventProp(propName: string): boolean;
export declare function getDOMEventNameFromReactEvent(reactEventName: string): string;
