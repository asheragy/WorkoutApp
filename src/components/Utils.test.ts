import {TextPropTypes} from 'react-native';
import {
  GlobalSettings,
  LiftDef,
  LiftType,
  PersistedSet,
  PlateCount,
  TrainingMax,
} from '../types/types';
import Utils from './Utils';
import {LiftSet} from '../types/workout';

export {};

test('normalizeSets repeated lifts', () => {
  var sets: LiftSet[] = [
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

  var normalized = Utils.normalizeSets(sets);
  expect(normalized.length).toBe(4);
  expect(normalized[0].weight).toBe('100lb');
  expect(normalized[1].weight).toBe('110lb');
  expect(normalized[2].weight).toBe('110lb');
  expect(normalized[3].weight).toBe('110lb');
});

test('increment/decrement dumbbell - maxSet', () => {
  const settings: GlobalSettings = {
    largestHalfPoundDumbbell: 47.5,
  };
  const liftType = LiftType.Dumbbell;
  var currentWeight = 40;

  // Increment
  currentWeight = Utils.incrementWeight(currentWeight, liftType, settings);
  expect(currentWeight).toBe(42.5);
  currentWeight = Utils.incrementWeight(currentWeight, liftType, settings);
  expect(currentWeight).toBe(45);
  currentWeight = Utils.incrementWeight(currentWeight, liftType, settings);
  expect(currentWeight).toBe(47.5);
  currentWeight = Utils.incrementWeight(currentWeight, liftType, settings);
  expect(currentWeight).toBe(50);
  currentWeight = Utils.incrementWeight(currentWeight, liftType, settings);
  expect(currentWeight).toBe(55);

  // Decrement
  currentWeight = Utils.decrementWeight(currentWeight, liftType, settings);
  expect(currentWeight).toBe(50);
  currentWeight = Utils.decrementWeight(currentWeight, liftType, settings);
  expect(currentWeight).toBe(47.5);
  currentWeight = Utils.decrementWeight(currentWeight, liftType, settings);
  expect(currentWeight).toBe(45);
});

test('calc 1RM', () => {
  const def: LiftDef = {
    id: '',
    name: '',
    type: LiftType.Barbell,
  };

  var set: LiftSet = {
    weight: 100,
    reps: 10,
  };

  var oneRM = Utils.calculate1RM(def, set);
  expect(oneRM).toBe(133.3);

  // Percentage
  set.percentage = true;
  set.weight = 50;

  const tm: TrainingMax = {id: '', max: 200};
  var oneRM = Utils.calculate1RM(def, set, tm);
  expect(oneRM).toBe(133.3);
});

test('goal percentage', () => {
  const def: LiftDef = {
    id: '',
    name: '',
    type: LiftType.Barbell,
  };

  const goal: PersistedSet[] = [
    {weight: 85, reps: 12},
    {weight: 80, reps: 12},
    {weight: 75, reps: 12},
  ];
  const current: LiftSet[] = [
    {weight: 80, reps: 10},
    {weight: 75, reps: 10},
    {weight: 70, reps: 15},
  ];
  var percentage = Utils.goalPercentage(def, goal, current);
  expect(percentage).toBe('92.8');

  current[1].reps = 15;
  current[2].reps = 10;

  percentage = Utils.goalPercentage(def, goal, current);
  expect(percentage).toBe('93.0');

  // Percentage lift
  /*
  const tm: TrainingMax = {id: '', max: 85};
  current[0].percentage = true;
  current[0].weight = 100;
  percentage = Utils.goalPercentage(def, goal, current, tm);
  expect(percentage).toBe('93.0');
  */
});

test('plate calculator', () => {
  var plates: PlateCount = Utils.calcPlates(LiftType.Barbell, 135);
  expect(plates).toStrictEqual({
    p45: 1,
  });

  var plates: PlateCount = Utils.calcPlates(LiftType.Barbell, 405);
  expect(plates).toStrictEqual({
    p45: 4,
  });

  var plates: PlateCount = Utils.calcPlates(LiftType.Barbell, 130);
  expect(plates).toStrictEqual({
    p25: 1,
    p10: 1,
    p5: 1,
    p2point5: 1,
  });

  var plates: PlateCount = Utils.calcPlates(LiftType.Barbell, 175);
  expect(plates).toStrictEqual({
    p45: 1,
    p10: 2,
  });
});
