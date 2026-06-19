import { GlobalSettings, LiftDef, LiftType, MuscleGroup } from '../types/types';
import { Lift, LiftSet, Workout } from '../types/workout';
import { Lifts, SystemLifts } from '../repository/LiftDatabase.ts';
import { TestLiftDefs } from '../test-utils/Common.ts';
import SetUtils, {
  oneRMBrzycki,
  oneRMEpley,
  oneRMLombardi,
} from './SetUtils.ts';

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
  const oneGroup = [MuscleGroup.Quads];
  const twoGroup = [MuscleGroup.Quads, MuscleGroup.Hamstrings];
  const threeGroup = [
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
      lift(Lifts.squat_barbell.id, 3, true),
    ],
  };
  sets = SetUtils.getWorkingSets(TestLiftDefs, [workout]);
  expect(sets).toStrictEqual([
    { group: 'Chest', sets: 1 },
    { group: 'Triceps', sets: 0.5 },
    { group: 'Quads', sets: 1.75 },
    { group: 'Glutes', sets: 0.875 },
    { group: 'Total', sets: 4.125 },
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

test('plate calculator', () => {
  const def = Lifts.deadlift_barbell;
  expect(SetUtils.calcPlatesStr(def, 135)).toEqual('|45|');
  expect(SetUtils.calcPlatesStr(def, 405)).toEqual('|45|45|45|45|');
  expect(SetUtils.calcPlatesStr(def, 130)).toEqual('|25|10|5|2.5|');
  expect(SetUtils.calcPlatesStr(def, 175)).toEqual('|45|10|10|');

  // Special bars
  expect(SetUtils.calcPlatesStr(Lifts.deadlift_trapbar, 200)).toEqual(
    '|45|25|',
  );
  expect(SetUtils.calcPlatesStr(Lifts.squat_ssb, 300)).toEqual('|45|45|25|');

  // Single plate loaded
  expect(SetUtils.calcPlatesStr(Lifts.calfRaise_seated, 90)).toEqual('|45|45|');
  // Double
  expect(SetUtils.calcPlatesStr(Lifts.legPress, 180)).toEqual('|45|45|');
});

test('plate calculator - baseWeight override', () => {
  let def: LiftDef = {
    ...Lifts.deadlift_barbell,
    baseWeight: 55,
  };

  expect(SetUtils.calcPlatesStr(def, 135)).toEqual('|25|10|5|');
  expect(SetUtils.calcPlatesStr(def, 145)).toEqual('|45|');

  def = {
    ...Lifts.calfRaise_seated,
    baseWeight: 20,
  };
  expect(SetUtils.calcPlatesStr(def, 65)).toEqual('|45|');
});

test('normalizeSets repeated lifts', () => {
  const sets: LiftSet[] = [
    {
      weight: 100,
      reps: 5,
    },
    {
      weight: 110,
      reps: 10,
    },
    {
      weight: 110,
      reps: 10,
    },
    {
      weight: 110,
      reps: 10,
    },
  ];

  const def = SystemLifts[0];
  const normalized = SetUtils.normalizeSets(sets, def);
  expect(normalized.length).toBe(4);
  expect(normalized[0].weight).toBe('100lb');
  expect(normalized[1].weight).toBe('110lb');
  expect(normalized[2].weight).toBe('110lb');
  expect(normalized[3].weight).toBe('110lb');
});

const ONE_RM_REPS = [1, 2, 5, 10, 20, 30];
test('calc 1RM', () => {
  const def: LiftDef = {
    id: '',
    name: '',
    type: LiftType.Barbell,
    muscleGroups: [],
  };

  const oneRM = ONE_RM_REPS.map(r => {
    const set: LiftSet = {
      weight: 200,
      reps: r,
    };

    return Math.round(SetUtils.calculate1RM(def, set) * 10) / 10;
  });

  expect(oneRM).toStrictEqual([200, 211.1, 231.1, 261.7, 342.2, 569.9]);
});

test('calc 1RM percentage', () => {
  const def: LiftDef = {
    id: '',
    name: '',
    type: LiftType.Barbell,
    trainingMax: 250,
    muscleGroups: [],
  };

  const oneRM = ONE_RM_REPS.map(r => {
    const set: LiftSet = {
      weight: 80, // 80% of training max = 200
      reps: r,
      percentage: true,
    };

    return Math.round(SetUtils.calculate1RM(def, set) * 10) / 10;
  });

  expect(oneRM).toStrictEqual([200, 211.1, 231.1, 261.7, 342.2, 569.9]);
});

test('1RM Lombardi', () => {
  const oneRM = ONE_RM_REPS.map(
    r => Math.round(oneRMLombardi(200, r) * 10) / 10,
  );

  expect(oneRM).toStrictEqual([200, 214.4, 234.9, 251.8, 269.9, 281]);
});

test('1RM Epley', () => {
  const oneRM = ONE_RM_REPS.map(r => Math.round(oneRMEpley(200, r) * 10) / 10);

  expect(oneRM).toStrictEqual([200, 213.3, 233.3, 266.7, 333.3, 400]);
});

test('1RM Brzycki', () => {
  const oneRM = ONE_RM_REPS.map(
    r => Math.round(oneRMBrzycki(200, r) * 10) / 10,
  );

  expect(oneRM).toStrictEqual([200, 205.7, 225, 266.7, 423.5, 1028.6]);
});

test('percentageToWeight', () => {
  const def: LiftDef = Lifts.deadlift_barbell;
  def.trainingMax = 200;
  const set: LiftSet = { reps: 0, weight: 80 };
  expect(SetUtils.percentageToWeight(def, set)).toEqual(-1);

  set.percentage = true;
  expect(SetUtils.percentageToWeight(def, set)).toEqual(160);
  set.weight = 81;
  expect(SetUtils.percentageToWeight(def, set)).toEqual(160);
  set.weight = 82;
  expect(SetUtils.percentageToWeight(def, set)).toEqual(165);

  def.trainingMax = undefined;
  expect(SetUtils.percentageToWeight(def, set)).toEqual(-1);
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
