import AsyncStorage from '@react-native-async-storage/async-storage';
import {PersistedLift, Program, WorkoutNode} from '../types/types';
import getProgram from '../data/programs/me';
import Storage from './Storage';
import LiftRepository from './LiftRepository';

export type Workout = {
  node: WorkoutNode;
  position: number;
  completed: Boolean;
};

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

    var map = await LiftRepository.getLifts(program);

    for (const wo of workouts) {
      for (let i = 0; i < wo.node.lifts.length; i++) {
        const lift = wo.node.lifts[i];

        if ('key' in lift) {
          if (map.has(lift.key)) {
            var persisted = map.get(lift.key) as PersistedLift;
            // Override saved value with source
            persisted.step = lift.step;
            wo.node.lifts[i] = persisted;
            console.log(map.get(lift.key));
          }
        }
      }
    }

    return workouts;
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
