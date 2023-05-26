import {
  GlobalSettings,
  LiftDef,
  LiftType,
  NormalizedSet,
  PersistedSet,
  PlateCount,
  TrainingMax,
} from '../types/types';
import {LiftSet} from '../types/workout';

export default class Utils {
  static calcPercentage(weight: number, tm: TrainingMax): number {
    return this.round((tm.max * weight) / 100);
  }

  static round(x: number): number {
    return Math.round(x / 5) * 5;
  }

  static normalizeSets(sets: LiftSet[], tm?: TrainingMax): NormalizedSet[] {
    var result: NormalizedSet[] = [];
    var counter = 1;

    sets.forEach(set => {
      var label = counter.toString();
      if (set.warmup) label = 'W';
      else if (set.percentage) label = '%';
      else counter++;

      var weight = set.weight;
      if (set.percentage && set.weight) {
        if (tm == undefined) {
          //console.error('Training max required for percentage');
          weight = -1;
        } else weight = this.round((tm.max * set.weight) / 100);
      }

      var t: NormalizedSet = {
        // TODO depending on usages not sure if 0 is the correct default here
        weight: (weight || 0) + 'lb',
        reps: (set.reps || 0) + '',
        label: label,
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

  static calculate1RM(
    def: LiftDef,
    set: LiftSet | PersistedSet,
    tm?: TrainingMax,
  ): number {
    if (set.warmup == true) throw new Error('1RM calculation on warmup');
    // TODO bodyweight as parameter that is based on last tracked weight
    const bodyweight = 200;
    var weight = typeof set.weight === 'number' ? set.weight : set.weight || 0;
    const reps = typeof set.reps === 'number' ? set.reps : set.reps || 0;

    if ('percentage' in set && set.percentage == true) {
      if (tm === undefined) weight = -1;
      else weight = Utils.calcPercentage(weight, tm);
    }

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
    tm?: TrainingMax,
  ): string {
    var goal1rm = goals.map(set => Utils.calculate1RM(def, set));

    var current1rm = current
      .filter(set => set.warmup != true)
      .map(set => Utils.calculate1RM(def, set, tm));

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

  static lastCompleted(date: Date | undefined): string {
    if (date == undefined) return 'Never';

    const hour = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hour >= 12 ? 'pm' : 'am';

    return `${date.getMonth() + 1}/${date.getDate()} at ${hour % 12}:${
      minutes > 9 ? minutes : '0' + minutes
    }${ampm}`;
  }

  static calcPlates(type: LiftType, weight: number): PlateCount {
    var result: PlateCount = {};
    if (type == LiftType.Barbell) {
      var remaining = weight - 45;

      while (remaining >= 90) {
        result.p45 = result.p45 ? result.p45 + 1 : 1;
        remaining -= 90;
      }

      if (remaining >= 50) {
        result.p25 = 1;
        remaining -= 50;
      }

      while (remaining >= 20) {
        result.p10 = result.p10 ? result.p10 + 1 : 1;
        remaining -= 20;
      }

      if (remaining >= 10) {
        result.p5 = 1;
        remaining -= 10;
      }

      if (remaining == 5) {
        result.p2point5 = 1;
      }

      return result;
    }

    throw new Error('Unable to calculate plates for ' + type.toString());
  }
}
