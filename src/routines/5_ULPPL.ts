import {Routine, Workout} from '../types/workout.ts';
import {Lifts} from '../repository/LiftDatabase.ts';
import {buildWorkout} from './helper.ts';
import {SharedLower1, SharedLower2} from './4_UpperLower.ts';
import {ULArnold} from './5_ULArnold.ts';

export const ULPPL: [Routine, Workout[]] = [
  {
    id: 'upperLowerPPL',
    title: '5-day UL/PPL',
  },
  [
    {
      name: 'Upper',
      lifts: ULArnold[1][0].lifts,
    },
    {
      name: 'Lower',
      lifts: SharedLower1,
    },
    {
      name: 'Pull',
      lifts: [
        [Lifts.row_cable, Lifts.row_plateMachine],
        [Lifts.pulldown_machine, Lifts.pulldown_plateMachine],
        [Lifts.row_dumbbell, Lifts.pulldown_cable],
        [Lifts.reverseFly_machine, Lifts.facePull],
        [Lifts.uprightRow_barbell, Lifts.shrug_barbell],
        Lifts.curl_ezBar,
        [Lifts.curl_hammer, Lifts.curl_reverse],
      ],
    },
    {
      name: 'Push',
      lifts: [
        Lifts.ohp_barbell,
        Lifts.bench_dumbbell,
        [Lifts.dip_machine, Lifts.inclinePress_machine],
        Lifts.fly_machine,
        Lifts.latRaise_dumbbell,
        Lifts.tricep_machine,
        Lifts.pullover_dumbbell,
      ],
    },
    {
      name: 'Legs',
      lifts: SharedLower2,
    },
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
