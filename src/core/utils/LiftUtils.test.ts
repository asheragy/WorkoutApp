import LiftUtils from './LiftUtils.ts';
import { Lifts, SystemLiftDefs } from '../LiftDatabase.ts';
import { Lift, WorkoutItem } from '../types/workout.ts';

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
  ].map(x => {
    return {
      ...x,
      instanceId: 'unused',
    };
  });

  // @ts-expect-error partial lifts are enough for grouping
  const grouped = LiftUtils.groupLifts(lifts);
  expect(grouped).toStrictEqual([
    [
      {
        id: '1a',
        instanceId: expect.any(String),
      },
      {
        id: '1b',
        alternate: true,
        instanceId: expect.any(String),
      },
    ],
    [
      {
        id: '2',
        instanceId: expect.any(String),
      },
    ],
    [
      {
        id: '3a',
        instanceId: expect.any(String),
      },
      {
        id: '3b',
        alternate: true,
        instanceId: expect.any(String),
      },
    ],
  ]);

  // @ts-expect-error partial lifts are enough for grouping
  const items = LiftUtils.toWorkoutItems(lifts);
  // Group instanceIds are freshly generated uuids, so only check their type.
  // `alternate` is dropped; the group carries that information now.
  expect(items).toStrictEqual([
    {
      kind: 'oneOf',
      instanceId: expect.any(String),
      lifts: [
        {
          id: '1a',
          instanceId: expect.any(String),
        },
        {
          id: '1b',
          instanceId: expect.any(String),
        },
      ],
    },
    {
      id: '2',
      instanceId: expect.any(String),
    },
    {
      kind: 'oneOf',
      instanceId: expect.any(String),
      lifts: [
        {
          id: '3a',
          instanceId: expect.any(String),
        },
        {
          id: '3b',
          instanceId: expect.any(String),
        },
      ],
    },
  ]);

  const flat = LiftUtils.flatten(items);
  expect(flat).toStrictEqual([
    {
      id: '1a',
      instanceId: expect.any(String),
    },
    {
      id: '1b',
      instanceId: expect.any(String),
    },
    {
      id: '2',
      instanceId: expect.any(String),
    },
    {
      id: '3a',
      instanceId: expect.any(String),
    },
    {
      id: '3b',
      instanceId: expect.any(String),
    },
  ]);
});

test('flatten', () => {
  const lift = (id: string): Lift => ({ id, instanceId: 'i' + id, sets: [] });
  const items: WorkoutItem[] = [
    { kind: 'oneOf', instanceId: 'g1', lifts: [lift('1a'), lift('1b')] },
    lift('2'),
    {
      kind: 'oneOf',
      instanceId: 'g3',
      lifts: [lift('3a'), lift('3b'), lift('3c')],
    },
  ];

  expect(LiftUtils.flatten(items).map(x => x.id)).toStrictEqual([
    '1a',
    '1b',
    '2',
    '3a',
    '3b',
    '3c',
  ]);
  expect(LiftUtils.flatten([])).toStrictEqual([]);

  // Lifts are the same objects, not copies, and carry no alternate flag.
  const flat = LiftUtils.flatten(items);
  expect(flat[0]).toBe((items[0] as { lifts: Lift[] }).lifts[0]);
  expect(flat.every(x => x.alternate === undefined)).toBe(true);
});

test('goal percentage', () => {
  const def = SystemLiftDefs[Lifts.pullover_dumbbell.id];
  const lift: Lift = {
    id: def.id,
    instanceId: '',
    sets: [
      { weight: 40, reps: 11 },
      { weight: 40, reps: 14 },
    ],
    goals: [
      { weight: 55, reps: 12 },
      { weight: 55, reps: 15 },
    ],
  };
  let percent = LiftUtils.goalPercent({}, def, lift);
  expect(percent).toBeCloseTo(0.7092, 4);

  lift.sets[1].reps = 15;
  percent = LiftUtils.goalPercent({}, def, lift);
  expect(percent).toBeCloseTo(0.7188, 4);
});
