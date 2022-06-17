import {LiftSet, NormalizedSet, PersistedSet, Range} from '../types/types';

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
      weight: Utils.weightToString(set.weight),
      reps: Utils.repsToString(set.reps, false),
    };
  }

  private static normalizeLiftSet(set: LiftSet): NormalizedSet[] {
    var result: NormalizedSet[] = [];

    var normalized: NormalizedSet = {
      weight: Utils.weightToString(set.weight),
      reps: Utils.repsToString(set.reps, set.amrap ? set.amrap : false),
    };

    if (set.repeat && set.repeat > 1) {
      var t: NormalizedSet[] = Array(set.repeat)
        .fill(0)
        .map(x => normalized);
      result.push(...t);
    } else result.push(normalized);

    return result;
  }

  static weightToString(weight?: number | Range): string {
    if (weight != null) {
      if (typeof weight == 'number') return weight + 'lb';
      else return weight.min + '-' + weight.max + 'lbs';
    } else return 'Any';
  }

  static repsToString(reps: number | Range, amrap: Boolean): string {
    var str = '';
    if (typeof reps == 'number') str += reps;
    else str += reps.min + '-' + reps.max;

    if (amrap) str = str + '+';

    return str;
  }
}
