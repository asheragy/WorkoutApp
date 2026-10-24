import { Lift, Routine } from './workout.ts';

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

// Narrow with `'kind' in item` until Lift gets its own discriminant
export type WorkoutItem = Lift | LiftGroup;

export type LiftGroup = {
  kind: 'oneOf'; // only kind for now; room for 'superset' later
  instanceId: string;
  lifts: Lift[]; // always 2 or more; a group of 1 is just a Lift
};

export function isLiftGroup(item: WorkoutItem): item is LiftGroup {
  return 'kind' in item;
}
