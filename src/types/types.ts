export enum LiftType {
  Barbell = 1,
  Dumbbell,
  Machine, // Weight stack machine
  Bodyweight, // Weight can be positive/negative with baseline on bodyweight
  SSB,
  TrapBar,
  Other,
  PlateMachine, // Plate loaded machine
}

export type LiftDef = {
  id: string;
  name: string;
  type: LiftType;
  system?: boolean;
  trainingMax?: number;
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
  plateCount?: boolean;
};

export type PersistedSet = {
  weight: number;
  reps: number;
  warmup?: boolean;
};

export type PlateCount = {
  p45?: number;
  p25?: number;
  p10?: number;
  p5?: number;
  p2point5?: number;
};
