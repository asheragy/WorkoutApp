import {Routine, Workout} from '../types/workout.ts';
import {Lifts} from '../repository/LiftDatabase.ts';
import {buildWorkout} from './helper.ts';
import {SharedLower1, SharedLower2} from './4_UpperLower.ts';

export const ULPPL: [Routine, Workout[]] = [
  {
    id: 'c6bbcd6a-75e1-480f-b2ea-8b191c698a6e',
    title: '5-day UL/PPL',
  },
  [
    {
      name: 'Upper',
      lifts: [],
    },
    {
      name: 'Lower',
      lifts: SharedLower1,
    },
    {
      name: 'Legs',
      lifts: SharedLower2,
    },
    /*
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
     */
  ].map(buildWorkout),
];

/*
Upper
- Incline Bench
- DB Bench
- Pullups
- Cable Row
- Lat Raise
- Tricep
- Bicep


Push
- OHP
- Incline/OHP Machine
- Dips
- Flys
- Pullovers
- Tricep Overhead
- Upright Row / Reverse Fly

Pull
- Barbell Row
- Pulldowns Hoist / Cable Pulldowns
- Purestrength Rows / Purestrength pulldown
- bicep 1
- bicep 2
- Shrugs / Face pulls
 */
