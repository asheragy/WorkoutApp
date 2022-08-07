import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PersistedLift,
  PersistedLiftHistory,
  PersistedSet,
  Program,
  WorkoutNode,
} from '../types/types';

const liftKeyPrefix = 'lift:';
const historyKeyPrefix = 'liftHistory:';

export default class LiftRepository {
  static async getLift(key: string): Promise<PersistedSet[] | null> {
    var value = await AsyncStorage.getItem(liftKeyPrefix + key);
    //console.log('GetLift ' + key + ' = ' + value);
    if (value != null) {
      return JSON.parse(value);
    }

    return null;
  }

  static async getLifts(
    program: Program,
  ): Promise<Map<string, PersistedSet[]>> {
    var map = new Map<string, PersistedSet[]>();
    var ignore = new Set<string>(); // Prevent multiple lookup attempts for missing values

    for (const wo of program.workouts) {
      for (let i = 0; i < wo.lifts.length; i++) {
        const lift = wo.lifts[i];

        if ('key' in lift) {
          if (!map.has(lift.key) && !ignore.has(lift.key)) {
            var persisted = await this.getLift(lift.key);
            if (persisted != null) map.set(lift.key, persisted);
            else ignore.add(lift.key);
          }
        }
      }
    }

    return map;
  }

  static async saveLift(lift: PersistedLift): Promise<void> {
    return AsyncStorage.setItem(
      liftKeyPrefix + lift.key,
      JSON.stringify(lift.sets),
    );
  }

  static async getHistory(key: string): Promise<PersistedLiftHistory[]> {
    var value = await AsyncStorage.getItem(historyKeyPrefix + key);
    if (value == null) return [];

    var stringResult: {date: string; sets: PersistedSet[]}[] =
      JSON.parse(value);

    return stringResult.map(entry => {
      var item: PersistedLiftHistory = {
        date: new Date(entry.date),
        sets: entry.sets,
      };

      return item;
    });
  }

  static async addAllHistory(workout: WorkoutNode): Promise<void> {
    for (var i = 0; i < workout.lifts.length; i++) {
      var lift = workout.lifts[i];
      if ('key' in lift) {
        var savedValue = await this.getLift(lift.key);
        if (savedValue != null) this.addHistory(lift.key, savedValue);
        else this.addHistory(lift.key, lift.sets);
      }
    }
  }

  private static async addHistory(
    key: string,
    sets: PersistedSet[],
  ): Promise<void> {
    var history = await this.getHistory(key);
    var item: PersistedLiftHistory = {
      date: new Date(),
      sets: sets,
    };

    history.push(item);

    await AsyncStorage.setItem(historyKeyPrefix + key, JSON.stringify(history));
  }
}
