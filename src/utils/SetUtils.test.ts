import { GlobalSettings, LiftDef, LiftType, MuscleGroup } from '../types/types';
import { Lift, LiftSet, Workout } from '../types/workout';
import SetUtils from './SetUtils';
import { Lifts } from '../repository/LiftDatabase.ts';
import { TestLiftDefs } from '../test-utils/Common.ts';

test('increment/decrement dumbbell - maxSet', () => {
  const settings: GlobalSettings = {
    largestHalfPoundDumbbell: 47.5,
  };
  const liftType = LiftType.Dumbbell;

  const set: LiftSet = {
    weight: 40,
    reps: 1,
  };

  // Increment
  set.weight = SetUtils.incrementWeight(set, liftType, settings);
  expect(set.weight).toBe(42.5);
  set.weight = SetUtils.incrementWeight(set, liftType, settings);
  expect(set.weight).toBe(45);
  set.weight = SetUtils.incrementWeight(set, liftType, settings);
  expect(set.weight).toBe(47.5);
  set.weight = SetUtils.incrementWeight(set, liftType, settings);
  expect(set.weight).toBe(50);
  set.weight = SetUtils.incrementWeight(set, liftType, settings);
  expect(set.weight).toBe(55);

  // Decrement
  set.weight = SetUtils.decrementWeight(set, liftType, settings);
  expect(set.weight).toBe(50);
  set.weight = SetUtils.decrementWeight(set, liftType, settings);
  expect(set.weight).toBe(47.5);
  set.weight = SetUtils.decrementWeight(set, liftType, settings);
  expect(set.weight).toBe(45);
});

test('setsPerGroup', () => {
  var oneGroup = [MuscleGroup.Quads];
  var twoGroup = [MuscleGroup.Quads, MuscleGroup.Hamstrings];
  var threeGroup = [
    MuscleGroup.Quads,
    MuscleGroup.Hamstrings,
    MuscleGroup.Glutes,
  ];

  const def: LiftDef = {
    id: '',
    muscleGroups: oneGroup,
    name: '',
    type: LiftType.Barbell,
  };

  expect(SetUtils.getSetsPerGroup(def)).toStrictEqual([1]);
  expect(
    SetUtils.getSetsPerGroup({
      ...def,
      muscleGroups: twoGroup,
    }),
  ).toStrictEqual([1, 0.5]);
  expect(
    SetUtils.getSetsPerGroup({
      ...def,
      muscleGroups: threeGroup,
    }),
  ).toStrictEqual([1, 0.5, 0.5]);

  // With factor
  expect(
    SetUtils.getSetsPerGroup({
      ...def,
      muscleGroups: oneGroup,
      factor: 1.25,
    }),
  ).toStrictEqual([1.25]);
  expect(
    SetUtils.getSetsPerGroup({
      ...def,
      muscleGroups: twoGroup,
      factor: 1.5,
    }),
  ).toStrictEqual([1, 0.5]);

  expect(
    SetUtils.getSetsPerGroup({
      ...def,
      muscleGroups: twoGroup,
      factor: 1.25,
    }),
  ).toStrictEqual([0.8333333333333334, 0.4166666666666667]);

  expect(
    SetUtils.getSetsPerGroup({
      ...def,
      muscleGroups: threeGroup,
      factor: 4,
    }),
  ).toStrictEqual([2, 1, 1]);
});

test('working sets', () => {
  let workout: Workout = {
    name: '',
    lifts: [lift(Lifts.bench_barbell.id, 3)],
  };

  let sets = SetUtils.getWorkingSets(TestLiftDefs, [workout]);
  expect(sets).toStrictEqual([
    { group: 'Chest', sets: 3 },
    { group: 'Triceps', sets: 1.5 },
    { group: 'Total', sets: 4.5 },
  ]);

  workout = {
    name: '',
    lifts: [lift(Lifts.bench_barbell.id, 3), lift(Lifts.bench_dumbbell.id, 1)],
  };
  sets = SetUtils.getWorkingSets(TestLiftDefs, [workout]);
  expect(sets).toStrictEqual([
    { group: 'Chest', sets: 4 },
    { group: 'Triceps', sets: 2 },
    { group: 'Total', sets: 6 },
  ]);

  // Alternate is averaged
  workout = {
    name: '',
    lifts: [
      lift(Lifts.bench_barbell.id, 3),
      lift(Lifts.bench_dumbbell.id, 1, true),
    ],
  };
  sets = SetUtils.getWorkingSets(TestLiftDefs, [workout]);
  expect(sets).toStrictEqual([
    { group: 'Chest', sets: 2 },
    { group: 'Triceps', sets: 1 },
    { group: 'Total', sets: 3 },
  ]);

  workout = {
    name: '',
    lifts: [
      lift(Lifts.bench_barbell.id, 2),
      lift(Lifts.squat_barbell.id, 2, true),
    ],
  };
  sets = SetUtils.getWorkingSets(TestLiftDefs, [workout]);
  expect(sets).toStrictEqual([
    { group: 'Chest', sets: 1 },
    { group: 'Triceps', sets: 0.5 },
    { group: 'Quads', sets: 1 },
    { group: 'Glutes', sets: 0.5 },
    { group: 'Total', sets: 3 },
  ]);

  // Factor
  workout = {
    name: '',
    lifts: [lift(Lifts.deadlift_barbell.id, 1)],
  };
  sets = SetUtils.getWorkingSets(TestLiftDefs, [workout]);
  expect(sets).toStrictEqual([
    { group: 'Glutes', sets: 1 },
    { group: 'Hamstrings', sets: 0.5 },
    { group: 'LowerBack', sets: 0.5 },
    { group: 'Total', sets: 2 },
  ]);

  workout = {
    name: '',
    lifts: [lift(Lifts.backExtension.id, 1)],
  };
  sets = SetUtils.getWorkingSets(TestLiftDefs, [workout]);
  expect(sets).toStrictEqual([
    { group: 'LowerBack', sets: 0.625 },
    { group: 'Hamstrings', sets: 0.3125 },
    { group: 'Glutes', sets: 0.3125 },
    { group: 'Total', sets: 1.25 },
  ]);
});

function lift(id: string, sets: number, alt?: boolean): Lift {
  return {
    id: id,
    instanceId: '',
    sets: Array.from({ length: sets }, () => ({
      weight: 100,
      reps: 10,
    })),
    alternate: alt,
  };
}
