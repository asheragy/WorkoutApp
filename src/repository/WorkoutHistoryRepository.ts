import AsyncStorage from '@react-native-async-storage/async-storage';
import {Workout} from '../types/workout';
import LiftHistoryRepository from './LiftHistoryRepository';

const keyPrefix = 'workoutHistory:';

export type WorkoutHistory = {
  timestamp: Date;
  liftIds: string[];
};

export default class WorkoutHistoryRepository {
  static async get(workoutId: string): Promise<WorkoutHistory[]> {
    var value = await AsyncStorage.getItem(keyPrefix + workoutId);

    if (value == null) return [];

    return JSON.parse(value, (key, value) => {
      if (key == 'timestamp') return new Date(value);

      return value;
    });
  }

  static async add(workout: Workout) {
    const timestamp = new Date();
    var key = workout.id!;
    var history = await this.get(key);

    var ids = workout.lifts.map(lift => lift.def.id);
    var entry: WorkoutHistory = {
      timestamp: timestamp,
      liftIds: Array.from(new Set(ids)),
    };

    history.push(entry);
    await AsyncStorage.setItem(keyPrefix + key, JSON.stringify(history));

    for (var i = 0; i < workout.lifts.length; i++) {
      await LiftHistoryRepository.add(workout.lifts[i], timestamp, key);
    }
  }
}
