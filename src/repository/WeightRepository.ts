import AsyncStorage from '@react-native-async-storage/async-storage';
import {WeightEntry} from '../types/types';

const weightLogKey = 'weightLog';

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

  static async removeLast(): Promise<void> {
    var existing = await this.getAll();
    if (existing.length > 0) {
      existing.pop();
      return AsyncStorage.setItem(weightLogKey, JSON.stringify(existing));
    }
  }
}
