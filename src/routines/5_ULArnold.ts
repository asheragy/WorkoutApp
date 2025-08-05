import {Routine, Workout} from '../types/workout.ts';
import {Lifts} from '../repository/LiftDatabase.ts';
import {buildWorkout} from './helper.ts';
import {SharedLower1, SharedLower2} from './4_UpperLower.ts';

export const ULArnold: [Routine, Workout[]] = [
  {
    id: 'upperLowerArnold',
    title: '5-day UL/Arnold',
  },
  [
    {
      name: 'Upper',
      lifts: [
        Lifts.inclinePress_barbell,
        Lifts.pullup,
        Lifts.ohp_plateMachine,
        Lifts.row_barbell,
        Lifts.latRaise_machine,
        Lifts.tricep_overhead,
        Lifts.curl_incline,
      ],
    },
    {
      name: 'Lower',
      lifts: SharedLower1,
    },
    {
      name: 'Chest/Back',
      lifts: [
        Lifts.bench_dumbbell,
        [Lifts.dip_machine, Lifts.inclinePress_machine],
        Lifts.fly_machine,
        [Lifts.row_cable, Lifts.row_plateMachine],
        [Lifts.pulldown_machine, Lifts.pulldown_plateMachine],
        [Lifts.row_dumbbell, Lifts.pulldown_cable],
        Lifts.pullover_dumbbell, // Optional
      ],
    },
    {
      name: 'Shoulders/Arms',
      lifts: [
        Lifts.ohp_barbell,
        Lifts.latRaise_dumbbell,
        [Lifts.reverseFly_machine, Lifts.facePull],
        [Lifts.uprightRow_barbell, Lifts.shrug_barbell],
        Lifts.curl_ezBar,
        [Lifts.curl_hammer, Lifts.curl_reverse],
        Lifts.bench_closegrip,
      ],
    },
    {
      name: 'Legs',
      lifts: SharedLower2,
    },
  ].map(buildWorkout),
];
