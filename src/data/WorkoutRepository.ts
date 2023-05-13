import AsyncStorage from '@react-native-async-storage/async-storage';
import {WorkoutNode} from '../types/workout';

const key = 'workouts';

export default class WorkoutRepository {
  static async getAll(): Promise<WorkoutNode[]> {
    const value = await AsyncStorage.getItem(key);
    if (value == null) return [];

    return JSON.parse(value);
  }
}
