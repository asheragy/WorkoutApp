export const DEFAULT_ROUTINE = 'default';

export type Routine = {
  id: string;
  title: string;
  description?: string; // free-form notes about the routine; web editor only for now
};

export type Workout = {
  id?: string;
  routineId: string;
  lastCompleted?: Date;
  name: string;
  items: WorkoutItem[];
};

export type WorkoutItem = Lift | LiftGroup;
export type LiftGroup = {
  kind: 'oneOf'; // only kind for now; room for 'superset' later
  instanceId: string;
  lifts: Lift[]; // always 2 or more; a group of 1 is just a Lift
};

export function isLiftGroup(item: WorkoutItem): item is LiftGroup {
  return 'kind' in item;
}

export type Lift = {
  id: string;
  instanceId: string;
  sets: LiftSet[];
  goals?: WeightReps[];
  goals2?: WeightReps[];
  hide?: boolean;
  note?: string;
};

export type WeightReps = { weight: number; reps: number };

export type PersistedSet = WeightReps & {
  warmup?: boolean;
};

export type LiftSet = PersistedSet & {
  completed?: boolean;
};
