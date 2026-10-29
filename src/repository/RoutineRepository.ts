import { DEFAULT_ROUTINE, Routine } from '../core/types/workout';
import { UpperLower } from '../core/routines/4_UpperLower.ts';
import { YatesSplit } from '../core/routines/4_Yates.ts';
import { PPL_3Day } from '../core/routines/3_PPL.ts';
import { HLM_3Day } from '../core/routines/3_HLM.ts';
import { ULPPL } from '../core/routines/5_ULPPL.ts';
import { ULArnold } from '../core/routines/5_ULArnold.ts';
import { FullBody_1Day } from '../core/routines/1_Full.ts';
import { YatesSplitModified } from '../core/routines/4_Yates_Modified.ts';
import { UpperLower_2Day } from '../core/routines/2_UpperLower.ts';
import { UpperLower2026 } from '../core/routines/6_UpperLower.ts';

export const PreLoadedRoutines = [
  UpperLower,
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
    /* TODO only hard coded for now
    const value = await AsyncStorage.getItem(key);
    const result = [{title: 'Default'}];

    if (value == null) {
      result.push(...PreLoadedRoutines.map(x => x[0]));
    } else {
      let json: Routine[] = JSON.parse(value);
      result.push(...json);
    }

    return result;
     */

    return [
      { id: DEFAULT_ROUTINE, title: 'Default' },
      ...PreLoadedRoutines.map(x => x[0]),
    ];
  }
}
