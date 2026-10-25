import { Routine, Workout } from '../types/workout.ts';
import { Lifts } from '../LiftDatabase.ts';
import Utils from '../../components/Utils.ts';

const ROUTINE_ID = 'fullBody3';

export const FullBody_3day: [Routine, Workout[]] = [
  {
    id: ROUTINE_ID,
    title: '3-day Full Body',
  },
  [
    {
      id: 'd1',
      name: 'Legs',
      routineId: ROUTINE_ID,
      lifts: [
        {
          id: Lifts.hipAdduction.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 100, reps: 15 },
            { weight: 115, reps: 15 },
          ],
        },
        {
          id: Lifts.hipAbduction.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 90, reps: 15 },
            { weight: 105, reps: 15 },
          ],
        },
        {
          id: Lifts.legExtensions.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
          ],
        },
        {
          id: Lifts.deadlift_trapbar.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 190, reps: 6 },
            { weight: 190, reps: 9 },
          ],
        },
        {
          id: Lifts.rdl_barbell.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 155, reps: 8 },
            { weight: 155, reps: 10 },
          ],
        },
        {
          id: Lifts.hipThrust.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 80, reps: 8 },
            { weight: 80, reps: 11 },
          ],
        },
        {
          id: Lifts.calfRaise_seated.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 55, reps: 11 },
            { weight: 55, reps: 14 },
          ],
        },
        {
          id: Lifts.calfRaise_standing.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 5, reps: 10 },
            { weight: 5, reps: 12 },
          ],
        },
        {
          id: Lifts.legPress_single.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
          ],
        },
        {
          id: Lifts.squat_barbell.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 135, reps: 6 },
            { weight: 135, reps: 6 },
          ],
        },
        {
          id: Lifts.deadlift_barbell.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [{ weight: 225, reps: 5 }],
        },
        {
          id: Lifts.legCurl_kneeling.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 50, reps: 8 },
            { weight: 50, reps: 10 },
          ],
        },
        {
          id: Lifts.legPress.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 210, reps: 10 },
            { weight: 180, reps: 15 },
          ],
        },
        {
          id: Lifts.squat_belt.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 150, reps: 7 },
            { weight: 150, reps: 10 },
          ],
        },
      ],
    },
    {
      id: 'misc',
      name: 'Misc',
      routineId: ROUTINE_ID,
      lifts: [
        {
          id: Lifts.pullover_dumbbell.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 40, reps: 11 },
            { weight: 40, reps: 14 },
            { weight: 40, reps: 14 },
          ],
        },
        {
          id: Lifts.pullover_machine.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 100, reps: 11 },
            { weight: 100, reps: 14 },
          ],
          alternate: true,
        },
        {
          id: Lifts.plank.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
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
          ],
        },
        {
          id: Lifts.legRaise.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
          ],
        },
        {
          id: Lifts.shrug_dumbbell.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 70, reps: 12 },
            { weight: 70, reps: 15 },
          ],
        },
      ],
    },
    {
      id: 'push',
      name: 'Push',
      routineId: ROUTINE_ID,
      lifts: [
        {
          id: Lifts.bench_barbell.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 155, reps: 5 },
            { weight: 135, reps: 10 },
          ],
        },
        {
          id: Lifts.ohp_plateMachine.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 60, reps: 6 },
            { weight: 60, reps: 9 },
          ],
        },
        {
          id: Lifts.tricep_overhead.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 45, reps: 10 },
            { weight: 45, reps: 13 },
          ],
        },
        {
          id: Lifts.ohp_seated.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 90, reps: 7 },
            { weight: 90, reps: 9 },
          ],
        },
        {
          id: Lifts.bench_closegrip.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 145, reps: 7 },
            { weight: 135, reps: 10 },
          ],
        },
        {
          id: Lifts.latRaise_dumbbell.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 17.5, reps: 11 },
            { weight: 17.5, reps: 14 },
          ],
        },
        {
          id: Lifts.reverseFly_machine.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 85, reps: 9 },
            { weight: 85, reps: 11 },
          ],
        },
        {
          id: Lifts.inclinePress_dumbbell.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 55, reps: 8 },
            { weight: 55, reps: 11 },
          ],
        },
        {
          id: Lifts.dip.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 0, reps: 5 },
            { weight: 0, reps: 5 },
          ],
        },
        {
          id: Lifts.fly_machine.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 105, reps: 12 },
            { weight: 105, reps: 15 },
          ],
        },
      ],
    },
    {
      id: 'pull',
      name: 'Pull',
      routineId: ROUTINE_ID,
      lifts: [
        {
          id: Lifts.pullup.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: -70, reps: 8 },
            { weight: -70, reps: 10 },
            { weight: -70, reps: 10 },
          ],
        },
        {
          id: Lifts.pulldown_plateMachine.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 85, reps: 8 },
            { weight: 85, reps: 10 },
          ],
        },
        {
          id: Lifts.row_barbell.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 135, reps: 10 },
            { weight: 115, reps: 15 },
          ],
        },
        {
          id: Lifts.row_cable.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 130, reps: 8 },
            { weight: 130, reps: 10 },
          ],
        },
        {
          id: Lifts.row_plateMachine.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 70, reps: 9 },
            { weight: 70, reps: 12 },
          ],
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
          id: Lifts.curl_incline.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 30, reps: 8 },
            { weight: 30, reps: 10 },
          ],
        },
        {
          id: Lifts.curl_reverse.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [
            { weight: 50, reps: 9 },
            { weight: 50, reps: 12 },
          ],
        },
      ],
    },
  ],
];
