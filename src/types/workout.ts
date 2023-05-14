import {LiftDef} from './types';

export type WorkoutNode = {
  // TODO require this if the editor screen makes sense to always have it
  id?: string;
  lastCompleted?: Date;
  name: string;
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
