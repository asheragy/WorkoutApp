import {
  GlobalSettings,
  LiftDef,
  LiftType,
  MuscleGroup,
  PersistedSet,
} from '../types/types';
import { LiftSet, Workout } from '../types/workout';
import Utils from '../components/Utils.ts';

export type WorkingSets = {
  group: string;
  sets: number;
};

export default class SetUtils {
  static incrementWeight(
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
  }

  static decrementWeight(
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
  }

  // TODO limited scope and does not account for some things
  // TODO warmup?
  static setToPersisted(set: LiftSet): PersistedSet {
    return {
      weight: set.weight,
      reps: set.reps,
    };
  }

  static getSetsPerGroup(def: LiftDef): number[] {
    const weight = def.factor
      ? def.factor / (def.muscleGroups.length + 1)
      : 0.5;

    return [2 * weight, ...Array(def.muscleGroups.length - 1).fill(weight)];
  }

  static getWorkingSets(
    defs: Record<string, LiftDef>,
    workouts: Workout[],
  ): WorkingSets[] {
    const result = new Map<MuscleGroup, number>();

    workouts.forEach(workout => {
      Utils.groupLifts(workout.lifts).forEach(lifts => {
        lifts.forEach(lift => {
          const workSets =
            lift.sets.filter(set => !set.warmup).length / lifts.length;

          const def = defs[lift.id];
          const setsPerGroup = this.getSetsPerGroup(def);
          def.muscleGroups.forEach((group, index) => {
            let curr = result.get(group) ?? 0;
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
  }
}
