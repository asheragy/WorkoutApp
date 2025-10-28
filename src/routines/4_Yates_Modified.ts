/*
- Shoulders, Triceps and Abs
- Back and Rear Delts
- Chest, Biceps
- Quadriceps, Hamstrings and Calves
 */

import {Routine, Workout} from '../types/workout.ts';
import {Lifts} from '../repository/LiftDatabase.ts';
import {buildWorkout} from './helper.ts';
import {SharedDeadliftCardio} from './shared.ts';

export const YatesSplitModified: [Routine, Workout[]] = [
  {
    id: '832b1e89-0bbd-4b9b-aed8-eeb8cd848061',
    title: '4-day Yates Modified',
  },
  [
    {
      name: 'Shoulders / Triceps',
      lifts: [
        [Lifts.ohp_barbell, Lifts.ohp_plateMachine, Lifts.ohp_dumbbell],
        Lifts.bench_closegrip,
        [Lifts.latRaise_machine, Lifts.latRaise_dumbbell],
        [Lifts.uprightRow_barbell],
        [Lifts.reverseFly_machine, Lifts.facePull],
        Lifts.tricep_overhead,
      ],
    },
    {
      name: 'Back',
      lifts: [
        [Lifts.row_cable, Lifts.row_barbell],
        Lifts.pullup,
        [Lifts.shrug_dumbbell],
        [Lifts.backExtension],
        [Lifts.row_plateMachine, Lifts.row_machine], // Chest supported
        [
          Lifts.pulldown_machine,
          Lifts.pulldown_plateMachine,
          Lifts.pulldown_cable,
        ],
      ],
    },
    {
      name: 'Chest / Biceps',
      lifts: [
        [Lifts.inclinePress_barbell, Lifts.inclinePress_dumbbell],
        [Lifts.bench_dumbbell, Lifts.dip_machine],
        [Lifts.curl_incline, Lifts.curl_ezBar],
        [Lifts.pullover_dumbbell, Lifts.pullover_machine],
        Lifts.fly_machine,
        [Lifts.curl_hammer, Lifts.curl_reverse],
      ],
    },
    {
      name: 'Legs',
      lifts: [
        Lifts.legExtensions,
        Lifts.legCurl_kneeling,
        [Lifts.squat_front, Lifts.squat_belt],
        [Lifts.hipThrust, Lifts.gluteKickback],
        [Lifts.calfRaise_seated, Lifts.calfRaise_standing],
        [Lifts.legPress, Lifts.splitSquat],
      ],
    },
    {
      name: 'Deadlift',
      lifts: SharedDeadliftCardio,
    },
  ].flatMap(buildWorkout),
];
