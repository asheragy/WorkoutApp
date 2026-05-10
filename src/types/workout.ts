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
  goals?: LiftSet[];
  hide?: boolean;
  note?: string;
  alternate?: boolean;
};

export type LiftSet = {
  weight: number;
  reps: number;
  warmup?: boolean;
  percentage?: boolean; // Weight is a percentage of training max
  completed?: boolean;
};

export type AccessoryGroup = {
  name: string;
  lifts: string[];
};
