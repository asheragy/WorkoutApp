import { Routine, Workout } from './workout.ts';

export type RoutineTemplate = {
  routine: Routine;
  workouts: Workout[];
};
