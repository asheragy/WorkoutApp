import { Routine, WorkoutItem } from './workout.ts';

export type RoutineTemplate = {
  routine: Routine;
  workouts: WorkoutTemplate[];
};

// TODO goal is everything below can be merged with normal Workout types
export type WorkoutTemplate = {
  id?: string; // undefined until first save
  routineId: string;
  name: string;
  items: WorkoutItem[];
};
export class WorkoutItemTemplate {}
