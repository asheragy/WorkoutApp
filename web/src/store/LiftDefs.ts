import { LiftDef } from '@shared/types/types.ts';
import { defToString, Lifts } from '@shared/LiftDatabase.ts';

// LiftDef plus a ready-to-show name, e.g. "Bench Press (Dumbbell)" when another lift shares the
// plain name. Derived at load time and never persisted.
export type WebLiftDef = LiftDef & { displayName: string };

// TODO: long term, replace LiftDef.multiple with an optional displayName on the shared type, set by
// the mobile LiftDefRepository where it currently sets `multiple` (and stripped before persisting,
// as `multiple` is today). Then this type and the derivation below move into shared code.
const nameCounts = new Map<string, number>();
Object.values(Lifts).forEach(def => nameCounts.set(def.name, (nameCounts.get(def.name) ?? 0) + 1));

export const liftDefs: Record<string, WebLiftDef> = Object.fromEntries(
  Object.values(Lifts).map(def => {
    const multiple = nameCounts.get(def.name)! > 1;
    return [def.id, { ...def, multiple, displayName: defToString({ ...def, multiple }) }];
  }),
);
