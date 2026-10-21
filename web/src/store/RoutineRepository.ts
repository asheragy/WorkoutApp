// Copied from src/repository/RoutineRepository.ts. The web app keeps its own
// copy because the two will drift: the phone app will read routines from
// SQLite, the web app from code files and web/data JSON.
import { DEFAULT_ROUTINE, Routine } from '@shared/types/workout.ts';
import { UpperLower } from '@shared/routines/4_UpperLower.ts';
import { YatesSplit } from '@shared/routines/4_Yates.ts';
import { PPL_3Day } from '@shared/routines/3_PPL.ts';
import { HLM_3Day } from '@shared/routines/3_HLM.ts';
import { ULPPL } from '@shared/routines/5_ULPPL.ts';
import { UpperLower6 } from '@shared/routines/6_UpperLower.ts';
import { ULArnold } from '@shared/routines/5_ULArnold.ts';
import { FullBody_1Day } from '@shared/routines/1_Full.ts';
import { YatesSplitModified } from '@shared/routines/4_Yates_Modified.ts';
import { UpperLower_2Day } from '@shared/routines/2_UpperLower.ts';
import { UpperLower2026 } from '@shared/routines/6_UpperLower2026.ts';

export const PreLoadedRoutines = [
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

export default class RoutineRepository {
  static async getAll(): Promise<Routine[]> {
    return [
      { id: DEFAULT_ROUTINE, title: 'Default' },
      ...PreLoadedRoutines.map(x => x[0]),
    ];
  }
}
