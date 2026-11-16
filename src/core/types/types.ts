import { DEFAULT_ROUTINE, WeightReps } from './workout.ts';

export enum LiftType {
  Barbell = 1,
  Dumbbell,
  MachineStack,
  MachinePlateSingle,
  MachinePlateDouble,
  Bodyweight, // Weight can be positive/negative with baseline on bodyweight
  Other,
}

export enum MuscleGroup {
  Chest,
  Back,
  Shoulders,
  Biceps,
  Triceps,
  Abs,
  Other,
  // Lower
  LowerBack,
  Quads,
  Hamstrings,
  Glutes,
  Calves,
}

export type LiftDef = {
  id: string;
  name: string;
  displayName: string;
  type: LiftType;
  system?: boolean;
  muscleGroups: ReadonlyArray<MuscleGroup>;
  goal?: WeightReps;
  baseWeight?: number;
  factor?: number;
  // Portion of bodyweight lifted for Bodyweight lifts (0.9 = 90%), defaults to 1
  bodyweightFactor?: number;
  timed?: boolean; // Measured in seconds not reps
};

/**
 * Generic display object for sets
 */
export type NormalizedSet = {
  weight: string;
  reps: string;
  label: string;
  completed: boolean;
  plates?: string;
};

export type GlobalSettings = {
  largestHalfPoundDumbbell?: number;
  plateCount?: boolean;
  routine: string;
  routineName?: string;
  bodyweight?: number;
};

export const DEFAULT_SETTINGS: GlobalSettings = {
  routine: DEFAULT_ROUTINE,
  largestHalfPoundDumbbell: 47.5,
  plateCount: true,
  bodyweight: 206,
};
