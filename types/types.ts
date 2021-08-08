export type LiftSet = {
  weight?: Number;
  reps: number | Range;
  repeat?: number;
  amrap?: boolean;
};

export type Lift = {
  name: string;
  sets?: LiftSet[];
};

export type WorkoutNode = {
  name?: string;
  lifts: Lift[];
};

export type Program = {
  workouts: WorkoutNode[];
};

export type Range = {
  min: number;
  max: number;
};
