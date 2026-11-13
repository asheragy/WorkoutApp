import { cleanWorkouts } from './RoutineUtils.ts';
import { Workout } from '../types/workout.ts';

const workouts: Workout[] = [
  {
    id: 'workout-db-id',
    routineId: 'routine-id',
    lastCompleted: new Date(2026, 0, 1),
    name: 'Day 1',
    items: [
      {
        id: 'bench_barbell',
        instanceId: 'lift-1',
        hide: true,
        note: 'pause reps',
        sets: [
          { weight: 45, reps: 10, warmup: true, completed: true },
          { weight: 135, reps: 5, warmup: false, completed: true },
          { weight: 135, reps: 5, completed: false },
        ],
        goals: [{ weight: 140, reps: 5, completed: true }],
        goals2: [{ weight: 150, reps: 5, completed: true }],
      },
      {
        kind: 'oneOf',
        instanceId: 'group-1',
        lifts: [
          {
            id: 'legPress',
            instanceId: 'lift-2',
            hide: true,
            sets: [{ weight: 90, reps: 10, completed: true }],
          },
          {
            id: 'legPress_stack',
            instanceId: 'lift-3',
            hide: false,
            note: '',
            sets: [],
            goals: [],
          },
        ],
      },
    ],
  },
];

test('cleanWorkouts keeps only the fields a routine cares about', () => {
  expect(cleanWorkouts(workouts)).toStrictEqual([
    {
      name: 'Day 1',
      routineId: '',
      items: [
        {
          id: 'bench_barbell',
          instanceId: 'lift-1',
          note: 'pause reps',
          sets: [
            { weight: 45, reps: 10, warmup: true },
            { weight: 135, reps: 5 },
            { weight: 135, reps: 5 },
          ],
          goals: [{ weight: 140, reps: 5 }],
          goals2: [{ weight: 150, reps: 5 }],
        },
        {
          kind: 'oneOf',
          instanceId: 'group-1',
          lifts: [
            {
              id: 'legPress',
              instanceId: 'lift-2',
              sets: [{ weight: 90, reps: 10 }],
            },
            {
              id: 'legPress_stack',
              instanceId: 'lift-3',
              sets: [],
              goals: [],
            },
          ],
        },
      ],
    },
  ]);
});

test('cleanWorkouts removes runtime fields at every level', () => {
  const json = JSON.stringify(cleanWorkouts(workouts));

  for (const field of ['lastCompleted', 'hide', 'completed', 'workout-db-id'])
    expect(json).not.toContain(field);
  expect(json).not.toContain('routine-id');
});

test('cleanWorkouts does not modify its input', () => {
  const before = JSON.stringify(workouts);
  cleanWorkouts(workouts);
  expect(JSON.stringify(workouts)).toBe(before);
});
