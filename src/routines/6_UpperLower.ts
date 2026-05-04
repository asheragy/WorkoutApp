import { Routine, Workout } from '../types/workout.ts';
import { Lifts } from '../repository/LiftDatabase.ts';
import { buildWorkout } from './helper.ts';

export const UpperLower6: [Routine, Workout[]] = [
  {
    id: 'upperLower6',
    title: '6-day Upper Lower',
  },
  [
    {
      name: 'Upper 1',
      lifts: [
        [Lifts.inclinePress_barbell, Lifts.inclinePress_dumbbell],
        [Lifts.dip, Lifts.fly_machine],
        [Lifts.latRaise_machine, Lifts.ohp_btn],
        [Lifts.pullup, Lifts.pullup_neutral],
        [Lifts.row_plateMachine, Lifts.row_machine], // Row chest supported
        [Lifts.curl_wrist, Lifts.shrug_dumbbell],
      ],
    },
    {
      name: 'Lower 1',
      lifts: [
        Lifts.hipAdduction,
        Lifts.hipAbduction,
        Lifts.legExtensions,
        Lifts.deadlift_barbell,
        // TODO should be legPress_single
        [Lifts.legPress, Lifts.splitSquat],
        // TODO core 1
      ],
    },
    {
      name: 'Upper 2',
      lifts: [
        [Lifts.ohp_barbell, Lifts.ohp_seated, Lifts.ohp_dumbbell],
        [Lifts.bench_closegrip, Lifts.dip_machine],
        [Lifts.uprightRow_barbell, Lifts.latRaise_dumbbell],
        [Lifts.row_barbell, Lifts.row_dumbbell], // Row Free-weight
        [Lifts.curl_incline, Lifts.curl_ezBar],
        [Lifts.reverseFly_machine, Lifts.facePull],
        [Lifts.pullover_dumbbell, Lifts.pullover_machine],
      ],
    },
    {
      name: 'Lower 2',
      lifts: [
        Lifts.legExtensions,
        [Lifts.legCurl_laying, Lifts.legCurl_seated], // TODO pick 1 and opposite on lower3
        [Lifts.squat_front, Lifts.squat_barbell],
        [Lifts.rdl_barbell, Lifts.deadlift_deficit],
        [Lifts.calfRaise_seated, Lifts.calfRaise_standing], // TODO pick 1 and opposite on lower3
        // TODO core 2
      ],
    },
    {
      name: 'Upper 3',
      lifts: [
        [Lifts.bench_dumbbell, Lifts.bench_barbell],
        [Lifts.ohp_plateMachine, Lifts.inclinePress_plateMachine],
        Lifts.tricep_overhead,
        [Lifts.row_cable, Lifts.row_cableWide], // Row Cable
        [
          Lifts.pulldown_cable,
          Lifts.pulldown_machine,
          Lifts.pulldown_plateMachine,
        ],
        [Lifts.curl_hammer, Lifts.curl_reverse],
      ],
    },
    {
      name: 'Lower 3',
      lifts: [
        [Lifts.legCurl_laying, Lifts.legCurl_seated],
        [Lifts.legPress, Lifts.squat_belt, Lifts.squat_v],
        [Lifts.deadlift_trapbar, Lifts.deadlift_sumo],
        [Lifts.hipThrust, Lifts.gluteKickback],
        [Lifts.calfRaise_seated, Lifts.calfRaise_standing],
        // TODO core 3
        [Lifts.backExtension],
      ],
    },
  ].map(buildWorkout),
];
