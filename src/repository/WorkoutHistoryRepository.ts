import AsyncStorage from '@react-native-async-storage/async-storage';
import {Workout} from '../types/workout';
import LiftHistoryRepository from './LiftHistoryRepository';

const keyPrefix = 'workoutHistory:';

export type WorkoutHistory = {
  timestamp: Date;
  liftIds: string[];
};

export default class WorkoutHistoryRepository {
  static async getHistory(key: string): Promise<WorkoutHistory[]> {
    var value = await AsyncStorage.getItem(keyPrefix + key);

    // TODO
    return [];
  }

  static async add(workout: Workout) {
    const timestamp = new Date();

    // TODO save workoutHistory

    for (var i = 0; i < workout.lifts.length; i++) {
      await LiftHistoryRepository.add(workout.lifts[i], timestamp);
    }
  }
}
