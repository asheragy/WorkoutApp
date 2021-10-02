import {PersistedLift, Program, WorkoutNode} from '../../types/types';
import getProgram from '../data/programs/me';
import Storage from './Storage';

export type Workout = {
  node: WorkoutNode;
  position: number;
  completed: Boolean;
};

export default class Repository {
  static async getWorkouts(): Promise<Workout[]> {
    return Storage.getLastCompletedIndex().then(completedIndex => {
      var program = getProgram();

      this.logProgram(program);
      return program.workouts.map((wo, index) => {
        return {
          node: wo,
          position: index,
          completed: completedIndex >= index,
        };
      });
    });
  }

  static async getLift(id: string): Promise<PersistedLift> {
    // If data exists it should get saved value otherwise use default in workout template
    // TODO fake data
    var lift = {
      name: 'Dumbell Bench Press',
      id: 'dbPress',
      sets: [
        {
          reps: 10,
          weight: 80,
        },
        {
          reps: 10,
          weight: 90,
        },
        {
          reps: 8,
          weight: 100,
        },
      ],
    };

    return lift;
    // If nothing found use return Promise.reject();
  }

  static async complete(index: number): Promise<boolean> {
    return Storage.complete(index);
  }

  static async undoComplete(): Promise<boolean> {
    return Storage.undoComplete();
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
