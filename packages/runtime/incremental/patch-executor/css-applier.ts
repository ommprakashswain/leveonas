import { PatchOperation, PatchOperationType, normalizePatchOperationType } from '../patch-generator/types';

export class CSSPatchApplier {
  private doc: any;
  private styleEl: any = null;
  private rulesMap: Map<string, { selector: string; declarations: Map<string, { value: string; important: boolean }>; mediaQuery?: string }> = new Map();
  private keyframesMap: Map<string, Map<string, Array<{ property: string; value: string; important?: boolean }>>> = new Map();

  constructor(doc?: any) {
    this.doc = doc || (typeof document !== 'undefined' ? document : null);
    if (this.doc) {
      this.ensureStyleElement();
    }
  }

  public ensureStyleElement(): any {
    if (!this.doc) return null;
    if (this.styleEl) return this.styleEl;

    let el = this.doc.getElementById ? this.doc.getElementById('leveonas-css') : null;
    if (!el && this.doc.createElement) {
      el = this.doc.createElement('style');
      if (el) {
        el.id = 'leveonas-css';
        el.type = 'text/css';
        const target = this.doc.head || this.doc.body || this.doc.documentElement;
        if (target && target.appendChild) {
          target.appendChild(el);
        }
      }
    }
    this.styleEl = el;
    return el;
  }

  public apply(patches: PatchOperation[]): void {
    if (!this.doc) return;
    this.ensureStyleElement();

    let needsSync = false;

    for (const patch of patches) {
      const op = normalizePatchOperationType(patch.operation);
      switch (op) {
        case PatchOperationType.SET_CSS_STYLESHEET: {
          const cssText = patch.payload?.cssText || '';
          if (this.styleEl) {
            this.styleEl.textContent = cssText;
          }
          break;
        }

        case PatchOperationType.CREATE_CSS_RULE: {
          const ruleId = patch.nodeId;
          const selector = patch.payload?.selector || '';
          const decls = new Map<string, { value: string; important: boolean }>();
          for (const d of patch.payload?.declarations || []) {
            decls.set(d.property.toLowerCase(), { value: d.value, important: !!d.important });
          }
          this.rulesMap.set(ruleId, {
            selector,
            declarations: decls,
            mediaQuery: patch.payload?.mediaQuery,
          });
          needsSync = true;
          break;
        }

        case PatchOperationType.REMOVE_CSS_RULE: {
          const ruleId = patch.nodeId;
          this.rulesMap.delete(ruleId);
          needsSync = true;
          break;
        }

        case PatchOperationType.UPDATE_CSS_RULE: {
          const ruleId = patch.nodeId;
          const existing = this.rulesMap.get(ruleId);
          if (existing) {
            existing.selector = patch.payload?.selector || existing.selector;
            existing.declarations.clear();
            for (const d of patch.payload?.declarations || []) {
              existing.declarations.set(d.property.toLowerCase(), { value: d.value, important: !!d.important });
            }
            existing.mediaQuery = patch.payload?.mediaQuery || existing.mediaQuery;
          }
          needsSync = true;
          break;
        }

        case PatchOperationType.ADD_CSS_DECLARATION:
        case PatchOperationType.UPDATE_CSS_DECLARATION: {
          const ruleId = patch.nodeId;
          const rule = this.rulesMap.get(ruleId);
          if (rule && patch.payload?.property) {
            rule.declarations.set(patch.payload.property.toLowerCase(), {
              value: patch.payload.value,
              important: !!patch.payload.important,
            });
            needsSync = true;
          }
          break;
        }

        case PatchOperationType.REMOVE_CSS_DECLARATION: {
          const ruleId = patch.nodeId;
          const rule = this.rulesMap.get(ruleId);
          if (rule && patch.payload?.property) {
            rule.declarations.delete(patch.payload.property.toLowerCase());
            needsSync = true;
          }
          break;
        }

        case PatchOperationType.UPDATE_CSS_SELECTOR: {
          const ruleId = patch.nodeId;
          const rule = this.rulesMap.get(ruleId);
          if (rule && patch.payload?.newSelector) {
            rule.selector = patch.payload.newSelector;
            needsSync = true;
          }
          break;
        }

        case PatchOperationType.ADD_CSS_KEYFRAME:
        case PatchOperationType.UPDATE_CSS_KEYFRAME: {
          const kfName = patch.payload?.keyframesName;
          const stepSel = patch.payload?.keyframeSelector;
          if (kfName && stepSel) {
            let kf = this.keyframesMap.get(kfName);
            if (!kf) {
              kf = new Map();
              this.keyframesMap.set(kfName, kf);
            }
            kf.set(stepSel, patch.payload.declarations || []);
            needsSync = true;
          }
          break;
        }

        case PatchOperationType.REMOVE_CSS_KEYFRAME: {
          const kfName = patch.payload?.keyframesName;
          const stepSel = patch.payload?.keyframeSelector;
          if (kfName && stepSel) {
            const kf = this.keyframesMap.get(kfName);
            if (kf) {
              kf.delete(stepSel);
              if (kf.size === 0) {
                this.keyframesMap.delete(kfName);
              }
            }
            needsSync = true;
          }
          break;
        }
      }
    }

    if (needsSync) {
      this.syncToStyleElement();
    }
  }

  public syncToStyleElement(): void {
    if (!this.styleEl) return;

    const lines: string[] = [];

    // Group rules by media query
    const standardRules: Array<{ selector: string; decls: string }> = [];
    const mediaGroups: Map<string, Array<{ selector: string; decls: string }>> = new Map();

    for (const rule of this.rulesMap.values()) {
      const declStrs: string[] = [];
      for (const [prop, d] of rule.declarations.entries()) {
        const imp = d.important ? ' !important' : '';
        declStrs.push(`  ${prop}: ${d.value}${imp};`);
      }
      const declBlock = declStrs.join('\n');

      if (rule.mediaQuery) {
        let group = mediaGroups.get(rule.mediaQuery);
        if (!group) {
          group = [];
          mediaGroups.set(rule.mediaQuery, group);
        }
        group.push({ selector: rule.selector, decls: declBlock });
      } else {
        standardRules.push({ selector: rule.selector, decls: declBlock });
      }
    }

    // Standard rules
    for (const r of standardRules) {
      lines.push(`${r.selector} {\n${r.decls}\n}`);
    }

    // Keyframes
    for (const [name, steps] of this.keyframesMap.entries()) {
      const stepLines: string[] = [];
      for (const [sel, decls] of steps.entries()) {
        const dLines = decls.map((d) => `    ${d.property}: ${d.value}${d.important ? ' !important' : ''};`).join('\n');
        stepLines.push(`  ${sel} {\n${dLines}\n  }`);
      }
      lines.push(`@keyframes ${name} {\n${stepLines.join('\n')}\n}`);
    }

    // Media rules
    for (const [query, rules] of mediaGroups.entries()) {
      const ruleLines = rules.map((r) => `  ${r.selector} {\n${r.decls.split('\n').map((l) => '  ' + l).join('\n')}\n  }`).join('\n\n');
      lines.push(`@media ${query} {\n${ruleLines}\n}`);
    }

    this.styleEl.textContent = lines.join('\n\n');
  }

  public getCSS(): string {
    return this.styleEl?.textContent || '';
  }

  public reset(): void {
    this.rulesMap.clear();
    this.keyframesMap.clear();
    if (this.styleEl) {
      this.styleEl.textContent = '';
    }
  }
}
