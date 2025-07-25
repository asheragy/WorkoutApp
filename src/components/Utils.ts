import {
  LiftDef,
  LiftType,
  NormalizedSet,
  PersistedSet,
  PlateCount,
} from '../types/types';
import {LiftSet} from '../types/workout';
import uuid from 'react-native-uuid';

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
      let type = LiftType[def.type].replaceAll('PlateMachine', 'Plate-Loaded');
      result += ` (${type})`;
    }

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

    const sum =
      this.oneRMBrzycki(weight, reps) +
      this.oneRMEpley(weight, reps) +
      this.oneRMLombardi(weight, reps);

    return sum / 3;
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
    var weight =
      set.weight + (def.type == LiftType.Bodyweight ? bodyweight : 0);
    var reps = set.reps;

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
    var result: string[] = [];

    if (platecount.p45) {
      for (var i = 0; i < platecount.p45; i++) result.push('45');
    }
    if (platecount.p25) {
      for (var i = 0; i < platecount.p25; i++) result.push('25');
    }
    if (platecount.p10) {
      for (var i = 0; i < platecount.p10; i++) result.push('10');
    }

    if (platecount.p5) {
      for (var i = 0; i < platecount.p5; i++) result.push('5');
    }
    if (platecount.p2point5) {
      for (var i = 0; i < platecount.p2point5; i++) result.push('2.5');
    }

    var str = result.join('|');

    if (str.length > 0) return '|' + str + '|';
    else return '';
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
    } else if (type == LiftType.PlateMachine) {
      var remaining = weight;

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
