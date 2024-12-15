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

const ONE_RM_REPS = [1, 2, 5, 10, 20, 30];
test('calc 1RM', () => {
  const def: LiftDef = {
    id: '',
    name: '',
    type: LiftType.Barbell,
  };

  const oneRM = ONE_RM_REPS.map(r => {
    const set: LiftSet = {
      weight: 200,
      reps: r,
    };

    return Math.round(Utils.calculate1RM(def, set) * 10) / 10;
  });

  expect(oneRM).toStrictEqual([200, 211.1, 231.1, 261.7, 342.2, 569.9]);
});

test('calc 1RM percentage', () => {
  const def: LiftDef = {
    id: '',
    name: '',
    type: LiftType.Barbell,
    trainingMax: 250,
  };

  const oneRM = ONE_RM_REPS.map(r => {
    const set: LiftSet = {
      weight: 80, // 80% of training max = 200
      reps: r,
      percentage: true,
    };

    return Math.round(Utils.calculate1RM(def, set) * 10) / 10;
  });

  expect(oneRM).toStrictEqual([200, 211.1, 231.1, 261.7, 342.2, 569.9]);
});

test('1RM Lombardi', () => {
  const oneRM = ONE_RM_REPS.map(
    r => Math.round(Utils.oneRMLombardi(200, r) * 10) / 10,
  );

  expect(oneRM).toStrictEqual([200, 214.4, 234.9, 251.8, 269.9, 281]);
});

test('1RM Epley', () => {
  const oneRM = ONE_RM_REPS.map(
    r => Math.round(Utils.oneRMEpley(200, r) * 10) / 10,
  );

  expect(oneRM).toStrictEqual([200, 213.3, 233.3, 266.7, 333.3, 400]);
});

test('1RM Brzycki', () => {
  const oneRM = ONE_RM_REPS.map(
    r => Math.round(Utils.oneRMBrzycki(200, r) * 10) / 10,
  );

  expect(oneRM).toStrictEqual([200, 205.7, 225, 266.7, 423.5, 1028.6]);
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
