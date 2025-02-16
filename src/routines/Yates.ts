/*
- Shoulders, Triceps and Abs
- Back and Rear Delts
- Chest, Biceps
- Quadriceps, Hamstrings and Calves
 */

import {Routine, Workout} from '../types/workout.ts';
import {Lifts} from '../repository/LiftDatabase.ts';

export const YatesSplit: [Routine, Workout[]] = [
  {
    id: '6bbc25f3-7efd-42a4-9ba9-92480d90d5a6',
    title: '4-day Yates Split',
  },
  [
    {
      name: 'Shoulders / Triceps / Abs',
      lifts: [
        {
          id: Lifts.barbell_overheadPress.id,
          sets: [],
        },
        {
          id: Lifts.closegrip_benchPress.id,
          sets: [],
        },
      ],
    },
    {
      name: 'Back',
      lifts: [
        {
          id: Lifts.barbell_deadlift.id,
          sets: [],
        },
      ],
    },
    {
      name: 'Chest / Biceps',
      lifts: [
        {
          id: Lifts.dumbbell_benchPress.id,
          sets: [],
        },
        {
          id: Lifts.dumbbell_inclineCurls.id,
          sets: [],
        },
      ],
    },
    {
      name: 'Legs',
      lifts: [
        {
          id: Lifts.barbell_frontSquat.id,
          sets: [],
        },
      ],
    },
  ],
];
