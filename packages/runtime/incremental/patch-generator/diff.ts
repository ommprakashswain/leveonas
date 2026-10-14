import { ASTNode, ComponentNode, PropertyNode, LiteralNode, GenericComponentNode } from '../../../compiler/ast/nodes';
import { ASTNodeKind } from '../../../compiler/ast/types';
import { Patch } from './patch';
import {
  createNode, insertChild, removeChild, moveChild, replaceNode,
  updateText, setAttribute, removeAttribute, replaceChildren
} from './operations';
import { SerializedNode, SerializedProperty, PatchOperationType } from './types';

export function serializeASTNode(node: ASTNode): SerializedNode {
  if (node.kind === ASTNodeKind.Literal) {
    const lit = node as LiteralNode;
    return {
      id: lit.id,
      kind: lit.kind,
      value: lit.value,
      raw: lit.raw,
      text: String(lit.value),
    };
  }
  const comp = node as ComponentNode;
  const props: SerializedProperty[] = (comp.properties || []).map(p => ({
    name: p.name,
    value: p.value?.value ?? true,
  }));
  const children: SerializedNode[] = (comp.children || []).map(c => serializeASTNode(c));
  return {
    id: comp.id,
    kind: comp.kind,
    name: (comp as GenericComponentNode).name,
    properties: props,
    children,
  };
}

function getNodeKey(node: ASTNode): string | null {
  if (node.kind !== ASTNodeKind.Literal && node.kind !== ASTNodeKind.Property) {
    const comp = node as ComponentNode;
    const keyProp = (comp.properties || []).find(p => p.name === 'key' || p.name === 'id');
    if (keyProp && keyProp.value) {
      return String(keyProp.value.value);
    }
  }
  return null;
}

function getNodeText(node: ASTNode): string | null {
  if (node.kind === ASTNodeKind.Literal) {
    return String((node as LiteralNode).value);
  }
  if ((node as ComponentNode).children && (node as ComponentNode).children.length > 0) {
    const firstChild = (node as ComponentNode).children[0];
    if (firstChild.kind === ASTNodeKind.Literal) {
      return String((firstChild as LiteralNode).value);
    }
  }
  return null;
}

function areNodesCompatible(oldNode: ASTNode, newNode: ASTNode): boolean {
  if (oldNode.kind !== newNode.kind) return false;
  const oldKey = getNodeKey(oldNode);
  const newKey = getNodeKey(newNode);
  if (oldKey && newKey && oldKey !== newKey) return false;
  if (oldNode.kind === ASTNodeKind.GenericComponent && newNode.kind === ASTNodeKind.GenericComponent) {
    return (oldNode as GenericComponentNode).name === (newNode as GenericComponentNode).name;
  }
  if (oldNode.kind === ASTNodeKind.Literal && newNode.kind === ASTNodeKind.Literal) {
    return true;
  }
  return true;
}

function getLongestIncreasingSubsequence(arr: number[]): number[] {
  if (arr.length === 0) return [];
  const p = arr.slice();
  const result: number[] = [0];
  let i: number, j: number, u: number, v: number, c: number;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== -1) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = (u + v) >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p[v];
  }
  return result;
}

export class DiffEngine {
  private newToOldIdMap = new Map<string, string>();
  private oldToNewIdMap = new Map<string, string>();

  constructor(private patch: Patch) {}

  /**
   * Resolves the live ID (the ID known to the live DOM / existing AST) for a given node or node ID.
   * - Matched existing node → Old/Live node ID
   * - Genuinely new node → New node ID
   */
  public resolveLiveId(nodeOrId: ASTNode | string): string {
    const id = typeof nodeOrId === 'string' ? nodeOrId : nodeOrId.id;
    return this.newToOldIdMap.get(id) ?? id;
  }

  /**
   * Centralized ID resolution helper:
   * Matched existing node → Old ID
   * New node → New ID
   */
  public getPatchTargetId(oldNode?: ASTNode | null, newNode?: ASTNode | null): string {
    if (oldNode) return oldNode.id;
    if (newNode) return this.resolveLiveId(newNode);
    return '';
  }

  diff(oldNode: ASTNode, newNode: ASTNode, indexInParent: number = 0, liveParentId?: string) {
    // If nodes are not compatible, replace
    if (!areNodesCompatible(oldNode, newNode)) {
      const parentId = liveParentId ?? (oldNode.parent ? this.resolveLiveId(oldNode.parent) : '');
      this.patch.add(replaceNode(oldNode.id, parentId, indexInParent, serializeASTNode(newNode)));
      return;
    }

    // Maintain non-mutating identity mapping
    this.newToOldIdMap.set(newNode.id, oldNode.id);
    this.oldToNewIdMap.set(oldNode.id, newNode.id);

    if (oldNode.kind === ASTNodeKind.Literal && newNode.kind === ASTNodeKind.Literal) {
      const oldLit = oldNode as LiteralNode;
      const newLit = newNode as LiteralNode;
      if (oldLit.value !== newLit.value) {
        this.patch.add(updateText(oldLit.id, String(newLit.value)));
      }
      return;
    }

    if (oldNode.kind !== ASTNodeKind.Property && oldNode.kind !== ASTNodeKind.Literal) {
      const oldComp = oldNode as ComponentNode;
      const newComp = newNode as ComponentNode;

      this.diffProperties(oldComp, newComp);
      this.diffChildren(oldComp, newComp);
    }
  }

  private diffProperties(oldComp: ComponentNode, newComp: ComponentNode) {
    const targetId = oldComp.id;
    const oldProps = new Map((oldComp.properties || []).map(p => [p.name, p]));
    const newProps = new Map((newComp.properties || []).map(p => [p.name, p]));

    const allOldNames = Array.from(oldProps.keys()).sort();
    const allNewNames = Array.from(newProps.keys()).sort();

    // REMOVE_ATTRIBUTE operations first
    for (const name of allOldNames) {
      if (!newProps.has(name)) {
        this.patch.add(removeAttribute(targetId, name));
      }
    }

    // SET_ATTRIBUTE operations next
    for (const name of allNewNames) {
      const oldProp = oldProps.get(name);
      const newProp = newProps.get(name)!;
      const newValue = newProp.value?.value ?? true;
      if (!oldProp) {
        this.patch.add(setAttribute(targetId, name, newValue));
      } else {
        const oldValue = oldProp.value?.value ?? true;
        if (oldValue !== newValue) {
          this.patch.add(setAttribute(targetId, name, newValue));
        }
      }
    }
  }

  private diffChildren(oldComp: ComponentNode, newComp: ComponentNode) {
    const liveParentId = oldComp.id;
    const oldChildren = oldComp.children || [];
    const newChildren = newComp.children || [];

    if (oldChildren.length === 0 && newChildren.length === 0) {
      return;
    }

    // Fast path: text child update on single literal child
    if (oldChildren.length === 1 && newChildren.length === 1 &&
        oldChildren[0].kind === ASTNodeKind.Literal && newChildren[0].kind === ASTNodeKind.Literal) {
      const oldLit = oldChildren[0] as LiteralNode;
      const newLit = newChildren[0] as LiteralNode;
      this.newToOldIdMap.set(newLit.id, oldLit.id);
      this.oldToNewIdMap.set(oldLit.id, newLit.id);
      if (oldLit.value !== newLit.value) {
        this.patch.add(updateText(oldLit.id, String(newLit.value)));
      }
      return;
    }

    // Fast path: single child replacement
    if (oldChildren.length === 1 && newChildren.length === 1 && !areNodesCompatible(oldChildren[0], newChildren[0])) {
      this.patch.add(replaceNode(oldChildren[0].id, liveParentId, 0, serializeASTNode(newChildren[0])));
      return;
    }

    // Fast path: if children are completely new insertions
    if (oldChildren.length === 0 && newChildren.length > 0) {
      for (let i = 0; i < newChildren.length; i++) {
        this.patch.add(insertChild(newChildren[i].id, liveParentId, i, serializeASTNode(newChildren[i])));
      }
      return;
    }

    // Fast path: if children are completely removed, emit clean REMOVE_CHILD operations in reverse order
    if (newChildren.length === 0 && oldChildren.length > 0) {
      for (let i = oldChildren.length - 1; i >= 0; i--) {
        this.patch.add(removeChild(oldChildren[i].id, liveParentId, i));
      }
      return;
    }

    // 4-Level Matching Algorithm:
    // Level 1: Explicit semantic key property
    // Level 2: Stable existing AST identity
    // Level 3: Compatible structural identity + positional context (prefix, suffix, same index)
    // Level 4: Compatible structural matching for moved / reordered siblings
    const oldMatched = new Set<number>();
    const newMatched = new Set<number>();
    const newToOldMap = new Map<number, number>(); // newIndex -> oldIndex
    const oldToNewMap = new Map<number, number>(); // oldIndex -> newIndex

    const recordMatch = (newIdx: number, oldIdx: number) => {
      newMatched.add(newIdx);
      oldMatched.add(oldIdx);
      newToOldMap.set(newIdx, oldIdx);
      oldToNewMap.set(oldIdx, newIdx);
      this.newToOldIdMap.set(newChildren[newIdx].id, oldChildren[oldIdx].id);
      this.oldToNewIdMap.set(oldChildren[oldIdx].id, newChildren[newIdx].id);
    };

    // Build lookup maps for fast O(1) matching by key and AST ID
    const oldKeyMap = new Map<string, number>();
    const oldIdMap = new Map<string, number>();
    for (let i = 0; i < oldChildren.length; i++) {
      const key = getNodeKey(oldChildren[i]);
      if (key && !oldKeyMap.has(key)) {
        oldKeyMap.set(key, i);
      }
      const id = oldChildren[i].id;
      if (id && !oldIdMap.has(id)) {
        oldIdMap.set(id, i);
      }
    }

    // Level 1: Match by explicit key if available
    for (let j = 0; j < newChildren.length; j++) {
      if (newMatched.has(j)) continue;
      const newKey = getNodeKey(newChildren[j]);
      if (!newKey) continue;
      const oldIdx = oldKeyMap.get(newKey);
      if (oldIdx !== undefined && !oldMatched.has(oldIdx) && areNodesCompatible(oldChildren[oldIdx], newChildren[j])) {
        recordMatch(j, oldIdx);
      }
    }

    // Level 2: Match by exact stable AST ID
    for (let j = 0; j < newChildren.length; j++) {
      if (newMatched.has(j)) continue;
      const newChild = newChildren[j];
      const oldIdx = oldIdMap.get(newChild.id);
      if (oldIdx !== undefined && !oldMatched.has(oldIdx) && areNodesCompatible(oldChildren[oldIdx], newChild)) {
        recordMatch(j, oldIdx);
      }
    }

    // Level 3: Match by compatible type with matching text / content
    for (let j = 0; j < newChildren.length; j++) {
      if (newMatched.has(j)) continue;
      const newChild = newChildren[j];
      const newText = getNodeText(newChild);
      if (newText === null || newText === '') continue;

      // Prefer candidate at the exact same index first if available
      if (j < oldChildren.length && !oldMatched.has(j) && areNodesCompatible(oldChildren[j], newChild)) {
        const oldText = getNodeText(oldChildren[j]);
        if (oldText === newText) {
          recordMatch(j, j);
          continue;
        }
      }

      // Otherwise match first available candidate with matching content
      for (let i = 0; i < oldChildren.length; i++) {
        if (oldMatched.has(i)) continue;
        const oldChild = oldChildren[i];
        if (areNodesCompatible(oldChild, newChild)) {
          const oldText = getNodeText(oldChild);
          if (oldText !== null && newText === oldText) {
            recordMatch(j, i);
            break;
          }
        }
      }
    }

    // Level 4: Compatible structural identity + positional context (prefix, suffix, same position)
    // 4a. Prefix matching
    let prefix = 0;
    while (
      prefix < oldChildren.length &&
      prefix < newChildren.length &&
      !oldMatched.has(prefix) &&
      !newMatched.has(prefix) &&
      areNodesCompatible(oldChildren[prefix], newChildren[prefix])
    ) {
      recordMatch(prefix, prefix);
      prefix++;
    }

    // 4b. Suffix matching
    let oldSuffix = oldChildren.length - 1;
    let newSuffix = newChildren.length - 1;
    while (
      oldSuffix >= prefix &&
      newSuffix >= prefix &&
      !oldMatched.has(oldSuffix) &&
      !newMatched.has(newSuffix) &&
      areNodesCompatible(oldChildren[oldSuffix], newChildren[newSuffix])
    ) {
      recordMatch(newSuffix, oldSuffix);
      oldSuffix--;
      newSuffix--;
    }

    // 4c. Positional matching at identical index j for unkeyed elements
    for (let j = 0; j < newChildren.length; j++) {
      if (newMatched.has(j)) continue;
      if (j < oldChildren.length && !oldMatched.has(j)) {
        if (areNodesCompatible(oldChildren[j], newChildren[j])) {
          recordMatch(j, j);
        }
      }
    }

    // Step 1: Detect and emit removals in descending order
    // (Ensures higher indices are removed first without affecting lower indices)
    for (let i = oldChildren.length - 1; i >= 0; i--) {
      if (!oldMatched.has(i)) {
        const oldChild = oldChildren[i];
        this.patch.add(removeChild(oldChild.id, liveParentId, i));
      }
    }

    // Step 2: Recursively diff surviving matched nodes (attributes, text, nested subtrees)
    for (let j = 0; j < newChildren.length; j++) {
      const oldIndex = newToOldMap.get(j);
      if (oldIndex !== undefined) {
        this.diff(oldChildren[oldIndex], newChildren[j], j, liveParentId);
      }
    }

    // Step 3a: Insert genuinely new children first
    const currentChildren: { liveId: string; node: ASTNode }[] = [];
    for (let i = 0; i < oldChildren.length; i++) {
      if (oldMatched.has(i)) {
        currentChildren.push({ liveId: oldChildren[i].id, node: oldChildren[i] });
      }
    }

    for (let targetIdx = 0; targetIdx < newChildren.length; targetIdx++) {
      const oldIndex = newToOldMap.get(targetIdx);
      if (oldIndex === undefined) {
        const newChild = newChildren[targetIdx];
        const insertIndex = Math.min(targetIdx, currentChildren.length);
        this.patch.add(insertChild(newChild.id, liveParentId, insertIndex, serializeASTNode(newChild)));
        currentChildren.splice(insertIndex, 0, { liveId: newChild.id, node: newChild });
      }
    }

    // Step 3b: Compute minimal moves using Longest Increasing Subsequence (LIS)
    // Semantics: MOVE_CHILD index is the destination child index AFTER removing the moving node.
    const positionsInCurrent = newChildren.map(nc => {
      const liveId = this.resolveLiveId(nc);
      return currentChildren.findIndex(c => c.liveId === liveId);
    });
    const lisArray = positionsInCurrent.length > 0 ? getLongestIncreasingSubsequence(positionsInCurrent) : [];
    const stableSet = new Set(lisArray);

    for (let targetIdx = newChildren.length - 1; targetIdx >= 0; targetIdx--) {
      if (!stableSet.has(targetIdx)) {
        const desiredChild = newChildren[targetIdx];
        const liveChildId = this.resolveLiveId(desiredChild);
        const currentPos = currentChildren.findIndex(c => c.liveId === liveChildId);

        if (currentPos !== -1) {
          const [moved] = currentChildren.splice(currentPos, 1);
          let destIndex: number;
          if (targetIdx === newChildren.length - 1) {
            destIndex = currentChildren.length;
          } else {
            const nextChild = newChildren[targetIdx + 1];
            const nextLiveId = this.resolveLiveId(nextChild);
            destIndex = currentChildren.findIndex(c => c.liveId === nextLiveId);
            if (destIndex === -1) {
              destIndex = currentChildren.length;
            }
          }
          currentChildren.splice(destIndex, 0, moved);
          if (destIndex !== currentPos) {
            this.patch.add(moveChild(liveChildId, liveParentId, destIndex, currentPos));
          }
        }
      }
    }
  }
}

