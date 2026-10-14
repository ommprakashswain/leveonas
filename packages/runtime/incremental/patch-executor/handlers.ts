import { PatchOperation, PatchOperationType } from '../patch-generator/types';
import { ExecutionContext, OperationHandler } from './types';
import { PatchExecutorError } from './errors';
import { ComponentNode, LiteralNode, PropertyNode, ASTNode } from '../../../compiler/ast/nodes';
import { ASTNodeKind } from '../../../compiler/ast/types';
import { ASTFactory } from '../../../compiler/ast/factory';

export function materializeASTNode(payload: any, parent: ASTNode | null = null): ASTNode {
  if (!payload) {
    const emptyLoc = ASTFactory.createSourceLocation(0, 0, 0, 0, 0, 0);
    return ASTFactory.createLiteral('', '', emptyLoc);
  }

  // If payload is already a full AST node instance, preserve it directly
  if (payload.kind && (payload.sourceLocation !== undefined || typeof payload.clone === 'function')) {
    payload.parent = parent;
    return payload;
  }

  const emptyLoc = ASTFactory.createSourceLocation(0, 0, 0, 0, 0, 0);

  if (payload.kind === ASTNodeKind.Literal || payload.kind === 'Literal' || (payload.value !== undefined && !payload.children && !payload.properties)) {
    const val = payload.value !== undefined ? payload.value : (payload.text ?? '');
    const raw = payload.raw !== undefined ? payload.raw : String(val);
    const lit = ASTFactory.createLiteral(val, raw, payload.sourceLocation || emptyLoc);
    if (payload.id) lit.id = payload.id;
    lit.parent = parent;
    return lit;
  }

  const kind = payload.kind || ASTNodeKind.GenericComponent;
  const name = payload.name;
  const comp = ASTFactory.createComponent(kind, payload.sourceLocation || emptyLoc, [], [], name);
  if (payload.id) comp.id = payload.id;
  comp.parent = parent;

  if (payload.properties) {
    comp.properties = payload.properties.map((p: any) => {
      const pVal = typeof p.value === 'object' && p.value !== null ? p.value.value : p.value;
      const lit = ASTFactory.createLiteral(pVal, String(pVal), emptyLoc);
      const prop = ASTFactory.createProperty(p.name, lit, emptyLoc);
      prop.parent = comp as any;
      lit.parent = prop as any;
      return prop;
    });
  }

  if (payload.children) {
    comp.children = payload.children.map((c: any) => materializeASTNode(c, comp as any));
  }

  return comp as unknown as ASTNode;
}

export const handleInsertNode: OperationHandler = (op, ctx) => {
  if (!op.parentId) {
    if (op.operation === PatchOperationType.CREATE_NODE) {
      const newNode = materializeASTNode(op.payload || { id: op.nodeId }, null);
      ctx.setNode(newNode.id, newNode);
      return;
    }
    throw new PatchExecutorError('INSERT_CHILD requires parentId');
  }
  if (op.index === undefined || op.index === null) throw new PatchExecutorError('INSERT_CHILD requires index');
  
  if (ctx.isRemoved(op.parentId)) {
    throw new PatchExecutorError(`Operation targeting removed node: ${op.parentId}`);
  }

  const parent = ctx.getNode(op.parentId) as ComponentNode;
  if (!parent) throw new PatchExecutorError(`Parent node ${op.parentId} not found`);
  if (!parent.children) parent.children = [];

  if (op.index < 0 || op.index > parent.children.length) {
    throw new PatchExecutorError(`Invalid child index ${op.index} for INSERT_CHILD on parent ${op.parentId} with ${parent.children.length} children`);
  }

  const newNode = materializeASTNode(op.payload, parent as any);

  // Check duplicate node identity
  const checkNoDuplicate = (node: ASTNode) => {
    if (ctx.getNode(node.id)) {
      throw new PatchExecutorError(`Duplicate node identity: ${node.id} already exists in registry`);
    }
    if ((node as ComponentNode).children) {
      (node as ComponentNode).children.forEach(checkNoDuplicate);
    }
  };
  checkNoDuplicate(newNode);
  
  // Recursively add to context
  const addNodeToContext = (node: ASTNode) => {
    ctx.setNode(node.id, node);
    if ((node as ComponentNode).children) {
      (node as ComponentNode).children.forEach(addNodeToContext);
    }
  };
  addNodeToContext(newNode);

  parent.children.splice(op.index, 0, newNode);
};

export const handleRemoveNode: OperationHandler = (op, ctx) => {
  if (op.parentId) {
    if (ctx.isRemoved(op.parentId)) {
      throw new PatchExecutorError(`Operation targeting removed node: ${op.parentId}`);
    }

    const parent = ctx.getNode(op.parentId) as ComponentNode;
    if (!parent) throw new PatchExecutorError(`Parent node ${op.parentId} not found`);
    if (!parent.children) {
      throw new PatchExecutorError(`Parent node ${op.parentId} has no children`);
    }

    let childIndex = -1;
    if (op.nodeId) {
      childIndex = parent.children.findIndex(c => c.id === op.nodeId);
    }
    if (childIndex === -1 && op.index !== undefined && op.index >= 0 && op.index < parent.children.length) {
      childIndex = op.index;
    }

    if (childIndex === -1) {
      throw new PatchExecutorError(`Child node ${op.nodeId || op.index} not found in parent ${op.parentId}`);
    }

    const [removed] = parent.children.splice(childIndex, 1);
    
    // Recursively remove from context
    const removeNodeFromContext = (node: ASTNode) => {
      ctx.deleteNode(node.id);
      if ((node as ComponentNode).children) {
        (node as ComponentNode).children.forEach(removeNodeFromContext);
      }
    };
    removeNodeFromContext(removed);
  } else {
    if (!op.nodeId) throw new PatchExecutorError('REMOVE_NODE requires nodeId or parentId');
    if (ctx.isRemoved(op.nodeId)) {
      throw new PatchExecutorError(`Operation targeting removed node: ${op.nodeId}`);
    }

    const node = ctx.getNode(op.nodeId);
    if (!node) throw new PatchExecutorError(`Node ${op.nodeId} not found`);

    if (node.parent && (node.parent as ComponentNode).children) {
      const idx = (node.parent as ComponentNode).children.findIndex(c => c.id === node.id);
      if (idx !== -1) {
        (node.parent as ComponentNode).children.splice(idx, 1);
      }
    }

    const removeNodeFromContext = (n: ASTNode) => {
      ctx.deleteNode(n.id);
      if ((n as ComponentNode).children) {
        (n as ComponentNode).children.forEach(removeNodeFromContext);
      }
    };
    removeNodeFromContext(node);
  }
};

export const handleMoveNode: OperationHandler = (op, ctx) => {
  if (!op.nodeId) throw new PatchExecutorError('MOVE_CHILD requires nodeId');
  if (!op.parentId) throw new PatchExecutorError('MOVE_CHILD requires parentId');
  if (op.index === undefined || op.index === null) throw new PatchExecutorError('MOVE_CHILD requires index');

  if (ctx.isRemoved(op.nodeId)) {
    throw new PatchExecutorError(`Operation targeting removed node: ${op.nodeId}`);
  }
  if (ctx.isRemoved(op.parentId)) {
    throw new PatchExecutorError(`Operation targeting removed node: ${op.parentId}`);
  }
  
  const parent = ctx.getNode(op.parentId) as ComponentNode;
  if (!parent) throw new PatchExecutorError(`Parent node ${op.parentId} not found`);
  if (!parent.children) {
    throw new PatchExecutorError(`Parent node ${op.parentId} has no children`);
  }

  const childIndex = parent.children.findIndex(c => c.id === op.nodeId);
  if (childIndex === -1) {
    throw new PatchExecutorError(`Child node ${op.nodeId} not found in parent ${op.parentId}`);
  }

  // Semantics: index = destination child index AFTER removing the moving node
  // 1. Remove the moving node first
  const [moved] = parent.children.splice(childIndex, 1);

  // 2. Validate destination index against remaining children count
  if (op.index < 0 || op.index > parent.children.length) {
    // Restore node if validation fails
    parent.children.splice(childIndex, 0, moved);
    throw new PatchExecutorError(
      `Invalid target index ${op.index} for MOVE_CHILD on parent ${op.parentId} with ${parent.children.length} remaining children`
    );
  }

  // 3. Insert into the target destination index
  parent.children.splice(op.index, 0, moved);
};

export const handleReplaceNode: OperationHandler = (op, ctx) => {
  if (!op.nodeId) throw new PatchExecutorError('REPLACE_NODE requires nodeId');

  if (ctx.isRemoved(op.nodeId)) {
    throw new PatchExecutorError(`Operation targeting removed node: ${op.nodeId}`);
  }

  // Recursively remove old node from context
  const removeNodeFromContext = (node: ASTNode) => {
    ctx.deleteNode(node.id);
    if ((node as ComponentNode).children) {
      (node as ComponentNode).children.forEach(removeNodeFromContext);
    }
  };

  // Check duplicate node identity
  const checkNoDuplicate = (node: ASTNode) => {
    if (ctx.getNode(node.id)) {
      throw new PatchExecutorError(`Duplicate node identity: ${node.id} already exists in registry`);
    }
    if ((node as ComponentNode).children) {
      (node as ComponentNode).children.forEach(checkNoDuplicate);
    }
  };

  const addNodeToContext = (node: ASTNode) => {
    ctx.setNode(node.id, node);
    if ((node as ComponentNode).children) {
      (node as ComponentNode).children.forEach(addNodeToContext);
    }
  };

  // Root replacement support (when parentId is not provided or matches root)
  if (!op.parentId || op.parentId === '' || (ctx.root && ctx.root.id === op.nodeId)) {
    if (ctx.root && ctx.root.id === op.nodeId) {
      removeNodeFromContext(ctx.root);
      const newNode = materializeASTNode(op.payload, null);
      checkNoDuplicate(newNode);
      addNodeToContext(newNode);
      ctx.root = newNode;
      return;
    }
    throw new PatchExecutorError('REPLACE_NODE requires parentId');
  }

  if (ctx.isRemoved(op.parentId)) {
    throw new PatchExecutorError(`Operation targeting removed node: ${op.parentId}`);
  }
  
  const parent = ctx.getNode(op.parentId) as ComponentNode;
  if (!parent) throw new PatchExecutorError(`Parent node ${op.parentId} not found`);
  if (!parent.children) {
    throw new PatchExecutorError(`Parent node ${op.parentId} has no children`);
  }

  let childIndex = parent.children.findIndex(c => c.id === op.nodeId);
  if (childIndex === -1 && op.index !== undefined && op.index >= 0 && op.index < parent.children.length) {
    childIndex = op.index;
  }

  if (childIndex === -1) {
    throw new PatchExecutorError(`Child node ${op.nodeId} not found in parent ${op.parentId}`);
  }

  const [removed] = parent.children.splice(childIndex, 1);
  removeNodeFromContext(removed);

  const newNode = materializeASTNode(op.payload, parent as any);
  checkNoDuplicate(newNode);
  addNodeToContext(newNode);

  parent.children.splice(childIndex, 0, newNode);
};

export const handleUpdateText: OperationHandler = (op, ctx) => {
  if (!op.nodeId) throw new PatchExecutorError('UPDATE_TEXT requires nodeId');
  if (ctx.isRemoved(op.nodeId)) {
    throw new PatchExecutorError(`Operation targeting removed node: ${op.nodeId}`);
  }

  const node = ctx.getNode(op.nodeId);
  if (!node) throw new PatchExecutorError(`Node ${op.nodeId} not found`);
  
  const textVal = typeof op.payload === 'object' && op.payload !== null ? op.payload.text : (op.payload ?? '');

  if (node.kind !== ASTNodeKind.Literal) {
    throw new PatchExecutorError(`Invalid UPDATE_TEXT target: node ${op.nodeId} is a ${node.kind}, expected Literal`);
  }

  const lit = node as LiteralNode;
  lit.value = textVal;
  lit.raw = String(textVal);
};

export const handleUpdateProperty: OperationHandler = (op, ctx) => {
  if (!op.nodeId) throw new PatchExecutorError('SET_ATTRIBUTE requires nodeId');
  if (ctx.isRemoved(op.nodeId)) {
    throw new PatchExecutorError(`Operation targeting removed node: ${op.nodeId}`);
  }

  const node = ctx.getNode(op.nodeId) as ComponentNode;
  if (!node) throw new PatchExecutorError(`Node ${op.nodeId} not found`);
  if (!op.payload || op.payload.name === undefined) {
    throw new PatchExecutorError('SET_ATTRIBUTE requires payload.name');
  }
  if (!node.properties) node.properties = [];

  const prop = node.properties.find(p => p.name === op.payload.name);
  const emptyLoc = ASTFactory.createSourceLocation(0, 0, 0, 0, 0, 0);

  if (prop) {
    if (prop.value) {
      prop.value.value = op.payload.value;
      prop.value.raw = String(op.payload.value);
    } else {
      prop.value = ASTFactory.createLiteral(op.payload.value, String(op.payload.value), emptyLoc);
      prop.value.parent = prop as any;
    }
  } else {
    const newProp = ASTFactory.createProperty(op.payload.name, ASTFactory.createLiteral(op.payload.value, String(op.payload.value), emptyLoc), emptyLoc);
    newProp.parent = node as any;
    node.properties.push(newProp);
  }
};

export const handleRemoveProperty: OperationHandler = (op, ctx) => {
  if (!op.nodeId) throw new PatchExecutorError('REMOVE_ATTRIBUTE requires nodeId');
  if (ctx.isRemoved(op.nodeId)) {
    throw new PatchExecutorError(`Operation targeting removed node: ${op.nodeId}`);
  }

  const node = ctx.getNode(op.nodeId) as ComponentNode;
  if (!node) throw new PatchExecutorError(`Node ${op.nodeId} not found`);
  if (!op.payload || op.payload.name === undefined) {
    throw new PatchExecutorError('REMOVE_ATTRIBUTE requires payload.name');
  }
  if (!node.properties) return;

  node.properties = node.properties.filter(p => p.name !== op.payload.name);
};

export const handleAddProperty: OperationHandler = (op, ctx) => {
  handleUpdateProperty(op, ctx);
};

export const handleReplaceChildren: OperationHandler = (op, ctx) => {
  if (!op.nodeId) throw new PatchExecutorError('REPLACE_CHILDREN requires nodeId');
  if (ctx.isRemoved(op.nodeId)) {
    throw new PatchExecutorError(`Operation targeting removed node: ${op.nodeId}`);
  }

  const node = ctx.getNode(op.nodeId) as ComponentNode;
  if (!node) throw new PatchExecutorError(`Node ${op.nodeId} not found`);

  // Remove old children from context
  const removeNodeFromContext = (n: ASTNode) => {
    ctx.deleteNode(n.id);
    if ((n as ComponentNode).children) {
      (n as ComponentNode).children.forEach(removeNodeFromContext);
    }
  };

  if (node.children) {
    node.children.forEach(removeNodeFromContext);
  }

  const rawChildren = Array.isArray(op.payload) ? op.payload : [];
  const newChildren = rawChildren.map((c: any) => materializeASTNode(c, node as any));

  const checkNoDuplicate = (n: ASTNode) => {
    if (ctx.getNode(n.id)) {
      throw new PatchExecutorError(`Duplicate node identity: ${n.id} already exists in registry`);
    }
    if ((n as ComponentNode).children) {
      (n as ComponentNode).children.forEach(checkNoDuplicate);
    }
  };
  newChildren.forEach(checkNoDuplicate);

  const addNodeToContext = (n: ASTNode) => {
    ctx.setNode(n.id, n);
    if ((n as ComponentNode).children) {
      (n as ComponentNode).children.forEach(addNodeToContext);
    }
  };

  newChildren.forEach(addNodeToContext);
  node.children = newChildren;
};

export const handleNoOp: OperationHandler = () => {
  // Do nothing
};
