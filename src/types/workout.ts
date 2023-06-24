import {LiftDef} from './types';

export type Workout = {
  id?: string;
  lastCompleted?: Date;
  name: string;
  lifts: Lift[];
  accessories?: AccessoryGroup[];
};

export type Lift = {
  id: string;
  /**
   * @deprecated use id instead
   */
  def: LiftDef;
  sets: LiftSet[];
};

export type LiftSet = {
  weight?: number;
  reps?: number;
  warmup?: boolean;
  percentage?: boolean; // Weight is a percentage of training max
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
