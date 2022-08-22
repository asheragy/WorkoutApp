import AsyncStorage from '@react-native-async-storage/async-storage';
import {Program, WorkoutNode} from '../types/types';
import getProgram from '../data/programs/testProgram';
import LiftRepository, {PersistedSet} from './LiftRepository';
import Utils from '../components/Utils';

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
      return program.workouts.map((wo, index) => {
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

        if (lift.persisted) {
          if (map.has(lift.def.id)) {
            var persisted = map.get(lift.def.id) as PersistedSet[];
            lift.sets = Utils.persistedToSets(persisted);
            wo.node.lifts[i] = lift;
          }
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

  static logProgram(program: Program) {
    //console.log(JSON.stringify(program, null, 2));

    program.workouts.forEach(wo => {
      console.log(wo.name);
      wo.lifts.forEach(lift => {
        console.log('  ' + lift.def.name);
        lift.sets.forEach(set => {
          console.log('    ' + JSON.stringify(set));
        });
      });
    });
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
