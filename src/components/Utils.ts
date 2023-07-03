import {
  GlobalSettings,
  LiftDef,
  LiftType,
  NormalizedSet,
  PersistedSet,
  PlateCount,
} from '../types/types';
import {LiftSet} from '../types/workout';

export default class Utils {
  static calcPercentage(weight: number, trainingMax: number): number {
    return this.round((trainingMax * weight) / 100);
  }

  static round(x: number): number {
    return Math.round(x / 5) * 5;
  }

  // TODO if this took lift type it could add PlateCount as well
  static normalizeSets(sets: LiftSet[], def: LiftDef): NormalizedSet[] {
    var result: NormalizedSet[] = [];
    var counter = 1;

    sets.forEach(set => {
      var label = counter.toString();
      if (set.warmup) label = 'W';
      else if (set.percentage) label = '%';
      else counter++;

      var weight = set.weight;
      if (set.percentage && set.weight) {
        if (def.trainingMax == undefined) {
          //console.error('Training max required for percentage');
          weight = -1;
        } else weight = this.round((def.trainingMax * set.weight) / 100);
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

  static calculate1RM(def: LiftDef, set: LiftSet | PersistedSet): number {
    if (set.warmup == true) throw new Error('1RM calculation on warmup');
    // TODO bodyweight as parameter that is based on last tracked weight
    const bodyweight = 200;
    var weight = typeof set.weight === 'number' ? set.weight : set.weight || 0;
    const reps = typeof set.reps === 'number' ? set.reps : set.reps || 0;
    const type = def.type;

    if ('percentage' in set && set.percentage == true) {
      if (def.trainingMax === undefined) weight = -1;
      else weight = Utils.calcPercentage(weight, def.trainingMax);
    }

    if (type == LiftType.Bodyweight) weight += bodyweight;

    return weight + weight * 0.0333 * reps;
  }

  static calculateVolume(def: LiftDef, set: PersistedSet): number {
    if (set.warmup == true) throw new Error('Volume calculation on warmup');

    const bodyweight = 200;
    var weight = set.weight + (bodyweight ? 200 : 0);
    var reps = set.reps;

    return weight * reps;
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

  static calcPlates(type: LiftType, weight: number): PlateCount | undefined {
    var result: PlateCount = {};
    if (
      type == LiftType.Barbell ||
      type == LiftType.SSB ||
      type == LiftType.TrapBar
    ) {
      var remaining = weight;

      if (type == LiftType.Barbell) remaining -= 45;
      else if (type == LiftType.SSB) remaining -= 70;
      else if (type == LiftType.TrapBar) remaining -= 60;

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

    return undefined;
  }
}
