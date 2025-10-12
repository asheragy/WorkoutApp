import {Routine, Workout} from '../types/workout.ts';
import {Lifts} from '../repository/LiftDatabase.ts';
import {buildWorkout} from './helper.ts';
import {SharedDeadliftCardio} from './shared.ts';

export const PPL_3Day: [Routine, Workout[]] = [
  {
    id: '7c4ee2f5-fef3-4bda-a1af-8509ac0392f7',
    title: '3-day PPL',
  },
  [
    {
      name: 'Pull',
      lifts: [
        [Lifts.pullup, Lifts.pulldown_cable], // 2 sets
        [Lifts.row_cable, Lifts.row_plateMachine, Lifts.row_barbell], // 4
        [Lifts.curl_incline, Lifts.curl_ezBar],
        [Lifts.shrug_dumbbell],
        [Lifts.pulldown_plateMachine, Lifts.pulldown_machine],
        [Lifts.curl_hammer, Lifts.curl_reverse],
        Lifts.curl_wrist,
      ],
    },
    {
      name: 'Push',
      lifts: [
        [Lifts.inclinePress_barbell, Lifts.inclinePress_dumbbell],
        [Lifts.reverseFly_machine, Lifts.facePull],
        [Lifts.ohp_plateMachine, Lifts.ohp_barbell],
        Lifts.fly_machine,
        [Lifts.latRaise_machine, Lifts.uprightRow_barbell],
        [Lifts.tricep_overhead, Lifts.bench_closegrip],
      ],
    },
    {
      name: 'Legs',
      lifts: [
        Lifts.legExtensions,
        Lifts.legCurl_kneeling,
        [Lifts.squat_front, Lifts.squat_belt],
        [Lifts.rdl_barbell, Lifts.backExtension],
        [Lifts.hipThrust, Lifts.gluteKickback],
        [Lifts.calfRaise_seated, Lifts.calfRaise_standing],
        [Lifts.legPress, Lifts.splitSquat],
      ],
    },
    {
      name: 'Deadlift / Cardio',
      lifts: SharedDeadliftCardio,
    },
  ].flatMap(buildWorkout),
];
