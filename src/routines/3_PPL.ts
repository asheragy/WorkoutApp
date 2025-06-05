import {Routine, Workout} from '../types/workout.ts';
import {Lifts} from '../repository/LiftDatabase.ts';
import {buildWorkout} from './helper.ts';

export const PPL_3Day: [Routine, Workout[]] = [
  {
    id: '7c4ee2f5-fef3-4bda-a1af-8509ac0392f7',
    title: '3-day PPL',
  },
  [
    {
      name: 'Pull',
      lifts: [
        Lifts.deadlift_barbell,
        // 3 sets
        Lifts.row_barbell,
        Lifts.pullup,
        // 2 sets
        [Lifts.curl_incline, Lifts.curl_ezBar],
        [Lifts.shrug_dumbbell, Lifts.uprightRow_barbell],
        [Lifts.pulldown_machine, Lifts.pulldown_plateMachine],
        [Lifts.row_cable, Lifts.row_plateMachine],
        [Lifts.curl_hammer, Lifts.curl_reverse],
      ],
    },
    {
      name: 'Push',
      lifts: [
        // 3 sets
        Lifts.inclinePress_barbell,
        Lifts.bench_dumbbell,
        // 2 sets
        [Lifts.reverseFly_machine, Lifts.facePull],
        [Lifts.legRaise, Lifts.plank],
        [Lifts.ohp_plateMachine, Lifts.inclinePress_plateMachine],
        Lifts.fly_machine,
        [Lifts.latRaise_machine, Lifts.latRaise_dumbbell],
        Lifts.tricep_overhead,
      ],
    },
    {
      name: 'Legs',
      lifts: [
        Lifts.legExtensions,
        Lifts.legCurl_kneeling,
        Lifts.squat_front,
        [Lifts.rdl_barbell, Lifts.backExtension],
        [Lifts.hipThrust, Lifts.gluteKickback],
        [Lifts.calfRaise_seated, Lifts.calfRaise_standing],
        [Lifts.legPress, Lifts.splitSquat],
      ],
    },
  ].flatMap(buildWorkout),
];
