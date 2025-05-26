/*
- Shoulders, Triceps and Abs
- Back and Rear Delts
- Chest, Biceps
- Quadriceps, Hamstrings and Calves
 */

import {Routine, Workout} from '../types/workout.ts';
import {Lifts} from '../repository/LiftDatabase.ts';
import {buildWorkout} from './helper.ts';

export const YatesSplit: [Routine, Workout[]] = [
  {
    id: '6bbc25f3-7efd-42a4-9ba9-92480d90d5a6',
    title: '4-day Yates Split',
  },
  [
    {
      name: 'Shoulders / Triceps / Abs',
      lifts: [
        Lifts.ohp_barbell,
        [Lifts.latRaise_machine, Lifts.latRaise_dumbbell],
        [Lifts.ohp_plateMachine, Lifts.ohp_machine],
        Lifts.bench_closegrip,
        [Lifts.reverseFly_machine, Lifts.facePull],
        [Lifts.legRaise, Lifts.plank],
        Lifts.tricep_overhead,
      ],
    },
    {
      name: 'Back',
      lifts: [
        Lifts.deadlift_barbell,
        [Lifts.rdl_barbell, Lifts.row_barbell],
        Lifts.pullup, // 3 sets
        [
          // 2 sets
          Lifts.pulldown_machine,
          Lifts.pulldown_plateMachine,
          Lifts.pulldown_cable,
        ],
        [Lifts.shrug_dumbbell, Lifts.uprightRow_barbell],
        [Lifts.row_cable, Lifts.row_plateMachine],
        [Lifts.backExtension, Lifts.hipThrust],
      ],
    },
    {
      name: 'Chest / Biceps',
      lifts: [
        Lifts.inclinePress_barbell,
        Lifts.bench_dumbbell,
        [Lifts.curl_incline, Lifts.curl_ezBar],
        Lifts.pullover_dumbbell,
        Lifts.fly_machine,
        [Lifts.dip_machine, Lifts.dip],
        [Lifts.curl_hammer, Lifts.curl_reverse],
      ],
    },
    {
      name: 'Legs',
      lifts: [
        Lifts.legExtensions,
        Lifts.legCurl_kneeling,
        [Lifts.hipAbduction, Lifts.hipAdduction],
        Lifts.squat_front,
        [Lifts.splitSquat, Lifts.gluteKickback],
        [Lifts.calfRaise_seated, Lifts.calfRaise_standing],
        [Lifts.legPress, Lifts.squat_belt],
      ],
    },
  ].flatMap(buildWorkout),
];
