import {
  GlobalSettings,
  LiftDef,
  LiftSet,
  LiftType,
  NormalizedSet,
  PersistedSet,
  Reps,
  Weight,
} from '../types/types';

export default class Utils {
  static normalizeSets(sets?: LiftSet[]): NormalizedSet[] {
    var result: NormalizedSet[] = [];
    var counter = 1;

    sets?.forEach(set => {
      var t = this.normalizeLiftSet(set);
      if (t.label == '') t.label = (counter++).toString();

      result.push(t);
    });

    return result;
  }

  private static normalizeLiftSet(set: LiftSet): NormalizedSet {
    return {
      weight: Utils.weightToString(set.weight),
      reps: Utils.repsToString(set.reps),
      label: set.warmup ? 'W' : '',
    };
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

  static persistedToSets(
    sets: PersistedSet[],
    definedSets: LiftSet[],
  ): LiftSet[] {
    const warmups = definedSets.filter(x => x.warmup == true);
    const workSets = definedSets.filter(
      x => x.warmup == undefined || x.warmup == false,
    );

    const mapped = workSets.map((set, index) => {
      if (index < sets.length) {
        var persisted = sets[index];
        var modifiedSet = set;
        modifiedSet.reps.value = persisted.reps;
        modifiedSet.weight.value = persisted.weight;
        return modifiedSet;
      }

      return set;
    });

    return warmups.concat(mapped);
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

  static calculate1RM(def: LiftDef, set: LiftSet | PersistedSet): number {
    // TODO bodyweight as parameter that is based on last tracked weight
    const bodyweight = 200;
    var weight = typeof set.weight === 'number' ? set.weight : set.weight.value;
    const reps = typeof set.reps === 'number' ? set.reps : set.reps.value;

    if (def.type == LiftType.Bodyweight) weight += bodyweight;

    return weight + weight * 0.0333 * reps;
  }

  static calculateVolume(def: LiftDef, set: PersistedSet): number {
    const bodyweight = 200;
    var weight = set.weight + (bodyweight ? 200 : 0);
    var reps = set.reps;

    return weight * reps;
  }
}
