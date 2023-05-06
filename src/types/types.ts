export type WorkoutNode = {
  name?: string;
  lifts: Lift[];
  accessories?: AccessoryGroup[];
};

export type Lift = {
  def: LiftDef;
  sets: LiftSet[];
};

export type LiftSet = {
  weight?: number;
  reps?: number;
  // TODO this is no longer true for warmups
  // TODO validate these are all at the beginning, some logic assumes that
  warmup?: boolean;
};

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

export type AccessoryGroup = {
  name: string;
  lifts: string[];
};

// Min/max weight
// min/max reps
// AMRAP null max, optional null min
export type Range = {
  min?: number;
  max?: number;
};

// ------------- Non Program types ---------------

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
