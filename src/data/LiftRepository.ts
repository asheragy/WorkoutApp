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

        // TODO temp persisted check
        if (lift.persisted && 'def' in lift) {
          if (!map.has(lift.def.id) && !ignore.has(lift.def.id)) {
            var persisted = await this.getLift(lift.def.id);
            if (persisted != null) map.set(lift.def.id, persisted);
            else ignore.add(lift.def.id);
          }
        }
      }
    }

    return map;
  }

  static async saveLift(lift: PersistedLift): Promise<void> {
    return AsyncStorage.setItem(
      liftKeyPrefix + lift.def.id,
      JSON.stringify(lift.sets),
    );
  }

  // TODO could take LiftDef to be more type safe
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
      if (lift.persisted && 'def' in lift) {
        var savedValue = await this.getLift(lift.def.id);
        if (savedValue != null) this.addHistory(lift.def.id, savedValue);
        else this.addHistory(lift.def.id, lift.sets);
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
