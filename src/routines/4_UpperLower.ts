import {Routine, Workout} from '../types/workout.ts';
import {Lifts} from '../repository/LiftDatabase.ts';
import {buildWorkout} from './helper.ts';

/*
Upper 1: Vertical Press / Horizontal Pull
Lower 1: DL / Misc legs
Upper 2: Horizontal Press / Vertical Pull
Lower 2: Quad focus
 */

export const SharedLower1 = [
  Lifts.hipAbduction,
  Lifts.hipAdduction,
  Lifts.deadlift_barbell,
  Lifts.splitSquat,
  Lifts.calfRaise_standing,
  [Lifts.hipThrust, Lifts.backExtension],
  Lifts.plank,
  Lifts.squat_belt,
];

export const SharedLower2 = [
  Lifts.legExtensions,
  Lifts.legCurl_kneeling,
  Lifts.squat_front,
  Lifts.rdl_barbell,
  Lifts.calfRaise_seated,
  Lifts.legRaise,
  Lifts.gluteKickback,
  [Lifts.legPress, Lifts.squat_v],
];

export const UpperLower: [Routine, Workout[]] = [
  {
    id: '3995deca-8204-4dc9-841b-1f4db64a486f',
    title: '4-day Upper Lower',
  },
  [
    {
      name: 'Upper 1',
      lifts: [
        Lifts.ohp_barbell,
        Lifts.row_barbell,
        [Lifts.ohp_plateMachine, Lifts.ohp_machine],
        [Lifts.row_cable, Lifts.row_plateMachine],
        Lifts.pullover_dumbbell,
        [Lifts.dip_machine, Lifts.dip],
        Lifts.curl_hammer,
        Lifts.fly_machine,
      ],
    },
    {
      name: 'Lower 1',
      lifts: SharedLower1,
    },
    {
      name: 'Upper 2',
      lifts: [
        Lifts.inclinePress_barbell,
        Lifts.pullup,
        Lifts.bench_dumbbell,
        [
          Lifts.pulldown_machine,
          Lifts.pulldown_plateMachine,
          Lifts.pulldown_cable,
        ],
        [Lifts.inclinePress_plateMachine, Lifts.inclinePress_machine],
        Lifts.shrug_dumbbell,
        [Lifts.latRaise_machine, Lifts.latRaise_dumbbell],
        [Lifts.reverseFly_machine, Lifts.uprightRow_barbell],
        Lifts.curl_incline,
      ],
    },
    {
      name: 'Lower 2',
      lifts: SharedLower2,
    },
  ].map(buildWorkout),
];
