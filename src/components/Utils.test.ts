import { LiftDef, LiftType } from '../types/types';
import Utils from './Utils';
import { LiftSet } from '../types/workout';
import { Lifts, SystemLifts } from '../repository/LiftDatabase';

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
  const normalized = Utils.normalizeSets(sets, def);
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
    muscleGroups: [],
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
  const def = Lifts.deadlift_barbell;
  let plates = Utils.calcPlates(def, 135);
  expect(plates).toStrictEqual({
    p45: 1,
  });

  plates = Utils.calcPlates(def, 405);
  expect(plates).toStrictEqual({
    p45: 4,
  });

  plates = Utils.calcPlates(def, 130);
  expect(plates).toStrictEqual({
    p25: 1,
    p10: 1,
    p5: 1,
    p2point5: 1,
  });

  plates = Utils.calcPlates(def, 175);
  expect(plates).toStrictEqual({
    p45: 1,
    p10: 2,
  });

  // Special bars
  plates = Utils.calcPlates(Lifts.deadlift_trapbar, 200);
  expect(plates).toStrictEqual({
    p45: 1,
    p25: 1,
  });

  plates = Utils.calcPlates(Lifts.squat_ssb, 300);
  expect(plates).toStrictEqual({
    p45: 2,
    p25: 1,
  });

  plates = Utils.calcPlates(Lifts.calfRaise_seated, 90);
  expect(plates).toStrictEqual({
    p45: 2,
  });
});

test('plate calculator - baseWeight override', () => {
  let def: LiftDef = {
    ...Lifts.deadlift_barbell,
    baseWeight: 55,
  };

  let plates = Utils.calcPlates(def, 135);
  expect(plates).toStrictEqual({
    p25: 1,
    p10: 1,
    p5: 1,
  });

  plates = Utils.calcPlates(def, 145);
  expect(plates).toStrictEqual({
    p45: 1,
  });

  def = {
    ...Lifts.calfRaise_seated,
    baseWeight: 20,
  };
  plates = Utils.calcPlates(def, 65);
  expect(plates).toStrictEqual({
    p45: 1,
  });
});

test('uuid', () => {
  const uuid = Utils.generate_uuidv4();
  expect(uuid.length).toEqual(36);
  expect(uuid).toEqual(uuid.toLowerCase());
});

test('groupLifts', () => {
  const lifts = [
    {
      id: '1a',
    },
    {
      id: '1b',
      alternate: true,
    },
    {
      id: '2',
    },
    {
      id: '3a',
    },
    {
      id: '3b',
      alternate: true,
    },
  ];

  // @ts-ignore
  const grouped = Utils.groupLifts(lifts);
  expect(grouped).toStrictEqual([
    [
      {
        id: '1a',
      },
      {
        id: '1b',
        alternate: true,
      },
    ],
    [
      {
        id: '2',
      },
    ],
    [
      {
        id: '3a',
      },
      {
        id: '3b',
        alternate: true,
      },
    ],
  ]);
});
