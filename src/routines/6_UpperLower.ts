import {Routine, Workout} from '../types/workout.ts';
import {Lifts} from '../repository/LiftDatabase.ts';
import {buildWorkout} from './helper.ts';

/*

Lower 1
- Hip Add
- Hip Abd
- Leg Extensions 1
- DL 531
- Single Leg Press / Split Squat
- Core 1

Lower 2
- Leg Extensions 2
- Leg Curls (Laying or seated)
- Front Squat / Squat  2:1
- RDL / Deficit   2:1
- Calves (Seated or standing)
- Core 2

Lower 3
- Leg Curls (Laying or seated)
- Leg Press / Belt Squat / V-Squat  2:2:1
- Trap low / Sumo    2:1
- Hip Thrust / Glute Kickback
- Calves (Seated or standing)
- Core 3
- Back extension

// TODO new lifts
OHP seated vs standing
BTNP - standing only, pairr with lat raise machine
 */

export const UpperLower6: [Routine, Workout[]] = [
  {
    id: 'upperLower6',
    title: '6-day Upper Lower',
  },
  [
    {
      name: 'Upper 1',
      lifts: [
        [Lifts.inclinePress_barbell, Lifts.inclinePress_dumbbell],
        [Lifts.dip, Lifts.fly_machine],
        Lifts.latRaise_machine,
        [Lifts.pullup, Lifts.pullup_neutral],
        [Lifts.row_plateMachine, Lifts.row_machine], // Row chest supported
        [Lifts.curl_wrist, Lifts.shrug_dumbbell],
      ],
    },
    {
      name: 'Upper 2',
      lifts: [
        [Lifts.ohp_barbell, Lifts.ohp_dumbbell], // Row Free-weight
        [Lifts.bench_closegrip, Lifts.dip_machine],
        [Lifts.uprightRow_barbell, Lifts.latRaise_dumbbell],
        [Lifts.row_barbell, Lifts.row_dumbbell],
        [Lifts.curl_incline, Lifts.curl_ezBar],
        [Lifts.reverseFly_machine, Lifts.facePull],
        [Lifts.pullover_dumbbell, Lifts.pullover_machine],
      ],
    },
    {
      name: 'Upper 3',
      lifts: [
        [Lifts.bench_dumbbell, Lifts.bench_barbell],
        [Lifts.ohp_plateMachine, Lifts.inclinePress_plateMachine],
        Lifts.tricep_overhead,
        [Lifts.row_cable, Lifts.row_cableWide], // Row Cable
        [
          Lifts.pulldown_cable,
          Lifts.pulldown_machine,
          Lifts.pulldown_plateMachine,
        ],
        [Lifts.curl_hammer, Lifts.curl_reverse],
      ],
    },
  ].map(buildWorkout),
];
