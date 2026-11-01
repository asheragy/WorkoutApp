import LiftUtils from './LiftUtils.ts';
import { Lifts, SystemLiftDefs } from '../LiftDatabase.ts';
import { isLiftGroup, Lift, WorkoutItem } from '../types/workout.ts';

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

describe('group editing', () => {
  const lift = (id: string): Lift => ({ id, instanceId: 'i' + id, sets: [] });
  const group = (id: string, ...lifts: Lift[]): WorkoutItem => ({
    kind: 'oneOf',
    instanceId: id,
    lifts,
  });
  const a = lift('a');
  const b = lift('b');
  const c = lift('c');
  const d = lift('d');
  const e = lift('e');
  // [a, (b c), d, (e)] is invalid so use: a, (b c d), e
  const items: WorkoutItem[] = [a, group('g', b, c, d), e];

  test('joinGroup', () => {
    // Plain lift onto a plain lift makes a new group in the target's place
    const joined = LiftUtils.joinGroup(items, 'ie', a, 'last');
    expect(joined).toHaveLength(2);
    expect(joined[0]).toBe(items[1]);
    const g2 = joined[1];
    expect(isLiftGroup(g2) && g2.lifts).toStrictEqual([e, a]);
    expect(g2.instanceId).not.toBe('ie');

    // Onto an existing group keeps the group's id
    expect(LiftUtils.joinGroup(items, 'g', a, 'first')).toStrictEqual([
      group('g', a, b, c, d),
      e,
    ]);
    expect(LiftUtils.joinGroup(items, 'g', e, 'last')).toStrictEqual([
      a,
      group('g', b, c, d, e),
    ]);

    // A lift that is not in items (from another workout) is simply added
    const f = lift('f');
    expect(LiftUtils.joinGroup(items, 'g', f, 'last')).toStrictEqual([
      a,
      group('g', b, c, d, f),
      e,
    ]);

    expect(() => LiftUtils.joinGroup(items, 'nope', a, 'last')).toThrow();
    expect(items).toStrictEqual([a, group('g', b, c, d), e]);
  });

  test('takeFromGroup / insertIntoGroup', () => {
    expect(LiftUtils.takeFromGroup(items, 'g', 1)).toStrictEqual([
      [a, group('g', b, d), e],
      c,
    ]);
    // Group of two collapses to the remaining lift
    expect(
      LiftUtils.takeFromGroup([group('h', b, c)], 'h', 0),
    ).toStrictEqual([[c], b]);

    expect(LiftUtils.insertIntoGroup(items, 'g', 0, a)).toStrictEqual([
      a,
      group('g', a, b, c, d),
      e,
    ]);
    // Index past the end appends
    expect(LiftUtils.insertIntoGroup(items, 'g', 99, a)).toStrictEqual([
      a,
      group('g', b, c, d, a),
      e,
    ]);

    expect(() => LiftUtils.takeFromGroup(items, 'g', 3)).toThrow();
    expect(() => LiftUtils.takeFromGroup(items, 'ia', 0)).toThrow();
    expect(() => LiftUtils.insertIntoGroup(items, 'x', 0, a)).toThrow();
  });

  test('removeFromGroup', () => {
    expect(LiftUtils.removeFromGroup(items, 'g', 'ic')).toStrictEqual([
      a,
      group('g', b, d),
      c,
      e,
    ]);
    // Last pair: group collapses and the removed lift follows it
    expect(
      LiftUtils.removeFromGroup([a, group('h', b, c)], 'h', 'ib'),
    ).toStrictEqual([a, c, b]);
    expect(() => LiftUtils.removeFromGroup(items, 'g', 'ia')).toThrow();
  });

  test('moveGroupLift', () => {
    expect(LiftUtils.moveGroupLift(items, 'g', 0, 'g', 2)).toStrictEqual([
      a,
      group('g', c, d, b),
      e,
    ]);
    // Same group of two does not collapse mid-move
    expect(
      LiftUtils.moveGroupLift([group('h', b, c)], 'h', 1, 'h', 0),
    ).toStrictEqual([group('h', c, b)]);

    // Between groups; a source left with one lift collapses
    const two: WorkoutItem[] = [group('h', a, b), group('g', c, d)];
    expect(LiftUtils.moveGroupLift(two, 'h', 0, 'g', 1)).toStrictEqual([
      b,
      group('g', c, a, d),
    ]);
  });
});
