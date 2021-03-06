import AsyncStorage from '@react-native-async-storage/async-storage';
import {PersistedLift, Program, WeightEntry, WorkoutNode} from '../types/types';
import getProgram from '../data/programs/basic';

export type Workout = {
  node: WorkoutNode;
  position: number;
  completed: Boolean;
};

const weightLogKey = '@weightLog';

export default class WeightRepository {
  static async getAll(): Promise<WeightEntry[]> {
    var value = await AsyncStorage.getItem(weightLogKey);
    console.log(value);
    if (value != null) {
      // Date is still a string
      var stringResult: {date: string; weight: number}[] = JSON.parse(value);

      return stringResult.map(entry => {
        var we: WeightEntry = {
          date: new Date(entry.date),
          weight: entry.weight,
        };

        return we;
      });
    }

    return [];
  }

  static async add(entry: WeightEntry): Promise<void> {
    var existing = await this.getAll();
    existing.push(entry);
    return AsyncStorage.setItem(weightLogKey, JSON.stringify(existing));
  }

  static async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(weightLogKey);
    } catch (e) {}
  }
}
