import {
  LiftDef,
  LiftType,
  NormalizedSet,
  PersistedSet,
  PlateCount,
} from '../types/types';
import { Lift, LiftSet } from '../types/workout';
import uuid from 'react-native-uuid';
import SetUtils from '../utils/SetUtils.ts';

export default class Utils {
  static calcPercentage(weight: number, trainingMax: number): number {
    return this.round((trainingMax * weight) / 100);
  }

  static round(x: number): number {
    return Math.round(x / 5) * 5;
  }

  // TODO if this took lift type it could add PlateCount as well
  static normalizeSets(sets: LiftSet[], def: LiftDef): NormalizedSet[] {
    const result: NormalizedSet[] = [];
    let counter = 1;

    sets.forEach(set => {
      let label = counter.toString();
      if (set.warmup) label = 'W';
      else counter++;

      let weight = set.weight;
      if (set.percentage) {
        if (def.trainingMax == undefined) {
          //console.error('Training max required for percentage');
          weight = -1;
        } else weight = this.round((def.trainingMax * set.weight) / 100);
      }

      const t: NormalizedSet = {
        // TODO depending on usages not sure if 0 is the correct default here
        weight: weight + 'lb',
        reps: set.reps + '',
        label: label,
        completed: set.completed ? true : false,
      };

      result.push(t);
    });

    return result;
  }

  static defToString(def: LiftDef) {
    if (def == undefined) return '';
    let result = def.name;

    if (def.multiple && def.type != LiftType.Bodyweight) {
      const type = LiftType[def.type]
        .replaceAll(LiftType[LiftType.MachinePlateSingle], 'Plate-Loaded')
        .replaceAll(LiftType[LiftType.MachinePlateDouble], 'Plate-Loaded')
        .replaceAll(LiftType[LiftType.MachineStack], 'Stack Machine');

      result += ` (${type})`;
    }

    return result;
  }

  static calculate1RM(def: LiftDef, set: LiftSet | PersistedSet): number {
    if (set.warmup == true) throw new Error('1RM calculation on warmup');
    // TODO bodyweight as parameter that is based on last tracked weight
    const bodyweight = 200;
    let weight = set.weight;
    const reps = set.reps;
    const type = def.type;

    if ('percentage' in set && set.percentage == true) {
      if (def.trainingMax === undefined) weight = -1;
      else weight = Utils.calcPercentage(weight, def.trainingMax);
    }

    if (type == LiftType.Bodyweight) weight += bodyweight;

    const sum =
      this.oneRMBrzycki(weight, reps) +
      this.oneRMEpley(weight, reps) +
      this.oneRMLombardi(weight, reps);

    return sum / 3;
  }

  static calculate1RMAverage(def: LiftDef, sets: PersistedSet[]): number {
    let sum = 0;
    let workSets = 0;

    for (let i = 0; i < sets.length; i++) {
      const set = sets[i];
      if (set.warmup != true) {
        sum += Utils.calculate1RM(def, set);
        workSets++;
      }
    }

    return Math.round(sum / workSets);
  }

  static goalPercent(def: LiftDef, lift: Lift): undefined | number {
    if (def.id != lift.id) throw new Error('Def must match lift Id');

    if (lift.sets.length > 0 && lift.goals && lift.goals.length > 0) {
      const sets = lift.sets
        .filter(x => !x.warmup)
        .map(x => SetUtils.setToPersisted(x));
      const goals = (lift.goals ?? []).map(x => SetUtils.setToPersisted(x));

      const percent =
        Utils.calculate1RMAverage(def, sets) /
        Utils.calculate1RMAverage(def, goals);

      return percent;
    }

    return undefined;
  }

  static oneRMLombardi = (weight: number, reps: number) =>
    weight * Math.pow(reps, 0.1);

  static oneRMBrzycki = (weight: number, reps: number) =>
    weight * (36 / (37 - reps));

  static oneRMEpley(weight: number, reps: number): number {
    if (reps == 1) return weight;
    return weight * (1 + reps / 30);
  }

  static calculateVolume(def: LiftDef, set: PersistedSet): number {
    if (set.warmup == true) throw new Error('Volume calculation on warmup');

    // TODO should be from global variable
    const bodyweight = 200;
    const weight =
      set.weight + (def.type == LiftType.Bodyweight ? bodyweight : 0);
    const reps = set.reps;

    return weight * reps;
  }

  static generate_uuidv4(): string {
    return uuid.v4();
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

  static platesToString(platecount: PlateCount): string {
    let i;
    const result: string[] = [];

    if (platecount.p45) {
      for (i = 0; i < platecount.p45; i++) result.push('45');
    }
    if (platecount.p25) {
      for (i = 0; i < platecount.p25; i++) result.push('25');
    }
    if (platecount.p10) {
      for (i = 0; i < platecount.p10; i++) result.push('10');
    }

    if (platecount.p5) {
      for (i = 0; i < platecount.p5; i++) result.push('5');
    }
    if (platecount.p2point5) {
      for (i = 0; i < platecount.p2point5; i++) result.push('2.5');
    }

    const str = result.join('|');

    if (str.length > 0) return '|' + str + '|';
    else return '';
  }

  static calcPlates(def: LiftDef, weight: number): PlateCount | undefined {
    let remaining;
    const type = def.type;
    const result: PlateCount = {};
    if (type == LiftType.Barbell || type == LiftType.MachinePlateDouble) {
      remaining = weight;

      if (def.baseWeight) remaining -= def.baseWeight;
      else if (type == LiftType.Barbell) remaining -= 45;

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
    } else if (type == LiftType.MachinePlateSingle) {
      remaining = weight;
      if (def.baseWeight) remaining -= def.baseWeight;

      while (remaining >= 45) {
        result.p45 = result.p45 ? result.p45 + 1 : 1;
        remaining -= 45;
      }

      if (remaining >= 25) {
        result.p25 = 1;
        remaining -= 25;
      }

      while (remaining >= 10) {
        result.p10 = result.p10 ? result.p10 + 1 : 1;
        remaining -= 10;
      }

      if (remaining >= 5) {
        result.p5 = 1;
        remaining -= 5;
      }

      if (remaining == 2.5) {
        result.p2point5 = 1;
      }

      return result;
    }

    return undefined;
  }
}
