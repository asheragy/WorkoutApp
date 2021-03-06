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

/**
 * Generic display object for sets
 */
export type NormalizedSet = {
  weight: string;
  reps: string;
};

export type Lift = {
  name: string;
  sets?: LiftSet[];
};

export type PersistedLift = {
  name: string;
  key: string;
  step?: number;
  sets: PersistedSet[];
};

export type PersistedLiftHistory = {
  date: Date;
  lift: PersistedLift;
};

export type WorkoutNode = {
  name?: string;
  lifts: (Lift | PersistedLift)[];
  accessories?: AccessoryGroup[];
};

export type AccessoryGroup = {
  name: string;
  lifts: string[];
};

export type Program = {
  workouts: WorkoutNode[];
};

export type Range = {
  min: number;
  max: number;
};

export type WeightEntry = {
  date: Date;
  weight: number;
};
