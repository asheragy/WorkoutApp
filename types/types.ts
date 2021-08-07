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

export type Workout = {
  week: number;
  lifts: Lift[];
};

export type Program = {
  workouts: Workout[];
};

export type Range = {
  min: number;
  max: number;
};
