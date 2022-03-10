import AsyncStorage from '@react-native-async-storage/async-storage';
import {PersistedLift, Program, WorkoutNode} from '../../types/types';
import getProgram from '../data/programs/basic';
import Storage from './Storage';

export type Workout = {
  node: WorkoutNode;
  position: number;
  completed: Boolean;
};

const liftKeyPrefix = '@lift_';

export default class Repository {
  static async getWorkouts(): Promise<Workout[]> {
    const program = getProgram();

    var workouts = await Storage.getLastCompletedIndex().then(
      completedIndex => {
        return program.workouts.map((wo, index) => {
          return {
            node: wo,
            position: index,
            completed: completedIndex >= index,
          };
        });
      },
    );

    var map = await this.getLifts(program);

    for (const wo of workouts) {
      for (let i = 0; i < wo.node.lifts.length; i++) {
        const lift = wo.node.lifts[i];

        if ('id' in lift) {
          if (map.has(lift.id)) {
            wo.node.lifts[i] = map.get(lift.id) as PersistedLift;
            console.log(map.get(lift.id));
          }
        }
      }
    }

    return workouts;
  }

  static async getLifts(program: Program): Promise<Map<string, PersistedLift>> {
    var map = new Map<string, PersistedLift>();
    for (const wo of program.workouts) {
      for (let i = 0; i < wo.lifts.length; i++) {
        const lift = wo.lifts[i];

        if ('id' in lift) {
          if (!map.has(lift.id)) {
            var persisted = await this.getLift(lift.id);
            if (persisted != null) map.set(lift.id, persisted);
          }
        }
      }
    }

    return map;
  }

  static async getLift(id: string): Promise<PersistedLift | null> {
    var value = await AsyncStorage.getItem(liftKeyPrefix + id);
    if (value != null) return JSON.parse(value);

    return null;
  }

  static async saveLift(lift: PersistedLift): Promise<void> {
    return AsyncStorage.setItem(liftKeyPrefix + lift.id, JSON.stringify(lift));
  }

  static async complete(index: number): Promise<boolean> {
    return Storage.complete(index);
  }

  static async undoComplete(): Promise<boolean> {
    return Storage.undoComplete();
  }

  static async resetProgram(): Promise<boolean> {
    return Storage.reset();
  }

  static logProgram(program: Program) {
    //console.log(JSON.stringify(program, null, 2));

    program.workouts.forEach(wo => {
      console.log(wo.name);
      wo.lifts.forEach(lift => {
        console.log('  ' + lift.name);
        lift.sets?.forEach(set => {
          console.log('    ' + JSON.stringify(set));
        });
      });
    });
  }
}
