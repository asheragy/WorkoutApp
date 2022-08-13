import {
  Lift,
  LiftSet,
  NormalizedSet,
  PersistedLift,
  PersistedSet,
  Range,
  Weight,
} from '../types/types';

export default class Utils {
  static normalizeSets(sets?: LiftSet[] | PersistedSet[]) {
    var result: NormalizedSet[] = [];

    sets?.forEach(set => {
      if (this.isPersisted(set))
        result.push(this.normalizePersistedSet(set as PersistedSet));
      else result.push(...this.normalizeLiftSet(set as LiftSet));
    });

    return result;
  }

  private static isPersisted(set: LiftSet | PersistedSet): boolean {
    if ('amrap' in set || 'repeat' in set) return false;

    if (typeof set.reps === 'number' && typeof set.weight === 'number')
      return true;

    return false;
  }

  private static normalizePersistedSet(set: PersistedSet): NormalizedSet {
    return {
      weight: set.weight.toString(),
      reps: Utils.repsToString(set.reps, false),
    };
  }

  private static normalizeLiftSet(set: LiftSet): NormalizedSet[] {
    var result: NormalizedSet[] = [];

    var normalized: NormalizedSet = {
      weight: Utils.weightToString(set.weight),
      reps: Utils.repsToString(set.reps, set.amrap ? set.amrap : false),
    };

    result.push(normalized);

    return result;
  }

  static weightToString(weight: Weight): string {
    console.log(weight);
    if (weight.range != undefined)
      return weight.range.min + '-' + weight.range.max + 'lbs';

    return weight.value + 'lb';
  }

  static repsToString(reps: number | Range, amrap: Boolean): string {
    var str = '';
    if (typeof reps == 'number') str += reps;
    else str += reps.min + '-' + reps.max;

    if (amrap) str = str + '+';

    return str;
  }

  // TODO this should get deprecated soon
  static liftName(lift: Lift | PersistedLift): string {
    if ('def' in lift) return (lift as PersistedLift).def.name;

    return (lift as Lift).name;
  }
}
