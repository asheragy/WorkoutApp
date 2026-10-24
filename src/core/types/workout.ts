export const DEFAULT_ROUTINE = 'default';

export type Routine = {
  id: string;
  title: string;
};

export type Workout = {
  id?: string;
  routineId: string;
  lastCompleted?: Date;
  name: string;
  lifts: Lift[];
  // TODO items: WorkoutItem[];
};

export type WorkoutItem = Lift | LiftGroup;
export type LiftGroup = {
  kind: 'oneOf'; // only kind for now; room for 'superset' later
  instanceId: string;
  lifts: Lift[]; // always 2 or more; a group of 1 is just a Lift
};

export type Lift = {
  id: string;
  instanceId: string;
  sets: LiftSet[];
  goals?: LiftSet[];
  goals2?: LiftSet[];
  hide?: boolean;
  note?: string;
  alternate?: boolean;
};

export type LiftSet = {
  weight: number;
  reps: number;
  warmup?: boolean;
  percentage?: boolean; // Weight is a percentage of training max
  completed?: boolean;
};
