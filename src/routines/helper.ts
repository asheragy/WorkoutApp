import {Lift, Workout} from '../types/workout.ts';

type LiftBuilder = {id: string} | {id: string}[];

type WorkoutBuilder = {
  name: string;
  lifts: LiftBuilder[];
};

export function buildWorkout(builder: WorkoutBuilder): Workout {
  return {
    name: builder.name,
    lifts: builder.lifts.flatMap(mapIds),
  };
}

export function mapIds(item: LiftBuilder): Lift[] {
  if (Array.isArray(item)) {
    return item.map((lift, index) => ({
      id: lift.id,
      sets: [],
      ...(index > 0 && {alternate: true}),
    }));
  }

  return [
    {
      id: item.id,
      sets: [],
    },
  ];
}
