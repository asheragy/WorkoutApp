import AsyncStorage from '@react-native-async-storage/async-storage';
import {GlobalSettings} from '../types/types';
import {dbReady} from './db.ts';

const SettingsKey = 'settings';

export default class SettingsRepository {
  static async get(): Promise<GlobalSettings> {
    await dbReady(); // 1 of 2 locations to ensure db is initialized

    const value = await AsyncStorage.getItem(SettingsKey);
    let result: GlobalSettings = {};

    if (value != null) {
      result = JSON.parse(value);
    }

    result.largestHalfPoundDumbbell = 47.5;
    result.plateCount = true;
    return result;
  }

  static async set<K extends keyof GlobalSettings>(
    key: K,
    value: GlobalSettings[K],
  ): Promise<void> {
    const settings = await this.get();
    settings[key] = value;

    await AsyncStorage.setItem(SettingsKey, JSON.stringify(settings));
  }
}
