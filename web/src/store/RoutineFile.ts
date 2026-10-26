import { RoutineTemplate } from '@shared/types/template.ts';
import {
  isLiftGroup,
  Lift,
  LiftSet,
  WorkoutItem,
} from '@shared/types/workout.ts';

// On-disk format for src/core/routinesNew/<routineId>.json: the RoutineTemplate shape
// plus a version field. Runtime-only fields (completed, lastCompleted, hide) are
// never written.
export const FILE_VERSION = 1;

export type RoutineFile = RoutineTemplate & { version: number };

export function toFile(template: RoutineTemplate): RoutineFile {
  return {
    version: FILE_VERSION,
    routine: template.routine,
    workouts: template.workouts.map(w => ({
      ...(w.id !== undefined && { id: w.id }),
      name: w.name,
      routineId: w.routineId,
      items: w.items.map(cleanItem),
    })),
  };
}

export function serialize(template: RoutineTemplate): string {
  return JSON.stringify(toFile(template), null, 2);
}

// PUT the routine to the dev-server plugin (web/plugins/routinesApi.ts).
export async function saveRoutine(template: RoutineTemplate): Promise<void> {
  const res = await fetch(
    `/api/routines/${encodeURIComponent(template.routine.id)}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: serialize(template),
    },
  );
  if (!res.ok)
    throw new Error(`Save failed (${res.status}): ${await res.text()}`);
}

function cleanItem(item: WorkoutItem): WorkoutItem {
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
    sets: lift.sets.map(cleanSet),
    ...(lift.goals && { goals: lift.goals.map(cleanSet) }),
    ...(lift.goals2 && { goals2: lift.goals2.map(cleanSet) }),
    ...(lift.note && { note: lift.note }),
  };
}

function cleanSet(set: LiftSet): LiftSet {
  return {
    weight: set.weight,
    reps: set.reps,
    ...(set.warmup && { warmup: true }),
  };
}
