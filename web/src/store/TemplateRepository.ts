import { DEFAULT_ROUTINE, Routine } from '@shared/types/workout.ts';
import { RoutineTemplate } from '@shared/types/template.ts';
import { UpperLower } from '@shared/routines/4_UpperLower.ts';
import { UpperLower6 } from '@shared/routines/6_UpperLower.ts';
import { UpperLower2026 } from '../../../src/core/routines/6_UpperLower.ts';
import { YatesSplit } from '@shared/routines/4_Yates.ts';
import { YatesSplitModified } from '@shared/routines/4_Yates_Modified.ts';
import { PPL_3Day } from '@shared/routines/3_PPL.ts';
import { HLM_3Day } from '@shared/routines/3_HLM.ts';
import { ULPPL } from '@shared/routines/5_ULPPL.ts';
import { ULArnold } from '@shared/routines/5_ULArnold.ts';
import { FullBody_1Day } from '@shared/routines/1_Full.ts';
import { UpperLower_2Day } from '@shared/routines/2_UpperLower.ts';
import { FullBody_3day } from '../../../src/core/routines/3_FullBody.ts';

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
  FullBody_3day,
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
        workouts: entry[1],
      };
    }

    return undefined;
  }
}
