import {LiftDef} from './types';

export type Routine = {
  id?: string;
  title: string;
};

export type Workout = {
  id?: string;
  routineId?: string;
  lastCompleted?: Date;
  name: string;
  lifts: Lift[];
  accessories?: AccessoryGroup[];
};

export type Lift = {
  id: string;
  sets: LiftSet[];
  goals?: LiftSet[];
  hide?: boolean;
  note?: string;
  alternate?: boolean;
};

export type LiftSet = {
  weight?: number;
  reps?: number;
  warmup?: boolean;
  percentage?: boolean; // Weight is a percentage of training max
  completed?: boolean;
};

export type AccessoryGroup = {
  name: string;
  lifts: string[];
};

// Min/max weight
// min/max reps
// AMRAP null max, optional null min
/* TODO could be used as hint type for set range
  export type Range = {
    min?: number;
    max?: number;
  };
  */

export const SingleWorkoutId = '00000000-0000-0000-0000-000000000000';
