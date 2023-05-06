import AsyncStorage from '@react-native-async-storage/async-storage';
import {PersistedSet} from '../types/types';
import getProgram from '../data/programs/phase1';
import LiftRepository from './LiftRepository';
import Utils from '../components/Utils';
import { WorkoutNode } from '../types/workout';

export type Workout = {
  node: WorkoutNode;
  position: number;
  completed: Boolean;
};

const storageKey = 'completed';

export default class Repository {
  static async getWorkouts(): Promise<Workout[]> {
    const program = getProgram();

    var workouts = await this.getLastCompletedIndex().then(completedIndex => {
      return program.map((wo, index) => {
        return {
          node: wo,
          position: index,
          completed: completedIndex >= index,
        };
      });
    });

    var map = await LiftRepository.getLifts(program);

    for (const wo of workouts) {
      for (let i = 0; i < wo.node.lifts.length; i++) {
        const lift = wo.node.lifts[i];

        if (map.has(lift.def.id)) {
          var persisted = map.get(lift.def.id) as PersistedSet[];
          lift.sets = Utils.persistedToSets(persisted);
          wo.node.lifts[i] = lift;
        }
      }
    }

    return workouts;
  }

  static async complete(index: number): Promise<boolean> {
    try {
      var completed = await this.getCompletedList();
      if (completed.length != index) {
        console.log('Must complete workouts in order');
        return false;
      }

      completed.push(new Date());

      await AsyncStorage.setItem(storageKey, JSON.stringify(completed));
      return true;
    } catch (e) {}

    return false;
  }

  static async undoComplete(): Promise<boolean> {
    try {
      var completed = await this.getCompletedList();
      if (completed.length > 0) {
        completed.pop();

        await AsyncStorage.setItem(storageKey, JSON.stringify(completed));
        return true;
      }
    } catch (e) {}
    return false;
  }

  static async resetProgram(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(storageKey);
      return true;
    } catch (e) {}
    return false;
  }

  private static async getLastCompletedIndex(): Promise<number> {
    var completed = await this.getCompletedList();
    return completed.length - 1;
  }

  private static async getCompletedList(): Promise<Date[]> {
    var value = await AsyncStorage.getItem(storageKey);
    if (value == null) return [];

    var values: string[] = JSON.parse(value);
    return values.map(entry => new Date(entry));
  }
}
