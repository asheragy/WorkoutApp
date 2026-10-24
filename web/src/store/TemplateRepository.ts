import { DEFAULT_ROUTINE, Routine, Workout } from '@shared/types/workout.ts';
import { RoutineTemplate, WorkoutTemplate } from '@shared/types/template.ts';
import LiftUtils from '@shared/utils/LiftUtils.ts';
import { UpperLower } from '@shared/routines/4_UpperLower.ts';
import { UpperLower6 } from '@shared/routines/6_UpperLower.ts';
import { UpperLower2026 } from '@shared/routines/6_UpperLower2026.ts';
import { YatesSplit } from '@shared/routines/4_Yates.ts';
import { YatesSplitModified } from '@shared/routines/4_Yates_Modified.ts';
import { PPL_3Day } from '@shared/routines/3_PPL.ts';
import { HLM_3Day } from '@shared/routines/3_HLM.ts';
import { ULPPL } from '@shared/routines/5_ULPPL.ts';
import { ULArnold } from '@shared/routines/5_ULArnold.ts';
import { FullBody_1Day } from '@shared/routines/1_Full.ts';
import { UpperLower_2Day } from '@shared/routines/2_UpperLower.ts';

const PreLoadedRoutines = [
  UpperLower,
  UpperLower6,
  UpperLower2026,
  YatesSplit,
  YatesSplitModified,
  PPL_3Day,
  HLM_3Day,
  ULPPL,
  ULArnold,
  FullBody_1Day,
  UpperLower_2Day,
];

export default class TemplateRepository {
  static async listAll(): Promise<Routine[]> {
    return [
      { id: DEFAULT_ROUTINE, title: 'Default' },
      ...PreLoadedRoutines.map(x => x[0]),
    ];
  }

  static async get(id: string): Promise<RoutineTemplate | undefined> {
    const entry = PreLoadedRoutines.find(x => x[0].id === id);
    if (entry) {
      return {
        routine: entry[0],
        workouts: entry[1].map(toTemplate),
      };
    }

    return undefined;
  }
}

// Converts the legacy positional `alternate` flags into explicit groups.
// Remove once Workout shares the WorkoutTemplate shape.
function toTemplate(workout: Workout): WorkoutTemplate {
  return {
    id: workout.id,
    routineId: workout.routineId,
    name: workout.name,
    items: LiftUtils.groupLifts(workout.lifts).map(group => {
      const lifts = group.map(({ alternate: _alternate, ...lift }) => lift);
      return lifts.length === 1
        ? lifts[0]
        : { kind: 'oneOf', instanceId: lifts[0].instanceId, lifts };
    }),
  };
}
