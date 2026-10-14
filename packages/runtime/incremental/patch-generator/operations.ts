import { PatchOperation, PatchOperationType } from './types';

export function createOperation(
  operation: PatchOperationType,
  nodeId: string,
  parentId?: string,
  index?: number,
  payload?: any,
  timestamp?: number
): PatchOperation {
  const op: PatchOperation = {
    operation,
    nodeId,
  };
  if (parentId !== undefined) op.parentId = parentId;
  if (index !== undefined) op.index = index;
  if (payload !== undefined) op.payload = payload;
  if (timestamp !== undefined) op.timestamp = timestamp;
  return op;
}

export function attachTransportTimestamp(op: PatchOperation, timestamp: number = Date.now()): PatchOperation {
  return {
    ...op,
    timestamp,
  };
}

export function createNode(nodeId: string, parentId?: string, index?: number, payload?: any): PatchOperation {
  return createOperation(PatchOperationType.CREATE_NODE, nodeId, parentId, index, payload);
}

export function insertChild(nodeId: string, parentId: string, index: number, payload: any): PatchOperation {
  return createOperation(PatchOperationType.INSERT_CHILD, nodeId, parentId, index, payload);
}

export function insertNode(nodeId: string, parentId: string, index: number, payload: any): PatchOperation {
  return insertChild(nodeId, parentId, index, payload);
}

export function removeChild(nodeId: string, parentId?: string, index?: number): PatchOperation {
  return createOperation(PatchOperationType.REMOVE_CHILD, nodeId, parentId, index);
}

export function removeNode(nodeId: string, parentId?: string, index?: number): PatchOperation {
  return createOperation(PatchOperationType.REMOVE_NODE, nodeId, parentId, index);
}

export function moveChild(nodeId: string, parentId: string, newIndex: number, oldIndex?: number): PatchOperation {
  return createOperation(PatchOperationType.MOVE_CHILD, nodeId, parentId, newIndex, oldIndex !== undefined ? { oldIndex } : undefined);
}

export function moveNode(nodeId: string, parentId: string, newIndex: number, oldIndex?: number): PatchOperation {
  return moveChild(nodeId, parentId, newIndex, oldIndex);
}

export function replaceNode(nodeId: string, parentId: string, index: number, payload: any): PatchOperation {
  return createOperation(PatchOperationType.REPLACE_NODE, nodeId, parentId, index, payload);
}

export function updateText(nodeId: string, text: string): PatchOperation {
  return createOperation(PatchOperationType.UPDATE_TEXT, nodeId, undefined, undefined, { text });
}

export function setAttribute(nodeId: string, name: string, value: any): PatchOperation {
  return createOperation(PatchOperationType.SET_ATTRIBUTE, nodeId, undefined, undefined, { name, value });
}

export function removeAttribute(nodeId: string, name: string): PatchOperation {
  return createOperation(PatchOperationType.REMOVE_ATTRIBUTE, nodeId, undefined, undefined, { name });
}

export function updateProperty(nodeId: string, name: string, value: any): PatchOperation {
  return setAttribute(nodeId, name, value);
}

export function removeProperty(nodeId: string, name: string): PatchOperation {
  return removeAttribute(nodeId, name);
}

export function addProperty(nodeId: string, name: string, value: any): PatchOperation {
  return setAttribute(nodeId, name, value);
}

export function replaceChildren(nodeId: string, payload: any): PatchOperation {
  return createOperation(PatchOperationType.REPLACE_CHILDREN, nodeId, undefined, undefined, payload);
}

export function noOp(nodeId: string): PatchOperation {
  return createOperation(PatchOperationType.NO_OP, nodeId);
}

// CSS Patch Operation Creators
export function setCSSStyleSheet(nodeId: string, cssText: string): PatchOperation {
  return createOperation(PatchOperationType.SET_CSS_STYLESHEET, nodeId, undefined, undefined, { cssText });
}

export function createCSSRule(
  nodeId: string,
  selector: string,
  declarations: Array<{ property: string; value: string; important?: boolean }> = [],
  mediaQuery?: string,
  index?: number
): PatchOperation {
  return createOperation(PatchOperationType.CREATE_CSS_RULE, nodeId, undefined, index, {
    selector,
    declarations,
    mediaQuery,
  });
}

export function removeCSSRule(nodeId: string, selector?: string): PatchOperation {
  return createOperation(PatchOperationType.REMOVE_CSS_RULE, nodeId, undefined, undefined, { selector });
}

export function updateCSSRule(
  nodeId: string,
  selector: string,
  declarations: Array<{ property: string; value: string; important?: boolean }>,
  mediaQuery?: string
): PatchOperation {
  return createOperation(PatchOperationType.UPDATE_CSS_RULE, nodeId, undefined, undefined, {
    selector,
    declarations,
    mediaQuery,
  });
}

export function addCSSDeclaration(
  nodeId: string,
  property: string,
  value: string,
  important: boolean = false
): PatchOperation {
  return createOperation(PatchOperationType.ADD_CSS_DECLARATION, nodeId, undefined, undefined, {
    property,
    value,
    important,
  });
}

export function updateCSSDeclaration(
  nodeId: string,
  property: string,
  value: string,
  important: boolean = false
): PatchOperation {
  return createOperation(PatchOperationType.UPDATE_CSS_DECLARATION, nodeId, undefined, undefined, {
    property,
    value,
    important,
  });
}

export function removeCSSDeclaration(nodeId: string, property: string): PatchOperation {
  return createOperation(PatchOperationType.REMOVE_CSS_DECLARATION, nodeId, undefined, undefined, {
    property,
  });
}

export function updateCSSSelector(nodeId: string, oldSelector: string, newSelector: string): PatchOperation {
  return createOperation(PatchOperationType.UPDATE_CSS_SELECTOR, nodeId, undefined, undefined, {
    oldSelector,
    newSelector,
  });
}

export function addCSSKeyframe(
  nodeId: string,
  keyframesName: string,
  keyframeSelector: string,
  declarations: Array<{ property: string; value: string; important?: boolean }>
): PatchOperation {
  return createOperation(PatchOperationType.ADD_CSS_KEYFRAME, nodeId, undefined, undefined, {
    keyframesName,
    keyframeSelector,
    declarations,
  });
}

export function removeCSSKeyframe(
  nodeId: string,
  keyframesName: string,
  keyframeSelector: string
): PatchOperation {
  return createOperation(PatchOperationType.REMOVE_CSS_KEYFRAME, nodeId, undefined, undefined, {
    keyframesName,
    keyframeSelector,
  });
}

export function updateCSSKeyframe(
  nodeId: string,
  keyframesName: string,
  keyframeSelector: string,
  declarations: Array<{ property: string; value: string; important?: boolean }>
): PatchOperation {
  return createOperation(PatchOperationType.UPDATE_CSS_KEYFRAME, nodeId, undefined, undefined, {
    keyframesName,
    keyframeSelector,
    declarations,
  });
}

// JS Operation Helpers

export function createJSUnit(
  nodeId: string,
  unitKind: string,
  code: string,
  meta?: any,
  index?: number
): PatchOperation {
  return createOperation(PatchOperationType.CREATE_JS_UNIT, nodeId, undefined, index, {
    unitKind,
    code,
    meta,
  });
}

export function updateJSUnit(
  nodeId: string,
  unitKind: string,
  code: string,
  meta?: any
): PatchOperation {
  return createOperation(PatchOperationType.UPDATE_JS_UNIT, nodeId, undefined, undefined, {
    unitKind,
    code,
    meta,
  });
}

export function removeJSUnit(nodeId: string): PatchOperation {
  return createOperation(PatchOperationType.REMOVE_JS_UNIT, nodeId);
}

export function attachEventHandler(
  nodeId: string,
  eventName: string,
  targetSelector: string,
  handlerCode: string,
  index?: number
): PatchOperation {
  return createOperation(PatchOperationType.ATTACH_EVENT_HANDLER, nodeId, undefined, index, {
    eventName,
    targetSelector,
    handlerCode,
  });
}

export function updateEventHandler(
  nodeId: string,
  eventName: string,
  targetSelector: string,
  handlerCode: string
): PatchOperation {
  return createOperation(PatchOperationType.UPDATE_EVENT_HANDLER, nodeId, undefined, undefined, {
    eventName,
    targetSelector,
    handlerCode,
  });
}

export function removeEventHandler(
  nodeId: string,
  eventName: string,
  targetSelector: string
): PatchOperation {
  return createOperation(PatchOperationType.REMOVE_EVENT_HANDLER, nodeId, undefined, undefined, {
    eventName,
    targetSelector,
  });
}

export function executeJSUnit(nodeId: string, code: string): PatchOperation {
  return createOperation(PatchOperationType.EXECUTE_JS_UNIT, nodeId, undefined, undefined, {
    code,
  });
}

export function cleanupJSSession(): PatchOperation {
  return createOperation(PatchOperationType.CLEANUP_JS_SESSION, 'js-session');
}



