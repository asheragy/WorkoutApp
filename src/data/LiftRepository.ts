import AsyncStorage from '@react-native-async-storage/async-storage';
import {PersistedLift, Program} from '../types/types';

const liftKeyPrefix = 'lift:';

export default class LiftRepository {
  static async getLift(key: string): Promise<PersistedLift | null> {
    var value = await AsyncStorage.getItem(liftKeyPrefix + key);
    console.log('GetLift ' + key + ' = ' + value);
    if (value != null) {
      return JSON.parse(value);
    }

    return null;
  }

  static async getLifts(program: Program): Promise<Map<string, PersistedLift>> {
    var map = new Map<string, PersistedLift>();
    for (const wo of program.workouts) {
      for (let i = 0; i < wo.lifts.length; i++) {
        const lift = wo.lifts[i];

        if ('key' in lift) {
          if (!map.has(lift.key)) {
            var persisted = await this.getLift(lift.key);
            if (persisted != null) map.set(lift.key, persisted);
          }
        }
      }
    }

    return map;
  }

  static async saveLift(lift: PersistedLift): Promise<void> {
    return AsyncStorage.setItem(liftKeyPrefix + lift.key, JSON.stringify(lift));
  }
}
