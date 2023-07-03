import {GlobalSettings, LiftDef, LiftType, PersistedSet} from '../types/types';
import Utils from './Utils';
import {LiftSet} from '../types/workout';
import {SystemLifts} from '../repository/LiftDatabase';

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

  var def = SystemLifts[0];
  var normalized = Utils.normalizeSets(sets, def);
  expect(normalized.length).toBe(4);
  expect(normalized[0].weight).toBe('100lb');
  expect(normalized[1].weight).toBe('110lb');
  expect(normalized[2].weight).toBe('110lb');
  expect(normalized[3].weight).toBe('110lb');
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

  def.trainingMax = 200;
  var oneRM = Utils.calculate1RM(def, set);
  expect(oneRM).toBe(133.3);
});

test('plate calculator', () => {
  var plates = Utils.calcPlates(LiftType.Barbell, 135);
  expect(plates).toStrictEqual({
    p45: 1,
  });

  plates = Utils.calcPlates(LiftType.Barbell, 405);
  expect(plates).toStrictEqual({
    p45: 4,
  });

  plates = Utils.calcPlates(LiftType.Barbell, 130);
  expect(plates).toStrictEqual({
    p25: 1,
    p10: 1,
    p5: 1,
    p2point5: 1,
  });

  plates = Utils.calcPlates(LiftType.Barbell, 175);
  expect(plates).toStrictEqual({
    p45: 1,
    p10: 2,
  });

  // Special bars
  plates = Utils.calcPlates(LiftType.TrapBar, 200);
  expect(plates).toStrictEqual({
    p45: 1,
    p25: 1,
  });

  plates = Utils.calcPlates(LiftType.SSB, 300);
  expect(plates).toStrictEqual({
    p45: 2,
    p25: 1,
  });
});
