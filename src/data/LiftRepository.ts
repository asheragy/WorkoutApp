import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PersistedLift,
  PersistedLiftHistory,
  Program,
  WorkoutNode,
} from '../types/types';

const liftKeyPrefix = 'lift:';
const historyKeyPrefix = 'liftHistory:';

export default class LiftRepository {
  static async getLift(key: string): Promise<PersistedLift | null> {
    var value = await AsyncStorage.getItem(liftKeyPrefix + key);
    //console.log('GetLift ' + key + ' = ' + value);
    if (value != null) {
      return JSON.parse(value);
    }

    return null;
  }

  static async getLifts(program: Program): Promise<Map<string, PersistedLift>> {
    var map = new Map<string, PersistedLift>();
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
    return AsyncStorage.setItem(liftKeyPrefix + lift.key, JSON.stringify(lift));
  }

  static async getHistory(key: string): Promise<PersistedLiftHistory[]> {
    var value = await AsyncStorage.getItem(historyKeyPrefix + key);
    if (value == null) return [];

    var stringResult: {date: string; lift: PersistedLift}[] = JSON.parse(value);

    return stringResult.map(entry => {
      var item: PersistedLiftHistory = {
        date: new Date(entry.date),
        lift: entry.lift,
      };

      return item;
    });
  }

  static async addAllHistory(workout: WorkoutNode): Promise<void> {
    for (var i = 0; i < workout.lifts.length; i++) {
      var lift = workout.lifts[i];
      if ('key' in lift) {
        var savedValue = await this.getLift(lift.key);
        if (savedValue != null) this.addHistory(savedValue);
        else this.addHistory(lift);
      }
    }
  }

  private static async addHistory(lift: PersistedLift): Promise<void> {
    var history = await this.getHistory(lift.key);
    var item: PersistedLiftHistory = {
      date: new Date(),
      lift: lift,
    };

    history.push(item);

    await AsyncStorage.setItem(
      historyKeyPrefix + lift.key,
      JSON.stringify(history),
    );
  }
}
