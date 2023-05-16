export enum LiftType {
  Barbell = 1,
  Dumbbell,
  // TODO plate loaded machine vs stack?
  Machine,
  Bodyweight, // Weight can be positive/negative with baseline on bodyweight
  Other,
}

export type LiftDef = {
  id: string;
  name: string;
  type: LiftType;
};

/**
 * Generic display object for sets
 */
export type NormalizedSet = {
  weight: string;
  reps: string;
  label: string;
};

export type WeightEntry = {
  date: Date;
  weight: number;
};

export type GlobalSettings = {
  largestHalfPoundDumbbell?: number;
};

export type PersistedSet = {
  weight: number;
  reps: number;
  warmup?: boolean;
};

export type TrainingMax = {
  id: string;
  max: number;
};
