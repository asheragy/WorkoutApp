export type Program = {
  workouts: WorkoutNode[];
};

export type WorkoutNode = {
  name?: string;
  lifts: Lift[];
  accessories?: AccessoryGroup[];
};

export type Lift = {
  def: LiftDef;
  sets: LiftSet[];
  goal?: string; // This could be a list
  persisted: boolean;
};

export type LiftSet = {
  weight: Weight;
  reps: Reps;
  // TODO validate these are all at the beginning, some logic assumes that
  warmup?: boolean;
};

export type Weight = {
  // TODO for custom lifts no default should be required so value could be nullable
  value: number;
  // Editable if range exists, default is unlimited
  range?: Range;
};

export type Reps = {
  value: number;
  // AMRAP    = 0 / undefined
  // AMRAP 5+ = 5 / undefined
  // Any      = undefined / undefined
  // Range    = 8 / 12
  // Up to    = undefined / 12
  range?: Range;
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
