import {
  GlobalSettings,
  Lift,
  LiftSet,
  LiftType,
  NormalizedSet,
  PersistedSet,
  Range,
  Reps,
  Weight,
} from '../types/types';

export default class Utils {
  static normalizeSets(sets?: LiftSet[] | PersistedSet[]) {
    var result: NormalizedSet[] = [];

    sets?.forEach(set => {
      result.push(...this.normalizeLiftSet(set as LiftSet));
    });

    return result;
  }

  private static normalizeLiftSet(set: LiftSet): NormalizedSet[] {
    var result: NormalizedSet[] = [];

    var normalized: NormalizedSet = {
      weight: Utils.weightToString(set.weight),
      reps: Utils.repsToString(set.reps),
    };

    result.push(normalized);

    return result;
  }

  static weightToString(weight: Weight): string {
    return weight.value + 'lb';
  }

  static repsToString(reps: Reps): string {
    var str = reps.value.toString();

    if (reps.range != undefined) {
      if (reps.range.min == 0 && reps.range.max == undefined) str = str + '+';
      else if (reps.range.min != undefined && reps.range.max != undefined)
        str += reps.range.min + '-' + reps.range.max;
    }

    return str;
  }

  static persistedToSets(sets: PersistedSet[]): LiftSet[] {
    return sets.map(set => this.persistedToSet(set));
  }

  static persistedToSet(set: PersistedSet): LiftSet {
    return {
      weight: {
        value: set.weight,
      },
      reps: {
        value: set.reps,
      },
    };
  }

  static setsToPersisted(sets: LiftSet[]): PersistedSet[] {
    return sets.map(set => {
      // TODO assert range is set since thats what is used to determine persisted
      // Whatever calls this should be doing that as well
      var res: PersistedSet = {
        weight: set.weight.value,
        reps: set.reps.value,
      };

      return res;
    });
  }

  static incrementWeight(
    current: number,
    liftType: LiftType,
    settings: GlobalSettings,
  ): number {
    var step = 5;
    if (liftType == LiftType.Machine) step = 2.5;
    else if (
      liftType == LiftType.Dumbbell &&
      settings.largestHalfPoundDumbbell != undefined
    ) {
      if (current <= settings.largestHalfPoundDumbbell) step = 2.5;
    }

    return current + step;
  }

  static decrementWeight(
    current: number,
    liftType: LiftType,
    settings: GlobalSettings,
  ): number {
    var step = 5;
    if (liftType == LiftType.Machine) step = 2.5;
    else if (
      liftType == LiftType.Dumbbell &&
      settings.largestHalfPoundDumbbell != undefined
    ) {
      if (current <= settings.largestHalfPoundDumbbell) step = 2.5;
      else if (current - 2.5 == settings.largestHalfPoundDumbbell) step = 2.5;
    }

    return current - step;
  }
}
