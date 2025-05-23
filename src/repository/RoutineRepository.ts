import {Routine, Workout} from '../types/workout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UpperLower} from '../routines/4_UpperLower.ts';
import {YatesSplit} from '../routines/4_Yates.ts';

const key = 'routines';

export const PreLoadedRoutines = [UpperLower, YatesSplit];

export default class RoutineRepository {
  static async getAll(): Promise<Routine[]> {
    const value = await AsyncStorage.getItem(key);
    const result = [{title: 'Default'}];

    if (value == null) {
      // TODO save to database
      result.push(...PreLoadedRoutines.map(x => x[0]));
    } else {
      let json: Routine[] = JSON.parse(value);
      result.push(...json);
    }

    return result;
  }
}
