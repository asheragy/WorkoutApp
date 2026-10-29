import { isLiftGroup, Lift, WorkoutItem } from '../types/workout.ts';
import { GlobalSettings, LiftDef } from '../types/types.ts';
import SetUtils from './SetUtils.ts';

const LiftUtils = {
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
};

export default LiftUtils;
