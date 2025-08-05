import {Routine} from '../types/workout';
import {UpperLower} from '../routines/4_UpperLower.ts';
import {YatesSplit} from '../routines/4_Yates.ts';
import {PPL_3Day} from '../routines/3_PPL.ts';
import {HLM_3Day} from '../routines/3_HLM.ts';
import {ULPPL} from '../routines/5_ULPPL.ts';
import {UpperLower6} from '../routines/6_UpperLower.ts';
import {ULArnold} from '../routines/5_ULArnold.ts';

const key = 'routines';

export const PreLoadedRoutines = [
  UpperLower,
  UpperLower6,
  YatesSplit,
  PPL_3Day,
  HLM_3Day,
  ULPPL,
  ULArnold,
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

    return [{title: 'Default'}, ...PreLoadedRoutines.map(x => x[0])];
  }
}
