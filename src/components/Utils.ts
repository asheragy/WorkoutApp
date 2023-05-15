import {
  GlobalSettings,
  LiftDef,
  LiftType,
  NormalizedSet,
  PersistedSet,
} from '../types/types';
import {LiftSet} from '../types/workout';

export default class Utils {
  static normalizeSets(sets: LiftSet[]): NormalizedSet[] {
    var result: NormalizedSet[] = [];
    var counter = 1;

    sets.forEach(set => {
      var t: NormalizedSet = {
        // TODO depending on usages not sure if 0 is the correct default here
        weight: (set.weight || 0) + 'lb',
        reps: (set.reps || 0) + '',
        label: set.warmup ? 'W' : (counter++).toString(),
      };

      result.push(t);
    });

    return result;
  }

  static persistedToSets(sets: PersistedSet[]): LiftSet[] {
    return sets.map(set => {
      var result: LiftSet = {
        weight: set.weight,
        reps: set.reps,
        warmup: set.warmup,
      };

      return result;
    });
  }

  static persistedToSet(set: PersistedSet): LiftSet {
    return {
      weight: set.weight,
      reps: set.reps,
      warmup: set.warmup,
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
    if (set.warmup == true) throw new Error('1RM calculation on warmup');
    // TODO bodyweight as parameter that is based on last tracked weight
    const bodyweight = 200;
    var weight = typeof set.weight === 'number' ? set.weight : set.weight || 0;
    const reps = typeof set.reps === 'number' ? set.reps : set.reps || 0;

    if (def.type == LiftType.Bodyweight) weight += bodyweight;

    return weight + weight * 0.0333 * reps;
  }

  static calculateVolume(def: LiftDef, set: PersistedSet): number {
    if (set.warmup == true) throw new Error('Volume calculation on warmup');

    const bodyweight = 200;
    var weight = set.weight + (bodyweight ? 200 : 0);
    var reps = set.reps;

    return weight * reps;
  }

  static goalPercentage(
    def: LiftDef,
    goals: PersistedSet[],
    current: LiftSet[],
  ): string {
    var goal1rm = goals.map(set => Utils.calculate1RM(def, set));

    var current1rm = current
      .filter(set => set.warmup != true)
      .map(set => Utils.calculate1RM(def, set));

    const average = (array: number[]) =>
      array.reduce((a, b) => a + b) / array.length;

    return ((average(current1rm) / average(goal1rm)) * 100).toFixed(1);
  }

  // TODO use library for this instead
  static generate_uuidv4() {
    var dt = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var rnd = Math.random() * 16; //random number in range 0 to 16
        rnd = (dt + rnd) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c === 'x' ? rnd : (rnd & 0x3) | 0x8).toString(16);
      },
    );
  }
}
