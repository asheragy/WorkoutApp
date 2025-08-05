import {Routine, Workout} from '../types/workout.ts';
import {Lifts} from '../repository/LiftDatabase.ts';
import {buildWorkout} from './helper.ts';

export const UpperLower6: [Routine, Workout[]] = [
  {
    id: 'upperLower6',
    title: '6-day Upper Lower',
  },
  [
    {
      name: 'Upper 1',
      lifts: [
        Lifts.row_barbell,
        [Lifts.ohp_plateMachine, Lifts.ohp_machine],
        Lifts.pullover_dumbbell,
        Lifts.shrug_dumbbell,
        [Lifts.dip_machine, Lifts.dip],
        Lifts.curl_hammer,
      ],
    },
    {
      name: 'Lower 1',
      lifts: [
        Lifts.hipAbduction,
        Lifts.hipAdduction,
        Lifts.deadlift_barbell,
        Lifts.calfRaise_standing,
        Lifts.plank,
        [Lifts.legPress, Lifts.squat_v],
      ],
    },
    {
      name: 'Upper 2',
      lifts: [
        Lifts.inclinePress_barbell,
        Lifts.pullup,
        Lifts.bench_dumbbell,
        [Lifts.latRaise_machine, Lifts.latRaise_dumbbell],
        [Lifts.reverseFly_machine, Lifts.uprightRow_barbell],
        Lifts.curl_incline,
      ],
    },
    {
      name: 'Lower 2',
      lifts: [
        Lifts.legExtensions,
        Lifts.legCurl_kneeling,
        Lifts.squat_front,
        Lifts.calfRaise_seated,
        [Lifts.hipThrust, Lifts.backExtension],
        Lifts.splitSquat,
      ],
    },
    {
      name: 'Upper 3',
      lifts: [
        [Lifts.row_cable, Lifts.row_plateMachine],
        Lifts.ohp_barbell,
        [
          Lifts.pulldown_machine,
          Lifts.pulldown_plateMachine,
          Lifts.pulldown_cable,
        ],
        Lifts.curl_ezBar,
        Lifts.fly_machine,
        [Lifts.tricep_overhead, Lifts.bench_closegrip],
      ],
    },
    {
      name: 'Lower 3',
      lifts: [
        Lifts.rdl_barbell,
        Lifts.squat_belt,
        Lifts.gluteKickback,
        Lifts.calfRaise_bodyWeight,
        Lifts.legRaise,
      ],
    },
  ].map(buildWorkout),
];
