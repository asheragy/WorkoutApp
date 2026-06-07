import { Routine, Workout } from '../types/workout.ts';
import { Lifts } from '../repository/LiftDatabase.ts';
import Utils from '../components/Utils.ts';

export const UpperLower2026: [Routine, Workout[]] = [
  {
    id: 'upperLower2026',
    title: '6-day Upper Lower',
  },
  [
    {
      id: 'u1',
      name: 'Upper 1',
      lifts: [
        {
          id: Lifts.inclinePress_barbell.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 115, reps: 10 },
            { weight: 115, reps: 12 },
          ],
          goals: [
            { weight: 170, reps: 8 },
            { weight: 170, reps: 10 },
          ],
        },
        {
          id: Lifts.inclinePress_dumbbell.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 55, reps: 8 },
            { weight: 55, reps: 11 },
          ],
          goals: [
            { weight: 75, reps: 10 },
            { weight: 75, reps: 12 },
          ],
          alternate: false,
        },
        {
          id: Lifts.dip.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 0, reps: 5 },
            { weight: 0, reps: 5 },
          ],
          // No benchmark from previous year
        },
        {
          id: Lifts.fly_machine.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 105, reps: 12 },
            { weight: 105, reps: 15 },
          ],
          goals: [
            { weight: 150, reps: 12 },
            { weight: 150, reps: 15 },
          ],
          alternate: false,
        },
        {
          id: Lifts.latRaise_machine.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 55, reps: 9 },
            { weight: 55, reps: 12 },
          ],
          goals: [
            { weight: 75, reps: 11 },
            { weight: 75, reps: 13 },
          ],
        },
        {
          id: Lifts.ohp_btn.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 65, reps: 8 },
            { weight: 65, reps: 10 },
          ],
          goals: [
            { weight: 95, reps: 7 },
            { weight: 95, reps: 9 },
          ],
          alternate: false,
        },
        {
          id: Lifts.pullup.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: -70, reps: 8 },
            { weight: -70, reps: 10 },
          ],
          // No previous benchmark
        },
        {
          id: Lifts.pullup_neutral.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: -60, reps: 8 },
            { weight: -60, reps: 10 },
          ],
          goals: [
            { weight: 0, reps: 8 },
            { weight: 0, reps: 10 },
          ],
          alternate: false,
        },
        {
          id: Lifts.pullup_neutral.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 0, reps: 3 },
            { weight: 0, reps: 3 },
          ],
          goals: [
            { weight: 35, reps: 5 },
            { weight: 0, reps: 10 },
          ],
          alternate: true,
        },
        {
          id: Lifts.row_plateMachine.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 70, reps: 9 },
            { weight: 70, reps: 12 },
          ],
          goals: [
            { weight: 100, reps: 9 },
            { weight: 100, reps: 11 },
          ],
        },
        {
          id: Lifts.row_machine.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 100, reps: 9 },
            { weight: 100, reps: 12 },
          ],
          goals: [
            { weight: 140, reps: 10 },
            { weight: 140, reps: 12 },
          ],
          alternate: false,
        },
        {
          id: Lifts.curl_wrist.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
          ],
        },
        {
          id: Lifts.shrug_dumbbell.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 70, reps: 12 },
            { weight: 70, reps: 12 },
            { weight: 70, reps: 15 },
          ],
          goals: [
            { weight: 100, reps: 12 },
            { weight: 100, reps: 14 },
          ],
          alternate: false,
        },
      ],
    },
    {
      id: 'l1',
      name: 'Lower 1',
      lifts: [
        {
          id: Lifts.hipAdduction.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 100, reps: 15 },
            { weight: 110, reps: 15 },
            { weight: 115, reps: 15 },
          ],
          goals: [
            { weight: 145, reps: 15 },
            { weight: 160, reps: 15 },
          ],
        },
        {
          id: Lifts.hipAbduction.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 90, reps: 15 },
            { weight: 95, reps: 15 },
            { weight: 105, reps: 15 },
          ],
          goals: [
            { weight: 130, reps: 15 },
            { weight: 145, reps: 15 },
          ],
        },
        {
          id: Lifts.legExtensions.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
          ],
          goals: [
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
          ],
        },
        {
          id: Lifts.deadlift_barbell.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 225, reps: 5 },
            { weight: 195, reps: 10 },
          ],
          goals: [
            { weight: 275, reps: 10 },
            { weight: 315, reps: 6 },
          ],
        },
        // TODO should be legPress_single
        {
          id: Lifts.legPress.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
          ],
          goals: [
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
          ],
        },
        {
          id: Lifts.splitSquat.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
          ],
          // No goal just high rep and some weight
          alternate: false,
        },
        {
          id: Lifts.calfRaise_seatedStack.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
          ],
        },
        {
          id: Lifts.plank.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
          ],
        },
      ],
    },
    {
      id: 'u2',
      name: 'Upper 2',
      lifts: [
        {
          id: Lifts.ohp_barbell.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 85, reps: 7 },
            { weight: 85, reps: 10 },
          ],
          goals: [
            { weight: 120, reps: 8 },
            { weight: 120, reps: 10 },
          ],
        },
        {
          id: Lifts.ohp_seated.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 90, reps: 7 },
            { weight: 90, reps: 9 },
          ],
          goals: [
            { weight: 125, reps: 8 },
            { weight: 125, reps: 10 },
          ],
          alternate: true,
        },
        {
          id: Lifts.ohp_dumbbell.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 35, reps: 8 },
            { weight: 35, reps: 10 },
          ],
          // No baseline
        },
        {
          id: Lifts.bench_closegrip.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 145, reps: 7 },
            { weight: 135, reps: 10 },
          ],
          goals: [
            { weight: 195, reps: 10 },
            { weight: 175, reps: 13 },
          ],
        },
        // TODO alternate reps?
        // 135x8/10 and 185x9/11
        {
          id: Lifts.dip_machine.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 230, reps: 10 },
            { weight: 230, reps: 12 },
          ],
          goals: [
            { weight: 340, reps: 8 },
            { weight: 340, reps: 10 },
          ],
          alternate: false,
        },
        {
          id: Lifts.uprightRow_barbell.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 65, reps: 8 },
            { weight: 65, reps: 10 },
          ],
          goals: [
            { weight: 85, reps: 11 },
            { weight: 85, reps: 13 },
          ],
        },
        {
          id: Lifts.latRaise_dumbbell.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 17.5, reps: 11 },
            { weight: 17.5, reps: 14 },
          ],
          goals: [
            { weight: 25, reps: 10 },
            { weight: 25, reps: 13 },
          ],
          alternate: false,
        },
        {
          id: Lifts.row_barbell.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 135, reps: 10 },
            { weight: 115, reps: 15 },
          ],
          goals: [
            { weight: 195, reps: 9 },
            { weight: 165, reps: 15 },
          ],
        },
        // Row Free-weight
        {
          id: Lifts.row_dumbbell.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 50, reps: 8 },
            { weight: 50, reps: 10 },
          ],
          // No baseline
          alternate: false,
        },
        {
          id: Lifts.curl_incline.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 30, reps: 8 },
            { weight: 30, reps: 10 },
          ],
          goals: [
            { weight: 40, reps: 10 },
            { weight: 40, reps: 12 },
          ],
        },
        {
          id: Lifts.curl_ezBar.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 65, reps: 6 },
            { weight: 65, reps: 9 },
          ],
          goals: [
            { weight: 85, reps: 10 },
            { weight: 85, reps: 12 },
          ],
          alternate: false,
        },
        {
          id: Lifts.reverseFly_machine.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 85, reps: 9 },
            { weight: 85, reps: 11 },
          ],
          goals: [
            { weight: 110, reps: 12 },
            { weight: 110, reps: 15 },
          ],
        },
        {
          id: Lifts.facePull.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
          ],
          // No goal on these
          alternate: false,
        },
        {
          id: Lifts.pullover_dumbbell.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 40, reps: 11 },
            { weight: 40, reps: 11 },
            { weight: 40, reps: 14 },
          ],
          goals: [
            { weight: 55, reps: 12 },
            { weight: 55, reps: 15 },
          ],
        },
        {
          id: Lifts.pullover_machine.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 85, reps: 12 },
            { weight: 85, reps: 12 },
            { weight: 85, reps: 15 },
          ],
          goals: [
            { weight: 120, reps: 12 },
            { weight: 120, reps: 15 },
          ],
          alternate: true,
        },
      ],
    },
    {
      id: 'l2',
      name: 'Lower 2',
      lifts: [
        {
          id: Lifts.legExtensions.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
          ],
          goals: [
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
          ],
        },
        {
          id: Lifts.legCurl_laying.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
          ],
          goals: [
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
          ],
        },
        {
          id: Lifts.squat_front.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
          ],
          goals: [
            { weight: 185, reps: 10 },
            { weight: 225, reps: 5 },
          ],
        },
        {
          id: Lifts.squat_barbell.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
          ],
          goals: [
            { weight: 185, reps: 10 },
            { weight: 225, reps: 5 },
          ],
          alternate: false,
        },
        {
          id: Lifts.rdl_barbell.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 155, reps: 8 },
            { weight: 155, reps: 10 },
          ],
          goals: [
            { weight: 205, reps: 12 },
            { weight: 225, reps: 8 },
          ],
        },
        {
          id: Lifts.deadlift_deficit.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 165, reps: 7 },
            { weight: 165, reps: 10 },
          ],
          goals: [{ weight: 225, reps: 10 }],
          alternate: false,
        },
        {
          id: Lifts.calfRaise_seated.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 55, reps: 11 },
            { weight: 55, reps: 11 },
            { weight: 55, reps: 14 },
          ],
          goals: [
            { weight: 80, reps: 10 },
            { weight: 80, reps: 12 },
          ],
        },
        {
          id: Lifts.legRaise.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
          ],
        },
      ],
    },
    {
      id: 'u3',
      name: 'Upper 3',
      lifts: [
        {
          id: Lifts.bench_dumbbell.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 60, reps: 9 },
            { weight: 60, reps: 12 },
          ],
          goals: [
            { weight: 85, reps: 10 },
            { weight: 85, reps: 12 },
          ],
        },
        {
          id: Lifts.bench_barbell.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 155, reps: 5 },
            { weight: 135, reps: 10 },
          ],
          goals: [
            { weight: 195, reps: 10 },
            { weight: 215, reps: 5 },
            { weight: 245, reps: 1 },
          ],
          alternate: false,
        },
        {
          id: Lifts.ohp_plateMachine.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 60, reps: 6 },
            { weight: 60, reps: 9 },
          ],
          goals: [
            { weight: 80, reps: 9 },
            { weight: 80, reps: 11 },
          ],
        },
        {
          id: Lifts.inclinePress_plateMachine.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
          ],
          // No baseline for this, not doing it often
          alternate: false,
        },
        {
          id: Lifts.tricep_overhead.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 45, reps: 10 },
            { weight: 45, reps: 13 },
          ],
          goals: [
            { weight: 60, reps: 12 },
            { weight: 60, reps: 15 },
          ],
        },
        {
          id: Lifts.skull_crusher.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
          ],
        },
        {
          id: Lifts.row_cable.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 130, reps: 8 },
            { weight: 130, reps: 10 },
          ],
          goals: [
            { weight: 180, reps: 9 },
            { weight: 180, reps: 11 },
          ],
        },
        // Row Cable
        {
          id: Lifts.row_cableWide.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
          ],
          // No goal, new
          alternate: false,
        },
        {
          id: Lifts.pulldown_cable.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 110, reps: 7 },
            { weight: 110, reps: 10 },
          ],
          goals: [
            { weight: 150, reps: 9 },
            { weight: 150, reps: 11 },
          ],
        },
        {
          id: Lifts.pulldown_machine.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 145, reps: 11 },
            { weight: 145, reps: 13 },
          ],
          goals: [
            { weight: 205, reps: 11 },
            { weight: 205, reps: 13 },
          ],
          alternate: false,
        },
        {
          id: Lifts.pulldown_plateMachine.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 85, reps: 8 },
            { weight: 85, reps: 10 },
          ],
          goals: [
            { weight: 115, reps: 10 },
            { weight: 115, reps: 12 },
          ],
          alternate: true,
        },
        {
          id: Lifts.curl_hammer.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 27.5, reps: 8 },
            { weight: 27.5, reps: 10 },
          ],
          goals: [
            { weight: 35, reps: 12 },
            { weight: 35, reps: 15 },
          ],
        },
        {
          id: Lifts.curl_reverse.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 50, reps: 9 },
            { weight: 50, reps: 12 },
          ],
          goals: [
            { weight: 70, reps: 10 },
            { weight: 70, reps: 12 },
          ],
          alternate: false,
        },
      ],
    },
    {
      id: 'l3',
      name: 'Lower 3',
      lifts: [
        {
          // TODO pick 1 of seated or laying, the other should be kneeling
          id: Lifts.legCurl_seated.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
          ],
          goals: [
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
          ],
          alternate: false,
        },
        {
          id: Lifts.legPress.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 210, reps: 10 },
            { weight: 180, reps: 15 },
          ],
          goals: [
            { weight: 300, reps: 10 },
            { weight: 250, reps: 15 },
          ],
        },
        {
          id: Lifts.squat_belt.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 150, reps: 7 },
            { weight: 150, reps: 10 },
          ],
          goals: [
            { weight: 210, reps: 8 },
            { weight: 210, reps: 10 },
          ],
          alternate: false,
        },
        {
          id: Lifts.squat_v.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
          ],
          // No goal but 45+10 x 10 would be good
          alternate: true,
        },
        {
          id: Lifts.deadlift_trapbar.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 190, reps: 6 },
            { weight: 190, reps: 9 },
          ],
          goals: [
            { weight: 260, reps: 8 },
            { weight: 260, reps: 10 },
          ],
        },
        {
          id: Lifts.deadlift_sumo.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 165, reps: 7 },
            { weight: 165, reps: 10 },
          ],
          goals: [{ weight: 225, reps: 10 }],
          alternate: false,
        },
        {
          id: Lifts.hipThrust.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 80, reps: 8 },
            { weight: 80, reps: 11 },
          ],
          goals: [
            { weight: 115, reps: 8 },
            { weight: 115, reps: 10 },
          ],
        },
        {
          id: Lifts.gluteKickback.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
          ],
          // No goal, machine questionable
          alternate: false,
        },
        {
          id: Lifts.calfRaise_standing.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 5, reps: 10 },
            { weight: 5, reps: 10 },
            { weight: 5, reps: 12 },
          ],
          goals: [
            { weight: 70, reps: 10 },
            { weight: 70, reps: 12 },
          ],
        },
        {
          id: Lifts.backExtension.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
          ],
          goals: [
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
          ],
        },
        {
          id: Lifts.elevateCore.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
          ],
        },
      ],
    },
  ],
];
