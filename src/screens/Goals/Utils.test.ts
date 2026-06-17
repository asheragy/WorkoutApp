import { LiftSet, Workout } from '../../types/workout.ts';
import { Lifts } from '../../repository/LiftDatabase.ts';
import { TestLiftDefs } from '../../test-utils/Common.ts';
import { calcWorkoutGoals } from './Utils.ts';

test('calcWorkoutGoals', async () => {
  const workout: Workout = {
    name: '',
    lifts: [
      {
        id: Lifts.squat_front.id,
        instanceId: '',
        sets: [set(200, 10)],
        goals: [set(250, 10)],
      },
      {
        id: Lifts.squat_front.id,
        instanceId: 'fs',
        sets: [
          {
            weight: 230,
            reps: 5,
          },
        ],
        goals: [
          {
            weight: 300,
            reps: 5,
          },
        ],
      },
      {
        id: Lifts.legExtensions.id,
        instanceId: '',
        sets: [set(100, 10)],
        goals: [set(100, 12)],
      },
      // No goal
      {
        id: Lifts.legPress.id,
        instanceId: 'press',
        sets: [set(300, 10)],
      },
    ],
  };

  const rows = calcWorkoutGoals(TestLiftDefs, [workout]);
  expect(rows.length).toBe(3);
  expect(rows).toStrictEqual([
    {
      id: 'squat_front',
      name: 'Squat (Front)',
      percent: 0.7833333333333334,
    },
    {
      group: true,
      id: 'Quads',
      name: 'Quads',
      percent: 0.8678320548368013,
    },
    {
      id: 'legExtensions',
      name: 'Leg Extensions',
      percent: 0.952330776340269,
    },
  ]);
});

function set(weight: number, reps: number): LiftSet {
  return {
    weight,
    reps,
  };
}
