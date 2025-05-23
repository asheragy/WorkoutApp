import {Routine, Workout} from '../types/workout.ts';
import {Lifts} from '../repository/LiftDatabase.ts';

/*
Upper 1: Vertical Press / Horizontal Pull
Lower 1: DL / Misc legs
Upper 2: Horizontal Press / Vertical Pull
Lower 2: Quad focus
 */

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
          id: Lifts.ohp_barbell.id,
          sets: [],
        },
        {
          id: Lifts.row_barbell.id,
          sets: [],
        },
      ],
    },
    {
      name: 'Lower 1',
      lifts: [
        {
          id: Lifts.deadlift_barbell.id,
          sets: [],
        },
      ],
    },
    {
      name: 'Upper 1',
      lifts: [
        {
          id: Lifts.pullup.id,
          sets: [],
        },
        {
          id: Lifts.bench_dumbbell.id,
          sets: [],
        },
      ],
    },
    {
      name: 'Lower 2',
      lifts: [
        {
          id: Lifts.squat_front.id,
          sets: [],
        },
      ],
    },
  ],
];
