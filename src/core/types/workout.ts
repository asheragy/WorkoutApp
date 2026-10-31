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
  goals?: LiftSet[];
  goals2?: LiftSet[];
  hide?: boolean;
  note?: string;
};

export type LiftSet = {
  weight: number;
  reps: number;
  warmup?: boolean;
  completed?: boolean;
};
