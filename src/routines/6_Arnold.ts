import {Routine, Workout} from '../types/workout.ts';
import {Lifts} from '../repository/LiftDatabase.ts';

/*
Chest / Back
- Incline BB Bench + Dips
- Barbell Rows + Hoist pulldowns + Plate Row Machine
- Pullovers

(Day 2)
- DB Bench + Plate Incline Press
- Pullups + Cable Rows + 1 Arm pulldown
- Flys

Shoulders / Arms
- OHP
- Lat Raise Machine
- Incline Curls + Reverse Curls
- Tricep Ext Overhead
- Upright Rows / Reverse Flys

(Day 2)
- HS Overhead Press
- Lat Raise Dumbbell
- EZ Bar Curl + Hammer Curls
- Closegrip Bench or Other triceps
- Shrugs
 */
export const Arnold: [Routine, Workout[]] = [
  {
    id: 'fc18db7d-b969-4acc-ab56-84a6e37d14bd',
    title: 'Arnold Split',
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
