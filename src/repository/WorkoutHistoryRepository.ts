import AsyncStorage from '@react-native-async-storage/async-storage';
import {Workout} from '../types/workout';
import LiftHistoryRepository from './LiftHistoryRepository';
import {LiftDef} from '../types/types';

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

  static async add(workout: Workout, defs: Map<string, LiftDef>) {
    const timestamp = new Date();
    var key = workout.id!;
    var history = await this.get(key);

    var ids = workout.lifts.map(lift => lift.id);
    var entry: WorkoutHistory = {
      timestamp: timestamp,
      liftIds: Array.from(new Set(ids)),
    };

    history.push(entry);
    await AsyncStorage.setItem(keyPrefix + key, JSON.stringify(history));

    for (var i = 0; i < workout.lifts.length; i++) {
      var lift = workout.lifts[i];
      var def = defs.get(lift.id)!;
      await LiftHistoryRepository.add(def, lift.sets, timestamp, key);
    }
  }
}
