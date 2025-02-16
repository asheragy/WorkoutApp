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
          id: Lifts.barbell_overheadPress.id,
          sets: [],
        },
        {
          id: Lifts.barbell_rows.id,
          sets: [],
        },
      ],
    },
    {
      name: 'Lower 1',
      lifts: [
        {
          id: Lifts.barbell_deadlift.id,
          sets: [],
        },
      ],
    },
    {
      name: 'Upper 1',
      lifts: [
        {
          id: Lifts.bodyweight_pullups.id,
          sets: [],
        },
        {
          id: Lifts.dumbbell_benchPress.id,
          sets: [],
        },
      ],
    },
    {
      name: 'Lower 2',
      lifts: [
        {
          id: Lifts.barbell_frontSquat.id,
          sets: [],
        },
      ],
    },
  ],
];
