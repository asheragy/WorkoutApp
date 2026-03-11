import {Routine, Workout} from '../types/workout.ts';
import {Lifts} from '../repository/LiftDatabase.ts';
import {buildWorkout} from './helper.ts';


export const ULPPL: [Routine, Workout[]] = [
  {
    id: 'upperLowerPPL',
    title: '5-day UL/PPL',
  },
  [
    {
      name: 'Upper',
      lifts: [
        [Lifts.pullup, Lifts.pulldown_cable],
        [Lifts.inclinePress_barbell, Lifts.inclinePress_dumbbell],
        Lifts.row_cable,
        [Lifts.bench_dumbbell, Lifts.dip_machine],
        [Lifts.latRaise_machine, Lifts.latRaise_dumbbell],
        [Lifts.curl_incline, Lifts.curl_ezBar],
        Lifts.tricep_overhead,
      ],
    },
    {
      name: 'Lower',
      lifts: [
        Lifts.legExtensions,
        Lifts.legCurl_kneeling,
        [Lifts.squat_front, Lifts.squat_barbell],
        [Lifts.deadlift_sumo, Lifts.deadlift_deficit],
        [Lifts.calfRaise_seated, Lifts.calfRaise_standing],
        [Lifts.legPress, Lifts.splitSquat],
        Lifts.elevateCore,
      ],
    },
    {
      name: 'Pull',
      lifts: [
        Lifts.row_barbell,
        [
          Lifts.pulldown_machine,
          Lifts.pulldown_plateMachine,
        ],
        [Lifts.rdl_barbell, Lifts.backExtension],
        [Lifts.shrug_dumbbell],
        [Lifts.row_plateMachine, Lifts.row_machine], // Chest supported
        [Lifts.curl_hammer, Lifts.curl_reverse],
      ],
    },
    {
      name: 'Push',
      lifts: [
        [Lifts.ohp_barbell, Lifts.ohp_plateMachine],
        Lifts.uprightRow_barbell,
        Lifts.bench_closegrip,
        [Lifts.pullover_dumbbell, Lifts.pullover_machine],
        Lifts.fly_machine,
        [Lifts.reverseFly_machine, Lifts.facePull],
        Lifts.ohp_dumbbell
      ],
    },

    {
      name: 'Legs',
      lifts: [
        Lifts.hipAdduction,
        Lifts.hipAbduction,
        [Lifts.squat_belt, Lifts.legPress_double],
        [Lifts.deadlift_trapbar, Lifts.deadlift_trapbar_high],
        Lifts.hipThrust,
        Lifts.legRaise,
      ]
    },
    {
      name: 'Deadlift',
      lifts: [
        [
          Lifts.deadlift_barbell,
          // TODO deadlift volume
        ],
        Lifts.plank,
      ]
    }
  ].map(buildWorkout),
];
