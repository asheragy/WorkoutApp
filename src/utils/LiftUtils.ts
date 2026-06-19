import { Lift } from '../types/workout.ts';
import { LiftDef } from '../types/types.ts';
import SetUtils from './SetUtils.ts';
import Utils from '../components/Utils.ts';

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

  goalPercent(def: LiftDef, lift: Lift): undefined | number {
    if (def.id != lift.id) throw new Error('Def must match lift Id');

    if (lift.sets.length > 0 && lift.goals && lift.goals.length > 0) {
      const sets = lift.sets
        .filter(x => !x.warmup)
        .map(x => SetUtils.setToPersisted(x));
      const goals = (lift.goals ?? []).map(x => SetUtils.setToPersisted(x));

      const percent =
        SetUtils.calculate1RMAverage(def, sets) /
        SetUtils.calculate1RMAverage(def, goals);

      return percent;
    }

    return undefined;
  },
};

export default LiftUtils;
