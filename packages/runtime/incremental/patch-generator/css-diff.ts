import {
  CSSStyleSheetNode,
  CSSRuleNode,
  CSSDeclarationNode,
  CSSMediaRuleNode,
  CSSKeyframesRuleNode,
  CSSKeyframeBlockNode,
  CSSRuleItem,
} from '../../../compiler/interpreters/css-lm/ast';
import { serializeCSSRule, serializeCSSKeyframesRule, serializeCSSMediaRule } from '../../../compiler/interpreters/css-lm/serializer';
import {
  createCSSRule,
  removeCSSRule,
  updateCSSRule,
  addCSSDeclaration,
  updateCSSDeclaration,
  removeCSSDeclaration,
  addCSSKeyframe,
  updateCSSKeyframe,
  removeCSSKeyframe,
} from './operations';
import { Patch } from './patch';
import { PatchOperation } from './types';

export class CSSDiffEngine {
  constructor(private patch: Patch) {}

  public diff(
    oldSheet: CSSStyleSheetNode | null,
    newSheet: CSSStyleSheetNode
  ): void {
    if (!oldSheet) {
      // First mount: emit creation for all rules
      for (let i = 0; i < newSheet.rules.length; i++) {
        const item = newSheet.rules[i];
        this.emitInitialRule(item, i);
      }
      return;
    }

    const oldRulesMap = new Map<string, CSSRuleItem>();
    for (const r of oldSheet.rules) {
      oldRulesMap.set(r.id, r);
    }

    const newRulesMap = new Map<string, CSSRuleItem>();
    for (const r of newSheet.rules) {
      newRulesMap.set(r.id, r);
    }

    // 1. Check for removed rules
    for (const [id, oldItem] of oldRulesMap.entries()) {
      if (!newRulesMap.has(id)) {
        if (oldItem.kind === 'CSSRule') {
          this.patch.add(removeCSSRule(id, (oldItem as CSSRuleNode).selector));
        } else if (oldItem.kind === 'CSSKeyframesRule') {
          this.patch.add(removeCSSRule(id, `@keyframes ${(oldItem as CSSKeyframesRuleNode).name}`));
        } else if (oldItem.kind === 'CSSMediaRule') {
          this.patch.add(removeCSSRule(id, `@media ${(oldItem as CSSMediaRuleNode).query}`));
        }
      }
    }

    // 2. Check for added or modified rules
    for (let i = 0; i < newSheet.rules.length; i++) {
      const newItem = newSheet.rules[i];
      const oldItem = oldRulesMap.get(newItem.id);

      if (!oldItem) {
        // Newly added rule
        this.emitInitialRule(newItem, i);
      } else if (oldItem.kind === newItem.kind) {
        // Diff within same rule kind
        if (newItem.kind === 'CSSRule') {
          this.diffCSSRule(oldItem as CSSRuleNode, newItem as CSSRuleNode);
        } else if (newItem.kind === 'CSSKeyframesRule') {
          this.diffCSSKeyframes(oldItem as CSSKeyframesRuleNode, newItem as CSSKeyframesRuleNode);
        } else if (newItem.kind === 'CSSMediaRule') {
          this.diffCSSMedia(oldItem as CSSMediaRuleNode, newItem as CSSMediaRuleNode);
        }
      } else {
        // Replaced rule kind
        this.patch.add(removeCSSRule(oldItem.id));
        this.emitInitialRule(newItem, i);
      }
    }
  }

  private emitInitialRule(item: CSSRuleItem, index?: number): void {
    if (item.kind === 'CSSRule') {
      const rule = item as CSSRuleNode;
      this.patch.add(
        createCSSRule(
          rule.id,
          rule.selector,
          rule.declarations.map((d) => ({
            property: d.property,
            value: d.value,
            important: d.important,
          })),
          undefined,
          index
        )
      );
    } else if (item.kind === 'CSSKeyframesRule') {
      const kf = item as CSSKeyframesRuleNode;
      for (const block of kf.keyframes) {
        this.patch.add(
          addCSSKeyframe(
            block.id,
            kf.name,
            block.keyframeSelector,
            block.declarations.map((d) => ({
              property: d.property,
              value: d.value,
              important: d.important,
            }))
          )
        );
      }
    } else if (item.kind === 'CSSMediaRule') {
      const media = item as CSSMediaRuleNode;
      for (let j = 0; j < media.rules.length; j++) {
        const r = media.rules[j];
        this.patch.add(
          createCSSRule(
            r.id,
            r.selector,
            r.declarations.map((d) => ({
              property: d.property,
              value: d.value,
              important: d.important,
            })),
            media.query,
            j
          )
        );
      }
    }
  }

  private diffCSSRule(oldRule: CSSRuleNode, newRule: CSSRuleNode): void {
    const oldDecls = new Map<string, CSSDeclarationNode>();
    for (const d of oldRule.declarations) {
      oldDecls.set(d.property.toLowerCase(), d);
    }

    const newDecls = new Map<string, CSSDeclarationNode>();
    for (const d of newRule.declarations) {
      newDecls.set(d.property.toLowerCase(), d);
    }

    // Check removed declarations
    for (const [prop] of oldDecls.entries()) {
      if (!newDecls.has(prop)) {
        this.patch.add(removeCSSDeclaration(oldRule.id, prop));
      }
    }

    // Check added or updated declarations
    for (const [prop, newDecl] of newDecls.entries()) {
      const oldDecl = oldDecls.get(prop);
      if (!oldDecl) {
        this.patch.add(
          addCSSDeclaration(oldRule.id, newDecl.property, newDecl.value, newDecl.important)
        );
      } else if (oldDecl.value !== newDecl.value || oldDecl.important !== newDecl.important) {
        this.patch.add(
          updateCSSDeclaration(oldRule.id, newDecl.property, newDecl.value, newDecl.important)
        );
      }
    }
  }

  private diffCSSKeyframes(oldKf: CSSKeyframesRuleNode, newKf: CSSKeyframesRuleNode): void {
    const oldBlocks = new Map<string, CSSKeyframeBlockNode>();
    for (const b of oldKf.keyframes) {
      oldBlocks.set(b.keyframeSelector, b);
    }

    const newBlocks = new Map<string, CSSKeyframeBlockNode>();
    for (const b of newKf.keyframes) {
      newBlocks.set(b.keyframeSelector, b);
    }

    for (const [sel] of oldBlocks.entries()) {
      if (!newBlocks.has(sel)) {
        this.patch.add(removeCSSKeyframe(oldKf.id, oldKf.name, sel));
      }
    }

    for (const [sel, newBlock] of newBlocks.entries()) {
      const oldBlock = oldBlocks.get(sel);
      if (!oldBlock) {
        this.patch.add(
          addCSSKeyframe(
            newBlock.id,
            newKf.name,
            newBlock.keyframeSelector,
            newBlock.declarations.map((d) => ({
              property: d.property,
              value: d.value,
              important: d.important,
            }))
          )
        );
      } else {
        // Compare declarations within keyframe block
        this.patch.add(
          updateCSSKeyframe(
            newBlock.id,
            newKf.name,
            newBlock.keyframeSelector,
            newBlock.declarations.map((d) => ({
              property: d.property,
              value: d.value,
              important: d.important,
            }))
          )
        );
      }
    }
  }

  private diffCSSMedia(oldMedia: CSSMediaRuleNode, newMedia: CSSMediaRuleNode): void {
    const oldRules = new Map<string, CSSRuleNode>();
    for (const r of oldMedia.rules) {
      oldRules.set(r.id, r);
    }

    const newRules = new Map<string, CSSRuleNode>();
    for (const r of newMedia.rules) {
      newRules.set(r.id, r);
    }

    for (const [id, oldRule] of oldRules.entries()) {
      if (!newRules.has(id)) {
        this.patch.add(removeCSSRule(id, oldRule.selector));
      }
    }

    for (let i = 0; i < newMedia.rules.length; i++) {
      const newRule = newMedia.rules[i];
      const oldRule = oldRules.get(newRule.id);
      if (!oldRule) {
        this.patch.add(
          createCSSRule(
            newRule.id,
            newRule.selector,
            newRule.declarations.map((d) => ({
              property: d.property,
              value: d.value,
              important: d.important,
            })),
            newMedia.query,
            i
          )
        );
      } else {
        this.diffCSSRule(oldRule, newRule);
      }
    }
  }
}

export function diffCSSStyleSheets(
  oldSheet: CSSStyleSheetNode | null,
  newSheet: CSSStyleSheetNode
): PatchOperation[] {
  const patch = new Patch();
  const diffEngine = new CSSDiffEngine(patch);
  diffEngine.diff(oldSheet, newSheet);
  return patch.getOperations();
}
