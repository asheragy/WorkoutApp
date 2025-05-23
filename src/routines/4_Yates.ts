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
          id: Lifts.ohp_barbell.id,
          sets: [],
        },
        {
          id: Lifts.bench_closegrip.id,
          sets: [],
        },
      ],
    },
    {
      name: 'Back',
      lifts: [
        {
          id: Lifts.deadlift_barbell.id,
          sets: [],
        },
      ],
    },
    {
      name: 'Chest / Biceps',
      lifts: [
        {
          id: Lifts.bench_dumbbell.id,
          sets: [],
        },
        {
          id: Lifts.curl_incline.id,
          sets: [],
        },
      ],
    },
    {
      name: 'Legs',
      lifts: [
        {
          id: Lifts.squat_front.id,
          sets: [],
        },
      ],
    },
  ],
];
