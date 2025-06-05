import {Routine, Workout} from '../types/workout.ts';
import {Lifts} from '../repository/LiftDatabase.ts';
import {buildWorkout} from './helper.ts';

export const Arnold_3Day: [Routine, Workout[]] = [
  {
    id: 'c2bedfe9-a26f-4d71-a188-edf16aa05a4a',
    title: '3-day Arnold',
  },
  [
    {
      name: 'Back/Chest',
      lifts: [
        // 3 sets
        Lifts.pullup,
        Lifts.inclinePress_barbell,
        [Lifts.row_cable, Lifts.row_plateMachine],
        Lifts.bench_dumbbell,
        Lifts.fly_machine,
        // 2 sets
        [Lifts.pulldown_machine, Lifts.pulldown_plateMachine],
        [Lifts.row_barbell, Lifts.row_dumbbell],
      ],
    },
    {
      name: 'Shoulders/Arms',
      lifts: [
        Lifts.deadlift_barbell,
        [Lifts.ohp_plateMachine, Lifts.ohp_dumbbell],
        // 2 sets
        [Lifts.curl_incline, Lifts.curl_ezBar],
        [Lifts.latRaise_machine, Lifts.latRaise_dumbbell],
        [Lifts.legRaise, Lifts.plank],
        Lifts.tricep_overhead,
        [Lifts.curl_hammer, Lifts.curl_reverse],
        [Lifts.reverseFly_machine, Lifts.facePull],
        [Lifts.shrug_dumbbell, Lifts.uprightRow_barbell],
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
