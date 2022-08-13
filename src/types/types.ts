import {EdgeInsetsPropType} from 'react-native';

export type LiftSet = {
  weight: Weight;
  reps: Reps;
};

export type Weight = {
  // TODO for custom lifts no default should be required so value could be nullable
  value: number;
  // Editable if range exists, default is unlimited
  range?: Range;
};

export type Reps = {
  value: number;
  range?: Range; // AMRAP = 0-max
};

// For storage only, saves weight.value and reps.value
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
  def: LiftDef;
  sets: LiftSet[];
  goal?: string; // This could be a list
  persisted: boolean;
};

export type PersistedLift = {
  def: LiftDef;
  sets: LiftSet[];
  goal?: string; // This could be a list
  persisted: boolean;
};

export type PersistedLiftHistory = {
  date: Date;
  sets: PersistedSet[];
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

// Min/max weight
// min/max reps
// AMRAP null max, optional null min
export type Range = {
  min?: number;
  max?: number;
};

export type WeightEntry = {
  date: Date;
  weight: number;
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
