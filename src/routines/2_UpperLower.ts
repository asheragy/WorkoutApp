import {Routine, Workout} from '../types/workout.ts';
import {Lifts} from '../repository/LiftDatabase.ts';
import {buildWorkout} from './helper.ts';

export const UpperLower_2Day: [Routine, Workout[]] = [
  {
    id: 'twoUpperLower',
    title: '2-day Upper Lower',
  },
  [
    {
      name: 'Lower',
      lifts: [
        Lifts.legExtensions,
        [Lifts.hipThrust, Lifts.gluteKickback],
        [Lifts.legCurl_laying, Lifts.legCurl_seated],
        [Lifts.squat_barbell, Lifts.legPress, Lifts.squat_belt],
        [Lifts.deadlift_barbell, Lifts.rdl_barbell],
        [Lifts.splitSquat, Lifts.lunge],
      ],
    },
    {
      name: 'Upper',
      lifts: [
        [Lifts.inclinePress_barbell, Lifts.inclinePress_dumbbell],
        [
          Lifts.pulldown_plateMachine,
          Lifts.pulldown_cable,
          Lifts.pulldown_machine,
        ],
        [Lifts.ohp_barbell, Lifts.ohp_dumbbell, Lifts.ohp_plateMachine],
        [Lifts.row_cable, Lifts.row_dumbbell, Lifts.row_machine],
        [Lifts.latRaise_dumbbell, Lifts.latRaise_machine],
        [Lifts.curl_incline, Lifts.curl_ezBar],
        [Lifts.tricep_overhead, Lifts.tricep_machine, Lifts.bench_closegrip],
      ],
    },
  ].flatMap(buildWorkout),
];
