import { Lift, WorkoutItem } from '../types/workout.ts';
import { GlobalSettings, LiftDef } from '../types/types.ts';
import SetUtils from './SetUtils.ts';
import Utils from '../../components/Utils.ts';

const LiftUtils = {
  groupLifts(lifts: Lift[]): Lift[][] {
    const result: Lift[][] = [];

    for (const lift of lifts) {
      if (lift.alternate && result.length > 0) {
        // add to previous group
        result[result.length - 1].push(lift);
      } else {
        // start a new group
        result.push([lift]);
      }
    }

    return result;
  },

  // Converts positional `alternate` flags into explicit groups. The flag is
  // dropped from every lift since the group now carries that information.
  toWorkoutItems(lifts: Lift[]): WorkoutItem[] {
    const groups = this.groupLifts(lifts).map(group =>
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      group.map(({ alternate, ...lift }) => lift),
    );
    return groups.map(group => {
      if (group.length == 1) return group[0];
      else {
        return {
          kind: 'oneOf',
          instanceId: Utils.generate_uuidv4(),
          lifts: group,
        };
      }
    });
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
