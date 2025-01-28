import AsyncStorage from '@react-native-async-storage/async-storage';
import {GlobalSettings} from '../types/types';

const SettingsKey = 'settings';

export default class SettingsRepository {
  static async get(): Promise<GlobalSettings> {
    const value = await AsyncStorage.getItem(SettingsKey);
    let result: GlobalSettings = {};

    if (value != null) {
      result = JSON.parse(value);
    }

    result.largestHalfPoundDumbbell = 47.5;
    result.plateCount = true;
    return result;
  }

  static async set(key: keyof GlobalSettings, value: any): Promise<void> {
    const settings = await this.get();
    settings[key] = value;

    await AsyncStorage.setItem(SettingsKey, JSON.stringify(settings));
  }
}
