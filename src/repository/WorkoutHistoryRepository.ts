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

  static async add(workout: Workout, defs: Record<string, LiftDef>) {
    const timestamp = new Date();
    const key = workout.id!;
    const history = await this.get(key);
    const lifts = workout.lifts.filter(
      lift => lift.sets.find(set => set.completed) != undefined,
    );

    const ids = lifts.map(lift => lift.id);
    const entry: WorkoutHistory = {
      timestamp: timestamp,
      liftIds: Array.from(new Set(ids)),
    };

    history.push(entry);
    await AsyncStorage.setItem(keyPrefix + key, JSON.stringify(history));

    for (let i = 0; i < lifts.length; i++) {
      const lift = lifts[i];
      const def = defs[lift.id];
      await LiftHistoryRepository.add(def, lift.sets, timestamp, key);
    }
  }
}
