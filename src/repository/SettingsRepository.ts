import AsyncStorage from '@react-native-async-storage/async-storage';
import {GlobalSettings} from '../types/types';

const SettingsKey = 'settings';

export default class SettingsRepository {
  static async get(): Promise<GlobalSettings> {
    /*
    var value = await AsyncStorage.getItem(SettingsKey);

    if (value != null) {
      var result: Settings = JSON.parse(value);
      return result;
    }

    return {};
    */

    return {
      // Not even sure if this is correct
      largestHalfPoundDumbbell: 47.5,
      plateCount: true,
    };
  }
}
