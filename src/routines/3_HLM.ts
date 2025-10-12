import {Routine, Workout} from '../types/workout.ts';
import {Lifts} from '../repository/LiftDatabase.ts';
import {buildWorkout} from './helper.ts';
import {SharedDeadliftCardio} from './shared.ts';

export const HLM_3Day: [Routine, Workout[]] = [
  {
    id: 'c22e48fd-6664-4e07-93f8-918f06165195',
    title: '3-day HLM',
  },
  [
    {
      name: 'Heavy',
      lifts: [
        [Lifts.pullup, Lifts.pulldown_cable],
        [Lifts.inclinePress_barbell, Lifts.inclinePress_dumbbell],
        Lifts.legCurl_kneeling,
        [Lifts.squat_front, Lifts.squat_belt],
      ],
    },
    {
      name: 'Light',
      lifts: [
        // Push
        [Lifts.reverseFly_machine, Lifts.facePull],
        Lifts.fly_machine,
        [Lifts.latRaise_machine, Lifts.uprightRow_barbell],
        [Lifts.tricep_overhead, Lifts.bench_closegrip],
        // Pull
        [Lifts.curl_incline, Lifts.curl_ezBar],
        [Lifts.curl_hammer, Lifts.curl_reverse],
        Lifts.curl_wrist,
        [Lifts.shrug_dumbbell],
        // Legs
        Lifts.legExtensions,
        [Lifts.calfRaise_seated, Lifts.calfRaise_standing],
      ],
    },
    {
      name: 'Medium',
      lifts: [
        // Upper
        [Lifts.row_cable, Lifts.row_plateMachine, Lifts.row_barbell],
        [Lifts.pulldown_plateMachine, Lifts.pulldown_machine],
        [Lifts.ohp_plateMachine, Lifts.ohp_barbell],
        [Lifts.dip_machine],
        // Lower
        [Lifts.rdl_barbell, Lifts.backExtension],
        [Lifts.hipThrust, Lifts.gluteKickback],
        [Lifts.legPress, Lifts.splitSquat],
      ],
    },
    {
      name: 'Deadlift / Cardio',
      lifts: SharedDeadliftCardio,
    },
  ].flatMap(buildWorkout),
];
