import {TextPropTypes} from 'react-native';
import {
  GlobalSettings,
  LiftDef,
  LiftType,
  PersistedSet,
} from '../types/types';
import Utils from './Utils';
import { LiftSet } from '../types/workout';

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
});
