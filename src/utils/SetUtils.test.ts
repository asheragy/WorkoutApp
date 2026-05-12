import { GlobalSettings, LiftType } from '../types/types';
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
