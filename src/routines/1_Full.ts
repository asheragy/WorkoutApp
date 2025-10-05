import {Routine, Workout} from '../types/workout.ts';
import {Lifts} from '../repository/LiftDatabase.ts';
import {buildWorkout} from './helper.ts';

export const FullBody_1Day: [Routine, Workout[]] = [
  {
    id: 'oneDayFull',
    title: '1-day Full Body',
  },
  [
    {
      name: '',
      lifts: [
        [Lifts.hipThrust, Lifts.gluteKickback],
        Lifts.legExtensions,
        Lifts.legCurl_laying,
        [Lifts.inclinePress_barbell, Lifts.inclinePress_dumbbell],
        [
          Lifts.pulldown_plateMachine,
          Lifts.pulldown_cable,
          Lifts.pulldown_machine,
        ],
      ],
    },
  ].flatMap(buildWorkout),
];
