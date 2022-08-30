import AsyncStorage from '@react-native-async-storage/async-storage';
import {LiftDef, PersistedSet} from '../types/types';

const keyPrefix = 'goal:';

export default class GoalRepository {
  static async getGoal(key: string): Promise<PersistedSet[]> {
    var value = await AsyncStorage.getItem(keyPrefix + key);
    if (value != null) {
      return JSON.parse(value);
    }

    return [];
  }

  static async saveGoal(def: LiftDef, sets: PersistedSet[]): Promise<void> {
    return AsyncStorage.setItem(keyPrefix + def.id, JSON.stringify(sets));
  }

  static async clearAllGoals(): Promise<void> {
    var keys = await AsyncStorage.getAllKeys();

    keys.forEach(async key => {
      if (key.startsWith(keyPrefix)) {
        console.log('Deleting: ' + key);
        await AsyncStorage.removeItem(key);
      }
    });
  }
}
