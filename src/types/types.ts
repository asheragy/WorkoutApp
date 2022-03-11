export type LiftSet = {
  weight?: number | Range;
  reps: number | Range;
  repeat?: number;
  amrap?: boolean;
};

export type PersistedSet = {
  weight: number;
  reps: number;
};

export type Lift = {
  name: string;
  sets?: LiftSet[];
};

export type PersistedLift = {
  name: string;
  id: string;
  sets: PersistedSet[];
};

export type WorkoutNode = {
  name?: string;
  lifts: (Lift | PersistedLift)[];
  accessories?: AccessoryGroup[]
};

export type AccessoryGroup = {
  name: string;
  lifts: string[]
}

export type Program = {
  workouts: WorkoutNode[];
};

export type Range = {
  min: number;
  max: number;
};
