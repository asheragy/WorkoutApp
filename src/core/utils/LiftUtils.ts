import uuid from 'react-native-uuid';
import {
  isLiftGroup,
  Lift,
  LiftGroup,
  LiftSet,
  WorkoutItem,
} from '../types/workout.ts';
import { GlobalSettings, LiftDef } from '../types/types.ts';
import SetUtils from './SetUtils.ts';

function findGroup(items: WorkoutItem[], groupId: string): [number, LiftGroup] {
  const index = items.findIndex(x => x.instanceId == groupId);
  const group = items[index];
  if (index < 0 || !isLiftGroup(group))
    throw new Error(`Group not found: ${groupId}`);
  return [index, group];
}

// A group of one is just a lift, so collapse it.
function collapse(group: LiftGroup): WorkoutItem {
  return group.lifts.length == 1 ? group.lifts[0] : group;
}

const LiftUtils = {
  // Appends a goal to goals (primary) or goals2, copying the last goal in that
  // group, else the last set with only weight/reps kept. Returns a new lift.
  addGoal(lift: Lift, primary: boolean): Lift {
    const existing = primary ? lift.goals : lift.goals2;
    let goal: LiftSet = { weight: 0, reps: 0 };
    if (existing && existing.length > 0)
      goal = { ...existing[existing.length - 1] };
    else if (lift.sets.length > 0) {
      const last = lift.sets[lift.sets.length - 1];
      goal = { weight: last.weight, reps: last.reps };
    }

    const updated = [...(existing ?? []), goal];
    return primary
      ? { ...lift, goals: updated }
      : { ...lift, goals2: updated };
  },

  // Flat list of every lift in order, groups expanded in place. No
  // `alternate` flags are added; use this wherever the grouping is irrelevant
  // (history, goals, lookups by instanceId).
  flatten(items: WorkoutItem[]): Lift[] {
    return items.flatMap(item => ('kind' in item ? item.lifts : [item]));
  },

  // Replaces the lift with a matching instanceId, whether it sits at the top
  // level or inside a group. Returns a new items array, or undefined if no
  // lift matched.
  replaceLift(items: WorkoutItem[], lift: Lift): WorkoutItem[] | undefined {
    const matches = (l: Lift) => l.instanceId == lift.instanceId;
    let found = false;

    const result = items.map(item => {
      if (isLiftGroup(item)) {
        if (!item.lifts.some(matches)) return item;
        found = true;
        return { ...item, lifts: item.lifts.map(l => (matches(l) ? lift : l)) };
      }
      if (!matches(item)) return item;
      found = true;
      return lift;
    });

    return found ? result : undefined;
  },

  goalPercent(
    settings: Pick<GlobalSettings, 'bodyweight'>,
    def: LiftDef,
    lift: Lift,
  ): undefined | number {
    if (def.id != lift.id) throw new Error('Def must match lift Id');

    if (lift.sets.length > 0 && lift.goals && lift.goals.length > 0) {
      const sets = lift.sets
        .filter(x => !x.warmup)
        .map(x => SetUtils.setToPersisted(x));
      const goals = (lift.goals ?? []).map(x => SetUtils.setToPersisted(x));

      const percent =
        SetUtils.calculate1RMAverage(settings, def, sets) /
        SetUtils.calculate1RMAverage(settings, def, goals);

      return percent;
    }

    return undefined;
  },

  goal2Percent(
    settings: Pick<GlobalSettings, 'bodyweight'>,
    def: LiftDef,
    lift: Lift,
  ): undefined | number {
    if (def.id != lift.id) throw new Error('Def must match lift Id');

    if (lift.sets.length > 0 && lift.goals2 && lift.goals2.length > 0) {
      const sets = lift.sets
        .filter(x => !x.warmup)
        .map(x => SetUtils.setToPersisted(x));
      const goals = (lift.goals2 ?? []).map(x => SetUtils.setToPersisted(x));

      const percent =
        SetUtils.calculate1RMAverage(settings, def, sets) /
        SetUtils.calculate1RMAverage(settings, def, goals);

      return percent * 1.2;
    }

    return undefined;
  },

  // ---- Group editing. All of these return a new items array and leave the
  // input untouched; unknown ids throw since they mean the caller's state is
  // stale. Groups always hold 2+ lifts: one left alone becomes a plain lift.

  // Puts `lift` into the group that `targetId` names, or makes a new group of
  // the two when the target is a plain lift. The lift is removed from the top
  // level first if it is there (it may instead come from another workout).
  joinGroup(
    items: WorkoutItem[],
    targetId: string,
    lift: Lift,
    where: 'first' | 'last',
  ): WorkoutItem[] {
    const rest = items.filter(x => x.instanceId != lift.instanceId);
    const index = rest.findIndex(x => x.instanceId == targetId);
    if (index < 0) throw new Error(`Join target not found: ${targetId}`);
    const target = rest[index];

    const lifts = isLiftGroup(target) ? target.lifts : [target];
    const merged: LiftGroup = {
      kind: 'oneOf',
      instanceId: isLiftGroup(target) ? target.instanceId : uuid.v4(),
      lifts: where == 'first' ? [lift, ...lifts] : [...lifts, lift],
    };
    return [...rest.slice(0, index), merged, ...rest.slice(index + 1)];
  },

  // Takes the lift at `liftIndex` out of its group. Returns the new items and
  // the lift so the caller can put it somewhere else.
  takeFromGroup(
    items: WorkoutItem[],
    groupId: string,
    liftIndex: number,
  ): [WorkoutItem[], Lift] {
    const [index, group] = findGroup(items, groupId);
    const lift = group.lifts[liftIndex];
    if (!lift) throw new Error(`No lift at ${liftIndex} in group ${groupId}`);
    const remaining = group.lifts.filter((_, i) => i != liftIndex);
    const result = [...items];
    result[index] = collapse({ ...group, lifts: remaining });
    return [result, lift];
  },

  // Inserts `lift` into a group at `liftIndex` (clamped to the end).
  insertIntoGroup(
    items: WorkoutItem[],
    groupId: string,
    liftIndex: number,
    lift: Lift,
  ): WorkoutItem[] {
    const [index, group] = findGroup(items, groupId);
    const lifts = [...group.lifts];
    lifts.splice(liftIndex, 0, lift);
    const result = [...items];
    result[index] = { ...group, lifts };
    return result;
  },

  // Ejects a lift from its group to the top level, directly after the group.
  removeFromGroup(
    items: WorkoutItem[],
    groupId: string,
    liftId: string,
  ): WorkoutItem[] {
    const [index, group] = findGroup(items, groupId);
    const liftIndex = group.lifts.findIndex(x => x.instanceId == liftId);
    if (liftIndex < 0)
      throw new Error(`Lift ${liftId} not found in group ${groupId}`);
    const [result, lift] = LiftUtils.takeFromGroup(items, groupId, liftIndex);
    result.splice(index + 1, 0, lift);
    return result;
  },

  // Moves a lift within a group or to another group in the same items array.
  // `toIndex` is a position in the destination group as it is before the
  // move, the way drag-and-drop libraries report it.
  moveGroupLift(
    items: WorkoutItem[],
    fromGroupId: string,
    fromIndex: number,
    toGroupId: string,
    toIndex: number,
  ): WorkoutItem[] {
    if (fromGroupId == toGroupId) {
      // Reorder in place; going through takeFromGroup would collapse a group
      // of two before the lift could be put back.
      const [index, group] = findGroup(items, fromGroupId);
      const lifts = [...group.lifts];
      const [lift] = lifts.splice(fromIndex, 1);
      if (!lift)
        throw new Error(`No lift at ${fromIndex} in group ${fromGroupId}`);
      lifts.splice(toIndex, 0, lift);
      const result = [...items];
      result[index] = { ...group, lifts };
      return result;
    }
    const [taken, lift] = LiftUtils.takeFromGroup(items, fromGroupId, fromIndex);
    return LiftUtils.insertIntoGroup(taken, toGroupId, toIndex, lift);
  },
};

export default LiftUtils;
