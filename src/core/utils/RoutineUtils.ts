import SetUtils from './SetUtils.ts';
import {
  isLiftGroup,
  Lift,
  Workout,
  WorkoutItem,
} from '../types/workout.ts';

// Version of the routine JSON format in src/core/routines.
export const ROUTINE_FILE_VERSION = 1;

// Workouts as they are stored in a routine JSON file: only the fields a
// routine cares about. Runtime state (workout id, lastCompleted, Lift.hide,
// LiftSet.completed) is dropped and routineId is blanked, since the routine
// the workouts belong to is given by the file itself.
export function cleanWorkouts(workouts: Workout[]): Workout[] {
  return workouts.map(w => ({
    name: w.name,
    routineId: '',
    items: w.items.map(cleanItem),
  }));
}

export function cleanItem(item: WorkoutItem): WorkoutItem {
  return isLiftGroup(item)
    ? {
        kind: 'oneOf',
        instanceId: item.instanceId,
        lifts: item.lifts.map(cleanLift),
      }
    : cleanLift(item);
}

function cleanLift(lift: Lift): Lift {
  return {
    id: lift.id,
    instanceId: lift.instanceId,
    sets: lift.sets.map(SetUtils.setToPersisted),
    ...(lift.goals && {
      goals: lift.goals.map(x => ({ weight: x.weight, reps: x.reps })),
    }),
    ...(lift.goals2 && {
      goals2: lift.goals2.map(x => ({ weight: x.weight, reps: x.reps })),
    }),
    ...(lift.note && { note: lift.note }),
  };
}
