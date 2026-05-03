import { Lift, Workout } from '../types/workout.ts';
import Utils from '../components/Utils.ts';

type LiftBuilder = { id: string } | { id: string }[];

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
      instanceId: Utils.generate_uuidv4(),
      sets: [],
      ...(index > 0 && { alternate: true }),
    }));
  }

  return [
    {
      id: item.id,
      instanceId: Utils.generate_uuidv4(),
      sets: [],
    },
  ];
}
