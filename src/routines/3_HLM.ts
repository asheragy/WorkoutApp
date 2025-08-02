import {Routine, Workout} from '../types/workout.ts';
import {Lifts} from '../repository/LiftDatabase.ts';
import {buildWorkout} from './helper.ts';

export const HLM_3Day: [Routine, Workout[]] = [
  {
    id: 'c22e48fd-6664-4e07-93f8-918f06165195',
    title: '3-day HLM',
  },
  [
    {
      name: 'Heavy',
      lifts: [
        Lifts.deadlift_barbell,
        Lifts.inclinePress_barbell,
        Lifts.pullup,
        Lifts.squat_front,
        [Lifts.legRaise, Lifts.plank],
        [Lifts.shrug_dumbbell, Lifts.uprightRow_barbell],
      ],
    },
    {
      name: 'Light',
      lifts: [
        [Lifts.row_cable, Lifts.row_plateMachine],
        [Lifts.bench_closegrip, Lifts.tricep_overhead],
        Lifts.fly_machine,
        [Lifts.reverseFly_machine, Lifts.facePull],
        [Lifts.latRaise_machine, Lifts.latRaise_dumbbell],
        [Lifts.curl_hammer, Lifts.curl_reverse],
        Lifts.legExtensions,
        Lifts.legCurl_kneeling,
        [Lifts.calfRaise_seated, Lifts.calfRaise_standing],
      ],
    },
    {
      name: 'Medium',
      lifts: [
        Lifts.bench_dumbbell,
        Lifts.row_barbell,
        [Lifts.ohp_plateMachine, Lifts.inclinePress_plateMachine],
        [Lifts.pulldown_machine, Lifts.pulldown_plateMachine],
        [Lifts.curl_incline, Lifts.curl_ezBar],
        [Lifts.hipThrust, Lifts.gluteKickback],
        [Lifts.rdl_barbell, Lifts.backExtension],
        [Lifts.legPress, Lifts.splitSquat],
      ],
    },
  ].flatMap(buildWorkout),
];
