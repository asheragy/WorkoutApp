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
  instanceId: string;
  sets: LiftSet[];
  // TODO should be PersistedSet[]
  goals?: LiftSet[];
  hide?: boolean;
  note?: string;
  alternate?: boolean;
};

// TODO weight/reps not nullable + define as union with PersistedSet
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
