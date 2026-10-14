import { PatchOperation, PatchOperationType, SerializedNode, normalizePatchOperationType } from '../patch-generator/types';
import { validatePatches } from '../patch-generator/validator';
import { ASTNode, ComponentNode, GenericComponentNode, LiteralNode } from '../../../compiler/ast/nodes';
import { ASTNodeKind } from '../../../compiler/ast/types';
import { ElementMap } from '../../../compiler/renderers/html/element-map';
import { PatchExecutorError } from './errors';
import { CSSPatchApplier } from './css-applier';
import { JSPatchApplier } from './js-applier';
import { isAttributeSafe } from '../../../security/attributes';
import { sanitizeCssText } from '../../../security/urls';

const BOOLEAN_ATTRIBUTES = new Set([
  'disabled',
  'checked',
  'readonly',
  'required',
  'hidden',
  'selected',
  'autofocus',
  'multiple',
  'novalidate',
  'open',
  'reversed',
]);

function applyAttributeToElement(el: any, name: string, value: any): void {
  let attrName = name;
  if (attrName === 'className' || attrName === 'cm') {
    attrName = 'class';
  }

  const strVal = String(value ?? '');
  if (!isAttributeSafe(attrName, strVal)) {
    return;
  }

  const lowerName = attrName.toLowerCase();
  if (BOOLEAN_ATTRIBUTES.has(lowerName)) {
    const isTrue = value === true || strVal === 'true' || strVal === attrName;
    if (isTrue) {
      if (el.setAttribute) el.setAttribute(attrName, '');
      el[lowerName] = true;
    } else {
      if (el.removeAttribute) el.removeAttribute(attrName);
      el[lowerName] = false;
    }
    return;
  }

  if (attrName === 'class') {
    if (el.setAttribute) el.setAttribute('class', strVal);
    if ('className' in el) el.className = strVal;
    return;
  }

  if (attrName.startsWith('style.')) {
    const sProp = attrName.replace(/^style\./, '');
    const cleanVal = sanitizeCssText(strVal);
    if (el.style && typeof el.style === 'object') {
      el.style[sProp] = cleanVal;
    }
    if (el.setAttribute) {
      const existing = el.getAttribute('style') || '';
      const styleObj: Record<string, string> = {};
      existing.split(';').forEach((p: string) => {
        const i = p.indexOf(':');
        if (i !== -1) styleObj[p.slice(0, i).trim()] = p.slice(i + 1).trim();
      });
      styleObj[sProp] = cleanVal;
      el.setAttribute('style', Object.entries(styleObj).map(([k, v]) => `${k}: ${v}`).join('; '));
    }
    return;
  }

  if (attrName === 'style') {
    const cleanVal = sanitizeCssText(strVal);
    if (el.setAttribute) el.setAttribute('style', cleanVal);
    return;
  }

  if (attrName === 'value' && 'value' in el) {
    el.value = strVal;
    if (el.setAttribute) el.setAttribute('value', strVal);
    return;
  }

  if (el.setAttribute) {
    el.setAttribute(attrName, strVal);
  }
}

function removeAttributeFromElement(el: any, name: string): void {
  let attrName = name;
  if (attrName === 'className' || attrName === 'cm') {
    attrName = 'class';
  }

  const lowerName = attrName.toLowerCase();
  if (BOOLEAN_ATTRIBUTES.has(lowerName) && lowerName in el) {
    el[lowerName] = false;
  }
  if (attrName === 'class' && 'className' in el) {
    el.className = '';
  }
  if (attrName === 'value' && 'value' in el) {
    el.value = '';
  }
  if (el.removeAttribute) {
    el.removeAttribute(attrName);
  }
}

export interface DOMNodeLookup {
  getElementById(id: string): any;
}

export class DOMPatchApplier {
  private nodeMap = new Map<string, any>();
  private cssApplier: CSSPatchApplier;
  private jsApplier: JSPatchApplier;

  constructor(private container?: any, private documentObj?: any, private windowObj?: any) {
    if (!this.documentObj && typeof document !== 'undefined') {
      this.documentObj = document;
    }
    if (!this.windowObj && typeof window !== 'undefined') {
      this.windowObj = window;
    }
    this.cssApplier = new CSSPatchApplier(this.documentObj);
    this.jsApplier = new JSPatchApplier(this.documentObj, this.windowObj, undefined, this);
  }

  setDocument(doc: any, win?: any) {
    this.documentObj = doc;
    if (win) this.windowObj = win;
    this.cssApplier = new CSSPatchApplier(doc);
    this.jsApplier = new JSPatchApplier(doc, this.windowObj || (typeof window !== 'undefined' ? window : null), undefined, this);
  }

  setContainer(container: any) {
    this.container = container;
    this.rebuildNodeIndex(container);
  }

  getContainer(): any {
    return this.container;
  }

  registerNode(id: string, domNode: any) {
    this.nodeMap.set(id, domNode);
    if (domNode) {
      (domNode as any).__ast_id = id;
    }
  }

  registerSubtree(node: any) {
    if (!node) return;
    if (node.nodeType === 1) { // Element
      const astId = (node.getAttribute ? node.getAttribute('data-ast-id') : null) || (node.dataset ? node.dataset.astId : null) || node.__ast_id || (node.getAttribute ? node.getAttribute('id') : null) || node.id;
      if (astId) {
        this.nodeMap.set(astId, node);
        node.__ast_id = astId;
      }
    } else if (node.nodeType === 3 && node.__ast_id) {
      this.nodeMap.set(node.__ast_id, node);
    }
    if (node.childNodes) {
      for (let i = 0; i < node.childNodes.length; i++) {
        this.registerSubtree(node.childNodes[i]);
      }
    }
  }

  unregisterSubtree(node: any) {
    if (!node) return;
    if (node.nodeType === 1) {
      const astId = (node.getAttribute ? node.getAttribute('data-ast-id') : null) || (node.dataset ? node.dataset.astId : null) || node.__ast_id || (node.getAttribute ? node.getAttribute('id') : null) || node.id;
      if (astId) {
        this.nodeMap.delete(astId);
      }
      if (node.__ast_id) {
        this.nodeMap.delete(node.__ast_id);
      }
    } else if (node.nodeType === 3 && node.__ast_id) {
      this.nodeMap.delete(node.__ast_id);
    }
    if (node.childNodes) {
      for (let i = 0; i < node.childNodes.length; i++) {
        this.unregisterSubtree(node.childNodes[i]);
      }
    }
  }

  getNode(id: string): any {
    if (this.nodeMap.has(id)) {
      return this.nodeMap.get(id);
    }
    if (this.container) {
      if (
        id === 'leveonas-root' ||
        this.container.__ast_id === id ||
        (this.container.getAttribute && this.container.getAttribute('data-ast-id') === id) ||
        (this.container.getAttribute && this.container.getAttribute('id') === id) ||
        this.container.id === id
      ) {
        this.nodeMap.set(id, this.container);
        return this.container;
      }
    }
    if (this.container && typeof this.container.querySelector === 'function') {
      const el = this.container.querySelector(`[data-ast-id="${id}"]`);
      if (el) {
        this.nodeMap.set(id, el);
        return el;
      }
    }
    if (this.documentObj && typeof this.documentObj.getElementById === 'function') {
      const el = this.documentObj.getElementById(id);
      if (el) {
        this.nodeMap.set(id, el);
        return el;
      }
    }
    return undefined;
  }

  deleteNode(id: string) {
    const node = this.nodeMap.get(id);
    if (node) {
      this.unregisterSubtree(node);
    }
    this.nodeMap.delete(id);
  }

  rebuildNodeIndex(rootElement: any) {
    if (!rootElement) return;
    this.registerSubtree(rootElement);
  }

  createDOMNode(payload: any): any {
    const doc = this.documentObj || (typeof document !== 'undefined' ? document : null);
    if (!doc) {
      throw new Error('DOM document is not available for creating DOM nodes');
    }

    if (!payload) return doc.createTextNode('');

    // If payload is a LiteralNode or has text/value
    if (payload.kind === ASTNodeKind.Literal || (payload.kind === 'Literal') || (payload.value !== undefined && !payload.children && !payload.properties)) {
      const textVal = String(payload.value !== undefined ? payload.value : (payload.text || ''));
      const textNode = doc.createTextNode(textVal);
      if (payload.id) {
        this.nodeMap.set(payload.id, textNode);
        (textNode as any).__ast_id = payload.id;
      }
      return textNode;
    }

    // It's a component/element
    let tagName = 'div';
    if (payload.kind === ASTNodeKind.GenericComponent || payload.kind === 'GenericComponent') {
      const genName = payload.name;
      tagName = ElementMap[genName] || genName || 'div';
    } else if (payload.kind) {
      tagName = ElementMap[payload.kind] || 'div';
    } else if (payload.name) {
      tagName = ElementMap[payload.name] || payload.name;
    }

    if (tagName.toLowerCase() === 'script') {
      // Neutralize script execution in DOM patch applier
      tagName = 'template';
    }

    const element = doc.createElement(tagName);
    if (payload.id) {
      element.setAttribute('data-ast-id', payload.id);
      this.nodeMap.set(payload.id, element);
      (element as any).__ast_id = payload.id;
    }

    // Set properties/attributes safely
    const props = payload.properties || [];
    for (const prop of props) {
      const attrName = prop.name;
      const attrValue = prop.value !== undefined ? (typeof prop.value === 'object' && prop.value !== null ? prop.value.value : prop.value) : '';
      if (attrName) {
        applyAttributeToElement(element, attrName, attrValue);
      }
    }

    // Append children
    const children = payload.children || [];
    for (const child of children) {
      const childDOM = this.createDOMNode(child);
      element.appendChild(childDOM);
    }

    return element;
  }

  /**
   * Applies a sequence of patch operations sequentially with fail-fast atomicity.
   * If any operation fails, throws a PatchExecutorError immediately without silently swallowing.
   */
  apply(operations: PatchOperation[]) {
    let validOps: PatchOperation[];
    try {
      validOps = validatePatches(operations);
    } catch (e: any) {
      throw new PatchExecutorError(`Patch validation failed: ${e.message}`);
    }

    for (let i = 0; i < validOps.length; i++) {
      const op = validOps[i];
      try {
        this.applyOperation(op);
      } catch (e) {
        if (e instanceof PatchExecutorError) {
          throw e;
        }
        throw new PatchExecutorError(
          `DOM execution failed at operation [${i}] ${op.operation} on node ${op.nodeId}: ${(e as Error).message}`
        );
      }
    }
  }

  /**
   * Alias for apply(operations).
   */
  applyPatches(operations: PatchOperation[]) {
    return this.apply(operations);
  }

  private applyOperation(op: PatchOperation) {
    const operationType = normalizePatchOperationType(op.operation);

    switch (operationType) {
      case PatchOperationType.UPDATE_TEXT: {
        if (!op.nodeId) {
          throw new PatchExecutorError('UPDATE_TEXT requires nodeId');
        }
        const target = this.getNode(op.nodeId);
        if (!target) {
          throw new PatchExecutorError(`UPDATE_TEXT target node ${op.nodeId} not found`);
        }
        if (target.nodeType !== 3) {
          throw new PatchExecutorError(
            `Invalid UPDATE_TEXT target: node ${op.nodeId} is an Element (nodeType ${target.nodeType}), expected Text node (nodeType 3)`
          );
        }
        const textVal = String(op.payload?.text ?? op.payload ?? '');
        target.nodeValue = textVal;
        target.textContent = textVal;
        break;
      }

      case PatchOperationType.SET_ATTRIBUTE: {
        if (!op.nodeId) {
          throw new PatchExecutorError('SET_ATTRIBUTE requires nodeId');
        }
        const target = this.getNode(op.nodeId);
        if (!target) {
          throw new PatchExecutorError(`SET_ATTRIBUTE target node ${op.nodeId} not found`);
        }
        // Handle dynamic class boolean toggle ({ className: 'active', active: true/false })
        if (op.payload?.className !== undefined) {
          const cls = op.payload.className;
          const isActive = Boolean(op.payload.active);
          if (target.classList) {
            if (isActive) target.classList.add(cls);
            else target.classList.remove(cls);
          } else {
            const current = (target.className || target.getAttribute?.('class') || '').split(/\s+/).filter(Boolean);
            const filtered = current.filter((c: string) => c !== cls);
            if (isActive) filtered.push(cls);
            const finalCls = filtered.join(' ');
            if (target.setAttribute) target.setAttribute('class', finalCls);
            target.className = finalCls;
          }
          break;
        }
        // Handle dynamic style property ({ styleProp: 'color', value: 'red' })
        if (op.payload?.styleProp !== undefined) {
          const sProp = op.payload.styleProp;
          const sVal = String(op.payload.value ?? '');
          if (target.style && typeof target.style === 'object') {
            target.style[sProp] = sVal;
          }
          if (target.setAttribute) {
            const existingStyle = target.getAttribute('style') || '';
            const styleObj: Record<string, string> = {};
            existingStyle.split(';').forEach((pair: string) => {
              const idx = pair.indexOf(':');
              if (idx !== -1) {
                styleObj[pair.slice(0, idx).trim()] = pair.slice(idx + 1).trim();
              }
            });
            styleObj[sProp] = sVal;
            const updatedStyle = Object.entries(styleObj)
              .filter(([k, v]) => k && v)
              .map(([k, v]) => `${k}: ${v}`)
              .join('; ');
            target.setAttribute('style', updatedStyle);
          }
          break;
        }
        if (!op.payload || op.payload.name === undefined) {
          throw new PatchExecutorError(`SET_ATTRIBUTE requires payload.name for node ${op.nodeId}`);
        }
        applyAttributeToElement(target, op.payload.name, op.payload.value);
        break;
      }

      case PatchOperationType.REMOVE_ATTRIBUTE: {
        if (!op.nodeId) {
          throw new PatchExecutorError('REMOVE_ATTRIBUTE requires nodeId');
        }
        const target = this.getNode(op.nodeId);
        if (!target) {
          throw new PatchExecutorError(`REMOVE_ATTRIBUTE target node ${op.nodeId} not found`);
        }
        if (!op.payload || op.payload.name === undefined) {
          throw new PatchExecutorError(`REMOVE_ATTRIBUTE requires payload.name for node ${op.nodeId}`);
        }
        removeAttributeFromElement(target, op.payload.name);
        break;
      }

      case PatchOperationType.INSERT_CHILD: {
        const parent = op.parentId ? this.getNode(op.parentId) : this.container;
        if (!parent) {
          throw new PatchExecutorError(
            `INSERT_CHILD parent node ${op.parentId || 'container'} not found (nodeId: ${op.nodeId}, index: ${op.index})`
          );
        }

        const newDom = this.createDOMNode(op.payload || { id: op.nodeId });
        const children = parent.childNodes || [];
        const index = op.index !== undefined ? op.index : children.length;

        if (index < 0 || index > children.length) {
          throw new PatchExecutorError(
            `INSERT_CHILD invalid index ${index} for parent ${op.parentId || 'container'} with ${children.length} children (nodeId: ${op.nodeId})`
          );
        }

        if (index < children.length) {
          parent.insertBefore(newDom, children[index]);
        } else {
          parent.appendChild(newDom);
        }
        break;
      }

      case PatchOperationType.CREATE_NODE: {
        if (op.parentId) {
          const parent = this.getNode(op.parentId);
          if (!parent) {
            throw new PatchExecutorError(
              `CREATE_NODE parent node ${op.parentId} not found (nodeId: ${op.nodeId})`
            );
          }
          const newDom = this.createDOMNode(op.payload || { id: op.nodeId });
          const children = parent.childNodes || [];
          const index = op.index !== undefined ? op.index : children.length;
          if (index < children.length) {
            parent.insertBefore(newDom, children[index]);
          } else {
            parent.appendChild(newDom);
          }
        } else if (this.container) {
          const newDom = this.createDOMNode(op.payload || { id: op.nodeId });
          this.container.appendChild(newDom);
        } else {
          this.createDOMNode(op.payload || { id: op.nodeId });
        }
        break;
      }

      case PatchOperationType.REMOVE_NODE: {
        if (!op.nodeId) {
          throw new PatchExecutorError('REMOVE_NODE requires nodeId');
        }
        const target = this.getNode(op.nodeId);
        if (!target) {
          throw new PatchExecutorError(`REMOVE_NODE target node ${op.nodeId} not found`);
        }
        this.unregisterSubtree(target);
        if (target.parentNode) {
          target.parentNode.removeChild(target);
        }
        break;
      }

      case PatchOperationType.REMOVE_CHILD: {
        const target = op.nodeId ? this.getNode(op.nodeId) : undefined;
        if (target && target.parentNode) {
          this.unregisterSubtree(target);
          target.parentNode.removeChild(target);
        } else if (op.parentId) {
          const parent = this.getNode(op.parentId);
          if (!parent) {
            throw new PatchExecutorError(
              `REMOVE_CHILD target node ${op.nodeId || 'unknown'} not found and parent ${op.parentId} not found (index: ${op.index})`
            );
          }
          const children = parent.childNodes || [];
          if (op.index !== undefined && op.index >= 0 && op.index < children.length) {
            const childToRemove = children[op.index];
            this.unregisterSubtree(childToRemove);
            parent.removeChild(childToRemove);
          } else {
            throw new PatchExecutorError(
              `REMOVE_CHILD target node ${op.nodeId || 'unknown'} not found and fallback index ${op.index} invalid for parent ${op.parentId} with ${children.length} children`
            );
          }
        } else {
          throw new PatchExecutorError(
            `REMOVE_CHILD target node ${op.nodeId || 'unknown'} not found (parentId: ${op.parentId}, index: ${op.index})`
          );
        }
        break;
      }

      case PatchOperationType.MOVE_CHILD: {
        if (!op.nodeId) {
          throw new PatchExecutorError(`MOVE_CHILD requires nodeId (parentId: ${op.parentId}, index: ${op.index})`);
        }
        const target = this.getNode(op.nodeId);
        if (!target) {
          throw new PatchExecutorError(`MOVE_CHILD target node ${op.nodeId} not found (parentId: ${op.parentId}, index: ${op.index})`);
        }
        const parent = op.parentId ? this.getNode(op.parentId) : target.parentNode;
        if (!parent) {
          throw new PatchExecutorError(`MOVE_CHILD parent node ${op.parentId || 'unknown'} not found for target ${op.nodeId} (index: ${op.index})`);
        }
        if (op.index === undefined || op.index === null) {
          throw new PatchExecutorError(`MOVE_CHILD requires index for target ${op.nodeId} in parent ${op.parentId || 'unknown'}`);
        }

        // Semantics: index = destination child index AFTER removing the moving node
        if (target.parentNode) {
          target.parentNode.removeChild(target);
        }

        const children = parent.childNodes || [];
        if (op.index < 0 || op.index > children.length) {
          throw new PatchExecutorError(
            `MOVE_CHILD invalid index ${op.index} for target ${op.nodeId} in parent ${op.parentId || 'unknown'} with ${children.length} remaining children`
          );
        }

        if (op.index < children.length) {
          parent.insertBefore(target, children[op.index]);
        } else {
          parent.appendChild(target);
        }
        break;
      }

      case PatchOperationType.REPLACE_NODE: {
        if (!op.nodeId) {
          throw new PatchExecutorError('REPLACE_NODE requires nodeId');
        }
        const target = this.getNode(op.nodeId);
        if (!target) {
          throw new PatchExecutorError(`REPLACE_NODE target node ${op.nodeId} not found`);
        }
        if (target.parentNode) {
          const newDom = this.createDOMNode(op.payload);
          this.unregisterSubtree(target);
          target.parentNode.replaceChild(newDom, target);
        } else if (target === this.container) {
          this.unregisterSubtree(target);
          const newDom = this.createDOMNode(op.payload);
          this.container = newDom;
        } else {
          throw new PatchExecutorError(`REPLACE_NODE target node ${op.nodeId} has no parent`);
        }
        break;
      }

      case PatchOperationType.REPLACE_CHILDREN: {
        const target = op.nodeId ? this.getNode(op.nodeId) : this.container;
        if (!target) {
          throw new PatchExecutorError(`REPLACE_CHILDREN target node ${op.nodeId || 'container'} not found`);
        }

        if (target.childNodes) {
          for (let i = 0; i < target.childNodes.length; i++) {
            this.unregisterSubtree(target.childNodes[i]);
          }
        }

        const newChildren = (op.payload || []).map((c: any) => this.createDOMNode(c));
        if (typeof target.replaceChildren === 'function') {
          target.replaceChildren(...newChildren);
        } else {
          while (target.firstChild) {
            target.removeChild(target.firstChild);
          }
          for (const child of newChildren) {
            target.appendChild(child);
          }
        }
        break;
      }

      case PatchOperationType.NO_OP:
        break;

      case PatchOperationType.SET_CSS_STYLESHEET:
      case PatchOperationType.CREATE_CSS_RULE:
      case PatchOperationType.REMOVE_CSS_RULE:
      case PatchOperationType.UPDATE_CSS_RULE:
      case PatchOperationType.ADD_CSS_DECLARATION:
      case PatchOperationType.UPDATE_CSS_DECLARATION:
      case PatchOperationType.REMOVE_CSS_DECLARATION:
      case PatchOperationType.UPDATE_CSS_SELECTOR:
      case PatchOperationType.ADD_CSS_KEYFRAME:
      case PatchOperationType.REMOVE_CSS_KEYFRAME:
      case PatchOperationType.UPDATE_CSS_KEYFRAME:
        this.cssApplier.apply([op]);
        break;

      case PatchOperationType.CREATE_JS_UNIT:
      case PatchOperationType.UPDATE_JS_UNIT:
      case PatchOperationType.REMOVE_JS_UNIT:
      case PatchOperationType.ATTACH_EVENT_HANDLER:
      case PatchOperationType.UPDATE_EVENT_HANDLER:
      case PatchOperationType.REMOVE_EVENT_HANDLER:
      case PatchOperationType.EXECUTE_JS_UNIT:
      case PatchOperationType.CLEANUP_JS_SESSION:
        this.jsApplier.apply([op]);
        break;

      default:
        throw new PatchExecutorError(`Unsupported or invalid patch operation: ${op.operation}`);
    }
  }

  public getCSSApplier(): CSSPatchApplier {
    return this.cssApplier;
  }

  public getJSApplier(): JSPatchApplier {
    return this.jsApplier;
  }

  public cleanupJS(): void {
    this.jsApplier.cleanup();
  }
}
