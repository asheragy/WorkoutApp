import AsyncStorage from '@react-native-async-storage/async-storage';
import {PersistedLift} from '../types/types';

const storageKey = '@test14';

class Storage {
  static async getLastCompletedIndex(): Promise<number> {
    //console.log('load state');
    var value = await AsyncStorage.getItem(storageKey);
    if (value != null) {
      var values = JSON.parse(value);
      //console.log('completed index = ' + (values.length - 1));
      return values.length - 1;
    } else return -1;
  }

  static async complete(index: number): Promise<boolean> {
    console.log('onComplete' + index);

    try {
      var value = await AsyncStorage.getItem(storageKey);
      var values = [];

      if (value == null && index != 0) {
        console.log('First workout must be completed first');
        return false;
      }

      if (value != null) {
        console.log('Previous value = ' + value);
        values = JSON.parse(value);
        if (values.length != index) {
          console.log('Must complete workouts in order');
          return false;
        }
      }

      values.push(new Date());

      await AsyncStorage.setItem(storageKey, JSON.stringify(values));
      //setCompletedIndex(values.length);
      return true;
    } catch (e) {}

    return false;
  }

  static async undoComplete(): Promise<boolean> {
    try {
      var value = await AsyncStorage.getItem(storageKey);
      var values = [];

      if (value != null) {
        values = JSON.parse(value);
        values.pop();

        await AsyncStorage.setItem(storageKey, JSON.stringify(values));

        return true;
      }
    } catch (e) {}
    return false;
  }

  static async reset(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(storageKey);
      return true;
    } catch (e) {}
    return false;
  }
}

export default Storage;
