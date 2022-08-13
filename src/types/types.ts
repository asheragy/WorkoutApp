import {EdgeInsetsPropType} from 'react-native';

export type LiftSet = {
  weight: Weight;
  reps: number | Range;
  amrap?: boolean;
};

export type Weight = {
  // TODO for custom lifts no default should be required so value could be nullable
  value: number;
  // Editable if range exists, default is unlimited
  range?: Range;
};

export type Reps = {
  value?: number;
  editable: boolean;
  range?: Range; // AMRAP = 0-max
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
  // TODO need some way to determine if persisted lift if LiftDef gets moved here
  name: string;
  sets?: LiftSet[];
};

export type PersistedLift = {
  def: LiftDef;
  sets: PersistedSet[];
  goal?: string; // This could be a list of PersistedSet
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
