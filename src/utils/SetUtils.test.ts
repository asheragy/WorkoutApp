import {GlobalSettings, LiftType} from '../types/types';
import {LiftSet} from '../types/workout';
import SetUtils from './SetUtils';

test('increment/decrement dumbbell - maxSet', () => {
  const settings: GlobalSettings = {
    largestHalfPoundDumbbell: 47.5,
  };
  const liftType = LiftType.Dumbbell;

  var set: LiftSet = {
    weight: 40,
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
