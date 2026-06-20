import LiftUtils from './LiftUtils.ts';
import { TestLiftDefs } from '../test-utils/Common.ts';
import { Lifts } from '../repository/LiftDatabase.ts';
import { Lift } from '../types/workout.ts';

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
  const grouped = LiftUtils.groupLifts(lifts);
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

test('goal percentage', () => {
  const def = TestLiftDefs[Lifts.pullover_dumbbell.id];
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
