import {LiftSet, NormalizedSet, PersistedSet, Range} from '../types/types';

export default class Utils {
  static normalizeSets(sets?: LiftSet[]): NormalizedSet[] {
    var result: NormalizedSet[] = [];

    sets?.forEach(set => {
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
    });

    return result;
  }

  static normalizeSets(sets?: PersistedSet[]): NormalizedSet[] {
    var result: NormalizedSet[] = [];

    sets?.forEach(set => {
      var normalized: NormalizedSet = {
        weight: Utils.weightToString(set.weight),
        reps: Utils.repsToString(set.reps, false),
      };

      result.push(normalized);
    });

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
