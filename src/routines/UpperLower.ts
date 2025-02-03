import {Routine, Workout} from '../types/workout.ts';

export const UpperLower: [Routine, Workout[]] = [
  {
    id: '3995deca-8204-4dc9-841b-1f4db64a486f',
    title: 'Upper Lower',
  },
  [
    {
      name: 'Upper 1',
      lifts: [
        {
          id: 'bodyweight_pullups',
          sets: [],
        },
        {
          id: 'dumbbell_benchPress',
          sets: [],
        },
      ],
    },
    {
      name: 'Lower 1',
      lifts: [
        {
          id: 'barbell_deadlift',
          sets: [],
        },
      ],
    },
    {
      name: 'Upper 2',
      lifts: [
        {
          id: 'barbell_overheadPress',
          sets: [],
        },
        {
          id: 'barbell_rows',
          sets: [],
        },
      ],
    },
    {
      name: 'Lower 2',
      lifts: [
        {
          id: 'barbell_frontSquat',
          sets: [],
        },
      ],
    },
  ],
];
