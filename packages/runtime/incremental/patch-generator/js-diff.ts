import {
  JSProgramNode,
  JSUnitNode,
  JSNodeKind,
  JSEventHandlerNode,
} from '../../../compiler/interpreters/js-lm/ast';
import {
  attachEventHandler,
  createJSUnit,
  executeJSUnit,
  removeEventHandler,
  removeJSUnit,
  updateEventHandler,
  updateJSUnit,
} from './operations';
import { PatchOperation } from './types';

/**
 * Diffs two JSProgramNodes and generates a minimal list of JS patch operations.
 */
export function diffJSPrograms(
  oldProgram: JSProgramNode | null,
  newProgram: JSProgramNode
): PatchOperation[] {
  const patches: PatchOperation[] = [];

  if (!oldProgram) {
    // Initial program: generate creation patches for all completed units
    for (let i = 0; i < newProgram.units.length; i++) {
      const unit = newProgram.units[i];
      if (!unit.isComplete) continue;

      if (unit.details && unit.details.kind === JSNodeKind.EventHandler) {
        const evt = unit.details as JSEventHandlerNode;
        patches.push(
          attachEventHandler(
            unit.id,
            evt.eventName,
            evt.targetSelector,
            evt.handlerCode,
            i
          )
        );
      } else {
        patches.push(
          createJSUnit(
            unit.id,
            unit.unitKind,
            unit.code,
            unit.meta,
            i
          )
        );
        patches.push(executeJSUnit(unit.id, unit.code));
      }
    }
    return patches;
  }

  const oldUnitsMap = new Map<string, JSUnitNode>();
  for (const unit of oldProgram.units) {
    oldUnitsMap.set(unit.id, unit);
  }

  const newUnitsMap = new Map<string, JSUnitNode>();
  for (let i = 0; i < newProgram.units.length; i++) {
    const unit = newProgram.units[i];
    newUnitsMap.set(unit.id, unit);

    if (!unit.isComplete) continue;

    const oldUnit = oldUnitsMap.get(unit.id);
    if (!oldUnit) {
      // Added new unit
      if (unit.details && unit.details.kind === JSNodeKind.EventHandler) {
        const evt = unit.details as JSEventHandlerNode;
        patches.push(
          attachEventHandler(
            unit.id,
            evt.eventName,
            evt.targetSelector,
            evt.handlerCode,
            i
          )
        );
      } else {
        patches.push(
          createJSUnit(
            unit.id,
            unit.unitKind,
            unit.code,
            unit.meta,
            i
          )
        );
        patches.push(executeJSUnit(unit.id, unit.code));
      }
    } else if (oldUnit.code !== unit.code || !oldUnit.isComplete) {
      // Modified unit or previously incomplete unit completed
      if (unit.details && unit.details.kind === JSNodeKind.EventHandler) {
        const evt = unit.details as JSEventHandlerNode;
        patches.push(
          updateEventHandler(
            unit.id,
            evt.eventName,
            evt.targetSelector,
            evt.handlerCode
          )
        );
      } else {
        patches.push(
          updateJSUnit(
            unit.id,
            unit.unitKind,
            unit.code,
            unit.meta
          )
        );
        patches.push(executeJSUnit(unit.id, unit.code));
      }
    }
  }

  // Check for removed units
  for (const oldUnit of oldProgram.units) {
    if (!newUnitsMap.has(oldUnit.id)) {
      if (oldUnit.details && oldUnit.details.kind === JSNodeKind.EventHandler) {
        const evt = oldUnit.details as JSEventHandlerNode;
        patches.push(
          removeEventHandler(
            oldUnit.id,
            evt.eventName,
            evt.targetSelector
          )
        );
      } else {
        patches.push(removeJSUnit(oldUnit.id));
      }
    }
  }

  return patches;
}
