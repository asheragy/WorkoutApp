import {
  GlobalSettings,
  LiftDef,
  LiftType,
  MuscleGroup,
  NormalizedSet,
  PersistedSet,
} from '../types/types';
import { LiftSet, Workout } from '../types/workout';
import Utils from '../components/Utils.ts';
import LiftUtils from './LiftUtils.ts';

export type WorkingSets = {
  group: string;
  sets: number;
};

const SetUtils = {
  incrementWeight(
    set: LiftSet,
    liftType: LiftType,
    settings: GlobalSettings,
  ): number {
    const current = set.weight;

    let step = 5;
    if (
      liftType == LiftType.MachineStack ||
      set.percentage ||
      liftType == LiftType.MachinePlateSingle ||
      liftType == LiftType.Bodyweight
    )
      step = 2.5;
    else if (
      liftType == LiftType.Dumbbell &&
      settings.largestHalfPoundDumbbell != undefined
    ) {
      if (current <= settings.largestHalfPoundDumbbell) step = 2.5;
    }

    return current + step;
  },

  decrementWeight(
    set: LiftSet,
    liftType: LiftType,
    settings: GlobalSettings,
  ): number {
    const current = set.weight;
    let step = 5;
    if (
      liftType == LiftType.MachineStack ||
      liftType == LiftType.MachinePlateSingle ||
      set.percentage
    )
      step = 2.5;
    else if (
      liftType == LiftType.Dumbbell &&
      settings.largestHalfPoundDumbbell != undefined
    ) {
      if (current <= settings.largestHalfPoundDumbbell) step = 2.5;
      else if (current - 2.5 == settings.largestHalfPoundDumbbell) step = 2.5;
    }

    return current - step;
  },

  // TODO limited scope and does not account for some things
  // TODO warmup?
  setToPersisted(set: LiftSet): PersistedSet {
    return {
      weight: set.weight,
      reps: set.reps,
    };
  },

  getSetsPerGroup(def: LiftDef): number[] {
    const weight = def.factor
      ? def.factor / (def.muscleGroups.length + 1)
      : 0.5;

    return [2 * weight, ...Array(def.muscleGroups.length - 1).fill(weight)];
  },

  getWorkingSets(
    defs: Record<string, LiftDef>,
    workouts: Workout[],
  ): WorkingSets[] {
    const result = new Map<MuscleGroup, number>();

    workouts.forEach(workout => {
      LiftUtils.groupLifts(workout.lifts).forEach(lifts => {
        lifts.forEach(lift => {
          const workSets =
            lift.sets.filter(set => !set.warmup).length / lifts.length;

          const def = defs[lift.id];
          const setsPerGroup = this.getSetsPerGroup(def);
          def.muscleGroups.forEach((group, index) => {
            const curr = result.get(group) ?? 0;
            result.set(group, curr + setsPerGroup[index] * workSets);
          });
        });
      });
    });

    const entries: WorkingSets[] = [];
    result.forEach((sets, group) =>
      entries.push({
        group: MuscleGroup[group],
        sets,
      }),
    );

    const total = entries.map(e => e.sets).reduce((a, b) => a + b, 0);
    entries.push({
      group: 'Total',
      sets: total,
    });

    return entries;
  },

  calcPlatesStr(def: LiftDef, weight: number): string {
    const plates = calcPlates(def, weight);
    const str = plates.join('|');

    if (str.length > 0) return '|' + str + '|';
    else return '';
  },

  normalizeSets(sets: LiftSet[], def: LiftDef): NormalizedSet[] {
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
        } else weight = Utils.round((def.trainingMax * set.weight) / 100);
      }

      const t: NormalizedSet = {
        // TODO depending on usages not sure if 0 is the correct default here
        weight: weight + 'lb',
        reps: set.reps + '',
        label: label,
        completed: !!set.completed,
        plates: this.calcPlatesStr(def, set.weight),
      };

      result.push(t);
    });

    return result;
  },

  calculateVolume(
    settings: GlobalSettings,
    def: LiftDef,
    sets: PersistedSet[],
  ): number {
    let sum = 0;
    for (let i = 0; i < sets.length; i++) {
      const set = sets[i];
      if (set.warmup != true) {
        const weight =
          set.weight +
          (def.type == LiftType.Bodyweight ? (settings.bodyweight ?? 0) : 0);

        sum += weight * set.reps;
      }
    }

    return sum;
  },

  calculate1RM(
    settings: GlobalSettings,
    def: LiftDef,
    set: LiftSet | PersistedSet,
  ): number {
    if (set.warmup == true) throw new Error('1RM calculation on warmup');

    let weight = set.weight;
    const reps = set.reps;
    const type = def.type;

    if ('percentage' in set && set.percentage == true) {
      weight = this.percentageToWeight(def, set);
    }

    if (type == LiftType.Bodyweight) weight += settings.bodyweight ?? 0;

    const sum =
      oneRMBrzycki(weight, reps) +
      oneRMEpley(weight, reps) +
      oneRMLombardi(weight, reps);

    return sum / 3;
  },

  calculate1RMAverage(
    settings: GlobalSettings,
    def: LiftDef,
    sets: PersistedSet[],
  ): number {
    const values = sets
      .filter(x => !x.warmup)
      .map(x => this.calculate1RM(settings, def, x));

    if (values.length === 0) return 0;

    const sum = values.reduce((a, b) => a + b, 0);
    return sum / values.length;
  },

  percentageToWeight(def: LiftDef, set: LiftSet): number {
    if (!def.trainingMax || !set.percentage) return -1;

    return Utils.round((def.trainingMax * set.weight) / 100);
  },
};

export function oneRMLombardi(weight: number, reps: number) {
  return weight * Math.pow(reps, 0.1);
}

export function oneRMBrzycki(weight: number, reps: number) {
  return weight * (36 / (37 - reps));
}

export function oneRMEpley(weight: number, reps: number): number {
  if (reps == 1) return weight;
  return weight * (1 + reps / 30);
}

function calcPlates(def: LiftDef, weight: number): number[] {
  let remaining;
  const type = def.type;
  const result: number[] = [];
  if (type == LiftType.Barbell || type == LiftType.MachinePlateDouble) {
    remaining = weight;

    if (def.baseWeight) remaining -= def.baseWeight;
    else if (type == LiftType.Barbell) remaining -= 45;

    while (remaining >= 90) {
      result.push(45);
      remaining -= 90;
    }

    if (remaining >= 50) {
      result.push(25);
      remaining -= 50;
    }

    while (remaining >= 20) {
      result.push(10);
      remaining -= 20;
    }

    if (remaining >= 10) {
      result.push(5);
      remaining -= 10;
    }

    if (remaining == 5) {
      result.push(2.5);
    }
  } else if (type == LiftType.MachinePlateSingle) {
    remaining = weight;
    if (def.baseWeight) remaining -= def.baseWeight;

    while (remaining >= 45) {
      result.push(45);
      remaining -= 45;
    }

    if (remaining >= 25) {
      result.push(25);
      remaining -= 25;
    }

    while (remaining >= 10) {
      result.push(10);
      remaining -= 10;
    }

    if (remaining >= 5) {
      result.push(5);
      remaining -= 5;
    }

    if (remaining == 2.5) {
      result.push(2.5);
    }
  }

  return result;
}

export default SetUtils;
