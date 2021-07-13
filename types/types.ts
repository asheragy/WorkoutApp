export class LiftSet {
  weight: Number;
  reps: number;
  repeat?: number;
  amrap?: boolean = false;
}

export class Lift {
  name: string;
  sets?: LiftSet[];
}

export class Workout {
  week: number;
  lifts: Lift[];
}

export class Program {
  workouts: Workout[];
}
