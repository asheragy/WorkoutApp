import {GlobalSettings, LiftSet, LiftType} from '../types/types';
import Utils from './Utils';

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
