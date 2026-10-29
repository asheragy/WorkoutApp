import LiftUtils from './LiftUtils.ts';
import { Lifts, SystemLiftDefs } from '../LiftDatabase.ts';
import { Lift, WorkoutItem } from '../types/workout.ts';

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

  // Lifts are the same objects, not copies
  const flat = LiftUtils.flatten(items);
  expect(flat[0]).toBe((items[0] as { lifts: Lift[] }).lifts[0]);
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

test('replaceLift', () => {
  const lift = (instanceId: string, reps = 5): Lift => ({
    id: 'x',
    instanceId,
    sets: [{ weight: 100, reps }],
  });
  const items: WorkoutItem[] = [
    lift('a'),
    { kind: 'oneOf', instanceId: 'g', lifts: [lift('b'), lift('c')] },
  ];

  expect(LiftUtils.replaceLift(items, lift('a', 8))).toStrictEqual([
    lift('a', 8),
    items[1],
  ]);

  expect(LiftUtils.replaceLift(items, lift('c', 8))).toStrictEqual([
    items[0],
    { kind: 'oneOf', instanceId: 'g', lifts: [lift('b'), lift('c', 8)] },
  ]);

  expect(LiftUtils.replaceLift(items, lift('missing'))).toBeUndefined();

  // Input is not mutated
  expect(items[0]).toStrictEqual(lift('a'));
});
