import { LiftDef } from '../types/types.ts';
import { SystemLifts } from '../repository/LiftDatabase.ts';

export const TestLiftDefs: Record<string, LiftDef> = (() => {
  const result: Record<string, LiftDef> = {};

  // Only SystemLifts, since no custom defs
  SystemLifts.forEach(def => {
    result[def.id] = { ...def };
  });

  const nameMap = new Map<string, number>();

  Object.values(result).forEach(v => {
    const count = (nameMap.get(v.name) ?? 0) + 1;
    nameMap.set(v.name, count);
  });

  Object.values(result).forEach(v => {
    if ((nameMap.get(v.name) ?? 0) > 1) {
      v.multiple = true;
    }
  });

  return result;
})();
