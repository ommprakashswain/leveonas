import { ASTNodeKind } from '../../../compiler/ast/types';
export declare enum PatchOperationType {
    CREATE_NODE = "CREATE_NODE",
    REMOVE_NODE = "REMOVE_NODE",
    REPLACE_NODE = "REPLACE_NODE",
    UPDATE_TEXT = "UPDATE_TEXT",
    SET_ATTRIBUTE = "SET_ATTRIBUTE",
    REMOVE_ATTRIBUTE = "REMOVE_ATTRIBUTE",
    INSERT_CHILD = "INSERT_CHILD",
    REMOVE_CHILD = "REMOVE_CHILD",
    /**
     * Moves an existing child node within a parent.
     * SEMANTICS: `index` is the destination child index AFTER removing the moving node.
     * Execution:
     *   1. Remove moving node from parent's children (leaving remaining siblings)
     *   2. Insert moving node at `index` (0 <= index <= remainingSiblings.length)
     */
    MOVE_CHILD = "MOVE_CHILD",
    REPLACE_CHILDREN = "REPLACE_CHILDREN",
    NO_OP = "NO_OP",
    SET_CSS_STYLESHEET = "SET_CSS_STYLESHEET",
    CREATE_CSS_RULE = "CREATE_CSS_RULE",
    REMOVE_CSS_RULE = "REMOVE_CSS_RULE",
    UPDATE_CSS_RULE = "UPDATE_CSS_RULE",
    ADD_CSS_DECLARATION = "ADD_CSS_DECLARATION",
    UPDATE_CSS_DECLARATION = "UPDATE_CSS_DECLARATION",
    REMOVE_CSS_DECLARATION = "REMOVE_CSS_DECLARATION",
    UPDATE_CSS_SELECTOR = "UPDATE_CSS_SELECTOR",
    ADD_CSS_KEYFRAME = "ADD_CSS_KEYFRAME",
    REMOVE_CSS_KEYFRAME = "REMOVE_CSS_KEYFRAME",
    UPDATE_CSS_KEYFRAME = "UPDATE_CSS_KEYFRAME",
    CREATE_JS_UNIT = "CREATE_JS_UNIT",
    UPDATE_JS_UNIT = "UPDATE_JS_UNIT",
    REMOVE_JS_UNIT = "REMOVE_JS_UNIT",
    ATTACH_EVENT_HANDLER = "ATTACH_EVENT_HANDLER",
    UPDATE_EVENT_HANDLER = "UPDATE_EVENT_HANDLER",
    REMOVE_EVENT_HANDLER = "REMOVE_EVENT_HANDLER",
    EXECUTE_JS_UNIT = "EXECUTE_JS_UNIT",
    CLEANUP_JS_SESSION = "CLEANUP_JS_SESSION"
}
/**
 * Backward-compatibility mapping from legacy operation names to canonical PatchOperationType.
 */
export declare const LegacyPatchOperationAliases: Record<string, PatchOperationType>;
/**
 * Normalizes an operation string or type into its canonical PatchOperationType.
 */
export declare function normalizePatchOperationType(op: string | PatchOperationType): PatchOperationType;
export interface SerializedProperty {
    name: string;
    value: string | number | boolean;
}
export interface SerializedNode {
    id: string;
    kind: ASTNodeKind | string;
    name?: string;
    value?: string | number | boolean;
    text?: string;
    raw?: string;
    properties?: SerializedProperty[];
    children?: SerializedNode[];
}
export interface PatchOperation {
    operation: PatchOperationType;
    nodeId: string;
    parentId?: string;
    index?: number;
    payload?: any;
    timestamp?: number;
}
