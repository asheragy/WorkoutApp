import { WorkoutItem } from '../types/workout.ts';
import Utils from '../../components/Utils.ts';
import { WorkoutTemplate } from '../types/template.ts';

type LiftBuilder = { id: string } | { id: string }[];

type WorkoutBuilder = {
  name: string;
  lifts: LiftBuilder[];
};

export function buildWorkout(builder: WorkoutBuilder): WorkoutTemplate {
  return {
    // TODO this could be passed in via builder
    routineId: '', // Set later
    name: builder.name,
    items: builder.lifts.map(mapIds),
  };
}

export function mapIds(item: LiftBuilder): WorkoutItem {
  if (Array.isArray(item)) {
    return {
      kind: 'oneOf',
      instanceId: Utils.generate_uuidv4(),
      lifts: item.map(i => {
        return {
          id: i.id,
          instanceId: Utils.generate_uuidv4(),
          sets: [],
        };
      }),
    };
  }

  return {
    id: item.id,
    instanceId: Utils.generate_uuidv4(),
    sets: [],
  };
}
